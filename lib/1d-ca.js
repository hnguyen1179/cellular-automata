document.addEventListener('DOMContentLoaded', () => {
    const cellWidth = 10;
    const cellHeight = 10;
    const rows = 100;
    const cols = 100;
    const genTime = 0.1;

    // Rule 90
    const ruleSet = [0, 1, 0, 1, 1, 0, 1, 0];
    const history = [];

    let rowA = [[1, 0], [2, 0] ,[3, 0], [4, 0], [5, 0] ,[6, 0], [7, 0] ,[8, 0], [9, 1], [10, 0], [11, 0], [12, 0], [13, 0], [14, 0] ,[15, 0], [16, 0], [17, 0] ,[18, 0]];
    let generation = 0;

    let svg = d3.select("#one-dimensional-ca")
        .attr("width", cellWidth * cols)
        .attr("height", cellHeight * rows);


    const update = (selection, data) => {
        const row = selection.selectAll("rect").data(data, d => { });

        row.enter()
            .append("rect")
            .attr("x", d => d[0] * 10)
            .attr("y", generation * 10 + cellHeight)
            .attr("width", cellWidth)
            .attr("height", cellHeight)
            .style("fill", "rgba(150, 150, 150, 0.6")
            .transition()
            .duration(genTime * 1000)
            .style("fill", d => {
                if (d[1] === 0) {
                    return "rgba(255, 255, 255, 0)";
                } else {
                    return "black";
                }
            })
            .transition()
                .duration(genTime * 450)
    }

    const rules = (left, middle, right) => {
        let binaryForm = left.toString() + middle.toString() + right.toString();
        return ruleSet[parseInt(binaryForm, 2)];
    }

    const generate = (currentRow) => {
        let nextRow = [];

        for (let i = 0; i < currentRow.length; i++) {
            let left = currentRow[i - 1];
            if (left) left = left[1] 
            let middle = currentRow[i][1];
            let right = currentRow[i + 1];
            if (right) right = right[1]

            if (currentRow[i - 1] === undefined) { left = 0 };
            if (right === undefined) { right = 0 };
            nextRow.push([i + 1, rules(left, middle, right)]);
        }

        history.push(currentRow)
        generation += 1; 

        return nextRow;
    }
    
    svg.call(update, rowA);
    
    const spacing = document.getElementsByClassName('one-dimensional-ca-spacing')[0];

    let timeInterval = setInterval(() => {        
        rowA = generate(rowA)
        svg.call(update, rowA);

        if (generation === 50) clearInterval(timeInterval);
    }, 200);
})  
