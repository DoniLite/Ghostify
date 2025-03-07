
export const removeItemList = (e: Event) => {
  e.preventDefault();
  const el = e.currentTarget as HTMLElement;
  const parent = el.parentElement;
  const secondParent = parent!.parentElement;
  const thirdParent = secondParent!.parentElement;
  const elList = thirdParent!.querySelectorAll('.vl-parent')!;
  if (elList.length <= 1) {
    return;
  }
  parent?.remove();
};


export const addListItem = (e: Event) => {
  e.preventDefault();
  /**
   * @type {EventTarget}
   */
  const el = e.currentTarget as HTMLElement;
  const firstParent = el.parentElement;
  /**
   * @type {HTMLElement}
   */
  const lastParent = firstParent!.parentElement!;
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
    .querySelector('.lst-component')!
    .insertAdjacentHTML('beforeend', listItemComponent);
  /**
   * @type {Element[]}
   */
  lastParent
    .querySelector('.lst-component')!
    .querySelectorAll('#listRemoveBtn')!
    .forEach((el) => {
      el.addEventListener('click', removeItemList);
    });
};

/**
 * @param {Event} e
 */
export const removeFormation = (e: Event) => {
  e.preventDefault();
  const el = e.currentTarget as HTMLElement;
  /**
   * @type {Element}
   */
  const parent = el.parentElement!;
  const secondParent = parent.parentElement!;
  const thirdParent = secondParent.parentElement!;
  const elList = thirdParent.querySelectorAll('.vl-parent');
  if (elList.length <= 1) {
    return;
  }
  parent.remove();
};

/**
 * @param {MouseEvent} e
 */
export const addFormation = (e: Event) => {
  e.preventDefault();
  /**
   * @type {EventTarget}
   */
  const el = e.currentTarget as HTMLElement;
  const firstParent = el.parentElement!;
  /**
   * @type {HTMLElement}
   */
  const lastParent = firstParent.parentElement!;
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
    .querySelector('.lst-component')!
    .insertAdjacentHTML('beforeend', listItemComponent);
  
  lastParent
    .querySelector('.lst-component')!
    .querySelectorAll('#listRemoveBtn')!
    .forEach((el) => {
      el.addEventListener('click', removeFormation);
    });

  lastParent
    .querySelector('.lst-component')!
    .querySelectorAll('#formationInput')!
    .forEach((el) => {
      el.addEventListener('change', formationTrigger);
    });
};

/**
 * @param {MouseEvent} e
 */
export const addTask = (e: Event) => {
  e.preventDefault();
  const el = e.currentTarget as HTMLElement;
  const firstParent = el.parentElement!;
  const lastParent = firstParent.parentElement!;
  const inputNumber = lastParent.querySelectorAll('#taskInput').length;
  const mainInputValue =
    lastParent.parentElement!.querySelector<HTMLInputElement>('#experienceInput')!
      .value;
  lastParent.parentElement!
    .querySelector('#experienceInput')!
    .setAttribute(
      'data-group',
      `${
        Number(
          lastParent.parentElement!.querySelector<HTMLInputElement>(
            '#experienceInput',
          )!.dataset.group,
        ) + 1
      }`,
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


export const removeTask = (e: Event) => {
  e.preventDefault();
  /**
   * @type {HTMLElement}
   */
  const el = e.currentTarget as HTMLElement;
  const firstParent = el.parentElement!;
  const secondParent = firstParent.parentElement!;
  if (secondParent.querySelectorAll('.vl-parent').length <= 1) {
    return;
  }
  firstParent.remove();
};


export const addExperience = (e: Event) => {
  e.preventDefault();

  e.preventDefault();
  const el = e.currentTarget as HTMLElement;
  const firstParent = el.parentElement!;
  const secondParent = firstParent.parentElement!;
  const lastParent = secondParent.parentElement!;
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
    .querySelector('#move')!
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


export const experienceTrigger = (e: Event) => {
  e.preventDefault();
  const el = e.currentTarget as HTMLInputElement;
  const parent = el.parentElement!.parentElement!;
  parent.querySelectorAll('#taskInput')!.forEach((input, id) => {
    input.setAttribute('name', `task-${el.value}-${id + 1}`);
  });
  parent.querySelectorAll('#taskDateInput')!.forEach((input, id) => {
    input.setAttribute('name', `taskDate-${el.value}-${id + 1}`);
  });
};


export const removeExperience = (e: Event) => {
  e.preventDefault();
  /**
   * @type {HTMLElement}
   */
  const el = e.currentTarget as HTMLElement;
  const firstParent = el.parentElement!;
  const secondParent = firstParent.parentElement!;
  secondParent.remove();
};


export const removeLanguage = (e: Event) => {
  e.preventDefault();
  const el = e.currentTarget as HTMLElement;
  if (
    el.parentElement!.parentElement!.querySelectorAll('.vl-parent')
      .length <= 1
  ) {
    return;
  }
  el.parentElement!.remove();
};


export const addLanguage = (e: Event) => {
  e.preventDefault();
  const el = e.currentTarget as HTMLElement;
  const parent = el.parentElement!;
  const secondParent = parent.parentElement!;
  secondParent.querySelector('.lst-component')!.insertAdjacentHTML(
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
    `,
  );
  secondParent.querySelectorAll('#languageRemoveBtn').forEach((el) => {
    el.addEventListener('click', removeLanguage);
  });

  secondParent.querySelectorAll('#languageInput').forEach((el) => {
    el.addEventListener('change', languageTrigger);
  });
};


export const removeInterest = (e: Event) => {
  e.preventDefault();
  const el = e.currentTarget as HTMLElement;
  if (
    el.parentElement!.parentElement!.querySelectorAll('.vl-parent')
      .length <= 1
  ) {
    return;
  }
  el.parentElement!.remove();
};


export const addInterest = (e: Event) => {
  e.preventDefault();
  /**
   * @type {HTMLElement}
   */
  const el = e.currentTarget as HTMLElement;
  const parent = el.parentElement!.parentElement!;
  parent.querySelector('.lst-component')!.insertAdjacentHTML(
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
    `,
  );
  parent.querySelectorAll('#interestRemoveBtn').forEach((el) => {
    el.addEventListener('click', removeInterest);
  });
};


export const formationTrigger = (e: Event) => {
  e.preventDefault();
  const el = e.currentTarget as HTMLInputElement;
  /**
   * @type {string}
   */
  const content = el.value;
  content.trim();
  /**
   * @type {HTMLElement}
   */
  const parent = el.parentElement!;
  /**
   * @type {HTMLInputElement}
   */
  const cert = parent.querySelector('#certificateInput')!;
  /**
   * @type {HTMLInputElement}
   */
  const certDate = parent.querySelector('#certificationDateInput')!;
  cert.setAttribute('name', `certificate-${content}`);
  certDate.setAttribute('name', `certificationDate-${content}`);
};


export const languageTrigger = (e: Event) => {
  e.preventDefault();
  const el = e.currentTarget as HTMLInputElement;
  el.parentElement!
    .querySelector('#languageOption')!
    .setAttribute('name', `languageLevel-${el.value}`);
};
