---
title: Prepoznavanje govora
summary: Projekat iz prepoznavanja govora rađen na letnjem kampu za stare polaznike 2022. godine od Dimitrija Pešića i Lazara Zubovića.
---
### Apstrakt
Prepoznavanje govora predstavlja jedan od najvećih izazova tehnologije. Sve veća potreba za digitalizacijom dovodi do potrebom za širenjem znanja u ovom polju. Dosadašnja istraživanja pokazuju efikasnost i tačnost prepoznavanja govora mnogih metoda sa i bez korišćenja dubokog učenja, ne fokusirajući se toliko na pojašnjenja razlika u rezultatima koji su dobijeni. Ovaj rad se fokusira na posmatranju i upoređivanju metoda poput konvolucionih neuronskih mreža i raznih klasifikatora podataka koji ne koriste tehniku dubokog učenja kako bi se utvrdilo šta je najbolji pristup za identifikovanje reči. Testirajući na FSDD bazi reči i bazi podataka koja se sastoji od srpskih reči, utvrđeno je da najprecizniji način za obradu audio zapisa konvoluciona neuronska mreža, pa je najoptimalnije dalja istraživanja voditi u tom smeru.

### Apstrakt na engleskom
### Uvod
Projekat "Prepoznavanje govora" pomaže pri rešavanju popularne dileme u AI tehnologiji, a to je kako da se glas pretvori u kucani tekst. Prepoznavanje govora je proces osposobljavanja nekog modela da identifikuje i odreaguje na zvuk proizveden ljudskim govorom. Model uzima audio signal u formi talasa, izvlači iz njega podatke, obrađuje ih i identifikuje izgovorenu reč.

Motivacija projekta bila je u tome da se ne samo primene mnoge metode korišćene za prepoznavanje govora, već da se i uporede njihova praktičnost i tačnost. 

Primena projekta može se uočiti u mnogim svakodnevnim radnjama: audio pretraga na internetu, audio pretraga na uređajima za slepe ljude, pozivanje glasom, i slično.

Ovaj projekat se bavi raspoznavanjem konkretnih reči i njihovom klasifikacijom. Formulacija problema koji se rešava u ovom projektu se moze definisati na sledeći način: vrši se klasifikacija reči na jednu od 10 reči iz predodredjenog skupa. Ceo projekat rađen je u Python programskom jeziku.

Projekat se zasniva na ideji korišćenja spektrograma kao osnovne metode prikaza zvuka u 2D formatu. Spektrogrami su korišćeni na dva načina tokom realizacije projekta. Jedan način podrazumeva korišćenje spektrograma u formi slike gde korišćeni klasifikatori obrađuju zvuk i pronalaze određene karakteristike. Drugi način podrazumeva ručno izvlačenje karakteristika iz spektrograma, koji je predstavljen matricom brojeva.

Osvrt na rad ogleda se u setu metoda koje su pokrivene u referentnim radovima. Uloga ovih metoda može se podeliti u nekoliko kategorija: 

1. Izvlačenje karakteristika iz zvuka pomoću kepstralnih koeficijenata Mel skale (MFCC);

2. Klasifikatori, kojima su prosleđene MFCC karakteristike: Logistička regresija, Random Forest, SVM, XGBoost;

3. Konvolucione neuronske mreže (CNN) koje inkomponuju proces ekstrakcije karakteristika iz signala, kao i proces klasifikacije.

### Metode

Rešenje datog problema prepoznavanja govora svodi se na izradu spektrograma i obradu istih.

#### Spektrogrami

Spektrogrami su vizuelne reprezentacije jačine signala. Mogu se posmatrati kao dvodimenzionalni grafici gde se može uočiti i treća dimenzija preko boja svakog dela spektrograma. Vremenska osa se gleda sa leve na desnu stranu po horizontalnoj osi. Vertikalna osa predstavlja frekvencijske komponente prisutne u signalu, dok boja označava jačinu svake od tih komponenti. U logaritamskoj je skali kako bi se prilagodila ljudskom uhu koje čuje po istom principu, što je dalje objašnjeno u samom radu.

