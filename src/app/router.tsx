import { createBrowserRouter } from 'react-router-dom'
import { NotFoundPage } from './routes/errors/NotFoundPage'
import { HomePage } from './routes/home/HomePage'

export const router = createBrowserRouter([
  { path: '/', element: <HomePage /> },
  {
    // Lazy so the game stays out of the first load (NFR-PERF-02)
    path: '/laro/sipa',
    lazy: async () => ({ Component: (await import('./routes/laro/SipaPage')).SipaPage }),
  },
  { path: '*', element: <NotFoundPage /> },
])
