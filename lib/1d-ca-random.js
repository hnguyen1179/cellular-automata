document.addEventListener("DOMContentLoaded", () => {
    const cellWidth = 5;
    const cellHeight = 5;
    const rows = 80;
    const cols = 131;
    const initialSize = 90;
    const genTime = 0.1;
    const maxGeneration = 65;

    const ruleSetGen = num => {
        let setArray = num.toString(2).split("");
        while (8 > setArray.length) {
            setArray.unshift("0");
        }
        return setArray.reverse().map(x => parseInt(x));
    };
    
    let ruleSetNumber = 184;
    let rowA = new Set([]);
    let generation = 0;

    const generateRandomInitial = (n) => {
        for (let i = 0; i < n; i++) rowA.add(Math.floor(Math.random() * 131));
    }

    generateRandomInitial(initialSize);

    let svg = d3.select("#one-dimensional-ca-random")
        .attr("width", cellWidth * cols)
        .attr("height", cellHeight * rows);
    
    d3.select(".one-dimensional-ca-random-title").append('span')
        .classed("rule-set-random", true)
        .text(`Rule ${ruleSetNumber}`);

    const update = selection => {
        let linearScale = d3.scaleLinear()
            .domain([0, 55, 70])
            .range(["rgba(0, 0, 0, 1)", "rgba(0, 0, 0, 1)", "rgba(0, 0, 0, 1)"]);

        const row = selection.selectAll("#one-dimensional-ca-random").data(rowA, d => {
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
            .style("fill", linearScale(generation));
    };

    const rules = (set, currentRow) => {
        currentRow = new Set(currentRow);
        set = set.map(number => {
            if (currentRow.has(number)) {
                return 1;
            } else {
                return 0;
            }
        });
        let binaryForm = set[0].toString() + set[1].toString() + set[2].toString();
        return ruleSetGen(ruleSetNumber)[parseInt(binaryForm, 2)];
    };

    const generate = currentRow => {
        let nextRow = new Set();
        currentRow.forEach(cell => {
            [-1, 0, 1].forEach(i => {
                let current = cell + i;
                if (rules([current - 1, current, current + 1], currentRow) === 1) {
                    nextRow.add(current);
                }
            });
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

        if (generation === maxGeneration) clearInterval(timeInterval);
    }, 30);

    let spacing = document.getElementsByClassName("one-dimensional-ca-random-spacing")[0];

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
        svg.selectAll("rect").remove();
        generateRandomInitial();
        ruleSetNumber = Math.floor(Math.random() * 255);
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
            if (generation === maxGeneration) clearInterval(timeInterval);
        }, 30);
    }

    spacing.addEventListener("mouseover", mouseOver, false);
    spacing.addEventListener("mouseout", mouseOut, false);
    spacing.addEventListener("click", restart, false);
});
