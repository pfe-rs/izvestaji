---
title: Maze solving robot
summary: Maze solving robot je projekat rađen na letnjem kampu za stare polaznike 2025. godine čiji su autori Anastasija Rajković i Jovana Trkulja.
---


###### Autori
Jovana Trkulja, Anastasija Rajković
###### Mentori 
Bojana Malešević, Vladan Bašić, Dimitrije Pešić, Đorđe Manojlović


## Apstrakt 

Ovaj rad prikazuje parcijalnu realizaciju simulacije robota koji rešava lavirint korišćenjem SLAM algoritama [^1][^3][^4]. Simulirani LIDAR senzor [^6][^2] omogućava detekciju prepreka i generisanje point-cloud [^7] mape, dok algoritmi Split and Merge [^5] i Seeded Region Growing [^7] omogućavaju segmentaciju linija zidova. Robot se inicijalno postavlja klikom miša i koristi frontier-based (pristup zasnovan na granicama neistraženih oblasti) strategiju kretanja za istraživanje prostora. Zbog vremenskog ograničenja i nemodularnosti koda, projekat je ostao parcijalan, sa ograničenim testiranjem i bez kvantitativne evaluacije. Ipak, dobijeni rezultati pokazuju osnovnu funkcionalnost delova sistema i pružaju čvrstu osnovu za dalji razvoj, uključujući optimizaciju mapiranja, modularniji dizajn koda i primenu metrika performansi.


## Abstract 

This work presents a partial implementation of a maze-solving robot simulation using SLAM algorithms. A simulated LIDAR sensor enables obstacle detection and generation of a point-cloud map, while Split and Merge and Seeded Region Growing algorithms provide line segmentation of maze walls. The robot is initially positioned via mouse click and navigates using a frontier-based exploration strategy. Due to time constraints and non-modular code, the project remains partial, with limited testing and no quantitative evaluation. Nevertheless, the results demonstrate the basic functionality of the system and provide a solid foundation for further development, including map optimization, modular code design, and implementation of performance metrics.


![Slika 1. Grafički apstrakt](/images/2025/maze-solving-robot/grafiski-apstark.svg)


## 1. Uvod 

Autonomni roboti predstavljaju jedno od najaktivnijih polja istraživanja u oblasti savremene robotike i veštačke inteligencije. Njihova primena obuhvata širok spektar oblasti, od industrijske automatizacije, preko autonomnih vozila i dronova, do istraživanja prostora nepristupačnih čoveku. Ključni izazov u razvoju ovakvih sistema jeste sposobnost robota da se samostalno orijentiše u nepoznatom okruženju. Ovaj problem je široko poznat kao SLAM (eng. Simultaneous Localization and Mapping, srp. Simultana Lokalizacija i Mapiranje).
SLAM podrazumeva da robot, bez prethodnog znanja o prostoru, izgradi mapu svog okruženja dok u isto vreme procenjuje sopstvenu poziciju u toj mapi. Ovaj zadatak je veoma složen jer zahteva obradu podataka iz senzora, efikasnu reprezentaciju prostora i metode za smanjenje grešaka koje se akumuliraju tokom kretanja.
Brojna istraživanja pokazala su da različiti pristupi SLAM-u, poput metoda baziranih na detekciji karakterističnih obeležja, omogućavaju robusnu lokalizaciju i mapiranje. Primena SLAM metoda u realnim sistemima suočava se sa izazovima kao što su ograničene mogućnosti senzora, akumulacija grešaka u proceni položaja i složenost algoritama potrebnih za obradu podataka u realnom vremenu.
Cilj ovog rada bio je da se kroz simulaciju u Python okruženju razvije pojednostavljen model robota koji rešava lavirint koristeći osnovne principe SLAM-a. Fokus je stavljen na implementaciju detekcije prepreka i mapiranja prostora na osnovu LIDAR podataka, kao i na razmatranje izazova i ograničenja koja se javljaju prilikom ovakvog pristupa.

## 2. Aparatura i metod

### 2.1. Aparatura 

Projekat je realizovan u obliku softverske simulacije. Kao razvojno okruženje korišćen je Visual Studio Code, dok je implementacija izvršena u programskom jeziku Python (verzija 3.11). Od biblioteka korišćene su:

 - Pygame – za grafičku simulaciju okruženja i vizuelizaciju kretanja robota,
 - NumPy – za numeričke proračune i obradu podataka,
 - standardne Python biblioteke (math, random).


Simulacija je izvedena na laptop računaru HP EliteBook 850 G3 sledećih specifikacija:
 - Procesor: Intel(R) Core(TM) i5-6300U CPU 2.40GHz
 - Ugrađena grafička kartica: Intel Corporation Skylake GT2 [HD Graphics 520] (rev 07)
 - 32GB RAM memorije


### 2.2. Metod


