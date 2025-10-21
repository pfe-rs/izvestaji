---
title: "Detekcija faza sna"
date: 2025-10-21
draft: false
---

# Detekcija faza sna

**Autori:**  
Lazar Denić, učenik II razreda Gimnazije u Raški  
Andrej Odri, učenik III razreda Gimnazije "Veljko Petrović" u Somboru  

**Mentori:**  
Milica Gojak, Elektrotehnički fakultet u Beogradu, inženjer elektrotehnike i računarstva \
Marija Nedeljković, Univerzitet u Kembridžu \
Andrej Bantulić, Elektrotehnički fakultet u Beogradu, inženjer elektrotehnike i računarstva


---


## Apstrakt

Dobar san je ključan za zdravlje i normalno funkcionisanje čoveka. Analiza samog sna, odnosno polisomnografskih signala koji nose sve neophodne informacije za evaluaciju faza, kada je rađena ručno, oduzima dosta vremena, i ne može se zanemariti faktor ljudske greške, odakle dolazi za potrebom automatizacije ovog procesa. Ovaj rad se osvrće na razvoj, posmatranje i upoređivanja rada neuronske mreže kao predstavnika dubokog učenja, i XGBoost modela kao predstavnika Tree klasifikatora. Treniranje i testiranje vršeno je na DREAMT bazi podataka, a kao rezultat dobili smo da je XGBoost brži i precizniji od NN-a, ali da svaki od modela ima svoje prednosti i mane, i bolje detektuje određene faze, te smatramo da je kombinacija ove dve metode optimalna, i da istraživanje treba nastaviti u tom smeru. 

## Abstract

Good sleep is essential for health and normal human functioning. The analysis of sleep itself, that is, polysomnographic signals that carry all the necessary information for evaluating the stages, when performed manually, is time-consuming and subject to human error, which creates the need for automating this process. This paper focuses on the development, observation, and comparison of the performance of a neural network as a representative of deep learning, and an XGBoost model as a representative of tree-based classifiers. Training and testing were conducted on the DREAMT database, and the results showed that XGBoost performed slightly better than the neural network. However, each model has its own strengths and weaknesses and detects certain stages more accurately. Therefore, we believe that combining these two methods is the most optimal approach, and that further research should continue in this direction. 

---

## 1 Uvod

Cilj rada "Analiza faza sna” jeste automatsko prepoznavanje različitih faza sna na osnovu polisomnografskih (PSG) signala. San je kompleksan fiziološki proces koji je podeljen na 5 faza: budno stanje (W), lagani san (N1), srednje dubok san (N2), dubok san (N3) i REM faza [^1]. Analiza ovih faza objašnjava kvalitet sna i može ukazati na različite poremećaje spavanja [^2].

Motivacija za ovaj projekat jeste da se olakša i unapredi proces analize sna koji je spor, skup i podložan ljudskim greškama. Modeli porednjeni u ovom radu mogu imati veliku primenu u medicini, za otkrivanje poremećaja sna, kao i za dugoročno praćenje kvaliteta sna u kućnim uslovima.

Za potrebe projekta korišćena je DREAMT baza podataka [^3], sastavljena od polisomnografskih (PSG) [^4] zapisa 100 ispitanika, u trajanju od oko 8 sati po snimku. Jedan zapis u bazi se sastoji od merenja raznih signala u intervalima od jedne stotinke. Algoritmi su implementirani u *Python*-u.

Korišćeni klasifikatori su ***XGBoost*** [^5] i **neuronska mreža** [^6], sa ciljem da se uporede njihovi rezultati pri detekciji ranije pomenutih faza sna.

Osvrt na rad ogleda se u setu metoda koje se mogu podeliti u nekoliko kategorija:

- **Izvlačenje karakteristika** – Iz PSG signala (EEG, EOG, EMG...) izdvojeni su statistički i frekvencijski parametri relevantni za analizu sna.  
- **Klasifikacija** – Karakteristike su prosleđene *XGBoost* modelu i jednostavnoj neuronskoj mreži za učenje obrazaca.  
- **Detekcija faza sna** – Svaki vremenski segment klasifikovan je u jednu od pet faza: **W**, **N1**, **N2**, **N3** ili **R**.  

