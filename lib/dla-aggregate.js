// Diffusion Limited Aggregation
document.addEventListener("DOMContentLoaded", () => {
    const cellWidth = 3;
    const cellHeight = 3;
    const numRows = 167;
    const numCols = 167;
    const midpoint = 83;

    let generation = 0;

    // Change genTime if a certain global condition is switched ( the one that adds walkers )
    // Make it slower 

    let genTime = 0.01;

    /** 
     * aggregate keeps track of all the neighboring areas of aggregates are
     * this is used for collision detection between a walker and an aggregate 
    **/
    let aggregate = new Set()

    /**
     * objects contains a set of all the Walker class objects. Walker class objects turn into 
     * aggregates when their 'stuck' parameter is true, which is triggered when thry neighbor 
     * an aggregate neighbor (coordinate found in aggregate)
    **/
    let objects = new Set();

    const numWalkers = 3000;

    const aggregateAdder = (col, row) => {
        [-1, 0, 1].forEach(dCol => {
            [-1, 0, 1].forEach(dRow => {
                aggregate.add([col - dCol, row - dRow].toString());
            })
        })
    }

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

        checkCollision(col, row) {
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

            // let randomWeightedDirection = weightedRand({0: 0.253, 1: 0.253, 2: 0.247, 3: 0.247})
            // let direction = distanceArray.indexOf(sortedDistance[randomWeightedDirection]);

            let direction = Math.floor(Math.random() * 4);

            switch (direction) {
                case 0:
                    // Walk up
                    if (this.row - 1 >= 0) {
                        if (this.checkCollision(this.col, this.row - 1) === true) {
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
                        if (this.checkCollision(this.col + 1, this.row) === true) {
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
                        if (this.checkCollision(this.col, this.row + 1) === true) {
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
                        if (this.checkCollision(this.col - 1, this.row) === true) {
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
        objects.add(new Walker(midpoint, midpoint, true));
    }

    const addWalker = (n) => {
        while (n > 0) {
            let col = Math.floor(Math.random() * numCols)
            let row = Math.floor(Math.random() * numRows)

            objects.add(new Walker(col, row));
            n--;
        }
    }

    /** 
     * These lines below sets up the board. 
     *  - aggregateAdder adds the aggregate neighbors in the aggregate set
     *  - addWalker randomly adds a certain number of walkers onto the object set 
     *  - addAggregation adds a stuck walker onto the object set
     *    - object class is generated onto the SVG element using the update function,
     *      which is now the updateAggregates function. 
     *    - The update function previously filtered the object set to only include 
     *    - 'stuck' walkers. 
     *      - Solution... updateAggregates function will filter for 'stuck' walkers 
     *      - new updateWalkers function will filter for 'unstuck' walkers 
     *      - These update function will affect two different SVG elements 
     *      - Hovering over spacing will superimpose these two SVG elements 
    **/
    aggregateAdder(midpoint, midpoint);
    addWalker(numWalkers);
    addAggregation();

    let svgAggregates = d3.select('#dla-aggregates')
        .attr('width', cellWidth * numCols)
        .attr('height', cellHeight * numRows);

    function updateAggregates(selection, data) {
        // Efficiency: Move this conversion outside where it isn't pinged on every update. Could be costly. 
        data = Array.from(data).filter(d => {
            return d.stuck === true;
        })

        const cells = selection.selectAll("rect").data(data, d => `${d.col}_${d.row}`);

        cells.enter()
            .append("rect")
            .attr("x", d => d.col * cellWidth)
            .attr("y", d => d.row * cellHeight)
            .attr("width", cellWidth)
            .attr("height", cellHeight)
            .style("fill", "red");
        // .style("fill", d3.interpolateYlOrBr((1 - (generation/800))));

        cells.exit()
            .style("fill", "rgba(0, 0, 0)")
            .style("opacity", 1)
            .transition()
            .duration(genTime * 500)
            .style("opacity", 0)
            .on("end", function () {
                d3.select(this).remove();
            });

        // cells.transition()
        //     .attr("x", d => d.col * cellWidth)
        //     .attr("y", d => d.row * cellHeight)
        //     .style("fill", d => d3.interpolateYlGnBu(generation / 1000));


        // new Idea... Have TWO separate d3 animations running to generate the dual. 
        // When you hover over spacing, you then display the walkers svg file display: hide/show 
        // Two SVG files
        // 1. Generates the aggregation
        // 2. Generates the walkers 
        // 3. Walkers svg will reference the aggregation SVG and will add into the aggregation SVG 
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
    svgAggregates.call(updateAggregates, gen);

    let hotdog = false;

    let t;

    const playPauseHandler = () => {
        if (hotdog) {
            hotdog = false;
            clearInterval(t);
        } else {
            hotdog = true;
            started = true;
            t = setInterval(() => {
                generation += 1;
                if (generation === 2500) {
                    clearInterval(t);
                    hotdog = false;
                }
                gen = tick(gen);
                svgAggregates.call(updateAggregates, gen);
            }, genTime * 500)
        }
    }

    const restartHandler = () => {
        clearInterval(t);
        svgAggregates.selectAll('rect').remove();

        objects = new Set();
        aggregate = new Set();
        generation = 0;

        addWalker(numWalkers);
        aggregateAdder(midpoint, midpoint);
        addAggregation();

        gen = objects
        svgAggregates.call(updateAggregates, gen);
        hotdog = false;

        t = setInterval(() => {
            generation += 1;
            if (generation === 2500) {
                clearInterval(t);
                hotdog = false;
            }
            gen = tick(gen);
            svgAggregates.call(updateAggregates, gen);
        }, genTime * 500);

        setTimeout(() => clearInterval(t), 1);
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
        .getElementsByClassName("dla-aggregate-restart")[0]
        .addEventListener("click", restartHandler, false);

    document
        .getElementsByClassName("dla-aggregate-restart")[0]
        .addEventListener("mousedown", mouseDownHandler, false);

    document
        .getElementsByClassName("dla-aggregate-restart")[0]
        .addEventListener("mouseup", mouseUpHandler, false);

    document
        .getElementsByClassName("dla-aggregate-restart")[0]
        .addEventListener("mouseout", mouseUpHandler, false);

    document
        .getElementsByClassName("dla-aggregate-spacing")[0]
        .addEventListener("click", playPauseHandler, false);

    document
        .getElementsByClassName("dla-aggregate-spacing")[0]
        .addEventListener("mouseover", (event) => {
            event.currentTarget.style.cursor = 'pointer';
        }, false);
}); 