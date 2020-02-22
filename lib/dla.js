// Diffusion Limited Aggregation
document.addEventListener("DOMContentLoaded", () => {
    const cellWidth = 5;
    const cellHeight = 5;
    const numRows = 100;
    const numCols = 100;
    const genTime = 0.6Ca;
    let pattern = [[50, 50], [49, 49], [50, 51]];
    let walkers = {};
    let bofa = {};

    const numWalkers = 300;

    class Walker {
        constructor(col, row) {
            this.row = row;
            this.col = col;
        }

        checkCollision(col, row) {  
            debugger
            pattern.forEach(coordinate => {
                [-1, 0, 1].forEach(dX => {
                    [-1, 0, 1].forEach(dY => {
                        if ([coordinate[0] + dX, coordinate[1] + dY].toString() === [col, row].toString()) {
                            return true;
                        }
                    })
                })
            })
            return false;
        }

        distanceFromCenter(col, row) {
            let dX = col - 0;
            let dY = row - 0;
            return (dX * dX) + (dY * dY)
        }

        walk() {
            // Up, Right, Down Left
            let distanceArray = [this.distanceFromCenter(this.col, this.row - 1), 
                                 this.distanceFromCenter(this.col + 1, this.row),
                                 this.distanceFromCenter(this.col, this.row + 1),
                                 this.distanceFromCenter(this.col - 1, this.row)]
            
            
            

            let direction = Math.floor(Math.random() * 4);

            switch (direction) {
                case 0:
                    // Walk up
                    if (this.row - 1 > 0) {
                        debugger
                        if (this.checkCollision(this.col, this.row - 1) === true) {
                            pattern.push([this.col, this.row]);
                            console.log("Pattern added");
                            delete walkers[`${this.col}_${this.row}`]
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
                            pattern.push([this.col, this.row]);
                            console.log("Pattern added");
                            delete walkers[`${this.col}_${this.row}`]
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
                            pattern.push([this.col, this.row]);
                            console.log("Pattern added");
                            delete walkers[`${this.col}_${this.row}`]
                        } else {
                            this.row = this.row + 1;
                        }
                    } else {
                        this.row = this.row - 1;
                    }
                    break
                case 3:
                    // Walk left
                    if (this.col - 1 > 0) {
                        if (this.checkCollision(this.col - 1, this.row) === true) {
                            pattern.push([this.col, this.row]);
                            console.log("Pattern added");
                            delete walkers[`${this.col}_${this.row}`];
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

    const addWalker = (n) => {
        while (n > 0) {
            let col = Math.floor(Math.random() * numCols)
            let row = Math.floor(Math.random() * numRows)
            walkers[`${col}_${row}`] = new Walker(col, row)
            n--;
        }
    }

    addWalker(numWalkers);

    let svg = d3.select('#dla')
        .attr('width', cellWidth * numCols)
        .attr('height', cellHeight * numRows);

    function update(selection, data) {
        // Efficiency: Move this conversion outside where it isn't pinged on every update. Could be costly. 
        data = Object.values(data);
        const cells = selection.selectAll("rect").data(data);

        cells.enter()
            .append("rect")
            .attr("x", d => d.col * cellWidth)
            .attr("y", d => d.row * cellHeight)
            .attr("width", cellWidth)
            .attr("height", cellHeight)
            .style("fill", () => {
                console.log("enter hit")
                
                return 'black';
            })

        cells.transition()
            .attr("x", d => d.col * cellWidth)
            .attr("y", d => {
                // console.log("transition hit")
                return d.row * cellHeight
            })
    }

    const tick = (items) => {
        Object.keys(items).forEach(walker => {
            items[walker].walk();
        });

        return items 
    };

    let gen = walkers
    svg.call(update, gen);

    let hotdog = false;

    let t;

    const playPauseHandler = () => {
        if (hotdog) {
            console.log('paused')
            hotdog = false;
            clearInterval(t);
        } else {
            console.log('started')
            hotdog = true;
            started = true;
            t = setInterval(() => {
                console.log("new generation")
                gen = tick(gen);
                svg.call(update, gen);
            }, genTime * 500)
        }
    }

    // const restartHandler = () => {
    //     clearInterval(t);
    //     svg.selectAll('rect').remove();

    //     pattern = [];
    //     populateBoard(percentFilled);

    //     gen = pattern
    //     svg.call(update, gen);
    //     hotdog = false;

    //     t = setInterval(() => {
    //         gen = tick(gen);
    //         console.log("new tick")
    //         svg.call(update, gen);
    //     }, genTime * 500);

    //     setTimeout(() => clearInterval(t), 20);
    // }

    const mouseDownHandler = () => {
        event.currentTarget.style.boxShadow = 'inset 1px 1px black';
        event.currentTarget.style.transform = 'translate(3.5px, 3.5px)';
    }

    const mouseUpHandler = () => {
        event.currentTarget.style.boxShadow = '1px 1px black';
        event.currentTarget.style.transform = 'translate(3px, 3px)';
    }

    // document
    //     .getElementsByClassName("dla-restart")[0]
    //     .addEventListener("click", restartHandler, false);

    document
        .getElementsByClassName("dla-restart")[0]
        .addEventListener("mousedown", mouseDownHandler, false);

    document
        .getElementsByClassName("dla-restart")[0]
        .addEventListener("mouseup", mouseUpHandler, false);

    // document
    //     .getElementsByClassName("dla-restart")[0]
    //     .addEventListener("mouseover", mouseOverHandler, false);

    document
        .getElementsByClassName("dla-restart")[0]
        .addEventListener("mouseout", mouseUpHandler, false);

    document
        .getElementsByClassName("dla-spacing")[0]
        .addEventListener("click", playPauseHandler, false);

    // document
    //     .getElementsByClassName("dla-spacing")[0]
    //     .addEventListener("mouseover", mouseOverHandler, false);
});