function isDomain(str){
  if(/^[0-9a-z\.]+[0-9a-z\-0-9a-z]+[\.]+[0-9a-z]+$/.test(str)==false) return false;
  else return true;
}

function isEmail(s){
	var regx = /\w+([-+.]\w+)*@\w+([-.]\w+)*\.\w+([-.]\w+)*/;
	return regx.test(s);
}

function isTel(s){
	var regx = /^(86\-)?\d{2,4}\-\d{6,10}(\-\d+)?$/;
	return regx.test(s);
}

function isMobile(s){
	var regx = /^(0)?(1)\d{10}$/;
	// 非简体中文站走国际验证，只需验证是否按指定字符组合即可，不再验证格式
    if (getCookie('Lang') != 'cn') {
        regx = /^[\(\)\+\-\d]{8,17}$/;
    }
	return regx.test(s);
}

function isPostCode(s){
	var regx = /^\d{6}$/;
	return regx.test(s);
}

function isChinese(s){
	var rxp = /^[\u4e00-\u9fa5]+$/g;
	return rxp.test(s);
}

function isPostCode(str)
{
    var reg = /^[0-9]{6}$/;
    return (reg.test(str));
}

function isNumber(s)
{
	var rxp = /^(-|\+)?\d+(\.\d+)?$/;	
	return rxp.test(s);
}

function isInt(s)
{
    var rxp = /^\d+$/
	return rxp.test(s);
}

function isIdCard(idCard) {
    idCard = trim(idCard.replace(/ /g, ""));               //去掉字符串头尾空格                     
    if (idCard.length == 15) {
        return isValidityBrithBy15IdCard(idCard);       //进行15位身份证的验证    
    } else if (idCard.length == 18) {
        var a_idCard = idCard.split(""); 		// 得到身份证数组   
        if (isValidityBrithBy18IdCard(idCard) && isTrueValidateCodeBy18IdCard(a_idCard)) {   //进行18位身份证的基本验证和第18位的验证
            return true;
        } else {
            return false;
        }
    } else {
        return false;
    }
}

function isValidityBrithBy15IdCard(idCard15) {
    var year = idCard15.substring(6, 8);
    var month = idCard15.substring(8, 10);
    var day = idCard15.substring(10, 12);
    var temp_date = new Date(year, parseFloat(month) - 1, parseFloat(day));
    // 对于老身份证中的你年龄则不需考虑千年虫问题而使用getYear()方法   
    if (temp_date.getYear() != parseFloat(year)
            || temp_date.getMonth() != parseFloat(month) - 1
            || temp_date.getDate() != parseFloat(day)) {
        return false;
    } else {
        return true;
    }
}
  
function isTrueValidateCodeBy18IdCard(a_idCard) {
    var Wi = [7, 9, 10, 5, 8, 4, 2, 1, 6, 3, 7, 9, 10, 5, 8, 4, 2, 1];    // 加权因子   
    var ValideCode = [1, 0, 10, 9, 8, 7, 6, 5, 4, 3, 2];            // 身份证验证位值.10代表X 
    var sum = 0;                             // 声明加权求和变量   
    if (a_idCard[17].toLowerCase() == 'x') {
        a_idCard[17] = 10;                    // 将最后位为x的验证码替换为10方便后续操作   
    }
    for (var i = 0; i < 17; i++) {
        sum += Wi[i] * a_idCard[i];            // 加权求和   
    }
    valCodePosition = sum % 11;   	// 得到验证码所位置   
    if (a_idCard[17] == ValideCode[valCodePosition]) {
        return true;
    } else {
        return false;
    }
}

function isValidityBrithBy18IdCard(idCard18) {
    var year = idCard18.substring(6, 10);
    var month = idCard18.substring(10, 12);
    var day = idCard18.substring(12, 14);
    var temp_date = new Date(year, parseFloat(month) - 1, parseFloat(day));
    // 这里用getFullYear()获取年份，避免千年虫问题   
    if (temp_date.getFullYear() != parseFloat(year)
          || temp_date.getMonth() != parseFloat(month) - 1
          || temp_date.getDate() != parseFloat(day)) {
        return false;
    } else {
        return true;
    }
}

