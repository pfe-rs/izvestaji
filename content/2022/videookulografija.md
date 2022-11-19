---
title: Primena i implementacija algoritma za detekciju zenica baziranog na obradi slike
summary: Projekat iz videookulografije rađen na letnjem kampu za stare polaznike 2022. godine od Anje Kovačev i Lenke Milojčević.
---
**Autori** 


Anja Kovačev, učenica IV razreda Tehničke škole u Kikindi


Lenka Milojčević, učenica III razreda Gimnazije u Kraljevu


**Mentori** 


Milomir Stefanović, diplomirani inženjer elektrotehnke i računarstva, PFE


Pavle Pađin, student Elektrotehničkog fakulteta u Beogradu



## **1. Apstrakt**


Tehnologija napreduje iz dana u dan, ali ipak osobe sa invaliditetom često nemaju mogućnost da komuniciraju, igraju video igre, da koriste kompjutere ili da se kreću. 
Iz tih razloga odlučeno je da se ovaj rad bavi sistemom detekcije pokreta zenice koji bi dalje mogao da im pomogne u tim zadacima.
Videookulografija je u današnje vreme najkorišćenija metoda za praćenje pokreta oka.
U ovom radu, obradom slike ondnosno frejma videa u realnom vremenu, kao krajni rezultat se dobija detektovana zenica.
Izvođenjem eksperimenta gde su u određenom vremenskom intervalu bilo posmatrano devet tačaka na ekranu, dobijene su koordinate centra zenice i tačke ekrana posmatrane u datom intervalnu.
Korišćenjem polinomialnom regresijom izračunat je odnos između dobijenih koordinata.
Na osnovu dobijenog odnosa između ovih koordinata pokušano je da se predvidi tačka posmatrana na ekranu što bi dalje bilo korišćeno za implementaciju kontrole kursora na ekranu.
Sa samo 15 izvedenih snimanja, dobijena predviđanja nisu dovoljno precizna za implementaciju kontrolisanja kursora.
Pretpostavlja se da sa više snimanja preciznost će postati veća i samim time ova detekcija će se moći implementirati za kontrolisanje kursora na ekranu.


Ključne reči: obrada slike, videookulografija, algoritam za detekciju zenice, polinomijalna regresija


Technology advances day by day, but still people with disabilities often do not have the ability to communicate, play video games, use computers or move around.
For these reasons, it was decided that this paper deals with a pupil movement detection system that could further help them in those tasks.
Video oculography is currently the most used method for monitoring eye movements.
In this work, by processing the image that is the video frame in live video, the detected pupil is obtained as the final result.
By performing an experiment where nine points on the screen were observed in a certain time interval, the coordinates of the center of the pupil and the points of the screen observed in the given interval were obtained.
Using polynomial regression, the relationship between the obtained coordinates was calculated.
Based on the obtained relationship between these coordinates, an attempt was made to predict the point observed on the screen, which would then be used to implement cursor control on the screen.
With only 15 recordings performed, the obtained predictions are not accurate enough to implement cursor control.
It is assumed that with more recordings, the accuracy will become higher and therefore this detection will be able to be implemented to control the cursor on the screen.


Keywords: image processing, video oculography, pupil detection algorithm, polynomial regression


## **2. Uvod**


Život u današnjem društvu ima mnogo prednosti u svakom pogledu. 
Tehnologija napreduje iz dana u dan. 
Taj brz razvoj zahteva velike potrebe koje ne mogu svi ljudi da ispune. 
Uvidevši potrebe osoba sa invaliditetom da komuniciraju, igraju video igre, da koriste kompjuter ili da se kreću odlučeno je da se u ovaj rad bavi sistemom koji bi mogao da im pomogne u tim zadacima. 
Napretkom tehnologije, VOG (videookulografija) je zamenila EOG (elektrookulografiju). Videookulografija je metoda u kojoj se pomoću kamere prate pokreti oka, tj. zenice. 
U ovom radu proučavan je 2D VOG sistem, tj. pokreti zenice na dve ose – horizontalna osa na kojoj se detektuju pokreti na levo i desno, i vertikalna osa na kojoj je prate pogled na gore i dole.