Spektrogram služi za prikazivanje amplitude svake frekvencijske komponente signala u nekom vremenskom intervalu. Intervali su mali, te se može pretpostaviti da se amplitude frekvencijskih komponenti ne menjaju u okviru jednog intervala.


#### Metode obrade spektrograma

##### 1. Logistička regresija

Logistička regresija je metoda klasifikacije koja se može primeniti i koristiti svuda gde imamo promenljive koje se mogu kategorisati. Za razliku od linearne regresije, vrednosti njenih rezultata su ograničene između 0 i 1. 

U slučaju binarne klasifikacije, ova metoda umesto linearne koristi sigmoidnu funkciju. U slučaju više klasa, koristi se softmax funkcija. Sigmoidna funkcija prikazana je na slici:

![Sigmoid](static\images\Sigmoid.svg)

Binarna logistička regresija kao izlaz daje vrednosti 0 ili 1, zavisno od toga da li posmatrana promenljiva pripada nekoj klasi ili ne. U slučaju kada imamo više od dve klase, koristi se multinomijalna logistička regresija (Softmax Regression).

Kriterijumska funkcija ove metode je logaritamska kako bi se postiglo da gradient descent nađe globalni, a ne samo lokalni minimum funkcije.

$$\begin{equation}
\sigma(z_{i})=e^{z_i}*(\sum_{j=1}^{K}e^{z_j})^{-1} 
\end{equation}$$

Postoji slučaj kada nam se izbor svodi na dve kategorije. Da bi logistička regresija dala što bolje rezultate, trenira se MLE (Maximum Likelihood Estimation) metodom. Pomoću ove metode dobijamo verovatnoće za svaki primer, pa se one logaritmuju i sabiraju i time formiraju konačnu predviđenu verovatnoću. Svaka vrednost iznad 0.5 (ili bilo koje zadate granice) se tretira kao da je jedinica, a svaka manja od te granice se tretira kao nula.

U slučaju kada imamo više kategorija (u našem slučaju 10), koristi se Softmax regresija umesto Sigmoida kako bismo dobili deset verovatnoća čija je suma 1. Konačnu odluku o pravom izboru donosimo po tome koja kategorija ima najveću verovatnoću za zadate ulazne podatke.


##### 2. MFCCs

MFCCs (Mel-Frequency Cepstral Coefficients) jesu koeficijenti koji opisuju karakteristike zvuka na osnovu njegovog spektrograma. Njihova primena u ovom projketu svodi se na izdvajanje ključnih odlika nekog zvuka kako bi reč mogla da se prepozna. Te odlike se zovu formonti i njih stvara ljudski vokalni trakt prilikom govora, menjajući čist glas koji stvaraju naše glasne žice dok vibriraju. Ove odlike se formiraju u reč.

Kepstar (cepstrum) se može intuitivno predstaviti kao spektar spektra. On nastaje inverznom Furijeovom transformacijom logaritmovanog spektra. Formula za nastanak kepstra:

$$ C(x(t))=F^{-1}[\log (F[x(t)])] $$

Proces stvaranja kepstra je sledeći:

1. Na dobijeni signal primenimo diskretnu Furijeovu transformaciju kako bismo dobili spektar signala. Iz njega potom izvlačimo amplitudski spektar, koji nosi informaciju o vrednostima amplituda na svim frekvencijama u signalu. 

$$ \begin{aligned} X_k &=\sum_{n=0}^{N-1} x_n \cdot e^{-\frac{i 2 \pi}{N} k n} \\ &=\sum_{n=0}^{N-1} x_n \cdot\left[\cos \left(\frac{2 \pi}{N} k n\right)-i \cdot \sin \left(\frac{2 \pi}{N} k n\right)\right] \end{aligned} $$

Kvadriranjem amplitudskog spektra dobijamo spektar snage.

2. Spektar snage logaritmujemo, pa odatle dobijamo logaritamski spektar snage. On služi da pokaže relativnu važnost svake komponente (amplitude sinusoida) ovog zvuka. Na vertikalnoj osi pokazuje jačinu zvuka u decibelima (dB), a horizontalna osa i dalje prikazuje frekvenciju.

