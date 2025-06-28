---
title: Prepoznavanje govora
summary: Projekat iz prepoznavanja govora rađen na letnjem kampu za stare polaznike 2022. godine od Dimitrija Pešića i Lazara Zubovića.
image: /images/2022/prepoznavanje-govora/graphical-abstract.svg
imageAlt: Grafički apstrakt projekta. Prikazuje kako zvuk sa mikrofona prelazi u signal u vremenskom domenu, zatim u spektrogram, onda ulazi u neuralnu mrežu i na izlazu neuralne mreže su brojevi.
---

## Apstrakt
Prepoznavanje govora predstavlja jedan od najvećih izazova tehnologije. Sve veća potreba za digitalizacijom dovodi do potrebom za širenjem znanja u ovom polju. Dosadašnja istraživanja pokazuju efikasnost i tačnost prepoznavanja govora mnogih metoda sa i bez korišćenja dubokog učenja. Ovaj rad se fokusira na posmatranje i upoređivanje metoda poput konvolucionih neuronskih mreža, kao i nekoliko klasifikatora podataka koji ne koriste tehniku dubokog učenja, kako bi se utvrdilo šta je najbolji pristup za identifikovanje reči. Testirajući modele na FSDD bazi reči i bazi podataka koja se sastoji od srpskih reči, utvrđeno je da najtačnije rezultate pri obradi audio zapisa donosi konvoluciona neuronska mreža. Iz ovoga zaključujemo da je optimalno dalja istraživanja usmeriti ka dubokom učenju.

## Apstrakt na engleskom

Speech recognition is one of the biggest challenges of technology. The growing need for digitalization is followed by the need to expand knowledge in this field. Research so far shows the effectiveness and accuracy of speech recognition methods with or without deep learning. This paper focuses on observing and comparing various methods such as convolutional nerual networks and data classifiers that don’t use deep learning in order to determine the best approach for identifying words. Testing on the FSDD word database and a database consisting of Serbian words, it was determined that the most accurate way to process audio recordings is by using convolutional neural networks, so it is most optimal to conduct further research in that direction.

## Uvod
Projekat "Prepoznavanje govora" pomaže pri rešavanju popularne dileme u AI tehnologiji, a to je kako da se glas pretvori u kucani tekst. Prepoznavanje govora je proces osposobljavanja nekog modela da identifikuje i odreaguje na zvuk proizveden ljudskim govorom. Model uzima audio signal u formi talasa, izvlači iz njega podatke, obrađuje ih i identifikuje izgovorenu reč.

Motivacija projekta bila je u tome da se ne samo primene mnoge metode korišćene za prepoznavanje govora, već da se i uporede njihova praktičnost i tačnost. Primena projekta može se uočiti u mnogim svakodnevnim radnjama: audio pretraga na internetu, audio pretraga na uređajima za slepe ljude, pozivanje glasom, i slično.

Ovaj projekat se bavi raspoznavanjem konkretnih reči i njihovom klasifikacijom. Formulacija problema koji se rešava u ovom projektu se moze definisati na sledeći način: vrši se klasifikacija reči na jednu od 10 reči iz predodredjenog skupa. Ceo projekat rađen je u Python programskom jeziku.

Projekat se zasniva na ideji korišćenja spektrograma kao osnovne metode prikaza zvuka u 2D formatu. Spektrogrami su korišćeni na dva načina tokom realizacije projekta. Jedan način podrazumeva korišćenje spektrograma u formi slike gde korišćeni klasifikatori pronalaze određene karakteristike i donose zaključke o zvuku na osnovu slika. Drugi način podrazumeva ručno izvlačenje karakteristika iz spektrograma, koji je predstavljen matricom brojeva.

Osvrt na rad ogleda se u setu metoda koje su pokrivene u referentnim radovima. Uloga ovih metoda može se podeliti u nekoliko kategorija: 

1. Izvlačenje karakteristika iz zvuka pomoću kepstralnih koeficijenata Mel skale (MFCC);
2. Klasifikatori, kojima su prosleđene MFCC karakteristike: Logistička regresija, Random Forest, SVM, XGBoost;
3. Konvolucione neuronske mreže (CNN) koje inkomponuju proces ekstrakcije karakteristika iz signala, kao i proces klasifikacije.

## Metode

Rešenje datog problema prepoznavanja govora svodi se na izradu spektrograma i obradu istih.

