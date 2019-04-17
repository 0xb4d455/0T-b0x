// ==UserScript==
// @name         0T-b0x
// @author       0xb4d455
// @include      https://*pr0gramm.com*
// @namespace    ot
// @version      0.2
// @description  Get notified when there is an OT in the comments
// @match        http://*/*
// @grant        none
// ==/UserScript==

var id = "ot-box";
var otWarning = null;
var commentBoxes = [];
var commentBoxesIndices = 0;
var searchString = ["ot", "offtopic"];
var foundString = "OT in den Kommentaren!";

//some good styling here
var cssAsString = "#ot-box{position:fixed;top:20px;left:40px;padding:10px;visibility:hidden;font-size:25px;color:#ee4d2e;background-color:#cded2d;z-index:9999;height:60px;vertical-align:baseline;display:flex;align-items:center;justify-content:center;}";

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
    }

    //initial search
    searchComments();


})();

function clickFunc(e){
    //check if we clicked on otWarning div
    if(e.target == otWarning[0]){
        scroller();
    }else{
        searchComments();
    }
}

function scroller(){
    commentBoxes.forEach(function(element) {
        element.css("border","1px solid #ee4d2e");
        element.css("padding","5px");
    });

    if(commentBoxes.length == 1){
        commentBoxes[0].get(0).scrollIntoView({block: "center"});
        return;
    }

    setTextTo(foundString + "\n ("+(commentBoxesIndices+1)+"/"+commentBoxes.length+")");

    commentBoxes[commentBoxesIndices].get(0).scrollIntoView({block: "center"});
    commentBoxesIndices++;

    if(commentBoxesIndices >= commentBoxes.length){
        commentBoxesIndices = 0;
    }
}

function hideOTWarning(){
    otWarning.css("visibility", "hidden");
}

function showOTWarning(){
    otWarning.css("visibility", "visible");
}

function searchComments(){
    setTimeout(function(){
        reset();
        if($(".item-container").length != 0){
            var commentDiv = $(".comment-content");

            if(commentDiv.length > 0){
                commentDiv.each(function(){
                    var that = $(this);
                    var commentText = that.text().trim();

                    searchString.forEach(function(element) {
                        if(commentText.toLowerCase().startsWith(element) == true){
                            commentBoxes.push(that);
                            showOTWarning();
                            return;
                        }
                    });
                });

                if(commentBoxes.length == 0){
                    hideOTWarning();
                }
            }
        } else {
            hideOTWarning();
        }
    }, 500);
}

function keyPressFunc(evt) {
    //listen for 'a', 'd', left arrow and right arrow
    if ( evt.which == 39 || evt.which == 37 || evt.which == 65 || evt.which == 68) {

        //hide on each press
        hideOTWarning();

        //search for OT in comments
        searchComments();
    }

    //listen for 'o','O' or '0' key to jump to the OT
    if ( evt.which == 48 || evt.which == 79 || evt.which == 96 || evt.which == 111) {
        scroller();
    }
}

function resetCommentBoxesArrayAndIndices(){
    commentBoxes = [];
    commentBoxesIndices = 0;
}

function setTextTo(newString){
    otWarning.text(newString);
}

function resetText(){
    setTextTo(foundString);
}

function reset(){
    resetCommentBoxesArrayAndIndices();
    resetText();
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
