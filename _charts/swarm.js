const radius = 5;

var svgMargin = {top: radius * 2.5 + 10, left: 90, bottom: 12, right: 30};
var swarm_width = +jz.str.keepNumber(d3.select(".swarm").style("width")) - svgMargin.left - svgMargin.right;
var sank_width = +jz.str.keepNumber(d3.select("#sankey").style("width"));
var barbar_width = +jz.str.keepNumber(d3.select("#barbar").style("width"));
var swarm_height = 600 - svgMargin.top - svgMargin.bottom;
var barbar_height = 40;

var svg = d3.select(".swarm").append("svg")
        .attr("width", swarm_width + svgMargin.left + svgMargin.right)
        .attr("height", swarm_height + svgMargin.top + svgMargin.bottom)
        .append("g").attr("transform", "translate(" + svgMargin.left + ", " + svgMargin.top + ")");
    
var svg_sank = d3.select("#sankey").append("svg")
            .attr("width", sank_width + svgMargin.left + svgMargin.right)
            .attr("height", swarm_height + svgMargin.top + svgMargin.bottom)
            .append("g") .attr("transform", "translate(0,0)");

for(var i = 0; i < 10; i++){
    var margin_top = i>0?18:30;
    var svg_barbar = d3.select("#barbar").append("svg")
            .attr("width", barbar_width)
            .attr("height", barbar_height)
            .attr("style", "margin-top:"+margin_top+"px")
            .append("g").attr("transform", "translate(0,0)");
    var y = d3.scaleBand().range([barbar_height, 0]).padding(0.1);
    var x = d3.scaleLinear().range([0, barbar_width]);
    x.domain([0, d3.max(barbarData[i], ((d) => { return d.sales }))])
    y.domain(barbarData[i].map((d) => { return d.salesperson; }));

    svg_barbar.selectAll(".bar")
        .data(barbarData[i])
        .enter().append("rect")
            .attr("class", "bar")
            .attr("fill", (d,j) => { return setBarColor(i) })
            .attr("width", (d) => {return x(d.sales); } )
            .attr("y", (d) => { return y(d.salesperson); })
            .attr("height", y.bandwidth());

    svg_barbar.append("g").attr("transform", "translate(0," + barbar_height + ")").call(d3.axisBottom(x));

    svg_barbar.append("g").call(d3.axisLeft(y));
  
    svg_barbar.append("rect").attr("x", barbar_width-1).attr("y", 0).attr("width", 1).attr("height", barbar_height);
}

