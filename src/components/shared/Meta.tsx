import {FC} from 'hono/jsx';

export interface MetaProps {
  title?: string;
  desc?: string;
  preview?: string;
  icon?: string;
}

const Meta: FC<MetaProps> = ({ title, desc, preview, icon }) => {
  return (
    <>
      <title>{title || 'Ghostify - A multi-service platform'}</title>
      <meta name='twitter:title' content={title || 'Ghostify'} />
      <meta property='og:title' content={title || 'Ghostify'} />

      <meta
        name='description'
        content={
          desc ||
          "Ghostify est une plateforme multi-service de création d'articles, de CV et de conversion de documents. | Ghostify is a multi-service platform for creating articles, resumes and document conversion"
        }
      />
      <meta
        property='og:description'
        content={
          desc ||
          "Ghostify est une plateforme multi-service de création d'articles, de CV et de conversion de documents. | Ghostify is a multi-service platform for creating articles, resumes and document conversion"
        }
      />
      <meta
        name='twitter:description'
        content={
          desc ||
          "Ghostify est une plateforme multi-service de création d'articles, de CV et de conversion de documents. | Ghostify is a multi-service platform for creating articles, resumes and document conversion"
        }
      />

      <meta charSet='UTF-8' />
      <meta name='viewport' content='width=device-width, initial-scale=1.0' />
      <meta property='og:type' content='website' />
      <meta property='og:url' content='https://ghostiy.site/' />

      <meta
        name='twitter:card'
        content={preview || '/static/screen/screen1.png'}
      />
      <meta
        name='twitter:image'
        content={preview || '/static/screen/screen1.png'}
      />
      <meta
        property='og:image'
        content={preview || '/static/screen/screen1.png'}
      />

      <link
        rel='icon'
        type='image/x-icon'
        href={icon || '/static/SVG/ghost.svg'}
      />
      <meta name='robots' content='index, follow' />
      <link rel='canonical' href='https://ghostiy.site/' />

      <link rel='alternate' href='https://ghostiy.site?lang=fr' hreflang='fr' />
    </>
  );
};

export default Meta;
