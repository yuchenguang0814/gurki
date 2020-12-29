function initCommonClsGiant(moduleId, layout, showSecondary) {
  function ClearLayoutRemain(sarr) {
    for (var i = 0; i < sarr.length; i++) {
      if ($(sarr[i]).length != 0) {
        $(sarr[i]).remove()
      }
    }
  }

  if (showSecondary == '1') {
    $("#module_" + moduleId + " .sub-class-item-box").css('display', 'block')
    $("#module_" + moduleId + " .main-class-item").find('.main-class-icon').addClass("active")
  } else if (Number(showSecondary) >= 20) {
    var num = Number(showSecondary.toString().substring(1, showSecondary.length))
    for (var i = 0; i < num; i++) {
      $("#module_" + moduleId + " .sub-class-item-box").eq(i).css('display', 'block')
      $("#module_" + moduleId + " .main-class-item").eq(i).find('.main-class-icon').addClass("active");
    }
  }
  ClearLayoutRemain(["#clone_module_" + moduleId, "#clone_module_" + moduleId, '.layout-104dialog' + moduleId, '.layout-109dialog' + moduleId, '.layout-108dialog' + moduleId, '.layout-112dialog' + moduleId, '.layout-110dialog' + moduleId, "#clone_mob_module_" + moduleId, '#pro-106-shade' + moduleId, '#pro-107-shade' + moduleId])//每次初始化删除apped到body的东西
  var curclass = null;
  if ($.inArray(layout, ['101', '102', '103', '104', '105', '108', '109', '112']) > -1) {
    $("#module_" + moduleId + " .main-class-item-box").mouseenter(function () {
      $("#module_" + moduleId + " .main-class-line").not('[iscurrent=1]').removeClass("active");
      $(this).find('.main-class-line').addClass("active");
    }).mouseleave(function () {
      $("#module_" + moduleId + " .main-class-line").not('[iscurrent=1]').removeClass("active");
    });
    $("#module_" + moduleId + " .main-class-item").mouseenter(function () {
      $("#module_" + moduleId + " .main-class-item").not('[iscurrent=1]').removeClass("active");
      $("#module_" + moduleId + " .sub-class-item").not('[iscurrent=1]').removeClass("active");
      $(this).addClass("active");
    }).mouseleave(function () {
      $(this).not('[iscurrent=1]').removeClass("active");
      $("#module_" + moduleId + " .main-class-item").not('[iscurrent=1]').removeClass("active");
      $("#module_" + moduleId + " .sub-class-item").not('[iscurrent=1]').removeClass("active");
    });
    $("#module_" + moduleId + " .sub-class-item").mouseenter(function () {
      $("#module_" + moduleId + " .main-class-item").not('[iscurrent=1]').removeClass("active");
      $("#module_" + moduleId + " .sub-class-item").not('[iscurrent=1]').removeClass("active");
      $(this).closest('.main-class-item-box').find('.main-class-item').addClass("active");
      $(this).addClass("active");
    }).mouseleave(function () {
      $("#module_" + moduleId + " .main-class-item").not('[iscurrent=1]').removeClass("active");
      $("#module_" + moduleId + " .sub-class-item").not('[iscurrent=1]').removeClass("active");
      $(this).not('[iscurrent=1]').removeClass("active");
    });
    $("#module_" + moduleId).find('.main-class-item a,.sub-class-item a,.third-class-item a').each(function () {
    
      var isMatch = false;
      if (layout == '108' || layout == '112') {
        //当没有连接的时候，可能会问题
        if ($(this).attr('href') != '') {
          isMatch = matchCurrentClass($(this).prop('href'));
        }
      } else {
        isMatch = matchCurrentClass($(this).prop('href'));
      }
      if (isMatch) {
        if ($(this).closest('.main-class-item').length > 0) {
          curclass = $(this).closest('.main-class-item');
        } else if ($(this).closest('.sub-class-item').length > 0) {
          curclass = $(this).closest('.sub-class-item');
        } else if ($(this).closest('.third-class-item').length > 0) {
          curclass = $(this).closest('.third-class-item');
        }
      }
    });

    if (curclass != null) curclass.attr('iscurrent', '1').addClass("active");
    if ($.inArray(layout, ['104', '108', '109', '110', '112']) > -1) {
      if (curclass != null && curclass.hasClass('sub-class-item')) {
        curclass.closest('.main-class-item-box').find(".main-class-item").attr('iscurrent', '1').addClass("active");
        curclass.closest('.main-class-item-box').find(".main-class-line").attr('iscurrent', '1').addClass("active");
      } else if (curclass != null && curclass.hasClass('third-class-item')) {
        curclass.closest('.main-class-item-box').find(".main-class-item").attr('iscurrent', '1').addClass("active");
        curclass.closest('.main-class-item-box').find(".main-class-line").attr('iscurrent', '1').addClass("active");
        if (layout != 109) {
          curclass.closest('.main-class-item-box').find(".sub-class-item").attr('iscurrent', '1').addClass("active");
        } else {
          // 109模块特殊处理，dom节点不对
          curclass.closest('.third-class-item-box').prev().attr('iscurrent', '1').addClass("active");
        }
        curclass.closest('.main-class-item-box').find(".sub-class-line").attr('iscurrent', '1').addClass("active");
      }
    }
    if ($.inArray(layout, ['109']) > -1) {
      $("#module_" + moduleId + " .third-class-item").mouseenter(function () {
        $("#module_" + moduleId + " .sub-class-item").not('[iscurrent=1]').removeClass("active");
        $("#module_" + moduleId + " .third-class-item").not('[iscurrent=1]').removeClass("active");
        $(this).closest('.third-class-item-box').prev('.sub-class-item').addClass("active");
        $(this).addClass("active");
      }).mouseleave(function () {
        $("#module_" + moduleId + " .sub-class-item").not('[iscurrent=1]').removeClass("active");
        $("#module_" + moduleId + " .third-class-item").not('[iscurrent=1]').removeClass("active");
      });
    }
    // 二层分类，若无子菜单，则不显示箭头
    if ($.inArray(layout, ['104', '108', '112']) > -1) {
      $("#module_" + moduleId + " .main-class-item.classify").each(function (index, el) {
        var length = $(this).next().children(".sub-class-item").length;
        if (length > 0) $(this).children(".main-class-icon").show();
        else $(this).children(".main-class-icon").hide();
      });
    }
  }
  if ($.inArray(layout, ['101', '102']) > -1) {
    //给titel绑定事件·
    var windowchange = function () {
      var windowwidth = $(window).width();
      if (windowwidth <= 425) {
        //小屏
        $('#module_' + moduleId + ' .classify').off('click').on('click', function () {
          var _this = $(this);
          //切换icon图标
          if (layout == '101') {
            _this.find('.class-title-icon').toggleClass('active');
          } else if (layout == '102') {
            if (_this.attr('unfold') == 'true') {
              _this.find('.class-title-icon').removeClass('icon-jian').addClass('icon-jia');
              _this.attr('unfold', 'false');
            } else {
              _this.find('.class-title-icon').removeClass('icon-jia').addClass('icon-jian');
              _this.attr('unfold', 'true');
            }
          }
          ;
          _this.next().stop().slideToggle(400);
        });
      } else {
        //大屏
        $('#module_' + moduleId + ' .classify').off('click');
      }
      ;
    }
    $(window).off('resize.' + moduleId).on('resize.' + moduleId, function () {
      windowchange();
    });
    windowchange();

    //移动端点击显示下一级
  } else if ($.inArray(layout, ['103']) > -1) {
    $(window).on('resize', function () {
      windowchange103();
    });
    windowchange103();

    //给titel绑定事件
    function windowchange103() {
      var windowwidth = $(window).width();
      if (windowwidth < 768) {
        $('#module_' + moduleId + '.main-class-item').off('click').on('click', function () {
          var _this = $(this);
          $('#module_' + moduleId + '.main-class-item').removeClass('active')
          _this.toggleClass('active');
        });
      }
    }
  } else if ($.inArray(layout, ['104', '108', '109', '110', '112']) > -1) {
    $(window).off('resize.commonCls' + layout + '_' + moduleId).on('resize.commonCls' + layout + '_' + moduleId, function () {
      windowchange();
    });
    //给titel绑定事件
    var windowchange = function () {

      var windowwidth = $(window).width();

      if (windowwidth < 768) {

        var documentscrootop = 0;
        //生成遮罩层和弹窗内容放入body
        $('.mask-layermask-layer').remove();
        if ($('.layout-' + layout + 'dialog' + moduleId).length <= 0) { /* style="padding-top:50px"要判断是否有头部*/
          $('body').append('<div id="layout-dialog' + moduleId + '" class="ModuleCommonClsGiant  layout-' + layout + ' layout-' + layout + 'dialog layout-' + layout + 'dialog' + moduleId + '" id="copy_module_' + moduleId + '"><div class="layout' + layout + 'dialog-left"></div><div class="inlayout-' + layout + 'dialogmodule_' + moduleId + ' inlayout-' + layout + 'dialog' + moduleId + '" style="position:absolute;width:79%;top:0;left:21%;box-sizing:border-box;">' + $('#module_' + moduleId + ' .main-class-container-mobile').html() + '</div></div>');
          $('body').append('<div id="layout-layer' + moduleId + '" class="mask-layermask-layer mask-layermask-layer' + moduleId + '" style="height:100%;padding-bottom:55px;width:100%;position: fixed;top:0;left:0;display: none;background:rgba(0,0,0,.5)"></div>');
        } else {
          $('.layout-' + layout + 'dialog' + moduleId).removeClass('dialog-show').addClass('dialog-hide goback')
        }

        if ($('.mask-layermask-layer' + moduleId).length <= 0) {
          $('body').append('<div id="layout-layer' + moduleId + '" class="mask-layermask-layer mask-layermask-layer' + moduleId + '" style="height:100%;width:100%;position: fixed;top:0;left:0;display: none;background:rgba(0,0,0,.5)"></div>');
        }
        $('.layout-' + layout + 'dialog' + moduleId).find('.main-class-item').show();
        //点击全部分类弹窗出现
        $('#module_' + moduleId + ' .class-title').off('click').on('click', function () {
          // 判断是否存在响应处理
          if ($('meta[name="viewport"]').length <= 0 && (layout == '104' || layout == '108' || layout == '109' || layout == '110' || layout == '112')) {
            return
          }
          $('.layout-' + layout + 'dialog' + moduleId).css({
            'margin': '0',
            'display': 'block'
          }).removeClass('dialog-hide goback').addClass('dialog-show');
          if ($('.mask-layermask-layer').length <= 0) {
            $('body').append('<div id="layout-layer' + moduleId + '" class="mask-layermask-layer mask-layermask-layer' + moduleId + '" style="height:100%;width:100%;position: fixed;top:0;left:0;display: none;background:rgba(0,0,0,.5)"></div>');
          }
          $('.mask-layermask-layer').fadeIn();

          documentscrootop = $(document).scrollTop();
        });

        $('.layout-' + layout + 'dialog' + moduleId + ' .classify').off('click').on('click touch', { multiple: false }, function (e) {
          //给二级添加事件（显示掩藏）
          var _this = $(this);
          _this.parent().toggleClass('on');
          _this.find('.main-class-icon').toggleClass('active');
          _this.next('.sub-class-item-box').stop().slideToggle('slow');
          if ($.inArray(layout, ['108', '109', '110', '112']) > -1) {
            if (!e.data.multiple) {
              var inlayout = _this.parents('div[class^="inlayout"]');
              //将不是当前的ul收回去顺便removecalss.
              if (layout == '110') {
                if (_this.parent().hasClass('main-class-item')) {
                  inlayout.find('.sub-class-item-box').not(_this.parent('.on').find('.sub-class-item-box').eq(0)).slideUp().parent().removeClass('on').find('.main-class-icon.active').removeClass('active')
                } else if (_this.parent().hasClass('child-item')) {
                  //关闭自己的兄弟
                  _this.parent().siblings().find('.sub-class-item-box').slideUp().parent().removeClass('on').find('.main-class-icon.active').removeClass('active');
                }
              } else if (layout == '108' || layout == '109') {
                if (_this.hasClass('main-class-item')) {
                  inlayout.find('.sub-class-item-box,.third-class-item-box').not(_this.parent('.on').find('.sub-class-item-box').eq(0)).slideUp().parent().removeClass('on').find('.main-class-icon.active,.sub-class-icon.active').removeClass('active')
                }
              }
            }
          }
        });
        if ($.inArray(layout, ['109']) > -1) {
          $('.layout-' + layout + 'dialog' + moduleId + ' .sub-class-item').off('click').on('click touch', function () {
            //给三级添加事件（显示掩藏）
            var _this = $(this);
            _this.parent().toggleClass('on');
            _this.find('.sub-class-icon').toggleClass('active');
            _this.next('.third-class-item-box').stop().slideToggle('slow');
            if (_this.parent().hasClass('two-classify')) {
              //关闭自己的兄弟
              _this.parent().find('.third-class-item-box').not(_this.next()).slideUp().prev().find('.sub-class-icon.active').removeClass('active');
            }
          });
        }

        /*点击左侧关闭弹窗*/
        $('.layout-' + layout + 'dialog' + moduleId + ' .layout' + layout + 'dialog-left').off('click').on('click', function () {
          //$('.layout-' + layout + 'dialog' + moduleId).
          $('.layout-' + layout + 'dialog' + moduleId).addClass('dialog-hide');
          $('.mask-layermask-layer').fadeOut('normal', function () {
            $('.layout-' + layout + 'dialog' + moduleId).hide();
          });
        })
        var startX = 0;
        var startY = 0
        var cha = 0;
        var chaY = 0;
        var currenty = 0;
        var maxheight = 0;
        var parentheight = 0;

        function touchstart(e) {
          e = window.event || e;
          if (e.touches) {
            startX = e.targetTouches[0].clientX;
            startY = e.targetTouches[0].clientY;
          } else {
            startX = e.clientX;
            startY = e.clientY;
          }
          ;
          $('.layout-' + layout + 'dialog' + moduleId).off('mousemove').on('mousemove', touchmove);
          var itembox = $(this).find('.main-class-item-box');
          parentheight = $(this).height();
          maxheight = $('.inlayout-' + layout + 'dialog' + moduleId).height();
        }

        function touchmove(e) {
          //防止出现滚动条
          $(document).scrollTop(documentscrootop);
          e = window.event || e;
          e.stopPropagation();
          e.preventDefault();
          if (e.touches) {
            //移动端
            cha = e.targetTouches[0].clientX - startX;
            chaY = e.targetTouches[0].clientY - startY;
            $(this).removeClass('dialog-show goback').css('margin-left', cha);
            if (maxheight > parentheight - 100) {
              $(this).find('.inlayout-' + layout + 'dialog' + moduleId).css('top', chaY + currenty);
            }
          } else {
            //pc端
            cha = e.clientX - startX;
            chaY = e.clientY - startY;
            $(this).removeClass('dialog-show goback').css('margin-left', cha);
            if (maxheight > parentheight - 100) {
              $(this).find('.inlayout-' + layout + 'dialog' + moduleId).css('top', chaY + currenty);
            }
          }
          ;
          //向右边移动才会动，并设置灵敏度为80
          if (cha > 80) {
            $(this).addClass('dialog-hide');
            $('.mask-layermask-layer' + moduleId).fadeOut('normal', function () {
              $('.layout-' + layout + 'dialog' + moduleId).hide();
            });
            $('.layout-' + layout + 'dialog' + moduleId).off('mousemove');
          } else {
            $(this).addClass('goback');
          }
        }

        function touchend(e) {
          $(document).scrollTop(documentscrootop);
          e = window.event || e;
          e.stopPropagation();
          //向右边移动才会动，并设置灵敏度为50
          var endX = 0;
          var endY = 0;
          if (e.changedTouches) {
            endX = e.changedTouches[0].clientX;
            endY = e.changedTouches[0].clientY;
          } else {
            endX = e.clientX;
            endY = e.clientY;
          }
          ;
          currenty = $('.layout-' + layout + 'dialog' + moduleId).find('.inlayout-' + layout + 'dialog' + moduleId).position().top;
          if (currenty < 0 && maxheight > parentheight - 100 && parentheight - maxheight - 95 > currenty) {
            $('.layout-' + layout + 'dialog' + moduleId).find('.inlayout-' + layout + 'dialog' + moduleId).stop().animate({ 'top': parentheight - maxheight - 100 }, function () {
              currenty = parentheight - maxheight - 100;
            });
          }
          ;
          if (maxheight > parentheight - 95 && currenty > 0) {
            $('.layout-' + layout + 'dialog' + moduleId).find('.inlayout-' + layout + 'dialog' + moduleId).stop().animate({ 'top': 0 }, function () {
              currenty = 0;
            })
          }
          if (endX - startX > 50 && endX - startX > endY - currenty) {
            $(this).addClass('dialog-hide');
            $('.mask-layermask-layer' + moduleId).fadeOut('normal', function () {
              $('.layout-' + layout + 'dialog' + moduleId).hide();
            });
          } else {
            //移动距离少于50就会到原位
            $(this).addClass('goback');
          }
          $('.layout-' + layout + 'dialog' + moduleId).off('mousemove');
        }

        $('.layout-' + layout + 'dialog' + moduleId).off('touchstart').on('touchstart', touchstart)
        $('.layout-' + layout + 'dialog' + moduleId).off('touchmove').on('touchmove', touchmove);
        $('.layout-' + layout + 'dialog' + moduleId).off('touchend').on('touchend', touchend);
        $('.layout-' + layout + 'dialog' + moduleId).off('mousedown').on('mousedown', touchstart);
        $('.layout-' + layout + 'dialog' + moduleId).off('mouseup').on('mouseup', touchend);
      } else {
        $('.mask-layermask-layer').remove();
        $('.layout-' + layout + 'dialog' + moduleId).hide();
        if ((layout == '110' && window.innerWidth < 1200) || layout != '110') {
          $('#module_' + moduleId + ' .classify').off('click').on('click', function () {
            var _this = $(this);
            if (layout == '112') {
              _this.parent().toggleClass('active');
            } else {
              _this.find('.main-class-icon').toggleClass('active');
            }
            _this.next('.sub-class-item-box').stop().slideToggle('slow');
          });
        }

        if ($.inArray(layout, ['109']) > -1) {
          $('#module_' + moduleId + ' .sub-class-item').off('click').on('click', function () {
            var _this = $(this);
            _this.find('.sub-class-icon').toggleClass('active');
            _this.next('.third-class-item-box').stop().slideToggle('slow');
          })
        }
      }
      ;
    }
    windowchange();

    if (curclass != null) {
      if ($.inArray(layout, ['104', '108', '112']) > -1 && showSecondary != 0) {
      } else {
        curclass.closest('.main-class-item-box').find('.classify').click();
      }
      // 当是第三级分类选中时展开三级
      if (curclass.hasClass('third-class-item')) {
        curclass.closest('.sub-class-item-box').queue(function () {
          if (layout != 109) {
            curclass.closest('.sub-class-item-box').find('.sub-class-item').click();
          } else {
            curclass.closest('.third-class-item-box').prev('.active').click();
          }
          $(this).dequeue();
        })
      }

    }
    if (layout == '110') {
      initCommonClsPc110(moduleId)
    }
  } else if (layout == '106') {
    initCommonCls106(moduleId);
  } else if (layout == '107') {
    initCommonCls107(moduleId);
  } else if (layout == '111') {
    $('#module_' + moduleId + ' .main-class-item').mouseover(function() {
      if (window.innerWidth >= 768) {
        $(this).parent().find('.sub-class-item-box').css({
          'top': (Number($(this).offset().top) - Number($(window).scrollTop()) + Number($(this).outerHeight(true))) + 'px',
          'left': $(this).offset().left
        });
      }
    });
    $('#module_' + moduleId + ' .main-class-icon').off('click').on('click', function () {
        if ($(this).parents('.main-class-item-box').hasClass('active')) $(this).parents('.main-class-item-box').removeClass('active');
        else $(this).parents('.main-class-item-box').addClass('active');
    });
    $('#module_' + moduleId + ' .class-title').off('click').on('click', function () {
        $('#module_' + moduleId + ' .main-class-container').addClass('active');
    });
    $('#module_' + moduleId + ' .close-icon').off('click').on('click', function () {
      $('#module_' + moduleId + ' .main-class-container').removeClass('active');
    });
  }
}
var windowwidth = window.innerWidth
function initCommonCls106(moduleId) {
  $(window).off('resize.commonCls106_' + moduleId).on('resize.commonCls106_' + moduleId, function () {
    if (windowwidth != window.innerWidth) {
      var windowwidth = windowwidth;
      //大屏和小屏事件不同
      if (windowwidth >= 768) {
        if ($("#clone_mob_module_" + moduleId).length > 0) {
          $("#clone_mob_module_" + moduleId).hide();
        }
        $('#pro-106-shade' + moduleId).hide();
      } else {
        if ($("#clone_mob_module_" + moduleId).length > 0) {
          $("#clone_mob_module_" + moduleId).show();
        }
      }
    }
  })
  initCommonClsPc106(moduleId);
  initCommonClsMob106(moduleId);
}

