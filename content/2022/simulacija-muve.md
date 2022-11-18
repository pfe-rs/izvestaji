---
title: Simulacija muve
summary: Simulacija muve je projekat rađen na letnjem kampu za stare polaznike 2022. godine od Aleksandra Raškovića i Tadeja Ristića.
---

### Apstrakt


### Apstrakt na engleskom


### Uvod

Cilj projekta "Simulacija muve" je da implementiramo fizičku simulaciju i unutar nje pomoću ML-a naučimo muvu da leti.
Za učenje muve koristimo neuralnu mrežu u kombinaciji sa genetskim algoritmom.
Neuralne mreže i genetski algoritmi se često koriste za treniranje simulacija, kao npr. simulacija hodanja ili trčanja.
U našem slučaju, napravili smo ML model koji koristimo za kontrolisanje krila muve što onda dovodi do pomeranja muve zbog simulacije sile otpora vazduha na muvu.

### Aparatura i metoda - Simulacija fizike

#### Kinematika

Sam model muve predstavljen je pozicijama karakterističnih tačaka u lokalnom 3D prostoru.
Krila su definisana pomoću koordinata 3 tačke koje predstavljaju ravan krila.
Telo muve čini 8 tačaka, jedna za svako teme kvadra koji čini telo muve.
Model muve možemo smatrati jednim lokalnim koordinatnim sistemom.
Taj lokalni koordinatni sistem ima svoju poziciju, i brzinu u globalnom koordinatnom sistemu i na njemu se primenjuju zakoni pravolinijskog i rotacionog ravnomernog promenljivog kretanja.
Lokalne koordinate muve se konvertuju u globalni koordinatni sistem pomoću homogenih matrica translacije i rotacije, radi prikaza u 3D prostoru i daljeg računanja u dinamici.

Vektor koji predstavlja poziciju neke tačke muve u globalnom prostoru dobijamo tako što vektor lokalnih koordinata pomnožimo matricom $M$
Matricu $M$ dobijamo množenjem matrica translacije gde je pomeraj zapravo pozicija muve i matricu rotacije gde je ugao rotacije ugao rotacije muve oko koordinatnog početka njenog lokalnog koordinatnog sistema.

$M = T \times R$, gde je  $T$ matrica translacije, $R$ matrica rotacije.

Sličan metod se koristi i za rotaciju krila u lokalnom koordinatnom sistemu muve.
Umesto da tačka oko koje se krilo rotira bude koordinatni početak, za tačku rotacije se uzima "zglob" tj. tačka kojom je krilo povezano sa telom muve.
Rotacija krila je ograničena svojim maksimalnim uglom i brzinom pomeranja, kako krilo ne bi moglo da pravi pokrete koji su nemogući u pravom životu.

#### Dinamika

Drugi deo fizičke simulacije jeste dinamika.
Originalna zamisao je bila da simuliramo vazduh kao fluid, ali zbog kompleksnosti programa i brzine treniranja neuralne mreže smo pojednostavili model, tj. koristili smo jednačinu sile otpora sredine.

$$\textbf{F} = \frac{1}{2}\rho \textbf{v}|\textbf{v}|C_D\textbf{A}$$

$C_D$ je koeficijent sile otpora,
On je konstanta koja zavisi od oblika tela i njegovog ugla u odnosu na pravac kretanja.
Umesto računanja tog koeficijenta za svaki ugao, ili uzimanja poznatih tabličnih vrednosti, u formulu smo dodali kosinus od ugla krila kao aproksimaciju.

$\textbf{A}$ predstavlja vektor projekcija površine krila na x, y i z osu globalnog koordinatnog sistema, dok je $\textbf{v}$ vektor komponenti brzine krila po istim osama.
$\rho$ je gustina vazduha.

Druga aproksimacija koja je korištena je kod računanja momenata sila i ugaonog ubrzanja.
Umesto da se uvek izračunava osa oko koje se rotira muva, za osu rotacije uvek uzimamo centar mase muve.

Iz sila otpora sredine i gravitacione sile, možemo da izračunamo linearno i rotaciono ubrzanje sistema muve, iz čega se dobija linearna i ugaona brzinu muve za svaki vremenski period $dt$.

