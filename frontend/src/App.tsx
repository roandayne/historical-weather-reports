import './App.css'
import Dashboard from './pages/Dashboard'
import PublicPage from './components/PublicPage'

function App() {
  return (
    <div>
      <PublicPage>
        <Dashboard />
      </PublicPage>
    </div>
  )
}

export default App
