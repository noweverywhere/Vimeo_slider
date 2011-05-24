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
	numberOfVids = stuff.length //store value to speed up loop
	for(i = 0; i< numberOfVids; i++){
		//store the id and thumbnail adresses for easy handling
		id = stuff[i].id;
		thumb = stuff[i].thumbnail_large;
		$('#slider ul').append('<li class="vimeoThumb" ><img class="'+id+' banana" src="'+thumb+'"/></li>');
	}
	$('#slider ul li').bind('click',playVdeo);
	
	//[0-9]{8}

	
}

function playVdeo(clickEvent){
		console.log(clickEvent)
		console.log(clickEvent.target.classList)
		var classes = clickEvent.target.classList
		for(n=0;n<classes.length;n++){
			if(classes[n].match([0-9]{8})){
				clickEvent.
			}
		}
		console.log(clickEvent.target.className)
		//console.log(this.attr("class"))
		//target.attr('class')
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