import { randomInt } from 'node:crypto';
import path from 'node:path';
import process from 'node:process';
import { format } from 'date-fns';
import type { QueryXData, RawCV } from '../@types/index.d.ts';
import { prismaClient } from '../config/db.ts';
import { factory } from '../factory.ts';
import { resumeQueue } from '../job.ts';
import { logger } from '../logger.ts';
import { contentDownloader } from '../utils/cv/downloader.ts';
import { renaming } from '../utils/file_system/helpers.ts';
import { tokenGenerator } from '../utils/security/jwt.ts';
import { resumeClasses } from '../utils/styles/classes.ts';

const cvApp = factory.createApp();

resumeQueue.process(async (job, done) => {
	try {
		const downLoaderData = await contentDownloader(job.data);
		done(null, downLoaderData);
	} catch (e) {
		done(e as Error);
	}
});

type ResumeFormFields = {
	userProfileFile?: File;
	selectedCVType?: string;
	jsonData?: string;
};

cvApp.post('/process', async (c) => {
	const STATIC_DIR = './static/cv';
	const date = new Date();
	const body = (await c.req.parseBody()) as ResumeFormFields;
	const uid = c.req.query('uid');
	let result: false | string = '';
	const session = c.get('session');

	const file = body.userProfileFile;
	if (file) {
		try {
			result = await renaming(file, path.resolve(process.cwd(), STATIC_DIR));
			if (result === false) {
				logger.error(`new error on the file renaming`, c.req.url);
				return c.json({ message: 'Error while renaming CV file' });
			}
		} catch (e) {
			console.error(e);
			logger.error(`new error on the file renaming`, c.req.url, e);
			return c.json({ message: 'Error while processing CV file' });
		}
	}
	console.log('file : ' + file);
	console.log(result);
	const cvType = body.selectedCVType ?? '';
	const fileXPath =
		process.env.NODE_ENV === 'production'
			? `https://ghostify.site/staticFile/` +
				(await tokenGenerator({
					url: `cv/${result}`,
				}))
			: `http://localhost:3085/staticFile/` +
				(await tokenGenerator({
					url: `cv/${result}`,
				}));
	const data = JSON.parse(body.jsonData ?? '') as RawCV;
	session.set('CVData', {
		...data,
		img: fileXPath,
		cvType,
	});
	if (uid) {
		let docId: number = 0;
		let updating: boolean = false;
		try {
			const cvUpdating = await prismaClient.cV.update({
				where: {
					uid,
				},
				data: {
					metaData: JSON.stringify(data),
					img: fileXPath,
				},
			});
			const cvDoc = await prismaClient.document.findFirst({
				where: {
					downloadLink: cvUpdating.pdf,
				},
			});
			if (cvDoc) {
				docId = cvDoc.id;
				updating = true;
			}
			console.log('user updated successfully:', cvUpdating.metaData);
			const cvJob = await resumeQueue.add(
				{ url: cvUpdating.url!, id: cvUpdating.id, docId, updating },
				{
					attempts: 5,
				},
			);
			session.set('JobsIDs', {
				...session.get('JobsIDs'),
				cvJob: cvJob.id,
			});
			return c.json({ success: true, redirect: `${cvUpdating.url}?mode=view` });
		} catch (e) {
			console.error(e);
			return c.json({ message: 'Error during update', data: data });
		}
	}
	if (session?.get('Auth')?.authenticated) {
		const checkIfUserHavePoints = await prismaClient.user.findUnique({
			where: {
				id: session.get('Auth')!.id,
			},
			select: {
				cvCredits: true,
			},
		});
		if (checkIfUserHavePoints!.cvCredits < 100) {
			return c.json({
				message: 'Not enough credits for CV creation',
				redirect:
					process.env.NODE_ENV === 'production'
						? 'https://ghostify.site/billing/'
						: 'http://localhost:3085/billing/',
			});
		}
		const uid = await tokenGenerator({
			url: (date.getTime() + randomInt(1000)).toString(),
		});
		const newCV = await prismaClient.cV.create({
			data: {
				metaData: JSON.stringify(data),
				userId: session.get('Auth')?.id,
				img: file ? fileXPath : null,
				uid: uid,
				url:
					process.env.NODE_ENV === 'production'
						? `https://ghostify.site/cv/${uid}`
						: `http://localhost:3085/cv/${uid}`,
			},
		});
		if (newCV) {
			const updateUserPoints = await prismaClient.user.update({
				where: {
					id: session.get('Auth')!.id,
				},
				data: {
					cvCredits: {
						decrement: 100,
					},
				},
			});
			console.log('user rest points:', updateUserPoints.cvCredits);
		}
		const cvJob = await resumeQueue.add(
			{ url: newCV.url!, id: newCV.id },
			{
				attempts: 5,
			},
		);
		session.set('JobsIDs', {
			...session.get('JobsIDs'),
			cvJob: cvJob.id,
		});
		return c.json({ success: true, redirect: `${newCV.url}?mode=view` });
	}
	session.set('RedirectUrl', '/cv/job');
	return c.redirect('/auth/login');
});

