---
title: Prepoznavanje govora
summary: Projekat iz prepoznavanja govora rađen na letnjem kampu za stare polaznike 2022. godine od Dimitrija Pešića i Lazara Zubovića.
---
### Apstrakt

### Apstrakt na engleskom
### Uvod

Projekat "Prepoznavanje govora" pomaže pri rešavanju popularne dileme u AI tehnologiji, a to je kako da se glas pretvori u kucani tekst. Motivacija projekta bila je u tome da se ne samo primene mnoge metode korišćene za speech recognition, već da se i uporede njihova praktičnost i upotreba u praktičnim svrhama. 

Projekat se zasniva na ideji korišćenja spektrograma kao osnovne metode prikaza zvuka u 2D formatu. Iz tog formata, drugačijim metodama bi se zvuk prepoznavao sa spektrograma što je zapravo ništa drugo no obična slika. Sa te slike mogu se pokupiti različiti podaci o zvuku zarad preciznijeg prepoznavanja istog.

Prelazeći kroz literaturu i referentne radove, mnogi su više doprineli pri metodi obrade spektrograma nego pri izradi samih spektrograma. 

Osvrt na rad ogleda se u metodama koje su pokrivene u referentnim radovima, poput MFCC-a (Mel-Frequency Cepstral Coefficients), logističke regresije, Random Forest-a, SVM-a, XGBoost-a, kao i konvolucionih neuronskih mreža. Do ovog projekta, ljudi su fokusirali svoje radove na obradi jednog metoda i testiranju na određenoj bazi. Nasuprot njihovim, ovaj rad ima dosta limitiranu bazu, te i sami rezultati variraju u odnosu na već dobijene.
### Aparatura i metoda

Rešenje datog problema prepoznavanja govora svodi se na izradu spektrograma i obradu istih.

#### Spektrogrami

Spektrogrami su vizuelne reprezentacije jačine signala, to jest glasnoće zvuka u nekom vremenskom intervalu. Mogu se posmatrati kao dvodimenzionalni grafici gde se može uočiti i treća dimenzija preko boja svakog dela spektrograma. Vremenska osa se gleda sa leve na desnu stranu po horizontalnoj osi. Vertikalna osa predstavlja frekvenciju koju možemo posmatrati i kao ton zvuka. U logaritamskoj je skali kako bi se prilagodila ljudskom uhu koje čuje po istom principu.

Boja na grafiku predstavlja amplitudu zvuka u određenom vremenskom trenutku. Plava boja na spektrogramu predstavlja niske amplitude, dok crvena boja predstavlja visoke amplitude.

Primena spektrograma u ovom radu jeste prepoznavanje fonema reči kako bi, spajanjem istih, reč mogla da se prepozna.

U Python programskom jeziku, zvuk se može transformisati u spektrogram korišćenjem biblioteke Librosa. Ova biblioteka se koristi pri rešavanju problema sa analizom fajlova audio formata. 

#### Metode obrade spektrograma

##### 1. Logistička regresija

Logistička regresija je metoda klasifikacije koja se može primeniti i koristiti svuda gde imamo promenljive koje se mogu kategorisati. Za razliku on linearne regresije, vrednosti njenih rezultata su ograničene između 0 i 1. 

Ova metoda za klasifikaciju ne koristi linearnu već sigmoidnu funkciju bilo kog tipa, a primer takve funckije je dat na slici 1.

![Sigmoid](static\images\1.png)

Binarna logistička regresija kao izlaz daje vrednosti 0 ili 1, zavisno od toga da li posmatrana promenljiva pripada nekoj klasi ili ne. To često nije dovoljno, pa se koristi multinomijalna logistička regresija (ili Softmax Regression) koja može da razlikuje više od dve različite kategorija.

Funkcija cene ove metode je logaritamska kako bi se dobila konveksna završna funkcija parametara i time se postiglo da gradient descent nađe globalni, a ne samo lokalni minimum funkcije.

![Funkcija](static\images\2.png)

- hΘ(x) = sigmoid (w*x + b), Y rezultat, x = promenljiva koju posmatramo

