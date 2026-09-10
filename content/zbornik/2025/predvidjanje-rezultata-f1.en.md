---
title: Predicting Formula 1 Race Results
summary: A project focused on predicting Formula 1 race results, done at the 2025 summer camp for experienced participants by Darija Vasiljević and Marina Stojilković.
svg_image: /images/zbornik/2025/formula-1/graf-apstrakt.svg
---

Participants: Darija Vasiljević, Marina Stojilković

**Mentors:**

Andrej Bantulić, engineer in electrical and computer engineering, School of Electrical Engineering, University of Belgrade

Milica Gojak, engineer in electrical and computer engineering, School of Electrical Engineering, University of Belgrade

Marija Nedeljković, University of Cambridge

![Graphical abstract](/images/zbornik/2025/formula-1/graf-apstrakt.svg)

### Abstract

This paper presents a system for predicting the final standings of drivers in Formula 1 races using publicly available data from 2018 to 2024. The performance of statistical models (linear regression, Support Vector Machine, Naive Bayes) and modern machine learning algorithms (deep neural networks and XGBoost) was compared on a relatively small dataset. Two approaches were considered: listwise (predicting the entire ranking) and pairwise (predicting which driver in a pair will achieve a better position). Model evaluation shows that pairwise approaches, especially XGBoost trained on driver pairs, achieve the best performance: RMSE = 1.58, NDCG = 0.987, MRR = 0.89, Kendall's $\tau$ = 0.86, and Spearman = 0.92, indicating accurate driver ranking and high precision in predicting race winners. The study demonstrates that combining feature engineering with modern models can significantly improve race outcome predictions in a dynamic sport like Formula 1.

## Full paper

{{< serbian-version >}}
