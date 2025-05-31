import { Check } from 'lucide-react';
import { useTranslation } from '../shared/TranslationContext.tsx'; // Assuming this path is correct
import { Button } from '../utils/button.tsx';

export interface PricingCardProps {
  title: string;
  price: number;
  billingPeriod: string;
  packStack: string[];
  enhanced?: boolean;
  callToActionHref?: string;
  onGetStartedClick?: () => void;
}

const Card = (
  {
    title,
    price,
    billingPeriod,
    packStack,
    enhanced,
    callToActionHref = '#',
    onGetStartedClick,
  }: PricingCardProps,
) => {
  const { t } = useTranslation();

  return (
    <div
      className={`
        w-full
        min-h-[45rem]
        rounded-2xl
        border
        flex-none
        self-auto
        bg-card
        p-6
        shadow-md
        shadow-card
        grid grid-rows-[auto_1fr_auto] gap-6
        ${enhanced ? 'ring-1 ring-primary border-primary' : ''}
      `}
    >
      <div className='text-center'>
        <h2 className='text-lg font-medium text-primary'>
          {title}
        </h2>

        <p className='mt-2 sm:mt-4'>
          <strong className='text-3xl font-bold text-primary sm:text-4xl'>
            ${price}
          </strong>
          <span className='text-sm font-medium text-primary'>
            /<span className='sr-only'>{t('common.per')}</span>{billingPeriod}
          </span>
        </p>
      </div>

      <ul className='space-y-4 flex flex-col justify-start'>
        {packStack.map((pack) => (
          <li key={pack} className='flex items-center gap-2'>
            <Check className='size-5 text-primary flex-shrink-0' aria-hidden="true" />
            <span className='text-foreground'>{pack}</span>
          </li>
        ))}
      </ul>

      
      {onGetStartedClick ? (
        <Button
          onClick={onGetStartedClick}
          className='w-[80%] mx-auto block rounded-full border bg-primary text-center text-sm font-medium text-primary-foreground hover:bg-primary-foreground hover:ring-1 hover:text-primary focus:outline-none focus:ring-ring active:text-primary py-3' // Added padding
        >
          {t('common.get_started')}
        </Button>
      ) : (
        <a
          href={callToActionHref}
          className='w-[80%] mx-auto block rounded-full border bg-primary text-center text-sm font-medium text-primary-foreground hover:bg-primary-foreground hover:ring-1 hover:text-primary focus:outline-none focus:ring-ring active:text-primary py-3' // Added padding
        >
          {t('common.get_started')}
        </a>
      )}
    </div>
  );
};

export default Card;