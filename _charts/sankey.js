var sankeyChart, barChart, yearBarChart, searchStr;
var InputCat = ['Panorama image', 'Panorama video', 'Point clouds', '360 video', 'Mobile video', 'Mobile Image', '3D Scene'];
var DeviceCat = ['HMD', 'HHD', 'SAR', 'PC'];
var InteractCat = ['Visual', 'Haptic', 'Auditory'];
var UICat = ['Pointer', 'Viewframe', 'FoV',	'Glove', 'Gaze', 'Avatar', 'Gesture', 'Voice'];
var UXCat = ['Decision making', 'Usability', 'Presence', 'Perception', 'Emotion'];
var swarmJSON = '';
var citationList = [
    {pub: publisherList[0], max: 0},
    {pub: publisherList[1], max: 0},
    {pub: publisherList[2], max: 0},
    {pub: publisherList[3], max: 0},
    {pub: publisherList[4], max: 0},
    {pub: publisherList[5], max: 0},
    {pub: publisherList[6], max: 0},
    {pub: publisherList[7], max: 0},
    {pub: publisherList[8], max: 0},
    {pub: publisherList[9], max: 0},
];
citationList.forEach((v) => { citationList[v.pub] = v.max });

function loadChart(){
    google.load('visualization', '1.1', {packages: ['sankey', 'corechart', 'bar']});
    google.setOnLoadCallback(drawSankeyChart);
    //google.setOnLoadCallback(drawBarChart);
    //google.setOnLoadCallback(drawYearBarChart);
}

function drawYearBarChart() {
    var finalYr = countYearTable();
    var dataTbl = [['', 'Number of Papers', { role: 'style' }]];
    for (var i=0; i<finalYr.length; i++)
        dataTbl.push(finalYr[i]);

    var data = google.visualization.arrayToDataTable(dataTbl);

    var options = {
        title: 'Distribution of the papers by year of publication',
        chartArea: {width: '60%'},
        vAxis: { title: 'Number of Papers', minValue: 0 },
        hAxis: {title: ''},
        legend: {position: 'none'}
    };

    yearBarChart = new google.visualization.ColumnChart(document.getElementById('year_bar_basic'));
    yearBarChart.draw(data, options);
}

function drawBarChart() {
    var finalPub = countPublisherTable();
    var dataTbl = [['', 'Number of Papers']];
    for (var i=0; i<finalPub.length; i++)
        dataTbl.push(finalPub[i]);

    var data = google.visualization.arrayToDataTable(dataTbl);

    var options = {
        title: 'Publication Venue Breakdown',
        chartArea: {width: '80%'},
        vAxis: { title: 'Number of Papers', minValue: 0 },
        hAxis: {title: ''}
    };

    barChart = new google.visualization.ColumnChart(document.getElementById('bar_basic'));
    barChart.draw(data, options);
}

function drawSankeyChart() {
    var data = new google.visualization.DataTable();
    var formatter = new google.visualization.NumberFormat({pattern:'$###.## bn'}); 
    var colors = ['#a6cee3', '#b2df8a', '#fb9a99', '#fdbf6f',
                '#cab2d6', '#ffff99', '#1f78b4', '#33a02c'];
    data.addColumn('string', 'From');
    data.addColumn('string', 'To');
    data.addColumn('number', 'Weight');
    //data.addColumn({type: 'string', role: 'tooltip', 'p': {'html': true}});
    
    
    // data.addRows([
    // [ 'Panorama image', 'HHD', 9 ],
    // [ 'Panorama image', 'HMD', 10 ],
    // [ 'Panorama image', 'SAR', 11 ],
    // [ 'Panorama image', 'PC', 7 ],
    // ].map(function(d){
    //     //d.push(formatter.formatValue(d[2])+ ' This is an HTML tooltip<br>It needs to be formatted nicely<br>in a rectangular box that is not <i>long and thin</i>');
    //     return d;
    // }));
        
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

    sankeyChart = new google.visualization.Sankey(document.getElementById('sankey_basic'));
    google.visualization.events.addListener(sankeyChart, 'select', selectHandler);
    
    sankeyChart.draw(data, options);
    var count = 1;
    var asd = setInterval(function(){
        if(count == 1)
            data.addRows(uglyArray(InputCat, DeviceCat, 2, 3));
        else if(count == 2)
            data.addRows(uglyArray(DeviceCat, InteractCat, 3, 7));
        else if(count == 3)
            data.addRows(uglyArray(InteractCat, UICat, 7, 8));
        else if(count == 4)
            data.addRows(uglyArray(UICat, UXCat, 8, 11));
        else
            clearInterval(asd);
        
        sankeyChart.draw(data, options);
        count++;
    }, 500);
}

