// ==UserScript==
// @name         mai-search
// @version      3.3
// @description  quick search maimai songs in youtube
// @author       tomtom
// @match        https://maimaidx-eng.com/maimai-mobile/record/*
// @match        https://myjian.github.io/mai-tools/rating-calculator/*
// @icon         data:image/gif;base64,R0lGODlhAQABAAAAACH5BAEKAAEALAAAAAABAAEAAAICTAEAOw==
// @grant        none
// ==/UserScript==

(function() {
    'use strict';

    const url = window.location.href;

    var styleElement = document.createElement("style");
    var str = `
div.basic_block.m_5.p_5.p_l_10.f_13.break::before,
td.scoreRecordCell.songTitleCell::before,
div.w_250.f_l.t_l::after {
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

div.w_250.f_l.t_l::after {
    content: 'Click the level to mai-search';
    width: 100%;
    padding-left: 20px;
    cursor: default;
    margin-top: 20px;
    box-sizing: border-box;
}
`;
    var cssRules = document.createTextNode(str);
    styleElement.appendChild(cssRules);
    document.head.appendChild(styleElement);

    function searchYT (title, diff) {
        var url = 'https://www.youtube.com/results?search_query=maimai+' + title + ' ' + diff;
        window.open(url.replace(' ', '+'), "_blank");
    }

    function haveListener(button) {
        if (button.getAttribute('yt')) {
            return true;
        }
        button.setAttribute('yt', 'true');
        return false;
    }

    // For https://myjian.github.io/mai-tools/rating-calculator/*
    function addEvent_stalk() {
        var buttons = document.querySelectorAll('td.scoreRecordCell.songTitleCell');
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

    // For https://maimaidx-eng.com/maimai-mobile/record/* , exclude /musicDetail/*
    function addEvent_record() {
        var buttons = document.querySelectorAll('div.basic_block.m_5.p_5.p_l_10.f_13.break');
        buttons.forEach(function(button) {
            if (!haveListener(button)) {
                button.addEventListener('click', function() {
                    var str = button.textContent;
                    var arr = str.split(' ');
                    var title = str.replace('Lv ' + arr[arr.length-1], '');
                    var diff = button.parentElement.className.slice(8,-10);
                    searchYT(title, diff);
                });
            }
        });
    }

    // For https://maimaidx-eng.com/maimai-mobile/record/musicDetail/*
    function addEvent_detail() {
        var children = document.querySelectorAll('td.f_0 div.music_lv_back.m_3.t_c.f_14');
        children.forEach(function(child) {
            var button = child.parentNode;
            if (!haveListener(button)) {
                button.style.cursor = "pointer";
                button.addEventListener('click', function() {
                    var title = document.querySelector('div.m_5.f_15.break').textContent;
                    var value = button.parentElement.querySelector('input[name="diff"]').value;
                    var diff;
                    switch(value) {
                        case '0': {diff = "basic"; break;}
                        case '1': {diff = "advanced"; break;}
                        case '2': {diff = "expert"; break;}
                        case '3': {diff = "master"; break;}
                        case '4': {diff = "re:master"; break;}
                        default: diff = '';
                    };
                    searchYT(title, diff);
                });
            }
        });
    }

    // main
    var observer;
    if (url.match("maimaidx-eng.com/maimai-mobile/record/musicDetail")) {
        addEvent_detail();
        observer = new MutationObserver(addEvent_detail);
    } else if (url.match("maimaidx-eng.com/maimai-mobile/record")){
        addEvent_record();
        observer = new MutationObserver(addEvent_record);
    } else if (url.match("myjian.github.io/mai-tools/rating-calculator")) {
        addEvent_stalk();
        observer = new MutationObserver(addEvent_stalk);
    }
    observer.observe(document.body, {childList: true , subtree: true});

})();
