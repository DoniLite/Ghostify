import { useContext } from 'react';
import { SeoContext } from './SEO.ts';
import { useLocation } from 'react-router-dom';

export interface MetaProps {
  title?: string;
  desc?: string;
  preview?: string;
  icon?: string;
  [key: string]: string | undefined;
}

const Meta = () => {
  const { title, desc, preview, icon, ...rest } = useContext(SeoContext).getSeo(useLocation().pathname) ?? {}
  return (
    <>
      <title>{title || 'Ghostify - A multi-service platform'}</title>
      <meta name='twitter:title' content={title || 'Ghostify'} />
      <meta property='og:title' content={title || 'Ghostify'} />

      <meta
        name='description'
        content={desc ||
          "Ghostify est une plateforme multi-service de création d'articles, de CV et de conversion de documents. | Ghostify is a multi-service platform for creating articles, resumes and document conversion"}
      />
      <meta
        property='og:description'
        content={desc ||
          "Ghostify est une plateforme multi-service de création d'articles, de CV et de conversion de documents. | Ghostify is a multi-service platform for creating articles, resumes and document conversion"}
      />
      <meta
        name='twitter:description'
        content={desc ||
          "Ghostify est une plateforme multi-service de création d'articles, de CV et de conversion de documents. | Ghostify is a multi-service platform for creating articles, resumes and document conversion"}
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

      <link rel='alternate' href='https://ghostiy.site?lang=fr' hrefLang='fr' />
      {Object.entries(rest).map(([metaName, value]) => {
        // If the metaName starts with 'og:' or 'twitter:', use 'property', else use 'name'
        if (metaName.startsWith('og:') || metaName.startsWith('twitter:')) {
          return (
            <meta property={metaName} content={value} key={metaName} />
          );
        }
        // return (
        //   <meta name={metaName} content={value} key={metaName} />
        // );
        //     <meta
        //       key={metaName}
        //       property={metaName.split(':')[1]}
        //       content={value}
        //     />
        //   );
        // }
        return (
          <meta
            key={metaName}
            name={metaName}
            content={value}
          />
        );
      })}
    </>
  );
};

export default Meta;
