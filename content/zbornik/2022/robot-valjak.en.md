---
title: Robot Cylinder
summary: Cylinder-shaped robot project done at the 2022 summer camp for experienced participants by Nikola Ristanović and Filip Bajraktari.
svg_image: /images/zbornik/2022/robot-valjak/graficki_apstrakt.svg
---

**Authors:**

Filip Bajraktari, Mathematical Grammar School, Belgrade

Nikola Ristanović, Fift Gymnaisum, Belgrade

**Mentors:**

Đorđe Marjanović, School of Electrical Engineering, University of Belgrade

Bojan Roško, School of Electrical Engineering, University of Belgrade

Danilo Tonić, School of Electrical Engineering, University of Belgrade

![Graphical Abstract](/images/zbornik/2022/robot-valjak/graficki_apstrakt.svg)

## Abstract

The paper's topic is the mathematical analysis of the spherical robot and physical implementation of its 2D version. Using the rules of Lagrangian mechanics, the equations of motion of the system were derived. These equations describe the movement of the robot's pendulum as well as the movement of the robot itself. Based on these equations, the appropriate transfer functions were derived, and then the PID controllers were constructed. Three PID controllers are computer simulated in the paper. The first PID controller produces a constant angle of inclination of the pendulum relative to the ground. The second PID controller maintains a constant angular velocity of the robot. The final PID controller maintains a constant angular distance traveled by the robot. A physical model of the robot was created in which the PID that controls the angle of inclination of the robot was implemented. Using the IMU, raw data from the gyroscope and accelerometer were obtained, which after processing and complementation give the angle of inclination of the robot's pendulum. With the angle of inclination and the data from the rotary encoder, the rotation, speed and distance traveled by the robot are calculated.

## Full Paper

{{< serbian-version >}}
