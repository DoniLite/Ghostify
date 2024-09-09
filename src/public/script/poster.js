/* eslint-disable no-undef */


const rawHeaderNav = document.querySelector('#rawHeaderNav');
const NavCloserBtn = document.querySelector('#NavCloserBtn');
const rawHeadIcon = document.querySelector('#rawHeadIcon');
const posterComponent = document.querySelector('#posterComponent');
let storage = localStorage.getItem('poster_storage');
if (storage !== undefined || storage !== null) {
  storage = JSON.parse(storage);
}

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

/**
 *
 * @param {Element[]} els
 */
const getList = (els) => {};

const loadList = () => {
  const list = document.querySelectorAll('.lst-component');
  const dataList = {};
  list.forEach((component) => {
    component.querySelectorAll('.vl-parent').forEach((child) => {
      dataList[component.getAttribute('id')] = [
        {
          index: parseInt(child.getAttribute('id')),
          el: child.querySelector('#listElement').value,
        },
      ];
    });
  });
  return dataList;
};

const loadSection = () => {
  const section = [];
  const form = new FormData(posterForm);
  const sectionElement = form.getAll('section');
  const sectionContent = form.getAll('content');
  sectionElement.forEach((sec, id) => {
    section.push({
      id: id,
      title: sec,
      content: sectionContent[id],
    });
  });
  return section;
};

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
  content: [],
};
/**
 * @type {HTMLInputElement}
 */
const sessionIndex = document.querySelector('#sessionIndex');
/**
 *
 * @param {MouseEvent} e
 */
const hideComponent = (e) => {
  console.log('Hiding component');
  e.preventDefault();
  actionComponent.classList.add('poster-hidden');
};
/**
 *
 * @param {MouseEvent} e
 */
const showComponent = (e) => {
  console.log('showComponent', e);
  e.preventDefault();
  actionComponent.classList.remove('poster-hidden');
};

/**
 *
 * @param {Event} e
 */
const requestNewSection = async (e) => {
  e.preventDefault();
  let form = new FormData(posterForm);
  data.title = form.get('documentTitle');
  data.desc_or_meta = form.get('posterHeader');
  data.section = form.getAll('section');
  data.list = form.getAll('list');
  console.log(data);
  const index = Number(sessionIndex.value);
  const result = await fetch(`/components/poster?section=${index}`);
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
  const index = sessionIndex.value;
  const inputFile = posterForm.querySelector(`#file_${index}`);
  /**
   *
   * @param {Event} e
   */
  inputFile.onchange = (e) => {
    let file = e.currentTarget.files[0];
    console.log(file);
    lastElementIndex = posterForm.data.index
    if (file) {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onloadend = () => {
        const component = `
                <div data-index="" id="imageView" class=" lg:w-5/6 w-11/12 mx-auto p-1 lg:max-h-48 max-h-32 justify-center items-center bg-gray-950 rounded-lg py-6 my-5">
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
                    <img src="${reader.result}" alt="" id="${index}" class=" w-full object-contain">
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
  const lastChild = posterForm.lastElementChild;
  if (lastChild.getAttribute('id') !== 'list') {
    const res = await fetch(`/components/list?section=${index}`);
    const component = await res.text();
    posterForm.insertAdjacentHTML('beforeend', component);
    const el = posterForm.querySelector('#listAdd');
    el.addEventListener('click', addListItem);
    console.log(true);
    return;
  }
  //  const component = `<div class=" text-red-600 font-bold"></div>`
  window.alert(
    `vous ne pouvez pas ajouter une nouvelle list à la suite d'une autre`
  );
  console.log(false);
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
  const lastParent = firstParent.parentElement;
  const icr =
    Number(
      lastParent
        .querySelector('.lst-component')
        .lastElementChild.getAttribute('id')
    ) + 1;
  const listItemComponent = `
  <div class="vl-parent flex gap-x-4 w-11/12 items-center mt-4">
    <div id="${icr}" class="w-4 h-4 rounded-full bg-white"></div>
      <input
        type="text"
        id="listElement"
        placeholder="Element"
        class="lg:w-9/12 w-11/12 bg-transparent p-2 text-white font-bold"
      />
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
  console.log(el);
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
