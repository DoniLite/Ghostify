import { Check } from 'lucide-react';
import { useTranslation } from '../shared/TranslationContext'; // Assuming this path is correct
import { Button } from '../utils/button';

export interface PricingCardProps {
	title: string;
	price: number;
	billingPeriod: string;
	packStack: string[];
	enhanced?: boolean;
	callToActionHref?: string;
	onGetStartedClick?: () => void;
}

const Card = ({
	title,
	price,
	billingPeriod,
	packStack,
	enhanced,
	callToActionHref = '#',
	onGetStartedClick,
}: PricingCardProps) => {
	const { t } = useTranslation();

	return (
		<div
			className={`bg-card shadow-card grid min-h-[45rem] w-full flex-none grid-rows-[auto_1fr_auto] gap-6 self-auto rounded-2xl border p-6 shadow-md ${enhanced ? 'ring-primary border-primary ring-1' : ''} `}
		>
			<div className="text-center">
				<h2 className="text-primary text-lg font-medium">{title}</h2>

				<p className="mt-2 sm:mt-4">
					<strong className="text-primary text-3xl font-bold sm:text-4xl">
						${price}
					</strong>
					<span className="text-primary text-sm font-medium">
						/<span className="sr-only">{t('common.per')}</span>
						{billingPeriod}
					</span>
				</p>
			</div>

			<ul className="flex flex-col justify-start space-y-4">
				{packStack.map((pack) => (
					<li key={pack} className="flex items-center gap-2">
						<Check
							className="text-primary size-5 flex-shrink-0"
							aria-hidden="true"
						/>
						<span className="text-foreground">{pack}</span>
					</li>
				))}
			</ul>

			{onGetStartedClick ? (
				<Button
					onClick={onGetStartedClick}
					className="bg-primary text-primary-foreground hover:bg-primary-foreground hover:text-primary focus:ring-ring active:text-primary mx-auto block w-[80%] rounded-full border py-3 text-center text-sm font-medium hover:ring-1 focus:outline-none" // Added padding
				>
					{t('common.get_started')}
				</Button>
			) : (
				<a
					href={callToActionHref}
					className="bg-primary text-primary-foreground hover:bg-primary-foreground hover:text-primary focus:ring-ring active:text-primary mx-auto block w-[80%] rounded-full border py-3 text-center text-sm font-medium hover:ring-1 focus:outline-none" // Added padding
				>
					{t('common.get_started')}
				</a>
			)}
		</div>
	);
};

export default Card;
