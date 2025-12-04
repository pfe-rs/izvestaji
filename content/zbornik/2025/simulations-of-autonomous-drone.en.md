---
title: Simulations of an Autonomous Drone for Object Tracking
summary: A project focused on simulating an autonomous drone for object tracking, conducted at the 2025 Summer Camp for Senior Participants, authored by Ana Bogdanović and Lana Lejić.
svg_image: /images/zbornik/2025/simulacije-autonomnog-drona/grafabs.svg
---

**Authors:**

Ana Bogdanović, 2nd-year student at the Mathematical Grammar School in Belgrade

Lana Lejić, 3rd-year student at Jovan Cvijić Grammar School in Modriča

**Mentors:**

Aleksa Račić,  

Nikola Drakulić,  

Đorđe Marjanović,  


Keywords: autonomous drone, object tracking, Kalman filter, A* algorithm, simulation, ArduPilot, Gazebo


### **Abstract:**

This paper presents the development and evaluation of a simulation system for autonomous object tracking using an unmanned aerial vehicle. The system was developed in a virtual environment that includes terrain generation with varying levels of complexity, modeling of the drone’s field of view, and implementation of motion prediction and path planning algorithms. A Kalman filter was used to predict the target's position when the object leaves the field of view, while the A\* algorithm enabled efficient route planning in the presence of obstacles. The simulation was designed to operate in the ArduPilot environment in SITL mode and visually represented in Gazebo. Performance analysis included metrics such as object visibility, prediction accuracy, maintenance of safe distance, and frequency of line-of-sight interruptions. The obtained results indicate that the developed model can successfully combine predictive and adaptive approaches, laying the foundation for further research and improvements of autonomous tracking systems in real-world conditions.

![](static/images/zbornik/2025/simulacije-autonomnog-drona/grafabs.svg)


### **1\. Introduction**

**—————————————————————————————————————————**

The development of unmanned aerial vehicles (UAVs) over the last decades has significantly enhanced the capabilities of autonomous systems in various application areas. Their use spans a wide range of activities, from military and security missions, search and rescue, terrain exploration, and delivery, to sports and entertainment through automated activity recording. Due to this versatility, autonomous drones have become a prominent research direction in robotics and artificial intelligence.

One of the key challenges in this field is the problem of tracking objects in dynamic and unpredictable environments. However, physical testing of such algorithms can be expensive, impractical, and potentially destructive, highlighting the importance of simulation environments for research and development.

This project aims to develop a simulation system for autonomous object tracking in a virtual space. In the simulation, the drone uses algorithms for path planning, orientation adjustment, and motion prediction, while the system’s complexity gradually increases. Special emphasis is placed on adapting the drone’s position depending on the field of view and obstacles in the environment, as well as evaluating efficiency through clearly defined metrics, such as positioning accuracy, reaction speed, and detection precision.

In this way, the project not only contributes to understanding the process of autonomous object tracking but also creates a foundation for further research toward integrating simulation and real-world systems. The results can serve as a starting point for developing more robust algorithms in real conditions, bringing practical applications of autonomous drones closer. Although many studies explore autonomous tracking using visual and predictive algorithms, relatively few integrate path planning and motion prediction within a unified simulation framework, which is the goal of this research.

### **2\. Methodology**

**—————————————————————————————————————————**

In this section we present the approach, tools, and experimental procedures used to build and evaluate the simulation system. First, we explain the process of terrain generation and the modeling of the field of view; next, we detail the implementation of the Kalman filter for target motion prediction and the A* algorithm for path planning; and then we describe the collision detection and avoidance methods. Special emphasis is placed on the simulation configuration in the ArduPilot SITL environment, the way metrics are collected (object visibility, prediction accuracy, maintenance of safe distance, number of line-of-sight interruptions), and the criteria used for performance evaluation. All key parameters, assumptions, and implementation choices are clearly documented to ensure reproducibility and to enable comparison with future work.

#### **2.1. Terrain Generation and Complexity**

---

To achieve realistic simulation, it is necessary to define a three-dimensional terrain containing obstacles of various shapes, positions, and dimensions. Generating such terrain allows modeling the environment in which the drone and objects move, creating conditions analogous to real urban and natural scenarios. Obstacles act as physical barriers that limit the field of view, complicate path planning, and directly affect the navigation algorithm’s behavior. Terrains used in the simulation were manually designed to control environmental complexity and precisely test system behavior under different conditions.

