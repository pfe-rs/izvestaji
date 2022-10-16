---
title: Robot valjak
summary: Robot u obliku valjka je projekat rađen na letnjem kampu za stare polaznike 2022. godine od Nikole Ristanovića i Filipa Bajraktarija.
---


### Uvod

Motivacija iza projekta je bila suprotstavljane ideje popularnog robota - balansera. Ideja je bila da pomoću klatna koje uvek teži da se vrati u stabilan položaj 
robot može biti konstruisan sa manjom preciznošću što bi ubrzalo proces pravljenja u slučaju masovne proizvodenje, kao i vreme dolaska do prvog funkcionalnog prototipa, budući da robot može da radi uz bilo kakav (ne)kontrolisan pogon motora. Takođe zbog oblika robota sve vitalne komponente se sadržane unutar konture, čineći robota izdržljivijim i jednostavnijim za popravku.

Reference su skoro ne postojeće budući da se ideja o robotu dobila bez drugog uzora/slične ideje.

???kako da formulišem da su refernece skoro ne postojeće i da sam sam došao na ideju robota???


### Aparatura i metoda

#### Dinamika sistema

Kao što je objašnjeno u uvodu, postoje dve vrste sfernih robota koji se razlikuju po načinu konvertovanja električne energije koju motor dobija iz bateriju u mehaničku energiju koja dovodi do kretanja robota. U robotu valjku, 2D verziji sfernog robota, je implementirana druga metoda kojom se pomoću elektromotornog pogona klatno valjka izvodi iz ravnotežnog položaja što dovodi do momenta sile usled tangencijalne komponente gravitacione sile što dovodi do rotacije robota. 

##### Horizontalno kretanje

Pre nego što se krene na pravljenje bilo kog hardverskog projekta neophodno je temeljno razumeti dinamiku (fiziku) sistema kako bi mogao da se simulira realni sistem na računaru i na taj način olakša projektovanje i programiranje hardvera. Grana fizike koja se bavi proučavanjem kinematike složenih fizičkih sistema se naziva Ojler-Lagranžova mehanika. Ona nam služi da složene fizičke sisteme predstavimo matematički isključivo pomću energija za dati sistem. Potencijalne, kinetičke i rotacione energije za telo i klatno valjka dati su sledećim izrazima:

$$U_1 = 0$$  
$$U_2 = -M_2gd\cos(\theta _ 1 + \theta _ 2)$$  
$$K_1 = \frac{1}{2}M_1(r\omega _ 1)^2$$  
$$K_2 = \frac{1}{2}M_2((r\omega _ 1 - d\cos(\theta _ 1 + \theta _ 2)(\omega _ 1 + \omega _ 2))^2 + (d\sin(\theta _ 1 + \theta _ 2)(\omega _ 1 + \omega _ 2))^2)$$  
$$T_1 = \frac{1}{2}J_1(\omega _ 1)^2$$  
$$T_2 = \frac{1}{2}J_1(\omega _ 1 + \omega _ 2)^2$$  

Za razliku od klasične Njutnove mehanike za Lagranžovu mehaniku je potrebno definisati odgovarajuću Ojler-Lagranžove funkcije, koja se definiše na sledeći način:
$$L = K_1 + K_2 + T_1 + T_2 - U_1 - U_2$$
Primenivši Ojler-Lagranžovu jednačinu na dva sistema, klatno i valjak,
$$\frac{d}{dt}\left(\frac{\partial L}{\partial \omega _ 1}\right)\ -\ \frac{\partial L}{\partial \omega _ 1}\ = \ -T + T_f$$
$$\frac{d}{dt}\left(\frac{\partial L}{\partial \omega _ 2}\right)\ -\ \frac{\partial L}{\partial \omega _ 2}\ = \ T$$
dobijaju se sledeće jednačine kojima je u potpunosti opisana dinamika sistema:
$$-T + T_f\ =\ \alpha_1(J_1 + J_2 + M_1r^2 + M_2r^2 + M_2d^2 - 2M_2rd)\ +\ \alpha_2(J_2 - M_2rd + M_2d^2)\ +\ M_2gd(\theta_1 + \theta_2)$$
$$T\ =\ \alpha_1(J_1 - M_2rd + M_2d^) + \alpha_2(J_2 + M2d^2) + M_2gd(\theta_1 + \theta_2)$$
gde su iskorišćene aproksimacije za male uglove i male ugaone brzine.

