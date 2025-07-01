---
title: "Application and Implementation of Pupil Detection Algorithm Based on Image Processing"
summary: "Videooculography project done at the 2022 summer camp for experienced participants by Anja Kovačev and Lenka Milojčević."
---

**Authors** 

Anja Kovačev, Technical School, Kikinda

Lenka Milojčević, Gymnasium, Kraljevo

**Mentors** 

Milomir Stefanović, School of Electrical Engineering, University of Belgrade

Pavle Pađin, School of Electrical Engineering, University of Belgrade

## Abstract

The aim of this work is the design of a hardware system and the implementation of a software solution for pupil detection with the purpose of tracking it.
The application of pupil detection in this research is focused on controlling the position of the cursor.
A webcam was used to obtain information about the coordinates of the pupil center.
In the camera footage, the pupil was segmented, after which its center and radius were determined using the Hough transform.
By applying third-order polynomial regression, the transformation of pupil coordinates into cursor coordinates was performed. The errors in cursor position prediction relative to the target position were analyzed.
The obtained results indicate an average estimation deviation of 121.6 pixels, which is not satisfactory for real-time applications such as cursor control.
To improve the system and enable practical implementation, it is necessary to expand the dataset with a larger number of recordings, add IR LEDs to the 3D webcam mount, and apply red and blue filters to the webcam. These measures would significantly reduce the estimation error.

**Keywords:** image processing, video oculography, pupil detection algorithm, polynomial regression

## Full Paper

{{< serbian-version >}}

### Key Contributions

- Design and implementation of 2D video oculography (VOG) system
- Pupil detection algorithm using image processing techniques
- Hardware design with web camera for pupil tracking
- Hough transformation for center and radius detection
- Third-order polynomial regression for coordinate transformation
- Cursor control application using eye movement
- Analysis of prediction accuracy and error estimation
- Potential applications for assistive technology for disabled individuals