Within the simulation, the drone and the object are defined as point entities with associated position and velocity parameters. Their movement occurs discretely through time steps, updating positions based on velocity vectors and chosen directions. This approach allows each state change to be visualized in an animation that clearly shows the drone moving toward the target, the object changing direction, and obstacles affecting the interaction dynamics. The animation thus serves as a tool for monitoring system behavior in real-time, while velocities and directions are represented through vector relationships between entities.

Measuring terrain complexity serves future evaluation and comparison with other simulations. The difficulty of the configuration determines how challenging the tracking and navigation task is. Complexity can be defined as a combination of obstacle density and their spatial dispersion. Density describes the number of obstacles per unit volume or relative to a predefined maximum number, while dispersion depends on the average distance between obstacles. A terrain with few but closely spaced obstacles can be as challenging as a terrain with many widely spaced barriers.

A quantitative metric is used:

$$
K = \alpha \cdot \frac{N}{N_{\text{max}}} \+ \beta \cdot \left(1 - \min\!\left(\frac{d_{\text{avg}}}{d_{\text{max}}},\,1\right)\right)
$$

where $N$ is the number of obstacles, $N_{\text{max}}$ the maximum allowed number of obstacles, $d_{\text{avg}}$ the average distance between obstacle centers, and $d_{\text{max}}$ the maximum possible distance within the grid. Weight coefficients $\alpha$ and $\beta$ balance the influence of density and dispersion. The resulting $K$ value is then normalized and converted into a discrete complexity score from 1 (easiest) to 5 (most challenging).

![Figure 1\. Examples of terrains with different complexity ratings](static/images/zbornik/2025/simulacije-autonomnog-drona/slika5.png)

#### **2.2. Field of View Model**

---

The field of view (FOV) is one of the fundamental parameters in modeling UAV perception. In simulations, it defines the space within which the UAV can detect and track an object, taking into account spatial and geometric relationships between the UAV, obstacles, and observed targets. FOV is a primary filter that separates the information available to the UAV from that “hidden” due to distance or occlusion.

Defining the FOV involves three elements: radius, angular width, and line of sight. Radius determines the maximum distance at which the UAV can register an object, analogous to the sensor range in real systems. Angular width describes the spatial sector in which perception is active, modeling natural sensor limitations, such as a camera or lidar. Line of sight ensures that no obstacle blocks detection between the UAV and the object, meaning FOV formation depends not only on geometric parameters but also on environmental structure. In addition to radius and angular width, FOV has a height limitation, with objects above a certain altitude relative to the UAV remaining undetected.

When an object is within the FOV, the UAV can register its existence and precise position, enabling calculation of distance and angle relative to its orientation. Based on successive measurements, the UAV can further estimate the object's direction and velocity.

The FOV serves not only as a perception limit but also as a mechanism to generate a series of parameters (location, angle, distance, speed, and position prediction), bringing the simulation model closer to real-world conditions. In other words, the UAV does not make decisions based on an “omniscient” perspective but on information that it would realistically have in a real environment.

