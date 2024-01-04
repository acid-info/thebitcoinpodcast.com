/*
 * 	Ribbon Slider 1.0 - jQuery plugin
 *	written by Ihor Ahnianikov	
 *  http://ahnianikov.com
 *
 *	Copyright (c) 2012 Ihor Ahnianikov
 *
 *	Built for jQuery library
 *	http://jquery.com
 *
 */
 
(function($) {
	$.fn.ribbonSlider = function (options) {
		var options = jQuery.extend ({
			speed: 300,
			pause: 0,
			handlePlayer: true,
			showControls: true,
			mousewheel: true
		}, options);
		
		var slider=$(this);
		var slides=$(this).find('li');
		var ribbon=$(this).find('ul');
		var sliderWidth=slider.width();
		var ribbonWidth=ribbon.width();
		var disabled=false;		
		var autoSlide;
		
		function setWidth() {
			var ribbonWidth=0;
			slides.each(function() {
				ribbonWidth+=$(this).outerWidth(true);
			});			
			ribbon.width(ribbonWidth);
		}
		
		function setCurrentSlide(slide) {
			slides.removeClass('current');
			slide.addClass('current');
		}
		
		function checkLimit() {
			slider.parent().removeClass('limit-left limit-right');
			if(ribbon.position().left>=0) {
				slider.parent().addClass('limit-left');
			} else if(ribbon.position().left<=sliderWidth-ribbonWidth) {
				slider.parent().addClass('limit-right');
				return false;
			}
			return true;
		}
		
		function addControls() {	
			//add controls
			slider.parent().append('<a class="arrow arrow-left" href="#"></a><a class="arrow arrow-right" href="#"></a>');
			
			//handle controls
			slider.parent().find('.arrow').click(function() {	
				if($(this).hasClass('arrow-left')) {
					animate(slides.filter('.current').prev('li'));
				} else {				
					animate(slides.filter('.current').next('li'));
				}
				
				return false;
			});
		}
		
		function addInterface() {
			//mousewheel support
			if ($.isFunction($.fn.mousewheel) && options.mousewheel) {
				slider.mousewheel(function(event, delta) {
					if(delta>0) {
						animate(slides.filter('.current').prev('li'));
					} else {
						animate(slides.filter('.current').next('li'));
					}
					
					clearInterval(autoSlide);					
					return false;
				});
			}
			
			//draggable support
			if ($.isFunction($.fn.draggable)) {
				ribbon.draggable({ axis: 'x', drag: function() {
					if(disabled) {
						return false;
					}
				
					if(ribbon.position().left>0 || (ribbonWidth+ribbon.position().left)<sliderWidth) {
						disabled=true;
						
						//limit position
						var limitPos=-(ribbonWidth-sliderWidth);						
						if(ribbon.position().left>0) {
							limitPos=0;
						}
						
						ribbon.animate({ left: limitPos }, options.speed, function() {							
							disabled=false;
							
							//check limit
							checkLimit();
						});
					}
				
					//find current slide
					var slideIndex=0;
					slides.each(function() {
						if($(this).position().left>-ribbon.position().left) {
							slideIndex=$(this).index();
							return false;					
						}
					});
					
					//set current slide
					setCurrentSlide(slides.filter(':eq('+slideIndex+')'));
					
					//stop rotation
					clearInterval(autoSlide);
					
				}, stop: function() {
					//check limit
					checkLimit();
				}
				});
			}			
		}
		
		function animate(slide) {
			//disable slider
			if (disabled==true || slide.length==0) {
				return;
			}
			
			//set step
			var step=slide.position().left;			
			if((ribbonWidth-step)<sliderWidth) {
				step=ribbonWidth-sliderWidth;
			}
			
			//animate slider
			ribbon.stop().animate({ left: -step }, options.speed, function() {
				//set current slide
				if((ribbonWidth-step)>sliderWidth) {
					setCurrentSlide(slide);			
				}
				
				//check limit
				checkLimit();
				
				disabled=false;
			});			
		}
		
		//rotate slider
		function rotate() {			
			autoSlide=setInterval(function() {
				if(checkLimit()) {
					animate(slides.filter('.current').next('li'));
				} else {				
					animate(slides.filter(':first-child'));
				}
			},options.pause);
			
			slider.add(slider.parent().find('.arrow')).click(function() {
				clearInterval(autoSlide);
			});
		}
	 
		function init() {		
			//set first slide
			slides.filter(':first').addClass('current');
		
			//set ribbon width
			setWidth();
			
			//add slider controls
			if(options.showControls) {
				addControls();
			}
						
			//add devices interface
			addInterface();
			
			//rotate
			if(options.pause!=0) {
				rotate();
			}
		}
		
		function resizeSlider() {
			setWidth();
			sliderWidth=slider.width();
			ribbonWidth=ribbon.width();
		}
		
		//init slider
		init();
		
		//window resize event
		$(document).ready(function() {
			resizeSlider();			
		});
	}
})(jQuery);