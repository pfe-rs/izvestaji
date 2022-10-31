---
title: Prepoznavanje znakovnog jezika
summary: Prepoznavanje znakovnog jezika je projekat rađen na letnjem kampu za stare polaznike 2022. godine od Zlate Stefanović i Vladana Bašića.
---

### Uvod

Tip neverbalne komunikacije najčešće korišćen među gluvo-nemim ljudima se zove znakovni jezik. Ovaj vid komunikacije omogućava prenos informacija bez korišćenja reči, samo pomoću pokreta i gestikulacija. Međutim, znakovni jezik nije poznat široj populaciji što otežava njegovo razumevanje. Da bi se prevazišao ovaj problem, predloženo je korišćenje savremene tehnologije.

Značajan broj istraživanja je urađeno na ovu temu - rad [[1]](http://arxiv.org/abs/1409.1556) se bavio povećavanjem dubina ConvNet-a sa jako malim (3x3) konvolucionim filterima. U [[2]](https://arxiv.org/ftp/arxiv/papers/2108/2108.10970.pdf) je razmatran Indijski Znakovni Jezik (ISL). Urađena je detekcija, praćenje i binarizacija šake na osnovu boje kože nako čega je korišćen grid za ekstraktovanje obeležja. Gestikulacije su klasifikovane kNN algoritmom. Rad [[3]](https://arxiv.org/pdf/2110.15542.pdf) je fokusiran na detektovanje položaja u kojima nije pokazan nijedan znak koristeći Novelty Detection.

### Baza podataka

Američki znakovni jezik (ASL) je najrasprostranjeniji znakovni jezik u svetu. Sastoji se od 26 znakova, za svako od 26 slova engleskog alfabeta, od kojih su dva takođe i pokreti, slovo J i slovo Z.

![ASL](/images/2022/prepoznavanje-znakovnog-jezika/asll.png)
Za bazu podataka korišćena je baza sintetički generisanih slika američkog znakovnog jezika [[4]](kaggle.com/datasets/lexset/synthetic-asl-alphabet). Korišćena je sintetička baza zbog velikog broja slika različitih pozadina , osvetljenja i boja kože u nadi da će modeli, kao posledica veće raznovrsnosti, biti više robustni. Primenjena je ista podela na trening i test podatke kao kod autora baze.

##### Predprocesing

Svaka slika je pre klasifikacije izmenjena na nekoliko načina. Na svakoj slici su primenjene sledeće transformacije:

- rotacija a za do $\pm$ 25%
- širenje po x-osi za do 30%
- širenje po y-osi za do 30%
- zumiranje za do 30%
- U 50% slučajeva preslikavanje u odnosu na vertikalu

![Augmentacija baze](/images/2022/prepoznavanje-znakovnog-jezika/data_augmentation.png)

##### Obrada baze za kNN

Klasifikacija znaka koji je pokazan je realizovan prvo kroz određivanje pozicije šake. Za olakšanje ovog procesa ekstraktovane su 21 ključne tačke šake (ukupno 42 koordinate) pomoću MediaPipe Holistic Pipeline-a [[5]](https://google.github.io/mediapipe/solutions/holistic.html).
![ASL](/images/2022/prepoznavanje-znakovnog-jezika/acab.PNG)

Prvi pristup za utvrđivanje boje kože je uzimanje srednje vrednosti dobijenih 42 tačaka, pri čemu su dobijeni neprecizni rezultati. Drugi način bio je odredjivanje koordinate sredine šake i uzimanje njene vrednosti, što nije radilo jer se često nalazila senka na tom delu slike. Finalni i najprecizniji način je bio uzimanje celog opsega ovih tačaka.
Na osnovu HSV vrednosti u koordinatama ključnih tačaka određen je spektar za koji klasifikujemo tačku kao da pripada šaci:

$$[HSVmin, HSVmax] = [min(kp_{1},kp_{2},...,kp_{n}), max(kp_{1},kp_{2},...,kp_{n})]$$

Na osnovu dobijene pozicije šake slika je isečena oko nje i preoblikovana na 512 x 512 piksela. Na novodobijenu sliku primenjena je binarizacija i morfološke operacije, eroziju i dilataciju, radi uklanjanja šuma.

#### Obrada baze za ASL Keypoint Classification

Baza ove mreže se sastoji od koordinata ključnih tačaka šake. Za njihovu detekciju korišćena je MediaPipe Holistic metoda. Prilikom njene primene prag za detektovanje tačaka šake je smanjen sa 0.5 na 0.3 jer za određene položaje šake ona nije bivala detektovana. Na svaku sliku baze je pojedinačno primenjena detekcija ključnih tačaka i novodobijene slike su sačuvane u novu bazu. Nova baza je imala 63 parametra za svaku sliku:

- X - x koordinata svake tačke, 21 ukupno
- Y - y koordinata svake tačke, 21 ukupno
- Z - dubina svake tačke, 21 ukupno

### kNN - k Nearest Neighboors

Binarizovana slika je podeljena na NxN mrežu, gde definišemo obeležje svakog polja kao zasićenost - udeo belih piskela unutar polja:

$$obeležje = \frac{P_{bela}}{P_{polje}}$$

Pod predpostavkom da su ovako dobijeni podaci podeljeni na klastere, potreban je način za njihovu klasifikaciju. Za ovo je korišćen KNN algoritam. Na prethodno fitovanim podacima u Euklidskoj metrici je izdračunata distanca između uzorka i svih fitovanih uzoraka i izabrani su k najbližih. Od tih k uzoraka klasifikator bira klasu koja se najčešće pojavljuje.

##### Rezultati

Na osnovu N i k parametara, izračunate su tačnost metode u svakom od slučajeva. Vizuelni prikaz rezultata je dobijen u vidu mape intenziteta.
![Mapa intenziteta](/images/2022/prepoznavanje-znakovnog-jezika/heatmap.png)
Preciznost je rasla srazmerno parametrimu N i obrnuto srazmerno parametru k, pri čemu je najbolji rezultat dobijen za k = 1 i N = 20.

### American Sign Language Keypoint Classification

Ovaj metod za klasifikaciju koristi klasifikacionu _fully connected_ neuralnu mrežu čiji su ulazi koordinate krucijalnih tačaka šake.
Korišćena je jednostavna mreža sa četiri dense sloja.

#### Rezultati

Dobijen je loss od 0.19 i preciznost od 95.6%.
![Grafik loss funkcije](/images/2022/prepoznavanje-znakovnog-jezika/training_graph.png)
![Grafik preciznosti](/images/2022/prepoznavanje-znakovnog-jezika/accuracy_graph.png)
Matrica konfuzije predstavlja tabelu oznake svake od slika u odnosu na pripisanu oznaku. Najveća pogrešna vrednost je dobijena pripisivanjem slova E slovu O - šest puta.
![Matrica konfuzije](/images/2022/prepoznavanje-znakovnog-jezika/confusion_matrix.png)

### Extended MNIST - CNN

Sastavljena je konvoluciona neuronska mreža po uzoru na MNIST-ov model klasifikacije ASL-a. Ulazni podaci za ovu mrežu su znatno manji od korišćene baze što je rezultovalo u dodavanje dodatna tri konvoluciona sloja i uklanjanje dropout funkcija.

_Nova arhitektura mreže slika_

#### Rezultati

Ovako izmenjenom mrežom je dobijen loss od 0.18 i accuracy od 96.25%.
![Grafik loss funkcije](/images/2022/prepoznavanje-znakovnog-jezika/loss_graph.png)
![Grafik preciznosti](/images/2022/prepoznavanje-znakovnog-jezika/accuracy_graph_MNIST.png)
Matrica konfuzije za ovaj metod ukazuje na najviše mešanja slova F slovom W.
![Matrica konfuzije](/images/2022/prepoznavanje-znakovnog-jezika/confusion_matrix_MNIST.png)

### EfficientNetB3

Za poboljšanje konvolucionih neuronskih mreža česta je praksa skaliranje po jednoj od sledeće tri dimenzije - dubina, širina i veličina slike. U [6] je predložen novi state-of-the-art način skaliranja mreže, u kome se dobija balans ove tri dimenzije skalirajući svaku od njih istom konstantom. Ovako je razvijeno osam mreža EfficientNetB0 do EfficientNetB7.
Radi poklapanja rezolucije slika iz baze i ulaznih podataka mreže implementirana je EfficientNetB3 mreža.

_arhitektura_

#### Rezultati

Korišćenjem EfficientNetB3 dobijen je loss od 0.44 i preciznost od 99%.

_grafici_

### Zaključak

### Keypoint Classification

Ovaj metod za klasifikaciju koristi klasifikacionu _fully connected_ neuralnu mrežu čiji su ulazi koordinate krucijalnih tačaka šake.

##### Obrada baze

### Literatura

[1] [Very Deep Convolutional Networks for Large-scale Image Recognition](http://arxiv.org/abs/1409.1556)

[2] [Real-time Indian Sign Language (ISL) Recognition](https://arxiv.org/ftp/arxiv/papers/2108/2108.10970.pdf)

[3] [Automatic Hand Sign Recognition: Identify Unusuality through Latent Cognizance](https://arxiv.org/pdf/2110.15542.pdf)

[4] [Synthetic ASL Alphabet](kaggle.com/datasets/lexset/synthetic-asl-alphabet)

[5] [MediaPipe](https://google.github.io/mediapipe/solutions/holistic.html)

[6] [Tan, Mingxing, and Quoc Le. "Efficientnet: Rethinking model scaling for convolutional neural networks." International conference on machine learning. PMLR, 2019.](https://arxiv.org/pdf/1905.11946.pdf)
