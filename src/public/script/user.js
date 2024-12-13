/* eslint-disable no-undef */

import { socket } from './network.js';
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

const actionSup = document.querySelector('#notificationOptionSup');
const actionMark = document.querySelector('#notificationOptionMark');
const actionSupAll = document.querySelector('#notificationOptionSupAll');
const actionContainerActivity = document.querySelector(
  '#notificationActivityOptions'
);
const notificationContainer = document.querySelector(
  '#notificationElementsContainer'
);

/**
 *
 * @param {MouseEvent} e
 */
const notificationShowOptions = (e) => {
  e.preventDefault();
  /**
   * @type {HTMLElement}
   */
  const el = e.currentTarget;
  el.querySelector('#notificationActivityOptions').classList.remove(
    'hide-reactions'
  );
  el.querySelector('#notificationActivityOptions').classList.add(
    'show-reactions'
  );
};

/**
 *
 * @param {MouseEvent} e
 */
const notificationHideOptions = (e) => {
  e.preventDefault();
  /**
   * @type {HTMLElement}
   */
  const el = e.currentTarget;
  el.querySelector('#notificationActivityOptions').classList.remove(
    'show-reactions'
  );
  el.querySelector('#notificationActivityOptions').classList.add(
    'hide-reactions'
  );
};

/**
 *
 * @param {Event} e
 */
const deleteNotification = (e) => {
  e.preventDefault();
  /**
   * @type {HTMLElement}
   */
  const el = e.currentTarget.parentElement.parentElement.parentElement;
  const id = el.querySelector('input[name="notificationElId"]').value;
  el.remove();
  socket.send(
    JSON.stringify({ type: 'notification', data: { id }, action: 'delete' })
  );
};

/**
 *
 * @param {Event} e
 */
const markNotificationAsRead = (e) => {
  e.preventDefault();
  /**
   * @type {HTMLElement}
   */
  const el = e.currentTarget.parentElement.parentElement.parentElement;
  const id = el.querySelector('input[name="notificationElId"]').value;
  el.remove();
  socket.send(
    JSON.stringify({ type: 'notification', data: { id }, action: 'read' })
  );
};

/**
 * Prevents the default action of the event and sends a request
 * to delete all notifications via the websocket connection.
 *
 * @param {Event} e - The event object associated with the function call.
 */
const deleteAllNotifications = (e) => {
  e.preventDefault();
  socket.send(JSON.stringify({ type: 'notification', action: 'deleteAll' }));
};
/**
 *
 * @param {string} title
 * @param {string} content
 * @param {string} time
 * @param {string} id
 * @returns {string}
 */
const notification = (title, content, time, id) => `
      <div id="notificationElement" class=" flex w-full justify-between p-2 rounded-md bg-gray-950 text-white">
        <input type="hidden" name="notificationId" value="${id}" id="notificationElId">
        <div class="flex flex-col gap-y-2">
          <h2 class=" line-clamp-1 font-bold" id="notificationTitle">${title}</h2>
          <p class=" line-clamp-1" id="notificationContent">${content}</p>
        </div>
        <div class="flex flex-col gap-y-2">
          <div id="notificationOptions" class="text-end cursor-pointer relative">
            <i class="fa-solid fa-xl fa-ellipsis-vertical text-white"></i>
            <div 
              id="notificationActivityOptions" 
              class=" flex flex-col absolute left-2 rounded-md text-orange-500 font-bold hide-reactions"
            >
              <div id="notificationOptionSup" class=" w-full border-b border-orange-500 p-2 text-center">delete</div>
              <div id="notificationOptionMark" class=" w-full border-b border-orange-500 p-2 text-center">Mark as read</div>
              <div id="notificationOptionSupAll" class=" w-full p-2 text-center">delete all</div>
            </div>
          </div>
          <span class=" text-orange-500" id="notificationTime">${time}</span>
        </div>
      </div>
`;

