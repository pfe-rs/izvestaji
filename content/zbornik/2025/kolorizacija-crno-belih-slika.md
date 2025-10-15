---
title: Kolorizacija crno-belih slika
summary: Kolorizacija crno-belih slika je projekat rađen na letnjem kampu za stare polaznike 2025. čiji su autori Jana Mitrović i Natalija Janković
svg_image: /images/zbornik/2025/kolorizacija-crno-belih-slika/graficki-apstrakt.svg
---

**Autori:**

Jana Mitrović, učenica IV razreda ESTŠ “Nikola Tesla” u Kraljevu

Natalija Janković, učenica IV razreda Prve kragujevačke gimnazije

**Mentori:**

Aleksa Račić, 

Andrej Bantulić

![Grafički apstrakt](/images/zbornik/2025/kolorizacija-crno-belih-slika/graficki-apstrakt.svg)

### Apstrakt

U ovom radu razmatramo problem automatske kolorizacije crno-belih fotografija implemetacijom Generativne Adverserijalne mrežne (GAN) arhitekture. Cilj ovog rada je da se inovativnom implementacijom GAN arhitekture, postignu bolji rezultati na istim evaluacionim metrikama kakve su korišćene u prethodnim radovima[^1] [^2]. Implementacija GAN-a podrazumeva uvođenje dve konvolucione neuralne mreže suprostavljene u adverserijalnom odnosu: generatora i diskriminatora. Generator, na osnovu svetlosne komponente fotografije u boji generiše hromatske komponente klasifikacijom boja s rebalansiranjem klasa. Diskriminator, primenom PatchGAN arhitekture, vršeći binarnu klasifikaciju lokalnih delova fotografije, evaluira autentičnost boja na fotografiji. Adverserijalnim treningom ove dve mreže uče uticajem jedne na drugu, gde generator teži da proizvede što realističnije boje na osnovu evaluacije diskriminatora, a diskriminator teži da ih što bolje klasifikuje. Evaluacija rezultata ovog rada je sprovedena anketom, *colorization Turing test*-om, u kojem su ispitanici između fotografije s realnim i fotografije s izgenerisanim bojama birali onu s izgenerisanim. Rezultati ovog testa pokazuju da je model u 47% slučaja uspeo da izgeneriše dovoljno realne fotografije, tako da je uspešno “prevario” ispitanika.

### Abstract

In this paper, we address the problem of automatic colorization od black and white photographs by implementing Generative Adverserial Network (GAN) architecture. The goal of this paper is to achieve superior results on the evaluation metrics used in previous works[^1] [^2] through an innovative implementation of a GAN architecture. The proposed architecture consists of two convolutional neural networks engaged in an adversarial relationship: a generator and a discriminator. The generator is fed the lightness component of a color image, based on which it must generate the remaining chromatic components using color classification with class rebalancing. The discriminator, utilizing a PatchGAN architecture, evaluates the authenticity of the colors by performing binary classification on local image patches. Through adversarial training, these two networks learn from each other's influence, where the generator aims to produce realistic colors based on the discriminator’s evaluation, and the discriminator seeks to better classify them. The evaluation of the results in this work was conducted via a survey, a colorization Turing test, in which participants were asked to choose the photograph with generated colors between an image with real colors and one with generated colors. The results of this test show that the model successfully generated sufficiently realistic photographs in 47% of cases, thus successfully "fooling" the participants.

### 1. Uvod

Problem automatske kolorizacije fotografija se rešava modelom koji na osnovu crno-bele fotografije pokušava da predvidi boju svakog piksela tako da krajnji rezultat izgleda što realnije i prirodnije ljudskom oku.
Količina informacija koje je potrebno rekonstruisati na fotografiji, a koje ne postoje, kao i sama priroda evaluacije generisanja boja na fotografiji čine rešavanje ovog problema vrlo izazovnim.

Motivacija za ovaj projekat dolazi iz praktičnih, kreativnih i naučnih razloga. Kolorizacija starih crno-belih fotografija i filmova može doprineti njihovoj restauraciji i učiniti ih vizuelno privlačnijim, dok estetski privlačne vizualizacije mogu biti korisne i u marketingu ili prezentacijama. Takođe, bojenje crno-belih podataka može pomoći u boljem razumevanju naučnih snimaka, poput satelitskih fotografija ili rendgenskih snimaka, čime se poboljšava analiza i interpretacija podataka.

Priroda ovog problema je takva da za mnoge objekte ne postoji jedna jedina „ispravna“ boja. Isti semantički objekti na fotografiji mogu biti totalno različitih boja, tako da i dalje sve te varijante kolorizacije budu prirodne i realne ljudskom oku. Na primer, jabuka na fotografiji može biti crvena ili zelena, što su dve skroz različite boje ali obe će u ovom slučaju izgledati prirodno na ovom objektu. Samim tim se dolazi do zaključka da nijedna statička metrika, osim ljudskog oka, koja će porediti originalnu sliku u boji i tu sliku s izgenerisanim bojama piksel po piksel neće biti dovoljno dobra s obzirom da cilj nije rekonstrukcija informacija s originalne fotografije, već generisanje kolorizacije prirodne ljudskom oku. 

