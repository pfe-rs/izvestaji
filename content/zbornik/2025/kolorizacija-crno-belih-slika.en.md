---
title: Black&white photo colorization
summary: Black&white photo colorization project done at the 2025 summer camp for experienced participants by Jana Mitrović and Natalija Janković.
svg_image: /images/zbornik/2025/kolorizacija-crno-belih-slika/graficki-apstrakt.svg
---

**Authors:**

Jana Mitrović, ESTŠ “Nikola Tesla”, Kraljevo

Natalija Janković, First Gymnaisum of Kragujevac, Kragujevac

**Mentors:**

Aleksa Račić, 

Andrej Bantulić

![Grafički apstrakt](/images/zbornik/2025/kolorizacija-crno-belih-slika/graficki-apstrakt.svg)

### Abstract

In this paper, we address the problem of automatic colorization od black and white photographs by implementing Generative Adverserial Network (GAN) architecture. The goal of this paper is to achieve superior results on the evaluation metrics used in previous works[^1] [^2] through an innovative implementation of a GAN architecture. The proposed architecture consists of two convolutional neural networks engaged in an adversarial relationship: a generator and a discriminator. The generator is fed the lightness component of a color image, based on which it must generate the remaining chromatic components using color classification with class rebalancing. The discriminator, utilizing a PatchGAN architecture, evaluates the authenticity of the colors by performing binary classification on local image patches. Through adversarial training, these two networks learn from each other's influence, where the generator aims to produce realistic colors based on the discriminator’s evaluation, and the discriminator seeks to better classify them. The evaluation of the results in this work was conducted via a survey, a colorization Turing test, in which participants were asked to choose the photograph with generated colors between an image with real colors and one with generated colors. The results of this test show that the model successfully generated sufficiently realistic photographs in 47% of cases, thus successfully "fooling" the participants.

## Full paper