document.addEventListener("DOMContentLoaded", () => {
    const cellWidth = 3;
    const cellHeight = 3;
    const rows = 50;
    const cols = 175;
    const initialSize = Math.floor(175 * 0.25);
    const genTime = 0.05;
    const maxGeneration = 65;
    let blackCells = [];

    const ruleSetGen = num => {
        let setArray = num.toString(2).split("");
        while (8 > setArray.length) {
            setArray.unshift("0");
        }
        return setArray.reverse().map(x => parseInt(x));
    };

    let ruleSetNumber = 184;
    let rowA = new Set();
    let generation = 0;

    let ruleSetArray = ruleSetGen(ruleSetNumber);

    const generateRandomInitial = (n) => {
        for (let i = 0; i < n; i++) rowA.add((Math.floor(Math.random() * 175)));
    }

    generateRandomInitial(initialSize);

    let svg = d3.select("#traffic-model-25")
        .attr("width", cellWidth * cols)
        .attr("height", cellHeight * rows);

    d3.select(".traffic-model-25-title").append('span')
        .classed("rule-set-random", true)
        .text(`Rule ${ruleSetNumber}`);
    
    //Making a bar graph for the number of White Cells 
    const svgWidth = 580;
    const svgHeight = 320;
    const margin = { top: 15, right: 50, bottom: 30, left: 30 };
    const width = svgWidth - margin.left - margin.right;
    const height = svgHeight - margin.top - margin.bottom;

    let chartSvg = d3.select("#traffic-model-25-bargraph")
        .attr("width", width)
        .attr("height", height);
        
    const drawChart = data => {
        let group = chartSvg.append("g")
            .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

        let xAxis = d3.scaleLinear()
            .rangeRound([0, 450]);
        let yAxis = d3.scaleLinear()
            .rangeRound([230, 0]);
            
        let line = d3.line()
            .x(function (d) { return xAxis(d.time) })
            .y(function (d) { return yAxis(d.count) })

        xAxis.domain(d3.extent(data, d => {
            return d.time 
        }));

        yAxis.domain(d3.extent(data, d => { 
            return d.count 
        }));

        // Adds the bottom axis
        group.append("g")
            .attr("transform", "translate(0," + 231 + ")")
            .call(d3.axisBottom(xAxis)).select(".domain")
            .remove();

        // Adds the left axis
        group.append("g")
            .call(d3.axisLeft(yAxis))

        // Adds the line onto group element
        group.append("path")
            .datum(data).attr("fill", "none")
            .attr("transform", "translate(0, 1)")
            .attr("stroke", "steelblue")
            .attr("stroke-linejoin", "round")
            .attr("stroke-linecap", "round")
            .attr("stroke-width", 1.25)
            .attr("d", line);
    }

    const update = selection => {
        const row = selection.selectAll("#traffic-model-25").data(rowA, d => {
            return d[0];
        });

        row.enter()
            .append("rect")
            .attr("x", d => d * cellWidth)
            .attr("y", generation * cellHeight)
            .attr("width", cellWidth)
            .attr("height", cellHeight)
            .style("fill", "rgba(255, 60, 60, .8")
            .transition()
            .duration(genTime * 500)
            .style("fill", 'black');
    };

    const rules = (set, currentRow) => {
        currentRow = new Set(currentRow);
        set = set.map(number => {
            if (number === -1) {
                number = 174; 
            } else if (number === 175) {
                number = 0;
            } else if (number === -2) {
                number = 173;
            } else if (number === 176) {
                number = 1;
            }

            if (currentRow.has(number)) {
                return 1;
            } else {
                return 0;
            }
        });
        let binaryForm = set[0].toString() + set[1].toString() + set[2].toString();
        return ruleSetArray[parseInt(binaryForm, 2)];
    };

    const generate = currentRow => {
        let nextRow = new Set();
        let blackCellsCount = 0;

        // O(n)
        currentRow.forEach(cell => {
            // O(n)
            [-1, 0, 1].forEach(i => {
                let current = cell + i;

                // let left = current - 1;
                // let middle = current;
                // let right = current + 1;

                // if (left < 0) {
                //     left = 174 + left;
                // }

                // if (middle < 0) {
                //     middle = 174 + middle; 
                // }

                // if (middle > 174) {
                //     middle = middle % 174;
                // }

                // if (right > 174) {
                //     right = right % 174; 
                // }

                // if (rules([left, middle, right], currentRow) === 1) {
                //     nextRow.add(current);
                //     blackCellsCount += 1;
                // }

                if (rules([current - 1, current, current + 1], currentRow) === 1) {
                    nextRow.add(current);
                    blackCellsCount += 1;
                }
            });
        });

        blackCells.push({
            time: generation,
            count: blackCellsCount
        });

        generation += 1;
        return Array.from(nextRow);
    };

    if (generation === 0) {
        rowA = Array.from(rowA);
        svg.call(update);
        rowA = new Set(rowA);
    }

    let timeInterval = setInterval(() => {
        rowA = generate(rowA);
        svg.call(update);

        if (generation === maxGeneration) {
            drawChart(blackCells);
            clearInterval(timeInterval);
        }
    }, 30);

    let spacing = document.getElementsByClassName("traffic-model-25-spacing")[0];

    const mouseOver = () => {
        spacing.style.cursor = "pointer";
        spacing.style.backgroundColor = "rgba(0, 0, 0, 0.045)";
        spacing.style.transition = "250ms";
    };

    const mouseOut = () => {
        spacing.style.backgroundColor = "rgba(0, 0, 0, 0.02)";
        spacing.style.transition = '400ms';
    }

    const restart = () => {
        clearInterval(timeInterval);
        blackCells = [];
        svg.selectAll("rect").remove();
        chartSvg.selectAll("g").remove();

        rowA = new Set();
        generateRandomInitial(initialSize);
        ruleSetNumber = 184
        ruleSetArray = ruleSetGen(ruleSetNumber);
        d3.select(".rule-set-random").text(`Rule ${ruleSetNumber}`)
        generation = 0;

        if (generation === 0) {
            rowA = Array.from(rowA);
            svg.call(update);
            rowA = new Set(rowA);
        }

        svg.call(update);

        timeInterval = setInterval(() => {
            rowA = generate(rowA);
            svg.call(update);
            if (generation === maxGeneration) {
                drawChart(blackCells);
                clearInterval(timeInterval);
            }
        }, 30);
    }

    spacing.addEventListener("mouseover", mouseOver, false);
    spacing.addEventListener("mouseout", mouseOut, false);
    spacing.addEventListener("click", restart, false);
});
