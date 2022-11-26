---
title: Uputstvo
---

Ovo uputstvo služi vama, polaznicima, kako bi znali kako da počnete sa radom na izveštajima i imate uvid u tehničke detalje oko toga kako da vaš rad pišete, vidite, formatirate, struktuirate i pošaljete na pregled. Iskoristite priliku da postavljate pitanja na Discord serveru oko bilo kakvih pitanja u vezi sa pisanjem izveštaja i potrudićemo se da ažuriramo ovaj dokument sa odgovorima na njih.

## Sadržaj

U sledećih par odeljaka je opisano šta treba od sadržaja vaš izveštaj da sadrži. Konkretan sadržaj (tekst, slike, grafici, formule) ne treba da zavisi od tehnologije koju koristimo za prikaz izveštaja.

### Apstrakt

Prva dva odeljka vašeg izveštaja su apstrakt i apstrakt na engleskom, ali **njih treba pisati nakon svih drugih delova**. Apstrakt predstavlja sažetak vašeg izveštaja i treba (bez objašnjenja) da predstavi šta ste radili, na koji način i koje rezultate ste postigli.

### Grafički apstrakt

Grafički apstrakt je siže vašeg rada u jednoj slici. Služi da čitaocu na direktan i vizuelan način predstavi ključne elemente rada.

Vi birate šta su ključni elementi rada. Slika ne treba da bude previše složena, što znači da ne mora da obuhvati baš sve što ste radili - naći balans između jednostavnosti slike i njene sveobuhvatnosti. Neko će više istaći blok šemu metoda, neko same rezultate, neko eksperimentalnu postavku itd.

Uz grafički apstrakt uključuje se i opis ispod slike, koji u ovom slučaju može biti malo duži (do nekoliko rečenica) ali je poželjno da i sama slika sadrži tekst (posebno ako se sastoji iz više blokova i veza između njih).

Ako grafički apstrakt nije čisto vektorska slika, obavezno ga napraviti u što većoj rezoluciji - ovo je neophodno da bi se ta slika mogla staviti na poster, recimo.
Dakle, bar 20x15 cm u 300dpi, odnosno nekih 2400x1800 pixela.

#### Primeri

Ovde su predstavljeni primeri grafičkih apstrakata. Cilj je bilo prikazati raznovrsnost, nisu svi navdeni apstrakti nužno “najbolji”. Neki od navedenih slika nemaju prateći tekst - to je loša praksa, treba pisati prateći tekst - te slike su ovde navedene zato što su okej vizuelni primeri.



{{< figure "Slika" "Jedna varijanta iz *[Keyframe-based recognition and localization during video-rate parallel tracking and mapping](https://www.sciencedirect.com/science/article/pii/S0262885611000436)* koja predstavlja vizualizovanu blok šemu sistema." >}}

![Grafički apstrakt rada "Keyframe-based recognition and localization during video-rate parallel tracking and mapping" koji prikazuje njihov metod rada.](/images/uputstvo/gap1.png)

{{< /figure >}}
{{< figure "Slika" "Primer gde je tema rada konstrukcija izvesnog senzora pH vrednosti. Autori su se smisleno odlučili za grafički apstrakt iz dva dela: prikaz šeme senzora i prikaz rezultata (karakteristika senzora). Izvor: *[Well-established materials in microelectronic devices systems for differential-mode extended-gate field effect transistor chemical sensors](https://www.sciencedirect.com/science/article/pii/S0167931716301484)*." >}}

![Grafički apstrakt rada "Well-established materials in microelectronic devices systems for differential-mode extended-gate field effect transistor chemical sensors" koji prikazuje šemu senzora sa leve strane i rezultate sa desne.](/images/uputstvo/gap2.png)