---

## 2 Metod

### 2.1 DREAMT dataset i PSG signali

***DREAMT dataset*** [^3] je baza podataka koja je sastavljena od polisomnografskih (PSG) zapisa 100 ljudi tokom sna, gde jedan snimak traje u proseku 8 sati. U svakom zapisu javlja se 26 različitih kanala čije je amplituda signala beležena svake stotinke.

PSG signali jesu kolekcija signala zabeleženih tokom polisomnografskog snimanja i standard su praćenja fizioloških aktivnosti tokom sna, a koriste se za dijagnozu i istraživanja poremećaja spavanja. U najvažnije PSG signale spadaju:  

- **EEG** (elektroencefalogram): meri moždanu aktivnost i ključan je za razlikovanje faza sna.  
- **EOG** (elektrookulogram): beleži pokrete očiju, posebno važne za prepoznavanje REM faze.  
- **EMG** (elektromiogram): prati mišićnu aktivnost, najčešće sa brade, i koristi se za detekciju relaksacije mišića.  
- **EKG** (elektrokardiogram): meri rad srca tokom spavanja.  
- **Dodatni signali**: disanje, zasićenost krvi kiseonikom (SpO₂), pokreti tela.  

---

### 2.2 Predobrada podataka

Na samom začetku, zaključeno je da oko četvrtinu snimaka zauzima period pripreme i postavljanja aparature *(Preparation Stage)*. Ta faza nije korisćena jer ne predstavlja signale spavanja. Takođe su uklonjeni i segmenti označeni kao *Missing*, jer ne sadrže jasne informacije o fazi sna.  

Signal je zatim podeljen na epohe od po 30 sekundi. U svakoj epohi praćeno je više signala koji predstavljaju jedan uzorak za klasifikaciju.  

Jedna epoha može biti označena samo jednom fazom, pa je svakoj fazi dodeljena dominantna epoha, odnosno ona epoha koja se najviše javlja u okviru od 30 sekundi. Podaci koji su bili pripremljeni na ovaj način korišćeni su za treniranje modela.  

---

### 2.3 Izvlačenje karakteristika

U okviru analize biosignala, na svakom segmentu *(epohi)* signala izračunate su sledeće karakteristike:

#### 2.3.1 Minimal-Maximal Distance (MMD)

***MMD*** [^7] predstavlja zbir euklidskih udaljenosti između pozicija i amplituda minimuma i maksimuma u pokretnim prozorima:

$$
\text{MMD} = \sum_{k} \sqrt{(x_{\max}^{(k)} - x_{\min}^{(k)})^2 + (y_{\max}^{(k)} - y_{\min}^{(k)})^2}
$$

gde su $x\_{\max}^{(k)}$, $x\_{\min}^{(k)}$ indeksi, a $y\_{\max}^{(k)}$, $y\_{\min}^{(k)}$ pripadajuće amplitude.

#### 2.3.2 Zero Crossing Rate (ZCR)

***ZCR*** predstavlja broj prelaza signala preko nulte linije:

$$
\text{ZCR} = \sum_{n=1}^{N-1} \mathbf{1}(s\_n \cdot s\_{n+1} < 0)
$$

#### 2.3.3 Signal Energy Slope Integral (ESIS)

***ESIS*** [^8] predstavlja sumu proizvoda kvadrata amplituda i apsolutne promene signala:

$$
\text{ESIS} = \sum_{n=1}^{N} s\_n^2 \cdot f\_s \cdot |s\_n - s\_{n-1}|
$$

#### 2.3.4 Peak-to-Peak Amplitude (ptp)

***PTP*** opisuje prosečan opseg amplituda:

$$
\text{ptp} = \frac{1}{M} \sum_{m=1}^{M} (\max(s^{(m)}) - \min(s^{(m)}))
$$

#### 2.3.5 Hjorth Complexity

***Hjorth Complexity*** [^9] je odnos mobilnosti druge i prve vremenske derivacije:

$$
\text{Complexity} = \frac{\sqrt{\frac{\mathrm{var}(s'')}{\mathrm{var}(s')}}}{\sqrt{\frac{\mathrm{var}(s')}{\mathrm{var}(s)}}}
$$

#### 2.3.6 Bandpower