Da bi logistička regresija dala što bolje rezultate, trenira se MLE (Maximum Likelihood Estimation) metodom, nameštajući beta parametre kroz više iteracija tražeći najbolje fitovanu krivu, odakle se biraju najbolje procene parametara. Nakon toga se dobijeni koeficijenti koriste za računanje verovatnoće za svaki primer, pa se one logaritmuju i sabiraju i time formiraju konačnu predviđenu verovatnoću. Svaka vrednost iznad 0.5 (ili bilo koje zadate granice) se tretira kao da je jedinica, a svaka manja od te granice se tretira kao nula.


##### 2. MFCCs

MFCCs (Mel-Frequency Cepstral Coefficients) jesu koeficijenti koji opisuju karakteristike na osnovu spektrograma određenog zvuka. Njihova primena u ovom projketu svodi se na izdvajanje ključnih odlika nekog zvuka kako bi reč mogla da se prepozna. Te odlike se zovu formonti i njih stvara ljudski vokalni trakt prilikom govora, menjajući čist glas koji stvaraju naše glasne žice dok vibriraju. Ove odlike se formiraju u reč.

Kepstar (cepstrum) je spektar spektra. On nastaje inverznom Furijeovom transformacijom logaritmovanog spektra. Formula za nastanak kepstra:

$C(x(t))=F^{-1}[\log (F[x(t)])]$

Proces stvaranja kepstra je sledeći:

1. Na dobijeni signal primenimo diskretnu Furijeovu transformaciju. Ova transformacija nam daje grafik zavisnosti jačine zvuka od frekvencije po sledećoj formuli:

$\begin{aligned} X_k &=\sum_{n=0}^{N-1} x_n \cdot e^{-\frac{i 2 \pi}{N} k n} \\ &=\sum_{n=0}^{N-1} x_n \cdot\left[\cos \left(\frac{2 \pi}{N} k n\right)-i \cdot \sin \left(\frac{2 \pi}{N} k n\right)\right] \end{aligned}$

2. Power spektar logaritmujemo, pa odatle dobijamo spektar koji na vertikalnoj osi pokazuje jačinu zvuka u decibelima (dB), a horizontalna osa i dalje prikazuje frekvenciju.

![Power spectar](static\images\log.png)

3. Po logaritmovanju power spektra, izvršenjem inverzne Furijeove transformacije dobijamo kepstar.

Prednost kepstra i Mel-Frequency kepstra jeste u sličnosti y-ose sa ljudskim glasom. Ljudski glas se odlikuje u jačini zvuka koja je logaritamska veličina, kao i kod kepstara.

Mel filter banke ...

U Pythonu, implementacija MFCC-a svodi se na lični odabir koliko odlika zvuka je potrebno izvući za precizna predviđanja. Librosa biblioteka dalje obogućava obradu zvuka kroz kepstre i izvlačenje traženih odlika.


##### 3. Random Forest

Random Forest je klasifikator koji koristi više stabala odlučivanja (Desicion Tree) i njihova pojedinačna predviđanja stapa u jedno konačno.

Stabla odlučivanja rade tako što podatke koje dobiju razvrstavaju u grupe nizom grananja. U svakom grananju se posmatra neki parametar koji bi najbolje mogao da razvrsta pristigle podatke u dve podgrane koje se dalje mogu i same deliti. U idealnoj situaciji potrebno je da svi podaci u svojoj finalnoj podgrani budu isti, ali je to sa ograničenom dubinom mreže uglavnom nemoguće.

Svako stablo odlučivanja će dati svoj rezultat, a onaj rezultat koji se najviše puta pojavi biće izabran kao konačno predviđanje celog klasifikatora.

![Random Forest](static\images\3.png)

Pošto su pojedinačna stabla veoma osetljiva na podatke koji im se pruže, koristi se **Bagging** (ili **B**ootstrap **Agg**regat**ing**) princip. On dozvoljava dve bitne stvari:

1.	Svakom stablu da nasumično izabere podatke sa kojima će da radi iz baze i time znatno smanji mogućnost overfitting-a.

