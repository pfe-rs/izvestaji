---
title: Detekcija zenice korišćenjem videookulografije
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
Napretkom tehnologije, VOG (videookulografija) je zamenila EOG (elektrookulografiju). Videookulografija je metoda u kojoj se pomoću kamere prate pokreti oka, tj. zenice. 
U ovom radu proučavan je 2D VOG sistem, što znači da se posmatraju dve ose – horizontalna osa na kojoj se detektuju pokreti na levo i desno, i vertikalna osa na kojoj je prate pogled na gore i dole.


2D VOG smatra se jednom od najpouzdanijih modaliteta, a ima široku primenu. 
Primenjuje se u oftalmologiji za proučavanje patoloških stanja kao što je nistagmus1 (nistagmus predstavlja ritmičke, nevoljne  trzaje očnih jabučica). 
VOG koriste kvadriplegičari i osobe sa oštećenjima motornih neurona kao sredstvo za komunikaciju ili kretanje (upravljanje tastaturom i invalidskim kolicima pokretima očiju). Takođe, u industriji se koristi za praćenje reakcija klijenata. 
Još se koristi za posmatranje reakcije vozača prilikom vožnje, u vojnie svrhe i slično.


Postoje različiti radovi koji koriste različite metode. 
U većini slučajeva se nakon obrade slike detektuje centar zenice i dalje se radi test praćenja kretanja oka po utvrđenim putanjama. 
Metode detekcije centra zenice i ugla oka se ispostavljaju brzim. 
U nekim radovima se koristi mašinsko učenje gde istreniran model može da isprati i prepozna pokret oka.
Dosadašnji sistemi su izgledali tako što se pri akviziciji snimalo celo lice preko veb kamere, nakon čega bi se posmatrali manji regioni. 
Neki radovi koriste *ovde ćemo dodati tekst kada pročitamo novi rad*... 
Ovaj rad koristi stalak pomoću kog se glava stabilizuje, tj. pozicionira uvek na isto mesto radi što tačnijeg očitavanja podataka. 
Kada se utvrdi položaj glave, ideja je da se pomoću naočara sa kojih je skinut IR filter detektuje zenica čije se koordinate prate u svakom trenutku vremena. 
Cilj je da se pokretima očiju pomera kursor i slično.


## **3. Aparatura i metode**


#### **3.1 Aparatura**

Na slici 1 i 2 može se videti korišćenja aparatur sastavljena iz web kamera, 3D modela držača za istu i 3D odšampanih naočara.
Web kamera je korišćena za praćenje zenice sa koje je skinut IR filter (filter za ultraljubičasti spektar) kako bi detektovanje zence bilo olakšano za sve boje dužica. 
3D model držača je sastavljen od:


1. Držača koji je pričvršćen za naučare.

2. Šarake na kojoj je prčvršćena kamera uz pomoć koje se kamera može približiti ili udaljiti u odnosu na potrebe korisnika.

3. Klizač za podešavanje visine kamere uz pomoće koga se kamera može pomerati po y osi i na taj način dodatno se prilagoditi korisniku.

Kamera ja zakačena na naočare gde je postavljena i led dioda kako bi osvetljenje slike bilo konstantno.

![Slika hardvera](/images/2022/videookulografija/OPREMA1.jpg)(slika 1)


![Slika hardvera](/images/2022/videookulografija/OPREMA2.jpg)(slika 2)


#### **3.2. Metode**


##### **3.2.1. Obrada slike**


Kako bi zenica bila detektovana neophodno je da dobiti podatke gde se ona nalazi. 
Ti podaci se dobijaju iz live snimka našeg oka snimanog sa web kamerom.
Obrađivanjem slike, tačnije svakog frejma live snimka, dobijaju se podaci o koordinatama centra zenice.
Proces obrade slike se sastoji iz sledećih koraka:

1. Prebacivanje slike iz RGB u grayscale prostor boja
2. Zamućivanje slike
3. Binarizacija slike
4. Detekcija ivica na slici
5. Detekcija krugova, odnosno zenice na slici


#### 3.2.1.1. Prebacivanje slike iz RGB u grayscale prostor boja


Kako bi sve nepotrebne informacije bile zanemarene i kako bi sve dužice blie u sivim nijansama potrebno  je sliku iz RGB(crvena-zelena-plava) prostora prebaciti u grayscale prostor boja.
Konvertovanjem RGB vrednosti piksela slike koje zauzimaju 24 bita u grayscale  prostor boja koji zauzima 8 bita memorije korišćenjem funkcije grayscale dobija se slika u monohromatkskom sistemu boja.
Na slici 3 može se videti kako slika izgleda u RGB prostoru i njen sivi ekvivalent.

 
![RGB u GRAYSCALE](/images/2022/videookulografija/RGBtoGRAY.jpg)(slika 3)


