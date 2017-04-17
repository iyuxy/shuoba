!function(w, d, className) {
    var evCheck = function () {
        if (!w.jQuery || !w.jQuery.fn.jquery >= "1.5") {
            return false;
        }
        return true;
    };

    var getTarget = function (ele) {
        var target = d.getElementsByClassName(ele);
        // 如果没有这个说吧html，直接返回，不做任何处理
        if (target.length === 0) {
            return false;
        }
        return target[0];
    };

    var commentElement = '<div class="comment-box">'
        + '<textarea class="text-block" rows="8" placeholder="说点什么吧~" data-required></textarea>'
        +   '<div class="input-box">'
        +       '<div class="input"><input type="text" class="nickname" placeholder="昵称*" data-required></div>'
        +       '<div class="input"><input type="text" class="mail" placeholder="电子邮件地址*" data-required></div>'
        +       '<div class="input"><input type="text" class="url" placeholder="网址"></div>'
        +   '</div>'
        +   '<div class="submit-button">说吧~</div>'
        + '</div>'
        + '<div class="comment-list">'
        +   '<div class="comment-list-head">Ta说</div>'
        +   '<ul class="comment-list-ul"><li><div class="head-pic"></div><div class="comment-detail"><div class="nickname">张胜男</div><div class="time">2017年10月20日</div><div class="content">你好啊，我的朋友</div><div class="btn">回复</div></div></li><li><div class="head-pic"></div><div class="comment-detail"><div class="nickname">张胜男</div><div class="time">2017年10月20日</div><div class="content">你好啊，我的朋友</div><div class="btn">回复</div></div></li></ul>'
        + '</div>';

    var createCommentBox = function (className) {
        $(shuoba.target).css({
            padding: '10px'
        });
        $(shuoba.target).html(commentElement);
    };

    var creatCommentlist = function () {

    }

    var getComment = function (argument) {
        
    };

    var sendComment = function (argument) {

    };


    var checkInput = function () {

    };

    if (!evCheck() || !getTarget(className)) {
        return;
    }

    var loadCss = function (path){
        var cssTag = document.getElementById('loadCss');
        var head = document.getElementsByTagName('head').item(0);
        if(cssTag) head.removeChild(cssTag);
        css = document.createElement('link');
        css.href = path;
        css.rel = 'stylesheet';
        css.type = 'text/css';
        css.id = 'loadCss';
        head.appendChild(css);
    };

    var target = getTarget(className);
    var pageInfo = {
        pageId: $(target).attr('data-key'),
        title: $(target).attr('data-title'),
        url: $(target).attr('data-url')
    };

    if (!pageInfo.pageId) {
        return;
    }

    // 加载css文件
    loadCss('./shuoba.css');

    var shuoba = {};
    shuoba.target = target;
    shuoba.pageInfo = pageInfo;

    createCommentBox(className);



}(window, document, 'shuoba-thread');