### Spektrogrami

Spektrogrami su vizuelne reprezentacije jačine signala. Mogu se posmatrati kao dvodimenzionalni grafici gde se može uočiti i treća dimenzija preko boja svakog dela spektrograma. Vremenska osa se gleda sa leve na desnu stranu po horizontalnoj osi. Vertikalna osa predstavlja frekvencijske komponente prisutne u signalu, dok boja označava jačinu svake od tih komponenti. U logaritamskoj je skali kako bi se prilagodila ljudskom uhu koje čuje po istom principu, što je dalje objašnjeno u samom radu.

Spektrogram služi za prikazivanje amplitude svake frekvencijske komponente signala u nekom vremenskom intervalu. Intervali su mali, te se može pretpostaviti da se amplitude frekvencijskih komponenti ne menjaju u okviru jednog intervala.

### Metode obrade spektrograma

#### Logistička regresija

Logistička regresija je metoda klasifikacije koja se može primeniti i koristiti svuda gde imamo promenljive koje se mogu kategorisati. Za razliku od linearne regresije, vrednosti njenih rezultata su ograničene između 0 i 1. 

U slučaju binarne klasifikacije, ova metoda umesto linearne koristi sigmoidnu funkciju. U slučaju više klasa, koristi se softmax funkcija. Sigmoidna funkcija prikazana je na slici {{< ref "Slika" "sigmoid" >}}.

{{< figure "Slika" "Grafik sigmoidne funkcije." "sigmoid" >}}

![Grafik sigmoidne funkcije.](/images/2022/prepoznavanje-govora/sigmoid.svg)

{{</ figure >}}

Binarna logistička regresija kao izlaz daje vrednosti 0 ili 1, zavisno od toga da li posmatrana promenljiva pripada nekoj klasi ili ne. U slučaju kada imamo više od dve klase, koristi se multinomijalna logistička regresija (Softmax Regression).

$$\sigma(z_{i})=e^{z_i}*(\sum_{j=1}^{K}e^{z_j})^{-1}$$

U formuli vidimo da uzimamo eksponent ulaznog parametra i delimo ga sa sumom eksponenata parametara svih postojećih vrednosti sa ulaza. Odnos te dve vrednosti je izlaz *Softmax* funckije.

Postoji slučaj kada nam se izbor svodi na dve kategorije. Da bi logistička regresija dala što bolje rezultate, trenira se MLE (*Maximum Likelihood Estimation*) metodom. Pomoću ove metode dobijamo verovatnoće za svaki primer, pa se one logaritmuju i sabiraju i time formiraju konačnu predviđenu verovatnoću. Svaka vrednost iznad 0.5 (ili bilo koje zadate granice) se tretira kao da je jedinica, a svaka manja od te granice se tretira kao nula.

U slučaju kada imamo više kategorija (u našem slučaju 10), koristi se Softmax regresija umesto Sigmoida kako bismo dobili deset verovatnoća čija je suma 1. Konačnu odluku o pravom izboru donosimo po tome koja kategorija ima najveću verovatnoću za zadate ulazne podatke.

#### MFCCs

MFCCs (*Mel-Frequency Cepstral Coefficients*) jesu koeficijenti koji opisuju karakteristike zvuka na osnovu njegovog spektrograma. Njihova primena u ovom projektu svodi se na izdvajanje ključnih odlika nekog zvuka kako bi reč mogla da se prepozna. Te odlike se zovu formonti i njih stvara ljudski vokalni trakt prilikom govora, menjajući čist glas koji stvaraju naše glasne žice dok vibriraju. Ove odlike se formiraju u reč.

Kepstar (*cepstrum*) se može intuitivno predstaviti kao spektar spektra. On nastaje inverznom Furijeovom transformacijom logaritmovanog spektra. Formula za nastanak kepstra:

$$ C(x(t))=F^{-1}[\log (F[x(t)])] $$

Proces stvaranja kepstra je sledeći:

