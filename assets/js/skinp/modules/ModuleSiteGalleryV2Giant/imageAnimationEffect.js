(function() {

	'use strict';

	window['imageAnimationEffect'] = function ($el, options) {
		if (!(this instanceof imageAnimationEffect)) return new imageAnimationEffect($el, options);
		// 初始化数据
		var elemArray = [], // 所有轮询的复制节点
			timer = null, // 轮播循环
			defaultIndex = 0, // 标记轮播的位置
			defaults = {num: 4, row: 2, speed: 2, time: 2,type:'carousel'}, // 默认值
			elEventClickArray = [], // $el已有的点击事件
			defaultOptions = $.extend({}, defaults, options); // 合并默认值
		var elemoriArray = []
		// 获取需要复制的节点
		$el.each(function(index, el) {
			elemoriArray.push($(el).clone(true))
			$(el).find('.image-animate').remove();
			var insertElem = $(el).children().clone(true)[0]
			$(insertElem).css('visibility', 'visible')
			$(insertElem).addClass('image-animate')
			elemArray.push(insertElem)
			var eventData = $._data(el, 'events')
			eventData && eventData.click && eventData.click.forEach(function(elem, index1) {
				if (elem.namespace == 'lgcustom') {
					elEventClickArray[index] = elem
				}
			})
		});
		// 更新循环参数
		this.update = function(options) {
			defaultOptions = $.extend({}, defaultOptions, options);
			defaultIndex = 0
			this.init()
		}

		this.init = function() {
			
			var changeElem = [].filter.call($el, function(el, index) {
				return index < defaultOptions.num * defaultOptions.row
			}), // 需要显示的元素
			hideElem = [].filter.call($el, function(el, index) {
				return index >= defaultOptions.num * defaultOptions.row
			}); // 需要隐藏的元素
			changeElem.forEach(function(el) {
				$(el).show()
			})
			hideElem.forEach(function(el) {
				$(el).hide()
			})

			// 初始化节点
			$el.find('.image-animate').detach()
			// 根据情况是否轮播
			if (elemArray.length <= defaultOptions.num * defaultOptions.row) {
				$el.children().css('visibility', 'visible')
				$el.off('mouseover.animation mouseout.animation')
				clearInterval($el.parent().data('timer') || null)
				clearInterval(timer)
				$el.find('.image-animate').detach()
				return
			} else {
				$el.children().css('visibility', 'hidden')
			}

			// 悬停停止轮播
			$el.off('mouseover.animation mouseout.animation').on('mouseover.animation mouseout.animation', function(event){
				if(event.type == "mouseover" && timer) {
					clearInterval($el.parent().data('timer') || null)
					clearInterval(timer)
					timer = null
				} else if (!timer){
					setAnimateInterval()
				}
			})

			// 解除原来的点击事件
			$el.off('click.lgcustom')
			$el.off('click.lgcustomcopy').on('click.lgcustomcopy', function(e) {
				var clickIndex = defaultIndex * defaultOptions.num * defaultOptions.row + $(this).index()
				elEventClickArray[clickIndex] && elEventClickArray[clickIndex].handler.call($el[clickIndex], new Event('click'))
			})

			// 初始化轮播
			clearInterval($el.parent().data('timer') || null)
			clearInterval(timer)
			changeElem.forEach(function(elem, index) {
				$(elemArray[index]).removeClass('old-'+defaultOptions.type+'-' + defaultOptions.speed + ' new-'+defaultOptions.type+'-' + defaultOptions.speed)
				$(elem).append(elemArray[index]);
			})

			// 开启轮播循环
			function setAnimateInterval() {
				timer = setInterval(function() {
					if ((defaultIndex+1) * defaultOptions.num * defaultOptions.row >= elemArray.length) {
						defaultIndex = 0
					} else {
						defaultIndex += 1
					}
				
					changeElem.forEach(function(elem, index) {
						$(elem).find('.image-animate').css({
							'-webkit-animation-delay': 0.1 * index + 's',
							'-o-animation-delay': 0.1 * index + 's',
							'-moz-animation-delay': 0.1 * index + 's',
							'animation-delay': 0.1 * index + 's'
						})
						var indexs = defaultIndex * defaultOptions.num * defaultOptions.row + index;
						$(elem).find('.old-'+defaultOptions.type+'-' + defaultOptions.speed).removeClass('old-'+defaultOptions.type+'-' + defaultOptions.speed).detach()
						$(elem).find('.image-animate').removeClass('new-'+defaultOptions.type+'-' + defaultOptions.speed).addClass('old-'+defaultOptions.type+'-' + defaultOptions.speed);
						
						var insertEl = elemArray[indexs]
						var link = $(elemoriArray[indexs]).attr('href')
						if (insertEl) {
							$(insertEl).removeClass('old-'+defaultOptions.type+'-' + defaultOptions.speed)
							$(insertEl).addClass('new-'+defaultOptions.type+'-' + defaultOptions.speed)
							$(insertEl).css({
								'-webkit-animation-delay': 0.1 * index + 's',
								'-o-animation-delay': 0.1 * index + 's',
								'-moz-animation-delay': 0.1 * index + 's',
								'animation-delay': 0.1 * index + 's'
							})
							if(link != undefined && insertEl!=undefined){
								$(elem).attr('href',link)
							}else{
								$(elem).attr('href','javascript:;')
							}
							$(elem).append(insertEl)
						}
					})
				}, (parseInt(defaultOptions.time) + parseInt(defaultOptions.speed)) * 1000)
				$el.parent().data('timer', timer)
			}
			setAnimateInterval()
		}

		this.init()
	}
})()