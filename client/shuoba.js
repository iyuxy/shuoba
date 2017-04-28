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

    var commentElement = '<div class="comment-box" parent-id="0" >'
        +   '<textarea class="text-block params" rows="8" name="comment" placeholder="说点什么吧~" data-required></textarea>'
        +   '<div class="input-box">'
        +       '<div class="input"><input type="text" class="nickname params" name="nickname" placeholder="昵称*" data-required></div>'
        +       '<div class="input"><input type="text" class="mail params" name="from" placeholder="电子邮件地址*" data-required></div>'
        +       '<div class="input"><input type="text" class="url params" name="url" placeholder="网址"></div>'
        +   '</div>'
        +   '<div class="submit-button">说吧~</div>'
        + '</div>'
        + '<div class="comment-list">'
        +   '<div class="comment-list-head">Ta说</div>'
        +   '<ul class="comment-list-ul" data-uid="0">'
        +   '</ul>'
        + '</div>';

    var createCommentBox = function (className) {
        $(shuoba.target).css({
            padding: '10px'
        });
        $(shuoba.target).html(commentElement);
    };

    var creatCommentlist = function () {
        $.ajax({url: shuoba.submitUrl + '/comment/' + shuoba.pageInfo.pageId,
            dataType: 'json',
            success: function (data) {
                if (data.length === 0) {
                    var str ='<div class="no-comment">还没有人说话哦，你来吧~</div>';
                    $(shuoba.target).find('.comment-list-ul').html(str);
                }
                else {
                    $(shuoba.target).find('.comment-list-ul').html('');
                    $.each(data, function (index, item) {
                        addCommentToEle(item);
                    });
                }
            }
        });

    }

    var commentItem = function (item) {
        var tpl = '<li class="comment-item" data-uid="' + item._id + '">'
            + '<div class="head-pic">'
            +   '</div><div class="comment-detail">'
            +     '<div class="nickname">' + item.nickname + '</div>'
            +     '<div class="content">' + item.comment + '</div>'
            +     '<div class="reply">'
            +       '<div class="time">' + getLocalTime(item.time) + '</div>'
            +       '<div class="btn">回复</div>'
            +     '</div>'
            +   '</div>'
            +   '<ul class="children-ul"></ul>'
            + '</li>';
        return tpl;
    };

    var getComment = function (argument) {
        
    };

    var sendComment = function (argument) {
        $(shuoba.target).delegate('.submit-button', 'click', function (evt) {
            var shuobaParams = $(evt.target).parent().find('.params');
            var obj = {};
            var isComment = true;
            var parentId = $(evt.target).parents('.comment-box').attr('parent-id');
            $.each(shuobaParams, function (index, item) {
                var ele = $(item);
                var isRequire = ele.attr('data-required');
                var name = ele.attr('name');
                var value = ele.val();
                if (isRequire !== undefined && value.replace(/\ /g, '') === '') {
                    ele.addClass('highlight');
                    isComment = false;
                }

                else {
                    ele.removeClass('highlight');
                }
                obj[name] = value;
            });
            if (isComment) {
                var regex = new RegExp(/^\w+([-+.]\w+)*@\w+([-.]\w+)*\.\w+([-.]\w+)*$/);
                if (!regex.test(obj.from)) {
                    $(evt.target).parent().find('.mail').addClass('highlight');
                    $(evt.target).html('请输入邮箱地址~');
                    return false;
                }
                obj.parentId = parentId;
                $.ajax({url: shuoba.submitUrl + '/comment/' + shuoba.pageInfo.pageId,
                    type: 'POST',
                    dataType: 'json',
                    beforeSend: function () {
                        $(evt.target).html('服务器正在听~');
                    },
                    data: $.extend(obj, shuoba.pageInfo),
                    success: function (data) {
                        if (data.success) {
                            obj.time = '刚刚';
                            obj._id = data.data._id;
                            addCommentToEle(obj);
                            $.each(shuobaParams, function (index, item) {
                                $(item).val('');
                            });
                            $(shuoba.target).find('.no-comment').remove();
                            $(evt.target).html('说吧~');
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
            var commentBox = $(shuoba.target).find('.comment-box');
            if (ele.html() === '回复') {
                $(shuoba.target).find('.comment-list-ul .btn').removeClass('active');
                ele.addClass('active');
                ele.html('取消回复');
                var parentId = $(evt.target).parents('.comment-item').attr('data-uid');
                commentBox.attr('parent-id', parentId);
                commentBox.insertAfter($(evt.target).closest('.comment-item').children('.comment-detail'));
            }
            else {
                ele.removeClass('active');
                ele.html('回复');
                commentBox.attr('parent-id', '0');
                $(shuoba.target).prepend(commentBox);
            }
            
        });
    };

    var addCommentToEle = function (obj) {
        var tpl = commentItem(obj);
        if (obj.parentId === '0') {
            $(shuoba.target).find('.comment-list-ul').prepend(tpl);
        }
        else {
            $(shuoba.target).find('.comment-list-ul li[data-uid="' + obj.parentId + '"]').children('.children-ul').prepend(tpl);
        }
    };

    if (!evCheck() || !getTarget(className)) {
        return;
    }

    var getLocalTime = function (nS) {
        if (isNaN(parseInt(nS))) {
            return nS;
        }
        var time = new Date(parseInt(nS));
        var year = time.getFullYear();
        var month = time.getMonth() + 1;
        var day = time.getDate();
        var hour = time.getHours();
        var min = time.getMinutes();
        var sec = time.getSeconds();
        var time = year + '年' + month + '月' + day + '日 '
            + addPrefix(hour) + ':' + addPrefix(min) + ':' + addPrefix(sec);
        return time;
        // var time = new Date(parseInt(nS)).toLocaleString().replace(/:\d{1,2}$/,' ');
        // return time.replace('/', '年').replace('/', '月').replace('/', '日').replace(' ', '日 ');
    };

    var addPrefix = function (value) {
        if (value < 10) {
            return '0' + value;
        }
        return value;
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
    // shuoba.submitUrl = '';
    shuoba.submitUrl = 'https://shuoba.iyuxy.com';

    createCommentBox(className);
    creatCommentlist();
    sendComment();


}(window, document, 'shuoba-thread');








