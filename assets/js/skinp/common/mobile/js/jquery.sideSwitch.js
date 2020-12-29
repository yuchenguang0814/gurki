/**
 * Created by admin on 2017/9/28.
 */
/**
 * author spar
 * ����jquery���侧边栏��
 * 增加一个初始化完成后加载
 * 可修改option改变该样式的js插件
 * 可设置绝对定位也可设置固定定位
 * 默认绝对定位
 */
(function ($) {
        $.fn.sideSwitch = function (opts) {
            if(this.length==0)return
            var defaults = {
                contentWidth: '400px',
                contentHeight: '185px',
                btnWidth: '30px',
                btnHeight: '80px',
                initTop: '',//�初始化离浏览器顶部的距离
                extra: '',//因页面布局需要额外向左移动的距离���
                callback: ''//�右边栏出现后的回调函数����
            }
            var option = $.extend(defaults, opts);
            this.each(function () {//����
                var _this = $(this);//
                var btndiv = _this.find('.ss_btn');
                var btnTop = (parseInt(option.contentHeight) - parseInt(option.btnHeight)) / 2;
                btndiv.css({
                    width: option.btnWidth,
                    height: option.btnHeight,
                    top: btnTop,
                    position: "absolute",
                    cursor: "pointer"
                });
                var contentdiv = _this.find('.ss_content');
                //按钮左侧位置或者自己初始化该位置
                var contentLeft = parseInt(option.btnWidth) + parseInt(btndiv.css('borderLeftWidth')) + parseInt(btndiv.css('borderRightWidth'));
                contentdiv.css({
                    width: option.contentWidth,
                    height: '100%',
                    paddingBottom:'90px',
                    position: "relative",
                    left: option.contentLeft || contentLeft,
                    top: option.offsetTop || "0px"
                });
                var boxInitLeft = parseInt(document.body.clientWidth) - parseInt(option.btnWidth) - parseInt(btndiv.css('borderLeftWidth')) - parseInt(btndiv.css('borderRightWidth')) - option.extra;
                //debugger
                var boxInitWidth = parseInt(option.btnWidth) + parseInt(btndiv.css('borderLeftWidth')) + parseInt(btndiv.css('borderRightWidth'));
                _this.css({bottom:'0',width:  option.sideWidth || boxInitWidth, overflow: "hidden", position: option.myPosition || "absolute", zIndex: 999,'box-sizing':'border-box'});
                //固定定位下请初始化为0
                if (!option.initTop) {
                    option.initTop = (parseInt(document.body.clientHeight) - parseInt(_this.css('height')) - parseInt(_this.css("borderTopWidth")) - parseInt(contentdiv.css("borderTopWidth"))) / 2;
                }
                _this.css({left: boxInitLeft, top: option.initTop});
                btndiv.off('click').on('click',
                        function () {
                            if (parseInt(_this.css("width")) < parseInt($('.ss_content').css('width'))) {
                                _this.show();
                                var boxNewWidth = parseInt($('.ss_content').css('width')) + parseInt($('.ss_content').css('borderLeftWidth')) + parseInt($('.ss_content').css('borderRightWidth')) + parseInt($('.ss_btn').css('width')) + parseInt($('.ss_btn').css('borderLeftWidth')) + parseInt($('.ss_btn').css('borderRightWidth'));
                                var boxNewLeft = parseInt(document.body.clientWidth) - boxNewWidth;
                                _this.stop().animate({left: boxNewLeft + 'px', width:boxNewWidth + "px",'filter':'alpha(opacity=100)','-moz-opacity':'1','-webkit-opacity':'1','opacity':'1'},'900',option.callback(_this));
                            }
                            else {
                                _this.stop().animate({left: boxInitLeft,width:"0",'filter':'alpha(opacity=0)','-moz-opacity':'0','-webkit-opacity':'0','opacity':'0'},'900');
                            }

                        }
                );
                option.btn.off('click').on('click',function(){
                    btndiv.trigger('click');
                })
            });


        }

    })(jQuery)