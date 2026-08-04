export function connectToSystem(onMessage){const s=new WebSocket(import.meta.env.VITE_WS_URL);s.onmessage=e=>onMessage(JSON.parse(e.data));return s}
