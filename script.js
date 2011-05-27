$(document).ready(init);
var totalNumOfVids;
var displayListArr = []; //used to hold variables
var currentSlide = 0; //index for current slide
var videoData, direction; //stores the ajax response
var vimeoEmbedStr = '<iframe id="iframe_XXX" src="http://player.vimeo.com/video/XXX?title=0&amp;byline=0&amp;portrait=0&amp;autoplay=1&amp;api=1&amp;player_id=XXX" width="XXX" height="XXX" frameborder="0"></iframe>'
var vimArr = vimeoEmbedStr.split('XXX'); //holds the strings for the videos to be embedded
vimeoEmbedStr = ''; //clears out variable after it has been used

function init(){
	
	
	//bind the button actions
	$('#plus').bind('click',plus); 
	$('#minus').bind('click',minus);
	
	//go get the vimeo user data > then call function gotVideos to handle results
	$.ajax({
	  url: 'http://localhost/vimeo_test/getPage.php',
	  success: gotVideos,
	  dataType: 'json'
	});
	console.log('currentslide > '+ currentSlide);
}

function gotVideos(dataReturned){
	//store the data returned from ajax call in global variable
	videoData = dataReturned;
	totalNumOfVids = videoData.length
	//empty the unordered list to start with a clean slate 
	$('#slider ul').empty;
	//set the width of the display area such that it can hold three slides
	$('#slider ul').width(3*640);
	//move the display area over one space so that we will see the middle of it at the beginning
	$('#unorderedList').css( "left", "-640" );
	
	//add the correct set of video to the display area
	determineDisplatList();//determine which videos need to be added
	//add those items to the display area
	for(r=0;r<3;r++){
		id = videoData[displayListArr[r]].id;
		thumb = videoData[displayListArr[r]].thumbnail_large;
		$('#slider ul').append('<li class="vimeoThumb" ><img class="vimeo_'+id+' index_'+(displayListArr[2])+'" src="'+thumb+'"/></li>');
	}
	//bind the playVideo function to the display area, that way it is not neccessary to bind each item as it is added and removed
	$('#slider').bind('click',playVideo);
	
	
	
};

//used to keep track of what should be on the display area
function determineDisplatList(){ 
	//if the currentSlideNumber gets too large or too small make it go back to the beginning or end
	if(currentSlide > totalNumOfVids-1){currentSlide = 0};
	if(currentSlide < 0){currentSlide = totalNumOfVids-1};
	
	displayListArr[0] = currentSlide-1;
	if(displayListArr[0] == -1){
		displayListArr[0] = totalNumOfVids-1;
	};
	displayListArr[1] = currentSlide;
	displayListArr[2] = currentSlide+1;
	if(displayListArr[2] == totalNumOfVids){
		displayListArr[2] = 0;
	};
	console.log('display list = '+displayListArr);
};

function playVideo(clickEvent){

	idNumber = "";
	clickEvent.target;
	var classes = clickEvent.target.classList;
	for(n=0;n<classes.length;n++){
		if(classes[n].match( /vimeo_[0-9]{8}/)){
			thisClass = classes[n];
			idNumber = thisClass.substr(thisClass.indexOf('_')+1);
			//console.log('idNumber > '+ idNumber)
			embedVideo(idNumber);
		};
	};
	
	function embedVideo(idNumber){
		//to account for letterboxing of the video I make sure to get the videos at the height and width of the cotaining object
		height = $('.vimeo_'+idNumber).height();
		width = $('.vimeo_'+idNumber).width();
		//embed the video with the array of string values created when script first loads
		$('.vimeo_'+idNumber).replaceWith(vimArr[0]+currentSlide+vimArr[1]+idNumber+vimArr[2]+currentSlide+vimArr[3]+width+vimArr[4]+height+vimArr[5]);
	};
	
	var head= document.getElementsByTagName('head')[0];
	var script= document.createElement('script');
	script.type= 'text/javascript';
	script.src= 'froogaloop.min.js';
	head.appendChild(script);
	
	
};
//need to find out how to handle pausing the video when user clicks next or back
//http://vimeo.com/api/docs/player-js

function plus(){ // next/right
	pauseVideo();
	currentSlide++;
	determineDisplatList();
	console.log('next > '+ currentSlide);
	direction = 1;
	advanceSlides();
}

function minus(){ // back/left
	pauseVideo();
	currentSlide--;
	determineDisplatList();
	console.log('back > '+ currentSlide);
	direction = 0;
	advanceSlides();
}

function pauseVideo(){
	if(document.getElementById('iframe_'+currentSlide)){
		iframe = document.getElementById('iframe_'+currentSlide);
		iframe.api("api_pause");
		console.log('video found playing');
		
		//iframe.postMessage({"method": "pause"});
	}
}

function advanceSlides(){

	if(direction == 1){ //going to right
		
		//store the values of the variables for easy use
		id = videoData[displayListArr[2]].id;
		thumb = videoData[displayListArr[2]].thumbnail_large;
		
		//add the new list item at the right. this does not affect the items the user can see
		$('#slider ul').append('<li class="vimeoThumb" ><img class="vimeo_'+id+' index_'+(displayListArr[2])+'" src="'+thumb+'"/></li>');
		//then remove the item on the far left this makes everything appear to shift 640 pixels left
		$("#slider ul li:first-child").remove();
		//to account for this add move everything 640 pixels right from the -640 the ul is normally at.
		$('#unorderedList').css( "left", "0" );
		//and slowly move the old item to the right
		$('#unorderedList').animate({"left": "-=640px"}, "slow", "easeInOutQuad");
		
	}else{ //going to left
	
		//store the values of the variables for easy use
		id = videoData[displayListArr[0]].id;
		thumb = videoData[displayListArr[0]].thumbnail_large;
		
		//add the new list item at the left. this pushes them all to the right
		$('#slider ul').prepend('<li class="vimeoThumb" ><img class="vimeo_'+id+' index_'+(displayListArr[0])+'" src="'+thumb+'"/></li>');
		//to account for this we need to take off 640 pixel on the left in addition to the 640 we took off earlier
		$('#unorderedList').css( "left", "-1280" );
		//remove the last item in the list. this does not affect anything the user can see.
		$("#slider ul li:last-child").remove();
		//now slowly move the display are over to show the new item
		$('#unorderedList').animate({"left": "+=640px"}, "slow", "easeInOutQuad");
		
	}
	
};