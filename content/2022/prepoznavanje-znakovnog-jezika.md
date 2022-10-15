---
title: Prepoznavanje znakovnog jezika
summary: Prepoznavanje znakovnog jezika je projekat rađen na letnjem kampu za stare polaznike 2022. godine od Zlate Stefanović i Vladana Bašića.
---

### Uvod

Tip neverbalne komunikacije najčešće korišćen među gluvo-nemim ljudima se zove znakovni jezik. Ovaj vid komunikacije omogućava prenos informacija bez korišćenja reči, samo pomoću pokreta i gestikulacija. Međutim, znakovni jezik nije poznat široj populaciji što otežava njegovo razumevanje. Da bi se prevazišao ovaj problem, predlažemo korišćenje savremene tehnologije.

Značajan broj istraživanja je urađeno na ovu temu - rad [1] se bavio povećavanjem dubina ConvNet-a sa jako malim (3x3) konvolucionim filterima. Pri ovome dobijen je 6.7% validation error. U [2] je razmatran Indijski Znakovni Jezik (ISL). Urađena je detekcija i praćenje šake na osnovu boje kože, potom je korišćen Grid za ekstraktovanje obeležja na kraju čeka su gestikulacije klasifikovane kNN algoritmom. Ovako je dobijena tačnost od 99.7%. Rad [3] bio je fokus na detektovanju položaja u kojima nije pokazan nijedan znak koristeći Novelty Detection, pri čemu je dobijena tačnost od 97.59%.

### Baza podataka

Za bazu podataka korišćena je baza sintetički generisanih slika američkog znakovnog jezika [[4]](kaggle.com/datasets/lexset/synthetic-asl-alphabet). Korišćena je sintetička baza zbog velikog broja slika različitih pozadina , osvetljenja i boja kože u nadi da će modeli, kao posledica veće raznovrsnosti, biti više robustni. Baza se sastoji od 27000 slika dimenzija 512 x 512 piksela podeljena na trening i test setove. Podeljena je na 27 foldera koji predstavljaju 27 klasa. Svako folder sadrži 900 trening i 100 test primera.

### kNN - k Nearest Neighboors

##### Obrada baze

Za identifikaciju regiona slike koji je boje k ože, prvo je korišćen MediaPipe Holistic pipeline za ekstraktovanje 21 ključnih tačaka obe šake (ukupno 42 koordinata). Na osnovu HSV vrednosti u koordinatama tačaka određen je spektar za koji klasifikujemo tačku kao da pripada šaci.

$$[HSVmin, HSVmax] = [min(kp_{1},kp_{2},...,kp_{n}), max(kp_{1},kp_{2},...,kp_{n})]$$

Na osnovu dobijene pozicije šake slika je isečena i preoblikovana na dimenzije ... Na novodobijenu sliku primenjena je binarizacija i morfološke operacije radi uklanjanja šuma.

##### kNN

Binarizovana slika je podeljena na NxN grid,

### Literatura

[1] [Very Deep Convolutional Networks for Large-scale Image Recognition](http://arxiv.org/abs/1409.1556)

[2] [Real-time Indian Sign Language (ISL) Recognition](https://arxiv.org/ftp/arxiv/papers/2108/2108.10970.pdf)

[3] [Automatic Hand Sign Recognition: Identify Unusuality through Latent Cognizance](https://arxiv.org/pdf/2110.15542.pdf)

[4] [Synthetic ASL Alphabet](kaggle.com/datasets/lexset/synthetic-asl-alphabet)
