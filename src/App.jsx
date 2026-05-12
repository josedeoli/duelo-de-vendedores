import ArenaLayout from './components/ArenaLayout'

export default function App() {
  const params = new URLSearchParams(window.location.search)
  const dueloId = params.get('duelo') || '1'
  return <ArenaLayout dueloId={dueloId} />
}
