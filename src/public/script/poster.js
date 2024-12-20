/* eslint-disable no-undef */

const actionBtn = document.querySelector('#action');
const abortBtn = document.querySelector('#abortBtn');
const actionComponent = document.querySelector('#actionComponent');
/**
 * @type {Element}
 */
const posterForm = document.querySelector('#posterForm');
const requestSectionBtn = document.querySelector('#requestSetionBtn');
const requestListBtn = document.querySelector('#requestList');
// const sectionRemoveBtn = document.querySelector('#sectionRemoveBtn');
// const listRemoveBtn = document.querySelector('#listRemoveBtn');
const requestFileBtn = document.querySelector('#requestFile');
// const listAddBtn = document.querySelectorAll('#listAdd');
// const form = new FormData(posterForm);
const data = {
  title: '',
  desc_or_meta: '',
  section: [],
  /**
   * @type {Array<{img: Blob, index: Number, section: Number}}
   */
  image: [],
  list: [],
};
/**
 * @type {HTMLInputElement}
 */
const sessionIndex = document.querySelector('#sessionIndex');
const rawHeaderNav = document.querySelector('#rawHeaderNav');
const NavCloserBtn = document.querySelector('#NavCloserBtn');
const rawHeadIcon = document.querySelector('#rawHeadIcon');
const viewIcon = document.querySelector('#viewRequester');
// const posterComponent = document.querySelector('#posterComponent');
let storage = localStorage.getItem('poster_storage');
if (storage !== undefined || storage !== null) {
  storage = JSON.parse(storage);
}

/**
 *
 * @param {MouseEvent} e
 */
const requesterFunc = async (e) => {
  e.preventDefault();

  const uri = new URL(window.location.href);
  const uid = uri.pathname.split('/').pop();

  data.title = getTitleAndMeta().title;
  data.desc_or_meta = getTitleAndMeta().meta;
  data.section = getSections();
  data.list = getList();
  data.image = await getImg();

  const form = new FormData(posterForm);

  form.delete('file');

  data.image.forEach((img, index) => {
    form.append('file', img.img, `image_${img.section}_${img.index}`);
  });

  form.append('json', true);
  form.append('data', JSON.stringify(data));

  // Log de chaque champ pour vérifier son contenu
  for (let [key, value] of form.entries()) {
    if (value instanceof Blob) {
      console.log(`${key}: Blob, size=${value.size}, type=${value.type}`);
    } else {
      console.log(`${key}: ${value}`);
    }
  }

  // const res =
  //   typeof uri.searchParams.get('mode') === 'string' &&
  //   uri.searchParams.get('mode') === 'hydrate'
  //     ? await fetch(`/poster/save?mode=hydrate&uidPost=${uid}`, {
  //         method: 'POST',
  //         body: form,
  //       })
  //     : await fetch('/poster/save', {
  //         method: 'POST',
  //         body: form,
  //       });

  // const dataRes = await res.json();
  // console.log(dataRes);
  // if (dataRes.success) {
  //   window.location.href = `/poster/view?post=${dataRes.article}`;
  // }
};

// const allSections = [
//   ...posterComponent.querySelectorAll(),
//   ...posterComponent.querySelectorAll(),
// ];

NavCloserBtn.addEventListener('click', (e) => {
  e.preventDefault();
  rawHeaderNav.classList.add('translate-x-[200%]');
});

rawHeadIcon.addEventListener('click', (e) => {
  e.preventDefault();
  rawHeaderNav.classList.remove('translate-x-[200%]');
});

