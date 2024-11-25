/* eslint-disable no-undef */

import {
  addExperience,
  addFormation,
  addInterest,
  addLanguage,
  addListItem,
  addTask,
  experienceTrigger,
  formationTrigger,
  languageTrigger,
} from './eventHandlers.js';

const cvActionModal = document.querySelector('#cvActionModal');
const actionBtn = document.querySelector('#action');
const closeCvActionModal = document.querySelector('#closeCvActionModal');
const firstTarget = document.querySelector('#translatorFirst');
const secondTarget = document.querySelector('#translatorSecond');
const zappingBtns = document.querySelectorAll('.zapping-btn');
const translatorParent = document.querySelector('#translatorParent');
// const ressourceLoader = document.querySelector('#ressourceLoader');
const assetEl = document.querySelector('#assetEl');
const changeThemeBtn = document.querySelector('#changeTheme');
const modifFormBtn = document.querySelector('#formModifierBtn');
const resourceLoaderComponent = `<div id="ressourceLoader" class=" w-full flex justify-center items-center gap-x-3 text-white mt-4">
          Chargement en cours veuillez patienter
          <span class="loading loading-spinner loading-lg bg-orange-500 text-center"></span>
        </div>`;

changeThemeBtn.addEventListener('click', async (e) => {
  e.preventDefault();
  const uid = actionBtn.dataset.uid;
  const req = await fetch(`/cv/theme/${uid}`);
  /**
   *
   * @param {typeof res} data
   */
  const updatingFrontWithTheme = (data) => {
    const cvType = `${data.type};${data.mode}`;
    assetEl
      .querySelector('#changingThemeFormParent')
      .querySelectorAll('input')
      .forEach((el) => {
        if (el.value === cvType) {
          assetEl
            .querySelector('#changingThemeFormParent')
            .querySelectorAll('input')
            .forEach((input) =>
              input.classList.remove('border-4', 'border-orange-500')
            );
          el.classList.toggle('border-4');
          el.classList.toggle('border-orange-500');
          return;
        }
      });
  };
  /**
   * @type {{type: string | number; mode: string | number;}}
   */
  const res = await req.json();
  const themeComponent = `<div id="changingThemeFormParent"
            class="lg:grid w-full lg:gap-4 lg:grid-cols-2 flex flex-col gap-y-4"
          >
            <input
              type="image"
              src="/static/screen/cv1.png"
              alt="cv-type"
              name="cvType"
              value="1;1"
              class="w-full h-[30rem] rounded-lg object-cover border-4 border-orange-500"
            />
            <input
              type="image"
              src="/static/screen/cv1.png"
              alt="cv-type"
              name="cvType"
              value="1;2"
              class="w-full h-[30rem] rounded-lg object-cover"
            />
            <input
              type="image"
              src="/static/screen/cv1.png"
              alt="cv-type"
              name="cvType"
              value="1;3"
              class="w-full h-[30rem] rounded-lg object-cove"
            />
            <input
              type="image"
              src="/static/screen/cv1.png"
              alt="cv-type"
              name="cvType"
              value="1;4"
              class="w-full h-[30rem] rounded-lg object-cove"
            />
            <input
              type="image"
              src="/static/screen/cv1.png"
              alt="cv-type"
              name="cvType"
              value="1;5"
              class="w-full h-[30rem] rounded-lg object-cove"
            />
            <input
              type="image"
              src="/static/screen/cv1.png"
              alt="cv-type"
              name="cvType"
              value="1;6"
              class="w-full h-[30rem] rounded-lg object-cove"
            />
            <input
              type="image"
              src="/static/screen/cv1.png"
              alt="cv-type"
              value="2;1"
              name="cvType"
              class="w-full h-[30rem] rounded-lg object-cover"
            />
            <input
              type="image"
              src="/static/screen/cv1.png"
              alt="cv-type"
              value="2;2"
              name="cvType"
              class="w-full h-[30rem] rounded-lg object-cover"
            />
            <input
              type="image"
              src="/static/screen/cv1.png"
              alt="cv-type"
              value="2;3"
              name="cvType"
              class="w-full h-[30rem] rounded-lg object-cover"
            />
            <input
              type="image"
              src="/static/screen/cv1.png"
              alt="cv-type"
              value="2;4"
              name="cvType"
              class="w-full h-[30rem] rounded-lg object-cover"
            />
            <input
              type="image"
              src="/static/screen/cv1.png"
              alt="cv-type"
              value="2;5"
              name="cvType"
              class="w-full h-[30rem] rounded-lg object-cover"
            />
            <input
              type="image"
              src="/static/screen/cv1.png"
              alt="cv-type"
              value="3;1"
              name="cvType"
              class="w-full h-[30rem] rounded-lg object-cover"
            />
            <input
              type="image"
              src="/static/screen/cv1.png"
              alt="cv-type"
              value="3;2"
              name="cvType"
              class="w-full h-[30rem] rounded-lg object-cover"
            />
            <input
              type="image"
              src="/static/screen/cv1.png"
              alt="cv-type"
              value="3;3"
              name="cvType"
              class="w-full h-[30rem] rounded-lg object-cover"
            />
            <input
              type="image"
              src="/static/screen/cv1.png"
              alt="cv-type"
              value="3;4"
              name="cvType"
              class="w-full h-[30rem] rounded-lg object-cover"
            />
            <input
              type="image"
              src="/static/screen/cv1.png"
              alt="cv-type"
              value="3;5"
              name="cvType"
              class="w-full h-[30rem] rounded-lg object-cover"
            />
          </div>`;
  assetEl.childNodes.forEach((node) => node.remove());
  assetEl.insertAdjacentHTML('beforeend', themeComponent);
  assetEl
    .querySelector('#changingThemeFormParent')
    .querySelectorAll('input')
    .forEach((input) => {
      input.addEventListener('click', async (e) => {
        e.preventDefault();
        assetEl
          .querySelector('#changingThemeFormParent')
          .querySelectorAll('input')
          .forEach((input) =>
            input.classList.remove('border-4', 'border-orange-500')
          );
        e.currentTarget.classList.toggle('border-4');
        e.currentTarget.classList.toggle('border-orange-500');
        const req2 = await fetch(
          `/cv/theme/${uid}?set=true&data=${e.currentTarget.value}`
        );
        const res2 = await req2.json();
        if (res2.success) {
          window.location.reload();
        }
      });
    });
  if (req.ok) {
    updatingFrontWithTheme(res);
  }
});
let isProcessing = false;
modifFormBtn.addEventListener('click', async (e) => {
  e.preventDefault();
  if (isProcessing) return;
  isProcessing = true;
  try {
    assetEl.childNodes.forEach((node) => node.remove());
    assetEl.insertAdjacentHTML('beforeend', resourceLoaderComponent);
    const uid = actionBtn.dataset.uid;
    const req = await fetch(`/cv/${uid}?api=true`);
    if (!req.ok) {
      assetEl.childNodes.forEach((node) => node.remove());
      assetEl.insertAdjacentHTML(
        'beforeend',
        `<div class=" flex w-full justify-center mt-4 text-white"><p>Une erreur est survenue...��� </p></div>`
      );
      return;
    }
    /**
   * @type {{
    img?: string;
    fullName?: string;
    email?: string;
    phoneNumber?: string;
    location?: string;
    birthday?: string;
    profile?: string;
    skills?: string[];
    formations?: {
        title: string;
        description: string;
        date: string;
    }[];
    experience?: {
        title: string;
        contents: {
            description: string;
            duration: string;
        }[];
    }[];
    interest?: string[];
    languages?: {
        title: string;
        css: "w-[30%]" | "w-[60%]" | "w-full";
        level: string;
    }[];
    css?: unknown;
  }}
   */
    const res = await req.json();
    console.log(res);
    const formComponent = `<form id="formUpdateElementParent" class=" w-full flex-col gap-y-3">
        <div
          data-translate="200"
          id="first"
          class="w-full mx-auto mt-4 bg-gray-950 text-white p-4 rounded-lg shadow-lg shadow-black flex flex-col gap-y-6 mb-4 relative"
        >
          <h1 class="text-2xl font-bold ml-8">Informations personnelles</h1>
          <input
            type="file"
            name="userProfileFile"
            accept="image/*"
            id="fileInput"
            class="hidden"
          />
          <img
            src="${res.img ? res.img : '/static/SVG/user.svg'}"
            alt="user profile"
            id="userSrcImg"
            class="w-24 h-24 mx-auto rounded-full object-cover border-2 border-orange-500 p-2"
          />
          <input
            type="text"
            name="name"
            value="${res.fullName}"
            placeholder="Saisissez votre nom complet"
            class="w-full rounded-lg border border-stroke bg-transparent py-4 pl-6 pr-10 outline-none focus:border-primary focus-visible:shadow-none dark:border-form-strokedark dark:bg-form-input dark:focus:border-primary"
          />
          <input
            type="text"
            name="email"
            value="${res.email}"
            placeholder="Saisissez votre email"
            class="w-full rounded-lg border border-stroke bg-transparent py-4 pl-6 pr-10 outline-none focus:border-primary focus-visible:shadow-none dark:border-form-strokedark dark:bg-form-input dark:focus:border-primary"
          />
          <input
            type="text"
            name="phone"
            value="${res.phoneNumber}"
            placeholder="Saisissez votre numéro de téléphone"
            class="w-full rounded-lg border border-stroke bg-transparent py-4 pl-6 pr-10 outline-none focus:border-primary focus-visible:shadow-none dark:border-form-strokedark dark:bg-form-input dark:focus:border-primary"
          />
          <input
            type="text"
            name="adresse"
            value="${res.location}"
            placeholder="Votre adresse/pays/ville"
            class="w-full rounded-lg border border-stroke bg-transparent py-4 pl-6 pr-10 outline-none focus:border-primary focus-visible:shadow-none dark:border-form-strokedark dark:bg-form-input dark:focus:border-primary"
          />
          <input
            type="date"
            name="birthday"
            value="${res.birthday}"
            class="w-full rounded-lg border border-stroke bg-transparent py-4 pl-6 pr-10 outline-none focus:border-primary focus-visible:shadow-none dark:border-form-strokedark dark:bg-form-input dark:focus:border-primary"
          />
        </div>

        <div
          data-translate="300"
          class="w-full mx-auto mt-4 bg-gray-950 text-white p-4 rounded-lg shadow-lg shadow-black flex flex-col gap-y-6 mb-4 relative"
        >
          <h1 class="text-2xl font-bold ml-8">Profile</h1>
          <textarea
            name="profile"
            class="w-full rounded-lg border border-stroke bg-transparent py-4 pl-6 pr-10 outline-none focus:border-primary focus-visible:shadow-none dark:border-form-strokedark dark:bg-form-input dark:focus:border-primary"
            id="actuContent"
            placeholder="Décrivez-vous"
          >${res.profile}</textarea>
          <div class="w-full mx-auto p-3 justify-center items-center">
            <div class="flex justify-between items-center w-full p-2">
              <h1 class="text-white font-bold text-2xl">Compétences</h1>
              <div id="listAdd">
                <i
                  class="fa-regular fa-square-plus fa-xl text-white hover:cursor-pointer"
                ></i>
              </div>
            </div>
            <div id="" class="lst-component w-full flex flex-col gap-y-3">
              ${res.skills
                .map((skill, index) => {
                  return `
                  <div
                    data-index="${index}"
                    class="vl-parent flex gap-x-4 w-full items-center mt-4"
                  >
                    <div
                      class="w-4 h-4 hidden lg:block rounded-full bg-white"
                    ></div>
                    <input
                      type="text"
                      name="skill"
                      value="${skill}"
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
                })
                .join('')}
            </div>
          </div>

          <div id="formationGroupEl" class="w-full mx-auto p-3 justify-center items-center">
            <div class="flex justify-between items-center w-full p-2">
              <h1 class="text-white font-bold text-2xl">Formations</h1>
              <div id="addFormation">
                <i
                  class="fa-regular fa-square-plus fa-xl text-white hover:cursor-pointer"
                ></i>
              </div>
            </div>
            <div  class="lst-component w-full flex flex-col gap-y-3">
              ${res.formations
                .map((formation, index) => {
                  return `<div
                          data-index="${index}"
                          class="vl-parent flex gap-x-4 w-full items-center mt-4"
                        >
                          <div
                            class="w-4 h-4 hidden lg:block rounded-full bg-white"
                          ></div>
                          <div
                            class="w-full lg:grid lg:grid-cols-2 flex flex-col gap-y-3"
                          >
                            <input
                              type="text"
                              name="formation"
                              id="formationInput"
                              value="${formation.title}"
                              placeholder="Institut de formation"
                              class="lg:w-9/12 w-11/12 bg-transparent p-2 text-white font-bold"
                            />
                            <input
                              type="text"
                              name="certificate"
                              id="certificateInput"
                              value="${formation.description}"
                              placeholder="diplôme"
                              class="lg:w-9/12 w-11/12 bg-transparent p-2 text-white font-bold"
                            />
                            <input
                              type="text"
                              name="certificationDate"
                              value="${formation.date}"
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
                        </div>`;
                })
                .join('')}
              
            </div>
          </div>
        </div>

        <div
          id="experienceGroup"
          data-translate="400"
          class="w-full mx-auto mt-4 bg-gray-950 text-white p-4 rounded-lg shadow-lg shadow-black flex flex-col gap-y-6 mb-4 relative"
        >
          <h1 class="text-2xl font-bold ml-8">Expérience professionnelle</h1>
          ${res.experience
            .map((el) => {
              return `
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
                value="${el.title}"
                data-group="1"
                placeholder="Titre"
                class="lg:w-9/12 w-w-full mr-2 bg-transparent p-2 text-white font-bold"
              />
            </div>
            <div id="" class="lst-component w-full flex flex-col gap-y-3">
              ${el.contents
                .map((element, index) => {
                  return `
                <div
                  data-index="${index}"
                  class="vl-parent flex gap-x-4 w-full items-center mt-4"
                >
                  <div id="addTask">
                    <i
                      class="fa-regular fa-square-plus fa-xl text-white hover:cursor-pointer"
                    ></i>
                  </div>
                  <div
                    class="w-full lg:grid lg:grid-cols-2 flex flex-col gap-y-3"
                  >
                    <input
                      type="text"
                      name="task"
                      id="taskInput"
                      value="${element.description}"
                      placeholder="descrition des tàches accomplies"
                      class="lg:w-9/12 w-full bg-transparent p-2 text-white font-bold"
                    />
                    <input
                      type="text"
                      name="taskDate"
                      id="taskDateInput"
                      value="${element.duration}"
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
                })
                .join('')}
            </div>
          </div>
            `;
            })
            .join('')}
          
        </div>

        <div
          data-translate="500"
          class="w-full mx-auto mt-4 bg-gray-950 text-white p-4 rounded-lg shadow-lg shadow-black flex flex-col gap-y-6 mb-4 relative"
        >
          <div class="w-full mx-auto p-3 justify-center items-center">
            <div class="flex justify-between items-center w-full p-2">
              <h1 class="text-white font-bold text-2xl">
                Vos centres d'intérêt
              </h1>
              <div id="addInterest">
                <i
                  class="fa-regular fa-square-plus fa-xl text-white hover:cursor-pointer"
                ></i>
              </div>
            </div>
            <div id="" class="lst-component w-full flex flex-col gap-y-3">
              ${res.interest
                .map((el, index) => {
                  return `<div
                          data-index="${index}"
                          class="vl-parent flex gap-x-4 w-11/12 items-center mt-4"
                        >
                          <div
                            class="w-4 h-4 hidden lg:block rounded-full bg-white"
                          ></div>
                          <input
                            type="text"
                            name="interest"
                            id="listElement"
                            value="${el}"
                            placeholder="Element"
                            class="lg:w-9/12 w-11/12 bg-transparent p-2 text-white font-bold"
                          />
                          <div id="interestRemoveBtn">
                            <i
                              class="fa-solid fa-square-xmark fa-xl font-bold text-white hover:cursor-pointer"
                            ></i>
                          </div>
                        </div>`;
                })
                .join('')}
            </div>
          </div>

          <div id="languageGroup" class="w-full mx-auto p-3 justify-center items-center">
            <div class="flex justify-between items-center w-full p-2">
              <h1 class="text-white font-bold text-2xl">Langues</h1>
              <div id="addLanguage">
                <i
                  class="fa-regular fa-square-plus fa-xl text-white hover:cursor-pointer"
                ></i>
              </div>
            </div>
            <div id="" class="lst-component w-full flex flex-col gap-y-3">
              ${res.languages
                .map((lang, i) => {
                  return `
                <div
                  data-index="${i}"
                  class="vl-parent flex gap-x-4 w-11/12 items-center mt-4"
                >
                  <div
                    class="w-4 h-4 hidden lg:block rounded-full bg-white"
                  ></div>
                  <div
                    class="flex lg:flex-row flex-col gap-y-3 w-full justify-between"
                  >
                    <input
                      type="text"
                      name="language"
                      value="${lang.title}"
                      id="languageInput"
                      placeholder="Element"
                      class="lg:w-9/12 w-11/12 bg-transparent p-2 text-white font-bold"
                    />
                    <select
                      name=""
                      id="languageOption"
                      class="bg-gray-950 text-white"
                    >
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
                </div>`;
                })
                .join('')}
            </div>
            <button
                type="submit"
                class="w-full h-12 flex justify-center items-center rounded-md font-bold text-white bg-orange-500 mt-4 mb-16"
            >
                Mettre à jour
            </button>
          </div>
        </div>

        
</form>`;
    assetEl.childNodes.forEach((node) => node.remove());
    assetEl.insertAdjacentHTML('beforeend', formComponent);
    assetEl
      .querySelector('#formUpdateElementParent')
      .addEventListener('submit', processCVForAPI);
    assetEl.querySelector('#listAdd').addEventListener('click', addListItem);
    assetEl
      .querySelector('#addFormation')
      .addEventListener('click', addFormation);
    assetEl.querySelector('#addTask').addEventListener('click', addTask);
    assetEl
      .querySelector('#addExperience')
      .addEventListener('click', addExperience);
    assetEl
      .querySelector('#addLanguage')
      .addEventListener('click', addLanguage);
    assetEl
      .querySelector('#addInterest')
      .addEventListener('click', addInterest);
    assetEl
      .querySelector('#formationInput')
      .addEventListener('change', formationTrigger);
    assetEl
      .querySelector('#experienceInput')
      .addEventListener('change', experienceTrigger);
    assetEl
      .querySelector('#languageInput')
      .addEventListener('change', languageTrigger);

    assetEl.querySelector('#userSrcImg').addEventListener('click', (e) => {
      e.preventDefault();
      document.querySelector('#fileInput').click();
    });

    assetEl.querySelector('#fileInput').addEventListener('change', (e) => {
      e.preventDefault();
      const file = e.currentTarget.files[0];
      if (file) {
        const reader = new FileReader();
        reader.readAsDataURL(file);
        reader.onloadend = () => {
          /**
           * @type {HTMLImageElement}
           */
          const img = document.querySelector('#userSrcImg');
          img.src = reader.result;
        };
      }
    });
  } catch (e) {
    console.error(e);
    assetEl.childNodes.forEach((node) => node.remove());
    assetEl.insertAdjacentHTML(
      'beforeend',
      `<div class=" flex w-full justify-center mt-4 text-white"><p>Une erreur est survenue...��� </p></div>`
    );
  } finally {
    isProcessing = false;
  }
});

