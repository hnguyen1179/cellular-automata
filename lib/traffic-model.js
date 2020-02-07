document.addEventListener("DOMContentLoaded", () => {
    const cellWidth = 3;
    const cellHeight = 3;
    const rows = 80;
    const cols = 350;
    const initialSize = 175;
    const genTime = 0.05;
    const maxGeneration = 65;

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
        for (let i = 0; i < n; i++) rowA.add((Math.floor(Math.random() * 251) - 70));
    }

    generateRandomInitial(initialSize);
    console.log(rowA);

    let svg = d3.select("#traffic-model")
        .attr("width", cellWidth * cols)
        .attr("height", cellHeight * rows);

    d3.select(".traffic-model-title").append('span')
        .classed("rule-set-random", true)
        .text(`Rule ${ruleSetNumber}`);

    const update = selection => {
        const row = selection.selectAll("#traffic-model").data(rowA, d => {
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

        // O(n)
        currentRow.forEach(cell => {
            // O(n)
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

    let spacing = document.getElementsByClassName("traffic-model-spacing")[0];

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
            if (generation === maxGeneration) clearInterval(timeInterval);
        }, 30);
    }

    spacing.addEventListener("mouseover", mouseOver, false);
    spacing.addEventListener("mouseout", mouseOut, false);
    spacing.addEventListener("click", restart, false);
});
