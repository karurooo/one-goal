import { BrowserRouter, Route, Routes } from 'react-router-dom'

import { ErrorBoundary } from '@/components/error/ErrorBoundary'
import { QueryProvider } from '@/providers/QueryProvider'
import { LeaderboardPage } from '@/app/routes/leaderboard/LeaderboardPage'
import { PlayPage } from '@/app/routes/play/PlayPage'

export function App() {
  return (
    <ErrorBoundary>
      <QueryProvider>
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<PlayPage />} />
            <Route path="/leaderboard" element={<LeaderboardPage />} />
          </Routes>
        </BrowserRouter>
      </QueryProvider>
    </ErrorBoundary>
  )
}