function initCommonClsPc106(moduleId) {
  var moduleIdSelector = "#module_" + moduleId;
  var cloneId = "#clone_module_" + moduleId;
  var mainItemsrow = document.querySelectorAll(moduleIdSelector + ' .main-class-container .main-class-content>ul.main-class-all-item>.main-class-row');
  var mainItemsBox = document.querySelectorAll(moduleIdSelector + ' .main-class-container .main-class-content');
  // 遍历节点，判断是否有下级菜单，如果没有，那么就把【下级菜单的箭头 icon 图标】 隐藏掉
  $(moduleIdSelector + ' .main-class-container .sub-class-content .sub-class-items').each(function (index) {
    if ($(this).find('.sub-class-row').length === 0) {
      $(moduleIdSelector + ' .main-class-container .main-class-content>ul.main-class-all-item>.main-class-row').eq(index).find('.main-class-icon').hide()
    }
  });
  // 判断是否存在响应处理
  if ($('meta[name="viewport"]').length <= 0) {
    $('.ModuleCommonClsGiant.layout-106 .main-class-container').css('display', 'block');
    $('.ModuleCommonClsGiant.layout-106 .main-class-all-classify').css('display', 'none');
  }
  $(mainItemsrow).off('mouseenter').on('mouseenter', function () {
    var _this = $(this);
    // 获取侧边导航
    $(cloneId).remove();
    //每次移入都生成克隆
    var clone = $("<div id='" + cloneId.replace("#", "") + "' class='ModuleCommonClsGiant layout-106 '><div class='main-class-container' style='margin-top:0;margin-left:0'><div class='main-class-content'></div></div></div>");
    clone.appendTo("body");
    $(moduleIdSelector + ' .main-class-container .sub-class-content').clone().appendTo($(cloneId).find(' .main-class-container .main-class-content'));
    $(cloneId).find('.sub-class-items').hide();
    $(mainItemsrow).removeClass('current');
    // 判断是否存在响应处理
    if ($('meta[name="viewport"]').length <= 0) {
      $('.ModuleCommonClsGiant.layout-106 .main-class-container').css('display', 'block');
    }
    if ($(cloneId).find('.sub-class-items').eq($(this).index()).children().length <= 0) {
      return
    }
    ;
    $(cloneId).find('.sub-class-items').eq($(this).index()).show();
    $(this).addClass('current');
    $(cloneId).css({
      'position': 'absolute',
      'left': ($(this).closest('ul').offset().left + $(this).outerWidth()) + 'px',
      'top': $(this).closest('ul').offset().top + 'px',
      'z-index': '2',
    });
    $(cloneId).find('.sub-class-content').show().css('min-height', $(this).offset().top - $(mainItemsBox).offset().top + $(this).outerHeight())
    $(cloneId).show();
    $(cloneId).off('mouseenter').on('mouseenter', function () {
      $(this).show();
      _this.addClass('current');
    })
    $(cloneId).off('mouseleave').on('mouseleave', function () {
      $(this).remove();
      $(mainItemsrow).removeClass('current');
    })
  });
  $(mainItemsBox).off('mouseleave').on('mouseleave', function (event) {
    var e = event ? event : window.event;
    $(cloneId).hide();
    $(mainItemsrow).removeClass('current');
  });
}

