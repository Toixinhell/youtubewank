function pageLoad(){
	google.load("swfobject", "2.2");

	// Because we are using jQuery, the elements can be accessed differently? [TIH]
	$('#addVideo').click(addVideo);
	$('#go').click(searchClicked);
	
	//Submit on "Return"
	$("#search").keyup(function(event){
    if(event.keyCode == 13){
        $("#go").click();
    }

});

}

// When finishing a text in the search field, I want the Enter key to initialize the search.
function focusOnEnter(e)
{
var keynum = e.keyCode || e.which; //for compatibility with IE < 9
        searchClicked();
}



function addVideo(){
        $('#noAdded').hide();
        var key = $('#youtubekey').val();
        if(key){addVideoProcedure(key);}
}

function onYouTubePlayerReady(playerId) {
        handler = document.getElementById(playerId);
        
        window["onPlayerStateChange_"+playerId] = function(newState)
        {
                var currentVideo = $('#'+playerId).parent().parent();
                handler = document.getElementById(playerId);
                switch(newState){
                        //not started
                case(-1):
                        currentVideo.css('background-color','red');
                        break;
                        //playing
                case(1):
						
                        console.log('playing');
                        currentVideo.find('.play').hide();
                        currentVideo.find('.pause').show();
                        //currentVideo.css('background-color','green');
                        if(currentVideo.find('.repeatFromTo').is(':checked')){
                                //currentVideo.css('background-color','blue');
                                i = 0;
                                //var start = currentVideo.find('.tFrom').val();
								var	start = timeToSeconds(currentVideo.find('.tFrom').val());
                                //var stop = currentVideo.find('.tTo').val();
                                var	stop = timeToSeconds(currentVideo.find('.tTo').val());
								var interval = setInterval(function(){
                                                end=false;
                                                currentTime = handler.getCurrentTime();
                                                console.log(currentTime);
                                                //currentVideo.css('background-color','blue');
                                                currentVideo.find('.pause').click(function(){
                                                                //currentVideo.css('background-color','yellow');
                                                                clearInterval(interval);
                                                });
                                                if(currentTime > stop){handler.seekTo(start);}
                                                if(currentTime < start){handler.seekTo(start);}
                                }, 500);
                        };
						 
						 //alert(durationToTime(handler.getDuration(),'hh:mm:ss'));
						 $("#duration").text(durationToTime(handler.getDuration(), 'hh:mm:ss'));
						 //$("#title").text(handler.getName());
						 //$("#duration").text(durationToTime(handler.getDuration()));
                        break;
                        //paused
                case(2):
                        console.log('paused');
                        currentVideo.find('.pause').hide();
                        currentVideo.find('.play').show();
                        //currentVideo.css('background-color','yellow');
                        break;
                        //buffering
                case(3):
                        console.log('buffering');
                        //currentVideo.css('background-color','orange');
                        break;
                        //ended
                case(0):
                        console.log('ended');
                        currentVideo.find('.pause').hide();
                        currentVideo.find('.play').show();
                        if(currentVideo.find('.repeat').is(':checked')){handler.seekTo(0);};
                        if(currentVideo.find('.autoremove').is(':checked')){currentVideo.remove();};
                        //currentVideo.css('background-color','black');
                        break;
                        default: console.log(newState);
                }
        };
       
        handler.addEventListener('onStateChange', 'onPlayerStateChange_'+playerId);
}



function getVideoObject(that){
        var id = that.parent().parent().find('object').attr('id');
        var handler = document.getElementById(id);
        return handler;
}

function getAllVideosOnPage(){
        var allElements = $('#tubes object');
        return allElements;
}

function setVideoVolume(handler, volume){
        handler.setVolume(volume);
}

function checkForAutoFunction(playerId){
        var handler = document.getElementById(playerId);
        var theHolyRow = handler.parent();
        console.log(playerId);
}

function addVideoProcedure(key){

        $("#addVideo").attr("disabled", "disabled");
        window.timestamp = new Date().getTime();
        $('#tubes table').prepend(" <tr class='videoElement'><td><div id='"+window.timestamp+"'> </div></td>"+
				"<td><div id='duration'></div></td>"+
                "<td><div id='title'> Title not found.</div><button class='play'>PLAY</button>"+
                "<button class='pause'>PAUSE</button>"+
                "<button class='replay'>REPLAY</button>"+
                "<input type='text' class='volume' size='2' max-lenght='3'><button class='vol'>Adjust Volume</button>"+
				"<div class='bubbleInfo'><img class='trigger' src='images/info_s.png' height='30' width='30' /> <div id='infoPanel' class='popup'> fdgdgfdfgdfg </div></div>"+
				//"<button class='percent'>DEBUG!</button>"+
                "</td><td>"+
                "<p><input type='checkbox' class='repeat'>Repeat</p>"+
                "<p><input type='checkbox' class='autoremove'>Autoremove</p>"+
                "<p><input type='checkbox' class='repeatFromTo'>Repeat from <input type='text' class='tFrom'>to <input type='text' class='tTo'></p>"+
                "</td>"+
                "<td><button class='delete'>DELETE</button></td>"+
                "</tr>");
        updateHandlers();
        var params = { allowScriptAccess: "always" };
        var atts = { id: window.timestamp };
        swfobject.embedSWF("http://www.youtube.com/apiplayer?&enablejsapi=1&playerapiid="+window.timestamp+"&video_id="+key+"&version=3",window.timestamp, "100", "100", "8", null, null, params, atts);
		setTimeout(function () {
                        $("#addVideo").removeAttr("disabled");
        }, 1000);
		//update the duration DIV
		getYouTubeInfo(key);

		
}

