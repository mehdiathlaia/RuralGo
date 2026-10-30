# Millores de qualitat, accessibilitat i localització de RuralGo

## Canvis implementats

### Accés i recuperació de contrasenya
- La pantalla d'accés permet sol·licitar un enllaç de recuperació.
- El backend genera un token aleatori, en desa el resum SHA-256 i el fa caducar al cap de 30 minuts.
- El token només es pot utilitzar una vegada; en canviar la contrasenya s'invalida.
- La contrasenya nova ha de tenir almenys 10 caràcters i s'ajusta al límit de 72 bytes de bcrypt.
- La resposta per a una adreça desconeguda no revela si hi ha un compte registrat.
- La interfície mostra errors de connexió, errors del servidor, càrrega i confirmació en català.
- La redirecció posterior a l'accés només accepta rutes internes.

### Sessió i navegació
- Les rutes privades del frontend comproven que hi hagi una sessió vàlida i, quan correspon, el rol correcte.
- El panell d'administració conserva el seu flux d'autenticació independent.
- La sessió no elimina el token local davant d'una fallada temporal de xarxa.
- Els missatges d'error d'accés són més entenedors.

### Llengua i experiència d'usuari
- Revisió de textos en català a les pantalles d'inici, registre, perfil, administració, planificació, historial, serveis, analítica, pagament, valoracions, emergències i demostració.
- Revisió de textos dels components compartits: peu de pàgina, notificacions, menú, formularis i estat del viatge.
- Unificació de colors, estats de focus, superfícies, targetes, botons i interaccions.
- Ajustos de presentació a la pàgina d'inici i al formulari d'accés.
- Eliminació de regles responsive globals massa agressives que podien alterar les quadrícules de cada component.

## Configuració necessària a Render

A més de les variables de base de dades i JWT ja documentades, cal configurar:
- `SMTP_HOST`
- `SMTP_PORT` (normalment 587)
- `SMTP_SECURE` (normalment false per al port 587)
- `SMTP_USER`
- `SMTP_PASS`
- `SMTP_FROM`
- `FRONTEND_URL` (per exemple, `https://ruralgo-app.vercel.app`)

Sense SMTP, la recuperació de contrasenya no pot enviar l'enllaç. No s'ha de considerar provada fins que s'hagi configurat un proveïdor i s'hagi completat una recuperació real.

## Verificacions pendents

- Fer una compilació de producció de Vue/Vite i corregir qualsevol error que hi aparegui.
- Provar accés amb client i conductor, rutes protegides, sessió caducada i accés directe a una URL privada.
- Provar el flux complet de recuperació amb SMTP real, incloent-hi token caducat i token reutilitzat.
- Provar l'aprovació i el rebuig de sol·licituds amb correus reals.
- Revisar endpoint per endpoint l'autorització del backend abans de connectar operacions de negoci.
- Revisar les seccions que encara utilitzen dades locals o de demostració (especialment pagaments, analítica i dades de viatges) i no presentar-les com a dades reals.
- Revisar el contingut legal i les afirmacions sobre assegurances, pagaments i disponibilitat abans de publicar-les com a condicions contractuals.

## Estat de desplegament

Els canvis es desen a la branca principal i els desplegaments automàtics depenen de Vercel i Render. En la darrera comprovació, Vercel havia informat d'un límit de compilacions del compte (`build-rate-limit`). Per tant, no s'ha pogut confirmar una compilació ni un desplegament frontend correctes des d'aquesta sessió.
### Seguretat del cicle de vida dels viatges (revisió 30/10/2026)
- La creació de sol·licituds queda limitada al rol de passatger i valida coordenades, adreces i valors estimats.
- L'acceptació queda limitada a conductors i es fa amb una actualització atòmica per impedir que dos conductors acceptin el mateix viatge.
- L'inici i la finalització només els pot executar el conductor assignat i en l'estat correcte.
- La cancel·lació només és possible per a una persona participant i abans que el viatge hagi començat.
- Les valoracions i l'import final es validen abans de desar-los.
- Les llistes de viatges actius es limiten als viatges propis; els conductors poden consultar les sol·licituds obertes.
- L'historial s'ha ampliat a 50 registres.
- S'han substituït respostes d'error amb detalls interns per missatges controlats i registres al servidor.

### Interfície pública
- S'ha refinat la portada amb una jerarquia tipogràfica més clara, degradat verd, botons més visibles, targetes amb millor separació i ajustos per a mòbil.
- S'ha respectat la preferència del sistema per reduir animacions.

### Pendents abans de publicar
- Cal executar la compilació de producció amb dependències instal·lades i revisar el resultat de GitHub Actions.
- Cal provar els endpoints de viatges amb comptes reals de passatger i conductor, incloent-hi intents d'accés creuat i transicions d'estat no permeses.
- Cal revisar la consistència de valoracions i la finalització si es produeixen errors parcials en la base de dades.
- El desplegament de Vercel continua subjecte al límit temporal del compte; els commits no garanteixen que el límit s'hagi aixecat.