function initCommonClsMob106(moduleId) {
  var cloneIdMob = "#clone_mob_module_" + moduleId;
  if ($(cloneIdMob).length) {
    $(cloneIdMob).remove();
  }
  var moduleClass = $('#module_' + moduleId).children().attr('class') || '';
  // 移动端处理
  var cloneMob = $("<div id='" + cloneIdMob.replace("#", "") + "' class='" + moduleClass + "'><div class='leftLucency'></div></div>");
  cloneMob.append($("#module_" + moduleId + " .main-class-container-mobile").clone(true));
  cloneMob.appendTo("body");
  var leftLucency = $(cloneMob).find('.leftLucency');
  var ulBoxparent = document.querySelector(cloneIdMob + " .main-class-container-mobile .main-class-list-title");
  // 一级导航元素的父盒子
  var ulBox = document.querySelector(cloneIdMob + " .main-class-container-mobile .main-class-list-title>.list-title-all");
  // 获取一级导航元素
  var lis = ulBox.querySelectorAll(cloneIdMob + " .main-class-container-mobile .main-class-item");
  // 移动端最大的父盒子
  var mobileBox = document.querySelector(cloneIdMob + " .main-class-container-mobile");
  // 透明区域块
  var transparentBox = document.querySelector(cloneIdMob + " .main-class-container-mobile>.transparentBox");
  var showbox = document.querySelector('#module_' + moduleId + ' .main-class-all-classify');
  // 获取分类内容区域盒子
  var parentTtems = document.querySelector(cloneIdMob + " .main-class-container-mobile .main-class-list-content");
  // 获取分类内容区域子盒子
  var items = document.querySelectorAll(cloneIdMob + " .main-class-container-mobile .main-class-list-content .main-class-content-item");
  // 封装循环
  var each = function (arr, fn) {
    for (var i = 0; i < arr.length; i++) {
      fn.call(arr[i], i, arr[i]);
    }
  };
  // 给需要滚动的盒子的父盒子添加高度
  parentAddHeight();
  $(transparentBox).attr('id', 'pro-106-shade' + moduleId);
  $('body').append($(transparentBox));

  function parentAddHeight() {
    var bodyHeight;
    if (document.body.clientHeight) {
      bodyHeight = document.body.clientHeight
    } else {
      bodyHeight = document.documentElement.clientHeight;
    }
    var topParent = parentTtems.offsetTop;
    var showHeight = bodyHeight - topParent;
    each(items, function (i, val) {
      val.style.height = showHeight + 'px';
    });
    ulBoxparent.style.height = showHeight + 'px';
  }

  // 记录索引
  var index;
  // 侧边栏事件触发
  slideHoldHk.tap(ulBox, function (e) {
    e.stopPropagation();
    var lia = e.target;
    each(lis, function (i, val) {
      var liBox = this;
      liBox.classList.remove("active");
      if (lia == val) {
        index = i;
      }
    });
    each(items, function (i, val) {
      var itemBox = this;
      itemBox.classList.remove("current");
      if (lia == val) {
        index = i;
      }
      ;
    });
    lia.classList.add("active");
    items[index].classList.add("current");
    slideHoldHk.myslide(cloneIdMob + " .main-class-container-mobile .main-class-list-content .main-class-content-item.current", 50);
  });
  // 点击阴影部分收缩
  slideHoldHk.tap(transparentBox, function () {
    $(mobileBox).fadeOut(300);
    mobileBox.style.transform = 'translateX(100%)';
  });
  // 弹框滑动
  slideHoldHk.boxSlideX(cloneIdMob + ' .main-class-container-mobile');
  // 关闭按钮
  document.querySelector(cloneIdMob + " .main-class-container-mobile .main-class-content-title .close").onclick = function () {
    $(mobileBox).fadeOut(300);
    mobileBox.style.transform = 'translateX(100%)';
    $('#pro-106-shade' + moduleId).fadeOut();
    leftLucency.hide();
  };
  //点击侧边关闭弹窗
  leftLucency.off('click').on('click', function () {
    $(cloneIdMob + " .main-class-container-mobile .main-class-content-title .close").click();
  })
  // 按钮显示
  showbox.onclick = function () {
    mobileBox.style.display = 'block';
    $('#pro-106-shade' + moduleId).fadeIn();
    // 侧边栏
    slideHoldHk.myslide(cloneIdMob + " .main-class-container-mobile .main-class-list-title", 50);
    // 内容展示
    slideHoldHk.myslide(cloneIdMob + " .main-class-container-mobile .main-class-list-content .main-class-content-item.current", 50);
    mobileBox.style.transform = 'translateX(0%)';
    mobileBox.children[0].style.left = "20%";
    //mobileBox
    leftLucency.show();
    setTimeout(function () {
      resetHeightThreeimg(moduleId, '106');
    }, 400);
  };

  //窗口改变大小时
  window.addEventListener('resize', function (e) {
    var windowwidth = $(window).width();
    if (e.target === window) {
      // 侧边栏
      slideHoldHk.myslide(cloneIdMob + " .main-class-container-mobile .main-class-list-title", 50);
      // 内容展示
      slideHoldHk.myslide(cloneIdMob + " .main-class-container-mobile  .main-class-list-content .main-class-content-item.current", 50);
      if ($(cloneIdMob).length > 0) {
        $(cloneIdMob).hide()
      };
    } else {
      if ($(cloneIdMob).length > 0) {
        $(cloneIdMob).show()
      };
    }
  });
};

