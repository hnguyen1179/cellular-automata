document.addEventListener("DOMContentLoaded", () => {
    const cellWidth = 5;
    const cellHeight = 5;
    const rows = 80;
    const cols = 131;
    const genTime = 0.1;

    const ruleSetGen = num => {
        let setArray = num.toString(2).split("");
        while (8 > setArray.length) {
            setArray.unshift("0");
        }
        return setArray.reverse().map(x => parseInt(x));
    };
    
    const ruleSetArrayA = [
      18,
      19,
      22,
      23,
      26,
      27,
      28,
      29,
      30,
      31,
      54,
      55,
      60,
      62,
      63,
      70,
      82,
      86,
      87,
      90,
      93,
      94,
      95,
      102,
      103,
      110,
      114,
      115,
      118,
      119,
      123,
      124,
      125,
      147,
      151,
      155,
      158,
      159,
      178,
      179,
      183,
      186,
      189,
      190,
      191,
      207,
      210,
      211,
      215,
      216,
      219,
      220,
      221,
      223,
      231,
      238,
      242,
      246,
      247,
      250,
      251,
      252,
      253
    ];
    let ruleSetNumber = 90;
    let rowA = new Set([65]);
    let generation = 0;

    let svg = d3.select("#one-dimensional-ca")
        .attr("width", cellWidth * cols)
        .attr("height", cellHeight * rows);
    
    d3.select(".one-dimensional-ca-title").append('div')
        .classed("rule-set", true)
        .text(`Rule ${ruleSetNumber}`);

    const update = selection => {
        var linearScale = d3.scaleLinear()
            .domain([0, 55, 70])
            .range(["rgba(0, 0, 0, 1)", "rgba(0, 0, 0, 1)", "rgba(0, 0, 0, 1)"]);

        const row = selection.selectAll("#one-dimensional-ca").data(rowA, d => {
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
            .duration(genTime * 1000)
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

        if (generation === 65) clearInterval(timeInterval);
    }, 30);

    let spacing = document.getElementsByClassName("one-dimensional-ca-spacing")[0];

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
        rowA = new Set([65]);
        ruleSetNumber = Math.floor(Math.random() * 255);
        ruleSetNumber = ruleSetArrayA[Math.floor(Math.random() * ruleSetArrayA.length)];
        d3.select(".rule-set").text(`Rule ${ruleSetNumber}`)
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
            if (generation === 65) clearInterval(timeInterval);
        }, 30);
    }

    spacing.addEventListener("mouseover", mouseOver, false);
    spacing.addEventListener("mouseout", mouseOut, false);
    spacing.addEventListener("click", restart, false);
});
