
    $('<span id="quadButton" style="z-index:1" title="Click for Quad View">&nbsp;&nbsp;> Quad View <</span>').insertBefore("div.feeds-wrapper > div");

	$("#quadButton").click(function() {
        quadView();
    });

	var DELAY = 400, clicks = 0, timer = null;
	$(document).on("click",".refreshFeed", function(e){
		var ifr = "#ifeed" + $(this).data('feed-num');
		clicks++; //count clicks
		if(clicks === 1) {
			timer = setTimeout(function() {
				console.log("Single Click");
				$(ifr,window.parent.document).attr('src',$(ifr,window.parent.document).attr('src'));
				clicks = 0; //after action performed, reset counter
			}, DELAY);
		} else {
			$('.refreshFeed').prop("disabled", true);
			clearTimeout(timer); //prevent single-click action
			console.log("Double Click");
			for (let i = 1; i < 5; i++) {
				$("#ifeed" + i,window.parent.document).attr('src',$("#ifeed" + i,window.parent.document).attr('src'));
			}
			clicks = 0; //after action performed, reset counter
			setTimeout(function(){
				$('.refreshFeed').prop("disabled", false);
			}, 500);
		}
	})
		.on("dblclick", function(e){
		e.preventDefault(); //cancel system double-click event
	});

	$(document).on("click", "#zoomUp", function() {
		var newZ = new Number($('#grid').css('zoom'));
		var curLevel = Math.round((newZ + .02) * 100) / 100;
		$('#grid').css('zoom', curLevel);
		$('#zoomLevel').text(curLevel);
		if ($('#saveZoom').prop('checked')) {
			if($('img.marqImg').data('src') == 'quad'){
				localStorage.setItem('zoomlevel', curLevel);
			} else {
				localStorage.setItem('zoomlevelM', curLevel);
			}
		}
	});

	$(document).on("click", "#zoomDown", function() {
		var newZ = new Number($('#grid').css('zoom'));
		var curLevel = Math.round((newZ - .02) * 100) / 100;
		$('#grid').css('zoom', curLevel);
		$('#zoomLevel').text(curLevel);
		if ($('#saveZoom').prop('checked')) {
			if($('img.marqImg').data('src') == 'quad'){
				localStorage.setItem('zoomlevel', curLevel);
			} else {
				localStorage.setItem('zoomlevelM', curLevel);
			}
		}
	});

	$(document).on("click", "#zoomReset", function(){
		$('#grid').css('zoom', '1');
		$('#zoomLevel').text("1.0");
		if ($('#saveZoom').prop('checked')) {
			if($('img.marqImg').data('src') == 'quad'){
				localStorage.setItem('zoomlevel', '1.0');
			} else {
				localStorage.setItem('zoomlevelM', '1.0');
			}
		}
	});

	$(document).on("change", "#saveZoom", function() {
		if (this.checked) {
			if($('img.marqImg').data('src') == 'quad'){
				localStorage.setItem('zoomlevel', $('#grid').css('zoom'));
			} else {
				localStorage.setItem('zoomlevelM', $('#grid').css('zoom'));
			}
		} else {
			localStorage.removeItem('zoomlevel');
			localStorage.removeItem('zoomlevelM');
		}
	});

	$(document).on("change", "#chkDark", function() {
		if(this.checked) {
            $('img.oriImg').css('filter', 'invert(1)');
            $('img.marqImg').css('filter', 'invert(1)');
			$('body').css('background-image','none').css('background-color','#000').css('color','#FFF');
			localStorage.setItem('bgColor','dark');
		} else {
            $('img.oriImg').css('filter', 'invert(0)');
            $('img.marqImg').css('filter', 'invert(0)');
			$('body').css('background-image','none').css('background-color','#FFF').css('color','#000');
			localStorage.removeItem('bgColor');
		}
	});

        $(document).on("click", ".oriImg", function() {
            if ($(this).data('src') == "vert") {
				$('img.oriImg').data('src', 'horz');
                $(this).attr('src', horz);
                var orderH = ["tpL","btL","fd1","fd3","fd2","fd4","tpR","btR"];
				for (let i = 0; i < 8; i++) {
					$('div#grid > div:eq(' + i + ')').attr('class', orderH[i]);
				}
            } else {
                $(this).attr('src', vert);
				$('img.oriImg').data('src', 'vert');
                var orderV = ["tpL","tpR","fd1","fd2","fd3","fd4","btL","btR"];
				for (let i = 0; i < 8; i++) {
					$('div#grid > div:eq(' + i + ')').attr('class', orderV[i]);
				}
            }
            $('span.zoomBtns').appendTo('#grid > div.tpL > span:first');
            $('span.swapBtns').appendTo('#grid > div.tpR > span:first');
            $('span.chkDark').appendTo('#grid > div.btR > span:first');
        });

        $(document).on("click", ".colImg", function() {
			var order = []; //[r1, r2, n1, n2, n3, n4, r3, r4];
			for (let i = 0; i < 8; i++) {
				order[i] = $('div#grid > div:eq(' + i + ')').attr('class');
			}
            if ($('img.oriImg').data('src') == 'vert') {
				// We swap r1&r2, n1&n3, n2&n4 and r3&r4
				// We swap 0&1, 2&4, 3&5 and 6&7
				[order[0], order[1], order[2], order[3], order[4], order[5], order[6], order[7]] = [order[1], order[0], order[4], order[5], order[2], order[3], order[7], order[6]];
			} else {
				// We swap r1&r3, n1&n2, n3&n4 and r2&r4
				// We swap 0&6, 2&3, 4&5 and 1&7
				[order[0], order[1], order[2], order[3], order[4], order[5], order[6], order[7]] = [order[6], order[7], order[3], order[2], order[5], order[4], order[0], order[1]];
            }
			for (let i = 0; i < 8; i++) {
				$('div#grid > div:eq(' + i + ')').attr('class', order[i]);
			}
            $('span.zoomBtns').appendTo('#grid > div.tpL > span:first');
            $('span.swapBtns').appendTo('#grid > div.tpR > span:first');
            $('span.chkDark').appendTo('#grid > div.btR > span:first');
        });

        $(document).on("click", ".rowImg", function() {
			var order = []; //[r1, r2, n1, n2, n3, n4, r3, r4];
			for (let i = 0; i < 8; i++) {
				order[i] = $('div#grid > div:eq(' + i + ')').attr('class');
			}
            if ($('img.oriImg').data('src') == 'vert') {
                // We swap r1&r3, r2&r4, n1&n2 and n3&n4
				// We swap 0&6, 1&7, 2&3 and 4&5
				[order[0], order[1], order[2], order[3], order[4], order[5], order[6], order[7]] = [order[6], order[7], order[3], order[2], order[5], order[4], order[0], order[1]];
            } else {
                // We swap r1&r2, r3&r4, n1&n3 and n2&n4
				// We swap 0&1, 6&7, 2&4 and 3&5
				[order[0], order[1], order[2], order[3], order[4], order[5], order[6], order[7]] = [order[1], order[0], order[4], order[5], order[2], order[3], order[7], order[6]];
            }
			for (let i = 0; i < 8; i++) {
				$('div#grid > div:eq(' + i + ')').attr('class', order[i]);
			}
            $('span.zoomBtns').appendTo('#grid > div.tpL > span:first');
            $('span.swapBtns').appendTo('#grid > div.tpR > span:first');
            $('span.chkDark').appendTo('#grid > div.btR > span:first');
        });

	$(document).on("click", ".marqImg", function() {
		if ($(this).data('src') == "marq") {
			var zmLevel = localStorage.getItem('zoomlevel');
			if (zmLevel !== null) {
				$('#grid').css('zoom', zmLevel);
				$('#zoomLevel').text(zmLevel);
			}
			$('img.marqImg').data('src', 'quad');
			$(this).attr('src', viewMarq);
			$('span.swapBtns').show();
			$('.selMarq').hide();
			$('#grid').attr('class','wrapperQ')
			var order = ["tpL","tpR","fd1","fd2","fd3","fd4","btL","btR"];
			for (let i = 0; i < 8; i++) {
				$('div#grid > div:eq(' + i + ')').attr('class', order[i]);
			}
			$('span.zoomBtns').css('margin-right','60px');
			$('span.zoomBtns').appendTo('#grid > div.tpL > span:first');
			$('span.swapBtns').appendTo('#grid > div.tpR > span:first');
			$('span.chkDark').appendTo('#grid > div.btR > span:first');
			$('.chkDark').css('padding-top','0px');
		} else {
			var zmLevelM = localStorage.getItem('zoomlevelM');
			if (zmLevelM !== null) {
				$('#grid').css('zoom', zmLevelM);
				$('#zoomLevel').text(zmLevelM);
			}
			$('span.zoomBtns').css('margin-right','549px');
			$('img.marqImg').data('src', 'marq');
			$(this).attr('src', viewQuad);
			$(".selMarqHid").removeClass('selMarqHid').addClass('selMarq');
			$('span.swapBtns').hide();
			$('.selMarq').show();
			$('#marq1').removeClass('selMarq').addClass('selMarqHid');
			$('#grid').attr('class','wrapperM')
			var orderM = ["tpLM","btCM","fd1M","fd2M","fd3M","fd4M","btLM","btRM"];
			for (let i = 0; i < 8; i++) {
				$('div#grid > div:eq(' + i + ')').attr('class', orderM[i]);
			}
			$('span.zoomBtns').appendTo('#grid > div.tpLM > span:first');
			$('span.chkDark').insertBefore('span.zoomBtns');
			$('.chkDark').css('padding-top','10px');
		}
	});

	$(document).on("click", ".selMarq", function() {
		$(".selMarqHid").removeClass('selMarqHid').addClass('selMarq');
		$(this).removeClass('selMarq').addClass('selMarqHid');
		var num = $(this).data('feed-num');
		var order = [["tpLM","btCM","fd1M","fd2M","fd3M","fd4M","btLM","btRM"],["btLM","btCM","fd2M","fd1M","fd3M","fd4M","tpLM","btRM"],["btLM","tpLM","fd2M","fd3M","fd1M","fd4M","btCM","btRM"],["btLM","btRM","fd2M","fd3M","fd4M","fd1M","btCM","tpLM"]];
		for (let i = 0; i < 8; i++) {
			$('div#grid > div:eq(' + i + ')').attr('class', order[num-1][i]);
		}
		$('span.chkDark').appendTo('#grid > div.tpLM > span:first');
		$('span.zoomBtns').appendTo('#grid > div.tpLM > span:first');
	});

	$(document).on("click", ".hlp .clsHlp", function() {
		$('.hlp').fadeOut();
	});

	$(document).on("click", ".helpBtn", function() {
		$(".hlp").fadeIn();
	});

	var horz = 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAADwAAAA8CAIAAAC1nk4lAAAALHRFWHRDcmVhdGlvbiBUaW1lAFN1biAyMCBNYXIgMjAyMiAwNToxMDoxNiAtMDUwMJ3fk+cAAAAHdElNRQfmAxQJITev4WNEAAAACXBIWXMAAAsSAAALEgHS3X78AAAABGdBTUEAALGPC/xhBQAABJ9JREFUeNrtmitMM0EQxxtKgfJ+B0ICLY9AKEkD5REUNCgUQfAIAoIDJEFADUESgiCoKtIQQioqEBUViIqKCgQCgUAgKhAIBAJB+P5h0sl+Le1t79G7Jv0L0hy9ud/Nzs7O7Nb2U4KyyX/16+vrNa3v729dHg877+/vBkIHg0FbWuBWDfr4+BgIBDweT3NzM1mrr68fGxs7PT2FX3SG9vv99IyGhgbV0JOTk45f2bJUXV3d1NR0fX2tFfrj4+P5+TkcDi8tLcGiduiOjg4yUllZWVtba7fbCZfR6+rqMBTqoUEGKzU1NTAkukQjNHDh6a2trWg0mkql4JdYLIbwqKqqIvs9PT2aoBFt2eOoBbqvr299ff3l5SXjOtCdTifZx5A+PT1p8rS+0Hnk8/nY/s3NjUrozK8aDD03N0f2EejIJKUB7Xa7yX5jY2MoFCoBaEQ5T3fEdDKZtDo01kUOaGhkZESBxArQyCecqhEbSIVWhz4+PuZkh+Vmc3NTmcRc6EgkwsRwttfrlSk/zIROJBIwRTax7g4MDHx+fkqRmAUt+hgfXC7X29ubLIkp0JeXl1wgINOh9CuoqjYB+vDwkH2MXDE/Py8ZFeZAIx+vrKwgRTDxxsaGiiYoHzTMvQoSoTGH+LpkuwHNzMwwMT7s7Oy85hbqPjXQuao8LnxJ8Xi80LGS0cnJiUroP+tpUagTLActY91a0JZVGdosaMRx3GLKXt4zoRH+BU2XIii79SpDmwVdkjFdEipDl6E1QaOujUajFxcX29vb09PTqOKRYe7u7vQ6wYCurq7G08q/IaYAjRbo4OBgeHgY1TMKVLGGttvtaDpQlB4dHWlHTyaTaMXZeJ7iThkauU/coCdxb0fCw/x+f6EdniikMz550QeaNiWA7nA4RkdH9/b2gsHg/v4+BpF9g9dYXFxUR4w+zev1ZrhGKzRMwA3n5+fZXeDZ2Rl7HZEj3yaKQldLO6Vi7GmCxqCHw+E8NLwz297eHpduXli89YEOVzzT0QStqM7OTnpMW1tb/u3kbOElqS1HbGBWICMVA/rh4YHHFA4rKIekUim8J2Uht9uNIS0GNJI0nazZfvdAbm9v5e9FvHk8Hpp8eFs65jIKenZ2Fkmjv78flLzhgliUeYao1dVVSkq4NxaL0UWjoDMSdkVFBdALnX/IOViVyMcinIHQyHHimTagu7u7FY8aWPf390SMG5eXl8V/GQUd+hVy9u7ubm9vLz2eCCRTBx2tY/KhNMhYRIuUPQKBQGtrKz2mq6tL5hauWzAxxv9XS0sLQ2P0FCsnldDIcbzNB2fL7PwW2hoasi3mcrnIOlaZSCQiA+3MIbHKoyuYPIZA85MQrIq/0PhJz4o/hTKdoTFH6WIem39Do2JcWFjAIpLrNriWD6aQcVW/OUmfiYgYxSqNYB0aGgK6ONkRzWg0mBhDiXxiFWjGovUP6/bU1BSmNqY/r4j47PP5tDcvukFjKtAPjHIJ6BMTEyp+oGYUNJyHwgA94uDgICMidvGXFkWEDVcO2rW2toZoVEwaCtAZLwDHJxIJTD4s2pjUunhXFIxzJpFJRCW57/EPMvPWAW5Xpe4AAAAASUVORK5CYII=';
	var vert = 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAADwAAAA8CAIAAAC1nk4lAAAALHRFWHRDcmVhdGlvbiBUaW1lAFN1biAyMCBNYXIgMjAyMiAwNToxMDoxNiAtMDUwMJ3fk+cAAAAHdElNRQfmAxQJHiED6/wpAAAACXBIWXMAAAsSAAALEgHS3X78AAAABGdBTUEAALGPC/xhBQAABPFJREFUeNrtmj1I81wUx4vftVo/qlZFUYvSoUMp2qqgog6KIIjiB7iIg7g66OAkRRyKSBGRIg5SxMHBwcHBwcGhg4NDB4cODs/g4ODg4OAgvn968JA3aW7StHlaefofpCb33vxycu6559zE8v0LZdHf9PPz88+Pvr6+skXw9vaGkc2CPjk5sfwI3IKWoVBodXU1GAxGo1HlWfQ9PT2dmppyuVxWq5UGrK2t9Xq9BwcHr6+v2YQeGxujC1RXV4uhuSV+yE719/eXlpaWlZVZUqmyshJnw+FwRtDv7++JROLy8nJmZqampiZz6MbGRkYEekVFBX4UFxdXVVXxcZhfzC2CBhmGwLg2m01qjwyhgYgx4R6wRTwep6lyc3Pj8XhgaepYXl4u8BMNaKkBsgLd0dExPz///Pys7PXx8eF0OqljfX09bsm4pbMLLdbKygp1hGdvbW0ZgZY3NR96aGiIOtrt9pSRJ++gb29v2adxCYM+bTY0sDDO4+Pj9fX12toaJh/1wkTCERFJDqERsylQwMAIKRTsmpqaYHINkhxC+3w+6fwuKirCDUQiEc0cIZfQg4ODslUGwprQ3d2N8Jen0CTwPT09ISqDlVIR2HtkZCSvoVlI95A28VxMuQDlHTSEtZ3j9NXV1e+AXl9f59wDaWpeQIt7QW63mzo6HA5B4Pur0DjS09OjtnCcn59jZLY0XNwINOLlH4mk0LFYjI8riyUBNAEhUOzs7FBqihUR7js+Ps6VAcbf3NwUmU9wTi3Lk9Ud9/f3aUHzUoKFEDeA0TjloMFHR0fF64uRfFoqlDP6oanWUhsTuLiH7e1t8cpi0NIy6Yf+TtZvFxcXKHv9fj8KAngC1sK2trZAIACX0FPVfqc1EfXLcMjTqQJ0AboArUPDw8O/D7qrq4ugEdoK0AXoAvQ/C420Cfnu3t7e9PT05OQk8mD8K37hkC702dmZ70eCLTxtaOSHSLva29tR1qNIRkpJHCUlJTabDUfC4bAaelrQDw8PvOkBBYNB49AwMG+uccXB6JbkrgpsnyE0clHeNsgONFVs+Ot0Oufm5g4PD0OhUG9vL7/dQTqPws4wNB6U1+uVmSZTaAzR2toKJ5MVP7u7u1x9wH8MQy8vL9OLEWn9lhE0fBplc8paDdUH+wncUenZeqCPjo7ozlEgSt/pZAQtFtf6dXV1KKfThUaFRsUsfANJ1cLCgunQMC1tJ5PHJxKJtKBfXl4cDocl+SYOLfFI/wY0TGu32+ka8BN4i35o3LDH46HJx7uMpkPDywcGBvgaWA6UbQTQi4uL5FrwY974Mh16Y2OD5w1Mpdw/EEDv7+/TI0JHKZy50JFIhIkRNyYmJlI2Swl9d3dHxJiCs7Oz0vYmQuOqHJ4xh5qbm5XeLICmV+vo6Ha7ZXtIZkEjRHCYsyS/dFAGDTE0363L5fL9X4ibPHJLS4tm5qQLGnwNDQ1IlTg2C4jF0PolMLk2dCwWw5MlYqy3sISYWABtVZE0y6MjiKTGoYmYZ15nZ6eePcKU0FF1BQIBhsYcpYPxeNwINJJ9XkTg0H19fZqbsAJogbI2EY+Pj6Wf0iAj0/+xVW6gkR5w0gw/hkP71OX3+2WPMjfQXAHoEZYb2bqYM2jMX6s+IfuRQaPGCSYl/gKCtbS0hOepGTQ0oDHhoulI52sHNSFG8VCCoKEBnef6DwKRmQLwjI2JAAAAAElFTkSuQmCC';
    var viewMarq = 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAADwAAAAnCAIAAADcj7x9AAAALHRFWHRDcmVhdGlvbiBUaW1lAFN1biAyMCBNYXIgMjAyMiAwNToxMDoxNiAtMDUwMJ3fk+cAAAAHdElNRQfmAx8TLwvYvZPqAAAACXBIWXMAAAsSAAALEgHS3X78AAAABGdBTUEAALGPC/xhBQAAAFBJREFUeNrt0sEJADAIBMHUYv89JnaQRyAqzP4PBnGtiUXEHlWCoaGhq4OGhm4QNDR0g6ChoRsEDX1Bj+zl0jn/PNzv7wENDQ0NDQ1dip7YAUibNemxh8K7AAAAAElFTkSuQmCC';
    var viewQuad = 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAADsAAAAoCAIAAADPBRXRAAAALHRFWHRDcmVhdGlvbiBUaW1lAFN1biAyMCBNYXIgMjAyMiAwNToxMDoxNiAtMDUwMJ3fk+cAAAAHdElNRQfmAx8TKxA2tJ8CAAAACXBIWXMAAAsSAAALEgHS3X78AAAABGdBTUEAALGPC/xhBQAAAEtJREFUeNrt0AEJACAUQ0Gz/P4d1RJDB/cCjGNr1TUzO9BdDs0SExMTExMTExMTE1eL++r7mJiY+IU4N50S931MTExMTExM/Ku4rgNFGT951lWj5AAAAABJRU5ErkJggg==';

	function quadView() {
		$('body').css('background-image','none').css('background-color','#FFF').css('color','#000').css('margin','0');
		$("header.siteHeader").remove();
		$("#siteSideNav").remove();
		$("div.adWrapper").remove();
		$("#fb-root").remove();
		$("div.feeds-curated-content").remove();
		$('.feeds-container').css('margin','0');
		$('#content').removeClass('container-fluid');
		$('.feeds-wrapper').removeClass('col-lg-9 col-xl-10');
		$('.feeds-wrapper').css('zoom','1').css('margin','5px 0px 0px 20px');
		$('div.feed-thumbnails-wrapper').remove();
		$('.fb-comment-wrap').remove();
		$('.adChoices_overlayContainer').parent().remove(); //??
		$('.feeds-disclaimer').remove();
		$("#footer").remove();
		$(".feeds-wrapper").empty();
		$(".container-fluid").remove();

		//create quad table
		var feedAccts = [6388794,16559084,16559088,16559095,16559099];
		var feedEvents = [10133699, 10133705, 10133709, 10133712, 10133716];

		var feed1='<div class="live-player-container live-player-container-16x9"><iframe id="ifeed1" class="ifrm" src="https://livestream.com/accounts/' + feedAccts[0] + '/events/' + feedEvents[0] + '/player?enableInfoAndActivity=false&amp;autoPlay=true&amp;mute=true" frameborder="0" scrolling="no" allowfullscreen=""></iframe></div>'
		var feed2='<div class="live-player-container live-player-container-16x9"><iframe id="ifeed2" class="ifrm" src="https://livestream.com/accounts/' + feedAccts[1] + '/events/' + feedEvents[1] + '/player?enableInfoAndActivity=false&amp;autoPlay=true&amp;mute=true" frameborder="0" scrolling="no" allowfullscreen=""></iframe></div>'
		var feed3='<div class="live-player-container live-player-container-16x9"><iframe id="ifeed3" class="ifrm" src="https://livestream.com/accounts/' + feedAccts[2] + '/events/' + feedEvents[2] + '/player?enableInfoAndActivity=false&amp;autoPlay=true&amp;mute=true" frameborder="0" scrolling="no" allowfullscreen=""></iframe></div>'
		var feed4='<div class="live-player-container live-player-container-16x9"><iframe id="ifeed4" class="ifrm" src="https://livestream.com/accounts/' + feedAccts[3] + '/events/' + feedEvents[3] + '/player?enableInfoAndActivity=false&amp;autoPlay=true&amp;mute=true" frameborder="0" scrolling="no" allowfullscreen=""></iframe></div>'

		var divTable = '<div id="quadTable"><div class="wrapperQ" id="grid">' +
			'<div class="tpL"><span id="rf1"><i class="fas fa-sync-alt refreshFeed" data-feed-num="1" title="Refresh this feed"></i><span class="feedTxt">Feed 1</span><span id="marq1" class="selMarqHid" data-feed-num="1">Marquee This Feed</span><span class="zoomBtns"><span class="marqBtn"><img class="marqImg" data-src="quad" src="' + viewMarq + '" title="Change between Quad Feed and Marquee display."/></span>Zoom: <i id="zoomDown" class="fas fa-search-minus zoomIcon" title="Zoom Page Smaller"></i><i id="zoomUp" class="fas fa-search-plus zoomIcon" title="Zoom Page Larger"></i><i id="zoomReset" class="fas fa-undo-alt zoomIcon" title="Zoom Page Reset"></i><span id="zoomLevel" class="curZoom">1.0</span><input type="checkbox" id="saveZoom">Save</input><i class="fas fa-question-circle helpBtn" title="BBCan QuadViewer Help"></i></span></span></div>' +
			'<div class="tpR"><span id="rf3"><i class="fas fa-sync-alt refreshFeed" data-feed-num="3" title="Refresh this feed"></i><span class="feedTxt">Feed 3</span><span id="marq3" class="selMarq" data-feed-num="3" style="display: none;">Marquee This Feed</span><span class="swapBtns">Change Orientation:<img class="oriImg" data-src="vert" src="' + vert + '" title="Change the orientation of the way feeds are displayed." />| Swap Rows:<i class="fas fa-exchange-alt rowImg fa-rotate-90" title="Exchange top row with bottom row."></i>| Swap Columns: <i class="fas fa-exchange-alt colImg" title="Exchange first column with second column."></i></span></span></div>' +
			'<div class="fd1"><span id="feed1">' + feed1 + '</span></div>' +
			'<div class="fd2"><span id="feed2">' + feed2 + '</span></div>' +
			'<div class="fd3"><span id="feed3">' + feed3 + '</span></div>' +
			'<div class="fd4"><span id="feed4">' + feed4 + '</span></div>' +
			'<div class="btL"><span id="rf2"><i class="fas fa-sync-alt refreshFeed" data-feed-num="2" title="Refresh this feed"></i><span class="feedTxt">Feed 2</span><span id="marq2" class="selMarq" data-feed-num="2" style="display: none;">Marquee This Feed</span></span></div>' +
			'<div class="btR"><span id="rf4"><i class="fas fa-sync-alt refreshFeed" data-feed-num="4" title="Refresh this feed"></i><span class="feedTxt">Feed 4</span><span id="marq4" class="selMarq" data-feed-num="4" style="display: none;">Marquee This Feed</span><span class="chkDark"><input type="checkbox" id="chkDark">Dark Background</input></span></span></div>' +
			'</div></div>' +
			'<div class="hlp" style="display: none;">' +
				'<h6>Big Brother Canada QuadViewer Help</h6>' +
				'<ul class="square">' +
				'<li>If you are trying to view the Big Brother Canada feeds from outside of Canada, <strong>you will absolutely need a VPN.</strong></li>' +
				'<li>To reload an \'individual\' feed, \'single click\' that feeds reload icon.</li>' +
				'<li>To reload \'all\' feeds at once, \'double click\' any reload icon.</li>' +
				'<li>To switch viewer type(Quad/Marquee), click the selector icon.</li>' +
				'<li>While in \'Marquee View\', to \'Marquee\' any other feed, click the \'<u>Marquee This Feed</u>\' link.</li>' +
				'<li>To increase, decrease or reset the level of zoom for either viewer type(Quad/Marquee), click the appropriate icon(s).</li>' +
				'<li>If the \'Save\' checkbox is checked, the displayed zoom level for each viewer type(Quad/Marquee) will be saved and set accordingly upon each page load.</li>' +
				'<li>The default orientation on each initial page load is for feeds 1/2 & 3/4 to be \'stacked\'. If desired the orientation can be changed so that feeds 1/2 & 3/4 are \'side by side\'. Clicking the \'Change Orientation\' icon will switch the feeds orientation.</li>' +
				'<li>Click the \'up/down arrows\' icon to \'Swap Rows\' top for bottom.</li>' +
				'<li>Click the \'left/right arrows\' icon to \'Swap Columns\' left for right.</li>' +
				'</ul>' +
				'<button class="clsHlp">Close</button>';
			'</div>';
		$(".feeds-wrapper").html(divTable);

		var zmLevel = localStorage.getItem('zoomlevel')
		if(zmLevel !== null){
			$('#grid').css('zoom', zmLevel);
			$('#zoomLevel').text(zmLevel);
			$('#saveZoom').prop('checked','true');
		}

		var bg = localStorage.getItem('bgColor')
		if(bg == 'dark'){
			$('body').css('background-image','none').css('background-color','#000').css('color','#FFF');
            $('img.oriImg').css('filter', 'invert(1)');
            $('img.marqImg').css('filter', 'invert(1)');
			$('#chkDark').prop("checked",true);
		} else {
			$('body').css('background-image','none').css('background-color','#FFF').css('color','#000');
		}
	}
