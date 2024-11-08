/* eslint-disable no-undef */

/**
 * @type {HTMLElement}
 */
const parentElement = document.querySelector('#parentCVForm');
const trueSelectedCv = document.querySelector('#ActiveSelection');
const btns = document.querySelectorAll('#move');
document.querySelectorAll('input[type="image"]').forEach((el) => {
  el.addEventListener('click', (e) => {
    e.preventDefault();
    document
      .querySelectorAll('input[type="image"]')
      .forEach((el) => el.classList.remove('border-4', 'border-orange-500'));
    e.currentTarget.classList.toggle('border-4');
    e.currentTarget.classList.toggle('border-orange-500');
    trueSelectedCv.value = e.currentTarget.value;
    console.log(trueSelectedCv.value);
  });
});

document.querySelectorAll('#back').forEach((btn) => {
  btn.addEventListener('click', (e) => {
    e.preventDefault();
    if (e.currentTarget.parentElement.getAttribute('id') === 'first') {
      parentElement.style.transform = 'translateX(0)';
      return;
    }
    const trans = (
      Number(e.currentTarget.parentElement.dataset.translate) - 200
    ).toString();
    console.log(trans);
    parentElement.style.transform = `translateX(-${trans}%)`;
  });
});

/**
 *
 * @param {MouseEvent} e
 */
const moveFunc = (e) => {
  e.preventDefault();
  parentElement.style.transform = `translateX(-${e.currentTarget.parentElement.dataset.translate}%)`;
};

btns.forEach((btn) => {
  btn.addEventListener('click', moveFunc);
});

/**
 *
 * @param {Event} e
 */
export const removeItemList = (e) => {
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
    return;
  }
  parent.remove();
};

/**
 *
 * @param {Event} e
 */
export const addListItem = (e) => {
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
  const listItemComponent = `
          <div
            data-index="1"
            class="vl-parent flex gap-x-4 w-11/12 items-center mt-4"
          >
            <div class="w-4 h-4 hidden lg:block rounded-full bg-white"></div>
            <input
              type="text"
              name="skill"
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
export const removeFormation = (e) => {
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
    return;
  }
  parent.remove();
};

/**
 *
 * @param {MouseEvent} e
 */
export const addFormation = (e) => {
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
  const listItemComponent = `
          <div
            data-index="1"
            class="vl-parent flex gap-x-4 w-full items-center mt-4"
          >
            <div class="w-4 h-4 hidden lg:block rounded-full bg-white"></div>
            <div class="w-full lg:grid lg:grid-cols-2 flex flex-col gap-y-3">
              <input
                type="text"
                name="formation"
                id="formationInput"
                placeholder="Institut de formation"
                class="lg:w-9/12 w-11/12 bg-transparent p-2 text-white font-bold"
              />
              <input
                type="text"
                name="certificate"
                id="certificateInput"
                placeholder="diplôme"
                class="lg:w-9/12 w-11/12 bg-transparent p-2 text-white font-bold"
              />
              <input
                type="text"
                name="certificationDate"
                id="certificationDateInput"
                placeholder="période d'obtention"
                class="lg:w-9/12 w-11/12 bg-transparent p-2 text-white font-bold"
              />
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
      el.addEventListener('click', removeFormation);
    });

  lastParent
    .querySelector('.lst-component')
    .querySelectorAll('#formationInput')
    .forEach((el) => {
      el.addEventListener('change', formationTrigger);
    });
};

/**
 *
 * @param {MouseEvent} e
 */
