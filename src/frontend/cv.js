/* eslint-disable no-undef */

import { addExperience, addFormation, addInterest, addLanguage, addListItem, addTask, experienceTrigger, formationTrigger, languageTrigger } from "./eventHandlers";

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
    headers: {
      contentType: 'multipart/form-data',
    },
    body: form,
  });
  const res = await fetcher.json();
  // console.log(res.redirect);
  window.location.href = res.redirect;
});