function trim(str) {
    return str.replace(/(^\s*)|(\s*$)/g, "");
}

function GetEvent(){
	if(document.all) return window.event;//如果是ie
	func = GetEvent.caller;
	while(func != null){
		var arg0 = func.arguments[0];
		if(arg0)
		{
			if((arg0.constructor == Event || arg0.constructor == MouseEvent) ||(typeof(arg0) == "object" && arg0.preventDefault && arg0.stopPropagation))
			{
				return arg0;
			}
		}
		func = func.caller;
	}
	return null;
}

//trim()
String.prototype.trim = function() {
	return (this.replace(/^\s+|\s+$/g,""));
}
//ltrim()
String.prototype.ltrim = function() {
	return (this.replace(/^\s*/,""));
}
//rtrim()
String.prototype.rtrim = function() {
	return (this.replace(/\s*$/,""));
}
//delete html tags
String.prototype.stripTags = function() {
	return this.replace(/<\/?[^>]+>/gi, '');
}

function numberCeil(num, digit) {
    digit = parseInt(digit);
    if (isNaN(digit)) {
        digit = 0;
    }
    if (digit < 0)
        throw Exception('digit must be greater or equal than 0');
    var scale = 1;
    for (var i = 0; i < digit; i++) {
        scale *= 10;
    }
    return Math.ceil(num * scale) / scale;
}

//重载 setTimeout
var _st = window.setTimeout;
window.setTimeoutEx = function(fRef, mDelay) 
{ 
	if(typeof(fRef) == 'function')
	{ 
		var argu = Array.prototype.slice.call(arguments,2);
		var f = (function(){ fRef.apply(null, argu);});
		return _st(f, mDelay);
	}
	return _st(fRef,mDelay);
}
// end of 重载 setTimeout

//重载 setInterval
var _setInterval = window.setInterval;
window.setIntervalEx = function(fRef, mDelay) 
{ 
	if(typeof(fRef) == 'function')
	{ 
		var argu = Array.prototype.slice.call(arguments,2);
		var f = (function(){ fRef.apply(null, argu);});
		return _setInterval(f, mDelay);
	}
	return _setInterval(fRef,mDelay);
}
// end of 重载 setInterval