![Spektar snage](static\images\LogPowerSpectrum.svg)

3. Po logaritmovanju spektra snage, izvršenjem inverzne Furijeove transformacije dobijamo kepstar.

##### 3. Random Forest

Random Forest je klasifikator koji koristi više stabala odlučivanja (Decision Tree) i njihova pojedinačna predviđanja stapa u jedno konačno.

Stabla odlučivanja rade tako što podatke koje dobiju razvrstavaju u grupe nizom grananja. U svakom grananju se posmatra neki parametar koji bi najbolje mogao da razvrsta pristigle podatke u dve podgrane koje se dalje mogu i same deliti. U idealnoj situaciji potrebno je da svi podaci u svojoj finalnoj podgrani budu isti, ali je to sa ograničenom dubinom mreže uglavnom nemoguće.

Svako stablo odlučivanja će dati svoj rezultat, a onaj rezultat koji se najviše puta pojavi biće izabran kao konačno predviđanje celog klasifikatora.

![Random Forest](static\images\RandomForest1.svg)

Pošto su pojedinačna stabla veoma osetljiva na podatke koji im se pruže, koristi se **Bagging** (ili **B**ootstrap **Agg**regat**ing**) princip. On dozvoljava dve bitne stvari:

1.	Svakom stablu da nasumično izabere podatke sa kojima će da radi iz baze i time znatno smanji mogućnost overfitting-a.

2.	Svako stablo dobija neki nasumičan feature na kom će se trenirati, umesto da se trenira na skupu feature-a, što bi zahtevalo i veću dubinu mreže. Ovaj aspekt, zvani Random Subspace Method ili Attribute Bagging, smanjuje korelaciju između stabala i time ih čini nezavisnijim jedne od drugih.

##### 4. XGBoost

XGBoost (Gradient Boosted Trees), kao i Random Forest, koristi više stabala odlučivanja za predviđanje i labeliranje. 

Razlika između ova dva metoda može se primetiti u samom imenu: XGBoost koristi dodatnu metodu za predviđanje koja se zove Boosting. Boosting kombinuje slabija drva kako bi, ispravljajući njihove greške, sačinio nova drva sa što boljim rezultatima. Početna drva nazivaju se panjevi, i oni se sastoje od jednostavnih DA/NE odgovora za predskazanje.

Dodatak Boosting-u ogleda se u loss funkciji. Cost funkcija (kriterijumska funkcija) jeste usrednjena vrednost svih funkcija greške (loss function), a loss funkcija je funkcionalna veza željenog outputa i dobijenog outputa u funkciji.

Najkorišćenija loss funkcija je Cross Entropy Loss. 
Cross Entropy Loss radi tako što pokušava da minimizuje razliku između tačnih rezultata i verovatnoće predviđanja, to jest output.

Formula po kojoj se računa Cross Entropy Loss je sledeća:

$L_{C E}(\hat{y}, y)=-[y \log \sigma(\mathbf{w} \cdot \mathbf{x}+b)+(1-y) \log (1-\sigma(\mathbf{w} \cdot \mathbf{x}+b))]$

XGBoost se u Pythonu implementira bibliotekom xgboost. 

##### 5. SVM

Posao SVM klasifikatora je da u N-dimenzionalnom prostoru, gde je N broj parametara, pronađe hiperravan koja na najbolji način klasifikuje sve tačke koje predstavljaju podaci.

Kako postoji velik broj ovih hiperravni, kao optimalnu uzimamo onu kod koje je udaljenost granice odlučivanja podjednako udaljena od podataka svih tipova. Ovim dobijamo veću verovatnoću da će bilo koji naknadno dodati podatak biti pravilno klasifikovan. 

Hiperravni koje ograničavaju zonu udaljenosti od granice odlučivanja na kojoj klasifikator daje vrednosti čija je apsolutna vrednost manja od 1 nazivaju se noseći vektori. To znači da za svaki podatak koji se nalazi unutar tih vektora ne možemo sa sigurnošću reći kojoj klasi pripada.

![SVM1](static/images/SVM.svg)

Na slici je hiperravan prikazana kao prava u 2D prostoru, dok bi u 3D prostoru to bila ravan i tako dalje.

