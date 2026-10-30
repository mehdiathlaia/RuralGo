# Gestió de sol·licituds i accés d'administració

## Estat
La gestió centralitzada de sol·licituds està connectada al backend de Render i a MongoDB. El flux de consulta i aprovació s'ha provat amb una sol·licitud real: el registre apareix al panell i desapareix de pendents després d'aprovar-lo i recarregar la pàgina.

## Arquitectura
- Frontend: Vue 3 + Pinia; desplegament a Vercel.
- Backend: Express; desplegament a Render (directori `server`).
- Persistència: MongoDB mitjançant Mongoose.
- API base: `https://ruralgo-backend-ighg.onrender.com/api`.

## Variables d'entorn del backend
Configurar a Render, sense posar-les al repositori:
- `MONGODB_URI`: cadena de connexió de MongoDB.
- `ADMIN_EMAIL`: correu de l'administrador.
- `ADMIN_PASSWORD`: contrasenya de l'administrador.
- `JWT_SECRET`: secret aleatori llarg per signar tokens.

No compartir ni versionar aquests valors. El token d'administració expira al cap de 8 hores.

## Endpoints
- `POST /api/registration-requests`: crea una sol·licitud; normalitza el correu i evita duplicats amb estat pendent o aprovat.
- `POST /api/admin/login`: valida les credencials d'administració i retorna un JWT.
- `GET /api/registration-requests`: retorna sol·licituds només amb JWT d'administrador vàlid.
- `PATCH /api/registration-requests/:id`: aprova o rebutja una sol·licitud només amb JWT d'administrador. Desa l'estat, la data de revisió, l'administrador i, si escau, el motiu del rebuig.
- `GET /api/health`: estat del servidor i de la connexió MongoDB.

## Model de dades
La col·lecció de sol·licituds desa tipus d'usuari, nom, correu, telèfon, DNI, adreça, codi postal, ciutat, data de naixement, dades del permís de conduir, comentaris, estat i metadades de revisió.

## Frontend d'administració
- Ruta: `/admin/registrations` (també accessible des de `/admin`).
- El formulari d'accés utilitza les credencials definides a Render.
- Les sol·licituds pendents es carreguen des de l'API; l'aprovació i el rebuig esperen la resposta del servidor abans d'actualitzar la interfície.
- El token i el correu d'administració es mantenen a `localStorage`; es pot tancar la sessió amb el botó del panell.
- En rebre un 401/403, la sessió local d'administració es neteja.

## Proves fetes
1. Una sol·licitud s'ha desat a MongoDB.
2. S'ha verificat el rebuig de duplicats per correu.
3. S'ha iniciat sessió al panell amb credencials d'administrador.
4. La sol·licitud desada s'ha carregat des del backend.
5. S'ha aprovat i, després de recarregar el panell, ja no apareix a la llista de pendents.

## Limitacions conegudes / següents passos
- El rebuig està implementat a l'API i al panell, però encara cal provar-lo amb una sol·licitud de prova.
- L'aprovació desa l'estat de la sol·licitud; no crea encara un compte d'usuari amb credencials d'accés.
- Els missatges de correu continuen sent simulats al frontend; no hi ha un proveïdor de correu connectat.
- Altres seccions del panell (usuaris, viatges, analítica i auditoria) encara depenen de dades locals/de demostració i no s'han migrat a MongoDB.
- Cal revisar els camps addicionals del formulari (targeta sanitària i contacte d'emergència, entre d'altres) perquè actualment no tots formen part del model de sol·licitud del backend.

## Desplegament
Els canvis a la branca principal de GitHub activen els desplegaments configurats a Vercel i Render. Després de canviar variables d'entorn a Render, el servei s'ha de reiniciar perquè les llegeixi.
