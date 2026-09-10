---
title: Teaching a Bipedal Robot to Walk
summary: Teaching a bipedal robot to walk using reinforcement learning is a project done at the 2025 summer camp for experienced participants by Anja Vujanac and Tatjana Imbrišić.
svg_image: /images/zbornik/2025/bipedalni-robot/bpw-graficki.svg
---

**Authors:**

Anja Vujanac, 4th-year student at the Gymnasium in Raška

Tatjana Imbrišić, 4th-year student

**Mentors:**

Nataša Jovanović, graduate engineer in electrical and computer engineering, PFE

Dimitrije Pešić, School of Electrical Engineering, University of Belgrade

![Graphical abstract of teaching an agent to walk using reinforcement learning](/images/zbornik/2025/bipedalni-robot/bpw-graficki.svg)

### Abstract

The _Gymnasium_ environment _BipedalWalker-v3_ was used to compare three algorithms: _Q-Learning_, _Twin Delayed Deep Deterministic Policy Gradient_ (TD3), and _Soft Actor-Critic_ (SAC). Due to the continuous nature of the problem, _Q-Learning_ proved to be inadequate. TD3 achieved the best results thanks to its ability to work with continuous actions. The implementation of the SAC algorithm in this study failed to achieve the expected performance. TD3 proved to be the most suitable algorithm for solving this problem, although instability in its behavior was observed on more challenging terrain.

## Full paper

{{< serbian-version >}}
