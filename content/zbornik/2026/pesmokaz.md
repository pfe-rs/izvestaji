---
title: "Pesmokaz: Razvijanje i poređenje metoda prepoznavanja pesama"
summary: "Sistem za prepoznavanje muzike koji poredi determinističko matematičko heširanje sa dubokim učenjem zasnovanim na triplet metric learning-u, evaluiran na 776 upotrebljivih pesama (od 1000 izabranih) iz FMA skupa."
svg_image: /images/zbornik/2026/pesmokaz/graficki-apstrakt.svg
imageAlt: "Blok šema sistema sa ulaznim audio signalom, deljenjem na isečke, normalizacijom, spektrogramom, dva paralelna puta za heširanje i pretragom u bazi."
translationKey: "pesmokaz"
---

**Autori:**

Lazar Aleksic, učenik IV razreda Gimnazije "Bora Stankovic" u Vranju

Andrej Vasilijevic, učenik IV razreda Prve Kragujevacke Gimnazije

**Mentori:**

Andrej Bantulic, Elektrotehnički fakultet u Beogradu

Dimitrije Pešić, Elektrotehnički fakultet u Beogradu

{{< figure "Slika" "Grafički apstrakt. Ulazni audio signal se deli na isečke, normalizuje, pretvara u mel spektrogram, fingerprintuje i pretražuje u bazi. Izlaz je rang lista pesama sa ocenom poverenja." "graficki-apstrakt" >}}

![Blok šema sistema sa ulaznim audio signalom, deljenjem na isečke, normalizacijom, spektrogramom, dva paralelna puta za heširanje i pretragom u bazi.](/images/zbornik/2026/pesmokaz/graficki-apstrakt.svg)

{{</ figure >}}

## Apstrakt

Prepoznavanje muzike iz kratkog audio snimka je problem pronalaženja najbliže pesme u velikoj bazi podataka. Determinističke metode zasnovane na heširanju vremensko frekvencijskih lokalnih maksimuma, kao što je algoritam Wang (2003), otporne su na šum jer najviši energetski lokalni maksimumi preživljavaju maskiranje. Metode zasnovane na dubokom učenju uče funkciju sličnosti u kontinualnom latentnom prostoru i mogu da prepoznaju strukturne mutacije, poput kovera i izvođenja uživo, koje onemogućavaju heširanje. Implementiran je sistem koji poredi ova dva pristupa na istom skupu podataka i istom protokolu evaluacije. Skup podataka čini 776 upotrebljivih pesama (od 1000 izabranih) iz Free Music Archive (FMA) skupa, stratifikovano po 16 žanrova, sa pet nivoa šuma od minus 5 dB do 20 dB. Pesme su iz FMA skupa; 482 je preuzeto sa YouTube-a, 518 iz FMA arhiva. Matematička metoda postiže 97,56 posto tačnosti na prvom mestu i srednji recipročni rang od 0,976 na agregatnom noisy test setu od 7281 upita nad 776 pesama. CNN embedding postiže 81,39 posto tačnosti na prvom mestu i srednji recipročni rang od 0,850. Matematička metoda je tačnija, dok je CNN inferenca oko 20 puta brža. Postoji razumna pretpostavka da bi CNN, uz više epoha i treniranja, mogao da se poboljša i na većim bazama. Oba pristupa su deterministička u okviru istog izvršnog okruženja i hardvera.

## Abstract

Music recognition from a short audio clip is the problem of finding the closest song in a large database. Deterministic methods based on hashing time frequency peaks, such as the original algorithm by Wang (2003), are robust to noise because the highest energy peaks survive masking. Deep learning methods learn a similarity function in a continuous latent space and can recognize structural mutations, such as covers and concert performances, that break hashing. This paper presents a system that compares these two approaches on the same collection and the same evaluation protocol. The dataset consists of 776 usable songs (out of 1000 selected) from the FMA collection, stratified across 16 genres, with five noise levels from minus 5 dB to 20 dB. The mathematical method reaches 97.56 percent top 1 accuracy and a mean reciprocal rank of 0.976 on an aggregate noisy test set of 7281 queries. The CNN embedding reaches 81.39 percent top 1 accuracy and a mean reciprocal rank of 0.850. The mathematical method is more accurate. Both approaches are deterministic within the same runtime and hardware.

