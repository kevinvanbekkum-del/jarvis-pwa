J.A.R.V.I.S. PWA — versie 0.3 (gratis starter)

INHOUD
- Installeerbare iPhone-webapp (PWA)
- Iron Man-geïnspireerd dashboard
- Chatvenster
- Lokale basisopdrachten: tijd, datum, identiteit, grap, help
- Spraakuitvoer via iOS-systeemstemmen
- Spraakherkenning indien de browser dit ondersteunt
- Taalkeuze Nederlands/Engels
- Offline cache na eerste online bezoek

BELANGRIJKE BEPERKINGEN
1. Dit is een gratis basisassistent, nog geen volwaardige generatieve AI. Voor echte open gesprekken is een AI-backend nodig; API-gebruik kan kosten met zich meebrengen.
2. Zet nooit een geheime AI API-sleutel in app.js of andere browserbestanden.
3. iOS-webapps kunnen niet continu op de achtergrond luisteren naar "Hey JARVIS". Je moet de webapp openen en op de microfoon tikken.
4. Web Speech Recognition is browserafhankelijk en kan ontbreken in iOS Safari. In dat geval kun je chatten of de dicteerknop van het iPhone-toetsenbord gebruiken.
5. Voor installatie als PWA moet de site via HTTPS worden gehost.

GRATIS PUBLICEREN VIA GITHUB PAGES
1. Maak gratis een account op https://github.com als je er nog geen hebt.
2. Maak een nieuwe repository, bijvoorbeeld jarvis-pwa.
3. Upload ALLE bestanden en de map icons uit deze ZIP naar de hoofdmap van de repository.
4. Open Settings > Pages.
5. Kies bij Build and deployment: Deploy from a branch.
6. Kies branch main en folder /(root), klik Save.
7. Wacht tot GitHub de website publiceert. Je krijgt een adres zoals https://jouwgebruikersnaam.github.io/jarvis-pwa/

INSTALLEREN OP IPHONE
1. Open de gepubliceerde HTTPS-link in Safari (niet in een ingebouwde browser).
2. Tik op de Deel-knop (vierkant met pijl omhoog).
3. Kies 'Zet op beginscherm' / 'Add to Home Screen'.
4. Laat 'Open as Web App' aan staan als die optie verschijnt.
5. Tik op Voeg toe.
6. Open JARVIS vanaf je beginscherm en geef microfoonrechten als daarom wordt gevraagd.

TESTEN
- Open Chat en vraag: "Hoe laat is het?"
- Vraag: "Welke datum is het?"
- Tik op de microfoon als spraakherkenning beschikbaar is.
- Verander taal en stem in Settings.

Dit pakket wordt geleverd als bronbestanden; het is niet door mij gepubliceerd naar jouw GitHub-account. Publiceren vereist dat jij de repository aanmaakt en bestanden uploadt.
