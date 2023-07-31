---
title: Simulacija muve
summary: Simulacija muve je projekat rađen na letnjem kampu za stare polaznike 2022. godine od Aleksandra Raškovića i Tadeja Ristića.
---

### Apstrakt


### Apstrakt na engleskom


### Uvod

Cilj projekta "Simulacija muve" je da implementiramo fizičku simulaciju i unutar nje pomoću mašinskog učenja (*engl.* machine learning, ML) naučimo muvu da leti.
Za učenje muve koristimo neuralnu mrežu u kombinaciji sa genetskim algoritmom.
Neuralne mreže i genetski algoritmi se često koriste za treniranje simulacija, kao npr. simulacija hodanja ili trčanja.
U našem slučaju, napravljen je ML model koji se koristi za kontrolisanje krila muve što onda dovodi do pomeranja muve zbog simulacije sile otpora vazduha na muvu.

### Aparatura i metoda - Simulacija fizike

#### Kinematika

Sam model muve predstavljen je pozicijama karakterističnih tačaka u lokalnom 3D prostoru.
Krila su definisana pomoću koordinata 3 tačke koje predstavljaju ravan krila.
Telo muve čini 8 tačaka, jedna za svako teme kvadra koji čini telo muve.
Za model muve je vezan njen lokalni koordinatni sistem.
Taj lokalni koordinatni sistem ima svoju poziciju, i brzinu u globalnom koordinatnom sistemu i na njemu se primenjuju zakoni pravolinijskog i rotacionog promenljivog kretanja.
Lokalne koordinate muve se konvertuju u globalni koordinatni sistem pomoću homogenih matrica translacije i rotacije, radi prikaza u 3D prostoru i daljeg računanja u dinamici.

Vektor koji predstavlja poziciju neke tačke muve u globalnom prostoru dobijamo tako što vektor lokalnih koordinata pomnožimo matricom $M$.
Matricu $M$ dobijamo množenjem matrica translacije gde je pomeraj zapravo pozicija muve i matricu rotacije gde je ugao rotacije ugao rotacije muve oko koordinatnog početka njenog lokalnog koordinatnog sistema.

$$M = T \times R$$
U ovoj formuli $T$ je matrica translacije, a $R$ matrica rotacije.

Sličan metod se koristi i za rotaciju krila u lokalnom koordinatnom sistemu muve.
Umesto da tačka oko koje se krilo rotira bude koordinatni početak, za tačku rotacije se uzima "zglob" tj. tačka kojom je krilo povezano sa telom muve.
Rotacija krila je ograničena svojim maksimalnim uglom i brzinom pomeranja, kako krilo ne bi moglo da pravi pokrete koji su nemogući u realnom svetu.

#### Dinamika

Drugi deo fizičke simulacije jeste dinamika.
Originalna zamisao je bila da simuliramo vazduh kao fluid, ali zbog kompleksnosti programa i brzine treniranja neuralne mreže smo pojednostavili model, tj. koristili smo jednačinu sile otpora sredine.

$$\textbf{F} = \frac{1}{2}\rho \textbf{v}|\textbf{v}|C_D\textbf{A}$$

$C_D$ je koeficijent sile otpora,
on zavisi od oblika tela i njegovog ugla u odnosu na pravac kretanja.
Umesto računanja tog koeficijenta za svaki ugao, ili uzimanja poznatih tabličnih vrednosti, u formulu je dodat kosinus ugla krila kao aproksimacija.

$\textbf{A}$ predstavlja vektor projekcija površine krila na x, y i z osu globalnog koordinatnog sistema, dok je $\textbf{v}$ vektor komponenti brzine krila.
$\rho$ je gustina vazduha.

Druga aproksimacija koja je korištena je kod računanja momenata sila i ugaonog ubrzanja.
Umesto da se uvek izračunava osa oko koje se rotira muva, za osu rotacije uvek uzimamo centar mase muve.

Iz sila otpora sredine i gravitacione sile, možemo da izračunamo linearno i rotaciono ubrzanje sistema muve, pomoću koje je računata linearna i ugaona promena brzine muve za svaki vremenski period $dt$.

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