## 1. Uvod

Prepoznavanje muzike iz kratkog audio snimka je problem koji se rešava u svakodnevnoj upotrebi mobilnih uređaja. Korisnik snimi nekoliko sekundi pesme, a sistem mora da pronađe odgovarajuću pesmu u bazi koja može da sadrži milione zapisa. Problem je težak jer audio signal retko stiže čist. Ambijentalni šum, govor u pozadini, loša kompresija i reverb menjaju signal. Pored toga, ista pesma može da se pojavi u različitim verzijama, kao kover ili izvođenje uživo, što menja frekvencijsku sliku.

Pristupi u literaturi mogu se podeliti u dve grupe. Prvu grupu čine determinističke metode koje izvlače lokalne maksimume iz spektrograma i grade heševe. Algoritam Wang (2003) koristi vremensko frekvencijske lokalne maksimume i parove lokalnih maksimuma kao heševe, a pretragu vrši po vremenskom poravnanju[^2]. Ove metode su determinističke i proverene u praksi (implementacija nije optimizovana za brzinu inferencije). Drugu grupu čine metode zasnovane na dubokom učenju koje uče funkciju sličnosti u kontinualnom latentnom prostoru. Modeli zasnovani na konvolucionim neuronskim mrežama sa triplet loss-om uče da preslikaju audio u vektor tako da su snimci iste pesme blizu, a različitih pesama daleko[^3][^11][^12]. Ove metode mogu da generalizuju na pesme koje model nije video tokom treniranja[^11].

Navedeni pristupi imaju različite prednosti. Determinističke metode su otporne na šum jer najviši energetski lokalni maksimumi preživljavaju maskiranje. Metode zasnovane na dubokom učenju mogu da prepoznaju strukturne mutacije koje onemogućavaju heširanje, ali zavise od kvaliteta treniranja i od skupa podataka. Direktno poređenje ova dva pristupa na istom skupu podataka i istom protokolu evaluacije omogućava objektivnu procenu njihovih prednosti i ograničenja, što je osnova ovog rada.

Prototip sistema na 12 pesama (album The Slow Rush grupe Tame Impala) postigao je 98,68 posto tačnosti na standardnom testu i 86,03 posto na stress testu sa jakim distorzijama[^10]. Ovaj rezultat pokazuje da model zaista uči melodijsku strukturu, a ne šum, jer je test skup sadržao isključivo zašumljene snimke koje model nije video tokom treniranja.

Cilj ovog rada je da se implementira sistem za prepoznavanje muzike koji poredi determinističko matematičko heširanje i duboko učenje zasnovano na triplet metric learning-u, i da se izmeri njihova tačnost, otpornost na šum i brzina inferencije na istom skupu podataka. Polazna hipoteza je bila da matematička metoda postiže višu tačnost na zašumljenim upitima, dok CNN embedding postiže nižu latenciju i potencijalno bolje rezultate na strukturnim mutacijama.

Prvo, implementiran je kompletan deterministički lanac obrade od audio ulaza do pretrage u bazi, sa testovima i CI, koji daje identičan rezultat u okviru istog izvršnog okruženja i hardvera. Drugo, dve metode fingerprintovanja, matematička i CNN, implementirane su iza zajedničkog Python interfejsa (AbstractFingerprinter) i porede se kroz isti lanac obrade. Treće, izmereni su rezultati na 776 upotrebljivih pesama na pet nivoa šuma, sa otvoreno navedenim ograničenjima.

## 2. Aparatura i metoda

Ovo poglavlje opisuje formalizaciju problema, skup podataka, softversko okruženje, metod i protokol evaluacije.

### 2.1. Problem i formalizacija

