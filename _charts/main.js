

    
    let nowPlaying = false;

    document.addEventListener("DOMContentLoaded", function(event) { 
        loadCSV();
        // initHeatmap();
        // initStreamgraph();

        document.getElementById('copyright').innerHTML = new Date().getFullYear();
    });



    
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

    