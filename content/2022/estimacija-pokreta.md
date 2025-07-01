---
title: Estimacija pokreta
summary: Estimacija pokreta pomoću optical flow je projekat rađen na letnjem kampu za stare polaznike 2022. godine čiji su autori Milica Gojak i Novak Stijepić.
---
**Autori** 


Novak Stijepić, učenik III razreda Matematičke gimnazije u Boegradu


Milica Goljak, učenica IV razreda Prve gimnazije u Kragujevcu


**Mentor** 


Luka Simić, Elektrotehnički fakultet u Beogradu


## Apstrakt

U radu se vrši određivanje potpunog polja protoka diskretnim pristupom uz korišćenje tri optimizacione metode koje omogućavaju smanjenje potrebnih računskih i memorijskih resursa. Njihovo korišćenje dozvoljava procenu optičkog protoka velikih pomeraja. Na početku se predlažu vektori protoka pronalaženjem parova piksela referentne i ciljane slike na osnovu nekog parametra, u ovom radu sličnosti njihovih DAISY deskriptora. 

Prvi način optimizacije koji je korišćen u radu je ograničenje skupa predloga na fiksan broj. Predlozi se pronalaze korišćenjem algoritma nasumične k-d šume. 

Drugi način jeste korišćenje spuštanja po blokovima koordinata za pronalaženje optimalnih kombinacija usaglašenih vektora protoka iz skupa predloga. 

Treći vid optimizacije je korišćenje skupova sličnih predloga prilikom obrade predloga susednih piksela. Procenjeno polje se unapređuje postprocesiranjem i izbačeni vektori se ponovo računaju interpolacijom korišćenjem EpicFlow algoritma. Rezultati su dobijeni evaluacijom nad KITTI bazom podataka.

## Abstract

In this paper we approach the problem of optical flow estimation from a discrete point of view and use three optimization methods which are able to reduce computation and memory demands. Their use allows us to estimate optical flow of sequences with large displacements. Firstly, our program generates flow vector proposals by finding matches between pixels in the reference image and the target image using a parameter, in this paper the similarity of their DAISY descriptors. The program is optimized by restricting the number of flow proposals to a fixed number. Proposals were extracted using the randomized k-d forest algorithm. Secondly, we use block coordinate descent for finding optimal combinations of aligned flow vectors. Lastly, we use sets of similar proposals to optimize the processing of proposals in neighboring pixels. The estimated field is refined in postprocessing and the flow vectors of unmatched regions are interpolated using EpicFlow. Results were obtained by evaluating the algorithm on the KITTI dataset.

{{< figure "Slika" "Grafički apstrakt" "OGA" >}}

![Graficki apstrakt](/images/2022/estimacija-pokreta/OGA.svg)

{{</ figure >}}

## 1. Uvod

Procena kretanja je proces određivanja vektora kretanja koji opisuju prelazak jedne slike u drugu. Predstavlja jedan od osnovnih problema oblasti kompjuterske vizije.

Klasična formulacija estimacije optičkog protoka definiše problem kao kontinualni varijacijski problem optimizacije energija. [^1] [^2] Kako bi mogli da se reše slučajevi sa pomerajima većim od nekoliko piksela koristi se metod od grube ka finijim estimacijama.[^3] Metod se zasniva na računanju optičkog protoka slika manjih rezolucija, onih za koje važi originalna formulacija, i korišćenju tih procena pri računanju protoka slike originalne rezolucije. Nažalost, ovaj metod često dovodi do nedostataka oštrih promena, diskontinuiteta, optičkog protoka koji postoje u pravom polju kretanja naročito pri opisivanju kretanja u blizini ivica. Stoga je veliki broj istraživača fokusiran na preformulaciju problema ne bi li bili dopušteni diskontinuiteti.

Jedan smer pri rešavanju problema jeste modeliranje protoka korišćenjem Markovljevih slučajnih procesa.[^4] [^5]

