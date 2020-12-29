function initUserLoginGiant(moduleId, layout, params) {
    params = params || {};
    replaceModule("module_" + moduleId);
    var module = $('#module_' + moduleId);

    module.find('form#UserLogin' + moduleId).validate({
        ignore: [],
        onkeyup: false,
        onclick: false,
        onfocusout: false,
        rules: {
            UserName: 'required',
            Password: 'required'
        },
        messages: {
            UserName: params.userNameRequireTip,
            Password: params.passwordRequireTip
        },
        errorElement: 'span',
        // showErrors: function (errorMap, errorList) {
        //     if (errorList.length > 0) {
        //         alert(errorList[0].message);
        //     }
        // },
        errorPlacement: function (error, element) {
            error.insertAfter(element).addClass('ts-text');
            $(module).find('.tj-text').text('');
        },
        invalidHandler: function () {
            return false;
        },
        submitHandler: function (obj) {
            obj = $(obj);
            var url = $(obj).attr('action');
            if ($.trim($(obj).find('[name=BackUrl]').val()) == '') {
                //$.trim($(obj).find('[name=BackUrl]').val(location.pathname));
            }
            var data = $(obj).serializeArray();
            if (obj.length > 0) {
                $.ajax({
                    type: "post",
                    url: url,
                    cache: false,
                    data: data,
                    dataType: "json",
                    success: function (data) {
                        if (!data.success) {
                            // alert(data.msg);
                            $(obj).find('.tj-text').text(data.msg);
                            return;
                        }
                        $(obj).find('.tj-text').text('');
                        if(window['LoginCallback']){
	                       window['LoginCallback'](data.data);
                        }
                        else if (data.msg) {
                            window.location.href = decodeURIComponent(data.msg);
                        }
                    },
                    error: function (req) {
                        alert(req.responseText);
                    }
                });
            }
            return false;
        }
    });

    module.find('[name=UserName], [name=Password]').off().on('keypress', function () {
        if (module.find('.tj-text').text() != '') {
            module.find('.tj-text').text('');
        }
    });

    module.find('.wx-login').off().on('click', function () {
        $('.wx-plug').remove();
        var html = '';
        html += '<div class="wx-plug">';
        html += '<div class="wx-plug-content">';
        html += '<header class="wx-plug-title">';
        html += '<span class="wx-title">微信登录</span>';
        html += '<span class="close-wx"></span>';
        html += '</header>';
        html += '<div class="wx-barcode">';
        html += '<div class="wx-item">';
        html += '<iframe src="https://www.gurki99.com/index.php?c=front/Userlogin&a=GoToWxScanLogin&qrcodewidth=260"></iframe>';
        html += '</div>';
        html += '<p>请使用微信扫描二维码登录</p>';
        html += '</div>';
        html += '</div>';
        html += '</div>';

        var wxQrCodeFrame = $(html).appendTo('body');
        $('.close-wx').off().on('click', function () {
            $('.wx-plug').remove();
        });
    });

    module.find('.userlogin-enter-btn').off().on('click', function () {
        $(this).closest('form').submit();
    });

    module.find('.userlogin').off().on('click', function(evt){
        evt = evt || window.event;
        evt.preventDefault();
        if(params.onlyUseWxLogin == 1){
            location.href = '../../../index.php-c=front-Userlogin&a=GoLogin&BackUrl=.htm'/*tpa=https://www.gurki99.com/index.php?c=front/Userlogin&a=GoLogin&BackUrl=*/ + escape(location.href);
        }else{
            location.href = params.loginUrl;
        }
        return false;
    });

    if (layout == 103) {
        new userloginAllshing({
            imgUrlER: 'images/qrcode.png'/*tpa=https://www.gurki99.com/skinp/modules/ModuleUserloginGiant/images/qrcode.png*/,
            imgUrlPC: 'images/computer.png'/*tpa=https://www.gurki99.com/skinp/modules/ModuleUserloginGiant/images/computer.png*/,
            userloginTitleText: params.userloginTitleText,
            scanQrcodeText: params.scanQrcodeText,
            moduleId: moduleId
        });
    }

}

function userloginAllshing(ops) {
    this.imgUrlPC = ops['imgUrlPC'];
    this.imgUrlER = ops['imgUrlER'];
    this.userloginTitleText = ops['userloginTitleText'];
    this.scanQrcodeText = ops['scanQrcodeText'];
    this.moduleId = ops.moduleId;
    this.userloginTitle = $('#module_' + this.moduleId).find('.userlogin-title'); //标题
    this.userloginFrom = $('#module_' + this.moduleId).find('.userlogin-main-content'); //输入区域
    this.userloginQrcode = $('#module_' + this.moduleId).find('.userlogin-qrcode'); //小图标
    this.userloginScan = $('#module_' + this.moduleId).find(".userlogin-scan");
    this.freeRegister = $('.free-registration-other'); //免费注册

    // 初始化
    this.inits();
}
userloginAllshing.prototype = {
    constructor: userloginAllshing,
    inits: function () {
        // 事件
        this.evevtDom();
    },
    changeBox: function () {
        var urlPC = 'url(' + this.imgUrlPC + ') no-repeat center';
        var urlER = 'url(' + this.imgUrlER + ') no-repeat center';
        if (this.userloginFrom.css('display') === 'none') {
            this.userloginFrom.css('display', 'block');
            this.userloginScan.css('display', 'none');
            this.userloginTitle.text(this.userloginTitleText); // 会员登陆
            this.freeRegister.hide();
            // this.userloginQrcode.css('background', urlER);
            this.userloginQrcode.addClass('icon-erweima2').removeClass('icon-diannao1');
            // this.userloginScan.find('img').attr('src','');
            this.userloginScan.find('iframe').attr('src', '');
        } else {
            this.userloginFrom.css('display', 'none');
            this.userloginScan.css('display', 'block');
            this.userloginTitle.text(this.scanQrcodeText); // 扫一扫二维码登陆
            // this.userloginQrcode.css('background', urlPC);
            this.userloginQrcode.removeClass('icon-erweima2').addClass('icon-diannao1');
            this.freeRegister.show();
            // this.userloginScan.find('img').attr('src','');
            this.userloginScan.find('iframe').attr('src', 'https://www.gurki99.com/index.php?c=front/Userlogin&a=GoToWxScanLogin&qrcodewidth=160');
        }
    },
    evevtDom: function () {
        var _this = this;
        // 点击标题右侧小图标事件
        this.userloginQrcode.off().click(function () {
            _this.changeBox();
        });
    }
};