***Bandpower*** [^7] predstavlja snagu u frekventnom opsegu $ [f\_{\text{low}}, f\_{\text{high}}] $:

$$
P = \frac{1}{N} \sum_{n=1}^{N} (x\_f[n])^2
$$

Korišćeni EEG opsezi: **delta** (0.5--4 Hz), **teta** (4--8 Hz), **alfa** (8--13 Hz), **beta** (13--30 Hz), **gama** (30--45 Hz).

#### 2.3.7 EMG karakteristike

Pri obradi EMG signala korišćene su sledeće karakteristike : ***MMD***, ***ZCR***, ***ESIS***, ***ptp***, ***Hjorth complexity*** i ***Bandpower***.

#### 2.3.8 Respiratorne karakteristike

Pri analizi respiratornih signala korišćene su sledeće karakteristike: **Varijansa**, ***ZCR***, ***MMD*** i ***ESIS***, izračunate na isti način kao i za EMG signal.

#### 2.3.9 EOG karakteristike

Za opis EOG signala uzete su vrednosti: **Varijansa razlike signala dva kanala**, ***ZCR prvog kanala***, **broj pikova amplituda** (ako $|s\_n| > \sigma(s)$), i **kašnjenje maksimalne korelacije** [^10]:

$$
\text{lag}\_{\max} = \arg\max\_{\tau} |\mathrm{corr}(s\_1, s\_2, \tau)|
$$

#### 2.3.10 Saturacija kiseonikom (SaO\_2)

U obradi saturacije kiseonikom, korištene su sledeće mere:

- **Standardna devijacija**: $\sigma(s)$  
- **Minimum**: $\min(s)$  
- **Ukupno trajanje ispod 90%**, prag od 90% korišćen je u skladu sa kliničim smernicama za detekciju hipoksemije [^11]:  

$$
T = \frac{1}{f\_s} \sum_{n=1}^{N} \mathbf{1}(s\_n < 0.9)
$$

#### 2.3.11 Akcelerometar

Sa očitanog signala akcelerometra izračunate su: **srednja vrednost i standardna devijacija po osi**, **magnituda**:

$$
m\_n = \sqrt{x\_n^2 + y\_n^2 + z\_n^2}
$$

**Površina magnitude** [^12]:

$$
A = \sum_{n=1}^{N} |x\_n| + |y\_n| + |z\_n|
$$

#### 2.3.12 Otkucaji srca (HR)

Iz signala otkucaja srca *(HR)* izvučene su:

- **Srednja vrednost**: $\mu = \frac{1}{N} \sum_{n=1}^N s_n$  
- **Maksimum**: $\max(s_n)$    
- **Standardna devijacija**: $\sigma = \sqrt{\frac{1}{N} \sum_{n=1}^N (s_n - \mu)^2}$

---

### 2.4 Metode Klasifikacije

#### 2.4.1 Neuronska mreža (NN)

Ovaj deo je zasnovan na opštim principima neuronskih mreža [^6].

**Neuronska mreža** *(NN)* je model mašinskog učenja inspirisan strukturom i funkcijom bioloških neurona.  
Sastoji se od slojeva povezanih jedinica (neurona), gde svaki neuron prima ulazne vrednosti, množi ih sa težinama, sabira i primenjuje nelinearnu aktivacionu funkciju.

Neka je ulazni vektor podataka $\mathbf{x} = (x_1, x_2, \dots, x_n)$, a težine i pristranost *(bias)* sloja označimo sa $\mathbf{W}$ i $\mathbf{b}$.  
Izlaz jednog sloja neurona računa se kao:

$$
\mathbf{z} = \mathbf{W} \mathbf{x} + \mathbf{b}
$$

gde je $\mathbf{z}$ linearna kombinacija ulaza i težina.  
Na ovu kombinaciju primenjuje se nelinearna aktivaciona funkcija $\sigma(\cdot)$:

$$
\mathbf{a} = \sigma(\mathbf{z})
$$

Uobičajene aktivacione funkcije su **sigmoid**, **ReLU**, **GeLU** i **SoftMax**.

---

##### *Forward pass*
Podaci se propagiraju kroz slojeve mreže od ulaza ka izlazu, pri čemu se u svakom sloju računa linearna transformacija i aktivacija, kako bi se dobio konačni izlaz $\hat{y}$.

