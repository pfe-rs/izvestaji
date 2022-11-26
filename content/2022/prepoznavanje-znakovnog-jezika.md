---
title: Prepoznavanje znakovnog jezika
summary: Prepoznavanje znakovnog jezika je projekat rađen na letnjem kampu za stare polaznike 2022. godine od Zlate Stefanović i Vladana Bašića.
---

### Uvod

Tip neverbalne komunikacije najčešće korišćen među gluvo-nemim ljudima se zove znakovni jezik. Ovaj vid komunikacije omogućava prenos informacija bez korišćenja reči, samo pomoću pokreta i gestikulacija. Međutim, znakovni jezik nije poznat široj populaciji što otežava njegovo razumevanje. Da bi se prevazišao ovaj problem, predloženo je korišćenje savremene tehnologije.

Značajan broj istraživanja je urađeno na ovu temu - rad [[1]](http://arxiv.org/abs/1409.1556) se bavio povećavanjem dubina ConvNet-a sa jako malim (3x3) konvolucionim filterima. U radu [[2]](https://arxiv.org/ftp/arxiv/papers/2108/2108.10970.pdf) je razmatran Indijski Znakovni Jezik (ISL). Urađena je detekcija, praćenje i binarizacija šake na osnovu boje kože nakon čega je korišćen grid za ekstraktovanje obeležja. Gestikulacije su klasifikovane kNN algoritmom. Rad [[3]](https://arxiv.org/pdf/2110.15542.pdf) je fokusiran na detektovanje položaja u kojima nije pokazan nijedan znak koristeći Novelty Detection.

### Baza podataka

Američki znakovni jezik (ASL) je najrasprostranjeniji znakovni jezik u svetu. Sastoji se od 26 znakova, za svako od 26 slova engleskog alfabeta, od kojih dva sadrže pokret, slovo J i slovo Z.

![ASL](/images/2022/prepoznavanje-znakovnog-jezika/asll.png)

Za bazu podataka korišćena je baza sintetički generisanih slika američkog znakovnog jezika [[4]](kaggle.com/datasets/lexset/synthetic-asl-alphabet). Korišćena je sintetička baza zbog velikog broja slika različitih pozadina, osvetljenja i boja kože u nadi da će modeli, kao posledica veće raznovrsnosti, biti više robusni. Primenjena je ista podela na trening i test podatke kao kod autora baze.

##### Predprocesing

Svaka slika je pre klasifikacije izmenjena na nekoliko načina. Na svakoj slici su primenjene sledeće transformacije:

- rotacija a za do $\pm$ 25%
- širenje po x-osi za do 30%
- širenje po y-osi za do 30%
- zumiranje za do 30%
- U 50% slučajeva preslikavanje u odnosu na vertikalu

![Augmentacija baze](/images/2022/prepoznavanje-znakovnog-jezika/data_augmentation.png)

##### Obrada baze za kNN

Klasifikacija znaka koji je pokazan je realizovan prvo kroz određivanje pozicije šake. Za olakšanje ovog procesa pronađene su 21 ključne tačke šake (ukupno 42 koordinate) pomoću *MediaPipe Holistic Pipeline*-a [[5]](https://google.github.io/mediapipe/solutions/holistic.html).

![ACAB](/images/2022/prepoznavanje-znakovnog-jezika/acab-Copy.PNG)

Prvi pristup za utvrđivanje boje kože je uzimanje srednje vrednosti dobijene 21 tačke, pri čemu su dobijeni neprecizni rezultati. Drugi način bio je određivanje koordinate sredine šake i uzimanje njene vrednosti, što nije radilo jer se često nalazila senka na tom delu slike. Konačni i najprecizniji način je bio uzimanje celog opsega ovih tačaka. Na osnovu HSV vrednosti u koordinatama ključnih tačaka određen je opseg takav da je najmanji moguć a da u njega i dalje spadaju sve HSV vrednosti ključnih tačaka:

$$[HSVmin, HSVmax] = [min(kp_{1},kp_{2},...,kp_{n}), max(kp_{1},kp_{2},...,kp_{n})]$$

Na osnovu dobijene pozicije šake slika je isečena oko nje i preoblikovana na 512 x 512 piksela. Na novodobijenu sliku primenjena je binarizacija na osnovu dobijenog HSV opsega i morfološke operacije, erozija i dilatacija, radi uklanjanja šuma.

![kNN binarizovano](/images/2022/prepoznavanje-znakovnog-jezika/kNN_binarised.png)

#### Obrada baze za Keypoint Classification

Baza ove mreže se sastoji od koordinata ključnih tačaka šake. Za njihovu detekciju korišćena je MediaPipe Holistic metoda, prilikom čije primene prag za detektovanje šake smanjen je sa 0.5 na 0.3 jer za određene položaje šake metod nije detektovao šaku. Na svaku sliku baze je pojedinačno primenjena detekcija ključnih tačaka i novodobijene slike su sačuvane u novu bazu. Nova baza je imala 42 parametra za svaku sliku:

- X - x koordinata svake tačke, 21 ukupno
- Y - y koordinata svake tačke, 21 ukupno

Formirana je još jedna baza, slična kao prva, za koju je korišćena je aproksimacija dubine koja je ugrađena u *MediaPipe Holistic* metodu. Ova aproksimacija daje po još jednu koordinatu za svaku tačku, stoga ova baza ima 63 parametra, po 3 za svaku tačku.

- X - x koordinata svake tačke, 21 ukupno
- Y - y koordinata svake tačke, 21 ukupno
- Z - dubina svake tačke, 21 ukupno

### kNN - k Nearest Neighboors

Binarizovana slika je podeljena na $N \times N$ mrežu, gde definišemo obeležje svakog polja kao zasićenost - udeo belih piksela unutar tog polja:

$$obeležje = \frac{P_{bela}}{P_{polje}}$$

Pod pretpostavkom da su ovako dobijeni podaci podeljeni na klastere, potreban je način za njihovu klasifikaciju. Za ovo je korišćen kNN algoritam. Iz binarizovane baze podataka izdvojeno je po 6 slika za svaku klasu i njihova obeležja korišćena su kao definišuća baza podataka. Na prethodno fitovanim podacima u Euklidskoj metrici je izračunata razdaljina između uzorka i svih primera definišuće baze i izabrani su $k$ najbližih primera. Od tih $k$ primera klasifikator bira klasu koja se najčešće pojavljuje.

![kNN dijagram](/images/2022/prepoznavanje-znakovnog-jezika/kNN_dijagram_za_izvestaj.svg)

##### Rezultati

Na osnovu $N$ i $k$ parametara, izračunata je tačnost metode u svakom od slučajeva. Vizuelni prikaz rezultata je dobijen u vidu mape intenziteta. Ispostavlja se da preciznost raste srazmerno parametru $N$ i obrnuto srazmerno parametru $k$, pri čemu je najbolji rezultat dobijen za $k = 1$ i $N = 20$, sa preciznošću od 56%.

![Mapa intenziteta](/images/2022/prepoznavanje-znakovnog-jezika/heatmap.png)

### Keypoint Classification

Ovaj metod za cilj ima da klasifikuje sliku na osnovu koordinata ključnih tačaka šake. Kao klasifikator koristi _fully connected_ čiji je ulaz koordinate ključnih tačaka, a izlaz jedna od 24 klase. Korišćena je jednostavna mreža sa četiri _dense_ sloja. Metod je rađen sa i bez procene dubine ugrađene u *MediaPipe Holistic* metodu koja je korišćena za nalaženje ključnih tačaka.

#### Rezultati

U slučaju kada je korišćena aproksimacija dubine dobijena je preciznost od 95.6%, dok je preciznost bez nje bila znatno manja, 85.8%. Razlika između ova dva primera verovatno bi bila primetnija u realnoj primeni kada nisu sve slike šaka na sličnoj udaljenosti od same šake. Grafici rezultata u daljem radu prikazani su samo za bolju od dve metode. 

![Grafik loss funkcije](/images/2022/prepoznavanje-znakovnog-jezika/graph_together_aslkc.png)

Matrica konfuzije predstavlja raspodelu učestalosti klasifikacije po klasama. Korisna je za primećivanje da li je neka klasa često pogrešno klasifikovana i kao šta. Na datoj matrici konfuzije najveća pogrešna vrednost je dobijena pripisivanjem slova "E" slovu "O" - šest puta.

![Matrica konfuzije](/images/2022/prepoznavanje-znakovnog-jezika/confusion_matrix.png)

### Extended MNIST - CNN

Ovaj metod zasniva se na klasifikaciji pomoću konvolucione neuralne mreže. Model je građen po uzoru na konvolucioni klasifikacioni model za MNIST bazu podataka za ASL. Ova baza sadrži _grayscale_ slike znatno manjih dimenzija od korišćene baze (28x28) pa je za adaptaciju modela za slike većih dimenzija sa tri umesto jednog kanala potrebno proširiti mrežu. Ovo proširenje postignuto je dodavanjem dodatna tri konvoluciona sloja i uklanjanjem _dropout_ funkcija između slojeva radi manje osetljivosti pri treniranju.

_Nova arhitektura mreže slika_

#### Rezultati

Ovako izmenjenom mrežom je dobijena preciznost od 96.25%. Iako precizniji od prethodnog metoda klasifikator za ovaj metod se znatno duže trenira.

![Grafik loss funkcije](/images/2022/prepoznavanje-znakovnog-jezika/graph_together_emnist.png)

![Matrica konfuzije](/images/2022/prepoznavanje-znakovnog-jezika/confusion_matrix_MNIST.png)

### EfficientNetB3

Za poboljšanje konvolucionih neuronskih mreža česta je praksa skaliranje po jednoj od sledeće tri dimenzije - dubina, širina i veličina slike. U [[6]](https://arxiv.org/pdf/1905.11946.pdf) predložen je state-of-the-art način skaliranja mreže, u kome se dobija balans ove tri dimenzije skalirajući svaku od njih istom konstantom. Ovako je razvijeno osam mreža EfficientNetB0 do EfficientNetB7.
Radi poklapanja rezolucije slika iz baze i ulaznih podataka mreže implementirana je EfficientNetB3 mreža.

_arhitektura_

#### Rezultati

Korišćenjem EfficientNetB3 mreže dobijena je preciznost od 99%. Zbog kompleksnosti mreže njeno treniranje je izuzetno sporo.

_grafici_

### Zaključak

Urađeno je poređenje metoda kNN, KC, CNN i EfficientNetB3 pri prepoznavanju američkog znakovnog jezika. Pokazalo se da je metodi kNN potrebno najviše dorade. Ova dorada bi primarno uključivala drugačiji sistem binarizacije šake kao i dublje ispitivanje raspodele klasa i da li se fičeri ASL-a uopšte raspoređuju po klasterima kao što je to slučaj za indijski znakovni jezik. Najbolju uspešnost je imala EfficientNetB3 metoda sa 99% tačnosti. Metode KC i CNN su imale visoke rezultate sa 95.6% i 96.25%, dok im je vreme treniranja bilo značajno kraće.

### Dalji rad

Dalji rad na projektu bi uključivao skaliranje klasifikatora slike na video zapise. Ovaj problem donosi dodatan zadatak detektovanja lažnih znakova, trenutaka kada je šaka u kadru ali je u procesu pomeranja iz jednog znaka u drugi pa bi čitanje bilo kog slova bilo pogrešno. Ovaj problem rešava se kroz poređenje sigurnosti mreže u izabranu klasu kao i uvođenjem novih metrika kao _latent_cognizance_ priloženih u radu [[3]](https://arxiv.org/pdf/2110.15542.pdf). Nakon uspešne implementacije klasifikatora na video snimke dodatno poboljšanje postiglo bi se implementacijom _natural language processing_ modela pomoću kojih se mogu ukloniti nepreciznosti pri prevodu.

### Literatura

[1] [Very Deep Convolutional Networks for Large-scale Image Recognition](http://arxiv.org/abs/1409.1556)

[2] [Real-time Indian Sign Language (ISL) Recognition](https://arxiv.org/ftp/arxiv/papers/2108/2108.10970.pdf)

[3] [Automatic Hand Sign Recognition: Identify Unusuality through Latent Cognizance](https://arxiv.org/pdf/2110.15542.pdf)

[4] [Synthetic ASL Alphabet](kaggle.com/datasets/lexset/synthetic-asl-alphabet)

[5] [MediaPipe](https://google.github.io/mediapipe/solutions/holistic.html)

[6] [Tan, Mingxing, and Quoc Le. "Efficientnet: Rethinking model scaling for convolutional neural networks." International conference on machine learning. PMLR, 2019.](https://arxiv.org/pdf/1905.11946.pdf)
