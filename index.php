<html>
<head>
	<meta charset="utf-8">
	<title>YouMIDItube</title>
	
	<script src="http://code.jquery.com/jquery-1.9.1.js"></script>
	<script type="text/javascript" src="https://www.google.com/jsapi"></script>
	<script language="JavaScript" type="text/javascript" src="js/javascript.js"></script>
	<link rel="stylesheet" type="text/css" href="css/youtubewank.css">


</head>
<body>

	<div id="searchBox"></div>
	<div id="essentials">

		<span>Insert Youtube key (http://www.youtube.com/<b>XYZ-ASD</b>)&nbsp; -> &nbsp;</span><input id="youtubekey" type="text" value="007VM8NZxkI">
		<button id="addVideo">add Video</button><br/>
		Or try a Search<input type="text" id="search" >
		<button id="go">Go</button>
		<br/>

		<button id="playAll">Play All</button>
		<button id="pauseAll">Pause All</button>
		<button id="replayAll">Replay All</button>
		<button id="save">Save</button>
	
	</div>


	<div id="tubes">
	<span id="noAdded">No Videos added</span>
	<table id="mainTable">
	</table>
	</div>
	
	

</body>

<script>
	pageLoad();
	</script>

</html>