Funkcija gubitka SVM modela je:

$$ c(x, y, f(x))= \begin{cases}0, & \text { if } y * f(x) \geq 1 \\ 1-y * f(x), & \text { else }\end{cases} $$


Na to moramo dodati i parametar za regularizaciju koji služi da izjednači uticaj maksimizacije granice i minimizacije gubitka.

$$
\min _w \lambda\|w\|^2+\sum_{i=1}^n\left(1-y_i\left\langle x_i, w\right\rangle\right)_{+}
$$

Nakon toga možemo izvesti gradijente za ažuriranje vrednosti težina modela:

$$ \frac{\delta}{\delta w_k} \lambda\|w\|^2=2 \lambda w_k \\ $$

$$ \frac{\delta}{\delta w_k}\left(1-y_i\left\langle x_i, w\right\rangle\right)_{+}= \begin{cases}0, & \text { if } y_i\left\langle x_i, w\right\rangle \geq 1 \\ -y_i x_{i k}, & \text { else }\end{cases} $$

Težine ažuriramo zavisno od toga da li je naš klasifikator tačno klasifikovao novi podatak ili ne. Ukoliko jeste, ažuriramo samo gradijent regularizacionog parametra:

$$
w=w-\alpha \cdot(2 \lambda w)
$$

U suprotnom, ako je model napravio grešku, moramo da uključimo i funkciju gubitka u račun:

$$
w=w+\alpha \cdot\left(y_i \cdot x_i-2 \lambda w\right)
$$

##### 6. Konvolucione neuronske mreže

Metoda konvolucionih neuronskih mreža pomaže za klasifikaciju podataka pomoću tehnike dubokog učenja. Neuronske mreže su inspirisane neuronima i sinapsama u ljudskom mozgu. U konvolucionu neuralnu mrežu pohranjujemo ulazne podatke u vidu spektrograma, nakon čega se oni provlače kroz nekoliko slojeva konvolucije, sažimanja i potpuno povezanih slojeva. Izlaz iz ove mreže se koristi za proračunavanje vrednosti kriterijumske funkcije, na osnovu čega se ažuriraju parametri mreže. Ovaj postupak se potom iterativno ponavlja u cilju minimizacije greške modela.

Konvoluciona neuronska mreža korišćena u ovom projektu sastoji se iz 5 konvolucionih slojeva, koristi se 4 slojeva sažimanja, kao i 3 potpuno povezana sloja. 

Ceo proces može se svesti na sledeće korake: 
1. Spektrogram se prvo obrađuje konvolucijom i ReLU-om
2. Smanjujemo veličinu obrađene slike pooling slojem
3. Ponavljamo ovaj proces 4 puta

Napomena: poslednji sloj konvolucije nije praćen slojem sažimanja.

Konvolucija kao bitne detalje posmatra one koji su mnogo puta uhvaćeni u kernelu. Problem može da se desi kada kernel ne zahvata ivice dosta puta, te može mnogo da smanji određenu sliku, a samim tim i da se reši ivičnih detalja. Ako do te pojave dođe, koristi se tehnika koja se zove sužavanje. 

Sažimanje označava dodavanje piksela na ivice. Samim tim, kada konvolucija radi svoj posao, ona će svojim kernelom mnogo puta pokriti tu površinu. 

ReLU (rectified linear activation function / rectified linear unit) je funkcija koja negativnim vrednostima daje nulu, a pozitivne ostavlja kakve jesu. Time dobijamo nelinearan model.

![Funkcija](static\images\ReLU.svg)

Kroz neuronsku mrežu se propušta već napravljen spektrogram, kao i labele tih spektrograma koje mreža treba da raspozna.

Za treniranje mreže koriste se dve metode simultano (propagacija unapred i unazad), kao i jedna funkcija (kriterijumska funkcija)

Kritetijumska funkcija (eng. cost funkcija) jeste funkcionalna veza željenog outputa i dobijenog outputa u funkciji. Takođe, kriterijumska funkcija je usrednjena vrednost svih funkcija greške.