1. Na dobijeni signal primenimo diskretnu Furijeovu transformaciju kako bismo dobili spektar signala. Iz njega potom izvlačimo amplitudski spektar, koji nosi informaciju o vrednostima amplituda na svim frekvencijama u signalu. $$ \begin{aligned} X_k &=\sum_{n=0}^{N-1} x_n \cdot e^{-\frac{i 2 \pi}{N} k n} \\ &=\sum_{n=0}^{N-1} x_n \cdot\left[\cos \left(\frac{2 \pi}{N} k n\right)-i \cdot \sin \left(\frac{2 \pi}{N} k n\right)\right] \end{aligned} $$ Kvadriranjem amplitudskog spektra dobijamo spektar snage.
2. Spektar snage logaritmujemo, pa odatle dobijamo logaritamski spektar snage (slika {{< ref "Slika" "log-power-spectrum" >}}). On služi da pokaže relativnu važnost svake komponente (amplitude sinusoida) ovog zvuka. Na vertikalnoj osi pokazuje jačinu zvuka u decibelima (dB), a horizontalna osa i dalje prikazuje frekvenciju.
3. Po logaritmovanju spektra snage, izvršenjem inverzne Furijeove transformacije dobijamo kepstar.

{{< figure "Slika" "Logaritamski spektar snage napravljen u procesu stvaranja kepstra." "log-power-spectrum" >}}

![Logaritamski spektar snage, sa frekvencijom u hercima na x osi i logaritmovanom snagom u decibelima na y osi.](/images/2022/prepoznavanje-govora/log-power-spectrum.svg)

{{</ figure >}}

#### Random Forest

*Random Forest* je klasifikator koji koristi više stabala odlučivanja (*Decision Tree*) i njihova pojedinačna predviđanja stapa u jedno konačno.

Stabla odlučivanja rade tako što podatke koje dobiju razvrstavaju u grupe nizom grananja. U svakom grananju se posmatra neki parametar koji bi najbolje mogao da razvrsta pristigle podatke u dve podgrane koje se dalje mogu i same deliti. U idealnoj situaciji potrebno je da svi podaci u svojoj finalnoj podgrani budu isti, ali je to sa ograničenom dubinom mreže uglavnom nemoguće.

Svako stablo odlučivanja će dati svoj rezultat, a onaj rezultat koji se najviše puta pojavi biće izabran kao konačno predviđanje celog klasifikatora.

{{< figure "Slika" "Grafički prikaz rada Random Forest-a." >}}

![Grafički prikaz rada Random Forest-a. Prikazano je devet stabala numerisanih od p1 do p9 i formulom p = \argmax_k \sum_{p_i} I (p_i = k), k = 1, ..., K.](/images/2022/prepoznavanje-govora/random-forest.svg)

{{</ figure >}}

Pošto su pojedinačna stabla veoma osetljiva na podatke koji im se pruže, koristi se **Bagging** (ili **B**ootstrap **Agg**regat**ing**) princip. On dozvoljava dve bitne stvari:

1.	Svakom stablu da nasumično izabere podatke sa kojima će da radi iz baze i time znatno smanji mogućnost *overfitting*-a.
2.	Svako stablo dobija neki nasumičan karakteristika na kom će se trenirati, umesto da se trenira na skupu karakteristika, što bi zahtevalo i veću dubinu mreže. Ovaj aspekt, zvani *Random Subspace Method* ili *Attribute Bagging*, smanjuje korelaciju između stabala i time ih čini nezavisnijim jedne od drugih.

#### XGBoost

XGBoost (*Gradient Boosted Trees*), kao i *Random Forest*, koristi više stabala odlučivanja za predviđanje i labeliranje. 

Razlika između ova dva metoda može se primetiti u samom imenu: XGBoost koristi dodatnu metodu za predviđanje koja se zove *Boosting*. *Boosting* kombinuje slabija drva kako bi, ispravljajući njihove greške, sačinio nova drva sa što boljim rezultatima. Početna drva nazivaju se panjevi, i oni se sastoje od jednostavnih DA/NE odgovora za predskazanje.

Dodatak *Boosting*-u ogleda se u *loss* funkciji. *Cost* funkcija (kriterijumska funkcija) jeste usrednjena vrednost svih funkcija greške (*loss function*), a funkcija greške je funkcionalna veza željenog izlaza i dobijenog izlaza u funkciji.

Najkorišćenija *loss* funkcija je *Cross Entropy Loss*. 
*Cross Entropy Loss* radi tako što pokušava da minimizuje razliku između tačnih rezultata i verovatnoće predviđanja, to jest izlaz.

Formula po kojoj se računa *Cross Entropy Loss* je sledeća:

