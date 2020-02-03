document.addEventListener('DOMContentLoaded', () => {
    const cellWidth = 10;
    const cellHeight = 10;
    const rows = 100;
    const cols = 100;
    const genTime = 0.1;

    // Rule 90
    // const ruleSet = [0, 1, 0, 1, 1, 0, 1, 0];
    // const ruleSet = [0, 1, 1, 1, 1, 0, 0, 0];

    const ruleSet = (num) => {
        let setArray = (num).toString(2).split("");
        while (8 > setArray.length) {
            setArray.unshift('0');
        }
        return setArray.reverse().map(x => parseInt(x));
    }

    let rowA = [30];
    let generation = 0;

    let svg = d3.select("#one-dimensional-ca")
        .attr("width", cellWidth * cols)
        .attr("height", cellHeight * rows);


    const update = (selection) => {
        console.log(rowA);
        const row = selection.selectAll("#one-dimensional-ca").data(rowA, d => {return d[0]});

        row.enter()
              .append("rect")
              .attr("x", d => {
                  return d * cellWidth
               })
              .attr("y", generation * cellHeight)
              .attr("width", cellWidth)
              .attr("height", cellHeight)
              .style("fill", "rgba(150, 150, 150, .3")
              .transition()
                        .duration(genTime * 2000)
                        .style("fill", "rgba(0, 0, 0, .6");
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
        debugger;
        return ruleSet(90)[parseInt(binaryForm, 2)];
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
    
    let timeInterval = setInterval(() => {        
        rowA = generate(rowA)
        svg.call(update);

        if (generation === 25) clearInterval(timeInterval);
    }, 25);
})  