2D VOG smatra se jednom od najpouzdanijih modaliteta, a ima široku primenu. 
Primenjuje se u oftalmologiji za proučavanje patoloških stanja kao što je nistagmus1 (nistagmus predstavlja ritmičke, nevoljne  trzaje očnih jabučica). 
VOG koriste kvadriplegičari i osobe sa oštećenjima motornih neurona kao sredstvo za komunikaciju ili kretanje (upravljanje tastaturom i invalidskim kolicima pokretima očiju). Takođe, u industriji se koristi za praćenje reakcija klijenata. 
Još se koristi za posmatranje reakcije vozača prilikom vožnje, u vojnie svrhe i slično.
Cilj ovog rada je konstruisati jednostavni 2D VOG koji se može koristiti za praćenje zenice.


Navedeni referentni radovi koriste metodu tamne zenice, što znači da je zenica najtamniji objekat na slici. 
U referentnom radu [5] za akviziciju slike korišćena je IR kamera čije su LED diode (za vidljivi spektar boja) zamenili IR LED diodama kako bi sve dužice, nezavisno od njihove boje, bile svetle. 
Algoritam referenthih radova (uz manje izmene) sastoji se iz akvizicije slike, kalibracije sistema, detekcije zenice, mapiranja slike oka u odnosu na postavku na ekranu, selekciju objekata i stabilizaciju kursora (odnosi se na radove koji za cilj imaju kontrolu kursora). 
Kako bi procedura binarizacije bila uspešna, potrebna je funkcija mapiranja koja mapira sliku oka i sliku ekrana. 
Proizvod ove funkcije su centar zenice oka i koeficienti mapiranja potrebni za ranije navedenu binarizaciju. 
Mapiranje se postiže posmatranjem slike oka u ondosu na sliku ekrana izdeljenu na 9 delova. 
Zbog nelinearnosti sistema, za mapiranje koristi se  bikvadratna funkcija koja kompezuje pomenutu nelinearnost. 
Referentni rad navodi da, za veću tačnost sistema, potrebno je uvesti stopu mapiranja između slike oka i ekrana. 
Ta stopa mapiranja dalje daje indikator koji karakteriše preciznost sistema. 
Indikator se dobija procenjivanjem stope mapiranja tokom kalibracije. 
Nelinearnost sistema zahteva da se stopa mapiranja mora računati posebno za svih 9 delova ekrana. 
U sledećem koraku se računa srednja vrednost za stopu mapiranja kako bi ista mogla da bude procenjena zbog računanja indikatora. 
Potom, traže se prečnik i centar kruga. 
Više radova se zasniva na binarizaciji slike implementirane korišćenjem različitih metoda za određivanje paraga. 
Neke od njih su - globalni ili lokalni adaptivni prag. 
Od 6 korišćenih PDA algoritama, većina koristi novu metodu za binarizaciju slike, implementiranu na adaptivnoj kvantitativnoj segmentaciji. 
U referentnim radovima postoje primeri uklanjanja šumova tehnikom bazirane na maksimalno određenom prostoru u praćenju rekonstrukcije zenice. 
Svi radovi uključuju Hafovu transformaciju kruga i morfološke operacije (erozija i dilatacija). 
Rad [5] za detekciju ivica kruga koristi derivat drugog reda rezultujuće slike, što je postignuto Laplacom od Gausovog filtera. 
Sledeći korak je određivanje centra zenice algoritnom centroidne metode čime je uspešno detektovana zenica.



## **3. Aparatura i metode**



Ovaj rad se sastoji iz dva dela - aparture pomoću koje se vrši akvizicija slike i metoda kojima je postignuta obrada slike i kalibracija.



#### **3.1 Aparatura**



Na slici 1 i 2 može se videti korišćena aparatura sastavljena iz web kamera, držača za web kameru i naočara koji su 3D odštampane.
Web kamera je korišćena za praćenje zenice sa koje je skinut IR filter kako bi detektovanje zence bilo olakšano za sve boje dužica. 
3D model držača ima dve značajne opcije za podešavanje:

