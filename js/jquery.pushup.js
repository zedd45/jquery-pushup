/* 
 * Original Copyright
 * 
 * Pushup
 * Copyright (c) 2008 Nick Stakenburg (www.nickstakenburg.com)
 *
 * License: MIT-style license.
 * Website: http://www.pushuptheweb.com
 * Modified for jQuery by Stuart Loxton (www.stuartloxton.com)
 * 
 * * Modified for chrome version detection by Chris Keen (zedd45 at github)
 *   - TODO: refactor has.js / $.support for feature detection vs browser sniffing
 * 
 * Browser Detection Logic adapted from jQuery Migrate - v1.2.1 - 2013-05-08
 * https://github.com/jquery/jquery-migrate
 * Copyright 2005, 2013 jQuery Foundation, Inc. and other contributors; Licensed MIT
 */


(function ($) {
    
	// Cookie plugin based on the work of Peter-Paul Koch - http://www.quirksmode.org
	// TODO: augment w/ local storage, where available? 
    var Cookie = {
        set: function (name, value) {
            var expires = '', options = arguments[2] || {}, date;
            if (options.duration) {
                date = new Date();
                date.setTime(date.getTime() + options.duration * 1000 * 60 * 60 * 24);
                value += '; expires=' + date.toGMTString();
            }
            document.cookie = name + "=" + value + expires + "; path=/";
        },

        remove: function (name) { 
            this.set(name, '', -1);
        },

        get: function (name) {
            var cookies = document.cookie.split(';'), nameEQ = name + "=", i, l, c;
            for (i = 0, l = cookies.length; i < l; i++) {
                c = cookies[i];
                while (c.charAt(0) === ' ') {
                    c = c.substring(1, c.length);
                }
                if (c.indexOf(nameEQ) === 0) {
                    return c.substring(nameEQ.length, c.length);
                }
            }
            return null;
        }
    };

	var uaMatch = function() {
		var ua = navigator.userAgent.toLowerCase(),
			match;

		match = /(chrome)[ \/]([\w.]+)/.exec( ua ) ||
			/(webkit)[ \/]([\w.]+)/.exec( ua ) ||
			/(opera)(?:.*version|)[ \/]([\w.]+)/.exec( ua ) ||
			/(msie) ([\w.]+)/.exec( ua ) ||
			/(firefox)[ \/]([\w.]+)/.exec( ua ) ||
			[];

		return {
			browser: match[ 1 ] || "",
			version: match[ 2 ] || "0"
		};
	};
	
	var browserVersion = {
		firefox: false,
	    msie: false,
	    opera: false,
	    safari: false,
		chrome: false
	};



	// plugin starts here.
	
    $.pushup = {
	    Version: '1.2.0',
		UA: navigator.userAgent,
	    options: {
		    appearDelay: 0.5,
		    fadeDelay: 30,
		    images: '../images/pushup/',
		    message: 'Important browser update available',
		    reminder: {
			    hours: 8,
			    message: 'Remind me again in #{hours}'
		    }
	    },
	    activeBrowser: null,
	    
		updateLinks: {
		    msie: 'http://www.microsoft.com/windows/downloads/ie/',
		    firefox: 'http://www.getfirefox.com',
		    safari: 'http://www.apple.com/safari/download/',
		    opera: 'http://www.opera.com/download/',
			chrome: 'http://www.google.com/chrome'
	    },
	
		// min supported version defaults.
	    browsers: {
		    firefox: 3,
		    msie: 9,
		    opera: 15,
		    safari: 5,
			chrome: 20
	    },
	
		init: function () {
			
			var currentBrowser = $.pushup.currentBrowser = uaMatch( navigator.userAgent );
			
			if ( currentBrowser ) {
				// we don't care about the point release; comparing major version numbers only
				browserVersion[ currentBrowser.browser ] = parseInt( currentBrowser.version ) || false;
			}
						
			$.each( browserVersion, function ( uaString, version ) {
				
				if ( "number" === typeof version && version < $.pushup.browsers[uaString]) {
				    
					$.pushup.activeBrowser = uaString;
				    
					if (!$.pushup.options.ignoreReminder && $.pushup.cookiesEnabled && Cookie.get('_pushupBlocked')) { 
				        return; 
				    } else {
					    var time = ($.pushup.options.appearDelay !== undefined) ? $.pushup.options.appearDelay * 1000 : 0;
					    setTimeout($.pushup.show, time);
				    }
			    }
			
		    });
	    },
	    show: function () {
	        var $elm, $icon, $message, $messageLink, hours, H, messageText, $hourElem, imgSrc, srcFol, image, styles, time;
		    
		    $elm = $(document.createElement('div'))
		        .attr('id', 'pushup')
		        .hide()
		        .appendTo('body');
		    $messageLink = $(document.createElement('a'))
		        .addClass('pushup_messageLink')
		        .attr('target', '_blank')
		        .attr("href", $.pushup.updateLinks[$.pushup.activeBrowser])
		        .appendTo($elm);
		    $icon = $(document.createElement('div'))
		        .addClass('pushup_icon')
		        .appendTo($messageLink);
		    $message = $(document.createElement('span'))
		        .addClass('pushup_message')
		        .html($.pushup.options.message)
		        .appendTo($messageLink);
    		
		    hours = $.pushup.options.reminder.hours;
		    if (hours && $.pushup.cookiesEnabled) {
			    H = hours + ' hour' + (hours > 1 ? 's' : '');
			    messageText = $.pushup.options.reminder.message.replace('#{hours}', H);
			    $hourElem = $(document.createElement('a'))
			        .attr('href', '#')
			        .addClass('pushup_reminder')
			        .html(messageText);
			    $elm.append($hourElem);
			    $hourElem.click(function (event) {
				    $.pushup.setReminder($.pushup.options.reminder.hours);
				    $.pushup.hide();
				    				    
				    event.preventDefault();
			    });
		    }
		    if (/^(https?:\/\/|\/)/.test($.pushup.options.images)) {
			    imgSrc = $.pushup.options.images;
		    } else {
			    $('script[src]').each(function (i, elem) {
			        var $elem = $(elem);
				    if (/jquery\.pushup/.test($elem.attr('src'))) {
					    srcFol =  $elem.attr('src').replace('jquery.pushup.js', '');
					    imgSrc = srcFol + $.pushup.options.images;
				    }
			    });
		    }
		    image = imgSrc + $.pushup.activeBrowser.toLowerCase();
		    styles = ($.pushup.currentBrowser.msie) ? {
			    filter: 'progid:DXImageTransform.Microsoft.AlphaImageLoader(src=\'' + image + '.png\'\', sizingMethod=\'crop\')'
		    } : {
			    background: 'url(' + image + '.png) no-repeat top left'
		    };
		    
		    $icon.css(styles);
		    $elm.fadeIn('slow');
		    
		    if ($.pushup.options.fadeDelay !== undefined) {
			    time = $.pushup.options.fadeDelay * 1000;
			    setTimeout($.pushup.hide, time);
		    }
	    },
	    hide: function () { 
	        $('#pushup').fadeOut('slow'); 
	    },
	    setReminder: function (hours) {
		    Cookie.set('_pushupBlocked', 'blocked', { duration: 1 / 24 * hours });
	    },
	    resetReminder: function () { 
	        Cookie.remove('_pushupBlocked');
	    }
    };

    $.pushup.cookiesEnabled = (function (test) {
        if (Cookie.get(test)) {
            return true;
        }
        Cookie.set(test, 'test', { duration: 15 });
        return Cookie.get(test);
    }('_pushupCookiesEnabled'));
   
	$(function () {
        $.pushup.init();
    });

}(jQuery));