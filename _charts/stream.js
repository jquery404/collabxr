var streamColor = ['#FEE9CC','#F9C578','#FCD7A1','#F7B34C','#F48566','#F8AA8F','#F05B40','#FCD3C1', '#3D3740', '#898389', '#5EB6D8', '#AFD7EA'];
streamColor.reverse();

var svg = d3.select(".streamgraph")
  .append("svg")
    .attr("width", width)
    .attr("height", height*2)
  .append("g")
    .attr("transform",
          "translate(" + margin.left + "," + margin.top + ")");

function initStreamgraph(){
  d3.csv("data/streamgraph.csv", function(data) {

      var keys = data.columns.slice(1)

      // Add X axis
      var x = d3.scaleLinear()
        .domain(d3.extent(data, function(d) { return d.year; }))
        .range([ 0, 900 ]);
      svg.append("g")
        .attr("transform", "translate(0," + height + ")")
        .call(d3.axisBottom(x).ticks(5));
    
      // Add Y axis
      var y = d3.scaleLinear()
        .domain([-100000, 100000])
        .range([ height, 0 ]);
      svg.append("g")
        .call(d3.axisLeft(y));
    
      // color palette
      var color = d3.scaleOrdinal()
        .domain(keys)
        .range(streamColor)
    
      //stack the data?
      var stackedData = d3.stack()
        .offset(d3.stackOffsetSilhouette)
        .keys(keys)
        (data)
    
      // Show the areas
      svg
        .selectAll("mylayers")
        .data(stackedData)
        .enter()
        .append("path")
          .style("fill", function(d) { return color(d.key); })
          .attr("d", d3.area()
            .x(function(d, i) { return x(d.data.year); })
            .y0(function(d) { return y(d[0]); })
            .y1(function(d) { return y(d[1]); })
        )
  })
}
