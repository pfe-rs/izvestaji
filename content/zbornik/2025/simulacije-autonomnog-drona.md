---
title: Simulacije autonomnog drona za praćenje objekta
---

Polaznice: Ana Bogdanović i Lana Lejić                    
Mentori: Aleksa Račić, Nikola Drakulić i Djordje Marijanović

Ključne reči: autonomni dron, praćenje objekta, Kalmanov filter, A* algoritam, simulacija, ArduPilot, Gazebo

### **Apstrakt:**

U ovom radu prikazan je razvoj i evaluacija simulacionog sistema za autonomno praćenje objekta pomoću bespilotne letelice. Sistem je razvijen u virtuelnom okruženju koje uključuje generisanje terena sa različitim nivoima kompleksnosti, modeliranje vidnog polja drona, kao i primenu algoritama za predikciju kretanja i planiranje putanje. Kalmanov filter korišćen je za predviđanje položaja cilja u trenucima kada objekat izlazi iz vidnog polja, dok je A\* algoritam omogućio efikasno planiranje rute u prisustvu prepreka. Simulacija je osmišljena da se koristi u okruženju ArduPilota u SITL režimu i vizuelno predstavljena u Gazebo okruženju. Analiza performansi obuhvatila je metrike poput vidljivosti objekta, tačnosti predikcije, održavanja sigurnosne distance i učestalosti prekida linije vida. Dobijeni rezultati ukazuju da razvijeni model može uspešno da kombinuje prediktivne i adaptivne pristupe, čime se stvaraju temelji za dalja istraživanja i unapređenja autonomnih sistema praćenja u realnim uslovima.

### **Abstract:**

This paper presents the development and evaluation of a simulation system for autonomous object tracking using an unmanned aerial vehicle. The system was designed within a virtual environment that includes terrain generation with varying levels of complexity, modeling of the drone’s field of view, as well as the implementation of motion prediction and path planning algorithms. A Kalman filter was employed to estimate the target’s position when the object leaves the field of view, while the A\* algorithm enabled efficient route planning in the presence of obstacles. The simulation was configured to operate in the ArduPilot environment under SITL mode and visually represented in the Gazebo simulator. Performance analysis covered metrics such as object visibility, prediction accuracy, maintenance of safe distance, and frequency of line-of-sight interruptions. The obtained results indicate that the developed model successfully integrates predictive and adaptive approaches, thereby laying the groundwork for further research and improvements of autonomous tracking systems in real-world conditions.

![](static/images/zbornik/2025/simulacije-autonomnog-drona/grafabs.svg)


### **1\. Uvod**

**—————————————————————————————————————————**

Razvoj bespilotnih letelica (UAV, *Unmanned Aerial Vehicle*) u poslednjim decenijama značajno je unapredio mogućnosti autonomnih sistema u različitim oblastima primene. Njihova upotreba obuhvata širok spektar aktivnosti od vojnih i bezbednosnih misija, preko pretrage i spasavanja, istraživanja terena i dostave, pa sve do sporta i zabave kroz automatsko snimanje aktivnosti. Upravo zbog ove univerzalnosti, autonomni dronovi postaju jedan od aktuelnih istraživačkih pravaca u oblasti robotike i veštačke inteligencije.

Jedan od važnih izazova u ovoj oblasti jeste problem praćenja objekata u dinamičnim i nepredvidivim okruženjima. Međutim, fizičko testiranje ovakvih algoritama može biti skupo, nepraktično i potencijalno destruktivno, što ističe značaj simulacionih okruženja za istraživanje i razvoj.

Ovaj projekat ima za cilj da razvije simulacioni sistem za autonomno praćenje objekta u virtuelnom prostoru. Dron u simulaciji koristi algoritme za planiranje putanje, prilagođavanje orijentacije i predikciju kretanja objekta, dok se sama kompleksnost sistema postepeno povećava. Poseban akcenat stavlja se na prilagođavanje položaja drona u zavisnosti od vidnog polja i prepreka u okruženju, kao i na procenu efikasnosti putem jasno definisanih metrika, poput preciznosti pozicioniranja, brzine reakcije i tačnosti detekcije.

