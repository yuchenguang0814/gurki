function initCommonSiteGalleryV2Giant(moduleId, layout, option,isclick, forlay) {
  //swiper组件有缺陷，当放在display=none的容器中时，初始化会有问题，导致无法正常工作，在我们系统中，在此模块可能会放在
  //标签模块中，当某标签默认不显示时，swiper就会无法工作，所以都要加上 window["initSwiperFunc" + moduleId] 这个函数，以
  //便在全局中可以遍历 window 对象，对 swiper 进行重新初始化；目前，在 jscript.js 中的 initModuleTabContainer() 方法中对标签模块所以处理，其它的暂时未处理，后面看情况酌情处理
  //请copy以下句子进入--window["initSwiperFunc" + moduleId] = function(){initCommonSiteGalleryGiant(moduleId, layout, option,isclick)};
  // 将swiper放进window['initCommonSiteGallerySwiper'+moduleId]全局变量中

    window["initFunc" + moduleId] = function(){
      initCommonSiteGalleryV2Giant(moduleId, layout, option,isclick,false)
      
    };
    
  /**
   *兼容拓展版开始
   */
  // 兼容拓展版（拓展版只显示电脑端，由于拓展版没有viewpoint属性，导致获取到的window.innerWidth不会变化，而media查询是会变化的，手机端会显示出来，这里需要强制隐藏手机端，显示电脑端）
  if ($('#module_'+moduleId+' div[data-pluns="Photo_box"]').length) {
    $(window).off('resize.initTuozhan'+moduleId).on('resize.initTuozhan'+moduleId, function() {
      resizeTupzhan()
    })
    resizeTupzhan()
  }
  function resizeTupzhan() {
    if (window.innerWidth >= 768) {
      $('#module_'+moduleId+' div[data-pluns="Photo_box"]').css('display', 'none')
      $('#module_'+moduleId+' .gallery-list').css('display', 'block')
    } else {
      $('#module_'+moduleId+' div[data-pluns="Photo_box"]').css('display', '')
      $('#module_'+moduleId+' .gallery-list').css('display', '')
    }
  }
  /**
   *兼容拓展版结束
   */

  var moduleIdSelector = "#module_" + moduleId;
  if($.inArray(layout,['101', '102', '104','105','109','110', '113']) > -1){
    var IsExpandDir = option.IsExpandDir;
    loadStyleSheet('../../../scripts/wookmark/css/lightgallery.min.css'/*tpa=https://www.gurki99.com/scripts/wookmark/css/lightgallery.min.css*/);
    addScript('../../../scripts/wookmark/lightgallery.js'/*tpa=https://www.gurki99.com/scripts/wookmark/lightgallery.js*/,function(){
      addScript('../../../scripts/wookmark/lg-fullscreen.min.js'/*tpa=https://www.gurki99.com/scripts/wookmark/lg-fullscreen.min.js*/);
      addScript('../../../scripts/wookmark/lg-thumbnail.min.js'/*tpa=https://www.gurki99.com/scripts/wookmark/lg-thumbnail.min.js*/);
      addScript('../../../scripts/wookmark/lg-zoom.min.js'/*tpa=https://www.gurki99.com/scripts/wookmark/lg-zoom.min.js*/);
      if(layout == '104'){
        // 增加gallery-imagesLoaded辨别是瀑布流专用的类名
        $(moduleIdSelector + ' .gallery-imagesLoaded').imagesLoaded(function(){
          $(moduleIdSelector + ' .gallery-imagesLoaded').masonry({
            itemSelector: '.grid-item',
            fitWidth:true
          });
        });
      }
      // 判断是否空节点，不初始化插件
      if($(moduleIdSelector + ' .gallery-list').css('display') !== 'none'){
        // 瀑布流插件
        // 等于1是有相册展开的
        if(IsExpandDir == 0){
          // 有相册展开的
          // 有轮播
          if($(moduleIdSelector + ' div[isCarousel="1"].gallery-top').attr('isCarousel') === '1'){
            if($.inArray(layout,['113']) > -1){
              getimagelist(moduleIdSelector);
              showBroadcastTwo(option,moduleIdSelector,moduleId,isclick,IsExpandDir)
            }else{
              showBroadcast(option,moduleIdSelector,layout,isclick,IsExpandDir)
            }
          }else if($(moduleIdSelector + ' div[isCarousel="1"].gallery-container').attr('isCarousel') === '1') {
            getimagelist(moduleIdSelector);
            showBroadcastTwo110(option,moduleIdSelector,moduleId,isclick,IsExpandDir)
          }else{
            getimagelist(moduleIdSelector);
            window["initFunc" + moduleId] = function(option){
              resetHeight(moduleIdSelector,layout);
              option = option || '';
              var newitems = option.newitems || '';
              if(typeof($(moduleIdSelector + ' .gallery-list').data('lightGallery')) != 'undefined' && typeof($(moduleIdSelector + ' .gallery-list').data('lightGallery')) != 'null'){
                $(moduleIdSelector + ' .gallery-list').data('lightGallery').destroy(true);
              }
              if(isclick == 0){
               
                $(moduleIdSelector + ' .gallery-list').lightGallery({
                  showThumbByDefault:false,
                  thumbnail: true,
                  download:(option.isdownload == 1 ? true : false),
                  fullScreen:false
                });
              }
              getimagelist(moduleIdSelector);
            }
            var winWidth = $(window).width();
            $(window).off('resize.module' + moduleId).on('resize.module' + moduleId, function () {
              if ($(window).width() != winWidth) {
                winWidth = $(window).width()
                window["initFunc" + moduleId](option)
              }
            })
          }
        }else{
          // 没有相册展开的
          // 有轮播没有预加载的
          if($(moduleIdSelector + ' div[isCarousel="1"].gallery-top').attr('isCarousel') === '1'){
            if($.inArray(layout,['113']) > -1){
              showBroadcastTwo(option,moduleIdSelector,moduleId,isclick,IsExpandDir)
            }else{
              showBroadcast(option,moduleIdSelector,layout,isclick,IsExpandDir)
            }
          }else if($(moduleIdSelector + ' div[isCarousel="1"].gallery-container').attr('isCarousel') === '1') {
            showBroadcastTwo110(option,moduleIdSelector,moduleId,isclick,IsExpandDir)
          } else {
            if(isclick == 0){
              $(moduleIdSelector + ' .gallery-list').lightGallery({
                showThumbByDefault:false,
                thumbnail: true,
                download:(option.isdownload == 1 ? true : false),
                fullScreen:false
              });
            }
            window["initFunc" + moduleId] = function(option){
              resetHeight(moduleIdSelector,layout);
              option = option || '';
              var newitems = option.newitems || '';
              if(typeof($(moduleIdSelector + ' .gallery-list').data('lightGallery')) != 'undefined' && typeof $(moduleIdSelector + ' .gallery-list').data('lightGallery')){
                $(moduleIdSelector + ' .gallery-list').data('lightGallery').destroy(true);
              }
              if(isclick == 0){
                $(moduleIdSelector + ' .gallery-list').lightGallery({
                  showThumbByDefault:false,
                  thumbnail: true,
                  download:(option.isdownload == 1 ? true : false),     
                  fullScreen:false
                });
              }
              if(layout == '104'){
                $(moduleIdSelector + ' .gallery-imagesLoaded').imagesLoaded(function () {
                  if(newitems){
                    $(moduleIdSelector + ' .gallery-imagesLoaded').masonry('appended', newitems);
                  }
                  $(moduleIdSelector + ' .gallery-imagesLoaded').masonry('layout');
                });
              }
            }
            var winWidth = $(window).width();
            $(window).off('resize.module' + moduleId).on('resize.module' + moduleId, function () {
              if (winWidth != $(window).width()) {
                winWidth = $(window).width()
                window["initFunc" + moduleId](option)
              }
            })
          }
        }
        resetHeight(moduleIdSelector,layout);
      }else{
        // 当尺寸变化时，重新执行方法
        var winWidth = $(window).width();
        $(window).off('resize.module' + moduleId).on('resize.module' + moduleId, function () {
          if (winWidth != $(window).width()) {
            winWidth = $(window).width()
            if (window["initFunc" + moduleId]) window["initFunc" + moduleId](option)
          }
        })
      }
    });
  }
  if (layout == '112') {
    var layoutCopy = layout
    if($(moduleIdSelector + ' .Photo_box').css('display') !== 'none'){
      Phonlayout112(moduleId, option);
      setTimeout(function () {
        addScript('../../../scripts/MultiEllipsis.js'/*tpa=https://www.gurki99.com/scripts/MultiEllipsis.js*/, function () {
          new MultiEllipsis({"targetCls": '#module_' + moduleId + ' .layout-' + layoutCopy + ' .desc', "limitLineNumber": 3, "isCharLimit": false});
        });
      }, 100)
    }
    // 当尺寸变化时，重新执行方法
    var winWidth = $(window).width()
    $(window).off('resize.module' + moduleId).on('resize.module' + moduleId, function () {
      if (winWidth != $(window).width()) {
        winWidth = $(window).width()
        if($(moduleIdSelector + ' .Photo_box').css('display') !== 'none'){
          Phonlayout112(moduleId, option);
          addScript('../../../scripts/MultiEllipsis.js'/*tpa=https://www.gurki99.com/scripts/MultiEllipsis.js*/, function () {
            setTimeout(function () {
              new MultiEllipsis({"targetCls": '#module_' + moduleId + ' .layout-' + layoutCopy + ' .desc', "limitLineNumber": 3, "isCharLimit": false});
            }, 100)
          })
        }
      }
    });

  };
  if(layout == '113'){
    $("#module_" + moduleId+' .grid-item').hover(function(){
      $(this).addClass('active').siblings().removeClass('active');
    },function(){
      $(this).removeClass('active');
    })
  }
  var gallerySwiper = null;

  
  function showBroadcast(option,moduleIdSelector,layout,isclick,IsExpandDir) {
    // 有轮播没有预加载的
    var showViewLimit = parseInt(option.LgItemCount);
    var MdItemCount = option.MdItemCount;
    var loop = true;
    if (window.innerWidth < 768) showViewLimit = parseInt(MdItemCount);
    if(showViewLimit > $(moduleIdSelector + ' .gallery-list .swiper-slide').length){
      loop = false;
      $(moduleIdSelector + ' .swiper-button-next,' + moduleIdSelector + ' .swiper-button-prev').addClass('hidden')
    }
    if(option.slideTime == 0){
      loop = false;
    }
    if(window['initCommonSiteGallerySwiper'+moduleId] && window['initCommonSiteGallerySwiper'+moduleId].destroy) {
      window['initCommonSiteGallerySwiper'+moduleId].destroy(true,true)
    }
    gallerySwiper  = window['initCommonSiteGallerySwiper'+moduleId] = new Swiper(moduleIdSelector + ' div[isCarousel="1"].gallery-top', {
      autoplay: option.slideTime == 0 || window.CanDesign == 'True' ? false : (option.slideTime * 1000),
      speed:(option.slideSpeed * 1000) || 1000,
      nextButton: moduleIdSelector+' .swiper-button-next',
      prevButton: moduleIdSelector+' .swiper-button-prev',
      slidesPerView: showViewLimit,
      loopedSlides: showViewLimit * 2,
      loop: loop,
      preventClicks : isclick == 0 ? true : false,
      runCallbacksOnInit: false,
      updateOnImagesReady : true,
      onImagesReady: function(swiper){
        if(IsExpandDir == 0){
          getimagelist(moduleIdSelector);
        }else if(IsExpandDir == 1 && isclick == 0){
          $(moduleIdSelector + ' .gallery-wrapper').lightGallery({
            showThumbByDefault:false,
            download:(option.isdownload == 1 ? true : false),
            thumbnail: true,
            counter:false,
            fullScreen:false
          });
        }
      },
      onInit:function(swiper){
        if (gallerySwiper) {
          $(gallerySwiper.container).hover(function(){
            gallerySwiper.stopAutoplay();
          },function(){
            if (window.CanDesign == 'False') {
              gallerySwiper.startAutoplay();
            }
          })
        }
      }
    });
    var winWidth = $(window).width();
    $(window).off('resize.power' + "{{ModuleID}}").on('resize.power' + "{{ModuleID}}", function () {
      if (winWidth != $(window).width()) {
        winWidth = $(window).width()
        if(window['initCommonSiteGallerySwiper'+moduleId] && $(moduleIdSelector + ' .gallery-list').css('display') !== 'none'){
          window['initCommonSiteGallerySwiper'+moduleId].update()
          window['initCommonSiteGallerySwiper'+moduleId].onResize()
        }
      }
    });
  }
  function showBroadcastTwo(option,moduleIdSelector,moduleId,isclick,IsExpandDir) {
    // 有轮播没有预加载的
    if (isclick == 0) {
      $(moduleIdSelector + ' .gallery-list').lightGallery({
        showThumbByDefault:false,
        download:(option.isdownload == 1 ? true : false),
        thumbnail: true,
        fullScreen:false
      });
    }

    loadStyleSheet('imageAnimationEffect.css'/*tpa=https://www.gurki99.com/skinp/modules/ModuleSiteGalleryV2Giant/imageAnimationEffect.css*/)
    addScript('imageAnimationEffect.js'/*tpa=https://www.gurki99.com/skinp/modules/ModuleSiteGalleryV2Giant/imageAnimationEffect.js*/, function () {
      // 将需要轮播的节点保存起来
      var imageAnimation = new imageAnimationEffect($(moduleIdSelector + ' .gallery-list .grid-item'), {
        num: option.LgItemCount,
        row: 2,
        speed: option.slideSpeed,
        time: option.slideTime
      })
      // 窗口大小变化触发函数
      var winWidth = $(window).width()
      $(window).off('resize.'+moduleId).on('resize.'+moduleId,function(e, data){
        winWidth = $(window).width()
        if ($(window).width() < 768) {
          return
        }
        if (winWidth == $(window).width() && !(data && data.resize)) {
          return
        }
        winWidth = $(window).width()
        imageAnimation.update({
          num: option.LgItemCount,
          row: 2
        })
      })
      $(window).trigger('resize.'+moduleId, {resize: true})
    })
  }
  function showBroadcastTwo110(option,moduleIdSelector,moduleId,isclick,IsExpandDir) {
    // 有轮播没有预加载的
    if (isclick == 0) {
      $(moduleIdSelector + ' .gallery-list').lightGallery({
        showThumbByDefault:false,
        download:(option.isdownload == 1 ? true : false),
        thumbnail: true,
        fullScreen:false
      });
    }
    loadStyleSheet('imageAnimationEffect.css'/*tpa=https://www.gurki99.com/skinp/modules/ModuleSiteGalleryV2Giant/imageAnimationEffect.css*/)
    addScript('imageAnimationEffect.js'/*tpa=https://www.gurki99.com/skinp/modules/ModuleSiteGalleryV2Giant/imageAnimationEffect.js*/, function () {
      // 将需要轮播的节点保存起来
      var imageAnimation = new imageAnimationEffect($(moduleIdSelector + ' .gallery-list>*'), {
        type: option.type || 'carousel', // 可以选择淡出效果或者布条撕开效果
        num: option.LgItemCount,
        row: 2,
        speed: option.slideSpeed,
        time: option.slideTime
      })
      // 窗口大小变化触发函数
      var winWidth = $(window).width()
      $(window).off('resize.'+moduleId).on('resize.'+moduleId,function(data){
        winWidth = $(window).width()
        if ($(window).width() < 768) {
          return
        }
        if (winWidth == $(window).width()  && !(data && data.resize)) {
          return
        }
        imageAnimation.update({
          num: option.LgItemCount,
          row: 2
        })
      })
      $(window).trigger('resize.'+moduleId, {resize: true})
    })
  }
  function Phonlayout112 (moduleID, options) {
    // 显示个数
    var showViewLimit = parseInt(options.LgItemCount);
    var xsItemCount = options.xsItemCount;
    if (window.innerWidth < 768) showViewLimit = parseInt(xsItemCount);

    // 当前模块主容器区域
    var moduleIdSelector = '#module_' + moduleID;
    // 是否显示隐藏
    var showOrHide = 'none';
    // 单个 item 项的边距
    var spaceBetween = 25;
    // pc 跟横向平板都是 4 个   平板跟回pc
    if ($(window).width() > 767) {
      // 如果个数大于 4, 才允许出现上下翻页
      if ($(moduleIdSelector + ' .Photo_box .swiper-slide').length > 4) {
        showOrHide = 'block';
      }
    } else if ($(window).width() <= 767) {
      showOrHide = 'none';
      spaceBetween = 12;
    }
    // 对上下页进行隐藏/显示
    $(moduleIdSelector + ' .Photo_box .iconfont').css('display', showOrHide);
    // 初始化之前先销毁
    if(window['initCommonSiteGallerySwiper'+moduleId] && window['initCommonSiteGallerySwiper'+moduleId].destroy){
      window['initCommonSiteGallerySwiper'+moduleId].destroy(true,true)
    }
    // 实例化 swiper
    window['initCommonSiteGallerySwiper'+moduleId] = new Swiper(moduleIdSelector + ' .Photo_box .gallery-top', {
      autoplay: option.isCarousel == 0|| option.slideTime == 0 || window.CanDesign == 'True' ? false : (option.slideTime * 1000),
      speed:(option.slideSpeed * 1000) || 1000,
      spaceBetween : spaceBetween,
      effect: 'slide',
      slidesPerView: showViewLimit,
      prevButton: moduleIdSelector + ' .swiper-prev',
      nextButton:moduleIdSelector + ' .swiper-next',
      loop : true,
      loopAdditionalSlides : 2,
      loopedSlides:showViewLimit,
      autoplayDisableOnInteraction: false,
      preventClicks : isclick == 0 ? true : false
    });
  }
  // 获取一次数据之后直接放进data
  function getimagelist(moduleIdSelector){
    $(moduleIdSelector + " .grid-cont").off('click').click(function () {
      var gallerySelector = $(this);
      var galleryid = $(this).attr('galleryid') || '';
      if(gallerySelector.data('dynamicEl') != '' && gallerySelector.data('dynamicEl') != undefined){
        gallerySelector.lightGallery({
          download:(option.isdownload == 1 ? true : false),
          dynamic: true,
          thumbnail: true,
          fullScreen:false,
          dynamicEl:JSON.parse(gallerySelector.data('dynamicEl')) || []
        });
      }else {
        $.ajax({
          url: "/index.php?c=front/Gallery&a=GetImageList&id=" + galleryid,
          async: false,
          dataType: "json",
          success: function (json) {
            if (json.success) {
              gallerySelector.data('dynamicEl',JSON.stringify(json.list))
              gallerySelector.lightGallery({
                download:(option.isdownload == 1 ? true : false),
                dynamic: true,
                thumbnail: true,
                fullScreen:false,
                dynamicEl:json.list || []
              });
              return false;

            } else {
              alert("出错了：" + json.msg);
            }
            3
          }
        });
      }
      return false;
    });
  }
  function resetHeight(moduleIdSelector,layout){
    var mobile_picBox = $(moduleIdSelector + ' .mobile_picBox');
    if(mobile_picBox && $.inArray(layout,['101', '102']) < 0) mobile_picBox.height(mobile_picBox.eq(0).width()+2);
    if(layout=='107' || layout=='110') mobile_picBox.height(mobile_picBox.eq(0).width()*(9/16));
  }
}