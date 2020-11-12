var radius = 6;
var nodeColorHolder=["#BE5039","#DE5F42","#EDA645","#F8D85E","#EDE4C2","#CCE3BF", "#ADD299", "#7ABA60", "#4497D7"];

var margin = {top: radius * 2.5 + 10, left: 90, bottom: radius, right: 30},
width = +jz.str.keepNumber(d3.select(".swarm").style("width")) - margin.left - margin.right,
height = 600 - margin.top - margin.bottom,
svg = d3.select(".swarm").append("svg")
    .attr("width", width + margin.left + margin.right)
    .attr("height", height + margin.top + margin.bottom+margin.bottom)
    .append("g")
    .attr("transform", "translate(" + margin.left + ", " + margin.top + ")");

var x = d3.scaleTime().rangeRound([0, width]);

var y = d3.scaleBand().rangeRound([0, height]);

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
                var sssd;
                if (js !== curr_year){
                    curr_year = js; 
                    if(js%10!==0) {
                        sssd = "'"+js.slice(-2);
                    }else {
                        sssd = js;
                    }

                    return sssd; 
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
var tip = d3.select(".swarm").append("div").attr("class", "tip");

function initSwarm(){

    d3.json("data/data.json", function(error, data){
        if (error) throw error;
    
        data = data.include;
        data.forEach(function(d){
            d.accuse_date = parseDate(d.accuse_date);
            d.slug = jz.str.toSlugCase(d.name);
            return d;
        });
    
        x.domain([new Date(2000, 1, 1), new Date(2020, 9, 1)]);
    
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
            .selectAll(".tick line").each(function(d,i){
                if(d == 'ISMAR')
                    this.setAttribute('stroke', '#be5039'); 
                else if(d == 'Media')
                    this.setAttribute('stroke', '#EDA645'); 
                else if(d == 'Politics')
                    this.setAttribute('stroke', '#F8D85E'); 
                else if(d == 'Business')
                    this.setAttribute('stroke', '#EDE4C2'); 
                else if(d == 'Music')
                    this.setAttribute('stroke', '#7ABA60'); 
                else if(d == 'Sports')
                    this.setAttribute('stroke', '#CCE3BF'); 
                else if(d == 'Tech')
                    this.setAttribute('stroke', '#4497D7'); 
                else if(d == 'CHI')
                    this.setAttribute('stroke', '#ADD299'); 
                else 
                    this.setAttribute('stroke', '#7ABA60'); 

            })
            .selectAll(".tick text")
            .attr("dx", radius);
    
        svg.append("g")
            .attr("class", "axis x")
            .attr("transform", "translate(0, " + height + ")")
            .call(x_axis)
            .selectAll(".tick line")
            .attr('stroke', '#ddd')
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
            width = +jz.str.keepNumber(d3.select(".swarm").style("width")) - margin.left - margin.right;
            d3.select(".axis.y.right").attr("transform", "translate(" + width + ", 0)").call(y_axis_right.tickSizeInner(-width));
            x.rangeRound([0, width]);
            forceSim();
            d3.select(".x.axis").call(x_axis);
            drawSwarmCircle(); 
        });
    
        function drawSwarmCircle(){
    
            // circle
            var circle = svg.selectAll(".circle").data(v.polygons(data), function(d){ if(d) return d.data.slug;});
    
            circle.enter().append("circle")
                .attr("class", function(d) { if(d) return "circle circle-" + d.data.slug; else return "circle circle-"; })
                .attr("r", radius)
                .attr("fill", function(d){ if(d) return playwithColor(d.data); /*colorHold[Math.floor(Math.random()*colorHold.length)];*/ })
                .style("fill", function(d){ if(d) return playwithColor(d.data); })
                .merge(circle)
                    .attr("cx", function(d) { if(d) return d ? d.data.x : null; })
                    .attr("cy", function(d) { if(d) return d ? d.data.y : null; });
    
            // // hover
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
    
                var circle_node = d3.select(this).node().getBoundingClientRect();console.log(circle_node);
                var circle_left = circle_node.left;
                var circle_top = circle_node.top;
    
                var tip_left = circle_left-200;
                var tip_top = circle_top-200;
    
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

        function playwithColor(dt){
            //["#BE5039","#DE5F42","#EDA645","#F8D85E","#EDE4C2","#CCE3BF", "#ADD299", "#7ABA60", "#4497D7"]
            let max = 56;
            if(dt.industry == 'ISMAR')
                return "rgba(190, 80, 57,"+((dt.index/max).toFixed(1))+")";
            else if(dt.industry == 'Media')
                return "rgba(237, 166, 69,"+((dt.index/max).toFixed(1))+")";
            else if(dt.industry == 'Politics')
                return "rgba(248, 216, 94,"+((dt.index/max).toFixed(1))+")";
            else if(dt.industry == 'Business')
                return "rgba(237, 228, 194,"+((dt.index/max).toFixed(1))+")";
            else if(dt.industry == 'Music')
                return "rgba(204, 227, 191,"+((dt.index/max).toFixed(1))+")";
            else if(dt.industry == 'Sports')
                return "rgba(173, 210, 153,"+((dt.index/max).toFixed(1))+")";
            else if(dt.industry == 'Tech')
                return "rgba(122, 186, 96,"+((dt.index/max).toFixed(1))+")";
            else if(dt.industry == 'CHI')
                return "rgba(68, 151, 215,"+((dt.index/max).toFixed(1))+")";
            else return "#DE5F42";

        }
    
    });
    
    
}

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

