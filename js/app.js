// The code for the chart is wrapped inside a function that
// automatically resizes the chart
function makeResponsive() {

    // if the SVG area isn't empty when the browser loads,
    // remove it and replace it with a resized version of the chart
    var svgArea = d3.select("body").select("svg");
  
    // clear svg is not empty
    if (!svgArea.empty()) {
      svgArea.remove();
    }
  
    // SVG wrapper dimensions are determined by the current width and
    // height of the browser window.
    var svgWidth = (window.innerWidth)/2;
    var svgHeight = (window.innerHeight)/2;
  
    var margin = {
      top: 50,
      bottom: 50,
      right: 50,
      left: 50
    };
  
    var height = svgHeight - margin.top - margin.bottom;
    var width = svgWidth - margin.left - margin.right;
  
    // Append SVG element
    var svg = d3
      .select(".scatter")
      .append("svg")
      .attr("height", svgHeight)
      .attr("width", svgWidth);
  
    // Append group element
    var chartGroup = svg.append("g")
      .attr("transform", `translate(${margin.left}, ${margin.top})`);
  
    // Read CSV
    d3.csv("../data/data.csv", function(error,surveyData) {
      if (error) throw error;
  
      //Format the data
      surveyData.forEach(function(data) {
        data.poverty = +data.poverty;
        data.obesity = +data.obesity;
        data.age = +data.age;
        data.income = +data.income;
        data.smokes = +data.smokes;
        data.healthcare = +data.healthcare;
        data.abbr = data.abbr;
      });

      // create scales
      var xScale = d3.scaleLinear()
        .domain(d3.extent(surveyData, d => d.poverty))
        .range([0, width]);

      var yScale = d3.scaleLinear()
        .domain([0, d3.max(surveyData, d => d.obesity)])
        .range([height, 0]);

      // create axes
      var xAxis = d3.axisBottom(xScale);
      var yAxis = d3.axisLeft(yScale);

      // append axes
      chartGroup.append("g")
        .attr("transform", `translate(0, ${height})`)
        .call(xAxis);

      chartGroup.append("g")
        .call(yAxis);

      // append circles
      var circlesGroup = chartGroup.selectAll("circle")
        .data(surveyData)
        .enter()
        .append("circle")
        .attr("cx", d => xScale(d.poverty))
        .attr("cy", d => yScale(d.obesity))
        .attr("r", "10")
        .attr("fill", "#47576b")
        .attr("stroke-width", "1")
        .attr("stroke", "white");
      
      // append text
      var circleLabels = chartGroup.selectAll("text")
        .data(surveyData)
        .enter()
        .append("text")
        .attr("x", d => xScale(d.poverty))
        .attr("y", d => yScale(d.obesity))
        .text(d => d.abbr)
        .attr("font-size","9em")
        .attr("fill","white");

      // Step 1: Initialize Tooltip
      var toolTip = d3.tip()
        .attr("class", "tooltip")
        .offset([80, -60])
        .html(function(d) {
          return (`<strong>${d.state}<strong><hr>${d.poverty}<br>${d.obesity}`);
        });

      // Step 2: Create the tooltip in chartGroup.
      chartGroup.call(toolTip);

      // Step 3: Create "mouseover" event listener to display tooltip
      circlesGroup.on("mouseover", function(d) {
        d3.select(this).attr("stroke","black");
        toolTip.show(d, this);
      })
      // Step 4: Create "mouseout" event listener to hide tooltip
        .on("mouseout", function(d) {
          d3.select(this).attr("stroke","white");
          toolTip.hide(d);
        });
    });
  }
  
  // When the browser loads, makeResponsive() is called.
  makeResponsive();
  
  // When the browser window is resized, makeResponsive() is called.
  d3.select(window).on("resize", makeResponsive);