Neka je $x(t)$ ulazni audio signal mono oblika, a $y$ oznaka pesme. Cilj je da se nauči ili izračuna funkcija koja preslikava $x(t)$ u reprezentaciju pogodnu za pretragu, a zatim da se pronađe najbliža pesma u bazi. Ulazni signal se najpre deli na isečke dužine $T = 5$ s sa preklapanjem od $2{,}5$ s. Za svaki isečak se računa embedding ili skup heševe. Pretraga se vrši po isečku, a rezultati se spajaju po pesmi.

Matematička metoda vraća ocenu koja je broj poklopljenih heševe sa istim vremenskim pomakom. CNN metoda vraća L2 rastojanje između embeddinga upita i embeddinga u bazi. Za CNN se pesme sortiraju po rastućem rastojanju, a za matematičku metodu po opadajućoj oceni. Tie break je leksikografski po identifikatoru pesme.

{{< equation "eq-mrr" >}}

$$
\mathrm{MRR} = \frac{1}{N} \sum_{i=1}^{N} \frac{1}{\mathrm{rang}_i}
$$

{{</ equation >}}

Jednačina ({{< eqref "eq-mrr" >}}) definiše srednji recipročni rang. U jednačini ({{< eqref "eq-mrr" >}}), $N$ je broj upita, a $\mathrm{rang}_i$ je pozicija tačne pesme u rang listi za upit $i$. Ako tačna pesma nije u listi, član je nula.

### 2.2. Skup podataka

Skup podataka čini 1000 pesama izabranih iz FMA (Free Music Archive) skupa[^4], stratifikovano po 16 žanrova sa slučajnim semenom 42. Pesme su preuzete sa YouTube-a (481 pesma) i iz FMA ZIP arhiva (519 pesama). Pronađene su 224 korumpirane pesme koje su uklonjene proverom MD5 checksuma, pa je upotrebljivo 776 pesama. Ukupna veličina je približno 5,5 GB MP3 fajlova. Skup je podeljen na trening i test po pesmama, a ne po isečcima, čime je izbegnuto curenje podataka.

Kao što se vidi iz sastava, skup je ravnomerno raspoređen po žanrovima. Svaka pesma je podeljena na isečke od 5 s sa preklapanjem od 2,5 s, što daje približno 71 hiljadu spektrograma. Spektrogrami se prekomputuju jednom i kesiraju kao .npy fajlovi, čime se eliminiše ponovno generisanje po epohi i ubrzava treniranje. Šum se generiše veštački tokom treniranja i evaluacije: pink šum (1/f) i, kada su dostupni, pozadinski govor. Reverb (pyroomacoustics) nije implementiran. Kontrolisani nivoi odnosa signala i šuma su minus 5 dB, 0 dB, 5 dB, 10 dB i 20 dB. Takođe je seed fiksiran radi reprodusabilnosti.

Tabela 1 prikazuje sastav upotrebljivog skupa od 776 pesama po žanru, nakon uklanjanja 224 korumpirane pesme iz izabranog skupa od 1000 pesama. Raspodela po žanru ostaje približno ujednačena: hi-kvadrat test ne odbacuje ravnomernu raspodelu (χ² = 24,21, df = 15, ispod kritične vrednosti 25,0 pri nivou značajnosti 0,05).

**Tabela 1.** Sastav upotrebljivog skupa podataka po žanru (776 pesama).

| Žanr | Broj pesama | Udeo (%) |
| :--- | ---: | ---: |
| Blues | 48 | 6,2 |
| Classical | 50 | 6,4 |
| Country | 53 | 6,8 |
| Easy Listening | 19 | 2,4 |
| Electronic | 53 | 6,8 |
| Experimental | 50 | 6,4 |
| Folk | 55 | 7,1 |
| Hip-Hop | 55 | 7,1 |
| Instrumental | 45 | 5,8 |
| International | 45 | 5,8 |
| Jazz | 50 | 6,4 |
| Old-Time / Historic | 42 | 5,4 |
| Pop | 56 | 7,2 |
| Rock | 55 | 7,1 |
| Soul-RnB | 49 | 6,3 |
| Spoken | 51 | 6,6 |
| Ukupno | 776 | 100 |


