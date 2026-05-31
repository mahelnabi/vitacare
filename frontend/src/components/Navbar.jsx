function Navbar({ user, navigate, onDeconnexion, darkMode, toggleDarkMode }) {
  const styles = {
    nav: {
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      padding: '0 24px',
      height: '56px',
      backgroundColor: darkMode ? '#1a1a2e' : '#ffffff',
      borderBottom: '1px solid ' + (darkMode ? '#2d2d4e' : '#e5e5e5'),
      position: 'sticky',
      top: 0,
      zIndex: 100,
      transition: 'background-color 0.3s, border-color 0.3s',
    },
    logo: {
      fontSize: '18px',
      fontWeight: '600',
      color: darkMode ? '#7ec8a4' : '#534AB7',
      cursor: 'pointer',
      display: 'flex',
      alignItems: 'center',
      gap: '8px',
    },

    
    links: { display: 'flex', gap: '4px' },
    link: {
      fontSize: '13px',
      color: darkMode ? '#b0b0c0' : '#666',
      cursor: 'pointer',
      background: 'none',
      border: 'none',
      padding: '7px 12px',
      borderRadius: '8px',
      fontFamily: 'Arial, sans-serif',
      fontWeight: '500',
      transition: 'background 0.15s, color 0.15s',
    },

    actions: { display: 'flex', gap: '8px', alignItems: 'center' },
    btnDark: {
      fontSize: '18px',
      padding: '4px 8px',
      borderRadius: '8px',
      border: '1px solid ' + (darkMode ? '#2d2d4e' : '#e5e5e5'),
      background: darkMode ? '#2d2d4e' : '#f9f9f9',
      cursor: 'pointer',
      lineHeight: 1,
    },
    btnOutline: {
      fontSize: '13px',
      padding: '6px 14px',
      borderRadius: '6px',
      border: '1px solid ' + (darkMode ? '#2d2d4e' : '#ccc'),
      background: 'transparent',
      color: darkMode ? '#b0b0c0' : '#333',
      cursor: 'pointer',
      fontFamily: 'Arial, sans-serif',
    },
    btnPrimary: {
      fontSize: '13px',
      padding: '6px 14px',
      borderRadius: '6px',
      border: 'none',
      background: darkMode ? '#1D9E75' : '#534AB7',
      color: '#fff',
      cursor: 'pointer',
      fontFamily: 'Arial, sans-serif',
    },
    userInfo: {
      fontSize: '13px',
      color: darkMode ? '#7ec8a4' : '#534AB7',
      fontWeight: '500',
      cursor: 'pointer',
    }
  }




  return (
    <nav style={styles.nav}>
      <span style={styles.logo} onClick={() => navigate('accueil')}>
        🌿 VitaCare
      </span>
      <div style={styles.links}>
        <button style={styles.link} onClick={() => navigate('accueil')}>Services</button>
        <button style={styles.link} onClick={() => navigate('activites')}>Activites</button>
        <button style={styles.link} onClick={() => navigate('intervenants')}>Intervenants</button>
        {user && <button style={styles.link} onClick={() => navigate('dashboard')}>Mon espace</button>}
      </div>
      <div style={styles.actions}>
        <button style={styles.btnDark} onClick={toggleDarkMode} title="Mode sombre">
          {darkMode ? '☀️' : '🌙'}
        </button>
        {user ? (
          <>
            <span style={styles.userInfo} onClick={() => navigate('profil')}>{user.prenom} {user.nom}</span>
            <button style={styles.btnOutline} onClick={onDeconnexion}>Deconnexion</button>
          </>
        ) : (
          <>
            <button style={styles.btnOutline} onClick={() => navigate('connexion')}>Connexion</button>
            <button style={styles.btnPrimary} onClick={() => navigate('inscription')}>S'inscrire</button>
          </>
        )}
      </div>
    </nav>
  )
}

export default Navbar