$L_{C E}(\hat{y}, y)=-[y \log \sigma(\mathbf{w} \cdot \mathbf{x}+b)+(1-y) \log (1-\sigma(\mathbf{w} \cdot \mathbf{x}+b))]$

#### SVM

Posao SVM klasifikatora je da u N-dimenzionalnom prostoru, gde je N broj parametara, pronađe hiperravan koja na najbolji način klasifikuje sve tačke koje predstavljaju podaci.

Kako postoji velik broj ovih hiperravni, kao optimalnu uzimamo onu kod koje je udaljenost granice odlučivanja podjednako udaljena od podataka svih tipova. Ovim dobijamo veću verovatnoću da će bilo koji naknadno dodati podatak biti pravilno klasifikovan. 

Hiperravni koje ograničavaju zonu udaljenosti od granice odlučivanja na kojoj klasifikator daje vrednosti čija je apsolutna vrednost manja od 1 nazivaju se noseći vektori. To znači da za svaki podatak koji se nalazi unutar tih vektora ne možemo sa sigurnošću reći kojoj klasi pripada.

{{< figure "Slika" "Grafički prikaz SVM metode." >}}

![Grafik sa naslovom "SVM sa linearnim kernelom", gde su na x i y osama vrednosti dva parametra i tri klasifikaciona regiona na grafiku sa različitim podacima.](/images/2022/prepoznavanje-govora/svm.svg)

{{</ figure >}}

Na slici iznad su vrednosti parametara 1 i 2 određeni parametri po kojima se podaci klasifikuju. Hiperravan je ovde prikazana kao prava u 2D prostoru, dok bi u 3D prostoru to bila ravan i tako dalje.

Funkcija greške SVM modela je:

$$ c(x, y, f(x))= \begin{cases}
    0,           & \text{if } y * f(x) \geq 1 
    \\\\
    1-y * f(x), & \text{else}
\end{cases} $$

Na to moramo dodati i parametar za regularizaciju koji služi da izjednači uticaj maksimizacije granice i minimizacije greške.

$$\min_w  \lambda\|w\|^2+\sum_{i=1}^n\left(1-y_i\left\langle x_i, w\right\rangle\right)_{+}$$

Nakon toga možemo izvesti gradijente za ažuriranje vrednosti težina modela:

$$\frac{\delta}{\delta w_k} \lambda\|w\|^2=2 \lambda w_k$$

$$\frac{\delta}{\delta w_k}\left(1-y_i\left\langle x_i, w\right\rangle\right){+} = \begin{cases}
    0,           & \text{if } y_i\left\langle x_i, w\right\rangle\geq1 \\\\
    -y_i x_{i k}, & \text{else}
\end{cases}$$

Težine ažuriramo zavisno od toga da li je naš klasifikator tačno klasifikovao novi podatak ili ne. Ukoliko jeste, ažuriramo samo gradijent regularizacionog parametra:

$$w=w-\alpha \cdot(2 \lambda w)$$

U suprotnom, ako je model napravio grešku, moramo da uključimo i funkciju greške u račun:

$$w=w+\alpha \cdot\left(y_i \cdot x_i-2 \lambda w\right)$$

#### Konvolucione neuronske mreže

Metoda konvolucionih neuronskih mreža pomaže za klasifikaciju podataka pomoću tehnike dubokog učenja. Neuronske mreže su inspirisane neuronima i sinapsama u ljudskom mozgu. U konvolucionu neuralnu mrežu pohranjujemo ulazne podatke u vidu spektrograma, nakon čega se oni provlače kroz nekoliko slojeva konvolucije, sažimanja i potpuno povezanih slojeva. Izlaz iz ove mreže se koristi za proračunavanje vrednosti kriterijumske funkcije, na osnovu čega se ažuriraju parametri mreže. Ovaj postupak se potom iterativno ponavlja u cilju minimizacije greške modela.

Konvoluciona neuronska mreža korišćena u ovom projektu sastoji se iz 5 konvolucionih slojeva, koristi se 4 slojeva sažimanja, kao i 3 potpuno povezana sloja. 

Ceo proces može se svesti na sledeće korake: 
1. Spektrogram se prvo obrađuje konvolucijom i ReLU-om
2. Smanjujemo veličinu obrađene slike pooling slojem
3. Ponavljamo ovaj proces 4 puta

Napomena: poslednji sloj konvolucije nije praćen slojem sažimanja.

