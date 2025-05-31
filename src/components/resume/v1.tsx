import { FC } from 'react';


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
      className={`w-[49.6rem] min-h-[52.6rem] ${cvTheme.bg3} shadow-lg mx-auto mt-4`}
    >
      <div className='grid grid-cols-[40%,60%] gap-0'>
        <div
          className={`${cvTheme.bg1} ${cvTheme.text1} p-4 flex flex-col gap-y-3 justify-center`}
        >
          <div className='flex w-full justify-between items-center'>
            {img && (
              <img
                src={img}
                alt='profile'
                className='w-28 h-28 rounded-full object-cover'
              />
            )}
            <h1 className='text-4xl font-bold relative'>{fullName}</h1>
          </div>
          <div className={`w-16 h-[2px] ${cvTheme.bg3}`}></div>
          <div className='mt-4 flex flex-col justify-center gap-y-4 p-4'>
            {[
              { icon: 'envelopeN', text: email },
              { icon: 'phone', text: phoneNumber },
              { icon: 'location-dot', text: location },
              { icon: 'calendar', text: birthday },
            ].map((item, idx) => (
              <div key={idx} className='flex gap-x-4 items-center font-bold'>
                <img
                  src={`/static/SVG/${item.icon}.svg`}
                  className='w-8 h-8 p-0.5 object-contain bg-white rounded-full flex'
                  alt=''
                />
                {item.text}
              </div>
            ))}
          </div>
        </div>
        <div className={`p-8 ${cvTheme.bg2} ${cvTheme.text2}`}>
          <h1 className='text-2xl font-bold mt-12'>Profile</h1>
          <p>{profile}</p>
        </div>
      </div>
      <div className='grid grid-cols-[40%,60%] gap-0'>
        <div
          className={`${cvTheme.bg2} ${cvTheme.text2} p-4 flex flex-col gap-y-3`}
        >
          <h1 className='text-2xl font-bold mb-4 text-center'>Compétences</h1>
          <ul className='list-disc flex flex-col ml-8 gap-y-4 mb-4'>
            {skills.map((skill, idx) => (
              <li key={idx}>{skill}</li>
            ))}
          </ul>
          <h1 className='text-2xl font-bold mb-4 text-center'>Formations</h1>
          {formations.map((formation, idx) => (
            <div key={idx} className='flex flex-col gap-y-1 mb-2'>
              <h3 className='font-bold'>{formation.title}</h3>
              <p>
                {formation.description} : {formation.date}
              </p>
            </div>
          ))}
        </div>
        <div
          className={`${cvTheme.bg3} ${cvTheme.text3} p-4 flex flex-col gap-y-3`}
        >
          <h1 className='text-2xl font-bold mb-4 text-center'>Expérience</h1>
          {experience.map((el, idx) => (
            <div key={idx} className='flex flex-col gap-y-4 mb-2'>
              <h3 className='text-center text-lg font-bold'>{el.title}</h3>
              {el.contents && (
                <ul className='flex flex-col justify-center list-disc items-center w-[90%] mx-auto gap-y-3'>
                  {el.contents.map((content, subIdx) => (
                    <li key={subIdx} className='flex gap-x-4'>
                      <span>
                        <span className='font-bold'>- </span>
                        {content.description} :
                      </span>
                      <span>{content.duration}</span>
                    </li>
                  ))}
                </ul>
              )}
            </div>
          ))}
          <h1 className='text-2xl font-bold mb-4 text-center'>
            Centres d'intérêt
          </h1>
          <ul className='list-disc flex flex-col mx-auto w-[70%] gap-y-4 mb-4'>
            {interest.map((el, idx) => (
              <li key={idx}>{el}</li>
            ))}
          </ul>
          <h1 className='text-2xl font-bold mb-4 text-center'>Langues</h1>
          <ul className='list-disc flex flex-col mx-auto w-[70%] gap-y-4 mb-4'>
            {languages.map((language, idx) => (
              <li key={idx} className='flex flex-col gap-2'>
                <h3 className='font-bold'>{language.title}</h3>
                <div className='w-full h-[6px] rounded-lg bg-gray-300'>
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
        <script type='module' src='/static/js/cvMode.js'></script>
      )}
    </div>
  );
};

export default CVTemplate;
