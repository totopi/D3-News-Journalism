// D3 Scatterplot Assignment

// Students:
// =========
// Follow your written instructions and create a scatter plot with D3.js.

// Set up parameters for the chart and svg space

// SVG params
let svgWidth = 860;
let svgHeight = 660;

let margin = {
    top: 50,
    right: 50,
    bottom: 50,
    left: 50
};
// Chart params
let height = svgHeight - margin.top - margin.bottom;
let width = svgWidth - margin.left - margin.right;

// Append the svg to our htmls
let svg = d3.select("body")
    .append("svg")
    .attr("width", svgWidth)
    .attr("height", svgHeight)

// Make a happy little chartGroup for our little circles to stick to
let chartGroup = svg.append("g")
    .attr("transform", `translate(${margin.left}, ${margin.top})`);

// Read in the data
d3.csv("data/data.csv", function (error, povertyData) {
    // Error handling
    if (error) throw error;

    // Parse data and cast as numbers
    povertyData.forEach(function(data) {
        data.difficultyDressingBathing = +data.difficultyDressingBathing;
        data.belowPoverty = +data.belowPoverty;
    });

    // Create scale functions for the axes
    let xScale = d3.scaleLinear()
        .domain([7, d3.max(povertyData, d => d.belowPoverty)])
        .range([0, width]);
    
    let yScale = d3.scaleLinear()
        .domain([1, d3.max(povertyData, d => d.difficultyDressingBathing)])
        .range([height, 0]);
    
    // Put the state abbreviations in the circles
    let stateLabels = chartGroup.selectAll("text")
        .data(povertyData)
        .enter()
        .append("text")
        .attr("x", d => xScale(d.belowPoverty))
        .attr("y", d => yScale(d.difficultyDressingBathing) + 5)
        .attr("text-anchor", "middle")
        .attr("class", "circleText")
        .text(function(d) {return d.abbr;})

    // Create axis functions
    let xAxis = d3.axisBottom(xScale).ticks(7);
    let yAxis = d3.axisLeft(yScale).ticks(7);

    // Append axes to chart
    chartGroup.append("g")
        .attr("transform", `translate(0, ${height})`)
        .call(xAxis);
    chartGroup.append("g")
        .call(yAxis);

    // Create circles
    let circlesGroup = chartGroup.selectAll("circle")
        .data(povertyData)
        .enter()
        .append("circle")
        .attr("cx", d => xScale(d.belowPoverty))
        .attr("cy", d => yScale(d.difficultyDressingBathing))
        .attr("r", "15")
        .attr("fill", "purple")
        .attr("stroke-width", "1")
        .attr("stroke", "black")
        .attr("opacity", "0.6")    

    // Tool tips
    let toolTip = d3.tip()
        .attr('class', 'toolTip')
        .offset([80, -60])
        .html(d => `<strong>${d.state}<br />Poverty: ${d.belowPoverty}%<br />Difficulty Dressing/Bathing: ${d.difficultyDressingBathing}%</strong>`);
    
    chartGroup.call(toolTip);

    circlesGroup.on('mouseover', function(data) {
        toolTip.show(data);
    })
        .on('mouseout', function(data) {
            toolTip.hide(data);
        });
    
    // Axes labels
    chartGroup.append("text")
        .attr("transform", "rotate(-90)")
        .attr("y", 0 - margin.left + 15)
        .attr("x", 0 - (height / 2))
        .attr("dy", "1em")
        .attr("class", "axisText")
        .text("% With Difficulty Getting Dressed or Bathing");

    chartGroup.append("text")
        .attr("transform", `translate(${width/2 - 40}, ${height + margin.top - 10})`)
        .attr("class", "axisText")
        .text("% Under Poverty Line");
})