Prednost ovog problema je pristupačnost podataka: svaka fotografija u boji može biti iskorišćena za trening. Konverzijom fotografija u CIE *Lab* prostor boja možemo odvojiti svetlosnu komponentu - *L* kanal *(lightness)* od hromatskih komponenti, tj. boja - *a* i *b* kanali boja. Svetlosna komponenta odvojena iz slike u boji, postaje crno-bela fotografija, koja i dalje sadrži podatke o semantičkom sadržaju fotografije i na osnovu koje se može generisati predikcija boja.

Za rešavanje ovog problema izabran je GAN *(Generative Adversarial Network)* pristup. GAN je neuronska mreža koju čine dva suprotstavljena modela – generator i diskriminator. Generator predviđa boje svakog piksela na osnovu svetlosne komponente fotografije, te stvara hromatske komponente, dok diskriminator procenjuje da li je rezultat generisanja uverljiv. Ova arhitektura je pogodna jer za kolorizaciju ne postoji metrika koja može objektivno da proveri „tačnost“ boja, iz prethodno navedenih razloga, pa se diskriminatorska mreža uvodi kao jedna koja uči da evaluira rezultate kolorizacije na osnovu semantičkih podataka sa crno-bele fotografije.

Prethodni radovi koji su se bavili ovim problemom su najčešće koristili klasične konvolucione neuronske mreže gde su boje predstavljali u CIE Lab prostoru i predviđali vrednosti *a* i *b* kanala za svaki piksel korišćenjem regresije[^3] ili klasifikacije s rebalansiranjem klasa[^1]. Pristup poput regresije može da funkcioniše, ali rezultira izbledelim i sivkastim tonovima, jer mreža radi minimizovanja greške bira sive, sepia, “isprane” tonove. U radu[^1] je kolorizaciji pristupljeno kao klasifikacionom problemu, kvantizujući prostor boja u diskretne klase i predviđajući verovatnoću za svaku klasu na svakom pikselu, s rebalansiranjem klasa na osnovu učestalosti njihovog pojavljivanja. Na taj način se dobijaju rezultati dosta uspešniji od prethodnih, međutim oni i dalje pokazuju nedostatke u semantičkoj doslednosti boja, česte konfuzije između crvenih i plavih nijansi i podrazumevano generisanje neutralnih tonova na složenim unutrašnjim scenama.

Cilj ovog rada je postizanje superiornijih rezultata na istim metrikama u odnosu na prethodne radove[^1] [^2]. Evaluacija uspešnosti rada je obavljena direktnim testiranjem perceptivne realističnosti fotografija od strane ljudskih posmatrača: *Colorization Turing test*. Učesnicima se istovremeno prikazuju 2 fotografije istog sadržaja, samo jedna s izgenerisanim, a druga s originalnim bojama, i od njih se traži da se identifikuje lažna. Prethodni radovi su na ovom testu ostvarivali najviše 32% uspešnosti, te je cilj ovog rada ostvariti rezultat bolji od tog.

{{< figure "Slika" "Grafički apstrakt" "graficki-apstrakt" >}}

![Grafički apstrakt](images/zbornik/2025/kolorizacija-crno-belih-slika/graficki-apstrakt.svg)

{{</ figure >}}

### 2. Metod

GAN mreže predstavljaju arhitekturu koja se sastoji od dva modela - generator i diskriminator, koji se u adverserijalnom treningu naizmenično treniraju međusobnim uticajem. Generator ima za cilj da generiše što realističnije podatke (u ovom slučaju  boje) koji oponašaju stvarne (boje na originalnim fotografijama), a diskriminator ima za cilj da što preciznije razlikuje autentične od generisanih podataka na osnovu evaluacije koju računa za njih. Adverserijalni trening omogućava da se generator pospešuje na osnovu diskriminatorske evaluacije izgenerisanih podataka, koju koristi za računanje greške generisanja. S druge strane, diskriminator teži što uspešnijem razlikovanju autentičnih od izgenerisanih podataka, te samim tim i što preciznijom evaluacijom izgenerisanih podataka, koja se dalje koristi u treningu generatora.On se na taj način može posmatrati kao jedna metrika generisanja boja (više o tome u 4. Diskusija).

Za ovu problematiku, GAN mreža predstavlja odlično rešenje baš zbog diskriminatora koji ne dozvoljava generatoru da ,,igra na sigurno” i generiše izbledele i sivkaste tonove, kao što je slučaj kod klasičnih konvolucionih neuronskih mreža. Na taj način se postiže da generisana slika ne mora biti identična originalnoj slici, već samo vizuelno uverljiva i prirodna. Generator, uz pomoć povratnih informacija iz diskriminatora,  uči da bolje razume odnose između sivih tonova i boja, kao i kontekst objekata na slici, čime se dobija realističan prikaz. Ovakav pristup omogućava modelu da nauči i međusobnu interakciju boja u u prostoru i svetlu, što značajno doprinosi kvalitetnijem bojenju crno-belih slika.

{{< figure "Slika" "GAN mrežna arhitektura" "gan-arhitektura" >}}

![GAN mrežna arhitektura](/images/zbornik/2025/kolorizacija-crno-belih-slika/slika-2.svg)

{{</ figure >}}

