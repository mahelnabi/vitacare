import { useState, useEffect } from 'react'
import Navbar from './components/Navbar.jsx'
import Accueil from './pages/Accueil.jsx'
import Connexion from './pages/Connexion.jsx'
import Inscription from './pages/Inscription.jsx'
import Dashboard from './pages/Dashboard.jsx'
import DashboardAdmin from './pages/DashboardAdmin.jsx'
import DashboardIntervenant from './pages/DashboardIntervenant.jsx'
import FicheService from './pages/FicheService.jsx'
import FicheIntervenant from './pages/FicheIntervenant.jsx'
import Activites from './pages/Activites.jsx'
import Intervenants from './pages/Intervenants.jsx'
import Panier from './pages/Panier.jsx'
import Profil from './pages/Profil.jsx'

function App() {
  const [page, setPage] = useState('accueil')
  const [user, setUser] = useState(null)
  const [serviceId, setServiceId] = useState(null)
  const [panierData, setPanierData] = useState(null)
  const [intervenantId, setIntervenantId] = useState(null)
  const [darkMode, setDarkMode] = useState(false)

  useEffect(() => {
    fetch('http://localhost/vitacare/backend/api/auth.php?action=me', { credentials: 'include' })
      .then(res => res.json())
      .then(data => { if (data.utilisateur) setUser(data.utilisateur) })
      .catch(() => {})
    const saved = localStorage.getItem('vitacare_dark')
    if (saved === 'true') setDarkMode(true)
  }, [])

  useEffect(() => {
    document.body.style.backgroundColor = darkMode ? '#16161e' : '#f9f9fb'
    document.body.style.color = darkMode ? '#e0e0e8' : '#222'
    document.body.style.transition = 'background-color 0.3s, color 0.3s'
    localStorage.setItem('vitacare_dark', darkMode)
  }, [darkMode])

  const toggleDarkMode = () => setDarkMode(prev => !prev)

  const navigate = (p, extra = null) => {
    setPage(p)
    if (extra && p === 'service') setServiceId(extra)
    if (extra && p === 'panier') setPanierData(extra)
    if (extra && p === 'intervenant') setIntervenantId(extra)
    window.scrollTo(0, 0)
  }

  const handleConnexion = (userData) => { setUser(userData); navigate('dashboard') }

  const handleDeconnexion = () => {
    fetch('http://localhost/vitacare/backend/api/auth.php?action=deconnexion', {
      method: 'POST', credentials: 'include'
    }).then(() => { setUser(null); navigate('accueil') })
  }

  const dm = {
    bg: darkMode ? '#16161e' : '#f9f9fb',
    cardBg: darkMode ? '#1e1e2e' : '#ffffff',
    text: darkMode ? '#e0e0e8' : '#222',
    textSec: darkMode ? '#8888a0' : '#666',
    border: darkMode ? '#2d2d4e' : '#e5e5e5',
  }

  const renderPage = () => {
    const props = { darkMode, dm }
    switch (page) {
      case 'accueil': return <Accueil navigate={navigate} darkMode={darkMode} />
      case 'connexion': return <Connexion navigate={navigate} onConnexion={handleConnexion} darkMode={darkMode} />
      case 'inscription': return <Inscription navigate={navigate} onConnexion={handleConnexion} darkMode={darkMode} />
      case 'dashboard':
        if (user && user.role === 'admin') return <DashboardAdmin user={user} navigate={navigate} darkMode={darkMode} />
        if (user && user.role === 'intervenant') return <DashboardIntervenant user={user} navigate={navigate} darkMode={darkMode} />
        return <Dashboard user={user} navigate={navigate} darkMode={darkMode} />
      case 'service': return <FicheService serviceId={serviceId} user={user} navigate={navigate} darkMode={darkMode} />
      case 'intervenant': return <FicheIntervenant intervenantId={intervenantId} user={user} navigate={navigate} darkMode={darkMode} />
      case 'activites': return <Activites user={user} navigate={navigate} darkMode={darkMode} />
      case 'intervenants': return <Intervenants navigate={navigate} darkMode={darkMode} />
      case 'panier': return <Panier panierData={panierData} user={user} navigate={navigate} darkMode={darkMode} />
      case 'profil': return <Profil user={user} setUser={setUser} navigate={navigate} darkMode={darkMode} />
      default: return <Accueil navigate={navigate} darkMode={darkMode} />
    }
  }

  return (
    <div style={{ minHeight: '100vh', backgroundColor: darkMode ? '#16161e' : '#f9f9fb', fontFamily: 'Arial, sans-serif', transition: 'background-color 0.3s' }}>
      <Navbar user={user} navigate={navigate} onDeconnexion={handleDeconnexion} darkMode={darkMode} toggleDarkMode={toggleDarkMode} />
      <main>{renderPage()}</main>
    </div>
  )
}

export default App