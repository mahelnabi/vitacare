import { useState, useEffect } from 'react'
import genererPDFRdv from './GenerateurPDF.jsx'

function Dashboard({ user, navigate }) {
  const [rdvs, setRdvs] = useState([])
  const [notifications, setNotifications] = useState([])
  const [activites, setActivites] = useState([])
  const [loading, setLoading] = useState(true)
  const [onglet, setOnglet] = useState('accueil')
  const [rdvAModifier, setRdvAModifier] = useState(null)
  const [dispos, setDispos] = useState([])
  const [creneauChoisi, setCreneauChoisi] = useState(null)
  const [msgModif, setMsgModif] = useState('')
  const [errModif, setErrModif] = useState('')

  useEffect(() => {
    if (!user) { navigate('connexion'); return }
    chargerDonnees()
  }, [user])

  const chargerDonnees = async () => {
    setLoading(true)
    try {
      const [rdvRes, notifRes, actRes] = await Promise.all([
        fetch('http://localhost/vitacare/backend/api/rendezvous.php?action=mes-rdv', { credentials: 'include' }),
        fetch('http://localhost/vitacare/backend/api/notifications.php?action=liste', { credentials: 'include' }),
        fetch('http://localhost/vitacare/backend/api/activites.php?action=mes-inscriptions', { credentials: 'include' })
      ])
      setRdvs((await rdvRes.json()).rdvs || [])
      setNotifications((await notifRes.json()).notifications || [])
      setActivites((await actRes.json()).activites || [])
    } catch {} finally { setLoading(false) }
  }

  const annulerRdv = async (id_rdv) => {
    const res = await fetch('http://localhost/vitacare/backend/api/rendezvous.php?action=annuler', {
      method: 'POST', headers: { 'Content-Type': 'application/json' }, credentials: 'include',
      body: JSON.stringify({ id_rdv })
    })
    const data = await res.json()
    if (res.ok) setRdvs(prev => prev.map(r => r.ID_rdv === id_rdv ? { ...r, statut: 'annule' } : r))
    else alert(data.error)
  }

  const ouvrirModification = async (rdv) => {
    setRdvAModifier(rdv)
    setCreneauChoisi(null)
    setMsgModif(''); setErrModif('')
    const res = await fetch(`http://localhost/vitacare/backend/api/disponibilites.php?action=liste&id_intervenant=${rdv.ID_intervenant}`)
    const data = await res.json()
    setDispos(data.disponibilites || [])
  }

  const modifierRdv = async () => {
    if (!creneauChoisi) { setErrModif('Choisissez un nouveau creneau'); return }
    const res = await fetch('http://localhost/vitacare/backend/api/rendezvous.php?action=modifier', {
      method: 'POST', headers: { 'Content-Type': 'application/json' }, credentials: 'include',
      body: JSON.stringify({
        id_rdv: rdvAModifier.ID_rdv,
        id_dispo_nouveau: creneauChoisi.ID_dispo,
        date_heure_nouvelle: creneauChoisi.date + ' ' + creneauChoisi.heure_debut
      })
    })
    const data = await res.json()
    if (!res.ok) { setErrModif(data.error) }
    else {
      setMsgModif('Rendez-vous modifie avec succes.')
      setRdvAModifier(null)
      chargerDonnees()
    }
    
  }

  const desinscrireActivite = async (id_activite) => {
    if (!window.confirm('Se desinscrire de cette activite ?')) return
    const res = await fetch('http://localhost/vitacare/backend/api/activites.php?action=desinscrire', {
      method: 'POST', headers: { 'Content-Type': 'application/json' }, credentials: 'include',
      body: JSON.stringify({ id_activite })
    })
    if (res.ok) setActivites(prev => prev.filter(a => a.ID_activite !== id_activite))
  }

  const marquerLu = async (id_notif) => {
    await fetch(`http://localhost/vitacare/backend/api/notifications.php?action=lire&id=${id_notif}`, {
      method: 'POST', credentials: 'include'
    })
    setNotifications(prev => prev.map(n => n.ID_notif === id_notif ? { ...n, lue: 1 } : n))
  }

  const mois = ['Jan','Fev','Mar','Avr','Mai','Jun','Jul','Aou','Sep','Oct','Nov','Dec']
  const rdvsAVenir = rdvs.filter(r => r.statut !== 'annule' && new Date(r.date_heure) >= new Date())
  const rdvsPasses = rdvs.filter(r => new Date(r.date_heure) < new Date() || r.statut === 'annule')
  const notifsNonLues = notifications.filter(n => !n.lue).length

  const styles = {
    layout: { display: 'grid', gridTemplateColumns: '220px 1fr', minHeight: 'calc(100vh - 56px)' },
    sidebar: { borderRight: '1px solid #e5e5e5', backgroundColor: '#f9f9fb', padding: '20px 0' },
    sidebarHeader: { padding: '0 16px 16px', borderBottom: '1px solid #e5e5e5', marginBottom: '12px' },
    avatar: { width: '44px', height: '44px', borderRadius: '50%', background: '#eeedfe', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: '600', color: '#534AB7', fontSize: '14px', marginBottom: '8px' },
    userName: { fontSize: '14px', fontWeight: '600', margin: '0 0 2px' },
    userRole: { fontSize: '12px', color: '#888', margin: 0, textTransform: 'capitalize' },
    navItem: (active) => ({ display: 'flex', alignItems: 'center', gap: '10px', padding: '10px 16px', fontSize: '13px', color: active ? '#222' : '#666', fontWeight: active ? '600' : '400', borderLeft: active ? '2px solid #534AB7' : '2px solid transparent', backgroundColor: active ? '#fff' : 'transparent', cursor: 'pointer', border: 'none', width: '100%', textAlign: 'left', fontFamily: 'Arial, sans-serif' }),
    content: { padding: '28px', backgroundColor: '#fff' },
    pageTitle: { fontSize: '20px', fontWeight: '600', margin: '0 0 4px', color: '#222' },
    pageSub: { fontSize: '13px', color: '#888', margin: '0 0 24px' },
    metrics: { display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '12px', marginBottom: '28px' },
    metric: { backgroundColor: '#f9f9fb', borderRadius: '8px', padding: '14px', border: '1px solid #e5e5e5' },
    metricLabel: { fontSize: '12px', color: '#888', margin: '0 0 6px' },
    metricVal: { fontSize: '24px', fontWeight: '600', margin: 0, color: '#222' },
    sectionHeader: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' },
    sectionTitle: { fontSize: '15px', fontWeight: '600', margin: 0, color: '#222' },
    twoCol: { display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '24px', marginTop: '24px' },
    rdvCard: { display: 'flex', alignItems: 'center', gap: '14px', padding: '12px 14px', border: '1px solid #e5e5e5', borderRadius: '8px', marginBottom: '8px' },
    rdvDate: { textAlign: 'center', minWidth: '40px' },
    rdvDay: { fontSize: '20px', fontWeight: '600', color: '#534AB7', lineHeight: 1 },
    rdvMonth: { fontSize: '11px', color: '#888', textTransform: 'uppercase' },
    rdvInfo: { flex: 1 },
    rdvTitle: { fontSize: '13px', fontWeight: '600', margin: '0 0 2px' },
    rdvSub: { fontSize: '12px', color: '#888', margin: 0 },
    status: (s) => ({ fontSize: '11px', padding: '3px 10px', borderRadius: '10px', background: s === 'confirme' ? '#e1f5ee' : s === 'annule' ? '#fdf0f0' : '#faeeda', color: s === 'confirme' ? '#085041' : s === 'annule' ? '#c0392b' : '#633806' }),
    btnSmall: { fontSize: '12px', padding: '5px 10px', borderRadius: '6px', border: '1px solid #ccc', background: 'transparent', color: '#666', cursor: 'pointer', fontFamily: 'Arial, sans-serif', marginLeft: '4px' },
    btnDanger: { fontSize: '12px', padding: '5px 10px', borderRadius: '6px', border: '1px solid #e74c3c', background: 'transparent', color: '#e74c3c', cursor: 'pointer', fontFamily: 'Arial, sans-serif', marginLeft: '4px' },
    btnPDF: { fontSize: '12px', padding: '5px 10px', borderRadius: '6px', border: '1px solid #1D9E75', background: 'transparent', color: '#1D9E75', cursor: 'pointer', fontFamily: 'Arial, sans-serif', marginLeft: '4px' },
    btnPrimary: { fontSize: '13px', padding: '8px 16px', borderRadius: '8px', border: 'none', background: '#534AB7', color: '#fff', cursor: 'pointer', fontFamily: 'Arial, sans-serif' },
    notifItem: { display: 'flex', alignItems: 'flex-start', gap: '10px', padding: '10px', border: '1px solid #e5e5e5', borderRadius: '8px', marginBottom: '6px', cursor: 'pointer' },
    notifDot: (lue) => ({ width: '8px', height: '8px', borderRadius: '50%', background: lue ? '#ccc' : '#534AB7', marginTop: '4px', flexShrink: 0 }),
    notifText: (lue) => ({ fontSize: '13px', color: lue ? '#888' : '#222', margin: '0 0 2px' }),
    notifTime: { fontSize: '11px', color: '#aaa', margin: 0 },
    actCard: { display: 'flex', alignItems: 'center', gap: '12px', padding: '10px 12px', border: '1px solid #e5e5e5', borderRadius: '8px', marginBottom: '8px' },
    loading: { textAlign: 'center', padding: '80px', color: '#888' },
    emptyMsg: { fontSize: '13px', color: '#aaa', textAlign: 'center', padding: '20px' },
    modal: { position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, background: 'rgba(0,0,0,0.4)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000 },
    modalBox: { background: '#fff', borderRadius: '12px', padding: '28px', width: '500px', maxWidth: '90vw' },
    modalTitle: { fontSize: '16px', fontWeight: '600', margin: '0 0 16px' },
    slotsGrid: { display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '8px', margin: '12px 0' },
    slot: (selected) => ({ fontSize: '12px', padding: '8px 4px', borderRadius: '6px', border: '1px solid ' + (selected ? '#534AB7' : '#ccc'), background: selected ? '#534AB7' : 'transparent', color: selected ? '#fff' : '#555', cursor: 'pointer', fontFamily: 'Arial, sans-serif', textAlign: 'center' }),
    msgSucces: { fontSize: '13px', color: '#085041', backgroundColor: '#e1f5ee', border: '1px solid #5dcaa5', borderRadius: '6px', padding: '10px 12px', marginBottom: '12px' },
    msgErreur: { fontSize: '13px', color: '#c0392b', backgroundColor: '#fdf0f0', border: '1px solid #f5c6c6', borderRadius: '6px', padding: '10px 12px', marginBottom: '12px' },
  }

  if (!user) return null
  if (loading) return <p style={styles.loading}>Chargement...</p>


  return (
    <div style={styles.layout}>
      {rdvAModifier && (
        <div style={styles.modal} onClick={() => setRdvAModifier(null)}>
          <div style={styles.modalBox} onClick={e => e.stopPropagation()}>
            <p style={styles.modalTitle}>Modifier le rendez-vous — {rdvAModifier.nom_service}</p>
            <p style={{ fontSize: '13px', color: '#888', margin: '0 0 12px' }}>
              Creneau actuel : {new Date(rdvAModifier.date_heure).toLocaleDateString('fr-FR')} — {new Date(rdvAModifier.date_heure).toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' })}
            </p>
            {msgModif && <div style={styles.msgSucces}>{msgModif}</div>}
            {errModif && <div style={styles.msgErreur}>{errModif}</div>}
            <p style={{ fontSize: '13px', fontWeight: '600', margin: '0 0 8px' }}>Choisir un nouveau creneau :</p>
            {dispos.length === 0 ? (
              <p style={{ fontSize: '13px', color: '#aaa' }}>Aucun creneau disponible.</p>
            ) : (
              <div style={styles.slotsGrid}>
                {dispos.map(d => (
                  <button key={d.ID_dispo} style={styles.slot(creneauChoisi && creneauChoisi.ID_dispo === d.ID_dispo)} onClick={() => setCreneauChoisi(d)}>
                    {d.date}<br />{d.heure_debut.slice(0, 5)}
                  </button>
                ))}
              </div>
            )}
            <div style={{ display: 'flex', gap: '8px', marginTop: '16px' }}>
              <button style={styles.btnPrimary} onClick={modifierRdv}>Confirmer</button>
              <button style={styles.btnSmall} onClick={() => setRdvAModifier(null)}>Annuler</button>
            </div>
          </div>
        </div>

      )}

      <div style={styles.sidebar}>
        <div style={styles.sidebarHeader}>
          <div style={styles.avatar}>{user.prenom[0]}{user.nom[0]}</div>
          <p style={styles.userName}>{user.prenom} {user.nom}</p>

          <p style={styles.userRole}>{user.role}</p>
        </div>
        <button style={styles.navItem(onglet === 'accueil')} onClick={() => setOnglet('accueil')}>Tableau de bord</button>
        <button style={styles.navItem(onglet === 'rdvs')} onClick={() => setOnglet('rdvs')}>Mes rendez-vous {rdvsAVenir.length > 0 && `(${rdvsAVenir.length})`}</button>
        <button style={styles.navItem(onglet === 'historique')} onClick={() => setOnglet('historique')}>Historique</button>
        <button style={styles.navItem(onglet === 'activites')} onClick={() => setOnglet('activites')}>Mes activites</button>
        <button style={styles.navItem(onglet === 'notifications')} onClick={() => setOnglet('notifications')}>Notifications {notifsNonLues > 0 && `(${notifsNonLues})`}</button>
        <button style={styles.navItem(false)} onClick={() => navigate('profil')}>Mon profil</button>
        <button style={styles.navItem(false)} onClick={() => navigate('accueil')}>Retour au catalogue</button>
      </div>

      <div style={styles.content}>
        {onglet === 'accueil' && (
          <>
            <p style={styles.pageTitle}>Bonjour, {user.prenom}</p>
            <p style={styles.pageSub}>Voici un resume de votre activite sur VitaCare</p>
            <div style={styles.metrics}>
              <div style={styles.metric}><p style={styles.metricLabel}>RDV a venir</p><p style={styles.metricVal}>{rdvsAVenir.length}</p></div>

              <div style={styles.metric}><p style={styles.metricLabel}>Activites inscrites</p><p style={styles.metricVal}>{activites.length}</p></div>
              <div style={styles.metric}><p style={styles.metricLabel}>Consultations totales</p><p style={styles.metricVal}>{rdvs.length}</p></div>
              <div style={styles.metric}><p style={styles.metricLabel}>Notifications non lues</p><p style={styles.metricVal}>{notifsNonLues}</p></div>
            </div>
            <div style={styles.twoCol}>

              <div>
                <div style={styles.sectionHeader}>
                  <p style={styles.sectionTitle}>Prochains rendez-vous</p>
                  <button style={styles.btnSmall} onClick={() => setOnglet('rdvs')}>Voir tous</button>
                </div>
                {rdvsAVenir.length === 0 && <p style={styles.emptyMsg}>Aucun rendez-vous a venir</p>}
                {rdvsAVenir.slice(0, 3).map(rdv => {
                  const d = new Date(rdv.date_heure)
                  return (
                    <div key={rdv.ID_rdv} style={styles.rdvCard}>
                      <div style={styles.rdvDate}><div style={styles.rdvDay}>{d.getDate()}</div><div style={styles.rdvMonth}>{mois[d.getMonth()]}</div></div>
                      <div style={styles.rdvInfo}><p style={styles.rdvTitle}>{rdv.nom_service}</p><p style={styles.rdvSub}>{rdv.intervenant_prenom} {rdv.intervenant_nom}</p></div>
                      <span style={styles.status(rdv.statut)}>{rdv.statut}</span>
                    </div>
                  )
                })}
              </div>


              <div>
                <div style={styles.sectionHeader}>
                  <p style={styles.sectionTitle}>Notifications recentes</p>
                  <button style={styles.btnSmall} onClick={() => setOnglet('notifications')}>Voir toutes</button>
                </div>
                {notifications.slice(0, 4).map(n => (
                  <div key={n.ID_notif} style={styles.notifItem} onClick={() => marquerLu(n.ID_notif)}>
                    <div style={styles.notifDot(n.lue)}></div>
                    <div><p style={styles.notifText(n.lue)}>{n.message}</p><p style={styles.notifTime}>{n.date_envoi}</p></div>
                  </div>
                ))}
              </div>
            </div>
          </>
        )}

        {onglet === 'rdvs' && (
          <>
            <p style={styles.pageTitle}>Mes rendez-vous</p>
            <p style={styles.pageSub}>Vos prochains rendez-vous confirmes</p>
            {rdvsAVenir.length === 0 && <p style={styles.emptyMsg}>Aucun rendez-vous a venir</p>}
            {rdvsAVenir.map(rdv => {
              const d = new Date(rdv.date_heure)
              return (
                <div key={rdv.ID_rdv} style={styles.rdvCard}>
                  <div style={styles.rdvDate}><div style={styles.rdvDay}>{d.getDate()}</div><div style={styles.rdvMonth}>{mois[d.getMonth()]}</div></div>
                  <div style={styles.rdvInfo}><p style={styles.rdvTitle}>{rdv.nom_service}</p><p style={styles.rdvSub}>{rdv.intervenant_prenom} {rdv.intervenant_nom} — {rdv.duree_min} min — {rdv.tarif} €</p></div>
                  <span style={styles.status(rdv.statut)}>{rdv.statut}</span>
                  {rdv.statut === 'confirme' && (
                    <>
                      <button style={styles.btnPDF} onClick={() => genererPDFRdv(rdv, user)}>📄 PDF</button>
                      <button style={styles.btnSmall} onClick={() => ouvrirModification(rdv)}>Modifier</button>
                      <button style={styles.btnDanger} onClick={() => annulerRdv(rdv.ID_rdv)}>Annuler</button>
                    </>
                  )}
                </div>
              )
            })}
          </>
        )}

        {onglet === 'historique' && (
          <>
            <p style={styles.pageTitle}>Historique des consultations</p>
            <p style={styles.pageSub}>{rdvsPasses.length} consultation{rdvsPasses.length > 1 ? 's' : ''} au total</p>
            {rdvsPasses.length === 0 && <p style={styles.emptyMsg}>Aucune consultation passee</p>}
            {rdvsPasses.map(rdv => {
              const d = new Date(rdv.date_heure)
              return (
                <div key={rdv.ID_rdv} style={{ ...styles.rdvCard, opacity: rdv.statut === 'annule' ? 0.6 : 1 }}>
                  <div style={styles.rdvDate}><div style={{ ...styles.rdvDay, color: '#888' }}>{d.getDate()}</div><div style={styles.rdvMonth}>{mois[d.getMonth()]}</div></div>
                  <div style={styles.rdvInfo}><p style={styles.rdvTitle}>{rdv.nom_service}</p><p style={styles.rdvSub}>{rdv.intervenant_prenom} {rdv.intervenant_nom} — {rdv.duree_min} min — {rdv.tarif} €</p></div>
                  <span style={styles.status(rdv.statut)}>{rdv.statut}</span>
                  {rdv.statut === 'confirme' && (
                    <button style={styles.btnPDF} onClick={() => genererPDFRdv(rdv, user)}>📄 PDF</button>
                  )}
                </div>
              )
            })}
          </>
        )}

        {onglet === 'activites' && (
          <>
            <p style={styles.pageTitle}>Mes activites</p>
            <p style={styles.pageSub}>Activites auxquelles vous etes inscrit</p>
            {activites.length === 0 && <p style={styles.emptyMsg}>Aucune activite</p>}
            {activites.map(a => (
              <div key={a.ID_inscription} style={styles.actCard}>
                <div style={{ width: '36px', height: '36px', borderRadius: '8px', background: '#eeedfe', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '18px', flexShrink: 0 }}>🧘</div>
                <div style={{ flex: 1 }}>
                  <p style={{ margin: '0 0 2px', fontWeight: '600', fontSize: '13px' }}>{a.nom_activite}</p>
                  <p style={{ margin: 0, fontSize: '12px', color: '#888' }}>{new Date(a.date_heure).toLocaleDateString('fr-FR')} — {a.lieu}</p>
                </div>
                <span style={styles.status(a.statut)}>{a.statut}</span>
                <button style={styles.btnDanger} onClick={() => desinscrireActivite(a.ID_activite)}>Se desinscrire</button>
              </div>
            ))}
            <button style={{ marginTop: '16px', fontSize: '13px', padding: '8px 16px', borderRadius: '8px', border: 'none', background: '#534AB7', color: '#fff', cursor: 'pointer', fontFamily: 'Arial, sans-serif' }} onClick={() => navigate('activites')}>
              Voir toutes les activites
            </button>
          </>

        )}

        {onglet === 'notifications' && (
          <>
            <p style={styles.pageTitle}>Notifications</p>
            <p style={styles.pageSub}>Cliquez pour marquer comme lue</p>
            {notifications.length === 0 && <p style={styles.emptyMsg}>Aucune notification</p>}
            {notifications.map(n => (
              <div key={n.ID_notif} style={styles.notifItem} onClick={() => marquerLu(n.ID_notif)}>
                <div style={styles.notifDot(n.lue)}></div>
                <div><p style={styles.notifText(n.lue)}>{n.message}</p><p style={styles.notifTime}>{n.date_envoi}</p></div>
              </div>
            ))}
          </>

        )}
      </div>
    </div>
  )
}

export default Dashboard