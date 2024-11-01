/* eslint-disable no-undef */

import { notificationPush, notificationsComponent } from './notifications.js';

const userIMG = document.querySelector('#userProfileImg');
const inputFile = document.querySelector('#profileUpdateInput');
const userName = document.querySelector('#userNamePrint');
const closeNotificationPanel = document.querySelector('#closeNotificationPane');
const notificationPanel = document.querySelector('#notificationPanel');
const notificationShower = document.querySelector('#notificationShower');
const userUpdatePanel = document.querySelector('#userUpdatePanel');
const closeUserUpdatePanel = document.querySelector('#closeUserUpdatePanel');
const profileEditor = document.querySelector('#editProfileBtn');
const modificationSubmitForm = document.querySelector(
  '#submitUserProfileModifications'
);
/**
 * @type {HTMLElement}
 */
const userDataset = document.querySelector('#userIdDataSet');
/**
 * @type {HTMLButtonElement}
 */
const submissionBtn = document.querySelector('#userUpdateSubmitionBtn');


modificationSubmitForm.addEventListener('submit', async (e) => {
  e.preventDefault();
  const form = new FormData(e.currentTarget);
  const username = form.get('username');
  const bio = form.get('bio');
  const link = form.get('link');
  const id = userDataset.dataset.id;
  const fetchBody = {
    username,
    bio,
    link,
    id,
  }
  const req = await fetch('/user/update', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(fetchBody),
  });
  const res = await req.json();
  if(res.success) {
    window.location.reload();
  }
  notificationPush(notificationsComponent.info('something went wrong'));
})

profileEditor.addEventListener('click', (e) => {
  e.preventDefault();
  userUpdatePanel.classList.remove('transUpdatePanelHide');
  userUpdatePanel.classList.add('transNotificationShow');
});

closeUserUpdatePanel.addEventListener('click', (e) => {
  e.preventDefault();
  userUpdatePanel.classList.remove('transNotificationShow');
  userUpdatePanel.classList.add('transUpdatePanelHide');
})

// document.onclick = async (e) => {
//   e.preventDefault();
//   if (e.target.getAttribute('id') === 'userNamePrint') return;
//   if(verifyingChangedUser.value === userName.value) return;
//   console.log(e);
//   userName.setAttribute('readonly', 'true');
//   /**
//    * @type {HTMLInputElement}
//    */
//   const el = e.target;
//   if (el.classList.contains('wrong-data')) {
//     return;
//   }
//   const req = await fetch('/user/update', {
//     method: 'POST',
//     headers: {
//         'Content-Type': 'application/json',
//     },
//     body: JSON.stringify({id: userName.dataset.id, username: el.value})
//   });
//   const res = await req.json();
//   if(res.success) {
//     notificationPush(notificationsComponent.success('your username has been updated'));
//     return;
//   }
//   notificationPush(notificationsComponent.info('error during update please try again'));
//   return
// };

userName.addEventListener('keyup', async (e) => {
  console.log(e.currentTarget.value);
  submissionBtn.disabled = false;
  userName.classList.remove('wrong-data');
  const errorComponent = document.querySelector('#componentErrorForm');
  if(errorComponent) errorComponent.remove();
  const regex = /[A-Z\s]/;
  if(e.currentTarget.value.length <= 0) return;
  if(regex.test(e.currentTarget.value)) {
    submissionBtn.disabled = true;
    userName.classList.add('wrong-data');
    const errorMessage = `<span class=" mt-1 text-red-500 font-bold" id="componentErrorForm">"${e.currentTarget.value}" have majuscule or space</span>`;
    userName.insertAdjacentHTML('afterend', errorMessage);
    return;
  };
  const req = await fetch(`/user/exists/${e.currentTarget.value}`);
  const res = await req.json();
  console.log(e.currentTarget);
  if (res.exist) {
    //adding red border...
    console.log('user exist');
    submissionBtn.disabled = true;
    userName.classList.add('wrong-data');
    const errorMessage = `<span class=" mt-1 text-red-500 font-bold" id="componentErrorForm">username is not valid</span>`;
    userName.insertAdjacentHTML('afterend', errorMessage);
    return;
  }
  console.log('not exist');
  submissionBtn.disabled = false;
  userName.classList.remove('wrong-data');
});

userName.addEventListener('click', (e) => {
  e.preventDefault();
  console.log('user name clicked');
  e.currentTarget.removeAttribute('readonly');
});

userIMG.addEventListener('click', (e) => {
  e.preventDefault();
  inputFile.click();
});

inputFile.addEventListener('change', async (e) => {
  e.preventDefault();
  const file = e.currentTarget.files[0];
  if (file) {
    const form = new FormData();
    form.append('file', file);

    const req = await fetch('/user/profile/file', {
      method: 'POST',
      body: form,
    });

    if (req.status === 200) {
      const data = await req.json();
      console.log(data);
      userIMG.src = data.file;
      notificationPush(
        notificationsComponent.success('your profile has been updated!')
      );
      inputFile.value = '';
      return;
    }

    notificationPush(
      notificationsComponent.info('something went wrong please try again')
    );
    return;
  }
});

closeNotificationPanel.addEventListener('click', (e) => {
  e.preventDefault();
  notificationPanel.classList.remove('transNotificationShow');
  notificationPanel.classList.add('transNotificationHide');
});

notificationShower.addEventListener('click', (e) => {
  e.preventDefault();
  notificationPanel.classList.remove('transNotificationHide');
  notificationPanel.classList.add('transNotificationShow');
})