function selectHandler(e) {
    var selection = sankeyChart.getSelection();
    var id;

    for (var key in selection){
        var value = selection[key];

        var found = InputCat.find(function(elem){ return elem === value.name; });
        if(found) id = 2;
        else {
            found = DeviceCat.find(function(elem){ return elem === value.name;});
            if(found) id = 3;
            else {
                found = InteractCat.find(function(elem){ return elem === value.name;});
                if(found) id = 7;
                else{
                    found = UICat.find(function(elem){ return elem === value.name;});
                    if(found) id = 8;
                    else{
                        found = UXCat.find(function(elem){ return elem === value.name;});
                        if(found) id = 11;
                    }
                }
            }
        }
        
        filterTable(value, id);
    }
}

function loadCSV(){
    var config = buildConfig();
    Papa.parse('data/lr.csv', config);
}

function monthNo(m){ 
    let month = "JanFebMarAprMayJunJulAugSepOctNovDec";
    let no = month.indexOf(m) / 3 + 1;
    return no < 10 ? '0'+ no : no;
}

function parseHTMLTable(results){
    var table = "<table class='table' id='myTable'>";
    var data = results.data;
    var colors = ['#a6cee3', '#b2df8a', '#fb9a99', '#fdbf6f','#cab2d6', '#ffff99', '#1f78b4', '#33a02c'];
    
    var swarmData = [];
    for(var i=0; i<data.length; i++){
        var row = data[i];
        var cells = row.join(",").split(",");
        if(publisherList.includes(cells[13])){
            let year_elaspsed = today - parseInt(cells[14]), 
                cit = year_elaspsed > 0 ? Math.floor(parseInt(cells[16])/year_elaspsed) : 0;
            citationList[cells[13]] = citationList[cells[13]] < cit ? cit : citationList[cells[13]];
            swarmData.push({
                "name": cells[0],
                "industry": cells[13],
                "accuse_date": "01-"+monthNo(cells[15])+"-"+cells[14],
                "image_url": "untitled.png",
                "title": "",
                "citation": cells[16]
            });
        }
    }
    swarmJSON = {"include": swarmData};
        
    for(i=0;i<data.length;i++){
        table+= i==0 ? "<tr class='header'>" : "<tr>";
        
        var row = data[i];
        var cells = row.join(",").split(",");
            
        for(j=0;j<cells.length;j++){
            if(i==0){
                if (j==0) table+= "<th>No</th><th>Title</th>";
                else if(j==0 || j==1 || j==2|| j==4 || j==5 || j==6 || j==10 || j==11 || j==12) table+= "<th>"+cells[j]+"</th>";
                if (j==cells.length-1) table+="<th>Contrib</th>";
            }else{
                
                if (j==0) table+= "<td>"+i+"</td>";
                
                if (j==cells.length-1) table+="<td><span class='round' style='background: "+colors[Math.floor(Math.random()*colors.length)]+"';>"+makeid(1)+"</span></td>";

                if(j==12 && cells[j]!=='') 
                    table+= `<td><span class="videourl" onmouseover="playVideoPreview(this)" onmouseout="stopVideoPreview(this)">${cells[j]}</b></td>`;
                else if(j==0 || j==1 || j==2|| j==4 || j==5 || j==6 || j==10 || j==11 || j==12) {
                    if(j==11) cells[j] !='' ? table+= "<td><span class='collab_style'>" + cells[j] + "</span></td>" : table+= "<td>" + cells[j] + "</td>";
                    else table+= "<td>" + cells[j] + "</td>";
                }
                    

                
            }
            
        }
        table+= "</tr>";
    }
    table+= "</table>";
    document.getElementById("parsed_csv_list").innerHTML = table;

    loadChart();

    initSwarm();
}

function buildConfig() {
    return {
        download: true,
        delimiter: "auto",
        complete: parseHTMLTable
    };
}

// filter
function uglyArray(arr1, arr2, pos1, pos2){
    var arr = [];
    for(var i=0; i< arr1.length; i++){
        for(var j=0; j<arr2.length; j++){
            //if(pos2==11) console.log([arr1[i], arr2[j], countTable(arr1[i], arr2[j], pos1, pos2)]);
            arr.push([arr1[i], arr2[j], countTable(arr1[i], arr2[j], pos1, pos2)]);
        }
    }
    return arr;
}

