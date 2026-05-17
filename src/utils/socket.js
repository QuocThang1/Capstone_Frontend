import { io } from "socket.io-client";

const SOCKET_SERVER_URL = import.meta.env.VITE_BACKEND_URL;

const socket = io(SOCKET_SERVER_URL, {
    transports: ["websocket"],
    autoConnect: false,
});

export default socket;