2.	Svako stablo dobija neki nasumičan feature na kom će se trenirati, umesto da se trenira na skupu feature-a, što bi zahtevalo i veću dubinu mreže. Ovaj aspekt, zvani Random Subspace Method ili Attribute Bagging, smanjuje korelaciju između stabala i time ih čini nezavisnijim jedne od drugih.

##### 4. XGBoost

XGBoost (Gradient Boosted Trees), kao i Random Forest, koristi više stabala odlučivanja za predviđanje i labeliranje. 

Razlika između ova dva metoda može se primetiti u samom imenu: XGBoost koristi dodatnu metodu za predviđanje koja se zove Boosting. Boosting kombinuje slabija drva kako bi, ispravljajući njihove greške, sačinio nova drva sa što boljim rezultatima. Početna drva nazivaju se panjevi, i oni se sastoje od jednostavnih DA/NE odgovora za predskazanje.

Dodatak 

##### 5. SVM

Posao SVM klasifikatora je da u N-dimenzionalnom prostoru, gde je N broj parametara, pronađe hiperravan koja na najbolji način klasifikuje sve tačke koje predstavljaju podaci.

Kako postoji velik broj ovih hiperravni, kao optimalnu uzimamo onu kod koje je udaljenost granice odlučivanja podjednako udaljena od podataka svih tipova. Ovim dobijamo veću verovatnoću da će bilo koji naknadno dodati podatak biti pravilno klasifikovan. 

Hiperravni koje ograničavaju zonu udaljenosti od granice odlučivanja na kojoj klasifikator daje vrednosti čija je apsolutna vrednost manja od 1 nazivaju se noseći vektori. To znači da za svaki podatak koji se nalazi unutar tih vektora ne možemo sa sigurnošću reći kojoj klasi pripada.

![SVM1](static\images\5.png)

Na slici je hiperravan prikazana kao prava u 2D prostoru, dok bi u 3D prostoru to bila ravan i tako dalje.

Za razliku od logističke regresije gde smo sve vrednosti sveli na raspon [0, 1] koristeći sigmoidnu funckiju, ovde sve vrednosti možemo svesti na raspon [-1, 1]. Funkcija gubitka SVM modela je:

$c(x, y, f(x))= \begin{cases}0, & \text { if } y * f(x) \geq 1 \\ 1-y * f(x), & \text { else }\end{cases}$


Ako su dobijeni i željeni rezultat istog znaka, vrednost funkcije cene je jednaka nuli, dok u suprotnom računamo gubitak. Na to moramo dodati i parametar za regularizaciju koji služi da izjednači uticaj maksimizacije granice i minimizacije gubitka.

$$
\min _w \lambda\|w\|^2+\sum_{i=1}^n\left(1-y_i\left\langle x_i, w\right\rangle\right)_{+}
$$

Nakon toga možemo izvesti gradijente za ažuriranje vrednosti težina modela:

$$
\begin{gathered}
\frac{\delta}{\delta w_k} \lambda\|w\|^2=2 \lambda w_k \\
\frac{\delta}{\delta w_k}\left(1-y_i\left\langle x_i, w\right\rangle\right)_{+}= \begin{cases}0, & \text { if } y_i\left\langle x_i, w\right\rangle \geq 1 \\
-y_i x_{i k}, & \text { else }\end{cases}
\end{gathered}
$$

Težine ažuriramo zavisno od toga da li je naš klasifikator tačno klasifikovao novi podatak ili ne. Ukoliko jeste, ažuriramo samo gradijent regularizacionog parametra:

$$
w=w-\alpha \cdot(2 \lambda w)
$$

U suprotnom, ako je model napravio grešku, moramo da uključimo i funkciju gubitka u račun:

$$
w=w+\alpha \cdot\left(y_i \cdot x_i-2 \lambda w\right)
$$

##### 6. Konvolucione neuronske mreže

Metoda konvolucionih neuronskih mreža pomaže za klasifikaciju podataka pomoću tehnike dubokog učenja. Neuronske mreže rade po principu čovečjeg mozga (odatle i naziv): dobija određene podatke koji se obično nalaze u formatu baze podataka, obrađuje ih i vraća rezultate. Kontrolom rezultata obrade podataka se ta mreža trenira. Ona uči na svojim greškama i poboljšava rezultate obrade.