Na ovaj način, projekat ne samo da doprinosi razumevanju procesa autonomnog praćenja objekata, već stvara osnovu za dalja istraživanja u pravcu integracije simulacionih i realnih sistema. Dobijeni rezultati mogu poslužiti kao polazna tačka za razvoj robustnijih algoritama u realnim uslovima, čime se približavamo praktičnoj upotrebi autonomnih dronova u složenim i kritičnim zadacima. Iako brojni radovi istražuju autonomno praćenje pomoću vizuelnih i prediktivnih algoritama, relativno mali broj njih integriše planiranje putanje i predikciju kretanja u jedinstvenom simulacionom okviru, što predstavlja cilj ovog istraživanja.

### **2\. Metodologija**

**—————————————————————————————————————————**

#### **2.1. Generisanje terena i njegova kompleksnost**

---

Za postizanje realistične simulacije, neophodno je definisati trodimenzionalni teren koji uključuje prepreke različitog oblika, položaja i dimenzija. Generisanje ovakvog terena omogućava modeliranje okruženja u kojem se dron i objekti kreću, čime se stvaraju uslovi koji su analogni stvarnim urbanim i prirodnim scenarijima. Prepreke u prostoru imaju ulogu fizičkih barijera koje ograničavaju vidno polje, otežavaju planiranje putanje i direktno utiču na ponašanje algoritma za navigaciju. Tereni korišćeni u simulaciji dizajnirani su ručno, kako bi se omogućila kontrola nad složenošću okruženja i precizno ispitalo ponašanje sistema u različitim uslovima.

U okviru simulacije, dron i objekat se definišu kao tačkasti entiteti sa pridruženim parametrima položaja i brzine. Njihovo kretanje odvija se diskretno, kroz vremenske korake pri čemu se pozicije ažuriraju na osnovu vektora brzine i izabranog pravca. Ovakav pristup omogućava da se svaka promena stanja prikaže kroz animaciju u kojoj se jasno vizuelizuje kako se dron kreće prema cilju, kako objekat menja pravac i kako prepreke utiču na dinamiku interakcije. Animacija tako postaje sredstvo za praćenje ponašanja sistema u realnom vremenu, dok se brzine i pravci kretanja prikazuju preko vektorskih odnosa između entiteta.

Merenje kompleksnosti terena služi za buduću evaluaciju merenja i poredjenje istih sa drugim simulacijama. Od težine konfiguracije zavisi koliko je zadatak praćenja i navigacije zahtevan. Kompleksnost se može definisati kombinacijom gustine prepreka i njihove razuđenosti u prostoru. Gustina opisuje broj prepreka po jedinici zapremine ili u odnosu na unapred definisan maksimalni broj, dok razuđenost zavisi od prosečne udaljenosti između prepreka. Teren sa malim brojem, ali međusobno blisko raspoređenih prepreka može biti podjednako složen kao i teren sa velikim brojem razuđenih barijera.

Za kvantitativnu procenu koristi se metrika:

$$
K = \alpha \cdot \frac{N}{N_{\text{max}}} \+ \beta \cdot \left(1 - \min\!\left(\frac{d_{\text{avg}}}{d_{\text{max}}},\,1\right)\right)
$$

gde $N$ označava broj prepreka, $N\_{max}$maksimalni dozvoljeni broj prepreka, $avg\_{d}$ prosečnu udaljenost između centara prepreka, a $d\_{max}$ maksimalnu moguću udaljenost u okviru mreže. Težinski koeficijenti $\alpha$ i $\beta$ omogućavaju balansiranje uticaja gustine i razuđenosti. Dobijena vrednost $K$ potom se skalarno normalizuje i prevodi u diskretnu ocenu složenosti u rasponu od 1 (najlakše) do 5 (najzahtevnije).

![Slika 1\. primeri terena sa različitom ocenom kompleksnosti](static/images/zbornik/2025/simulacije-autonomnog-drona/slika5.png)

#### **2.2. Model vidnog polja**

---

Vidno polje (engl. *field of view*, FOV) predstavlja jedan od osnovnih parametara u modeliranju percepcije autonomnih letelica. U kontekstu simulacija, ono određuje prostor unutar kojeg bespilotna letelica može da detektuje i prati objekat, uzimajući u obzir prostorne i geometrijske odnose između letelice, prepreka i posmatranih ciljeva. FOV je osnovni filter koji razdvaja informacije koje su UAV-u dostupne od onih koje ostaju „skrivene“ zbog udaljenosti ili zaklona.