### Aparatura i metoda - ML
U našem projektu koristimo neuronsku mrežu za kontrolisanje muve, dok pomoću genetskog algoritma unapređujemo mrežu.
Neuronska mreža i genetski algoratam su implementirani tako da se mogu iskoristiti za razne ML probleme.
Zato je dodatno implementiran i kod koji koristi ove "biblioteke" za treniranje muve da leti.

Prvo ćemo se baviti implementacijom neuronske mreže i genetskog algoritma.

Kod je podeljen u dva dela
- network.py - ovde je implementirana mreža
- geneticAlgo.py - ovde je implementiran genetski algoritam

Cela implementacija je bila u jeziku python3.
Za implementaciju mreže potrebna je samo biblioteka NumPy.

Napravljene su dve verzije mreže, jedna vektorizovana i druga nevektorizovana.
Ovde ću opisati implementaciju vektorizovane mreže i algoritama koji su prilagođeni takvoj implementaciji.
Razlika između ta dva načina implementiranja jeste to što je nevektorizovana mreža implementirana pomoću mnogo "for" petlji i ne može da se paralelizuje izvršavanje koda pomoću više jezgara ili niti, dok je vektorizovana mreža implementirana pomoću vektora i vektorskih operacija koje su optimizovane da se izvršavaju na više jezgara ili niti čime je izvršavanje značajno brže.

#### Opis interfejsa za treniranje
Algoritam traži da korisnik inicijalizuje populaciju tipa Population nad kojom će posle pozvati funkciju run.
Prilikom inicijalizovanja populacije treba da se prosledi broj jedinki u populaciji i arhitektura mreže, dok se prilikom poziva funkcije run nad populacijom prosleđuju fitnes funkcija i ostali parametri kao što su šansa za mutaciju gena, nazivi fajlova u kojima će se čuvati geni najboljih mreža, način na koji će se čuvati itd.

Fitnes funkcija je funkcija koju implementira korisnik i koja treba da odredi koliko je dobar svaki gen tj. mreža za određeni zadatak.
Ona će biti pozvana jednom za svaku generaciju, biće joj prosleđena lista gena.
Korisnik pomoću svakog gena može da generiše neuralnu mrežu koristeći funkciju koju smo implementirali.
Fitnes funkcija treba da promeni fitness član genoma u listi za svaki genom prema želji korisnika.
Korisnik može da odabere na koji način će oceniti svaku mrežu.
Kako bi koristio mreže korisnik može na objektu mreže koji je inicijalizovao pomoću gena da pozove funkciju Activate i da joj prosledi ulazne podatke za mrežu formata NumPy matrice.
U svakoj koloni matrice je zaseban set ulaznih podataka mreže (input features).
Imamo više kolona u slučaju da kroz istu mrežu želimo odjednom da prosledimo više setova aktivacija.
U našem slučaju imaćemo samo jednu kolonu jer obrađujemo samo ulazne podatke od jedne bube za svaku mrežu.
Funkcija Activate nam vraća vektor sličnog formata kao na ulazu sa izlaznim vrednostima mreže za svaki set.

Označimo sa $X_{j}^{i}$ j-ti ulazni podatak (input feature) od i-tog seta ulaznih podataka.
Onda format matrice ulaznih podataka za funkciju Activate izgleda ovako:

| Set 1 | Set 2 | ... | Set m    |
| ----- | ----- | ----- | ----- |
| $X_{1}^{1}$ | $X_{1}^{2}$ | ... | $X_{1}^{m}$ |
| $X_{2}^{0}$ | $X_{2}^{2}$ | ... | $X_{2}^{m}$ |
| ... | ... | ... | ... |
| $X_{n}^{1}$ | $X_{n}^{2}$ | ... | $X_{n}^{m}$ |

Ovde imamo n ulaznih podataka za svaki set.
Imamo m setova.
Ovo znači da naša mreža u prvom sloju ima n neurona i da će u ovom slučaju obrađivati m setova ulaznih podataka paralelno.
Vrednost m ne mora da bude ista za svaki poziv Activate funkcije dok n mora jer je već definisana arhitekturom mreže.

**bitno je voditi računa o orijentacijama vektora u implementaciji!**

