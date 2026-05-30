import { useState } from 'react'
 
function Connexion({ navigate, onConnexion }) {
  const [email, setEmail] = useState('')
  const [motDePasse, setMotDePasse] = useState('')
  const [erreur, setErreur] = useState('')
  const [loading, setLoading] = useState(false)
 
  const handleSubmit = async (e) => {
    e.preventDefault()
    setErreur('')
    setLoading(true)
 
    try {
      const res = await fetch('http://localhost/vitacare/backend/api/auth.php?action=connexion', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({ email, mot_de_passe: motDePasse })
      })
 
      const data = await res.json()
 
      if (!res.ok) {
        setErreur(data.error || 'Erreur de connexion')
      } else {
        onConnexion(data.utilisateur)
      }
    } catch {
      setErreur('Impossible de contacter le serveur')
    } finally {
      setLoading(false)
    }
  }
 
  const styles = {
    page: {
      minHeight: 'calc(100vh - 56px)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      backgroundColor: '#f9f9fb',
      padding: '24px',
    },
    card: {
      backgroundColor: '#fff',
      border: '1px solid #e5e5e5',
      borderRadius: '12px',
      padding: '40px',
      width: '100%',
      maxWidth: '420px',
    },
    title: {
      fontSize: '22px',
      fontWeight: '600',
      margin: '0 0 6px',
      color: '#222',
    },
    sub: {
      fontSize: '14px',
      color: '#888',
      margin: '0 0 28px',
    },
    field: {
      marginBottom: '16px',
    },
    label: {
      display: 'block',
      fontSize: '13px',
      color: '#555',
      marginBottom: '5px',
      fontWeight: '500',
    },
    input: {
      width: '100%',
      fontSize: '14px',
      padding: '10px 12px',
      borderRadius: '8px',
      border: '1px solid #ccc',
      fontFamily: 'Arial, sans-serif',
      boxSizing: 'border-box',
    },
    erreur: {
      fontSize: '13px',
      color: '#c0392b',
      backgroundColor: '#fdf0f0',
      border: '1px solid #f5c6c6',
      borderRadius: '6px',
      padding: '10px 12px',
      marginBottom: '16px',
    },
    btnPrimary: {
      width: '100%',
      padding: '11px',
      fontSize: '15px',
      fontWeight: '600',
      borderRadius: '8px',
      border: 'none',
      background: '#534AB7',
      color: '#fff',
      cursor: 'pointer',
      fontFamily: 'Arial, sans-serif',
      marginTop: '4px',
    },
    divider: {
      textAlign: 'center',
      fontSize: '13px',
      color: '#aaa',
      margin: '20px 0',
    },
    linkText: {
      textAlign: 'center',
      fontSize: '13px',
      color: '#666',
    },
    link: {
      color: '#534AB7',
      cursor: 'pointer',
      background: 'none',
      border: 'none',
      fontSize: '13px',
      fontFamily: 'Arial, sans-serif',
      textDecoration: 'underline',
    }
  }
 
  return (
    <div style={styles.page}>
      <div style={styles.card}>
        <h1 style={styles.title}>Se connecter</h1>
        <p style={styles.sub}>Accedez a votre espace personnel</p>
 
        {erreur && <div style={styles.erreur}>{erreur}</div>}
 
        <form onSubmit={handleSubmit}>
          <div style={styles.field}>
            <label style={styles.label}>Adresse e-mail</label>
            <input
              style={styles.input}
              type="email"
              placeholder="exemple@email.com"
              value={email}
              onChange={e => setEmail(e.target.value)}
              required
            />
          </div>
 
          <div style={styles.field}>
            <label style={styles.label}>Mot de passe</label>
            <input
              style={styles.input}
              type="password"
              placeholder="••••••••"
              value={motDePasse}
              onChange={e => setMotDePasse(e.target.value)}
              required
            />
          </div>
 
          <button style={styles.btnPrimary} type="submit" disabled={loading}>
            {loading ? 'Connexion...' : 'Valider'}
          </button>
        </form>
 
        <div style={styles.divider}>ou</div>
 
        <p style={styles.linkText}>
          Pas encore de compte ?{' '}
          <button style={styles.link} onClick={() => navigate('inscription')}>
            Creer un compte
          </button>
        </p>
      </div>
    </div>
  )
}
 
export default Connexion