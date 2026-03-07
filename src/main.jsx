import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { ToastContainer } from "react-toastify";
import { AuthWrapper } from "./context/auth.wrapper.jsx";
import 'react-toastify/dist/ReactToastify.css';
import AppRouter from './appRouter.jsx'
import './index.css'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <AuthWrapper>
      <AppRouter />
      <ToastContainer position="top-right" newestOnTop />
    </AuthWrapper>
  </StrictMode>,
)
