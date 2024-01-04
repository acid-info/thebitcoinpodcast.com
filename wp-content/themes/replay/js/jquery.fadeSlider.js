/*
 * 	Fade Slider 1.0 - jQuery plugin
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
	$.fn.fadeSlider = function (options) {
		var options = jQuery.extend ({
			speed: 400,
			pause: 0
		}, options);
	 
		var slider=$(this);
		var list=$(this).children('ul');
		var disabled=false;
		var autoSlide;
		var arrows=slider.parent().parent().find('.arrow');
		
		//build slider sliderect
		function init() {
		
			//set slides dimensions
			list.children('li').hide();
			
			//show first slide
			list.find('li:first-child').addClass('current').show();
			
			//arrows
			if(slider.parent().hasClass('main-fade-slider')) {
				arrows=slider.parent().find('.arrow');
			}
			
			arrows.click(function() {
				//next slide
				if($(this).hasClass('arrow-left')) {
					animate('left');
				} else {
					animate('right');
				}

				//stop slider
				clearInterval(autoSlide);
			});
			
			//rotate slider
			if(options.pause!=0) {	
				rotate();
			}
		}
		
		//rotate slider
		function rotate() {			
			autoSlide=setInterval(function() { animate('right') },options.pause);
		}
				
		//show next slide
		function animate(direction) {
		
			if(disabled) {
				return;
			} else {
				//disable animation
				disabled=true;
			}			
			
			//get current slide
			var currentSlide=list.children('li.current');
			var nextSlide;
			
			//get next slide for current direction
			if(direction=='left') {
				if(list.children('li.current').prev('li').length) {
					nextSlide=list.children('li.current').prev('li');
				} else {
					nextSlide=list.children('li:last-child');
				}
			} else {
				if(list.children('li.current').next('li').length) {
					nextSlide=list.children('li.current').next('li');
				} else {
					nextSlide=list.children('li:first-child');
				}				
			}
			
			//animate slider height
			list.animate({'height':nextSlide.outerHeight()},options.speed);
			
			//stop all videos
			if(list.find('iframe').length) {
				list.find('iframe').each(function() {
					callPlayer($(this).parent().attr('id'),'pauseVideo');
				});
			}
			
			//animate slides
			nextSlide.css({'position':'absolute','z-index':'2'}).fadeIn(options.speed, function() {
			
				//set current slide class
				currentSlide.hide().removeClass('current');
				nextSlide.addClass('current').css({'position':'relative', 'z-index':'1'});	
					
				//enable animation
				disabled=false;
			});
		
		}
		
		//Control Video
		function callPlayer(frame_id, func, args) {
			if (window.jQuery && frame_id instanceof jQuery) frame_id = frame_id.get(0).id;
			var iframe = document.getElementById(frame_id);
			if (iframe && iframe.tagName.toUpperCase() != 'IFRAME') {
				iframe = iframe.getElementsByTagName('iframe')[0];
			}

			if (!callPlayer.queue) callPlayer.queue = {};
			var queue = callPlayer.queue[frame_id],
				domReady = document.readyState == 'complete';

			if (domReady && !iframe) {
				window.console && console.log('callPlayer: Frame not found; id=' + frame_id);
				if (queue) clearInterval(queue.poller);
			} else if (func === 'listening') {
				if (iframe && iframe.contentWindow) {
					func = '{"event":"listening","id":' + JSON.stringify(''+frame_id) + '}';
					iframe.contentWindow.postMessage(func, '*');
				}
			} else if (!domReady || iframe && (!iframe.contentWindow || queue && !queue.ready)) {
				if (!queue) queue = callPlayer.queue[frame_id] = [];
				queue.push([func, args]);
				if (!('poller' in queue)) {
					queue.poller = setInterval(function() {
						callPlayer(frame_id, 'listening');
					}, 250);
					messageEvent(1, function runOnceReady(e) {
						var tmp = JSON.parse(e.data);
						if (tmp && tmp.id == frame_id && tmp.event == 'onReady') {
							clearInterval(queue.poller);
							queue.ready = true;
							messageEvent(0, runOnceReady);

							while (tmp = queue.shift()) {
								callPlayer(frame_id, tmp[0], tmp[1]);
							}
						}
					}, false);
				}
			} else if (iframe && iframe.contentWindow) {
				if (func.call) return func();
				iframe.contentWindow.postMessage(JSON.stringify({
					"event": "command",
					"func": func,
					"args": args || [],
					"id": frame_id
				}), "*");
			}
			function messageEvent(add, listener) {
				var w3 = add ? window.addEventListener : window.removeEventListener;
				w3 ? w3('message', listener, !1) : (add ? window.attachEvent : window.detachEvent)('onmessage', listener);
			}
		}
		
		//resize slider
		function resize() {
			list.height(list.find('li.current').outerHeight());
		}
		
		//init slider
		init();	
		
		//window resize event
		$(window).bind('load resize', function() {
			resize();
		});
	}
})(jQuery);