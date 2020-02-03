document.addEventListener("DOMContentLoaded", () => {
    let transition = false;
    let trans;
    const cellWidth = 10;
    const cellHeight = 10;
    const rows = 100;
    const cols = 130;
    const genTime = 0.1;
    const pattern = [
        [1, 3],
        [1, 4],
        [2, 3],
        [2, 4],
        [11, 5],
        [11, 6],
        [11, 7],
        [12, 4],
        [12, 8],
        [13, 3],
        [13, 9],
        [14, 3],
        [14, 9],
        [15, 6],
        [16, 4],
        [16, 8],
        [17, 5],
        [17, 6],
        [17, 7],
        [18, 6],
        [21, 3],
        [21, 4],
        [21, 5],
        [22, 3],
        [22, 4],
        [22, 5],
        [23, 2],
        [23, 6],
        [25, 1],
        [25, 2],
        [25, 6],
        [25, 7],
        [35, 3],
        [35, 4],
        [36, 3],
        [36, 4]
    ];

    pattern.forEach(pair => {
        pair[0] = pair[0] + 35;
        pair[1] = pair[1] + 40;
    })

    let svg = d3.select("#broken-glider-gun")
        .attr("width", cellWidth * cols)
        .attr("height", cellHeight * rows);

    function update(selection, data) {
        const cells = selection
            .selectAll("rect")
            .data(data, d => `${d[0]}_${d[1]}`);
        cells
            .exit()
                .style("fill", "rgba(255, 155, 0, .30)")
                .style("opacity", 1)
            .transition()
                .duration(genTime * 1000)
                .style("opacity", 0)
                .on("end", function() {
                    d3.select(this).remove();
                });
        cells
            .enter()
                .append("rect")
                .attr("x", d => d[0] * cellWidth)
                .attr("y", d => d[1] * cellHeight)
                .attr("width", cellWidth)
                .attr("height", cellHeight)
                .style("fill", "rgba(255, 145, 64, .60")
            .transition()
                .duration(genTime * 800)
                .style("fill", "rgba(255, 0, 0, .80");
    }

    const tick = items => {
        const current = {};
        items.forEach(item => {
            current[`${item[0]}_${item[1]}`] = 0;
        });

        const nextGen = [];
        const birthCands = {};
        items.forEach(item => {
            let neighbors = 0;
            [-1, 0, 1].forEach(i => {
                [-1, 0, 1].forEach(j => {
                const key = `${item[0] + i}_${item[1] + j}`;
                if (current.hasOwnProperty(key)) {
                    neighbors += 1;
                } else {
                    if (!birthCands.hasOwnProperty(key)) {
                    birthCands[key] = 0;
                    }
                    birthCands[key] += 1;
                }
                });
            });
            neighbors -= 1;
            if ([2, 3].includes(neighbors)) {
                nextGen.push(item);
            }
        });
        const birth = Object.entries(birthCands)
        .filter(e => e[1] === 3)
        .map(e => e[0].split("_").map(e => parseInt(e)));

        return nextGen.concat(birth);
    };

    let gen = pattern;
    svg.call(update, gen);

    let timeInterval;
    let started = false;
    let hotdog = false;

    let spacing = document.getElementsByClassName("broken-glider-gun-spacing")[0]

    const playPauseHandler = () => {
        if (hotdog) {
            hotdog = false;
            clearInterval(timeInterval);
        } else {
            hotdog = true;
            started = true;
            spacing.style.backgroundColor = 'rgba(0, 0, 0, 0.01)';
            spacing.style.transition = '400ms';
            timeInterval = setInterval(() => {
                gen = tick(gen);
                svg.call(update, gen);
            }, genTime * 500);
        }
    };
 
    const restart = () => {
        clearInterval(timeInterval)
        svg.selectAll('rect').remove();
        gen = pattern;

        svg.call(update, gen);

        hotdog = false;

        timeInterval = setInterval(() => {
            gen = tick(gen);
            svg.call(update, gen);
        }, genTime * 300);
    }

    const brokenGliderGunSVG = document.getElementById("broken-glider-gun");

    const mouseOver = () => {
        transition = false;
        clearTimeout(trans);

        spacing.style.cursor = 'pointer';
        spacing.style.backgroundColor = 'rgba(0, 0, 0, 0.045)';
        spacing.style.transition = '250ms';
        if (started) {
            brokenGliderGunSVG.style.zIndex = '1';
            brokenGliderGunSVG.style.opacity = '1';
            brokenGliderGunSVG.style.transition = 'opacity 2000ms';
        }
    }

    const mouseOut = () => {
        spacing.style.backgroundColor = 'rgba(0, 0, 0, 0.02)';
        spacing.style.transition = '400ms';
        if (started) {
            brokenGliderGunSVG.style.opacity = '0.45';
            brokenGliderGunSVG.style.transition = 'opacity 600ms';

            if (transition === false) {
                trans = setTimeout(() => {
                    brokenGliderGunSVG.style.zIndex = '-9001'
                    transition = false;
                }, 700);
            
                transition = true;
            }
        }
    }

    document
        .getElementsByClassName("broken-glider-gun-spacing")[0]
        .addEventListener("click", playPauseHandler, false);

    document
        .getElementsByClassName("broken-glider-gun-spacing")[0]
        .addEventListener("mouseover", mouseOver, false);
    
    document
        .getElementsByClassName("broken-glider-gun-spacing")[0]
        .addEventListener("mouseout", mouseOut, false);

    document
        .getElementsByClassName("broken-glider-gun-restart")[0]
        .addEventListener("click", restart, false)

    document
        .getElementsByClassName("broken-glider-gun-restart")[0]
        .addEventListener("mouseover", mouseOver, false);

    document
        .getElementsByClassName("broken-glider-gun-restart")[0]
        .addEventListener("mouseout", mouseOut, false);

});
