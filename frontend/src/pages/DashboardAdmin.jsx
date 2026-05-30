import { useState, useEffect } from 'react'
 
function DashboardAdmin({ user, navigate }) {
  const [stats, setStats] = useState(null)
  const [utilisateurs, setUtilisateurs] = useState([])
  const [rdvs, setRdvs] = useState([])
  const [services, setServices] = useState([])
  const [loading, setLoading] = useState(true)
  const [onglet, setOnglet] = useState('accueil')
  const [formService, setFormService] = useState({ nom_service: '', description: '', duree_min: '', tarif: '', categorie: 'Bien-etre' })
  const [msgService, setMsgService] = useState('')
  const [errService, setErrService] = useState('')
  const [msgRole, setMsgRole] = useState('')
 
  useEffect(() => {
    if (!user) { navigate('connexion'); return }
    chargerDonnees()
  }, [user])
 
  const chargerDonnees = async () => {
    setLoading(true)
    try {
      const [statsRes, usersRes, rdvsRes, servicesRes] = await Promise.all([
        fetch('http://localhost/vitacare/backend/api/admin.php?action=stats', { credentials: 'include' }),
        fetch('http://localhost/vitacare/backend/api/admin.php?action=utilisateurs', { credentials: 'include' }),
        fetch('http://localhost/vitacare/backend/api/admin.php?action=rdvs', { credentials: 'include' }),
        fetch('http://localhost/vitacare/backend/api/services.php?action=liste')
      ])
      setStats(await statsRes.json())
      setUtilisateurs((await usersRes.json()).utilisateurs || [])
      setRdvs((await rdvsRes.json()).rdvs || [])
      setServices((await servicesRes.json()).services || [])
    } catch {}
    setLoading(false)
  }
 
  const supprimerUtilisateur = async (id) => {
    if (!window.confirm('Supprimer cet utilisateur ?')) return
    const res = await fetch('http://localhost/vitacare/backend/api/admin.php?action=supprimer-utilisateur', {
      method: 'POST', headers: { 'Content-Type': 'application/json' }, credentials: 'include',
      body: JSON.stringify({ id })
    })
    const data = await res.json()
    if (res.ok) setUtilisateurs(prev => prev.filter(u => u.ID_utilisateur !== id))
    else alert(data.error)
  }
 
  const changerRole = async (id, nouveauRole) => {
    const res = await fetch('http://localhost/vitacare/backend/api/admin.php?action=changer-role', {
      method: 'POST', headers: { 'Content-Type': 'application/json' }, credentials: 'include',
      body: JSON.stringify({ id, role: nouveauRole })
    })
    const data = await res.json()
    if (res.ok) {
      setUtilisateurs(prev => prev.map(u => u.ID_utilisateur === id ? { ...u, role: nouveauRole } : u))
      setMsgRole('Role mis a jour.')
      setTimeout(() => setMsgRole(''), 3000)
    } else alert(data.error)
  }
 
  const annulerRdv = async (id) => {
    if (!window.confirm('Annuler ce rendez-vous ?')) return
    const res = await fetch('http://localhost/vitacare/backend/api/admin.php?action=supprimer-rdv', {
      method: 'POST', headers: { 'Content-Type': 'application/json' }, credentials: 'include',
      body: JSON.stringify({ id })
    })
    if (res.ok) setRdvs(prev => prev.map(r => r.ID_rdv === id ? { ...r, statut: 'annule' } : r))
  }
 
  const validerRdv = async (id) => {
    const res = await fetch('http://localhost/vitacare/backend/api/admin.php?action=valider-rdv', {
      method: 'POST', headers: { 'Content-Type': 'application/json' }, credentials: 'include',
      body: JSON.stringify({ id })
    })
    if (res.ok) setRdvs(prev => prev.map(r => r.ID_rdv === id ? { ...r, statut: 'confirme' } : r))
  }
 
  const ajouterService = async () => {
    setMsgService(''); setErrService('')
    if (!formService.nom_service || !formService.duree_min || !formService.tarif || !formService.categorie) {
      setErrService('Tous les champs sont obligatoires')
      return
    }
    const res = await fetch('http://localhost/vitacare/backend/api/services.php?action=ajouter', {
      method: 'POST', headers: { 'Content-Type': 'application/json' }, credentials: 'include',
      body: JSON.stringify(formService)
    })
    const data = await res.json()
    if (!res.ok) { setErrService(data.error) }
    else {
      setMsgService('Service ajoute avec succes.')
      setFormService({ nom_service: '', description: '', duree_min: '', tarif: '', categorie: 'Bien-etre' })
      chargerDonnees()
    }
  }
 
  const supprimerService = async (id) => {
    if (!window.confirm('Supprimer ce service ?')) return
    const res = await fetch(`http://localhost/vitacare/backend/api/services.php?action=supprimer&id=${id}`, {
      method: 'DELETE', credentials: 'include'
    })
    if (res.ok) setServices(prev => prev.filter(s => s.ID_service !== id))
  }
 
  const mois = ['Jan','Fev','Mar','Avr','Mai','Jun','Jul','Aou','Sep','Oct','Nov','Dec']
 
  const styles = {
    layout: { display: 'grid', gridTemplateColumns: '220px 1fr', minHeight: 'calc(100vh - 56px)' },
    sidebar: { borderRight: '1px solid #e5e5e5', backgroundColor: '#fffdf5', padding: '20px 0' },
    sidebarHeader: { padding: '0 16px 16px', borderBottom: '1px solid #e5e5e5', marginBottom: '12px' },
    avatar: { width: '44px', height: '44px', borderRadius: '50%', background: '#faeeda', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: '600', color: '#BA7517', fontSize: '14px', marginBottom: '8px' },
    userName: { fontSize: '14px', fontWeight: '600', margin: '0 0 2px' },
    userRole: { fontSize: '12px', color: '#BA7517', margin: 0, fontWeight: '500' },
    navSection: { fontSize: '11px', color: '#aaa', padding: '12px 16px 4px', textTransform: 'uppercase', letterSpacing: '0.5px' },
    navItem: (active) => ({ display: 'flex', alignItems: 'center', gap: '10px', padding: '10px 16px', fontSize: '13px', color: active ? '#222' : '#666', fontWeight: active ? '600' : '400', borderLeft: active ? '2px solid #BA7517' : '2px solid transparent', backgroundColor: active ? '#fff' : 'transparent', cursor: 'pointer', border: 'none', width: '100%', textAlign: 'left', fontFamily: 'Arial, sans-serif' }),
    content: { padding: '28px', backgroundColor: '#fff' },
    pageTitle: { fontSize: '20px', fontWeight: '600', margin: '0 0 4px', color: '#222' },
    pageSub: { fontSize: '13px', color: '#888', margin: '0 0 24px' },
    metrics: { display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '12px', marginBottom: '28px' },
    metric: { backgroundColor: '#fffdf5', borderRadius: '8px', padding: '14px', border: '1px solid #f0e4c0' },
    metricLabel: { fontSize: '12px', color: '#888', margin: '0 0 6px' },
    metricVal: { fontSize: '24px', fontWeight: '600', margin: 0, color: '#222' },
    sectionTitle: { fontSize: '15px', fontWeight: '600', margin: '0 0 12px', color: '#222' },
    table: { width: '100%', borderCollapse: 'collapse', fontSize: '13px' },
    th: { textAlign: 'left', fontSize: '11px', color: '#888', fontWeight: '500', padding: '8px 10px', borderBottom: '1px solid #e5e5e5', fontFamily: 'Arial, sans-serif' },
    td: { padding: '10px', borderBottom: '1px solid #f0f0f0', color: '#333', fontFamily: 'Arial, sans-serif', verticalAlign: 'middle' },
    status: (s) => ({ fontSize: '11px', padding: '3px 10px', borderRadius: '10px', background: s === 'confirme' ? '#e1f5ee' : s === 'annule' ? '#fdf0f0' : '#faeeda', color: s === 'confirme' ? '#085041' : s === 'annule' ? '#c0392b' : '#633806' }),
    roleBadge: (r) => ({ fontSize: '11px', padding: '3px 10px', borderRadius: '10px', background: r === 'admin' ? '#faeeda' : r === 'intervenant' ? '#eeedfe' : '#f0f0f0', color: r === 'admin' ? '#BA7517' : r === 'intervenant' ? '#534AB7' : '#555' }),
    btnSmall: { fontSize: '12px', padding: '4px 10px', borderRadius: '6px', border: '1px solid #e74c3c', background: 'transparent', color: '#e74c3c', cursor: 'pointer', fontFamily: 'Arial, sans-serif', marginLeft: '4px' },
    btnSuccess: { fontSize: '12px', padding: '4px 10px', borderRadius: '6px', border: '1px solid #1D9E75', background: 'transparent', color: '#1D9E75', cursor: 'pointer', fontFamily: 'Arial, sans-serif', marginLeft: '4px' },
    btnPrimary: { padding: '10px 20px', fontSize: '13px', fontWeight: '600', borderRadius: '8px', border: 'none', background: '#BA7517', color: '#fff', cursor: 'pointer', fontFamily: 'Arial, sans-serif' },
    twoCol: { display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '24px' },
    field: { marginBottom: '14px' },
    label: { display: 'block', fontSize: '12px', color: '#555', marginBottom: '4px', fontWeight: '500' },
    input: { width: '100%', fontSize: '14px', padding: '9px 12px', borderRadius: '8px', border: '1px solid #ccc', fontFamily: 'Arial, sans-serif', boxSizing: 'border-box' },
    select: { width: '100%', fontSize: '14px', padding: '9px 12px', borderRadius: '8px', border: '1px solid #ccc', fontFamily: 'Arial, sans-serif', boxSizing: 'border-box', backgroundColor: '#fff' },
    textarea: { width: '100%', fontSize: '14px', padding: '9px 12px', borderRadius: '8px', border: '1px solid #ccc', fontFamily: 'Arial, sans-serif', boxSizing: 'border-box', resize: 'none', height: '80px' },
    formBox: { backgroundColor: '#fffdf5', border: '1px solid #f0e4c0', borderRadius: '10px', padding: '20px', marginBottom: '24px' },
    msgSucces: { fontSize: '13px', color: '#085041', backgroundColor: '#e1f5ee', border: '1px solid #5dcaa5', borderRadius: '6px', padding: '10px 12px', marginBottom: '12px' },
    msgErreur: { fontSize: '13px', color: '#c0392b', backgroundColor: '#fdf0f0', border: '1px solid #f5c6c6', borderRadius: '6px', padding: '10px 12px', marginBottom: '12px' },
    loading: { textAlign: 'center', padding: '80px', color: '#888' },
    emptyMsg: { fontSize: '13px', color: '#aaa', textAlign: 'center', padding: '20px' },
    roleSelect: { fontSize: '12px', padding: '4px 8px', borderRadius: '6px', border: '1px solid #ccc', fontFamily: 'Arial, sans-serif', backgroundColor: '#fff', cursor: 'pointer' },
    rdvsAttente: (nb) => ({ fontSize: '11px', padding: '2px 8px', borderRadius: '10px', background: nb > 0 ? '#faeeda' : '#f0f0f0', color: nb > 0 ? '#633806' : '#555', marginLeft: '6px' }),
  }
 
  if (!user) return null
  if (loading) return <p style={styles.loading}>Chargement...</p>
 
  const rdvsEnAttente = rdvs.filter(r => r.statut === 'en_attente')
 
  return (
    <div style={styles.layout}>
      <div style={styles.sidebar}>
        <div style={styles.sidebarHeader}>
          <div style={styles.avatar}>{user.prenom[0]}{user.nom[0]}</div>
          <p style={styles.userName}>{user.prenom} {user.nom}</p>
          <p style={styles.userRole}>Administrateur</p>
        </div>
        <p style={styles.navSection}>Principal</p>
        <button style={styles.navItem(onglet === 'accueil')} onClick={() => setOnglet('accueil')}>Tableau de bord</button>
        <button style={styles.navItem(onglet === 'rdvs')} onClick={() => setOnglet('rdvs')}>
          Rendez-vous
          {rdvsEnAttente.length > 0 && <span style={styles.rdvsAttente(rdvsEnAttente.length)}>{rdvsEnAttente.length} en attente</span>}
        </button>
        <p style={styles.navSection}>Gestion</p>
        <button style={styles.navItem(onglet === 'utilisateurs')} onClick={() => setOnglet('utilisateurs')}>Utilisateurs ({utilisateurs.length})</button>
        <button style={styles.navItem(onglet === 'services')} onClick={() => setOnglet('services')}>Services ({services.length})</button>
        <button style={styles.navItem(false)} onClick={() => navigate('accueil')}>Voir le catalogue</button>
      </div>
 
      <div style={styles.content}>
 
        {onglet === 'accueil' && stats && (
          <>
            <p style={styles.pageTitle}>Tableau de bord</p>
            <p style={styles.pageSub}>Vue d ensemble de la plateforme VitaCare</p>
            <div style={styles.metrics}>
              <div style={styles.metric}><p style={styles.metricLabel}>Patients inscrits</p><p style={styles.metricVal}>{stats.nb_patients}</p></div>
              <div style={styles.metric}><p style={styles.metricLabel}>Intervenants</p><p style={styles.metricVal}>{stats.nb_intervenants}</p></div>
              <div style={styles.metric}><p style={styles.metricLabel}>RDV ce mois</p><p style={styles.metricVal}>{stats.nb_rdvs_mois}</p></div>
              <div style={styles.metric}><p style={styles.metricLabel}>Services actifs</p><p style={styles.metricVal}>{stats.nb_services}</p></div>
            </div>
            {rdvsEnAttente.length > 0 && (
              <>
                <p style={styles.sectionTitle}>Reservations en attente de validation ({rdvsEnAttente.length})</p>
                <table style={styles.table}>
                  <thead>
                    <tr>
                      <th style={styles.th}>Patient</th>
                      <th style={styles.th}>Service</th>
                      <th style={styles.th}>Intervenant</th>
                      <th style={styles.th}>Date</th>
                      <th style={styles.th}>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {rdvsEnAttente.map(rdv => {
                      const d = new Date(rdv.date_heure)
                      return (
                        <tr key={rdv.ID_rdv}>
                          <td style={styles.td}>{rdv.patient_prenom} {rdv.patient_nom}</td>
                          <td style={styles.td}>{rdv.nom_service}</td>
                          <td style={styles.td}>{rdv.intervenant_prenom} {rdv.intervenant_nom}</td>
                          <td style={styles.td}>{d.toLocaleDateString('fr-FR')}</td>
                          <td style={styles.td}>
                            <button style={styles.btnSuccess} onClick={() => validerRdv(rdv.ID_rdv)}>Valider</button>
                            <button style={styles.btnSmall} onClick={() => annulerRdv(rdv.ID_rdv)}>Refuser</button>
                          </td>
                        </tr>
                      )
                    })}
                  </tbody>
                </table>
              </>
            )}
          </>
        )}
 
        {onglet === 'rdvs' && (
          <>
            <p style={styles.pageTitle}>Gestion des rendez-vous</p>
            <p style={styles.pageSub}>{rdvs.length} rendez-vous au total — {rdvsEnAttente.length} en attente</p>
            <table style={styles.table}>
              <thead>
                <tr>
                  <th style={styles.th}>Patient</th>
                  <th style={styles.th}>Service</th>
                  <th style={styles.th}>Intervenant</th>
                  <th style={styles.th}>Date</th>
                  <th style={styles.th}>Statut</th>
                  <th style={styles.th}>Actions</th>
                </tr>
              </thead>
              <tbody>
                {rdvs.map(rdv => {
                  const d = new Date(rdv.date_heure)
                  return (
                    <tr key={rdv.ID_rdv}>
                      <td style={styles.td}>{rdv.patient_prenom} {rdv.patient_nom}</td>
                      <td style={styles.td}>{rdv.nom_service}</td>
                      <td style={styles.td}>{rdv.intervenant_prenom} {rdv.intervenant_nom}</td>
                      <td style={styles.td}>{d.toLocaleDateString('fr-FR')} {d.toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' })}</td>
                      <td style={styles.td}><span style={styles.status(rdv.statut)}>{rdv.statut}</span></td>
                      <td style={styles.td}>
                        {rdv.statut === 'en_attente' && <button style={styles.btnSuccess} onClick={() => validerRdv(rdv.ID_rdv)}>Valider</button>}
                        {rdv.statut !== 'annule' && <button style={styles.btnSmall} onClick={() => annulerRdv(rdv.ID_rdv)}>Annuler</button>}
                      </td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          </>
        )}
 
        {onglet === 'utilisateurs' && (
          <>
            <p style={styles.pageTitle}>Gestion des utilisateurs</p>
            <p style={styles.pageSub}>{utilisateurs.length} utilisateurs inscrits</p>
            {msgRole && <div style={styles.msgSucces}>{msgRole}</div>}
            <table style={styles.table}>
              <thead>
                <tr>
                  <th style={styles.th}>Nom</th>
                  <th style={styles.th}>Email</th>
                  <th style={styles.th}>Role actuel</th>
                  <th style={styles.th}>Changer le role</th>
                  <th style={styles.th}>Inscription</th>
                  <th style={styles.th}>Action</th>
                </tr>
              </thead>
              <tbody>
                {utilisateurs.map(u => (
                  <tr key={u.ID_utilisateur}>
                    <td style={styles.td}>{u.prenom} {u.nom}</td>
                    <td style={styles.td}>{u.email}</td>
                    <td style={styles.td}><span style={styles.roleBadge(u.role)}>{u.role}</span></td>
                    <td style={styles.td}>
                      {u.role !== 'admin' && (
                        <select
                          style={styles.roleSelect}
                          value={u.role}
                          onChange={e => changerRole(u.ID_utilisateur, e.target.value)}
                        >
                          <option value="patient">Patient</option>
                          <option value="intervenant">Intervenant</option>
                          <option value="admin">Admin</option>
                        </select>
                      )}
                    </td>
                    <td style={styles.td}>{u.date_creation ? new Date(u.date_creation).toLocaleDateString('fr-FR') : '-'}</td>
                    <td style={styles.td}>
                      {u.role !== 'admin' && (
                        <button style={styles.btnSmall} onClick={() => supprimerUtilisateur(u.ID_utilisateur)}>Supprimer</button>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </>
        )}
 
        {onglet === 'services' && (
          <>
            <p style={styles.pageTitle}>Gestion des services</p>
            <p style={styles.pageSub}>{services.length} services disponibles sur la plateforme</p>
 
            <div style={styles.formBox}>
              <p style={{ fontSize: '14px', fontWeight: '600', margin: '0 0 16px' }}>Ajouter un nouveau service</p>
              {msgService && <div style={styles.msgSucces}>{msgService}</div>}
              {errService && <div style={styles.msgErreur}>{errService}</div>}
              <div style={styles.twoCol}>
                <div style={styles.field}>
                  <label style={styles.label}>Nom du service</label>
                  <input style={styles.input} type="text" placeholder="Ex: Reflexologie" value={formService.nom_service} onChange={e => setFormService({...formService, nom_service: e.target.value})} />
                </div>
                <div style={styles.field}>
                  <label style={styles.label}>Categorie</label>
                  <select style={styles.select} value={formService.categorie} onChange={e => setFormService({...formService, categorie: e.target.value})}>
                    <option>Bien-etre</option>
                    <option>Nutrition</option>
                    <option>Sante</option>
                    <option>Sante mentale</option>
                  </select>
                </div>
              </div>
              <div style={styles.field}>
                <label style={styles.label}>Description</label>
                <textarea style={styles.textarea} placeholder="Description du service..." value={formService.description} onChange={e => setFormService({...formService, description: e.target.value})} />
              </div>
              <div style={styles.twoCol}>
                <div style={styles.field}>
                  <label style={styles.label}>Duree (minutes)</label>
                  <input style={styles.input} type="number" placeholder="60" value={formService.duree_min} onChange={e => setFormService({...formService, duree_min: e.target.value})} />
                </div>
                <div style={styles.field}>
                  <label style={styles.label}>Tarif (€)</label>
                  <input style={styles.input} type="number" placeholder="50" value={formService.tarif} onChange={e => setFormService({...formService, tarif: e.target.value})} />
                </div>
              </div>
              <button style={styles.btnPrimary} onClick={ajouterService}>Ajouter ce service</button>
            </div>
 
            <p style={styles.sectionTitle}>Liste des services</p>
            <table style={styles.table}>
              <thead>
                <tr>
                  <th style={styles.th}>Nom</th>
                  <th style={styles.th}>Categorie</th>
                  <th style={styles.th}>Duree</th>
                  <th style={styles.th}>Tarif</th>
                  <th style={styles.th}>Action</th>
                </tr>
              </thead>
              <tbody>
                {services.map(s => (
                  <tr key={s.ID_service}>
                    <td style={styles.td}>{s.nom_service}</td>
                    <td style={styles.td}>{s.categorie}</td>
                    <td style={styles.td}>{s.duree_min} min</td>
                    <td style={styles.td}>{s.tarif} €</td>
                    <td style={styles.td}>
                      <button style={styles.btnSmall} onClick={() => supprimerService(s.ID_service)}>Supprimer</button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </>
        )}
 
      </div>
    </div>
  )
}
 
export default DashboardAdmin