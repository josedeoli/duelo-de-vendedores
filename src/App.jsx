import ArenaLayout from './components/ArenaLayout'
import AdminPage from './components/AdminPage'

export default function App() {
  const params = new URLSearchParams(window.location.search)
  const isAdmin = params.get('admin') === 'true'
  const dueloId = params.get('duelo') || '1'

  if (isAdmin) return <AdminPage />
  return <ArenaLayout dueloId={dueloId} />
}
