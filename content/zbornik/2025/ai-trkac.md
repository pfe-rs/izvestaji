# **AI avatar for car-driving games**

Authors: Dmitry Anderson, Andrej Vasiljević
Menthors: Đorđe Marjanović, Dimitrije Pešić, Nikola Drakulić, Novak Stijepić, Nataša Jovanović

# Abstract

Training self-driving agents in real cars is risky, expensive, and complicated, which is why games and simulations are perfect for experimenting with AI driving. In this paper, we explore four different approaches to building an AI avatar for a racing game: Proximal Policy Optimization (PPO), Genetic Algorithms (GA), Imitation Learning (IL), and a Pure Algorithmic Method (PAM). Each of these methods was tested in a formula-style racing environment where the agent had to drive around the track, avoid walls, and keep lap times low while relying only on simple sensor inputs.

Our results show that while learning-based methods like PPO, GA, and IL work, they struggle with stability, training time, and handling unfamiliar situations. In contrast, the handcrafted algorithmic method drove reliably and never crashed under normal conditions, although it failed on unusual tracks. These findings suggest that sometimes a simple algorithm can outperform complex AI in well-defined environments. We also agree that combining both approaches—AI adaptability with algorithmic reliability—could be a strong direction for future work.

# Apstrakt

Obučavanje autonomnih agenata u pravim automobilima je rizično, skupo i komplikovano, zbog čega su igrice i simulacije savršene za eksperimentisanje sa veštačkom inteligencijom u vožnji. U ovom radu istražujemo četiri različita pristupa izgradnji AI avatara za trkačku igru: Proximal Policy Optimization (PPO), Genetski algoritmi (GA), Učenje imitacijom (IL) i Čist algoritamski metod (PAM). Svaka od ovih metoda testirana je u trkačkom okruženju u stilu formule, gde je agent morao da vozi po stazi, izbegava zidove i održava nisko vreme kruga, oslanjajući se samo na jednostavne senzorske ulaze.

Naši rezultati pokazuju da, iako metode zasnovane na učenju poput PPO, GA i IL funkcionišu, one se suočavaju sa problemima stabilnosti, vremenom treniranja i teškoćama u snalaženju u nepoznatim situacijama. Nasuprot tome, ručno kreirani algoritamski metod vozio je pouzdano i nikada nije doživeo sudar u normalnim uslovima, iako nije uspevao na neuobičajenim stazama. Ovi nalazi sugerišu da jednostavan algoritam ponekad može nadmašiti složenu veštačku inteligenciju u jasno definisanim okruženjima. Takođe smatramo da bi kombinovanje oba pristupa — AI prilagodljivosti i algoritamske pouzdanosti — moglo predstavljati snažan pravac za budući rad.

# **Introduction**

## Intro

Self-driving cars in complex environments are a huge challenge in AI development and software implementation. Real-world driving has many complexities as it is a hardly controlled environment, which makes testing and development difficult. Using many sensors together, following road laws, physical limits and safety standards are things that make using regulated simulations and games perfect for testing multiple algorithms for this problem.

This paper presents the implementation and analysis of AI agents for a formula track car racing game environment. The main objective is to develop and evaluate algorithms capable of navigating a car through a track automatically while maximizing performance like avoiding collision with track walls and minimizing lap time on minimalistic sensor inputs. This approach for the problem is very suitable for studying agent training without real world responsibilities.

## Methods

### PPO

PPO is a policy gradient optimization approach. For PPO, the implementation from Stable Baselines 3 was used, which is a set of implementations of reinforcement learning algorithms in PyTorch.

Policy Network: The policy network is a neural network that takes the current state of the environment as input and outputs a probability distribution over possible actions. This distribution represents the agent’s policy, which specifies the probabilities of taking each action given the current state.

Value Network: In addition to the policy network, PPO often includes a value network. The value network estimates the expected cumulative reward (value) of being in a given state. This estimation helps reduce the variance of the policy gradient estimates and provides additional signal for learning.

PPO is well-suited for this problem domain due to several characteristics:
\- Multi-action support (unlike older approaches like DQN)
\- The clipped policy updates improve training stability and allow limited reuse of collected trajectories, which helps compared to older on-policy methods, though it’s not as sample-efficient as off-policy algorithms like SAC or TD3.
\- PPO can handle tasks with delayed rewards, provided the reward function is shaped well enough to guide learning—crucial in racing where progress is tied to sustained sequences of actions.
\- Being on-policy means PPO always learns from the most recent behavior, reducing instability from stale data. This comes at the cost of efficiency but ensures steady, consistent policy updates, which can be beneficial in environments where reliability matters more than squeezing out maximum data efficiency.