Definisanje vidnog polja podrazumeva tri elementa: radijus, ugaonu širinu i liniju vidljivosti. Radijus određuje maksimalnu udaljenost do koje letelica može da registruje objekat, što je analogno dometu senzora u realnim sistemima. Ugaona širina opisuje prostorni sektor u kojem je percepcija aktivna, čime se modelira prirodno ograničenje senzora, poput kamere ili lidara. Linija vidljivosti podrazumeva proveru da li se između UAV-a i posmatranog objekta nalazi prepreka koja blokira detekciju, zbog čega formiranje vidnog polja ne zavisi samo od geometrijskih parametara, već i od strukture okruženja. Pored radijusa i ugaone širine, vidno polje ima i visinsko ograničenje, pri čemu objekat koji se nalazi iznad određene visinske ravni u odnosu na UAV ostaje nedetektovan.

Kada se objekat nalazi unutar vidnog polja, UAV može da registruje njegovo postojanje i tačnu poziciju, što omogućava izračunavanje udaljenosti i ugla do objekta u odnosu na sopstvenu orijentaciju. Na osnovu sukcesivnih merenja, UAV može dalje da proceni smer i brzinu kretanja objekta.

Vidno polje ne služi samo kao ograničenje percepcije, već i kao mehanizam za generisanje niza parametara (lokacija, ugao, udaljenost, brzina i predikcija položaja), čime se simulacioni model približava realnim uslovima. Drugim rečima, UAV ne donosi odluke na osnovu „sveznajuće“ perspektive, već na osnovu informacija koje bi zaista imao na raspolaganju u stvarnom okruženju.

![Slika 2\. grafički prikaz modela vidnog polja drona][static/images/zbornik/2025/simulacije-autonomnog-drona/slika2.png]

#### 

#### **2.3.  Kalmanov filter**

---

Kalmanov filter predstavlja matematički algoritam koji omogućava procenu trenutnog stanja sistema koji se menja tokom vremena, čak i u uslovima kada su merenja privremeno nedostupna. U kontekstu praćenja objekata pomoću kamere, koristi se za predikciju položaja objekta u trenucima kada objekat privremeno nestane iz vidnog polja, na primer zbog prepreke ili drugih faktora koji definišu vidno polje.

Dok je objekat vidljiv, informacije o njegovoj poziciji i brzini se dobijaju iz senzora(kamere), prikupljaju i koriste za formiranje modela kretanja. Kada objekat izađe iz vidnog polja, Kalmanov filter koristi model kretanja, poslednju poznatu pozicij i momentum kako bi predvideo verovatnu narednu poziciju objekta.

Kalmanov filter se sastoji od dva osnovna koraka:

1. **Predikcija:**  
   * Na osnovu prethodnog stanja i modela kretanja, predviđa se sledeće stanje objekta.  
   * Računa se i očekivana greška te predikcije.

2. **Ažuriranje:**

   * Kada je dostupno novo merenje, filter ažurira svoju procenu koristeći razliku između predviđe i stvarne vrednosti(merenja).

   * Ta nova procena postaje osnova za sledeću iteraciju.

Kada objekat privremeno nestane iz kadra, Kalmanov filter nastavlja da generiše predviđanja o njegovoj poziciji, čime omogućava nastavak praćenja bez prekida,gde je i sama poenta da dron pronadje objekat nakon sto ga izgubi iz vida. Algoritam je izuzetno efikasan i može raditi u realnom vremenu, što je ključno za video obradu i praćenje objekata.

Jednačina kalmanovog filtera:

1. **Predikcija**   
   Stanje sistema:

    $$\hat{x}_{k|k-1} = F_k\,\hat{x}_{k-1|k-1} + B_k\,u_k $$


   Kovarijansa greske:

   $$P_{k|k-1} = F_k\,P_{k-1|k-1}\,F_k^{T} + Q_k $$

2. **Ažuriranje**  
   Kalmanovo pojačanje
   $$K_k = P_{k|k-1} H_k^{T} \left(H_k P_{k|k-1} H_k^{T} + R_k \right)^{-1}$$
 

   Ispravljeno stanje
   $$\hat{x}_{k|k} = \hat{x}_{k|k-1} + K_k \left(z_k - H_k \hat{x}_{k|k-1}\right)$$

   Ispravljena kovarijansa
   $$P_{k|k} = \left(I - K_k H_k\right) P_{k|k-1}$$

