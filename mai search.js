// ==UserScript==
// @name         mai search
// @version      1.0
// @description  quick search maimai songs in youtube
// @author       tomtom
// @match        https://maimaidx-eng.com/maimai-mobile/record/
// @icon         data:image/gif;base64,R0lGODlhAQABAAAAACH5BAEKAAEALAAAAAABAAEAAAICTAEAOw==
// @grant        none
// ==/UserScript==

(function() {
    'use strict';

    var styleElement = document.createElement("style");
    var str = `
div[class="basic_block m_5 p_5 p_l_10 f_13 break"]::before {
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


    var buttons = document.querySelectorAll('div[class="basic_block m_5 p_5 p_l_10 f_13 break"]');
    buttons.forEach(function(button) {
        button.addEventListener('click', function() {
            var title = removeLV(button.textContent);
            var diff = button.parentElement.className.slice(8,-10);
            searchYT(title, diff);
        });
    });


    function removeLV (str) {
        var arr = str.split(' ');
        return str.replace('Lv ' + arr[arr.length-1], '');
    }

    function searchYT (title, diff) {
        var url = 'https://www.youtube.com/results?search_query=maimai+' + title + ' ' + diff;
        window.open(url.replace(' ', '+'), "_blank");
        return;
    }

})();
