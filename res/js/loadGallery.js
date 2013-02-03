$(document).ready(function()
{
	//Check for webkit else fall back to default gallery
	if($.layout.name == 'webkit')
	{
		$('body').append('<div id="caption" class="caption">Arrow keys to move,Space toggles magnify, V to vote</div>');
		//Retrieve Images from Database
		$.ajax({
				url: 'res/scripts/getImage.php', 
				type: 'POST',
				data: {
					param  : 'Load',
					browser: $.layout.name,
				},
				success: function(result)
			    {
			    	snowstack_init(JSON.parse(result));
			    }
		});
	}
	else
	{
		//Some parameters
		var scrollPosition;
		var n 		  = 0;
		var endOfFile = false;
		var ImageCounter = 0;
		var ImageArrayComplete = new Array();
		var UserArrayComplete = new Array();
		var divImgContainer =  '<div id="imgContainer">';
		var divInfo 		= '<div id="info">';
		var divDetails 		= '<div id="details">';
		var divImage 		= '<div id="image">';
		//Get page details
		var contentHeight = document.getElementById('container').offsetHeight;
		var pageHeight = document.documentElement.clientHeight;

		//Load Initial Images
		$.ajax({
			    url: 'res/scripts/getImage.php', 
			    type: 'POST',
			    data: {
					param  : 'Load',
					browser: 'others',
					count  : n
				},
			    success: function(result)
			    {
			    	$ImageArray = JSON.parse(result);
			    	for(i=0; i<$ImageArray.length; i++)
			    	{
	                    document.getElementById("container").innerHTML += divImgContainer+divInfo+divDetails+$ImageArray[i].title+'</div><div class = "vote" id ="vote-'+i+'"></div></div>'+divImage+'<a href="'+$ImageArray[i].zoom +'"><img src="'+$ImageArray[i].thumb+'" /></a></div></div>';
	                    ImageArrayComplete[ImageCounter] = $ImageArray[i].image;
	                    UserArrayComplete[ImageCounter]  = $ImageArray[i].user;
	                    ImageCounter++;
	                }
	                if($ImageArray.length<12)endOfFile = true;
			    }
			});
		$(window).scroll(function() 
		{
	   		if($(window).scrollTop() + $(window).height() == $(document).height() && !endOfFile)
	   		{
	   			n += 12;
	       		$.ajax({
			    		url: 'res/scripts/getImage.php', 
			    		type: 'POST',
			    		data: {
							param  : 'Load',
							browser: 'others',
							count  : n
					},
				    success: function(result)
				    {
				    	$ImageArray = JSON.parse(result);
				    	if($ImageArray[$ImageArray.length-1].EOF == "true") endOfFile = true;
				    	for(i=0; i<$ImageArray.length; i++)
			    		{
	                    	document.getElementById("container").innerHTML += '<div id="imgContainer"><div id="info"><div id="details">'+$ImageArray[i].title+'</div><div class = "vote" id ="vote-'+i+'"></div></div><div id="image"><a href="'+$ImageArray[i].link +'"><img src="'+$ImageArray[i].thumb+'" /></a></div></div>';
	                    	ImageArrayComplete[ImageCounter] = $ImageArray[i].image;
	                    	UserArrayComplete[ImageCounter]  = $ImageArray[i].user;
	                    	ImageCounter++;
	                	}
				    }
				});
	   		}
	   		if($(window).scrollTop() < 100){
	   			$('#scroll').css("display","none");
	   		}
	   		else if($(window).scrollTop() > 400){
	   				$("#scroll").css("display", "block");
			}
		});
	}
	$('#container').on('click', '.vote', function(e){
    		$.ajax({
			    		url: 'res/scripts/getImage.php', 
			    		type: 'POST',
			    		data: {
			    			param: 'Vote',
			    			user : UserArrayComplete[e.target.id.split("-")[1]],
			    			image: ImageArrayComplete[e.target.id.split("-")[1]]
			    		},
			    		success: function(result)
			    		{
			    			alert(result);
			    		}
				});
		});
});