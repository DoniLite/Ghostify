import type { FC } from 'react';

export interface CVProps {
	fullName?: string;
	profile?: string;
	img?: string;
	email?: string;
	phoneNumber?: string;
	location?: string;
	birthday?: string;
	skills: string[];
	formations: { title: string; description: string; date: string }[];
	experience: {
		title: string;
		contents?: { description: string; duration: string }[];
	}[];
	interest: string[];
	languages: { title: string; level: string; css: string }[];
	readonly cvTheme: Record<string, string>;
	mode?: string;
}

const CVTemplate: FC<CVProps> = ({
	fullName,
	profile,
	img,
	email,
	phoneNumber,
	location,
	birthday,
	skills,
	formations,
	experience,
	interest,
	languages,
	cvTheme,
	mode,
}) => {
	return (
		<div
			className={`min-h-[52.6rem] w-[49.6rem] ${cvTheme.bg3} mx-auto mt-4 shadow-lg`}
		>
			<div className="grid grid-cols-[40%,60%] gap-0">
				<div
					className={`${cvTheme.bg1} ${cvTheme.text1} flex flex-col justify-center gap-y-3 p-4`}
				>
					<div className="flex w-full items-center justify-between">
						{img && (
							<img
								src={img}
								alt="profile"
								className="h-28 w-28 rounded-full object-cover"
							/>
						)}
						<h1 className="relative text-4xl font-bold">{fullName}</h1>
					</div>
					<div className={`h-[2px] w-16 ${cvTheme.bg3}`}></div>
					<div className="mt-4 flex flex-col justify-center gap-y-4 p-4">
						{[
							{ icon: 'envelopeN', text: email },
							{ icon: 'phone', text: phoneNumber },
							{ icon: 'location-dot', text: location },
							{ icon: 'calendar', text: birthday },
						].map((item) => (
							<div
								key={item.text}
								className="flex items-center gap-x-4 font-bold"
							>
								<img
									src={`/static/SVG/${item.icon}.svg`}
									className="flex h-8 w-8 rounded-full bg-white object-contain p-0.5"
									alt=""
								/>
								{item.text}
							</div>
						))}
					</div>
				</div>
				<div className={`p-8 ${cvTheme.bg2} ${cvTheme.text2}`}>
					<h1 className="mt-12 text-2xl font-bold">Profile</h1>
					<p>{profile}</p>
				</div>
			</div>
			<div className="grid grid-cols-[40%,60%] gap-0">
				<div
					className={`${cvTheme.bg2} ${cvTheme.text2} flex flex-col gap-y-3 p-4`}
				>
					<h1 className="mb-4 text-center text-2xl font-bold">Compétences</h1>
					<ul className="mb-4 ml-8 flex list-disc flex-col gap-y-4">
						{skills.map((skill) => (
							<li key={skill}>{skill}</li>
						))}
					</ul>
					<h1 className="mb-4 text-center text-2xl font-bold">Formations</h1>
					{formations.map((formation) => (
						<div key={formation.title} className="mb-2 flex flex-col gap-y-1">
							<h3 className="font-bold">{formation.title}</h3>
							<p>
								{formation.description} : {formation.date}
							</p>
						</div>
					))}
				</div>
				<div
					className={`${cvTheme.bg3} ${cvTheme.text3} flex flex-col gap-y-3 p-4`}
				>
					<h1 className="mb-4 text-center text-2xl font-bold">Expérience</h1>
					{experience.map((el) => (
						<div key={el.title} className="mb-2 flex flex-col gap-y-4">
							<h3 className="text-center text-lg font-bold">{el.title}</h3>
							{el.contents && (
								<ul className="mx-auto flex w-[90%] list-disc flex-col items-center justify-center gap-y-3">
									{el.contents.map((content) => (
										<li key={content.description} className="flex gap-x-4">
											<span>
												<span className="font-bold">- </span>
												{content.description} :
											</span>
											<span>{content.duration}</span>
										</li>
									))}
								</ul>
							)}
						</div>
					))}
					<h1 className="mb-4 text-center text-2xl font-bold">
						Centres d'intérêt
					</h1>
					<ul className="mx-auto mb-4 flex w-[70%] list-disc flex-col gap-y-4">
						{interest.map((el) => (
							<li key={el}>{el}</li>
						))}
					</ul>
					<h1 className="mb-4 text-center text-2xl font-bold">Langues</h1>
					<ul className="mx-auto mb-4 flex w-[70%] list-disc flex-col gap-y-4">
						{languages.map((language) => (
							<li key={language.title} className="flex flex-col gap-2">
								<h3 className="font-bold">{language.title}</h3>
								<div className="h-[6px] w-full rounded-lg bg-gray-300">
									<div
										className={`h-full ${cvTheme.level} rounded-lg ${language.css}`}
									></div>
								</div>
								<span>{language.level}</span>
							</li>
						))}
					</ul>
				</div>
			</div>
			{mode === 'view' && (
				<script type="module" src="/static/js/cvMode.js"></script>
			)}
		</div>
	);
};

export default CVTemplate;