/*
  Cookie 相关函数
*/
function getCookieVal(offset) 
{
	var endstr = document.cookie.indexOf (";", offset);
	if (endstr == -1) endstr = document.cookie.length;
	return unescape(document.cookie.substring(offset, endstr));
}
function getCookie(cname)
{
    var cookie = {};
    var all = document.cookie;
    if (all === "") {
        return cookie;
    }
    var list = all.split("; ");
    for (var i = 0; i < list.length; i++) {
        var temp = list[i];
        var pos = temp.indexOf("=");
        var name = temp.substring(0, pos);
        var value = temp.substring(pos + 1);
        try{
            value = decodeURIComponent(value);
        }catch(ex){
            console.log(ex);
        }
        cookie[name] = value;
    }
    return cookie[cname];
	// var arg = name + "=";
	// var alen = arg.length;
	// var clen = document.cookie.length;
	// var i = 0;
    // var cookieArr = document.cookie.split(';'),
    //     cookieLen = cookieArr.length;
    // for(var i; i <cookieLen;i++){
    //     var c2 = cookieArr[i].split('=');
    //     c2[0] = $.trim(c2[0]);
    //     if(c2[0] == name){
    //         return c2[1];
    //     }
    // }
	// while (i < clen) 
	// {
	// 	var j = i + alen;
	// 	if (document.cookie.substring(i, j) == arg) {
 //            if(i == 0) return getCookieVal (j);
 //            else if(/[\s;]/.test(document.cookie[i-1])) return getCookieVal (j);
 //        }
	// 	i = document.cookie.indexOf(" ", i) + 1;
	// 	if (i == 0) break; 
	// }
	// return null;
}
function SetCookie(name, value) {
    var argv = SetCookie.arguments;
    var argc = SetCookie.arguments.length;
    var expires = (2 < argc) ? argv[2] : null;
    var path = (3 < argc) ? argv[3] : null;
    var domain = (4 < argc) ? argv[4] : null;
    var secure = (5 < argc) ? argv[5] : false;
    document.cookie = name + "=" + escape(value) +
        ((expires == null) ? "" : (typeof expires === "number" ? "; max-age=" + expires : "; expires=" + expires.toGMTString())) +
        ((path == null) ? "" : ("; path=" + path)) +
        ((domain == null) ? "" : ("; domain=" + domain)) +
        ((secure == true) ? "; secure" : "");
}
if(typeof setCookie == 'undefined') setCookie = SetCookie;
/*
var expdate = new Date();
expdate.setTime(expdate.getTime() +  (24 * 60 * 60 * 1000 * 365)); //一年后过期
SetCookie("WebTongCid", WebTongCid, expdate ,"/");
*/
//** end of Cookie 相关函数
if(typeof(formatColorHex) == 'undefined'){
	function formatColorHex(color) {
		var reg = /^#([0-9a-fA-f]{3}|[0-9a-fA-f]{6})$/;
		/*RGB颜色转换为16进制*/
		if (/^(rgb)/i.test(color)) {
			var aColor = color.replace(/(?:\(|\)|rgb)*/gi, "").split(",");
			var strHex = "#";
			for (var i = 0; i < aColor.length; i++) {
				var hex = Number(aColor[i]).toString(16);
				if (hex.length == 1) {
					hex = "0" + hex;
				} //问题出在这里
				if (hex === "0") {
					hex += hex;
				}
				strHex += hex;
			}
			if (strHex.length !== 7) {
				strHex = color;
			}
			return strHex;
		} else if (reg.test(color)) {
			var aNum = color.replace(/#/, "").split("");
			if (aNum.length === 6) {
				return color;
			} else if (aNum.length === 3) {
				var numHex = "#";
				for (var i = 0; i < aNum.length; i += 1) {
					numHex += (aNum[i] + aNum[i]);
				}
				return numHex;
			}
		} else {
			return color;
		}
	}
}

//动态加载 jscript
window.addedScript = {};
function addScript(path,callback,afterPageLoaded) {
	if(window.ScriptCdn) {
		if(!/^((https?:\/\/)|(\/\/))/i.test(path)) path = window.ScriptCdn + path;
	}
	if(window.addedScript[path]){
		if(window.addedScript[path]== -1 && typeof callback == 'function'){
			setTimeout(function(){addScript(path,callback,afterPageLoaded)},50);
			return;
		}
		if(window.addedScript[path] == 1){
			console.log(path + " have already loaded ");
			if (typeof callback == 'function') callback();
			return;
		}
	}
	window.addedScript[path] = -1;
	var addfun = function(){
		var fileref = document.createElement("script")
		fileref.type = "text/javascript";
		fileref.src = path;
		if (typeof fileref.onload != 'undefined') {
			fileref.onload = function(){
				window.addedScript[path] = 1;
				if (typeof callback == 'function') callback();
			};
		}
		else {
			fileref.onreadystatechange = function () {
				if (this.readyState == "loaded" || this.readyState == "complete") {
					window.addedScript[path] = 1;
					if (typeof callback == 'function') callback();
				}
			};
		}
		var headobj = document.getElementsByTagName('head')[0];
		headobj.appendChild(fileref);
	};
	if(afterPageLoaded){
		if(window.addEventListener) window.addEventListener('load', function(){ addfun(); }, false);
		else window.attachEvent('onload', function(){ addfun(); });
	}else addfun();
}
//动态加载一大波 jscript，保证按顺序加载
function addScripts(paths, callback, afterPageLoaded) {
    paths = paths || [];
    var lastCb = callback;
    for (var i = 0; i < paths.length; i++) {
        lastCb = (function () {
            var path = paths[paths.length - 1 - i];
            var cb = lastCb;
            var afterPageLoaded1 = afterPageLoaded;
            return function () {
                addScript(path, cb, afterPageLoaded1);
            }
        })(i);
    }
    lastCb();
}

window.addedCss = {};
function loadStyleSheet(path,afterPageLoaded){
	if(window.addedCss[path]){
		console.log(path + " have already loaded ");
		return;
	}
	if(afterPageLoaded) $(window).load(function(){ $('<link href="'+path+'" type="text/css" rel="stylesheet"/>').appendTo('head'); });
	else $('<link href="'+path+'" type="text/css" rel="stylesheet"/>').appendTo('head');
	window.addedCss[path] = true;
}

//判断一个变量是否是对象
function isObject(obj) {
	if (obj && typeof obj == "object" && (obj instanceof Array) == false) {
		return true;
	}
	return false;
}

//判断一个变量是否是数组
function isArray(obj) {
	if (obj && typeof obj == "object" && (obj instanceof Array) == true) {
		return true;
	}
	return false;
}

(function ($) {
    $.fn.extend({
        "addrSelector":function(options){
            var defaults = {
                loadDefaultAddr: null,
                selectAddr: $.noop,
                createNewAddr: $.noop,
                selectedAddrID: 0,
                isShowIdCardNo: false,
                isManagePage:false//是不是地址管理页面 by hui
            };
            var opts = $.extend({}, defaults, options);
            return this.each(function () {
                if (typeof opts.loadDefaultAddr == 'function') {
                	$.getJSON('https://www.gurki99.com/index.php?c=front/Useraddr&a=GetDefaultAddr', {}, function (json) {
                        if (!json.success) {
                            alert(json.msg);
                            return;
                        }
                        opts.loadDefaultAddr(json.addr);
                        if (json && json.addr && !isNaN(Number(json.addr.ID)) && parseInt(json.addr.ID) > 0) {
                            opts.selectedAddrID = parseInt(json.addr.ID);
                        }
                    });
                }
                if(opts.isManagePage){
                    getUserAddrList(opts);
                }else{
                    $(this).off('click.showAddrSelector').on('click.showAddrSelector', function () {
                        getUserAddrList(opts);
                    })
                }
                    
            });
        }
    });
    var getUserAddrList = function(opts){
        if ($('#userAddrContent').length == 0) {
            $.extend({
                selectAddr: function (addr) {
                    if (typeof opts.selectAddr == 'function')
                        opts.selectAddr(addr);
                },
                createNewAddr: function (addr) {
                    if (typeof opts.createNewAddr == 'function')
                        opts.createNewAddr(addr);
                },
                selectedAddrID: opts.selectedAddrID,
                isShowIdCardNo: opts.isShowIdCardNo,
                isManagePage:opts.isManagePage
            });
            $.ajax({
                type: 'get',
                url: 'https://www.gurki99.com/index.php?c=front/Useraddr',
                dataType: 'html',
                success: function (msg) {
                    $(msg).hide().appendTo('body');
                    $('#userAddrContent').stop().fadeIn();
                },
                error: function (XMLHttpRequest, textStatus, errorThrown) {
                    alert(XMLHttpRequest.responseText);
                }
            })
        } else {
            // $('#userAddrContent .addrList .addr .selectbtn').css('display','none');
            // $('#userAddrContent .addrList .addr[addrID=' + $.selectedAddrID + '] .selectbtn').css('display','inline-block');
            $('#userAddrContent .addrList .addr .select-status').hide();
            $('#userAddrContent .addrList .addr[addrID=' + $.selectedAddrID + '] .select-status').show();
            $('#userAddrContent').stop().fadeIn();
        }
    };
})(window.jQuery);

(function ($) {
    $.fn.extend({
        "districtSeletor": function (options) {
            if (options == 'setValue') {
                dataBind(arguments[1] || {}, this);
                return this;
            } else {
                return this.each(function () {
                    var opts = $.extend({}, defaults, options);
                    var $this = $(this);
                    var sHtml = '';
                    sHtml = '<style>.districtSelector select{margin: 0.5rem 0.3rem 1rem;min-width: 4rem;}</style>'
                    sHtml += '<select class="level level1" level="1" name="country"><option value="1">中国</option><option value="-1">其他</option></select>';
                    sHtml += '<select class="level level2" level="2" name="province"></select>';
                    sHtml += '<select class="level level3" level="3" name="city"></select>';
                    sHtml += '<select class="level level4" level="4" name="district"></select>';
                    $this.html(sHtml).addClass('districtSelector')//.attr('relid=' + relid);

                    if (opts.showCountry) {
                        $this.find('.level1').show();
                    } else {
                        $this.find('.level1').hide();
                    }

                    $this.find('.level1').on('change', function () {
                        if ($(this).val() == 1) {
                            $(this).nextAll('select').show();
                            getNextLevelList(this);
                        } else {
                            $(this).nextAll('select').hide();
                        }
                    })

                    $this.find('.level2, .level3').on('change', function () {
                        getNextLevelList(this);
                    });

                    dataBind(opts, $this);
                });
            }
        }
    });
    var defaults = {
        countryID: 1,
        provinceID: null,
        cityID: null,
        districtID: null,
        showCountry: 1
    };
    var getNextLevelList = function (selectElem) {
        selectElem = $(selectElem);
        var id = parseInt(selectElem.val());
        if (isNaN(id)) return;
        var level = parseInt(selectElem.attr('level'));
        selectElem.nextAll('select').html('<option value="0">--请选择--</option>');
        if (id <= 0) return;

        $.ajax({
            type: 'get',
            url: 'https://www.gurki99.com/index.php?c=front/district&a=getChildrenList',
            data: { act: 'getChildrenList', id: id },
            async: false,
            dataType: 'json',
            success: function (json) {
                if (!json.success) {
                    alert(json.msg);
                    return;
                }
                var targetSelectElem = selectElem.nextAll('.level' + (level + 1));
                var list = json.list || [];
                for (var i = 0; i < list.length; i++) {
                    targetSelectElem.append('<option value="' + list[i].ID + '">' + list[i].Name + '</option>');
                }
                if (list.length == 0) {
                    targetSelectElem.hide();
                    targetSelectElem.nextAll('.level' + (level + 2)).hide();
                    targetSelectElem.nextAll('.level' + (level + 3)).hide();
                } else {
                    targetSelectElem.show();
                    targetSelectElem.nextAll('.level' + (level + 2)).show();
                    targetSelectElem.nextAll('.level' + (level + 3)).show();
                }
            },
            error: function (XMLHttpRequest, textStatus, errorThrown) {
                alert(XMLHttpRequest.responseText);
            }
        })
    };
    var dataBind = function (opts, $this) {
        if (opts.countryID && parseInt(opts.countryID) > 0) {
            $this.find('.level1').val(opts.countryID).change();
        } else {
            $this.find('.level1').val(-1).change();
        }
        if (opts.provinceID && parseInt(opts.provinceID) > 0) {
            $this.find('.level2').val(opts.provinceID).change();
        }
        if (opts.cityID && parseInt(opts.cityID) > 0) {
            $this.find('.level3').val(opts.cityID).change();
        }
        if (opts.districtID && parseInt(opts.districtID) > 0) {
            $this.find('.level4').val(opts.districtID).change();
        }
    };
    $.fn.districtSeletor.setValue = function (opts) {
        dataBind(opts);
    }
})(window.jQuery);
// 获取当前页面url参数
if (!window.location.getQueryString) window.location.getQueryString = function (name) {
    var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)", "i");
    var r = window.location.search.substr(1).match(reg);
    if (r != null) return (r[2]); return null;
}

