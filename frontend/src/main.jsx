import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import { UserProvider } from './context/UserContext.jsx'
import { PageTransitionProvider } from './context/PageTransitionContext.jsx'
import './index.css'
import App from './App.jsx'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <BrowserRouter>
      <UserProvider>
        <PageTransitionProvider>
          <App />
        </PageTransitionProvider>
      </UserProvider>
    </BrowserRouter>
  </StrictMode>,
)
