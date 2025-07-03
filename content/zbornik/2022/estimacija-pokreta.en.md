---
title: Motion Estimation
summary: Motion estimation using optical flow - a project done at the 2022 summer camp for experienced participants by Milica Gojak and Novak Stijepić.
svg_image: /images/zbornik/2022/estimacija-pokreta/OGA.svg
---

**Authors** 

Novak Stijepić, Mathematical Grammar School, Belgrade

Milica Gojak, First Kragujevac Gymnasium, Kragujevac

**Mentor** 

Luka Simić, School of Electrical Engineering, University of Belgrade

## Abstract

In this paper we approach the problem of optical flow estimation from a discrete point of view and use three optimization methods which are able to reduce computation and memory demands. Their use allows us to estimate optical flow of sequences with large displacements. Firstly, our program generates flow vector proposals by finding matches between pixels in the reference image and the target image using a parameter, in this paper the similarity of their DAISY descriptors. The program is optimized by restricting the number of flow proposals to a fixed number. Proposals were extracted using the randomized k-d forest algorithm. Secondly, we use block coordinate descent for finding optimal combinations of aligned flow vectors. Lastly, we use sets of similar proposals to optimize the processing of proposals in neighboring pixels. The estimated field is refined in postprocessing and the flow vectors of unmatched regions are interpolated using EpicFlow. Results were obtained by evaluating the algorithm on the KITTI dataset.

![Graphical Abstract](/images/zbornik/2022/estimacija-pokreta/OGA.svg)

## Full Paper

{{< serbian-version >}}
