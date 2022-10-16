---
title: Audio lokalizacija
summary: Audio lokalizacija je projekat rađen na letnjem kampu za stare polaznike 2022. godine od Lenke Vučković i Žarka Hajdera.
---
## Sadržaj

1. Apstrakt
2. Uvod
3. Aparatura i metode
4. Istraživanje i rezultati
5. Zaključak

### Apstrakt

Prva dva odeljka vašeg izveštaja su apstrakt i apstrakt na engleskom, ali njih treba pisati nakon svih drugih delova.
Apstrakt predstavlja sažetak vašeg izveštaja i treba (bez objašnjenja) da predstavi šta ste radili, na koji način i koje rezultate ste postigli.
<!---//ovo na kraju radimo --->
### Uvod
Uvod treba da sadrži sledeće stvari:
* Opis i motivaciju projekta, odnosno kako ste došli do ideje i šta ste radili.
* Pregled literature. Ukratko opišite šta su drugi radili pre vas.
<!---ovo isto kasnije--->

### Aparatura i metoda
#### Metode
##### Metode izracunavanja distance:

1.  TOA _(Time of arrival)_ - metoda kojom se meri vreme stizanja signala od čvora, zahteva da je vreme između čvorova sinhronizovano, oduzimanjem vremena početka ( $T_1$) prenošenja signala od vremena stizanja ( $T_2$) dobija se vreme putovanja _(Time of flight, $TOF$)_ 
$$TOF= T_2-T_1$$
    

2. RTT _(Round trip time)_ - metoda u kojoj čvor koji primi signal odmah pošalje povratni signal, a čvor koji je započeo prenos meri vreme između početka slanja i primanja povratnog signala, ne zahteva sinhronizovano vreme između čvorova. 
Vreme koje je izmereno ( $T_1$) je jednako duploj vrednosti vremena putovanja ( $TOF$) i vremena koje je potrebno drugom čvoru da potvrdi signal i pošalje povratni odgovor ( $T_2$).
Ovakav sistem zahteva da svi čvorovi u sistemu imaju mogućnost primanja i transmitovanja signala, tjst. da je svaki čvor opremljen sa zvučnikom i mikrofonom. 

<!---T1 pocetak snimanja, -->
$$TOF=\frac{T_1-T_2}{2}$$

<!--- za rtt dodati neki grafik i objasnjenje za bip bip--->
##### Metode za komunikaciju između čvorova
<!--- Audio/ EM--->
<!--- medijumi po kojima mozemo da transferujemo podatke, kako mozemo da reusujemo sistem mikrofona i zvucnika ili bilo koji drugi dostupan na uređaju za gotov hardver/esp--->
Za svaku od navedenih metoda je potrebno da čvorovi imaju neki vid komunikacije.
<!--- dopisati sta mozemo da koristimo za komunikaciju--->
###### Sinhronizacija    
<!--- ova recenica kasnije, prvo objasnjenje i spomenut --->
Kada se uspostavi kanal komunikacije između čvorova, on se takođe može koristiti za sinhronizaciju čvorova u metodama koje to zahtevaju.
<!--- takodje ovde ostale ideje kao eksterna sinhronizacija kroz impuls, itd--->
U slučaju TOA metode, čvorovi moraju da budu precizno sinhronizovani, snimanje na svim čvorovima treba da bude započeto u trenutku kada nepoznati čvor počne da emituje signal.

<!--potrebna je precizna sinhronizacija čvorova koju možemo da ostvarimo ako koristimo --->

##### Metode za pronalaženje lokacije čvorova
<!---trilateracija, spomenemo eventualno koje sve postoje-->

##### Kroskorelacija 
<!--- dopisati negde za refleksije,multipath i eho i kako uticu na merenja ukoliko zeznu --->
Kako bi odredili TOF koristimo metodu kroskorelacije  _(Cross corelation)_.
Kroskorelacija prvo određuje sličnost dva signala tako što pojedinačne članove dobijenog signala množi sa odgovarajućim članom izvornog signala a potom sve dobijene proizvode sumira i dobijenu sumu pamti u niz. 
Nakon toga, izvorni signal se pomera za jedno mesto u desno, tako što se na početak doda nula i ceo proces se ponavlja, a novodobijena suma se pamti na sledećem mestu u nizu. 
Zatim se određuje pozicija maksimuma dobijenog niza. Kada nju pomnožimo sa brzinom odabiranja ( $F_s$) dobijamo TOF.
Kako nam je poznata veza između pređenog puta ($s$), brzine ($v$) i vremena ( $TOF$), kao i brzina zvuka, možemo dobiti razdaljinu između dva čvora.