const addTask = (e) => {
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
  const inputNumber = lastParent.querySelectorAll('#taskInput').length;
  const mainInputValue =
    lastParent.parentElement.querySelector('#experienceInput').value;
  lastParent.parentElement
    .querySelector('#experienceInput')
    .setAttribute(
      'data-group',
      `${
        Number(
          lastParent.parentElement.querySelector('#experienceInput').dataset
            .group
        ) + 1
      }`
    );
  const listItemComponent = `
          <div
            data-index="1"
            class="vl-parent flex gap-x-4 w-full items-center mt-4"
          >
            <div id="addTask">
              <i
                class="fa-regular fa-square-plus fa-xl text-white hover:cursor-pointer"
              ></i>
            </div>
            <div class="w-full lg:grid lg:grid-cols-2 flex flex-col gap-y-3">
              <input
                type="text"
                name="task-${mainInputValue}-${inputNumber + 1}"
                id="taskInput"
                placeholder="descrition des tàches accomplies"
                class="lg:w-9/12 w-full bg-transparent p-2 text-white font-bold"
              />
              <input
                type="text"
                name="taskDate-${mainInputValue}-${inputNumber + 1}"
                id="taskDateInput"
                placeholder="période"
                class="lg:w-9/12 w-full bg-transparent p-2 text-white font-bold"
              />
            </div>
            <div id="listRemoveBtn">
              <i
                class="fa-solid fa-square-xmark fa-xl font-bold text-white hover:cursor-pointer"
              ></i>
            </div>
          </div>
`;
  lastParent.insertAdjacentHTML('beforeend', listItemComponent);
  /**
   * @type {Element[]}
   */
  lastParent.querySelectorAll('#listRemoveBtn').forEach((el) => {
    el.addEventListener('click', removeTask);
  });
  lastParent.querySelectorAll('#addTask').forEach((el) => {
    el.addEventListener('click', addTask);
  });
};

/**
 *
 * @param {MouseEvent} e
 */
const removeTask = (e) => {
  e.preventDefault();
  /**
   * @type {HTMLElement}
   */
  const el = e.currentTarget;
  const firstParent = el.parentElement;
  const secondParent = firstParent.parentElement;
  if (secondParent.querySelectorAll('.vl-parent').length <= 1) {
    return;
  }
  firstParent.remove();
};

/**
 *
 * @param {MouseEvent} e
 */
const addExperience = (e) => {
  e.preventDefault();

  e.preventDefault();
  /**
   * @type {EventTarget}
   */
  const el = e.currentTarget;
  const firstParent = el.parentElement;
  const secondParent = firstParent.parentElement;
  /**
   * @type {HTMLElement}
   */
  const lastParent = secondParent.parentElement;
  const listItemComponent = `
      <div id="" class="experienceGroupEl w-full mx-auto p-3 justify-center items-center">
        <div class="flex justify-between items-center w-full lg:p-2">
          <div id="addExperience">
            <i
              class="fa-regular fa-square-plus fa-xl text-white hover:cursor-pointer"
            ></i>
          </div>
          <input
            type="text"
            name="experience"
            id="experienceInput"
            data-group="1"
            placeholder="Titre"
            class="lg:w-9/12 w-w-full mr-2 bg-transparent p-2 text-white font-bold"
          />
          <div id="taskRemoveBtn">
            <i
              class="fa-solid fa-square-xmark fa-xl font-bold text-white hover:cursor-pointer"
            ></i>
          </div>
        </div>
        <div id="" class="lst-component w-full flex flex-col gap-y-3">
          <div
            data-index="1"
            class="vl-parent flex gap-x-4 w-full items-center mt-4"
          >
            <div id="addTask">
              <i
                class="fa-regular fa-square-plus fa-xl text-white hover:cursor-pointer"
              ></i>
            </div>
            <div class="w-full lg:grid lg:grid-cols-2 flex flex-col gap-y-3">
              <input
                type="text"
                name="task"
                id="taskInput"
                placeholder="descrition des tàches accomplies"
                class="lg:w-9/12 w-full bg-transparent p-2 text-white font-bold"
              />
              <input
                type="text"
                name="taskDate"
                id="taskDateInput"
                placeholder="période"
                class="lg:w-9/12 w-full bg-transparent p-2 text-white font-bold"
              />
            </div>
            <div id="listRemoveBtn">
              <i
                class="fa-solid fa-square-xmark fa-xl font-bold text-white hover:cursor-pointer"
              ></i>
            </div>
          </div>
        </div>
      </div>
`;
  lastParent
    .querySelector('#move')
    .insertAdjacentHTML('beforebegin', listItemComponent);
  /**
   * @type {Element[]}
   */
  lastParent.querySelectorAll('#taskRemoveBtn').forEach((el) => {
    el.addEventListener('click', removeExperience);
  });
  lastParent.querySelectorAll('#addExperience').forEach((el) => {
    el.addEventListener('click', addExperience);
  });
  lastParent.querySelectorAll('#addTask').forEach((el) => {
    el.addEventListener('click', addTask);
  });
  lastParent.querySelectorAll('#experienceInput').forEach((el) => {
    el.addEventListener('change', experienceTrigger);
  });
};

/**
 *
 * @param {InputEvent} e
 */