Konvolucija kao bitne detalje posmatra one koji su mnogo puta uhvaćeni u kernelu. Problem može da se desi kada kernel ne zahvata ivice dosta puta, te može mnogo da smanji određenu sliku, a samim tim i da se reši ivičnih detalja. Ako do te pojave dođe, koristi se tehnika koja se zove sužavanje. 

Sažimanje označava dodavanje piksela na ivice. Samim tim, kada konvolucija radi svoj posao, ona će svojim kernelom mnogo puta pokriti tu površinu. 

ReLU (*rectified linear activation function* ili *rectified linear unit*) je funkcija koja negativnim vrednostima daje nulu, a pozitivne ostavlja kakve jesu. Time dobijamo nelinearan model.

{{< figure "Slika" "Grafički prikaz ReLU funkcije." >}}

![Grafički prikaz ReLU funkcije.](/images/2022/prepoznavanje-govora/relu.svg)

{{</ figure >}}

Kroz neuronsku mrežu se propušta već napravljen spektrogram, kao i labele tih spektrograma koje mreža treba da raspozna.

Za treniranje mreže koriste se dve metode simultano (propagacija unapred i unazad), kao i jedna funkcija (kriterijumska funkcija)

Kritetijumska funkcija (eng. *cost funkcija*) jeste funkcionalna veza željenog izlaza i dobijenog izlaza u funkciji. Takođe, kriterijumska funkcija je usrednjena vrednost svih funkcija greške. Najkorišćenija funkcija greške je *Cross Entropy Loss*. Potrebno nam je da minimizujemo grešku unakrsne entropije za što preciznije rezultate.

Formula po kojoj se računa *Cross Entropy Loss* je sledeća:

$$L_{C E}(\hat{y}, y)=-[y \log \sigma(\mathbf{w} \cdot \mathbf{x}+b)+(1-y) \log (1-\sigma(\mathbf{w} \cdot \mathbf{x}+b))]$$

Propagacija unazad je metod smanjenja grešaka u CNN posmatranjem neophodnih promena vrednosti parametara mreže u svakom sloju kako bi se neuroni aktivirali na određen način. Propagacija unazad prolazi kroz sve slojeve i menja parametre mreže u svakom koraku.

Parametri mreže se menjaju u cilju računanja dovoljno dobrog gradijentnog spusta za traženje lokalnog ili globalnog minimuma ove funkcije. Dakle, teži se tome da gradijent kriterijumske funkcije bude što bliži nuli.

{{< figure "Slika" "Grafički prikaz traženja lokalnog ili globalnog minimuma korišćenjem gradijentnog spusta." >}}

![Grafički prikaz gradijentnog spusta, tako da je na x osi vrednost parametra a na y osi greška. Prikazana je figurativna loptica u četiri pozicije na krivoj kako se spušta ka jednom lokalnom minimumu.](/images/2022/prepoznavanje-govora/gradient-descent.svg)

{{</ figure >}}

## Istraživanje i rezultati

Testiranje metoda vršeno je na dve baze: FSDD baze i baze srpskih reči, koja je kreirana za potrebe projekta. FSDD baza sadrži engleske cifre od 0 do 9 koje su izgovorene od strane 50 različitih ljudi. Sadrži ukupno 3000 snimaka. Srpska baza sadrži 10 srpskih reči, gde su specifično birane reči koje su slične po nekim karakteristikama (ponavljanje slova, zamena slova, umanjenice, ...). Baza ukupno sadrži 500 snimaka, gde je 29 ljudi izgovaralo ove reči različitim naglaskom i intonacijom.

U FSDD bazi podataka, 6 osoba je izgovorila svaku reč 50 puta, kako bi ukupno bilo 3000 snimaka, što čini vrlo balansiranu bazu podataka. U srpskoj bazi, 10 reči je rečeno od strane 27 ljudi, dok su dve osobe ponovile izgovaranje ovih 10 reči 13 i 10 puta. Njihovih snimaka je 130 i 100, pa otuda i 500 snimaka u bazi. Korišćeni su drugačiji izgovori i intonacije zbog raznovrsnosti. Baza je slabije pristrasna, što se odražava na same rezultate testiranja.

U bazi srpskih reči, u uređenoj trojci gluva - glava - plava očekuju se češće greške pri klasifikaciji. To se može očekivati jer su drugi i poslednja dva glasa isti. Takođe, kako su „P“ i „G“ oba praskavi suglasnici, to jest isti su po mestu tvorbe, veća je verovatnoća pojavljivanja greške.