U okviru primera iz *stereo matching*-a, optimizacija energija može se olakšati primenom diskretnih optimizacionih algoritama, kao što su *graph cut*\[^6] i *message passing*\[^7], koji su često u mogućnosti da postignu približno globalni optimum. Iako se estimacija dispariteta može smatrati ograničenim slučajem optičkog protoka, malo autora je primenilo diskretnu optimizaciju za estimaciju optičkog protoka.

U referentnoj metodi\[^8] predstavljene su tri različite strategije optimizacije diskretnog pristupa, sa ciljem ispitivanja uticaja različitih algoritama na preciznost određivanja optičkog protoka.

## 2. Metod

### 2.1. Generisanje predloga

Polje kretanja se određuje nad parom slika: referentnoj slici i ciljanoj slici (slici koja je uslikana nekoliko trenutaka nakon referentne). Referentnu sliku želimo da pomoću vektora protoka pretvorimo u ciljanu sliku.

Ciljana slika se deli na ćelije visine $h$ i širine $w$. Svaki piksel referentne slike treba dobiti po $K$ predloga destinacije vektora protoka iz svake okolne ćelije ciljane slike, čime se dobija raznovrstan skup predloga od kojih će se kasnije birati konačni vektor protoka. Okolne ćelije definišemo kao ćelije u pravougaoniku širine $5w$ i visine $5h$, centriranom na referentnoj ćeliji. Za svaku ćeliju se koristi nasumična k-d šuma (eng: *randomized k-d tree forest*) za deskriptore piksela koji pripadaju toj ćeliji. To je efikasna struktura za nalaženje $K$ piksela najbližih datom pikselu, po sličnosti deskriptora računatih DAISY algoritmom. Za razliku od referentne metode koja čuva sve k-d šume tokom generisanja predloga, naša metoda pravi k-d šumu za jednu ćeliju, iskoristi je za nalaženje najsličnijih piksela u ćelijama u okolini i više je ne čuva. Za pravljenje k-d šuma koristi se algoritam iz biblioteke FLANN.[^9]

Menhetn norma razlike deskriptorskih vektora početnog i krajnjeg piksela nekog predloga rednog broja $l$ u pikselu $(x,y)$ se čuva kao *cena* tog vektora protoka, $\varphi_{(x,y)}(l)$. Odseca se iznad granične vrednosti $\tau_\phi$ i koristi se u daljim proračunima. Vektori protoka između piksela koji su slični po DAISY algoritmu imaju malu cenu. 

Iz skupa predloga svakog piksela se bira vektor protoka sa najmanjom cenom i koristi se kao najbolji vektor protoka tog piksela pre dalje obrade. Time dobijamo prvi rezultat za polje protoka slike.

Susedni pikseli često imaju sličan vektor protoka. Zato se dodatno uzima $N$ nasumičnih piksela iz lokalne Gausove distribucije centrirane na referentnom pikselu i iz svakog od njih bira vektor protoka sa najmanjom cenom. On se dodaje u skup predloga prvobitnog piksela, ako već nije prisutan. U slučaju da jeste, naša metoda ga ne dodaje, za razliku od referentne metode koja dodaje sledeći najbolji vektor protoka tog piksela. Zbog toga ne mora da sortira sve predloge iz datog piksela, čime dobija na efikasnosti, ali broj predloga nije isti za svaki piksel.

#### 2.1.1. DAISY

DAISY[^10] je algoritam koji pretvara lokalne regione slike u niskodimenzionalne invarijantne deskriptore koji mogu da se koriste za uparivanje i klasifikaciju.

Direktno inspirisan SIFT-om,[^11] gleda se gradijent intenziteta piksela po određenim orijentacijama, ali kako se u SIFT-u za datu karakterističnu tačku računaju gradienti nad pravougaonim prozorom, DAISY komšije deli po krugovima različitih veličina čiji se centri nalaze na seriji koncentričnih prstenova. Prečnik svakog kruga je proporcionalan njegovom rastojanju od karakteristične tačke. Poenta ovakve podele komšija je u tome da se vektor koji opisuje tačku može izračunati vrlo brzo pomoću Gausovskih konvolucija i upravo zato je DAISY vrlo koristan za računanje deskriptora za svaki piksel.

