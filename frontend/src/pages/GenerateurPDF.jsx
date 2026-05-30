function genererPDFRdv(rdv, user) {
  const contenu = `
<!DOCTYPE html>
<html lang="fr">
<head>
  <meta charset="UTF-8">
  <title>Recapitulatif RDV - VitaCare</title>
  <style>
    * { margin: 0; padding: 0; box-sizing: border-box; }
    body { font-family: Arial, sans-serif; color: #222; background: #fff; padding: 40px; }
    .header { display: flex; justify-content: space-between; align-items: flex-start; margin-bottom: 40px; padding-bottom: 20px; border-bottom: 2px solid #1D9E75; }
    .logo { font-size: 28px; font-weight: 700; color: #1D9E75; }
    .logo-sub { font-size: 13px; color: #888; margin-top: 4px; }
    .doc-info { text-align: right; font-size: 12px; color: #888; }
    .doc-title { font-size: 22px; font-weight: 700; color: #222; margin-bottom: 6px; }
    .badge { display: inline-block; background: #e1f5ee; color: #085041; font-size: 12px; padding: 4px 12px; border-radius: 10px; font-weight: 600; margin-bottom: 30px; }
    .section { margin-bottom: 28px; }
    .section-title { font-size: 13px; font-weight: 700; color: #1D9E75; text-transform: uppercase; letter-spacing: 1px; margin-bottom: 12px; padding-bottom: 6px; border-bottom: 1px solid #e5e5e5; }
    .info-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 12px; }
    .info-item { background: #f9f9fb; border-radius: 8px; padding: 12px 16px; }
    .info-label { font-size: 11px; color: #888; margin-bottom: 4px; text-transform: uppercase; letter-spacing: 0.5px; }
    .info-val { font-size: 14px; font-weight: 600; color: #222; }
    .info-val.price { color: #1D9E75; font-size: 18px; }
    .footer { margin-top: 48px; padding-top: 20px; border-top: 1px solid #e5e5e5; display: flex; justify-content: space-between; font-size: 11px; color: #aaa; }
    .mention { background: #fff8e1; border: 1px solid #f0c040; border-radius: 8px; padding: 12px 16px; font-size: 12px; color: #7a5800; margin-top: 20px; }
  </style>
</head>
<body>
  <div class="header">
    <div>
      <div class="logo">🌿 VitaCare</div>
      <div class="logo-sub">Plateforme de sante et bien-etre</div>
    </div>
    <div class="doc-info">
      <div>Document genere le ${new Date().toLocaleDateString('fr-FR')}</div>
      <div>Reference : RDV-${rdv.ID_rdv.toString().padStart(6, '0')}</div>
    </div>
  </div>

  <p class="doc-title">Recapitulatif de rendez-vous</p>
  <span class="badge">✓ Rendez-vous confirme</span>

  <div class="section">
    <p class="section-title">Informations du patient</p>
    <div class="info-grid">
      <div class="info-item">
        <p class="info-label">Nom complet</p>
        <p class="info-val">${user.prenom} ${user.nom}</p>
      </div>
      <div class="info-item">
        <p class="info-label">Reference dossier</p>
        <p class="info-val">PAT-${user.id.toString().padStart(5, '0')}</p>
      </div>
    </div>
  </div>

  <div class="section">
    <p class="section-title">Details de la consultation</p>
    <div class="info-grid">
      <div class="info-item">
        <p class="info-label">Service</p>
        <p class="info-val">${rdv.nom_service}</p>
      </div>
      <div class="info-item">
        <p class="info-label">Intervenant</p>
        <p class="info-val">${rdv.intervenant_prenom} ${rdv.intervenant_nom}</p>
      </div>
      <div class="info-item">
        <p class="info-label">Date</p>
        <p class="info-val">${new Date(rdv.date_heure).toLocaleDateString('fr-FR', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}</p>
      </div>
      <div class="info-item">
        <p class="info-label">Heure</p>
        <p class="info-val">${new Date(rdv.date_heure).toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' })}</p>
      </div>
      <div class="info-item">
        <p class="info-label">Duree</p>
        <p class="info-val">${rdv.duree_min} minutes</p>
      </div>
      <div class="info-item">
        <p class="info-label">Lieu</p>
        <p class="info-val">VitaCare Centre</p>
      </div>
    </div>
  </div>

  <div class="section">
    <p class="section-title">Facturation</p>
    <div class="info-grid">
      <div class="info-item">
        <p class="info-label">Montant</p>
        <p class="info-val price">${rdv.tarif} €</p>
      </div>
      <div class="info-item">
        <p class="info-label">Statut du paiement</p>
        <p class="info-val">Simule - Confirme</p>
      </div>
    </div>
  </div>

  <div class="mention">
    ⚠️ Ce document est genere dans le cadre d un projet universitaire pedagogique. Le paiement est simule et aucune transaction bancaire reelle n a eu lieu.
  </div>

  <div class="footer">
    <span>VitaCare - Plateforme de sante et bien-etre - ING2 ECE Paris 2026</span>
    <span>Document genere automatiquement</span>
  </div>
</body>
</html>
  `

  const fenetre = window.open('', '_blank')
  fenetre.document.write(contenu)
  fenetre.document.close()
  fenetre.print()
}

export default genererPDFRdv