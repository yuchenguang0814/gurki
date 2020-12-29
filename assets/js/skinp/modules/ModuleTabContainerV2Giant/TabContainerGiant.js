function TabconmonV2Giantfn(ModuleID, TabSwitch, layout, shuffling, time, speed, canDesign, isFullEdit, isSuspend, tabLocation) {
    // end 新增的标签函数
    var recordIndex;
    $(function () {

        $('#tab_content_clone_module_' + ModuleID).remove()
        if ($.inArray(layout, ['103', '106', '110']) > -1 && isSuspend == '1' && shuffling == '1') {
            showSuspend(ModuleID, TabSwitch)
        }
		// xiaxiao
		if(layout == 112){
			$(".glyphicon").hover(function(){
				$(this).find("span").attr("class",$(this).find("span").attr("data-name2"));
			},function(){
				$(this).find("span").attr("class",$(this).find("span").attr("data-name1"));
			});

			$('#module_' + ModuleID + ' .Nav-Container li .OneRow').click(function(){
				// 标签数量小于2
				if($('#module_' + ModuleID + ' .nav li').length < 2) return false;
				// 如果点击自己
				if($(this).parent().is(".active")) return false;

				var index = $(this).parent().index();
				xxInitAnimationLayout(ModuleID, layout, index);
				return false;
			});
			// 风格11 按钮鼠标移动, 动态显示
            $('#module_' + ModuleID + ".glyphicon").on("mouseenter",function(){
				$(this).find("span").css("top",$(this).height());
				$(this).find("span").animate({
					top: "0px"
				}, 300 );
			});
		}

		function xxInitAnimationLayout(ModuleID, layout, index) {
			var liObj = $('#module_' + ModuleID + ' .nav li');
			var itemWidth = $('#module_' + ModuleID + ' .tabContainerGiantGrid.active').outerWidth();
			var switchWidth = $('#module_' + ModuleID + ' .tabContainerGiantGrid.active').outerWidth(true);
			var overallWidth = $('#module_' + ModuleID + ' .tabContainerGiantGrid.active').outerWidth(true) * liObj.length;

			$('#module_' + ModuleID + ' .tabContentGiant').css({
				'transform': 'translate3d(0px, 0px, 0px)',
				'transition': 'all 1s ease 0s',
				'width': overallWidth + 'px',
				'display': 'flex'
			});
			$('#module_' + ModuleID + ' .tabContainerGiantGrid').css({
				'width': itemWidth + 'px',
				'display': 'inline-block'
			});

			nextObj = $('#module_' + ModuleID + ' .nav li:eq('+index+')');

			if (nextObj.length > 0) {
				liObj.removeClass('active');
				nextObj.addClass('active');
				var hrefID = nextObj.find('.OneRow').attr('data-href-id');
				$('#module_' + ModuleID + ' .tabContentGiant .tabContainerGiantGrid').removeClass('active');
				$('#module_' + ModuleID + ' .tabContentGiant .tabContainerGiantGrid' + hrefID).addClass('active');
				$('#module_' + ModuleID + ' .tabContentGiant').css('transform', 'translate3d(-'+ index * switchWidth +'px, 0px, 0px)')
				solvePluginEvent(nextObj, TabSwitch, ModuleID);
			}
		}
		// end

        if ($.inArray(layout, ['111','112']) < 0) {
            // 监听li外层父元素的宽度变化
            $('#module_' + ModuleID + ' .Nav-Container').resize(function () {
                if(isMobileBroswer()) return false;
                var lengths = 0;
                var liLenth = $('#module_' + ModuleID + ' .Nav-Container li');
                liLenth.each(function (index, el) {
                    lengths += $(el).outerWidth();
                })
                if (lengths > $('#module_' + ModuleID + ' .Nav-Container').width()) {
                    $('#module_' + ModuleID + ' .ModuleTabContainerV2Giant .btnScrollLeft').css("display", "inline-block");
                    $('#module_' + ModuleID + ' .ModuleTabContainerV2Giant .btnScrollRight').css("display", "inline-block");
                } else {
                    $('#module_' + ModuleID + ' .ModuleTabContainerV2Giant .btnScrollLeft').css("display", "none");
                    $('#module_' + ModuleID + ' .ModuleTabContainerV2Giant .btnScrollRight').css("display", "none");
                }
            })
            // 监听li元素的宽度变化显示隐藏按钮
            $('#module_' + ModuleID + ' .Nav-Container li').resize(function () {
                if(isMobileBroswer()) return false;
                var totalLengths = 0;
                var liObjs = $('#module_' + ModuleID + ' .Nav-Container li');
                liObjs.each(function (index, el) {
                    totalLengths += $(el).outerWidth();
                })
                if (layout == 105) {
                    var margins = $('#module_' + ModuleID + ' ul.Nav-Container li').css('margin-right').substring(0, 2);
                    totalLengths += Number(margins * 3);
                }
                if (totalLengths <= $('#module_' + ModuleID + ' .Nav-Container').width()) {
                    $('#module_' + ModuleID + ' .ModuleTabContainerV2Giant .btnScrollLeft').css("display", "none");
                    $('#module_' + ModuleID + ' .ModuleTabContainerV2Giant .btnScrollRight').css("display", "none");
                } else {
                    $('#module_' + ModuleID + ' .ModuleTabContainerV2Giant .btnScrollLeft').css("display", "inline-block");
                    $('#module_' + ModuleID + ' .ModuleTabContainerV2Giant .btnScrollRight').css("display", "inline-block");
                }
            })
        }
        if ($.inArray(layout, ['110', '103', '106']) > -1) {
            openNewLink('#module_' + ModuleID, TabSwitch)
        }
    });

    if ($.inArray(layout, ['101', '102', '103', '104', '105', '106', '110']) > -1) {
        var scrollIndex = 0;
        var translateIndex = 0;
        var totalLength = 0;
        var totalWidth = 0;
        var liObj = $('#module_' + ModuleID + ' .nav li');

        if (window.CanDesign == 'False') {
            showShuffling($('#module_' + ModuleID + ' .Nav-Container li'), layout,false,0)
        }
        if (TabSwitch == 'hover') {
            $('#module_' + ModuleID + ' .tabContainer .nav li').off('mouseenter.hover').on('mouseenter.hover', function () {
                // 先赋值宽度
                if (window.CanDesign == 'False') {
                    $('#tab_content_clone_module_' + ModuleID).width($('#module_' + ModuleID).find('.Nav-Container').width())
                    // show出panel
                    $(this).children('a').tab('show');
                } else {
                    if (layout == 110) {
                        $(this).parent().find('.commonLabel').removeClass('active')
                        $(this).addClass('active')
                        $('#module_' + ModuleID + ' .tabContentGiant .tabContainerGiantGrid').removeClass('active')
                        $('#module_' + ModuleID + ' .tabContentGiant .tabContainerGiantGrid' + $(this).find('.OneRow').attr('data-href-id')).addClass('active')
                        initFuncCommon($($(this).find('a[data-toggle=tab]').attr('href')));
                        //$('#module_' + ModuleID + ' a[data-toggle=tab]').tab('show')
                    }
                }
                // 在浏览器标识为手机端时,不显示的tab项的优酷视频内容高度会被优酷直接设置为0px,必须重新赋值更新内容
                var elemIndex = $(this).index();
                recordIndex = elemIndex + 1
                var contentElem = $('#module_' + ModuleID).find($(this).find('a').attr('href'));
                if (!navigator.userAgent.match(/(iPhone|iPod|Android|ios|SymbianOS)/i) || contentElem.find('iframe').length == 0 || elemIndex == 0) {
                    return
                }
                if (!contentElem.data('insert-html')) {
                    contentElem.find('iframe').each(function (index, elem) {
                        $(elem).attr('src', elem.src)
                    })
                    contentElem.data('insert-html', true)
                }
            }).off('mouseleave.hover').on('mouseleave.hover', function (e) {
                if (window.CanDesign == 'False') {
                    $(this).removeClass('active')
                    if (e.toElement && (e.toElement.classList.contains('tabContainerGiantGrid') || $(e.toElement).closest('.tab-content-parent').length > 0 || e.toElement.classList.contains('horizontal-bar'))) {
                        if (!$(this).hasClass('active')) {
                            $(this).addClass('active')
                        }
                    } else {
                        if (navigator.userAgent.indexOf('Firefox') == -1) {
                            $('#tab_content_clone_module_' + ModuleID).css({
                                height: 0,
                                display: 'none'
                            })
                        }
                    }
                }
            });
        } else if (TabSwitch == 'click') {
            $('#module_' + ModuleID + ' .tabContainer .nav li').off('click.click').on('click', function () {
                if (window.innerWidth < 768 && !$(this).hasClass('active') && !$('#module_' + ModuleID + ' .tabContainer .glyphicon.btnScrollRight').is(':hidden')) {
                    scrollIndex = $(this).index();
                    $('#module_' + ModuleID + ' .tabContainer .glyphicon.btnScrollRight').click();
                }
                initFuncCommon($($(this).find('a[data-toggle=tab]').attr('href')));
                // 在浏览器标识为手机端时,不显示的tab项的优酷视频内容高度会被优酷直接设置为0px,必须重新赋值更新内容
                var elemIndex = $(this).index();
                recordIndex = elemIndex + 1
                var contentElem = $('#module_' + ModuleID).find($(this).find('a').attr('href'));
                if (!navigator.userAgent.match(/(iPhone|iPod|Android|ios|SymbianOS)/i) || contentElem.find('iframe').length == 0 || elemIndex == 0) {
                    return
                }
                if (!contentElem.data('insert-html')) {
                    contentElem.find('iframe').each(function (index, elem) {
                        $(elem).attr('src', elem.src)
                    })
                    contentElem.data('insert-html', true)
                }
            });
        }

        $('#module_' + ModuleID + ' a[data-toggle=tab]').on('https://www.gurki99.com/skinp/modules/ModuleTabContainerV2Giant/shown.bs.tab', function () {
            // 获取子节点的高度赋值给父节点
            // 展示悬浮
            if (isSuspend == '1') {
                showDropMenu(ModuleID, this);
            }
            var id = $(this).attr('href');
            $(id).find('*').each(function () {
                if ($(this).data('masonry')) {
                    $(this).masonry();
                }
                if ($(this).is('.ModuleItem')) {
                    var moduleid = ($(this).attr('id') || '').replace(/module_/i, '');
                    var initFunc = window['initFunc' + moduleid];
                    if (typeof initFunc == 'function') {
                        initFunc();
                    }
                }
            });
        });

        $('#module_' + ModuleID + ' a[data-toggle=tab]').on('https://www.gurki99.com/skinp/modules/ModuleTabContainerV2Giant/shown.bs.tab', function () {
            initFuncCommon($($(this).attr('href')));
            for (var key in window) {

                // 当为地图模块时要重新初始化
                if (key.substr(0, 11) == 'initMapFunc') {
                    var mid = key.replace(/[^0-9]/g, '');
                    // 横向排列的标签
                    if ($('#tab_content_clone_module_' + ModuleID).length > 0 && $('#tab_content_clone_module_' + ModuleID + ' .tab-pane').eq($(this).parent().index()).find("#module_" + mid).length > 0) {
                        var fn = window[key]
                        $('#tab_content_clone_module_' + ModuleID).queue(function () {
                            fn()
                            $(this).parent().dequeue()
                        })
                    }
                    if ($("#module_" + ModuleID + " .tab-pane").eq($(this).parent().index()).find("#module_" + mid).length > 0) {
                        var fun = window[key];
                        // 使用定时器是因为，直接初始化时某些节点未生成导致地图标题初始化不正确
                        var funTime = setInterval(function () {
                            fun()
                            clearInterval(funTime);
                        }, 500);
                    }
                    // 纵向排列的标签
                    else if ($(this).parent().closest('.Nav-Container').find('.tabContentGiantWb #module_' + mid).length > 0) {
                        //  将swiper初始化放到动画队列里面，防止动画还没完成就初始化
                        $(this).parent().closest('.Nav-Container').find('.tabContentGiantWb #module_' + mid).queue(function () {
                            var func = window[key];
                            // 使用定时器是因为，直接初始化时某些节点未生成导致地图标题初始化不正确
                            var funTime = setInterval(function () {
                                func()
                                clearInterval(funTime);
                            }, 450);
                            $(this).parent().dequeue()
                        })
                    }
                }
            }
        });

        initParameter();

        $(window).off('resize.' + ModuleID).on('resize.' + ModuleID, function () {
            if(isMobileBroswer()) return false;
            // 当前屏幕不显示的时候隐藏body的内容（悬浮状态用到）
            if (!$('#module_' + ModuleID).is(':visible')) {
                $('body>[id$="_' + ModuleID + '"]').css('display', 'none')
            }
            $('#module_' + ModuleID + ' .tabContainer .glyphicon').removeAttr('style');
            liObj.parent().css({'transform': 'translateX(0px)'});
            liObj.removeClass('active');
            liObj.eq(0).addClass('active');
            var hrefID = $.inArray(parseInt(layout), [101, 102, 104]) > -1 ? liObj.eq(0).find('.OneRow').attr('href') : liObj.eq(0).find('.OneRow').attr('data-href-id');
            $('#module_' + ModuleID + ' .tabContentGiant .tabContainerGiantGrid').removeClass('active');
            $('#module_' + ModuleID + ' .tabContentGiant .tabContainerGiantGrid' + hrefID).addClass('active');
            if ($.inArray(tabLocation, ['bottom']) > -1 && window.innerWidth > 767) {
                $('#module_' + ModuleID + ' .tab-location-bottom li').eq(0).addClass('active');
            }
            initParameter();
        });

        function initParameter() {
            scrollIndex = 0;
            translateIndex = 0;
            totalLength = 0;
            totalWidth = $('#module_' + ModuleID + ' .nav').outerWidth(true);
            liObj.each(function (index, el) {
                totalLength += $(el).outerWidth(true);
            });
            if (layout == 105) {
                var margins = liObj.css('margin-right').substring(0, 2);
                totalLength += Number(margins * 3);
            }

            if (totalLength <= totalWidth) {
                $('#module_' + ModuleID + ' .ModuleTabContainerV2Giant .btnScrollLeft').css("display", "none");
                $('#module_' + ModuleID + ' .ModuleTabContainerV2Giant .btnScrollRight').css("display", "none");
            } else {
                $('#module_' + ModuleID + ' .ModuleTabContainerV2Giant .btnScrollLeft').css("display", "flex");
                $('#module_' + ModuleID + ' .ModuleTabContainerV2Giant .btnScrollRight').css("display", "flex");
            }

            $('#module_' + ModuleID + ' .tabContainer .glyphicon').off('click.changeShow').on('click.changeShow', function () {
                liObj.parent().stop().css({
                    'transition-duration': '0ms',
                    '-moz-transition-duration': '0ms',
                    '-webkit-transition-duration': '0ms',
                    '-o-transition-duration': '0ms'
                });
                $(this).removeAttr('style');
                $(this).siblings().removeAttr('style');
                if ($(this).hasClass('btnScrollRight')) {
                    scrollIndex = Math.floor(Math.abs(translateIndex) / liObj.eq(0).outerWidth(true)) + 1;
                    if (scrollIndex * liObj.eq(0).outerWidth(true) + totalWidth >= totalLength) {
                        scrollIndex -= 1;
                        translateIndex = -totalLength + totalWidth;
                        $(this).css('color', 'rgb(204, 204, 204)');
                    } else {
                        translateIndex = -scrollIndex * liObj.eq(0).outerWidth(true);
                    }
                    liObj.parent().css({'transform': 'translateX(' + translateIndex + 'px)'});
                    var nextObj = liObj.parent().find('li.active').next();
                    if (nextObj.length > 0) {
                        liObj.removeClass('active');
                        nextObj.addClass('active');
                        var hrefID = $.inArray(parseInt(layout), [101, 102, 104]) > -1 ? nextObj.find('.OneRow').attr('href') : nextObj.find('.OneRow').attr('data-href-id');
                        $('#module_' + ModuleID + ' .tabContentGiant .tabContainerGiantGrid').removeClass('active');
                        $('#module_' + ModuleID + ' .tabContentGiant .tabContainerGiantGrid' + hrefID).addClass('active');
                        solvePluginEvent(nextObj, TabSwitch, ModuleID);
                    }
                } else {
                    scrollIndex = Math.ceil(Math.abs(translateIndex) / liObj.eq(0).outerWidth(true)) - 1;
                    if (scrollIndex < 0) {
                        scrollIndex += 1;
                        $(this).css('color', 'rgb(204, 204, 204)');
                        translateIndex = 0;
                    } else {
                        translateIndex = -scrollIndex * liObj.eq(0).outerWidth(true);
                    }
                    if (scrollIndex == 0) $(this).css('color', 'rgb(204, 204, 204)');
                    liObj.parent().css({'transform': 'translateX(' + translateIndex + 'px)'});
                    var prevObj = liObj.parent().find('li.active').prev();
                    if (prevObj.length > 0) {
                        liObj.removeClass('active');
                        prevObj.addClass('active');
                        var hrefID = $.inArray(parseInt(layout), [101, 102, 104]) > -1 ? prevObj.find('.OneRow').attr('href') : prevObj.find('.OneRow').attr('data-href-id');
                        $('#module_' + ModuleID + ' .tabContentGiant .tabContainerGiantGrid').removeClass('active');
                        $('#module_' + ModuleID + ' .tabContentGiant .tabContainerGiantGrid' + hrefID).addClass('active');
                        solvePluginEvent(prevObj, TabSwitch, ModuleID);
                    }
                }
            });
            var start = 0;
            if ($('#module_' + ModuleID + ' .nav li').width() * ($('#module_' + ModuleID + ' .nav li').length) >= $('#module_' + ModuleID + ' .nav').width()) {
                $('#module_' + ModuleID + ' .nav').off('touchstart').on('touchstart', function (e) {
                    var parentWidth = totalWidth;
                    start = e.originalEvent.targetTouches[0].pageX;
                    $(this).css({
                        'transition-duration': '0ms',
                        '-moz-transition-duration': '0ms',
                        '-webkit-transition-duration': '0ms',
                        '-o-transition-duration': '0ms'
                    });
                    $(this).off('touchmove').on('touchmove', function (e) {
                        var end = e.originalEvent.targetTouches[0].pageX - start;
                        start = e.originalEvent.targetTouches[0].pageX;
                        translateIndex = translateIndex + end;
                        if (translateIndex > 0) {
                            translateIndex = 0
                        }
                        if (translateIndex < -totalLength + parentWidth) {
                            translateIndex = -totalLength + parentWidth;
                        }
                        $(this).css({'transform': 'translateX(' + translateIndex + 'px)'});
                        return false;
                    })
                    $(this).off('touchend').on('touchend', function (e) {
                        typeof e.parentDefault === 'function' && e.parentDefault()
                    })
                    e.stopPropagation();
                })
            }
        }
    } else if ($.inArray(layout, ['107', '108', '109']) > -1) {
        var module = $('#module_' + ModuleID);
        var windowWidth = window.innerWidth;
        //109禁用mouseenter
        if (layout == '109') {
            TabSwitch = 'click';
        }

        function portraitTab() {
            if (TabSwitch == 'click' || windowWidth < 768) {
                module.find('.TabConOption').off('click.click mouseenter.hover').on('click.click', function () {
                    windowWidth = window.innerWidth;
                    TabConContainershow(this, true)
                    // 在浏览器标识为手机端时,不显示的tab项的优酷视频内容高度会被优酷直接设置为0px,必须重新赋值更新内容
                    var elemIndex = $(this).closest('.TabConcontent').index();
                    recordIndex = elemIndex + 1
                    var contentElem = $(this).siblings('.tabContentGiantWb').find('.inTabConContainer');
                    if (!navigator.userAgent.match(/(iPhone|iPod|Android|ios|SymbianOS)/i) || contentElem.find('iframe').length == 0 || elemIndex == 0) {
                        return
                    }
                    if (!contentElem.data('insert-html')) {
                        contentElem.find('iframe').each(function (index, elem) {
                            $(elem).attr('src', elem.src)
                        })
                        contentElem.data('insert-html', true)
                    }
                })
            } else {
                module.find('.TabConOption').off('mouseenter.hover click.click').on('mouseenter.hover', function () {
                    TabConContainershow(this, false)
                    // 在浏览器标识为手机端时,不显示的tab项的优酷视频内容高度会被优酷直接设置为0px,必须重新赋值更新内容
                    var elemIndex = $(this).closest('.TabConcontent').index();
                    recordIndex = elemIndex + 1
                    var contentElem = $(this).siblings('.tabContentGiantWb').find('.inTabConContainer');
                    if (!navigator.userAgent.match(/(iPhone|iPod|Android|ios|SymbianOS)/i) || contentElem.find('iframe').length == 0 || elemIndex == 0) {
                        return
                    }
                    if (!contentElem.data('insert-html')) {
                        contentElem.find('iframe').each(function (index, elem) {
                            $(elem).attr('src', elem.src)
                        })
                        contentElem.data('insert-html', true)
                    }
                })
            }
        }

        if (layout != '109') {
            if (canDesign != 1) {
                showShuffling($('#module_' + ModuleID + ' .Nav-Container'), layout,false,0)
            }
        }

        function TabConContainershow(obj, isc) {
            var tabContentGiantWb = $(obj).closest('.TabConcontent').find('.tabContentGiantWb');
            var TabConOptions = module.find('.TabConOption');
            var currentTabConcontent = $(obj).closest('.TabConcontent');
            var currentTabConcontentSbiling = currentTabConcontent.siblings();
            if (isc && windowWidth < 768 || layout == 109) {
                TabConOptions.removeClass('active');
                $(obj).addClass('active');
                if (layout != 107) {
                    TabConOptions.find('.iconimg').removeClass('icon-jian');
                    TabConOptions.find('.iconimg').addClass('icon-jia');
                    //兄弟元素全部收回
                    currentTabConcontentSbiling.find('.tabContentGiantWb').stop().slideUp(300);
                    currentTabConcontentSbiling.find('.TabConOption').attr('toge', '0');
                }
                //自己如果是收起来的就展开
                if ($(obj).attr('toge') != 1) {
                    tabContentGiantWb.stop().slideDown(300, function () {
                        initFuncCommon(tabContentGiantWb)
                    });
                    $(obj).attr('toge', 1);
                    $(obj).find('.iconimg').removeClass('icon-jia');
                    $(obj).find('.iconimg').addClass('icon-jian');
                } else {
                    //自己如果是展开的就展开收起来
                    tabContentGiantWb.stop().slideUp(300);
                    $(obj).attr('toge', '0');
                    if (layout == 107) {
                        $(obj).find('.iconimg').removeClass('icon-jian');
                        $(obj).find('.iconimg').addClass('icon-jia');
                    }
                }
            } else {
                TabConOptions.removeClass('active');
                $(obj).addClass('active');
                module.find('.tabContentGiantWb').css({
                    'display': 'none'
                })
                tabContentGiantWb.css({
                    'display': 'block'
                })
                initFuncCommon(tabContentGiantWb)
                currentTabConcontentSbiling.find('.TabConOption').attr('toge', '0');
                $(obj).attr('toge', '1');
            }
        }

        function windowResize() {
            windowWidth = window.innerWidth;
            if (layout != 109) {
                calculateTop(windowWidth)
            }
            portraitTab()
        }

        function calculateTop(windowWidth) {
            var top = 0;
            var contentBoxWidth = module.find('.TabConcontentWb').outerWidth(true);
            if (windowWidth > 767) {
                var node = $.inArray(layout, ['107', '108']) > -1 ? '.TabConOption.tab-location-top' : '.TabConOption';
                module.find(node).each(function (ide, el) {
                    if ($.inArray(layout, ['107', '108']) > -1) {
                        if (tabLocation == 'top' || tabLocation == 'bottom') {
                            $(el).parent().find('.tabContentGiantWb').css({
                                'left': '-' + (Number($(el).outerWidth(true)) * ide) + 'px',
                                'width': contentBoxWidth
                            })
                        } else {
                            var css = {'position': 'absolute', 'top': top};
                            if (tabLocation == 'right') css['right'] = 0;
                            else css['left'] = 0;
                            $(el).css(css)
                            top += $(el).outerHeight(true);
                        }
                    } else {
                        var css = {'position': 'absolute', 'left': 0, 'top': top};
                        $(el).css(css)
                        top += $(el).outerHeight(true);
                    }
                })
                module.find('.TabConcontentWb').css({
                    'min-height': top,
                })
            } else {
                module.find('.TabConOption').css({
                    'position': "static"
                })
                if ($.inArray(layout, ['107', '108']) > -1 && (tabLocation == 'top' || tabLocation == 'bottom')) {
                    module.find('.tabContentGiantWb').css({'left': '0px', 'width': '100%'})
                }
            }
        }

        $(window).off('resize.' + ModuleID).on('resize.' + ModuleID, function () {
            windowResize();
        });
        windowResize();
    } else if ($.inArray(layout, ['111','112']) > -1) {
        initAnimationLayout(ModuleID, layout);
        $(window).off('resize.' + ModuleID).on('resize.' + ModuleID, function () {
            $('#module_' + ModuleID + ' .tabContentGiant').css({'width': 'auto', 'display': 'block'});
            $('#module_' + ModuleID + ' .tabContainerGiantGrid').css('width', '100%');
            $('#module_' + ModuleID + ' .nav li').removeClass('active');
            $('#module_' + ModuleID + ' .nav li').eq(0).addClass('active');
            initAnimationLayout(ModuleID, layout);
			if(layout == 112) return false; // xiaxiao
            initSubLayout();
        });
        initSubLayout();
    }

    function initSubLayout() {
        $('#module_' + ModuleID + ' .tabContainerGiantGrid').each(function () {
            initFuncCommon($(this));
        });
    }

    function initAnimationLayout(ModuleID, layout) {
        var liObj = $('#module_' + ModuleID + ' .nav li');
        var itemWidth = $('#module_' + ModuleID + ' .tabContainerGiantGrid.active').outerWidth();
        var switchWidth = $('#module_' + ModuleID + ' .tabContainerGiantGrid.active').outerWidth(true);
        var overallWidth = $('#module_' + ModuleID + ' .tabContainerGiantGrid.active').outerWidth(true) * liObj.length;

        $('#module_' + ModuleID + ' .tabContentGiant').css({
            'transform': 'translate3d(0px, 0px, 0px)',
            'transition': 'all 1s ease 0s',
            'width': overallWidth + 'px',
            'display': 'flex'
        });
        $('#module_' + ModuleID + ' .tabContainerGiantGrid').css({
            'width': itemWidth + 'px',
            'display': 'inline-block'
        });

        if (liObj.length < 2) {
            $('#module_' + ModuleID + ' .ModuleTabContainerV2Giant .Nav-Container').css("display", "none");
        } else {
            $('#module_' + ModuleID + ' .tabContainer .glyphicon').off('click.changeShow').on('click.changeShow', function () {
                var nextObj = liObj.parent().find('li.active').next();
                if ($(this).hasClass('btnScrollRight')) {
                    nextObj = nextObj.length > 0 ? nextObj : liObj.eq(0);
                } else {
                    nextObj = liObj.parent().find('li.active').prev();
                    nextObj = nextObj.length > 0 ? nextObj : liObj.eq((liObj.length - 1));
                }
                if (nextObj.length > 0) {
                    liObj.removeClass('active');
                    nextObj.addClass('active');
                    var hrefID = nextObj.find('.OneRow').attr('data-href-id');
                    $('#module_' + ModuleID + ' .tabContentGiant .tabContainerGiantGrid').removeClass('active');
                    $('#module_' + ModuleID + ' .tabContentGiant .tabContainerGiantGrid' + hrefID).addClass('active');
                    $('#module_' + ModuleID + ' .tabContentGiant').css('transform', 'translate3d(-'+ nextObj.index() * switchWidth +'px, 0px, 0px)')
                    solvePluginEvent(nextObj, TabSwitch, ModuleID);
                }
            });
        }

        if (window.CanDesign == 'False') {
            showShuffling(liObj, layout, true, switchWidth)
        }
    }

    // 注意：该文件不可以直接使用off()函数将'.Nav-Container>li'里面的悬停、点击事件给off掉，必须加别名去off('https://www.gurki99.com/skinp/modules/ModuleTabContainerV2Giant/click.xxx')
    function openNewLink(module, TabSwitch) {
        $(module).off((window.CanDesign == 'False' ? 'click.toLink' : 'dbclick.toLink')).on((window.CanDesign == 'False' ? 'click.toLink' : 'dbclick.toLink'), ' .tab-link', function () {
            if ($(this).attr('on-link-href') != '' && $(this).attr('on-link-href') != 'undefined' && $(this).attr('on-link-href') != '' && window.CanDesign == 'False') {
                // 平板特殊处理
                if (window.innerWidth < 1200 && window.innerWidth > 767) {
                    if ($($(this).find('a').attr('href')).closest('.tab-content-parent').height() > 30 && $($(this).find('a').attr('href')).find('.ModuleItem').length > 0) {
                        window.location.href = $(this).attr('on-link-href')
                    } else if ($($(this).find('a').attr('href')).find('.ModuleItem').length == 0) {
                        window.location.href = $(this).attr('on-link-href')
                    }
                } else {
                    window.location.href = $(this).attr('on-link-href')
                }
            }
        })
    }

    //创建一个数组；用来储存标签的数量
    function initFuncCommon($obj) {
        var id = $obj.attr('data-href-id');
        $obj.find('*').each(function (idx, el) {
            if ($(this).is('.ModuleItem')) {
                var moduleid = ($(this).attr('id') || '').replace(/module_/i, '');
                var initFunc = window['initFunc' + moduleid];
                var initSwiperFuncSiteGalleryByMobile = window['initSwiperFunc' + moduleid+'SiteGalleryByMobile'];
                var news121Multiple =  window['news121Multiple' + moduleid];
                if (typeof initFunc == 'function') {
                    initFunc()
                }
                if (typeof initSwiperFuncSiteGalleryByMobile == 'function') {
                    initSwiperFuncSiteGalleryByMobile();
                }
                if (typeof news121Multiple == 'function') {
                    news121Multiple()
                }
            }
        });
    }

    /**
     * 悬浮标签展示
     * 先记录旧的位置, 删除旧的，然后再追加到body里面去，
     * 初始化悬浮的方法
     * @param 模块Id 是否悬停
     */
    function showSuspend(ModuleID, TabSwitch) {
        if (TabSwitch == 'hover') {
            setTimeout(function () {
                $('#tab_content_clone_module_' + ModuleID).remove()
                var moduleSelector = $('#module_' + ModuleID)
                var tabContentParent = $('<div class="tab-content-parent" id="tab_content_clone_module_' + ModuleID + '"></div>')
                var tabContent = moduleSelector.find('.tab-content.tabContentGiant')
                var offLeft = moduleSelector.closest('.ModuleItem').offset().left
                tabContentParent.append(tabContent)
                var moduleHeight = moduleSelector.outerHeight(),
                    modulePosTop = moduleSelector.offset().top,
                    modulePosLeft = moduleSelector.offset().left;
                tabContentParent.css({
                    top: (modulePosTop + moduleHeight) + 'px',
                    left: '0px',
                    display: 'none',
                    'z-index': '9999'
                })
                tabContentParent.appendTo('body')
                var paddLeft = Number(tabContentParent.css('paddingLeft').replace('px', ''))
                tabContent.css({
                    width: isFullEdit == '1' ? moduleSelector.closest('.ModuleGridContainer').width() : moduleSelector.find('.TabContainer-Container').outerWidth(),
                    transform: isFullEdit == '1' ? '' : 'translate3d(' + (offLeft - paddLeft) + 'px,0px,0px)',
                    margin: isFullEdit == '1' ? '0 auto' : '',
                    display: 'block'
                })
                tabContent.find('.ModuleContainer.TabSubGridContainer').css('padding', '0')
                tabContent.find('.addnewhelper').css('marginBottom', '0')
                if (window.CanDesign == 'False') {
                    tabContentParent.hover(function () {
                        // 我就是什么事情都不干
                    }, function () {
                        tabContentParent.css({
                            height: 0,
                            display: 'none'
                        })
                        moduleSelector.find('.commonLabel.active').removeClass('active')
                    })
                }
                if (moduleSelector.is(':visible')) {
                    showDropMenu(ModuleID, null)
                    unclickHideMenu(ModuleID)
                }
                return true
            }, window.CanDesign != 'False' ? 2000 : 1000)
        }
    }

    // 点击悬浮
    function showDropMenu(ModuleID, subTarget) {
        $('#tab_content_clone_module_' + ModuleID).css('display', 'block')
        var times = 0
        // 解决相册模块因为使用的插件太多了，图片也多，所以初始化过程漫长，解决一下先
        if ($('#tab_content_clone_module_' + ModuleID).find('.tab-pane:visible .ModuleItem .ModuleSiteGalleryV2Giant.layout-110').length > 0 || $('#tab_content_clone_module_' + ModuleID).find('.tab-pane:visible .ModuleItem .ModuleSiteGalleryV2Giant.layout-104').length > 0) {
            times = 500
        }
        setTimeout(function () {
            // 是平板端，特殊处理
            // 点击第一次打开悬浮，点击第二次执行跳转
            if ($(this).parent().offset()) {
                $('#tab_content_clone_module_' + ModuleID).css({
                    top: (layout == '110' ? $(this).parent().offset().top + $(this).parent().outerHeight() + 9 : $(this).parent().offset().top + $(this).parent().outerHeight() - 1) + 'px',
                })
            }

            // 获取真实高度
            var tabContentHeight = $('#tab_content_clone_module_' + ModuleID).find('.tab-pane:visible').height()
            // 判断是否有内容
            if ((tabContentHeight > 5 && $('#tab_content_clone_module_' + ModuleID)
                .find('.tab-pane:visible .ModuleItem').length > 0) || window.CanDesign != 'False') {
                // 执行下滚
                $('#tab_content_clone_module_' + ModuleID).stop().animate({
                    height: tabContentHeight + 'px'
                }, 'fast', 'swing', function () {
                    // 我也是什么事情都不干
                    $(this).css('height', 'auto')
                    // 判断下方是否存在模块，存在模块去除addnewhelper
                    if ($('#tab_content_clone_module_' + ModuleID).find('.tab-pane:visible .ModuleItem').length > 0) {
                        $('#tab_content_clone_module_' + ModuleID).find('.tab-pane:visible  .addnewhelper').remove()
                    }
                })
                // 没内容就隐藏了
            } else {
                if (window.CanDesign == 'False') {
                    $('#tab_content_clone_module_' + ModuleID).css({
                        height: 0,
                        display: 'none'
                    })
                }
            }
        }.bind(subTarget), times)
    }

    // 关闭悬浮框
    function unclickHideMenu(ModuleID) {
        $('body').off('click.hideTabMenu').on('click.hideTabMenu', function (e) {
            if ($('.tab-content-parent:visible').length > 0
                && !$(e.target).hasClass('tab-content-parent') && ($(e.target).closest('.tab-content-parent').length == 0 && !$(e.target).hasClass('tab-content-parent'))
                && !$(e.target).hasClass('tab-link') &&
                ($(e.target).closest('tab-link').length == 0 && !$(e.target).hasClass('tab-link')
                    && $(e.target).closest('#moduleHelper').length == 0
                )
            ) {
                $('#module_' + ModuleID).find('.tab-link.active').removeClass('active')
                $('.tab-content-parent:visible').css({
                    display: 'none',
                    height: '0px'
                })
            }
        })
    }

    function showShuffling(ID, layout, isSwitch, switchWidth) {

        //是否轮播
        var numIndex = 0 // 丛下标0开始轮播
        var numLength = ID.length - 1;

        // 按顺序执行
        function sequential(elm, numIndex, layout, isSwitch, switchWidth) {
            if (layout == '107' || layout == '108') {
                elm.find('.commonLabel').eq(numIndex).addClass("active");
                elm.find('.commonLabel').eq(numIndex - 1).removeClass("active");
                elm.find('.commonLabel').eq(numIndex - 1).tab('show');
                elm.find('.commonDiv').eq(numIndex).addClass("active");
                elm.find('.commonDiv').eq(numIndex).css('display', 'block');
                elm.find('.commonDiv').eq(numIndex - 1).css('display', 'none');
                elm.find('.commonDiv').eq(numIndex - 1).removeClass("active");
                elm.find('.commonDiv').eq(numIndex - 1).tab('show');
			}else if ( layout == '112' ){ // xiaxiao
				elm.find('.commonLabel').removeClass("active");
				elm.find('.commonLabel').eq(numIndex).addClass("active");
			} else {
                elm.find('.commonLabel').eq(numIndex).addClass("active");
                elm.find('.commonLabel').eq(numIndex - 1).removeClass("active");
                elm.find('.commonLabel:eq(' + (numIndex - 1) + ') a[data-toggle=tab]').tab('show');
            }
            if (isSwitch) $('#module_' + ModuleID + ' .tabContentGiant').css('transform', 'translate3d(-'+ numIndex * switchWidth +'px, 0px, 0px)')
        }

        // 悬停时继续执行
        function hover(elm, numIndex, numLength, layout, isSwitch, switchWidth) {
            if (layout == '107' || layout == '108') {
                elm.find('.commonLabel').eq(0).addClass("active");
                elm.find('.commonLabel').eq(numIndex - 1).removeClass("active");
                elm.find('.commonLabel').eq(numLength).tab('show');
                elm.find('.commonDiv').eq(0).addClass("active");
                elm.find('.commonDiv').eq(numIndex - 1).removeClass("active");
                elm.find('.commonDiv').eq(0).css('display', 'block');
                elm.find('.commonDiv').eq(numIndex - 1).css('display', 'none');
                elm.find('.commonDiv').eq(numLength).tab('show');
            } else {
                elm.find('.commonLabel').eq(0).addClass("active");
                elm.find('.commonLabel').eq(numLength).removeClass("active");
                elm.find('.commonLabel:eq(' + numIndex + ') a[data-toggle=tab]').tab('show');
            }
            if (isSwitch) $('#module_' + ModuleID + ' .tabContentGiant').css('transform', 'translate3d(-'+ numIndex * switchWidth +'px, 0px, 0px)')
        }

        function isShuffling(elm) {
            if (shuffling == 1) return null;
            var testInter = setInterval(function () {
                // 如果节点不存在则移除循环
                if (!elm || !$.contains(document.body, elm[0])) {
                    clearInterval(testInter)
                }
                numIndex++;
                if (recordIndex) {
                    if (layout == '107' || layout == '108') {
                        numIndex = recordIndex
                        if (numIndex <= numLength) {
                            sequential(elm, numIndex, layout, isSwitch, switchWidth)
                        } else {
                            numIndex = 0
                            hover(elm, numIndex, numLength, layout, isSwitch, switchWidth)
                        }
                    } else {
                        numIndex = recordIndex + 1
                        if (numIndex <= (numLength + 1)) {
                            sequential(elm, numIndex, layout, isSwitch, switchWidth)
                        } else {
                            numIndex = 0
                            hover(elm, numIndex, numLength, layout, isSwitch, switchWidth)
                            numIndex = 1
                        }
                    }
                    recordIndex = ''
                } else {
                    if (numIndex - numLength > 1) {
                        numIndex = 1
                    }
                    if (numIndex > numLength) {
                        numIndex = 0
                    }
                    sequential(elm, numIndex, layout, isSwitch, switchWidth)
                }
            }, (Number(speed) + Number(time)) * 500);
            return testInter;
        }

        var testInterval = null;
        var windowWidth = window.innerWidth
        if (window.innerWidth > 767) testInterval = isShuffling($('#module_' + ModuleID + ' .Nav-Container'))
        window.onresize = function () {
            if (window.innerWidth == windowWidth) return;
            clearInterval(testInterval);
            windowWidth = window.innerWidth
            if (window.innerWidth < 768) {
                testInterval = null;
                return;
            }
            testInterval = isShuffling($('#module_' + ModuleID + ' .Nav-Container'));
        }
        $('#module_' + ModuleID + ' .tabContainer').off('mouseenter mouseleave').on({
            mouseenter: function () {
                clearInterval(testInterval)
                testInterval = null;
            },
            mouseleave: function () {
                if (window.innerWidth >= 768) {
                    clearInterval(testInterval)
                    testInterval = isShuffling($('#module_' + ModuleID + ' .Nav-Container'))
                }
            }
        });
    }

    function solvePluginEvent(e, tabSwitch, ModuleID) {
        for (var key in window) {
            if (key.substr(0, 14) == 'initSwiperFunc' || key.substr(0, 11) == 'initMapFunc') {
                var mid = key.replace(/[^0-9]/g, '');
                // 横向排列的标签
                var tabIndex = $(e).index()
                if ($('#tab_content_clone_module_' + ModuleID).length > 0 && $('#tab_content_clone_module_' + ModuleID + ' .tab-pane').eq(tabIndex).find("#module_" + mid).length > 0) {
                    var fn = window[key]
                    $('#tab_content_clone_module_' + ModuleID).queue(function () {
                        fn()
                        $(this).dequeue()
                    })
                }
                if ($("#module_" + ModuleID + " .tab-pane").eq(tabIndex).find("#module_" + mid).length > 0) {
                    var fun = window[key];
                    // 使用定时器是因为，直接初始化时某些节点未生成导致地图标题初始化不正确
                    var funTime = setInterval(function () {
                        fun()
                        clearInterval(funTime);
                    }, 450);
                }
                // 纵向排列的标签
                else if ($(e).closest('.Nav-Container').find('.tabContentGiantWb #module_' + mid).length > 0) {
                    //  将swiper初始化放到动画队列里面，防止动画还没完成就初始化
                    $(e).closest('.Nav-Container').find('.tabContentGiantWb #module_' + mid).queue(function () {
                        var func = window[key];
                        // 使用定时器是因为，直接初始化时某些节点未生成导致地图标题初始化不正确
                        var funTime = setInterval(function () {
                            func()
                            clearInterval(funTime);
                        }, 450);
                        $(this).dequeue()
                    })
                }
            }
        }
    }
}
