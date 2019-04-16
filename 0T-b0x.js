// ==UserScript==
// @name         0T-b0x
// @author       0xb4d455
// @include      https://*pr0gramm.com*
// @namespace    ot
// @version      0.1
// @description  Get notified when there is an OT in the comments
// @match        http://*/*
// @grant        none
// ==/UserScript==

var id = "ot-box";
var otWarning = null;
var commentBox = null;
var searchString = ["OT", "ot", "Offtopic", "OFFTOPIC"];
var foundString = "OT in den Kommentaren!";

//some good styling here
var cssAsString = "#ot-box{position:fixed;top:20px;left:40px;padding:10px;max-width:350px;visibility:hidden;font-size:25px;color:#ee4d2e;background-color:#cded2d;z-index:9999;height:60px;vertical-align:baseline;display:flex;align-items:center;justify-content:center;}";

(function() {
    'use strict';

    loadStyling();

    //add the ot-div into DOM
    if($('body').find('#'+id).length === 0){
        $('body').append('<div id="'+id+'">'+foundString+'</div>');
        otWarning = $('body').find('#'+id);

        //add keypress and click listener
        document.addEventListener('keyup', keyPressFunc, true);
        document.addEventListener('click', clickFunc, true);

        //add scrolling to otbox div
        otWarning.on('click', scroller);
    }
})();

function clickFunc(){
    setTimeout(function(){
        //check if we should hide the otBox
        //TODO: temporary fix. needs some overhauling soon...
        if($(".item-container").length == 0){
            hideOTWarning();
        }
    }, 1000);
}

function scroller(){
    commentBox.css("border","1px solid #ee4d2e");
    commentBox.css("padding","5px");
    commentBox.get(0).scrollIntoView({block: "center"});
    hideOTWarning();
}

function hideOTWarning(){
    otWarning.css("visibility", "hidden");
}

function showOTWarning(){
    otWarning.css("visibility", "visible");
}

function searchComments(){
    var commentDiv = $(".comment-content");

    if(commentDiv.length > 0){
        commentDiv.each(function(){
            var that = $(this);
            var commentText = that.text().trim();

            searchString.forEach(function(element) {
                if(commentText.startsWith(element) == true){
                    commentBox = that;
                    showOTWarning();
                    return;
                }
            });
        });
    }
}

function keyPressFunc(evt) {
    //listen for 'a', 'd', left arrow and right arrow
    if ( evt.which == 39 || evt.which == 37 || evt.which == 65 || evt.which == 68) {
        //hide on each press
        hideOTWarning();

        //search for OT in comments after timeout
        setTimeout(searchComments, 1000);
    }
}

function loadStyling(){
    var head, style;
    head = document.getElementsByTagName('head')[0];
    if (!head) { return; }
    style = document.createElement('style');
    style.type = 'text/css';
    style.innerHTML = cssAsString;
    head.appendChild(style);
}