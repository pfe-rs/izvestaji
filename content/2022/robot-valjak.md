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

Potencijalne, kinetičke i rotacione energije za telo i klatno valjka dati su sledećim izrazima:

$$U_1 = 0$$  
$$U_2 = -M_2gd\cos(\theta _ 1 + \theta _ 2)$$  
$$K_1 = \frac{1}{2}M_1(r\omega _ 1)^2$$  
$$K_2 = \frac{1}{2}M_2((r\omega _ 1 - d\cos(\theta _ 1 + \theta _ 2)(\omega _ 1 + \omega _ 2))^2 + (d\sin(\theta _ 1 + \theta _ 2)(\omega _ 1 + \omega _ 2))^2)$$  
$$T_1 = \frac{1}{2}J_1(\omega _ 1)^2$$  
$$T_2 = \frac{1}{2}J_1(\omega _ 1 + \omega _ 2)^2$$  