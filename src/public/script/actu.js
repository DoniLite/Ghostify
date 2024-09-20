/* eslint-disable no-undef */

const action = document.querySelector('#actuAction');
const parent = document.querySelector('.dp');
const actuForm = document.querySelector('#actuForm');
const closer = document.querySelector('#actuCloser');
const fileInput = document.querySelector('#fileInput');
const addFileBtn = document.querySelector('#addFile');
// const fileNameLabel = document.querySelector('#fileName');

actuForm.addEventListener('submit', async (e) => {
  e.preventDefault();
  const form = new FormData(e.currentTarget);
  const title = form.get('title');
  const content = form.get('content');
  const file = form.get('img');
  const data = {
    title,
    content,
    file
  };
  console.log(data);
  const fetcher = await fetch('/actu/post', {
    method: 'POST',
    headers: {
      contentType: 'multipart/form-data'
    },
    body: form,
  });
  if(!fetcher.ok) {
    console.error(fetcher.statusText);
    return;
  }
  const result = await fetcher.text();
  console.log(result);
});

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

/**
 * 
 * @param {InputEvent} e 
 */
fileInput.onchange = (e) => {
  e.preventDefault();
  const file = e.currentTarget.files[0];
  if(file) {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onloadend = () => {
      const img = document.createElement('img');
      img.src = reader.result;
      img.classList.add('w-full', 'rounded-lg', 'object-cover', 'mb-4')
      img.style.height = '8rem';
      document.querySelector('#imgInput').style.display = 'none';
      document.querySelector('#actuBtnInput').insertAdjacentElement('beforebegin', img);
    }
  }
};