### 2.2. Random Field Model

Za par predloga $l$ i $k$ susednih piksela $p$ i $q$ definišemo *cenu slaganja* $\psi_{\mathbf{p}, \mathbf{q}}\left(l,k\right)$ kao Menhetn normu njihove razlike. Kao i cena vektora protoka, odsečena je odozgo sa $\tau_\psi$.

Polje protoka je modelirano kao Markovljev slučajni proces. Problem procene pokreta je sveden na minimizaciju zbira cena vektora protoka i cena slaganja.

$$ \lambda \sum\_{\mathbf{p}} \varphi\_{\mathbf{p}}(l\_{\mathbf{p}})+\sum\_{\mathbf{p} \sim \mathbf{q}} \psi\_{\mathbf{p}, \mathbf{q}}\left(l\_{\mathbf{p}}, l\_{\mathbf{q}}\right) $$

Vrednost $\lambda$ je težinski faktor. Simbolom $\sim$ su označeni susedni pikseli $\mathbf{p}$ i $\mathbf{q}$ na slici, a simbolom $l_\mathbf{p}$ redni broj predloga izabranog kao konačni vektor protoka piksela $\mathbf{p}$.

### 2.3. Pronalaženje optimalnih vektora

U svakom trenutku se čuva trenutno polje protoka, i ukupna cena se postepeno smanjuje odabirom bolje kombinacije vektora protoka iz skupa predloga svakog piksela. To se radi pomoću spuštanja po blokovima koordinata (eng: *block coordinate descent*), nalaženjem minimalnog zbira cena u pojedinačnom redu ili koloni piksela na slici. Ovo ne garantuje nalaženje globalnog minimuma cene, što je NP-težak problem, ali garantuje smanjivanje ukupne cene slike u svakom koraku spuštanja. Iako deluje da mogu biti od pomoći, u originalnom radu je pokazano da korišćenje algoritama detekcije ivica u ovom delu programa daje lošije rezultate, tako da nisu korišćeni.

U pojedinačnom redu piksela je potrebno naći kombinaciju vektora protoka iz predloga koja će dati minimalan zbir cena vektora protoka i cena slaganja, uzimajući u obzir trenutno stanje polja protoka u susedna dva reda. Cene na koje treba paziti su cene vektora protoka, cena slaganja sa pikselima iz susednih redova i cena slaganja sa pikselima iz istog reda.

Problem minimizacije je rešen matricom $C$, čije su koordinate pozicija piksela u redu i redni broj trenutnog predloga u tom pikselu. Za red $y$ se matrica dinamičkim programiranjem popunjava po jednačinama:

$$ \mathbf{C}(x, l) =\lambda \varphi\_{(x, y)}(l)+\psi\_{(x, y),(x, y-1)}\left(l, l\_{(x, y-1)}^\*\right)+\psi\_{(x, y),(x, y+1)}\left(l, l\_{(x, y+1)}^\*\right) $$

$$
\mathbf{C}(x, l)=\mathbf{C}(x, l)+\min \_{0 \leq k < L(x,y)}\left(\psi\_{(x, y),(x-1, y)}(l, k)+\mathbf{C}(x-1, k)\right)
$$

Algoritam kreće od početka reda piksela, i u $\mathbf{C}(x, l)$ čuva najmanju od kumulativnih cena svih kombinacija u delu reda od početnog piksela do piksela $(x,y)$, koje se završavaju predlogom rednog broja $l$ tog piksela. Predlozi označeni sa $l^*$ su trenutni predlozi iz susednih redova, a $L(x,y)$ broj predloga piksela $(x,y)$. Sami vektori protoka koji sačinjavaju kombinaciju date ukupne cene se ne čuvaju, već se najbolja kombinacija rekonstruiše idući unazad kroz matricu nakon što se popuni do kraja. Stari predlozi vektora se zamene novim i kreće se sa obradom sledećeg reda.

