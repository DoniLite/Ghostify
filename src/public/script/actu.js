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
  console.log(fileInput.value);
  if(file) {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onloadend = () => {
      const img = `<div class="w-full relative mt-1">
          <div
              class="absolute top-2 right-2 p-1 cursor-pointer flex justify-center items-center bg-orange-500 rounded-full"
              id="removeFile"
          >
              <i class="fa-solid fa-circle-xmark fa-xl text-white"></i>
          </div>
          <img
              src="${reader.result}"
              alt=""
              class="w-full h-auto rounded-lg"
          />
        </div>`;
      document.querySelector('#imgInput').style.display = 'none';
      document
        .querySelector('#imgPrintDiv')
        .insertAdjacentHTML('afterbegin', img);
      document.querySelector('#imgPrintDiv').querySelectorAll('#removeFile').forEach(el => {
        el.addEventListener('click', (e) => {
          e.preventDefault();
          e.currentTarget.parentElement.remove();
          /**
           * @type {HTMLInputElement}
           */
          const inputFile = document.querySelector('input[type="file"]');
          document.querySelector('#imgInput').style.display = 'block';
          inputFile.value = '';
          console.log(fileInput.value);
        })
      })
    }
  }
};