function countTable(str1, str2, pos1, pos2){
    var count = 0;
    var table = document.getElementById("myTable");
    var tr = table.getElementsByTagName("tr");
    for (i = 0; i < tr.length; i++) {
        td = tr[i].getElementsByTagName("td")[pos1];
        tdd = tr[i].getElementsByTagName("td")[pos2];
        if (td && tdd) {
            txtValue = td.textContent.toUpperCase().indexOf(str1.toUpperCase());
            txtValue1 = tdd.textContent.toUpperCase().indexOf(str2.toUpperCase());
            if(pos2==11) count=1;
            else if (txtValue > -1 && txtValue1 > -1) {
                ++count;
            }
        }  
    }
    
    return count == 0 ? 1 : count;
}

function filterTable(str, id){
    var count = 0;
    var table = document.getElementById("myTable");
    var tr = table.getElementsByTagName("tr");
    for (i = 0; i < tr.length; i++) {
        if(id==7){
            td = tr[i].getElementsByTagName("td")[id];
            tdd = tr[i].getElementsByTagName("td")[id+1];
            if (td) {
                txtValue = td.textContent.toUpperCase().indexOf(str.name.toUpperCase());
                txtValue1 = tdd.textContent.toUpperCase().indexOf(str.name.toUpperCase());

                if (txtValue > -1 || txtValue1 > -1) {
                    ++count;
                    tr[i].style.display = "";
                } else {
                    tr[i].style.display = "none";
                }
            }
        }else{
            td = tr[i].getElementsByTagName("td")[id];
            if (td) {
                txtValue = td.textContent.toUpperCase().indexOf(str.name.toUpperCase());

                if (txtValue > -1) {
                    ++count;
                    tr[i].style.display = "";
                } else {
                    tr[i].style.display = "none";
                }
            }
        }
    }
    
    return count;
}

function checkArray(item){
    return item === searchStr;
}

function countPublisherTable(){
    var pub = [], finalpub = [];
    var table = document.getElementById("myTable");
    var tr = table.getElementsByTagName("tr");

    //publisher = 14
    for (i = 0; i < tr.length; i++) {
        td = tr[i].getElementsByTagName("td")[14];
        if (td) {
            txtValue = td.textContent.toUpperCase();
            if(txtValue != '')
                pub.push(txtValue.trim());
        }  
    }
    var pubClean = removeDuplicates(pub);
    
    for (j = 0; j < pubClean.length; j++) {
        var count = 0;
        for (i = 0; i < tr.length; i++) {
            td = tr[i].getElementsByTagName("td")[14];
            if (td) {
                txtValue = td.textContent.toUpperCase().indexOf(pubClean[j].toUpperCase());
                if (txtValue > -1) ++count;
            }  
        }
        finalpub.push([pubClean[j], count]);
    }
    return finalpub;
}

function countYearTable(){
    var pub = [], finalpub = [];
    var table = document.getElementById("myTable");
    var tr = table.getElementsByTagName("tr");

    //year = 15
    for (i = 0; i < tr.length; i++) {
        td = tr[i].getElementsByTagName("td")[15];
        if (td) {
            txtValue = td.textContent.toUpperCase();
            if(txtValue != '')
                pub.push(txtValue.trim());
        }  
    }
    var pubClean = removeDuplicates(pub);
    
    for (j = 0; j < pubClean.length; j++) {
        var count = 0;
        for (i = 0; i < tr.length; i++) {
            td = tr[i].getElementsByTagName("td")[15];
            if (td) {
                txtValue = td.textContent.toUpperCase().indexOf(pubClean[j].toUpperCase());
                if (txtValue > -1) ++count;
            }  
        }
        var color = '#';
        var range = 'ABCDEF';
        for (var i = 0; i < 6; i++ ) {
            color += range.charAt(Math.floor(Math.random() * range.length));
        }


        finalpub.push([pubClean[j], count, color]);
    }
    return finalpub.sort();
}

function removeDuplicates(array) {
    return array.filter((a, b) => array.indexOf(a) === b)
};

function makeid(length) {
    var result           = '';
    var characters       = 'CFTDNRK';
    var charactersLength = characters.length;
    for ( var i = 0; i < length; i++ ) {
        result += characters.charAt(Math.floor(Math.random() * charactersLength));
    }
    return result;
}
