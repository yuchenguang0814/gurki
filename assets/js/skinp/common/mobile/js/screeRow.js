/**
 * Created by admin on 2017/10/7.
 */
/**
 * 工厂模式JS
 */
(function(factory) {
  if (typeof define === 'function' && define.amd) {
    // AMD
    define(['jquery'], factory);
  } else if (typeof exports === 'object') {
    // CommonJS
    module.exports = factory(require('jquery'));
  } else {
    // Browser globals
    factory(jQuery);
  }
}(function($) {
  'use strict';
    $.fn.screeRow = function(opts) {
        if(window.innerWidth< 992)return
        if(!this.hasClass('pred-filter'))return
        if(this.children(":not(:hidden)").length ==4)return
        //屏蔽掉除选择之外所有的行
        var defaults = {
            extra: '.setting-tab-bar',//不需要的行
            collRow: 3,//跨过屏蔽的行数
            isExpand: false, // 默认是否展开
            btnClasses:'',
            roomClasses:'',
            certain : 0,//保留的高度
            shieldRow:'',
            callback: ''//展开之后的回调函数
        }
        var options = $.extend(defaults, opts);
        $('.giantroom').remove();
        var selector = this.selector;
        var i = 0;
        var _roomClas = '';
        var _btnClas = '';
        for(var key in options.roomClasses){if(key != undefined)_roomClas += (options.roomClasses[key]+' ')}
        for(var key in options.btnClasses){if(key != undefined)_btnClas += (options.btnClasses[key]+' ')}
        var $btnRoom = $('<div class="'+_roomClas+'"></div>');
        var $btn = $('<div class="'+_btnClas+' btnExpand">'+getLang('MoreOptions')+'<i class="iconfont icpng icon-xiangxiajiantou"></i></div><div class="'+_btnClas+' hidden">'+getLang('ClickCollapse')+'<i class="iconfont icpng icon-xiangshangjiantou"></i></div>');
        $btnRoom.append($btn);
        this.after($btnRoom);
        $btn.click(function(){
            if($('.setting-pred-warp.hidden').length>0)$('.setting-pred-warp.hidden').addClass('shown').removeClass('hidden');
            else if($('.setting-pred-warp.shown').length>0)$('.setting-pred-warp.shown').addClass('hidden').removeClass('shown');
            $(this).siblings().removeClass('hidden');
            $(this).addClass('hidden');
        });
        this.children(":not(:hidden)").length <=($(selector).find(options.extra).length+options.collRow) && window.innerWidth > 996?  $btnRoom.addClass('hidden'): $btnRoom.removeClass('hidden');
        if(this.children().length<=4)$btnRoom.addClass('hidden');
        this.children().each(function(index){
            if(index<($(selector).find(options.extra).length+options.collRow)){
                if($(this).is(':hidden')){
                    options.collRow++;
                    return true
                }
            }
            if(index>=($(selector).find(options.extra).length+options.collRow)){
                $(this).addClass('hidden');
            }
        });
        if (options.isExpand) {
            if (!$btnRoom.find('.hidden').hasClass('btnExpand')) $btnRoom.find('.btnExpand').click();
        }
    }
    /**
     * js获取多语言
     * @param  string lang 要获取多语言的key
     * @return string 多语言
     */
    function getLang(lang){
        if(window.AllLang){
            return window.AllLang[lang];
        } else {
            var sys_lang = 'cn,big5,en,fr,jp,kr';
            var site_lang = (getCookie && sys_lang.indexOf(getCookie('Lang')) > -1) ? getCookie('Lang') : 'en';
            site_lang = site_lang == 'big5' ? 'cn' : site_lang
            var lang_url = '/share/lang/lang_' + site_lang + '.json?v=' + Math.random(1,9999);
            $.ajax({
                url: lang_url,
                type: 'GET',
                dataType: 'json',
                async: false,
                success: function(json){
                    window.AllLang = json;
                }
            });
            return window.AllLang[lang];
        }
    }

}));