{{< /figure >}}
{{< figure "Slika" "Grafički apstrakt koji se sastoji iz dva dela. Autor je želeo da istakne sam algoritam koji je koristio (gornji deo) ali i šta taj njegov pristup omogućava kao rezultat (donji deo). Obratite pažnju na dobro korišćenje opisa uz sliku. Izvor: *[Keyframe-Based Visual-Inertial Online SLAM with Relocalization](https://arxiv.org/pdf/1702.02175.pdf)*." >}}

![Grafički apstrakt rada "Keyframe-Based Visual-Inertial Online SLAM with Relocalization" ispod koga se nalazi tekst "Fig. 1: Our visual-inertial SLAM system performs visualinertial camera pose tracking and keyframe-based pose graph optimization in parallel. Top: Overview of the individual input and processing steps of our SLAM approach and their timing. Bottom: Our system allows for relocalization in a previous keyframe map and continued SLAM operation. Keyframes (dots) along the previous (red) and new trajectory (blue) are continously merged into a combined SLAM map (purple) through loop closure constraints (green lines)."](/images/uputstvo/gap3.png)

{{< /figure >}}
{{< figure "Slika" "Vrlo kratka varijanta koja objašnjava suštinu. Obratite pažnju na korišćenje pratećeg opisa slike. Izvor: *[Learning from Simulated and Unsupervised Images through Adversarial Training](https://arxiv.org/pdf/1612.07828.pdf)*." >}}

![Grafički apstrakt rada "Learning from Simulated and Unsupervised Images through Adversarial Training" ispod koga se nalazi tekst "Figure 1. Simulated+Unsupervised (S+U) learning. The task is to learn a model that improves the realism of synthetic images from a simulator using unlabeled real data, while preserving the annotation information."](/images/uputstvo/gap4.png)

{{</ figure >}}
{{< figure "Slika" "Isti izvor, ali varijanta koja u prvi plan ističe metod." >}}

![Grafički apstrakt rada "Learning from Simulated and Unsupervised Images through Adversarial Training" ispod koga se nalazi tekst "Figure 2. Overview of SimGAN. We refine the output of the simulator with a refiner neural network, R, that minimizes the combination of a local adversarial loss and a ‘selfregularization’ term. The adversarial loss ‘fools’ a discriminator network, D, that classifies an image as real or refined. The self-regularization term minimizes the image difference between the synthetic and the refined images. The refiner network and the discriminator network are updated alternately."](/images/uputstvo/gap5.png)

{{</ figure >}}
{{< figure "Slika" "Jednostavna upravljačka petlja sa prikazom aparature i algoritma u jednom. Izvor: *[Dynamics modeling and deviation control of the composites winding system](http://www.sciencedirect.com/science/article/pii/S0957415817301423)*." >}}

![Grafički apstrakt rada "Dynamics modeling and deviation control of the composites winding system" koji prikazuje način funkcionisanja sistema.](/images/uputstvo/gap7.png)

{{</ figure >}}

### Uvod

Uvod treba da sadrži sledeće stvari:

- Opis i motivaciju projekta, odnosno kako ste došli do ideje i šta ste radili.
- Pregled literature. Ukratko opišite šta su drugi radili pre vas.

### Aparatura i metoda

U ovom odeljku treba ući u teoriju iza svih metoda koje ste koristili za vaš rad. Potrudite se da koristite reference na kojima je opisan princip rada tih metoda kao dodatan izvor za istraživanje potencijalnih čitalaca.

Detaljan opis aparature ako ste je koristili, uključujući slike, blok diagrame i ostala pomoćna sredstva za jasno predstavljanje toga šta ste koristili.

Posmatrajte ovaj odeljak kao vaš zadatak da čitalac može da rekreira ono što ste radili.

### Istraživanje i rezultati

U ovom odeljku treba opisati sve rezultate do kojih ste došli. Ako i dalje radite na svom projektu, parcijalni rezultati su potpuno prihvatljivi.

### Zaključak

Zaključak ima za cilj da dodatno prokomentarišete rezultate i napravite pregled rada.

## Tehnički detalji

U narednim odeljcima je opisano na koji način da pišete izveštaj i prikažete ga na lokalnoj mašini i vidite kako će izgledati na sajtu.