$$s=v*TOF$$

##### Trilateracija 

Trilateracija je metoda kojom se dobija lokacija čvora presecanjem tri kružnice. 
Centar svake od kružnica se nalazi u jednom od poznatih čvorova, a poluprečnik svake odgovara udaljenosti centra kružnice od nepoznatog čvora.

#### Simulacija 
<!---ovde trenutno pise kako ide simulacija za TOA--->
Simulacija nam pomaže da utvrdimo koji parametri najviše utiču na grešku i da isprobamo kako bi se sistem ponašao pri različitim uslovima.
Kako bi napravili simulaciju sistema potrebno je da uradimo sledeće:
1.  Modulacije _(Modulation)_ -- iz poznatih lokacija svih čvorova pravimo simulirane signale koji potiču od jednog čvora čija će se lokacija izračunati kroz demodulaciju
    - Kašnjenje -- simulira propagiranje signala kroz prostor 
    - Diskretizacija -- simulira ADC 
    - Šum -- simulira buku
    - Opadanje amplitude _(Fade)_ -- simulira slabljenje signala srazmerno distanci
2.  Demodulacije _(Demodulation)_ -- iz dobijenih modulisanih signala i lokacija svih čvorova sem onog od kojeg potiče signal dolazimo do informacije o poziciji nepoznatog čvora
    - Kroskorelacija -- dobijamo informaciju o trenutku u kom je signal detektovan 
    - Računanje udaljenosti -- Putem TOA metode izračunavamo vreme leta a pošto nam je poznata brzina zvuka i vreme leta možemo da izračunamo udaljenost do nepoznatog čvora
    - Trilateracija -- kroz poznate lokacije tri čvora i njihove odgovarajuće udaljenosti računamo oblast u kojoj se nalazi nepoznati čvor


#### Aparatura
Za izradu hardverskog sistema potrebna je sledeća aparatura:
* Mikrokontroleri _(MCU)_ 
* Izvori zvuka
* mikrofoni sa pretpojačalima
<!--- 
za mcu o biranju kontrolera, potrebni parametri, sample rate, adc dma, rang ADC-a, atten, spiffs, memorija potrebna za cuvanje toga, zasto koristimo vise mikrokontrolera, nelinearnost ADC-a, greska adc-a, najbolje citava sekcija za ADC,itd itd ...

za izvore zvuka o opcijama, zvucnik vs piezo buzzer, 
aktivan vs pasivan piezo buzzer, rang na kojima proizvode najveci spl, rezonantna, zavisnost signala i mikrofona od ovoga

za mikrofone i pretpojacala prvo o mikrofonima, 
o 
pc - pc sistem isto raspisati, mozda premestiti mikrokontroleri u opcije za sisteme tjst nama treba samo izvor zvuka i mikrofon u teoriji a sad nesto treba to da snimi i pusti takođe

pretpojacala spojiti sa adc-om najbolje, seme, ono sto smo digitalizovali, itd, sve oko njih, potrebe za njima i njihove funkcije



takođe biranje signala, duzine, modulacije, frekvencija, sample rate itd itd isto u vezi sa ovim stvarima

za hardver oko esp-esp sistema takođe i napajanja, itd
filteri i uticaj suma, hardware vs software filtriranje

--->
<!---todo: softver (za pc-pc/ esp-esp)  --->


### Istraživanje i rezultati
<!---
parcijalne rezultate treba bolje izmeriti, labelirati i zapisati u 
---->
U ovom odeljku treba opisati sve rezultate do kojih ste došli. 
Ako i dalje radite na svom projektu, parcijalni rezultati su potpuno prihvatljivi.
### Zaključak
<!---
na kraju
--->
Zaključak ima za cilj da dodatno prokomentarišete rezultate i napravite pregled rada. 

$$V=\frac{S}{t}$$