Minimum u drugoj jednačini se nalazi pomoću *skupova sličnih predloga*.

#### 2.3.1. Skupovi sličnih predloga

Bez modifikacija algoritma, bilo bi neophodno računati cene slaganja svakog para vektora protoka iz svaka dva susedna piksela u redu. Radi optimizacije možemo koristiti činjenicu da su cene slaganja odsečene. Naša metoda pre BCD-a za svaki par susednih piksela pravi skupove sličnih predloga, označenih $\mathcal{S}$, koji za svaki predlog jednog od njih čuvaju redne brojeve predloga drugog piksela koji daju cenu slaganja manju od granične vrednosti, $\tau_\psi$.

$$ \mathcal{S}\_{\mathbf{p}, \mathbf{q}, l}=\\\{ 0 \leq k < L(x,y)  |  \psi\_{\mathbf{p}, \mathbf{q}}(l,k)<\tau\_\psi \\\} $$


Algoritam računa cene slaganja isključivo za predloge prisutne u k-skupovima. Zbog raznovrsnosti predloga, većina cena slaganja se odseče, što rezultira manjim skupovima i ubrzava izvršavanje algoritma.
Minimum u jednačini popunjavanja matrice za predlog $l$ piksela $(x,y)$ računa se kao minimum između vrednosti $a$ i $b$, gde je $a$ najbolja vrednost dobijena korišćenjem predloga iz relevantnih skupova sličnih predloga, dok je $b$ vrednost koja uključuje cenu slaganja odsečenu na prag $\tau_{\psi}$.


$$
a = \min \_{k \in \mathcal{S}\_{(x, y),(x-1, y), l}}(\psi\_{(x, y),(x-1, y)}(l, k)+\mathbf{C}(x-1, k))
$$

$$ 
b=\tau_\psi+\min \_{0 \leq k < L(x,y)}\left(\mathbf{C}(x-1, k)\right)
$$

### 2.4. Baza podataka

Za evaluaciju programa korišćena je KITTI [^12] baza za optički protok. Podaci su usnimljeni u *Karlsruhe*, gradu u Nemačkoj. Baza se sastoji iz 200 scena u trening setu i 200 scena u test setu. Svaka scena se sastoji iz sekvence dve uzastopno snimljene slike, referentne i ciljane.

### 2.5. Postprocesiranje

Ranije opisani algoritam dodeljuje svaki piksel referentne slike pikselu ciljane slike. Kao unapređenje algoritma vrši se izbacivanje piksela na osnovu dva kriterijuma: provere konzistentnosti i uklanjanja malih segmenata, nakon čega se primenjuje EpicFlow[^13]. 

Provera konzistentnosti se vrši tako što se računa optički protok unapred, kao i unazad, u suprotnom poretku od datog u bazi podataka, i vektor protoka se izbacuje ako je njegovo odstupanje veće od definisanog praga. Zatim se izbacuju mali segmenti od najviše 100 piksela koji odstupaju od kretanja okolnih piksela usled pretpostavke da se radi o kretanju većih celina i da izolovani segmenti odgovaraju pogrešnoj proceni.

Kako bi se dobilo u potpunosti definisano polje protoka koristi se EpicFlow algoritam, koji pikselima koji nemaju definisan protok računa isti, uzimajući u obzir okolne piksele i ivice slike. EpicFlow kreće od hipoteze da ivice slike definišu granice kretanja, odnosno da pikseli sa suprotne strane ivice odgovaraju kretaju različitih objekata.

## 3. Rezultati


### 3.1. Kvantitativni rezultati

