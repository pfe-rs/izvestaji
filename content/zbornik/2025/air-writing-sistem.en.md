---
title: Air Writing Letter Recognition System
summary: A project focused on implementing a system for writing and recognizing letters written in the air (air writing). Done at the 2025 summer camp for experienced participants by Iva Stojanović and Mihailo Pešić.
svg_image: /images/zbornik/2025/air-writing-sistem/apstrakt-air-writing.svg
---

Mihailo Pešić

Iva Stojanović

Mentor: Vladan Bašić, student, School of Electrical Engineering, University of Belgrade

![Graphical abstract](/images/zbornik/2025/air-writing-sistem/apstrakt-air-writing.svg)

### Abstract

In this paper, an *air writing* system is presented for recognizing letters written in the air through index finger movements detected by a camera. The idea of the system is based on different finger gestures that define whether writing is active, paused, or when the written word is saved. To address the problem of handwriting recognition, different models were applied: a linear neural network, a convolutional neural network, and the YOLO architecture. The linear and convolutional networks were trained on the EMNIST dataset of handwritten letters, while YOLOv8 was trained on the IAM dataset with annotated handwritten forms. Evaluation was carried out using metrics suited to each model type—accuracy for classification approaches, and mAP, precision, recall, and F1-score for YOLO. The analysis shows that the models are particularly reliable for more frequent and simpler letters, while more complex and less common samples require additional techniques such as augmentation or the use of more advanced architectures. This work highlights the potential of *air writing* systems in fields such as education and medicine.

## Full paper

{{< serbian-version >}}
