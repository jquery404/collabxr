const radius = 5;

var svgMargin = {top: radius * 2.5 + 10, left: 90, bottom: 12, right: 30};
var swarm_width = +jz.str.keepNumber(d3.select(".swarm").style("width")) - svgMargin.left - svgMargin.right;
var sank_width = +jz.str.keepNumber(d3.select("#sankey").style("width"))*.6;
var barbar_width = +jz.str.keepNumber(d3.select("#barbar").style("width"));
var swarm_tooltip = d3.select("body").append("div").attr("class", "toolTip");
var swarm_height = 600 - svgMargin.top - svgMargin.bottom;
var barbar_height = 40;


var svg = d3.select(".swarm").append("svg")
        .attr("width", swarm_width + svgMargin.left + svgMargin.right)
        .attr("height", swarm_height + svgMargin.top + svgMargin.bottom)
        .append("g").attr("transform", "translate(" + svgMargin.left + ", " + svgMargin.top + ")");
    
var svg_sank = d3.select("#sankey").append("svg")
            .attr("width", sank_width + svgMargin.left + svgMargin.right)
            .attr("height", swarm_height + svgMargin.top + svgMargin.bottom)
            .attr("style", "margin-top:"+30+"px")
            .append("g") .attr("transform", "translate(0,0)");