U ovom poglavlju predstaviće se način na koji je realizovan projekat simulacije robota koji rešava lavirint korišćenjem SLAM-a. Sledi opis metoda generisanja lavirinta, preko detekcije prepreka i mapiranja, do kretanja robota kroz simulaciju. Posebna pažnja posvećena je metodama obrade očitanih podataka sa LIDAR senzora, segmentaciji linija i optimizaciji memorije, kao i heuristici kretanja robota.

### 2.2.1. Generisanje lavirinta 

Lavirint je simuliran kao skup povezanih pravougaonika na beloj pozadini, pri čemu su zidovi crni. Algoritam garantuje povezane hodnike i omogućava da robot slobodno istražuje celu mapu. Segmenti zidova čuvaju se kao lista krajnjih tačaka, što olakšava vizuelizaciju u Pygame-u.

![Slika 2. Primer nasumično generisane mape](/images/2025/maze-solving-robot/nasumicno-generisanje-mape.png)


### 2.2.2. LIDAR senzor i point-cloud mapa

U projektu je korišćen simulirani LIDAR senzor, koji emituje zrake pod različitim uglovima i detektuje prvu prepreku (crni piksel) na svom putu. Za svaku detektovanu tačku računaju se globalne koordinate na osnovu trenutne pozicije i orijentacije robota.
Point-cloud (prevedeno oblak tačaka) je skup svih detektovanih tačaka i predstavlja trenutni „otisak“, to jest skup viđenih zidova. U praksi, point-cloud omogućava sledeće:

 - vizuelizaciju detektovanih prepreka u realnom vremenu,


 - ulaz za algoritme linijske segmentacije,


 - osnovu za formiranje jednostavne occupancy mape (mape zauzetosti polja) i planiranje kretanja.
  
Simulacija LIDAR-a je pojednostavljena u odnosu na to kako pravi LIDAR senzor funkcioniše u 3D prostoru, ali je dovoljno precizna da se vidi kako robot detektuje zidove i generiše point-cloud mapu, koja se ažurira prilikom kretanja robota.

![Slika 3. Vizuelizacija rada simuliranog LIDAR senzora: robot (roze tačka) generiše oblak tačaka koji označava zidove lavirinta, dok žute ćelije prikazuju već istražene delove mape.](/images/2025/maze-solving-robot/nasumicno-vizuelizacija-lidar-senzora.png)


### 2.2.3. Detekcija linijskih segmenata i algoritmi

Point-cloud je obično gust i često može sadržati šum (male greške LIDAR-a u detekciji), pa je neophodna linijska segmentacija. U projektu su korišćene dve komplementarne metode:

**1. Split and Merge algoritam** 

Split and Merge algoritam koristi se za segmentaciju oblaka tačaka iz LIDAR senzora u linije koje aproksimiraju zidove lavirinta. Proces počinje od inicijalnog segmenta koji spaja krajnje tačke celokupnog skupa tačaka. Svaka tačka unutar segmenta se proverava u odnosu na pravac koji spaja krajnje tačke. Ukoliko odstupanje tačke od pravca prelazi definisanu granicu, segment se deli na dva manja segmenta. Nakon toga, susedni segmenti se ponovo spajaju ako su kolinearni i dovoljno blizu, čime se eliminišu male nepravilnosti i fragmenti. Kroz ove korake, algoritam postepeno formira stabilan skup linija koje predstavljaju zidove lavirinta, zadržavajući strukturu prostora i smanjujući šum u podacima.

**2. Seeded Region Growing (SRG) algoritam** 



Seeded Region Growing (SRG) algoritam se koristi kao dopuna Split and Merge metodama, kako bi se smanjila fragmentacija linija i povećala robusnost segmentacije, naročito u prisustvu praznina u point-cloudu. Algoritam započinje od inicijalnih „semenki“ (piksela), što mogu biti pojedinačne tačke ili veći segmenti. Svaka susedna tačka proverava se u odnosu na kriterijume udaljenosti i sličnosti pravca; ukoliko zadovoljava te uslove, dodaje se u postojeću regiju. Proces se ponavlja sve dok više nema tačaka koje mogu da se uključe u regiju. Na ovaj način, SRG stvara stabilne i kontinualne linijske segmente, smanjujući previše mali broj fragmentisanih linija i omogućavajući preciznije mapiranje zidova lavirinta.

### 2.2.4. Optimizacija memorije

Kratki segmenti koji nastaju segmentacijom spajaju se u duže linije ako su približno kolinearni i blizu jedan drugom. Time se smanjuje broj objekata koje je potrebno čuvati i crtati u realnom vremenu. Segmenti se čuvaju i koriste za kasniju lokalizaciju robota.

![Slika 4. Detekcija linijskih segmenata](/images/2025/maze-solving-robot/detekcija-linijskih-segmenata.png)


