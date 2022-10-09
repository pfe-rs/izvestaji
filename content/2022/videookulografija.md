---
title: Videookulografija
summary: Projekat iz videookulografije rađen na letnjem kampu za stare polaznike 2022. godine od Anje Kovačev i Lenke Milojčević.
---
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


#### **Detekcija ivica**
Kako bi detektovale ivice koristili smo funkciju Keni(eng. *Canny*). Detektor ivica Keni će piksel detektovati kao ivivcu ako je veličina gradijenta piksela veća nego veličina piksela sa obe njegove strane u pravcu promene maksimalnog inteziteta. Proces detekcije[^2] je sledeći:
1. Prvo je potrebno sliku zamutiti Gausovim filtrom kako bi se smanjili detalji na datoj slici.
2. Sledeći korak je da izračunamo veličinu i pravac(pravac maksimalne promene inteziteta piksela) gradijenta.
3. Kada je veličina gradijenta piksela veća od njemu dva susedna, piksel označavamo kao ivicu. U suprotnom, piksel označavamo kao pozadinu.
4. Uklanjanje slabih ivica pomoću praga histerza.


#### **Linearna regresija**
Kako bi mogli da uz spomoć naše detekcije zenice kontrolišemo neki objekat na računaru potrebno je da znamo na osnovu koordinata našeg oka u koju tačku na ekranu gledamo. Za to smo koristili linearnu, tj. polinomialnu regresiju jer naš sistem nije linearan. 

Linearna regresija predstavlja modelovanje relacija između jedne ili više zavisnih promenljivih i jedne ili više nezavisnih promenljivih. Model linearne regresije ima oblik $Y = X x b $, gde je Y vektor izmerenih vrednosti(u našem slučaju koordinate našeg pogkleda na ekranu), X vektor inputne promenljive(u našem slučaju koordinate zenice oka) i b vektor koificijenta modela. 






### Reference
[^1]: Saravanan, Chandran. "Color image to grayscale image conversion." 2010 Second International Conference on Computer Engineering and Applications. Vol. 2. IEEE, 2010.
[^2]: Ding, Lijun, and Ardeshir Goshtasby. "On the Canny edge detector." Pattern recognition 34.3 (2001): 721-725.