export type Props = {
  linear?: string;
  from?: string;
  to?: string;
  text: string;
  bg?: string;
  title: string;
  theme: { footer: string };
};

const Footer = ({ linear, from, to, text, bg, title, theme }: Props) => {
  return (
    <div
      className={`w-full overflow-y-scroll h-full ${linear || bg || ''} ${
        linear ? `${from} ${to}` : ''
      } ${text} lg:grid lg:grid-cols-5`}
    >
      <div className='relative block h-32 lg:col-span-2 lg:h-full'>
        <img
          src={theme.footer}
          alt='Footer image'
          className='absolute inset-0 h-full w-full object-cover'
        />
      </div>

      <div className='px-4 py-16 sm:px-6 lg:col-span-3 lg:px-8'>
        <div className='grid grid-cols-1 gap-8 sm:grid-cols-2'>
          <div>
            <p>
              <a
                target='_blank'
                rel='noreferrer'
                href='https://github.com/DoniLite'
                className={`block text-2xl font-medium ${title} hover:opacity-75 sm:text-3xl`}
              >
                Ghostify.
              </a>
            </p>

            <div className={`mt-8 space-y-1 text-sm ${text}`}>
              <h1>Souscris à la newsletter!</h1>
              <form
                id='newsLetter'
                className='flex lg:gap-x-4 lg:flex-row flex-col gap-y-3'
              >
                <input
                  type='text'
                  name='newsletter'
                  id='newsletter'
                  className={`outline-none p-1 bg-transparent border-b-2 border-white ${title}`}
                  placeholder="Passez nous votre mail et on s'occupe du reste"
                />
                <button
                  type='submit'
                  title='Send it!'
                  className={`p-2 ${title} transition-all hover:${
                    bg || linear
                  } border font-bold flex justify-center items-center rounded-full`}
                >
                  <i className='fa-solid fa-rocket hover:text-red-900 transition-all text-white self-end'></i>
                </button>
              </form>
            </div>

            <ul className={`mt-8 flex gap-6 ${text}`}>
              <li>
                <a
                  href='https://www.facebook.com/doni.lite.3?mibextid=ZbWKwL'
                  rel='noreferrer'
                  target='_blank'
                  className={`${text} transition hover:opacity-75`}
                >
                  <span className='sr-only'>Facebook</span>
                  <svg
                    className='h-6 w-6'
                    fill='currentColor'
                    viewBox='0 0 24 24'
                    aria-hidden='true'
                  >
                    <path
                      fillRule='evenodd'
                      d='M22 12c0-5.523-4.477-10-10-10S2 6.477 2 12c0 4.991 3.657 9.128 8.438 9.878v-6.987h-2.54V12h2.54V9.797c0-2.506 1.492-3.89 3.777-3.89 1.094 0 2.238.195 2.238.195v2.46h-1.26c-1.243 0-1.63.771-1.63 1.562V12h2.773l-.443 2.89h-2.33v6.988C18.343 21.128 22 16.991 22 12z'
                      clipRule='evenodd'
                    />
                  </svg>
                </a>
              </li>

              <li>
                <a
                  href='#'
                  rel='noreferrer'
                  target='_blank'
                  class='<%= text %> transition hover:opacity-75'
                >
                  <span class='sr-only'>Instagram</span>

                  <svg
                    class='h-6 w-6'
                    fill='currentColor'
                    viewBox='0 0 24 24'
                    aria-hidden='true'
                  >
                    <path
                      fill-rule='evenodd'
                      d='M12.315 2c2.43 0 2.784.013 3.808.06 1.064.049 1.791.218 2.427.465a4.902 4.902 0 011.772 1.153 4.902 4.902 0 011.153 1.772c.247.636.416 1.363.465 2.427.048 1.067.06 1.407.06 4.123v.08c0 2.643-.012 2.987-.06 4.043-.049 1.064-.218 1.791-.465 2.427a4.902 4.902 0 01-1.153 1.772 4.902 4.902 0 01-1.772 1.153c-.636.247-1.363.416-2.427.465-1.067.048-1.407.06-4.123.06h-.08c-2.643 0-2.987-.012-4.043-.06-1.064-.049-1.791-.218-2.427-.465a4.902 4.902 0 01-1.772-1.153 4.902 4.902 0 01-1.153-1.772c-.247-.636-.416-1.363-.465-2.427-.047-1.024-.06-1.379-.06-3.808v-.63c0-2.43.013-2.784.06-3.808.049-1.064.218-1.791.465-2.427a4.902 4.902 0 011.153-1.772A4.902 4.902 0 015.45 2.525c.636-.247 1.363-.416 2.427-.465C8.901 2.013 9.256 2 11.685 2h.63zm-.081 1.802h-.468c-2.456 0-2.784.011-3.807.058-.975.045-1.504.207-1.857.344-.467.182-.8.398-1.15.748-.35.35-.566.683-.748 1.15-.137.353-.3.882-.344 1.857-.047 1.023-.058 1.351-.058 3.807v.468c0 2.456.011 2.784.058 3.807.045.975.207 1.504.344 1.857.182.466.399.8.748 1.15.35.35.683.566 1.15.748.353.137.882.3 1.857.344 1.054.048 1.37.058 4.041.058h.08c2.597 0 2.917-.01 3.96-.058.976-.045 1.505-.207 1.858-.344.466-.182.8-.398 1.15-.748.35-.35.566-.683.748-1.15.137-.353.3-.882.344-1.857.048-1.055.058-1.37.058-4.041v-.08c0-2.597-.01-2.917-.058-3.96-.045-.976-.207-1.505-.344-1.858a3.097 3.097 0 00-.748-1.15 3.098 3.098 0 00-1.15-.748c-.353-.137-.882-.3-1.857-.344-1.023-.047-1.351-.058-3.807-.058zM12 6.865a5.135 5.135 0 110 10.27 5.135 5.135 0 010-10.27zm0 1.802a3.333 3.333 0 100 6.666 3.333 3.333 0 000-6.666zm5.338-3.205a1.2 1.2 0 110 2.4 1.2 1.2 0 010-2.4z'
                      clip-rule='evenodd'
                    />
                  </svg>
                </a>
              </li>

              <li>
                <a
                  href='#'
                  rel='noreferrer'
                  target='_blank'
                  class='<%= text %> transition hover:opacity-75'
                >
                  <span class='sr-only'>X</span>

                  <svg
                    class='h-6 w-6'
                    fill='currentColor'
                    viewBox='0 0 512 512'
                    aria-hidden='true'
                  >
                    <path
                      fill-rule='evenodd'
                      d='M389.2 48h70.6L305.6 224.2 487 464H345L233.7 318.6 106.5 464H35.8L200.7 275.5 26.8 48H172.4L272.9 180.9 389.2 48zM364.4 421.8h39.1L151.1 88h-42L364.4 421.8z'
                      clip-rule='evenodd'
                    />
                  </svg>
                </a>
              </li>

              <li>
                <a
                  href='https://github.com/DoniLite'
                  rel='noreferrer'
                  target='_blank'
                  class='<%= text %> transition hover:opacity-75'
                >
                  <span class='sr-only'>GitHub</span>

                  <svg
                    class='h-6 w-6'
                    fill='currentColor'
                    viewBox='0 0 24 24'
                    aria-hidden='true'
                  >
                    <path
                      fill-rule='evenodd'
                      d='M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z'
                      clip-rule='evenodd'
                    />
                  </svg>
                </a>
              </li>

              <li>
                <a
                  href='https://www.linkedin.com/in/yao-messan-nogb%C3%A9dzi-3b3696239/'
                  rel='noreferrer'
                  target='_blank'
                  class='<%= text %> transition hover:opacity-75'
                >
                  <span class='sr-only'>Linkedin</span>

                  <svg
                    class='h-6 w-6'
                    fill='currentColor'
                    viewBox='0 0 448 512'
                    aria-hidden='true'
                  >
                    <path
                      fill-rule='evenodd'
                      d='M100.28 448H7.4V148.9h92.88zM53.79 108.1C24.09 108.1 0 83.5 0 53.8a53.79 53.79 0 0 1 107.58 0c0 29.7-24.1 54.3-53.79 54.3zM447.9 448h-92.68V302.4c0-34.7-.7-79.2-48.29-79.2-48.29 0-55.69 37.7-55.69 76.7V448h-92.78V148.9h89.08v40.8h1.3c12.4-23.5 42.69-48.3 87.88-48.3 94 0 111.28 61.9 111.28 142.3V448z'
                      clip-rule='evenodd'
                    />
                  </svg>
                </a>
              </li>
            </ul>
          </div>

          <div class='grid grid-cols-1 gap-4 sm:grid-cols-2'>
            <div>
              <p class={`font-medium ${title}`}>Services</p>

              <ul class={`mt-6 space-y-4 text-sm ${text}`}>
                <li>
                  <a
                    href='/poster/new?service=blog'
                    class='transition hover:opacity-75'
                  >
                    Poster for blog and documents parsing
                  </a>
                </li>

                <li>
                  <a href='#searcher' class='transition hover:opacity-75'>
                    Try the basic web search
                  </a>
                </li>

                <li>
                  <a
                    href='/home?pagination=4'
                    class='transition hover:opacity-75'
                  >
                    Gaming & Testing
                  </a>
                </li>

                <li>
                  <a href='#' class='transition hover:opacity-75'>
                    Marketing & Data-analyzes support
                  </a>
                </li>

                <li>
                  <a href='#' class='transition hover:opacity-75'>
                    Web Dev {'>'} backend & front & security & smart net
                  </a>
                </li>
              </ul>
            </div>

            <div>
              <p class='font-medium <%= title %>'>Help & Support Contact</p>

              <ul class='mt-6 space-y-4 text-sm <%= text %>'>
                <li>
                  <a href='#' class='transition hover:opacity-75'>
                    About
                  </a>
                </li>

                <li>
                  <a href='/FAQ' class='transition hover:opacity-75'>
                    FAQ
                  </a>
                </li>

                <li>
                  <a
                    href='/home?pagination=5'
                    class='transition hover:opacity-75'
                  >
                    Contact
                  </a>
                </li>
              </ul>
            </div>
          </div>
        </div>

        <div class='mt-12 border-t border-gray-100 pt-12'>
          <div class='sm:flex sm:items-center sm:justify-between'>
            <ul class='flex flex-wrap gap-4 text-xs'>
              <li>
                <a href='/terms' class={`${text} transition hover:opacity-75`}>
                  Terms & Conditions
                </a>
              </li>

              <li>
                <a
                  href='/privacy'
                  class={`${text} transition hover:opacity-75`}
                >
                  Privacy Policy
                </a>
              </li>

              <li>
                <a
                  href='/conditions'
                  class={`${text} transition hover:opacity-75`}
                >
                  Conditions of use
                </a>
              </li>
            </ul>

            <p class={`mt-8 text-xs ${text} sm:mt-0`}>
              &copy; 2024. Ghostify. All rights reserved.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Footer;
