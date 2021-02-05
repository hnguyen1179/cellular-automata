 # Cellular Automata
[Live link](https://hnguyen1179.github.io/cellular-automata/)</br></br>
## 1-d Model
<img src="https://user-images.githubusercontent.com/19617238/107095939-8a7fa380-67be-11eb-8460-16109f396919.gif" width="650" />
</br>

## 2-d Model (Conway's Game of Life)
<img src="https://user-images.githubusercontent.com/19617238/107097980-fbc15580-67c2-11eb-8930-ea33e5fd8c9d.gif" width="650" />


## Table of Contents
1. [Introduction](#introduction)
2. [Technologies](#technologies)
3. [Highlights](#highlights)

## Introduction

Cellular Automata is a fun passion project I did because I wanted practice using the d3.js library. Data visualization has always been an interest of mine and so I wanted to work on a project that would help further expand on this skill. 
</br>
</br>
The concept of Cellular Automata revolves around the idea that complex systems in life, organic or inorganic, can be modeled through microinteractions between smaller individual pieces. Depending on the system being modeled, there exists **rules** which govern the interactions between these individual pieces of the system that, in the end, affect the system on a macro level. 
</br>
</br>
In this project, I model 3 different systems: traffic, forest fires, and urban growth. 

## Technologies

**Frontend** <br/> 
This project was done entirely with vanilla JavaScript, HTML5, CSS3, and the d3.js library.

## Highlights
The animations are all created via script that uses a mix of object-oriented & procedural programming along with the d3.js library. For an example, the code below describes the function that is ran in between every frame of the animation for Conway's Game of Life shown above. This function will update to form the next "state" of the animation.

```Javascript
    const tick = (items) => {
        const current = {};
        items.forEach(item => {
            current[`${item[0]}_${item[1]}`] = 0;
        });
        
        const nextGen = [];
        const birthCands = {};
        items.forEach(item => {
            let neighbors = 0;
            [-1, 0, 1].forEach(i => {
                [-1, 0, 1].forEach(j => {
                    let xInterval = item[0] + i;
                    let yInterval = item[1] + j;

                    // Code to implement a wrap-around border
                    if (xInterval > rows-1) {
                        xInterval = 0;
                    } else if (xInterval < 0) {
                        xInterval = rows-1;
                    }

                    if (yInterval > cols-1) {
                        yInterval = 0;
                    } else if (yInterval < 0) {
                        yInterval = cols-1;
                    }

                    const key = `${xInterval}_${yInterval}`;
                    if (current.hasOwnProperty(key)) {
                        neighbors += 1;
                    } else {
                        if (!birthCands.hasOwnProperty(key)) {
                            birthCands[key] = 0;
                        }
                        birthCands[key] += 1;
                    }
                });
            });
            // Removes self from neighbors count
            neighbors -= 1;

            // If 2 or 3 neighbors, the cell kept around for the next generation
            if ([2, 3].includes(neighbors)) {
                nextGen.push(item);
            }
        });

        // Potential new cells generated from equilibrium
        const birth = Object.entries(birthCands)
            .filter(e => e[1] === 3)
            .map(e => e[0].split("_").map(e => parseInt(e)));

        return nextGen.concat(birth);
    };
```
</br>
</br>

Below are the animations for the 3 complex systems I've modeled in this project! 

* **Traffic Model**
<img src="https://user-images.githubusercontent.com/19617238/107097107-10045300-67c1-11eb-86ab-0ee38bfb9b2a.gif" width="650" />
<img src="https://user-images.githubusercontent.com/19617238/107097099-0aa70880-67c1-11eb-89fc-d9ceca1ca6e4.gif" width="650" />
<img src="https://user-images.githubusercontent.com/19617238/107097105-0ed32600-67c1-11eb-9bae-9e670fced9e0.gif" width="650" />

* **Forest Fire Model**
<img src="https://user-images.githubusercontent.com/19617238/107097109-11358000-67c1-11eb-9c47-e1b54f32c30d.gif" width="650" />


* **Urban Growth Model**
<img src="https://user-images.githubusercontent.com/19617238/107097104-0e3a8f80-67c1-11eb-9da0-f715b2cc071c.gif" width="650" />


