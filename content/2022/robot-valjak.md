---
title: Robot valjak
summary: Robot u obliku valjka je projekat rađen na letnjem kampu za stare polaznike 2022. godine od Nikole Ristanovića i Filipa Bajraktarija.
---


### Uvod

Uvod treba da sadrži sledeće stvari:

- Opis i motivaciju projekta, odnosno kako ste došli do ideje i šta ste radili.
- Pregled literature. Ukratko opišite šta su drugi radili pre vas.


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

#### Simulacije

Simulacije služe da se na što realističniji način predstavi realni svet i dobije bolji uvid u to kako će se sistem ponašati. Pored osećaja za sistem, simulacije omogućavaju lakše testiranje softvera kao i testiranje sistema u različitim prirodnim uslovima.

##### Transfer funkcije

Transfer funkcija predstavlja odnos između signala upravljačkog sistema i ulaznog signala, za sve moguće ulazne vrednosti. Za bilo koji kontrolni sistem postoji referentni ulaz ili pobuda koji prolazi kroz transfer funkciju kako bi se proizveo odgovor sistema na odgovarajuću pobudu.

Transfer funkcija (funkcija prenosa) je definisana kao Laplasova transformacija izlazne promenjljive i Laplasove transformacije ulazne promenjljive pod pretpostavkom da su svi početni uslovi jednaki nuli.
$$G(s)\ =\ \frac{C(s)}{R(s)}$$
Način na koji se formira transfer funkcija kontrolnog sistema je sledeća:

1. Formiraju se jednačine sistema
2. Uzimaju se Laplasove transformacije jednačina, pretpostavljajući da su početni uslovi jednaki nuli
3. Određuju se ulazi i izlazi sistema
4. Na kraju se uzima odnos Laplasove transformacije izlaza i ulaza što je tražena transfer funkcija

Takođe, važno je naglasiti da izlaz i ulaz nekog sistema ne mora nužno da bude istih fizičkih dimenzija.

U radu su korišćene tri transfer funkcije koje se uz data pravila mogu izvesti iz fizičkih jednačina za horizontalno kretanje valjka. To su transfer funkcija ugla inklinacije klatna valjka i napona na motoru, transfer funkcija ugaone brzine klatna valjka i napona na motoru i, na kraju, ugaona brzina valjka i napona motora.

##### PID simulacije

Kako bi se razumeo PID kontroler potrebno je definisati odredjene termine. *Željena vrednost* je obično vrednost koju unosi korisnik. Na primer, za sistem za grejanje to bi bila željena temperatura prostorije. *Izlaz* je kontrolisana vrednost PID kontrolera. U automobilu bi to bila količina goriva koja je potrebna da bi se održavala konstantna brzina. *Greška* je vrednost koju koristi PID kontroler da bi odredio kako da manipuliše izlazom da bi se dostigla željena vrednost. Greška se računa kao razlika između željene vrednosti i trenutne vrednosti sistema.