$ \hat{x} $ → procena stanja (pozicija, brzina, …)

$ F_k $ → matrica prelaza stanja (model kretanja)

$ B_k u_k $ → ulazni signal (ako postoji)

$ P $ → kovarijansa greške procene

$ Q_k $ → šum procesa (nesigurnost modela)

$ z_k $ → merenje iz senzora (kamera)

$ H_k $ → matrica koja povezuje stanje i merenja

$ R_k $→ šum merenja (nesigurnost senzora)

$ K_k $ → Kalmanovo pojačanje

#### **2.4. Astar**

A\* (A-star) algoritam koristi se za pronalaženje najkraće putanje između dve tačke u prostoru, i predstavlja jednu od najefikasnijih metoda za pretragu u grafovima. U okviru ovog projekta, A\* algoritam je implementiran za određivanje optimalne putanje od trenutne pozicije drona do ciljanog objekta koji se nalazi u njegovom vidnom polju.

A\* algoritam funkcioniše tako što prostor u kojem se dron kreće pretvara u graf, gde su čvorovi (tačke) moguće pozicije, a grane predstavljaju dozvoljene prelaze između tih pozicija, odnosno sve moguće pomeraje u 3D sistemu. Prilikom pretrage, algoritam istovremeno uzima u obzir:

* **Stvarnu udaljenost** pređenu od početne tačke do trenutne pozicije, i

* **Procenu preostale udaljenosti** do ciljne tačke, koristeći heuristiku.

Za svaki čvor odnosno poziciju u grafu, računa se ukupna vrednost funkcije:

$$f(n)=g(n)+h(n)$$

Gde je:

* **$g(n)$** – stvarna udaljenost od pocetka do čvora *n* 

* **$h(n)$** – heuristička procena udaljenosti od čvora *n* do cilja

* **$f(n)$** – kombinuje stvarnu i heuristicku udaljenost

A\* algoritam pri svakom koraku bira sledeći čvor za istraživanje na osnovu najmanje vrednosti f(n), čime efikasno vodi drona ka objektu izbegavajući nepotrebne pravce.

U ovom projektu, A\* je korišćen samo kada se objekat nalazi u vidnom polju drona, čime se izbegava bespotrebno planiranje u nepoznatom prostoru. Kada se objekat detektuje, pozicije drona i objekta se mapiraju na odgovarajuće čvorove grafa, nakon čega algoritam izračunava optimalnu putanju koju dron treba da pređe kako bi stigao do cilja.

Ova metoda omogućava brzo i pouzdano pronalaženje najkraće rute u poznatom okruženju, uz izbegavanje prepreka i smanjenje ukupnog vremena dolaska do cilja.

#### **2.5. Detekcija i prevencija kolizije**

---

U modelu, dron konstantno računa vektor kretanja ka objektu. U obzir uzima trenutnu poziciju objekta i predikcije iz Kalman filtera kada je objekat privremeno van vidnog polja. Minimalna distanca do objekta se održava kroz skaliranje vektora kretanja. Dron ne dostiže tačnu poziciju objekta, već se pozicionira na unapred definisanoj sigurnosnoj udaljenosti. Ovo omogućava kontrolu brzine približavanja: ukoliko dron mora da prati objekat koji se kreće znatno sporije, on usporava kretanje tako da bezbednosna distanca ostane konstantna. U slučaju da objekat stane ili se zabije u prepreku, dron se isto zaustavlja na minimalnoj distanci od njega.

![Slika 3\.  grafički prikaz dobijanja ciljne pozicije drona][static/images/zbornik/2025/simulacije-autonomnog-drona/slika4.png]


Prevencija sudara sa statičkim preprekama zasniva se na 3D mreži okruženja koja označava zauzete i slobodne prostore. Svaki planirani korak drona se testira kroz funkciju detekcije kolizije, koja proverava da li predložena pozicija ulazi u prostor označen kao zauzet. Ukoliko postoji prepreka, algoritam generiše alternativne vektore kretanja u susednim pravcima (gore, dole, levo, desno, napred, nazad) čime dron pronalazi bezbednu putanju oko prepreke. Ako nijedna alternativna opcija nije dostupna, dron zaustavlja kretanje, čime se izbegava sudar.

