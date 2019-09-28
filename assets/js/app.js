// @TODO: YOUR CODE HERE!
const svgWidth = 760;
const svgHeight = 500;

// Define the chart's margins as an object
const margin = {
    top: 60,
    right: 60,
    bottom: 100,
    left: 100
};

// Define dimensions of the chart area
const chartWidth = svgWidth - margin.left - margin.right;
const chartHeight = svgHeight - margin.top - margin.bottom;

const svg = d3.select("#scatter").append("svg")
    .attr("height", svgHeight)
    .attr("width", svgWidth)
    .style("background", "#efecea");

const render = (data, xAxisV, yAxisV) => {

    console.log(data)

    const title = "Test";
    const xValue = d => d[xAxisV];
    const xAxisPoverty = "In Poverty (%)";
    const xAxisAge = "Age (Median)";
    const xAxisIncome = "Household Income (Median)";
    const yValue = d => d[yAxisV];
    const yAxisObese = "Obese (%)";
    const yAxisHealthcare = "Lacks Healthcare (%)";
    const yAxisSmokes = "Smokes(%)";
    const labels = d => d.abbr;


    const xScale = d3.scaleLinear()
        .domain([d3.min(data, xValue) - 1, d3.max(data, xValue) + 1])
        .range([0, chartWidth])
        .nice();

    const yScale = d3.scaleLinear()
        .domain([d3.min(data, yValue) - 1, d3.max(data, yValue) + 1])
        .range([chartHeight, 0])
        .nice();

    var chartGroup = svg.append("g")
        .attr("transform", `translate(${margin.left}, ${margin.top})`);

    var xAxis = d3.axisBottom(xScale)
        .tickSize(-chartHeight)
        .tickFormat(d3.format(".2s"))
        .tickPadding(10);
    var yAxis = d3.axisLeft(yScale)
        .tickSize(-chartWidth)
        .tickPadding(10);



    const xAxisG = chartGroup.append("g")
        .classed("axis", true)
        .attr("transform", "translate(0, " + chartHeight + ")")
        .call(xAxis);

    const yAxisG = chartGroup.append("g")
        .classed("axis", true)
        .call(yAxis)

    yAxisG.append('text')
        .attr('class', 'axis-label')
        .attr('y', -margin.left / 1.6 - 20)
        .attr('x', -chartHeight / 2)
        .attr('fill', 'black')
        .attr('transform', `rotate(-90)`)
        .attr('text-anchor', 'middle')
        .text(yAxisObese)
        .on('mouseover', function (d) {
            d3.select(this).style('fill', 'black');
        })
        .on('mouseout', function (d) {
            d3.select(this).style('fill', '#8e8883');
        })

    yAxisG.append('text')
        .attr('class', 'axis-label')
        .attr('y', -margin.left / 1.6)
        .attr('x', -chartHeight / 2)
        .attr('fill', 'black')
        .attr('transform', `rotate(-90)`)
        .attr('text-anchor', 'middle')
        .text(yAxisSmokes)
        .on('mouseover', function (d) {
            d3.select(this).style('fill', 'black');
        })
        .on('mouseout', function (d) {
            d3.select(this).style('fill', '#8e8883');
        })

    yAxisG.append('text')
        .attr('class', 'axis-label')
        .attr('y', -margin.left / 1.6 + 20)
        .attr('x', -chartHeight / 2)
        .attr('fill', 'black')
        .attr('transform', `rotate(-90)`)
        .attr('text-anchor', 'middle')
        .text(yAxisHealthcare)
        .on('mouseover', function (d) {
            d3.select(this).style('fill', 'black');
        })
        .on('mouseout', function (d) {
            d3.select(this).style('fill', '#8e8883');
        })

    xAxisG.append('text')
        .attr('class', 'axis-label')
        .attr('y', margin.bottom / 1.6)
        .attr('x', chartWidth / 2)
        .attr('fill', 'black')
        .attr('text-anchor', 'middle')
        .text(xAxisPoverty)
        .on('mouseover', function (d) {
            d3.select(this).style('fill', 'black');
        })
        .on('mouseout', function (d) {
            d3.select(this).style('fill', '#8e8883');
        })

    xAxisG.append('text')
        .attr('class', 'axis-label')
        .attr('y', margin.bottom / 1.6 + 20)
        .attr('x', chartWidth / 2)
        .attr('fill', 'black')
        .attr('text-anchor', 'middle')
        .text(xAxisAge)
        .on('mouseover', function (d) {
            d3.select(this).style('fill', 'black');
        })
        .on('mouseout', function (d) {
            d3.select(this).style('fill', '#8e8883');
        })

    xAxisG.append('text')
        .attr('class', 'axis-label')
        .attr('y', margin.bottom / 1.6 - 20)
        .attr('x', chartWidth / 2)
        .attr('fill', 'black')
        .attr('text-anchor', 'middle')
        .text(xAxisIncome)
        .on('mouseover', function (d) {
            d3.select(this).style('fill', 'black');
        })
        .on('mouseout', function (d) {
            d3.select(this).style('fill', '#8e8883');
        })

    chartGroup.selectAll("circle").data(data)
        .enter().append('circle')
        .attr("cx", d => xScale(xValue(d)))
        .attr("cy", d => yScale(yValue(d)))
        .attr("r", 8.5)

    chartGroup.selectAll("span").data(data)
        .enter().append("text")
        .attr("x", d => xScale(xValue(d)))
        .attr("y", d => yScale(yValue(d)))
        .attr("text-anchor", "middle")
        .attr("dominant-baseline", "central")
        .text(d => labels(d))
        .attr("font-size", "10px")
        .attr("font-weight", "bold")
        .style("fill", "#ffffff")

    chartGroup.append('text')
        .attr('class', 'title')
        .attr("x", chartWidth / 2)
        .attr("text-anchor", "middle")
        .attr('y', -10)
        .text(title);


}

d3.csv("../assets/data/data.csv").then(data => {

    data.forEach(d => {
        d.age = +d.age;
        d.healthcare = +d.healthcare;
        d.income = +d.income;
        d.obesity = +d.obesity;
        d.poverty = +d.poverty;
        d.smokes = +d.smokes;
    })

    render(data, "income", "healthcare")

    d3.select






    // Append an SVG group element to the SVG area, create the bottom axis inside of it
    // Translate the bottom axis to the bottom of the page



})