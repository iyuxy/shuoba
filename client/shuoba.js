!function(w, d, className, serverUrl) {
    var evCheck = function () {
        if (!w.jQuery || !w.jQuery.fn.jquery >= '1.5') {
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

    var commentElement = '<div class="comment-list">'
        +   '<div class="comment-list-head">评论列表<div class="comment-num"></div></div>'
        +   '<ul class="comment-list-ul" data-uid="0">'
        +   '</ul>'
        + '</div>'
        + '<div class="comment-box" parent-id="0" >'
        + '<div class="comment-user">'
        + '<div class="comment-user-head">'
        + '<img src="./defulat.jpg" />'
        + '</div>'
        + '</div>'
        + '<div class="textarea-box">'
        +   '<textarea class="text-block params" rows="8" name="comment" placeholder="说点什么吧~" data-required></textarea>'
        +   '<div class="preview-box"></div>'
        + '</div>'
        +   '<div class="login-box"></div>'
        +   '<div class="submit-button"><div class="login-tip">请先授权登陆</div>发表</div>'
        +   '<div class="preview-button">预览</div>'
        + '</div>';

    var createCommentBox = function () {
        $(shuoba.target).css({
            padding: '10px'
        });
        $(shuoba.target).html(commentElement);
        $(shuoba.target).delegate('.textarea-box .text-block', 'focus', function (evt) {
            $(evt.target).removeClass('highlight')
            $(shuoba.target).find('.textarea-box .preview-box').removeClass('highlight')
        });
    };

    var creatCommentlist = function () {
        $.ajax({
            url: shuoba.submitUrl + '/comment/' + shuoba.pageInfo.pageId,
            data: {
                _: new Date().getTime()
            },
            dataType: 'json',
            success: function (data) {
                if (data.length === 0) {
                    var str ='<div class="no-comment">暂无评论</div>';
                    $(shuoba.target).find('.comment-list-ul').html(str);
                }
                else {
                    $(shuoba.target).find('.comment-num').html('共计' + data.length + '条评论');
                    shuoba.data = data;
                    $(shuoba.target).find('.comment-list-ul').html('');
                    $.each(data, function (index, item) {
                        addCommentToEle(item);
                    });
                }
            }
        });

    };

    var commentItem = function (item) {
        var headPic = '';
        if (item.avatar_url) {
            headPic = '<img src="' + item.avatar_url + '">';
        }
        else {
            headPic = '<img src="./defulat.jpg">';
        }
        var tpl = '<li class="comment-item" data-uid="' + item._id + '">'
            + '<div class="head-pic">'
            +  headPic
            +  '</div><div class="comment-detail">'
            +    '<div class="comment-head">'
            +     '<div class="nickname"><a href="' + item.website + '" target="_blank">' + item.nickname + '</a></div>'
            +     '<div class="reply">'
            +       '<div class="time">发表于' + getLocalTime(item.time) + '</div>'
            +       '<div class="btn" data-uid="' + item._id + '">回复</div>'
            +     '</div>'
            +     '</div>'
            +     '<div class="content-box">'
            +     '<div class="content">' + shuoba.makrdown.render(item.comment) + '</div>'
            +     '</div>'
            +   '</div>'
            +   '<ul class="children-ul"></ul>'
            + '</li>';
        return tpl;
    };

    // var getComment = function (argument) {
        
    // };

    var sendComment = function () {
        $(shuoba.target).delegate('.preview-button', 'click', function (evt) {
            var textBlock = $(shuoba.target).find('.textarea-box .text-block');
            var previewBox = $(shuoba.target).find('.textarea-box .preview-box');
            previewBox.html(textBlock.val() === '' ? '没有内容' : shuoba.makrdown.render(textBlock.val()));
            previewBox.toggle();
            textBlock.toggle();
            if ($(evt.target).html() === '预览') {
                $(evt.target).html('返回编辑');
            }
            else {
                $(evt.target).html('预览');
            }
        });
        $(shuoba.target).delegate('.submit-button', 'click', function (evt) {
            if (shuoba.isLogin === false) {
                $(evt.target).find('.login-tip').show();
                return false;
            }
            var shuobaParams = $(evt.target).parent().find('.params');
            var obj = {};
            var isComment = true;
            var parentId = $(evt.target).parents('.comment-box').attr('parent-id');
            $.each(shuobaParams, function (index, item) {
                var ele = $(item);
                var isRequire = ele.attr('data-required');
                var name = ele.attr('name');
                var value = ele.val();
                /* eslint-disable */
                if (isRequire !== undefined && value.replace(/\ /g, '') === '') {
                    ele.addClass('highlight');
                    $(shuoba.target).find('.textarea-box .preview-box').addClass('highlight');
                    isComment = false;
                }
                /* eslint-enable */

                else {
                    ele.removeClass('highlight');
                    $(shuoba.target).find('.textarea-box .preview-box').removeClass('highlight');
                }
                obj[name] = value;
            });
            /* eslint-disable */
            if (isComment) {
                // var mailReg = new RegExp(/^\w+([-+.]\w+)*@\w+([-.]\w+)*\.\w+([-.]\w+)*$/);
                // if (!mailReg.test(obj.email)) {
                //     $(evt.target).parent().find('.mail').addClass('highlight');
                //     $(evt.target).html('请输入邮箱地址~');
                //     return false;
                // }
                // var urlReg = new RegExp(/(http|https):\/\/[\w\-_]+(\.[\w\-_]+)+([\w\-\.,@?^=%&:/~\+#]*[\w\-\@?^=%&/~\+#])?/);
                // if (obj.website && !urlReg.test(obj.website)) {
                //     $(evt.target).parent().find('.url').addClass('highlight');
                //     $(evt.target).html('请输入正确完整的网站地址~');
                //     return false;
                // }
                /* eslint-enable */
                obj.parentId = parentId;
                $.ajax({url: shuoba.submitUrl + '/comment/' + shuoba.pageInfo.pageId,
                    type: 'POST',
                    dataType: 'json',
                    beforeSend: function () {
                        $(evt.target).html('服务器正在听~');
                    },
                    data: $.extend(obj, shuoba.pageInfo, shuoba.userInfo),
                    success: function (data) {
                        if (data.success) {
                            obj.time = '刚刚';
                            obj._id = data.data._id;
                            shuoba.data.push(obj);
                            $(shuoba.target).find('.comment-num').html('共计' + shuoba.data.length + '条评论');
                            addCommentToEle(obj);
                            $.each(shuobaParams, function (index, item) {
                                $(item).val('');
                            });
                            $(shuoba.target).find('.no-comment').remove();
                            $(evt.target).html('发表');
                        }
                    }
                });
                var commentBox = $(shuoba.target).find('.comment-box');
                if (commentBox.attr('parent-id') !== '0') {
                    $('.comment-list-ul .btn.active').trigger('click');
                }
            }
        });
        $(shuoba.target).delegate('.comment-list-ul .btn', 'click', function (evt) {
            var ele = $(evt.target);
            var commentBox = $(shuoba.target).find('.comment-box textarea');
            var commentBox_parent = $(shuoba.target).find('.comment-box');
            var comment_id = ele.attr('data-uid');
            commentBox_parent.attr('parent-id', comment_id);
            var currentReplyContent = '';
            $.each(shuoba.data, function (index, item) {
                if (item._id === comment_id) {
                    currentReplyContent = item.comment;
                    return false;
                }
            });
            currentReplyContent = currentReplyContent.split('\n').join('\n> ');
            commentBox.val('');
            commentBox.val('> ' + currentReplyContent + '\n\n');
            commentBox.focus();
            
        });
    };

    var addCommentToEle = function (obj) {
        var tpl = commentItem(obj);
        $(shuoba.target).find('.comment-list-ul').append(tpl);
        // if (obj.parentId === '0') {
        //     $(shuoba.target).find('.comment-list-ul').prepend(tpl);
        // }
        // else {
        //     $(shuoba.target).find('.comment-list-ul li[data-uid="' + obj.parentId + '"]').children('.children-ul').prepend(tpl);
        // }
    };

    if (!evCheck() || !getTarget(className)) {
        return;
    }

    var getLocalTime = function (nS) {
        if (isNaN(parseInt(nS))) {
            return nS;
        }
        var time = new Date(parseInt(nS));
        var year = time.getFullYear() + '';
        var month = time.getMonth() + 1;
        var day = time.getDate();
        var hour = time.getHours();
        var min = time.getMinutes();
        var sec = time.getSeconds();
        time = year.substring(2) + '年' + month + '月' + day + '日 '
            + addPrefix(hour) + ':' + addPrefix(min);
        // time = year + '年' + month + '月' + day + '日 '
        //     + addPrefix(hour) + ':' + addPrefix(min) + ':' + addPrefix(sec);
        return time;
        // var time = new Date(parseInt(nS)).toLocaleString().replace(/:\d{1,2}$/,' ');
        // return time.replace('/', '年').replace('/', '月').replace('/', '日').replace(' ', '日 ');
    };

    var addPrefix = function (value) {
        if (value < 10) {
            return '0' + value;
        }
        return value;
    };

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
    /* eslint-disable */
    var urlReg = new RegExp(/(http|https):\/\/[\w\-_]+(\.[\w\-_]+)+([\w\-\.,@?^=%&:/~\+#]*[\w\-\@?^=%&/~\+#])?/);
    /* eslint-enable */
    if (!urlReg.test(pageInfo.url)) {
        pageInfo.url = window.location.origin + pageInfo.url;
    }

    if (!pageInfo.pageId) {
        return;
    }

    // 加载css文件
    // loadCss('./shuoba.css');
    

    // loadCss('https://cdn.jsdelivr.net/bootstrap/3.2.0/css/bootstrap.css');


    function getUserInfo() {
        $.ajax({
            url: shuoba.submitUrl + '/user',
            data: {
                _: new Date().getTime()
            },
            dataType: 'json',
            success: function (data) {
                if (data.code !== 403) {
                    shuoba.isLogin = true
                    shuoba.userInfo = data;
                    if (data.avatar_url) {
                        $(shuoba.target).find('.comment-user-head img').attr('src', data.avatar_url);
                        $(shuoba.target).find('.login-box').html(
                            '<span>已使用Github授权登陆</span>'
                        )
                    }
                }
                else {
                    shuoba.isLogin = false;
                    $(shuoba.target).find('.login-box').html(
                        '<span>授权登陆：</<span>'
                        + '<a href="'
                        +  shuoba.submitUrl + '/auth/github'
                        + '" target="_blank"><img src="./github-icon.png" /></a>'
                    )
                }
            }
        });
    }

    var shuoba = {};
    shuoba.isLogin = false;
    shuoba.target = target;
    shuoba.pageInfo = pageInfo;
    shuoba.submitUrl = window.location.origin;

    $.getScript('https://cdn.bootcss.com/markdown-it/8.4.2/markdown-it.js',function () {
        if (!w.markdownit) {
            return;
        }
        shuoba.makrdown = new markdownit();

        creatCommentlist();

        createCommentBox(className);

        getUserInfo();
        
        sendComment();
    });

}(window, document, 'shuoba-thread');








