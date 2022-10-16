---
title: Balansero
summary: Balansero, balansirajući robot, je projekat rađen na letnjem kampu 2022. godine od Katarine Nedić i Anđele Pantelić.
---
![balansero]( <p align="center">
  <img src="https://github.com/pfe-rs/izvestaji/blob/radna_verzija/static/images/2022/balansero/robot.jpg" width="350">
  </p>
  )

## Sadržaj

1. Apstrakt
2. Uvod
3. Aparatura
4. Metode
5. Istraživanje i rezultati
6. Zaključak


## Apstrakt


## Uvod 

Samobalansirajući robot predstavlja stabilizaciju dinamičkog sistema koji radi po principu inverznog klatna. Ovakvi roboti koriste sistem upravljanja povratnom spregom u zatvorenoj petlji - podaci iz senzora pokreta u realnom vremenu se koriste za kontrolu motora i brzu kompenzaciju promene ugla kako bi se robot održao uspravno.
Cilj ovog projekta je da se modelira, simulira i implementira samobalansirajući robot.

## Aparatura 

##### *Od aparature koristile smo:*

-**IMU** (Inercijalni navigacioni sistem MPU6050) senzor koji meri ugao nagiba i ugaonu brzinu koristeći
kombinaciju akcelerometara i žiroskopa. U njemu postoji I2C kolo koje služi za komunikaciju između senzora i mikrokontrolera. IMU se nalazi na dnu robota kako bi se postigla precizna rezolucija za merenje nagibnog ugla robota.
![imu](
    <p align="center">
  <img src="https://github.com/pfe-rs/izvestaji/blob/radna_verzija/static/images/2022/balansero/uno.png" width="350">
  
</p>
)

-**Mikrokontroler (Arduino Uno)** očitava izmereni ugao i brzinu sa senzora i očitava
rotacionu brzinu točkova sa enkodera. Vrši obradu signala (pretvara signal iz analognog u
digitalni) i nakon dobijanja svih varijabli, kontroliše ugaonu brzinu točkova pomoću dva PWM signala.
![uno](images\2022\balansero\uno.jpg)

>**PWM** (Pulse-width modulation) je tehnika dobijanja analognih vrednosti pomoću digitalnih impulsa konstantne amplitude. PWM signali pomažu u regulaciji napona, što je važno jer se povećavanjem napona povećava i rotaciona brzina elektromotora. Digitalni izlaz PWM-a se sastoji od niza visokih (“uključenih”) i niskih (“isključenih”) impulsa i pomoću njih se kontroliše motor.

-**Roatacioni enkoder** je elektromehanički uređaj koji pretvara ugaoni položaj ili kretanje osovine u analogne ili digitalne izlazne signale.


-**Arduino motor kontroler** (l298n) pomoću koga upravljamo motor
![hmost](images\2022\balansero\l298n.jpg)

-**DC motor** (12V) sa jednom osovinom   

## Metode:

### Filtri

Za projektovanje upravljanja koriste se filteri u cilju dobijanja što preciznijih rezultata.

**Komplemetarni filtar** je vrsta filtra
koja kombinuje merenja više senzora u unapred
određenim proporcijama. Prvo se računaju uglovi koji daju samo akcelerometar i žiroskop.
![filter](images\2022\balansero\komplementarni.png) Kada se izračuna ugao potrebno je podatke sa
akcelerometra filtrirati filterom niskih učestalosti, odnosno podatke sa žiroskopa filterom
visokih učestalosti.

**Niskofrekventni filtar** ima za cilj da propusti samo niskofrekventne promene signala sa senzora na izlaz filtera, a da one visokofrekventne ukloni. Nedostatak
ovog filtra je kašnjenje koje se javlja zbog postepene, a ne skokovite promene izlaza.

**Visokofrekventni filtar** propušta
visokofrekventne promene na izlaz, dok one niskofrekventne eliminiše. Uloga visokofrekventnog filtra je da otkloni proces akumulacije greške usled integracije, odnosno da minimizuje ovaj efekat.
![lpf](images\2022\balansero\lpf.png)


### Kontroleri
Stabilizacija balansera postiže se implementacijom kontrolera. 
- **FLC kontroler**

Fuzzy-logic kontroler je stabilizator koji se bavi algortimima koji simuliraju ljudsko razmišljanje i donošenje odluka. Radi po setu pravila po principu *ako – onda* (eng. *if – then*), koja se intuitivno određuju. 

Kontroler prolazi kroz dve faze - fuzifikaciju i defuzifikaciju. U prvoj on prevodi veličinu greške (odstupanja trenutnog položaja od stabilnog, željenog položaja) sa točkova u fuzzy oblik. Fazifikovana vrednost greške se ubacuje u set prethodno određenih pravila. Neophodno je izračunati udeo te greške u svakom od pravila, a potom geometrijskom sredinom dobiti precizni izlazni rezultat. Taj proces nazivamo defuzifikacijom. Izlazna vrednost - napon, šalje se na motor, kontrolišu se točkovi - kreću se u određenom smeru i određenom ugaonom brzinom čime se postiže ispravljanje greške - robot  balansira. 
 
Fuzzy kontroler je vrlo intuitivan. Pravila izgledaju poput: 
- Ako je ugaona brzina **velika** i klatno pada **brzo ulevo**, onda robot treba da se pomeri **jako u levu stranu**. 
- Ako je ugaona brzina **mala** i klatno pada **sporo ulevo**, onda robot treba da se pomeri **slabo u levu stranu**. 
- Ako je ugaona brzina **mala** i klatno pada **sporo udesno**, onda robot treba da se pomeri **slabo u desnu stranu**. 

Ove komande nisu precizne, pomalo su mutne - *fuzzy*, ali zbog preklapanja pravila, preciznost izlaza je velika. Ona se povećava sa povećanjem pravila i svih mogućih kombinacija, kao i sa većim preklapanjem. Na primer, u nekom trenutku, robota će biti potrebno pomeriti 53% slabo u desnu stranu, 25% srednje jako u desnu stranu i 22% malo u levu stranu. Pošto zadata pravila imaju određene vrednosti, robot će biti poslat tačno određenom jačinom u tačno određenom pravcu. 
 
FLC kontroler smo uspešno implementirali u simulaciji. 
Međutim, imali smo problema sa ??? te smo na robota implementirali drugi kontroler - PID. 


- **PID kontroler**

PID kontroler je stabilizator koji se sastoji iz tri zasebna kontrolera - P (proporcionalni), I (integralni) i D (derivacioni tj. izvodni) kontroler. Oni primaju grešku na ulazu, a na izlazu daju napon koji se šalje na motor i time kontroliše robot.
Jednačina PID kontrolera je:




## Istraživanje i rezultati

- Simulacija fuzzy kontrolera

![simulacija]( <p align="center">
  <img src="https://github.com/pfe-rs/izvestaji/blob/radna_verzija/static/images/2022/balansero/fuzzy%20simulacija.gif" width="350">
  </p>
  )



- Koristili smo dva PID kontrolera.
![PID kontroleri](https://github.com/pfe-rs/izvestaji/blob/radna_verzija/static/images/2022/balansero/pid-blocks.png)

P1 ispravlja grešku ugla, a P2 šalje robota na željenu poziciju. 

## Zaključak

## Reference