![Figure 2\. Graphical representation of the drone's field of view model][static/images/zbornik/2025/simulacije-autonomnog-drona/slika2.png]

#### **2.3. Kalman Filter**

---

The Kalman filter is a mathematical algorithm that allows the estimation of a system’s current state, even when measurements are temporarily unavailable. In object tracking with a camera, it is used to predict the object’s position when it temporarily leaves the FOV, e.g., due to obstacles or other occlusion factors.

While the object is visible, position and velocity information is obtained from sensors (camera), collected, and used to form a motion model. When the object leaves the FOV, the Kalman filter uses the motion model, the last known position, and momentum to predict the likely next position.

The Kalman filter has two main steps:

1. **Prediction:**  
   * Based on the previous state and motion model, predict the object's next state.  
   * Calculate the expected prediction error.

2. **Update:**  
   * When a new measurement is available, update the estimate using the difference between predicted and actual values.  
   * The new estimate becomes the basis for the next iteration.

When the object temporarily disappears, the Kalman filter continues generating position predictions, enabling uninterrupted tracking, allowing the drone to relocate the target after losing it. The algorithm is highly efficient and can operate in real-time, which is crucial for video processing and object tracking.

Kalman filter equations:

1. **Prediction**  
   System state:

    $$\hat{x}_{k|k-1} = F_k\,\hat{x}_{k-1|k-1} + B_k\,u_k $$

   Error covariance:

   $$P_{k|k-1} = F_k\,P_{k-1|k-1}\,F_k^{T} + Q_k $$

2. **Update**  
   Kalman gain:

   $$K_k = P_{k|k-1} H_k^{T} \left(H_k P_{k|k-1} H_k^{T} + R_k \right)^{-1}$$
 

   Updated state:

   $$\hat{x}_{k|k} = \hat{x}_{k|k-1} + K_k \left(z_k - H_k \hat{x}_{k|k-1}\right)$$

   Updated covariance:

   $$P_{k|k} = \left(I - K_k H_k\right) P_{k|k-1}$$

$ \hat{x} $ → state estimate (position, velocity, …)  
$ F_k $ → state transition matrix (motion model)  
$ B_k u_k $ → input signal (if any)  
$ P $ → estimation error covariance  
$ Q_k $ → process noise (model uncertainty)  
$ z_k $ → sensor measurement (camera)  
$ H_k $ → matrix mapping state to measurement  
$ R_k $ → measurement noise (sensor uncertainty)  
$ K_k $ → Kalman gain

#### **2.4. A* Algorithm**

---

The A\* algorithm is used to find the shortest path between two points and is one of the most efficient graph search methods. In this project, A\* was implemented to determine the optimal path from the drone’s current position to the target object within its FOV.

A\* converts the space into a graph, where nodes represent possible positions and edges represent allowable movements in 3D. During the search, the algorithm considers:

* **Actual distance** traveled from the start to the current node, and  
* **Estimated remaining distance** to the goal using a heuristic.

For each node, the total cost function is:

$$f(n)=g(n)+h(n)$$

Where:  
* **$g(n)$** – actual distance from start to node *n*  
* **$h(n)$** – heuristic estimate from node *n* to goal  
* **$f(n)$** – combination of actual and heuristic distance

A\* selects the next node with the lowest $f(n)$, efficiently guiding the drone toward the target while avoiding unnecessary paths.

In this project, A\* is used only when the object is within the drone’s FOV, avoiding unnecessary planning in unknown space. When the object is detected, the drone and object positions are mapped to graph nodes, and the algorithm calculates the optimal path to reach the goal.

This method enables fast and reliable shortest-path finding in a known environment while avoiding obstacles and minimizing travel time.

#### **2.5. Collision Detection and Avoidance**

---

The drone constantly calculates a movement vector toward the object, considering the current object position and predictions from the Kalman filter when temporarily out of view. Minimum distance is maintained by scaling the movement vector. The drone does not reach the exact object position but maintains a predefined safety distance. This allows controlled approach speed: if the object moves significantly slower, the drone slows to maintain safety distance. If the object stops or collides with an obstacle, the drone also stops at a minimal safe distance.

![Figure 3\. Graphical representation of drone target positioning][static/images/zbornik/2025/simulacije-autonomnog-drona/slika4.png]

Collision avoidance with static obstacles relies on a 3D occupancy grid marking occupied and free space. Each planned step is tested via a collision detection function. If an obstacle exists, alternative movement vectors in neighboring directions (up, down, left, right, forward, backward) are generated. If no alternative exists, the drone halts to prevent collisions.

This approach combines predictive logic, adaptive path planning, and target visibility checks, enabling the drone to continuously track the target, react to unexpected obstacles, maintain safe distance, and minimize collision risk in complex 3D environments.

![Figure 4\. Graphical representation of path testing][static/images/zbornik/2025/simulacije-autonomnog-drona/slika3.png]

#### **2.6. Simulation in Realistic Environment**

Using ArduPilot in SITL mode, it is possible to simulate drone behavior without a physical device. All command signals and sensor data are processed, simulating drone behavior (stabilization, flight, command execution). ArduPilot exchanges data via MAVLink protocol. Commands come from code written in DroneKit. Through DroneKit, users can program autonomous missions and control the drone in real-time. Flight simulation and environment visualization are provided in the Gazebo simulator, allowing users to monitor drone movement and test algorithms safely without physical hardware.

# **3\. Results**

**—————————————————————————————————————————**

Performance analysis of collision detection and avoidance relies on several metrics to quantify the drone’s tracking efficiency. Object visibility at each simulation step shows how long the UAV can register the target, important for evaluating sensor reliability and tracking strategy. Frequent object loss requires reliance on Kalman filter predictions, which may increase movement error. Drone-object distance provides insight into maintaining minimum safety zone. Excessive distance reduces tracking accuracy, while proximity increases collision risk. Kalman filter error (difference between predicted and actual position) allows evaluation of prediction accuracy, especially when the object leaves FOV or moves dynamically. Angle to the object records changes in target position relative to the drone, reflecting maneuvering demands and allowing analysis of motion smoothness and stability. Line-of-sight interruptions, caused by occlusion or object leaving FOV, indicate scenario complexity and obstacle avoidance efficiency. Frequent interruptions require higher reliance on prediction. These metrics together provide a comprehensive evaluation of the autonomous system.

![Figure 5\. Measurements from simulation on terrain with complexity 4.2][static/images/zbornik/2025/simulacije-autonomnog-drona/slika6.pnggit a]

# **4\. Discussion**

**—————————————————————————————————————————**

The simulation demonstrated that the UAV can successfully track objects in environments of varying complexity while maintaining safe distance. Integration of the Kalman filter allows tracking to continue when the object temporarily leaves FOV, confirming system robustness in real scenarios.

However, it is important to note that the current implementation is not yet fully integrated into the Gazebo environment with full physical dynamics. Currently, the system allows terrain generation and complexity evaluation, while the object is simulated by a single drone with predefined movement. Future improvements include transferring tracking logic to a second drone to follow the object and implementing object and obstacle recognition using cameras and other sensors.

Additionally, with advanced object detection networks like YOLO or FRCNN, simulations would become even more precise in object recognition and tracking, improving obstacle avoidance so the drone can navigate complex scenarios more efficiently. Ultimately, applying this system on a real drone would be a step toward a fully functional autonomous tracking and recording system in real-world conditions.

# **5\. Conclusion**

**—————————————————————————————————————————**  

This paper presents a simulation system for autonomous object tracking using an unmanned aerial vehicle, combining motion prediction and path planning algorithms in a virtual environment. Implementation of the Kalman filter enabled continuous target tracking even when the object leaves FOV, while the A\* algorithm allowed efficient obstacle avoidance and optimal route planning. The simulation was successfully realized in ArduPilot SITL mode and visualized in Gazebo, enabling algorithm testing without physical UAV.

The results show that the system can adaptively respond in real-time, maintaining safe distance and efficiently avoiding collisions. Used metrics demonstrated system stability and accuracy under various terrain complexity conditions, indicating potential for real-world application.

# **6\. References**

**—————————————————————————————————————————**

1. Y. He, T. Hou, and M. Wang, “A new method for unmanned aerial vehicle path planning in complex environments,” *Scientific Reports*, vol. 14, Art. no. 9257, 2024. DOI:10.1038/s41598-024-60051-4. ([Nature](https://www.nature.com/articles/s41598-024-60051-4?utm_source=chatgpt.com))

2. G. Gugan and A. Haque, “Path Planning for Autonomous Drones: Challenges and Future Directions,” *Drones*, vol. 7, no. 3, Art. no. 169, 2023. DOI:10.3390/drones7030169. ([MDPI](https://www.mdpi.com/2504-446X/7/3/169?utm_source=chatgpt.com))

3. H. Liu, X. Li, M. Fan, G. Wu, W. Pedrycz, and P. N. Suganthan, “An Autonomous Path Planning Method for Unmanned Aerial Vehicle based on A Tangent Intersection and Target Guidance Strategy,” arXiv preprint arXiv:2006.04103, 2020. ([ResearchGate](https://www.researchgate.net/publication/380002995_A_new_method_for_unmanned_aerial_vehicle_path_planning_in_complex_environments?utm_source=chatgpt.com))

4. F. C. Chen, G. Gugan, R. Solis-Oba and A. Haque, "Simple and Efficient Algorithm for Drone Path Planning," *ICC 2021 - IEEE International Conference on Communications*, Montreal, QC, Canada, 2021, pp. 1-6, doi: 10.1109/ICC42927.2021.9500370.

5. Q. Zhou and G. Liu, "UAV Path Planning Based on the Combination of A-star Algorithm and RRT-star Algorithm," *2022 IEEE International Conference on Unmanned Systems (ICUS)*, Guangzhou, China, 2022, pp. 146-151, doi: 10.1109/ICUS55513.2022.9986703.

6. ArduPilot Dev Team, “Using SITL for ArduPilot Testing,” ArduPilot Developer Documentation. [Online]. Available: [https://ardupilot.org/dev/docs/using-sitl-for-ardupilot-testing.html](https://ardupilot.org/dev/docs/using-sitl-for-ardupilot-testing.html)

7. DroneKit Project, “DroneKit-SITL,” GitHub. [Online]. Available: [https://github.com/dronekit/dronekit-sitl](https://github.com/dronekit/dronekit-sitl)

8. K. Amer, M. Samy, M. Shaker, and M. ElHelw, “Quadcopter Drone for Vision-Based Autonomous Target Following,” arXiv preprint. [Online].

9. A. Boonsongsrikul et al., “Real-Time Human Motion Tracking by Tello EDU Drone,” *Sensors*, vol. 23, no. 2, Art. 897, 2023\. DOI:10.3390/s23020897. ([MDPI](https://www.mdpi.com/1424-8220/23/2/897?utm_source=chatgpt.com))
