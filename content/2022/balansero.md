---
title: Balansero
summary: Balansero, balansirajući robot, je projekat rađen na letnjem kampu 2022. godine od Katarine Nedić i Anđele Pantelić.
---
![balans](images\2022\balansero\P1270385.jpg)

## Sadržaj

1. Apstrakt
2. Uvod
3. Aparatura i metode
4. Istraživanje i rezultati
5. Zaključak


## Uvod 

Samobalansirajući robot predstavlja stabilizaciju dinamičkog sistema koji radi po principu inverznog klatna. Ovakvi roboti koriste sistem upravljanja povratnom spregom u zatvorenoj petlji - što znači da se podaci iz senzora pokreta u realnom vremenu koriste za kontrolu motora i brzu kompenzaciju promene ugla kako bi se robot održao uspravno.
Cilj ovog projekta je da se modelira, simulira i implementira samobalansirajući robot.

## Aparatura i metode

##### *Od aparature koristile smo:*

-**IMU** (Inercijalni navigacioni sistem MPU6050) senzor koji meri ugao nagiba i ugaonu brzinu koristeći
kombinaciju akcelerometara i žiroskopa. U njemu postoji I2C kolo koje služi za komunikaciju između senzora i mikrokontrolera. IMU se nalazi na dnu robota kako bi se postigla precizna rezolucija za merenje nagibnog ugla robota.
![imu](images\2022\balansero\mpu.jpg)

-**Mikrokontroler (Arduino Uno)** očitava izmereni ugao i brzinu sa senzora i očitava
rotacionu brzinu točkova sa enkodera. Vrši obradu signala (pretvara signal iz analognog u
digitalni) i nakon dobijanja svih varijabli, kontroliše ugaonu brzinu točkova pomoću dva PWM signala.
![uno](images\2022\balansero\uno.jpg)

>**PWM** (Pulse-width modulation) je tehnika dobijanja analognih vrednosti pomoću digitalnih impulsa konstantne amplitude. PWM signali pomažu u regulaciji napona, što je važno jer se povećavanjem napona povećava i rotaciona brzina elektromotora. Digitalni izlaz PWM-a se sastoji od niza visokih (“uključenih”) i niskih (“isključenih”) impulsa i pomoću njih se kontroliše motor.

-**Roatacioni enkoder** je elektromehanički uređaj koji pretvara ugaoni položaj ili kretanje osovine u analogne ili digitalne izlazne signale.


-**Arduino motor kontroler** (l298n) pomoću koga upravljamo motor
![hmost](images\2022\balansero\l298n.jpg)

-**DC motor** (12V) sa jednom osovinom   

##### *Metode:*

Za projektovanje upravljanja koriste se filteri u cilju dobijanja što preciznijih rezultata.

>**Komplemetarni filter** je vrsta filtra
koja kombinuje merenja više senzora u unapred
određenim proporcijama. Prvo se računaju uglovi koji daju samo akcelerometar i žiroskop.
![filter](images\2022\balansero\komplementarni.png)

Kada se izračuna ugao potrebno je podatke sa
akcelerometra filtrirati filterom niskih učestalosti, odnosno podatke sa žiroskopa filterom
visokih učestalosti.

**Niskofrekventni filtar** ima za cilj da propusti samo niskofrekventne promene signala sa senzora na izlaz filtera, a da one visokofrekventne ukloni. Nedostatak
ovog filtra je kašnjenje koje se javlja zbog postepene, a ne skokovite promene izlaza.

**Visokofrekventni filter** propušta
visokofrekventne promene na izlaz, dok one niskofrekventne eliminiše. Uloga visokofrekventnog filtra je da otkloni proces akumulacije greške usled integracije, odnosno da minimizuje ovaj efekat.
![lpf](images\2022\balansero\lpf.png)







