import { useState } from 'react'
 
function Inscription({ navigate, onConnexion }) {
  const [form, setForm] = useState({
    nom: '',
    prenom: '',
    email: '',
    telephone: '',
    mot_de_passe: '',
    confirmer: '',
    role: 'patient'
  })
  const [erreur, setErreur] = useState('')
  const [loading, setLoading] = useState(false)
 
  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value })
  }
 
  const handleSubmit = async (e) => {
    e.preventDefault()
    setErreur('')
 
    if (form.mot_de_passe !== form.confirmer) {
      setErreur('Les mots de passe ne correspondent pas')
      return
    }
 
    if (form.mot_de_passe.length < 6) {
      setErreur('Le mot de passe doit contenir au moins 6 caracteres')
      return
    }
 
    setLoading(true)
 
    try {
      const res = await fetch('http://localhost/vitacare/backend/api/auth.php?action=inscription', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({
          nom: form.nom,
          prenom: form.prenom,
          email: form.email,
          telephone: form.telephone,
          mot_de_passe: form.mot_de_passe,
          role: form.role
        })
      })
 
      const data = await res.json()
 
      if (!res.ok) {
        setErreur(data.error || 'Erreur lors de l inscription')
      } else {
        const resLogin = await fetch('http://localhost/vitacare/backend/api/auth.php?action=connexion', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          credentials: 'include',
          body: JSON.stringify({ email: form.email, mot_de_passe: form.mot_de_passe })
        })
        const dataLogin = await resLogin.json()
        if (dataLogin.utilisateur) {
          onConnexion(dataLogin.utilisateur)
        } else {
          navigate('connexion')
        }
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
      maxWidth: '480px',
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
    row: {
      display: 'grid',
      gridTemplateColumns: '1fr 1fr',
      gap: '12px',
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
    select: {
      width: '100%',
      fontSize: '14px',
      padding: '10px 12px',
      borderRadius: '8px',
      border: '1px solid #ccc',
      fontFamily: 'Arial, sans-serif',
      boxSizing: 'border-box',
      backgroundColor: '#fff',
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
    linkText: {
      textAlign: 'center',
      fontSize: '13px',
      color: '#666',
      marginTop: '20px',
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
        <h1 style={styles.title}>Creer un compte</h1>
        <p style={styles.sub}>Rejoignez VitaCare gratuitement</p>
 
        {erreur && <div style={styles.erreur}>{erreur}</div>}
 
        <form onSubmit={handleSubmit}>
          <div style={styles.row}>
            <div style={styles.field}>
              <label style={styles.label}>Nom</label>
              <input
                style={styles.input}
                type="text"
                name="nom"
                placeholder="Dupont"
                value={form.nom}
                onChange={handleChange}
                required
              />
            </div>
            <div style={styles.field}>
              <label style={styles.label}>Prenom</label>
              <input
                style={styles.input}
                type="text"
                name="prenom"
                placeholder="Marie"
                value={form.prenom}
                onChange={handleChange}
                required
              />
            </div>
          </div>
 
          <div style={styles.field}>
            <label style={styles.label}>Adresse e-mail</label>
            <input
              style={styles.input}
              type="email"
              name="email"
              placeholder="exemple@email.com"
              value={form.email}
              onChange={handleChange}
              required
            />
          </div>
 
          <div style={styles.field}>
            <label style={styles.label}>Telephone</label>
            <input
              style={styles.input}
              type="text"
              name="telephone"
              placeholder="+33 6 00 00 00 00"
              value={form.telephone}
              onChange={handleChange}
            />
          </div>
 
          <div style={styles.field}>
            <label style={styles.label}>Mot de passe</label>
            <input
              style={styles.input}
              type="password"
              name="mot_de_passe"
              placeholder="••••••••"
              value={form.mot_de_passe}
              onChange={handleChange}
              required
            />
          </div>
 
          <div style={styles.field}>
            <label style={styles.label}>Confirmer le mot de passe</label>
            <input
              style={styles.input}
              type="password"
              name="confirmer"
              placeholder="••••••••"
              value={form.confirmer}
              onChange={handleChange}
              required
            />
          </div>
 
          <div style={styles.field}>
            <label style={styles.label}>Je m'inscris en tant que</label>
            <select
              style={styles.select}
              name="role"
              value={form.role}
              onChange={handleChange}
            >
              <option value="patient">Patient</option>
              <option value="intervenant">Intervenant</option>
            </select>
          </div>
 
          <button style={styles.btnPrimary} type="submit" disabled={loading}>
            {loading ? 'Inscription...' : 'Soumettre'}
          </button>
        </form>
 
        <p style={styles.linkText}>
          Deja inscrit ?{' '}
          <button style={styles.link} onClick={() => navigate('connexion')}>
            Se connecter
          </button>
        </p>
      </div>
    </div>
  )
}
 
export default Inscription