Najkorišćenija loss funkcija je Cross Entropy Loss. Potrebno nam je da minimizujemo grešku unakrsne entropije za što preciznije rezultate.

Formula po kojoj se računa Cross Entropy Loss je sledeća:

$$L_{C E}(\hat{y}, y)=-[y \log \sigma(\mathbf{w} \cdot \mathbf{x}+b)+(1-y) \log (1-\sigma(\mathbf{w} \cdot \mathbf{x}+b))]$$

Propagacija unazad je metod smanjenja grešaka u CNN posmatranjem neophodnih promena vrednosti parametara mreže u svakom sloju kako bi se neuroni aktivirali na određen način.

Propagacija unazad prolazi kroz sve slojeve i menja parametre mreže u svakom koraku.

Parametri mreže se menjaju u cilju računanja dovoljno dobrog gradient spusta za traženje lokalnog / maksimalnog minimuma ove funkcije. Dakle, teži se tome da gradijent kriterijumske funkcije bude što bliži nuli.

![SGD](static/images/Backpropagation.svg)

### Istraživanje i rezultati

Testiranje metoda vršeno je na dve baze: FSDD baze i baze srpskih reči, koja je kreirana za potrebe projekta.

FSDD baza sadrži engleske cifre od 0 do 9 koje su izgovorene od strane 50 različitih ljudi. Sadrži ukupno 3000 snimaka.

Srpska baza sadrži 10 srpskih reči, gde su specifično birane reči koje su slične po nekim karakteristikama (ponavljanje slova, zamena slova, umanjenice, ...). Baza ukupno sadrži 500 snimaka, gde je 29 ljudi izgovaralo ove reči različitim naglaskom i intonacijom.

U FSDD bazi podataka, 6 osoba je izgovorila svaku reč 50 puta, kako bi ukupno bilo 3000 snimaka, što čini vrlo balansiranu bazu podataka. U srpskoj bazi, 10 reči je rečeno od strane 27 ljudi, dok su dve osobe ponovile izgovaranje ovih 10 reči 13 i 10 puta. Njihovih snimaka je 130 i 100, pa otuda i 500 snimaka u bazi. Korišćeni su drugačiji izgovori i intonacije zbog raznovrsnosti. Baza je slabije balansirana, što se odrazuje na same rezultate testiranja.

U bazi srpskih reči, u uređenoj trojci gluva - glava - plava očekuju se češće greške pri klasifikaciji. To se može očekivati jer su drugi i poslednja dva glasa isti. Takođe, kako su „P“ i „G“ oba praskavi suglasnici, to jest isti su po mestu tvorbe, veća je verovatnoća pojavljivanja greške.

Za konvolucionu neuronsku mrežu, potrebni su nam bili pokazatelji kako mreža uči tokom epoha treniranja. Baze su podeljene na trening, test i validacionu bazu, tako da je trening set sadržao 70% reči, a test i validacioni set po 15% reči u slučaju obe baze.

Rezultati su prikazani u tabeli ispod.

![Rezultati](static\images\Tabela.svg)

Metrika ovih rezultata bila je tačnost. Zbog balansirane baze, ovo predstavlja zaista reprezentativnu metriku.

Odvojeno možemo posmatrati rezultate metoda sa dubokim učenjem i one bez dubokog učenja. Iz tabele se može uočiti da je konvoluciona neuronska mreža ostvarila najveću tačnost kao metoda sa dubokim učenjem, a XGBoost daje najbolje rezultate među metodama koje ne koriste duboko učenje.

Konvoluciona neuronska mreža je metoda koja je najviše razrađena u ovom projektu. Metode sa dubokim učenjem same vrše feature extraction proces, koji je neophodan kako bismo sa spektrograma mogli lepo da izvučemo informacije o zvuku. Cross entropy loss, to jest log loss odlično funkcioniše kao loss funkcija za prepoznavanje govora pošto ljudsko uho reaguje logaritamski. To znači da je naše uho daleko osetljivije na niske frekvencije, primećujući razliku od svega nekoliko herca pri frekvencijama od ~200Hz, dok je ta razlika potpuno neprimetna na frekvencijama od nekoliko kHz. Osetljivost je pri dnu približno linearna, dok sa porastom frekvencije postaje logaritamska.