Ključ je u dobrom odabiru pristupa generisanja boja: da li je to regresija ili klasifikacija, i na koji način bi se implementirao odabrani pristup. U radu[^3] se koristi regresija boja s Euklidskim gubitkom između vrednosti originalnih i izgenerisanih boja na fotografiji. Kako piksel ima različite vrednosti iz skupa *ab*, optimalno rešenje za Euklidski gubitak će biti prosečna vrednost tog skupa. Na taj način se generišu sive, nesaturisane, “isprane” boje, jer su srednje vrednost skupova *a* i *b* 0 (originalni opseg vrednosti ova dva kanala je [-128,+127] ) a 0 predstavlja sivu boju. Iz tog razloga se ovom problemu pristupa multinomijalnom klasifikacijom. 

Prostor *ab* se kvantizuje na, u ovom slučaju, 313 diskretnih centara boja korišćenjem mrežne podele s korakom od 10 jedinica, pri čemu se zadržavaju isključivo one vrednosti koje se nalaze unutar opsega mogućih kombinacija vrednosti ova dva kanala. Na ovaj način transformišemo kontinualni dvodimenzionalni *ab* prostor u konačan skup diskretnih boja. Na slici {{< ref "Slika" "ab-kvantizovano" >}}. se može videti ilustracija rezultata kvantizacije *ab* prostora.

{{< figure "Slika" "Kvantizovan ab prostor boja kao mreža s korakom 10. Svaki od 313 parova ab vrednosti je prikazano kao boja koju predstavljaju." "ab-kvantizovano" >}}

![AB kvantizovan prostor](/images/zbornik/2025/kolorizacija-crno-belih-slika/slika-3.svg)

{{</ figure >}}

Cilj mreže je predikcija boje svakog piksela iz konačnog skupa prethodno kvantizovanih vrednosti boja, tj. predikcija vrednosti *a* i *b* kanala za svaki piksel. Za svaki piksel se računa raspodela verovatnoća po svih 313 kvantizovanih boja, a konačne *a* i *b* vrednosti piksela se dobijaju linearnom kombinacijom koordinata svih boja u kvantizovanom prostoru i njihovih verovatnoća kao težinskim faktorom. Više o ovakvom pristupu u referentnom radu[^1] i sekciji 2.2.

Rebalansiranje klasa se manifestuje tokom računanja gubitka, pri čemu se svakom pikselu dodeljuje težinski koeficijent na osnovu kombinacije empirijske distribucije boja iz trening skupa i uniformne distribucije verovatnoće po svih 313 kvantizovanih boja, dodeljujući veću težinu retkim, jarkim bojama, rezultujući u većem gubitku generatora. Ovaj pristup sprečava neprecizno i gotovo podrazumevano generisanje boja koja se najčešće pojavljuju u setu podataka - neutralnih, sivkastih, “sepia” tonova i podstiče generisanje živopisnijih kolorizacija. Više o ovome u sekciji 2.3.

#### 2.1. Aparatura - obrada baze podataka

U referentnom radu[^1] je korišćena baza ImageNet, koja ima milion fotografija. Zbog resursne ograničenosti u ovom radu koristili smo ImageNet100, koja ima 150 hiljada fotografija, podeljenih u 10 klasa, na osnovu njihovog vizuelnog sadržaja, od po u proseku 1500 fotografija po klasi. Raspoređnost slika u tih 10 klasa na osnovu njihovog vizuelnog sadržaja će kasnije postati veoma značajna informacija u modeliranju treninga mreže, što je dalje diskutovano u 3. Rezulati i istraživanja.
S obzirom da su fotografije u boji i različitih su dimenzija, potrebno ih je prilagoditi ulazu ove mreže. Prvi korak je skaliranje veličine originalne fotografije na određene dimenzije. Korišćene dimenzije su 256x256 px. Potom potrebno je izvršiti konverziju fotografije u *Lab* prostor boja. Potom, u tom prostoru boja odvajamo svetlosnu komponentu fotografije - *L* kanal, od komponenti boja - *a* i *b* kanala, te ih tako smeštamo u tenzore: tenzor koji pamti *L* kanal (B x 1 x H x W) i tenzor koji pamti *a* i *b* kanal (B x 2 x H x W). Na taj način smo odvojili crno-belu fotografiju - podatke o osvetljenosti od podataka o bojama na originalnoj slici. Zbog opsega vrednosti, potrebno je normalizovati tenzore na određene raspone kako bismo poboljšali konvergenciju mreže. L kanal se normalizuje na opseg [-0.5,0.5] a *a* i *b* kanali na opseg [-1,1], kako su originalni opsezi za *L* kanal [0,100] i za kolor kanale [-128,+127]. Ovakav *L* tenzor se prosleđuje kao ulaz generatora.

#### 2.2. Generator i diskriminator

Arhitektura generatora je pravljena po uzoru na kolorizator iz referentnog rada[^1] uz određene modifikacije: u pitanju je konvoluciona neuralna mreža sa 6 konvolucionih blokova organizovanih u enkoder-dekoder strukturu sa specifičnim karakteristikama prenosa fejtova. Strukturu enkodera čini prvih 5 konvolucionih blokova, dok 6. čini dekoder strukturu. Modifikacija u odnosu na generator iz referentnog rada je u smanjenju broja konvolucionih slojeva, kao i strukturi pojedinih, u aktivacionoj funkciji i formatu izlaza generatora.
Na ulazu se generatoru prosleđuje tenzor *L* kanala slike (crno-bela fotografija) a na izlazu se dobijaju dva kanala izgenerisanih boja: *a* i *b* komponente boja u CIE *Lab* prostoru. 

