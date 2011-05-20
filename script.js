$(document).ready(init);
var videoArray = [];
var currentSlide = 0;
var videoData = '';
var vimeoEmbedP1 = '<iframe src="http://player.vimeo.com/video/'
var vimeoEmbedP2 = '?title=0&amp;byline=0&amp;portrait=0" width="640" height="360" frameborder="0"></iframe>'

function init(){
	//empty the unordered list to start with a clean slate 
	$('#slider ul').empty() 
	
	//bind the button actions
	$('#plus').bind('click',plus); 
	$('#minus').bind('click',minus);
	
	//go get the vimeo user data > then call function gotVideos to handle results
	$.ajax({
	  url: 'http://localhost/vimeo_test/getPage.php',
	  success: gotVideos,
	  dataType: 'json'
	})
	console.log('currentslide > '+ currentSlide)
}

function gotVideos(stuff){
	number = stuff.length //store value to speed up loop
	for(i = 0; i< number; i++){
		//store the id and thumbnail adresses for easy handling
		id = stuff[i].id;
		thumb = stuff[i].thumbnail_large;
		$('#slider ul').append('<img class="vimeoThumb" src="'+thumb+'"/>');
	}
	
}

function plus(){
	currentSlide++
	if(currentSlide > 20){currentSlide = 0}
	console.log('next > '+ currentSlide)
}

function minus(){
	currentSlide--
	if(currentSlide < 0){currentSlide = 20}
	console.log('back > '+ currentSlide)
}