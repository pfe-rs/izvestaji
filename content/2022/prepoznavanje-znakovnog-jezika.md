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

Da bi se detektovao ceo region slike na kome se nalazi šaka, a samim tim i znak šake klasifikovao, tražena je boja kože. Vrednost ove boje će biti predstavljena kao opseg - različit je za svaku sliku jer se u bazi mogu pronaći slike sa senkama i slike šaka drugačijih tonova kože. Za olakšanje ovog procesa ekstraktovane su 21 ključne tačke šake (ukupno 42 koordinate) pomoću MediaPipe Holistic Pipeline-a. Prvi pristup za utvrđivanje boje kože je uzimanje srednje vrednosti dobijenih 42 tačaka, pri čemu su dobijeni neprecizni rezultati. Drugi način bio je odredjivanje koordinate sredine šake i uzimanje njene vrednosti, što nije radilo jer se često nalazila senka na tom delu slike. Finalni i najprecizniji način je bio uzimanje celog opsega ovih tačaka.
Na osnovu HSV vrednosti u koordinatama ključnih tačaka određen je spektar za koji klasifikujemo tačku kao da pripada šaci.

$$[HSVmin, HSVmax] = [min(kp_{1},kp_{2},...,kp_{n}), max(kp_{1},kp_{2},...,kp_{n})]$$

Na osnovu dobijene pozicije šake slika je isečena oko nje i preoblikovana na 512 x 512 piksela. Na novodobijenu sliku primenjena je binarizacija i morfološke operacije radi uklanjanja šuma.

##### kNN

Binarizovana slika je podeljena na NxN grid, gde definišemo feature svakog bloka kao zasićenost - odnos broja belih piskela i cele slike:

$$feature = \frac{P_{bela}}{P_{blok}}$$

Pošto su ovako dobijeni podaci podeljeni na klastere, potreban je efikasan način za njihovu klasifikaciju. Za ovo je korišćen KNN algoritam. Na prethodno fitovanim podacima u Euklidskoj metrici je izdračunata distanca između uzorka i svih fitovanih uzoraka i izabrani su k najbližih. Od tih k uzoraka klasifikator bira klasu koja se najčešće pojavljuje.

##### Rezultati

Na osnovu N i k parametara, izračunata je tačnost metode kao i confusion matrix. Vizuelni prikaz rezultata je dobijen u vidu Heat mape.

### Literatura

[1] [Very Deep Convolutional Networks for Large-scale Image Recognition](http://arxiv.org/abs/1409.1556)

[2] [Real-time Indian Sign Language (ISL) Recognition](https://arxiv.org/ftp/arxiv/papers/2108/2108.10970.pdf)

[3] [Automatic Hand Sign Recognition: Identify Unusuality through Latent Cognizance](https://arxiv.org/pdf/2110.15542.pdf)

[4] [Synthetic ASL Alphabet](kaggle.com/datasets/lexset/synthetic-asl-alphabet)