function sankMe(){
    var svg = d3.select("#sankey")
        .append("svg").attr("width", 200 + margin.left + margin.right).attr("height", height + margin.top + margin.bottom)
        .append("g").attr("transform", "translate(0,0)");

    var sankey = d3.sankey().nodeWidth(1).nodePadding(20).size([200, height]);

    d3.json("data/sank.json", function(error, graph) {

        sankey.nodes(graph.nodes).links(graph.links).layout(1);
    
        var link = svg.append("g").selectAll(".link").data(graph.links).enter().append("path")
            .attr("class", "link")
            .attr("d", sankey.link())
            .style("stroke-width", function(d) { return Math.max(1, d.dy); })
            .style("stroke", function(d){ 
                if(d.source.name == 'node1') return '#be5039';
                else if(d.source.name == 'node2') return '#DE5F42'; 
                else if(d.source.name == 'node3') return '#EDA645'; 
                else if(d.source.name == 'node4') return '#F8D85E'; 
                else if(d.source.name == 'node5') return '#EDE4C2'; 
                else if(d.source.name == 'node6') return '#CCE3BF'; 
                else if(d.source.name == 'node7') return '#ADD299'; 
                else if(d.source.name == 'node0') return '#7ABA60'; 
                else return '#111';
            })
            
        var node = svg.append("g").selectAll(".node").data(graph.nodes).enter().append("g")
            .attr("class", "node").attr("transform", function(d) { return "translate(" + d.x + "," + d.y + ")"; })
            .call(d3.drag().subject(function(d) { return d; })
            .on("start", function() { this.parentNode.appendChild(this); })
            .on("drag", dragmove));
    
        node.append("rect").attr("height", function(d) { return d.dy; }).attr("width", sankey.nodeWidth())
       
      
        function dragmove(d) {
            d3.select(this).attr("transform", "translate("+ d.x + "," + (d.y = Math.max(0, Math.min(height - d.dy, d3.event.y))) + ")");
            sankey.relayout();
            link.attr("d", sankey.link());
        }
    
    });
    
}

function trendSwarm(){
    var data = [
        {"salesperson":"Bob","sales":55},
        {"salesperson":"Robin","sales":25},
        {"salesperson":"Anne","sales":5},
        {"salesperson":"Pop","sales":7},
    ];
    data.forEach(function(d) {d.sales = +d.sales;});
    var heights = 60;
    var widths = 80;

    for(var i = 0; i < 7; i++){
        var mmtop = i>0?20:0;
        var svg = d3.select("#barbar").append("svg")
                .attr("width", widths)
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
                .attr("fill", function(d,j) {
                    if(i == 1) return '#be5039';
                    else if(i == 2) return '#DE5F42'; 
                    else if(i == 3) return '#EDA645'; 
                    else if(i == 4) return '#F8D85E'; 
                    else if(i == 5) return '#EDE4C2'; 
                    else if(i == 6) return '#CCE3BF'; 
                    else if(i == 7) return '#ADD299'; 
                    else if(i == 0) return '#7ABA60'; 
                    else return '#111';
                })
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
    
    // google.load('visualization', '1.1', {packages: ['sankey', 'corechart', 'bar']});
    // google.setOnLoadCallback(sankeyMe);
    sankMe();
}

