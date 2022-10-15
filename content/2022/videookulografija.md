---
title: Videookulografija
summary: Projekat iz videookulografije rađen na letnjem kampu za stare polaznike 2022. godine od Anje Kovačev i Lenke Milojčević.
---

## **Uvod**
Život u današnjem društvu ima mnogo prednosti u svakom pogledu. Tehnologija napreduje iz dana u dan. Taj brz razvoj zahteva velike potrebe koje ne mogu svi ljudi da ispune. Na ideju za ovaj projekat smo došle uvidevši potrebe osoba sa invaliditetom da komuniciraju, igraju video igre, da koriste kompijuter ili da se kreću. 
Napretkom tehnologije, VOG (videookulografiju) je zamenila EOG (elektrookulografiju) metodu. Videookulografija je metoda u kojoj se pomoću kamere prate pokreti oka, tj. zenice. U ovom radu proučavan je 2D VOG sistem, što znači da se posmatraju dve ose – horizontalna osa na kojoj se detektuju pokreti na levo i desno, i vertikalna osa na kojoj je prate pogled na gore i dole.


2D VOG smatra se jednom od najpouzdanijih metoda, a ima široku primenu. Primenjuje se u oftalmologiji za proučavanje patoloških stanja kao što je nistagmus1 (nistagmus predstavlja ritmičke, nevoljne  trzaje očnih jabučica). VOG koriste kvadriplegičari i osobe sa oštećenjima motornih neurona kao sredstvo za komunikaciju ili kretanje (upravljanje tastaturom i invalidskim kolicima pokretima očiju). Takođe, u industriji se koristi za praćenje reakcija klijenata. Još se koristi za posmatranje reakcije vozača prilikom vožnje, u vojnie svrhe i slično.


Postoje različiti radovi koji koriste različite metode. U većini slučajeva se nakon obrade slike detektuje centar zenice i dalje se radi test praćenja kretanja oka po utvrđenim putanjama. Metode detekcije centra zenice i ugla oka se ispostavljaju brzim. U nekim radovima se koristi mašinsko učenje gde istreniran model može da isprati i prepozna pokret oka.



## **Aparatura i metode**


#### **Aparatura**
Koristili smo web kameru za praćenje zenice sa koje je skinut IR filter (filter za vidljivi spektar). Kamera ja zakačena na naočare gde je postavljena i led dioda kako bi svetlost bila konstantna. U ispod prikazanoj slici može se videti kako naočare izgledaju.

slike


#### **Sivi spektar**
Kako bi lakše detektovali ivice naše zenice prvo je potrebno RGB(crvena-zelena-plava) sliku prebaciti u sivi spektar metodom greyscale. Kako bi konvertovali sliku potrebno je RGB vrednosti piksela koje zauzimaju 24 bita konvertovati u vrednosti sivog spektra(eng. *greyscale*) koji zauzima 8 bita  memorije. Korišćenjem sledećeg algoritma[^1] dobijamo željeni rezultat.


1. $Y = (0.299 x R) + (0.587 x G) + (0.114 x B)$
2. $U = (B - Y) x 0.565$
3. $V = (R - Y) x 0.713$
4. $UV = U + V$
5. $R1=R*0.299$  $R2=R*0.587$  $R3=R*0.114$
6. $G1=G*0.299$  $G2=G*0.587$  $G3=G*0.114$
7. $B1=B*0.299$  $B2=B*0.587$  $B3=B*0.114$
8. $R4=(R1+R2+R3)/3$
9. $G4=(G1+G2+G3)/3$
10. $B4=(B1+B2+B3)/3$
11. $I1=(R4+G4+B4+UV)/4$


U koracima od 1 do 3 izračunavamo osvetljenost i vrednosti hrominacije naše primarne slike u boji. RGB vrednosti su aproksimirane u koracima od 5 do 10 korišćenjem RGB komponenti. U 11. koraku izračunavanjem proseka vrednosti R4, G4, B4 i UV dobijamo vrednost I1 koja predstavlja našu sliku u sivom spektru. 

