---
title: Prepoznavanje govora
summary: Projekat iz prepoznavanja govora rađen na letnjem kampu za stare polaznike 2022. godine od Dimitrija Pešića i Lazara Zubovića.
---
### Apstrakt

### Apstrakt na engleskom
### Uvod

Projekat "Prepoznavanje govora" pomaže nam da rešimo popularnu dilemu u AI tehnologiji, a to je kako da glas pretvorimo u kucani tekst. Motivacija projekta bila je u tome da se ne samo primene mnoge metode korišćene za speech recognition, već da se i uporede njihova praktičnost i upotreba u praktičnim svrhama. 

Naš projekat se zasniva na ideji korišćenja spektrograma kao osnovne metode prikaza zvuka u 2D formatu. Iz tog formata, drugačijim metodama bi se zvuk prepoznavao sa spektrograma što je zapravo ništa drugo no obična slika. Sa te slike mogu se pokupiti različiti podaci o zvuku zarad preciznijeg prepoznavanja istog.

Prelazeći kroz literaturu i referentne radove, mnogi su više doprineli pri samoj metodi obrade spektrograma nego pri izradi samih spektrograma. 

Osvrt na naš rad ogleda se u metodama koji su drugi radili pre nas, poput MFCC-a (Mel-Frequency Cepstral Coefficients), logističke regresije, Random Forest-a, SVM-a, XGBoost-a, kao i konvolucionih neuronskih mreža. Do našeg rada, ljudi su fokusirali svoje radove na obradi jednog metoda i testiranju na određenoj bazi. Nasuprot njihovim, naš rad ima dosta limitiranu bazu, te i sami rezultati variraju u odnosu na već dobijene.
### Aparatura i metoda

Naše rešenje problema prepoznavanja govora svodi se na izradu spektrograma i obradu istih.

#### Spektrogrami

#### Metode obrade spektrograma

##### Logistička regresija

Logistička regresija je metoda klasifikacije koja se može primeniti i koristiti svuda gde imamo promenljive koje se mogu kategorisati. Za razliku on linearne regresije, njene vrednosti su ograničene između 0 i 1. 

Ova metoda za klasifikaciju ne koristi linearnu već sigmoidnu funkciju bilo kog tipa, a primer takve funckije je dat na slici 1.

![Sigmoid](/izvestaji/static/images/1.png)

Binarna logistička regresija kao izlaz daje vrednosti 0 ili 1, zavisno od toga da li posmatrana promenljiva pripada nekoj klasi ili ne. To često nije dovoljno, pa se koristi multinomijalna logistička regresija (ili Softmax Regression) koja može da razlikuje više od dve različite kategorija.

Funkcija cene ove metode je logaritamska da bismo dobili konveksnu završnu funkciju parametara i time postigli da gradient descent nađe globalni, a ne samo lokalni minimum funkcije.

![Funkcija](/izvestaji/static/images/2.png)

- hΘ(x) = sigmoid (w*x + b), Y rezultat, x = promenljiva koju posmatramo

Da bi se logistička regresija dala što bolje rezultate, trenira se MLE (Maximum Likelihood Estimation) metodom, nameštajući beta parametre kroz više iteracija tražeći najbolje fitovanu krivu, odakle se biraju najbolje procene parametara. Nakon toga se dobijeni koeficijenti koriste za računanje verovatnoće za svaki primer, pa se one logaritmuju i sabiraju i time formiraju konačnu predviđenu verovatnoću. Svaka vrednost iznad 0.5 (ili bilo koje zadate granice) se tretira kao da je jedinica, a svaka manja od te granice se tretira kao nula.


##### MFCCs

##### Random Forest

Random Forest je klasifikator koji koristi više stabala odlučivanja (Desicion Tree) i njihova pojedinačna predviđanja stapa u jedno konačno.

Stabla odlučivanja rade tako što podatke koje dobiju razvrstavaju u grupe nizom grananja. U svakom grananju se posmatra neki parametar koji bi najbolje mogao da razvrsta pristigle podatke u dve podgrane koje se dalje mogu i same deliti. U idealnoj situaciji bismo trebali da svi podaci u svojoj finalnoj podgrani budu isti, ali je to sa ograničenom dubinom mreže uglavnom nemoguće.

Svako stablo odlučivanja će dati svoj rezultat, a onaj rezultat koji se najviše puta pojavi biće izabran kao konačno predviđanje celog klasifikatora.

![Random Forest](/izvestaji/static/images/3.png)

Pošto su pojedinačna stabla veoma osetljiva na podatke koji im se pruže, koristi se **Bagging** (ili **B**ootstrap **Agg**regat**ing**) princip. On dozvoljava dve bitne stvari:

1.	Svakom stablu da nasumično izabere podatke sa kojima će da radi iz baze i time znatno smanji mogućnost overfitting-a.

2.	Svako stablo dobija neki nasumičan feature na kom će se trenirati, umesto da se trenira na skupu feature-a, što bi zahtevalo i veću dubinu mreže. Ovaj aspekt, zvani Random Subspace Method ili Attribute Bagging, smanjuje korelaciju između stabala i time ih čini nezavisnijim jedne od drugih.

##### XGBoost

##### SVM

##### Konvolucione neuronske mreže

### Istraživanje i rezultati

Rezultati su krajnje očekivani uzimajući u obzir veličinu baze koja je obrađivanja. 
U ovom odeljku treba opisati sve rezultate do kojih ste došli. Ako i dalje radite na svom projektu, parcijalni rezultati su potpuno prihvatljivi.

### Zaključak

Zaključak ima za cilj da dodatno prokomentarišete rezultate i napravite pregled rada.