1. Pomeranjem šarke na koju je pričvršćena web kamera, može se približiti ili udaljiti od oka u odnosu na potrebe korisnika


2. Web kamera se može pomerati po y osi uz pomoć klizača za podešavanje visine web kamere


Web kamera ja pričvršćena na naočare gde su postavljene i led diode kako bi osvetljenje slike bilo konstantno.

![Slika hardvera](/images/2022/videookulografija/OPREMA1.jpg)                    ![Slika hardvera](/images/2022/videookulografija/OPREMA2.jpg)


(slika 1 - Izgled naučara)               (slika 2 - Izgled naočara)       



#### **3.2. Metode**


Metode se sastoje iz dve faze:
1. Obrada slike, ondnosno frejmova snimka u realnom vremenu;
2. Obrade podataka, odnosno filtriranje podataka i kalibracija.


##### **3.2.1. Obrada slike**


Kako bi zenica bila detektovana neophodno je pronaći koordinate centra zenice. 
Obrađivanjem slike, tačnije svakog frejma snimka u realnom vremenu, dobijaju se podaci o koordinatama centra zenice.
Proces obrade slike se sastoji iz sledećih koraka:

1. Prebacivanje slike iz RGB u grayscale prostor boja
2. Zamućivanje slike
3. Binarizacija slike
4. Morfološke operacije
5. Detekcija ivica pomoću Keni algoritma
6. Detekcija krugova, odnosno zenice na slici pomoću Hafove transformacije


#### 3.2.1.1. Prebacivanje slike iz RGB u grayscale prostor boja

Slika u RGB spektru ima isuviše informacija koje nam nisu potrebne, dok slike u grayscale prostoru sadrže sve informacije koje su nam potrebne.
Takođe obrada nad slikama u grayscale prostoru je mnogo brža i jednostavnija.
Iz ovih razloga sliku prebacujemo iz RGB(crvena-zelena-plava) prostora u grayscale prostor boja.
Konvertovanjem RGB vrednosti piksela slike koje zauzimaju 24 bita u grayscale  prostor boja koji zauzima 8 bita memorije korišćenjem funkcije grayscale dobija se slika u monohromatkskom sistemu boja.
Na slici 3 može se videti kako slika izgleda u RGB prostoru i njen sivi ekvivalent.

 
![RGB u GRAYSCALE](/images/2022/videookulografija/RGBtoGRAY.jpg)


(slika 3 - RGB slika i njen sivi ekvivalent)


#### 3.2.1.2. Zamućivanje


Kako bi binrizacija slike bila delotvornija, neophodno je da se slika zamuti Gausovim filterom i na taj način smanji količina detalja na datoj slici.
Gausov filter je niskopropusni filter. 
Konvolucijom svakog piksela slike sa Gausovim kernelom dobija se slika sa šumom.
Kernel je neophodno da ima pozitivne i neparne dimenzije.
Na slici 4 može se videti primer Gausove raspodele na osnovu čega se formiraju kerneli prikazani na slici 5. 

![3D Gausov kernel](/images/2022/videookulografija/3DGkernel.png)           ![Primeri Gausovog kernela](/images/2022/videookulografija/Gkernel.png)


(slika 4 - primer Gausove raspodele)                      (slika 5 - Primer Gausovog kernela)



Sa ovakvim i sličnim kernelima se vrši konvolucija.
Krećući od prvog piksela koji se množi sa centralnim pikselom kernela, ostali pikseli kernela se množe sa odgovarajućim preklopljenim pikselima slike. 
Svi ovi proizvodi se sabiraju i tako dobijamo novu vrednost piksela.
Nakon dobijanja nove vrednosti piksela, kernel se pomera za jedan piksel udesno i na taj način se proces ponavlja sve do poslednjeg piksela slike.
Ovim procesom dobijamo zamućenu sliku.
Na slici 6 se može videti slika pre i posle zamućivanja.



![Slika pre i nakon korišćenja Gausovog filtera - slika 6](/images/2022/videookulografija/GRAYTOBLUR.jpg)(slika 6)



