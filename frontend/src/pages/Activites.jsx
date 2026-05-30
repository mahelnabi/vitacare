import { useState, useEffect } from 'react'

function Activites({ user, navigate }) {
  const [activites, setActivites] = useState([])
  const [loading, setLoading] = useState(true)
  const [messages, setMessages] = useState({})
  const [activiteOuverte, setActiviteOuverte] = useState(null)
  const [participants, setParticipants] = useState([])
  const [loadingParticipants, setLoadingParticipants] = useState(false)

  useEffect(() => {
    fetch('http://localhost/vitacare/backend/api/activites.php?action=liste')
      .then(res => res.json())
      .then(data => { setActivites(data.activites || []); setLoading(false) })
      .catch(() => setLoading(false))
  }, [])

  const inscrire = async (id_activite) => {
    if (!user) { navigate('connexion'); return }
    try {
      const res = await fetch('http://localhost/vitacare/backend/api/activites.php?action=inscrire', {
        method: 'POST', headers: { 'Content-Type': 'application/json' }, credentials: 'include',
        body: JSON.stringify({ id_activite })
      })
      const data = await res.json()
      if (!res.ok) {
        setMessages(prev => ({ ...prev, [id_activite]: { type: 'erreur', texte: data.error } }))
      } else {
        setMessages(prev => ({ ...prev, [id_activite]: { type: 'succes', texte: data.statut === 'liste_attente' ? 'Inscrit sur liste d attente.' : 'Inscription confirmee.' } }))
        setActivites(prev => prev.map(a => a.ID_activite === id_activite ? { ...a, nb_inscrits: parseInt(a.nb_inscrits) + 1 } : a))
      }
    } catch {
      setMessages(prev => ({ ...prev, [id_activite]: { type: 'erreur', texte: 'Erreur serveur' } }))
    }
  }

  const voirParticipants = async (activite) => {
    setActiviteOuverte(activite)
    setLoadingParticipants(true)
    try {
      const res = await fetch(`http://localhost/vitacare/backend/api/activites.php?action=participants&id_activite=${activite.ID_activite}`)
      const data = await res.json()
      setParticipants(data.participants || [])
    } catch {}
    setLoadingParticipants(false)
  }

  const icones = {
    'Bien-etre': { emoji: '🧘', bg: '#F0FAF6' },
    'Nutrition': { emoji: '🥗', bg: '#F0FDF4' },
    'Sante': { emoji: '🏥', bg: '#EFF6FF' },
    'Sante mentale': { emoji: '🧠', bg: '#FAF5FF' },
  }

  const styles = {
    hero: { backgroundColor: '#f0effe', padding: '36px 24px', borderBottom: '1px solid #e5e5e5' },
    heroInner: { maxWidth: '1100px', margin: '0 auto' },
    title: { fontSize: '24px', fontWeight: '600', margin: '0 0 6px', color: '#222' },
    sub: { fontSize: '14px', color: '#888', margin: 0 },
    page: { maxWidth: '1100px', margin: '0 auto', padding: '32px 24px' },
    grid: { display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '16px' },
    card: { backgroundColor: '#fff', border: '1px solid #e5e5e5', borderRadius: '10px', overflow: 'hidden' },
    cardHeader: (cat) => ({ height: '80px', backgroundColor: icones[cat]?.bg || '#f0effe', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '36px' }),
    cardBody: { padding: '16px' },
    cardTitle: { fontSize: '15px', fontWeight: '600', margin: '0 0 6px', color: '#222' },
    cardDesc: { fontSize: '13px', color: '#666', margin: '0 0 12px', lineHeight: '1.5' },
    cardMeta: { fontSize: '12px', color: '#888', margin: '0 0 4px' },
    cardFooter: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', paddingTop: '12px', borderTop: '1px solid #f0f0f0', marginTop: '12px' },
    price: { fontSize: '15px', fontWeight: '600', color: '#534AB7' },
    places: (plein) => ({ fontSize: '12px', padding: '3px 8px', borderRadius: '10px', background: plein ? '#fdf0f0' : '#e1f5ee', color: plein ? '#c0392b' : '#085041' }),
    btnPrimary: { width: '100%', padding: '9px', fontSize: '13px', fontWeight: '500', borderRadius: '8px', border: 'none', background: '#534AB7', color: '#fff', cursor: 'pointer', fontFamily: 'Arial, sans-serif', marginTop: '10px' },
    btnSecondary: { width: '100%', padding: '8px', fontSize: '12px', borderRadius: '8px', border: '1px solid #ccc', background: 'transparent', color: '#666', cursor: 'pointer', fontFamily: 'Arial, sans-serif', marginTop: '6px' },
    btnDisabled: { width: '100%', padding: '9px', fontSize: '13px', borderRadius: '8px', border: 'none', background: '#ccc', color: '#fff', cursor: 'not-allowed', fontFamily: 'Arial, sans-serif', marginTop: '10px' },
    msgSucces: { fontSize: '12px', color: '#085041', backgroundColor: '#e1f5ee', border: '1px solid #5dcaa5', borderRadius: '6px', padding: '6px 10px', marginTop: '8px' },
    msgErreur: { fontSize: '12px', color: '#c0392b', backgroundColor: '#fdf0f0', border: '1px solid #f5c6c6', borderRadius: '6px', padding: '6px 10px', marginTop: '8px' },
    loading: { textAlign: 'center', padding: '80px', color: '#888' },
    modal: { position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, background: 'rgba(0,0,0,0.4)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000 },
    modalBox: { background: '#fff', borderRadius: '12px', padding: '28px', width: '560px', maxWidth: '90vw', maxHeight: '80vh', overflow: 'auto' },
    modalTitle: { fontSize: '16px', fontWeight: '600', margin: '0 0 6px' },
    modalSub: { fontSize: '13px', color: '#888', margin: '0 0 20px' },
    participantRow: { display: 'flex', alignItems: 'center', gap: '12px', padding: '10px 0', borderBottom: '1px solid #f0f0f0' },
    participantAvatar: { width: '34px', height: '34px', borderRadius: '50%', background: '#eeedfe', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '12px', fontWeight: '600', color: '#534AB7', flexShrink: 0 },
    participantNom: { fontSize: '13px', fontWeight: '600', margin: '0 0 2px' },
    participantEmail: { fontSize: '12px', color: '#888', margin: 0 },
    statusBadge: (s) => ({ fontSize: '11px', padding: '2px 8px', borderRadius: '10px', background: s === 'confirme' ? '#e1f5ee' : '#faeeda', color: s === 'confirme' ? '#085041' : '#633806', marginLeft: 'auto' }),
    footer: { borderTop: '1px solid #e5e5e5', padding: '20px 24px', display: 'flex', justifyContent: 'space-between', fontSize: '12px', color: '#aaa', marginTop: '48px' }
  }

  const mois = ['Jan','Fev','Mar','Avr','Mai','Jun','Jul','Aou','Sep','Oct','Nov','Dec']

  return (
    <div>
      {activiteOuverte && (
        <div style={styles.modal} onClick={() => setActiviteOuverte(null)}>
          <div style={styles.modalBox} onClick={e => e.stopPropagation()}>
            <p style={styles.modalTitle}>Participants — {activiteOuverte.nom_activite}</p>
            <p style={styles.modalSub}>{participants.length} participant{participants.length > 1 ? 's' : ''} inscrit{participants.length > 1 ? 's' : ''} / {activiteOuverte.capacite_max} places</p>
            {loadingParticipants ? (
              <p style={{ color: '#888', fontSize: '13px' }}>Chargement...</p>
            ) : participants.length === 0 ? (
              <p style={{ color: '#aaa', fontSize: '13px' }}>Aucun participant inscrit.</p>
            ) : (
              participants.map(p => (
                <div key={p.ID_inscription} style={styles.participantRow}>
                  <div style={styles.participantAvatar}>{p.prenom[0]}{p.nom[0]}</div>
                  <div>
                    <p style={styles.participantNom}>{p.prenom} {p.nom}</p>
                    <p style={styles.participantEmail}>{p.email}</p>
                  </div>
                  <span style={styles.statusBadge(p.statut)}>{p.statut}</span>
                </div>
              ))
            )}
            <button style={{ ...styles.btnSecondary, marginTop: '16px' }} onClick={() => setActiviteOuverte(null)}>Fermer</button>
          </div>
        </div>
      )}

      <div style={styles.hero}>
        <div style={styles.heroInner}>
          <h1 style={styles.title}>Activites et programmes</h1>
          <p style={styles.sub}>Inscrivez-vous aux activites collectives proposees par VitaCare</p>
        </div>
      </div>

      <div style={styles.page}>
        {loading ? (
          <p style={styles.loading}>Chargement...</p>
        ) : activites.length === 0 ? (
          <p style={styles.loading}>Aucune activite disponible.</p>
        ) : (
          <div style={styles.grid}>
            {activites.map(a => {
              const d = new Date(a.date_heure)
              const plein = parseInt(a.nb_inscrits) >= parseInt(a.capacite_max)
              const msg = messages[a.ID_activite]
              const placesRestantes = parseInt(a.capacite_max) - parseInt(a.nb_inscrits)

              return (
                <div key={a.ID_activite} style={styles.card}>
                  <div style={styles.cardHeader(a.categorie)}>{icones[a.categorie]?.emoji || '🏃'}</div>
                  <div style={styles.cardBody}>
                    <p style={styles.cardTitle}>{a.nom_activite}</p>
                    <p style={styles.cardDesc}>{a.description}</p>
                    <p style={styles.cardMeta}>{d.getDate()} {mois[d.getMonth()]} {d.getFullYear()} — {d.getHours()}h{String(d.getMinutes()).padStart(2,'0')}</p>
                    <p style={styles.cardMeta}>{a.lieu}</p>
                    <div style={styles.cardFooter}>
                      <span style={styles.price}>{parseFloat(a.tarif) === 0 ? 'Gratuit' : a.tarif + ' €'}</span>
                      <span style={styles.places(plein)}>{plein ? 'Complet' : placesRestantes + ' place' + (placesRestantes > 1 ? 's' : '') + ' restante' + (placesRestantes > 1 ? 's' : '')}</span>
                    </div>
                    {msg ? (
                      <p style={msg.type === 'succes' ? styles.msgSucces : styles.msgErreur}>{msg.texte}</p>
                    ) : (
                      <button
                        style={plein ? styles.btnDisabled : styles.btnPrimary}
                        disabled={plein}
                        onClick={() => inscrire(a.ID_activite)}
                      >
                        {plein ? 'Complet' : user ? "S'inscrire" : "Se connecter pour s'inscrire"}
                      </button>
                    )}
                    <button style={styles.btnSecondary} onClick={() => voirParticipants(a)}>
                      Voir les participants ({a.nb_inscrits}/{a.capacite_max})
                    </button>
                  </div>
                </div>
              )
            })}
          </div>
        )}
      </div>

      <div style={styles.footer}>
        <span>VitaCare 2026 - Plateforme de sante et bien-etre</span>
        <span>Mentions legales - Confidentialite - Contact</span>
      </div>
    </div>
  )
}

export default Activites