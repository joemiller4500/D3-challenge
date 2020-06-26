var svgWidth = 960;
var svgHeight = 500;

var margin = {
  top: 20,
  right: 40,
  bottom: 80,
  left: 100
};

var width = svgWidth - margin.left - margin.right;
var height = svgHeight - margin.top - margin.bottom;

// Create an SVG wrapper, append an SVG group that will hold our chart,
// and shift the latter by left and top margins.
var svg = d3
  .select("#scatter")
  .append("svg")
  .attr("width", svgWidth)
  .attr("height", svgHeight);

// Append an SVG group
var chartGroup = svg.append("g")
  .attr("transform", `translate(${margin.left}, ${margin.top})`);

// Initial Params
var chosenXAxis = "poverty";
var chosenYAxis = "healthcare";

// function used for updating x-scale var upon click on axis label
function xScale(stateData, chosenXAxis) {
    // create scales
    var xLinearScale = d3.scaleLinear()
      .domain([d3.min(stateData, d => d[chosenXAxis]) * 0.8,
        d3.max(stateData, d => d[chosenXAxis]) * 1.2
      ])
      .range([width/10, width]);
  
    return xLinearScale;
  
}

function yScale(stateData, chosenYAxis) {
    // create scales
    var yLinearScale = d3.scaleLinear()
      .domain([d3.min(stateData, d => d[chosenYAxis]) * 0.8,
        d3.max(stateData, d => d[chosenYAxis]) * 1.2
      ])
      .range([0, height]);
  
    return yLinearScale;
  
}

// function used for updating xAxis var upon click on axis label
function renderXAxis(newXScale, xAxis) {
    var bottomAxis = d3.axisBottom(newXScale);

    xAxis.transition()
        .duration(1000)
        .call(bottomAxis);


    return xAxis;
}

function renderYAxis(newYScale, yAxis) {
    var leftAxis = d3.axisLeft(newYScale);
    
    yAxis.transition()
        .duration(1000)
        .call(leftAxis);
    
    return yAxis;
}

// function used for updating circles group with a transition to
// new circles
function renderCircles(circlesGroup, newXScale, chosenXAxis, newYScale, chosenYAxis) {

    circlesGroup.transition()
        .duration(1000)
        .attr("cx", d => newXScale(d[chosenXAxis]))
        .attr("cy", d => newYScale(d[chosenYAxis]));

    return circlesGroup;
}

// function used for updating circles group with new tooltip
// function updateToolTip(chosenXAxis, chosenYAxis, circlesGroup) {

//     var xLabel;

//     if (chosenXAxis === "in_poverty") {
//         xLabel = "% in Poverty:";
//     }
//     else if (chosenXAxis === "age") {
//         xLabel = "Average Age:";
//     }
//     else {
//         xLabel = "Average Income:";
//     }

//     var yLabel;

//     if (chosenYAxis === "lacks_healthcare") {
//         yLabel = "% That Lack Healthcare:";
//     }
//     else if (chosenYAxis === "obesity") {
//         yLabel = "% Obese:";
//     }
//     else {
//         yLabel = "% That Smoke:";
//     }


//     // var toolTip = d3.tip()
//     //     .attr("class", "tooltip")
//     //     .offset([80, -60])
//     //     .html(function(d) {
//     //     return (`${d.state}<br>${xLabel} ${d[chosenXAxis]}<hr>${yLabel} ${d[chosenYAxis]}`);
//     //     });

//     // circlesGroup.call(toolTip);

//     // circlesGroup.on("mouseover", function(data) {
//     //     toolTip.show(data);
//     // })
//     //     // onmouseout event
//     //     .on("mouseout", function(data, index) {
//     //     toolTip.hide(data);
//     //     });

//     return circlesGroup;
// }