const notificationElement = {
  title: '#notificationTitle',
  content: '#notificationContent',
  time: '#notificationTime',
  id: '#notificationElId',
};

modificationSubmitForm.addEventListener('submit', async (e) => {
  e.preventDefault();
  const form = new FormData(e.currentTarget);
  const username = form.get('username');
  const bio = form.get('bio');
  const link = form.get('link');
  const { id } = userDataset.dataset;
  const fetchBody = {
    username,
    bio,
    link,
    id,
  };
  const req = await fetch('/user/update', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(fetchBody),
  });
  const res = await req.json();
  if (res.success) {
    window.location.reload();
  }
  notificationPush(notificationsComponent.info('something went wrong'));
});

profileEditor.addEventListener('click', (e) => {
  e.preventDefault();
  userUpdatePanel.classList.remove('transUpdatePanelHide');
  userUpdatePanel.classList.add('transNotificationShow');
});

closeUserUpdatePanel.addEventListener('click', (e) => {
  e.preventDefault();
  userUpdatePanel.classList.remove('transNotificationShow');
  userUpdatePanel.classList.add('transUpdatePanelHide');
});

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
  if (errorComponent) {
    errorComponent.remove();
  }
  const regex = /[A-Z\s]/;
  if (e.currentTarget.value.length <= 0) {
    return;
  }
  if (regex.test(e.currentTarget.value)) {
    submissionBtn.disabled = true;
    userName.classList.add('wrong-data');
    const errorMessage = `<span class=" mt-1 text-red-500 font-bold" id="componentErrorForm">"${e.currentTarget.value}" have majuscule or space</span>`;
    userName.insertAdjacentHTML('afterend', errorMessage);
    return;
  }
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
});

socket.addEventListener('message', function (e) {
  const { data } = e;
  /**
   * @type {"connect" | "disconnect" | "message" | "notification"}
   */
  const type = data['type'];
  /**
   * @type {Record<string, unknown>}
   */
  const evData = data['data'];

  if (type && type === 'notification') {
    if (evData.notifications && Array.isArray(evData.notifications)) {
      const els = evData.notifications;
      els.forEach((el) => {
        notificationContainer.insertAdjacentHTML(
          'beforeend',
          notification(el.title, el.content, el.time, el.id)
        );
      });
      notificationContainer
        .querySelectorAll('#notificationElement')
        .forEach((el) => {
          el.querySelector('#notificationActivityOptions').addEventListener(
            'mouseenter',
            notificationShowOptions
          );
          el.querySelector('#notificationActivityOptions').addEventListener(
            'mouseleave',
            notificationHideOptions
          );
          el.querySelector('#notificationOptionSup').addEventListener(
            'click',
            deleteNotification
          );
          el.querySelector('#notificationOptionMark').addEventListener(
            'click',
            markNotificationAsRead
          );
          el.querySelector('#notificationOptionSupAll').addEventListener(
            'click',
            deleteAllNotifications
          );
        });
    }

    if (evData.action && evData.action === 'update') {
      notificationContainer.innerHTML = '';
      notificationContainer.insertAdjacentHTML(
        'afterbegin',
        notification(evData.title, evData.content, evData.time, evData.id)
      );
      notificationContainer
        .querySelector('#notificationElement')
        .querySelector('#notificationActivityOptions')
        .addEventListener('mouseenter', notificationShowOptions);
      notificationContainer
        .querySelector('#notificationElement')
        .querySelector('#notificationActivityOptions')
        .addEventListener('mouseleave', notificationHideOptions);
      notificationContainer
        .querySelector('#notificationElement')
        .querySelector('#notificationOptionSup')
        .addEventListener('click', deleteNotification);
      notificationContainer
        .querySelector('#notificationElement')
        .querySelector('#notificationOptionMark')
        .addEventListener('click', markNotificationAsRead);
      notificationPush(
        notificationsComponent.success(
          `${evData.title} <br/> ${evData.content}`
        )
      );
    }
    notificationPush(notificationsComponent.info(evData.data));
  }
});