{{< figure "Slika" "Arhitektura generatora" "gen-arhitektura" >}}

![Arhitektura generatora](/images/zbornik/2025/kolorizacija-crno-belih-slika/slika-4.svg)

{{</ figure >}}

Ulazni podatak je, dakle, tenzor L kanala dimenzija (Bx1xHxW). Prvi konvolucioni blokovi vrše početnu obradu *L* kanala serijom konvolucija s progresivnim smanjenjem prostorne rezolucije, faktorom 2 kroz 3 bloka, uz istovremeno povećavanje broja kanala prostornih karakteristika. Već na izlazu trećeg bloka imamo kapacitet od 256 kanala prostornih karakteristika, postignutih dubljom ekstrakcijom karakteristika, uz značajno redukovanu rezoluciju, čak 8 puta manju u odnosu na originalnu. Ovo omogućava razumevanje globalnog semantičkog sadržaja slike. Četvrti i peti sloj čine najdublje delove arhitekture koji povećavaju broj prostornih kanala na 512, održavajući rezoluciju konstantnu na H/8xW/8. Ovi slojevi se sastoje od serija konvolucija s jezgrima 3x3 i padding-om 1, što omogućava zadržavanje prostornih informacija istovremeno s ekstrakcijom karakteristika viših nivoa. 

Na izlazu iz enkodera rezolucija fotografije je smanjena na osminu originalne rezolucije, a broj kanala prostornih karakteristika je 512. Takođe, svi slojevi koriste LeakyReLU, umesto ReLU aktivacione fukcije, s negativnim nagibom 0.2, radi sprečavanja potpunog “umiranja” negativnih neurona. Takođe, radi stabilizacije vrednosti nakon svakog sloja se koristi batch 2D normalizacija.

Šesti konvolucioni blok već čini strukturu dekoderskog dela generatora uz transponovanu konvoluciju s jezgrom 4x4 i stride 2 za upsampling rezolucije nazad na četvrtinu originalne rezolucije (H/4,W/4) i smanjenje kanala prostornih karakteristika sa 512 na 256. Nakon ove rekonstrukcije rezolucije sledi serija konvolucija s jezgrom 3x3, stride i padding-om 1 koje dodatno produbljuju prostorne karakteristike, da bi se konačno primenila 1x1 konvolucija koja mapira 256 na 313 izlaznih kanala prema broju boja kvantizovanih u *ab* prostoru.

Nakon izlaska iz dekodera i dobijanja tenzora neobrađenih vrednosti dimenzija (Bx313xH/4xW/4), primenjuje se *softmax*  funkcija koja transformiše te neobrađene vrednosti u raspodelu verovatnoća po kvantizovanim bojama, takve da svaki piksel ima raspodelu verovatnoća po svih 313 boja koje sveukupno daju zbir 1. 
Specijalni poslednji izlazni sloj konvolucijom 1x1 vrši projekciju 313-dimenzionalne raspodele na 2 izlazna kanala, implementirajući linearnu kombinaciju gde se konačne *ab* vrednosti dobijaju kao ponderisani prosek svih boja iz palete sa verovatnoćama kao težinama po sledećoj formuli

{{< equation "eq-z_hat" >}}

$$
\hat{Z}_{i,j} = \sum_{k=1}^{313} P_k \cdot C_k ,
$$

{{</ equation >}}

gde je $\hat{Z}_{i,j}$ rezultat u vidu vrednosti _a_ i _b_ kanala za piksel $(i,j)$, $P_k$ verovatnoća boje $k$ dobijena *softmax* funkcijom, a $C_k$ koordinate boje $k$ u $ab$ prostoru iz palete 313 kvantizovanih boja. Ova operacija efikasno prevodi diskretnu raspodelu u kontinualne ab vrednosti, što omogućava glatke prelaze između boja, nakon čega se primenjuje bilinearna interpolacija za vraćanje na punu rezoluciju fotografije, Ovaj pristup kombinuje prednosti diskretne klasifikacije (preciznost u izboru boja) i kontinualne regresije (glatkost prelaza), omogućavajući generaciju vizuelno prihvatljivih rezultata bojenja.

Ispod je tabelarni prikaz arhitekture generatora.