cvApp.get('/load/:cv', async (c) => {
	const cv = c.req.param('cv');
	const { mode, api } = c.req.query() as QueryXData<{
		mode: string;
		api: string;
	}>;
	// req.app.emit('downloader');
	try {
		const cvData = await prismaClient.cV.findUnique({
			where: {
				uid: cv,
			},
			include: {
				user: true,
			},
		});
		if (!cvData) {
			return c.text('this document is not found');
		}
		console.log('cvData: ', cvData);
		const cvType = cvData.type ? Number(cvData.type) : 1;
		const cvMode = cvData.mode ? Number(cvData.mode) : 1;
		const cvTheme =
			resumeClasses[`v${cvType as 1 | 2 | 3}`][
				`mode${cvMode as 1 | 2 | 3 | 4 | 5}`
			];
		const data = JSON.parse(cvData.metaData) as RawCV;
		const cvDate = new Date(data.birthday);
		const cvObject: {
			img?: string;
			fullName?: string;
			email?: string;
			phoneNumber?: string;
			location?: string;
			birthday?: string;
			profile?: string;
			skills: string[];
			formations: { title: string; description: string; date: string }[];
			experience: {
				title: string;
				contents: { description: string; duration: string }[];
			}[];
			interest: string[];
			languages: {
				title: string;
				css: 'w-[30%]' | 'w-[60%]' | 'w-full';
				level: string;
			}[];
			css?: unknown;
		} = {
			skills: [],
			formations: [],
			experience: [],
			interest: [],
			languages: [],
		};
		cvObject.img = cvData.img ?? '';
		cvObject.fullName = data.name;
		cvObject.email = data.email;
		cvObject.phoneNumber = data.phone;
		cvObject.location = data.address;
		cvObject.birthday =
			api && api === 'true'
				? format(cvDate, 'yyyy-MM-dd')
				: format(cvDate, 'dd /MM/yyyy');
		cvObject.profile = data.profile;
		cvObject.skills = data.skills;
		cvObject.formations = data.formations.map((formation) => ({
			title: formation.formation,
			description: formation.certificate,
			date: formation.certificationDate,
		}));
		cvObject.experience = data.experiences.map((experience) => ({
			title: experience.experience,
			contents: experience.details.map((detail) => ({
				description: detail.task,
				duration: detail.taskDate,
			})),
		}));
		cvObject.interest = data.interest;
		cvObject.languages = data.languages.map((language) => ({
			title: language.lang,
			css:
				language.level === 'basique'
					? 'w-[30%]'
					: language.level === 'intermédiaire'
						? 'w-[60%]'
						: 'w-full',
			level: language.level,
		}));
		if (api && api === 'true') {
			return c.json(cvObject);
		}

		const props = {
			...cvObject,
			mode,
			cvTheme,
		};
		return c.json(props);
	} catch (err) {
		console.error(err);
		return c.json({ success: false });
	}
});

