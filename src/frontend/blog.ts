import 'vite/modulepreload-polyfill';

const allArticlesInthePah = document.querySelectorAll('#articleToFetch');
const allCategories = document.querySelectorAll('#categoryLoader');
const defaultContainer = document.querySelector('#defaultArticContainer');

/**
 *
 * @param {Event} e
 */
const uriReplacer = async (e: Event) => {
  e.preventDefault();
  /**
   * @type {HTMLElement}
   */
  const el = e.currentTarget as HTMLElement;
  const url = el.dataset.url;
  const id = el.dataset.id;
  if (typeof url === 'undefined') {
    const res = await fetch(`/article/get?id=${id}&api=${true}&data=url`);
    if (!res.ok) {
      const rmFetcher = await fetch(
        `/article/update?updateType=remove&id=${id}`
      );
      const rmData = await rmFetcher.json();
      console.log(rmData);
      return;
    }
    const data = await res.json();
    const newUrl = data.url;
    window.location.href = newUrl;
    return;
  }
  window.location.href = url;
};

const returnErrorComponent = (err: string) => {
  if (typeof err !== 'string') {
    return;
  }
  return `<p class=" mt-4 w-full text-center text-white font-bold">${err}</p>`;
};

/**
 *
 * @param {Event} e
 */
const categoryUpdater = async (e: {
  preventDefault: () => void;
  currentTarget: unknown;
}) => {
  e.preventDefault();
  const loader = `
    <div id="postLoader" class="justify-center w-full h-full items-center">
          <svg
            stroke="currentColor"
            fill="currentColor"
            stroke-width="0"
            viewBox="0 0 24 24"
            class="animate-spin w-12 h-12"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M12 2C17.5228 2 22 6.47715 22 12C22 17.5228 17.5228 22 12 22C6.47715 22 2 17.5228 2 12C2 6.47715 6.47715 2 12 2ZM13.6695 15.9999H10.3295L8.95053 17.8969L9.5044 19.6031C10.2897 19.8607 11.1286 20 12 20C12.8714 20 13.7103 19.8607 14.4956 19.6031L15.0485 17.8969L13.6695 15.9999ZM5.29354 10.8719L4.00222 11.8095L4 12C4 13.7297 4.54894 15.3312 5.4821 16.6397L7.39254 16.6399L8.71453 14.8199L7.68654 11.6499L5.29354 10.8719ZM18.7055 10.8719L16.3125 11.6499L15.2845 14.8199L16.6065 16.6399L18.5179 16.6397C19.4511 15.3312 20 13.7297 20 12L19.997 11.81L18.7055 10.8719ZM12 9.536L9.656 11.238L10.552 14H13.447L14.343 11.238L12 9.536ZM14.2914 4.33299L12.9995 5.27293V7.78993L15.6935 9.74693L17.9325 9.01993L18.4867 7.3168C17.467 5.90685 15.9988 4.84254 14.2914 4.33299ZM9.70757 4.33329C8.00021 4.84307 6.53216 5.90762 5.51261 7.31778L6.06653 9.01993L8.30554 9.74693L10.9995 7.78993V5.27293L9.70757 4.33329Z"
            ></path>
          </svg>
    </div>
  `;
  /**
   * @type {HTMLElement}
   */
  const el = e.currentTarget as HTMLElement;
  const category = el.dataset.category;
  const childs = defaultContainer.childNodes;
  childs.forEach((child) => {
    child.remove();
  });
  defaultContainer.insertAdjacentHTML('beforeend', loader);
  const loaderEl = defaultContainer.querySelector('#postLoader');
  const res = await fetch(`/articles/by_category?category=${category}`);
  if (!res.ok) {
    loaderEl.remove();
    defaultContainer.insertAdjacentHTML(
      'beforeend',
      returnErrorComponent(
        `Une erreur est survenue...🥲 <br> ${res.statusText}`
      )
    );
    return;
  }
  type DataRes =
    | { id: number; url: string; date: string; title: string; slug: string[] }[]
    | { error: boolean; message: string };
  const data = (await res.json()) as DataRes;
  if (!Array.isArray(data)) {
    loaderEl.remove();
    defaultContainer.insertAdjacentHTML(
      'beforeend',
      returnErrorComponent(`Une erreur est survenue...🥲 <br> ${data.message}`)
    );
    return;
  }
  loaderEl.remove();
  data.forEach((el) => {
    const component = `
        <article
            id="articleToFetch"
            data-id="${el.id}"
            data-url="${el.url}"
            class="hover:animate-background rounded-xl bg-gradient-to-r from-green-300 via-blue-500 to-purple-600 p-0.5 shadow-xl transition hover:bg-[length:400%_400%] hover:shadow-sm hover:[animation-duration:_4s] dark:shadow-gray-700/25"
        >
            <div
              class="rounded-[10px] bg-white p-4 !pt-20 sm:p-6 dark:bg-gray-900"
            >
              <time
                datetime="2022-10-10"
                class="block text-xs text-gray-500 dark:text-gray-400"
              >
                ${el.date}
              </time>

              <a href="#">
                <h3
                  class="mt-0.5 text-lg font-medium text-gray-900 dark:text-white"
                >
                  ${el.title}
                </h3>
              </a>

              <div class="mt-4 flex flex-wrap gap-1">
                ${el.slug.map((slugEl) => {
                  return `
                    <span
                        class="whitespace-nowrap rounded-full bg-purple-100 px-2.5 py-0.5 text-xs text-purple-600 dark:bg-purple-600 dark:text-purple-100"
                    >
                        ${slugEl}
                    </span>
                    `;
                }).join('')}
              </div>
            </div>
        </article>
    `;
    defaultContainer.insertAdjacentHTML('beforeend', component);
  });
};

allArticlesInthePah.forEach((article) => {
  article.addEventListener('click', uriReplacer);
});

allCategories.forEach((category) => {
  category.addEventListener('click', categoryUpdater);
});