const getList = () => {
  const uri = new URL(window.location.href);
  /**
   * Function to verify if a section is equal to a list
   * @param {Number} list The list index
   * @param {Number} section The section index
   * @returns {boolean}
   */
  const verifySectionWithList = (list, section) => {
    if (uri.searchParams.get('mode') === 'hydrate') {
      return list === section;
    }
    return list + 1 === section;
  };
  let listObjParent = {};
  getSections().forEach((section, id) => {
    listObjParent[`${id + 1}`] = [];
    const els = posterForm.querySelectorAll('#list');
    els.forEach((el) => {
      const sectionIndex = Number(
        el.querySelector('.lst-component').getAttribute('id')
      );
      if (id + 1 === sectionIndex) {
        let list = [];
        el.querySelectorAll('.vl-parent').forEach((e) => {
          list.push({
            item: e.querySelector('input').value,
            description: e.querySelector('textarea').value,
            index: Number(e.dataset.index),
            section: sectionIndex,
          });
        });
        listObjParent[`${id + 1}`].push({
          index: Number(el.dataset.index),
          items: list,
        });
      }
    });
  });
  return listObjParent;
};

const getSections = () => {
  const section = [];
  const form = new FormData(posterForm);
  const sectionElement = form.getAll('section');
  const sectionContent = form.getAll('content');
  sectionElement.forEach((sec, id) => {
    section.push({
      index: id + 1,
      title: sec,
      content: sectionContent[id],
    });
  });
  return section;
};

const getTitleAndMeta = () => {
  const form = new FormData(posterForm);
  const title = form.get('documentTitle');
  const meta = form.get('posterHeader');
  return {
    title,
    meta,
  };
};

/**
 * Fetches an image from the given URL and returns it as a Blob object.
 *
 * @param {string} url - The URL of the image to fetch.
 * @returns {Promise<Blob>} A promise that resolves to the image Blob.
 */
const getIMGBlobFromServer = async (url) => {
  const response = await fetch(url);
  return await response.blob();
};

/**
 * @description
 * This function will take all the images that has been uploaded and convert them
 * into a list of objects containing the image blob, the section index and the image index.
 *
 * @returns {Promise<Array<{img: Blob, index: Number, section: Number}>>}
 */
const getImg = async () => {
  const imgs = document.querySelectorAll('#imageView');

  const imgPromises = Array.from(imgs).map(async (img, id) => {
    const sectionId = Number(img.querySelector('img').getAttribute('id'));
    let imgFile;

    // Récupérer le fichier depuis l'input file ou depuis l'URL
    const fileInput = document.querySelector(`input[id="file_${id + 1}"]`);
    console.log('inputs all ', fileInput);
    const imgElement = img.querySelector('img');
    console.log(img.dataset.url);
    console.log(fileInput.files[0]);

    if (img.dataset.url) {
      // Si un fichier a été sélectionné via l'input
      imgFile = await getIMGBlobFromServer(img.dataset.url);
    } else if (fileInput && fileInput.files.length > 0) {
      // Si une URL est présente, télécharger l'image
      imgFile = fileInput.files[0];
    } else {
      // Aucune image trouvée
      return null;
    }

    return {
      img: imgFile,
      index: parseInt(img.dataset.index),
      section: sectionId,
    };
  });

  // Filtrer les entrées nulles
  const results = await Promise.all(imgPromises);
  return results.filter((item) => item !== null);
};

/**
 *
 * @param {MouseEvent} e
 */
const hideComponent = (e) => {
  e.preventDefault();
  actionComponent.classList.add('poster-hidden');
};
/**
 *
 * @param {MouseEvent} e
 */
const showComponent = (e) => {
  e.preventDefault();
  actionComponent.classList.remove('poster-hidden');
};

/**
 * @description
 * On appelle cette fonction lorqu'un utilisateur clique sur le bouton "Ajouter une section"
 * Elle permet de demander le HTML d'une nouvelle section au serveur et de la rajouter à la fin du formulaire.
 * Si la requête se passe mal, on affiche un message d'erreur.
 *
 * @param {Event | {
        index: number;
        title: string;
        content: string;
        header: boolean;
        meta: string;
    }} e
 * @returns {void}
 */