#### Modelovanje robota

Simulacije služe da se na što realističniji način predstavi realni svet i dobije bolji uvid u to kako će se sistem ponašati. Pored osećaja za sistem, simulacije omogućavaju lakše testiranje softvera kao i testiranje sistema u različitim prirodnim uslovima.

##### Transfer funkcije

Transfer funkcija predstavlja odnos između signala upravljačkog sistema i ulaznog signala, za sve moguće ulazne vrednosti. Za bilo koji kontrolni sistem postoji referentni ulaz ili pobuda koji prolazi kroz transfer funkciju kako bi se proizveo (simulirao) odgovor sistema na odgovarajuću pobudu.

Transfer funkcija (funkcija prenosa) je definisana kao Laplasova transformacija izlazne promenjljive i Laplasove transformacije ulazne promenjljive pod pretpostavkom da su svi početni uslovi jednaki nuli.
$$G(s)\ =\ \frac{C(s)}{R(s)}$$
Način na koji se formira transfer funkcija kontrolnog sistema je sledeća:

1. Formiraju se jednačine sistema
2. Uzimaju se Laplasove transformacije jednačina, pretpostavljajući da su početni uslovi jednaki nuli
3. Određuju se ulazi i izlazi sistema
4. Na kraju, odgovrajući odnos Laplasove transformacije izlaza i ulaza predstavlja željenu transfer funkciju

Takođe, važno je naglasiti da izlaz i ulaz nekog sistema ne mora nužno da bude istih fizičkih dimenzija. Na primer, DC motori se pokreću kada se na njihov ulaz dovede konstantan napon, a kao izlaz sistema može da se prati broj obrtaja motora ili obrtni momenat motora. Merne jedinice za date primere bi redom bile (obrtaja po sekundi)/(napon motora) i (Njutn metar)/(napon motora).

TODO: Grafici, polovi i osnovne aritmetičke operacije nad tf

U radu se kao pobuda sistema koristio isključivo napon. To bi značilo da je smanjenje ili povećanje ugaone brzine robota prouzrokovano smanjenju ili povećanju referentnog napona na ulazu motora. Kako bi se znalo na koji način treba implementirati odogovarajuće kontrolere potrebno je analizirati stabilnost odgovarajućih transfer funkcija karakterističnih za datog robota, gde kontroler predstavlja sistem koji nezavisno može da održava unete referentne vrednosti zadate od strane korisnika. Na primer, ukoliko bi korisnik želeo da se robot kreće konstantnom ugaonom brzinom $\omega$, kontroler treba samostalno da podešava napon na motoru tkd se ugaona brzina $\omega$ održava konstantnom.

Prva transfer funkcija koja je analizirana u radu je transfer funkcija ugaone brzine robota u zavisnosti od ulaznog napona.