#### 3.2.1.3. Binarizacija


Binarizacije kao priprema za segmentaciju ima zadatak da svaki piksel označi labelama 0 (crno) ili 1 (belo). 
Postiže se tako što se vrši proces poređenja sa pragom što za proizvod ima prebacivanje slike iz sivog spektra boja u binarni domen. 
Pomoću ovoga svaki piksel pretvaramo u 0 ili 255 u zavisnosti od toga da li je njegova vrednost manja ili veća u odnosu na vrednost praga. 
Kako bi se prag adaptirao svakoj slici, za vrednost praga se uzima vrednost od koje 17.5% piksela sa slike ima manju vrednost. 
Zatim, vrednosti piksela se dodeljuju na sledeći način – oni pikseli čija je vrednost manja ili jednaka od vrednosti prga, dobijaju vrednost 0, a oni čija je vrednost veća od praga dobijaju vrednost 255. 
Proizvod primene ovih metoda je crno-bela slika nad kojom se vrši segmentacija - izdvajanje jasnih objekata (u ovom slučaju zenice). 


![Slika pre i nakon nakon binarizacije - slika 7](/images/2022/videookulografija/GRAYTOBIN.jpg)


#### 3.2.1.4. Morfološke operacije


Kako bi bile otklonjene ,,rupe" i suvišni objekti na slici koji nisu bitni za dalju obradu slike koriste se morfološke operacije, erozija i dilatacija.

##### 3.2.1.4.1. Erozija


Erozija predstavlja postupak ,,uklanjanja" suvišnih objekata.
Ona funkcioniše jednostavnim principom prolaska maske kroz sliku.
Maska predstavlja kvadratnu matricu sa neparnim brojem dimenzije koja je ispunjena jedinicama.
Polazeći od prvog piksela slike, koji se poklapa sa centrom maske, proverava se da li se   maska poklapa sa svim njoj odgovarajućim pikselima slike.
Ukoliko se dogodi da postoji barem jedno nepodudaranje, piksel slike koji se poklapa sa centrom maske dobiće vrednost 0, tj. postaće crni piksel.
Nakon završetka ovog procesa, maska se pomera za jedan piksel udesno i tako se nastavlja postupak sve do kraja slike.


![Primer erozije - slika 8](/images/2022/videookulografija/erozija.png)


(slika 8 - Primer erozije)


##### 3.2.1.4.2. Dilatacija


Dilatacija predstavlja postupak raširenja objekta sa ciljem izvršavanja proširenja njegovih ivica.
Korišćenjem već konstruisane maske prolazi se kroz sliku, polazeći od prvog piksela slike, koji se poklapa sa centrom maske, proverava se da li postoji poklapanja između maske i njoj odgovarajućih piksela slike.
Ukoliko se dogodi da postoji barem jedno poklapanje, piksel slike koji se poklapa sa centrom maske dobiće vrednost 1, tj. postaće beo piksel.
Nakon završetka ovog procesa, maska se pomera za jedan piksel udesno i tako se nastavlja postupak sve do kraja slike.


![Primer dilatacije - slika 9](/images/2022/videookulografija/dilatacija.png)


(slika 9 - Primer dilatacija)



#### 3.2.1.5. Detekcija ivica


Za detekciju ivica zenice korišćen je Keni(eng. *Canny*) algoritam.
Keni algoritam je jedan od najboljih metoda sa preciznu i pouzdanu detekciju ivica. 
Proces detekcije je sledeći[^2]:


1. Zamućivanje - Svaka slika na sebi ima neke šumove koje je potrebno odbaciti kako ne bi pogrešno bili detektovani kao ivice. 
U te svrhe se koristi prethodno opisan Gausov filter.


2. Pronalaženje gradijenta intenziteta - Cilj Keni algoritma je da nađe ivice gde je razlika između piksela u sivom prostoru boja najveća, a to se može postići pronalaženjem gradijenta slike. 
Korišćenjem Sobelovog operatora određuje se gradijent svakog piksela.


