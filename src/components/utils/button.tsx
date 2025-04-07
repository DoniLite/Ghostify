export const Button = ({link, content, elClass, type}: {
  link?: string;
  content: string;
  elClass?: string;
  type?: `button` | `submit` | `reset`
}) => {
    if(link) return (
      <a
        href={link}
        class={`${elClass} font-bold rounded-lg text-center`}
      >{content}</a>
    );
    return (
        <button type={type ?? 'button'} class={`font-bold rounded-lg text-center ${elClass}`}>{content}</button>
    )
};