#### Neuronska mreža
U kodu za neuralnu mrežu je implementirana samo feedforward funkcija, tj. funkcija propagacije unapred, jer za genetski algoritam propagacija unazad nije potrebna.
Za svaki sloj mreže, osim ulaznog, imamo dve matrice parametara.
Jedna je matrica težina, dok je druga matrica zapravo vektor sklonosti (eng. bias).
Sve parametre čuvamo u rečniku.
Slojeve mreže indeksiramo od nula tako da su nam parametri u rečniku sačuvani kao "W1", "b1", "W2", "b2", ..., "Wn-1", "bn-1", ako je n broj slojeva mreže.
Obratite pažnju na to da indeksiranje kreće od nule i da prvi (ulazni) sloj u mrežu nema parametre.

Označimo sa $W[k]_{ij}$ težinu veze između i-tog neurona iz trenutnog (k-tog) sloja mreže sa j-tim neuronom iz prethodnog (k-1) sloja.
Onda format za težine k-tog sloja neuronske mreže izgleda ovako:

|  |  |  |  |
| ----- | ----- | ----- | ----- |
| $W[k]_{00}$ | $W[k]_{01}$ | ... | $W[k]_{0m}$ |
| $W[k]_{10}$ | $W[k]_{11}$ | ... | $W[k]_{1m}$ |
| ... | ... | ... | ... |
| $W[k]_{n0}$ | $W[k]_{n1}$ | ... | $W[k]_{nm}$ |

Ovde imamo n neurona u trenutnom (k-tom) sloju neuralne mreže i m neurona u prethodnom (k-1) sloju.

Označimo sa $b[k]_{i}$ sklonost tj. bias i-tog neurona trenutnog (k-tog) sloja neuronske mreže.
Onda format za sklonosti tj. bias-ove k-tog sloja neuralne mreže izgleda ovako:

|  |
| ----- |
| $b[k]_{0}$ |
| $b[k]_{1}$ |
| ... |
| $b[k]_{n}$ |

Ovde imamo n neurona u trenutnom (k-tom) sloju neuralne mreže.

Glavna funkcija u mreži je Activate.
Njoj se kao parametar zadaje matrica ulaznih podataka koja je ranije opisana u zaglavlju "Opis interfejsa za treniranje".
Funkcija radi propagaciju unapred.
Za svaki sloj k (bez prvog, tj. ulaznog) radi sledeće operacije:
$$
Z[k] = W[k] \times A[k-1] + b[k]
$$
$$
A[k] = tanh(Z[k])
$$

**Imati na umu da je $\times$ operacija množenja matrica** 

Aktivaciona funkcija može da bude i neka druga nelinearna funkcija unesto tanh, kao što su sigmoid ili ReLU

Ovim smo vektorski implementirali izračunavanje aktivacija trenutnog (k-tog) sloja mreže pomoću aktivacija prethodnog (k-1) sloja.

Funkcija Activate na kraju vraća matricu aktivacija $A[n-1]$, gde je n broj slojeve u neuralnoj mreži.
Voditi računa o tome da su slojevi indeksirani od 0.


**dodati kog je formata izlaz!!!!**

#### Genetski algoritam
Sve informacije o nekoj mreži se nalaze u objektu tipa Genome koji smo implementirati, koji je zapravo njen gen.
Objekat gena sadrži razne podatke o mreži u sebi, kao i sve parametre mreže.
Pri pravljenju populacije svi parametri dobijaju nasumične vrednosti po gausovoj (normalnoj) raspodeli sa standardnom devijacijom koja se prosleđuje konstruktoru.

Algoritam se sastoji iz 3 faze
 - selekcija
 - ukrštanje
 - mutacija

##### Faza selekcije:
Nakon što se završi fitnes funkcija program bira najboljih 10% gena.
Njih stavljamo u niz koji ćemo nazvati 'mating pool'.

##### Faza ukrštanja:
Novi geni se generišu tako što se biraju nasumično dva "rotitelja" iz "mating pool-a".
Parametri nove mreže mogu da se dobiju na razne načina.
Konkretno u našem slučaju za svaki parametar mreže ima $x$ šanse da bude iz prvog roditelja i $1-x$ šanse da bude iz drugog ($x$ je jedan od parametara koji prosleđujemo run funkciji).

##### Faza mutacije:
Nakon ovog dela vrše se nasumične mutacije na svakom od novih gena.
Učestalost ovih mutacija takođe može da se prosledi u run funkciji.

