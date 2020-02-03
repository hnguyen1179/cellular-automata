document.addEventListener('DOMContentLoaded', () => {
    const cellWidth = 15;
    const cellHeight = 15;
    const rows = 100;
    const cols = 100;
    const genTime = 0.1;

    // Rule 90
    const ruleSet = [0, 1, 0, 1, 1, 0, 1, 0];
    const history = [];

    let rowA = [30];
    let generation = 0;

    let svg = d3.select("#one-dimensional-ca")
        .attr("width", cellWidth * cols)
        .attr("height", cellHeight * rows);


    const update = (selection, data) => {
        const row = selection.selectAll("rect").data(data, d => {});

        row.enter()
              .append("rect")
              .attr("x", d => d * cellWidth)
              .attr("y", generation * cellHeight)
              .attr("width", cellWidth)
              .attr("height", cellHeight)
              .style("fill", "rgba(0, 0, 0, .6")
    }

    const rules = (set, currentRow) => {
        set = set.map(number => {
            if (currentRow.includes(number)) {
                return 1
            } else {
                return 0
            }
        })
        let binaryForm = set[0].toString() + set[1].toString() + set[2].toString();
        return ruleSet[parseInt(binaryForm, 2)];
    }

    const generate = (currentRow) => {
        let nextRow = [];

        currentRow.forEach(cell => {
            [-1, 0, 1].forEach(i => {
                let current = cell + i;
                if (rules([current-1, current, current+1], currentRow) === 1) {
                    nextRow.push(current);
                }
            })
        })        
        generation += 1; 
        return nextRow;
    }
    
    svg.call(update, rowA);
    
    const spacing = document.getElementsByClassName('one-dimensional-ca-spacing')[0];

    let timeInterval = setInterval(() => {        
        console.log(`next generation ${generation}`)
        rowA = generate(rowA)
        svg.call(update, rowA);

        if (generation === 10) clearInterval(timeInterval);
    }, 100);
})  
