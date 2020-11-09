

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

function initBarbar(){
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


