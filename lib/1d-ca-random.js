document.addEventListener("DOMContentLoaded", () => {
    const cellWidth = 5;
    const cellHeight = 5;
    const rows = 80;
    const cols = 131;
    const initialSize = 70;
    const genTime = 0.1;
    const maxGeneration = 65;

    const ruleSetGen = num => {
        let setArray = num.toString(2).split("");
        while (8 > setArray.length) {
            setArray.unshift("0");
        }
        return setArray.reverse().map(x => parseInt(x));
    };

    // let ruleSetNumber = 107;
    // let ruleSetNumber = 110;
    // let ruleSetNumber = 158;
    let ruleSetNumber = 155;
    let rowA = new Set();
    let nextRow;
    let generation = 0;

    let ruleSetArray = ruleSetGen(ruleSetNumber);

    const generateRandomInitial = (n) => {
        for (let i = 0; i < n; i++) rowA.add((Math.floor(Math.random() * 131)));
        // for (let i = 0; i < n; i++) rowA.add((Math.floor(Math.random() * 131)));
    }

    generateRandomInitial(initialSize);

    let svg = d3.select("#one-dimensional-ca-random")
        .attr("width", cellWidth * cols)
        .attr("height", cellHeight * rows);

    d3.select(".one-dimensional-ca-random-title").append('span')
        .classed("rule-set-random", true)
        .text(`Rule ${ruleSetNumber}`);

    const update = selection => {
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
            .style("fill", 'black');
    };

    const rules = (set) => {
        rowA = new Set(rowA);
        set = set.map(number => {
            if (rowA.has(number)) {
                return 1;
            } else {
                return 0;
            }
        });
        let binaryForm = set[0].toString() + set[1].toString() + set[2].toString();
        return ruleSetArray[parseInt(binaryForm, 2)];
    };

    const generate = () => {
        nextRow = new Set();

        // O(n)
        rowA.forEach(cell => {
            // O(n)
            [-1, 0, 1].forEach(i => {
                let current = cell + i;
                if (rules([current - 1, current, current + 1]) === 1) {
                    nextRow.add(current);
                }
            });
        });

        generation += 1;
        return Array.from(nextRow);
    };

    if (generation === 0) {
        svg.call(update);
    }

    let timeInterval = setInterval(() => {
        rowA = generate();
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
        rowA = new Set();
        generateRandomInitial(initialSize);
        ruleSetNumber = Math.floor(Math.random() * 255);
        ruleSetArray = ruleSetGen(ruleSetNumber);
        d3.select(".rule-set-random").text(`Rule ${ruleSetNumber}`)
        generation = 0;

        svg.call(update);

        timeInterval = setInterval(() => {
            rowA = generate();
            svg.call(update);
            if (generation === maxGeneration) clearInterval(timeInterval);
        }, 30);
    }

    spacing.addEventListener("mouseover", mouseOver, false);
    spacing.addEventListener("mouseout", mouseOut, false);
    spacing.addEventListener("click", restart, false);
});