const fetchResource = async () => {
  console.log(actionBtn.dataset.uid);
  const req = await fetch(`/cv/job/status?uid=${actionBtn.dataset.uid}`);
  const res = await req.json();
  if (res.success) {
    if (firstTarget.children[1].getAttribute('id') !== 'ressourceLoader') {
      return;
    }
    firstTarget.children[1].remove();
    const ressourceComponent = `<div id="" class=" flex w-full flex-col gap-y-4  mt-4">
          <div class="flex gap-x-2 text-orange-500 font-bold items-center">
            <span class="text-white">PDF: </span>
            <a href="${res.doc}" class=" hover:underline line-clamp-2" target="_blank">
              <i class="fa-solid fa-link text-orange-500"></i>
              ${res.doc}
            </a>
          </div>

          <div class="flex gap-x-2 text-orange-500 font-bold items-center">
            <span class="text-white">Image: </span>
            <a href="${res.img}" class=" hover:underline line-clamp-2" target="_blank">
              <i class="fa-solid fa-link text-orange-500"></i>
              ${res.img}
            </a>
          </div>
        </div>`;
    firstTarget.insertAdjacentHTML('beforeend', ressourceComponent);
    return;
  }
  if (res.error) {
    firstTarget.children[1].remove();
    const errorComponent = `<span class=" text-orange-500 text-center">Une erreur est survenue durant la récupération de vos données <br> We have'nt fetch your data successfully</span>`;
    firstTarget.insertAdjacentHTML('beforeend', errorComponent);
  }
};

