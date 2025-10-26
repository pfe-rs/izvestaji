---
title: Maze solving robot
summary: Maze solving robot je projekat rađen na letnjem kampu za stare polaznike 2025. godine čiji su autori Anastasija Rajković i Jovana Trkulja.
svg_image: /images/2025/maze-solving-robot/graficki-apstrakt.svg
---


###### Autori
Jovana Trkulja, Anastasija Rajković
###### Mentori 
Bojana Malešević, Vladan Bašić, Dimitrije Pešić, Đorđe Manojlović


## Apstrakt 

Ovaj rad prikazuje parcijalnu realizaciju simulacije robota koji rešava lavirint korišćenjem *SLAM* algoritama [^1][^3][^4]. Simulirani *LIDAR* senzor [^6][^2] omogućava detekciju prepreka i generisanje *point-cloud* [^7] mape, dok algoritmi *Split and Merge* [^5] i *Seeded Region Growing* [^7] omogućavaju segmentaciju linija zidova. Robot se inicijalno postavlja klikom miša i koristi *frontier-based* (pristup zasnovan na granicama neistraženih oblasti) strategiju kretanja za istraživanje prostora. Zbog vremenskog ograničenja i nemodularnosti koda, projekat je ostao parcijalan, sa ograničenim testiranjem i bez kvantitativne evaluacije. Ipak, dobijeni rezultati pokazuju osnovnu funkcionalnost delova sistema i pružaju čvrstu osnovu za dalji razvoj, uključujući optimizaciju mapiranja, modularniji dizajn koda i primenu metrika performansi.


## Abstract 

This work presents a partial implementation of a maze-solving robot simulation using SLAM algorithms. A simulated LIDAR sensor enables obstacle detection and generation of a point-cloud map, while Split and Merge and Seeded Region Growing algorithms provide line segmentation of maze walls. The robot is initially positioned via mouse click and navigates using a frontier-based exploration strategy. Due to time constraints and non-modular code, the project remains partial, with limited testing and no quantitative evaluation. Nevertheless, the results demonstrate the basic functionality of the system and provide a solid foundation for further development, including map optimization, modular code design, and implementation of performance metrics.


![Slika 1. Grafički apstrakt](/images/2025/maze-solving-robot/graficki-apstrakt.svg) **Slika 1.** Grafički apstrakt simulacije robota u lavirintu.


## 1. Uvod 

Autonomni roboti predstavljaju jedno od najaktivnijih polja istraživanja u oblasti savremene robotike i veštačke inteligencije. Njihova primena obuhvata širok spektar oblasti, od industrijske automatizacije, preko autonomnih vozila i dronova, do istraživanja prostora nepristupačnih čoveku. Ključni izazov u razvoju ovakvih sistema jeste sposobnost robota da se samostalno orijentiše u nepoznatom okruženju. Ovaj problem je široko poznat kao SLAM (eng. Simultaneous Localization and Mapping).

SLAM podrazumeva da robot, bez prethodnog znanja o prostoru, izgradi mapu svog okruženja dok u isto vreme procenjuje sopstvenu poziciju u toj mapi. Ovaj zadatak je veoma složen jer zahteva obradu podataka iz senzora, efikasnu reprezentaciju prostora i metode za smanjenje grešaka koje se akumuliraju tokom kretanja.

Primena SLAM metoda u realnim sistemima suočava se sa izazovima kao što su ograničene mogućnosti senzora, akumulacija grešaka u proceni položaja i složenost algoritama potrebnih za obradu podataka u realnom vremenu.

Cilj ovog rada bio je da se kroz simulaciju u Python okruženju razvije pojednostavljen model robota koji rešava lavirint koristeći osnovne principe SLAM-a. Fokus je stavljen na implementaciju detekcije prepreka i mapiranja prostora na osnovu LIDAR podataka, kao i na razmatranje izazova i ograničenja koja se javljaju prilikom ovakvog pristupa.


## 2. Aparatura 

Projekat je realizovan u obliku softverske simulacije. Kao razvojno okruženje korišćen je Visual Studio Code, dok je implementacija izvršena u programskom jeziku Python (verzija 3.11). Od biblioteka korišćene su:

 - Pygame – za grafičku simulaciju okruženja i vizuelizaciju kretanja robota,
 - NumPy – za numeričke proračune i obradu podataka,
 - standardne Python biblioteke (math, random).


Simulacija je izvedena na laptop računaru HP EliteBook 850 G3 sledećih specifikacija:
 - Procesor: Intel(R) Core(TM) i5-6300U CPU 2.40GHz
 - Ugrađena grafička kartica: Intel Corporation Skylake GT2 [HD Graphics 520] (rev 07)
 - 32GB RAM memorije


## 3. Metod


U ovom poglavlju predstaviće se način na koji je realizovan projekat simulacije robota koji rešava lavirint korišćenjem SLAM-a. Sledi opis metoda generisanja lavirinta, preko detekcije prepreka i mapiranja, do kretanja robota kroz simulaciju. Posebna pažnja posvećena je metodama obrade očitanih podataka sa LIDAR senzora, segmentaciji linija i optimizaciji memorije, kao i heuristici kretanja robota.

