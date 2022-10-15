---
title: Prepoznavanje znakovnog jezika
summary: Prepoznavanje znakovnog jezika je projekat rađen na letnjem kampu za stare polaznike 2022. godine od Zlate Stefanović i Vladana Bašića.
---

####Uvod

Tip neverbalne komunikacije najčešće korišćen među gluvo-nemim ljudima se zove znakovni jezik. Ovaj vid komunikacije omogućava prenos informacija bez korišćenja reči, samo pomoću pokreta i gestikulacija. Međutim, znakovni jezik nije poznat široj populaciji što otežava njegovo razumevanje. Da bi se prevazišao ovaj problem, predlažemo korišćenje savremene tehnologije.

Značajan broj istraživanja je urađeno na ovu temu - rad [1] se bavio povećavanjem dubina ConvNet-a sa jako malim (3x3) konvolucionim filterima. Pri ovome dobijen je 6.7% validation error. U [2] je razmatran Indijski Znakovni Jezik (ISL). Urađena je detekcija i praćenje šake na osnovu boje kože, potom je korišćen Grid za ekstraktovanje obeležja na kraju čeka su gestikulacije klasifikovane kNN algoritmom. Ovako je dobijena tačnost od 99.7%. Rad [3] bio je fokus na detektovanju položaja u kojima nije pokazan nijedan znak koristeći Novelty Detection, pri čemu je dobijena tačnost od 97.59%.

Ovo je paragraf
koji zelim da testiram
da vidim nesto
dsads

![Slika tajne vecere](/images/2022/prepoznavanje-znakovnog-jezika/slika.png)

## TEST 2 hadsaasadsadsada

####Literatura
[1]Simonyan, K., Zisserman, A.: Very deep convolutional networks for large-scale image recognition. CoRR abs/1409.1556 (2014), http://arxiv.org/abs/1409. 1556
[2] https://arxiv.org/ftp/arxiv/papers/2108/2108.10970.pdf
[3] https://www.robots.ox.ac.uk/ davidc/pubs/NDreview2014.pdf
[4] https://arxiv.org/pdf/2110.15542.pdf
