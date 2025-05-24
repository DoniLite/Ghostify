type LinkClassProps = {
  isActive: boolean;
  isPending: boolean;
  isTransitioning: boolean;
};

export const linkClass = (
  { isActive, isPending, isTransitioning }: LinkClassProps,
) => {
  const defaultClass = 'hover:text-primary transition-colors font-nunito';
  return isActive
    ? `${defaultClass} text-primary`
    : isPending
    ? `${defaultClass} text-muted-foreground`
    : isTransitioning
    ? `${defaultClass} text-secondary-foreground`
    : `${defaultClass} text-foreground`;
};
