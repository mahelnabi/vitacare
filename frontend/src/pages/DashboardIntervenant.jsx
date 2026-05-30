import { useState, useEffect } from 'react'
 
function DashboardIntervenant({ user, navigate }) {
  const [rdvs, setRdvs] = useState([])
  const [dispos, setDispos] = useState([])
  const [stats, setStats] = useState({ total: 0, ce_mois: 0 })
  const [loading, setLoading] = useState(true)
  const [onglet, setOnglet] = useState('accueil')
  const [form, setForm] = useState({ date: '', heure_debut: '', heure_fin: '' })
  const [message, setMessage] = useState('')
  const [erreur, setErreur] = useState('')
 
  useEffect(() => {
    if (!user) { navigate('connexion'); return }
    chargerDonnees()
  }, [user])
 
  const chargerDonnees = async () => {
    setLoading(true)
    try {
      const [rdvRes, dispoRes] = await Promise.all([
        fetch('http://localhost/vitacare/backend/api/rendezvous.php?action=mes-rdv-intervenant', { credentials: 'include' }),
        fetch(`http://localhost/vitacare/backend/api/disponibilites.php?action=liste&id_intervenant=${user.id}`)
      ])
      const rdvData = await rdvRes.json()
      const dispoData = await dispoRes.json()
      const rdvList = rdvData.rdvs || []
      setRdvs(rdvList)
      setDispos(dispoData.disponibilites || [])
      const now = new Date()
      const ceMois = rdvList.filter(r => {
        const d = new Date(r.date_heure)
        return d.getMonth() === now.getMonth() && d.getFullYear() === now.getFullYear()
      }).length
      setStats({ total: rdvList.length, ce_mois: ceMois })
    } catch {}
    setLoading(false)
  }
 
  const ajouterDispo = async () => {
    setMessage(''); setErreur('')
    if (!form.date || !form.heure_debut || !form.heure_fin) {
      setErreur('Tous les champs sont obligatoires')
      return
    }
    try {
      const res = await fetch('http://localhost/vitacare/backend/api/disponibilites.php?action=ajouter', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify(form)
      })
      const data = await res.json()
      if (!res.ok) { setErreur(data.error) }
      else {
        setMessage('Disponibilite ajoutee.')
        setForm({ date: '', heure_debut: '', heure_fin: '' })
        chargerDonnees()
      }
    } catch { setErreur('Erreur serveur') }
  }
 
  const mois = ['Jan','Fev','Mar','Avr','Mai','Jun','Jul','Aou','Sep','Oct','Nov','Dec']
 
  const styles = {
    layout: { display: 'grid', gridTemplateColumns: '220px 1fr', minHeight: 'calc(100vh - 56px)' },
    sidebar: { borderRight: '1px solid #e5e5e5', backgroundColor: '#f9f9fb', padding: '20px 0' },
    sidebarHeader: { padding: '0 16px 16px', borderBottom: '1px solid #e5e5e5', marginBottom: '12px' },
    avatar: { width: '44px', height: '44px', borderRadius: '50%', background: '#e1f5ee', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: '600', color: '#1D9E75', fontSize: '14px', marginBottom: '8px' },
    userName: { fontSize: '14px', fontWeight: '600', margin: '0 0 2px' },
    userRole: { fontSize: '12px', color: '#1D9E75', margin: 0, fontWeight: '500' },
    navItem: (active) => ({ display: 'flex', alignItems: 'center', gap: '10px', padding: '10px 16px', fontSize: '13px', color: active ? '#222' : '#666', fontWeight: active ? '600' : '400', borderLeft: active ? '2px solid #1D9E75' : '2px solid transparent', backgroundColor: active ? '#fff' : 'transparent', cursor: 'pointer', border: 'none', width: '100%', textAlign: 'left', fontFamily: 'Arial, sans-serif' }),
    content: { padding: '28px', backgroundColor: '#fff' },
    pageTitle: { fontSize: '20px', fontWeight: '600', margin: '0 0 4px', color: '#222' },
    pageSub: { fontSize: '13px', color: '#888', margin: '0 0 24px' },
    metrics: { display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '12px', marginBottom: '28px' },
    metric: { backgroundColor: '#f0fdf8', borderRadius: '8px', padding: '14px', border: '1px solid #d1fae5' },
    metricLabel: { fontSize: '12px', color: '#888', margin: '0 0 6px' },
    metricVal: { fontSize: '24px', fontWeight: '600', margin: 0, color: '#222' },
    sectionTitle: { fontSize: '15px', fontWeight: '600', margin: '0 0 12px', color: '#222' },
    rdvCard: { display: 'flex', alignItems: 'center', gap: '14px', padding: '12px 14px', border: '1px solid #e5e5e5', borderRadius: '8px', marginBottom: '8px' },
    rdvDate: { textAlign: 'center', minWidth: '40px' },
    rdvDay: { fontSize: '20px', fontWeight: '600', color: '#1D9E75', lineHeight: 1 },
    rdvMonth: { fontSize: '11px', color: '#888', textTransform: 'uppercase' },
    rdvInfo: { flex: 1 },
    rdvTitle: { fontSize: '13px', fontWeight: '600', margin: '0 0 2px' },
    rdvSub: { fontSize: '12px', color: '#888', margin: 0 },
    status: (s) => ({ fontSize: '11px', padding: '3px 10px', borderRadius: '10px', background: s === 'confirme' ? '#e1f5ee' : s === 'annule' ? '#fdf0f0' : '#faeeda', color: s === 'confirme' ? '#085041' : s === 'annule' ? '#c0392b' : '#633806' }),
    field: { marginBottom: '14px' },
    label: { display: 'block', fontSize: '12px', color: '#555', marginBottom: '4px', fontWeight: '500' },
    input: { width: '100%', fontSize: '14px', padding: '9px 12px', borderRadius: '8px', border: '1px solid #ccc', fontFamily: 'Arial, sans-serif', boxSizing: 'border-box' },
    btnPrimary: { padding: '10px 20px', fontSize: '13px', fontWeight: '600', borderRadius: '8px', border: 'none', background: '#1D9E75', color: '#fff', cursor: 'pointer', fontFamily: 'Arial, sans-serif' },
    msgSucces: { fontSize: '13px', color: '#085041', backgroundColor: '#e1f5ee', border: '1px solid #5dcaa5', borderRadius: '6px', padding: '10px 12px', marginBottom: '12px' },
    msgErreur: { fontSize: '13px', color: '#c0392b', backgroundColor: '#fdf0f0', border: '1px solid #f5c6c6', borderRadius: '6px', padding: '10px 12px', marginBottom: '12px' },
    dispoCard: { display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '10px 14px', border: '1px solid #e5e5e5', borderRadius: '8px', marginBottom: '6px', fontSize: '13px' },
    twoCol: { display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' },
    emptyMsg: { fontSize: '13px', color: '#aaa', textAlign: 'center', padding: '20px' },
    loading: { textAlign: 'center', padding: '80px', color: '#888' },
    formBox: { backgroundColor: '#f9f9fb', border: '1px solid #e5e5e5', borderRadius: '10px', padding: '20px', marginBottom: '20px' },
    row3: { display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '12px', marginBottom: '14px' }
  }
 
  if (!user) return null
  if (loading) return <p style={styles.loading}>Chargement...</p>
 
  const rdvsAVenir = rdvs.filter(r => r.statut !== 'annule' && new Date(r.date_heure) >= new Date())
  const disposLibres = dispos.filter(d => d.statut === 'libre')
 
  return (
    <div style={styles.layout}>
      <div style={styles.sidebar}>
        <div style={styles.sidebarHeader}>
          <div style={styles.avatar}>{user.prenom[0]}{user.nom[0]}</div>
          <p style={styles.userName}>{user.prenom} {user.nom}</p>
          <p style={styles.userRole}>Intervenant</p>
        </div>
        <button style={styles.navItem(onglet === 'accueil')} onClick={() => setOnglet('accueil')}>Tableau de bord</button>
        <button style={styles.navItem(onglet === 'rdvs')} onClick={() => setOnglet('rdvs')}>Mes rendez-vous ({rdvsAVenir.length})</button>
        <button style={styles.navItem(onglet === 'dispos')} onClick={() => setOnglet('dispos')}>Mes disponibilites ({disposLibres.length})</button>
        <button style={styles.navItem(false)} onClick={() => navigate('accueil')}>Retour au catalogue</button>
      </div>
 
      <div style={styles.content}>
        {onglet === 'accueil' && (
          <>
            <p style={styles.pageTitle}>Bonjour, {user.prenom}</p>
            <p style={styles.pageSub}>Voici un resume de votre activite sur VitaCare</p>
            <div style={styles.metrics}>
              <div style={styles.metric}><p style={styles.metricLabel}>RDV a venir</p><p style={styles.metricVal}>{rdvsAVenir.length}</p></div>
              <div style={styles.metric}><p style={styles.metricLabel}>RDV ce mois</p><p style={styles.metricVal}>{stats.ce_mois}</p></div>
              <div style={styles.metric}><p style={styles.metricLabel}>Creneaux libres</p><p style={styles.metricVal}>{disposLibres.length}</p></div>
            </div>
            <p style={styles.sectionTitle}>Prochains rendez-vous</p>
            {rdvsAVenir.length === 0 && <p style={styles.emptyMsg}>Aucun rendez-vous a venir</p>}
            {rdvsAVenir.slice(0, 5).map(rdv => {
              const d = new Date(rdv.date_heure)
              return (
                <div key={rdv.ID_rdv} style={styles.rdvCard}>
                  <div style={styles.rdvDate}>
                    <div style={styles.rdvDay}>{d.getDate()}</div>
                    <div style={styles.rdvMonth}>{mois[d.getMonth()]}</div>
                  </div>
                  <div style={styles.rdvInfo}>
                    <p style={styles.rdvTitle}>{rdv.nom_service}</p>
                    <p style={styles.rdvSub}>{rdv.patient_prenom} {rdv.patient_nom} — {d.getHours()}h{String(d.getMinutes()).padStart(2,'0')}</p>
                  </div>
                  <span style={styles.status(rdv.statut)}>{rdv.statut}</span>
                </div>
              )
            })}
          </>
        )}
 
        {onglet === 'rdvs' && (
          <>
            <p style={styles.pageTitle}>Mes rendez-vous</p>
            <p style={styles.pageSub}>Historique complet de vos consultations</p>
            {rdvs.length === 0 && <p style={styles.emptyMsg}>Aucun rendez-vous</p>}
            {rdvs.map(rdv => {
              const d = new Date(rdv.date_heure)
              return (
                <div key={rdv.ID_rdv} style={styles.rdvCard}>
                  <div style={styles.rdvDate}>
                    <div style={styles.rdvDay}>{d.getDate()}</div>
                    <div style={styles.rdvMonth}>{mois[d.getMonth()]}</div>
                  </div>
                  <div style={styles.rdvInfo}>
                    <p style={styles.rdvTitle}>{rdv.nom_service}</p>
                    <p style={styles.rdvSub}>{rdv.patient_prenom} {rdv.patient_nom} — {rdv.duree_min} min — {rdv.tarif} €</p>
                  </div>
                  <span style={styles.status(rdv.statut)}>{rdv.statut}</span>
                </div>
              )
            })}
          </>
        )}
 
        {onglet === 'dispos' && (
          <>
            <p style={styles.pageTitle}>Mes disponibilites</p>
            <p style={styles.pageSub}>Gerez vos creneaux horaires</p>
 
            <div style={styles.formBox}>
              <p style={{ fontSize: '14px', fontWeight: '600', margin: '0 0 14px' }}>Ajouter un creneau</p>
              {message && <div style={styles.msgSucces}>{message}</div>}
              {erreur && <div style={styles.msgErreur}>{erreur}</div>}
              <div style={styles.row3}>
                <div style={styles.field}>
                  <label style={styles.label}>Date</label>
                  <input style={styles.input} type="date" value={form.date} onChange={e => setForm({...form, date: e.target.value})} />
                </div>
                <div style={styles.field}>
                  <label style={styles.label}>Heure debut</label>
                  <input style={styles.input} type="time" value={form.heure_debut} onChange={e => setForm({...form, heure_debut: e.target.value})} />
                </div>
                <div style={styles.field}>
                  <label style={styles.label}>Heure fin</label>
                  <input style={styles.input} type="time" value={form.heure_fin} onChange={e => setForm({...form, heure_fin: e.target.value})} />
                </div>
              </div>
              <button style={styles.btnPrimary} onClick={ajouterDispo}>Ajouter ce creneau</button>
            </div>
 
            <p style={styles.sectionTitle}>Creneaux a venir ({disposLibres.length} libres)</p>
            {dispos.length === 0 && <p style={styles.emptyMsg}>Aucun creneau enregistre</p>}
            {dispos.map(d => (
              <div key={d.ID_dispo} style={styles.dispoCard}>
                <span style={{ fontWeight: '500' }}>{d.date}</span>
                <span style={{ color: '#666' }}>{d.heure_debut.slice(0,5)} — {d.heure_fin.slice(0,5)}</span>
                <span style={{ fontSize: '11px', padding: '3px 10px', borderRadius: '10px', background: d.statut === 'libre' ? '#e1f5ee' : '#faeeda', color: d.statut === 'libre' ? '#085041' : '#633806' }}>{d.statut}</span>
              </div>
            ))}
          </>
        )}
      </div>
    </div>
  )
}
 
export default DashboardIntervenant