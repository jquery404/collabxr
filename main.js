let nowPlaying = false;

document.addEventListener("DOMContentLoaded", function(event) { 
    loadCSV();
    // initHeatmap();
    // initStreamgraph();

    document.getElementById('copyright').innerHTML = new Date().getFullYear();
});

(function(document) {
    'use strict';

    var TableFilter = (function(myArray) {
        var search_input;

        function _onInputSearch(e) {
            search_input = e.target;
            var tables = document.getElementsByClassName(search_input.getAttribute('data-table'));
            myArray.forEach.call(tables, function(table) {
                myArray.forEach.call(table.tBodies, function(tbody) {
                    myArray.forEach.call(tbody.rows, function(row) {
                        var text_content = row.textContent.toLowerCase();
                        var search_val = search_input.value.toLowerCase();
                        row.style.display = text_content.indexOf(search_val) > -1 ? '' : 'none';
                    });
                });
            });
        }

        return {
            init: function() {
                var inputs = document.getElementsByClassName('search-input');
                myArray.forEach.call(inputs, function(input) {
                    input.oninput = _onInputSearch;
                });
            }
        };
    })(Array.prototype);

    document.addEventListener('readystatechange', function() {
        if (document.readyState === 'complete') {
            TableFilter.init();
        }
    });

})(document);

// function search(e){
//     let tbl = document.querySelector("#myTable");
//     let value = e.value.toLowerCase().trim();

//     if(value.length>=3)
//     for(let i = 1; i < 30 /*tbl.rows.length*/; i++){
//         for (let j = 1; j < 2 /*tbl.rows[i].cells[j].length*/; j++) {
//             let row = tbl.rows[i];
//             let col = row.cells[j];
//             var id = col.innerText.toLowerCase().trim();

//             if(id.indexOf(value) == -1)
//                 row.classList.toggle('hidden');
//             else
//                 row.classList.toggle('show');
//         }
//     }
//     else
//     {
        
//     }

// }


function playVideoPreview(e){
    let vdoPlr = document.getElementById('videoplayer');
    let x = event.pageX; 
    let y = event.pageY; 
    let src = e.innerHTML;

    vdoPlr.style.display = 'block';
    vdoPlr.style.left = x - 150 + 'px';
    vdoPlr.style.top = y + 20 + 'px';
    
    let ampersandPosition = src.indexOf('=');
    if(ampersandPosition != -1) src = src.substring(ampersandPosition+1, src.length);
           
    vdoPlr.src = 'https://www.youtube.com/embed/'+src+'/?autoplay=1&mute=1&enablejsapi=1';
}

function stopVideoPreview(e){
    let vdoPlr = document.getElementById('videoplayer');
    vdoPlr.style.display = 'none';
    vdoPlr.src = '';
}