Iz tabele 1 se vidi da je skup ravnomerno raspoređen po žanrovima.

### 2.3. Softversko okruženje

Sistem je implementiran u Python-u. Normalizacija koristi pyloudnorm[^7], koji implementira EBU R128 standard bez poziva eksternog procesa. Inference koristi librosa[^5], faiss-cpu[^6], onnxruntime[^8], numpy i scipy. Treniranje koristi PyTorch, torchvision i pytorch-metric-learning. Modeli su eksportovani u ONNX format i kvantizovani u INT8. Skup podataka se sastoji od pesama iz Free Music Archive (FMA) skupa, licenciranih pod Creative Commons licencama (CC-BY, CC-BY-NC, CC-BY-NC-ND, CC-BY-SA, CC0 i Public Domain). Od 1000 izabranih, 816 je pod nekomercijalnom licencom (CC-BY-NC*), 71 pod CC0/Public Domain, 68 pod CC-BY i 39 pod CC-BY-SA (5 pod CC-BY-ND i 1 pod EFF Open Audio License). Ne-komercijalne licence dozvoljavaju istraživačku upotrebu uz navođenje autora. 400 pesama je pod CC-BY-NC-ND licencom (zabrana derivata); audio fingerprinting analizira audio bez redistribucije samih fajlova, pa to ne predstavlja derivat u smislu licence. Pesme su preuzete sa YouTube-a (482) i iz FMA ZIP arhiva (518); sadržaj je CC-licenciran, a preuzimanje sa YouTube-a služi isključivo za istraživačku reprodukciju, bez redistribucije audio fajlova. Rad je nekomercijalan i ne generiše novu muziku, pa ne krši uslove CC-BY-NC* licenci.

### 2.4. Metod

Lanac obrade se sastoji iz sledećih koraka. Audio ulaz se učitava kroz librosa i resample-uje na 22050 Hz. Preprocessor deli audio na isečke od 5 s sa preklapanjem od 2,5 s. Svaki isečak se nezavisno normalizuje dvoprolaznim filterom za normalizaciju glasnoće. Iz normalizovanog isečka se računa *mel spektrogram* sa 128 *mel filtera*. Opcioni denojzer (*U-Net*) čisti spektrogram. Fingerprinter pretvara spektrogram u *embedding* ili heševe. Pretraga baze vraća rang listu pesama.

Ključni redosled je isečak pa normalizacija, a ne obrnuto. Ako se normalizuje ceo fajl pa se onda deli, dva različita snimka iste pesme dobijaju različitu normalizaciju jer normalizator vidi različitu statističku distribuciju. Nezavisnom normalizacijom po isečku, isti 5 s segment uvek proizvodi identičan izlaz.


**Matematička metoda.** Metoda ne radi na sirovom audio signalu, već na *mel spektrogramu* dobijenom iz normalizovanog isečka. Metoda izvlači vremensko frekvencijske lokalne maksimume iz spektrograma pomoću filtera maksimuma iz biblioteke scipy, sa prozorom 16 puta 16. Lokalni maksimumi čija je vrednost iznad 0,25 (na spektrogramu normalizovanom na opseg od 0 do 1) se zadržavaju; prag je odabran empirijski radi ravnoteže između broja lokalnih maksimuma i robusnosti na šum. Za svaki referentni lokalni maksimum se gradi 15 heševa sa susednim lokalnim maksimumima, uz ograničenja na vremenski i frekvencijski pomak. Konačan heš je trojka (frekvencija referentnog lokalnog maksimuma, frekvencija ciljnog lokalnog maksimuma, vremenski pomak). Pretraga u bazi koristi vremensko poravnanje: za svaki heš se računa pomak između upita i originala, a pesma dobija ocenu jednaku najvećem broju poklapanja na jednom pomaku. Ovaj korak je ključan i povećava tačnost sa oko 70 posto na preko 90 posto.