$$\dfrac{\Omega_1}{V} = \dfrac{\ \ \ \ \ \ \ \ \ \ A + Bs^2}{C + Ds + Es^2 + Fs^3}$$  
$A = -2dgK_tM_2$  
$B = K_t(-2J_2 + d(-2d+r)M_2)$  
$C = dgRT_vM_2 - 2dgK_eK_tM_2$  
$D = -T_vK_eK_t + dgRJ_1M_2 + dgr^2RM_1M_2 + dgr^2RM_2^2$  
$E = RT_vJ_2 - 2J_2K_eK_t + d^2RT_vM_2 - K_eK_t(J_1 + r^2M_1 + (2d^2 - 3dr + r^2M_2)$  
$F = d^2RJ_1M_2 + d^2r^2RM_1M_2 + RJ_2(J_1 + r^2(M_1 + M_2))$

Druga transfer funkcija koja je analizirana u radu je transfer funkcija ugaone brzine klatna u odnosu na osovinu valjka u zavisnosti od ulaznog napona.

$$\dfrac{\Omega_2}{V} = \dfrac{\ \ \ \ \ \ G +  Fs + Es^2}{A + Bs + Cs^2 + Ds^3}$$  
$A = dgRT_vM_2 - 2dgK_eK_tM_2$  
$B = -T_vK_eK_t + dgRJ_1M_2 + dgr^2RM_1M_2 + dgr^2RM_2^2$  
$C = RT_vJ_2 + d^2RT_vM_2 - K_eK_t(J_1 + 2J_2 + r^2M_1 + (2dd - 3dr + r^2)M_2)$  
$D = RJ_1J_2 + d^2RJ_1M_2 + d^2r^2RM_1M_2 + r^2RJ_2(M_1 + M_2)$  
$E = K_t(J_1 + 2J_2 + r^2M_1 + (2d^2 - 3dr + r^2)M_2)$  
$F = K_tT_v$

Koristeći prethodno dve definisane funkcije mogu se izvesti dve nove transfer funkcije za koje važi da se njihovim diferenciranjem dobijaju polazne transfer funkcije: transfer funkcija ugaonog pređenog puta robota u zavisnosti od napona na ulazu motora i transfer funkcija ugla klatna u odnosu na osovinu valjka u zavisnosti od ulaznog napona. Treća, i poslednja, transfer funkcija predstavlja zavisnost ugla inklinacije klatna u odnosu na podlogu u zavisnosti od napona motora i dobija se kao paralelna veza prethodne dve transfer funkcije.

##### PID simulacije

Kako bi se razumeo PID kontroler potrebno je definisati odredjene termine. *Željena vrednost* je obično vrednost koju unosi korisnik. Na primer, za sistem za grejanje to bi bila željena temperatura prostorije. *Izlaz* je kontrolisana vrednost PID kontrolera. U automobilu bi to bila količina goriva koja je potrebna da bi se održavala konstantna brzina. *Greška* je vrednost koju koristi PID kontroler da bi odredio kako da manipuliše izlazom kako bi se dostigla željena vrednost. Greška se računa kao razlika željene vrednosti i trenutne vrednosti sistema.

U radu su simulirana tri PID kontrolera. Prvi PID kontroler odžava konstantan ugao inklinacije klatna u odnosu na horizontalnu podlogu po kojoj se valjak kreće. Drugi PID kontroler održava konstantnu ugaonu brzinu valjka. Poslednji PID kontroler održava konstantan ugaoni pređeni put valjka. Blok dijagram kontrolnog sistema je predstavljen na slici:

Kao što je u prethodnom poglavlju rečeno, transfer funkcija predstavlja odnos između signala upravljačkog sistema i ulaznog signala, za sve moguće ulazne vrednosti. Ukoliko je transfer funkcija predstavljena preko Laplasovih transformacija onda je takva funkcija prenosa definisana na kontinualnom domenu. Takav oblik transfer funkcija je od koristi prilikom teorijskih analiza kao što je analiza polova i nula. Nazalost, u praksi nam treba diskretna reprezentacija sistema što proizilazi iz toga da mikrokontroler rade isključivo nad diskretnim domenom vrednosti. Postoje razni algoritmi koji vrše željenu konverziju. Jedan od njih, koji je i koriščen u radu, *Zero-order Hold* metoda 

### Hardver

Pod hardverom se podrazumevaju svi vidljivi delovi robota, poput spojeva, mikrokontrolera, senzora, elektromehanickih uredjaja(motora), napajanja i slicno.
*Sema za povezivanje pojedincanih komponenti je prilozena na kraju dokumenta*

#### Lista uredjaja

1. MPU6050 IMU(Inertial Mesurement Unit)
2. Arduino Nano
3. HC05 Bluetooth modul
4. L298N Dual H-Most za kontrolu DC Motora
5. LM2598 DC-DC Stepdown regulator napona
6. JGA25-370 DC motor
7. 4S1P Li-ion baterija
8. E38S6G5 Opticki inkrementalni enkoder

#### Princip rada

##### Arduino Nano i HC05

Uredjaj koji vrsi prikupljanje i obradu podataka i signala sa senzora, kao i generisanjem signala za upravljane motorom je Arduino Nano. Ovo je 16-bitni mikrokontroler koji na sebi poseduje Atmega328p cip. Ovaj mikrokontoler sa HC05 Bluetooth modulom komunicira pomocu UART-a na BAUD rate-u od 9600 bitova po sekundi, omogucavajuci bezicni prenos podataka. Napaja se pomocu napona od 5 volti sa mikrokontrolera. *Paznja! iako modul radi na 5V prihvata napon na signalnim pinovima (RX,TX) je ogranicen na 3.3V, tako da je obavezna upotreba naponskog razdelnika kao bi se napon signala sa mikrokontrolera(5V) spustio na odgovarajuci nivo*

##### MPU6050

MPU6050 je akcelerometar i ziroskop koji se koristi za merenje ugla inklinacije tega robota. MPU6050 je sa mikrokontrolerom povezan pomocu I2C protokola i napaja se pomocu 5 volti sa mikrokontrolera. Ovaj senzor mikrokontroleru dostavlja podatke sa ziroskopa i akcelerometra pomocu kojih se u softveru izracunava ugao inklinacije koji je neophodan za odredjivanje ugaonog ubrzanja robota i PID kontrolu.

##### Li-ion baterija i LM2598 Stepdown regulator

Napajanje koje se u projektu koristi su 4 redno vezane Samsung 18650-35E Litijum-jonske baterije zbog svog kapaciteta od 5000mAh (miliamper casova) i maksimalne struje 2A (Ampera) koje mogu propustiti. Baterije se pune eksternim punjacem pomocu balansirajuceg konektora na njima. Napon sa baterije se sprovodi do LM2598 regulatora gde se napon spusta na 12V kako bi dalje mogao da se dovede do H-mosta, buduci da je u trenutnoj konfiguraciji njegov napon ogranicen na maksimum od 12V. Potom se struja iz H-mosta pomocu njegovog integrisanog regulatora spusta na 5V i dovodi do mikrokontrolera i ostalih senzora. Napon baterije se meri na mikrokontroleru kroz naponski razdelnik kako bi se napon od 16.8V spustio na 5V koji su bezbedni za mikrokontroler koji proverava trenutan napon/preostali kapacitet baterije.
*Procenjena maksimalna snaga potrosena u robotu je $12V * ~2A(Maksimalna utrosena struja celog robota) = 24W$ nakon regulatora, imajuci ovo u vidu struja koja protice kroz bateriju se moze izracunati kao $I = P/V$ gde je I - struja kroz bateriju, P - Utrosena snaga i V - napon baterije, gde je I = 24W / 16.8V(Nominalni napon baterije) = ~1.42A gde je onda minimalno vreme rada robota 5000mAh / 1.42A = ~3.5h +/- 10%(zbog gresaka u merenju, efikasnosti regulatora...)*

##### DC motor i L298N H-most

Buduci da pinovi mikrokontrlera nemaju snagu da pokrenu motor, kao pokretac motora se postavlja H-most koji pomocu signala koje dobija od strane mikrokontrolera pokrece motor. Dva signala koje H-most dobija su digitalni signali : 

1. Koji svojim naponom od 0V ili 5V odredjuje smer i 
2. Koji koristeci PWM(Pulse Width Modulation) brzim paljenjem i gasenjem kontrolise napon koji je doveden do motora od 0-12V

JGA25370 je DC motor koji radi na naponu od V=12V i Maksimalnoj struji od I=2A (U stanju zakocenja osovine). Motor u sebi poseduje reduktor koji umanjuje broj obrtaja motora u sekundi ali povecava obrtni momenat gde je broj obrtaja $RPM_max = 250$ obrtaja u minutu i obrtni momenat $T = 1.4kg/cm$. Ovaj motor je jedina komponenta koja pokrece robota.

##### E38S6G5 Opticki inkrementalni enkoder

E38S6G5 je opticki enkoder koji se koristi za merenje predjenog puta robota. E38S6G5 ima rezoluciju od 600 pulseva po obrtaju osovine sto nam daje preciznost od  0.6 stepeni ili ~0.01rad. Princip rada optickog enkodera je da se analizom izlaznih talasa moz odrediti da li se enkoder okrenuo u pozitivnom ili negativnom smeru. U konkretnom slucaju na pin 3 mikrokontrolera je povezan 1. od 2 izlaza enkodera, prilikom svake rastuce ivice ovog pina mikrokontroler belezi napon na 2. izlazu enkodera, u slucaju da je on pozitivan mikrokontroler to belezi kao obrt u pozitivnom smeru, a u slucaju da je napon negativam mikrokontroler to belezi kao obtr u negativnom smeru. Kada za svaki ovaj dogadjaj od nekog brojaca saberemo ili oduzmemo 1 mozemo dobiti predjeni put. *Ovo nije realni predjeni put buduci da se ne uracunava veoma potencijalni zanos robota u slucaju da stoji u mestu, u softveru se ovo resava oduzimanjem ugla inklinacije od predjenog puta.*





## Istraživanje i rezultati

Tokom rada na projektu, uspešno je realizovana hardverska implementacija robota i prikupljeni su podaci o tome kako sistem reaguje na uzastopne odskočne odzive. Tokom istraživanja su izmerena tri odskočna odziva koja odgovaraju redom transfer funkcijama ugaone brzine robota u zavisnosti od ulaznog napona motora, ugaone brzine klatna u odnosu na osovinu valjka u zavisnosti od ulaznog napona motora i ugla inklinacije klatna u odnosu na podlogu u zavisnosti od napona motora.

Prilikom dizajniranja klatna valjka centar mase korpe i komponenti (baterije, arduino i ostali moduli) se ne nalazi u osnosimetričnoj ravni korpe već je blago izbačen sa strane što dovodi do toga da nula u merenju inklinacije ugla nije prava nula. Takođe, ovome je potpomogla i činjenica da se na DC motoru nalazi reducer zbog kog ne postoji prava nula već postoji interval uglova koji mogu biti prava nula. Za male uglove moment zemljine teže na klatno se izjednačava sa momentom sile koju reducer proizvodi na klatno. Drugim rečima, javalja se mali interval oko prave nule za koje se klatno nalazi u indiferentnoj ravnoteži i u kojoj krajnji položaj zavisi isključivo od početnog impulsa. Ukoliko je veći početni impuls veća je i greška merenja ugla inklinacije. Ovaj fenomen se može predstaviti na grafiku ispod gde se vidi da robot konstantno *driftuje* u jednu stranu. Za dalji rad na ovom robotu treba da se poravna centar mase sistema kao i da se poveća masa klatna kako bi se smanji opseg uglova koji mogu biti prava nula i na taj način postići preciznija merenja.

Druga dva merenja predstavljaju kako u realnom sistemu napon na motoru utiče na ugaonu brzinu klatna i ugao inklinacije klatna. Takođe, jedan od ciljeva ovog projekta je bila i numerička identifikacija sistema koja nažalost nije urađena zbog gore navedenih problema kao i nedostatka vremena, ali idalje ostaje kao mogućnost za neki budući rad na sličnu temu.
