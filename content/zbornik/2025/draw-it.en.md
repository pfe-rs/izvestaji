---
title: Draw it
summary: Draw it is a project focused on real-time sketch classification, done at the 2025 summer camp for experienced participants by Lena Stanković and Nemanja Obradović.
svg_image: /images/zbornik/2025/draw-it/graf_aps.svg
---

**Authors:**

Lena Stanković, 3rd-year student at the First Gymnasium in Kragujevac

Nemanja Obradović, 3rd-year student at the Gymnasium in Kraljevo

**Mentors:**

Jelena Marinković, School of Electrical Engineering, University of Belgrade

Novak Stijepić, School of Electrical Engineering, University of Belgrade

Marija Nedeljković, University of Cambridge

![Graphical abstract](/images/zbornik/2025/draw-it/graf_aps.svg)

### Abstract

This study addresses the problem of recognizing freehand-drawn sketches, which is challenging due to the abstract nature of sketches and variability in user drawing styles. The research focuses on comparing the performance of different neural network architectures – VGG16, AlexNet, MobileNet V3 Small, a simple convolutional neural network (CNN), and recurrent networks (LSTM, BiLSTM) – in the task of sketch classification. The Quick, Draw! dataset was used, along with an additional dataset collected from users to test model generalization. Results indicate that convolutional networks, particularly AlexNet and MobileNet, significantly outperform recurrent networks in accuracy and efficiency, enabling real-time sketch recognition. LSTM and BiLSTM networks did not achieve satisfactory accuracy, while the VGG16 model is impractical for interactive use due to its low FPS. The contribution of this work lies in the comprehensive analysis of different architectures on both real and simulated data, as well as the integration of the best-performing model into an interactive sketch recognition game.

## Full paper

{{< serbian-version >}}