##### Dodatna faza:
Program takođe čuva 5% najboljih gena iz prošle generacije bez promena, kako se ne bi desilo da slučajno kroz prethodne faze ne izgubimo dosadašnji napredak.

#### Čuvanje podataka
Za čuvanje podataka kao što su najbolji gen muve za određene generacije ili cela populacija u nekom trenutku treniranja, koristimo biblioteku pickle.
Ova biblioteka omogućava da u fajlovima sa .pickle ekstenzijom sačuvamo python objekat koji lako posle možemo da vratimo u program.
Najbolji gen iz neke generacije se čuva kada njegov fitnes postane veći od parametra fitness_treshold, onda program čuva najbolji gen u fajl i povećava fitness_treshold za delta_fitness kako bi čuvao samo fajlove kada algoritam napravi neki pomak.
Nakon što završimo treniranje na zadatom broju generacija, program čuva poslednju populaciju.
Ovo je bitno ukoliko želimo da treniramo populaciju iz više puta.
Omogućava nam menjanje fitnes funkcije i ostalih parametara između dva dela treniranja.
Parametre fitness_treshold, delta_fitness i slične možemo da prosledimo run funkciji koju pozivamo nad populacijom.

#### Treniranje muve
Jedan deo veze između genetskog algoritma i fizike je implementiran u fajlu bugControll.py.
Za naš projekat se u njemu generiše populacija p od 100 jedinki čija arhitektura mreže je \[15, 20, 20, 3].
Ovo znači da u ulaznom sloju u mrežu postoji 15 neurona, u dva skrivena sloja po 20 neurona i u izlaznom sloju postoji 3 neurona.
Ulaznih 15 neurona predstavljaju trodimenzionalne vektore pozicije bube, rotacije bube, brzine bube, brzine rotacije bube i rotacije jednog krila.
Mreža na izlazu izbacuje novu rotaciju krila u sledećem trenutku.
Krila su podešena da se kreću simetrično tako da su dovoljni podaci samo za jedno krilo.
Ukoliko se aktivira opcija za nesimetrična krila, bilo bi potrebno 18 ulaznih neurona i 6 izlaznih.

Prvo se pravi populacija sa odabranim karakteristikama i nad njom se poziva funkcija run kojoj se prosledjuju fitnes funkcija, broj generacija, šansa za preuzimanje gena od drugog roditalja umesto prvog u fazi ukrštanja, šansa da se desi mutacija za svaki parametar neuralne mreže u mutation fazi, i slični parametri.
Takođe se prosleđuju i parametri vezani za čuvanje fajlova najboljih gena ili celih populacija.

U ovom fajlu je takođe implementirana i fitnes funkcija koju smo nazvali main.
Ona prima listu gena kao parametar.
Na osnovu te liste generiše listu neuralnih mreža.
Za svaku muvu, tj. gen, program poziva funkciju iz drugog fajla physics.py kojoj prosleđuje mrežu.
Ta funkcija vrši simulaciju kretanja muve pomoću mreže koju je dobila i vraća podatke o poziciji, rotaciji i ostalim parametrima muve u svakom trenutku simulacije.

Za svaki gen nakon izvršavanja pomenute funkcije računamo fitnes, npr. uzmemo da je fitnes jednak visini bube u poslednjem trenutku simulacije.
Nakon što ovo uradimo za svaku bubu, funkcija se završava.
Zatim se u fajlu geneticAlgo.py dešava stvaranje nove generacije gena za muve i opet se pokreće naša fitnes funkcija sa novim genima.

### Istraživanje i rezultati
- Cilj nam je bio da naučimo bubu da leti što više po y koordinati.

Prvi način koji smo koristili za procenu neuralnih mreža je bio da na postavimo da fitnes mreže bude jednak proseku visine bube u toku simulacije, tj. proseku y koordinate bube.
Dužinu simulacije smo ograničili na 3 sekunde.
Za simulacije 1 sekunde bube je bilo potrebno značajno manje od 1 sekunde realnog vremena.
Ovo je značajno uticalo na brzinu treniranja.

Kada smo pokrenuli kod, program je često pucao i na grafiku bube se videlo kako se u nekim delovima veoma brzo menja visina bube, kao što se može videti na sledećem grafiku: 

