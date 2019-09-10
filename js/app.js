// Chart is wrapped inside a function for
// automatically resizing the chart when the window size changes
function makeResponsive() {

    // if the SVG area isn't empty when the browser loads,
    // remove it and replace it with a resized version of the chart
    var svgArea = d3.select("body").select("svg");
  
    // clear svg if not empty
    if (!svgArea.empty()) {
      svgArea.remove();
    }
  
    // SVG wrapper dimensions are determined by the current width and
    // height of the browser window
    var svgWidth = (window.innerWidth)- ((window.innerWidth)/6);
    var svgHeight = (window.innerHeight)- ((window.innerHeight)/2.5);
  
    var margin = {
      top: 50,
      bottom: 100,
      right: 50,
      left: 100
    };
  
    var height = svgHeight - margin.top - margin.bottom;
    var width = svgWidth - margin.left - margin.right;
  
    // Append SVG element
    var svg = d3
      .select("#scatter")
      .append("svg")
      .attr("height", svgHeight)
      .attr("width", svgWidth);
  
    // Append group element
    var chartGroup = svg.append("g")
      .attr("transform", `translate(${margin.left}, ${margin.top})`);
  
    // Read CSV
    // d3.csv("../data/data.csv").then(function(error, surveyData) {
    //   if (error) throw error;
    d3.csv("../data/data.csv").then(function(surveyData) {
        console.log(surveyData);
      
      // Format the data
      surveyData.forEach(function(data) {
        data.poverty = +data.poverty;
        data.obesity = +data.obesity;
        data.age = +data.age;
        data.income = +data.income;
        data.smokes = +data.smokes;
        data.healthcare = +data.healthcare;
        // data.abbr = data.abbr;
      });

      let xInput = "Poverty:";
      let yInput = "Healthcare:";

      // Create scales
      var xScale = d3.scaleLinear()
        .domain(d3.extent(surveyData, d => d.poverty))
        // .domain([0, d3.max(surveyData, d => d.poverty)])
        .range([0, width]);

      var yScale = d3.scaleLinear()
        .domain(d3.extent(surveyData, d => d.healthcare))
        // .domain([0, d3.max(surveyData, d => d.obesity)])
        .range([height, 0]);

      // Create axes
      var xAxis = d3.axisBottom(xScale);
      var yAxis = d3.axisLeft(yScale);

      // Append axes
      chartGroup.append("g")
        .attr("transform", `translate(0, ${height})`)
        .call(xAxis);

      chartGroup.append("g")
        .call(yAxis);
      
      // Create y-axis Title

      let yTitle1 = chartGroup.append("text")
      .attr("class", "axisTitle")
      .attr("transform","rotate(-90)")
      .attr("x", 0 - (height / 1.4))
      .attr("y", 0 - (margin.left-34))
      .attr("dy", "1em")
      .text("Lack Healthcare (%)")
      .classed("text",true);

      // let yTitle2 = chartGroup.append("text")
      // .attr("class", "axisTitle")
      // .attr("transform","rotate(-90)")
      // .attr("x", 0 - (height / 1.4))
      // .attr("y", 0 - (margin.left-16))
      // .attr("dy", "1em")
      // .text("Smoke (%)")
      // .classed("text",true);

      // let yTitle3 = chartGroup.append("text")
      // .attr("class", "axisTitle")
      // .attr("transform", "rotate(-90)")
      // .attr("y", 0 - margin.left)
      // .attr("x", 0 - (height / 1.2))
      // .attr("dy", "1em")
      // .text("Lack Healthcare (%)")
      // .classed("text",true);

      // Create x-axis Titles
      let xTitle1 = chartGroup.append("text")
      .attr("class", "axisTitle")
      .attr("transform", `translate(${width / 3}, ${height + 30})`)
      .attr("dy", "1em")
      .text("Living In Poverty (%)")
      .classed("text",true);

      // let xTitle2 = chartGroup.append("text")
      // .attr("class", "axisTitle")
      // .attr("transform", `translate(${(width / 3)+20}, ${height + 50})`)
      // .attr("dy", "1em")
      // .text("Age (Median)")
      // .classed("text",true);

      // let xTitle3 = chartGroup.append("text")
      // .attr("class", "axisTitle")
      // .attr("transform", `translate(${(width / 3)-30}, ${height + 70})`)
      // .attr("dy", "1em")
      // .text("Household Income (Median)")
      // .classed("text",true);

      // "Click" event listener to hightlight selected comparrisons for x-axis
      xTitle1.on('click',function(d){
        d3.select(this)
        // .attr("color","blue")
        // .attr("font-weight", "bold");
        // xTitle2.attr("font-weight","normal");
        // xTitle3.attr("font-weight","normal");
        // xInput = "Poverty: ";
      })

      // xTitle2.on('click',function(d){
      //   d3.select(this)
      //   // .attr("color","blue")
      //   .attr("font-weight", "bold");
      //   xTitle1.attr("font-weight","normal");
      //   xTitle3.attr("font-weight","normal");
      //   xInput = "Age: ";
      // })

      // xTitle3.on('click',function(d){
      //   d3.select(this)
      //   // .attr("color","blue")
      //   .attr("font-weight", "bold");
      //   xTitle2.attr("font-weight","normal");
      //   xTitle1.attr("font-weight","normal");
      //   xInput = "Income: ";
      // })

      // "Click" event listener to hightlight selected comparrisons for y-axis
      yTitle1.on('click',function(d){
        d3.select(this)
        // .attr("color","blue")
        // .attr("font-weight", "bold");
        // yTitle2.attr("font-weight","normal");
        // yTitle3.attr("font-weight","normal");
        // yInput = "Obesity: ";
      })

      // yTitle2.on('click',function(d){
      //   d3.select(this)
      //   // .attr("color","blue")
      //   .attr("font-weight", "bold");
      //   yTitle1.attr("font-weight","normal");
      //   yTitle3.attr("font-weight","normal");
      //   yInput = "Smoke: ";
      // })

      // yTitle3.on('click',function(d){
      //   d3.select(this)
      //   // .attr("color","blue")
      //   .attr("font-weight", "bold");
      //   yTitle2.attr("font-weight","normal");
      //   yTitle1.attr("font-weight","normal");
      //   yInput = "Healthcare: ";
      // })

      // Append circles
      var circlesGroup = chartGroup.selectAll("circle")
        .data(surveyData)
        .enter()
        .append("circle")
        .attr("cx", d => xScale(d.poverty))
        .attr("cy", d => yScale(d.healthcare))
        .attr("r", "10")
        .attr("fill", "#47576b")
        .attr("stroke-width", "1")
        .attr("stroke", "white")
        .classed("circle",true);

      // Append text - for some reason this was only printing some of the states abbrs
      var circleLabels = chartGroup.selectAll("circle text")
        .data(surveyData)
        .enter()
        .append("text")
        .attr("x", d => (xScale(d.poverty)-5))
        .attr("y", d => (yScale(d.healthcare)+3))
        .text(d => d.abbr)
        .attr("font-size","0.5em")
        .attr("fill","white")
        .classed("text",true);

      // Initialize Tooltip
      var toolTip = d3.tip()
        .attr("class", "tooltip")
        .offset([80, -70])
        .html(function(d) {
          return (`<strong>${d.state} <strong><hr> ${xInput} ${d.poverty}<br> ${yInput} ${d.healthcare}`);
        });

      // Tooltip in chartGroup.
      chartGroup.call(toolTip);

      // "Mouseover" event listener to display tooltip
      circlesGroup.on("mouseover", function(d) {
        d3.select(this).attr("stroke","#47576b")
        .attr("fill","#66998c")
        .attr("r",(10*2))
        toolTip.show(d, this);
      })

      // "Mouseout" event listener to hide tooltip
        .on("mouseout", function(d) {
          d3.select(this).attr("stroke","white")
          .attr("fill","#47576b")
          .attr("r",10);
          toolTip.hide(d);
        });
    });
  }
  
  // When the browser loads, makeResponsive() is called.
  makeResponsive();
  
  // When the browser window is resized, makeResponsive() is called.
  d3.select(window).on("resize", makeResponsive);