export const requestNewSection = async (e) => {
  // On essaie de niquer complètement le navigateur...
  if (e instanceof Event) {
    e.preventDefault();
  }
  console.log(getList(), await getImg(), getSections());
  const form = new FormData(posterForm);

  for (let [key, value] of form.entries()) {
    console.log(key, value);
  }
  // On récupère l'index de la dernière section
  const lastElIndex =
    e instanceof Event ? posterForm.lastElementChild.dataset.index : null;
  // On récupère l'index de la section actuelle
  const index = e instanceof Event ? Number(sessionIndex.value) : null;
  // On construit la requête
  const result =
    e instanceof Event
      ? await fetch(`/components/poster?section=${index}&index=${lastElIndex}`)
      : await fetch(
          `/components/poster?section=${e.index}&index=${null}&title=${
            e.title
          }&content=${e.content}`
        );
  // Si la requête se passe mal, on affiche un message d'erreur
  if (!result.ok) {
    posterForm.insertAdjacentHTML(
      'beforeend',
      `<div class=" text-red-500 font-bold text-center">
            Oups une erreurs'est produite
            ${result.statusText}
      </div>
      `
    );
    return;
  }
  // On récupère le HTML de la nouvelle section
  const component = await result.text();
  // On l'ajoute à la fin du formulaire
  posterForm.insertAdjacentHTML('beforeend', component);
  // On ajoute un listener sur le bouton de suppression de section
  const sectionRemovBtn = posterForm.querySelectorAll('#sectionRemoveBtn');
  sectionRemovBtn.forEach((btn) => {
    btn.addEventListener('click', sectionSelfRemove);
  });
  // On incrémente l'index de la section actuelle
  sessionIndex.setAttribute('value', String(parseInt(sessionIndex.value) + 1));
};

/**
 *
 * @param {Event | {
        index: number;
        description: string;
        postId: number;
        filePath: string;
        sectionId: number;
    }} e
 */
const requestFile = async (e) => {
  if (e instanceof Event) {
    e.preventDefault();
  }
  const index = document.querySelectorAll('input[name="file"]').length;
  console.log(index);
  const sectionIndex = Number(sessionIndex.value);
  const inputFile = posterForm.querySelector(`#file_${index}`);
  /**
   *
   * @param {Event} e
   */
  inputFile.onchange = (e) => {
    let file = e.currentTarget.files[0];
    const lastElementIndex =
      Number(posterForm.lastElementChild.dataset.index) + 1;
    if (file) {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onloadend = () => {
        const component = `
                <div data-index="${lastElementIndex}" id="imageView" class=" lg:w-5/6 w-11/12 mx-auto p-1 h-auto justify-center items-center bg-gray-950 rounded-lg py-6 my-5">
                    <div class=" w-full p-3 flex justify-between items-center">
                        <input
                          type="text"
                          id="imgDesc"
                          placeholder="Une description de l'image"
                          class="lg:w-9/12 w-10/12 bg-transparent p-2 text-white font-bold"
                        />
                        <div id="imgRemoveBtn">
                          <i
                            class="fa-solid fa-square-xmark fa-xl font-bold text-white hover:cursor-pointer"
                          ></i>
                        </div>
                    </div>
                    <img src="${reader.result}" alt="" id="${sectionIndex}" class=" w-full object-cover h-full">
                </div>
                `;
        posterForm.insertAdjacentHTML('beforeend', component);
        const newImput = `<input type="file" name="file" class="hidden" id="file_${
          index + 1
        }" />`;
        posterForm.insertAdjacentHTML('afterbegin', newImput);
        posterForm.querySelectorAll('#imgRemoveBtn').forEach((el) => {
          el.addEventListener('click', imgSelfRemove);
        });
      };
    }
  };

  if (e instanceof Event) {
    inputFile.click();
  } else {
    const component = `
                <div data-index="${e.postId}" data-url="${e.filePath}" id="imageView" class=" lg:w-5/6 w-11/12 mx-auto p-1 h-auto justify-center items-center bg-gray-950 rounded-lg py-6 my-5">
                    <div class=" w-full p-3 flex justify-between items-center">
                        <input
                          type="text"
                          id="imgDesc"
                          placeholder="Une description de l'image"
                          class="lg:w-9/12 w-10/12 bg-transparent p-2 text-white font-bold"
                        />
                        <div id="imgRemoveBtn">
                          <i
                            class="fa-solid fa-square-xmark fa-xl font-bold text-white hover:cursor-pointer"
                          ></i>
                        </div>
                    </div>
                    <img src="${e.filePath}" alt="" id="${e.index}" class=" w-full object-cover h-full">
                </div>
                `;
    posterForm.insertAdjacentHTML('beforeend', component);
    const newImput = `<input type="file" name="file" class="hidden" id="file_${e.index + 1}" />`;
    posterForm.insertAdjacentHTML('afterbegin', newImput);
    posterForm.querySelectorAll('#imgRemoveBtn').forEach((el) => {
      el.addEventListener('click', imgSelfRemove);
    });
  }
};

