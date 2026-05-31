
 
function Accueil({ navigate }) {
  const [services, setServices] = useState([])
  const [loading, setLoading] = useState(true)
  const [recherche, setRecherche] = useState('')
  const [categorie, setCategorie] = useState('')
 
  const categories = ['Tous', 'Bien-etre', 'Nutrition', 'Sante', 'Sante mentale']
 
  useEffect(() => {
    chargerServices()
  }, [categorie])
 
  const chargerServices = () => {
    setLoading(true)
    let url = 'http://localhost/vitacare/backend/api/services.php?action=liste'
    if (categorie && categorie !== 'Tous') url += '&categorie=' + categorie
    if (recherche) url += '&recherche=' + recherche
 
    fetch(url)
      .then(res => res.json())
      .then(data => {
        setServices(data.services || [])
        setLoading(false)
      })
      .catch(() => setLoading(false))
  }
 
  const handleRecherche = (e) => {
    e.preventDefault()
    chargerServices()
  }
 
  const styles = {
    hero: {
      backgroundColor: '#f0effe',
      padding: '48px 24px',
      textAlign: 'center',
      borderBottom: '1px solid #e5e5e5',
    },
    heroTitle: {
      fontSize: '28px',
      fontWeight: '600',
      color: '#2d2a6e',
      margin: '0 0 8px',
    },
    heroSub: {
      fontSize: '15px',
      color: '#666',
      margin: '0 0 24px',
    },
    searchForm: {
      display: 'flex',
      gap: '8px',
      maxWidth: '500px',
      margin: '0 auto',
    },
    searchInput: {
      flex: 1,
      fontSize: '14px',
      padding: '10px 14px',
      borderRadius: '8px',
      border: '1px solid #ccc',
      fontFamily: 'Arial, sans-serif',
    },
    btnPrimary: {
      fontSize: '14px',
      padding: '10px 20px',
      borderRadius: '8px',
      border: 'none',
      background: '#534AB7',
      color: '#fff',
      cursor: 'pointer',
      fontFamily: 'Arial, sans-serif',
    },
    section: {
      maxWidth: '1100px',
      margin: '0 auto',
      padding: '32px 24px',
    },
    cats: {
      display: 'flex',
      gap: '8px',
      flexWrap: 'wrap',
      marginBottom: '28px',
    },
    catPill: (active) => ({
      fontSize: '13px',
      padding: '6px 16px',
      borderRadius: '20px',
      border: '1px solid ' + (active ? '#534AB7' : '#ccc'),
      background: active ? '#eeedfe' : 'transparent',
      color: active ? '#3c3489' : '#666',
      cursor: 'pointer',
      fontFamily: 'Arial, sans-serif',
    }),
    sectionTitle: {
      fontSize: '18px',
      fontWeight: '600',
      margin: '0 0 6px',
      color: '#222',
    },
    sectionSub: {
      fontSize: '13px',
      color: '#888',
      margin: '0 0 20px',
    },
    grid: {
      display: 'grid',
      gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))',
      gap: '16px',
    },
    card: {
      backgroundColor: '#fff',
      border: '1px solid #e5e5e5',
      borderRadius: '10px',
      overflow: 'hidden',
      cursor: 'pointer',
      transition: 'box-shadow 0.2s',
    },
    cardImg: {
      height: '80px',
      backgroundColor: '#f0effe',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      fontSize: '32px',
    },
    cardBody: {
      padding: '12px',
    },
    cardTitle: {
      fontSize: '14px',
      fontWeight: '600',
      margin: '0 0 4px',
      color: '#222',
    },
    cardSub: {
      fontSize: '12px',
      color: '#888',
      margin: '0 0 8px',
    },
    cardFooter: {
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
    },
    price: {
      fontSize: '14px',
      fontWeight: '600',
      color: '#534AB7',
    },
    badge: {
      fontSize: '11px',
      padding: '2px 8px',
      borderRadius: '10px',
      background: '#e1f5ee',
      color: '#085041',
    },
    loading: {
      textAlign: 'center',
      padding: '48px',
      color: '#888',
    },
    footer: {
      borderTop: '1px solid #e5e5e5',
      padding: '20px 24px',
      display: 'flex',
      justifyContent: 'space-between',
      fontSize: '12px',
      color: '#aaa',
      marginTop: '48px',
    }
  }
 
  const icones = {
    'Bien-etre': '🧘',
    'Nutrition': '🥗',
    'Sante': '🏥',
    'Sante mentale': '🧠',
  }
 
  return (
    <div>
      <div style={styles.hero}>
        <h1 style={styles.heroTitle}>Votre sante, notre priorite</h1>
        <p style={styles.heroSub}>Trouvez un service et reservez un rendez-vous en quelques clics</p>
        <form style={styles.searchForm} onSubmit={handleRecherche}>
          <input
            style={styles.searchInput}
            type="text"
            placeholder="Rechercher un service..."
            value={recherche}
            onChange={e => setRecherche(e.target.value)}
          />
          <button style={styles.btnPrimary} type="submit">Rechercher</button>
        </form>
      </div>
 
      <div style={styles.section}>
        <div style={styles.cats}>
          {categories.map(cat => (
            <button
              key={cat}
              style={styles.catPill(categorie === cat || (cat === 'Tous' && !categorie))}
              onClick={() => setCategorie(cat === 'Tous' ? '' : cat)}
            >
              {cat}
            </button>
          ))}
        </div>
 
        <p style={styles.sectionTitle}>Services disponibles</p>
        <p style={styles.sectionSub}>{services.length} service{services.length > 1 ? 's' : ''} trouve{services.length > 1 ? 's' : ''}</p>
 
        {loading ? (
          <p style={styles.loading}>Chargement...</p>
        ) : (
          <div style={styles.grid}>
            {services.map(service => (
              <div
                key={service.ID_service}
                style={styles.card}
                onClick={() => navigate('service', service.ID_service)}
              >
                <div style={styles.cardImg}>
                  {icones[service.categorie] || '💊'}
                </div>
                <div style={styles.cardBody}>
                  <p style={styles.cardTitle}>{service.nom_service}</p>
                  <p style={styles.cardSub}>{service.duree_min} min</p>
                  <div style={styles.cardFooter}>
                    <span style={styles.price}>{service.tarif} €</span>
                    <span style={styles.badge}>Disponible</span>
                  </div>
                </div>
              </div>
            ))}
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
 
export default Accueil
