---
title: Uputstvo
---

Ovo uputstvo služi vama, polaznicima, kako bi znali kako da počnete sa radom na izveštajima i imate uvid u tehničke detalje oko toga kako da vaš rad pišete, vidite, formatirate, struktuirate i pošaljete na pregled. Iskoristite priliku da postavljate pitanja na Discord serveru oko bilo kakvih pitanja u vezi sa pisanjem izveštaja i potrudićemo se da ažuriramo ovaj dokument sa odgovorima na njih.

## Sadržaj

U sledećih par odeljaka je opisano šta treba od sadržaja vaš izveštaj da sadrži. Konkretan sadržaj (tekst, slike, grafici, formule) ne treba da zavisi od tehnologije koju koristimo za prikaz izveštaja.

### Apstrakt

Prva dva odeljka vašeg izveštaja su apstrakt i apstrakt na engleskom, ali **njih treba pisati nakon svih drugih delova**. Apstrakt predstavlja sažetak vašeg izveštaja i treba (bez objašnjenja) da predstavi šta ste radili, na koji način i koje rezultate ste postigli.

### Uvod

Uvod ne treba da bude dug. Treba da bude jasan. Ne idite od 'Kulina Bana'. Nije cilj da pokažete sve što znate i šta ste sve pročitali, nego da čitaoca što je moguće jasnije uvedete u problem kojim se bavite. Ali, uvod treba da bude tako napisan da čitalac ne mora da se upoznaje sa drugim člancima i publikacijama da bi razumeo ono što ste radili. Izuzetno, ukoliko smatrate da vaš rad ima vrlo netipičnu teorijsku osnovu možete i uvod malo proširiti ali ipak veći deo stvari treba da ide u metodu.

U uvodu ne navodite vaše rezultate, već samo prethodne rezultate drugih autora.

Na kraju uvoda: CILJ. Prethodni deo teksta ovog poglavlja već treba da pruži čitaocu jasnu motivaciju zašto ste se opredelili za izabrani problem. Ovde samo, što je moguće jasnije, objasnite šta vam je bio cilj da uradite (razmotrite, dobijete). Sastavni deo cilja su i hipoteze koje eventualno pokušavate da dokažete - navedite ih ovde.

### Aparatura i metoda

U ovom odeljku treba ući u teoriju iza svih metoda koje ste koristili za vaš rad. Potrudite se da koristite reference na kojima je opisan princip rada tih metoda kao dodatan izvor za istraživanje potencijalnih čitalaca.

Detaljan opis aparature ako ste je koristili, uključujući slike, blok diagrame i ostala pomoćna sredstva za jasno predstavljanje toga šta ste koristili.

Posmatrajte ovaj odeljak kao vaš zadatak da čitalac može da rekreira ono što ste radili.

### Istraživanje i rezultati

U ovom odeljku treba opisati sve rezultate do kojih ste došli. Ako i dalje radite na svom projektu, parcijalni rezultati su potpuno prihvatljivi.

### Zaključak

Obavezno je da imate zaključak u jedan do dva pasusa kao posebnu celinu. Nije bitno da li su zaključci već jasni iz ostatka teksta, ova sekcija ih mora navesti jer ljudi kad čitaju radove obično idu redom:

1. gledam slike (zato je bitan grafički apstrakt),
2. pročitam apstrakt,
3. pročitam zaključak,
4. pročitam ostalo.

Dajete sažetu ocenu šta se postiglo s obzirom na postavljeni cilj. Ističete doprinos vašeg rada u kontekstu ranije objavljenih rezultata. Navodite otvorena pitanja i dileme, kao i smernice za dalji rad.

### Napomene i česte greške

Ovde je navedena gomila smernica ka stvarima koje treba da izbegavate. U izuzetnim slučajevima neka pravila ne moraju da važe, ali u tom slučaju pričajte sa mentorom ili osobom koja pregleda izveštaj.

Za svaku činjenicu koju pišete, obavezno je koristiti reference ili jasno pokazati kako ste došli do tih činjenica iz nekih drugih referenci. Ne možete reći da je, recimo, brzina nekog mikrokontrolera 100MHz bez da ste dali referencu na to ili ste lično izmerili taj podatak. Ako pominjete neku izvedenu vrednost i podatak, obavezno opišite izvođenje. Ako koristite otpornik od 1W, izvedite zašto je maksimalna struja 200mA za 5V. Nemojte podrazumevati da je neko izvođenje "očigledno".

Kada god uvodite novi termin, obavezno ga i objasnite! Ovde negde se nalazi i siva zona toga šta treba objasniti, jer postoje dve kategorije termina: jednostavni (poput otpornik, slika...) i komplikovani (Kalmanov filter, simulirano kaljenje, SVM...), a te kategorije nisu potpuno razdvojene. U nekim situacijama treba objasniti otpornik (ako koristite neki otpornički senzor), a nekad ne treba objasniti komplikovan termin (ako recimo pominjete neku metodu iz referentnog rada koju zapravo niste implementirali). Probajte da izbegavate korišćenje stvari poput "Kao što je u uvodu rečeno...". Ako ste pomenuli neki termin, slobodno ga koristite u ostatku teksta.

Svaku jednačinu treba objasniti, a pogotovo promenljive koje se u njima pominju. Ako negde kaže “Jednačina za silu je $F = m \cdot a$”, a ne opiše šta su $m$ i $a$, jednačina nema smisla. Razmišljate u smeru da ako neko pokuša da rekreira vaš projekat, jednačina bez objašnjenih promenljivih je kao da niste dali jednačinu uopšte. Ako imate ogroman spisak promenljivih, možete tražiti od pregledača da napravite spisak svih promenljivih na kraju izveštaja, ali ako sami mislite da to treba da raditi, najverovatnije postoji bolje rešenje (smanjivanje broja jednačina i slično).

Ako dajete neki podatak, potrudite se da bude povezan sa ostatkom vašeg rada. Iskazi koji ne vode do nekog zaključka nemaju mnogo smisla. Naravno, nemojte pisati i o stvarima koje niste vi sami radili. Na primer, možete pomenuti da je neki referentni rad koristio metodu X, ali nemojte zapravo trošiti vreme na objašnjavanju te metode.

Trudite se da termine prevodite na srpski jezik, dokle god to ne umanjuje razumnost. Termini poput "Speech recognition", "Neural network" se mogu lako prevesti na srpski. Naravno, ako ne znate prevod nekog termina, možete ga ostaviti u originalnom jeziku i dodati komentar da želite pričati sa pregledačem.

<!-- TODO: Napraviti rečnik za tehničke termine -->

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

![Slika sa alternativnim tekstom](https://pfe.rs/images/logo.png)

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

> Citat

Između paragrafa idu
dva nova reda razmaka
jer jedan novi red neće napraviti novi paragraf.

Ovako!

Tri crtice prave horizontalnu liniju.

---

Referenca[^1]

[^1]: Tekst reference
