// Diffusion Limited Aggregation
document.addEventListener("DOMContentLoaded", () => {
    const cellWidth = 5;
    const cellHeight = 5;
    const numRows = 100;
    const numCols = 100;
    const genTime = 0.2;
    let pattern = [];
    const numWalkers = 300;

    class Walker {
        constructor(col, row) {
            this.row = row;
            this.col = col;
            this.stuck = false;
        }

        checkCollision(row, col) {
            if (pattern[row][col]) {
                return true;
            }
            return false;
        }

        walk() {
            let direction = Math.floor(Math.random() * 4);

            switch (direction) {
                case 0:
                    // Walk up
                    if (this.row - 1) {
                        this.row = this.row - 1; 
                    } else {
                        this.row = this.row + 1;
                    }
                    break
                case 1:
                    // Walk right
                    if (this.col + 1 < numCols) {
                        this.col = this.col + 1;
                    } else {
                        this.col = this.col - 1;
                    }
                    break
                case 2:
                    // Walk down
                    if (this.row + 1 < numRows) {
                        this.row = this.row + 1;
                    } else {
                        this.row = this.row - 1;
                    }
                    break
                case 3:
                    // Walk left
                    if (this.col - 1 > 0) {
                        if (this.checkCollision(this.row, this.col-1)) {
                            pattern.push([this])
                        }
                        this.col = this.col - 1;
                    } else {
                        this.col = this.col + 1;
                    }
                    break
            }

            if (this.checkCollision()) {
                pattern.push([this.col, this.row]);
                this.stuck = true;
            }
        }

        run() {
            while (!this.stuck) { 
                this.walk();
            }
        }
    }

    const addWalker = (n) => {
        while (n > 0) {
            pattern.push(new Walker(Math.floor(Math.random() * numCols), Math.floor(Math.random() * numRows)))
            n--;
        }
    }

    addWalker(numWalkers);

    let svg = d3.select('#dla')
        .attr('width', cellWidth * numCols)
        .attr('height', cellHeight * numRows);

    function update(selection, data) {
        const cells = selection.selectAll("rect").data(data, d => `${d.row}_${d.col}`);

        cells.enter()
            .append("rect")
            .attr("x", d => d.col * cellWidth)
            .attr("y", d => d.row * cellHeight)
            .attr("width", cellWidth)
            .attr("height", cellHeight)
            .style("fill", "rgba(150, 150, 150, 1")
            .transition()
            .duration(genTime * 500)
            .style("fill", "black");

        cells.transition()
            .attr("x", d => d.col * cellWidth)
            .attr("y", d => d.row * cellHeight)
    }

    const tick = (items) => {
        items.forEach(walker => {
            walker.walk();
        })
        return items;
    };

    let gen = pattern
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
            console.log("new tick")
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
        .getElementsByClassName("dla-restart")[0]
        .addEventListener("click", restartHandler, false);

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