3. Potiskivanje lokalnih ne-maksimuma - U ovoj fazi se ,,zamućene'' ivice pretvaraju u ivice ,,od interesa'' tako što  se zadržavaju svi pikseli čiji je gradijent maksimalan u odnosu na gradijente osam piksela sa kojim se graniči, u suprotnom, vrednost piksela će biti eliminisana. 
Pikseli koji su maksimalni u svom ,,susedstvu'' se označavaju belim ivicama.


4. Poređenje sa pragom - Kako bi se postigao mali procenta lažnih i veći procenat pravih detekcija definišu se dva praga $T_H$ i $T_L$. 
Viši prag $T_H$ se postavlja tako da najveći deo piksela koji ne spadaju u ivice imaju manju magnitudu gradijenta u odnosu na vrednost parag, tj. sve ivice veće od $T_H$ su jake ivice.
Niži prag $T_L$ se postavlja tako da najveći deo piksela koji pripadaju ivice koje želimo da detektujemo imaju magnitudu gradijenta veću od vrednosti praga, tj. sve ivice manje od $T_L$ je potrebno eliminisati.
Na kraju je potrebno da ostanu sve ivice čije su vrednosti između $T_L$ i $T_H$.
Na ovaj način se dobija mapa jakih i slabih (potencijalnih) ivica.


5. Detektovanja ivica - Prolaženjem kroz mapu slabih ivica, svi pikseli koji u svom susedstvu imaju barem jednu jaku ivicu proglašavaju se ivičnim pikselima. 
Ova iteracija se ponavlja sve dok broj ivica ne postane konstantan tokom cele iteracije.


Na slici 10 se može videti binarizovani frejm sa snimka u realnom vremenu odnosno frejm kakav se obrađuje u Keni algoritamu, a na slici 11 frejm snimka u realnom vremenu nakon detekcije ivica.


![Slika pre Canny-ja - slika 10](/images/2022/videookulografija/BIN.jpg)(slika 10)


![Slika posle Canny-ja - slika 11](/images/2022/videookulografija/CANNY.jpg)(slika 11)


#### 3.2.1.6. Hafova transformacija za krug


Hafova transformacija za krug (CHT) je metoda za detekciju krugova na slici. U ovom radu CHT se koristi kako bi se istakla zenica kao najjasniji detektovani krug. 

Hafova transformacija za krug identična je transformaciji za liniju (LHT). LHT se zasniva na sledećem:
Formula za pravu $y_1 = a \cdot x_1 + b$, gde su:
- $y_1$ - zavisna promenljiva
- $x_1$ - nezavisna promenljiva
- a, b - parametri


se posmatra na drugačiji način. Parametri a, b postaju nezavisna i zavisna promenljiva, dok $y_1, x_1$ postaju parametri, čime se dobija formula: 

$b = -x_1 \cdot a + y_1$.


Ovim postupkom vidi se ideja Hafove transformacije, a to je da svaka tačka u dekartovom koordinantnom sistemu predstavlja pravu u parametarskom prostoru slika 12. Potom se u parametarskom prostoru traže tačke preseka sa najvećom koncentracijom, tj. traže se tačke u kojima se seče najveći broj pravi. Svrha ovog postupka jeste pronaći najveći broj tačaka u dekartovom sistemu.


![Tačka prebačena iz dekartovog u parametarski sistem - slika 12](/images/2022/videookulografija/hafovatransformacija.png)

(slika 12 - Tačka prebačena iz dekartovog u parametarski sistem)


Problem nastaje kada se dobije vertikalna linija, jer kod takvih parametar a teži beskonačnosti. 





Zbog toga linija se posmatra u parametarskom obliku, a formula glasi:


$x \cdot \cos{\theta} + y \cdot \sin{\theta} = \rho$,

gde je:   
- $\theta$ - ugao koji zaklapa normala na pravu sa x osom Slika 13
- $\rho$ - rastojanje od koordinantnog početka do prave
- x, y - parametri


Sada, tačka neće predstavljati pravu već sinusoidu Slika 13, a presečne tačke se određuju na isti način kao što je ranije navedeno.