| Sloj | Ulazne dimenzije | Izlazne dimenzije | Aktivacija / Normalizacija | Objašnjenje |
|------|------------------|-------------------|---------------------------|-------------|
| Prvi sloj (početak enkodera) | B x 1 x H x W | B x 64 x H x W | LeakyReLU, BatchNorm | Početno smanjenje rezolucije i povećanje broja prostornih kanala |
| Drugi sloj | Izlaz prvog sloja | B x 128 x H/2 x W/2 | LeakyReLU, BatchNorm | Dalje smanjenje rezolucije, povećanje broja kanala |
| Treći sloj | Izlaz drugog sloja | B x 256 x H/4 x W/4 | LeakyReLU, BatchNorm | Dalje smanjenje rezolucije, povećanje broja kanala |
| Četvrti sloj | Izlaz trećeg sloja | B x 512 x H/8 x W/8 | LeakyReLU, BatchNorm | Maksimalno smanjenje rezolucije, maksimalno povećanje broja kanala |
| Peti sloj | Izlaz četvrtog sloja | B x 512 x H/8 x W/8 | LeakyReLU, BatchNorm | Najdublja ekstrakcija karakteristika - održanje broja kanala i rezolucije |
| Šesti sloj (dekoder) | Izlaz petog sloja | B x 256 x H/4 x W/4 → B x 313 x H/4 x W/4 | LeakyReLU | Transponovana konvolucija za rekonstrukciju rezolucije i smanjenje na 256 kanala, mapiranje 256 na 313 kanala po broju boja |
| Softmax, projekcija i upsampling | (Izlaz dekodera) B x 313 x H/4 x W/4 | B x 2 x H x W (prediktovana a* i b* kanala) (ili i Logits) | Softmax, Conv2d(313→2), Upsample | Linearna kombinacija logits-a u a* i b* komponente pune rezolucije |

Diskriminator je binarni klasifikator koji ocenjuje autentičnost boja fotografije. U svakoj iteraciji se fotografija s originalnim i fotografija s izgenerisanim bojama prosleđuje na ulaz diskriminatora, koji treba da oceni autentičnost njenih boja: da proceni da li je to ona s originalnim ili s izgenerisanim bojama. Diskriminatori koji se uobičajeno koriste su binarni klasifikatori takvi da za celu fotografiju daju jednu ocenu u intervalu [0,1], gde je 0 najmanja verovatnoća da fotografija ima realne boje, a 1 najveća. Inovacija u odnosu na diskriminatore kakvi se uobičajeno koriste je korišćenje *PatchGAN* tehnologije, koji umesto da za svaku sliku daje jednu vrednost verovatne da su boje autentične na istoj, on računa tu verovatnoću za sve njene delove, *patch*-eve, lokalne regione dimenzija 30x30px. Arhitektura se sastoji iz pet konvolucionih blokova sa progresivnim povećanjem broja filtera i smanjenjem prostorne rezolucije.

Diskriminator uzima fotografiju u Lab prostoru dimenzija (B x 3 x H x W) kao ulazni podatak, gde su 3 kanala druge dimenzije *L*, *a* i *b* komponente fotografije. Izlaz je niz vrednosti verovatnoća da su boje autentične na svakom lokalnom *patch*-u.

Prvi konvolucioni sloj primenjuje 64 filtera sa jezgrom 4×4 i stride 2, pri čemu se dobijaju 64 prostorna kanala, uz duplo smanjenu rezoluciju. Drugi sloj produbljuje prostorne karakteristike povećavajući broj kanala prostornih karakteristika na 128 i smanjujući rezoluciju na četvrtinu početne, istom konfiguracijom filtera. Treći konvolucioni sloj dalje produbljuje prostorne karakteristike koristeći 256 filtera, i smanjenjem rezolucije na čak osminu početne. Četvrti konvolucioni blok uvodi promenu u konfiguraciji slojeva. Primena *zero padding*-a proširuje ulaznu mapu karakteristika, nakon čega konvolucija sa jezgrom 4×4 i stride 1 proizvodi mapu sa povećanjem broja kanala prostornih karakteristika, čak 512. Ova promena u arhitekturi omogućava održavanje prostorne rezolucije u dubljim slojevima uz istovremeno povećanje broja kanala karakteristika. Peti i poslednji konvolucioni sloj ponovo primenjuje *zero padding* za proširenje ulazne mape karakteristika, nakon čega konvolucija sa jednim filterom i jezgrom 4×4 generiše konačnu izlaznu mapu.

Svaki element ove mape odgovara verovatnoći autentičnosti boja odgovarajućeg regiona (*patch*-a) ulazne slike. *LeakyReLU* se primenjuje nakon svakog konvolucionog sloja sa negativnim nagibom od 0.2, što onemogućava potpuno “odumiranje” neurona za negativne ulazne vrednosti. *Batch normalization* se primenjuje na svim slojevima kako bi se stabilizovao trening proces. 

Ova arhitektura implementira *PatchGAN* pristup gde diskriminator ne procenjuje celu sliku globalno, već generiše mapu odgovora u kojoj svaki element predstavlja verovatnoću autentičnosti lokalnog regiona odgovarajuće veličine. Ovaj pristup je posebno dobar za zadatak bojenja jer omogućava fokus na karakteristike lokalnih regiona fotografije umesto samo na globalni pogled.

Ispod je tabelarni prikaz arhitekture diskriminatora.