### 3.1. Generisanje lavirinta 

Lavirint je simuliran kao skup povezanih pravougaonika na beloj pozadini, pri čemu su zidovi crni. Algoritam garantuje povezane hodnike i omogućava da robot slobodno istražuje celu mapu. Segmenti zidova čuvaju se kao lista krajnjih tačaka, što olakšava vizuelizaciju u Pygame-u.

![Slika 2. Primer nasumično generisane mape](/images/2025/maze-solving-robot/nasumicno-generisanje-mape.png) **Slika 2.** Primer nasumično generisane mape lavirinta.


### 3.2. LIDAR senzor i point-cloud mapa

U projektu je korišćen simulirani LIDAR senzor, koji emituje zrake pod različitim uglovima i detektuje prvu prepreku (crni piksel) na svom putu. Pozicija i orijentacija robota su uvek bile poznate, pa su koordinate detektovanih tačaka računate na osnovu pozicije robota i rastojanja piksela u odnosu na njega. Kompletna SLAM implementacija, gde robot ne zna svoju poziciju, nije urađena zbog ograničenog vremena.

Point-cloud (prevedeno oblak tačaka) je skup svih detektovanih tačaka (prepreka) pomoću senzora. U praksi, mapa oblaka tačaka omogućava sledeće:

 - vizuelizaciju detektovanih prepreka u realnom vremenu,


 - ulaz za algoritme linijske segmentacije,


 - osnovu za formiranje jednostavne *occupancy* mape (mape zauzetosti polja) i planiranje kretanja.
  
Simulacija LIDAR-a je pojednostavljena u odnosu na to kako pravi LIDAR senzor funkcioniše u 3D prostoru, ali je dovoljno precizna da se vidi kako robot detektuje zidove i generiše mapu oblaka tačaka, koja se ažurira u toku kretanja robota.

![Slika 3. Vizuelizacija rada simuliranog LIDAR senzora: robot (roze tačka) generiše oblak tačaka koji označava zidove lavirinta, dok žute ćelije prikazuju već istražene delove mape.](/images/2025/maze-solving-robot/vizuelizacija-lidar-senzora.png) **Slika 3.** Robot (roze tačka) generiše oblak tačaka koji označava zidove lavirinta, dok žute ćelije prikazuju već istražene delove mape.


### 3.3. Detekcija linijskih segmenata i algoritmi

Mapa oblaka tačaka je poprilično gusta jer sadrži puno tačaka i često može sadržati šum (male greške senzora u detekciji), pa je neophodna linijska segmentacija. U projektu su korišćene dve komplementarne metode:

1. *Split and Merge* algoritam 

Split and Merge algoritam koristi se za segmentaciju oblaka tačaka iz LIDAR senzora u linije koje aproksimiraju pozicije zidova lavirinta. Počinje gledanjem svih tačaka i crtanjem jedne velike linije koja povezuje prvu i poslednju tačku unutar segmenta. Zatim proverava da li se sve ostale tačke segmenta uklapaju na ovu liniju. Linija se deli na manje segmente ukoliko neka od detektovanih tačaka značajno odstupa, radi preciznijeg predstavljanja zida. Nakon toga, posmatra susedne linije da vidi da li su ravne i da li se mogu spojiti, popravljajući sitne izbočine ili praznine. Radeći ovo iznova i iznova, algoritam pravi čist skup pravih linija koje pokazuju gde su zidovi, pomažući da se bolje razume lavirint.

2. *Seeded Region Growing (SRG)* algoritam

Seeded Region Growing (SRG) algoritam se koristi kao dopuna Split and Merge algoritma, kako bi se smanjilo preterano deljenje linija i greške segmentacije, naročito u prisustvu praznina u mapi. Algoritam započinje od inicijalnih „semenki“ (piksela) na mapi, što mogu biti pojedinačne tačke ili veći segmenti. Svaka susedna tačka proverava se u odnosu na kriterijume udaljenosti i sličnosti pravca; ukoliko zadovoljava te uslove, dodaje se u postojeću regiju. Proces se ponavlja sve dok više nema tačaka koje mogu da se uključe u regiju. Na ovaj način, SRG stvara stabilne i kontinualne linijske segmente i samim tim omogućava preciznije mapiranje zidova lavirinta.

### 3.4. Optimizacija memorije

Kratki segmenti koji nastaju segmentacijom spajaju se u duže linije ako su približno kolinearni i blizu jedan drugom. Time se smanjuje broj objekata koje je potrebno čuvati u memoriji i crtati u realnom vremenu. Segmenti se čuvaju i koriste za kasniju lokalizaciju robota.

![Slika 4. Detekcija linijskih segmenata](/images/2025/maze-solving-robot/detekcija-linijskih-segmenata.png) **Slika 4.** Detekcija linijskih segmenata u mapi.