## 2.2.5. Kretanje robota i interakcija sa okolinom

Robot se inicijalno postavlja na mapu klikom miša na belu pozadinu. Koordinate klika određuju njegovu početnu poziciju, pri čemu sistem proverava da li se kliknuta tačka nalazi na slobodnom prostoru, tako da robot ne bude smešten unutar zida. Ovaj jednostavan način interakcije omogućava korisniku da fleksibilno postavi robota na željenu lokaciju u simulaciji.
Kretanje robota bazirano je na strategiji „do najbližeg neistraženog crnog piksela“, poznatijoj i kao frontier-based pristup. Frontier ćelije predstavljaju granicu između već poznatog slobodnog prostora i još neistraženih delova lavirinta. Robot kontinuirano identifikuje najbližu frontier tačku i postavlja je kao cilj kretanja, što omogućava postupno i sistematsko istraživanje nepoznatog prostora.
Dok se robot kreće ka izabranom frontu, koristi jednostavnu lokalnu logiku izbegavanja prepreka. Ova logika omogućava da robot menja putanju u slučaju da naiđe na zid, a da pri tome ne gubi cilj istraživanja. Istovremeno, point-cloud mapa se ažurira u realnom vremenu, što omogućava kontinuiranu detekciju i segmentaciju zidova i drugih prepreka. Zahvaljujući ovakvoj integraciji LIDAR senzora i algoritama segmentacije, robot može da prilagođava svoje kretanje prema novim informacijama iz okoline, čak i u parcijalnoj implementaciji projekta.

### 2.3. Evaluacija i metrike

Iako konačni rezultati nisu dobijeni, planirane metrike uključuju procenat pokrivenog prostora, preciznost linijskih segmenata, efikasnost kretanja i performanse vizualizacije. Ove metrike odlične su za kvantitativnu procenu sistema i pokazuju potencijal za dalji razvoj projekta dok je još uvek u parcijalnom stanju.

## 3. Rezultati

U ovoj fazi projekta simulacija robota u lavirintu omogućila je testiranje ključnih funkcionalnosti implementiranih SLAM algoritama, iako je realizacija ostala parcijalna. Prvi rezultati pokazali su da simulirani LIDAR senzor uspešno detektuje prepreke i generiše point-cloud mapu, što je omogućilo vizuelizaciju poznatih zidova u realnom vremenu. Ova mapa je služila kao ulaz za algoritme linijske segmentacije, čime je omogućeno približno prikazivanje zidova lavirinta kroz linijske segmente.
Iako point-cloud mapa omogućava vizuelizaciju i segmentaciju, u parcijalnoj implementaciji javljali su se problemi sa prevelikim brojem tačaka, što je otežavalo rad algoritama u realnom vremenu i zahtevalo optimizaciju segmentacije i memorije.
Segmentacija linija, ostvarena kombinacijom Split and Merge i Seeded Region Growing algoritama, dala je stabilne i kontinualne linijske segmente. Iako su mnogi segmenti veoma kratki zbog prirode algoritama, optimizacija memorije je omogućila njihovo spajanje u duže linije, smanjujući opterećenje memorije računara i omogućavajući neprekidnu vizuelizaciju u toku simulacije. Rezultat je sistem koji uspešno prikazuje zidove lavirinta i čuva linijske segmente za potencijalnu kasniju lokalizaciju robota.
Robot se mogao inicijalno postaviti klikom miša na belu pozadinu, čime su definisane koordinate početne pozicije u slobodnom prostoru. Kretanje robota implementirano je strategijom „do najbližeg neistraženog frontiera“, gde robot odabira najbliži frontier i pomera se ka njemu koristeći jednostavnu lokalnu logiku izbegavanja prepreka. U praksi, robot je uspešno istraživao deo lavirinta, mapirajući zidove i prilagođavajući putanju u skladu sa point-cloud podacima.
Zbog nemodularnosti koda, tehničkih ograničenja i ograničenog vremena, simulacija nije bila testirana u svim mogućim scenarijima i nije moguće prikazati kvantitativne metrike kao što su procenat pokrivenog prostora ili preciznost linijskih segmenata. Ipak, parcijalni rezultati jasno pokazuju da implementirani algoritmi odlično funkcionišu u osnovnom obliku i da sistem može poslužiti kao osnova za dalji razvoj i evaluaciju performansi robota u potpunoj implementaciji.

## 4. Diskusija 