window.onload = fetchResource;

actionBtn.addEventListener('click', async (e) => {
  e.preventDefault();
  if (firstTarget.children[1].getAttribute('id') === 'ressourceLoader') {
    await fetchResource();
  }
  cvActionModal.classList.remove('transUpdatePanelHide');
  cvActionModal.classList.add('transNotificationShow');
});

closeCvActionModal.addEventListener('click', (e) => {
  e.preventDefault();
  cvActionModal.classList.remove('transNotificationShow');
  cvActionModal.classList.add('transUpdatePanelHide');
});

zappingBtns.forEach((btn) => {
  btn.addEventListener('click', (e) => {
    e.preventDefault();
    /**
     * @type {HTMLElement}
     */
    const el = e.currentTarget;
    if (el.dataset.index === '1') {
      translatorParent.style.transform = `translateX(-${firstTarget.dataset.translate}%)`;
    } else {
      translatorParent.style.transform = `translateX(-${secondTarget.dataset.translate}%)`;
    }
    el.classList.remove('bg-white');
    el.classList.add('bg-orange-500');
    zappingBtns.forEach((thisBtn) => {
      if (thisBtn.dataset.index !== el.dataset.index) {
        thisBtn.classList.remove('bg-orange-500');
        thisBtn.classList.add('bg-white');
        return;
      }
    });
  });
});

