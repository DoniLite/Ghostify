
const action = document.querySelector('#actuAction');
const parent = document.querySelector('.dp');
const actuForm = document.querySelector('#actuForm');
const closer = document.querySelector('#actuCloser');
const fileInput = document.querySelector('#fileInput');
const addFileBtn = document.querySelector('#addFile');
const fileNameLabel = document.querySelector('#fileName');

parent.onscroll = (e) => {
  e.preventDefault();
  console.log('scroll');
  action.classList.add('translate-x-[140%]');
};

parent.onscrollend = (e) => {
  e.preventDefault();
  console.log('scrollend');
  action.classList.remove('translate-x-[140%]');
};

action.onclick = (e) => {
  e.preventDefault();
  actuForm.classList.remove('-translate-y-[300%]');
};

closer.onclick = (e) => {
  e.preventDefault();
  actuForm.classList.add('-translate-y-[300%]');
};

addFileBtn.onclick = (e) => {
  e.preventDefault();
  fileInput.click();
};

fileInput.onchange = (e) => {};