function initCommonCls107(moduleId) {
  $(window).off('resize.commonCls107_' + moduleId).on('resize.commonCls107_' + moduleId, function () {
    var windowwidth = $(window).width();
    //大屏和小屏事件不同
    if (windowwidth >= 768) {
      if ($("#clone_mob_module_" + moduleId).length > 0) {
        $("#clone_mob_module_" + moduleId).hide();
      }
      ;
    } else {
      if ($("#clone_mob_module_" + moduleId).length > 0) {
        $("#clone_mob_module_" + moduleId).show();
      }
      ;
    }
    ;
  })

  initCommonClsPc107(moduleId);
  initCommonClsMob107(moduleId);
  navShowSubAndStyle(moduleId);
  // 判断是否存在响应处理
  if ($('meta[name="viewport"]').length <= 0) {
    $('.ModuleCommonClsGiant.layout-107 .main-class-container').css('display', 'block');
    $('.ModuleCommonClsGiant.layout-107 .main-class-all-classify').css('display', 'none');
  }
}

function initCommonClsPc107(moduleId) {
  var moduleIdSelector = "#module_" + moduleId;
  var cloneId = "#clone_module_" + moduleId;
  var clone = $("<div id='" + cloneId.replace("#", "") +
    "' class='ModuleCommonClsGiant layout-107 clone'><div class='main-class-container' style='margin-top:0;margin-left:0;position:static'></div></div>"
  );
  clone.appendTo('body');
  clone.find('.main-class-container').append($(moduleIdSelector).find(".sub-class-content-main-show").clone());
}
// 110模块逻辑处理弹出子节点
function buildFirstClone(_this, cloneId) {
  $(_this).addClass("active");
  var clone = $(_this).find(".two-outsize").clone();
  clone.attr('id', cloneId).addClass('ModuleCommonClsGiant').addClass('layout-110');
  clone.appendTo('body');
  //追加到body里面去之后再让它显示出来
  var Ldistance = $(_this).offset().left + $(_this).outerWidth();
  var Tdistance = $(_this).offset().top;
  clone.css({ left: Ldistance, top: Tdistance, "position": "absolute", "z-index": "9999", "opacity": "1", "overflow": 'initial' });
  clone.find('.two-classify').css("display", "block");
}
function initCommonClsPc110(moduleId) {
  var moduleIdSelector = "#module_" + moduleId;
  var cloneId = "clone_module_" + moduleId;
  if (window.innerWidth > 1200) {
    $(moduleIdSelector + ' .main-class-item').off('mouseenter mouseleave').on('mouseenter', function () {
      buildFirstClone(this, cloneId)
    }).on('mouseleave', function (evt) {
      var _this = this;
      evt = evt || window.event;
      var relatedTarget = evt.relatedTarget || evt.toElement;
      if ($(relatedTarget).is('#' + cloneId)) {
        $(relatedTarget).on('mouseleave', function () {
          $(_this).removeClass("active");
          $(this).remove();
        });
        return false;
      } else {
        $(this).removeClass("active");
        $('#' + cloneId).remove();
      }
    });
  } else if (window.innerWidth < 1200 && window.innerWidth > 767) {
    $(moduleIdSelector + ' .main-class-item').off('click').on('click', function () {
      buildFirstClone(this, cloneId)
    })
    $(document).off('click.hidecommonClsMenu')
      .on('click.hidecommonClsMenu', function () {
        $('#' + cloneId).remove();
        event.stopPropagation();
      })
      .on('click.commonClsMenu', '.main-class-item.active,.two-classify-mobile', function (event) {
        event.stopPropagation();
      })
  }

}

