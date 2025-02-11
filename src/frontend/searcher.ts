import 'vite/modulepreload-polyfill';

/**
 * @type {HTMLInputElement}
 */
const searchInput: HTMLInputElement = document.querySelector('#PrimarySearch');
const containerParser = document.querySelector('#containerPaser');
const loader = document.querySelector('#searchLoader');

const urlIcon = `<svg fill="#f1f1f1" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512" class="h-4 w-4"><!--! Font Awesome Free 6.5.1 by @fontawesome - https://fontawesome.com License - https://fontawesome.com/license/free (Icons: CC BY 4.0, Fonts: SIL OFL 1.1, Code: MIT License) Copyright 2023 Fonticons, Inc. --><path d="M352 256c0 22.2-1.2 43.6-3.3 64H163.3c-2.2-20.4-3.3-41.8-3.3-64s1.2-43.6 3.3-64H348.7c2.2 20.4 3.3 41.8 3.3 64zm28.8-64H503.9c5.3 20.5 8.1 41.9 8.1 64s-2.8 43.5-8.1 64H380.8c2.1-20.6 3.2-42 3.2-64s-1.1-43.4-3.2-64zm112.6-32H376.7c-10-63.9-29.8-117.4-55.3-151.6c78.3 20.7 142 77.5 171.9 151.6zm-149.1 0H167.7c6.1-36.4 15.5-68.6 27-94.7c10.5-23.6 22.2-40.7 33.5-51.5C239.4 3.2 248.7 0 256 0s16.6 3.2 27.8 13.8c11.3 10.8 23 27.9 33.5 51.5c11.6 26 20.9 58.2 27 94.7zm-209 0H18.6C48.6 85.9 112.2 29.1 190.6 8.4C165.1 42.6 145.3 96.1 135.3 160zM8.1 192H131.2c-2.1 20.6-3.2 42-3.2 64s1.1 43.4 3.2 64H8.1C2.8 299.5 0 278.1 0 256s2.8-43.5 8.1-64zM194.7 446.6c-11.6-26-20.9-58.2-27-94.6H344.3c-6.1 36.4-15.5 68.6-27 94.6c-10.5 23.6-22.2 40.7-33.5 51.5C272.6 508.8 263.3 512 256 512s-16.6-3.2-27.8-13.8c-11.3-10.8-23-27.9-33.5-51.5zM135.3 352c10 63.9 29.8 117.4 55.3 151.6C112.2 482.9 48.6 426.1 18.6 352H135.3zm358.1 0c-30 74.1-93.6 130.9-171.9 151.6c25.5-34.2 45.2-87.7 55.3-151.6H493.4z"/></svg>`;

const postAndCommentsIcon = `<svg fill="#f1f1f1" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 576 512" class="h-4 w-4"><!--! Font Awesome Free 6.5.1 by @fontawesome - https://fontawesome.com License - https://fontawesome.com/license/free (Icons: CC BY 4.0, Fonts: SIL OFL 1.1, Code: MIT License) Copyright 2023 Fonticons, Inc. --><path d="M0 64C0 28.7 28.7 0 64 0H224V128c0 17.7 14.3 32 32 32H384V299.6l-94.7 94.7c-8.2 8.2-14 18.5-16.8 29.7l-15 60.1c-2.3 9.4-1.8 19 1.4 27.8H64c-35.3 0-64-28.7-64-64V64zm384 64H256V0L384 128zM549.8 235.7l14.4 14.4c15.6 15.6 15.6 40.9 0 56.6l-29.4 29.4-71-71 29.4-29.4c15.6-15.6 40.9-15.6 56.6 0zM311.9 417L441.1 287.8l71 71L382.9 487.9c-4.1 4.1-9.2 7-14.9 8.4l-60.1 15c-5.5 1.4-11.2-.2-15.2-4.2s-5.6-9.7-4.2-15.2l15-60.1c1.4-5.6 4.3-10.8 8.4-14.9z"/></svg>`;

/**
 *
 * @param {Record<string, unknown>} data
 */
const componentConstructor = (data: Record<string, unknown>) => {
  if (
    typeof data['url'] === 'string' &&
    typeof data['title'] !== 'string' &&
    typeof data['visit'] === 'number'
  ) {
    return `<div class="w-full flex gap-x-2 items-center">
          ${urlIcon}
          <a href="${data.url}" class="text-sm w-full"
            >${data.url}</a
          >
        </div>`;
  }
  if (typeof data['title'] === 'string') {
    return `<div class="w-full flex gap-x-2 items-center">
          ${postAndCommentsIcon}
          <a href="${
            typeof data.url !== 'string'
              ? typeof data.uid !== 'string'
                ? data.link
                : `page/${data.uid}`
              : data.url
          }" class="text-sm w-full"
            >${data.title}</a
          >
        </div>`;
  }
  if (typeof data['content'] === 'string') {
    return `<div class="w-full flex gap-x-2 items-center">
          ${postAndCommentsIcon}
          <a href="${
            typeof data.url !== 'string'
              ? typeof data.uid !== 'string'
                ? data.link
                : `page/${data.uid}`
              : data.url
          }" class="text-sm line-clamp-1"
            >${data.content}</a
          >
        </div>`;
  }
  return ``;
};
// console.log(searchInput);

/**
 *
 * @param {Event} e
 */
const sendKeysToServer = async (e: Event) => {
  e.preventDefault();
  containerParser.childNodes.forEach((node) =>
    node.textContent !== loader.textContent ? node.remove() : 0
  );
  containerParser.classList.remove('hidden');
  containerParser.classList.add('flex');
  console.log('click on search');
  loader.classList.remove('hidden');
  loader.classList.add('flex');
  if (searchInput.value.trim().length <= 0) {
    containerParser.classList.add('hidden');
  }
  /**
   * @type {HTMLInputElement}
   */
  const el = e.currentTarget as HTMLInputElement;
  const value = el.value;
  console.log(value);
  const res = await fetch(`/find?q=${value}`);
  if (!res.ok) {
    loader.classList.remove('flex');
    loader.classList.add('hidden');
    const errorComponent = `<div class=" text-red-600 font-bold text-center">Une erreur s'est produite</div>`;
    containerParser.insertAdjacentHTML('beforeend', errorComponent);
    return;
  }
  /**
   * @type {{data: Record<string, unknown>[]}}
   */
  const result: { data: Record<string, unknown>[]; } = await res.json();
  console.log(result);
  loader.classList.remove('flex');
  loader.classList.add('hidden');
  if (result.data.length > 0) {
    result.data.forEach((el) => {
      console.log('container parser', containerParser);
      console.log('component', componentConstructor(el));
      containerParser.insertAdjacentHTML('beforeend', componentConstructor(el));
    });
    return;
  }
};
searchInput.onkeyup = sendKeysToServer;
// searchInput.addEventListener('click', sendKeysToServer)
