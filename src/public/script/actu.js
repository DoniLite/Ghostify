/* eslint-disable no-undef */

const action = document.querySelector('#actuAction');

// const fileNameLabel = document.querySelector('#fileName');


document.addEventListener('windowScrollStart', () => {
  console.log('scroll');
  action.classList.add('translate-x-[140%]');
});

document.addEventListener('windowScrollEnd', () => {
  console.log('scrollend');
  action.classList.remove('translate-x-[140%]');
});