const experienceTrigger = (e) => {
  e.preventDefault();
  console.log(e.currentTarget.value);
  /**
   * @type {HTMLElement}
   */
  const parent = e.currentTarget.parentElement.parentElement;
  parent.querySelectorAll('#taskInput').forEach((input, id) => {
    input.setAttribute('name', `task-${e.currentTarget.value}-${id + 1}`);
  });
  parent.querySelectorAll('#taskDateInput').forEach((input, id) => {
    input.setAttribute('name', `taskDate-${e.currentTarget.value}-${id + 1}`);
  });
};

/**
 *
 * @param {MouseEvent} e
 */
const removeExperience = (e) => {
  e.preventDefault();
  /**
   * @type {HTMLElement}
   */
  const el = e.currentTarget;
  const firstParent = el.parentElement;
  const secondParent = firstParent.parentElement;
  secondParent.remove();
};

/**
 *
 * @param {MouseEvent} e
 */
const removeLanguage = (e) => {
  e.preventDefault();
  if (
    e.currentTarget.parentElement.parentElement.querySelectorAll('.vl-parent')
      .length <= 1
  )
    return;
  e.currentTarget.parentElement.remove();
};

/**
 *
 * @param {MouseEvent} e
 */
const addLanguage = (e) => {
  e.preventDefault();
  const parent = e.currentTarget.parentElement;
  /**
   * @type {HTMLElement}
   */
  const secondParent = parent.parentElement;
  secondParent.querySelector('.lst-component').insertAdjacentHTML(
    'beforeend',
    `
          <div
            data-index="1"
            class="vl-parent flex gap-x-4 w-11/12 items-center mt-4"
          >
            <div class="w-4 h-4 hidden lg:block rounded-full bg-white"></div>
            <div
              class="flex lg:flex-row flex-col gap-y-3 w-full justify-between"
            >
              <input
                type="text"
                name="language"
                id="languageInput"
                placeholder="Element"
                class="lg:w-9/12 w-11/12 bg-transparent p-2 text-white font-bold"
              />
              <select name="" id="languageOption" class="bg-gray-950 text-white">
                <option value="">niveau de langue</option>
                <option value="basique">Basique</option>
                <option value="intermédiaire">intermédiaire</option>
                <option value="expérimenté">expérimenté</option>
              </select>
            </div>
            <div id="languageRemoveBtn">
              <i
                class="fa-solid fa-square-xmark fa-xl font-bold text-white hover:cursor-pointer"
              ></i>
            </div>
          </div>
    `
  );
  secondParent.querySelectorAll('#languageRemoveBtn').forEach((el) => {
    el.addEventListener('click', removeLanguage);
  });

  secondParent.querySelectorAll('#languageInput').forEach(el => {
    el.addEventListener('change', languageTrigger);
  });
};

/**
 *
 * @param {MouseEvent} e
 */
const removeInterest = (e) => {
  e.preventDefault();
  if (
    e.currentTarget.parentElement.parentElement.querySelectorAll('.vl-parent')
      .length <= 1
  )
    return;
  e.currentTarget.parentElement.remove();
};

/**
 *
 * @param {MouseEvent} e
 */
const addInterest = (e) => {
  e.preventDefault();
  /**
   * @type {HTMLElement}
   */
  const parent = e.currentTarget.parentElement.parentElement;
  parent.querySelector('.lst-component').insertAdjacentHTML(
    'beforeend',
    `
          <div
            data-index="1"
            class="vl-parent flex gap-x-4 w-11/12 items-center mt-4"
          >
            <div class="w-4 h-4 hidden lg:block rounded-full bg-white"></div>
            <input
              type="text"
              name="interest"
              id="listElement"
              placeholder="Element"
              class="lg:w-9/12 w-11/12 bg-transparent p-2 text-white font-bold"
            />
            <div id="interestRemoveBtn">
              <i
                class="fa-solid fa-square-xmark fa-xl font-bold text-white hover:cursor-pointer"
              ></i>
            </div>
          </div>
    `
  );
  parent.querySelectorAll('#interestRemoveBtn').forEach((el) => {
    el.addEventListener('click', removeInterest);
  });
};

/**
 *
 * @param {InputEvent} e
 */