d3.sankey = function() {
    var sankey = {},
        nodeWidth = 24,
        nodePadding = 8,
        size = [1, 1],
        nodes = [],
        links = [];
    
    sankey.nodeWidth = function(_) {
        if (!arguments.length) return nodeWidth;
        nodeWidth = +_;
        return sankey;
    };
    
    sankey.nodePadding = function(_) {
        if (!arguments.length) return nodePadding;
        nodePadding = +_;
        return sankey;
    };
    
    sankey.nodes = function(_) {
        if (!arguments.length) return nodes;
        nodes = _;
        return sankey;
    };
    
    sankey.links = function(_) {
        if (!arguments.length) return links;
        links = _;
        return sankey;
    };
    
    sankey.size = function(_) {
        if (!arguments.length) return size;
        size = _;
        return sankey;
    };
    
    sankey.layout = function(iterations) {
        computeNodeLinks();
        computeNodeValues();
        computeNodeBreadths();
        computeNodeDepths(iterations);
        computeLinkDepths();
        return sankey;
    };
    
    sankey.relayout = function() {
        computeLinkDepths();
        return sankey;
    };
    
    sankey.link = function() {
        var curvature = .5;
    
        function link(d) {
        var x0 = d.source.x + d.source.dx,
            x1 = d.target.x,
            xi = d3.interpolateNumber(x0, x1),
            x2 = xi(curvature),
            x3 = xi(1 - curvature),
            y0 = d.source.y + d.sy + d.dy / 2,
            y1 = d.target.y + d.ty + d.dy / 2;
        return "M" + x0 + "," + y0
                + "C" + x2 + "," + y0
                + " " + x3 + "," + y1
                + " " + x1 + "," + y1;
        }
    
        link.curvature = function(_) {
        if (!arguments.length) return curvature;
        curvature = +_;
        return link;
        };
    
        return link;
    };
    
    // Populate the sourceLinks and targetLinks for each node.
    // Also, if the source and target are not objects, assume they are indices.
    function computeNodeLinks() {
        nodes.forEach(function(node) {
        node.sourceLinks = [];
        node.targetLinks = [];
        });
        links.forEach(function(link) {
        var source = link.source,
            target = link.target;
        if (typeof source === "number") source = link.source = nodes[link.source];
        if (typeof target === "number") target = link.target = nodes[link.target];
        source.sourceLinks.push(link);
        target.targetLinks.push(link);
        });
    }
    
    // Compute the value (size) of each node by summing the associated links.
    function computeNodeValues() {
        nodes.forEach(function(node) {
        node.value = Math.max(
            d3.sum(node.sourceLinks, value),
            d3.sum(node.targetLinks, value)
        );
        });
    }
    
    // Iteratively assign the breadth (x-position) for each node.
    // Nodes are assigned the maximum breadth of incoming neighbors plus one;
    // nodes with no incoming links are assigned breadth zero, while
    // nodes with no outgoing links are assigned the maximum breadth.
    function computeNodeBreadths() {
        var remainingNodes = nodes,
            nextNodes,
            x = 0;
    
        while (remainingNodes.length) {
        nextNodes = [];
        remainingNodes.forEach(function(node) {
            node.x = x;
            node.dx = nodeWidth;
            node.sourceLinks.forEach(function(link) {
            if (nextNodes.indexOf(link.target) < 0) {
                nextNodes.push(link.target);
            }
            });
        });
        remainingNodes = nextNodes;
        ++x;
        }
    
        //
        moveSinksRight(x);
        scaleNodeBreadths((size[0] - nodeWidth) / (x - 1));
    }
    
    function moveSourcesRight() {
        nodes.forEach(function(node) {
        if (!node.targetLinks.length) {
            node.x = d3.min(node.sourceLinks, function(d) { return d.target.x; }) - 1;
        }
        });
    }
    
    function moveSinksRight(x) {
        nodes.forEach(function(node) {
        if (!node.sourceLinks.length) {
            node.x = x - 1;
        }
        });
    }
    
    function scaleNodeBreadths(kx) {
        nodes.forEach(function(node) {
        node.x *= kx;
        });
    }
    
    function computeNodeDepths(iterations) {
        var nodesByBreadth = d3.nest()
            .key(function(d) { return d.x; })
            .sortKeys(d3.ascending)
            .entries(nodes)
            .map(function(d) { return d.values; });
    
        //
        initializeNodeDepth();
        resolveCollisions();
        for (var alpha = 1; iterations > 0; --iterations) {
        relaxRightToLeft(alpha *= .99);
        resolveCollisions();
        relaxLeftToRight(alpha);
        resolveCollisions();
        }
    
        function initializeNodeDepth() {
        var ky = d3.min(nodesByBreadth, function(nodes) {
            return (size[1] - (nodes.length - 1) * nodePadding) / d3.sum(nodes, value);
        });
    
        nodesByBreadth.forEach(function(nodes) {
            nodes.forEach(function(node, i) {
            node.y = i;
            node.dy = node.value * ky;
            });
        });
    
        links.forEach(function(link) {
            link.dy = link.value * ky;
        });
        }
    
        function relaxLeftToRight(alpha) {
        nodesByBreadth.forEach(function(nodes, breadth) {
            nodes.forEach(function(node) {
            if (node.targetLinks.length) {
                var y = d3.sum(node.targetLinks, weightedSource) / d3.sum(node.targetLinks, value);
                node.y += (y - center(node)) * alpha;
            }
            });
        });
    
        function weightedSource(link) {
            return center(link.source) * link.value;
        }
        }
    
        function relaxRightToLeft(alpha) {
        nodesByBreadth.slice().reverse().forEach(function(nodes) {
            nodes.forEach(function(node) {
            if (node.sourceLinks.length) {
                var y = d3.sum(node.sourceLinks, weightedTarget) / d3.sum(node.sourceLinks, value);
                node.y += (y - center(node)) * alpha;
            }
            });
        });
    
        function weightedTarget(link) {
            return center(link.target) * link.value;
        }
        }
    
        function resolveCollisions() {
        nodesByBreadth.forEach(function(nodes) {
            var node,
                dy,
                y0 = 0,
                n = nodes.length,
                i;
    
            // Push any overlapping nodes down.
            nodes.sort(ascendingDepth);
            for (i = 0; i < n; ++i) {
            node = nodes[i];
            dy = y0 - node.y;
            if (dy > 0) node.y += dy;
            y0 = node.y + node.dy + nodePadding;
            }
    
            // If the bottommost node goes outside the bounds, push it back up.
            dy = y0 - nodePadding - size[1];
            if (dy > 0) {
            y0 = node.y -= dy;
    
            // Push any overlapping nodes back up.
            for (i = n - 2; i >= 0; --i) {
                node = nodes[i];
                dy = node.y + node.dy + nodePadding - y0;
                if (dy > 0) node.y -= dy;
                y0 = node.y;
            }
            }
        });
        }
    
        function ascendingDepth(a, b) {
        return a.y - b.y;
        }
    }
    
    function computeLinkDepths() {
        nodes.forEach(function(node) {
        node.sourceLinks.sort(ascendingTargetDepth);
        node.targetLinks.sort(ascendingSourceDepth);
        });
        nodes.forEach(function(node) {
        var sy = 0, ty = 0;
        node.sourceLinks.forEach(function(link) {
            link.sy = sy;
            sy += link.dy;
        });
        node.targetLinks.forEach(function(link) {
            link.ty = ty;
            ty += link.dy;
        });
        });
    
        function ascendingSourceDepth(a, b) {
        return a.source.y - b.source.y;
        }
    
        function ascendingTargetDepth(a, b) {
        return a.target.y - b.target.y;
        }
    }
    
    function center(node) {
        return node.y + node.dy / 2;
    }
    
    function value(link) {
        return link.value;
    }
    
    return sankey;
};



