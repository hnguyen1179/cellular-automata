document.addEventListener("DOMContentLoaded", () => {
    const cellWidth = 10;
    const cellHeight = 10;
    const rows = 30;
    const cols = 70;
    const genTime = 0.05;

    let numFires = 2;
    let maxGeneration = 300;
    let percentOrganic = .92;
    let percentInorganic = (1 - percentOrganic);
    let generation = 0;
    let pattern = [];

    const weightedRand = (spec) => {
        let sum = 0
        let r = Math.random();

        for (let i in spec) {
            sum += spec[i];
            if (r <= sum) return i
        }
    }

    // New Idea, make another forest-fire model, but now trace the path using the 
    // generation #. 

    // Make more efficient! 

    // Another new idea, make a 1d-CA for patterns that rely on a more chaotic initial pattern,
    // rather than from just a single cell 

    const generatePattern = () => {
        // O(n-squared)
        for (let r = 0; r < rows; r++) {
            for (let c = 0; c < cols; c++) {
                // This is a cell POJO, which can take in other states 
                pattern.push({
                    x: c,
                    y: r,
                    state: weightedRand({ 'x': percentOrganic, 'o': percentInorganic }),
                    charcoal: null,
                })
            }
        }
    }

    const generateFire = (n) => {
        for (let i = 0; i < n; i++) {
            pattern[Math.floor(Math.random() * pattern.length)].state = 'f';
        };
    }

    generatePattern();
    generateFire(numFires);

    let svg = d3.select('#forest-fire-v2')
        .attr('width', cellWidth * cols)
        .attr('height', cellHeight * rows);

    function update(selection) {
        const cells = selection.selectAll("rect").data(pattern, d => { return `${d.x}_${d.y}` });

        cells.enter()
            .append("rect")
            .attr("x", d => d.x * cellWidth)
            .attr("y", d => d.y * cellHeight)
            .attr("width", cellWidth)
            .attr("height", cellHeight)
            .style("fill", (d) => {
                if (d.state === 'x') {
                    // return 'black';
                    // return 'rgba(108, 124, 89, 0.85)';
                    return 'rgba(0, 0, 0, 0)';
                } else if (d.state === 'o') {
                    return 'rgba(0, 0, 0, 0)';
                    // return 'rgba(0, 0, 0, 0.76)';
                    // return 'rgba(0, 0, 0, 0.1)';
                } else if (d.state === 'f') {
                    return 'rgba(200, 70, 0, 0.9)';
                }
            })

        cells.transition()
            .duration(50)
            .style("fill", (d) => {
                if (d.state === 'x') {
                    // return 'rgba(108, 124, 89, 0.85)';
                    return 'rgba(0, 0, 0, 0)';
                } else if (d.state === 'o') {
                    return 'rgba(0, 0, 0, 0)';
                } else if (d.state === 'f') {
                    return 'rgba(230, 30, 0, 0.8)';
                } else {
                    return d3.interpolateYlGnBu(d.charcoal / 90);
                    // return d3.interpolateTurbo(d.charcoal / 120);
                }
            })
    }

    const tick = (items) => {
        // Current is created in order to check for the valid counts 
        const current = {};
        let firePresent = false;

        // O(n)
        items.forEach(item => {
            current[`${item.x}_${item.y}`] = {
                state: item.state
            }
        });

        const nextGen = [];

        // O(n)
        items.forEach(item => {
            let neighborsOnFire = 0;
            [-1, 0, 1].forEach(i => {
                [-1, 0, 1].forEach(j => {
                    const key = `${item.x + i}_${item.y + j}`;

                    // O(1)
                    if (current.hasOwnProperty(key) && current[key].state === 'f') {
                        neighborsOnFire += 1;
                    }
                });
            });

            if (neighborsOnFire > 0) {
                if (item.state === 'x') {
                    let probability = (neighborsOnFire / 8);
                    item.state = weightedRand({ 'f': probability, 'x': (1 - probability) });
                } else if (item.state === 'f') {
                    if (item.charcoal === generation) {
                        item.state = 'c';
                    } else if (item.charcoal === generation + 1) {
                        null;
                    } else {
                        item.charcoal = generation + 2;
                    }
                }
                firePresent = true;
            }
            nextGen.push(item);
        });

        if (!firePresent) {
            generation = maxGeneration - 1;
        }

        generation += 1;
        return nextGen;
    }

    svg.call(update);

    let timeInterval;
    let hotdog = false;

    const playPauseHandler = () => {
        if (generation === maxGeneration) {
            pattern = [];
            generation = 0;
            generatePattern();
            generateFire(numFires);
            gen = pattern;

            timeInterval = setInterval(() => {
                pattern = tick(pattern);
                svg.call(update);
                if (generation === maxGeneration) clearInterval(timeInterval);
            }, genTime * 1000);
            hotdog = true;
        } else if (hotdog) {
            hotdog = false;
            clearInterval(timeInterval);
        } else {
            hotdog = true;
            timeInterval = setInterval(() => {
                pattern = tick(pattern);
                svg.call(update);
                if (generation === maxGeneration) clearInterval(timeInterval);
            }, genTime * 1000);
        }
    }

    document
        .getElementById("forest-fire-v2")
        .addEventListener("click", playPauseHandler, false);
})