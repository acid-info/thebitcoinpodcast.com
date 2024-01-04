//DOM Loaded
jQuery(document).ready(function($) {
	
	//Dropdown Menu
	$('.header .menu ul li').hoverIntent(
		function() {
			var menuItem=$(this);			
			menuItem.children('ul').slideToggle(300, function() {
				menuItem.addClass('hover');
			});
		},
		function() {
			var menuItem=$(this);
			menuItem.children('ul').slideToggle(300, function() {
				menuItem.removeClass('hover');
			});
		}
	);
	
	//Select Menu
	$('.select-menu select').fadeTo(0,0);
	$('.select-menu option').attr('selected','');
	
	$('.select-menu select').change(function() {
		window.location.href=$(this).find('option:selected').attr('value');
	});	
	
	if($('.page-title').length) {
		$('.select-menu span').text($('.page-title h1').text());
	} else {
		$('.select-menu span').text($('.select-menu select option:eq(0)').text());
	}
	
	$('.select-menu option').each(function(index,value) {
		if($(this).attr('value')==$(location).attr('href') || $(this).text()==$('.select-menu span').text()) {
			$(this).attr('selected','selected');
			$('.select-menu span').text($(this).text());
		}
	});
	
	//Audio Player
	if($('.featured-player').length) {			
		var autoplay=false;
		var playlist=[];
		var player=$('.featured-player');
		
		if($('.featured-player').find('.autoplay').val()=='true') {
			autoplay=true;
		}
		
		player.find('.playlist a').each(function() {
			playlist.push({
				title:$(this).text(),
				artist:$(this).attr('title'),
				mp3:$(this).attr('href')
			});
		});
		var myPlaylist = new jPlayerPlaylist({
			jPlayer: '#jquery_jplayer',
			cssSelectorAncestor: '#jp_container'
		}, playlist, {
			swfPath: template_directory+'js/jplayer/Jplayer.swf',
			supplied: 'mp3',
			solution: 'html,flash',
			wmode: 'window',
			playlistOptions: { autoPlay: autoplay }
		});		
		$.jPlayer.timeFormat.showHour = true;
		if(player.find('.button-container').hasClass('hidden')) {
			player.addClass('without-button');
		} else {
			player.addClass('with-button');
			player.find('.button').attr('href',player.find('.playlist a:first-child').attr('data-link'));
		}
		player.find('.container').show();
	}
	
	//Track Player
	$('.track-player').each(function() {
		audiojs.createAll({}, $(this).find('audio'));
	});
	
	$('.track-play-button').click(function() {
		var trackPlayer=$(this).parent().parent().next('tr');
		if($(this).hasClass('active')) {
			//hide player
			trackPlayer.hide();
		
			//stop playing
			if(trackPlayer.find('.audiojs').hasClass('playing') && trackPlayer.find('object').length==0) {
				trackPlayer.find('.pause').trigger('click');
			}			
		} else {	
			//hide and stop other players
			$('.track-play-button').removeClass('active');
			$('.track-player').hide();
			$('.audiojs').each(function() {
				if($(this).hasClass('playing') && trackPlayer.find('object').length==0) {
					$(this).find('.pause').trigger('click');
				}
			});
		
			//start playing
			if(trackPlayer.find('object').length==0) {
				trackPlayer.find('.play').trigger('click');
			}			

			//show player
			trackPlayer.fadeIn(700);
		}
		$(this).toggleClass('active');		
		return false;
	});

	//Ribbon Slider
	if($('.ribbon-slider').length) {
		var mousewheelScrolling=true;
		if($('.ribbon-slider input.slider-mousewheel').val()=='true') {
			mousewheelScrolling=false;
		}
		
		$('.ribbon-slider').ribbonSlider({
			speed:parseInt($('.ribbon-slider input.slider-speed').val()),
			pause:parseInt($('.ribbon-slider input.slider-pause').val()),
			mousewheel: mousewheelScrolling			
		});
	}	
	
	//Fade Slider
	if($('.fade-slider').length) {
		$('.fade-slider').each(function() {
			var sliderOptions={};
			if($(this).find('input.slider-speed').length) {
				sliderOptions.speed=parseInt($(this).find('input.slider-speed').val());
			}
			if($(this).find('input.slider-pause').length) {
				sliderOptions.pause=parseInt($(this).find('input.slider-pause').val());
			}
			$(this).fadeSlider(sliderOptions);
		});
	}	
	
	//Carousel Slider
	if($('.carousel-slider').length) {
		$('.carousel-slider').each(function() {
			$(this).easySlider({
				speed: 500,
				auto: false,
				continuous: true			
			});
		});
	}
	
	//Social Widget
	$('.pane.twitter').each(function() {
		twitterFetcher.fetch($(this).find('input.twitter-id').val(), 'widget-tweets', $(this).find('input.tweets-number').val(), true, false, false);
	});
	
	//Tabs
	if($('.tabs-container').length) {	
		$('.tabs-container').each(function() {
			
			var tabs=$(this);
		
			//show first pane
			tabs.find('.panes .pane:first-child').show();
			tabs.find('.tabs li:first-child').addClass('current');
			
			tabs.find('.tabs li').click(function() {
				//set active state to tab
				tabs.find('.tabs li').removeClass('current');
				$(this).addClass('current');
				
				//show current tab
				tabs.find('.pane').hide();
				tabs.find('.pane:eq('+$(this).index()+')').show();			
			});
		});		
		$('.tabs-container .tabs a').click(function() {
			$(this).parent().trigger('click');
			return false;
		});
	}
	
	//Placeholders
	var fields = $('input[type="text"],input[type="password"],textarea').get();
	$.each(fields, function(index, item){
		item = $(item);
		var defaultStr = item.val();
	
		item.focus(function () {
			var me = $(this);
			if(me.val() == defaultStr){
				me.val('');
			}
		});
		item.blur(function () {
			var me = $(this);			
			if(!me.val()){
				me.val(defaultStr);
			}
		});
	});
	
	//AJAX Form
	$('.ajax-form').each(function() {
		var form=$(this);
		
		form.submit(function() {
			var message=form.find('.alert'),
				button=form.find('.submit');
				
			var data={
					action: form.find('.action').val(),
					nonce: form.find('.nonce').val(),
					data: form.serialize(),
				}
						
			button.addClass('disabled');
			form.append('<div class="loader"></div>');
			message.slideUp(300);		
			
			$.post(form.attr('action'), data, function(response) {
				if($('.redirect', response).length) {
					if($('.redirect', response).attr('href')) {
						window.location.href=$('.redirect',response).attr('href');
					} else {
						window.location.reload();
					}
				} else {
					form.find('.loader').remove();
					button.removeClass('disabled');
					message.html(response).slideDown(300);
				}				
			});
			
			return false;
		});
	});
	
	//Submit Button
	$('.submit:not(.disabled)').click(function() {
		$(this).parent('form').submit();
		return false;
	});
	
	//Tip Cloud
	$('.tip-container .button').click(function() {
		var tipCloud=$(this).parent().find('.tip-cloud');

		$('.tip-cloud').hide();
		if(tipCloud.hasClass('outside')) {
			tipCloud=tipCloud.clone().appendTo($('body'));
			tipCloud.css({
				'left':$(this).offset().left-20,
				'top':$(this).offset().top+$(this).outerHeight()
			});
		}
		
		tipCloud.show().addClass('visible');		
		return false;
	});
	
	$('body').click(function() {
		$('.tip-cloud.visible').hide().removeClass('visible');
	});
	
	//Subscribe Widget	
	function subscribe() {
		var email=$('#subscribe_form input#email').val();
		var data = {
			action: 'themex_subscribe',
			email: email
		};
		
		//hide message
		$('.widget-subscribe .alert').slideUp(300);
		
		//post data to server		
		$.post(ajaxurl, data, function(response) {
			$(".widget-subscribe .alert-box").remove();
			$("#subscribe_form").before(response).slideDown(300);
		});
		
		return false;
	}
	
	if($('.widget-subscribe').length) {
		$('#subscribe_form .subscribe-button').click( function() { subscribe(); return false; } );
		$('#subscribe_form').submit( function() { subscribe(); return false; } );
	}
	
	//Widget Title
	$('.block-title').each(function() {
		if($(this).text()=='') {
			$(this).remove();
		}
	});
	
	//Comment Form
	$('div#respond').addClass('formatted-form');
	
	//Login Form
	$('a.login-link').click(function() {
		$('.login-form').stop().hide().fadeIn(200);
		return false;
	});
	
	$('.login-close-button').click(function() {
		$('.login-form').stop().fadeOut(200);
		return false;
	});
	
	$('.login-form form').submit(function() {
		var form=$(this);
		var message=$(this).parent().find('.alert');
		var data = {
			action: 'themex_login',
			user_login: form.find('#themex_username').val(),
			user_password: form.find('#themex_password').val(),
			nonce: form.find('#themex_nonce').val()
		};
		
		//hide message
		form.append('<div class="loader"></div>');
		message.slideUp(300);
		
		//post data to server		
		$.post(ajaxurl, data, function(response) {
			if(response.match('success') != null) {
				window.location.reload(true);
			} else {
				message.html(response).slideDown(300);
				form.find('.loader').remove();
			}			
		});
		
		return false;
	});
	
	//IE8 Browser Filter
	if (jQuery.browser.msie  && parseInt(jQuery.browser.version, 10) === 8) {
		jQuery('body').addClass('ie8'); 
		$('.featured-event:last-child, .featured-post:last-child, .footer-widgets .column:last-child, .subheader .menu ul ul li:last-child, .artist-social-links a:last-child,.releases-filter li:last-child').addClass('last-child');
	} else if(navigator.userAgent.indexOf('Chrome') == -1) {
		jQuery('body').addClass('webkit-browser');
	}
});