**Na svim graficima (osim ako drugačije nije naznačeno) će se nalaziti zavisnost visine bube od vremena proteklog od početka simulacije.**

![slika](/images/2022/simulacija-muve/Figure_1.svg)

Zaključili smo da je problem bio u tome što smo pomerali krila bube pomoću neuralne mreže svake milisekunde simulacije što je dovelo do toga da buba pokušava da pravi prebrze pokrete koji su mogli da postave odrećene promenjive na vrednosti koje odgovaraju beskonačnosti zbog kojih bi pri kasnijim proračunima došlo do pucanja programa.

Nakon što smo podesili da se krila kontrolišu na svakih 10 milisekundi, ovaj problem se više nije dešavao.
Dobili smo sledeći grafik:

![slika](/images/2022/simulacija-muve/Figure_2.svg)

Sa grafika se vidi da je buba uspela da proizvodi pokrete koji predstavljaju mahanje krilima, ali previše dopušta sebi da padne pre nego što opet napravi zamah krilima.
Ovo se takođe može protumačiti kao da buba nije naučila da optimalno vraća krila gore, tj. u poziciju odakle može da krene novi zamah, što je rezultovalo dodatnim spuštanjem visine.

Promenili smo program tako da nam fitnes bude jednak samo visini bube po y osi u poslednjem trenutku simjulacije, ovo je značajno poboljšalo visinu koju je buba dostizala (2-3 puta).
Grafik je onda izgledao ovako:

![slika](/images/2022/simulacija-muve/Figure_3.svg)

Vidi se da je buba uspela da nauči da na optimalan način vrati krila gore, bez da se dodatno spusti.

Nakon svakih x generacija smo čuvali sve podatke o položajima buba u generaciji što nam je omogućavalo da rekonstruišemo 3d prikaz simulacije.
Zapazili smo da buba kreće ukoso, pa smo odlučili da to popravimo.
Promenili smo malo fitnes bube:

$ fitness = Y_t - (\frac{1}{T} * \sum_{i = 1}^{T}(X_i)) * \frac{1}{5} - (\frac{1}{T} * \sum_{i = 1}^{T}(Y_i)) * \frac{1}{5}$

X, Y i Z su nizovi koordinata u svakoj milisekundi simulacije

T je vreme trajanja simulacije u milisekundama

Jednostavnije, fitnes nam je visina bube u poslednjem trenutku od koje oduzimamo prosečno odstupanje x i z koordinate bube od 0 podeljeno sa 5, jer nam je to nije toliko bitno koliko i visina bube.

Nakon treniranja 50 generacija buba na 3 sekunde dobili smo sledeći grafik koji predstavlja fitnes u odnosu na broj generacija:

![slika](/images/2022/simulacija-muve/fitness7.png)

**Imati na umu da fitnes više ne predstavlja samo visinu bube** 

Sledeći grafik predstavlja fitnes u odnosu na broj generacija, nakon treniranja od 1000 generacija:

![slika](/images/2022/simulacija-muve/figure1000.png)

Na kraju smo produžili dužinu simulacije na 30 sekundi i dobili smo sledeći video na kome se veoma lepo vidi buba maše krilima i kako se ne kreće toliko po x i z osama.

Simulacija kinematike se vrši sa vremenskim stepenom od 1ms.
Radi preciznije simulacije bržih pokreta mougće je još smanjiti $dt$, ali time se usporava brzina treniranja simulacije.

### Zaključak
Videli smo da se na ovaj način mogu postići prilično realni rezultati i da je algoritam sposoban da nauči ono što zahtevamo od njega.

Ova ideja može da se proširi i da se iskoristi da se napravi kontroler za bubu pomoću koga će korisnik moći da odredi u kom smeru će se buba kretati.
Buba bi trebalo da isprati komande koje joj korisnik zada.
Ovo se može postići korišćenjem više mreža koje treniramo pomoću istog algoritma ali sa drugačijim fitnes funkcijama.
Trebalo bi istrenirati mrežu gde buba lebdi oko jedne tačke, i mreže za kretanje u sva četiri pravca (ili 6 pravaca u slučaju da oćemo da podržimo i kretanje po y osi).
Za treniranje možemo da koristimo i različite početne parametre za bubu, tj. buba neće kretati uvek iz stanja mirovanja.
Ovo sve može da se spoji u kontroler.
