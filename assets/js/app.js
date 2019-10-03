// @TODO: YOUR CODE HERE!
function makeGraph() {

    // if the SVG area isn't empty when the browser loads, remove it
    // and replace it with a resized version of the chart
    const svgArea = d3.select("body").select("svg");

    if (!svgArea.empty()) {
        svgArea.remove();
    };

    // SVG wrapper dimensions are determined by the current width
    // and height of the browser window.
    const svgWidth = 900;
    const svgHeight = 650;

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

    const chartGroup = svg.append("g")
        .attr("transform", `translate(${margin.left}, ${margin.top})`);

    let chosenXAxis = "income";
    let xValue = d => d[chosenXAxis];

    let chosenYAxis = "healthcare";
    let yValue = d => d[chosenYAxis];

    const labels = d => d.abbr;

    // function used for updating x-scale var upon click on axis label
    const xScale = data => {
        const xLinearScale = d3.scaleLinear()
            .domain([d3.min(data, xValue) - 1, d3.max(data, xValue) + 1])
            .range([0, chartWidth])
            .nice();

        return xLinearScale;
    }

    // function used for updating y-scale var upon click on axis label
    const yScale = data => {
        const yLinearScale = d3.scaleLinear()
            .domain([d3.min(data, yValue) - 1, d3.max(data, yValue) + 1])
            .range([chartHeight, 0])
            .nice();

        return yLinearScale;
    }

    const renderXAxis = (newXScale, xAxis) => {

        let bottomAxis = d3.axisBottom(newXScale)
            .tickSize(-chartHeight)
            .tickPadding(10);

        if (chosenXAxis === "income") {
            bottomAxis
                .tickFormat(d3.format(".2s"))
        }

        xAxis.transition()
            .duration(1000)
            .call(bottomAxis);

        return xAxis;
    }

    const renderYAxis = (newYScale, yAxis) => {
        const leftAxis = d3.axisLeft(newYScale)
            .tickSize(-chartWidth)
            .tickPadding(10);;

        yAxis.transition()
            .duration(1000)
            .call(leftAxis);

        return yAxis;
    }

    // function used for updating circles group with a transition to
    // new circles
    function renderCirclesX(circlesGroup, newXScale) {

        circlesGroup.transition()
            .duration(1000)
            .attr("cx", d => newXScale(xValue(d)));

        return circlesGroup;
    }

    function renderStatesX(statesGroup, newXScale) {

        statesGroup.transition()
            .duration(1000)
            .attr("x", d => newXScale(xValue(d)));

        return statesGroup;
    };

    function renderCirclesY(circlesGroup, newYScale) {

        circlesGroup.transition()
            .duration(1000)
            .attr("cy", d => newYScale(yValue(d)));

        return circlesGroup;
    };

    function renderStatesY(statesGroup, newYScale) {

        statesGroup.transition()
            .duration(1000)
            .attr("y", d => newYScale(yValue(d)));

        return statesGroup;
    };

    // function used for updating circles group with new tooltip
    function updateToolTip(chosenXAxis, chosenYAxis, statesGroup) {

        let xLabel = (chosenXAxis === "income") ? "Median Income" :
            (chosenXAxis === "poverty") ? "In Poverty:" : "Median Age";

        let yLabel = (chosenYAxis === "healthcare") ? "Lacks Healthcare:" :
            (chosenYAxis === "smokes") ? "Smokes:" : "Obese:";

        let toolTip = d3.tip()
            .attr("class", "tooltip")
            .offset([80, -60])
            .html(function (d) {
                let html = (chosenXAxis === "poverty") ? `<strong>${d["state"]}</strong><br>${yLabel} ${d[chosenYAxis]}%<br>${xLabel} ${d[chosenXAxis]}%` :
                    (chosenXAxis === "income") ? `<strong>${d["state"]}</strong><br>${yLabel} ${d[chosenYAxis]}%<br>${xLabel} $${d[chosenXAxis].toLocaleString()}` :
                        `<strong>${d["state"]}</strong><br>${yLabel} ${d[chosenYAxis]}%<br>${xLabel} ${d[chosenXAxis]}`

                return html
            });

        statesGroup.call(toolTip);

        statesGroup
            .on("mouseover", data => {
                toolTip.show(data)
                    .duration(1000);
            })
            // onmouseout event
            .on("mouseout", function (data, index) {
                toolTip.hide(data);
            });

        return statesGroup;
    };

    d3.csv("../assets/data/data.csv").then((data, err) => {
        if (err) throw err;

        console.log(data);

        data.forEach(d => {
            d.age = +d.age;
            d.healthcare = +d.healthcare;
            d.income = +d.income;
            d.obesity = +d.obesity;
            d.poverty = +d.poverty;
            d.smokes = +d.smokes;
        });

        let xLinearScale = xScale(data);
        let yLinearScale = yScale(data);

        let bottomAxis = d3.axisBottom(xLinearScale)
            .tickSize(-chartHeight)
            .tickFormat(d3.format(".2s"))
            .tickPadding(10);
        let leftAxis = d3.axisLeft(yLinearScale)
            .tickSize(-chartWidth)
            .tickPadding(10);;

        // append x axis
        let xAxis = chartGroup.append("g")
            .classed("x-axis", true)
            .attr("transform", `translate(0, ${chartHeight})`)
            .call(bottomAxis);

        // append y axis
        let yAxis = chartGroup.append("g")
            .classed("y-axis", true)
            .call(leftAxis);

        let circlesGroup = chartGroup.selectAll("circle")
            .data(data)
            .enter()
            .append('circle')
            .attr("cx", d => xLinearScale(xValue(d)))
            .attr("cy", d => yLinearScale(yValue(d)))
            .attr("r", 9.5);

        let statesGroup = chartGroup.selectAll("div").data(data)
            .enter().append("text")
            .attr("x", d => xLinearScale(xValue(d)))
            .attr("y", d => yLinearScale(yValue(d)))
            .attr("text-anchor", "middle")
            .attr("dominant-baseline", "central")
            .text(d => labels(d))
            .attr("font-size", "10px")
            .attr("font-weight", "bold")
            .style("fill", "#ffffff");

        const xAxisLabelsG = chartGroup.append("g")
            .attr("transform", `translate(${chartWidth / 2}, ${chartHeight + 20})`);

        var incomeLabel = xAxisLabelsG.append("text")
            .attr("x", 0)
            .attr("y", 20)
            .attr("value", "income") // value to grab for event listener
            .classed("active", true)
            .text("Household Income (Median)");

        var povertyLabel = xAxisLabelsG.append("text")
            .attr("x", 0)
            .attr("y", 40)
            .attr("value", "poverty") // value to grab for event listener
            .classed("inactive", true)
            .text("In Poverty (%)");

        var ageLabel = xAxisLabelsG.append("text")
            .attr("x", 0)
            .attr("y", 60)
            .attr("value", "age") // value to grab for event listener
            .classed("inactive", true)
            .text("Age (Median)");

        const yAxisLabelsG = chartGroup.append("g")
            .attr("transform", "rotate(-90)")


        var healthcareLabel = yAxisLabelsG.append("text")
            .attr("y", 0 - margin.left + 65)
            .attr("x", 0 - (chartHeight / 2))
            .attr("value", "healthcare") // value to grab for event listener
            .classed("active", true)
            .text("Lacks Healthcare (%)");

        var smokesLabel = yAxisLabelsG.append("text")
            .attr("y", 0 - margin.left + 45)
            .attr("x", 0 - (chartHeight / 2))
            .attr("value", "smokes") // value to grab for event listener
            .classed("inactive", true)
            .text("Smokes (%)");

        var obeseLabel = yAxisLabelsG.append("text")
            .attr("y", 0 - margin.left + 25)
            .attr("x", 0 - (chartHeight / 2))
            .attr("value", "obesity") // value to grab for event listener
            .classed("inactive", true)
            .text("Obese (%)");

        statesGroup = updateToolTip(chosenXAxis, chosenYAxis, statesGroup);

        // x axis labels event listener
        xAxisLabelsG.selectAll("text")
            .on("click", function () {
                // get value of selection
                var value = d3.select(this).attr("value");

                if (value !== chosenXAxis) {
                    chosenXAxis = value;

                    console.log(chosenXAxis);

                    xLinearScale = xScale(data);

                    // updates x axis with transition
                    xAxis = renderXAxis(xLinearScale, xAxis);
                    circlesGroup = renderCirclesX(circlesGroup, xLinearScale);
                    statesGroup = renderStatesX(statesGroup, xLinearScale);
                    statesGroup = updateToolTip(chosenXAxis, chosenYAxis, statesGroup);

                    if (chosenXAxis === "income") {
                        incomeLabel
                            .classed("active", true)
                            .classed("inactive", false);
                        povertyLabel
                            .classed("active", false)
                            .classed("inactive", true);
                        ageLabel
                            .classed("active", false)
                            .classed("inactive", true);
                    }
                    else if (chosenXAxis === "poverty") {
                        incomeLabel
                            .classed("active", false)
                            .classed("inactive", true);
                        povertyLabel
                            .classed("active", true)
                            .classed("inactive", false);
                        ageLabel
                            .classed("active", false)
                            .classed("inactive", true);
                    }
                    else {
                        incomeLabel
                            .classed("active", false)
                            .classed("inactive", true);
                        povertyLabel
                            .classed("active", false)
                            .classed("inactive", true);
                        ageLabel
                            .classed("active", true)
                            .classed("inactive", false);
                    }
                }
            })

        yAxisLabelsG.selectAll("text")
            .on("click", function () {
                // get value of selection
                var value = d3.select(this).attr("value");

                if (value !== chosenYAxis) {
                    chosenYAxis = value;

                    console.log(chosenYAxis);

                    yLinearScale = yScale(data);

                    // updates x axis with transition
                    yAxis = renderYAxis(yLinearScale, yAxis);
                    circlesGroup = renderCirclesY(circlesGroup, yLinearScale);
                    statesGroup = renderStatesY(statesGroup, yLinearScale);
                    statesGroup = updateToolTip(chosenXAxis, chosenYAxis, statesGroup);


                    if (chosenYAxis === "healthcare") {
                        healthcareLabel
                            .classed("active", true)
                            .classed("inactive", false);
                        smokesLabel
                            .classed("active", false)
                            .classed("inactive", true);
                        obeseLabel
                            .classed("active", false)
                            .classed("inactive", true);
                    }
                    else if (chosenYAxis === "smokes") {
                        healthcareLabel
                            .classed("active", false)
                            .classed("inactive", true);
                        smokesLabel
                            .classed("active", true)
                            .classed("inactive", false);
                        obeseLabel
                            .classed("active", false)
                            .classed("inactive", true);
                    }
                    else {
                        healthcareLabel
                            .classed("active", false)
                            .classed("inactive", true);
                        smokesLabel
                            .classed("active", false)
                            .classed("inactive", true);
                        obeseLabel
                            .classed("active", true)
                            .classed("inactive", false);
                    }
                }
            })
    })
}

makeGraph()

d3.select(window).on("resize", makeGraph);