var x = d3.scaleTime().rangeRound([0, swarm_width]);

var y = d3.scaleBand().rangeRound([0, swarm_height]);

var curr_month = ""; 
var curr_year = ""; 

var x_axis = d3.axisBottom(x)
            .tickSizeOuter(0)
            .ticks(d3.timeDay.every(1))
            .tickFormat(function(d){ 
                var s = d.toString().split(" ");
                var m = s[1];
                var js = s[3]; 
                // if (m !== curr_month){
                //     curr_month = m; 
                //     return "."; 
                // } else {
                //     return null;
                // }

                if (js !== curr_year){
                    curr_year = js; 
                    return (js%10!==0) ? "'"+js.slice(-2) : js; 
                } else {
                    return null;
                }
            });

var y_axis_left = d3.axisLeft(y).tickSize(0)

var y_axis_right = d3.axisRight(y).tickSizeOuter(0).tickSizeInner(-swarm_width);

var v = d3.voronoi().extent([[0, 0], [swarm_width, swarm_height]]).x(function(d) { return d.x; }).y(function(d) { return d.y; });

var parseDate = function(x){
    var s = x.split("-");
    var d = [s[2], s[0], s[1]].join("-");
    return new Date(d);
}

// defs for images
var defs = d3.select("svg").append("defs");

// append the tip
var tip = d3.select(".swarm").append("div").attr("class", "tip");