function initCommonClsMob107(moduleId) {
  var cloneIdMob = "#clone_mob_module_" + moduleId;
  // 移动端处理·
  var cloneMob = $("<div id='" + cloneIdMob.replace("#", "") + "' class='ModuleCommonClsGiant layout-107 clone'><div class='leftLucency'></div></div>");
  cloneMob.append($("#module_" + moduleId + " .main-class-container-mobile").clone(true));
  cloneMob.appendTo("body");
  //点击侧边关闭弹窗
  var leftLucency = cloneMob.find('.leftLucency');
  var ulBoxparent = document.querySelector(cloneIdMob + " .main-class-container-mobile .main-class-list-title");
  // 一级导航元素的父盒子
  var ulBox = document.querySelector(cloneIdMob +
    " .main-class-container-mobile .main-class-list-title>.list-title-all");
  // 获取一级导航元素
  var lis = ulBox.querySelectorAll(cloneIdMob + " .main-class-container-mobile .main-class-item");
  // 移动端最大的父盒子
  var mobileBox = document.querySelector(cloneIdMob + " .main-class-container-mobile");
  // 透明区域块
  var transparentBox = document.querySelector(cloneIdMob + " .main-class-container-mobile>.transparentBox");
  var showbox = document.querySelector('#module_' + moduleId + ' .main-class-all-classify');
  // 获取分类内容区域盒子
  var parentTtems = document.querySelector(cloneIdMob + " .main-class-container-mobile .main-class-list-content");
  // 获取分类内容区域子盒子
  var items = document.querySelectorAll(cloneIdMob +
    " .main-class-container-mobile .main-class-list-content .main-class-content-item");
  // 封装循环
  var each = function (arr, fn) {
    for (var i = 0; i < arr.length; i++) {
      fn.call(arr[i], i, arr[i]);
    }
  };
  // 给需要滚动的盒子的父盒子添加高度
  parentAddHeight();
  $(transparentBox).attr('id', 'pro-107-shade' + moduleId)
  $('body').append($(transparentBox));

  function parentAddHeight() {
    var bodyHeight;
    if (document.body.clientHeight) {
      bodyHeight = document.body.clientHeight
    } else {
      bodyHeight = document.documentElement.clientHeight;
    }
    var topParent = parentTtems.offsetTop;
    var showHeight = bodyHeight - topParent;
    each(items, function (i, val) {
      val.style.height = showHeight + 'px';
    });
    ulBoxparent.style.height = showHeight + 'px';
  }

  // 记录索引
  var index;
  // 侧边栏事件触发
  slideHoldHk.tap(ulBox, function (e) {
    e.stopPropagation();
    var lia = e.target;
    each(lis, function (i, val) {
      var liBox = this;
      liBox.classList.remove("active");
      if (lia == val) {
        index = i;
      }
    });
    each(items, function (i, val) {
      var itemBox = this;
      itemBox.classList.remove("current");
      if (lia == val) {
        index = i;
      }
      ;
    });
    lia.classList.add("active");
    items[index].classList.add("current");
    slideHoldHk.myslide(cloneIdMob +
      " .main-class-container-mobile .main-class-list-content .main-class-content-item.current",
      50);
  });
  // 点击阴影部分收缩
  slideHoldHk.tap(transparentBox, function () {
    $(mobileBox).fadeOut(300);
    mobileBox.style.transform = 'translateX(100%)';

  });
  // 弹框滑动
  slideHoldHk.boxSlideX(cloneIdMob + ' .main-class-container-mobile');
  // 关闭按钮
  document.querySelector(cloneIdMob + " .main-class-container-mobile .main-class-content-title .close").onclick =
    function () {
      $(mobileBox).fadeOut(300);
      $('#pro-107-shade' + moduleId).fadeOut();
      $('#pro-107-shade' + moduleId).fadeOut();
      leftLucency.hide();
      mobileBox.style.transform = 'translateX(100%)';
    };
  //点击侧边关闭弹窗
  leftLucency.off('click').on('click', function () {
    $(cloneIdMob + " .main-class-container-mobile .main-class-content-title .close").click();
  })
  // 按钮显示
  showbox.onclick = function () {
    mobileBox.style.display = 'block';
    $('#pro-107-shade' + moduleId).fadeIn();
    // 侧边栏
    slideHoldHk.myslide(cloneIdMob + " .main-class-container-mobile .main-class-list-title", 50);
    // 内容展示
    slideHoldHk.myslide(cloneIdMob + " .main-class-container-mobile .main-class-list-content .main-class-content-item.current", 50);
    //如果有微导航时
    cloneMob.show();
    mobileBox.style.transform = 'translateX(0%)';
    mobileBox.children[0].style.left = "20%";
    leftLucency.show();
    setTimeout(function () {
      resetHeightThreeimg(moduleId, '107');
    }, 400);
  };

  //窗口改变大小时
  window.addEventListener('resize', function (e) {
    if (e.target === window) {
      $(cloneIdMob + " .main-class-container-mobile .main-class-content-title .close").click()
    }
  });
};