#### Observation space

The observation space contains 25 continuous values:

| Vehicle state |  |  |  |  |  |  |
| :---: | :---: | :---: | :---: | :---: | :---: | :---: |
|  | Pull | Fiction | Volocity x | Volocity y | Orientation sin | Orientation cos |
| Normalization | \[0,1\] | \[0,1\] |  \[-1,1\] |  \[-1,1\] |  \[-1,1\] |  \[-1,1\] |

| Navigation |  |  |  |
| :---: | :---: | :---: | :---: |
|  | Target direction sin | Target direction cos | Collision flag |
| Normalization |  \[-1,1\] |  \[-1,1\] | \[0,1\] |

Spatial sensing (16 values):

Ray distances \[0,1\] measured at equal angles in a full 360° pattern around the vehicle. While forward-facing sensors might seem sufficient for track following, the complete circular coverage is necessary for computing the optimal direction vector — we use wall detection from opposite rays to determine the track centerline and calculate where the car should head next. Since this directional computation requires the full ray data, we feed all measurements directly into the neural network. (for normalizing distances we are using the map diagonal, which is the biggest distance within the simulation)

#### Architecture

Architecture: Both policy (actor) and value function (critic) networks consist of three fully connected hidden layers with \[128, 128, 64\] neurons respectively.
Activation function: LeakyReLU activation applied throughout the hidden layers to handle potential negative inputs and improve gradient flow.
Weight initialization: Orthogonal initialization applied to all linear layers, providing better initial weight distribution for policy gradient methods.
Input/Output: The framework automatically handles input layer sizing (25 observations) and output layer (4 multi-choice actions)

#### Hyperparameters

Key hyperparameters modifications from PPO defaults:
\- Learning rate: 5e-3 (increased from 3e-4) for faster convergence in the racing domain
\- Entropy coefficient: 0.01 (from 0.0) to encourage exploration during training
\- Value function coefficient: 4e-3 (reduced from 0.5) since the value function was learning too aggressively relative to the policy
\- Training epochs: Configurable via command line arguments for experimental flexibility
\- All other hyperparameters (n\_steps=2048, batch\_size=64, γ=0.99, λ=0.95, clip\_range=0.2) remain at standard values proven effective for continuous control tasks.

### GA

GA is an optimization approach based on choosing the best from a population( many versions of the agent) sorted by their fitness.

\- Unlike gradient-based methods, GA doesn't require reward functions or optimization gradients and can optimize complex tasks without trapping in local optima.
\- The nature of the algorithm allows parallel driving of multiple agents simultaneously, which can be particularly valuable in racing where different driving styles might be solutions.
\- Being closed for the developer optimizer means GA treats the neural network as a whole rather than learning from individual experiences, so by being a determined type of simulation, the agent might never explore some possibilities.
\- The method's parallel type and not being shaken by noisy evaluations can be good in racing environments where performance metrics might vary due to random elements.

IL
Imitation learning lets an agent learn to drive quickly by copying examples from gameplay. This is faster than reinforcement learning, which needs longer training time. The bad side is that the AI can get confused when it gets in a situation it never saw in the expert data.

This method works very well for racing games, since good examples are easy to find (from human players and the internet full of gameplays). Driving also happens step by step, which matches perfectly with imitation learning’s ability to copy behavior patterns.

Unlike reinforcement learning, imitation learning doesn’t need a reward system. Instead, it learns directly from players. However, this means the AI is limited by the quality of the data, it can't play better than the expert or invent new driving strategies.

Imitation learning is usually more efficient than reinforcement learning because it saves time by using existing knowledge. But it requires a clean dataset, which is not always easy to get or may not have every possible driving situation.

### PAM

Pure algorithmic method is a classic way of solving the problem. It does not use any AI to predict the next move, but uses math and non-AI algorithms to understand the situation and choose the right move.

This method works well for simply defined environments, as the method is designed by the developer himself. The problem is that the solution becomes unpredictable when the environment is complex, similar to real life ones.

In this paper, the method was divided into 2 parts:

1. The gas-brake part is done by calculating the dangerous distance where the car does not have time to brake and will for sure hit the wall. So with that we know the dangerous velocity a car has at the moment. The car uses gas and brakes to always be close to that velocity but never greater than it.
2. The left-right part is done by picking the longest path it can take before hitting a wall. The car then steers left or right to match it.

## **Problems and the environment**

Any AI agent used in this paper needs to understand some environment rules that define it.

