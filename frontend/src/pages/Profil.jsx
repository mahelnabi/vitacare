import { useState } from 'react'
 
function Profil({ user, setUser, navigate }) {
  const [form, setForm] = useState({
    nom: user?.nom || '',
    prenom: user?.prenom || '',
    email: user?.email || '',
    telephone: user?.telephone || '',
    mot_de_passe: '',
    confirmer: ''
  })
  const [message, setMessage] = useState('')
  const [erreur, setErreur] = useState('')
  const [loading, setLoading] = useState(false)
 
  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value })
 
  const handleSubmit = async () => {
    setMessage(''); setErreur('')
    if (form.mot_de_passe && form.mot_de_passe !== form.confirmer) {
      setErreur('Les mots de passe ne correspondent pas')
      return
    }
    if (form.mot_de_passe && form.mot_de_passe.length < 6) {
      setErreur('Le mot de passe doit contenir au moins 6 caracteres')
      return
    }
    setLoading(true)
    try {
      const res = await fetch('http://localhost/vitacare/backend/api/profil.php?action=modifier', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({
          nom: form.nom,
          prenom: form.prenom,
          telephone: form.telephone,
          mot_de_passe: form.mot_de_passe || null
        })
      })
      const data = await res.json()
      if (!res.ok) { setErreur(data.error) }
      else {
        setMessage('Profil mis a jour avec succes.')
        if (setUser) setUser(prev => ({ ...prev, nom: form.nom, prenom: form.prenom }))
      }
    } catch { setErreur('Erreur serveur') }
    setLoading(false)
  }
 
  const styles = {
    page: { maxWidth: '600px', margin: '0 auto', padding: '40px 24px' },
    title: { fontSize: '22px', fontWeight: '600', margin: '0 0 6px', color: '#222' },
    sub: { fontSize: '14px', color: '#888', margin: '0 0 28px' },
    card: { backgroundColor: '#fff', border: '1px solid #e5e5e5', borderRadius: '12px', padding: '28px' },
    field: { marginBottom: '16px' },
    label: { display: 'block', fontSize: '12px', color: '#555', marginBottom: '4px', fontWeight: '500' },
    input: { width: '100%', fontSize: '14px', padding: '10px 12px', borderRadius: '8px', border: '1px solid #ccc', fontFamily: 'Arial, sans-serif', boxSizing: 'border-box' },
    inputDisabled: { width: '100%', fontSize: '14px', padding: '10px 12px', borderRadius: '8px', border: '1px solid #e5e5e5', fontFamily: 'Arial, sans-serif', boxSizing: 'border-box', backgroundColor: '#f9f9fb', color: '#888' },
    row: { display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' },
    divider: { borderTop: '1px solid #e5e5e5', margin: '20px 0' },
    sectionTitle: { fontSize: '14px', fontWeight: '600', margin: '0 0 14px', color: '#222' },
    btnPrimary: { width: '100%', padding: '11px', fontSize: '14px', fontWeight: '600', borderRadius: '8px', border: 'none', background: '#534AB7', color: '#fff', cursor: 'pointer', fontFamily: 'Arial, sans-serif' },
    btnOutline: { width: '100%', padding: '10px', fontSize: '13px', borderRadius: '8px', border: '1px solid #ccc', background: 'transparent', color: '#666', cursor: 'pointer', fontFamily: 'Arial, sans-serif', marginTop: '8px' },
    message: { fontSize: '13px', color: '#085041', backgroundColor: '#e1f5ee', border: '1px solid #5dcaa5', borderRadius: '6px', padding: '10px 12px', marginBottom: '16px' },
    erreur: { fontSize: '13px', color: '#c0392b', backgroundColor: '#fdf0f0', border: '1px solid #f5c6c6', borderRadius: '6px', padding: '10px 12px', marginBottom: '16px' },
  }
 
  if (!user) { navigate('connexion'); return null }
 
  return (
    <div style={styles.page}>
      <h1 style={styles.title}>Mon profil</h1>
      <p style={styles.sub}>Modifiez vos informations personnelles</p>
      <div style={styles.card}>
        {message && <div style={styles.message}>{message}</div>}
        {erreur && <div style={styles.erreur}>{erreur}</div>}
 
        <p style={styles.sectionTitle}>Informations personnelles</p>
        <div style={styles.row}>
          <div style={styles.field}>
            <label style={styles.label}>Nom</label>
            <input style={styles.input} type="text" name="nom" value={form.nom} onChange={handleChange} />
          </div>
          <div style={styles.field}>
            <label style={styles.label}>Prenom</label>
            <input style={styles.input} type="text" name="prenom" value={form.prenom} onChange={handleChange} />
          </div>
        </div>
        <div style={styles.field}>
          <label style={styles.label}>Adresse e-mail</label>
          <input style={styles.inputDisabled} type="email" value={form.email} disabled />
          <p style={{ fontSize: '11px', color: '#aaa', margin: '4px 0 0' }}>L'email ne peut pas etre modifie</p>
        </div>
        <div style={styles.field}>
          <label style={styles.label}>Telephone</label>
          <input style={styles.input} type="text" name="telephone" value={form.telephone} onChange={handleChange} placeholder="+33 6 00 00 00 00" />
        </div>
 
        <div style={styles.divider} />
        <p style={styles.sectionTitle}>Changer le mot de passe</p>
        <div style={styles.field}>
          <label style={styles.label}>Nouveau mot de passe (laisser vide pour ne pas changer)</label>
          <input style={styles.input} type="password" name="mot_de_passe" value={form.mot_de_passe} onChange={handleChange} placeholder="••••••••" />
        </div>
        <div style={styles.field}>
          <label style={styles.label}>Confirmer le mot de passe</label>
          <input style={styles.input} type="password" name="confirmer" value={form.confirmer} onChange={handleChange} placeholder="••••••••" />
        </div>
 
        <button style={styles.btnPrimary} onClick={handleSubmit} disabled={loading}>
          {loading ? 'Enregistrement...' : 'Enregistrer les modifications'}
        </button>
        <button style={styles.btnOutline} onClick={() => navigate('dashboard')}>
          Retour au dashboard
        </button>
      </div>
    </div>
  )
}
 
export default Profil