function searchClicked()
{
        $('#searchBox').show();
        document.getElementById("searchBox").innerHTML =
        'Loading YouTube videos ...';
        
        //create a JavaScript element that returns our JSON data.
        var script = document.createElement('script');
        var searchTerm = $('#search').val();
        script.setAttribute('id', 'jsonScript');
        script.setAttribute('type', 'text/javascript');
        script.setAttribute('src', 'http://gdata.youtube.com/feeds/' +
                'videos?vq='+searchTerm+'&max-results=18&' +
                'alt=json-in-script&callback=showMyVideos&' +
                'orderby=relevance&sortorder=descending&format=5&fmt=18');
        
        //attach script to current page - this will submit asynchronous
        //search request, and when the results come back callback
        //function showMyVideos(data) is called and the results passed to it
        document.documentElement.firstChild.appendChild(script);
}

function showMyVideos(data)
{
        var feed = data.feed;
        var entries = feed.entry || [];
        var html = ['<ul>'];
        for (var i = 0; i < entries.length; i++)
        {
                var entry = entries[i];
                var playCount = entry.yt$statistics.viewCount.valueOf() + ' views';
                var title = entry.title.$t;
                //ZC9S8-HMkAs&feature=youtube_gdata
                key = entry.link[0].href.replace("http://www.youtube.com/watch?v=", "");
                key = key.replace("&feature=youtube_gdata","");
        
                
                var element = '<span id="' + key + '">' + title + '</span>';
                html.push('<li class="addSearchedVideo">', element, '</li>');
        }
        html.push('</ul>');
        document.getElementById('searchBox').innerHTML = html.join('');
        
        updateHandlers();
}

function updateHandlers(){
        $('.videoElement').click(function(){
        });
        
        $('.play').click(function(){
                        $(this).hide();
                        $(this).parent().find('.replay').show();
                        $(this).parent().find('.pause').show();
                        handler = getVideoObject($(this));
                        if($(this).parent().find('.volume').val())setVideoVolume(handler, $(this).parent().find('.volume').val());
                        handler.playVideo();
        });
        
        $('.replay').click(function(){
                        handler = getVideoObject($(this));
                        handler.seekTo(0);
                        handler.playVideo();
        });
        
        $('.pause').click(function(){
                        $(this).parent().find('.pause').hide();
                        $(this).parent().find('.play').show();
                        handler = getVideoObject($(this));
                        handler.pauseVideo();
        });
        
        $('.percent').click(function(){
                        checkForAutoFunction($(this));
        });
        
        $('#playAll').click(function(){
                        var videoArray = getAllVideosOnPage();
                        $('.play').hide();
                        $('.replay').show();
                        $('.pause').show();
                        $.each(videoArray, function(index, value) {
                                        handler = document.getElementById(value.id);
                                        handler.playVideo();
                        });
        });
        
        $('#pauseAll').click(function(){
                        var videoArray = getAllVideosOnPage();        
                        $('.play').show();
                        $('.replay').show();
                        $('.pause').hide();
                        $.each(videoArray, function(index, value) {
                                        handler = document.getElementById(value.id);
                                        handler.pauseVideo();
                        });
        });
        
        $('#replayAll').click(function(){
                        var videoArray = getAllVideosOnPage();        
                        $.each(videoArray, function(index, value) {
                                        handler = document.getElementById(value.id);
                                        handler.seekTo(0);
                                        handler.playVideo();
                        });
        });
        
        $('.delete').click(function(){
					 handler = $(this).parent().parent();
                        handler.remove();
        });
        
        $('.vol').click(function(){
                        handler = getVideoObject($(this));
						
						
                        var volumeVal = $(this).parent().find('.volume').val();
                        if(volumeVal>100){
                                volumeVal=100;
                        }else if(volumeVal<0){
                                volumeVal=0;
                        }
                        setVideoVolume(handler, volumeVal);
        });
        
        $('.addSearchedVideo').click(function(){
                        addVideoProcedure($(this).find('span').attr('id'));
                        $('#searchBox').hide();
                        $('#noAdded').hide();
        });
		
		//Save Button
		$('#save').click(function(){
                        var videoArray = getAllVideosOnPage();        
                        $.each(videoArray, function(index, value) {
                                        handler = document.getElementById(value.id);
                                        handler.seekTo(0);
                                        handler.playVideo();
                        });
        });
		
		$('.bubbleInfo').each(function () {
            var distance = 10;
            var time = 250;
            var hideDelay = 500;

            var hideDelayTimer = null;

            var beingShown = false;
            var shown = false;
            var trigger = $('.trigger', this);
            var info = $('.popup', this).css('opacity', 0);


            $([trigger.get(0), info.get(0)]).mouseover(function () {
                if (hideDelayTimer) clearTimeout(hideDelayTimer);
                if (beingShown || shown) {
                    // don't trigger the animation again
                    return;
                } else {
                    // reset position of info box
                    beingShown = true;

                    info.css({
                        top: -90,
                        left: -33,
                        display: 'block'
                    }).animate({
                        top: '-=' + distance + 'px',
                        opacity: 1
                    }, time, 'swing', function() {
                        beingShown = false;
                        shown = true;
                    });
                }

                return false;
            }).mouseout(function () {
                if (hideDelayTimer) clearTimeout(hideDelayTimer);
                hideDelayTimer = setTimeout(function () {
                    hideDelayTimer = null;
                    info.animate({
                        top: '-=' + distance + 'px',
                        opacity: 0
                    }, time, 'swing', function () {
                        shown = false;
                        info.css('display', 'none');
                    });

                }, hideDelay);

                return false;
            });
        });
    
}

