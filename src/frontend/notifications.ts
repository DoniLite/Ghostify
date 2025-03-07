export const notificationPopup = new Audio('/static/media/notify.mp3');
export const reactionPopup = new Audio('/static/media/popup.mp3');

export const notificationsComponent = {
  info: (message: unknown) => {
    return `<div class="alert alert-info">
        <span>${message}</span>
      </div>`;
  },
  success: (message: unknown) => {
    return `<div class="alert alert-success">
        <span>${message}</span>
      </div>`;
  },
  error: (message: unknown) => {
    return `<div class="alert alert-error">
        <span>${message}</span>
      </div>`;
  },
  warning: (message: unknown) => {
    return `<div class="alert alert-warning">
        <span>${message}</span>
      </div>`;
  },
};

export const notificationPush = (notification: string) => {
  const notificationContainer = document.querySelector('#flash');
  notificationContainer!.insertAdjacentHTML('beforeend', notification);
  const interval = setInterval(() => {
    notificationContainer!.childNodes[0].remove();
  }, 2000);
  setTimeout(() => {
    if (notificationContainer && notificationContainer.childNodes.length <= 0) {
      return clearInterval(interval);
    }
  }, 4000);
};

//externals...

// globalThis = App || {};
// App.notification = App.notification || {};
// App.notification = {
//   push: notificationPush,
//   info: notificationsComponent.info,
//   success: notificationsComponent.success,
//   error: notificationsComponent.error,
//   warning: notificationsComponent.warning,
//   notificationPopup,
//   reactionPopup,
// };