#### 3.2.1.2. Zamućivanje


Kako bi detekcija ivice funkcionisala, neophodno je da se slika zamuti Gausovim filterom i na taj način smanji količina detalja na datoj slici.
Gausov filter je niskopropusni filter. 
Množenjem svakog piksela slike sa Gausovim kernelom dobija se slika sa šumom.
Kernel je neophodno da ima pozitivne i neparne dimenzije.
Na slici 4 se može videti primer 3D Gausov kernel, a na slici 5 se mogu videti primeri Gausovog kernela. 
Sa ovakvim i sličnim kernelima se množi svaki piksel na slici i na taj nečin se dobija zamućena slika.
Na slici 6 se može videti slika pre i posle zamućivanja.

![3D Gausov kernel](/images/2022/videookulografija/3DGkernel.png)(slika 4)


![Primeri Gausovog kernela](/images/2022/videookulografija/Gkernel.png)(slika 5)


![Slika pre i nakon korišćenja Gausovog filtera](/images/2022/videookulografija/GRAYTOBLUR.png)(slika 6)

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


1. Zamućivanje - Svaka slika na sebi ima neke šumove koje je potrebno odbaciti kako ne bi pogrešno bili detektovani kao ivice. 
U te svrhe se koristi prethodno opisan Gausov filter.


2. Pronalaženje gradijenta intenziteta - Cilj Keni algoritma je da nađe ivice gde je razlika između piksela u sivom prostoru boja najveća, a to se može postići pronalaženjem gradijenta slike. 
Korišćenjem Sobelovog operatora određuje se gradijent svakog piksela.


3. Potiskivanje lokalnih ne-maksimuma - U ovoj fazi se ,,zamućene'' ivice pretvaraju u ,,oštre'' tako što  se zadržavaju svi pikseli čiji je gradijent maksimalan u odnosu na gradijente osam piksela sa kojim se graniči, u suprotnom, vrednost piksela će biti eliminisana. 
Pikseli koji su maksimalni u svom ,,susedstvu'' se označavaju belim ivicama.


4. Histerzno poređenje sa pragom - Kako bi se postigao mali procenta lažnih i veći procenat pravih detekcija definišu se dva praga $T_H$ i $T_L$. 
Viši prag $T_H$ se postavlja tako da najveći deo piksela koji ne spadaju u ivice imaju manju magnitudu gradijrnta u odnosu na vrednost parag. 
Niži prag $T_L$ se postavlja tako da najveći deo piksela koji pripadaju ivice koje želimo da detektujemo imaju magnitudu gradijenta veću od vrednosti praga. 
Na ovaj način se dobija mapa jakih i slabih (potencijalnih) ivica.


5. Detektovanja ivica - Prolaženjem kroz mapu slabih ivica, svi pikseli koji u svom susedstvu imaju barem jednu jaku ivicu proglašavaju se ivičnim pikselima. 
Ova iteracija se ponavlja sve dok broj ivica ne postane konstantan tokom cele iteracije.


Na slici 7 se može videti binarizovani frejm sa live snimka odnosno frejm kakav se obrađuje u Keni algoritamu, a na slici 8 frejm live snimka nakon detekcije ivica.


![Slika pre Canny-ja](/images/2022/videookulografija/BIN.jpg)(slika 7)


![Slika posle Canny-ja](/images/2022/videookulografija/CANNY.jpg)(slika 8)


#### 3.2.1.5. Hafova transformacija za krug

Hafova transformacija kruga (HF)[3] [4] je algoritam koji se koristi za detekciju objekata u zavisnosti od zadatih parametara. 
U ovom radu HF se primenjuje kako bi se istakla tačna lokacija zenice, njenog prečnika i koordinata centra, tj. potreban je 3D Hafov prostor za detekciju kruga. 
Jedan nedostatak predstavlja to što je kompjutersko računanje ovim metodom zahtevno jer traži najveću vrednost koja definiše krug u prostoru. 
Zato, u slučaju da se pojavi više krugova na slici, radi se sledeće:


1. parametrom minimalnog rastojanja se zadaje rastojanje između centra krugova i tako se sužava broj onih koji se posmatraju


2. metod Hafov Gradijent koji koristi informacije o gradijentu ivica i ima veći prag nego oni u Keni metodi


3. zadavanje praga akumulatora za centre krugova u fazi detekcije - više lažnih krugova se otkrije ako je prag manji


4. zadavanje minimalnog i maksimalnog prečnika kruga koji dolazi u obzir.