function initSwarm(){
    var data = swarmJSON.include;
    data.forEach(function(d){
        d.accuse_date = parseDate(d.accuse_date);
        d.slug = jz.str.toSlugCase(d.name);
        return d;
    });

    x.domain([new Date(2000, 1, 1), new Date(2020, 9, 1)]);

    var industries = jz.arr.sortBy(jz.arr.pivot(data, "industry"), "count", "desc");
    y.domain(industries.map(function(d){ return d.value; }));

    x_axis.tickSizeInner(-swarm_height + y.bandwidth() / 2 - 3)

    svg.append("g")
        .attr("class", "axis y left")
        .call(y_axis_left)
        .selectAll(".tick text")
        .attr("dx", -radius);

    svg.append("g")
        .attr("class", "axis y right")
        .attr("transform", "translate(" + swarm_width + ", 0)")
        .call(y_axis_right.tickFormat(function(d){ return industries.filter(function(c){ return c.value == d })[0].count; }))
        .selectAll(".tick line").each(function(d,i){
            this.setAttribute('stroke-width', '2'); 
            this.setAttribute('opacity', '.7'); 
            setTickColor(this, d);
        })
        .selectAll(".tick text")
        .attr("dx", radius);

    svg.append("g")
        .attr("class", "axis x")
        .attr("transform", "translate(0, " + swarm_height + ")")
        .call(x_axis)
        .selectAll(".tick line")
        .attr('stroke', '#726D6E')
        .style("display", function(d){
            var s = d.toString().split(" ");
            var m = s[1];
            var js = s[3];
            // if (m !== curr_month){
            //     curr_month = m;
            //     return "block"; 
            // } else {
            //     return "none";
            // }
            if (js !== curr_year){
                curr_year = js;
                return "block"; 
            } else {
                return "none";
            }
        });

    forceSim();

    drawSwarmCircle();

    trendSwarm();

    window.addEventListener("resize", function(){ 
        // all of these things need to be updated on resize
        // swarm_width = +jz.str.keepNumber(d3.select(".swarm").style("width")) - svgMargin.left - svgMargin.right;
        // d3.select(".axis.y.right").attr("transform", "translate(" + swarm_width + ", 0)").call(y_axis_right.tickSizeInner(-swarm_width));
        // x.rangeRound([0, swarm_width]);
        // forceSim();
        // d3.select(".x.axis").call(x_axis);
        // drawSwarmCircle(); 
    });

    function drawSwarmCircle(){

        // circle
        var circle = svg.selectAll(".circle").data(v.polygons(data), function(d){ if(d) return d.data.slug;});

        circle.enter().append("circle")
            .attr("class", function(d) { if(d) return "circle circle-" + d.data.slug; else return "circle circle-"; })
            .attr("r", radius)
            .attr("fill", function(d){ if(d) return playwithColor(d.data); })
            .style("fill", function(d){ if(d) return playwithColor(d.data); })
            .merge(circle)
                .attr("cx", function(d) { if(d) return d ? d.data.x : null; })
                .attr("cy", function(d) { if(d) return d ? d.data.y : null; });

        // hover
        var hover_circle = svg.selectAll(".circle-hover").data(v.polygons(data), function(d){ return d.data.slug; });

        hover_circle.enter().append("circle")
            .attr("class", function(d) { return "circle-hover circle-hover-" + d.data.slug; })
            .attr("r", radius)
            .attr("fill", '#00000000')
            .merge(hover_circle)
                .attr("cx", function(d) { return d ? d.data.x : null; })
                .attr("cy", function(d) { return d ? d.data.y : null; });

        svg.selectAll(".circle-hover").on("mouseover", function(d){
            tip.html(d.data.name + "("+d.data.citation+")");

            d3.select(".circle-" + d.data.slug).attr("r", radius * 2.5); //.moveToFront();
            //d3.select(".circle-bg-" + d.data.slug).style("fill-opacity", 0).attr("r", radius * 2.5).style("stroke-width", 3).moveToFront();

            var tip_width = +jz.str.keepNumber(tip.style("width"));
            var tip_height = +jz.str.keepNumber(tip.style("height"));

            var circle_node = d3.select(this).node().getBoundingClientRect();
            var circle_left = circle_node.left - 150;
            var circle_top = circle_node.top - 150;

            var tip_left = circle_left;
            var tip_top = circle_top;
            console.log(circle_node);

            tip.style("left", tip_left + "px").style("top", tip_top + "px");

        }).on("mouseout", function(d){
            d3.select(".circle-" + d.data.slug).attr("r", radius);
            d3.select(".circle-bg-" + d.data.slug).style("fill-opacity", .3).attr("r", radius).style("stroke-width", 1);
            tip.html("");
            //tip.style("left", "-1000px").style("top", "-1000px");
        });

    }

    function forceSim(){
        var simulation = d3.forceSimulation(data)
            .force("y", d3.forceY(function(d){ return y(d.industry) + y.bandwidth() / 2; }).strength(1))
            .force("x", d3.forceX(function(d){ return x(d.accuse_date); }).strength(1))
            .force("collide", d3.forceCollide(radius + 1))
            .stop();

        for (var i = 0; i < 200; ++i) simulation.tick();
    }

        
    
    
    
}