#### **Zamućivanje**
Kako bi naša detekcija ivice funkcionisala, neophodno je da sliku zamutimo Gausovim filterom i na taj način smanjimo količinu detalja na datoj slici. Gausov filter je zapravo niskopropusni filter  jer ima efekat smanjenja visokofrekventnih komponenti slike. Korišćenjem Gausove funkije za dve dimenzije dobijamo vrednosti iz kojih se gradi konvoluciona matrica koja se primenjuje na sliku sivog spektra. Nove vrednosti svakog piksela postavljaju se na srednje vrednosti susednih piksela. Vrenosti originalnog piksela dobija najveću Gausovu vrednost, susedni pikseli dobijaju manje vrednosti kako bi se njihova udaljenost od origanalnih piksela poveća. Na ovaj način se rezultira zamućenost kojom se čuvaju granice i ivce bolje nego drugim metodama.


#### **Binarizacija**
Binarizacija za cilj ima da izdvoji objekat iz slike, u ovom slučaju zenicu. Postiže se tako što sliku koju smo prebacili u sivu spektar sada konvertujemo u crno-belo. Prvo je potrebno naći trešhold vrednosti, odnosno vrednost praga, što radimo pomoću histograma. Kao trešhold uzimamo najveću vrednost kumulativne sume histograma. Sada dodeljujemo vrednosti pikselima na sledeći način – oni pikseli čija je vrednost manja ili jednaka od vrednosti trešholda, dobijaju vrednost 0 (postaju crni), a oni čija je vrednost veća od trešholda dobijaju vrednost 255 (postaju beli). Sada možemo da vidimo jasno izdvojenu zenicu (slika znice). 

#### **Detekcija ivica**
Kako bi detektovale ivice koristili smo funkciju Keni(eng. *Canny*). Detektor ivica Keni će piksel detektovati kao ivivcu ako je veličina gradijenta piksela veća nego veličina piksela sa obe njegove strane u pravcu promene maksimalnog inteziteta. Proces detekcije[^2] je sledeći:
1. Prvo je potrebno sliku zamutiti Gausovim filtrom kako bi se smanjili detalji na datoj slici.
2. Sledeći korak je da izračunamo veličinu i pravac(pravac maksimalne promene inteziteta piksela) gradijenta.
3. Kada je veličina gradijenta piksela veća od njemu dva susedna, piksel označavamo kao ivicu. U suprotnom, piksel označavamo kao pozadinu.
4. Uklanjanje slabih ivica pomoću praga histerza.

#### **Hafova transformacija za krug**
Hafova transformacija se može koristiti za određivanje parametara kruga kada je poznat broj tačaka koje padaju na perimetar. Krug čiji je radijus R i centar sa koordinatama (a, b) može se opisati sledećim jednačinama:
$x = a + R cos(θ), y = b + R sin(θ)$
Kada ugao θ prođe pun krug, tačke x i y, prate opseg kruga. Kada slika ima više krugova koji spadaju u opseg, traže se trojke parametara (R, a, b) koje će definisati krugove.


##### *Detekcija krugova*
Ako poznajemo radijus, tada pretragu sužavamo na dve dimenzije i cilj nam je da nađemo koordinate centra. Mesto tačaka (a, b) u opsegu pada na krug radijusa R i centra (x, y). Pravi krug ima zajednički centar za sve krugove u datom opsegu i nalazi se pomoću Hafovog akumulacionog niza. Kada je više krugova na slici, preklapanje prouzrokuje pronalaženje lažnih centara (slika 2.2). Ovaj problem se uklanja poređenjem sa originalnom slikom (slika 2.1). 


#### **Mean filter**
Kada smo detektovali našu zenicu potrebno je uraditi test gde nam se na ekranu pojavljuje devet tačaka u koje gledamo određen broj sekundi. U toku eksperimenta dobijamo koordinate zenice i tačke u koju trenutno gledamo i tako pravimo bazu podataka koje će nam biti potrebna za dalji rad.