// 切换显示导航内容
function navShowSubAndStyle(moduleId) {
  var moduleIdSelector = "#module_" + moduleId;
  var cloneId = "#clone_module_" + moduleId;
  var subShow = $(cloneId + ' .main-class-container .sub-class-content-main-show .sub-class-content');
  var mainNav = $(moduleIdSelector + ' .main-class-container .mainsub-class-box');
  subShow.find('.third-class-content').each(function (index, el) {
    if ($(el).children().length <= 0) {
      $(el).remove();
    }
  });
  mainNav.off('mouseenter mouseleave').on('mouseenter', function () {
    subShow.hide();
    if (subShow.eq($(this).index()).children().length > 0) {
      subShow.eq($(this).index()).css({
        'display': 'block',
        'position': 'absolute',
        'top': mainNav.offset().top,
        'left': mainNav.offset().left + mainNav.outerWidth(),
        'height': mainNav.parent().outerHeight(),
        'z-index': 2
      });
    }
    ;
    mainNav.removeClass('active');
    if ($(this).find('.sub-class-content').children().length <= 0) {
      return;
    }
    $(this).addClass('active').siblings().removeClass('active');
    subShow.eq($(this).index()).addClass('active').siblings().removeClass('active');
    subShow.eq($(this).index()).parent().show();
  }).on('mouseleave', function (evt) {
    evt = evt || window.event;
    var relatedTarget = evt.relatedTarget || evt.toElement;
    if ($(relatedTarget).is('.main-class-content,.sub-class-content') || $(relatedTarget).closest('.main-class-content,.sub-class-content').length > 0) {
      return false;
    }
    $(subShow).mouseleave();
  });

  subShow.off('mouseleave').on('mouseleave', function () {
    mainNav.removeClass('active');
    subShow.eq($(this).index()).parent().hide();
  });

}

