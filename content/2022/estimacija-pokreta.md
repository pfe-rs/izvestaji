---
title: Estimacija pokreta
summary: Estimacija pokreta pomoću optical flow je projekat rađen na letnjem kampu za stare polaznike 2022. godine od Milice Gojak i Novaka Stijepića.
---
[to do]: <ubaci reference, objasni CRF, ubaci slike, postprocessing>

## Uvod

Procena kretanja je proces određivanja vektora kretanja koji opisuju prelazak jedne slike u drugu. Predstavlja jedan od osnovnih problema oblasti kompjuterske vizije.

Većina metoda definiše problem estimacije kao problem minimizacije energije. 

Uprkos njihovim uspesima, ovaj i mnogi drugi pristupi su ograničeni činjenicom da je prostorna regularnost modelirana kao konveksna funkcija. Pretpostavka pomaže optimizaciji mada dobijenom polju kretanja (eng. *flow field*)
nedostaju oštri prekidi koji postoje u pravom polju kretanja, naročito pri opisivanju kretanja u blizini granica.
Veliki broj istraživača je fokusiran na preformulaciju problema ne bi li bili dopušteni diskontinuiteti.

Roth i Black su proučavali prostorne statistike optičkog protoka i nagovestili da konveksne energije koje koristi većina pristupa estimaciji obezbeđuju samo aproksimaciju statistika protoka. Predlažu korišćenje Markovljevih slučajnih procesa, ali zbog nekonveksnih energija, dobijanje zaključka ostaje vrlo izazovan problem i polja kretanja procenjena korišćenjem pristupa kontinualne optimizacije još uvek pate od izglađenih diskontinuiteta.

U oblasti *stereo matching*-a ove poteškoće su prepoznate i potreba za nekonveksnim energetskim funkcijama je razrešena. Korišćenje funkcija je olakšano modeliranjem diskretnih optimizacionih algoritama, poput *graph cut*-ova ili *message passing* koje su često bile u mogućnosti da ostvare približno globalan optimum. Većina stereo tehnika sa najboljim rezultatima se oslanja na diskretnu optimizaciju za minimizaciju energije a ne konveksnih funkcija. Iako se estimacija dispariteta može posmatrati i kao ograničeni slučaj optičkog protoka, malo autora je pokušalo da koristi diskretnu optimizaciju za estimaciju optičkog protoka.

U referentnoj metodi(Menze et al. 2015) su predložene tri različite strategije optimizacije diskretnog pristupa. Cilj rada je bio ispitivanje uticaja različitih algoritama na preciznost određivanja optičkog prootka.

## Metod

### Generisanje predloga

Polje kretanja se određuje nad parom slika; referentnoj slici i ciljanoj slici (slici koja je uslikana nekoliko trenutaka nakon referentne). Referentnu sliku želimo da pomoću vektora protoka pretvorimo u ciljanu sliku.

Ciljana slika se deli na ćelije jednakih veličina. Za svaku ćeliju se koristi nasumična k-d šuma (eng: *randomized k-d tree forest*) za deskriptore piksela koji pripadaju toj ćeliji. To je efikasna struktura za nalaženje $K$ piksela najbližih datom pikselu, po sličnosti deskriptora računatih DAISY algoritmom. Za razliku od referentne metode koja čuva sve k-d šume tokom generisanja predloga, naša metoda pravi k-d šumu za jednu ćeliju, iskoristi je za nalaženje najsličnijih piksela u ćelijama u okolini i više je ne čuva. Time svaki piksel dobije ukupno $M$ predloga destinacije vektora protoka, po $K$ iz svake okolne ćelije.

Kako susedni pikseli često imaju sličan vektor protoka, dodatno se uzima $N$ nasumičnih piksela iz lokalne Gausove distribucije centrirane na referentnom pikselu i u skup predloga se dodaju vektori protoka čija je destinacija piksel koji najbolje odgovara izabranom pikselu. Naša metoda ne dodaje vektor u skup predloga u slučaju da je već prisutan, za razliku od referentne metode koja dodaje sledeći najbolji vektor protoka tog piksela. Zbog toga ne mora da sortira sve predloge iz datog piksela, čime dobija na efikasnosti.