Projekat simulacije robota u lavirintu korišćenjem SLAM principa pruža uvid u osnovne funkcionalnosti mapiranja, detekcije linija i kretanja robota, iako je implementacija ostala parcijalna. Testiranje simulacije pokazalo je da LIDAR senzor uspešno detektuje prepreke i generiše point-cloud mapu, što omogućava vizuelizaciju zidova u realnom vremenu i ulaz za algoritme linijske segmentacije. Međutim, u parcijalnoj implementaciji uočeni su problemi sa prevelikim brojem tačaka u point-cloud mapi, što je otežavalo rad algoritama u realnom vremenu i zahtevalo optimizaciju segmentacije i memorije.
Segmentacija linija korišćenjem Split and Merge i Seeded Region Growing algoritama dala je precizne i stabilne linijske segmente, ali veoma kratki segmenti stvaraju veliki broj objekata u memoriji. Ovo može dovesti do kočenja simulacije kod većih mapa, što ukazuje na potrebu za daljom optimizacijom. Spajanjem kratkih linijskih segmenata u duže linije smanjuje se broj objekata koji se čuvaju i crtaju u realnom vremenu, čime se povećava efikasnost simulacije i omogućava dalji rad sistema bez značajnog opterećenja memorije.
Kretanje robota testirano je korišćenjem strategije „do najbližeg neistraženog frontiera“, pri čemu robot uspešno istražuje prostor, ažurira point-cloud mapu i prilagođava putanju prema novim informacijama iz okoline. Kretanje robota je zbog teškoća bilo testirano u ograničenom broju scenarija, što ograničava kvantitativnu evaluaciju performansi. Ipak, opisane metode omogućavaju uvid u princip rada sistema i potencijal za dalji razvoj.
Zaključno, iako projekat nije u potpunosti realizovan, dobiveni parcijalni rezultati pružaju jasan uvid u rad robota i funkcionalnost primenjenih SLAM algoritama, potvrđujući da ovaj pristup predstavlja dobru osnovu za dalji razvoj autonomnih sistema u simulaciji i eventualnoj implementaciji na stvarnom robotu, u 3D dimenziji.

## 5. Zaključak


Projekat simulacije robota u lavirintu korišćenjem SLAM principa uspešno je demonstrirao osnovne funkcionalnosti mapiranja, detekcije linijskih segmenata i kretanja robota. Implementirani LIDAR senzor i algoritmi Split and Merge i Seeded Region Growing omogućili su generisanje point-cloud mape i stabilnu segmentaciju zidova, dok frontier-based strategija kretanja pokazuje princip sistematskog istraživanja prostora.
Ovi parcijalni rezultati jasno pokazuju da implementirani algoritmi funkcionišu u osnovnom obliku i predstavljaju dobru osnovu za dalja poboljšanja. Budući rad mogao bi da obuhvati modularniji dizajn koda, dodatnu optimizaciju point-cloud mape i segmentacije linija, kao i testiranje na većim i složenijim lavirintima. Implementacija kvantitativnih metrika, poput procenta pokrivenog prostora, preciznosti linijskih segmenata i efikasnosti kretanja, omogućila bi detaljniju evaluaciju performansi sistema. Pored toga, integracija odometrije zajedno sa LIDAR senzorom obezbedila bi robusniju lokalizaciju robota, smanjila efekat grešaka pri segmentaciji i omogućila poređenje različitih metoda fuzije senzorskih podataka. Ovi koraci otvorili bi mogućnost za potpuniju i efikasniju realizaciju sistema, uključujući i prenos algoritama na stvarnog robota ili razvoj kompleksnije simulacije u 3D okruženju.

## 6. Literatura 

[^1]: S. Riisgaard i M. R. Blas, “SLAM for Dummies: A Tutorial Approach to Simultaneous Localization and Mapping”, Massachusetts Institute of Technology, 2005.

[^2]: Y. Ran, X. Xu i Z. Tan, “A Review of 2D Lidar SLAM Research,” Remote Sens., vol. 17, str. 1214, 2025.

[^3]: F. A. A. Cheein, N. Lopez, C. M. Soria, F. A. di Sciascio, F. Lobo Pereira i R. Carelli, “SLAM algorithm applied to robotics assistance for navigation in unknown environments,” Journal of NeuroEngineering and Rehabilitation, vol. 7, no. 10, pp. 1–21, 2010.

[^4]: L. Zhang i B. K. Ghosh, “Line segment based map building and localization using 2D laser rangefinder,” u Proc. IEEE Int. Conf. Robotics and Automation, San Francisco, CA, USA, 24–28 Apr. 2000, pp. 2538–2543.

[^5]: H. Gao, X. Zhang, Y. Fang i J. Yuan, “A line segment extraction algorithm using laser data based on seeded region growing,” Int. J. Adv. Robot. Syst., vol. 15, no. 1, str. 1729881418755245, Feb. 2018.

[^6]: S. Malik, “Lidar SLAM: The Ultimate Guide to Simultaneous Localization and Mapping,” Wevolver, 04-May-2023. Dostupno: https://www.wevolver.com/article/lidar-slam?utm_source=chatgpt.com

[^7]: “Point cloud,” Wikipedia. Dostupno: https://en.wikipedia.org/wiki/Point_cloud