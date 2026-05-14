import { io } from "socket.io-client";

const SOCKET_SERVER_URL = import.meta.env.VITE_BACKEND_URL;

// Khởi tạo socket nhưng tắt autoConnect hoàn toàn
const socket = io(SOCKET_SERVER_URL, {
    transports: ["websocket"],
    autoConnect: false,
});

export default socket;