const formationTrigger = (e) => {
  e.preventDefault();
  /**
   * @type {string}
   */
  const content = e.currentTarget.value;
  content.trim();
  /**
   * @type {HTMLElement}
   */
  const parent = e.currentTarget.parentElement;
  /**
   * @type {HTMLInputElement}
   */
  const cert = parent.querySelector('#certificateInput');
  /**
   * @type {HTMLInputElement}
   */
  const certDate = parent.querySelector('#certificationDateInput');
  cert.setAttribute('name', `certificate-${content}`);
  certDate.setAttribute('name', `certificationDate-${content}`);
};

/**
 *
 * @param {InputEvent} e
 */
const languageTrigger = (e) => {
  e.preventDefault();
  e.currentTarget.parentElement
    .querySelector('#languageOption')
    .setAttribute('name', `languageLevel-${e.currentTarget.value}`);
};

document.querySelector('#listAdd').addEventListener('click', addListItem);
document.querySelector('#addFormation').addEventListener('click', addFormation);
document.querySelector('#addTask').addEventListener('click', addTask);
document
  .querySelector('#addExperience')
  .addEventListener('click', addExperience);
document.querySelector('#addLanguage').addEventListener('click', addLanguage);
document.querySelector('#addInterest').addEventListener('click', addInterest);
document
  .querySelector('#formationInput')
  .addEventListener('change', formationTrigger);
document
  .querySelector('#experienceInput')
  .addEventListener('change', experienceTrigger);
document
  .querySelector('#languageInput')
  .addEventListener('change', languageTrigger);

document.querySelector('#userSrcImg').addEventListener('click', (e) => {
  e.preventDefault();
  document.querySelector('#fileInput').click();
});

document.querySelector('#fileInput').addEventListener('change', (e) => {
  e.preventDefault();
  const file = e.currentTarget.files[0];
  if(file) {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onloadend = () => {
      /**
       * @type {HTMLImageElement}
       */
      const img = document.querySelector('#userSrcImg');
      img.src = reader.result;
    }
  }
});

document.querySelector('#parentCVForm').addEventListener('submit', async (e) => {
  e.preventDefault();
  const form = new FormData(e.currentTarget);
  const cvType = form.get('cvType');
  const name = form.get('name');
  const email = form.get('email');
  const phone = form.get('phone');
  const address = form.get('adresse');
  const birthday = form.get('birthday');
  const profile = form.get('profile');
  const skills = form.getAll('skill');
  const interest = form.getAll('interest');
  const formationGroup = document.querySelector('#formationGroupEl');
  const experienceGroup = document.querySelector('#experienceGroup');
  const languageGroup = document.querySelector('#languageGroup');
  /**
   * @type {{formation: string; certificate: string; certificationDate: string}[]}
   */
  const formations = [];
  /**
   * @type {{experience: string; details: {task: string; taskDate: string}[]}[]}
   */
  const experiences = [];
  /**
   * @type {{lang: string; level: string}[]}
   */
  const languages = [];
  formationGroup.querySelectorAll('.lst-component').forEach((el) => {
    const formation = el.querySelector('input[name="formation"]').value;
    const certificate = el.querySelector('input[id="certificateInput"]').value;
    const certificationDate = el.querySelector(
      'input[id="certificationDateInput"]'
    ).value;
    formations.push({
      formation,
      certificate,
      certificationDate,
    });
  });
  experienceGroup.querySelectorAll('.experienceGroupEl').forEach(el => {
    const details = [];
    const exp = el.querySelector('input[name="experience"]').value;
    el.querySelectorAll('.lst-component').forEach(el => {
      const task = el.querySelector('input[id="taskInput"]').value;
      const taskDate = el.querySelector('input[id="taskDateInput"]').value;
      details.push({ task, taskDate });
    });
    experiences.push({ experience: exp, details });
  });
  languageGroup.querySelectorAll('.lst-component').forEach(el => {
    const lang = el.querySelector('#languageInput').value;
    const languageOption = el.querySelector('#languageOption');
    const level =
      languageOption?.value ?? languageOption?.getAttribute('name') ?? '';
    languages.push({lang, level});
  });
  const data = {
    cvType,
    name,
    email,
    phone,
    address,
    birthday,
    profile,
    skills,
    interest,
    formations,
    experiences,
    languages,
  }
  console.log(data);
  const jsonData = JSON.stringify(data);
  form.append('jsonData', jsonData);
  const fetcher = await fetch('/cv/process', {
    method: 'POST',
    body: form,
  });
  const res = await fetcher.json();
  // console.log(res.redirect);
  window.location.href = res.redirect;
});