| Sloj | Ulazne dimenzije | Izlazne dimenzije | Aktivacija / Normalizacija | Objašnjenje |
|------|------------------|-------------------|---------------------------|-------------|
| Prvi sloj | L, a* i b* kanali, B x 3 x 256 x 256 | B x 64 x H/2 x W/2 | LeakyReLU, BatchNorm | Smanjenje rezolucije za faktor 2 i povećanje prostornih kanala |
| Drugi sloj | Izlaz iz prvog sloja | B x 128 x H/4 x W/4 | LeakyReLU, BatchNorm | Dalje smanjenje rezolucije i povećanje prostornih kanala |
| Treći sloj | Izlaz nakon drugog sloja | B x 256 x H/8 x W/8 | LeakyReLU, BatchNorm | Dalje smanjenje rezolucije i povećanje prostornih kanala |
| Četvrti sloj | Izlaz nakon trećeg sloja | B x 512 x 31 x 31 | LeakyReLU, BatchNorm | Bez smanjenja rezolucije kroz stride, ali padding i kernel utiču na izlazne dimenzije |
| Peti sloj | Izlaz nakon četvrtog sloja | B x 1 x 30 x 30 | Bez BatchNorm | Mapa    verovatnoće autentičnosti za svaki deo slike 30x30px (PatchGAN pristup) |

Generator treba da teži tome da generiše takve boje da slika deluje što realnije, te da samim tim i ocena diskriminatora za izgenerisanu fotografiju bude što bliža 1. S druge strane diskriminator teži tome da što tačnije i preciznije klasifikuje, tj. “ocenjuje” izgenerisane slike, što znači da ocena diskriminatora za izgenerisanu sliku treba da teži 0, a za originalnu 1. Ove dve mreže se treniraju u adverserijalnom treningu, takvom da se ocena diskriminatora za izgenerisanu fotografiju prosleđuje generatoru na osnovu koje on treba da generiše što realnije boje. Što ocena diskriminatora za izgenerisanu fotografiju više odstupa 1, to je greška generatora veća, a što ocena za originalnu fotografiju više odstupa 1, a za izgenerisanu 0, to je greška diskriminatora veća.

#### 2.3. Arhitektura mreže i trening mreže

Generisanje podataka, tačnije generator u GAN modelu zavisi od diskriminatora. Takođe generator je dosta složenija mreža i ima dosta kompleksniji zadatak od diskriminatora: diskriminator “samo” evaluira boje na fotografiji, a generator treba da ih izgeneriše na osnovu samo crno-bele fotografije. Dolazi se do zaključka da je generatoru potrebno dosta više resursa kako bi krenuo da konvergira, u poređenju s diskriminatorom. 

S tim u vidu, postoji više metoda treniranja ovakve mreže, ali osnovna i najčešća je naizmenično treniranje generatora i diskriminatora, tokom celokupnog treninga. U ovom pristupu se javlja problem: kako generator postaje sve uspešniji, zadatak diskriminatora postaje sve teži, tako sve dok sposobnost klasifikacije diskriminatora ne dosegne nivo slučajnog pogađanja (50% tačnosti), što je nestabilno stanje za treniranje generatora, s obzirom da bi generator tada trenirao na osnovu besmislenog i gotovo nasumičnog *feedback*-a koji bi davao diskriminator. U našem slučaju bi ovaj način bio problematičan jer je generatoru potrebno neuporedivo više resursa za treniranje pre početka konvergiranja, u poređenju s diskriminatorom koji bi odmah počeo da konvergira, pa tako generator tokom dugo vremena ne bi ni počeo učenje, dok bi greška diskriminatora bila minimalna - veoma lako bi zaključio da su izgenerisani podaci izgenerisan, ocena diskriminatora bi uvek bila loša i generator na osnovu nje ne bi nikako mogao da se poboljša.

Drugi način, kakav je ovde korišćen, je postepeno treniranje mreža: generator se prvo trenira kao samostalna mreža tokom nekoliko epoha, a tek nakon što generator dostigne neki nivo stabilnosti konvergiranja, u trening se uključuje diskriminator, čija se ocena prosleđuje generatoru i uključuje u računanje greške generatora. Na ovaj način se obezbeđuje stabilnost treninga.

Trening petlja za adverserijalni trening obe mreže izgleda ovako (Slika {{< ref "Slika" "petlja" >}}.):

Iteracija započinje unosom *L* kanala fotografije u generator koji izgeneriše *a* i *b* kanale za tu fotografiju. Potom, konkatenacijom originalnog *L* kanala, koji je bio ulaz generatora, i kanala dobijenih na izlazu generatora, se dobije cela slika s izgenerisanim bojama koja se sada sastoji od sve 3 komponente: *L*, *a* i *b* kanala. 

Zatim se u diskriminator pusti ta fotografija s originalnim bojama i s izgenerisanim bojama. Za obe fotografije diskriminator generiše mape evaluacije lokalnih delova fotografije gde svaki element predstavlja verovatnoću autentičnosti boja tog dela. Funkcija diskriminatorskog gubitka kombnuje binarnu kros-entropiju za stvarne i generisane fotografije, pri čemu se za stvarne fotografije optimizuje približavanje jedinicama, a za generisane nulama. Nakon računanja vrednosti te funkcije diskriminator ažurira svoje parametre propagacijom unazad na osnovu te vrednosti. Tokom ovog procesa treniranja diskriminatora parametri generatora ostaju konstantni. Tek nakon ažuriranja parametara diskriminatora se započinje proces treniranja generatora.

{{< figure "Slika " "Petlja adverserijalnog treninga suprostavljenih modela" "petlja" >}}

![Petlja adverserijalnog treninga suprostavljenih modela](/images/zbornik/2025/kolorizacija-crno-belih-slika/slika-5.svg)

