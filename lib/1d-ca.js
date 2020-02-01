document.addEventListener('DOMContentLoaded', () => {
    const cellWidth = 10;
    const cellHeight = 10;
    const rows = 100;
    const cols = 100;
    const genTime = 0.1;

    // Rule 90
    const ruleSet = [0, 1, 0, 1, 1, 0, 1, 0];
    const rowA = [0, 0 ,0, 0, 0 ,0, 0, 0 ,0, 1, 0, 0, 0, 0, 0 ,0, 0, 0 ,0];
    const rowB = [];

    
    const rules = (left, middle, right) => {
        let binaryForm = left.toString() + middle.toString() + right.toString();
        return ruleSet[parseInt(binaryForm, 2)];
    }

    const generate = (currentRow, nextRow) => {
        for (let i = 0; i < currentRow.length; i++) {
            let left = currentRow[i - 1];
            let middle = currentRow[i];
            let right = currentRow[i + 1];

            if (left === undefined) { left = 0 };
            if (right === undefined) { right = 0 };

            nextRow.push(rules(left, middle, right));
        }

        this.generation += 1; 
        return [currentRow, nextRow];
    }

    let svg = d3.select("#one-dimensional-ca")
        .attr('width', cellWidth * cols)
        attr('height', cellHeight * rows);

    
})  
