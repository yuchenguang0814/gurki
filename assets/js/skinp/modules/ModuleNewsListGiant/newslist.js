// 是否显示滚动
if (typeof window.newsswiper == 'undefined') window.newsswiper = {};

function initNewsList(moduleId, layout, options) {
  var func = [];

  // 轮播节点
  var $domList = [];
  var slideDescHeight;
  var elefirst = '';

  var mySwiper;
  $('#module_' + moduleId + ' .swiper-container .swiper-slide').each(function (index, el) {
    $domList.push($(el).prop("outerHTML"));
  });

  var windowWidth = window.innerWidth

  function initNewsListSwiper(module, options) {
    module = $(module);
    module.data('LgItemCount', options.LgItemCount);
    module.data('xsItemCount', options.xsItemCount);
    module.data('MdItemCount', options.MdItemCount);
    module.data('SmItemCount', options.SmItemCount);
    module.data('NewsListlength', options.NewsListlength);


    if (module.length == 0) return;
    var moduleid = module.attr('id').replace('module_', '');
    var slidePerGroup = calNewsListSwiperGroup(module, options);
    var slidesPerViewRiding = slidePerGroup;
    var AutoPlayTime = ((options.Time == 0 || options.Time == undefined) ? 10000 : (options.Time * 1000))
    var Inlayout = ($.inArray(parseInt(layout), [101, 103, 118, 119,122]) > -1 ? true : false)
    if (options.SwitchBy > 0 && Inlayout) {
      if (options.Direction == 'right') module.find('.swiper-container').attr('dir', "rtl");
    }
    // 是否自动轮播
    var isAutoPlay = (options.SwitchBy > 0 && Inlayout && window.CanDesign === 'False')
    if ($.inArray(parseInt(layout), [116, 104]) > -1) {
      isAutoPlay = options.SwitchBy > 0 && window.CanDesign === 'False'
    }

    var freeMode = false
    var loop = false
    if (Inlayout && options.SwitchType == 1 && options.SwitchBy > 0) {
      module.find('.swiper-container').addClass('swiper-container-free-mode1')
      freeMode = true
      loop = true
      isAutoPlay = (window.CanDesign === 'False' ? (AutoPlayTime = 1) : false)
      slidesPerViewRiding = 1
    }

    /**
     开始
     修复有slidesPerGroup时的轮播位置失常
     **/
    // 节点长度
    if(layout!=122){
      var domLen = $domList.length;
      // 记录上一次前后补的index
      var addElmPrevIndexObj = { start: 0, end: 0 },
        addElmNextIndexObj = { start: 0, end: 0 };

      var maxLengthStatus = (domLen > slidePerGroup) && (domLen % slidePerGroup) ? true : false;
      if ($.inArray(parseInt(layout), [118, 119]) > -1) {
        maxLengthStatus = false;
      }
      //当无缝滚动的时候
      if (slidesPerViewRiding == 1) maxLengthStatus = false;

      // 截取节点数组
      function elmSlice(indexObj, domList) {
        if (indexObj.start < indexObj.end) {
          return domList.slice(indexObj.start, indexObj.end);
        } else {
          var sliceHead = domList.slice(indexObj.start),
            sliceTail = domList.slice(0, indexObj.end);
          return sliceHead.concat(sliceTail);
        }
      }

      // 计算出上次的index区间
      function returnLastIndexObj(indexObj, groupNum, domLen) {
        // 如果现在的index和groupNum 的差是负数  说明新的index应该是domLen减去这个差
        var addElmIndexStart = indexObj.start - groupNum;
        indexObj.start = addElmIndexStart >= 0 ? addElmIndexStart : addElmIndexStart + domLen;
        var addElmIndexEnd = indexObj.end - groupNum;
        indexObj.end = addElmIndexEnd >= 0 ? addElmIndexEnd : addElmIndexEnd + domLen;
        return indexObj;
      }
    }
    /**
     修复有slidesPerGroup时的轮播位置失常
     结束
     **/
    if ($.inArray(parseInt(layout), [118, 119]) > -1) {
      var pagination = 'null';
      var slidesPerView = slidePerGroup;
      var spaceBetween = 0;
      //var freeMode = false;
      var centeredSlides = false;
      if ($.inArray(parseInt(layout), [119]) > -1) {
        spaceBetween = slidePerGroup > 1 ? 20 : window.innerWidth > 375 ? 30 : 15;
        slidesPerView = slidePerGroup > 2 ? slidePerGroup : 'auto';
        centeredSlides = slidePerGroup < 2
      }
      if ($.inArray(parseInt(layout), [118]) > -1) {
        if (options.SwitchType == 1 && options.SwitchBy > 0) {
          slidesPerViewRiding = 1
        } else {
          pagination = '#module_' + moduleid + ' .swiper-pagination';
        }
        spaceBetween = slidePerGroup > 2 ? '3%' : 32;
        slidesPerView = slidePerGroup <= 2 ? 1.2 : 'auto';
        freeMode = true;
      }

      var swiperOptions = {
        nextButton: '#module_' + moduleid + ' .swiper-button-next',
        prevButton: '#module_' + moduleid + ' .swiper-button-prev',
        autoplay: isAutoPlay ? AutoPlayTime : false,
        speed: (options.SwitchBy > 0 ? ((options.Speed == 0 || options.Speed == undefined) ? 1000 : (options.Speed * 1000)) : 1000),
        pagination: pagination,
        slidesPerGroup: slidesPerViewRiding,
        slidesPerView: slidesPerView,
        paginationClickable: true,
        spaceBetween: spaceBetween,
        autoplayDisableOnInteraction: !isAutoPlay,
        freeMode: freeMode,
        loop: loop,
        centeredSlides: centeredSlides,
        preventClicks: false, // 当swiper在触摸时阻止默认事件（preventDefault），用于防止触摸时触发链接跳转
        onInit: function (swiper) {
          if ($.inArray(parseInt(layout), [119]) > -1) {
            if (window.innerWidth > 767) {
              if (options.NewsListlength > 3) {
                $(".ModuleNewsListGiant.layout-" + layout + ".module_" + moduleid + " .swiper-button-prev").show();
                $(".ModuleNewsListGiant.layout-" + layout + ".module_" + moduleid + " .swiper-button-next").show();
              } else {
                $(".ModuleNewsListGiant.layout-" + layout + ".module_" + moduleid + " .swiper-button-prev").hide();
                $(".ModuleNewsListGiant.layout-" + layout + ".module_" + moduleid + " .swiper-button-next").hide();
              }
            } else {
              $(".ModuleNewsListGiant.layout-" + layout + ".module_" + moduleid + " .swiper-button-prev").hide();
              $(".ModuleNewsListGiant.layout-" + layout + ".module_" + moduleid + " .swiper-button-next").hide();
            }
          }
        }
      }
    }
    else if (layout == '116') {
      //var windowWidth = window.innerWidth
      var mode = $('#module_' + moduleId + ' .swiper-container');
      var leng = $('#module_' + moduleId + ' .swiper-container .swiper-wrapper .swiper-slide').length
      if ($('#module_' + moduleId + ' .swiper-container .swiper-wrapper .swiper-slide').length <= 3) {
        $('#module_' + moduleId + ' .swiper-container .swiper-button-prev').css('display', 'none')
        $('#module_' + moduleId + ' .swiper-container .swiper-button-next').css('display', 'none')
      }
      if (window.innerWidth < 768) {
        $('#module_' + moduleId + ' .swiper-container .swiper-wrapper .swiper-slide').removeClass('swiper-slide')
        $('#module_' + moduleId + ' .swiper-container .swiper-wrapper').removeClass('swiper-wrapper')
      } else {
        swiper(mode)
      }
      window.onresize = function () {
        if (window.innerWidth == windowWidth) {
          return
        }
        windowWidth = window.innerWidth
        if (window.innerWidth < 768) {
          $('#module_' + moduleId + ' .swiper-container .swiper-wrapper').removeAttr("style");
          $('#module_' + moduleId + ' .swiper-container .swiper-wrapper .swiper-slide').removeClass('swiper-slide')
          $('#module_' + moduleId + ' .swiper-container .swiper-wrapper').removeClass('swiper-slide-prev')
          $('#module_' + moduleId + ' .swiper-container .swiper-wrapper').removeClass('swiper-slide-active')
          $('#module_' + moduleId + ' .swiper-container .swiper-wrapper').removeClass('swiper-slide-next')
          $('#module_' + moduleId + ' .swiper-container .swiper-wrapper').removeClass('swiper-wrapper')
          $('#module_' + moduleId + ' .swiper-container .news-item').css("width", "100%");
          swiper(mode, 1)
        } else {
          var wrapper = $('#module_' + moduleId + ' .swiper-container > div').eq(0)
          var slides = $('#module_' + moduleId + ' .swiper-container .news-item')
          for (var i = 0; i < slides.length; i++) {
            if (slides[i] == 'swiper-slide') {
              return
            } else {
              $('#module_' + moduleId + ' .swiper-container .news-item').eq(i).addClass('swiper-slide')
            }
          }
          if (!wrapper.hasClass('swiper-wrapper')) {
            wrapper.addClass('swiper-wrapper')
          }
          swiper(mode)
        }
      }
      function swiper(mode, num) {
        if (mySwiper) {
          if (num) return;
        }
        mySwiper = new Swiper(mode, {
          prevButton: $('#module_' + moduleId + ' .swiper-container .swiper-button-prev'),
          nextButton: $('#module_' + moduleId + ' .swiper-container .swiper-button-next'),
          slidesPerView: (leng < 3 ? leng : 3),
          spaceBetween: 30,
          autoplay: options.SwitchBy == '1' ? 10000 : false
        })
      }
    }
    else if(layout == '122'){
      //var windowWidth = window.innerWidth
      var swiperOptions = {
        nextButton: '#module_' + moduleid + ' .next',
        prevButton: '#module_' + moduleid + ' .prev',
        autoplay: isAutoPlay ? AutoPlayTime : false,
        speed: (options.SwitchBy > 0 ? ((options.Speed == 0 || options.Speed == undefined) ? 1000 : (options.Speed * 1000)) : 1000),
        //pagination: pagination,
        slidesPerGroup: 1,
        slidesPerView: 2,
        loopAdditionalSlides: 1,
        // observer: true,
        // observerParents: true,
        //initialSlide : 1,
        //spaceBetween: window.innerWidth < 767 ? 20 : 'auto',
        paginationClickable: true,
        autoplayDisableOnInteraction: !isAutoPlay,
        loop: true,
        preventClicks: false, // 当swiper在触摸时阻止默认事件（preventDefault），用于防止触摸时触发链接跳转
        onInit: function (swiper) {
          // if(parseInt(($domList.length - 1)  % 2) != 0 && window.innerWidth > 768 ){
          //   console.log($domList,parseInt(($domList.length - 1)  % 2) )
           //swiper.appendSlide($domList[1]);
           //swiper.updateSlidesSize();
         // }
        }
      }
    }
    else {
      var swiperOptions = {
        autoplay: isAutoPlay ? AutoPlayTime : false,
        speed: (options.SwitchBy > 0 ? ((options.Speed == 0 || options.Speed == undefined) ? 1000 : (options.Speed * 1000)) : 1000),
        slidesPerView: slidePerGroup,
        slidesPerGroup: slidesPerViewRiding,
        freeMode: freeMode,
        loop: loop,
        loopAdditionalSlides: 0,
        spaceBetween: slidePerGroup > 1 ? 18 : 0,
        autoplayDisableOnInteraction: !isAutoPlay,
        nextButton: '#module_' + moduleid + ' .swiper-butto-prev',
        prevButton: '#module_' + moduleid + ' .swiper-butto-next',
        preventClicks: false, // 当swiper在触摸时阻止默认事件（preventDefault），用于防止触摸时触发链接跳转
        onInit: function (swiper) {
          if (options.NewsListlength > slidePerGroup) {
            $('#module_' + moduleid + '.swiper-butto-prev').show()
            $('#module_' + moduleid + '.swiper-butto-next').show()
          } else {
            $('#module_' + moduleid).find('.swiper-butto-prev').hide()
            $('#module_' + moduleid).find('.swiper-butto-next').hide()
          }
          if (maxLengthStatus && !options.reload) { // 重新初始化不需要补数目，这样节点不会越补越多
            // 初始化的时候先把前后都补够slidePerGroup的数量
            // 前面的第一次直接拿最后的slidePerGroup个去补就行了
            // 记录一下本次补的区间
            addElmPrevIndexObj.start = domLen - slidePerGroup;
            addElmPrevIndexObj.end = domLen;
            slideDescHeight = swiper.slides.length && $(swiper.slides[0]).find('.news-desc').attr('style') ? $(swiper.slides[0]).find('.news-desc').attr('style') : '';
            var prevAddElm = elmSlice(addElmPrevIndexObj, $domList);
            prevAddElm.reverse()
            for (var i = 0; i < prevAddElm.length; i++) {
              var slideObj = $(prevAddElm[i])
              slideObj.find('.news-desc').attr('style', slideDescHeight)
              prevAddElm[i] = slideObj[0]
            }
            // 必须要翻转一下数组顺序， 因为swipe添加到前面的时候 是按数组的倒序
            if ($.inArray(parseInt(layout), [103]) < 0) swiper.prependSlide(prevAddElm);

            // 补后面的需要用取余计算
            var remainder = domLen % slidePerGroup;
            addElmNextIndexObj.start = domLen - remainder;
            addElmNextIndexObj.end = slidePerGroup - remainder;// 不够的用前面的补
            var nextAddElm = elmSlice({ start: 0, end: addElmNextIndexObj.end }, $domList); // 初始化的时候只用拿前面的几个就行了
            // 添加到后面的不用翻转
            for (var i = 0; i < nextAddElm.length; i++) {
              var slideObj = $(nextAddElm[i])
              slideObj.find('.news-desc').attr('style', slideDescHeight)
              nextAddElm[i] = slideObj[0]
            }
            swiper.appendSlide(nextAddElm);
            if (isAutoPlay) swiper.startAutoplay();
          }
        }
      }
    }

    /**
     开始
     修复有slidesPerGroup时的轮播位置失常
     **/
    if (layout != '116' && layout !='122') {
      if (maxLengthStatus) {
        if (!options.reload) {// 重新初始化时不需要赋值方法，这样这点不会越补越多
          swiperOptions['onSlideNextEnd'] = function (swiper) {
            // 计算出来下一组的index
            // start应该等于上一次的end
            addElmNextIndexObj.start = addElmNextIndexObj.end;
            addElmNextIndexObj.end = (addElmNextIndexObj.end + slidePerGroup) % domLen;

            // 为了节点数量没那么多 先删掉开始的一组
            var delStart = 0;
            var delSlideIndexArr = Array.apply(null, { length: slidePerGroup }).map(function () {
              return delStart++;
            });
            swiper.removeSlide(delSlideIndexArr);

            // 更新addElmPrevIndexObj数据
            addElmPrevIndexObj.start = (addElmPrevIndexObj.start + slidePerGroup) % domLen;
            addElmPrevIndexObj.end = (addElmPrevIndexObj.end + slidePerGroup) % domLen;

            // 添加新的到后面
            var nextAddElm = elmSlice(addElmNextIndexObj, $domList);
            for (var i = 0; i < nextAddElm.length; i++) {
              var slideObj = $(nextAddElm[i])
              slideObj.find('.news-desc').attr('style', slideDescHeight)
              nextAddElm[i] = slideObj[0]
            }
            swiper.appendSlide(nextAddElm);
            if (isAutoPlay) swiper.startAutoplay();
            if ($.inArray(parseInt(layout), [101]) > -1) {
              addScript('../../../scripts/MultiEllipsis.js'/*tpa=https://www.gurki99.com/scripts/MultiEllipsis.js*/, function () {
                //标签页 或者 加载更多
                for (var i = 0; i < options['MultiEllipsis'].length; i++) {
                  new MultiEllipsis(options['MultiEllipsis'][i]);
                }
              });
            }
          }
          swiperOptions['onSlidePrevEnd'] = function (swiper) {
            // 计算出应该在slide开始 添加的dom index
            addElmPrevIndexObj = returnLastIndexObj(addElmPrevIndexObj, slidePerGroup, domLen);

            // 删掉最后的一组
            var delStart = swiper.slides.length - 1;
            var delSlideIndexArr = Array.apply(null, { length: slidePerGroup }).map(function () {
              return delStart--;
            });
            swiper.removeSlide(delSlideIndexArr);

            // 更新一下addElmNextIndexObj的数据
            addElmNextIndexObj = returnLastIndexObj(addElmNextIndexObj, slidePerGroup, domLen);

            // 添加到最前面
            var prevAddElm = elmSlice(addElmPrevIndexObj, $domList);
            prevAddElm.reverse()
            for (var i = 0; i < prevAddElm.length; i++) {
              var slideObj = $(prevAddElm[i])
              slideObj.find('.news-desc').attr('style', slideDescHeight)
              prevAddElm[i] = slideObj[0]
            }
            swiper.prependSlide(prevAddElm);
            if (isAutoPlay) swiper.startAutoplay();
            if ($.inArray(parseInt(layout), [101]) > -1) {
              addScript('../../../scripts/MultiEllipsis.js'/*tpa=https://www.gurki99.com/scripts/MultiEllipsis.js*/, function () {
                //标签页 或者 加载更多
                for (var i = 0; i < options['MultiEllipsis'].length; i++) {
                  new MultiEllipsis(options['MultiEllipsis'][i]);
                }
              });
            }
          }
        }
      } else {
        if (Inlayout && options.SwitchType == 0 && options.SwitchBy > 0) {
          swiperOptions['loop'] = (domLen > slidePerGroup)
        }
      }
    }
    /**
     修复有slidesPerGroup时的轮播位置失常
     结束
     **/
    if (layout != '116') {
      mySwiper = window.newsswiper[module.attr('id')] = new Swiper('#module_' + moduleid + ' .swiper-container', swiperOptions);
      if(layout !='122'){
        setTimeout(function () {
          var DEFAULT_VERSION = 9;
          var ua = navigator.userAgent.toLowerCase();
          var isIE = ua.indexOf("msie") > -1;
          var safariVersion;
          if (isIE) {
            safariVersion = ua.match(/msie ([\d.]+)/)[1];
            var sa = parseInt(safariVersion);
            if (safariVersion <= DEFAULT_VERSION) {
              $(mySwiper.container).find('.swiper-wrapper,.swiper-slide').css('height', '')
              $(mySwiper.container).height($(mySwiper.container).find('.swiper-slide').height())
              var moduleIdSelector = '#module_' + moduleId
              $(moduleIdSelector + '  .swiper-butto-prev').on('click', function (e) {
                e.preventDefault()
                mySwiper.swipePrev()
              })
              $(moduleIdSelector + ' .swiper-butto-next ').on('click', function (e) {
                e.preventDefault()
                mySwiper.swipeNext()
              });

            }
          }
        }, 1000);
      }
    }
    if(layout !='122'){
      mySwiper.LgItemCount = options.LgItemCount;
      mySwiper.MdItemCount = options.MdItemCount;
      mySwiper.SmItemCount = options.SmItemCount;
      mySwiper.xsItemCount = options.xsItemCount;
    }
    window["initSwiperFunc" + moduleid] = function () {
      if (windowWidth != window.innerWidth) {
        options.reload = true;  // 是否重新初始化
        window.newsswiper[module.attr('id')] = null
        mySwiper && mySwiper.destory && mySwiper.destory(true, true);
        setTimeout(function () {
          initNewsListSwiper(module, options)
        }, 500)
     }else if(window.newsswiper[module.attr('id')])
     {
        mySwiper = window.newsswiper[module.attr('id')]
        mySwiper.init()
        mySwiper.stopAutoplay();
        mySwiper.startAutoplay();
     }
    };
    // 让用户自由选择是否自动轮播
    if (mySwiper && !isAutoPlay) {
      mySwiper.stopAutoplay();
    }

    $('#module_' + moduleId + ' .news-container, #module_' + moduleid + ' .swiper-button-white').hover(function () {
      mySwiper.stopAutoplay();
    }, function () {
      if (!window.CanDesign || window.CanDesign == 'False') {
        mySwiper.startAutoplay();
      }
    });

    if(layout==122) {
      //if(elefirst == '') elefirst =  $('#module_' + moduleId + ' .swiper-container .slideone')[0].outerHTML;
      if( window.innerWidth > 768)
      {
         $('#module_' + moduleId + ' .swiper-container .slideone').remove()
      }
      var height = $(mySwiper.slides[0]).find('.news-desc').attr('style') ? $(mySwiper.slides[0]).find('.news-desc').attr('style') : ''
      if( window.innerWidth < 767)
      {
        if(!$(mySwiper.slides[0]).hasClass('slideone')){
          mySwiper.prependSlide($domList[0]);
        }
      }else{
        //mySwiper.removeSlide(0);
      }
      $('.slideone').find('.news-desc').attr('style',height)
      //mySwiper.updateSlidesSize();
      mySwiper.update();
    }
    func.push(window["initSwiperFunc" + moduleId])
  }

  $('.ModuleMobileNavGiant.layout-101 .swiper-container,.ModuleMobileNavGiant.layout-103 .swiper-container,.ModuleMobileNavGiant.layout-118 .swiper-container').height($(".news-item").height());

  function calNewsListSwiperGroup(module) {
    module = $(module);
    var LgItemCount = module.data('LgItemCount');
    var xsItemCount = module.data('xsItemCount');
    var MdItemCount = module.data('MdItemCount');
    var SmItemCount = module.data('SmItemCount');
    var layout = 0;
    var slidePerGroup = 3;
    var layoutDiv = module.find("[layout]");
    if (layoutDiv.length > 0) layout = layoutDiv.attr('layout');
    if ($.inArray(parseInt(layout), [101, 103, 118, 119]) > -1) {
      window["initFunc" + "{{ModuleID}}"] = function () {
        slidePerGroup = Number(LgItemCount);
        if (window.innerWidth < 768) slidePerGroup = Number(xsItemCount);
      }
      slidePerGroup = Number(LgItemCount);
      if (window.innerWidth < 768) slidePerGroup = Number(xsItemCount);
    } else if ($.inArray(parseInt(layout), [104,122]) > -1) {
      slidePerGroup = 1;
    }
    return slidePerGroup;
  }

  function calSwiperchage122(mySwiper122){

      var height = $(mySwiper122.slides[0]).find('.news-desc').attr('style') ? $(mySwiper122.slides[0]).find('.news-desc').attr('style') : ''
      if( window.innerWidth < 767)
      {
        mySwiper122.prependSlide($domList[0]);
      }else{
        mySwiper122.removeSlide(0);
      }
    $('.slideone').find('.news-desc').attr('style',height)
    mySwiper122.params.slidesPerGroup = 1
    mySwiper122.params.slidesPerView = 2
    mySwiper122.update();
    mySwiper122.updateSlidesSize();
  }

  var windowWidth = window.innerWidth
  $(window).off('resize.newslist').on('resize.newslist', function () {
    if (windowWidth != window.innerWidth) {
      windowWidth = window.innerWidth
      for (var key in window.newsswiper) {
        var mySwiper1 = window.newsswiper[key];
        if (mySwiper1) {
          if(layout == 122 ){
            calSwiperchage122(mySwiper1)
          }else{
            var slidePerGroup = calNewsListSwiperGroup("#" + key);
            mySwiper1.params.slidesPerGroup = slidePerGroup;
            mySwiper1.params.slidesPerView = slidePerGroup;
            mySwiper1.params.loopedSlides = slidePerGroup;
            mySwiper1.update();
          }

          if ($.inArray(parseInt(layout), [119]) > -1) {
            if (window.innerWidth > 767) {
              if ($("#" + key).data('NewsListlength') > 3) {
                $(mySwiper1.nextButton).show();
                $(mySwiper1.prevButton).show();
              } else {
                $(mySwiper1.nextButton).hide();
                $(mySwiper1.prevButton).hide();
              }
            } else {
              $(mySwiper1.nextButton).hide();
              $(mySwiper1.prevButton).hide();
            }
          } else {
            if ($("#" + key).data('NewsListlength') < slidePerGroup) {
              $(mySwiper1.nextButton).hide();
              $(mySwiper1.prevButton).hide();
            } else {
              $(mySwiper1.nextButton).show();
              $(mySwiper1.prevButton).show();
            }
          }
        }
      }
    }
  });

  options = options || {};

  //统一处理只显示N行的
  if (options['MultiEllipsis']) {
    func.push(function () {
      addScript('../../../scripts/MultiEllipsis.js'/*tpa=https://www.gurki99.com/scripts/MultiEllipsis.js*/, function () {
        //标签页 或者 加载更多
        for (var i = 0; i < options['MultiEllipsis'].length; i++) {
          new MultiEllipsis(options['MultiEllipsis'][i]);
        }
      });
    });
  }
  //多列显示的风格处理统一行高
  if (options['LiHeight']) {
    func.push(function () {
      addScript('../../../scripts/LiHeight.js'/*tpa=https://www.gurki99.com/scripts/LiHeight.js*/, function () {
        for (var i = 0; i < options['LiHeight'].length; i++) {
          new LiHeight(options['LiHeight'][i])
        }
      });
    });
  }

  //当图片加载出错，隐藏图片（适用于外框宽高定比例）
  if ($.inArray(parseInt(layout), [113]) > -1) {
    func.push(function () {
      $("#module_" + moduleId + " .news-img img").each(function (index, item) {
        $(this).error(function () {
          $(this).hide();
          $(this).parent().find(".news-detail-btn").remove();
        });
      });
    });
  }

  // 执行方法
  if (func.length > 0) {
    window["initFunc" + moduleId] = function () {
      for (var i in func) {
        func[i]();
      }
    }
    window["initFunc" + moduleId]();
    $(window).off('resize.module' + moduleId).on('resize.module' + moduleId, function () {
      if (windowWidth != window.innerWidth) {
        windowWidth = window.innerWidth
        window["initFunc" + moduleId]();
      }
    });
  }

  if (
      $.inArray(parseInt(layout), [101, 104, 116, 118, 119,122]) > -1
      || (Number(options.DisplayMode) === 2 && $.inArray(parseInt(layout), [103]) > -1)
  ) {
    initNewsListSwiper("#module_" + moduleId, options);
  }

}