Fitnes funkcija je funkcija koju implementira korisnik i koja treba da odredi koliko je dobar svaki gen tj. mreža za određeni zadatak. Više o ovoj funkciji malo kasnije.

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
Neuronska mreža u našem slučaju služi za određivanje položaja krila bube u sledećem trenutku simulacije na osnovu trenutnih prostornih parametara bube i njenih krila.
U opštem slučaju se ovako implementirana mreža može koristiti za veliki broj zadataka.

Za neuronsku mrežu je implementirana propagacija unapred (eng. feedforward).
Propagacija unazad (eng. backpropagatoin) nije potrebna jer se mreža trenira genetskim algoritmom.

Za svaki sloj mreže, osim ulaznog, imamo dve matrice parametara (ovde se reč parametar ne odnosi na parametre koji se prosleđuju funkcijama već na parametre mreže koji se treniraju).
Jedna je matrica težina, dok je druga matrica zapravo vektor sklonosti (eng. bias).
Sve ove matrice se čuvaju u rečniku.
Slojevi mreže se indeksiraju od nula tako da su parametri u rečniku sačuvani kao $W1, b1, W2, b2, ..., Wl-1, bl-1$, ako je $l$ broj slojeva mreže.
Obratite pažnju na to da indeksiranje kreće od $0$ i da nulti (ulazni) sloj u mrežu nema parametre.

Označimo sa $W[k]_{ij}$ težinu veze između $i$-tog neurona iz trenutnog ($k$-tog) sloja mreže sa $j$-tim neuronom iz prethodnog ($k-1$) sloja.
Onda format za matricu težina $k$-tog sloja neuronske mreže izgleda ovako:

|  |  |  |  |
| ----- | ----- | ----- | ----- |
| $W[k]_{00}$ | $W[k]_{01}$ | ... | $W[k]_{0m}$ |
| $W[k]_{10}$ | $W[k]_{11}$ | ... | $W[k]_{1m}$ |
| ... | ... | ... | ... |
| $W[k]_{n0}$ | $W[k]_{n1}$ | ... | $W[k]_{nm}$ |

Ovde imamo ukupno n neurona u trenutnom ($k$-tom) sloju neuronske mreže i m neurona u prethodnom ($k-1$) sloju.

Označimo sa $b[k]_{i}$ sklonost tj. bias $i$-tog neurona trenutnog ($k$-tog) sloja neuronske mreže.
Onda format za vektor sklonosti tj. bias-ova $k$-tog sloja neuronske mreže izgleda ovako:

|  |
| ----- |
| $b[k]_{0}$ |
| $b[k]_{1}$ |
| ... |
| $b[k]_{n}$ |

Ovde imamo ukupno n neurona u trenutnom ($k$-tom) sloju neuronske mreže.

Glavna funkcija u mreži je funkcija za aktivaciju.
Njoj se kao parametar prosleđuje matrica ulaznih podataka koja je ranije opisana u zaglavlju "Opis interfejsa za treniranje". Izlaz ove funkcije je izlaz mreže za dati ulaz.

Imaćemo dva pomoćna niza matrica, $A$ i $Z$. Oni će biti dužine $l$ gde je $l$ broj slojeva u mreži.

Matrica ulaznih podataka se prepisuje u $A[0]$.

Za svaki sloj $k$, gde $k$ ide od $1$ do $l$ se izvršava jedan korak propagacije unapred koji izgleda ovako:

$$
Z[k] = W[k] \times A[k-1] + b[k]
$$
$$
A[k] = tanh(Z[k])
$$

**Imati na umu da je $\times$ operacija množenja matrica** 

Nelinearna funkcija može da bude i nešto drugo umesto $tanh$, kao što su $sigmoid$ ili $ReLU$.

Na kraju smo dobili izlaz naše mreže, matricu $A[l]$.

Izlaz mreže je istog formata kao i ulazna matrica za mrežu, samo što umesto ulaznih podataka idu izlazni.


#### Genetski algoritam
Sve informacije o nekoj mreži se nalaze u objektu tipa Genome koji smo implementirali, koji je zapravo njen gen.
Objekat gena sadrži razne podatke o mreži u sebi, kao i sve parametre mreže.
Pri pravljenju populacije svi parametri dobijaju nasumične vrednosti po gausovoj (normalnoj) raspodeli sa standardnom devijacijom koju možemo da podešavamo.

