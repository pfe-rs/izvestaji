---
title: Rešavanje testa inteligencije
summary: Projekat iz veštačke inteligencije koja može da rešava test inteligencije rađen na letnjem kampu za stare polaznike 2022. godine od Danila Milovanovića i Ognjena Stefanovića.
---

### Apstrakt

### Abstract

### Uvod

Cilj razvijanja neke veštačke ineteligencije jeste da se razvije integliencija sličnih, ili boljih, sposobnosti prosečnog čoveka. Da mašina ima mogućnost da obavlja razne zadatke kao bilo koji čovek, ako ne i bolje. Do sada, razvijeni su modeli veštačke inteligencije koji mogu veoma dobro da urade jednu određenu stvar, ali čim je toj veštačkoj inteligenciji dat neki novi zadatak, ona prestaje da funkcioniše. Dobar primer ovog problema jeste veštačka inteligencija koja za cilj ima da igra šah. Takve veštačke inteligencije mogu da pobede najbolje šah majstore na svetu ali za razliku od šah majstora, ta veštačka inteligencija ne može da prepoznaje oblike ili da, na primer, skuva kafu. 

Ideja projekta je bila da se razvije veštačka inteligencija koja može da rešava neke opšte probleme i da se prilagođava novim uslovima sredine. Prema teorijama strukture ljudske inteligencije, adaptacija na različite uslove sredine predstavlja opštu inteligenciju(G faktor inteligencije). Jedan od ustaljenih načina testiranja opšte inteligencije jeste putem testa koji je razvio Džon Rejven (John C. Raven) 1936. godine nazivan Raven’s Progressive Matrices. Raven’s Progressive Matrices predstavlja jednu popularnu vrstu IQ testa koja se sastoji od mreže dimenzija 3 x 3 u kojoj 8 ćelija ima u sebi neku figuru, a za 9. praznu ćeliju je ponuđeno nekoliko odgovora. Cilj ispitanika jeste da odredi koja bi ponuđena figura bila najpogodnija za 9. ćeliju tako da ispunjava osobine relacija koje su primenjene na ovoj mreži. 

U ovom projektu bavili smo se kreiranjem veštačke inteligencije koja može da rešava Raven’s Progressive Matrices test iz baze Procedurally Generated Matrices koju je napravila kompanija DeepMind. Kako priprema za test inteligencije čini osobu nepogodnom za testiranje, organizacije koje se bave testiranjem trude se da čuvaju svoje baze testova od javnosti i javno dostupni testovi inteligencije su retkost. RM je po tom pitanju pogodan za testiranje veštačke inteligencije jer se test primeri mogu generisati primenom nekoliko pravila koja ga opisuju. Grupa Deepmind je u svom radu napravila baš takav algoritam i učinila tu bazu podataka dostupnu svima na korišćenje. Baza testova se sastoji od 1,42 miliona primera i podeljena je u train, test i validation set. 

Projekat se sastoji iz dva dela, prvi deo je ekstrakcija osobina svakog panela a drugi deo je poređenje tih osobina i nalaženje relacija između njih. Da bismo to postigli koristili smo dve metode koje su opisane u referentnim radovima.  Prva metoda, "Noisy Contrast and Decentralization", iz rada "Unsupervised Abstract Reasoning for Raven’s
Problem Matrices" instituta inženjera elektronike i elektrotehnike se zasniva na ... Druga metoda, "Wild Relation Network", iz rada "Measuring abstract reasoning in neural networks" kompanije DeepMind se zasniva na korišćenju konvolucionih mreža i relation network-a radi dobijanja ocene o tome koliko je neki ponuđeni choice panel pogodan kao odgovor, gde se panel sa najvećom ocenom bira kao rešenje.

### Metode

##### NCD

##### WReN




### Istraživanje i rezultati

### Zaključak
