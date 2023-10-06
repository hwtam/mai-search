// ==UserScript==
// @name         mai-search
// @version      5
// @description  quick search maimai songs in youtube
// @author       tomtom
// @match        https://maimaidx-eng.com/maimai-mobile/record/*
// @match        https://myjian.github.io/mai-tools/rating-calculator/*
// @icon         data:image/gif;base64,R0lGODlhAQABAAAAACH5BAEKAAEALAAAAAABAAEAAAICTAEAOw==
// @grant        none
// ==/UserScript==

(function() {
    'use strict';

    const URL = window.location.href;

    var styleElement = document.createElement("style");
    var str = `
.maiSearch {
  cursor: pointer;
}
`;
    var cssRules = document.createTextNode(str);
    styleElement.appendChild(cssRules);
    document.head.appendChild(styleElement);

    function searchYT (title, diff) {
        title = encodeURIComponent(title.replaceAll('-', ''));
        var url = 'https://www.youtube.com/results?search_query=maimai+' + title + '+' + diff;
        window.open(url, "_blank");
    }

    // For https://myjian.github.io/mai-tools/rating-calculator/*
    function addEvent_tool() {
        var parents = document.querySelectorAll("tbody tr.scoreRecordRow");
        parents.forEach(function(parent) {
            var yt = parent.querySelector('.levelCell');
            if (! yt.classList.contains('maiSearch')) {
                yt.classList.add('maiSearch');
                yt.addEventListener('click', function() {
                    var title = parent.querySelector('.songTitleCell').textContent;
                    var diff = parent.className.slice(15);
                    searchYT(title.replaceAll('▶ ', ''), diff);
                });
            }
        });
    }

    // For https://maimaidx-eng.com/maimai-mobile/record/* , exclude /musicDetail/*
    function addEvent_record() {
        var parents = document.querySelectorAll('div.p_10.t_l.f_0.v_b');
        parents.forEach(function(parent) {
            var yt = parent.querySelector('img.music_img.m_5.m_r_0.f_l');
            if (! yt.classList.contains('maiSearch')) {
                yt.classList.add('maiSearch');
                yt.addEventListener('click', function() {
                    var txt = parent.querySelector("div.basic_block.m_5.p_5.p_l_10.f_13.break")
                    var str = txt.textContent;
                    var arr = str.split(' ');
                    var title = str.replace('Lv ' + arr[arr.length-1], '');
                    var diff = txt.parentElement.className.slice(8,-10);
                    searchYT(title, diff);
                });
            }
        });
    }

    // For https://maimaidx-eng.com/maimai-mobile/record/musicDetail/*
    function addEvent_detail() {
        var yts = document.querySelectorAll('td.f_0 div.music_lv_back.m_3.t_c.f_14');
        yts.forEach(function(yt) {
            if (! yt.classList.contains('maiSearch')) {
                yt.classList.add('maiSearch');
                yt.addEventListener('click', function() {
                    var title = document.querySelector('div.m_5.f_15.break').textContent;
                    var value = yt.parentElement.parentElement.querySelector('input[name="diff"]').value;
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
    if (URL.match("maimaidx-eng.com/maimai-mobile/record/musicDetail")) {
        addEvent_detail();
        observer = new MutationObserver(addEvent_detail);
    } else if (URL.match("maimaidx-eng.com/maimai-mobile/record")){
        addEvent_record();
        observer = new MutationObserver(addEvent_record);
    } else if (URL.match("myjian.github.io/mai-tools/rating-calculator")) {
        addEvent_tool();
        observer = new MutationObserver(addEvent_tool);
    }
    observer.observe(document.body, {childList: true , subtree: true});

})();