/* sankey and barbar */
function trendSwarm(){

    d3.json("data/sank.json", function(error, graph) {
        console.log(sank_width)
        var sankey = d3.sankey().nodeWidth(1).nodePadding(20).size([sank_width, swarm_height]);
        sankey.nodes(graph.nodes).links(graph.links).layout(1);
    
        var link = svg_sank.append("g").selectAll(".link").data(graph.links).enter().append("path")
            .attr("class", "link")
            .attr("d", sankey.link())
            .style("stroke-width", (d) => { return Math.max(1, d.dy); })
            .style("stroke", (d) => { return setNodeColor(d.source.name); })
            
        var node = svg_sank.append("g").selectAll(".node").data(graph.nodes).enter().append("g")
            .attr("class", "node").attr("transform", (d) => { return "translate(" + d.x + "," + d.y + ")"; })
            .call(d3.drag().subject((d) => { return d; })
            .on("start", () => { this.parentNode.appendChild(this); })
            .on("drag", dragmove));
    
        node.append("rect").attr("height", (d) => { return d.dy; }).attr("width", sankey.nodeWidth())

        node.append("text").attr("x", -6).attr("y", function(d) { return d.dy / 2; }).attr("dy", ".35em").attr("text-anchor", "end").attr("transform", null)
            .text(function(d) { return d.name; }).filter(function(d) { return d.x < width / 4; });
       
      
        function dragmove(d) {
            d3.select(this).attr("transform", "translate("+ d.x + "," + (d.y = Math.max(0, Math.min(swarm_height - d.dy, d3.event.y))) + ")");
            sankey.relayout();
            link.attr("d", sankey.link());
        }
    
    });
    
}

function setTickColor(that, d){
    if(d == 'ISMAR')                that.setAttribute('stroke', colorHolder[0]); 
    else if(d == 'CSCW')            that.setAttribute('stroke', colorHolder[1]); 
    else if(d == 'VRST')            that.setAttribute('stroke', colorHolder[2]); 
    else if(d == 'TVCG')            that.setAttribute('stroke', colorHolder[3]); 
    else if(d == 'UIST')            that.setAttribute('stroke', colorHolder[4]); 
    else if(d == 'Front Robot AI')  that.setAttribute('stroke', colorHolder[5]); 
    else if(d == 'AH')              that.setAttribute('stroke', colorHolder[6]); 
    else if(d == 'CHI')             that.setAttribute('stroke', colorHolder[7]); 
    else if(d == 'SIGGRAPH')        that.setAttribute('stroke', colorHolder[8]); 
    else if(d == 'IEEEVR')          that.setAttribute('stroke', colorHolder[9]); 
    else                            that.setAttribute('stroke', colorHolder[8]); 
}


function setNodeColor(d){
    if(d == 'node0')        return colorHolder[0];
    else if(d == 'node1')   return colorHolder[1];
    else if(d == 'node2')   return colorHolder[2]; 
    else if(d == 'node3')   return colorHolder[3]; 
    else if(d == 'node4')   return colorHolder[4]; 
    else if(d == 'node5')   return colorHolder[5];
    else if(d == 'node6')   return colorHolder[6];
    else if(d == 'node7')   return colorHolder[7];
    else                    return colorHolder[8];
}

function setBarColor(d){
    if(d == 0)              return colorHolder[0];
    else if(d == 1)         return colorHolder[1];
    else if(d == 2)         return colorHolder[2]; 
    else if(d == 3)         return colorHolder[3]; 
    else if(d == 4)         return colorHolder[4]; 
    else if(d == 5)         return colorHolder[5];
    else if(d == 6)         return colorHolder[6];
    else if(d == 7)         return colorHolder[7];
    else if(d == 8)         return colorHolder[8];
    else if(d == 9)         return colorHolder[9];
    else                    return colorHolder[8];
}

function playwithColor(dt){
    let max = 56;
    let op = '' //  ((dt.index/max)*255);
    console.log(op);

    if(dt.industry == 'ISMAR')                  return colorHolder[0] + op; 
    else if(dt.industry == 'CSCW')              return colorHolder[1] + op; 
    else if(dt.industry == 'VRST')              return colorHolder[2] + op; 
    else if(dt.industry == 'TVCG')              return colorHolder[3] + op; 
    else if(dt.industry == 'UIST')              return colorHolder[4] + op; 
    else if(dt.industry == 'Front Robot AI')    return colorHolder[5] + op; 
    else if(dt.industry == 'AH')                return colorHolder[6] + op; 
    else if(dt.industry == 'CHI')               return colorHolder[7] + op; 
    else if(dt.industry == 'SIGGRAPH')          return colorHolder[8] + op; 
    else if(dt.industry == 'IEEEVR')            return colorHolder[9] + op; 
    else                                        return colorHolder[9] + op; 
}