##### *Backward pass*
Za treniranje mreže koristi se ***gradient descent***.  
Greška modela $L(\hat{y}, y)$ između predikcije $\hat{y}$ i stvarne vrednosti $y$ računa se, a zatim gradijenti po parametrima mreže:

$$
\frac{\partial L}{\partial \mathbf{W}}, \quad \frac{\partial L}{\partial \mathbf{b}}
$$

se koriste za ažuriranje težina i bias-a:

$$
\mathbf{W} \leftarrow \mathbf{W} - \eta \frac{\partial L}{\partial \mathbf{W}}, \quad
\mathbf{b} \leftarrow \mathbf{b} - \eta \frac{\partial L}{\partial \mathbf{b}}
$$

gde je $\eta$ stopa učenja *(learning rate)*.

Ciklus *forward* i *backward pass*-a se ponavlja kroz više epoha treninga dok model ne postigne zadovoljavajuću preciznost.

---

Neuronska mreža u ovom projektu ima **5 potpuno povezanih slojeva**.  
Ulazni sloj prima vektor dimenzije 103, dok izlazni sloj daje verovatnoće za pripadnost jednoj od 5 faza sna.  

Aktivaciona funkcija je **GeLU**:

$$
\mathrm{GeLU}(x) = x \cdot \Phi(x)
$$

gde je $\Phi(x)$ kumulativna distribuciona funkcija standardne normalne distribucije.

Da bi se smanjio problem ***overfitting-a***, primenjen je ***dropout*** od 40% i **L2 regularizacija**:

$$
\mathcal{L} = \mathcal{L}_\mathrm{cross-entropy} + \lambda \sum_i w_i^2
$$

Optimizacija se vrši **Adam algoritmom**:

$$
m_t = \beta_1 m_{t-1} + (1 - \beta_1) \nabla_\theta \mathcal{L}_ t, \quad
v_t = \beta_2 v_{t-1} + (1 - \beta_2) (\nabla_\theta \mathcal{L}_t)^2
$$


$$
\hat{m}_t = \frac{m_t}{1 - \beta_1^t}, \quad \hat{v}_t = \frac{v_t}{1 - \beta_2^t}
$$

$$
\theta_{t+1} = \theta_t - \alpha \frac{\hat{m}_t}{\sqrt{\hat{v}_t} + \epsilon}
$$

Funkcija greške je ***cross-entropy***:

$$
\mathcal{L}_\mathrm{cross-entropy} = - \sum _{c=1}^C y_c \log(\hat{y}_c)
$$

---

#### 2.4.2 XGBoost

Implementacija ***XGBoost*** klasifikatora je zasnovana na metodi Čena i Gestrina [^5].

XGBoost je algoritam ***gradijentnog boostinga*** zasnovan na stablima odlučivanja *(decision trees)*.

Za skup podataka sa $N$ uzoraka i $M$ karakteristika, funkcija greške je:

$$
\mathcal{L}(\phi) = \sum_{i=1}^N l(y_i, \hat{y}_i) + \sum _{k=1}^K \Omega(f_k)
$$

gde je $l$ gubitak, $f_k$ $k$-to stablo, a regularizacija stabla:

$$
\Omega(f) = \gamma T + \frac{1}{2} \lambda \sum_{j=1}^T w_j^2
$$

*Boosting* funkcioniše iterativnim dodavanjem stabala koja minimizuju grešku:

$$
\hat{y}_i^{(t)} = \hat{y}_i^{(t-1)} + \eta f_t(x_i)
$$

Parametri kao što su ***max_depth***, broj stabala $K$, i stopa učenja $\eta$ podešeni su da optimizuju balans preciznosti i složenosti.


## 3 Rezultati

Testiranje metoda rađeno je na DREAMT bazi podataka koja sadrži sve neophonde PSG zapise,
dok je podela na trening validacioni i test skup rađena u obliku 70:15:15. Kroz proces
obučavanja praćena je funkcija gubitka (*loss* funkcija), tačnost klasifikacije i matrica
konfuzije.

Funkcija gubitka kroz epohe kod neuronske mreže, pokazuje nagli pad i kasniju stabilizaciju i osciliranje oko 0.3.  

