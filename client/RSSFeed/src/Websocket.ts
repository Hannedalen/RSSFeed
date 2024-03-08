import ReconnectingWebSocket from "reconnecting-websocket";

const rws = new ReconnectingWebSocket('ws://localhost:3000');

rws.addEventListener('open', () => {
    console.log('Connected to WebSocket server');
})

rws.addEventListener('message', (event) => {
    const data = JSON.parse(event.data);
    console.log('Data recieved: ', data);
})

export default rws;