### Potrebni alati
Sledeći alati su vam potrebni za rad na izveštajima:
- [Git](https://git-scm.com/)
- [Visual Studio Code](https://code.visualstudio.com/) (ili bilo koji tekstualni uređivač za Markdown)
- [Hugo](https://gohugo.io/)
    - [Uputstvo za Windows](https://gohugo.io/getting-started/installing#windows)
    - [Uputstvo za Linux](https://gohugo.io/getting-started/installing#linux)
    - [Uputstvo za macOS](https://gohugo.io/getting-started/installing#macos)

### Pregled
Ukoliko vam je bitan samo okviran izgled izveštaja, a ne toliko šta će zapravo biti prikazano na sajtu, unutar VS Code tokom uređivanja Markdown fajlova dostupno je "Open Preview to the Side" dugme, gde možete otvoriti novi prozor sa pregledom fajla koji trenutno uređujete. Ovo možete koristiti dok ne uspete da uspešno pokrenete Hugo i generišete sajt sa izveštajima.

### Pokretanje
Nakon što ste preuzeli zahtevane alate, potrebno je da klonirate GitHub repozitorijum sa izveštajima. Otvorite komandnu liniju (Git Bash na Windows, običan terminal na ostalim operativnim sistemima) i pokrenite:
```
git clone --recurse-submodules https://github.com/pfe-rs/izvestaji.git
```
U direktorijumu gde ste otvorili komandnu liniju bi trebalo da se pojavi direktorijum `izvestaji`. Otvorite VS Code, pa u File meniju izaberite Open Folder i onda taj `izvestaji` direktorijum u koji ste klonirali repozitorijum.

Nakon što ste otvorili direktorijum, u Terminal meniju izaberite New Terminal kako biste otvorili komandnu liniju unutar VS Code. Unutar te komandne linije pokrenite `hugo server` komandu, koja, ukoliko ste instalirali Hugo, bi trebalo da izgradi Markdown fajlove na sajtu i pokrene ga na [localhost:1313](http://localhost:1313/). Nakon što Hugo ispiše da se na tom mestu servira sajt, posetite tu adresu i trebalo bi da vidite glavnu stranu sajta sa izveštajima.

### Uređivanje
Izveštaj vašeg projekta nalazi se u `content/[godina]/[ime-projekta].md` fajlu. Ukoliko ne postoji, možete ga napraviti pokretanjem komande `hugo new [godina]/[ime-projekta].md`. Format u kom se izveštaji pišu jeste [Markdown](https://www.markdownguide.org/), i [primere](#markdown-primeri) njega možete videti u fajlu sa ovim uputstvom nakon što preuzmete repozitorijum (`content/uputstvo.md`). Na vrhu strane nalazi se [YAML](https://yaml.org/) zaglavlje sa sledećim opcijama:
- `title`: Naslov vašeg projekta
- `summary`: Sažet opis vašeg projekta

Ako dodajete slike, unutar `static` direktorijuma napravite direktorijum `images` (ako već ne postoji), zatim u njemu direktorijum za vašu godinu (npr. `2022`), zatim u njemu direktorijum za svoj projekat (npr. `ime-projekta`) i unutar njega stavite sliku (npr. `slika.svg`). Nakon toga, kao putanju do slike možete iskoristiti `/images/2022/ime-projekta/slika.svg`. Preferirajte slike u vektorskim formatima!

Dok vam je pokrenuta `hugo server` komanda, možete otvoriti svoj izveštaj navigacijom do njega kroz glavnu stranu, i nakon uređivanja izveštaja izmene bi trebalo da budu odmah vidljive na strani.

### Slanje na pregled
Da biste poslali svoj izveštaj na pregled, potrebno je prvo da napravite svoju Git granu. Pokrenite komandu `git checkout -b [godina]-[ime-projekta]` kako biste napravili i prebacili se na novu granu. Granu pravite samo jednom, i ta grana će vam ostati za svaki sledeći put.

Da biste poslali svoje izmene na repozitorijum, potrebno je prvo da pokrenete `git add .` kako biste označili sve izmenjene fajlove za commit, zatim `git commit -m "Opis izmene ide ovde"` kako biste napravili commit, i `git push -u origin [godina]-[ime-projekta]` kako biste svoju granu gurnuli na repozitorijum. Na primer, ukoliko ste izmenili samo vaš izveštaj dodavanjem reference na zahtev saradnika i 2022. godine radite projekat "Donacije", vaša sekvenca komandi izgledaće ovako:
```
git add .
git commit -m "Dodata referenca na zahtev saradnika."
git push -u origin 2022-donacije
```

Ukoliko ste tek napravili svoj prvi commit u svojoj grani, ulogujte se na [GitHub](https://github.com/) i posetite [repozitorijum](https://github.com/pfe-rs/izvestaji) - trebalo bi da vidite natpis pri vrhu koji kaže da ste u skorije vreme gurnuli fajlove na vašu granu, i dugme koje vam dozvoljava da napravite pull request. Pritisnite dugme za pravljenje pull request, kao naslov unesite ime vašeg projekta i u opis unesite sve napomene oko trenutne verzije izveštaja. Pull request pravite samo jednom, i on vam ostaje dok vaš izveštaj ne bude spreman za objavu na sajtu.

Ubrzo nakon pravljenja pull request, bot će komentarisati na njega sa linkom do sajta gde možete videti svoj izveštaj uživo (treba sačekati samo da se generiše) i on će se ažurirati i nakon što svaki sledeći put izmenite izveštaj na repozitorijumu. Na tom pull request će vam saradnici ostavljati komentare, pa možete lako pratiti šta sve treba da se ispravi. Svaki put kad šaljete izmene, prolazite kroz proces pravljenja i slanja commit-a opisanog iznad.

### Markdown primeri
Ispod možete naći neke Markdown primere koje možete koristiti prilikom uređivanja izveštaja. Otvorite `content/uputstvo.md` fajl kako biste videli izvorni Markdown!

#### Naslov četvrtog reda
##### Naslov petog reda
###### Naslov šestog reda

**Podebljan tekst**

*Tekst u kurzivu*

[Link](https://pfe.rs/)

{{< figure "Slika" "Primer dodavanja označene figure." "pfe-logo" >}}

![Slika sa alternativnim tekstom](https://pfe.rs/images/logo.png)

{{</ figure >}}
{{< figure "Slika" "Primer dodavanja označene figure sa više slika u njoj." >}}

![PFE logo levo](https://pfe.rs/images/logo.png)
![PFE logo desno](https://pfe.rs/images/logo.png)

{{</ figure >}}

- Ovako
- se
- pravi
- lista

1. Ovako
2. se
3. pravi
4. numerisana
5. lista

| Kolona 1 | Kolona 2 | Kolona 3 |
| -------- | -------- | -------- |
| Ćelija 1 | Ćelija 2 | Ćelija 3 |
| Ćelija 4 | Ćelija 5 | Ćelija 6 |
| Ćelija 7 | Ćelija 8 | Ćelija 9 |

`Preformatiran tekst u jednoj liniji`

```
Preformatiran tekst u
više linija
```

LaTeX jednačina u jednoj liniji: $A = 2 + 3$

LaTeX blok: $$B = \frac{2}{3}$$

LaTeX označena jednačina:

{{< equation "eq-c" >}}

$$C = \int_{0}^{+\infty} f(x)$$

{{</ equation >}}

> Citat

Između paragrafa idu
dva nova reda razmaka
jer jedan novi red neće napraviti novi paragraf.

Ovako!

Tri crtice prave horizontalnu liniju.

---

Referenca.[^1] Referenca na figuru {{< ref "Slika" "pfe-logo" >}}. Referenca na jednačinu {{< eqref "eq-c" >}}.

[^1]: Tekst reference
