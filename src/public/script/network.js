const socket = new WebSocket('http://0.0.0.0:3081/notifications');
socket.onopen = (ev) => {
  console.log('open connection');
  const s = {
    message: 'hey everyone'
  }
  socket.send(JSON.stringify(s));
};
socket.onerror = () => {
  console.error('connection error');
};
