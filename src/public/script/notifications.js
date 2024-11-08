/* eslint-disable no-undef */



export const notificationsComponent = {
    info: (message) => {
        return `<div class="alert alert-info">
        <span>${message}</span>
      </div>`;
    },
    success: (message) => {
        return `<div class="alert alert-success">
        <span>${message}</span>
      </div>`
    }
}

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
}

