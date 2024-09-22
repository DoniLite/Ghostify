/* eslint-disable no-undef */
const socket = new WebSocket('http://0.0.0.0:3081/notifications');

socket.onopen = (ev) => {
  const dataset = localStorage.getItem('dataset');
  console.log(ev);
  const s = {
    eventType: 'data sending',
    data: dataset,
  };
  if (dataset !== null) socket.send(JSON.stringify(s));
  socket.dispatchEvent(new Event('data'));
};
socket.onerror = () => {
  console.error('connection error');
};