#### DAISY

DAISY je algoritam koji pretvara lokalne regione slike u niskodimenzionalne invarijantne deskriptore koji mogu da se koriste za uparivanje i klasifikaciju.

Slično SIFT deskriptoru, DAISY je 3D histogram gradijenata lokacija i orijentacija. Razlika leži u dva aspekta. 
Jedna je da se u SIFT-u za konvolucije gradijenata u određenim smerovima koriste težinske sume normi gradijenata, dok DAISY koristi nekolino Gausovih filtera. Ovo doprinosi efikasnom računanju deskriptora na svakoj lokaciji piksela, zato što histogram treba da se izračuna samo jednom po regiji i može se koristiti za sve okolne piksele. Druga razlika je da DAISY koristi kružnu konfiguraciju komšija umesto pravougaone koje koristi SIFT. Za datu ulaznu sliku $I$, određen broj mapa orijentacija $G_o$, jedna za svaki procenjeni pravac $o$, su prvo izračunati. Formalno su definisani kao:


$$G_o = \left(\frac{\partial I}{\partial o} \right) ^+ $$ 

Gde $+$ znači da su samo pozitivne vrednosti sačuvane da bi se održala polarnost intenziteta promena. Nad svakom mapom orijentacija, koja predstavlja gradijentne norme za taj pravac na svim lokacijama piksela, se nekoliko puta vrši Gausova konvolucija sa kernelima različitih standardnih devijacija da bi se dobile konvoluirane orijentacione mape. Efikasnost DAISY algoritma proizilazi upravo odavde, zato što su Gausovi filteri razdvojivi i zato se konvolucije mogu vršiti vrlo efikasno. Ovo znači da se konvolucije sa velikim kernelom mogu računati iz nekoliko uzastopnih konvolucija sa manjim kernelima. Stoga se smanjuje količina računanja.
Na svakoj lokaciji piksela, njegova okolina je podeljena u krugove različitih veličina lociranih na seriji koncentričnih prstenova. Prečnik svakog kruga je proporcionalan njegovoj udaljenosti od centraknog piksela i standardna devijacija Gausovog kernela je proporcionalna veličini kruga. Unutar svakog kruga je napravljen vektor sabiranjem svih 

Postoje 4 glavna parametra koji određuju izgled DAISY deskriptora: prečnik oblasti komšija ($R$), broj izdvojenih orijentacija ($o$), broj konvolucionih orijentacionih prstenova ($r$) i broj krugova na svakom prstenu ($c$).

### Random Field Model

### Pronalaženje optimalnih vektora


### Postprocesiranje

## Rezultati

### Kvantitativni rezultati

Uspešnost algoritma je merena na osnovu dve metrike: srednja greška i procenat pogrešnih piksela. Srednja greška je računata kao srednja vrednost zbira kvadrata razlike komponenata istinitog vektora pomeraja i naše procene. Pogrešan piksel se smatra onaj čija je greska veća od 3 piksela. Za evaluaciju su korišćeni podaci iz KITTI baze koja sadrži parove uzastopnih slika sa primerima manjih i većih pomeraja. Svaki par slika u skupu za trening sadrži i istinito polje pokreta.
Tabela prikazuje zavisnost metrike od broja izvršenih BCD-ova. Testiranja su vršena nad skupom od po sedam parova slika.

| BCD      | Srednja greška | Procenat pogrešnih piksela|
| ----------- | ----------- | ------------------------|
| 0      | 13.81       |   30.97 |
| 1   | 6.59        |   21.67 |
|2 | 4.81| 19.2|
|3|4.54| 18.64|
|4|4.41|18.40|
|5|4.36|18.27|
|6| 4.33|18.20|
|7|4.30|18.15|

## Literatura

Roth, S., Black, M.J.: On the spatial statistics of optical flow. IJCV 74(1), 33–50 (2007)