Na ovaj način je sigurno detekovan jedan, najveći krug u zadatom opsegu, tj. dobijeni su podaci o koordinatama centra kruga i njegovog radijusa što pretstavlja detektovanu zenicu oka.
Na slici 9 je prikazana detektovana zenica oka na ulaznom frejmu sa live snimka.


![Slika sa detektovanom zenicom](/images/2022/videookulografija/DETEKTOVANA.jpg)(slika 9)


#### **3.2.2. Obrada podataka**

#### 3.2.2.1. Mean average filter


Kada je zenicu detektovana potrebno je uraditi test gde se na ekranu pojavljuje devet tačaka u koje se gleda određen broj sekundi.
U toku eksperimenta dobijaju se koordinate zenice i tačke u koju trenutno gledamo, tako pravimo bazu podataka koje će nam biti potrebna za dalji rad.


Ekran koji se gleda tokom eksperimenta izgleda kao na slici. 
U toku eksperimenta crvena tačka se pomera nakon nekog vremena, tj. plave tačke postaju crvene kada je potrebno da gledamo u njih.


![Ekran tokom eksperimenta](/images/2022/videookulografija/eksperiment.jpg)(silak 10)


Dobijeni podaci imaju šum (kao što je treptaj, nenamerno pomeranje oka ili kamere, promena jačine osvetljenja i slično) koji se otklanjaju mean avarage filterom (filter srednje aritmetičke vrednosti). 
Prolazići kroz bazu izračunava se aritmetička vrednost prethodnih n merenja koordinata zenice i te nove vrednosti se postavlja kao nove koordinate zenice. 
Na taj način se dobija filtrirano merenje.

Na slikama ispod se mogu videti grafovi filtriranih merenja, x i z ose u odnosu na vreme.


![Koordinate x-ose u odnosu na t](/images/2022/videookulografija/filtriranx.jpg)(slika 11)


![Koordinate y-ose u odnosu na t](/images/2022/videookulografija/filtrirany.jpg)(slika 12)

### **3.2.3. Kalibracija**

#### 3.2.3.1. Linearna regresija


//dodati zasto sistem nije linearan

Kako bi se uz pomoć detekcije zenice kontrolisao neki objekat na računaru potrebno je znati na osnovu koordinata centra zenice u koju tačku na ekranu je oko upereno. 
Za to je korišćena linearna regresija, tj. polinomialna regresija jer sistem nije linearan. 

Linearna regresija predstavlja modelovanje relacija između jedne ili više zavisnih promenljivih i jedne ili više nezavisnih promenljivih. 
Model linearne regresije ima oblik $Y = X * b $, gde je Y vektor izmerenih vrednosti(u našem slučaju koordinate našeg pogkleda na ekranu) odnosno zavisna promenljiva, X vektor inputne promenljive(u našem slučaju koordinate zenice oka) odnosno nezavisna promenljiva  i b vektor koificijenta modela. 
Vektor koificijenta modela b  


#### 3.2.3.2. Polinomialna regresija
Poliomilna regresija je specijalan slučaj višestruke linearne regresije gde se modeluje veza između zavisne i nezavisne promenljive, u ovom slučaju, između stvarnog položaja zenice i položaja tačke na ekranu, kao polinom n-tog stepena. 
U našem slučaju, nema linearne korelacije između promenljivih (slika 1.1), pa se radi veće preciznosti promenjuje poliomilna regresija (slika 1.2).

slika 1 slika 2

Formula glasi: $y= b_0+b_1 \cdot x_1+ b_2 \cdot x_2+ b_2  \cdot x_2+...... b_n \cdot x_n$, gde su:
b - koificijenti regresije
n - stepen regresije (u našem slučaju $n = 3$)


## **4. Rezultati i istraživanja**


Model dobijen poliomilnom regresijom je proveren tako što je eksperiment snimiljen još jednom, ali ovog puta je dobijen predviđen položaja zenice.
Na kraju, kao rezultat je dobijena tabela u kojoj, u odnosu na tačku na ekranu (x, y), se može videti pomerenost estimacije i standardna devijacija rasipanja (σx, σy).
Rezultati sa jednim snimanjem imaja prosečan pomeraj 121.6 piksela i prosečne standardne devijacije raspipanja su σx = 43.48 i σy = 43.13. 
Sa ovakvim rezultatima je veoma teško kontrolisati kursor ili igrati igricu. 
Sa više snimanja i u drugačijim uslovima, kao npr. snimanje očiju svetlijih nijansi ili korišćenjem filtera za IR spektar greška bi se smanjivala i tako povećala mogućnost kontrolisanja kursora ili igranja igrica.
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
