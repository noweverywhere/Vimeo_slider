(function ($) {
    $.fn.slider = function (options) {
	
        var $this = this;
        var settings = {
            'width'			: this.width(),
            'height'		: this.height(),
            'wait'			: 10000,
            'transition'	: 750,
            'direction'		: 'left',
            'showControls'	: true,
            'showProgress'	: true,
            'hoverPause'	: true,
            'autoplay'		: true,
			'slidesInDom'	: 5
        },
		slider_div,
		oldest_display_item,
		_timer = false,
		counter = 0,
		domCopy,
		totalNumOfChildren,
		displayItemsHolder = [],
		displayListArr = [], //used to hold variables
		currentSlide = 0, //index for current slide
		videoData, 
		direction, 
		vimeoEmbedStr = '<iframe id="iframe_XXX" src="http://player.vimeo.com/video/XXX?title=0&amp;byline=0&amp;portrait=0&amp;autoplay=1&amp;api=1&amp;player_id=XXX" width="XXX" height="XXX" frameborder="0"></iframe>',
		vimArr = vimeoEmbedStr.split('XXX'), //holds the strings for the videos to be embedded
		vimeoEmbedStr = ''; //clears out variable after it has been used

		//console.log(this) 
		
		var _init =  function(){
		
		
			var iframes = $('iframe')
			for(var c = 0; c < iframes.length; c++){
				var thisIframe = iframes[c]
				var srcString = thisIframe.src
				if(srcString.match( /vimeo.com\/video\/[0-9]{8}/)){

					idNumber = srcString.match( /\d{8}/ )
					$('iframe:eq('+c+')')
						.attr({ 
							'id' 		: 'vim_'+idNumber,
							'height'	: 360,
							'width'		: settings.width
						})
						
					
				}
			}
		
			if (options) {
				$.extend(settings, options);
			}
			
			//console.log($this)
			
			
			
			//bind the button actions
			/*$('#vs_plus').bind('click',_plus); 
			$('#vs_minus').bind('click',_minus);*/
			 if (settings.hoverPause) {
				$this.bind({
					'mouseenter': function () {
						$this.addClass('jquery-slider-paused')
						$(".jquery-slider-control").css("opacity","1");
						clearTimeout(_timer);
					},
					'mouseleave': function () {
						$this.removeClass('jquery-slider-paused');
						$(".jquery-slider-control").css("opacity","0");
						if (settings.autoplay) {
							_timer = setTimeout(_cycle, settings.wait);
						}
					}
				});
            }
			var positionEls = $('<span class="jquery-slider-pages"></span>');
			slider_div = $('<div id="slider_elements_holder"> </div>');
			slider_div
				.width(3*settings.width)
				.height(settings.height)
			
			totalNumOfChildren = $this.children().size();
		//	console.log('totalNumOfChildren '+totalNumOfChildren)
			
			$this.children().each(function () {
				
			/*	console.log('$(this)')
				console.log($(this))
				console.log('^^^')*/
				
				
				
				var thisItem = $(this)
				thisItem.addClass('rel_'+counter)
				var title = thisItem.attr('alt')
				
				/*console.log('thisItem')
				console.log(thisItem)
				console.log('55555555')*/
				
				thisItem.addClass('jquery-slider-element');
				//slider_div.append(thisItem);
				displayItemsHolder.push(thisItem);
				positionEls.append('<span rel="'+counter+'" title="'+title+'" class="jquery-slider-page rel_'+counter+'"></span>');
				counter++
			});
			/*console.log('displayListArr')
			console.log(displayListArr)
			console.log('^^^^^^^^^^^^^^^^')*/
			$this.empty()
			$this.append(slider_div)
			
			 $this.addClass('jquery-slider').width(settings.width).height(settings.height);
			console.log('currentslide > '+ currentSlide);
			if (settings.showProgress) {
				
				$this.append(positionEls);
				$('.jquery-slider-page')
					.css({'border':'solid red 2px'})
					.bind('click',function(evt){
						alert('clicked it')
						_jumpSlide(evt)
					})
			}
			 if (settings.showControls) {
				var controlPrev = $('<span class="jquery-slider-control jquery-slider-control-prev prev_btn"></span>').bind('click', function () {
					_prev();
				});
				var controlNext = $('<span class="jquery-slider-control jquery-slider-control-next next_btn"></span>').bind('click', function () {
					_next();
				});
				$this.append(controlPrev);
				$this.append(controlNext);
				
			}
			
			_determineDisplayList();
			_setupDisplay();
			
		}
		
		var _jumpSlide = function(event){
			
			for(x = 0;x < event.currentTarget.classList.length; x++){
				if(event.currentTarget.classList[x].match(/rel_[0-9]{1,2}/i))
				currentSlide = parseInt(event.currentTarget.classList[x].match(/[0-9]/))
			}
			
			_determineDisplayList
			
			
		}
		
		var _setupDisplay = function(){
			for( n = 0; n < displayListArr.length; n++){
				slider_div
					.append(displayItemsHolder[displayListArr[n]])
					
			}
			slider_div.css({'left':settings.width*-1});
			console.log()
			$('.jquery-slider-page:nth-child(' + currentSlide+1 + ')').addClass('jquery-slider-page-current');
			
		}

		//used to keep track of what should be on the display area
		var _determineDisplayList = function (){ 
			//if the currentSlideNumber gets too large or too small make it go back to the beginning or end
			if(currentSlide > totalNumOfChildren-1){currentSlide = 0};
			if(currentSlide < 0){currentSlide = totalNumOfChildren-1};
			
			displayListArr[0] = currentSlide-1;
			if(displayListArr[0] == -1){
				displayListArr[0] = totalNumOfChildren-1;
			};
			displayListArr[1] = currentSlide;
			displayListArr[2] = currentSlide+1;
			if(displayListArr[2] == totalNumOfChildren){
				displayListArr[2] = 0;
			};
			console.log('display list = '+displayListArr);
		};

	var  _playVideo	= function (clickEvent) {

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
			
			//adds the froogaloop javascript library to commnicate with the iframe object.
			var head = document.getElementsByTagName('head')[0];
			var script= document.createElement('script');
			script.type= 'text/javascript';
			script.src= 'froogaloop.min.js';
			head.appendChild(script);
			
			
		};
		//need to find out how to handle pausing the video when user clicks next or back
		//http://vimeo.com/api/docs/player-js

	var _next = function () { // next/right
			pauseVideo();
			$this.stop( true , true )
			oldest_display_item = displayListArr[0];
			console.log('oldest_display_item: '+oldest_display_item)
			console.log($('.rel_'+oldest_display_item+'.jquery-slider-element'))
			$('.rel_'+oldest_display_item+'.jquery-slider-element').remove()
			currentSlide++;
			_determineDisplayList();
			console.log('next > '+ currentSlide);
			direction = 1;
			advanceSlides();
		}

	var _prev = function () { // back/left
			pauseVideo();
			$this.stop( true , true )
			currentSlide--;
			_determineDisplayList();
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
			/*	id = videoData[displayListArr[2]].id;
				thumb = videoData[displayListArr[2]].thumbnail_large;*/
				
				//add the new list item at the right. this does not affect the items the user can see
				slider_div.append(displayItemsHolder[displayListArr[2]]);
				//then remove the item on the far left this makes everything appear to shift 640 pixels left

				/*console.log($("#slider_elements_holder").children()[0])
				$("#slider_elements_holder").children()[0].remove()*/
				
				console.log($("#slider_elements_holder:first-child"))
			//	$("#slider_elements_holder").children()[0].remove()
				
				//$("#slider_elements_holder:first-child").remove();
				console.log('PPPPPPPPPPPPPPPPPPPPP')
				//to account for this add move everything 640 pixels right from the -640 the ul is normally at.
				slider_div.css( "left", "0" );
				//and slowly move the old item to the right
				slider_div.animate({"left": "-=640px"}, "slow", "easeInOutQuad");
				
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
			 if (settings.showProgress) {
				$('.jquery-slider-page').removeClass('jquery-slider-page-current');
				console.log('currentSlide  >  '+currentSlide)
				$('.jquery-slider-page:nth-child(' + (currentSlide+1) + ')').addClass('jquery-slider-page-current');
			}
			
		}
		
		_init();
	};
})(jQuery);