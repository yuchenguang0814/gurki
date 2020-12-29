if(typeof(ModuleHiddenSetting) == 'undefined')
{
	function ModuleHiddenSetting(moduleid,selector,hiddenInfo,debug){
		if(!selector) selector = window.parent.findEditWin().$('#module_'+moduleid);
		var selectorClone = window.parent.findEditWin().$('#fixed_module_' + moduleid); // 用于放到body下fixed定位的元素
		this.moduleid = moduleid;
		this.selector = selector;
		this.selectorClone = selectorClone;
		this.hiddenInfo = hiddenInfo;
		this.debug = debug;

		this.init = function(){
			this.hiddenInfo = this.FormatValue(this.hiddenInfo) || "";
			var hiddenArr = this.hiddenInfo.split(/\s+/);
			this.arrHidden = {};
			for(var i = 0; i < hiddenArr.length;i++){
				if(hiddenArr[i]) this.arrHidden[hiddenArr[i]] = true;
			}
			this.arrHiddenOld = $.extend({}, this.arrHidden);
			if(this.debug) console.log(this.arrHiddenOld);
		}

		this.FormatValue = function(prop)
		{
		    var str = "";
		    if (prop) str = prop;
			else if(prop === 0) str = 0;
			else if(prop === false) str = false;
		    else str = null;
		    return str;
		}
		this.setHideShow = function(action,hideclass, flag){
			var num = 0;
			for(var key in this.arrHidden){
				if(this.arrHidden[key] == true) num++;
			}
			if(!flag && num >= 3 && action == 'add'){
				alert('至少要在其中一个界面显示,不能全部隐藏');
				return false;
			}
			if(action == 'add'){
				this.selector.addClass(hideclass);
				this.selectorClone.addClass(hideclass);
				this.arrHidden[hideclass] = true;
				if(window.parent.toggleMobilePad) window.parent.toggleMobilePad(-1);
			}else{
				this.selector.removeClass(hideclass);
				this.selectorClone.removeClass(hideclass);
				this.arrHidden[hideclass] = false;
				if(window.parent.toggleMobilePad) window.parent.toggleMobilePad(-1);
			}
			if(this.debug) console.log(this.arrHidden);
			return true;
		}
		/**
		** 只做数据提交，不做显示隐藏模块（这种情况用于必须从新加载模版的情况下）
		**/
		this.postHideShow = function(action,hideclass) {
			if(action == 'add'){
				this.arrHidden[hideclass] = true;
			}else{
				this.arrHidden[hideclass] = false;
			}
		}

		this.save = function(flag){
	        var hiddenstr = "";
	        for(var key in this.arrHidden){
				if(this.arrHidden[key] == true) hiddenstr += key + " ";
			}
	        hiddenstr = hiddenstr.replace(/^\s+|\s+$/,'');
			var jq = window.parent.$; //默认调用父窗口的JQ，以便在 window.onbeforeunload 事件中可以调用，否则在某些情况下，当本窗口被刷新时，ajax请求会被中止
			if(!jq) jq = $;
	        return jq.ajax({
	            type: "post",
	            url: "https://www.gurki99.com/index.php?c=admin/module/ModuleStyleSetting&a=EditHidden",
	            async: flag ? true : false,
	            cache: false,
	            dataType: "json",
	            data: { 
					"mid": this.moduleid,
					"Hidden": hiddenstr
				},
				success:function(){
                    window.parent.findEditWin().cancelOrRedoObj.savecancellist( window.parent.findEditWin().cancelOrRedoObj.tempdata)
				},
	            error: function(){
	                alert('发生异常(ModuleHiddenSetting)');
	            }
	        });
	    }

	    this.reset = function(){
		    var arr = ['mhidden-lg','mhidden-md','mhidden-sm','mhidden-xs'];
		    for(var i in arr){
			    this.selector.removeClass(arr[i]);
			    this.selectorClone.removeClass(arr[i]);
			    // 清除行内样式的display
				// this.selector.css('display', '');
				// this.selectorClone.css('display', '');
		    }
		    for(var key in this.arrHiddenOld){
				if(this.arrHiddenOld[key] == true) {
					this.selector.addClass(key);
					this.selectorClone.addClass(key);
				}
			}
			window.parent.toggleMobilePad(-1);
	    }
	}
}