**CNN metoda.** Metoda koristi Residual Network sa 18 slojeva (*ResNet-18*) modifikovan za jednokanalni ulaz (*mel spektrogram*) sa 128-dimenzionalnim *embeddingom* normalizovanim L2 normom na izlazu. Treniranje koristi funkciju greške tripleta sa minerom teških tripleta. Inference se izvršava kroz izvršno okruženje ONNX[^8] sa INT8 kvantizacijom. *Embedding* se kvantizuje u int8 vektor dužine 128. Pretraga je L2 najbliži sused kroz faiss-cpu IndexFlatL2[^6].

**Baze podataka.** Vektorska baza čuva vektore i identifikatore pesama[^5]. ReverseIndexDB je Python dict koji čuva heševe i liste (pesma, vreme referentnog lokalnog maksimuma), sa pickle serializacijom. Obe baze su lokalne i nisu skalabilne za milionske baze, što je ograničenje.

{{< equation "eq-loudness" >}}

$$
\mathrm{LUFS} = -0{,}691 + 10 \log_{10}\left(\frac{1}{N}\sum_{k=1}^{N} z_k^2\right)
$$

{{</ equation >}}

Jednačina ({{< eqref "eq-loudness" >}}) opisuje integrisanu glasnoću po ITU-R BS.1770-4 standardu[^9]. U jednačini ({{< eqref "eq-loudness" >}}), $z_k$ su ponderisani uzorci signala, a $N$ je broj uzoraka. Normalizator meri ovu vrednost i primenjuje fiksni gain da bi doveo glasnoću na minus 23 LUFS.

Tabela 2 navodi hiperparametre sistema.

**Tabela 2.** Hiperparametri sistema.

| Parametar | Vrednost | Opis |
| :--- | ---: | :--- |
| Sample rate | 22050 Hz | Ciljna frekvencija uzorkovanja |
| n_fft | 2048 | Veličina FFT prozora |
| Hop length | 512 | Korak STFT-a |
| Mel filteri | 128 | Broj mel filtera |
| Isečak | 5,0 s | Dužina isečka |
| Preklapanje | 2,5 s | Preklapanje isečaka |
| Embedding | 128 | Dimenzija CNN embeddinga |
| Fanout | 15 | Broj heševe po anchor-u |
| Prag lokalnog maksimuma | 0,25 | Prag za zadržavanje lokalnog maksimuma |
| Nivoi šuma | -5, 0, 5, 10, 20 dB | Nivoi šuma za evaluaciju |

Kao što se vidi iz tabele 2, svi parametri su fiksirani radi reprodukcibilnosti.

### 2.5. Protokol evaluacije

Baza se pravi od čistih isečaka. Upiti su isti isečci sa dodatim šumom, pri čemu je slučajno seme isto za obe metode. Nijedan upit nije u bazi kao čist. Metrike su top 1, top 3, top 5 i top 10 tačnost, kao i srednji recipročni rang. Evaluacija se vrši na pet nivoa šuma. Za CNN se koristi L2 rastojanje, a za matematičku metodu broj poklopljenih heševe. Tie break je leksikografski po identifikatoru pesme.

## 3. Istraživanje i rezultati

Evaluacija je sprovedena na agregatnom noisy test setu od 7281 upita nad 776 upotrebljivih pesama, bez razlaganja po nivou šuma. Glavni rezultat je prikazan u tabeli 3.

Tabela 3 prikazuje rezultate na agregatnom noisy test setu.

**Tabela 3.** Rezultati na agregatnom noisy test setu (7281 upit).

| Metrika | Matematička metoda | CNN embedding |
| :--- | ---: | ---: |
| Top 1 tačnost | 97,56 % | 81,39 % |
| Top 3 tačnost | 98,68 % | 87,75 % |
| Top 5 tačnost | 98,78 % | 89,75 % |
| Top 10 tačnost | 99,04 % | 91,97 % |
| Srednji recipročni rang | 0,976 | 0,850 |