d3.csv("assets/data/data.csv").then(function(stateData, err) {
    if (err) throw err;
    // parse data
    stateData.forEach(function(data) {
      data.poverty = +data.poverty;
      data.age = +data.age;
      data.income = +data.income;
      data.healthcare = +data.healthcare;
      data.obesity = +data.obesity;
      data.smokes = +data.smokes;
    });
  
    // xLinearScale and yLinearScale functions above csv import
    var xLinearScale = xScale(stateData, chosenXAxis);
    var yLinearScale = yScale(stateData, chosenYAxis);
  
    // Create initial axis functions
    var bottomAxis = d3.axisBottom(xLinearScale);
    var leftAxis = d3.axisLeft(yLinearScale);
  
    // append x axis
    var xAxis = chartGroup.append("g")
      .classed("x-axis", true)
      .attr("transform", `translate(${width/18}, ${height})`)
      .call(bottomAxis);
  
    // append x axis
    var yAxis = chartGroup.append("g")
      .classed("y-axis", true)
      .attr("transform", `translate(${width/8}, 0)`)
      .call(leftAxis);
  
    // append initial circles
    console.log(chosenYAxis)
    var circlesGroup = chartGroup.selectAll("circle")
      .data(stateData)
      .enter()
      .append("circle")
      .attr("cx", d => xLinearScale(d[chosenXAxis]))
      .attr("cy", d => yLinearScale(d[chosenYAxis]))
      .attr("r", 6)
      .attr("fill", "blue")
      .attr("opacity", ".65");
  
    // Create group for three x-axis labels
    var xLabelsGroup = chartGroup.append("g")
      .attr("transform", `translate(${width / 2}, ${height + 20})`);
  
    var povertyLabel = xLabelsGroup.append("text")
      .attr("x", 0)
      .attr("y", 20)
      .attr("value", "poverty") // value to grab for event listener
      .classed("active", true)
      .text("% in Poverty");
  
    var ageLabel = xLabelsGroup.append("text")
      .attr("x", 0)
      .attr("y", 40)
      .attr("value", "age") // value to grab for event listener
      .classed("inactive", true)
      .text("Average Age");

    var incomeLabel = xLabelsGroup.append("text")
      .attr("x", 0)
      .attr("y", 60)
      .attr("value", "income") // value to grab for event listener
      .classed("inactive", true)
      .text("Average income");

    var yLabelsGroup = chartGroup.append("g")
        .attr("transform", `translate($0, ${height / 2})`);

    var healthcareLabel = yLabelsGroup.append("text")
        .attr("transform", "rotate(-90)")
        .attr("x", -(height/2))
        .attr("y", (width/12)-20)
        .attr("value", "healthcare") // value to grab for event listener
        .classed("active", true)
        .text("% Lacking Healthcare");
    
    var obesityLabel = yLabelsGroup.append("text")
        .attr("transform", "rotate(-90)")
        .attr("x", -(height/2))
        .attr("y", (width/12)-40)
        .attr("value", "obesity") // value to grab for event listener
        .classed("inactive", true)
        .text("% Obese");

    var smokerLabel = yLabelsGroup.append("text")
        .attr("transform", "rotate(-90)")
        .attr("x", -(height/2))
        .attr("y", (width/12)-60)
        .attr("value", "smokes") // value to grab for event listener
        .classed("inactive", true)
        .text("% Smokers");
  
    // append y axis
    chartGroup.append("text")
      .attr("transform", "rotate(-90)")
      .attr("y", 0 - margin.left)
      .attr("x", 0 - (height / 2))
      .attr("dy", "1em")
      .classed("axis-text", true);
  
    // updateToolTip function above csv import
    // var circlesGroup = updateToolTip(chosenXAxis, chosenYAxis, circlesGroup);
  
    // x axis labels event listener
    xLabelsGroup.selectAll("text")
      .on("click", function() {
        // get value of selection
        var value = d3.select(this).attr("value");
        console.log(value);
        if (value !== chosenXAxis) {
  
          // replaces chosenXAxis with value
          chosenXAxis = value;
  
          // console.log(chosenXAxis)
  
          // functions here found above csv import
          // updates x scale for new data
          xLinearScale = xScale(stateData, chosenXAxis);
  
          // updates x axis with transition
          xAxis = renderXAxis(xLinearScale, xAxis);
  
          // updates circles with new x values
          circlesGroup = renderCircles(circlesGroup, xLinearScale, chosenXAxis, yLinearScale, chosenYAxis);
  
          // updates tooltips with new info
        //   circlesGroup = updateToolTip(chosenXAxis, chosenYAxis, circlesGroup);
  
          // changes classes to change bold text
          if (chosenXAxis == "poverty") {
            console.log("hello");
            povertyLabel
                .classed("active", true)
                .classed("inactive", false);
            ageLabel
                .classed("active", false)
                .classed("inactive", true);
            incomeLabel
                .classed("active", false)
                .classed("inactive", true);
          }
          else if (chosenXAxis === "age") {
            ageLabel
                .classed("active", true)
                .classed("inactive", false);
            povertyLabel
                .classed("active", false)
                .classed("inactive", true);
            incomeLabel
                .classed("active", false)
                .classed("inactive", true);
          }
          else {
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
        }
      });

    // y axis labels event listener
    yLabelsGroup.selectAll("text")
      .on("click", function() {
        // get value of selection
        var value = d3.select(this).attr("value");
        if (value !== chosenYAxis) {
  
          // replaces chosenXAxis with value
          chosenYAxis = value;
  
          // console.log(chosenXAxis)
  
          // functions here found above csv import
          // updates x scale for new data
          yLinearScale = yScale(stateData, chosenYAxis);
  
          // updates x axis with transition
          yAxis = renderYAxis(yLinearScale, yAxis);
  
          // updates circles with new x values
          circlesGroup = renderCircles(circlesGroup, xLinearScale, chosenXAxis, yLinearScale, chosenYAxis);
  
          // updates tooltips with new info
        //   circlesGroup = updateToolTip(chosenXAxis, chosenYAxis, circlesGroup);
  
          // changes classes to change bold text
          if (chosenYAxis === "healthcare") {
            healthcareLabel
                .classed("active", true)
                .classed("inactive", false);
            obesityLabel
                .classed("active", false)
                .classed("inactive", true);
            smokerLabel
                .classed("active", false)
                .classed("inactive", true);
          }
          else if (chosenYAxis === "obesity") {
            obesityLabel
                .classed("active", true)
                .classed("inactive", false);
            healthcareLabel
                .classed("active", false)
                .classed("inactive", true);
            smokerLabel
                .classed("active", false)
                .classed("inactive", true);
          }
          else {
            smokerLabel
                .classed("active", true)
                .classed("inactive", false);
            obesityLabel
                .classed("active", false)
                .classed("inactive", true);
            healthcareLabel
                .classed("active", false)
                .classed("inactive", true);
          }
        }
      });
    }).catch(function(error) {
        console.log(error);

});