Za konvolucionu neuronsku mrežu, potrebni su nam bili pokazatelji kako mreža uči tokom epoha treniranja. Baze su podeljene na trening, test i validacionu bazu, tako da je trening set sadržao 70% reči, a test i validacioni set po 15% reči u slučaju obe baze.

Tačnosti ovih metoda bile su sledeće:

- **Logistička regresija:** 66.33%
- **SVM:** 70.11%
- **XGBoost:** 85.90%
- **Random Forest Classificator:** 82.67%
- **CNN:** 97.28%

Metrika ovih rezultata bila je tačnost. Zbog balansiranosti baze, ovo predstavlja zaista reprezentativnu metriku.

Odvojeno možemo posmatrati rezultate metoda sa dubokim učenjem i one bez dubokog učenja. Iz tabele se može uočiti da je konvoluciona neuronska mreža ostvarila najveću tačnost kao metoda sa dubokim učenjem, a XGBoost daje najbolje rezultate među metodama koje ne koriste duboko učenje.

Konvoluciona neuronska mreža je metoda koja je najviše razrađena u ovom projektu. Metode sa dubokim učenjem same vrše *feature extraction* proces (proces izvlačenja karakteristika), koji je neophodan kako bismo sa spektrograma mogli lepo da izvučemo informacije o zvuku. *Cross entropy loss*, to jest *log loss* odlično funkcioniše kao funkcija greške za prepoznavanje govora pošto ljudsko uho reaguje logaritamski. To znači da je naše uho daleko osetljivije na niske frekvencije, primećujući razliku od svega nekoliko herca pri frekvencijama od ~100Hz, dok je ta razlika potpuno neprimetna na frekvencijama od nekoliko kHz. Osetljivost je pri dnu približno linearna, dok sa porastom frekvencije postaje logaritamska.

Tačnosti postignute na srpskoj bazi podataka značajno su niže u poređenju sa engleskom bazom. Srpska baza pravljena je u amaterskim uslovima: mikrofon slabijeg kvaliteta, dosta šuma se može čuti u samim snimcima, nisu svi zvuci iste jačine, kao ni dužine. Ovi faktori dosta utiču na kvalitet spektrograma, na kome ima dosta više šuma u poređenju sa spektrogramom engleske baze.

Rezultate vizuelno možemo prikazati matricama konfuzije na slikama {{< ref "Slika" "confmat-xgboost" >}}, {{< ref "Slika" "confmat-svm" >}}, {{< ref "Slika" "confmat-random-forest" >}} i {{< ref "Slika" "confmat-logistic-regression" >}}.

{{< figure "Slika" "Matrica konfuzije za XGBoost." "confmat-xgboost" >}}

![Matrica konfuzije za XGBoost.](/images/2022/prepoznavanje-govora/confusion-matrix-xgboost.svg)

{{</ figure >}}
{{< figure "Slika" "Matrica konfuzije za SVM." "confmat-svm" >}}

![Matrica konfuzije za SVM.](/images/2022/prepoznavanje-govora/confusion-matrix-svm.svg)

{{</ figure >}}
{{< figure "Slika" "Matrica konfuzije za Random Forest." "confmat-random-forest" >}}

![Matrica konfuzije za Random Forest.](/images/2022/prepoznavanje-govora/confusion-matrix-random-forest.svg)

{{</ figure >}}
{{< figure "Slika" "Matrica konfuzije za logističku regresiju." "confmat-logistic-regression" >}}

![Matrica konfuzije za logističku regresiju.](/images/2022/prepoznavanje-govora/confusion-matrix-logistic-regression.svg)

{{</ figure >}}

Prikazane su matrice konfuzije na FSDD bazi za XGBoost, SVM, Random Forest i logističku regresiju, tim redosledom. Iz njih se može primetiti kako, nezavisno od metode koja se koristi, cifre dva, tri i četiri uvek imaju najveću tačnost pronalaženja. 

Cifre 9 i 1 su često mešane pri klasifikaciji kod ova četiri modela. Njihov izgovor se može protumačiti kao sličan ("one" i "nine"), te su ova dva broja par sa najvećim sličnostima u karakteristikama. U svim metodama, cifra 6 je najviše puta pogrešno klasifikovana. Najčešće je mešana sa ciframa 3 i 8, što ima manje fizičkog smisla od mešanja cifara 1 i 9 ("six", "three", "eight").

