document.addEventListener("DOMContentLoaded", () => {
    const cellWidth = 10;
    const cellHeight = 10;
    const rows = 10;
    const cols = 10;
    const genTime = 0.05;
    
    let maxGeneration = 100;
    let percentOrganic = 0.75;
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

    const generatePattern = () => {
        for (let r = 0; r < rows; r++) {
            Math.random()
            for (let c = 0; c < cols; c++) {
                // This is a cell POJO, which can take in other states 
                pattern.push({
                    x: c,
                    y: r,
                    state: weightedRand({ 'x': percentOrganic, 'o': percentInorganic }),
                    charcoal: null
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
    generateFire(5);

    let svg = d3.select('#forest-fire')
        .attr('width', cellWidth * cols)
        .attr('height', cellHeight * rows);

    function update(selection) {
        const cells = selection.selectAll("#forest-fire").data(pattern, d => { return `${d.x}_${d.y}`});

        // cells.exit()
        //     .remove();

        cells.enter()
            .append("rect")
            .attr("x", d => d.x * cellWidth)
            .attr("y", d => d.y * cellHeight)
            .attr("width", cellWidth)
            .attr("height", cellHeight)
            .style("fill", (d) => {
                if (d.state === 'x') {
                    return 'green';
                } else if (d.state === 'o') {
                    return 'grey';
                } else if (d.state === 'f') {
                    return 'rgba(200, 70, 0, 0.9)';
                } else {
                    return 'black';
                }
            })

        cells.transition()
            .duration(300)
            .style("fill", (d) => {
                if (d.state === 'x') {
                    return 'green';
                } else if (d.state === 'o') {
                    return 'grey';
                } else if (d.state === 'f') {
                    return 'rgba(200, 70, 0, 0.1)';
                } else {
                    return 'black';
                }
            })
    }

    const tick = (items) => {
        const current = {};

        items.forEach(item => {
            current[`${item.x}_${item.y}`] = {
                state: item.state
            }
        });

        const nextGen = [];

        items.forEach(item => {
            let neighborsOnFire = 0;
            [-1, 0, 1].forEach(i => {
                [-1, 0, 1].forEach(j => {
                    const key = `${item.x + i}_${item.y + j}`;
                    if (current.hasOwnProperty(key) && current[key].state === 'f') {
                        neighborsOnFire += 1;
                    }
                });
            }); 

            if (neighborsOnFire >= 1) {
                if (item.state === 'x') {
                    let probability = (neighborsOnFire / 8);
                    item.state = weightedRand({'f':probability, 'x':(1-probability)});
                } else if (item.state === 'f') {
                    if (item.charcoal === generation) {
                        item.state = 'c';
                    } else if (item.charcoal === generation+1) {
                        null;
                    } else {
                        item.charcoal = generation + 2;
                    }
                }
            }
            nextGen.push(item);
        });

        generation += 1;
        return nextGen;
    }

    svg.call(update);

    let t;
    let hotdog = false;

    const playPauseHandler = () => {
        console.log('play pause clicked')
        if (hotdog) {
            hotdog = false;
            clearInterval(t);
        } else {
            hotdog = true;
            t = setInterval(() => {
                pattern = tick(pattern);
                svg.call(update);
                if (generation === maxGeneration) clearInterval(t);
            }, genTime * 1000);
        }
    }

    document
        .getElementById("forest-fire")
        .addEventListener("click", playPauseHandler, false);
})