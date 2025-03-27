export const Button = ({link, content, elClass, type}: {
  link?: string;
  content: string;
  elClass?: string;
  type?: `button` | `submit` | `reset`
}) => {
    if(link) return (
      <a
        href={link}
        class={`${elClass} font-bold py-2 px-4 rounded-lg text-center`}
      >{content}</a>
    );
    return (
        <button type={type ?? 'button'} class={`rounded-lg text-center ${elClass}`}>{content}</button>
    )
};
