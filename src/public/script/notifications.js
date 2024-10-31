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
  let interval
  notificationContainer.insertAdjacentHTML('beforeend', notification);
  if(notificationContainer && notificationContainer.childNodes.length > 0) {
    interval = setInterval(() => {
      notificationContainer.childNodes[0].remove();
    }, 2000);
  }
  clearInterval(interval)
}