var Base64 = {

    // private property
    _keyStr: "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/=",

    // public method for encoding
    encode: function(input) {
        var output = "";
        var chr1, chr2, chr3, enc1, enc2, enc3, enc4;
        var i = 0;

        input = Base64._utf8_encode(input);

        while (i < input.length) {

            chr1 = input.charCodeAt(i++);
            chr2 = input.charCodeAt(i++);
            chr3 = input.charCodeAt(i++);

            enc1 = chr1 >> 2;
            enc2 = ((chr1 & 3) << 4) | (chr2 >> 4);
            enc3 = ((chr2 & 15) << 2) | (chr3 >> 6);
            enc4 = chr3 & 63;

            if (isNaN(chr2)) {
                enc3 = enc4 = 64;
            } else if (isNaN(chr3)) {
                enc4 = 64;
            }

            output = output + this._keyStr.charAt(enc1) + this._keyStr.charAt(enc2) + this._keyStr.charAt(enc3) + this._keyStr.charAt(enc4);

        }

        return output;
    },

    // public method for decoding
    decode: function(input) {
        var output = "";
        var chr1, chr2, chr3;
        var enc1, enc2, enc3, enc4;
        var i = 0;

        input = input.replace(/[^A-Za-z0-9\+\/\=]/g, "");

        while (i < input.length) {

            enc1 = this._keyStr.indexOf(input.charAt(i++));
            enc2 = this._keyStr.indexOf(input.charAt(i++));
            enc3 = this._keyStr.indexOf(input.charAt(i++));
            enc4 = this._keyStr.indexOf(input.charAt(i++));

            chr1 = (enc1 << 2) | (enc2 >> 4);
            chr2 = ((enc2 & 15) << 4) | (enc3 >> 2);
            chr3 = ((enc3 & 3) << 6) | enc4;

            output = output + String.fromCharCode(chr1);

            if (enc3 != 64) {
                output = output + String.fromCharCode(chr2);
            }
            if (enc4 != 64) {
                output = output + String.fromCharCode(chr3);
            }

        }

        output = Base64._utf8_decode(output);

        return output;

    },

    // private method for UTF-8 encoding
    _utf8_encode: function(string) {
        string = string.replace(/\r\n/g, "\n");
        var utftext = "";

        for (var n = 0; n < string.length; n++) {

            var c = string.charCodeAt(n);

            if (c < 128) {
                utftext += String.fromCharCode(c);
            } else if ((c > 127) && (c < 2048)) {
                utftext += String.fromCharCode((c >> 6) | 192);
                utftext += String.fromCharCode((c & 63) | 128);
            } else {
                utftext += String.fromCharCode((c >> 12) | 224);
                utftext += String.fromCharCode(((c >> 6) & 63) | 128);
                utftext += String.fromCharCode((c & 63) | 128);
            }

        }

        return utftext;
    },

    // private method for UTF-8 decoding
    _utf8_decode: function(utftext) {
        var string = "";
        var i = 0;
        var c = c1 = c2 = 0;

        while (i < utftext.length) {

            c = utftext.charCodeAt(i);

            if (c < 128) {
                string += String.fromCharCode(c);
                i++;
            } else if ((c > 191) && (c < 224)) {
                c2 = utftext.charCodeAt(i + 1);
                string += String.fromCharCode(((c & 31) << 6) | (c2 & 63));
                i += 2;
            } else {
                c2 = utftext.charCodeAt(i + 1);
                c3 = utftext.charCodeAt(i + 2);
                string += String.fromCharCode(((c & 15) << 12) | ((c2 & 63) << 6) | (c3 & 63));
                i += 3;
            }

        }

        return string;
    }

}