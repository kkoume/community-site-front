
const createWebSocket = () => {
  const ws =  new WebSocket(`wss://api.illrreumbow.store/community/chattings`);
  ws.onopen = () => {
    console.log('WebSocket connection succeed');
  };
  return ws;
};

export default createWebSocket;