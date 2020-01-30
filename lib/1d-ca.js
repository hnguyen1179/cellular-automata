class OneDimensionalCA {
    constructor(cells) {
        this.cells = cells;
        this.generation = 0;
        
        // This is the Rule 90 (XOR rule set)
        this.ruleSet = [0, 1, 0, 1, 1, 0, 1, 0];
    }

    rules(left, middle, right) {
        let binaryForm = left.toString() + middle.toString() + right.toString();
        return this.ruleSet[parseInt(binaryForm, 2)];
    }

    generate() {
        let nextGeneration = [];

        for (let i = 0; i < this.cells.length; i++) {
            let left = this.cells[i - 1];
            let middle = this.cells[i];
            let right = this.cells[i + 1];

            if (left === undefined) { left = 0 };
            if (right === undefined) { right = 0 };

            nextGeneration.push(this.rules(left, middle, right));
        }

        this.cells = nextGeneration;
        this.generation += 1; 
    }
}