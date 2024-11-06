/* eslint-disable no-undef */

const cvActionModal = document.querySelector('#cvActionModal');
const actionBtn = document.querySelector('#action');
const closeCvActionModal = document.querySelector('#closeCvActionModal');
const firstTarget = document.querySelector('#translatorFirst');
const secondTarget = document.querySelector('#translatorSecond');
const zappingBtns = document.querySelectorAll('.zapping-btn');
const translatorParent = document.querySelector('#translatorParent');
const ressourceLoader = document.querySelector('#ressourceLoader');
const assetEl = document.querySelector('#assetEl');
const changeThemeBtn = document.querySelector('#changeTheme');
const modifFormBtn = document.querySelector('#formModifierBtn');
const ressourceLoaderComponent = `<div id="ressourceLoader" class=" w-full flex justify-center items-center gap-x-3 text-white mt-4">
          Chargement en cours veuillez patienter
          <span class="loading loading-spinner loading-lg bg-orange-500 text-center"></span>
        </div>`;
const themComponent = `<div
            class="lg:grid w-full lg:gap-4 lg:grid-cols-2 flex flex-col gap-y-4"
          >
            <input
              type="image"
              src="/static/screen/cv1.png"
              alt="cv-type"
              name="cvType"
              value="1"
              class="w-full h-[30rem] rounded-lg object-cover border-4 border-orange-500"
            />
            <input
              type="image"
              src="/static/screen/cv1.png"
              alt="cv-type"
              value="2"
              name="cvType"
              class="w-full h-[30rem] rounded-lg object-cover"
            />
            <input
              type="image"
              src="/static/screen/cv1.png"
              alt="cv-type"
              value="3"
              name="cvType"
              class="w-full h-[30rem] rounded-lg object-cover"
            />
          </div>`;
const formComponent = `<form class=" w-full flex-col gap-y-3">
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
            src="/static/SVG/user.svg"
            alt="user profile"
            id="userSrcImg"
            class="w-24 h-24 mx-auto rounded-full object-cover border-2 border-orange-500 p-2"
          />
          <input
            type="text"
            name="name"
            placeholder="Saisissez votre nom complet"
            class="w-full rounded-lg border border-stroke bg-transparent py-4 pl-6 pr-10 outline-none focus:border-primary focus-visible:shadow-none dark:border-form-strokedark dark:bg-form-input dark:focus:border-primary"
          />
          <input
            type="text"
            name="email"
            placeholder="Saisissez votre email"
            class="w-full rounded-lg border border-stroke bg-transparent py-4 pl-6 pr-10 outline-none focus:border-primary focus-visible:shadow-none dark:border-form-strokedark dark:bg-form-input dark:focus:border-primary"
          />
          <input
            type="text"
            name="phone"
            placeholder="Saisissez votre numéro de téléphone"
            class="w-full rounded-lg border border-stroke bg-transparent py-4 pl-6 pr-10 outline-none focus:border-primary focus-visible:shadow-none dark:border-form-strokedark dark:bg-form-input dark:focus:border-primary"
          />
          <input
            type="text"
            name="adresse"
            placeholder="Votre adresse/pays/ville"
            class="w-full rounded-lg border border-stroke bg-transparent py-4 pl-6 pr-10 outline-none focus:border-primary focus-visible:shadow-none dark:border-form-strokedark dark:bg-form-input dark:focus:border-primary"
          />
          <input
            type="date"
            name="birthday"
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
          ></textarea>
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
              <div
                data-index="1"
                class="vl-parent flex gap-x-4 w-11/12 items-center mt-4"
              >
                <div
                  class="w-4 h-4 hidden lg:block rounded-full bg-white"
                ></div>
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
              <div
                data-index="1"
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
            </div>
          </div>
        </div>

        <div
          data-translate="400"
          class="w-full mx-auto mt-4 bg-gray-950 text-white p-4 rounded-lg shadow-lg shadow-black flex flex-col gap-y-6 mb-4 relative"
        >
          <h1 class="text-2xl font-bold ml-8">Expérience professionnelle</h1>
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
                <div
                  class="w-full lg:grid lg:grid-cols-2 flex flex-col gap-y-3"
                >
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
              <div
                data-index="1"
                class="vl-parent flex gap-x-4 w-11/12 items-center mt-4"
              >
                <div
                  class="w-4 h-4 hidden lg:block rounded-full bg-white"
                ></div>
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
              <div
                data-index="1"
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
              </div>
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

changeThemeBtn.addEventListener('click', (e) => {
    e.preventDefault();
    assetEl.childNodes.forEach(node => node.remove());
    assetEl.insertAdjacentHTML('beforeend', themComponent);
});
modifFormBtn.addEventListener('click', (e) => {
    e.preventDefault();
    assetEl.childNodes.forEach(node => node.remove());
    assetEl.insertAdjacentHTML('beforeend', formComponent);
})

const fetchRessource = async () => {
    console.log(actionBtn.dataset.uid);
  const req = await fetch(`/cv/job/status?uid=${actionBtn.dataset.uid}`);
  const res = await req.json();
  if (res.success) {
    if (firstTarget.children[1].getAttribute('id') !== 'ressourceLoader') {
      return;
    }
    firstTarget.children[1].remove();
    const ressourceComponent = `<div class=" flex w-full flex-col gap-y-4  mt-4">
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

window.onload = fetchRessource;




actionBtn.addEventListener('click', (e) => {
  e.preventDefault();
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