for(var i = 0; i < publisherList.length; i++){
    var margin_top = i>0?18:30;
    var svg_barbar = d3.select("#barbar").append("svg")
            .attr("width", barbar_width)
            .attr("height", barbar_height)
            .attr("style", "margin-top:"+margin_top+"px")
            .append("g").attr("transform", "translate(0,0)");
    var y = d3.scaleBand().range([barbar_height, 0]).padding(0.2);
    var x = d3.scaleLinear().range([0, barbar_width]);
    
    var barData = _xrData[publisherList[i]].bar;
    barData = barData.sort((a, b) => { return a.type - b.type; }).reverse();

    x.domain([0, d3.max(barData, ((d) => { return d.amount }))])
    y.domain(barData.map((d) => { return d.type; }));

    svg_barbar.selectAll(".bar")
        .data(barData).enter().append("rect")
        .attr("class", "bar-back")
        .attr("width", (d) => {return barbar_width; } )
        .attr("y", (d) => { return y(d.type)+3; })
        .attr("fill", (d,j) => { return '#171718' })
        .attr("height", 0.5);
        
    svg_barbar.selectAll(".bar")
        .data(barData).enter().append("rect")
        .attr("class", (d, j) => { return "bar_" + d.type})
        .attr("fill", (d,j) => { return setBarColor(i) })
        .attr("width", (d) => {return x(d.amount); } )
        .attr("y", (d) => { return y(d.type); })
        .attr("height", y.bandwidth())
        .on("mousemove", function(d){
            swarm_tooltip
                .style("left", d3.event.pageX+'px')
                .style("top", d3.event.pageY+'px')
                .style("display", "inline-block")
                .html(d.type+": "+d.amount);
        })
        .on("mouseout", () => swarm_tooltip.style("display", "none"));

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
                    return (js%10!==0) ? "'"+js.slice(-2) : js
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

    x.domain([new Date(1999, 1, 1), new Date(2020, 9, 1)]);

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
            swarm_tooltip
                .style("left", d3.event.pageX+'px')
                .style("top", d3.event.pageY+'px')
                .style("display", "inline-block")
                .html(d.data.name + "("+d.data.citation+")");
            
            // tip.html(d.data.name + "("+d.data.citation+")");

            d3.select(".circle-" + d.data.slug).attr("r", radius * 2.5); //.moveToFront();
            //d3.select(".circle-bg-" + d.data.slug).style("fill-opacity", 0).attr("r", radius * 2.5).style("stroke-width", 3).moveToFront();

            // var tip_width = +jz.str.keepNumber(tip.style("width"));
            // var tip_height = +jz.str.keepNumber(tip.style("height"));

            // var circle_node = d3.select(this).node().getBoundingClientRect();
            // var circle_left = circle_node.left - tip_width/2;
            // var circle_top = circle_node.top - tip_height/2 + 10;

            // var tip_left = circle_left;
            // var tip_top = circle_top;

            // tip.style("left", tip_left + "px").style("top", tip_top + "px");

        }).on("mouseout", function(d){
            d3.select(".circle-" + d.data.slug).attr("r", radius);
            d3.select(".circle-bg-" + d.data.slug).style("fill-opacity", .3).attr("r", radius).style("stroke-width", 1);
            //tip.html("");
            swarm_tooltip.style("display", "none")
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

    var sankey = d3.sankey().nodeWidth(1).nodePadding(20).size([sank_width, swarm_height]);
    sankey.nodes(trendData.nodes).links(trendData.links).layout(1);

    var link = svg_sank.append("g").selectAll(".link").data(trendData.links).enter().append("path")
        .attr("class", "link")
        .attr("d", sankey.link())
        .style("stroke-width", (d) => { return Math.max(1, d.dy); })
        .style("stroke", (d) => { return setNodeColor(d.source.name); })
        
    var node = svg_sank.append("g").selectAll(".node").data(trendData.nodes).enter().append("g")
        .attr("class", "node").attr("transform", (d) => { return "translate(" + d.x + "," + d.y + ")"; })
        .call(d3.drag().subject((d) => { return d; })
        .on("start", () => { this.parentNode.appendChild(this); })
        .on("drag", dragmove));

    node.append("rect").attr("height", (d) => { return d.dy; }).attr("width", sankey.nodeWidth())

    node.append("text")
        .attr("x", 5)
        .attr("y", function(d) { return d.dy / 2; })
        .attr("dy", ".35em").style("font-style", "italic").style("font-size", "0.9rem")
        .attr("text-anchor", "start")
        .attr("transform", null)
        .each(function(d) {
            if(paperTrends.includes(d.name)){
                let str = d.name.split('\n');
                let text = d3.select(this)
                    .attr("dy", str.length / 3 - (str.length-1) * 1 + 'em')
                    .text(str[0]);
                for (var i = 1; i < str.length; i++) {
                    text.append("tspan").attr('x', 5).attr('dy', '1em').text(str[i])
                }
            }
        });
        

    function dragmove(d) {
        d3.select(this).attr("transform", "translate("+ d.x + "," + (d.y = Math.max(0, Math.min(swarm_height - d.dy, d3.event.y))) + ")");
        sankey.relayout();
        link.attr("d", sankey.link());
    }

    
}

function setTickColor(that, d){
    if(publisherList.includes(d))                
        that.setAttribute('stroke', colorHolder[publisherList.indexOf(d)]);
    else
        that.setAttribute('stroke', colorHolder[8]);
}


function setNodeColor(d){
    if(publisherList.includes(d)) 
        return colorHolder[publisherList.indexOf(d)];
    else
        return colorHolder[0];
}

function setBarColor(d){ return colorHolder[d]; }

function ColorLuminance(hex, lum) {
	hex = String(hex).replace(/[^0-9a-f]/gi, '');
	if (hex.length < 6) {
		hex = hex[0]+hex[0]+hex[1]+hex[1]+hex[2]+hex[2];
	}
	lum = lum || 0;

	var rgb = "#", c, i;
	for (i = 0; i < 3; i++) {
		c = parseInt(hex.substr(i*2,2), 16);
		c = Math.round(Math.min(Math.max(0, c + (c * lum)), 255)).toString(16);
		rgb += ("00"+c).substr(c.length);
	}

	return rgb;
}



function playwithColor(dt){
    let max = citationList[dt.industry];
    let nums = [0, -0.1, -0.15, -0.25, -0.3, -0.4, -0.45, -0.5, -0.55, -0.6];
    let published = new Date(dt.accuse_date).getFullYear(),
        year_elaspsed = today - published, 
        cit = year_elaspsed > 0 ? Math.floor(parseInt(dt.citation)/year_elaspsed) : 0; 

    if(publisherList.includes(dt.industry))                  
        return ColorLuminance(colorHolder[publisherList.indexOf(dt.industry)], nums[Math.floor(cit/max*10)]); 
    else  
        return colorHolder[9] + op; 
}