### 3.5. Kretanje robota i interakcija sa okolinom

Robot se inicijalno postavlja na mapu klikom miša na belu pozadinu. Koordinate klika određuju njegovu početnu poziciju, pri čemu sistem proverava da li se kliknuta tačka nalazi na slobodnom prostoru (prostor belih piksela), tako da robot ne bude smešten unutar zida.

Kretanje robota bazirano je na strategiji „do najbližeg neistraženog crnog piksela“. Takvi pikseli predstavljaju granicu između već poznatog slobodnog prostora i još neistraženih delova lavirinta. Robot kontinuirano identifikuje najbliži neistraženi piksel koji postavlja kao cilj kretanja.

Dok se robot kreće ka izabranom pikselu, koristi jednostavnu logiku izbegavanja prepreka. Ova logika omogućava da robot menja putanju u slučaju da naiđe na zid, a da pri tome ne gubi cilj istraživanja. Zahvaljujući ovakvoj integraciji LIDAR senzora i algoritama segmentacije, robot može da prilagođava svoje kretanje prema novim informacijama iz okoline, čak i u parcijalnoj implementaciji projekta.

### 3.6. Evaluacija i metrike

Iako konačni rezultati nisu dobijeni, planirane metrike uključuju procenat uspešnosti lokalizacije robota unutar lavirinta, procenat tačnosti mapiranja prostora i poređenje brzina pronalaska izlaza iz različitih lavirinata.

## 4. Rezultati

Simulacija robota u lavirintu je omogućila testiranje važnih funkcionalnosti SLAM metoda, iako je realizacija projekta parcijalna. Simulirani Lidar senzor uspešno detektuje prepreke i generiše mapu oblaka tačaka, koja se koristila za linijsku segmentaciju i vizuelizaciju zidova u realnom vremenu.

Robot se inicijalno mogao postaviti klikom miša na slobodni prostor lavirinta i uspešno je koristio strategiju "do najbližeg neistraženog piksela" sa logikom izbegavanja prepreka prilikom kretanja, što mu je omogućilo istraživanje lavirinata i mapiranje zidova.

Zbog nemodularnosti koda, tehničkih ograničenja i ograničenog vremena, simulacija nije testirana u svim scenarijima, a kvantitativne metrike nisu primenjene. Parcijalni rezultati pokazuju da implemetirane metode funkcionišu i služe kao osnova za dalji razvoj sistema.

## 5. Zaključak

Projekat simulacije robota u lavirintu korišćenjem SLAM principa uspešno prikazuje funkcionalnosti mapiranja, detekcije linijskih segmenata i kretanja robota. Iako implementacija nije potpuna, rezultati pokazuju da primenjeni algoritmi odlično funkcionišu i omogućavaju uspešnu vizuelizaciju i istraživanje nepoznatog prostora.

Ovi rezultati pružaju uvid u princip rada autonomnih robotskih sistema i potencijal za dalji razvoj, uključujući modularniji dizajn koda i testiranje na složenijim lavirintima. Integrisanje odometrije bi mogla poboljšati robusnost lokalizacije, dok bi implementacija kvantitativnih metrika omogućila detaljniju evaluaciju performansi. Ovi koraci otvaraju mogućnost za realističniju i efikasniju realizaciju sistema, uključujući prenos algoritama na stvarnog robota ili razvoj kompleksnijih simulacija u 3D okruženju.


## 7. Literatura 

[^1]: S. Riisgaard i M. R. Blas, “SLAM for Dummies: A Tutorial Approach to Simultaneous Localization and Mapping”, Massachusetts Institute of Technology, 2005.

[^2]: Y. Ran, X. Xu i Z. Tan, “A Review of 2D Lidar SLAM Research,” Remote Sens., vol. 17, str. 1214, 2025.

[^3]: F. A. A. Cheein, N. Lopez, C. M. Soria, F. A. di Sciascio, F. Lobo Pereira i R. Carelli, “SLAM algorithm applied to robotics assistance for navigation in unknown environments,” Journal of NeuroEngineering and Rehabilitation, vol. 7, no. 10, pp. 1–21, 2010.

[^4]: L. Zhang i B. K. Ghosh, “Line segment based map building and localization using 2D laser rangefinder,” u Proc. IEEE Int. Conf. Robotics and Automation, San Francisco, CA, USA, 24–28 Apr. 2000, pp. 2538–2543.

[^5]: H. Gao, X. Zhang, Y. Fang i J. Yuan, “A line segment extraction algorithm using laser data based on seeded region growing,” Int. J. Adv. Robot. Syst., vol. 15, no. 1, str. 1729881418755245, Feb. 2018.

[^6]: S. Malik, “Lidar SLAM: The Ultimate Guide to Simultaneous Localization and Mapping,” Wevolver, 04-May-2023. Dostupno: https://www.wevolver.com/article/lidar-slam?utm_source=chatgpt.com

[^7]: “Point cloud,” Wikipedia. Dostupno: https://en.wikipedia.org/wiki/Point_cloud