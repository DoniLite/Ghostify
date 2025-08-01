import type { FC, PropsWithChildren } from 'react';
import Card, {
	type PricingCardProps,
} from '../components/pricing/PricingCard.tsx';
import { useTranslation } from '../components/shared/TranslationContext.tsx';

const Billing = () => {
	const { t } = useTranslation();
	const billingData: PricingCardProps[] = [
		{
			title: t('billing.stater.id'),
			price: 15,
			billingPeriod: t('common.month'),
			enhanced: false,
			packStack: [...t('billing.stater.pack')],
		},
		{
			title: t('billing.pro.id'),
			price: 25,
			billingPeriod: t('common.month'),
			enhanced: true,
			packStack: [...t('billing.pro.pack')],
		},
	];
	return (
		<>
			<div className="container mx-auto mt-[6rem]">
				<BillingWrapper>
					{billingData.map((data) => (
						<Card key={data.title} {...data} />
					))}
				</BillingWrapper>
			</div>
			<section className="bg-gray-50">
				<div className="p-8 md:p-12 lg:px-16 lg:py-24">
					<div className="mx-auto max-w-lg text-center">
						<h2 className="text-2xl font-bold text-gray-900 md:text-3xl">
							Lorem, ipsum dolor sit amet consectetur adipisicing elit
						</h2>

						<p className="hidden text-gray-500 sm:mt-4 sm:block">
							Lorem ipsum dolor sit amet, consectetur adipisicing elit. Quae
							dolor officia blanditiis repellat in, vero, aperiam porro ipsum
							laboriosam consequuntur exercitationem incidunt tempora nisi?
						</p>
					</div>

					<div className="mx-auto mt-8 max-w-xl">
						<form action="#" className="sm:flex sm:gap-4">
							<div className="sm:flex-1">
								<label htmlFor="email" className="sr-only">
									Email
								</label>

								<input
									type="email"
									placeholder="Email address"
									className="w-full rounded-md border-gray-200 bg-white p-3 text-gray-700 shadow-sm transition focus:border-white focus:outline-none focus:ring focus:ring-yellow-400"
								/>
							</div>

							<button
								type="submit"
								className="group mt-4 flex w-full items-center justify-center gap-2 rounded-md bg-rose-600 px-5 py-3 text-white transition focus:outline-none focus:ring focus:ring-yellow-400 sm:mt-0 sm:w-auto"
							>
								<span className="text-sm font-medium">Sign Up</span>

								<svg
									className="size-5 rtl:rotate-180"
									xmlns="http://www.w3.org/2000/svg"
									fill="none"
									viewBox="0 0 24 24"
									stroke="currentColor"
								>
									<title>Button icon</title>
									<path
										strokeLinecap="round"
										strokeLinejoin="round"
										strokeWidth="2"
										d="M17 8l4 4m0 0l-4 4m4-4H3"
									/>
								</svg>
							</button>
						</form>
					</div>
				</div>
			</section>
		</>
	);
};

const BillingWrapper: FC<PropsWithChildren> = ({ children }) => {
	return (
		<div className="grid grid-cols-1 gap-x-3 gap-y-4 py-8 lg:grid-cols-3">
			{children}
		</div>
	);
};

export default Billing;