{{</ figure >}}

Za trening generatora se računa kompozitni gubitak koji se sastoji od adverserijalnog gubitka i klasifikacionog gubitka. Adverserijalni gubitak se računa, kao što je ranije pomenuto, na osnovu diskriminatorske procene autentičnosti boja na fotografiji s izlaza generatora koja se optimizuje tako da se poveća verovatnoća klasifikovanja izgenerisanih fotografija kao realnih, od strane diskriminatora. To se omogućava binarnom kros-entropijom diskriminatorske procene za koju se optimizuje približavanje 1. Klasifikacioni gubitak se dobija multinomijalnom klasifikacionom entropijskom funkcijom gubitka, koja je modifikovana da uzima u obzir rebalansiranje klasa. Konkretno, za svaki piksel $(h, w)$ i $Q$ broj kvantizovanih boja u _ab_ prostoru generator generiše raspodelu verovatnoća boje piksela nad tim kvantizovanim bojama kao $\hat{Z}_{h,w,q}​$. Gubitak se deifniše kao

{{< equation "eq-lcl" >}}

$$ L_{cl} = - \sum_{h,w} v(Z_{h,w}) \sum_{q} Z_{h,w,q} \log(\hat{Z}_{h,w,q}) ,$$

{{</ equation >}}

gde $Z_{h,w,q}$ predstavlja *soft-encoding* originalnih boja piksela $(h, w)$, a $v(Z_{h,w})$ je težinski koeficijent koji rebalansira uticaj retkih boja.

Svakom pikselu se dodeljuje težinski koeficijent na osnovu kombinacije empirijske distribucije boja iz trening skupa i uniformne distribucije verovatnoće po svih 313 kvantizovanih boja, dodeljujući veću težinu ređim bojama. U okviru dataset-a postoji nejednaka distribucija boja, gde nesaturisani, sivkasti tonovi dominiraju nad jarkim, dobro saturisanim bojama (oblaci, nebo, pozadine pretežno sivkastih, “ispranih”, sepia tonova dominiraju fotografijama). Iz tog razloga se uvodi rebalansiranje klasa tokom računanja gubitka generisanja boja. Jarke boje koje se ređe pojavljuju u datasetu dobijaju veću težinu od čestih boja. Ovaj pristup podrazumeva izglađivanje empirijske distribucije Gausovim kernelom koje kombinovanjem sa uniformnom distribucijom sprečava preterano naglašavanje čestih, neutralnih boja i podstiče generisanje živopisnijih kolorizacija. Na ovaj način, greške u predviđanju retkih, jarko saturisanih boja se strože kažnjavaju od grešaka u predviđanju čestih, neutralnih boja, kako bi se obezbedilo pažljivije generisanje čestih, neutralnih i sivkastih tonova, koje je bilo problematično u svim prethodnim radovima.

Više o ovakvom prisupu računanja greške generatora, a i samog generisanja boja se može pronaći više u radu[^1]. Na osnovu ovog greške generator trenira, čime se završava jedna iteracija treninga, prikazana na Slici 4.

### 3. Rezultati i istraživanja

Važno je napomenuti da je model iz ovog rada treniran na ograničenom skupu podataka, ograničenom procesnom moći i tokom ograničenog vremena. Model je treniran na jednoj klasi iz dataset-a, koja se sastoji od oko 1500 slika, kod koje su dominirale nijanse plave boje (more i ajkule, kao što je prikazano na Slici {{< ref "Slika" "rezultati" >}}.). Ovakva ograničenost resursa može uticati na sposobnost modela da generalizuje širu paletu boja i scena. Model je postizao zadovoljavajuće rezultate na ovom oskudnijem skupu podataka, i očekuje se da bi performanse bile neznatno smanjene ili podjednako dobre kada bi bio primenjen na većem i raznovrsnijem skupu podataka. Takođe, uočeno je da model konvergira sporije ukoliko se trenira nad fotografijama koje ne pripadaju istim klasama, (fotografije su podeljene u klase po vizuelnom sadržaju), a koje nisu nasumično raspoređene u trening setu, te je potrebno nasumično poređati slike kako bi model dovoljno efikasno konvergirao. 

Dakle, zaključuje se da rezultati treninga zavise od obima dataset-a (sporije konvergira na većem obimu podataka) i od strukture njegovog sadržaja (sporije konvergira ukoliko kroz fotografije iz različitih klasa prolazi redom, a ne nasumično).

Radi evaluacije rezultata ovog rada, sprovedena je anketa u kojoj je učestvovalo 94 ispitanika - *colorization Turing test*. Anketa je sadržala 14 slika gde su ispitanici imali zadatak da procene da li je slika originalna ili generisana. Za konačne rezultate ankete uzeto je u obzir, procentualno, koliko je ljudi generisanu sliku ocenilo da je originalna. Na taj način su dobijeni sledeći rezultati:

{{< figure "Slika" "Dijagram rezultata" "dijagram-rezultata" >}}

![Dijagram rezultata](/images/zbornik/2025/kolorizacija-crno-belih-slika/slika-6.svg)

{{</ figure >}}