/**
 *
 * @param {FormDataEvent} event
 */
const processCVForAPI = async (event) => {
  event.preventDefault();
  const form = new FormData(event.currentTarget);
  const name = form.get('name');
  const email = form.get('email');
  const phone = form.get('phone');
  const address = form.get('adresse');
  const birthday = form.get('birthday');
  const profile = form.get('profile');
  const skills = form.getAll('skill');
  const interest = form.getAll('interest');
  const formationGroup = assetEl.querySelector('#formationGroupEl');
  const experienceGroup = assetEl.querySelector('#experienceGroup');
  console.log(formationGroup);
  const languageGroup = assetEl.querySelector('#languageGroup');
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
  experienceGroup.querySelectorAll('.experienceGroupEl').forEach((el) => {
    const details = [];
    const exp = el.querySelector('input[name="experience"]').value;
    el.querySelectorAll('.lst-component').forEach((el) => {
      const task = el.querySelector('input[id="taskInput"]').value;
      const taskDate = el.querySelector('input[id="taskDateInput"]').value;
      details.push({ task, taskDate });
    });
    experiences.push({ experience: exp, details });
  });
  languageGroup.querySelectorAll('.lst-component').forEach((el) => {
    const lang = el.querySelector('#languageInput').value;
    const languageOption = el.querySelector('#languageOption');
    const level =
      languageOption?.value ?? languageOption?.getAttribute('name') ?? '';
    languages.push({ lang, level });
  });
  const data = {
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
  };
  console.log(data);
  const jsonData = JSON.stringify(data);
  form.append('jsonData', jsonData);
  console.log(form.get('userProfileFile'));
  const fetcher = await fetch(`/cv/process/?uid=${actionBtn.dataset.uid}`, {
    method: 'POST',
    headers: {
      contentType: 'multipart/form-data',
    },
    body: form,
  });
  const res = await fetcher.json();
  // console.log(res.redirect);
  window.location.href = res.redirect;
};
