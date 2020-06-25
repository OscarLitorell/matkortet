# Matkortet
En hemsida där man kan se vad dagens rätt är på olika matställen på matkortet hos NTI-gymnasiet Johanneberg.

## Installation

För att köra programmet krävs [node.js](https://nodejs.org/) installerat.

När du installerat node.js, navigera till mappen i kommandotolken och skriv in `npm install` för att installera alla nödvändiga moduler.

## Västtrafiks API
För att kunna integrera appen med Västtrafiks reseplanerare krävs att man har en nyckel till deras API. En nyckel kan fås genom att registrera sig hos [Västtrafiks utvecklarportal](https://developer.vasttrafik.se/), och sedan skapa en app som prenumererar på deras Reseplaneraren-API. Nyckeln kan fås genom att gå in på sidan för applikationen och klicka på "hantera nycklar". Där finns nyckeln följande ruta:
```
curl -k -d "grant_type=client_credentials" -H "Authorization: Basic <nyckel>" https://api.vasttrafik.se:443/token
```

## Start av server
Servern behöver startas med nyckeln som miljövariabeln VASTTRAFIK_KEY. Detta görs genom att skriva:


För att starta servern på Windows, skriv:
```bat
SET VASTTRAFIK_KEY=<nyckel> && SET PORT=<port> && npm start
```
För att starta den på MacOS eller Linux, skriv:
```sh
VASTTRAFIK_KEY=<nyckel> PORT=<port> npm start
```
Root-privilegier krävs för att använda port 80:
```sh
sudo VASTTRAFIK_KEY=<nyckel> PORT=80 npm start
```

För att sedan se hemsidan, navigera till [localhost](http://localhost) i din webbläsare.

För att se hemsidan på andra enheter i samma nät, skriv in IP-adressen för din dator på webbläsaren.