cvApp.get('/status', async (c) => {
	const { uid } = c.req.query() as QueryXData<{ uid: string }>;
	const session = c.get('session');
	if (session.get('JobsIDs')) {
		const jobId = session.get('JobsIDs')!.cvJob;
		const cvJob = await resumeQueue.getJob(jobId!);
		const status = await cvJob?.getState();
		if (status === 'completed') {
			const cvData = await prismaClient.cV.findUnique({
				where: {
					id: cvJob?.data.id,
				},
				select: {
					screenshot: true,
					pdf: true,
				},
			});
			return c.json({
				success: true,
				img: cvData?.screenshot,
				doc: cvData?.pdf,
			});
		}
		if (status === 'failed') {
			await cvJob?.retry();
			return c.json({
				success: false,
				message: "we have any problem getting your files let' try again",
			});
		}

		if (status === 'active' || status === 'waiting') {
			return c.json({
				success: false,
				message:
					'your CV is being processed, you will get notified once it is ready',
			});
		}
		return c.json({
			success: false,
			message: 'your data are processing please wait',
		});
	}
	try {
		const tryingToGetResource = await prismaClient.cV.findUnique({
			where: {
				uid: uid,
			},
			select: {
				screenshot: true,
				pdf: true,
			},
		});
		console.log(uid);
		console.log(tryingToGetResource);
		if (tryingToGetResource?.pdf && tryingToGetResource?.screenshot) {
			return c.json({
				success: true,
				doc: tryingToGetResource.pdf,
				img: tryingToGetResource.screenshot,
			});
		}
		return c.json({ success: false, error: true });
	} catch (e) {
		console.error(e);
		logger.error(``, e);
		return c.json({ success: false, error: true });
	}
});

cvApp.get('/theme/:uid', async (c) => {
	const uid = c.req.param('uid');
	const { set, data } = c.req.query() as QueryXData<{
		set: string;
		data: string;
	}>;
	const session = c.get('session');
	try {
		const theme = await prismaClient.cV.findUnique({
			where: {
				uid,
			},
		});
		if (set && data && set === 'true') {
			let docId: number = 0;
			let updating: boolean = false;
			const [type, mode] = data.split(';');
			const updatingTheme = await prismaClient.cV.update({
				where: {
					uid,
				},
				data: {
					type: type,
					mode: mode,
				},
			});
			const doc = await prismaClient.document.findFirst({
				where: {
					downloadLink: updatingTheme.pdf,
				},
			});
			if (doc) {
				docId = doc.id;
				updating = true;
			}
			const newCVJob = await resumeQueue.add({
				url: updatingTheme.url ?? '',
				id: updatingTheme.id,
				docId,
				updating,
			});
			session.set('JobsIDs', {
				...session.get('JobsIDs'),
				cvJob: newCVJob.id,
			});
			console.log(
				'theme updated successfully : ',
				updatingTheme.type,
				updatingTheme.mode,
			);
			c.status(200);
			return c.json({ success: true });
		}
		c.status(200);
		return c.json({
			type: theme?.type || 1,
			mode: theme?.mode || 1,
		});
	} catch (e) {
		console.error(e);
		c.status(400);
		return c.json({ success: false });
	}
});

cvApp.get('/job', async (c) => {
	const date = new Date();
	const session = c.get('session');
	if (!session?.get('Auth')?.authenticated) {
		c.status(403);
		return c.text("You're not authenticated");
	}

	if (!session.get('CVData')) {
		c.status(404);
		return c.text('No CV found');
	}
	const uid = await tokenGenerator({
		uid: (date.getTime() + randomInt(1000)).toString(),
	});
	const newCV = await prismaClient.cV.create({
		data: {
			userId: session?.get('Auth')?.id,
			metaData: JSON.stringify(session.get('CVData')),
			img: session.get('CVData')?.img,
			uid,
			url: `${Deno.env.get('APP_HOST')}/load/${uid}`,
		},
	});
	if (newCV) {
		const updateUserPoints = await prismaClient.user.update({
			where: {
				id: session.get('Auth')!.id,
			},
			data: {
				cvCredits: {
					decrement: 100,
				},
			},
		});
		console.log('user rest points:', updateUserPoints.cvCredits);
	}
	const resumeJob = await resumeQueue.add(
		{ url: newCV.url!, id: newCV.id },
		{
			attempts: 5,
		},
	);
	session.set('JobsIDs', {
		...session.get('JobsIDs'),
		cvJob: resumeJob.id,
	});
	return c.redirect(`${newCV.url}?mode=view`);
});

export default cvApp;