Iz tabele 3 se vidi da matematička metoda postiže višu tačnost na svim metrikama. Razlika u top 1 tačnosti je približno 16 procentnih poena. CNN embedding je približno dvadeset puta brži u inferenciji po isečku.

{{< figure "Slika" "Evolucija matematičke metode. Originalni parametri daju 25 posto top 1 tačnosti, tuning fanout-a, praga i opsega DT podiže rezultat na oko 70 posto, a vremensko poravnanje heševe dovodi do 97,56 posto." "evolucija" >}}

![Stubičasti grafikon evolucije matematičke metode sa tri koraka: 25 posto, oko 70 posto i 97,56 posto top 1 tačnosti.](/images/zbornik/2026/pesmokaz/evolucija.svg)

{{</ figure >}}

Na slici {{< ref "Slika" "evolucija" >}} je prikazana evolucija matematičke metode. Najveći pojedinačni doprinos daje vremensko poravnanje heševe, odnosno upoređivanje izvora i vremenskog pomaka.

{{< figure "Slika" "Poređenje metoda. Matematička metoda je tačnija na svim metrikama, dok je CNN inferenca brža." "poredjenje" >}}

![Grafikon poređenja matematičke metode i CNN embeddinga po top 1, top 5, MRR i vremenu inferencije.](/images/zbornik/2026/pesmokaz/poredjenje.svg)

{{</ figure >}}

Na slici {{< ref "Slika" "poredjenje" >}} je prikazano poređenje metoda. Matematička metoda zadržava visoku tačnost čak i na najnižem nivou šuma od minus 5 dB, što potvrđuje hipotezu da najviši energetski lokalni maksimumi preživljavaju maskiranje šumom. (Per nivo šuma nije izmeren u dostupnim rezultatima.)

{{< figure "Slika" "Konvergencija CNN modela tokom treninga. Prikazana je top 1 tačnost po epohama." "cnn-epochs" >}}

![Grafikon konvergencije CNN modela tokom treninga.](/images/zbornik/2026/pesmokaz/chart-cnn-epochs.png)

{{</ figure >}}

Na slici {{< ref "Slika" "cnn-epochs" >}} je prikazana konvergencija CNN modela, sa najboljim rezultatom na epohi 26.

CNN embedding je konvergirao na epohi 26, sa 81,39 posto top 1 tačnosti, 87,75 posto top 3 i srednjim recipročnim rangom od 0,850. Prethodni prototip na 12 pesama (album The Slow Rush grupe Tame Impala) postigao je 98,68 posto top 1 tačnosti na standardnom testu i 86,03 posto na stress testu, što pokazuje pad sa povećanjem skupa podataka. CNN embedding nije testiran po nivoima šuma u dostupnim rezultatima. To je ograničenje evaluacije. Takođe, test na strukturnim mutacijama, poput kovera i izvođenja uživo, nije izvršen, pa hipoteza o prednosti CNN-a u toj domeni ostaje neproverena.

## 4. Diskusija

Rezultati su u skladu sa očekivanjem da determinističko heširanje postiže visoku tačnost na zašumljenim upitima. Najveći doprinos daje vremensko poravnanje heševe, koje koristi vremensku strukturu pesme, a ne samo prisustvo pojedinačnih heševe. Ovo objašnjava zašto matematička metoda nadmašuje CNN na ovom testu.

CNN embedding je brži u inferenciji i može da bude bolji na strukturnim mutacijama, ali to tek treba potvrditi. Trenutni rezultati ne pokazuju prednost CNN-a na ovom skupu podataka. Mogući razlozi su mali broj pesama u trening skupu relativno velikom broju klasa, kao i to što upiti nisu strukturne mutacije već zašumljeni originali. U takvim uslovima deterministička metoda ima prirodnu prednost.

Ograničenja rada su sledeća. Prvo, evaluacija je agregatna i nije razložena po nivou šuma za CNN. Drugo, test na strukturnim mutacijama nije izvršen. Treće, baze podataka su lokalne i nisu skalabilne za milionske skupove. Četvrto, korisnički interfejs, ZeroMQ komunikacija i mobilna podrška nisu implementirani.