##### Fitnes funkcija

Kao što smo već rekli, fitnes funkcija je funkcija koju implementira korisnik i koja treba da odredi koliko je dobar svaki gen tj. mreža za određeni zadatak.

Ona će biti pozvana jednom za svaku generaciju, biće joj prosleđena lista gena.
Korisnik pomoću svakog gena može da generiše neuralnu mrežu koristeći funkciju koju smo implementirali.
Fitnes funkcija treba da promeni fitness član genoma u listi za svaki genom prema želji korisnika.
Korisnik može da odabere na koji način će oceniti svaku mrežu.
Kako bi koristio mreže korisnik može na objektu mreže koji je inicijalizovao pomoću gena da pozove funkciju Activate i da joj prosledi ulazne podatke za mrežu u formatu matrice.
U svakoj koloni matrice je zaseban set ulaznih podataka mreže (input features).
Imamo više kolona u slučaju da kroz istu mrežu želimo odjednom da prosledimo više setova aktivacija.
U našem slučaju imaćemo samo jednu kolonu jer obrađujemo samo ulazne podatke od jedne bube za svaku mrežu.
Funkcija Activate nam vraća vektor sličnog formata kao na ulazu sa izlaznim vrednostima mreže za svaki set.


Generisanje populacije za novu generaciju gena se sastoji iz 3 faze
 - selekcija
 - ukrštanje
 - mutacija

##### Faza selekcije
Nakon što se završi fitnes funkcija program bira 10% najboljih gena, poređanih po fitnesu koji im je dodeljen u fitnes funkciji.
Njih stavljamo u niz koji ćemo nazvati "bazenom za ukrštanje". Ove gene ćemo koristiti za generisanje nove populacije gena.

##### Faza ukrštanja
Novi geni se generišu tako što se nasumično biraju dva "rotitelja" iz "bazena za ukrštanje", zatim se na njima vrši ukrštanje i novi gen koji se dobije se dodaje na novu populaciju. Ovo ponavljamo dok ne popunimo populaciju istim brojem gena kao što je bio u prethodnoj generaciji.

Novi gen se od dva roditelja može dobiti na više načina.
Konkretno u našem slučaju za svaki element novog gena postoji npr. $x$ šanse da će preuzeti vrednost tog elementa iz gena prvog roditelja, tj $1-x$ šanse da će ga preuzeti iz drugog, gde je $x$ jedan od parametara koji se prosleđuje run funkciji.
<!-->
Parametri nove mreže mogu da se dobiju na razne načine.
Konkretno u našem slučaju postoji neki broj, označimo ga sa $x$, koji označava šansu za svaki parametar mreže da bude iz prvog roditelja. Šansa da gen bude iz drugog roditelja je samim tim $1-x$.
<-->

##### Faza mutacije
Nakon faze ukrštanja vrše se nasumične mutacije na svakom od novih gena.
Mutacija podrazumeva da vrednosti na nasumičnim mestima u genu postavimo na neke nove nasumične vrednosti.
Učestalost mutacija u novom genu je takođe jedan od parametara koji se moše proslediti run funkciji.

Ova faza je bitna kako bi održali diverzitet populacije, tj. kako se ne bi cela populacija svela na par sličnih gena i tako stagnirala.

##### Dodatna faza
Umesto da svi geni iz nove populacije budu dobijeni na prethodni način, program 5% najboljih gena iz prošle generacije prepiše bez promena, kako se ne bi desilo da kroz prethodne faze izgubimo dosadašnji napredak.


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

Promenili smo program tako da nam fitnes bude jednak samo visini bube po y osi u poslednjem trenutku simjulacije, ovo je značanjno poboljšalo visinu koju je buba dostizala (2-3 puta).
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
Trebalo bi istrenirati mrežu gde buba lebdi oko jedne tačke, i mreže za kretanje u sva četiri pravca (ili 6 pravaca u slučaju da želimo da omogućimo i kretanje po y osi).
Za treniranje možemo da koristimo i različite početne parametre za bubu, tj. buba neće kretati uvek iz stanja mirovanja pri određivanju svog funkcije.
Ovako istrenirane mreže se na kraju mogu spojiti u jedan kontroler za bubu gde se pri određenim komandama pokreću i koriste određene mreže za kretanje bube.