**Environment state and car actions**: The agent is put in a continuous loop where it needs to learn precise control over acceleration, steering and braking. The observation space is defined differently for different algorithms, but it's made from sensors:

1. **Proximal Policy Optimization (PPO)**: Described in [PPO Method](#ppo)
2. **Imitation Learning**: one set of 5 \- 7 distance measuring rays spread on a pi angle centralized at the facing direction and one set of 5 \- 7 distance measuring rays spread on a pi angle centralized at the velocity direction
3. **Genetic Algorithm (GA)**: one set of 5 \- 7 distance measuring rays spread on a pi angle centralized at the facing direction and one set of 5 \- 7 distance measuring rays spread on a pi angle centralized at the velocity direction
4. **Pure Algorithmic Method**: one set of 11 distance measuring rays spread on a 7/8pi angle centralized at the facing direction and one set of 5 distance measuring rays spread on a pi/2 angle centralized at the velocity direction

Additionally we add car parameters at the moment, such as velocity, orientation, size, mass,...

**Making decisions real-time**: With the environment running at 60FPS agents must make decisions constantly while processing input sensors.

**Interaction with changing environment constants**: Environment has variable parameters containing friction and different cars. Agents need to learn to work with these limitations while optimizing speed.

**Optimising multiple objectives**: Agent needs to balance objectives, maximizing speed, avoiding walls and maintaining control.

## **Search**

In the search for appropriate solutions we understood some principles and we got answers for our problem. We had four hypotheses for algorithms:

1. PPO will have the best results.
2. GA will learn fast, but have overall worse performance from others when trained more.
3. IL will learn the fastest, but it will not learn all situations and by that, won't function.
4. PAM will work perfectly, but have problems if the map is not logically built.

## **Results**

Results we got for testing on 12 maps:


|  | Average Laps Completed | Average laps per minute |
| :---: | :---: | :---: |
| PPO | 1.5 | 5 |
| GA | 2 | 3.4 |
| IL | 1.25 | 2.9 |
| PAM | Infinite | 6.2 |

1. PPO did not have the best results. This algorithm is not well suited for this problem. It could possibly work better with much more training, but it's not linear.
2. GA worked well for this task, but not much better than PPO. GA could possibly work better with much more training and bigger populations, but in our testing it did not have expected results.
3. IL got bad results from expected problems: Imperfect mentor plays, small and unbalanced datasets, problems with unseen situations, overfitting. Still, the training time for getting to the same point was much smaller than other agents.
4. The Pure Algorithmic Method worked perfectly, it does not hit any walls while driving at the top speed. As expected, when facing non-logical maps, it gets confused and turns around or stops.

# **Conclusion**

In this project we tested four ways of making a self-driving car in a racing game: PPO, GA, IL, and a Pure Algorithmic Method. The results showed that the learning-based methods (PPO, GA, and IL) did not perform as well as we expected. PPO and GA needed much more training to get better results, and IL learned very quickly but had problems when it faced situations that were not in the training data.

The Pure Algorithmic Method gave the best results in our tests. It was able to drive fast without crashing and worked very well on normal tracks. However, it had trouble with maps that were not logical, since it could not adapt to strange situations.

From these results we can say that while AI methods are more flexible for harder problems, in simple racing environments a well-designed algorithm can still work better. A mix of both AI and algorithms could be a good direction for future work.

Additionally, this paper indicates that some problems are more suited to algorithmic methods.

## References

[https://arxiv.org/abs/1707.06347](https://arxiv.org/abs/1707.06347)
[https://github.com/DLR-RM/stable-baselines3](https://github.com/DLR-RM/stable-baselines3)
[https://arxiv.org/pdf/2007.12673](https://arxiv.org/pdf/2007.12673)
[https://medium.com/@danushidk507/ppo-algorithm-3b33195de14a](https://medium.com/@danushidk507/ppo-algorithm-3b33195de14a)
[https://arxiv.org/abs/2110.05437](https://arxiv.org/abs/2110.05437)
[https://arxiv.org/pdf/2107.08325](https://arxiv.org/pdf/2107.08325)
[https://arxiv.org/abs/2110.05437](https://arxiv.org/abs/2110.05437)
[https://github.com/Tinker-Twins/Autonomous\_Racing\_Using\_Hybrid\_Learning](https://github.com/Tinker-Twins/Autonomous_Racing_Using_Hybrid_Learning?utm_source=chatgpt.com)
[https://www.mdpi.com/2078-2489/15/2/113](https://www.mdpi.com/2078-2489/15/2/113?utm_source=chatgpt.com)