![Tačka u sinusoidnom obliku - slika 13](/images/2022/videookulografija/hafovatransformacija2.png)

(slika 13 - Tačka u sinusoidnom obliku)




U narednom koraku se definiše parametarski prostor.
Za svaki tačku iz slike, koja je detektovana kao ivica se generiše sinusoida koja se pamti i traže se preseci. 
Parametarski prostor se određuje pomoći ro i teta. 
Definišu se minimalne i maksimalne veličine, tj. opsezi za svaki od dva data parametra. Potom se taj parametarski prostor deli na više ćelija u skladu sa potrebnom preciznošću. 
U sledećem koraku se za svak tačku sa originalne slike definiše prava, nakon čega se za svaku vrednost parametra $\theta$ određuje parametar $\rho$. 
Ako važi da parametar $\theta_a$ generiše $\rho_b$, onda se ćelija inkrementira. 
Za sve tačke je postupak isti. 
Cilj je izdvojiti ćelije koje imaju najveće vrednosti, zbog toga što linije koje prolaze kroz te ćelije imaju najviše tačaka. 


Hafova transformacija za detekciju krugova, kao što je rečeno, identična je transformaciji linije. Kod krugova istih poluprečnika, tačke iz dekartovog se u parametarski sistem slikaju kao kružnice. 
Dakle, potrebna su samo dva parametra a i b, što sužava pretragu na dve dimenzije. 
Krug koji se predstavlja jednačinom kružnice

$(x - a)^2 + (y - b)^2 = r^2$ , 

parametarski se predstavlja formulama: 

$x = a + r \cdot \cos{\theta}$,

$y = b + r \cdot \sin{\theta}$. 


Kod krugova različitih poluprečnika razlika je u tome što oni zahtevaju tri dimenzije, tj. u parametarski prostor se prenose kao kupe. 
Ostatak postupka je isti kao i za LHT.


![3D transformacija kruga - slika 14](/images/2022/videookulografija/hafovatransformacija2.png)

(slika 14 - 3D transformacija kruga)


#### **3.2.2. Obrada podataka**

#### 3.2.2.1. Mean average filter


Dok konstantno gledamo u jednu tačku dolazi do šuma kao što je treptaj, nenamerno pomeranje oka ili kamere, promena jačine osvetljenja i slično.
Ovakve šumove neophodno je otkloniti i u te svrhe koristimo mean avrage filter.
Prolazići kroz signal izračunava se aritmetička vrednost prethodnih N merenja koordinata zenice.
Ovako izračunate vrednosti se postavlju kao nove koordinate zenice. 
Na taj način se dobija filtrirano merenje.

Na slikama ispod se mogu videti grafovi filtriranih signala, x i y ose u odnosu na vreme.


![Koordinate x-ose u odnosu na t - slika 15](/images/2022/videookulografija/filtriranx.jpg)(slika 13)


![Koordinate y-ose u odnosu na t - slika 16](/images/2022/videookulografija/filtrirany.jpg)(slika 14)



### **3.2.3. Kalibracija**


Kada je zenicu detektovana potrebno je uraditi test gde se na ekranu pojavljuje devet tačaka u koje se gleda određen broj sekundi.
U toku eksperimenta dobijaju se koordinate zenice i tačke u koju trenutno gledamo, tako pravimo bazu podataka koje će nam biti potrebna za dalji rad.


Ekran koji se gleda tokom eksperimenta izgleda kao na slici 17. 
U toku eksperimenta crvena tačka se pomera nakon nekog vremena, tj. plave tačke postaju crvene kada je potrebno gledati u njih.


![Ekran tokom eksperimenta - slika 17](/images/2022/videookulografija/eksperiment.jpg)(silak 17)

#### 3.2.3.1. Linearna regresija


Kako bi se uz pomoć detekcije zenice kontrolisao neki objekat na računaru potrebno je znati na osnovu koordinata centra zenice u koju tačku na ekranu je oko upereno. 
Za to je korišćena linearna regresija, tj. polinomialna regresija jer sistem nije linearan. 
Ovaj sistem nije linearan iz dva razloga.
Prvi razlog je konveksni oblik oka koji izaziva nelinarno kretanje zenice, a drugi razlog je što ravan pogleda(koja je normalna na položaj lica) i ravan ekrana nisu pod pravim uglom.



