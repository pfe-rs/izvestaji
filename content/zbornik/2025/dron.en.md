---
title: Design and Implementation of a Quadcopter Drone Control System
summary: A project focused on the design and implementation of a quadcopter drone's control system, done at the 2025 summer camp by Nikola Najić and Andrija Krstić.
svg_image: /images/zbornik/2025/Dron/slika_drona.jpg
---

Project team: Nikola Najić, Andrija Krstić

**Mentors:**

Nikola Ristanović, student, School of Electrical Engineering, University of Belgrade

Petar Marković, Faculty of Technical Sciences, Novi Sad

Nikola Drakulić, student, School of Electrical Engineering, University of Belgrade

Date: September 2025

![Graphical abstract](/images/zbornik/2025/Dron/slika_drona.jpg)

### Abstract

This paper describes the development of a quadcopter drone, from hardware integration (ESP32 S3 Zero, IMU, BLDC motors) to the implementation of a MIMO PID controller for stabilization. A key result was the modification of the ultrasonic sensor for I²C communication, which offloaded the processor. Although the hardware was successfully completed, controlled flight was not achieved. The analysis revealed two critical errors: nonlinearity in the test rig and an algorithmic error in roll control that violated the principle of constant total thrust. The project provides valuable experience and outlines guidelines for future work, focusing on a more robust test rig design and better filtering of sensor data.

## Full paper

{{< serbian-version >}}