Konvoluciona neuronska mreža korišćena u ovom projektu sastoji se iz 5 konvolucionih slojeva, koristi se 4 slojeva sažimanja, kao i 3 potpuno povezana sloja. 

Kroz neuronsku mrežu se propušta već napravljen spektrogram, kao i labele tih spektrograma koje mreža treba da prepozna.

Za treniranje mreže koriste se dve metode simultano: loss funkcija i back propagation.

### Istraživanje i rezultati

Rezultati su krajnje očekivani uzimajući u obzir veličinu baze koja je obrađivanja. Bez interaktivnog interfejsa, dosadašnji rezultati svode se na tačnost (accuracy) svake metode u radu. 

![Rezultati](static\images\4.png)

Iz tabele iznad može se uočiti kako rezultati dosta variraju jedni od drugih. Konvoluciona neuronska mreža daje maksimalnu preciznost u istim uslovima, dok SVM sa polinomijalnim kernelom daje minimalne. 

Svoj potencijal SVM može da pokaže kada je lako odrediti kojoj labeli koji podatak pripada. U ovom slučaju, određene reči mogu lako da se pomešaju na spektrogramu, pa su neke vrednosti vrlo blizu odlučnoj granici i da pomute labele. Iz tog razloga, rezultati su veoma dobri za ovu metodu. 

SVM daje različite rezultate u zavisnosti od svojih kernela. Linearni kernel se najbolje pokazao zato što se usaglašava sa zadatkom koji mu je dat (svaka reč ima dosta odlika na osnovu kojih se labelira), a i u ovom kernelu potrebno je samo da optimizujemo C Regularisation parametar, pa je treniranje brže.

Konvoluciona neuronska mreža je metoda koja je najviše razrađena u ovom projektu. Deep learning metode povoljnije su za feature extraction proces, koji je neophodan kako bismo sa spektrograma mogli lepo da izvučemo informacije o zvuku. Cross entropy loss, to jest log loss odlično funkcioniše kao speech recognition loss funkcija pošto ljudsko uho reaguje logaritamski. Gledajući ova dva faktora u obzir, očekivano je da će performansa CNN-a biti najbolja.

Razlika između regresora i klasifikatora objašnjavaju se samom ulogom regresora i klasifikatora pri povezivanju određenih podataka sa njihovim labelama.

Regresori imaju veću primenu kada je potrebno neku tačnu vrednost dati kao labelu nekom podatku, dok klasifikator stavlja podatak u određenu kategoriju i tako daje labelu. U slučaju speech recognitiona, u FSDD bazi dato je 10 labela, pa klasifikator radi bolji posao da pretpostavi u koju kategoriju labela određeni zvuk spada (cifra od 0 do 9).

Rezultati koji su odađeni na srpskoj bazi podataka dosta su slabiji u poređenju sa engleskom bazom. Srpska baza pravljena je u amaterskim uslovima: mikrofon slabijeg kvaliteta, dosta šuma se može čuti u samim snimcima, nisu svi zvuci iste jačine, kao ni dužine. Ovi faktori dosta utiču na kvalitet spektrograma, na kome ima dosta više šuma u poređenju sa spektrogramom engleske baze.

![Rezultati](static\images\4.png)

![Rezultati](static\images\4.png)

Prva slika predstavlja spektrogram zvuka iz engleske baze, druga slika je spektrogram zvuka iz srpske baze.


### Zaključak

Projekat koristi FSDD bazu podataka za poređenje performansi pri prepoznavanju govora između sledećih metoda: SVM, MFCCs, CNN, Random Forest, XGBoost i logistička regresija. Uz ovu i samostalno napravljenu srpsku bazu podataka, ove metode su se pokazale kao veoma uspešne pri detektovanju izgovorenih reči. CNN model je imao najveću uspešnost pri prevođenju reči, a SVM sa RBF kernelom najmanju. Tačnost između metoda varira od 51.45% do 97.28%, pa je zaključak ovog rada da je tačnost CNN modela značajno veća od ostalih testiranih modela.