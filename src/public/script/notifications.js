/* eslint-disable no-undef */


export const notificationPopup = new Audio('/static/media/notify.mp3');
export const reactionPopup = new Audio('/static/media/popup.mp3');


export const notificationsComponent = {
  info: (message) => {
    return `<div class="alert alert-info">
        <span>${message}</span>
      </div>`;
  },
  success: (message) => {
    return `<div class="alert alert-success">
        <span>${message}</span>
      </div>`;
  },
  error: (message) => {
    return `<div class="alert alert-error">
        <span>${message}</span>
      </div>`;
  },
  warning: (message) => {
    return `<div class="alert alert-warning">
        <span>${message}</span>
      </div>`;
  },
};

export const notificationPush = (notification) => {
  const notificationContainer = document.querySelector('#flash');
  notificationContainer.insertAdjacentHTML('beforeend', notification);
  const interval = setInterval(() => {
    notificationContainer.childNodes[0].remove();
  }, 2000);
  setTimeout(() => {
    if (notificationContainer && notificationContainer.childNodes.length <= 0) {
      return clearInterval(interval);
    }
  }, 4000);
};


//externals...
window.App = window.App || {};
App.notification = App.notification || {};
App.notification.push = notificationPush;
App.notification.info = notificationsComponent.info;
App.notification.success = notificationsComponent.success;
App.notification.error = notificationsComponent.error;
App.notification.warning = notificationsComponent.warning;
App.notification.notificationPopup = notificationPopup;
App.notification.reactionPopup = reactionPopup;