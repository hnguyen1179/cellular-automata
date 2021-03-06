// Diffusion Limited Aggregation
document.addEventListener("DOMContentLoaded", () => {
    const cellWidth = 5;
    const cellHeight = 5;
    const numRows = 100;
    const numCols = 100;

    const genTime = 0.3;
    let aggregate = new Set()
    let objects = new Set();

    const numWalkers = 1400;

    const aggregateAdder = (col, row) => {
        [-1, 0, 1].forEach(dCol => {
            [-1, 0, 1].forEach(dRow => {
                aggregate.add([col - dCol, row - dRow].toString());
            })
        })
    }

    aggregateAdder(50, 50);

    const weightedRand = spec => {
        let sum = 0;
        let r = Math.random();

        for (let i in spec) {
            sum += spec[i];
            if (r <= sum) return i;
        }
    };

    class Walker {
        constructor(col, row, stuck = false) {
            this.row = row;
            this.col = col;
            this.stuck = stuck;
        }

        checkCollisionAggregates(col, row) {
            if (aggregate.has([col, row].toString())) {
                return true;
            } else {
                return false;
            }
        }

        distanceFromCenter(col, row) {
            let dX = col - Math.floor(numCols / 2);
            let dY = row - Math.floor(numRows / 2);
            return (dX * dX) + (dY * dY)
        }

        walk() {
            // Up, Right, Down Left
            // let distanceArray = [this.distanceFromCenter(this.col, this.row - 1), 
            //                      this.distanceFromCenter(this.col + 1, this.row),
            //                      this.distanceFromCenter(this.col, this.row + 1),
            //                      this.distanceFromCenter(this.col - 1, this.row)]

            // let sortedDistance = distanceArray.slice().sort((a, b) => { return a - b });

            // let randomWeightedDirection = weightedRand({0: 0.40, 1: 0.40, 2: 0.10, 3: 0.10})
            // let direction = distanceArray.indexOf(sortedDistance[randomWeightedDirection]);

            let direction = Math.floor(Math.random() * 4);

            switch (direction) {
                case 0:
                    // Walk up
                    if (this.row - 1 >= 0) {
                        if (this.checkCollisionAggregates(this.col, this.row - 1) === true) {
                            this.row = this.row - 1;
                            aggregateAdder(this.col, this.row);
                            this.stuck = true;
                        } else {
                            this.row = this.row - 1;
                        }
                    } else {
                        this.row = this.row + 1;
                    }
                    break
                case 1:
                    // Walk right
                    if (this.col + 1 < numCols) {
                        if (this.checkCollisionAggregates(this.col + 1, this.row) === true) {
                            this.col = this.col + 1;
                            aggregateAdder(this.col, this.row);
                            this.stuck = true;
                        } else {
                            this.col = this.col + 1;
                        }
                    } else {
                        this.col = this.col - 1;
                    }
                    break
                case 2:
                    // Walk down
                    if (this.row + 1 < numRows) {
                        if (this.checkCollisionAggregates(this.col, this.row + 1) === true) {
                            this.row = this.row + 1;
                            aggregateAdder(this.col, this.row);
                            this.stuck = true;
                        } else {
                            this.row = this.row + 1;
                        }
                    } else {
                        this.row = this.row - 1;
                    }
                    break
                case 3:
                    // Walk left
                    if (this.col - 1 >= 0) {
                        if (this.checkCollisionAggregates(this.col - 1, this.row) === true) {
                            this.col = this.col - 1;
                            aggregateAdder(this.col, this.row);
                            this.stuck = true;
                        } else {
                            this.col = this.col - 1;
                        }
                    } else {
                        this.col = this.col + 1;
                    }
                    break
            }
        }
    }

    const addAggregation = () => {
        objects.add(new Walker(50, 50, true));
    }

    const addWalker = (n) => {
        while (n > 0) {
            let col = Math.floor(Math.random() * numCols)
            let row = Math.floor(Math.random() * numRows)

            objects.add(new Walker(col, row));
            n--;
        }
    }

    // Sets up the board with random particles floating 
    addWalker(numWalkers);
    addAggregation();

    let svg = d3.select('#dla')
        .attr('width', cellWidth * numCols)
        .attr('height', cellHeight * numRows);

    function update(selection, data) {
        // Efficiency: Move this conversion outside where it isn't pinged on every update. Could be costly. 
        data = Array.from(data);
        const cells = selection.selectAll("rect").data(data);

        cells.enter()
            .append("rect")
            .attr("x", d => d.col * cellWidth)
            .attr("y", d => d.row * cellHeight)
            .attr("width", cellWidth)
            .attr("height", cellHeight)
            .style("fill", d => {
                if (d.stuck === false) {
                    return 'rgba(0, 0, 0, 0.2)';
                    // return 'rgba(255, 0, 0, 0.3';

                } else {
                    return 'red';
                }
            })

        cells.transition()
            .attr("x", d => d.col * cellWidth)
            .attr("y", d => d.row * cellHeight)
            .style("fill", d => {
                if (d.stuck === false) {
                    return 'rgba(0, 0, 0, 0.2)';
                    // return 'rgba(255, 0, 0, 0.3';
                } else {
                    return 'red';
                }
            })
    }

    const tick = (items) => {
        items.forEach(object => {
            if (object.stuck === false) {
                object.walk();
            }
        })

        return items
    };

    let gen = objects
    svg.call(update, gen);

    let hotdog = false;

    let g;

    const playPauseHandler = () => {
        if (hotdog) {
            hotdog = false;
            clearInterval(g);
        } else {
            hotdog = true;
            started = true;
            g = setInterval(() => {
                gen = tick(gen);
                svg.call(update, gen);
                if (window.scrollY > 11047) {
                    clearInterval(g);
                    hotdog = false;
                }
            }, genTime * 500)
        }
    }

    const restartHandler = () => {
        clearInterval(g);
        svg.selectAll('rect').remove();

        objects = new Set();
        aggregate = new Set();

        addWalker(numWalkers);
        aggregateAdder(50, 50);
        addAggregation();

        gen = objects
        svg.call(update, gen);
        hotdog = false;

        g = setInterval(() => {
            if (window.scrollY > 11047) {
                clearInterval(g);
                hotdog = false;
            }
            gen = tick(gen);
            svg.call(update, gen);
        }, genTime * 500);

        setTimeout(() => clearInterval(g), 1);
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
        .getElementsByClassName("dla-restart")[0]
        .addEventListener("click", restartHandler, false);

    document
        .getElementsByClassName("dla-restart")[0]
        .addEventListener("mousedown", mouseDownHandler, false);

    document
        .getElementsByClassName("dla-restart")[0]
        .addEventListener("mouseup", mouseUpHandler, false);

    document
        .getElementsByClassName("dla-restart")[0]
        .addEventListener("mouseout", mouseUpHandler, false);

    document
        .getElementsByClassName("dla-spacing")[0]
        .addEventListener("click", playPauseHandler, false);

    document
        .getElementsByClassName("dla-spacing")[0]
        .addEventListener("mouseover", (event) => {
            event.currentTarget.style.cursor = 'pointer';
        }, false);
}); 