---
title: Videookulografija
summary: Projekat iz videookulografije rađen na letnjem kampu za stare polaznike 2022. godine od Anje Kovačev i Lenke Milojčević.
---
**Autori** - Anja Kovačev i Lenka Milojčević


**Mentori** - Milomir Stefanović i Pavle Pađin


## **1. Apstrakt**


....


## **2. Uvod**
Život u današnjem društvu ima mnogo prednosti u svakom pogledu.
Tehnologija napreduje iz dana u dan. 
Taj brz razvoj zahteva velike potrebe koje ne mogu svi ljudi da ispune.
Na ideju za ovaj projekat smo došle uvidevši potrebe osoba sa invaliditetom da komuniciraju, igraju video igre, da koriste kompijuter ili da se kreću. 
Napretkom tehnologije, VOG (videookulografiju) je zamenila EOG (elektrookulografiju). Videookulografija je metoda u kojoj se pomoću kamere prate pokreti oka, tj. zenice. U ovom radu proučavan je 2D VOG sistem, što znači da se posmatraju dve ose – horizontalna osa na kojoj se detektuju pokreti na levo i desno, i vertikalna osa na kojoj je prate pogled na gore i dole.


2D VOG smatra se jednom od najpouzdanijih metoda, a ima široku primenu. 
Primenjuje se u oftalmologiji za proučavanje patoloških stanja kao što je nistagmus1 (nistagmus predstavlja ritmičke, nevoljne  trzaje očnih jabučica). 
VOG koriste kvadriplegičari i osobe sa oštećenjima motornih neurona kao sredstvo za komunikaciju ili kretanje (upravljanje tastaturom i invalidskim kolicima pokretima očiju). Takođe, u industriji se koristi za praćenje reakcija klijenata. 
Još se koristi za posmatranje reakcije vozača prilikom vožnje, u vojne svrhe i slično.


Postoje različiti radovi koji koriste različite metode. 
U većini slučajeva se nakon obrade slike detektuje centar zenice i dalje se radi test praćenja kretanja oka po utvrđenim putanjama. 
Metode detekcije centra zenice i ugla oka se ispostavljaju brzim. 
U nekim radovima se koristi mašinsko učenje gde istreniran model može da isprati i prepozna pokret oka.



## **3. Aparatura i metode**


#### **3.1 Aparatura**


Web kameru je koriščen za praćenje zenice sa koje je skinut IR filter (filter za ultraljubičasti spektar). 
Korišćen je 3D model držača koji ....
Kamera ja zakačena na naočare gde je postavljena i led dioda kako bi osvetljenje slike bilo konstantno.

![Slika hardvera](/images/2022/videookulografija/OPREMA1.jpg)(slika 1)


![Slika hardvera](/images/2022/videookulografija/OPREMA2.jpg)(slika 1) (slika 2)


#### **3.2. Metode**


##### **3.2.1. Obrada slike**


...


#### 3.2.1.1. Prebacivanje slike iz RGB u grayscale prostor boja


Kako bi zanemarili sve nepotrebne informacije i kako bi sve dužice blie u sivim nijansama potrebno  je sliku iz RGB(crvena-zelena-plava) prostora prebaciti u grayscale prostor boja.
Potrebno je konvertovati RGB vrednosti piksela slike koje zauzimaju 24 bita konvertovati u grayscale  prostor boja koji zauzima 8 bita  memorije korišćenjem funkcije grayscale.
Na slici 3 može se videti kako slika izgleda na početku i njen sivi ekvivalent.

 
 ![RGB u GRAYSCALE](/images/2022/videookulografija/RGBtoGRAY.jpg)(slika 3)


#### 3.2.1.2 Zamućivanje

// promeni !!!
Kako bi naša detekcija ivice funkcionisala, neophodno je da sliku zamutimo Gausovim filterom i na taj način smanjimo količinu detalja na datoj slici. Gausov filter je niskopropusni filter. 
Korišćenjem Gausove funkije za dve dimenzije dobijamo vrednosti iz kojih se gradi konvoluciona matrica koja se primenjuje na sliku . 
Nove vrednosti svakog piksela postavljaju se na srednje vrednosti susednih piksela. Vrenosti originalnog piksela dobija najveću Gausovu vrednost, susedni pikseli dobijaju manje vrednosti kako bi se njihova udaljenost od origanalnih piksela poveća. 
Na ovaj način se rezultira zamućenost kojom se čuvaju granice i ivce bolje nego drugim metodama.
 
![Slika pre i nakon korišćenja Gausovog filtera](/images/2022/videookulografija/GRAYTOBLUR.png)

#### 3.2.1.3. Binarizacija