S obzirom da je referentni rad[^1] imao uspešnost od 32% na istoj evalucionoj metrici - *colorization Turing test-u*, inovativna implementacija GAN arhitekture u rešavanju ovog problema pokazuje značajno uspešniji rezultat. Anketu možete pronaći [ovde](https://docs.google.com/forms/d/e/1FAIpQLSckAf7mrPl3uzO6_WB6pkY3sjX3dAu7_iZIYt9om3Y474OcMQ/viewform?usp=header), a na slici {{< ref "Slika" "rezultati" >}}. je par primera izgenerisanih fotografija ovim GAN modelom.

{{< figure "Slika" "Primeri izgenerisanih slika" "rezultati" >}}

![Primeri izgenerisanih slika](/images/zbornik/2025/kolorizacija-crno-belih-slika/slika-7.svg)

{{</ figure >}}

### 4. Diskusija

Moramo naglasiti da ne postoji univerzalno dobra statička metrika koja će samo na osnovu vrednosti piksela sa sigurnošću tvrditi da su boje autentične. Cilj nije da se fotografija s originalnim bojama i fotografija s izgenerisanim matematički podudaraju po svakom pikselu, već da izgenerisana fotografija izgleda što perceptivno realnije i prirodnije ljudskom oku. Model za određenu regiju fotografije može izabrati boju koja se razlikuje od one na istoj toj regiji na originalnoj fotografiji, ali tako da ona i dalje izgleda prihvatljivo. Na primer, na originalnoj fotografiji jabuka može biti zelena, dok će model za istu izgenerisati crvenu boju, što ne mora nužno biti “greška” sa stanovišta ljudske percepcije, ali će se pokazati kao greška pri upotrebi metrika koje koriste direktno poređenje ovih fotografija matematičkim pristupom piksel po pikselu.

Korišćenje statičkih metrika zasnovanih na direktnoj razlici piksela, poput euklidske distance (L2 / MSE), kakve su se koristile u regresionim prisupima, je baš iz tog razloga nedovoljno precizno za kolorizovanje. Ovakve metrike svaku razliku boja na istim pikselima između ove dve fotografije smatraju greškom, bez obzira na njihov semantički smisao. Ove statičke metrike ne uzimaju u obzir semantički kontekst scene, ni prirodu ljudske percepcije.

Upravo iz tog razloga se diskriminator, konvoluciona neuralna mreža koja uči da procenjuje verodostojnost boja, može posmatrati kao najpribližnije odgovarajuća metrika ljudskoj percepciji. Za razliku od statičkih metrika, diskriminator ne analizira konkretne vrednosti piksela, već uči da prepozna kompleksne, semantičke obrasce boja na nivou lokalnih delova slike (*patch*-eva). Kako diskriminator konvergira, njegova evaluacija izgenerisanih fotografija postaje sve tačnija i preciznija. Ta evaluacija se koristi za pospešivanje generisanja perceptivno realističnih i prirodnih, a ne samo matematički ispravnih boja.

### 5. Zaključak

U radu je istražen problem automatske kolorizacije crno-belih fotografija implementacijom generativne adversarijalne mreže (GAN), dodatnim i inovativnim poboljšanjem već ustanovljeno efikasnih metoda rešavanja ovog problema. Predloženi model koristi okvir metoda korišćenih u prethodnim radovima: klasifikacija boja sa rebalansiranjem klasa, unapređujući ga uvođenjem adverserijalnog treninga s diskriminatorskom mrežom. Generator ne teži samo minimizaciji multinomijalnog gubitka klasifikacije, već teži i da “prevari” diskriminator koji evaluira autentičnost generisanih boja. Implementacija diskriminatora rešava problem nepostojanja dovoljno dobre nestatičke metrike za evaluaciju generatora tokom treninga, uvođenjem cele jedne konvolucione neuralne mreže koja prepoznaje semantičke celine na fotografiji, te evaluira njihovu autentičnost.

Pored ograničenosti resursima, ovakva arhitektura kolorizatora je postigla superiornije rezultate u odnosu na prethodne radove. Očekuje se da bi se daljim proširivanjem dataset-a, unapređivanjem procesorske moći, kao i manjim vremenskim ograničenjima dobili još bolji rezultati.

Automatska kolorizacija je specijalizovan zadatak u domenu računarske grafike i težak problem predikcije piksela na osnovu dubokog semantičkog razumevanja scene. Ovaj rad dokazuje da se, uprkos tome, mogu postići rezultati vizuelno nerazlučivi od autentičnih fotografija. Iako korišćena samo za kolorizaciju, ova mreža uči takvu reprezentaciju fotografija koja može biti korisna za detekciju, segmentaciju i klasifikaciju objekata na fotografiji.


### Literatura

[^1]: Richard Zhang, Phillip Isola, Alexei A. Efros (2016). _Colorful Image Colorization_, arXiv:1603.08511, 2016. [https://arxiv.org/abs/160.08511](https://arxiv.org/abs/160.08511) 
[^2]: Kamyar Nazeri, Eric Ng, and Mehran Ebrahimi (2018). _Image Colorization using Generative Adversarial Networks_, [https://arxiv.org/abs/1803.05400](https://arxiv.org/abs/1803.05400)
[^3]: Cheng, Z., Yang, Q., Sheng, B.: _Deep colorization. In: Proceedings of the IEEE International Conference on Computer Vision._ (2015) 415–423,


