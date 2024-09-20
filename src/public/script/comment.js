/* eslint-disable no-undef */

document.querySelector('#commentFileControl').addEventListener('click', (e) => {
  e.preventDefault();
  document.querySelector('#commentFileInput').click();
});

document.querySelector('#commentFileInput').addEventListener('change', (e) => {
  e.preventDefault();
  const file = e.currentTarget.files[0];
  if (file) {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onloadend = () => {
      const component = `
        <div class="w-full relative mt-1">
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
        </div>
      `;
      document
        .querySelector('#commentFormElement')
        .insertAdjacentHTML('beforeend', component);
      document
        .querySelector('#commentFormElement')
        .querySelectorAll('#removeFile')
        .forEach((el) => {
          el.addEventListener('click', (e) => {
            e.preventDefault();
            e.currentTarget.parentElement.remove();
          });
        });
    };
  }
});
