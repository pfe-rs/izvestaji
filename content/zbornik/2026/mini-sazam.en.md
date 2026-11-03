---
title: "Pesmokaz: Development and comparison of music recognition methods"
summary: "A music recognition system that compares deterministic mathematical hashing with deep learning based on triplet metric learning, evaluated on 776 usable songs (out of 1000 selected) from the FMA collection."
svg_image: /images/zbornik/2026/pesmokaz/graficki-apstrakt.svg
imageAlt: "Block diagram of the system with an input audio signal, chunking, normalization, spectrogram, two parallel fingerprinting paths, and database search."
translationKey: "mini-sazam"
---

**Authors:**

Lazar Aleksić, student, Gimnazija "Bora Stanković", Vranje

Andrej Vasiljević, student, Prva kragujevačka gimnazija, Kragujevac

**Mentors:**

Andrej Bantulić, School of Electrical Engineering, University of Belgrade

Dimitrije Pešić, School of Electrical Engineering, University of Belgrade

![Block diagram of the system with an input audio signal, chunking, normalization, spectrogram, two parallel fingerprinting paths, and database search.](/images/zbornik/2026/pesmokaz/graficki-apstrakt.svg)

## Abstract

Music recognition from a short audio clip is the problem of finding the closest song in a large database. Deterministic methods based on hashing time frequency peaks, such as the original algorithm by Wang (2003), are robust to noise because the highest energy peaks survive masking. Deep learning methods learn a similarity function in a continuous latent space and can recognize structural mutations, such as covers and concert performances, that break hashing. This paper presents a system that compares these two approaches on the same collection and the same evaluation protocol. The dataset consists of 776 usable songs (out of 1000 selected) from the FMA collection, stratified across 16 genres, with five noise levels from minus 5 dB to 20 dB. The mathematical method reaches 97.56 percent top 1 accuracy and a mean reciprocal rank of 0.976 on an aggregate noisy test set of 7281 queries over 776 songs. The CNN embedding reaches 81.39 percent top 1 accuracy and a mean reciprocal rank of 0.850. The mathematical method is more accurate, while CNN inference is about 20 times faster. Additional training would probably not improve the CNN significantly, since accuracy starts to decline after epoch 26 (overfitting); a larger model is the more promising direction, and the faster inference leaves room for one. Both approaches are deterministic within the same runtime and hardware.

## Full paper

{{< serbian-version >}}