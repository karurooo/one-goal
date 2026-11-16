import { createBrowserRouter, type RouteObject } from 'react-router-dom'
import { NotFoundPage } from './routes/errors/NotFoundPage'
import { HomePage } from './routes/home/HomePage'

// Exported separately so tests can mount the same routes in a memory router.
export const routes: RouteObject[] = [
  { path: '/', element: <HomePage /> },
  {
    // Lazy so the game stays out of the first load (NFR-PERF-02)
    path: '/laro/sipa',
    lazy: async () => ({ Component: (await import('./routes/laro/SipaPage')).SipaPage }),
  },
  { path: '*', element: <NotFoundPage /> },
]

export const router = createBrowserRouter(routes)
