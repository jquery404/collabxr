var sankeyChart,barChart,yearBarChart,searchStr,InputCat=["Panorama image","Panorama video","Point clouds","360 video","Mobile video","Mobile Image","3D Scene"],DeviceCat=["HMD","HHD","SAR","PC"],InteractCat=["Visual","Haptic","Auditory"],UICat=["Pointer","Viewframe","FoV","Glove","Gaze","Avatar","Gesture","Voice"],UXCat=["Decision making","Usability","Presence","Perception","Emotion"],swarmJSON="",citationList=[{pub:publisherList[0],max:0},{pub:publisherList[1],max:0},{pub:publisherList[2],max:0},{pub:publisherList[3],max:0},{pub:publisherList[4],max:0},{pub:publisherList[5],max:0},{pub:publisherList[6],max:0},{pub:publisherList[7],max:0},{pub:publisherList[8],max:0},{pub:publisherList[9],max:0}];function loadChart(){google.load("visualization","1.1",{packages:["sankey","corechart","bar"]}),google.setOnLoadCallback(drawSankeyChart)}function drawYearBarChart(){for(var finalYr=countYearTable(),dataTbl=[["","Number of Papers",{role:"style"}]],i=0;i<finalYr.length;i++)dataTbl.push(finalYr[i]);var data=google.visualization.arrayToDataTable(dataTbl),options={title:"Distribution of the papers by year of publication",chartArea:{width:"60%"},vAxis:{title:"Number of Papers",minValue:0},hAxis:{title:""},legend:{position:"none"}};(yearBarChart=new google.visualization.ColumnChart(document.getElementById("year_bar_basic"))).draw(data,options)}function drawBarChart(){for(var finalPub=countPublisherTable(),dataTbl=[["","Number of Papers"]],i=0;i<finalPub.length;i++)dataTbl.push(finalPub[i]);var data=google.visualization.arrayToDataTable(dataTbl),options={title:"Publication Venue Breakdown",chartArea:{width:"80%"},vAxis:{title:"Number of Papers",minValue:0},hAxis:{title:""}};(barChart=new google.visualization.ColumnChart(document.getElementById("bar_basic"))).draw(data,options)}function drawSankeyChart(){var data=new google.visualization.DataTable,formatter=new google.visualization.NumberFormat({pattern:"$###.## bn"}),colors=["#a6cee3","#b2df8a","#fb9a99","#fdbf6f","#cab2d6","#ffff99","#1f78b4","#33a02c"];data.addColumn("string","From"),data.addColumn("string","To"),data.addColumn("number","Weight");var options={tooltip:{isHtml:!0,textStyle:{fontName:"Times-Roman",color:"#000",fontSize:12},showColorCode:!0},sankey:{link:{colorMode:"gradient",colors:colors},node:{pattern:"$### m",interactivity:!0}},animation:{duration:1e3,easing:"out"}};sankeyChart=new google.visualization.Sankey(document.getElementById("sankey_basic")),google.visualization.events.addListener(sankeyChart,"select",selectHandler),sankeyChart.draw(data,options);var count=1,asd=setInterval((function(){1==count?data.addRows(uglyArray(InputCat,DeviceCat,2,3)):2==count?data.addRows(uglyArray(DeviceCat,InteractCat,3,7)):3==count?data.addRows(uglyArray(InteractCat,UICat,7,8)):4==count?data.addRows(uglyArray(UICat,UXCat,8,11)):clearInterval(asd),sankeyChart.draw(data,options),count++}),500)}function selectHandler(e){var selection=sankeyChart.getSelection(),id;for(var key in selection){var value=selection[key],found=InputCat.find((function(elem){return elem===value.name}));found?id=2:(found=DeviceCat.find((function(elem){return elem===value.name})))?id=3:(found=InteractCat.find((function(elem){return elem===value.name})))?id=7:(found=UICat.find((function(elem){return elem===value.name})))?id=8:(found=UXCat.find((function(elem){return elem===value.name})))&&(id=11),filterTable(value,id)}}function loadCSV(){var config=buildConfig();Papa.parse("data/lr.csv",config)}function monthNo(m){let month,no="JanFebMarAprMayJunJulAugSepOctNovDec".indexOf(m)/3+1;return no<10?"0"+no:no}function parseHTMLTable(results){for(var table="<table class='table' id='myTable'>",data=results.data,colors=["#a6cee3","#b2df8a","#fb9a99","#fdbf6f","#cab2d6","#ffff99","#1f78b4","#33a02c"],swarmData=[],i=0;i<data.length;i++){var row,cells=(row=data[i]).join(",").split(",");if(publisherList.includes(cells[13])){let year_elaspsed=today-parseInt(cells[14]),cit=year_elaspsed>0?Math.floor(parseInt(cells[16])/year_elaspsed):0;citationList[cells[13]]=citationList[cells[13]]<cit?cit:citationList[cells[13]],swarmData.push({name:cells[0],industry:cells[13],accuse_date:"01-"+monthNo(cells[15])+"-"+cells[14],image_url:"untitled.png",title:"",citation:cells[16]})}}for(swarmJSON={include:swarmData},i=0;i<data.length;i++){table+=0==i?"<tr class='header'>":"<tr>";var row,cells=(row=data[i]).join(",").split(",");for(j=0;j<cells.length;j++)0==i?(0==j?table+="<th>No</th><th>Title</th>":0!=j&&1!=j&&2!=j&&4!=j&&5!=j&&6!=j&&10!=j&&11!=j&&12!=j||(table+="<th>"+cells[j]+"</th>"),j==cells.length-1&&(table+="<th>Contrib</th>")):(0==j&&(table+="<td>"+i+"</td>"),j==cells.length-1&&(table+="<td><span class='round' style='background: "+colors[Math.floor(Math.random()*colors.length)]+"';>"+makeid(1)+"</span></td>"),12==j&&""!==cells[j]?table+=`<td><span class="videourl" onmouseover="playVideoPreview(this)" onmouseout="stopVideoPreview(this)">${cells[j]}</b></td>`:0!=j&&1!=j&&2!=j&&4!=j&&5!=j&&6!=j&&10!=j&&11!=j&&12!=j||(11==j&&""!=cells[j]?table+="<td><span class='collab_style'>"+cells[j]+"</span></td>":table+="<td>"+cells[j]+"</td>"));table+="</tr>"}table+="</table>",document.getElementById("parsed_csv_list").innerHTML=table,loadChart(),initSwarm()}function buildConfig(){return{download:!0,delimiter:"auto",complete:parseHTMLTable}}function uglyArray(arr1,arr2,pos1,pos2){for(var arr=[],i=0;i<arr1.length;i++)for(var j=0;j<arr2.length;j++)arr.push([arr1[i],arr2[j],countTable(arr1[i],arr2[j],pos1,pos2)]);return arr}function countTable(str1,str2,pos1,pos2){var count=0,table,tr=document.getElementById("myTable").getElementsByTagName("tr");for(i=0;i<tr.length;i++)td=tr[i].getElementsByTagName("td")[pos1],tdd=tr[i].getElementsByTagName("td")[pos2],td&&tdd&&(txtValue=td.textContent.toUpperCase().indexOf(str1.toUpperCase()),txtValue1=tdd.textContent.toUpperCase().indexOf(str2.toUpperCase()),11==pos2?count=1:txtValue>-1&&txtValue1>-1&&++count);return 0==count?1:count}function filterTable(str,id){var count=0,table,tr=document.getElementById("myTable").getElementsByTagName("tr");for(i=0;i<tr.length;i++)7==id?(td=tr[i].getElementsByTagName("td")[id],tdd=tr[i].getElementsByTagName("td")[id+1],td&&(txtValue=td.textContent.toUpperCase().indexOf(str.name.toUpperCase()),txtValue1=tdd.textContent.toUpperCase().indexOf(str.name.toUpperCase()),txtValue>-1||txtValue1>-1?(++count,tr[i].style.display=""):tr[i].style.display="none")):(td=tr[i].getElementsByTagName("td")[id],td&&(txtValue=td.textContent.toUpperCase().indexOf(str.name.toUpperCase()),txtValue>-1?(++count,tr[i].style.display=""):tr[i].style.display="none"));return count}function checkArray(item){return item===searchStr}function countPublisherTable(){var pub=[],finalpub=[],table,tr=document.getElementById("myTable").getElementsByTagName("tr");for(i=0;i<tr.length;i++)td=tr[i].getElementsByTagName("td")[14],td&&(txtValue=td.textContent.toUpperCase(),""!=txtValue&&pub.push(txtValue.trim()));var pubClean=removeDuplicates(pub);for(j=0;j<pubClean.length;j++){var count=0;for(i=0;i<tr.length;i++)td=tr[i].getElementsByTagName("td")[14],td&&(txtValue=td.textContent.toUpperCase().indexOf(pubClean[j].toUpperCase()),txtValue>-1&&++count);finalpub.push([pubClean[j],count])}return finalpub}function countYearTable(){var pub=[],finalpub=[],table,tr=document.getElementById("myTable").getElementsByTagName("tr");for(i=0;i<tr.length;i++)td=tr[i].getElementsByTagName("td")[15],td&&(txtValue=td.textContent.toUpperCase(),""!=txtValue&&pub.push(txtValue.trim()));var pubClean=removeDuplicates(pub);for(j=0;j<pubClean.length;j++){var count=0;for(i=0;i<tr.length;i++)td=tr[i].getElementsByTagName("td")[15],td&&(txtValue=td.textContent.toUpperCase().indexOf(pubClean[j].toUpperCase()),txtValue>-1&&++count);for(var color="#",range="ABCDEF",i=0;i<6;i++)color+=range.charAt(Math.floor(Math.random()*range.length));finalpub.push([pubClean[j],count,color])}return finalpub.sort()}function removeDuplicates(array){return array.filter((a,b)=>array.indexOf(a)===b)}function makeid(length){for(var result="",characters="CFTDNRK",charactersLength="CFTDNRK".length,i=0;i<length;i++)result+="CFTDNRK".charAt(Math.floor(Math.random()*charactersLength));return result}citationList.forEach(v=>{citationList[v.pub]=v.max});