Binarizacije kao priprema za segmentaciju ima zadatak da svaki piksel označi labelama 0 (crno) ili 1 (belo). 
Postiže se tako što se slika koja je prebačena u sivi spektar sada konvertuje u crno-belo. Ovo se radi procesom koji se naziva poređenje sa pragom. 
Pomoću ovoga svaki piksel pretvaramo u 0 ili 255 u zavisnosti od toga da li je njegova vrednost manja ili veća u odnosu na vrednost praga. 
Za vrednost praga uzimamo onu vrednost od koje je manje 17.5% piksela sa slike. 
Zatim, vrednosti piksela se dodeljuju na sledeći način – oni pikseli čija je vrednost manja ili jednaka od vrednosti prga, dobijaju vrednost 0, a oni čija je vrednost veća od praga dobijaju vrednost 255. 
Proizvod primene ovih metoda je crno-bela slika nad kojom se vrši segmentacija - izdvajanje jasnih objekata (u ovom slučaju zenice). 


![Slika pre i nakon nakon binarizacije](/images/2022/videookulografija/GRAYTOBIN.jpg)



#### 3.2.1.4. Detekcija ivica


Za detekciju ivica zenice korišćen je Keni(eng. *Canny*) algoritam.
Keni algoritam je jedan od najboljih metoda sa preciznu i pouzdanu detekciju ivica. 
Proces detekcije je sledeći[^2]:


1. Zamućivanje - Svaka slika na sebi ima neke šumove koje je potrebno odbaciti kako ne bi pogrešno bili detektovani kao ivice. U te svrhe se koristi prethodno opisan Gausov filter.


2. Pronalaženje gradijenta intenziteta - Cilj Keni algoritma je da nađe ivice gde je razlika između piksela u sivom prostoru boja najveća, a to se može postići pronalaženjem gradijenta slike. Korišćenjem Sobelovog operatora određuje se gradijent svakog piksela.


3. Potiskivanje lokalnih ne-maksimuma - U ovoj fazi se ,,zamućene'' ivice pretvaraju u ,,oštre'' tako što  se zadržavaju svi pikseli čiji je gradijent maksimalan u odnosu na gradijente osam piksela sa kojim se graniči, u suprotnom, vrednost piksela će biti eliminisana. Pikseli koji su maksimalni u svom ,,susedstvu'' se označavaju belim ivicama.


4. Histerzno poređenje sa pragom - Kako bi se postigao mali procenta lažnih i veći procenat pravih detekcija definišu se dva praga $T_H$ i $T_L$. Viši prag $T_H$ se postavlja tako da najveći deo piksela koji ne spadaju u ivice imaju manju magnitudu gradijrnta u odnosu na vrednost parag. Niži prag $T_L$ se postavlja tako da najveći deo piksela koji pripadaju ivice koje želimo da detektujemo imaju magnitudu gradijenta veću od vrednosti praga. Na ovaj način dobijamo mapu jakih i slabih (potencijalnih) ivica.


5. Detektovanja ivica - Prolaženjem kroz mapu slabih ivica, svi pikseli koji u svom susedstvu imaju barem jednu jaku ivicu proglašavaju se ivičnim pikselima. Ova iteracija se ponavlja sve dok broj ivica ne postane konstantan tokom cele iteracije.



![Slika pre Canny-ja](/images/2022/videookulografija/BIN.jpg)
![Slika posle Canny-ja](/images/2022/videookulografija/CANNY.jpg)


#### 3.2.1.5. Hafova transformacija za krug

Hafova transformacija kruga (HF)[3] [4] je algoritam koji se koristi za detekciju objekata u zavisnosti od zadatih parametara. 
U ovom radu HF se primenjuje kako bi se istakla tačna lokacija zenice, njenog prečnika i koordinata centra, tj. potreban je 3D Hafov prostor za detekciju kruga. 
Jedan nedostatak predstavlja to što je kompijutersko računanje ovim metodom zahtevno jer traži najveću vrednost koja definiše krug u prostoru. 
Zato, u slučaju da se pojavi više krugova na slici, radi se sledeće:


1. parametrom minimalnog rastojanja se zadaje rastojanje između centra krugova i tako se sužava broj onih koji se posmatraju


2. metod Hafov Gradijent koji koristi informacije o gradijentu ivica i ima veći prag nego oni u Keni metodi


3. zadavanje praga akumulatora za centre krugova u fazi detekcije - više lažnih krugova se otkrije ako je prag manji


4. zadavanje minimalnog i maksimalnog prečnika kruga koji dolazi u obzir.
Na ovaj način je sigurno detekovan jedan, najveći krug u zadatom opsegu, tj. detektovana je zenica oka. 

![Slika sa detektovanom zenicom](/images/2022/videookulografija/DETEKTOVANA.jpg)
#### **3.2.2. Obrada podataka**

#### 3.2.2.1. Mean average filter