/**
 *
 * @param {Event |  {
    index: number;
    items: {
        item: string;
        description: string;
        index: number;
        section: number;
    }[];
}} e
 */
const requestNewList = async (e) => {
  if (e instanceof Event) {
    e.preventDefault();
    const index = Number(sessionIndex.value);
    /**
     * @type {HTMLElement}
     */
    const lastChild = posterForm.lastElementChild;
    const lastId = lastChild.dataset.index;
    if (lastChild.getAttribute('id') !== 'list') {
      const res = await fetch(
        `/components/list?section=${index}&index=${lastId}`
      );
      const component = await res.text();
      posterForm.insertAdjacentHTML('beforeend', component);
      posterForm.querySelectorAll('#listAdd').forEach((el) => {
        el.addEventListener('click', addListItem);
      });
      return;
    }
    window.alert(
      `vous ne pouvez pas ajouter une nouvelle list à la suite d'une autre`
    );
  } else {
    const data = encodeURIComponent(JSON.stringify(e.items));
    const res = await fetch(
      `/components/list?section=${e.items.section}&index=${e.index}&data=${data}`
    );
    const component = await res.text();
    posterForm.insertAdjacentHTML('beforeend', component);
    posterForm.querySelectorAll('#listAdd').forEach((el) => {
      el.addEventListener('click', addListItem);
    });
    return;
  }
  //  const component = `<div class=" text-red-600 font-bold"></div>`
};

/**
 *
 * @param {Event} e
 */
const addListItem = (e) => {
  e.preventDefault();
  /**
   * @type {EventTarget}
   */
  const el = e.currentTarget;
  const firstParent = el.parentElement;
  /**
   * @type {HTMLElement}
   */
  const lastParent = firstParent.parentElement;
  const icr =
    Number(
      lastParent.querySelector('.lst-component').lastElementChild.dataset.index
    ) + 1;
  const listItemComponent = `
  <div
      data-index="${icr}"
      class="vl-parent flex justify-between w-full items-center mt-4 lg:p-3 p-2"
    >
      <div class="w-4 h-4 rounded-full bg-white hidden lg:block"></div>
      <div class="flex flex-col gap-y-3 lg:w-9/12 w-[90%]">
        <input
          type="text"
          id="listElement"
          placeholder="Element"
          class=" bg-transparent p-2 text-white font-bold w-full"
        />
        <textarea
          id="listElementContent"
          placeholder="Description..."
          class="text-gray-950 w-full max-sm:mx-auto p-2 lg:h-24 h-20 placeholder:text-gray-950 rounded-sm"
        ></textarea>
      </div>
      <div id="listRemoveBtn">
        <i
          class="fa-solid fa-square-xmark fa-xl font-bold text-white hover:cursor-pointer"
        ></i>
      </div>
    </div>
`;
  lastParent
    .querySelector('.lst-component')
    .insertAdjacentHTML('beforeend', listItemComponent);
  /**
   * @type {Element[]}
   */
  lastParent
    .querySelector('.lst-component')
    .querySelectorAll('#listRemoveBtn')
    .forEach((el) => {
      el.addEventListener('click', removeItemList);
    });
};

