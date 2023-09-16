// ==UserScript==
// @name         mai search
// @version      2.0
// @description  quick search maimai songs in youtube
// @author       tomtom
// @match        https://maimaidx-eng.com/maimai-mobile/record/
// @match        https://myjian.github.io/mai-tools/rating-calculator/*
// @icon         data:image/gif;base64,R0lGODlhAQABAAAAACH5BAEKAAEALAAAAAABAAEAAAICTAEAOw==
// @grant        none
// ==/UserScript==

(function() {
    'use strict';

    var styleElement = document.createElement("style");
    var str = `
div[class="basic_block m_5 p_5 p_l_10 f_13 break"]::before, td[class="scoreRecordCell songTitleCell"]::before {
  content: "Search";
  display: inline-block;
  padding: 0px 3px;
  background-color: #eaeaea;
  border: 1px solid #ccc;
  border-radius: 5px;
  margin-right: 5px;
  cursor: pointer;
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

    function addEvent() {
        var buttons = document.querySelectorAll('td[class="scoreRecordCell songTitleCell"]');
        buttons.forEach(function(button) {
            button.addEventListener('dblclick', function() {
                var title = button.textContent;
                var diff = button.nextSibling.textContent;
                searchYT(title, diff);
            });
        });
    }

    var buttons = document.querySelectorAll('div[class="basic_block m_5 p_5 p_l_10 f_13 break"]');
    buttons.forEach(function(button) {
        button.addEventListener('click', function() {
            var title = removeLV(button.textContent);
            var diff = button.parentElement.className.slice(8,-10);
            searchYT(title, diff);
        });
    });

    var observer = new MutationObserver(() => {
        addEvent();
    });
    observer.observe(document.body, {childList: true , subtree: true});
    addEvent();

})();