XGBoost i Random Forest su se pokazale kao najbolje metoda koje ne koriste tehniku dubokog učenja.  Obe navedene metode su ansambl metode koje koriste stabla odlučivanja, te su generalno veoma otporne na preprilagođavanje. Gledajući u tabelu, XGBoost je imao veću preciznost od Random Forest klasifikatora. Ovo se može objasniti "obrezivanjem drveća" koje XGBoost radi, to jest *Boosting*, kojim poboljšava klasifikaciju. XGBoost u svakoj iteraciji pokušava da kompenzuje rezultate dosadašnjeg modela, te je bolji u prilagođavanju trening podacima.

Konvoluciona neuronska mreža, kao metoda koja koristi duboko učenje, prevazišla je rezultate običnih metoda. To se može objasniti time što je CNN kompleksniji model, pa može da modeluje kompleksniju relaciju između paramatara koji su mu dati. Metode sa dubokim učenjem imaju široku primenu u oblasti mašinskog učenja zbog sličnosti ovih algoritama ljudskom mozgu. Jednostavnije metode često ne uspevaju da modeluju kompleksne veze između podataka, te je neophodno odlučiti se za kompleksnije metode poput dubokog učenja.

## Zaključak

Projekat "Prepoznavanje govora" pokazuje načine rešavanja popularne dileme pretvaranja glasa u kucani tekst. Koristi se FSDD baza podataka za poređenje performansi pri prepoznavanju govora između sledećih metoda: SVM, CNN, Random Forest, XGBoost i logistička regresija. Uz FSDD, koristi se i samostalno napravljena baza podataka koja se sastoji od srpskih reči, gde je dokazano, testiranjem metoda, da su se ove metode pokazale kao veoma uspešne pri detektovanju izgovorenih reči. CNN model je imao najveću uspešnost pri prevođenju reči. Tačnost metoda dolazi čak do 97.28%, te je zaključak ovog rada da je CNN najpraktičnija metoda za rad. Dalja istraživanja bi trebalo usmeravati ka ispitivanju ove metode.


## Literatura

1. Ananthi, S. and Dhanalakshmi, P. (2015) “SVM and HMM modeling techniques for speech recognition using LPCC and MFCC features” Advances in Intelligent Systems and Computing, pp. 519–526. Available at: https://doi.org/10.1007/978-3-319-11933-5_58.

2. Gandhi, R. „Support Vector Machine — introduction to machine learning algorithms“. Available at: https://towardsdatascience.com/support-vector-machine-introduction-to-machine-learning-algorithms-934a444fca47.

3. Yiu, T. „Understanding random forest“. Available at: https://towardsdatascience.com/understanding-random-forest-58381e0602d2. 

4. Kam Ho, T. „The Random Subspace Method for Constructing Decision Forests“. Available at: https://pdfs.semanticscholar.org/b41d/0fa5fdaadd47fc882d3db04277d03fb21832.pdf.

5. Bryll, R., Gutierrez-Osuna, R. and Quek, F. (2002) „Attribute bagging: Improving accuracy of classifier ensembles by using random feature subsets, Pattern Recognition“. Pergamon. Available at: https://www.sciencedirect.com/science/article/abs/pii/S0031320302001218?via%3Dihub.

6. Swaminathan, S. „Logistic Regression — Detailed Overview“. Available at: https://towardsdatascience.com/logistic-regression-detailed-overview-46c4da4303bc.

7. „What is logistic regression?“ IBM. Available at: https://www.ibm.com/topics/logistic-regression.

8. „Softmax Regression - Unsupervised feature learning and Deep Learning Tutorial“. Available at: http://deeplearning.stanford.edu/tutorial/supervised/SoftmaxRegression/.

9. Kiran, U. (2021) „MFCC technique for speech recognition, Analytics Vidhya“. Available at: https://www.analyticsvidhya.com/blog/2021/06/mfcc-technique-for-speech-recognition/.

10. Randall, R.B. (2016) „A history of Cepstrum analysis and its application to mechanical problems, Mechanical Systems and Signal Processing“. Academic Press. Available at: https://www.sciencedirect.com/science/article/abs/pii/S0888327016305556. 
