---
title: Playing Chess Using Reinforcement Learning
summary: Playing chess using reinforcement learning is a project done at the 2025 summer camp for experienced participants by Veljko Galović and Pavle Ivanović.
svg_image: /images/zbornik/2025/igranje-saha/graficki-apstrakt.svg
---

**Authors:**

Veljko Galović, 2nd-year student at "Veljko Petrović" Gymnasium in Sombor

Pavle Ivanović, 4th-year student at the Mathematical Gymnasium in Belgrade

**Mentors:**

Nataša Jovanović, EPFL, Lausanne

Milica Gojak, School of Electrical Engineering, University of Belgrade

Mateja Stojković, School of Electrical Engineering, University of Belgrade

![Graphical abstract](/images/zbornik/2025/igranje-saha/graficki-apstrakt.svg)

### Abstract

This project developed and evaluated several neural-network-based approaches for a Chess AI, experimenting with imitation learning from Stockfish, ResNet-based policy/value networks, a separate evaluation network paired with minimax search, Monte Carlo Tree Search (MCTS) with self-play, and finally an NNUE-style evaluator. Large-scale training data (Lichess database and self-play) was collected, data pipelines for FEN-encoded positions with Stockfish evaluations and best moves were implemented, and models were iteratively trained while measuring validation accuracy, evaluation-head mean-square error and practical playing strength. Key outcomes: (1) early two-headed and ResNet models showed limited improvement over random play; (2) an evaluation-only model combined with minimax produced the most promising playing behavior but was slow; (3) NNUE training produced unstable metrics in early epochs and requires further tuning and compute.

## Full paper

{{< serbian-version >}}