![Primer linearne regresije - slika 18](/images/2022/videookulografija/linearRegression.jpg)(slika 18)


Linearna regresija predstavlja modelovanje relacija između jedne ili više zavisnih promenljivih i jedne ili više nezavisnih promenljivih. 
Na slici 13 se može videti primer modelovanja relacije između promenljivih.
Model linearne regresije ima oblik:


$ \textbf{Y} = \textbf{X} \cdot b $


Gde je Y vektor izmerenih vrednosti(u ovom slučaju koordinate pogleda na ekranu) odnosno zavisna promenljiva, X vektor inputne promenljive(u ovom slučaju koordinate zenice oka) odnosno nezavisna promenljiva  i b vektor koificijenta modela. 


Optimalni vektor parametara $b$ dobija se iz formule za pseudo inverziju koja glasi: 


$b = (X^T \cdot X)^{-1} \cdot Y \cdot X^{T}$ 


Gde je X matrica koordinata zence oka, a Y matrica koordinata tačaka na ekranu u koje je predviđeno da se gleda tokom prethodno pomentuog eksperimenta.


Ove matrice se dobijaju iz baze podataka generisane tokom prethodno pomenutog eksperimenta.
Dobijen vektor koejficijenta modela b se koristi za izračunavanje koordinta tačaka na ekranu u koje je zenica uperena.
Ovako dobijen vektor koeficijenta b nije deltvoran.
Konveksni oblik oka izaziva nelinarno kretanje zenice i ugao između ravni pogleda i ravni ekrana nije normalan zbog čega je potrebno koristiti polinomialnu regresiju.


#### 3.2.3.2. Polinomialna regresija


Sistem nije linearan zbog konveksnog oblika oka i ugla između ravni pogleda i ravni ekrana koji nije normalan zbog čega se koristi polinomialna regresija.
Poliomilna regresija je specijalan slučaj višestruke linearne regresije gde se modeluje veza između zavisne i nezavisne promenljive, u ovom slučaju, između koordinata zenice oka i koordinate pogleda na ekranu, kao polinom n-tog stepena. 
U ovom slučaju, nema linearne korelacije između promenljivih (slika 19.1), pa se radi veće preciznosti primenjuje poliomilna regresija (slika 19.2).


![Primer linearne i polinomialne regresije - slika 19](/images/2022/videookulografija/polinomialnaRegresija.png)(slika 19)


Za razliku od linearne regresije, kod polinomialne regresije se nezavisna promenljiva x stepenuje stepenom regresije n i zbog toga se dobija bolja korelacija između promenjljivih.


Formula polinomialne regresije glasi:


$y= b_0+b_1 \cdot x_1+ b_2 \cdot x_1^2 + b_3  \cdot x_1^3+ ... + b_n \cdot x_1^n$

gde su:


b - koeficijenti regresije


n - stepen regresije (u slučaju ovog rada $n = 3$)

Kako bi izračunali optimalan koeficijent regresije neophodno je da se polinomialna regresija svede na lineanrnu i nakon toga korišćenjem pseudo inverzije izračuna optimalan koeficijent b.
Polinomialnu regresiju se svodi na linearnu regresiju tako što se konstruiše matricu X: 

$\begin{bmatrix}
   1 & x_1 & x_1^2 & ... & x_1^n \\
   1 & x_2 & x_2^2 & ... & x_2^n \\
   1 & x_3 & x_3^2 & ... & x_3^n \\
   . & . & . & . & . \\
   . & . & . &  .  & . \\
   . & . & . &   . & . \\
   1 & x_m & x_m^2 & ... & x_m^n 
\end{bmatrix}$

U ovoj matrici n predstavlja stepen polinomialne regresije.
Ovakvu matricu ćemo iskoristiti u formuli za pseudo inverziju i na taj način dobiti optimalni koeficijent regresije $b$.