Ovakav pristup kombinuje prediktivnu logiku, adaptivno planiranje putanje i proveru vidljivosti cilja. Sistem omogućava da dron kontinuirano prati cilj i reaguje na neočekivane prepreke, održavajući sigurnosnu udaljenost i smanjujući rizik od kolizija čak i u složenim trodimenzionalnim okruženjima.

![Slika 4\.  grafički prikaz testiranja mogućih putanja][static/images/zbornik/2025/simulacije-autonomnog-drona/slika3.png]


#### **2.6 Simulacija u realnom fizičkom okruzenju**

Korišćenjem ArduPilota u SITL režimu, moguće je simulirati ponašanje drona bez fizičkog uređaja, on obrađuje sve komandne signale i senzorske podatke, simulira ponašanje drona (npr. stabilizaciju, let, izvršavanje komandi). ArduPilot emituje podatke i prima komande putem MAVLink protokola. Komande dolaze iz koda pisanog u dronekit-u. Kroz DroneKit, korisnik može programirati automatske misije i kontrolisati dron u realnom vremenu. Simulacija leta i okruženje prikazani su u Gazeboo simulatoru, omogućavajući korisniku da vizualno prati kretanje drona i testira sve algoritme bez rizika i fizičke opreme.

# **3\. Rezultati**

**—————————————————————————————————————————**

Analiza performansi modela detekcije i prevencije kolizija zasniva se na nekoliko metrika koje omogućavaju kvantifikaciju efikasnosti drona u praćenju objekta i izbegavanju prepreka. Vidljivost objekta u svakom koraku simulacije pokazuje koliko dugo UAV može da registruje cilj unutar svog vidnog polja, što je važno za procenu pouzdanosti senzornog sistema i strategije praćenja. Kada objekat često izlazi iz vidnog polja, dron mora da se osloni na predikciju Kalmanovog filtera, što može povećati rizik od grešaka u kretanju. Udaljenost drona od objekta u svakom koraku pruža uvid u održavanje minimalne sigurnosne zone. Prevelika udaljenost smanjuje preciznost praćenja, dok prebliska može povećati rizik od kolizije. Praćenje greške Kalmanovog filtera, odnosno razlike između predikovanog i stvarnog položaja objekta, omogućava procenu tačnosti prediktivnog modela. To je naročito značajno kada objekat izlazi iz vidnog polja ili se kreće dinamično. Ugao do objekta beleži promene u poziciji cilja u odnosu na dron i odražava manevarske zahteve na UAV, omogućavajući analizu glatkoće i stabilnosti kretanja. Broj prekida linije vida, koji se javlja kada objekat bude zaklonjen ili se udalji od vidnog polja, ukazuje na kompleksnost simulacionog scenarija i efikasnost strategije izbegavanja prepreka. Česti prekidi zahtevaju veću zavisnost od predikcije. Sve ove metrike zajedno omogućavaju sveobuhvatnu evaluaciju performansi autonomnog sistema.

![Slika 5\.  Merenja dobijena iz simulacije na terenu kompleksnosti 4.2][static/images/zbornik/2025/simulacije-autonomnog-drona/slika6.pnggit a]


# **4\. Diskusija**

**—————————————————————————————————————————**

Simulacija je pokazala da UAV uspešno može da prati objekat u okruzenjima različite  kompleksnosti uz očuvanje sigurnosne distance. Integracija Kalmanovog filtera omogućila je da se praćenje nastavi i kada objekat privremeno izađe iz vidnog polja, što potvrđuje robusnost sistema u realnim scenarijima.

Međutim, važno je naglasiti da trenutna implementacija još uvek nije u potpunosti preneta u Gazebo okruženje sa punom fizičkom dinamikom. Za sada sistem omogućava generisanje terena i evaluaciju njegove kompleksnosti, dok se objekat simulira jednim dronom čije je kretanje unapred definisano i proizvoljno. Dalja unapredjenja uključuju prenos logike praćenja na drugog drona koji bi služio da prati objekat kroz teren i uvodjenje prepoznavanja objekata i prepreka korišćenjem kamere i ostalih senzora drona.

Takodje, kroz implementaciju naprednih mreža za detekciju objekata poput YOLO ili FRCNN, simulacije bi postale još preciznije u prepoznavanju i praćenju objekata, unapredili bi  sisteme za izbegavanje prepreka kako bi dron mogao efikasnije da se kreće kroz kompleksne scenarije. Na kraju, primena ovog sistema na pravom dronu bila bi korak ka stvaranju potpuno funkcionalnog, autonomnog sistema za praćenje i snimanje u stvarnim uslovima.