//当选择有三级分类时 重置三级分类的图片的高度（1：1）
function resetHeightThreeimg(moduleId, layout) {
  var cloneBox = '#clone_mob_module_' + moduleId;
  var threeimg = $(cloneBox).find('.third-class-item-hasimg img');
  threeimg.stop().animate({ 'height': threeimg.width() })
}

// 匹配当前选中的分类
function matchCurrentClass(href) {
  if (typeof href == 'undefined') return false;
  var re_nav = new RegExp('^.*' + location.host, 'i');
  var menuHref = href.replace(/\?.*$/, '').replace(/\/*$/, '');
  var homeUrl = location.protocol + "//" + location.hostname.replace(/\/*$/, '');
  var homeUrlArr = [];
  homeUrlArr.push(homeUrl);
  homeUrlArr.push(homeUrl + "/index");
  homeUrlArr.push(homeUrl + "/home/index");
  homeUrlArr.push(homeUrl + "/" + getCookie('Lang'));
  homeUrlArr.push(homeUrl + "/index.php");
  homeUrlArr.push(homeUrl + "/home/index.php");
  homeUrlArr.push(homeUrl + "/" + getCookie('Lang') + "/index.php");
  var isMatch = false;
  if ($.inArray(menuHref, homeUrlArr) > -1) {
    if ($.inArray(location.href.replace(/\?.*$/, '').replace(/\/*$/, ''), homeUrlArr) > -1) {
      isMatch = true;
    }
  } else if (location.href.indexOf(href) > -1 && location.href.replace(/(\?|#).*$/, '') == href.replace(/(\?|#).*$/, '') && location.pathname.indexOf('-') == href.replace(re_nav, '').indexOf('-')) {
    isMatch = true;
  }
  return isMatch;
}

if (!window.slideHoldHk) {
  /**
   * Created by HuangKe on 2017/05/06.
   */
  slideHoldHk = {};
  /**
   *  纵轴滑动效果
   * @param dom 父元素盒类名  该元素下只有一个子元素
   * @param  num 弹框范围
   */
  slideHoldHk.myslide = function (dom, scope) {
    scope = Math.abs(scope);
    var parentBox = document.querySelector(dom);
    var mainContent = parentBox.children[0];
    if (!mainContent) {
      return;
    }
    var parentHeight = parentBox.offsetHeight;
    var mainContentHeight = 0;
    // 距离顶部的距离
    var parentTop;
    //可视区域高度
    var bodyHeight;
    if (document.body.clientHeight) {
      bodyHeight = document.body.clientHeight
    } else {
      bodyHeight = document.documentElement.clientHeight;
    }
    // 显示区域与内容高度的差值
    var chaHeight = 0;
    //设置全局变量
    var startY = 0;
    var moveY = 0;
    var chaA = 0;
    //当前的值
    var current = 0;
    // 记录最小值
    var minHeight = 0;
    // 最大值
    var maxHeight = 0;
    //过渡设置
    var openTransition = function () {
      mainContent.style.transition = "https://www.gurki99.com/skinp/modules/ModuleCommonClsGiant/all .2s"
      mainContent.style.webkitTransition = "https://www.gurki99.com/skinp/modules/ModuleCommonClsGiant/all .2s"
    }
    var closeTransition = function () {
      mainContent.style.transition = "none"
      mainContent.style.webkitTransition = "none"
    }
    //设置偏移
    var setTransform = function (num) {
      mainContent.style.transform = "translateY(" + (num) + "px)";
    }
    //触摸事件
    //开始
    mainContent.addEventListener("touchstart", function (e) {
      parentTop = parentBox.offsetTop;
      startY = e.touches[0].clientY;
      mainContentHeight = mainContent.offsetHeight + 60;
      /*子容器没有父容器大的时候*/
      if (mainContentHeight < parentHeight) {
        mainContent.style.height = parentHeight + 'px';
        mainContentHeight = parentHeight;
      }
      chaHeight = bodyHeight - mainContentHeight;
      minHeight = chaHeight < 0 ? chaHeight - parentTop : 0;
    });
    //移动
    mainContent.addEventListener("touchmove", function (e) {
      e.stopPropagation();
      e.preventDefault();
      moveY = e.touches[0].clientY;
      chaA = moveY - startY;
      // 当前的值加上移动的值大于最大高度加弹性值时返回
      // 当前的值加上移动的值小于最小值减去弹性值时返回
      if (current + chaA > maxHeight + scope || current + chaA < minHeight - scope) {
        return;
      }
      closeTransition();
      setTransform(current + chaA);
    });
    //结束
    mainContent.addEventListener("touchend", function (e) {
      // 如果移动的值加上移动过的值小于最小值返回最小值
      if (current + chaA < minHeight) {
        current = minHeight;
        openTransition();
        setTransform(minHeight);
      } else if (current + chaA > maxHeight) {
        current = maxHeight;
        openTransition();
        setTransform(maxHeight);
      } else {
        current += chaA;
      }
    });
  };
  // 动画结束后触发的事件
  slideHoldHk.transitionA = function (dom, fn) {
    if (dom != null && typeof dom == "object") {
      dom.addEventListener("transitionEnd", function () {
        fn && fn()
      });
      dom.addEventListener("webkitTransitionEnd", function () {
        fn && fn()
      });
    }
  };
  /**
   *  移动端优化的点击事件
   * @param dom 触发事件的元素
   * @param fn  回调函数
   */
  slideHoldHk.tap = function (dom, fn) {
    var type = isMobileBroswer();
    if (isMobileBroswer()) {
      var isFlag = false;
      var st = 0;
      dom.addEventListener("touchstart", function (e) {
        st = Date.now();
      });
      dom.addEventListener("touchmove", function (e) {
        isFlag = true;
      });
      dom.addEventListener("touchend", function (e) {
        if (isFlag == false && (Date.now() - st) < 150) {
          fn && fn(e);
        }
        isFlag = false;
      });
    } else {
      dom.addEventListener("click", function (e) {
        fn && fn(e);
      });
    }
  };
  /**
   * [boxSlideX description]
   * @param  {[type]} dom [description] 父元素盒子   确保这个父元素的第一个子元素是需要滑动的盒子
   * @return {[type]}     [description]
   */
  slideHoldHk.boxSlideX = function (dom) {
    var parentBox = document.querySelector(dom);
    // 获取子元素
    var itemBox = parentBox.children[0];
    // 记录值
    var startX = 0;
    var moveX = 0;
    var chaA = 0;
    var leftNum = 0;
    //过渡设置
    var openTransition = function () {
      itemBox.style.transition = "https://www.gurki99.com/skinp/modules/ModuleCommonClsGiant/all .2s"
      itemBox.style.webkitTransition = "https://www.gurki99.com/skinp/modules/ModuleCommonClsGiant/all .2s"
    }
    var closeTransition = function () {
      itemBox.style.transition = "none"
      itemBox.style.webkitTransition = "none"
    }
    //设置偏移
    var setTransform = function (num) {
      itemBox.style.left = num;
    }
    //开始
    itemBox.addEventListener("touchstart", function (e) {
      startX = e.touches[0].clientX;
      leftNum = itemBox.offsetLeft;
    });
    //移动
    itemBox.addEventListener("touchmove", function (e) {
      e.preventDefault();
      moveX = e.touches[0].clientX;
      chaA = moveX - startX;
      if (Math.abs(chaA) >= 50) {
        return;
      }
      closeTransition();
      setTransform((leftNum + chaA) + "px");
    });
    //结束
    itemBox.addEventListener("touchend", function (e) {
      if (chaA < -50) {
        openTransition();
        setTransform(leftNum + "px");
      } else if (chaA > 30) {
        openTransition();
        setTransform('100%');
        $(parentBox).fadeOut(300);
        parentBox.style.transform = 'translateX(100%)';
        $('#pro-107-shade' + $(parentBox).closest('.ModuleCommonClsGiant').attr('id').replace('clone_mob_module_', '')).fadeOut(300);
        $('#pro-106-shade' + $(parentBox).closest('.ModuleCommonClsGiant').attr('id').replace('clone_mob_module_', '')).fadeOut(300);

      } else {
        openTransition();
        setTransform(leftNum + "px");
      }
    });
  }
}
;