Formula za pseudo inverziju:  $b = (X^T \cdot X)^{-1} \cdot Y \cdot X^{T}$ 


## **4. Rezultati i istraživanja**


Model dobijen poliomilnom regresijom je proveren tako što je eksperiment snimiljen još jednom, ali ovog puta je dobijen predviđen položaja zenice.
Na kraju, kao rezultat je dobijena tabela u kojoj, u odnosu na koordinate tačke na ekranu (x, y), se može videti pomerenost estimacije i standardna devijacija rasipanja (σx, σy).
Rezultati sa jednim snimanjem imaja prosečan pomeraj 121.6 piksela i prosečne standardne devijacije raspipanja su σx = 43.48 i σy = 43.13. 


![Primer - slika 20](/images/2022/videookulografija/primerfoldera.jpg)(slika 20)


Sa ovakvim brojkama u pokušaju pritiskanja New folder  sa slike 20 bio bi zapravo pritisnut folder New Folder 2 ili New folder 3 ili New folder 4.
Kada bi parametri sa ovakvim rezultatima bili implementirani verovatnoća za uspešnu kontrolu bi bila veoma mala, čak približna nuli.
Kako bi se rezultati poboljšali i kako bi imali realniju sliku o sistemu potrebno je više snimanja.
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


Za testiranje modela angažovan je ispitanik pomoću kog je odrađena akvizicija podataka. Problem se pojavio kada je ispitanik menjao poziciju tela tokom akvizicije - približavao/udaljavao se od ekrana. 
Drugi problem je pomeranje glave iako je postavljena na stalak. 
Rešenje bi bilo napraviti čvršći stalak koji kompletno imobilizuje glavu i predstavlja čvrst oslonac. 
Očekivani rezultati bili bi poklapanje koordinata zenice oka sa koordinatama tačke na ekranu, tj. jasno definisana putanja zenice tokom procesa testiranja.



![Referentni rezultati - slika 21](/images/2022/videookulografija/referentni_rezultati.jpg)(slika 21 - dobijeni rezultati u referentnom radu [5])



Na dobijenim rezultatima vidi se sledeće - putanja oka prikazana na ekranu nije ista kao putanja kojom je ispitanik pomerao oči.
U obzir uzima se da je ispitanik kratkovid. 
Kako bi rezultati bili precizniji potrebno je više testiranja i prikupljanja podataka na različitim ispitanicima. 
Takođe, uslovi u kojima je odrađeno testiranje nisu bili idealni. 
Količina osvetljenja prouzrokuje refleksiju u očima što remeti detekciju zenice i stvara šumove prilikom pomeranja očiju. 
Kako bi se ovaj problem otklonio potrebno je postaviti IR LED diode na naočare. 
Ovim bi količina osvetljenja bila podjednaka, što bi doprinelo boljim rezultatima. 
U budućnosti će se u sistem uvesti gore navedene promene i biće urađeno više snimanja.


![Referentni rezultati - slika 22](/images/2022/videookulografija/nasi_rezultati.jpg)(slika 22 - dobijeni rezultati prilikom testiranja u ovom radu)

## **6. Reference**
[^1]: Saravanan, Chandran. "Color image to grayscale image conversion." 2010 Second International Conference on Computer Engineering and Applications. Vol. 2. IEEE, 2010.


[^2]: Ahmed, Ahmed Shihab. "Comparative study among Sobel, Prewitt and Canny edge detection operators used in image processing." J. Theor. Appl. Inf. Technol 96.19 (2018): 6517-6525.


[^3]: Valentina, Christie, et al. "Iris localization using circular hough transform and horizontal projection folding." Proceedings of International Conference on Information Technology and Applied Mathematics. 2012.


[^4]: Ye, Huashan & Shang, Guocan & Wang, Lina & Zheng, Min. (2015). A new method based on hough transform for quick line and circle detection. 52-56. 10.1109/BMEI.2015.7401472.


[^5]: Bozomitu, R. G., Păsărică, A., Tărniceriu, D., & Rotariu, C. (2019). Development of an eye tracking-based human-computer interface for real-time applications. Sensors, 19(16), 3630.