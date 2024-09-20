/* eslint-disable no-undef */

const actionBtn = document.querySelector('#action');
const actionComponent = document.querySelector('#actionComponent');
/**
 * @type {Element}
 */
const posterForm = document.querySelector('#posterForm');
const requestSetionBtn = document.querySelector('#requestSetionBtn');
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

  data.title = getTitleAndMeta().title;
  data.desc_or_meta = getTitleAndMeta().meta;
  data.section = getSections();
  data.list = getList();
  data.image = getImg();

  const form = new FormData(posterForm);

  form.append('json', true);
  form.append('data', JSON.stringify(data));

  // Log de chaque champ pour vérifier son contenu
  for (let pair of form.entries()) {
    console.log(pair[0] + ', ' + pair[1]);
  }

  const res = await fetch('/poster/save', {
    method: 'POST',
    body: form,
  });

  const dataRes = await res.json();
  console.log(dataRes)
  if (dataRes.success) {
    window.location.href = `/poster/view?post=${dataRes.article}`;
  }
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

const getImg = () => {
  const imgs = document.querySelectorAll('#imageView');
  const form = new FormData(posterForm);
  const imgFiles = form.getAll('file');
  let imgList = [];
  imgs.forEach((img, id) => {
    const sectionId = Number(img.querySelector('img').getAttribute('id'));
    imgList.push({
      img: imgFiles[id],
      index: parseInt(img.dataset.index),
      section: sectionId,
    });
  });
  return imgList;
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
 *
 * @param {Event} e
 */
const requestNewSection = async (e) => {
  e.preventDefault();
  console.log(getList(), getSections(), getImg(), getTitleAndMeta());
  const lastElIndex = posterForm.lastElementChild.dataset.index;
  const index = Number(sessionIndex.value);
  const result = await fetch(
    `/components/poster?section=${index}&index=${lastElIndex}`
  );
  if (!result.ok) {
    posterForm.appendChild(
      `<div class=" text-red-500 font-bold text-center">
            Oups une erreurs'est produite
            ${result.statusText}
      </div>
      `
    );
    return;
  }

  const component = await result.text();
  posterForm.insertAdjacentHTML('beforeend', component);
  const sectionRemovBtn = posterForm.querySelectorAll('#sectionRemoveBtn');
  sectionRemovBtn.forEach((btn) => {
    btn.addEventListener('click', sectionSelfRemove);
  });
  sessionIndex.setAttribute('value', String(parseInt(sessionIndex.value) + 1));
};

/**
 *
 * @param {Event} e
 */
const requestFile = async (e) => {
  e.preventDefault();
  const index = document.querySelectorAll('input[name="file"]').length;
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
                <div data-index="${lastElementIndex}" id="imageView" class=" lg:w-5/6 w-11/12 mx-auto p-1 lg:max-h-48 max-h-32 justify-center items-center bg-gray-950 rounded-lg py-6 my-5">
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
                    <img src="${reader.result}" alt="" id="${sectionIndex}" class=" w-full object-contain">
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
  inputFile.click();
};

/**
 *
 * @param {Event} e
 */
const requestNewList = async (e) => {
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
  //  const component = `<div class=" text-red-600 font-bold"></div>`
  window.alert(
    `vous ne pouvez pas ajouter une nouvelle list à la suite d'une autre`
  );
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

/**
 *
 * @param {Event} e
 */
actionBtn.onclick = (e) => {
  e.preventDefault();
  actionComponent.classList.toggle('poster-hidden');
};
actionBtn.addEventListener('mouseenter', showComponent);
actionBtn.addEventListener('mouseleave', hideComponent);
actionComponent.addEventListener('mouseenter', showComponent);
actionComponent.addEventListener('mouseleave', hideComponent);
requestSetionBtn.addEventListener('click', requestNewSection);
requestListBtn.addEventListener('click', requestNewList);
requestFileBtn.addEventListener('click', requestFile);
viewIcon.addEventListener('click', requesterFunc);