Kada je zenicu detektovana potrebno je uraditi test gde se na ekranu pojavljuje devet tačaka u koje  se gleda određen broj sekundi. 
U toku eksperimenta dobijaju se koordinate zenice i tačke u koju trenutno gledamo, tako pravimo bazu podataka koje će nam biti potrebna za dalji rad.


Dobijeni podaci imaju šum (kao što je treptaj, nenamerno pomeranje oka ili kamere i slično) koji se otklanjaju mean avarage filterom (filter srednje aritmetičke vrednosti). 
Prolazići kroz bazu izračunava se aritmetička vrednost prethodnih n merenja koordinata zenice i te nove vrednosti se postavlja kao nove koordinate zenice. Na taj način se dobija filtrirano merenje.

Na slikama ispod se mogu videti grafovi filtriranih merenja, x i z ose u odnosu na vreme.


![Koordinate x-ose u odnosu na t](/images/2022/videookulografija/filtriranx.jpg)


![Koordinate y-ose u odnosu na t](/images/2022/videookulografija/filtrirany.jpg)



#### 3.2.2.2. Linearna regresija


Kako bi mogli da uz spomoć naše detekcije zenice kontrolišemo neki objekat na računaru potrebno je da znamo na osnovu koordinata našeg oka u koju tačku na ekranu gledamo. 
Za to smo koristili linearnu, tj. polinomialnu regresiju jer naš sistem nije linearan. 

Linearna regresija predstavlja modelovanje relacija između jedne ili više zavisnih promenljivih i jedne ili više nezavisnih promenljivih. 
Model linearne regresije ima oblik $Y = X * b $, gde je Y vektor izmerenih vrednosti(u našem slučaju koordinate našeg pogkleda na ekranu), X vektor inputne promenljive(u našem slučaju koordinate zenice oka) i b vektor koificijenta modela. 


#### 3.2.2.3. Polinomialna regresija
Poliomilna regresija je specijalan slučaj višestruke linearne regresije gde se modeluje veza između zavisne i nezavisne promenljive, u ovom slučaju, između stvarnog položaja zenice i položaja tačke na ekranu, kao polinom n-tog stepena. 
U našem slučaju, nema linearne korelacije između promenljivih (slika 1.1), pa se radi veće preciznosti promenjuje poliomilna regresija (slika 1.2).

slika 1 slika 2

Formula glasi: $y= b_0+b_1 \cdot x_1+ b_2 \cdot x_2+ b_2  \cdot x_2+...... b_n \cdot x_n$, gde su:
b - koificijenti regresije
n - stepen regresije (u našem slučaju $n = 3$)


## **4. Rezultati i istraživanja**
Model dobijen poliomilnom regresijom je proveren tako što je eksperiment snimiljen još jednom, ali ovog puta je dobijen predviđen položaja zenice.
Na kraju, kao rezultat je dobijena tabela u kojoj, u odnosu na tačku na ekranu (x, y), se može videti pomerenost estimacije i standard devijacije rasipanja (σx, σy).
Prosečan pomeraj 121.6, a prosečan 
(Napomena – ovo je tabela rezultata sa jednim snimanjem, dodatno prikupljanje podataka je u toku.) 


| X | Y | pomeraj | σx | σy |
|---|---|---------|----|----|
| 100 | 100 | 133.06 | 39.53 | 57.59 |
| 700 | 100 | 162.63 | 63.66 | 13.31 |
| 1300 | 100 | 143.28 | 1.07 | 2.18 |
| 100 | 400 | 171.49 | 41.3 | 98.29 |
| 700 | 100 | 110.9 | 51.82 | 26.37 |
| 1300 | 400 | 140.46 | 32.69 | 50.97 |
| 700 | 100 | 105.11 | 59.04 | 78.9 |
| 700 | 700 | 20.02 | 67.81 | 8.08 |
| 1300 | 700 | 107.48 | 34.37 | 52.48 |





## **5. Zaključak**


U budućnosti planiramo da kroz ovaj projekat omogućimo kontrolisanje kursora, tj. tastature, ili igranje video igara.
...


### 6. Reference
[^1]: Saravanan, Chandran. "Color image to grayscale image conversion." 2010 Second International Conference on Computer Engineering and Applications. Vol. 2. IEEE, 2010.


[^2]: Ahmed, Ahmed Shihab. "Comparative study among Sobel, Prewitt and Canny edge detection operators used in image processing." J. Theor. Appl. Inf. Technol 96.19 (2018): 6517-6525.


[3]Valentina, Christie, et al. "Iris localization using circular hough transform and horizontal projection folding." Proceedings of International Conference on Information Technology and Applied Mathematics. 2012.


[4]Ye, Huashan & Shang, Guocan & Wang, Lina & Zheng, Min. (2015). A new method based on hough transform for quick line and circle detection. 52-56. 10.1109/BMEI.2015.7401472.
