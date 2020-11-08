var radius = 9;

var margin = {top: radius * 2.5 + 10, left: 90, bottom: radius, right: 30},
width = +jz.str.keepNumber(d3.select(".swarm").style("width")) - margin.left - margin.right,
height = 600 - margin.top - margin.bottom,
svg = d3.select(".swarm").append("svg")
    .attr("width", width + margin.left + margin.right)
    .attr("height", height + margin.top + margin.bottom)
    .append("g")
    .attr("transform", "translate(" + margin.left + ", " + margin.top + ")");

var x = d3.scaleTime().rangeRound([0, width]);

var y = d3.scaleBand().rangeRound([0, height]);

var curr_month = "";

var x_axis = d3.axisBottom(x)
            .tickSizeOuter(0)
            .ticks(d3.timeDay.every(1))
            .tickFormat(function(d){ 
                var s = d.toString().split(" ");
                var m = s[1];
                if (m !== curr_month){
                    curr_month = m;
                    return m + "."; 
                } else {
                    return null;
                }
            });

var y_axis_left = d3.axisLeft(y).tickSize(0)

var y_axis_right = d3.axisRight(y).tickSizeOuter(0).tickSizeInner(-width);

var v = d3.voronoi().extent([[0, 0], [width, height]]).x(function(d) { return d.x; }).y(function(d) { return d.y; });

var parseDate = function(x){
    var s = x.split("-");
    var d = [s[2], s[0], s[1]].join("-");
    return new Date(d);
}

// defs for images
var defs = d3.select("svg").append("defs");

// append the tip
var tip = d3.select("#wrapper").append("div").attr("class", "tip");

d3.json("data.json", function(error, data){
    if (error) throw error;

    data = data.include;
    data.forEach(function(d){
        d.accuse_date = parseDate(d.accuse_date);
        d.slug = jz.str.toSlugCase(d.name);
        return d;
    });

    x.domain([new Date(2017, 9, 1), data[data.length - 1].accuse_date]);

    var industries = jz.arr.sortBy(jz.arr.pivot(data, "industry"), "count", "desc");
    y.domain(industries.map(function(d){ return d.value; }));

    x_axis.tickSizeInner(-height + y.bandwidth() / 2 - 3)

    svg.append("g")
        .attr("class", "axis y left")
        .call(y_axis_left)
        .selectAll(".tick text")
        .attr("dx", -radius);

    svg.append("g")
        .attr("class", "axis y right")
        .attr("transform", "translate(" + width + ", 0)")
        .call(y_axis_right.tickFormat(function(d){ return industries.filter(function(c){ return c.value == d })[0].count; }))
        .selectAll(".tick text")
        .attr("dx", radius);

    svg.append("g")
        .attr("class", "axis x")
        .attr("transform", "translate(0, " + height + ")")
        .call(x_axis)
        .selectAll(".tick line")
        .style("display", function(d){
            var s = d.toString().split(" ");
            var m = s[1];
            if (m !== curr_month){
                curr_month = m;
                return "block"; 
            } else {
                return "none";
            }
        });

    forceSim();

    draw();

    window.addEventListener("resize", function(){ 
        // all of these things need to be updated on resize
        width = +jz.str.keepNumber(d3.select(".swarm").style("width")) - margin.left - margin.right;
        d3.select(".axis.y.right").attr("transform", "translate(" + width + ", 0)").call(y_axis_right.tickSizeInner(-width));
        x.rangeRound([0, width]);
        forceSim();
        d3.select(".x.axis").call(x_axis);
        draw(); 
    });

    function draw(){

        // circle
        var circle = svg.selectAll(".circle")
            .data(v.polygons(data), function(d){ return d.data.slug; });

        circle.enter().append("circle")
            .attr("class", function(d) { return "circle circle-" + d.data.slug; })
            .attr("r", radius)
            .attr("fill", function(d){ return colorHold[Math.floor(Math.random()*colorHold.length)]; })
            .style("fill", function(d){ return colorHold[Math.floor(Math.random()*colorHold.length)]; })
            .merge(circle)
                .attr("cx", function(d) { return d ? d.data.x : null; })
                .attr("cy", function(d) { return d ? d.data.y : null; });

        // // hover
        // var hover_circle = svg.selectAll(".circle-hover")
        //     .data(v.polygons(data), function(d){ return d.data.slug; });

        // hover_circle.enter().append("circle")
        //     .attr("class", function(d) { return "circle-hover circle-hover-" + d.data.slug; })
        //     .attr("r", radius)
        // .merge(hover_circle)
        //     .attr("cx", function(d) { return d ? d.data.x : null; })
        //     .attr("cy", function(d) { return d ? d.data.y : null; });

        // svg.selectAll(".circle-hover").on("mouseover", function(d){
        //     tip.html(d.data.name);

        //     d3.select(".circle-" + d.data.slug).attr("r", radius * 2.5).moveToFront();
        //     d3.select(".circle-bg-" + d.data.slug).style("fill-opacity", 0).attr("r", radius * 2.5).style("stroke-width", 3).moveToFront();

        //     var tip_width = +jz.str.keepNumber(tip.style("width"));
        //     var tip_height = +jz.str.keepNumber(tip.style("height"));

        //     var circle_node = d3.select(this).node().getBoundingClientRect();
        //     var circle_left = circle_node.left;
        //     var circle_top = circle_node.top;

        //     var tip_left = circle_left - tip_width / 2 + radius;
        //     var tip_top = circle_top - radius * 1.5 - tip_height;

        //     tip.style("left", tip_left + "px").style("top", tip_top + "px");

        // }).on("mouseout", function(d){
        //     d3.select(".circle-" + d.data.slug).attr("r", radius);
        //     d3.select(".circle-bg-" + d.data.slug).style("fill-opacity", .3).attr("r", radius).style("stroke-width", 1);
        //     tip.style("left", "-1000px").style("top", "-1000px");

        // });

    }

    function forceSim(){
        var simulation = d3.forceSimulation(data)
            .force("y", d3.forceY(function(d){ return y(d.industry) + y.bandwidth() / 2; }).strength(1))
            .force("x", d3.forceX(function(d){ return x(d.accuse_date); }).strength(1))
            .force("collide", d3.forceCollide(radius + 1))
            .stop();

        for (var i = 0; i < 200; ++i) simulation.tick();
    }

});