# **5\.  Zaključak**

**—————————————————————————————————————————**  
U ovom radu razvijen je simulacioni sistem za autonomno praćenje objekta pomoću bespilotne letelice, korišćenjem kombinacije algoritama za predikciju kretanja i planiranje putanje u virtuelnom okruženju. Implementacija Kalmanovog filtera omogućila je kontinuirano praćenje cilja i u situacijama kada objekat izlazi iz vidnog polja, dok je A\* algoritam omogućio efikasno izbegavanje prepreka i planiranje optimalne rute. Simulacija je uspešno realizovana u ArduPilot SITL režimu i prikazana u Gazebo okruženju, omogućivši testiranje algoritama bez potrebe za fizičkom letelicom.

Dobijeni rezultati pokazuju da sistem može da reaguje adaptivno u realnom vremenu, uz očuvanje sigurnosne distance i efikasno izbegavanje kolizija. Korišćene metrike pokazale su stabilnost i tačnost sistema u različitim uslovima složenosti terena, što ukazuje na potencijal za njegovu primenu u realnim uslovima.

# **6\. Literatura**

**—————————————————————————————————————————**

1. Y. He, T. Hou, and M. Wang, “A new method for unmanned aerial vehicle path planning in complex environments,” *Scientific Reports*, vol. 14, Art. no. 9257, 2024\. DOI:10.1038/s41598-024-60051-4. ([Nature](https://www.nature.com/articles/s41598-024-60051-4?utm_source=chatgpt.com))

2. G. Gugan and A. Haque, “Path Planning for Autonomous Drones: Challenges and Future Directions,” *Drones*, vol. 7, no. 3, Art. no. 169, 2023\. DOI:10.3390/drones7030169. ([MDPI](https://www.mdpi.com/2504-446X/7/3/169?utm_source=chatgpt.com))

3. H. Liu, X. Li, M. Fan, G. Wu, W. Pedrycz, and P. N. Suganthan, “An Autonomous Path Planning Method for Unmanned Aerial Vehicle based on A Tangent Intersection and Target Guidance Strategy,” arXiv preprint arXiv:2006.04103, 2020\. ([ResearchGate](https://www.researchgate.net/publication/380002995_A_new_method_for_unmanned_aerial_vehicle_path_planning_in_complex_environments?utm_source=chatgpt.com))

4. F. C. Chen, G. Gugan, R. Solis-Oba and A. Haque, "Simple and Efficient Algorithm for Drone Path Planning," *ICC 2021 \- IEEE International Conference on Communications*, Montreal, QC, Canada, 2021, pp. 1-6, doi: 10.1109/ICC42927.2021.9500370.

5. Q. Zhou and G. Liu, "UAV Path Planning Based on the Combination of A-star Algorithm and RRT-star Algorithm," *2022 IEEE International Conference on Unmanned Systems (ICUS)*, Guangzhou, China, 2022, pp. 146-151, doi: 10.1109/ICUS55513.2022.9986703.

6. ArduPilot Dev Team, “Using SITL for ArduPilot Testing,” ArduPilot Developer Documentation. \[Online\]. Available: [https://ardupilot.org/dev/docs/using-sitl-for-ardupilot-testing.html](https://ardupilot.org/dev/docs/using-sitl-for-ardupilot-testing.html)

7. DroneKit Project, “DroneKit-SITL,” GitHub. \[Online\]. Available: [https://github.com/dronekit/dronekit-sitl](https://github.com/dronekit/dronekit-sitl)

8. (K. Amer, M. Samy, M. Shaker and M. ElHelw), “Quadcopter Drone for Vision-Based Autonomous Target Following,” arXiv preprint, year. \[Online\]. Available: [https://arxiv.org/pdf/1905.01657](https://arxiv.org/pdf/1905.01657)

9. A. Boonsongsrikul et al., “Real-Time Human Motion Tracking by Tello EDU Drone,” *Sensors*, vol. 23, no. 2, Art. 897, 2023\. DOI:10.3390/s23020897. ([MDPI](https://www.mdpi.com/1424-8220/23/2/897?utm_source=chatgpt.com))