Dobijeni podaci imaju šum, kao što je treptaj, koje otklanjamo mean filterom (filter srednje aritmetičke vrednosti). Prolazići kroz bazu izračunavamo aritmetičku vrednost prethodnih n koordinata i tu novu vrednost stavljamo kao novu koordinatu. Na taj način dobijamo bazu bez šuma.



#### **Linearna regresija**
Kako bi mogli da uz spomoć naše detekcije zenice kontrolišemo neki objekat na računaru potrebno je da znamo na osnovu koordinata našeg oka u koju tačku na ekranu gledamo. Za to smo koristili linearnu, tj. polinomialnu regresiju jer naš sistem nije linearan. 

Linearna regresija predstavlja modelovanje relacija između jedne ili više zavisnih promenljivih i jedne ili više nezavisnih promenljivih. Model linearne regresije ima oblik $Y = X x b $, gde je Y vektor izmerenih vrednosti(u našem slučaju koordinate našeg pogkleda na ekranu), X vektor inputne promenljive(u našem slučaju koordinate zenice oka) i b vektor koificijenta modela. 


#### **Polinomialna regresija**
Poliomilna regresija je specijalan slučaj višestruke linearne regresije gde se modeluje veza između zavisne i nezavisne promenljive, u ovom slučaju, između stvarnog položaja zenice i položaja tačke na ekranu, kao polinom n-tog stepena. U našem slučaju, nema linearne korelacije između promenljivih (slika 1.1), pa se radi veće preciznosti promenjuje poliomilna regresija (slika 1.2).

slika 1 slika 2

Formula glasi: $y= b0+b1x1+ b2x12+ b2x13+...... bnx1n$, gde su:
c - koificijenti regresije
n - stepen regresije (u ovo slučaju $n = 3$)


### **Rezultati i istraživanja**
Model dobijen poliomilnom regresijom smo proverile tako što smo test snimile još jednom, ali ovog puta smo dobile predviđanja položaja zenice.
Na kraju, kao rezultat smo dobile tabelu u kojoj, u odnosu na tačku na ekranu (x, y), vidimo koificijent sličnosti koordinata na ekranu i predviđenih koordinata (σx, σy). Takođe, izračunat je pomeraj između ovih dveju tačaka. (Napomena – ovo je tabela rezultata sa jednim snimanjem, dodatno prikupljanje podataka je u toku.) 


| X | Y | pomeraj | σx | σy |
|---|---|---------|----|----|
| 100 | 100 | 133,06 | 39,53 | 57,59 |
| 700 | 100 | 162,63 | 63,66 | 13,31 |
| 1300 | 100 | 143,28 | 1,07 | 2,18 |
| 100 | 400 | 171,49 | 41,3 | 98,29 |
| 700 | 100 | 110,9 | 51,82 | 26,37 |
| 1300 | 400 | 140,46 | 32,69 | 50,97 |
| 700 | 100 | 105,11 | 59,04 | 78,9 |
| 700 | 700 | 20,02 | 67,81 | 8,08 |
| 1300 | 700 | 107,48 | 34,37 | 52,48 |


U budućnosti planiramo da kroz ovaj projekat omogućimo kontrolisanje kursora, tj. tastature, ili igranje video igara.


### Reference
[^1]: Saravanan, Chandran. "Color image to grayscale image conversion." 2010 Second International Conference on Computer Engineering and Applications. Vol. 2. IEEE, 2010.
[^2]: Ding, Lijun, and Ardeshir Goshtasby. "On the Canny edge detector." Pattern recognition 34.3 (2001): 721-725.
https://www.cis.rit.edu/class/simg782/lectures/lecture_10/lec782_05_10.pdf
https://www.javatpoint.com/machine-learning-polynomial-regression
https://www.sciencedirect.com/science/article/pii/S1877705812046085
