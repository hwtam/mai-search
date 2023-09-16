// ==UserScript==
// @name         mai-search
// @version      2.3
// @description  quick search maimai songs in youtube
// @author       tomtom
// @match        https://maimaidx-eng.com/maimai-mobile/record/*
// @match        https://myjian.github.io/mai-tools/rating-calculator/*
// @icon         data:image/gif;base64,R0lGODlhAQABAAAAACH5BAEKAAEALAAAAAABAAEAAAICTAEAOw==
// @grant        none
// ==/UserScript==

(function() {
    'use strict';

    var styleElement = document.createElement("style");
    var str = `
div[class="basic_block m_5 p_5 p_l_10 f_13 break"]::before, td[class="scoreRecordCell songTitleCell"]::before {
  content: '';
  display: inline-block;
  height: 15px;
  width: 15px;
  padding-bottom: 1.5px;
  vertical-align: middle;
  margin-right: 5px;
  cursor: pointer;
  background-image: url('https://hwtam.github.io/asset/img/youtube.ico');
  background-size: contain;
  background-repeat: no-repeat;
  touch-action: manipulation;
}
`;
    var cssRules = document.createTextNode(str);
    styleElement.appendChild(cssRules);
    document.head.appendChild(styleElement);


    function removeLV (str) {
        var arr = str.split(' ');
        return str.replace('Lv ' + arr[arr.length-1], '');
    }

    function searchYT (title, diff) {
        var url = 'https://www.youtube.com/results?search_query=maimai+' + title + ' ' + diff;
        window.open(url.replace(' ', '+'), "_blank");
    }

    function haveListener(button) {
        if (button.getAttribute('yt')) {
            return true;
        }
        button.setAttribute('yt', 'true');
        console.log(button);
        return false;
    }

    function addEvent() {
        var buttons = document.querySelectorAll('td[class="scoreRecordCell songTitleCell"]');
        buttons.forEach(function(button) {
            if (!haveListener(button)) {
                button.addEventListener('click', function() {
                    var title = button.textContent;
                    var diff = button.nextSibling.textContent;
                    searchYT(title, diff);
                });
            }
        });
    }

    var buttons = document.querySelectorAll('div[class="basic_block m_5 p_5 p_l_10 f_13 break"]');
    buttons.forEach(function(button) {
        if (!haveListener(button)) {
            button.addEventListener('click', function() {
                var title = removeLV(button.textContent);
                var diff = button.parentElement.className.slice(8,-10);
                searchYT(title, diff);
            });
        }
    });

    var observer = new MutationObserver(() => {
        addEvent();
    });
    observer.observe(document.body, {childList: true , subtree: true});
    addEvent();

})();
