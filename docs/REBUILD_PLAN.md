# RuralGo — pla de reconstrucció

## Objectiu

Reconstruir RuralGo en una branca independent, mantenint la branca `main` intacta fins que la nova versió estigui provada. La reconstrucció ha de conservar l'abast funcional útil del producte, però no ha de fingir que serveis encara no integrats funcionen.

## Branca de treball

- Branca: `rebuild/clean-foundation`
- Punt de partida: capçalera actual de `main`.
- Producció no s'ha de canviar fins que hi hagi una versió candidata validada.

## Inventari inicial

### Reutilitzable
- Frontend Vue 3 + Vite.
- Navegació amb Vue Router i estat Pinia.
- Backend Node.js + Express.
- Persistència MongoDB/Mongoose.
- Autenticació JWT i hash de contrasenyes.
- Model i endpoints bàsics de viatges.
- Base Capacitor per a Android.
- Integració preparada per a Socket.IO i Google Maps.

### Incomplet o dependent d'integracions
- Pagaments: no hi ha passarel·la real configurada.
- Mapes: cal una clau vàlida i APIs habilitades; no s'ha de reutilitzar cap clau d'exemple.
- Seguiment GPS: cal implementar permisos, actualització autenticada i difusió fiable.
- Xat/atenció: la interfície no equival a un servei de missatgeria operatiu.
- Correu: cal configurar un proveïdor SMTP transaccional.
- Activitats/recomanacions: les dades de mostra no són un catàleg de producció.
- Analítica: les dades simulades no es poden presentar com a mètriques reals.
- Administració: cal consolidar autorització, dades i operacions en backend.

## Principis de la nova implementació

1. Una única font de veritat per a autenticació i sessió.
2. Validació i autorització al servidor; la interfície no és una barrera de seguretat.
3. Estats de viatge explícits i transicions controlades.
4. Cap dada, mètrica, pagament, ubicació o valoració inventada.
5. Integracions externes encapsulades i configurades amb variables d'entorn.
6. Disseny responsive, accessible, coherent i localitzat.
7. Errors, càrrega, absència de dades i funcions no disponibles amb estats visibles.
8. Migracions compatibles; no esborrem ni modifiquem dades de producció sense còpia i pla de migració.

## Fases

### Fase 0 — Preparació
- [x] Crear branca independent.
- [x] Registrar inventari inicial i dependències externes.
- [ ] Revisar variables d'entorn i secrets.
- [ ] Definir contractes API i rols.

### Fase 1 — Base tècnica
- [ ] Consolidar configuració frontend/backend.
- [ ] Separar configuració de desenvolupament, proves i producció.
- [ ] Afegir comprovacions automàtiques de lint/build/tests.
- [ ] Endreçar estructura de mòduls sense trencar rutes.

### Fase 2 — Funcions essencials
- [ ] Autenticació, registre i perfils.
- [ ] Sol·licitud i gestió de viatges.
- [ ] Experiències de passatger i conductor.
- [ ] Administració i aprovació de registres.

### Fase 3 — Experiència i serveis
- [ ] Sistema visual i accessibilitat.
- [ ] Mapes i ubicació.
- [ ] Notificacions.
- [ ] Valoracions.
- [ ] Activitats i analítica basades en dades reals.

### Fase 4 — Integracions opcionals
- [ ] Correu transaccional.
- [ ] Passarel·la de pagament.
- [ ] Xat/atenció en directe.
- [ ] Seguiment GPS en segon pla, si el model operatiu ho requereix.

### Fase 5 — Validació i llançament
- [ ] Proves de fluxos per rol.
- [ ] Proves de seguretat i permisos.
- [ ] Proves responsive i Android.
- [ ] Verificació de desplegament staging.
- [ ] Pla de migració i publicació amb reversió.

## Regles de publicació

- No fusionar a `main` fins que les proves de la branca passin.
- No desplegar la branca de reconstrucció a producció abans de validar-la.
- No incloure secrets, tokens, claus reals ni credencials al repositori.
- Qualsevol funció que depengui d'una credencial absent ha de mostrar-se com a no configurada, no com a operativa.
