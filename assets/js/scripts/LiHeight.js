// JavaScript Document
/**
 * 给统一的样式设置高度
 * @author lijingui
 * @param options（参数组）
 */
function LiHeight(options) {
	var self = this;
	self.options = $.extend({}, LiHeightDefaults, options || {});
	self._init();
}

var cfg;
$.extend(LiHeight.prototype, {
	// 页面初始化
	_init : function() {
		var self = this, cfg = self.options;
		if (cfg.targetCls == null || $(cfg.targetCls + "")[0] === undefined) {
			if (window.console) {
				//console.log("targetCls不为空!");
			}
			return;
		}
		if (!cfg.fixedMaxHeight && cfg.fixedHeight == null) {
			//console.log("targetCls默认不操作，随文本自动变化高度");
			return;
		}
		self._componentSetHeight(cfg.fixedMaxHeight, cfg.targetCls, cfg.fixedHeight);
	},

	/**
	 * 给组件设置高度
	 * @param fixedMaxHeight:是否按照'目标选择器'最高度的高度来设置
	 * @param targetClass：目标选择器值
	 * @param fixedHeight：固定高度(默认没有固定高度，按照内容自己变化)
	 */
	_componentSetHeight : function(fixedMaxHeight, targetClass, fixedHeight) {
		var curHeight = this._componentGetHeight(fixedMaxHeight, targetClass, fixedHeight);
		$(targetClass).each(function() {
			$(this).css("height", curHeight);
		});
	},

	/**
	 * 得到要设置的高度
	 * @param fixedMaxHeight:是否按照'目标选择器'最高度的高度来设置
	 * @param targetClass：目标选择器值
	 * @param fixedHeight：固定高度(默认没有固定高度，按照内容自己变化)
	 * @returns 要设置的高度值
	 */
	_componentGetHeight : function(fixedMaxHeight, targetClass, fixedHeight) {
		var result = fixedHeight;
		// 所有的设置统一固定高度（死值）
		if (!fixedMaxHeight && fixedHeight != null) { 
			//console.log("所有的设置统一固定高度（死值）:" + result);
			return result;
		}
		// 得到目标选择器里面最大的高度
		result = 0;
		//因为放到标签时  初始化也调用了此方法 但是不显示的元素获取的高度为0  
		//所以再此调用此方法的时候就一直为0了  这里要设置为auto一下 才能获取正确的高度
		$(targetClass).css('height', 'auto');
		$(targetClass).each(function() {
			var curHeight = $(this).height();
			if (curHeight > result) {
				result = curHeight;
			}
		});
	  //console.log("得到所有对象里面最高的值:" + result);
		return result;
	}
});

var LiHeightDefaults = {
	'targetCls' : null, // 要处理的容器
	'fixedMaxHeight' : true, // 是否按照最高度的高度来设置，默认是true
	'fixedHeight' : null // 固定高度(默认没有固定高度，按照内容自己变化)
};

// 调用说明
// 不设置值，默认随文本变化调用方法
//new LiHeight({ "targetCls" : '.liClass', "fixedMaxHeight":false, "fixedHeight": null });
// 设置固定值
//new LiHeight({ "targetCls" : '.liClass', "fixedMaxHeight":false, "fixedHeight": 20 });
// 不设置值，默认设置目标选择器里面的最大的高度
//new LiHeight({ "targetCls" : '.liClass', "fixedMaxHeight":true, "fixedHeight": null });