/**
 *
 * @param {Event} e
 */
const removeItemList = (e) => {
  e.preventDefault();
  const el = e.currentTarget;
  /**
   * @type {Element}
   */
  const parent = el.parentElement;
  const secondParent = parent.parentElement;
  const thirdParent = secondParent.parentElement;
  const elList = thirdParent.querySelectorAll('.vl-parent');
  if (elList.length <= 1) {
    thirdParent.remove();
    return;
  }
  parent.remove();
};

/**
 *
 * @param {Event} e
 */
const sectionSelfRemove = (e) => {
  e.preventDefault();
  const index = Number(sessionIndex.value);
  const el = e.currentTarget;
  const parent = el.parentElement;
  const secondParent = parent.parentElement;
  const thirdParent = secondParent.parentElement;
  if (Number(secondParent.getAttribute('id')) <= index - 1) {
    window.alert('vous ne pouvez pas supprimer cette section');
    return;
  }
  sessionIndex.value = index - 1;
  thirdParent.remove();
};

/**
 *
 * @param {Event} e
 */
const imgSelfRemove = (e) => {
  e.preventDefault();
  const el = e.currentTarget;
  const parent = el.parentElement;
  const secondParent = parent.parentElement;
  secondParent.remove();
};

const hydrateComponent = async () => {
  const url = new URL(window.location.href);
  const query = url.searchParams;
  if (query.get('mode') === 'hydrate') {
    const res = await fetch(`/poster/load/${query.get('uid')}`);
    /**
     * @type {{
     * head: {
        title: string;
        meta: string;
    };
     * sections: {
        index: number;
        title: string;
        content: string;
        header: boolean;
        meta: string;
    }[];
    files: {
        index: number;
        description: string;
        postId: number;
        filePath: string;
        sectionId: number;
    }[];
    lists: Record<string, [{
    index: number;
    items: {
        item: string;
        description: string;
        index: number;
        section: number;
    }[];
}]>
    }}
     */
    const data = await res.json();
    console.log(data);
    await fillHead(data.head);
    for (const section of data.sections) {
      if (section.header) {
        continue;
      }
      const assets = [
        ...data.files.filter((file) => file.sectionId === section.index),
        ...data.lists[section.index],
      ].sort((a, b) => a.index - b.index);
      await requestNewSection(section);
      for (const asset of assets) {
        if (asset.items) {
          await requestNewList(asset);
        } else {
          await requestFile(asset);
        }
      }
    }
  }
};

/**
 * Function to restore data into form
 * @param {{
        index: number;
        title: string;
        content: string;
        header: boolean;
        meta: string;
    }} data
 */
const fillHead = async (data) => {
  const res = await fetch(
    `/components/head/?section=${data.index}&title=${data.title}&meta=${data.meta}`
  );
  const component = await res.text();
  posterForm.insertAdjacentHTML('beforeend', component);
};

/**
 *
 * @param {Event} e
 */
const abortEventHandler = (e) => {
  e.preventDefault();
  const userId = document.querySelector('#userIdInput').value;
  window.location.href = `/service?userId=${userId}&service=poster`;
};

/**
 *
 * @param {Event} e
 */
actionBtn.onclick = (e) => {
  e.preventDefault();
  actionComponent.classList.toggle('poster-hidden');
};
abortBtn.addEventListener('click', abortEventHandler);
actionBtn.addEventListener('mouseenter', showComponent);
actionBtn.addEventListener('mouseleave', hideComponent);
actionComponent.addEventListener('mouseenter', showComponent);
actionComponent.addEventListener('mouseleave', hideComponent);
requestSectionBtn.addEventListener('click', requestNewSection);
requestListBtn.addEventListener('click', requestNewList);
requestFileBtn.addEventListener('click', requestFile);
viewIcon.addEventListener('click', requesterFunc);
document
  .querySelector('#saveDocument')
  .addEventListener('click', requesterFunc);
window.onload = hydrateComponent;
