// @TODO: YOUR CODE HERE!

//auto resize
function makeResponsive() {

    //clear SVG area upon resize
    var svgArea = d3.select("#scatter").select("svg");

    if (!svgArea.empty()) {
      svgArea.remove();
    }
    //define svg parameters
    var svgWidth = 950;
    var svgHeight = 600;

    //margin spacing
    var margins ={
        top: 30,
        bottom: 60,
        left: 30,
        right: 60
    };

    //dimensions
    var width = svgWidth-margins.left-margins.right;
    var height = svgHeight-margins.top-margins.bottom;

    //adding in svg element
    var svg = d3.select("#scatter")
        .append("svg")
        .classed("chart", true)
        .attr("height", svgHeight)
        .attr("width", svgWidth);
        //.attr("viewBox", `0 0 100 100`)
    //create group, append to element
    var group = svg.append("g")
        .attr("transform", `translate(${margins.left}, ${margins.top})`);

    //IMport the .csv file
    d3.csv("assets/data/data.csv").then(function(statData) {
        console.log(statData);

        //loop through data and cast the stats as numbers
        statData.forEach(function(data) {
            data.healthcare = +data.healthcare; 
            data.obesity = +data.obesity;
            
        });
    
        //add scale and create axis for functions
        var yScale = d3.scaleLinear()
            .domain([0, 30])
            .range([height, 0]);
        var xScale = d3.scaleLinear ()
            .domain([20, 40])
            .range([0, width]);

        var xAxis = d3.axisBottom(xScale);
        var yAxis = d3.axisLeft(yScale);
        //append elements to group
        group.append("g")
            .attr("transform", `translate(0, ${height})`)
            .call(xAxis);
        group.append("g")
            .call(yAxis);
        //create SVG circle
        var circlesGroup = group.selectAll(".stateCircle")
            .data(statData)
            .enter()
            .append("circle")
            .classed("stateCircle", true)
            .attr("cx", d => xScale(d.obesity))
            .attr("cy", d => yScale(d.healthcare))
            .attr("r", "9")
            .attr("fill", "blue");
        
        //Add labels for obesity and healthcare
        var stateLabel = group.selectAll(".stateText")
            .data(statData)
            .enter()
            .append("text")
            .classed("stateText", true)
            .attr("x", d => xScale(d.obesity))
            .attr("y", d => yScale(d.healthcare))
            .text(d => d.abbr);
            

        //Setup tooltip rules
        var toolTip = d3.tip()
            .attr("class", "d3-tip")
            .offset([60, -60])
            .html(function (d) {
                return (`State: ${d.state}<br>% No Healthcare: ${d.healthcare}<br>% Obese: ${d.obesity}`);
            });
        
        //add tooltip to group
        group.call(toolTip);

        //create the event listener
        circlesGroup.on("mouseover", function(data) {
            toolTip.show(data, this);
        })
            .on("mouseout", function(data, index) {
                toolTip.hide(data);
            });

        //Create x-axis label
        group.append("text")
            .attr("transform", `translate(${width/2}, ${height+margins.top+10})`)
            .classed("aText", true)
            .text("% of Population Obese by State");

        //create y-axis label
        group.append("text")
            .attr("transform", `rotate(-90)`)
            .attr("y", -30)
            .attr("x", 0-(height/2))
            .attr("class", "aText")
            .text("% of Population Without Health Insurance by State")

    });

}

// When the browser loads, makeResponsive() is called.
makeResponsive();

// When the browser window is resized, makeResponsive() is called.
d3.select(window).on("resize", makeResponsive);