/* sankey and barbar */
function sankeyMe(){
    var data = new google.visualization.DataTable();
    var formatter = new google.visualization.NumberFormat({pattern:'$###.## bn'}); 
    var colors = ['#a6cee3', '#b2df8a', '#fb9a99', '#fdbf6f',
                '#cab2d6', '#ffff99', '#1f78b4', '#33a02c'];
    data.addColumn('string', 'From');
    data.addColumn('string', 'To');
    data.addColumn('number', 'Weight');
    
    data.addRows([
    [ 'Entertainment', 'HHD', 9 ],
    [ 'Entertainment', 'HMD', 10 ],
    [ 'Entertainment', 'SAR', 11 ],
    [ 'Entertainment', 'PC', 7 ],
    [ 'Media', 'HHD', 9 ],
    [ 'Media', 'HMD', 10 ],
    [ 'Media', 'SAR', 11 ],
    [ 'Media', 'PC', 7 ],
    [ 'Politics', 'HHD', 9 ],
    [ 'Politics', 'HMD', 10 ],
    [ 'Politics', 'SAR', 11 ],
    [ 'Politics', 'PC', 7 ],
    [ 'Business', 'HHD', 9 ],
    [ 'Business', 'HMD', 10 ],
    [ 'Business', 'SAR', 11 ],
    [ 'Business', 'PC', 7 ],
    [ 'Music', 'HHD', 9 ],
    [ 'Music', 'HMD', 10 ],
    [ 'Music', 'SAR', 11 ],
    [ 'Music', 'PC', 7 ],
    [ 'Sports', 'HHD', 9 ],
    [ 'Sports', 'HMD', 10 ],
    [ 'Sports', 'SAR', 11 ],
    [ 'Sports', 'PC', 7 ],
    [ 'Tech', 'HHD', 9 ],
    [ 'Tech', 'HMD', 10 ],
    [ 'Tech', 'SAR', 11 ],
    [ 'Tech', 'PC', 7 ],
    ]);
        
    // Sets chart options.
    var options = {
        tooltip: {
            isHtml: true,
            textStyle: {fontName: 'Times-Roman', color: '#000', fontSize:12 }, 
            showColorCode: true,
        },
        sankey: {
            link: {
                colorMode: 'gradient',
                colors: colors
            },
            node: {
                pattern: '$### m',
                interactivity: true
            }
        },
        animation: {
            duration: 1000,
            easing: 'out'
        },
    };
    
    var sankeySide = new google.visualization.Sankey(document.getElementById('sankey'));
    
    sankeySide.draw(data, options);
}

function barbar(){
    var data = [
        {"salesperson":"Bob","sales":55},
        {"salesperson":"Robin","sales":25},
        {"salesperson":"Anne","sales":5},
        {"salesperson":"Pop","sales":7},
    ];
    data.forEach(function(d) {d.sales = +d.sales;});
    var heights = 60;
    var widths = 60;

    for(var i = 0; i < 7; i++){
        var mmtop = i>0?20:0;
        var svg = d3.select("#barbar").append("svg")
                .attr("width", 60)
                .attr("height", heights)
                .attr("style", "margin-top:"+mmtop+"px")
                .append("g").attr("transform", "translate(0,0)");
        var y = d3.scaleBand().range([heights, 0]).padding(0.1);
        var x = d3.scaleLinear().range([0, widths]);
        x.domain([0, d3.max(data, function(d){ return d.sales; })])
        y.domain(data.map(function(d) { return d.salesperson; }));

        svg.selectAll(".bar")
            .data(data)
            .enter().append("rect")
                .attr("class", "bar")
                .attr("fill", function(d,i) { return colorHold[Math.floor(Math.random()*colorHold.length)]})
                .attr("width", function(d) {return x(d.sales); } )
                .attr("y", function(d) { return y(d.salesperson); })
                .attr("height", y.bandwidth());

        svg.append("g").attr("transform", "translate(0," + heights + ")").call(d3.axisBottom(x));

        svg.append("g").call(d3.axisLeft(y));

                  
        svg.append("rect")
            .attr("x", widths-1)
            .attr("y", 0)
            .attr("width", 1)
            .attr("height", heights);
    }
    
    google.load('visualization', '1.1', {packages: ['sankey', 'corechart', 'bar']});
    google.setOnLoadCallback(sankeyMe);
}


barbar();