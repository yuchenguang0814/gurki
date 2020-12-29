function initUserRegGiant(moduleId,layout) {
    var module = $('#module_' + moduleId);
    // radio
    module.find('.radioItems :radio').wrap('<div class="radio-btn"><i></i></div>');
    module.find(".radioItems :radio").on('change', function () {
        $(this).closest('.radioItems').find('.radio-btn').removeClass('checkedRadio');
        $(this).closest('.radio-btn').addClass('checkedRadio');
        $(this).closest('.userregister-uniterming').find('.mobileRadio span').text($(this).val());
    });
    module.find('.userregister-uniterming>.mobileRadio').on('click', function (e) {
        var fieldItem = $(this).parent('.userregister-uniterming');
        var fieldName = fieldItem.find('.field-name').text();
        var cloneItems = fieldItem.find('.radioItems').clone(false);
        var html = '';
        html += '<div id="RadioBox_module_'+moduleId+'" class="ModuleUserRegGiant layout-'+layout+'  plug-radio clearfix ">';
        html += '<div class="checked-title">';
        html += '<span class="returnParent iconfont icon-xiangzuojiantou"></span>';
        html += '<h4>' + fieldName + '</h4>';
        html += '<span class="checkTrue">确定</span>';
        html += '</div>';
        html += '<div class="radioItems">';
        html += '</div>';
        html += '</div>';
        // 模态框
        var modal = $(html).appendTo('body');
        modal.find('.radioItems').replaceWith(cloneItems);
        modal.find('.radioItems :radio').each(function () {
            $(this).attr('name', 'clone_' + $(this).attr('name'));
        });
        // 单选框选择事件
        modal.find('.radioItems :radio').on('change', function () {
            $(this).closest('.radioItems').find('.radio-btn').removeClass('checkedRadio');
            $(this).closest('.radio-btn').addClass('checkedRadio');
            $(this).closest('.userregister-uniterming').find('.mobileRadio span').text($(this).val());
        });
        // 点击确定按钮
        modal.find('.checkTrue').on('click', function (e) {
            var checkedRadioClone = modal.find('.radioItems :radio:checked');
            if (checkedRadioClone.length > 0) {
                var checkRadio = fieldItem.find('.radioItems :radio[value="' + checkedRadioClone.val() + '"]');
                checkRadio.prop('checked', true);
                checkRadio.closest('.radioItems').find('.radio-btn').removeClass('checkedRadio');
                checkRadio.closest('.radio-btn').addClass('checkedRadio');
                fieldItem.find('.mobileRadio>span').text(checkRadio.val());
            } else {
                fieldItem.find('.radioItems :radio').prop('checked', false);
                fieldItem.find('.radioItems .radio-btn').removeClass('checkedRadio');
                fieldItem.find('.mobileRadio>span').text('请选择..');
            }
            modal.remove();
        });
        // 点击返回
        modal.find('.returnParent').on('click', function (e) {
            modal.remove();
        });
    });
    // checkbox
    var radiobutton102 = ''
    if($.inArray(layout,['101','102','103','104']) > -1)radiobutton102 = "iconfont icon-radiobutton2"
    module.find('.checkItems :checkbox').wrap('<div class="check-box"><i class="'+radiobutton102+'"></i></div>');
    module.find('.checkItems :checkbox').on('change', function () {
        if ($(this).prop('checked')) {
            $(this).closest('.check-box').addClass('checkedBox');
        } else {
            $(this).closest('.check-box').removeClass('checkedBox');
        }
        var checkedCount = $(this).closest('.checkItems').find(':checkbox:checked').length;
        if (checkedCount > 0) {
                if($.inArray(layout,['101'])>-1){
                    $(this).closest('.userregister-checked').find('.mobileCheckbox>span').text("已选" + checkedCount + "个");
                }else{
                    var checkVal = ''
                    $(this).closest('.checkItems').find(':checkbox:checked').each(function(index){
                        if(index == checkedCount-1){
                            checkVal += $(this).val()
                        }else{
                            checkVal += ($(this).val()+',')
                        }
                    })
                    $(this).closest('.userregister-checked').find('.mobileCheckbox>span').text(checkVal)
                }
        } else {
            $(this).closest('.userregister-checked').find('.mobileCheckbox>span').text('请选择..');
        }
    });
    module.find('.userregister-checked>.mobileCheckbox').on('click', function (e) {
        var fieldItem = $(this).parent('.userregister-checked');
        var fieldName = fieldItem.find('.field-name').text();
        var checkedCount = fieldItem.find('.checkItems :checkbox:checked').length;
        var cloneItems = fieldItem.find('.checkItems').clone(false);

        var html = '';
        html += '<div id="CheckBox_module_'+moduleId+'" class="ModuleUserRegGiant layout-'+layout+' plug-checked clearfix">';
        html += '<div class="checked-title">';
        html += '<span class="returnParent iconfont icon-xiangzuojiantou"></span>';
        html += '<h4>' + fieldName + '</h4>';
        html += '<span class="checkTrue">确定</span>';
        html += '</div>';
        html += '<div class="check-num">';
        html += '<span class="num-text">已选<span class="num">' + checkedCount + '</span>个</span>';
        html += '<span class="close-box-checked"><img src="images/close1.png"/*tpa=https://www.gurki99.com/skinp/modules/ModuleUserRegGiant/images/close1.png*/ width="15"></span>';
        html += '</div>';
        html += '<div class="checkItems">';
        html += '</div>';
        html += '</div>';

        // 模态框
        var modal = $(html).appendTo('body');
        modal.find('.checkItems').replaceWith(cloneItems);
        modal.find('.checkItems :checkbox').each(function () {
            $(this).attr('name', 'clone_' + $(this).attr('name'));
        });
        // 多选框选择事件
        modal.find('.checkItems :checkbox').on('change', function () {
            if ($(this).prop('checked')) {
                $(this).closest('.check-box').addClass('checkedBox');
            } else {
                $(this).closest('.check-box').removeClass('checkedBox');
            }
            modal.find('.num').text(modal.find('.checkItems :checkbox:checked').length);
        });
        // 移除所有选中状态
        modal.find('.close-box-checked').on('click', function () {
            modal.find('.checkItems .check-box').removeClass('checkedBox');
            modal.find('.checkItems :checkbox').prop('checked', false);
            modal.find('.num').text(0);
        });
        // 点击确定
        modal.find('.checkTrue').on('click', function () {
            if(layout == '101'){
                var checkedCount = modal.find('.checkItems :checkbox:checked').length;
                if (checkedCount > 0) {
                    fieldItem.find('.mobileCheckbox>span').text("已选" + checkedCount + "个");
                } else {
                    fieldItem.find('.mobileCheckbox>span').text('请选择..');
                }
            }else{
                var checkText = '请选择..';
                if(modal.find('.checkItems :checkbox:checked').length > 0){
                    checkText =''
                    modal.find('.checkItems :checkbox:checked').each(function(index){
                        if(index == modal.find('.checkItems :checkbox:checked').length-1){
                            checkText += $(this).val();
                        }else{
                            checkText += ($(this).val()+',');
                        }
                    })
                }
                fieldItem.find('.mobileCheckbox>span').text(checkText);
            }
            modal.find('.checkItems :checkbox').each(function () {
                if ($(this).prop('checked')) {
                    fieldItem.find(':checkbox[value="' + $(this).val() + '"]').closest('.check-box').addClass('checkedBox');
                    fieldItem.find(':checkbox[value="' + $(this).val() + '"]').prop('checked', true);
                } else {
                    fieldItem.find(':checkbox[value="' + $(this).val() + '"]').closest('.check-box').removeClass('checkedBox');
                    fieldItem.find(':checkbox[value="' + $(this).val() + '"]').prop('checked', false);
                }
            });
            modal.remove();
        });
        // 点击返回
        modal.find('.returnParent').on('click', function (e) {
            modal.remove();
        });
    });
    //新增加的select选择框
    if($.inArray(layout,['102','104']) > -1){
        var $Select = module.find('.select_container_nw');
        $Select.find(".select_list").hide();
            //引用滚动插件
        loadStyleSheet('../../../share/jquery.mCustomScrollbar.css'/*tpa=https://www.gurki99.com/share/jquery.mCustomScrollbar.css*/);
        addScript('../../../share/jquery.mCustomScrollbar.min.js'/*tpa=https://www.gurki99.com/share/jquery.mCustomScrollbar.min.js*/,function(){
            $Select.find(".select_list_body").mCustomScrollbar({
                theme: "minimal",
                advanced: { autoExpandHorizontalScroll: true }
            });
        })
        var BindSelector = function($Select){
            if($Select.find('.select_list_ul').children().length === 0)return
            $Select.find(".select_arrow,.select_arrow_after").toggleClass("cast_rotate");
            if ($Select.find(".select_arrow_after").hasClass("cast_rotate"))
                $Select.find(".select_arrow_after").css("margin-top", "1px");
            else
                $Select.find(".select_arrow_after").css("margin-top", "-1px");

            if ($Select.find(".select_list").hasClass("list_open")) {
                $Select.find(".select_list").removeClass("list_open").stop().animate({ "height": "0px" }, 200, function () {
                    $Select.find(".select_list").hide();
                });
            }
            else
                $Select.find(".select_list").addClass("list_open").css({ "height": "0px" }).show().stop().animate({ "height": ($Select.find(".select_list_ul>li").length * 40) + "px" }, 200);
        }
        $Select.find(".select_arrow,.select_content,.select_arrow_after").off('click').on('click', function () {
            BindSelector($(this).closest('.select_container_nw'))
        });
        $Select.find(".select_list_body").delegate("li", "click", function () {
            $(this).closest('.select_container_nw').prev('.selectbox').val($(this).attr('val'))
            $(this).closest('.select_container_nw').find('.select_content').text($(this).attr('val')).click();
            $(this).closest('.userregister-selectList').find('.reminder').addClass('hide').removeClass('show');
            $(this).closest('.select_container_nw').find('.selected-warn').removeClass('selected-warn');
        });// 为每一行元素添加点击事件
        $('body').off('click.module'+moduleId).on('click.module'+moduleId,module,function(e){
            var  _this  =  window.event  ||  arguments.callee.caller.arguments[ 0 ]
                ,_this = _this.srcElement || _this.target;
            if(!$(_this).is(e.data.find('.select_main,.select_list_ul>li,.select_content,.select_arrow,.select_arrow_after')) && $Select.find('.list_open').length>0){
                BindSelector($Select)
            }
        })
    }
    //点击下一步
    if (/(iPhone|iPad|iPod|iOS)/i.test(navigator.userAgent)) {
        module.find('input,textarea,select').off('focus').on('focus',function(){
            setTimeout(function () {
                $("#MobileFootNav").css("position", "static");
            }, 100);
        }).on('blur',function(){
            setTimeout(function () {
                $("#MobileFootNav").css("position", "fixed");
                // 让滚动条滚动1次
                window.scroll(0, $(window).scrollTop() + 1);
            }, 100);
        })
    }

}
//已不再使用,使用模板完成了功能
function infomationDetection(opts) {
    if (typeof opts == 'undefined') {
        return;
    }
    this.moduleId = opts.moduleId;
    this.layout = opts.layout;
    this.module = $('#module_' + this.moduleId);
    this.tkCheckbox = $('#module_' + this.moduleId).find('.userregister-main-content .plug-checked');
    this.tkRadiobox = $('#module_' + this.moduleId).find('.userregister-main-content .plug-radio');
    this.init();
};
infomationDetection.prototype = {
    constructor: infomationDetection,
    // 初始化
    init: function () {
        this.initComponents();
        // this.eventChange();
        this.initRadio();
        this.initCheckbox();
    },
    // 初始化控件
    initComponents: function () {
        this.module.find('[radio-btn]').wrap('<div class="radio-btn"><i></i></div>');
        this.module.find('[check-box]').wrap('<div class="check-box"><i></i></div>');
        $.fn.toggleCheckbox = function () {
            this.prop('checked', !this.prop('checked'));
        }
    },
    // 弹框多选盒子的显示隐藏关系
    checkedTrue: function (selfBox) {
        selfBox.siblings().show();
        this.module.find('.userregister-main-head').show();
        this.module.find('.userregister-main-content').css('padding', '0 16px');
        if (this.tkRadiobox == selfBox) {
            this.tkCheckbox.hide();
        } else if (this.tkCheckbox == selfBox) {
            this.tkRadiobox.hide();
        }
        this.module.find('.userregister-container').css('height', 'auto');
        this.module.find('.userregister-container').css('background-color', '#fff');
        selfBox.hide();
    },
    // 初始化多选框
    initCheckbox: function () {
        var _this = this;
        this.module.find('.userregister-checked .check-box').on('click', function () {
            $(this).find(':checkbox').toggleCheckbox();
            $(this).toggleClass('checkedBox');
        });
        this.module.find('.plug-checked .check-box').on('click', function () {
            $(this).find(':checkbox').toggleCheckbox();
            $(this).toggleClass('checkedBox');
        });
        // 事件委托获取点击盒子进行处理
        this.module.find('.plug-checked .radioItems>span').on('click', function (e) {
            e.stopPropagation();
            e.preventDefault;
            $(this).find(':checkbox').toggleCheckbox();
            $(this).find('.check-box').toggleClass('checkedBox');
            $(this).closest('.plug-checked').find('.num-text>span').text($(this).closest('.radioItems').find(':checkbox:checked').length);
            return false;
        });
        // 点击删除全部选中
        this.module.find('.close-box-checked').on('click', function () {
            $(this).closest('.plug-checked').find('.radioItems .check-box').removeClass('checkedBox');
            $(this).closest('.plug-checked').find('.radioItems :checkbox').prop('checked', false);
            $(this).closest('.plug-checked').find('.num-text>span').text(0);
        });
        // 点击确定保存
        this.module.find('.plug-checked .checked-title>.checkTrue').on('click', function () {
            var spanText = $(this).closest('.plug-checked').find('.num-text>span').text() - 0;
            if (spanText > 0) {
                spanText = "已选" + spanText + "个";
                $(this).closest('.plug-checked').prev('.userregister-checked').find('.mobileCheckbox>span').text(spanText);
            } else {
                $(this).closest('.plug-checked').prev('.userregister-checked').find('.mobileCheckbox>span').text('请选择..');
            }
            _this.checkedTrue(_this.tkCheckbox);
        });
        // 点击返回
        this.module.find('.plug-checked .checked-title .returnParent').on('click', function (e) {
            var spanText = $(this).closest('.plug-checked').find('.num-text>span').text() - 0;
            if (spanText > 0) {
                spanText = "已选" + spanText + "个";
                $(this).closest('.plug-checked').prev('.userregister-checked .mobileCheckbox>span').text(spanText);
            } else {
                $(this).closest('.plug-checked').prev('.userregister-checked .mobileCheckbox>span').text('请选择..');
            }
            _this.checkedTrue(_this.tkCheckbox);
        });
        // 点击显示多选弹框
        this.module.find('.userregister-checked>.mobileCheckbox').on('click', function (e) {
            e.stopPropagation();
            _this.tkCheckbox.show().siblings().hide();
            _this.module.find('.userregister-main-head').hide();
            _this.module.find('.userregister-main-content').css('padding', '0');
            _this.module.find('.userregister-container').css('height', '100%');
            _this.module.find('.userregister-container').css('background-color', '#f5f5f5');
        });
    },
    // 初始化单选框
    initRadio: function () {
        var _this = this;
        this.module.find(".userregister-uniterming .radio-btn").on('click', function () {
            var _this = $(this),
                block = _this.parent().parent();
            block.find('input:radio').prop('checked', false);
            block.find(".radio-btn").removeClass('checkedRadio');
            _this.addClass('checkedRadio');
            _this.find('input:radio').prop('checked', true);
        });
        this.module.find(".plug-radio .radio-btn").on('click', function () {
            var _this = $(this),
                block = _this.parent().parent();
            block.find('input:radio').attr('checked', false);
            block.find(".radio-btn").removeClass('checkedRadio');
            _this.addClass('checkedRadio');
            _this.find('input:radio').attr('checked', true);
        });
        // 点击选项
        this.module.find('.plug-radio .radioItems .radioItem').on('click', function (e) {
            e.stopPropagation();
            var self = $(this);
            self.find('input:radio').attr('checked', false);
            self.parent().find(".radio-btn").removeClass('checkedRadio');
            self.find(".radio-btn").addClass('checkedRadio');
            self.find('input[type="radio"]').attr('checked', true);
        });
        // 点击确定按钮
        this.module.find('.plug-radio .checkTrue').on('click', function (e) {
            var radioBoxAll = $(this).closest('.plug-radio').find('.radioItems input[type="radio"]');
            radioBoxAll.each(function (i, v) {
                if (v.checked) {
                    $(v).closest('.plug-radio').prev('.userregister-uniterming').find('.mobileCheckbox span').text($(v).parent().parent().siblings().text());
                    _this.checkedTrue(_this.tkRadiobox);
                    return false;
                } else if (i == radioBoxAll.length - 1) {
                    alert('请先选择...');
                    return false;
                };
            });
        });
        // 点击返回
        this.module.find('.plug-radio .returnParent').on('click', function (e) {
            _this.checkedTrue(_this.tkRadiobox);
        });
        // 点击显示单选弹框盒子
        this.module.find('.userregister-uniterming > .mobileCheckbox').on('click', function (e) {
            _this.module.find('.plug-radio').show().siblings().hide();
            _this.module.find('.userregister-main-head').hide();
            _this.module.find('.userregister-main-content').css('padding', '0');
            _this.module.find('.userregister-container').css({
                'height': '100%',
                'background': '#f5f5f5'
            });
        })
    },
    // 用户名的input 以此类推
    // user: $('.userregister-name-main .userregister-name'),
    // emailInp: $('.userregister-common-main .userregister-email'),
    // password: $('.userregister-common-main .userregister-pwd'),
    // passOK: $('#confirmPassword'),
    // userNameReminder: $('.userNameReminder'),
    // userregisterEnter: $('.userregister-enter-inp'),
    eventChange: function () {
        // 标记
        var flagAll = {
            user: false,
            email: false,
            pwd: false
        }
        var _this = this;
        // 用户名正则验证
        var patten = /^[a-zA-Z]|[\u4e00-\u9fa5]\w{2,18}$/g;
        var pattenpwd = /^[a-zA-Z]\w{5,14}$/g;
        // 特殊字符验证
        var tszf = /[`~!@#$%^&*()_\-+=<>?:"{}|,.\/;'\\[\]·~！@#￥%……&*（）——\-+={}|《》？：“”【】、；‘’，。、]/im;
        // 邮箱正则验证
        var emailREG = /^([a-zA-Z0-9_\.\-])+\@(([a-zA-Z0-9\-])+\.)+([a-zA-Z0-9]{2,4})+$/;
        // 用户名验证
        // _this.user.focus(function () {
        //     _this.userNameReminder.text("4-20个字符，可由中文、英文、数字或符号“-”组成");
        // });
        // _this.user.on('blur.userBlur', function () {
        //     var valueString = _this.user.val();
        //     var textVal = '';
        //     if (!patten.test(valueString)) {
        //         flagAll.user = false;
        //         _this.user.css('border-color', '#f10215');
        //         if (valueString === "") {
        //             textVal = '您输入的内容不能为空';
        //             _this.userNameReminder.text(textVal);
        //             return false;
        //         }
        //         if (valueString.indexOf(" ") >= 0) {
        //             textVal = '您输入的内容不能有空格';
        //             _this.userNameReminder.text(textVal);
        //             return false;
        //         }
        //         if (tszf.test(valueString)) {
        //             textVal = '您输入的内容有违规字符，请重新输入';
        //             _this.userNameReminder.text(textVal);
        //             return false;
        //         }
        //         console.log(valueString.length);
        //         if (valueString.length <= 3 || valueString.length > 19) {
        //             textVal = '您输入的内容小于3个字或者大于20个字，不符合规范，请重新输入';
        //             _this.userNameReminder.text(textVal);
        //             return false;
        //         }
        //     };
        //     _this.user.css('border-color', '#e5e5e5');
        //     textVal = '恭喜您，用户名符合要求';
        //     flagAll.user = true;
        //     _this.userNameReminder.text(textVal);
        // });
        // 邮箱验证
        // _this.emailInp.focus(function () {
        //     _this.emailInp.parent().find('.reminder-message').show().find('.userEmailReminder').text("请输入正确有效的邮箱地址");
        // }).on('blur.emailBlur', function () {
        //     var valueString = _this.emailInp.val();
        //     if (!emailREG.test(valueString)) {
        //         flagAll.email = false;
        //         _this.emailInp.css('border-color', '#f10215');
        //         _this.emailInp.parent().find('.userEmailReminder').text("请输入正确的邮箱地址！");
        //         return;
        //     };
        //     _this.emailInp.css('border-color', '#e5e5e5');
        //     flagAll.email = true;
        //     _this.emailInp.parent().find('.userEmailReminder').text("恭喜你，邮箱地址正确！");
        // });
        // 密码验证
        // _this.password.on('focus.password', function () {
        //     _this.password.parent().find('.reminder-message').show().find('.userPasswordReminder').text("密码由字母开头，数字组成，密码长度为6-16。");
        // }).on('blur.pwdBulr', function () {
        //     var valueString = _this.password.val();
        //     if (!pattenpwd.test(valueString)) {
        //         _this.password.css('border-color', '#f10215');
        //         if (tszf.test(valueString)) {
        //             _this.password.parent().find('.userPasswordReminder').text("请输入正确的密码格式！");
        //             return;
        //         }
        //         if (valueString.length < 6 || valueString.length > 15) {
        //             _this.password.parent().find('.userPasswordReminder').text("密码长度在6-15，请输入对应的密码长度");
        //             return;
        //         };
        //     };
        //     _this.password.css('border-color', '#e5e5e5');
        //     _this.password.parent().find('.reminder-message').hide();
        //     return;
        // });
        // // 确定密码的验证
        // _this.passOK.focus(function () {
        //     if (_this.password.val() === "") {
        //         _this.passOK.parent().find('.reminder-message').show().find('.confirmPasswordReminder').text("请先输入密码！");
        //         _this.password.focus();
        //         return;
        //     };
        //     _this.password.parent().find('.reminder-message').hide();
        // }).blur(function () {
        //     if (_this.passOK.val() != _this.password.val()) {
        //         flagAll.pwd = false;
        //         _this.passOK.css('border-color', '#f10215');
        //         _this.passOK.parent().find('.reminder-message').show().find('.confirmPasswordReminder').text("密码不一致");
        //         return;
        //     };
        //     _this.passOK.css('border-color', '#e5e5e5');
        //     flagAll.pwd = true;
        //     _this.passOK.parent().find('.reminder-message').hide();
        // });

        // 提交按钮事件
        // _this.userregisterEnter.on('click', function () {
        //     if (flagAll.user != true) {
        //         _this.userNameReminder.text('请输入正确的用户名');
        //         _this.user.focus();
        //         return false;
        //     } else if (flagAll.email != true) {
        //         _this.emailInp.parent().find('.userEmailReminder').text("请输入正确的邮箱地址！");
        //         return;
        //     } else if (flagAll.pwd != true) {
        //         _this.password.parent().find('.userPasswordReminder').text("请输入正确的密码格式");
        //         return;
        //     }
        // });
    }
}
