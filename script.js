$(document).ready(init);
var displayListArr = []; //used to hold variables
var currentSlide = 0; //index for current slide
var videoData = ''; //stores the ajax response
var vimeoEmbedStr = '<iframe src="http://player.vimeo.com/video/XXX?title=0&amp;byline=0&amp;portrait=0&amp;autoplay=1" width="XXX" height="XXX" frameborder="0"></iframe>'
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
	})
	console.log('currentslide > '+ currentSlide)
}

function gotVideos(dataReturned){
	//store the data returned from ajax call in global variable
	videoData = dataReturned;
	
	//empty the unordered list to start with a clean slate 
	$('#slider ul').empty;
	
	//store value to speed up loop
	numberOfVids = dataReturned.length 
	for(i = 0; i< numberOfVids; i++){
		//store the id and thumbnail adresses for easy handling
		id = dataReturned[i].id;
		thumb = dataReturned[i].thumbnail_large;
		$('#slider ul').append('<li class="vimeoThumb" ><img class="vimeo_'+id+'" src="'+thumb+'"/></li>');
	
	
	//	$('.vimeo_'+id).load(function{ want to preload the images but will do that later
	//	});
	}
	
	$('#slider ul').width(dataReturned.length*640);
	$('#unorderedList').css( "left", "-640" );
	$('#slider').bind('click',playVdeo);
	determineDisplatList()
}

function determineDisplatList(){
	displayListArr[0] = currentSlide-1;
	if(displayListArr[0] == -1){
		displayListArr[0] = 
	}
	displayListArr[1] = currentSlide;
	displayListArr[2] = currentSlide+1;
	
}

function playVdeo(clickEvent){

	idNumber = "";
	clickEvent.target
	//console.log(clickEvent)
	var classes = clickEvent.target.classList
	for(n=0;n<classes.length;n++){
		if(classes[n].match( /vimeo_[0-9]{8}/)){
			thisClass = classes[n];
			idNumber = thisClass.substr(thisClass.indexOf('_')+1);
			//console.log('idNumber > '+ idNumber)
			embedVideo(idNumber)
		}
	}
	
	function embedVideo(idNumber){
		height = $('.vimeo_'+idNumber).height();
		width = $('.vimeo_'+idNumber).width();
		$('.vimeo_'+idNumber).replaceWith(vimArr[0]+idNumber+vimArr[1]+width+vimArr[2]+height+vimArr[3]);
	}
}

function plus(){
	currentSlide++
	if(currentSlide > 19){currentSlide = 0}
	console.log('next > '+ currentSlide)
	moveList()
}

function minus(){
	currentSlide--
	if(currentSlide < 0){currentSlide = 19}
	console.log('back > '+ currentSlide)
	movelist()
}

function movelist(){
	
}