Uspešnost algoritma je merena na osnovu dve metrike: srednja greška i procenat pogrešnih piksela. Srednja greška je računata kao srednja vrednost zbira kvadrata razlike komponenata istinitog vektora pomeraja i naše procene. Pogrešan piksel se smatra onaj čija je greska veća od 3 piksela. Za evaluaciju korišćeni su podaci iz KITTI baze koja sadrži parove uzastopnih slika sa primerima manjih i većih pomeraja. Svaki par slika u skupu za trening sadrži i istinito polje pokreta.
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

{{< figure "Slika" "Srednja greška vektora protoka" "OGA" >}}

![Srednja greska vektora protoka](/images/2022/estimacija-pokreta/a.svg)

{{</ figure >}}

{{< figure "Slika" "Procenat pogresnih piksela" "OGA" >}}

![Procenat pogresnih piksela](/images/2022/estimacija-pokreta/b.svg)

{{</ figure >}}



## 4. Zaključak

U radu je predstavljen uspešan diskretni pristup za estimaciju pokreta. Metoda generiše vektore protoka na osnovu sličnosti DAISY deskriptora, a zatim ih optimizuje.

Ključni deo algoritma je iterativno poboljšanje rešenja pomoću spuštanja po blokovima koordinata (BCD), što je, prema evaluaciji na KITTI bazi, drastično smanjilo početnu grešku. Efikasnost je postignuta sa tri optimizacione tehnike, dok je finalni rezultat dodatno unapređen postprocesiranjem uz EpicFlow.

Pristup se pokazao kao robustno i precizno rešenje, sposobno da se efikasno nosi i sa velikim pomerajima između slika.


## 5. Literatura

[^1]: Horn, B.K.P., Schunck, B.G. (1980). Determining optical flow. AI 17(1–3), 185–203

[^2]: Lucas, B.D., Kanade, T. (1981). An iterative image registration technique with an application to stereo vision. In: IJCAI

[^3]: Brox, T., Bruhn, A., Papenberg, N., Weickert, J. (2004). High accuracy optical flow
estimation based on a theory for warping. In: Proc. of the European Conf. on
Computer Vision (ECCV)

[^4]: M. J. Black and P. Anandan. (1996). The robust estimation of multiple motions: Parametric and piecewise-smooth flow fields. CVIU, 63(1):75–
104

[^5]: F. Heitz and P. Bouthemy. (1993). Multimodal estimation of discontinuous optical flow using Markov random fields. TPAMI, 15(12):1217–
1232

[^6]: Y. Boykov, O. Veksler, and R. Zabih. (2001). Fast approximate energy minimization via graph cuts. TPAMI, 23(11):1222–1239

[^7]: J. Sun, N.-N. Zhen, and H.-Y. Shum. (2003). Stereo matching using belief
propagation. TPAMI, 25(7):787–800

[^8]: M. Menze, C. Heipke, A. Geiger. (2015). Discrete optimization for optical flow. German Conference on Pattern Recognition, 16-28

[^9]: Muja, M., & Lowe, D. (2009). Flann-fast library for approximate nearest neighbors user manual. Computer Science Department, University of British Columbia, Vancouver, BC, Canada, 5.

[^10]: Tola, E., Lepetit, V., & Fua, P. (2010). DAISY: An Efficient Dense Descriptor Applied to Wide-Baseline Stereo. IEEE Transactions on Pattern Analysis and Machine Intelligence, 32(5), 815–830.

[^11]: Lowe, D. G. (1999). Object recognition from local scale-invariant features. Proceedings of the Seventh IEEE International Conference on Computer Vision.

[^12]: M. Menze and A. Geiger. (2015). Object scene flow for autonomous vehicles. 2015 IEEE Conference on Computer Vision and Pattern Recognition (CVPR), pp. 3061-3070

[^13]: Revaud, J., Weinzaepfel, P., Harchaoui, Z., & Schmid, C. (2015). Epicflow: Edge-preserving interpolation of correspondences for optical flow. In Proceedings of the IEEE conference on computer vision and pattern recognition (pp. 1164-1172).
