function makeChart(data) {
    const svgWidth = 800,
        svgHeight = 800;
    const margin = {
        top: 40,
        right: 40,
        bottom: 50,
        left: 60
    };
    const width = svgWidth - margin.left - margin.right;
    const height = svgHeight - margin.top - margin.bottom;

    const canvas = d3.select(".GGScatter")
        .attr("width", svgWidth)
        .attr("height", svgHeight);

    const plotArea = canvas.append("g")
        .attr("transform", `translate(${margin.left},${margin.top})`);

    // Scales
    const x = d3.scaleLinear()
        .domain([0, d3.max(data, d => d.Emissions) + 5])
        .range([0, width]);

    const y = d3.scaleLinear()
        .domain([0, d3.max(data, d => d.UrbanRate) + 5])
        .range([height, 0]);
    const c = d3.scaleOrdinal()
        .domain(data.map(d => d.Entity))
        .range(d3.schemeCategory10);
    const r = d3.scaleSqrt()
        .domain([0, d3.max(data, d => d.Emissions)])
        .range([5, 30]); // Adjust min and max radius values as needed
    // Axes
    plotArea.append("g")
        .attr("transform", `translate(0, ${height})`)
        .call(d3.axisBottom(x));

    plotArea.append("g")
        .call(d3.axisLeft(y));

    // Axis Labels
    canvas.append("text")
        .attr("x", svgWidth / 2)
        .attr("y", svgHeight - 10)
        .attr("text-anchor", "middle")
        .style("font-size", "12px")
        .text("Avg. Proportion Urbanized");

    canvas.append("text")
        .attr("transform", "rotate(-90)")
        .attr("x", -svgHeight / 2)
        .attr("y", 15)
        .attr("text-anchor", "middle")
        .style("font-size", "12px")
        .text("Avg. Per capita greenhouse gas emissions in CO₂ equivalents");

    // Dots
    const scatter = plotArea.selectAll("circle")
        .data(data)
        .enter().append("circle")
        .attr("fill-opacity", 0)
        .attr("stroke-width", "1px")
        .attr("stroke", d => c(d.Entity))
        .attr("r", d => r(d.Emissions))
        .attr("cx", d => x(d.UrbanRate))
        .attr("cy", d => y(d.Emissions));

    // Tooltip
    scatter.append("title")
        .text(d => `${d.Entity}
  Emissions: ${d3.format(".2f")(d.Emissions)} t CO₂e
  Urban Rate: ${d3.format(".2f")(d.UrbanRate)}%`);

    // Linear regression: Emissions ~ UrbanRate
    const xMean = d3.mean(data, d => d.UrbanRate);
    const yMean = d3.mean(data, d => d.Emissions);

    const slope = d3.sum(data, d => (d.UrbanRate - xMean) * (d.Emissions - yMean)) /
        d3.sum(data, d => Math.pow(d.UrbanRate - xMean, 2));
    const intercept = yMean - slope * xMean;

    const ssTotal = d3.sum(data, d => Math.pow(d.Emissions - yMean, 2));
    const ssRes = d3.sum(data, d => Math.pow(d.Emissions - (slope * d.UrbanRate + intercept), 2));
    const rSquared = 1 - (ssRes / ssTotal);

    // p-value calculation (requires jStat)
    const n = data.length;
    const xVar = d3.variance(data.map(d => d.UrbanRate));
    const standardError = Math.sqrt(ssRes / (n - 2)) / Math.sqrt(xVar);
    const tStat = slope / standardError;
    let pValue = "N/A";
    if (typeof jStat !== "undefined") {
        pValue = 2 * (1 - jStat.studentt.cdf(Math.abs(tStat), n - 2));
    }

    // Draw trend line
    const xVals = d3.extent(data, d => d.UrbanRate);
    const trendLine = d3.line()
        .x(d => x(d))
        .y(d => y(intercept + slope * d));


    plotArea.append("path")
        .datum(xVals)
        .attr("fill", "none")
        .attr("stroke", "#555")
        .attr("stroke-width", 1)
        .attr("d", trendLine)
        .text(
            `y = ${slope.toFixed(2)}x + ${intercept.toFixed(2)}\nR² = ${rSquared.toFixed(3)}\nP = ${typeof pValue === "number" ? pValue.toExponential(2) : pValue}`
        );
}

// Load CSV and convert values
d3.csv("Datasets/combines.csv").then(function (rawData) {
    // Convert columns to numbers first
    rawData.forEach(d => {
        d.Emissions = +d["Per capita greenhouse gas emissions in CO2"];
        d.UrbanRate = +d["urban population (% of total population)"];
    });

    // Group by Entity and calculate average Emissions and UrbanRate
    const grouped = d3.rollups(
        rawData,
        v => ({
            Emissions: d3.mean(v, d => d.Emissions),
            UrbanRate: d3.mean(v, d => d.UrbanRate)
        }),
        d => d.Entity
    );

    // Transform back into an array of objects
    const averagedData = grouped.map(([Entity, values]) => ({
        Entity: Entity,
        Emissions: values.Emissions,
        UrbanRate: values.UrbanRate
    }));

    document.addEventListener('DOMContentLoaded', () => {
        makeChart(averagedData);
    });
    // Now call the chart with the averaged data

});