## 5. Zaključak

U radu je predstavljen sistem za prepoznavanje muzike koji poredi determinističko matematičko heširanje i duboko učenje zasnovano na triplet metric learning-u. Na agregatnom noisy test setu od 7281 upita nad 776 pesama matematička metoda postiže 97,56 posto top 1 tačnosti i srednji recipročni rang od 0,976, dok CNN embedding postiže 81,39 posto i 0,850. Matematička metoda je tačnija, dok je CNN inferenca oko 20 puta brža. Postoji razumna pretpostavka da bi CNN, uz više epoha i treniranja, mogao da se poboljša i na većim bazama. Oba pristupa su deterministička u okviru istog izvršnog okruženja i hardvera.

Glavni doprinos je implementacija kompletnog lanca obrade sa zajedničkim interfejsom za dve metode i protokolom evaluacije na 776 upotrebljivih pesama. Ograničenje je što strukturne mutacije nisu testirane. Budući rad treba da obuhvati test na koverima i izvođenjima uživo, poređenje arhitektura (ResNet-18 i MobileNetV3), implementaciju korisničkog interfejsa i skalabilnu centralnu bazu.

## Literatura


[^2]: A. Wang, "An industrial strength audio search algorithm," in Proceedings of the International Society for Music Information Retrieval Conference, Baltimore, USA, 2003, pp. 7-13.

[^3]: F. Schroff, D. Kalenichenko, and J. Philbin, "FaceNet: A unified embedding for face recognition and clustering," in Proceedings of the IEEE Conference on Computer Vision and Pattern Recognition, Boston, USA, 2015, pp. 815-823, doi: 10.1109/CVPR.2015.7298682.

[^4]: M. Defferrard, K. Benzi, P. Vandergheynst, and X. Bresson, "FMA: A dataset for music analysis," in Proceedings of the International Society for Music Information Retrieval Conference, Suzhou, China, 2017, pp. 316-323.

[^5]: B. McFee, C. Raffel, D. Liang, D. P. W. Ellis, M. McVicar, E. Battenberg, and O. Nieto, "librosa: Audio and music signal analysis in Python," in Proceedings of the Python in Science Conference, Austin, USA, 2015, pp. 18-25.

[^6]: J. Johnson, M. Douze, and H. Jégou, "Billion-scale similarity search with GPUs," IEEE Transactions on Big Data, vol. 7, no. 3, pp. 535-547, 2021, doi: 10.1109/TBDATA.2019.2921572.

[^7]: O. Nieto, "pyloudnorm: A simple yet flexible loudness meter in Python," 2019. Dostupno: https://github.com/csteinmetz1/pyloudnorm. Pristupljeno: Oct. 21, 2026.

[^8]: ONNX Runtime developers, "ONNX Runtime: cross-platform, high performance ML inferencing and training accelerator," 2021. Dostupno: https://onnxruntime.ai. Pristupljeno: Oct. 21, 2026.

[^9]: International Telecommunication Union, "Algorithms to measure audio programme loudness and true-peak audio level," ITU-R BS.1770-4, 2015.


[^11]: S. Chang, D. Lee, J. Park, H. Lim, K. Lee, K. Ko, and Y. Han, "Neural Audio Fingerprint for High-specific Audio Retrieval based on Contrastive Learning," in Proceedings of the IEEE International Conference on Acoustics, Speech and Signal Processing, Toronto, Canada, 2021, pp. 3025-3029.
[^12]: R. O. Araz, G. Cortes-Sebastia, E. Molina, J. Serra, X. Serra, Y. Mitsufuji, and D. Bogdanov, "Enhancing Neural Audio Fingerprint Robustness to Audio Degradation for Music Identification," in Proceedings of the International Society for Music Information Retrieval Conference, Daejeon, South Korea, 2025.
[^10]: Prototip projekta mini-shazam-pfe, 12 pesama, ResNet-18, triplet loss, 98,68 posto standardna tačnost, 86,03 posto stress test.

