document.addEventListener("DOMContentLoaded", () => {
    const cellWidth = 10;
    const cellHeight = 10;
    const rows = 50;
    const cols = 50;
    const genTime = 0.1;
    let pattern = [];
    const percentFilled = 30;

    const populateBoard = (number) => {
        for (let r = 0; r < rows; r++) {
            for (let c = 0; c < cols; c++) {
                if (Math.floor(Math.random() * 100) < number) {
                    pattern.push([r, c]);
                } 
            }
        }
    }

    populateBoard(percentFilled);

    let svg = d3.select('#game-of-life')
        .attr('width', cellWidth * cols)
        .attr('height', cellHeight * rows);

    function update(selection, data) {
        const cells = selection.selectAll("rect").data(data, d => `${d[0]}_${d[1]}`);

        cells.exit()
            .style("fill", "rgba(200, 200, 200, 1)")
            .style("opacity", 1)
            .transition()
            .duration(genTime * 450)
            .style("opacity", 0)
            .on("end", function () {
                d3.select(this).remove();
            });
        cells.enter()
            .append("rect")
            .attr("x", d => d[0] * cellWidth)
            .attr("y", d => d[1] * cellHeight)
            .attr("width", cellWidth)
            .attr("height", cellHeight)
            .style("fill", "rgba(150, 150, 150, 1")
            .transition()
            .duration(genTime * 450)
            .style("fill", "black");
    }

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

    let gen = pattern
    svg.call(update, gen);

    let hotdog = false;

    let t;
    let spacing = document.getElementsByClassName("game-of-life-spacing")[0];
    let restart = document.getElementsByClassName("game-of-life-restart")[0];


    const playPauseHandler = () => {
        if (hotdog) {
            hotdog = false;
            clearInterval(t);
        } else {
            hotdog = true;
            started = true;
            t = setInterval(() => {
                gen = tick(gen);
                svg.call(update, gen);
            }, genTime * 500)
        }
    }

    const restartHandler = () => {
        clearInterval(t);
        svg.selectAll('rect').remove();

        pattern = [];
        populateBoard(percentFilled);

        gen = pattern
        svg.call(update, gen);
        hotdog = false; 

        t = setInterval(() => {
            gen = tick(gen);
            svg.call(update, gen);
        }, genTime * 500);

        setTimeout(() => clearInterval(t), 20);
    }
    
    const mouseDownHandler = () => {
        event.currentTarget.style.boxShadow = 'inset 1px 1px black';
        event.currentTarget.style.transform = 'translate(3.5px, 3.5px)';
    }

    const mouseUpHandler = () => {
        event.currentTarget.style.boxShadow = '1px 1px black';
        event.currentTarget.style.transform = 'translate(3px, 3px)';
    }

    document
        .getElementsByClassName("game-of-life-restart")[0]
        .addEventListener("click", restartHandler, false);
        
    document
        .getElementsByClassName("game-of-life-restart")[0]
        .addEventListener("mousedown", mouseDownHandler, false);

    document
        .getElementsByClassName("game-of-life-restart")[0]
        .addEventListener("mouseup", mouseUpHandler, false);

    // document
    //     .getElementsByClassName("game-of-life-restart")[0]
    //     .addEventListener("mouseover", mouseOverHandler, false);

    document
        .getElementsByClassName("game-of-life-restart")[0]
        .addEventListener("mouseout", mouseUpHandler, false);

    document
        .getElementsByClassName("game-of-life-spacing")[0]
        .addEventListener("click", playPauseHandler, false);

    // document
    //     .getElementsByClassName("game-of-life-spacing")[0]
    //     .addEventListener("mouseover", mouseOverHandler, false);
});