![Grafik loss funkcije](/images/train-loss-image.svg) 
**Slika 1.** Grafik *loss* funkcije.

Ovakav trend ukazuje na stabilan proces učenja bez naglašene prenaučenosti.

Tačnost validacije, nakon brzog rasta u prvim epohama, dostiže stabilne vrednosti u
opsegu između 85 i 86%.

Matrica konfuzije za neuronsku mrežu pokazuje pravilnu klasifikaciju u većini slučajeva,
sa povećanjem grešaka kod prelaznih faza, zato što je velika sličnost na mestima gde se
signali graniče.

![Grafik validacije NN](/images/validation-accuracy-image.svg)   

**Slika 2.** Grafik validacije neuronske mreže.


![Matrica konfuzije za NN](/images/confusion-matrix-nn.svg)   

**Slika 3.** Matrica konfuzije neuronske mreže.


Za poređenje, XGBoost klasifikator je testiran na istim podacima i ostvario je prosečnu
tačnost od oko 89% . 


![Matrica konfuzije XGBoost](/images/confusion-matrix-xgboost.svg) 

**Slika 4.** Matrica konfuzije *XGBoost - a*.


---

## 4 Zaključak

Projekat "Detekcija faza sna" prikazuje rešenja problema analize sna i obeležavanja faza. Testiranjem nad DREAMT bazi podataka, veću tačnost postigao je XGBoost (90%), ali je osetljiviji na promene podataka od neuronske mreže (85–86%), koja je stabilnija pri treniranju i varijabilnosti podataka. Postignuti rezultati rada uporedivi su sa radom Šarme i saradnika [^13], gde je postignuta tačnost 86%.

---

## 5 Literatura

[^1]: Patel, Aakash K., et al. "Physiology, sleep stages." StatPearls [Internet]. StatPearls Publishing, 2024.
[^2]: Pavlova, Milena K., and Véronique Latreille. "Sleep disorders." The American journal of medicine 132.3 (2019): 292-299.
[^3]: Michielli, Nicola, Federico Fabris, and Matteo Zanotto. DREAMT: Deep Learning-based EEG Analysis for Automatic Sleep Staging. PhysioNet, 2021, https://doi.org/10.13026/dreamt-2-1-0.
[^4]: Roebuck, A., et al. "A review of signals used in sleep analysis." Physiological measurement 35.1 (2013): R1.
[^5]: Chen, Tianqi, and Carlos Guestrin. "Xgboost: A scalable tree boosting system." Proceedings of the 22nd acm sigkdd international conference on knowledge discovery and data mining. 2016.
[^6]: Gurney, Kevin. An introduction to neural networks. CRC press, 2018.
[^7]: Aboalayon, Khald Ali I., et al. "Sleep stage classification using EEG signal analysis: a comprehensive survey and new investigation." Entropy 18.9 (2016): 272.
[^8]: Santaji, Sagar, and Veena Desai. "Analysis of EEG signal to classify sleep stages using machine learning." Sleep and Vigilance 4.2 (2020): 145-152.
[^9]: Alawee, Wissam H et al. “Advancing biomedical engineering: Leveraging Hjorth features for electroencephalography signal analysis.” Journal of electrical bioimpedance vol. 14,1 66-72. 31 Dec. 2023, doi:10.2478/joeb-2023-0009
[^10]: Oppenheim, Alan V., and Ronald W. Schafer. Discrete-Time Signal Processing. 3rd ed., Pearson, 2010.
[^11]: Berry, Richard B., et al. The AASM Manual for the Scoring of Sleep and Associated Events: Rules, Terminology and Technical Specifications. Version 2.6, American Academy of Sleep Medicine, 2020.
[^12]: Chung, Wan-Young, Amit Purwar, and Annapurna Sharma. "Frequency domain approach for activity classification using accelerometer." 2008 30th Annual International Conference of the IEEE Engineering in Medicine and Biology Society. IEEE, 2008.
[^13]: Sharma, Manish, et al. "An automated wavelet-based sleep scoring model using EEG, EMG, and EOG signals with more than 8000 subjects." International Journal of Environmental Research and Public Health 19.12 (2022): 7176.