Rezultati koji su odađeni na srpskoj bazi podataka dosta su slabiji u poređenju sa engleskom bazom. Srpska baza pravljena je u amaterskim uslovima: mikrofon slabijeg kvaliteta, dosta šuma se može čuti u samim snimcima, nisu svi zvuci iste jačine, kao ni dužine. Ovi faktori dosta utiču na kvalitet spektrograma, na kome ima dosta više šuma u poređenju sa spektrogramom engleske baze.

Rezultate vizuelno možemo prikazati matricama konfuzije. 

![Rezultati](static/images/XGB.svg)

![Rezultati](static/images/SVM1.svg)

![Rezultati](static/images/RandomForest.svg)

![Rezultati](static/images/LogistickaRegresija.svg)

Prikazane su matrice konfuzije na FSDD bazi za XGBoost, SVM, Random Forest i logističku regresiju, tim redosledom.

Iz ovih matrica konfutije može se primetiti kako, ma koja se metoda koristi, brojevi dva, tri i četiri uvek imaju najveću tačnost pronalaženja. 

Brojevi 9 i 1 su često mešani pri klasifikaciji ova četiri modela. Njihov izgovor može se protumačiti kao sličan ("one" i "nine") pa su ova dva broja par sa najvećim sličnostima u karakteristikama.

U svim metodama, broj 6 se pokazao kao najteže klasifikovan i u svim metodama mešan je sa brojevima 3 i 8, što ima manje fizičkog smisla od brojeva 1 i 9 ("six","three","eight").

XGBoost i Random Forest su se pokazale kao najbolje metoda koje ne koriste tehniku dubokog učenja. Bolje rezultate dobijamo zato što su Decision tree algoritmi jednostavni za implementaciju i zaista precizni. Mogu se dobiti odlični rezultati u minimizaciji greški u prepoznavanju korišćenjem tehnike stabla odlučivanja pri obradi karakteristika zvuka. Gledajući u tabelu, XGBoost je imao veću preciznost od Random Forest klasifikatora. Ovo se može objasniti "obrezivanjem drveća" koje XGBoost radi, to jest Boosting kojim poboljšava klasifikaciju. XGBoost pokušava da smanji kriterijumsku funkciju modela koji obrađuje podatke, dok se Random Forest ne fokusira na te parametre i ne optimizuje model tako da to odgovara loše balansiranoj bazi podataka. 

Konvoluciona neuronska mreža, kao metoda koja koristi duboko učenje, prevazišla je rezultate običnih metoda. To se može objasniti time što je CNN kompleksniji model, pa može da modeluje kompleksniju relaciju između paramatara koji su mu dati. Metode sa dubokim učenjem imaju bolju primenu u ovoj oblasti tehnologije zbog sličnosti ovih algoritama ljudskom mozgu. Jednostavnost struktura algoritama je glavna mana u primeni mašinskog učenja za klasifikovanje zvuka, kao i to što je neophodna veća intervencija čoveka pri podešavanjima algoritama i metoda. 

### Zaključak

Projekat "Prepoznavanje govora" pokazuje načine rešavanja popularne dileme pretvaranja glasa u kucani tekst. Koristi se FSDD baza podataka za poređenje performansi pri prepoznavanju govora između sledećih metoda: SVM, MFCCs, CNN, Random Forest, XGBoost i logistička regresija. Uz FSDD, koristi se i samostalno napravljena baza podataka koja se sastoji od srpskih reči, gde je dokazano, testiranjem metoda, da su se ove metode pokazale kao veoma uspešne pri detektovanju izgovorenih reči. CNN model je imao najveću uspešnost pri prevođenju reči. Tačnost između metoda varira od 51.45% do 97.28%, pa je zaključak ovog rada da je u ovoj oblasti AI tehnologije, zbog lakoće snalaženja sa ogromnom količinom podataka i smanjivanjem broja parametara bez gubljenja bitnih informacija, CNN najpraktičnija metoda za rad, što znači da se dalja istraživanja mogu usmeravati u primeni ove metode.