//Turns Time (e.g. 1:30) to Seconds (90)
function timeToSeconds(time) {
	var seconds = 0;

	if (countCharOccurance(time, ':') > 1){
	
		arr = time.split(':');
		hour = parseInt(arr[0]);
		min  = parseInt(arr[1]);
		sec  = parseInt(arr[2]);
			//alert ((hours * 3600) + (min * 60) + sec);
		seconds = (hour * 3600) + (min * 60) + sec;
		}
	else {
		arr = time.split(':');
		min  = parseInt(arr[0]);
		sec  = parseInt(arr[1]);
			//alert ((min * 60) + sec);
		seconds = (min * 60) + sec;
	}
	
	return seconds;	
}

function supports_html5_storage() {
	try {
		alert ('Local storage availible');
		return 'localStorage' in window && window['localStorage'] !== null;
	} catch (e) {
		alert ('Local storage not availible');
		return false;
	}
}

function durationToTime(secs, format){

 var hr = Math.floor(secs / 3600);
var min = Math.floor((secs - (hr * 3600))/60);
var sec = Math.floor(secs - (hr * 3600) - (min * 60));
 
if (hr < 10) { hr = "0" + hr; }
if (min < 10) { min = "0" + min; }
if (sec < 10) { sec = "0" + sec; }
if (hr) { hr = "00"; }
 
if (format != null) {
var formatted_time = format.replace('hh', hr);
formatted_time = formatted_time.replace('h', hr*1+""); // check for single hour formatting
formatted_time = formatted_time.replace('mm', min);
formatted_time = formatted_time.replace('m', min*1+""); // check for single minute formatting
formatted_time = formatted_time.replace('ss', sec);
formatted_time = formatted_time.replace('s', sec*1+""); // check for single second formatting
return formatted_time;
} 
else {
return hr + ':' + min + ':' + sec;
}

}


function countCharOccurance(stringToCount, characterToCount){
	var counter = 0;
	var myArray = stringToCount.toLowerCase().split('');
	for (i=0;i<myArray.length;i++)
	{
		if (myArray[i] == characterToCount)
		{
			counter++;
		}
	}
	return counter;
}

 function getYouTubeInfo(key) {
			try{
                $.ajax({
                        url: "http://gdata.youtube.com/feeds/api/videos/"+key+"?v=2&alt=json",
                        dataType: "jsonp",
                        success: function (data) { parseresults(data); }
                });
				
				}
				  
			catch(err)
				  {  txt="There was an error on this page.\n\n";
				  txt+="Error description: " + err.message + "\n\n";
				  txt+="Click OK to continue.\n\n";
				  alert(txt);
				  }
		}

        function parseresults(data) {
                var title = data.entry.title.$t;
                 var description = data.entry.media$group.media$description.$t;
                // var viewcount = data.entry.yt$statistics.viewCount;
                // var author = data.entry.author[0].name.$t;
                $('#title').text(title);
				$('#infoPanel').text(description);
                // $('#description').html('<b>Description</b>: ' + description);
                // $('#extrainfo').html('<b>Author</b>: ' + author + '<br/><b>Views</b>: ' + viewcount);
                // getComments(data.entry.gd$comments.gd$feedLink.href + '&max-results=50&alt=json', 1);
        }

        // function getComments(commentsURL, startIndex) {
                // $.ajax({
                        // url: commentsURL + '&start-index=' + startIndex,
                        // dataType: "jsonp",
                        // success: function (data) {
                        // $.each(data.feed.entry, function(key, val) {
                                // $('#comments').append('<br/>Author: ' + val.author[0].name.$t + ', Comment: ' + val.content.$t);
                        // });
                        // if ($(data.feed.entry).size() == 50) { getComments(commentsURL, startIndex + 50); }
                        // }
                // });
        // }
