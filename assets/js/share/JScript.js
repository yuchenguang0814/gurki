var illegalHash = false;
if (location.hash && (location.hash.indexOf("<") > -1 || location.hash.indexOf("%3C") > -1)) {
  location.hash = "";
  alert('不允许的location.hash');
  location.href = location.pathname + location.search;
  illegalHash = true;
}
$(function () {
  if (getCookie("SiteType") == "1") {
    $(window).resize(function (e) {
      if (e.target === window) {
        showhideNav();
        computeFreeModulePosition();
        computeJiuGondHeight();
      }
    });
    showhideNav();
    $(window).load(function () {
      computeFreeModulePosition();
    });
  }

  //加载公共分享的组件
  if($('.sharebox').length > 0){
    addScript('social-share/social-share.js'/*tpa=https://www.gurki99.com/share/social-share/social-share.js*/)
    addScript('../scripts/jQPlugins/qrcode/qrcode.js'/*tpa=https://www.gurki99.com/scripts/jQPlugins/qrcode/qrcode.js*/)
    addScript('../scripts/jQPlugins/qrcode/jquery.qrcode.js'/*tpa=https://www.gurki99.com/scripts/jQPlugins/qrcode/jquery.qrcode.js*/)
    addScript('../skinp/common/mobile/js/html2canvas.js'/*tpa=https://www.gurki99.com/skinp/common/mobile/js/html2canvas.js*/)
    $('.mshare').each(function(){
      CreateMShareBox(this)
    })
    $('.sharebox').each(function(){
      CreateShareBox(this,'horizontal')
    })
  }

  $(window).load(function () {
    initHoverAnimate();
  });

  doSomeWhanPreview();
  keepFullScreenModules100Width();
  //广告
  if ($("#ChargeTips").height()) {
    $("body > .ModuleItem").each(function (i, item) {
      $(item).css("top", parseInt($(item).css("top")) + $("#ChargeTips").height());
    });
  }
  setMobileNav();
  matchNavAndFootNavBgColor();
  setModuleCls();
  NewsList();

  TopNewLoad();
  BindPagerAction(); //接管模块的分页链接，用ajax请求
  SetImageWidth();
  setZonePadding();

  var $container = $('.masonry-container');
  if ($container.length > 0) {
    $container.imagesLoaded(function () {
      $container.masonry({
        columnWidth: '.productItem',
        itemSelector: '.productItem'
      });
    });
  }

  replaceNewShopUrl();  // 强行改变建站的URL
  clearCancelorRedoData();
  timeRemindfunc();

});

function initScroll() {
  window['curAnchorClick'] = false; // 判断是否为点击事件，以阻塞滚动、滚轮事件
  // 获取当前页面url
  // 对 url 进行相应处理
  var urlParam = window.location.href.toString().split("//");
  window['currUrlPath'] = urlParam[1].substring(urlParam[1].indexOf("/"));
  //  过滤可能存在的 ? 后携带参数
  if (window['currUrlPath'].indexOf('?') !== -1) {
    window['currUrlPath'] = window['currUrlPath'].split('?')[0];
  }
  //  过滤可能存在的 # 后携带参数
  if (window['currUrlPath'].indexOf('#') !== -1) {
    window['currUrlPath'] = window['currUrlPath'].split('#')[0];
  }
  if (window['currUrlPath'] == 'https://www.gurki99.com/index.php') {
    window['currUrlPath'] = '/';
  }
  window['anchorVieArrOld'] = [];
  window['anchorVieArr'] = [];
  // 初始化时对当前可视区域锚点高亮
  onAnchorActive();
  onAnchorClick();
  onAnchorDblClick();
  onLoadScroll();
  onMousewheel();
}

var anchorInterval = null, // 锚点滚动定时器
  viewH = $(window).height();  //可见高度

// 获取锚点ModuleID
function getAnchorMID(href) {
  if (href == '') return false;
  href = href.toString();
  var tempArr = href.match(/module_(\d+)/i);
  return tempArr != null ? tempArr : false;
}
// 锚点或导航高亮
function onAnchorActive(id, delta) {
  try {
    var scroH = $(document).scrollTop();  //滚动高度
    window['anchorVieArrOld'] = window['anchorVieArr'] ? window['anchorVieArr'] : [];
    window['anchorVieArr'] = [];
    // 获取当前可视区域锚点集合
    $('.ModuleAnchorGiant').each(function () {
      var itemOffTop = parseInt($(this).parent('.ModuleItem').offset().top);
      if (itemOffTop >= scroH && itemOffTop <= (scroH + viewH)) {
        window['anchorVieArr'].push($(this).parent('.ModuleItem').attr('id').replace('module_', ''));
      }
    });
    if (!id) {
      var index = 0;
      if (window['anchorVieArr'].length > 0) {
        index = $.inArray(window['anchorVieID'], window['anchorVieArr']);
        if (delta != '') {
          index = delta > 0 ? index + 1 : index - 1;
        } else {
          index = window['oldScroH'] < scroH ? index + 1 : index - 1;
        }
      }
      index = index < 0 ? 0 : (index >= window['anchorVieArr'].length ? (window['anchorVieArr'].length - 1) : index);
      id = window['anchorVieID'] = window['anchorVieArr'][index];
    }
    id = id ? id.replace('module_', '') : id;
    // 锚导航高亮
    $('.ModuleAnchorTextGiant a').each(function () {
      if ($(this).attr('dataid') == id) {
        $(this).closest('ul').find('.active').removeClass('active');
        $(this).addClass('active');
        $(this).parent('li').addClass('active');
      }
    });
    // PC导航高亮
    $('.ModuleNavGiant a').each(function () {
      var hrefID = getAnchorMID($(this).attr('href'));
      if (hrefID) {
        if (hrefID[1] == id) {
          $(this).closest('.main-nav-content').find('.main-nav-item').removeAttr('iscurrent');
          $(this).closest('.main-nav-content').find('.on').removeClass('on');
          $(this).closest('.main-nav-content').find('.main-nav-item-hover').removeClass('main-nav-item-hover');
          $(this).closest('.main-nav-content').find('.navMainItemHover').removeClass('navMainItemHover');
          $(this).closest('.main-nav-item-group').find('.main-nav-item').addClass('main-nav-item-hover');
          $(this).closest('.main-nav-item-group').find('.main-nav-item').addClass('navMainItemHover');
          $(this).closest('.main-nav-item-group').find('.main-nav-item').attr('iscurrent', 1);
          $(this).closest('.main-nav-item-group').parent().addClass('on');
        }
      }
    });
    // Mobile导航高亮
    $('.ModuleMobileNavGiant a').each(function () {
      var hrefID = getAnchorMID($(this).attr('href'));
      if (hrefID && window['curAnchorClick']) { //不是点击不用高亮，避免在PC滚动时收起面板
        if (hrefID[1] == id) {
          if ($('.containers.view-change').length > 0) {
            $(this).closest('#accordion').find('.active').removeClass('active');
            $(this).parent().addClass('active');
            $('.lcbody').click();
            $('.containers').removeClass('view-change');
          }
        }
      }
    });
  } catch (e) { }
}

// 处理锚点点击事件
function handleAnchorClick(curHref, target, evt) {
  var tempArr = curHref.split('#');
  //  过滤可能存在的 ? 后携带参数
  if (tempArr[0].indexOf('?') > -1) tempArr[0] = tempArr[0].split('?')[0];
  if (window['currUrlPath'].indexOf(getCookie('Lang')) > -1 && tempArr[0] == '/' && tempArr[0].indexOf(getCookie('Lang')) < 0)
    tempArr[0] = window['currUrlPath'];
  var AnchorMID = getAnchorMID(curHref);
  // 当前页面且是锚点不触发浏览器添加链接的冒泡
  if (AnchorMID && (window.location.href.toString().indexOf(tempArr[0]) > -1 || tempArr[0] == window['currUrlPath'])) {
    if ($("#" + AnchorMID[0]).length > 0) {
      if (evt && evt.preventDefault) evt.preventDefault();
      else window.event.returnValue = false;

      window['curAnchorClick'] = true;
      onAnchorActive(AnchorMID[0]);
      // 移动端无法触发滚动条只能直接跳转
      if (window.innerWidth < 768) {
        window.location.href = "#" + AnchorMID[0];
        window['curAnchorClick'] = false;
      } else {
        var firsttop =  $("#" + AnchorMID[0]).offset().top
        $('html,body').animate({ scrollTop: $("#" + AnchorMID[0]).offset().top }, 1000, 'linear', function () {
          window['curAnchorClick'] = false;
        });
        //解决延时加载导致的高度问题
        var aa = setInterval(function(){
          if(firsttop != $("#" + AnchorMID[0]).offset().top) {
            $('html,body').animate({ scrollTop: $("#" + AnchorMID[0]).offset().top }, 1000, 'linear', function () {
              window['curAnchorClick'] = false;
              clearInterval(aa);
            });
          }
          else{
            clearInterval(aa);
          }
        },1000)
      }
    } else {
      if (target == '_blank') window.open(curHref);
      else window.location.href = curHref;
    }
  } else {
    if (target == '_blank') window.open(curHref);
    else window.location.href = curHref;
  }
  return false;
}

// 监听滚轮事件，目前只为给锚点高亮
function onMousewheel() {
  $(window).bind('mousewheel', function (event) {
    var delta = -event.originalEvent.wheelDelta || event.originalEvent.detail;  //firefox使用detail:下3上-3,其他浏览器使用whe
    if (anchorInterval) clearTimeout(anchorInterval);
    anchorInterval = setTimeout(onAnchorActive(0, delta), 200);
  });
}

// 监听滚动事件，目前只为给锚点高亮
function onLoadScroll() {
  $(window).scroll(function () {
    if (window['curAnchorClick']) return;  // 当前触发滚动是因为点击事件则return
    window['oldScroH'] = $(document).scrollTop();
    if (anchorInterval) clearTimeout(anchorInterval);
    anchorInterval = setTimeout(onAnchorActive, 150);
  });
}

// 锚点、导航单击事件
function onAnchorClick() {
  $(document).off('click.anchor_click').on('click.anchor_click', '.ModuleAnchorTextGiant a,.ModuleNavGiant a,.ModuleMobileNavGiant li a', function (evt) {
    var curHref = $(this).attr('datahref') ? $(this).attr('datahref') : $(this).attr('href');
    handleAnchorClick(curHref, $(this).attr('target'), evt);
    return false;
  })
}

// 锚点双击事件
function onAnchorDblClick() {
  $('body').off('dblclick.anchor_dblclick').on("dblclick.anchor_dblclick", '.ModuleAnchorTextGiant a,.ModuleNavGiant a,.ModuleMobileNavGiant a', function (evt) {
    var curHref = $(this).attr('datahref') ? $(this).attr('datahref') : $(this).attr('href');
    handleAnchorClick(curHref, $(this).attr('target'), evt);
    return false;
  })
}

// 显示弹窗事件
function showPupop(ModuleID) {
  if (Number(ModuleID) > 0) {
    var module = $('#module_' + ModuleID);
    if (module.length > 0) module.show();
    var subModuleIDs = module.find('.ModuleItem')
    $(subModuleIDs).each(function(index,element) {
        var moduleid =$(element).attr('id').replace('module_','')
        var moduletype =$(element).attr('moduletype')
        if(moduletype == 'ModuleSlideV2Giant' && $(element).find('.layout-107').length==0) return;
        var initFunc = window['initFunc' + moduleid];
        var initSwiperFuncSiteGalleryByMobile = window['initSwiperFunc' + moduleid +'SiteGalleryByMobile'];
        var news121Multiple =  window['news121Multiple' + moduleid];
        var initSwiperFunc = window["initSwiperFunc" + moduleid]
        if (typeof initSwiperFunc == 'function') {
          initSwiperFunc()
        }
        if (typeof initFunc == 'function') {
            initFunc()
        }
        if (typeof initSwiperFuncSiteGalleryByMobile == 'function') {
            initSwiperFuncSiteGalleryByMobile();
        }
        if (typeof news121Multiple == 'function') {
            news121Multiple()
        }
    });

  }
  return;
}

function clearCancelorRedoData() {
  if (typeof (CanDesign) == 'undefined' || CanDesign != "True") return false;
  $.ajax(
    {
      url: "https://www.gurki99.com/index.php?c=Front/CancelOrRedo&a=clearData",
      dataType: "json",
      success: function (json) {
        var status = !window.cancelOrRedoObj
        addScript('../scripts/CancelOrRedo.js'/*tpa=https://www.gurki99.com/scripts/CancelOrRedo.js*/, function () {
          if (status) {
            window.cancelOrRedoObj = new cancelorredo();
          }
          window.cancelOrRedoObj.cancellist = [];
          window.cancelOrRedoObj.redolist = [];
          window.cancelOrRedoObj.tempdata = [];
        });
      }
    });
}

function isMobileBroswer() {
  var sUserAgent = navigator.userAgent.toLowerCase();
  var bIsIpad = sUserAgent.match(/ipad/i) == "ipad";
  var bIsIphoneOs = sUserAgent.match(/iphone os/i) == "iphone os";
  var bIsMidp = sUserAgent.match(/midp/i) == "midp";
  var bIsUc7 = sUserAgent.match(/rv:1.2.3.4/i) == "rv:1.2.3.4";
  var bIsUc = sUserAgent.match(/ucweb/i) == "ucweb";
  var bIsAndroid = sUserAgent.match(/android/i) == "android";
  var bIsCE = sUserAgent.match(/windows ce/i) == "windows ce";
  var bIsWM = sUserAgent.match(/windows mobile/i) == "windows mobile";
  var bIsWeixin = sUserAgent.match(/micromessenger/i) == "micromessenger";
  if (bIsIpad || bIsIphoneOs || bIsMidp || bIsUc7 || bIsUc || bIsAndroid || bIsCE || bIsWM || bIsWeixin) {
    return true;
  } else {
    return false;
  }
}

function setZonePadding() {
  if (SiteType == '1') return; // 响应式暂不需要设置内容区边距
  if ($("#BodyLeftZone").length > 0 && $("#BodyLeftZone").css("display") != "none") $("#BodyMain1Zone,#BodyMain2Zone,#BodyMain3Zone,#BodyMain4Zone").css({ "padding-left": "3px" });
  else $("#BodyMain1Zone,#BodyMain2Zone,#BodyMain3Zone,#BodyMain4Zone").css({ "padding-left": "0px" });
  if ($("#BodyRightZone").length > 0 && $("#BodyRightZone").css("display") != "none") $("#BodyMain1Zone,#BodyMain2Zone,#BodyMain3Zone,#BodyMain4Zone").css({ "padding-right": "3px" });
  else $("#BodyMain1Zone,#BodyMain2Zone,#BodyMain3Zone,#BodyMain4Zone").css({ "padding-right": "0px" });
  if (typeof CanDesign != 'undefined' && CanDesign == "True" && SiteType == "0") setTimeout(setZonePadding, 300);
}

function hasAbsoluteObj() {
  var flag = false;
  if (SiteType == "1") {
    $("#BodyHeaderZone,#BodyMain1Zone,#BodyFooterZone").find(".ModuleItem:visible").each(function (i, item) {
      if ($(item).css("position") == "absolute") {
        flag = true;
      }
    });
  }
  return flag;
}

function isJiFenPage() {
  if ($('#isJiFen').val() === '1') {
    return 1;
  } else {
    return 0;
  }
}

// 详情页面重新计算区域高度
function computeZoneHeight(zoneElem) {
  var oZone = $(zoneElem);
  if (!oZone.hasClass('ModuleHoverBoxContainer')) resizeZone(oZone);
  if (oZone.find(".ModuleProductDetail, .ModuleNewsDetail, .ModuleDownDetail").length > 0) {
    $(zoneElem).find('img').each(function () {
      this.onload = function () {
        resizeZone(oZone);
      }
    });
  }
  if (!oZone.hasClass('ModuleTabsContent') && !oZone.hasClass('ModuleHoverBoxContainer')) {
    setTimeout(function () {
      resizeZone(zoneElem)
    }, 500);
    setTimeout(function () {
      resizeZone(zoneElem)
    }, 1000);
    setTimeout(function () {
      resizeZone(zoneElem)
    }, 2000);
    setTimeout(function () {
      resizeZone(zoneElem)
    }, 4000);
  }
}

//h5 计算自由模块的横坐标
function zoneHasAbsoluteObj(zone) {
  var hasAbsolute = false;
  $(zone).find(".ModuleItem:visible").each(function (i, item) {
    if ($(item).css("position") == "absolute") {
      hasAbsolute = true;
    }
  });
  return hasAbsolute;
}

function computeFreeModulePosition(module) {
  if (SiteType != "1") return;
  window.nodelayimg = true; //H5站混合静态和自由模块时，不能使用图片延时加载，因为图片延时加载会改变页面的高度
  if (module) {
    var m = null;
    if (typeof module == 'object') m = $(module);
    else m = $('#' + module);
    var parent = m.closest("#HeaderZone,#FooterZone,#BodyMain1Zone");
    if ($(window).width() > 993) {
      if (m.attr('float') == 'free') {
        var helperid = 'freemodulehelper';
        var helper = $("#" + helperid);
        var left = helper.offset().left + parseInt(m.attr('floatx'));
        m.css({ 'visibility': 'visible', 'display': 'block', 'left': left + "px" });
      }
      m.parent().find('.ModuleGridContainer').each(function (i, grid) {
        $(grid).css('min-width', $(grid).css('max-width'));
      });
      //处理产品列表模块的响应横版PAD的功能
      m.parent().find('.productsBox').each(function (i, prolist) {
        for (var k = 1; k < 11; k++) {
          $(prolist).removeClass('col-md-' + k);
          $(prolist).removeClass('col-sm-' + k);
          $(prolist).removeClass('col-xs-' + k);
        }
        $(prolist).addClass('col-xs-' + $(prolist).attr('pc-col'));
      });
      computeZoneHeight(parent);
    } else {
      m.css({ 'visibility': 'hidden', 'display': 'none' });
      if (!zoneHasAbsoluteObj(parent)) parent.css("height", "auto");
      m.parent().find('.ModuleGridContainer').each(function (i, grid) {
        $(grid).css('min-width', '0');
      });
    }
  } else {
    var modules = $(".ModuleItem[float=free]");
    $.each(modules, function (i, item) {
      computeFreeModulePosition(item);
    });
  }
}

function resizeZone(oZone) {
  var iZoneHeight = 0;
  //var padscale = isPad();
  oZone.children('.ModuleItem:visible').each(function () {
    iZoneHeight = Math.max(iZoneHeight, $(this).outerHeight(false) + $(this).position().top);
  });
  oZone.css('height', iZoneHeight);
  if (getCookie("SiteType") == "1" && !zoneHasAbsoluteObj(oZone)) {
    $(oZone).css('height', 'auto');
  }
}

//让图片根据上级容器的尺寸自动适应大小
function resizeImage(imgo) {
  var img = new Image();
  img.src = $(imgo).prop('src');
  // 按比例缩放，原图小于外框不操作
  var bw = $(imgo).parent().width();
  var bh = $(imgo).parent().height();
  var ow = img.width;
  var oh = img.height;
  var nw, nh;

  if (ow > bw || oh > bh) {
    if (ow / oh >= bw / bh) {
      nw = bw;
      nh = nw * oh / ow;
    } else if (ow / oh < bw / bh) {
      nh = bh;
      nw = nh * ow / oh;
    }
  } else {
    nw = ow;
    nh = oh;
  }
  $(imgo).width(nw);
  $(imgo).height(nh);
  $(imgo).css({ 'margin-top': (bh - $(imgo).outerHeight(false)) / 2 + 'px' });
}

function SetImageWidth() {
  if (SiteType == "1") {
    $("img").each(function () {
      if ($(this).closest('.ModuleNewsDetail').length > 0 || $(this).closest('.ModuleJiuGong,.ModuleJiuGongV2').length > 0) return true;
    });
    $('.goods-detail-content table').each(function () {
      if ($(this).width() > $("#pagebody").width()) {
        $(this).css('width', '100%');
      }
    });
  }
  $("img").each(function () {
    if ($(this).closest('.ModuleNewsDetail').length > 0 || $(this).hasClass('vCodeImg')) return true;
    if ($(this).width() > $("#pagebody").width() && $("#pagebody").length > 0) {
      var oldh = $(this).height();
      var oldw = $(this).width();
      try {
        var offsetp = $(this).closest(".ModuleItem").offset().left;
        var offset = $(this).offset().left;
        var offsetx = offset - offsetp;
        if (offsetx < 0) offsetx = 0;
      } catch (e) {
      }
      var w = parseInt($("#pagebody").width() * 0.95) - offsetx;
      var h = parseInt(oldh / (oldw / w));
      if (SiteType == 0) $(this).css({ "width": w, "height": h });
    }
    if ($(this).closest('.PIMG').length == 0) {
      $(this).prop("src", $(this).attr("src"));
      $(this).on('load', function () {
        if ($(this).width > $("#pagebody").width()) {
          var oldh = $(this).height();
          var oldw = $(this).width();
          try {
            var offsetp = $(this).closest(".ModuleItem").offset().left;
            var offset = $(this).offset().left;
            var offsetx = offset - offsetp;
            if (offsetx < 0) offsetx = 0;
          } catch (e) {
          }
          var w = parseInt($("#pagebody").width() * 0.95) - offsetx;
          var h = parseInt(oldh / (oldw / w));
          $(this).css({ "width": w, "height": h });
        }
      });
    }
  });
}

function showhideNav() {
  if ($("#MobileFootNav").attr("enable") == 1 && $("#pagebody").width() >= 751) {
    $('#MobileFootNav,#MobileFootNavRenderElem').hide();
  } else if ($("#MobileFootNav").attr("enable") == 1 && $("#pagebody").width() < 751) {
    $('#MobileFootNav,#MobileFootNavRenderElem').show();
  } else if ($("#MobileFootNav").attr("enable") == 0) {
    $('#MobileFootNav,#MobileFootNavRenderElem').hide();
  }

  if ($("#MobileNav").attr("enable") == 1 && $("#pagebody").width() >= 1200 || $("#MobileNav").attr("enable") == 1 && ($("#pagebody").width() >= 975 && $("#pagebody").width() < 1200)) {
    $('#MobileNav,#MobileNavRenderElem,#MobileNavFloatLayer,#MobileNavMask').hide();
    $('#pagebody').css("left", "0rem");
    $("#MobileFootNav").removeClass("showFloatNav");
  } else if ($("#MobileNav").attr("enable") == 1 && ($("#pagebody").width() >= 751 && $("#pagebody").width() < 975) || $("#MobileNav").attr("enable") == 1 && $("#pagebody").width() < 740) {
    $('#MobileNav,#MobileNavRenderElem,#MobileNavFloatLayer,#MobileNavMask').show();

    if ($("#MobileNav").attr("navnum") == 4 || $("#MobileNav").attr("navnum") == 6 || $("#MobileNav").attr("navnum") == 7) {
      $('#MobileNavRenderElem').hide();
    } else {
      $('#MobileNavRenderElem').show();
    }
    if ($("#MobileNavFloatLayer").hasClass("showFloatNav") == false) {
      $('#pagebody').css("left", "0rem");
      $("#MobileFootNav").removeClass("showFloatNav");
    } else {
      if ($("#MobileNav").attr("navnum") == 5) {
        $('#pagebody').css("left", "6.25rem");
        $("#MobileFootNav").addClass("showFloatNav");
      } else if ($("#MobileNav").attr("navnum") == 1) {
        $('#pagebody').css("left", "10rem");
        $("#MobileFootNav").addClass("showFloatNav");
      }
    }
  } else if ($("#MobileNav").attr("enable") == 0 && $("#pagebody").width() > 1200 || $("#MobileNav").attr("enable") == 0 && ($("#pagebody").width() >= 975 && $("#pagebody").width() < 1200) || $("#MobileNav").attr("enable") == 0 && ($("#pagebody").width() >= 751 && $("#pagebody").width() < 975) || $("#MobileNav").attr("enable") == 0 && $("#pagebody").width() < 740) {
    $('#MobileNav,#MobileNavRenderElem,#MobileNavFloatLayer,#MobileNavMask').hide();
  }

  if ($('#MobileNav').attr('navnum') == 4) {
    if ($("#pagebody").width() < 740) {
      $('#MobileNavFloatLayer').css("left", "18.9%")
    } else if ($("#pagebody").width() > 500 && $("#pagebody").width() <= 751) {
      $('#MobileNavFloatLayer').css("left", "13%")
    } else if ($("#pagebody").width() > 751 && $("#pagebody").width() <= 975) {
      $('#MobileNavFloatLayer').css("left", "11.5%")
    } else {
      $('#MobileNavFloatLayer').css("left", "8%")
    }
  }

  if ($("#pagebody").width() > 768) {
    $(".FootNavMask,.FootNavQRCodeImg,.QQList").hide();
    $(".goods-btn").show();
  } else {
    $(".FootNavMask,.FootNavQRCodeImg,.QQList").show();
    $(".goods-btn").hide();
  }

  if ($("#MobileFootNav").length > 0) {
    if ($("#MobileFootNav").is(":hidden")) {
      $('#pagebody').css('padding-bottom', "0")
    } else {
      $('#pagebody').css('padding-bottom', $("#MobileFootNav").height());
    }
  }

  $(".FootNavQRCodeImg").css({
    "width": "192px",
    "height": "192px",
    "top": "initial",
    "bottom": $('#MobileFootNav').innerHeight(),
    "left": ($('body').outerWidth() / 2 - $(".FootNavQRCodeImg").outerWidth() / 2)
  });
}

function TopNewLoad() {
  $(".TopNews").each(function () {
    var repNum = Number($(this).attr("lang"));
    var iWidth = ($(this).width() / repNum) - (repNum * 10); //($(this).find("li").width() / repNum) - (repNum * 10);
    $(this).find("li>span").css({ "width": iWidth + "px", "margin-right": "8px" });
    $(this).find("li").each(function () {
      if ($(this).children("span").toArray().length > 1) {
        $(this).children("span").last().css({ "margin-right": "0px", "float": "right" });
      }
    });
  });
}

function NewsList() {
  $(".BodyCenterNews").each(function () {
    var repNum = parseInt($(this).attr("RepeatNum")) > 0 ? parseInt($(this).attr("RepeatNum")) : 1;
    var iWidth = ($(this).find("li").width() / repNum) - (repNum * 9);
    $(this).find("i").css({/*"width": iWidth + "px",*/"margin-right": "5px", "overflow": "hidden" });
    $(this).find("li").each(function () {
      if ($(this).children("i").length > 1) {
        $(this).children("i").last().css({ "margin-right": "0px", "float": "right" });
      }
    });

    if ($(this).attr("value") !== "") {
      var itemHeight = $(this).find(".vTicker").find("li").height();
      var iHeight = $(this).find(".vTicker>ul").height();
      var showItems = parseInt(iHeight / itemHeight);
      $(this).find(".vTicker").vTicker({
        speed: 500,
        pause: 3000,
        direction: $(this).attr("value"),
        mousePause: true,
        showItems: showItems
      }).css({ "height": iHeight + "px" }).find("li").css({ "padding": "0 5px" });
    }
  });
}

function ProductList() {
  $(".ModuleProductList").each(function () {
    if ($(this).find(".myslider").attr("value") !== "") {
      $(this).find(".myslider").easySlider({
        auto: true,
        continuous: true,
        vertical: false,
        controlsShow: false
      });
    }
  });
}

function SetProductListImage(module, sitetype) {
  if (typeof (module) != "object") module = $('#module_' + module);
  module.find('.PIMG>img').each(function () {
    var src = $(this).attr("src");
    $(this).attr("src", '');
    $(this).on('load', function () {
      resizeProductListImageSize(this);
    });
    $(this).attr("src", src);
  });
  initProductListEffect(module, sitetype);
}

function resizeProductListImageSize(img) {
  $(img).css({ 'width': 'auto', 'height': 'auto' }); //先清除图片的高宽
  var picWrapper = $(img).closest('.PicWrapper');
  var imgParent = $(img).parent();

  var imgp_pl = parseFloat(imgParent.css('padding-left') ? imgParent.css('padding-left') : 0);
  var imgp_pr = parseFloat(imgParent.css('padding-right') ? imgParent.css('padding-right') : 0);
  var imgp_pt = parseFloat(imgParent.css('padding-top') ? imgParent.css('padding-top') : 0);
  var imgp_pb = parseFloat(imgParent.css('padding-bottom') ? imgParent.css('padding-bottom') : 0);

  var imgp_bl = parseFloat(imgParent.css('border-left') ? imgParent.css('border-left') : 0);
  var imgp_br = parseFloat(imgParent.css('border-right') ? imgParent.css('border-right') : 0);
  var imgp_bt = parseFloat(imgParent.css('border-top') ? imgParent.css('border-top') : 0);
  var imgp_bb = parseFloat(imgParent.css('border-bottom') ? imgParent.css('border-bottom') : 0);

  var bw = picWrapper.innerWidth() - imgp_pl - imgp_pr - imgp_bl - imgp_br;
  var bh = picWrapper.innerHeight() - imgp_pt - imgp_pb - imgp_bt - imgp_bb;

  var ow = img.width;
  var oh = img.height;
  var nw, nh;

  if (ow > bw || oh > bh) {
    if (ow / oh >= bw / bh) {
      nw = bw;
      nh = nw * oh / ow;
    } else if (ow / oh < bw / bh) {
      nh = bh;
      nw = nh * ow / oh;
    }
  } else {
    nw = ow;
    nh = oh;
  }

  $(img).css({
    width: nw + 'px',
    height: nh + 'px'
  });
  $(img).css({ 'margin-top': (bh - $(img).outerHeight(false)) / 2 + 'px' });
  if ($(img).parent().css('text-align').toLowerCase() != 'center') {
    $(img).css({ 'margin-left': (bw - $(img).outerWidth(false)) / 2 + 'px' });
  }
}

function initProductListEffect(module, sitetype) {
  if (typeof (module) != "object") module = $('#module_' + module);
  var oProductList = $(module).find('.ProductList');
  var showstyle = oProductList.attr('showstyle');
  var direction = oProductList.attr('direction');
  var countPerGroup = oProductList.attr('repeatnum');
  if (CanDesign == "True" && showstyle > 0) {
    module.resize(function () {
      if (module.css("position") != 'absolute') oProductList.parent().css({
        'position': 'relative',
        overflow: 'hidden',
        'width': module.width() + "px"
      });
    });
  }
  if (sitetype == 1) {
    // 修复手机下，描述文字不确定导致".PDetail"高度不齐的的bug
    if (!module.attr("haschangedetail")) {
      iRepeatnum = parseFloat(oProductList.attr('repeatnum'));
      if (iRepeatnum == 0 || showstyle == 1 || showstyle == 2) {
        var iMaxHeight = 0;
        module.find('.PDetail').each(function () {
          iMaxHeight = Math.max(iMaxHeight, $(this).height());
        })
        module.find('.PDetail').css('height', iMaxHeight);
      } else {
        var iTotalLine = Math.ceil(module.find('.PDetail').length / iRepeatnum);
        var oPDetails = module.find('.PDetail');
        for (var i = 0; i < iTotalLine; i++) {
          var iMaxHeight = 0;
          oPDetails.each(function (j) {
            if (i * iRepeatnum <= j && j < (i + 1) * iRepeatnum) {
              iMaxHeight = Math.max(iMaxHeight, $(this).height());
            }
          })
          oPDetails.slice(i * iRepeatnum, (i + 1) * iRepeatnum).css('height', iMaxHeight);
        }
      }
      module.attr("haschangedetail", "1");
    }
  }
  if (window['effectInterval_' + module.attr('id')]) {
    clearInterval(window['effectInterval_' + module.attr('id')]);
  }
  if (module.length > 0) {
    if (showstyle == 1) { // 连续滚动
      var oProductBoxes = oProductList.children('.ProductBox').css({ float: 'left' });
      if (sitetype == 1) {
        oProductList.find('center').css('display', 'inline-block');
        // 手机实际width通常是带小数的，但jquery所有方法返回宽度都是向下取的整数，所以为了计算准确，+1px
        oProductBoxes.css({ width: 'auto' }).css({ width: oProductBoxes.width() + 1 });
      }
      var listWidth = module.width();
      oProductList.parent().css({ 'position': 'relative', overflow: 'hidden', 'width': module.width() + "px" });
      var iWidth = oProductBoxes.outerWidth(true) * oProductBoxes.length * 2;
      var iHeight = oProductBoxes.outerHeight(true);
      oProductList.css({
        position: 'relative',
        left: '0px',
        width: iWidth + 'px',
        height: iHeight + 'px',
        overflow: 'hidden'
      });
      if (module.width() > iWidth) return;
      if (module.attr('hasinit') != 1) {
        oProductList.append(oProductList.clone(true).children());
        module.attr('hasinit', 1);
      }
      ;
      var iRefreshInterval = 40;
      var iStep = 1;
      if (window['effectInterval_' + module.attr('id')]) {
        clearInterval(window['effectInterval_' + module.attr('id')])
      }
      window['effectInterval_' + module.attr('id')] = setInterval(function () {
        if (oProductList.attr('ishovering') == 1 && oProductList.attr('hoverstop') == 1) {
          return;
        }
        if (direction == 'left') {
          if (oProductList.position().left <= -oProductList.innerWidth() / 2) {
            oProductList.css('left', (oProductList.position().left + oProductList.innerWidth() / 2) + 'px');
          }
          oProductList.css('left', (oProductList.position().left - parseInt(oProductList.parent().css('padding-left')) - iStep) + 'px');
        } else {
          if (oProductList.position().left >= 0) {
            oProductList.css('left', (-oProductList.innerWidth() / 2) + 'px');
          }
          oProductList.css('left', (oProductList.position().left - parseInt(oProductList.parent().css('padding-left')) + iStep) + 'px');
        }
      }, iRefreshInterval);
    } else if (showstyle == 2) { // 一屏屏滚动
      var oProductBoxes = module.find('.ProductBox');
      var iGroupCount = Math.ceil(oProductBoxes.length / countPerGroup);
      for (var i = 0; i < iGroupCount; i++) {
        $(oProductBoxes.slice(i * countPerGroup, i * countPerGroup + countPerGroup)).wrapAll('<div class="ProductGroup"></div>');
      }
      if (sitetype == 1) {
        oProductBoxes.css({ width: 'auto', height: 'auto', padding: '2px' });
      }
      oProductList.parent().css({ 'position': 'relative', overflow: 'hidden', 'width': module.width() + "px" });
      var oProductGroups = module.find('.ProductGroup');
      if (!oProductGroups.parent().is('.ProductGroupList')) {
        oProductGroups.wrapAll('<div class="ProductGroupList"></div>');
      }
      var oProductGroupList = module.find('.ProductGroupList');
      if (module.css("position") != "absolute") {
        iHeight = $(oProductBoxes[0]).height();
      }
      oProductGroupList.css({
        position: 'relative',
        top: '0px',
        width: module.innerWidth() * iGroupCount + 'px',
        overflow: 'hidden'
      });
      oProductGroups.css({ float: 'left', width: module.innerWidth() + 'px', height: module.innerHeight() + 'px' });
      if (iGroupCount <= 1) {
        return;
      }
      if (direction == 'left') {
        oProductGroupList.css({ left: '0px', right: 'auto' });
      } else {
        for (var i = 0; i < iGroupCount; i++) {
          oProductGroups = module.find('.ProductGroup');
          oProductGroups.eq(-1).insertBefore(oProductGroups.eq(i));
        }
        oProductGroupList.css({ left: 'auto', right: module.innerWidth() * (iGroupCount - 1) + 'px' });
      }
      module.find('.PDetail').css('width', module.find('.PicWrapper').width());
      window['effectInterval_' + module.attr('id')] = setInterval(function () {
        if (module.find('.ProductList').attr('ishovering') == 1 && module.find('.ProductList').attr('hoverstop') == 1) {
          return;
        }
        var oProductGroupList = module.find('.ProductGroupList');
        var oProductGroups = module.find('.ProductGroup');
        if (direction == 'left') {
          oProductGroupList.animate({
            left: '-=' + oProductGroups.outerWidth(true) + 'px'
          }, 1000, function () {
            oProductGroups.eq(0).insertAfter(oProductGroups.eq(-1));
            oProductGroupList.css('left', 0);
          });
        } else {
          oProductGroupList.animate({
            right: '-=' + oProductGroups.outerWidth(true) + 'px'
          }, 1000, function () {
            oProductGroups.eq(-1).insertBefore(oProductGroups.eq(0));
            oProductGroupList.css('right', oProductGroups.outerWidth(true) * (iGroupCount - 1) + 'px');
          });
        }
      }, 6000);
    }
  }
}

function showShopModal(productid, e, productShowType, DetailUrl, Param_Target, showMarketPrice) {
  if (DetailUrl.indexOf('http') > -1) {
    window.open(DetailUrl, Param_Target);
    return false;
  }
  e = e || window.event;
  e.stopPropagation && e.stopPropagation();
  e.preventDefault && e.preventDefault();
  e.cancelBubble = true;
  if (!productid) {
    return false;
  }

  if (typeof productShowType == 'undefined') {
    productShowType = 0;
  }

  var productSkus = [];

  $.ajax({
    url: 'https://www.gurki99.com/index.php?c=Front/ProductData',
    type: 'get',
    data: { id: productid, productShowType: productShowType },
    dataType: 'json',
    async: false,
    cache: false,
    success: function (json) {
      if (!json) {
        alert('无此商品');
        return;
      }
      var lg = json.lg;//多语言
      var windowWidth = $(window).width();

      productShowType = json.productShowType;

      productSkus = json.productSkus || [];

      var html = '';
      html += '<form name="ShopModalForm" method="post" action="https://www.gurki99.com/index.php?c=front/Productorder">';
      html += '<ul class="Jump_header">';
      html += '<li class="pro_appeal"><img src="' + (json.image + '').split(',')[0] + '"></li>';
      html += '<li class="ming">';
      html += '<div class="proTitle">' + json.name + '</div>';
      var priceStr = '<label style="margin-top: 6px;">' + (productShowType == 1 ? lg.point : lg.order_price) + '：</label>';
      priceStr += '<span class="price">' + (json.isSingleNorm ? (productShowType == 1 ? json.jf_convert : json.CurrencySymbols + parseFloat(json.price).toFixed(2)) : '') + '</span>';
      priceStr += ' <span style="font-size: 12px;color: #000;" class="Shtml" surplus="' + json.surplus + '">' + lg.pay_extra + json.CurrencySymbols + json.surplus + '</span>';
      html += '<div class="clearfix">' + priceStr + '</div>';
      //if (!productShowType == 1) {
      if (parseInt(showMarketPrice) === 1) {
        html += '<div class="clearfix"><label>' + lg.market_price + '：</label><span class="marketPrice">' + json.CurrencySymbols  + (parseFloat(json.marketPrice) || 0).toFixed(2) + '</span></div>';
      }
      if (json.productQuantity >= 0) {
        html += '<div style="color: #7f7f7f"><label>' + lg.in_stock + '：</label><span class="productQuantity" productQuantity="' + json.productQuantity + '">' + json.productQuantity + '</span> ' + lg.unit_jian + '</div>';
      }

      if (!json.isSingleNorm) {
        var productAttrs = json.productAttrs || [];
        for (var i = 0; i < productAttrs.length; i++) {
          html += '<div class="clearfix" responsiveCtrl>';
          html += '<label style="margin-top:10px">' + productAttrs[i].AttrKeyName + '：</label>';
          html += '<ul class="sys_spec_text clearfix" style="float:left;">';
          var attrVals = productAttrs[i].AttrVals || [];
          for (var j = 0; j < attrVals.length; j++) {
            html += '<li attrkeyid="' + attrVals[j].AttrKeyID + '" attrvalid="' + attrVals[j].AttrValID + '"><a href="javascript:;">' + attrVals[j].AttrValName + '</a><i></i></li>';
          }
          html += '</ul>';
          html += '</div>';
        }
      }
      html += '<div class="pro_amount" responsiveCtrl>';
      html += '<label style="float: left;line-height: 40px;">' + lg.quantity + '：</label>';
      html += '<div class="amount">';
      html += '<span class="reduce">-</span>';
      html += '<span>';
      html += '<input type="text" name="Num" id="ShopModalProNum" value="1" style="border:none;text-align:center;width:30px;line-height:30px;">';
      html += '</span>';
      html += '<span class="add">+</span>';
      html += '</div>';
      html += '</div>';
      html += '<div class="btnSet" responsiveCtrl>';


      if (json.jf_convert != null) {
        // 积分产品不再加入购物车
        html += '<button type="button" class="btn Buy" islocation="1" isJiFenPage="1" >' + lg.buynow + '</button>';
      } else {
        html += '<button type="button" class="btn Buy" islocation="1" isJiFenPage="0" >' + lg.buynow + '</button>';
        html += '<button type="button" class="btn btn-default ShopCart" islocation="0" >' + lg.addtocart + '</button>';
      }

      html += '<button type="button" class="btn btn-link ViewCart">' + lg.view_cart + '</button>';
      html += '</div>';
      html += '</li>';
      html += '</ul>';
      html += '<input type="hidden" name="ProductID" value="' + productid + '"/>';
      html += '<input type="hidden" name="enableInventory" value="' + json.enableInventory + '"/>';
      html += '<input type="hidden" name="skuid"/>';
      html += '<input type="hidden" name="c" value="front/Productorder"/>';
      html += '<input type="hidden" name="Action" value="Add">';
      html += '</form>';

      var dialog = bootbox.dialog({
        title: lg.quick_purchase,
        message: html,
        show: false,
        className: 'shopCartModal',
        buttons: {}
      }).on('shown.bs.modal', function () {
        $('.pro_appeal').height($('.pro_appeal').width());
      }).on('hidden.bs.modal', function () {
        if (!window.CanDesign) {
          $('.swiper-container').each(function () {
            $(this)[0].swiper.startAutoplay();
          });
        }
      }).modal('show');
      $('.shopCartModal').css('z-index', '10000');
      var surplus = parseInt(json.surplus);
      if (isNaN(surplus) || surplus == 0) {
        $('.shopCartModal .Shtml').hide();
      } else {
        $('.shopCartModal .Shtml').show();
      }

      function checkValid() {
        if (!/^\d+$/.test($('#ShopModalProNum').val() + '')) {
          alert(lg.file_in_quantity);
          return;
        }
        var enableInventory = $('.shopCartModal [name=enableInventory]').val();
        if (enableInventory) {
          var productQuantity = parseInt($('.shopCartModal .productQuantity').attr('productQuantity'));
          if (!isNaN(productQuantity) && parseInt($('#ShopModalProNum').val()) > productQuantity) {
            alert(lg.not_exceed_stock);
            return false;
          }
        }
        if (productSkus.length > 0 && !$('.shopCartModal [name="skuid"]').val()) {
          alert(lg.select_spec);
          return false;
        }
        return true;
      }

      $('.shopCartModal .pro_amount').disableSelection();

      $('.shopCartModal .sys_spec_text>li').off().on('click', function () {
        if ($(this).hasClass('outOfStock')) {
          return;
        }

        if ($(this).hasClass('selected')) {
          $(this).removeClass('selected');
        } else {
          var attrkeyid = $(this).attr('attrkeyid');
          $('[attrkeyid=' + attrkeyid + ']').not(this).removeClass('selected');
          $(this).addClass('selected');
        }

        var attrkeycount = $('.shopCartModal .sys_spec_text').length;
        var attrvalselectedcount = $('.shopCartModal .sys_spec_text>li.selected').length;

        if (attrkeycount - attrvalselectedcount == 1 || attrkeycount == attrvalselectedcount) {
          $('.shopCartModal .sys_spec_text>li').removeClass('outOfStock');
          var elemAttrVals = $('.shopCartModal .sys_spec_text>li').not('.selected');
          elemAttrVals.each(function () {
            var path = '';
            var elemAttrValInOtherKeys = $('.shopCartModal .sys_spec_text').not($(this).closest('.shopCartModal .sys_spec_text')).find('li.selected');
            elemAttrValInOtherKeys.each(function () {
              path += $(this).attr('attrvalid') + ',';
            });
            path += $(this).attr('attrvalid');
            path = path.split(',').sort().join(',');
            for (var i = 0; i < productSkus.length; i++) {
              var sku = productSkus[i];
              var skuPath = (sku.Path || '').split(',').sort().join(',');
              if (skuPath == path) {
                if (sku.ProductQuantity <= 0) {
                  $(this).addClass('outOfStock');
                } else {
                  $(this).removeClass('outOfStock');
                }
                break;
              }
            }
          });
        } else {
          $('.shopCartModal .sys_spec_text>li').removeClass('outOfStock');
        }

        if (attrkeycount == attrvalselectedcount) {
          var attrkeyid = $(this).attr('attrkeyid');
          $('[attrkeyid=' + attrkeyid + ']').not(this).removeClass('selected');
          $(this).addClass('selected');

          var path = '';
          $('.shopCartModal .sys_spec_text>li.selected').each(function () {
            path += $(this).attr('attrvalid') + ',';
          });
          path = path.replace(/(^,)|(,$)/g, '');
          path = path.split(',').sort().join(',');

          var price = 0;
          var point = 0;
          var skuid = 0;
          var surplus = 0;
          var productQuantity = 0;
          for (var i = 0; i < productSkus.length; i++) {
            if (path == productSkus[i].Path.split(',').sort().join(',')) {
              point = productSkus[i].Jf_convert;
              price = productSkus[i].Price;
              skuid = productSkus[i].SkuID;
              surplus = productSkus[i].surplus;
              productQuantity = productSkus[i].ProductQuantity;
              break;
            }
          }
          var priceHtml = '';
          if (productShowType == 1) {
            point = parseFloat(point).toFixed(2);
            surplus = parseFloat(surplus).toFixed(2);
            $('.shopCartModal .price').text(point).data('singlePrice', price);
            $(".shopCartModal .Shtml").attr('surplus', surplus).html(lg.pay_extra + json.CurrencySymbols + surplus);
            var surplus = parseInt(json.surplus);
            if (isNaN(surplus) || surplus == 0) {
              $('.shopCartModal .Shtml').hide();
            } else {
              $('.shopCartModal .Shtml').show();
            }
            priceHtml = point;
          } else {
            price = parseFloat(price).toFixed(2);
            $('.shopCartModal .price').text(json.CurrencySymbols + price).data('singlePrice', price);
          }
          $(".shopCartModal input[name=skuid]").val(skuid);
          $('.shopCartModal .productQuantity').text(productQuantity).attr('productQuantity', productQuantity);
        } else {
          var minVal = -1, maxVal = 0, productQuantity = 0;
          for (var i = 0; i < productSkus.length; i++) {
            var val = 0;
            if (productShowType == 1) {
              val = parseFloat(productSkus[i].Jf_convert);
            } else {
              val = parseFloat(productSkus[i].Price);
            }
            minVal = minVal == -1 ? val : Math.min(minVal, val);
            maxVal = maxVal == -1 ? val : Math.max(maxVal, val);
            productQuantity += parseInt(productSkus[i].ProductQuantity);
          }

          var pHtml = minVal.toFixed(2);
          if (minVal != maxVal) {
            pHtml = minVal.toFixed(2) + ' - ' + maxVal.toFixed(2);
          }
          if (productShowType != 1) {
            pHtml = json.CurrencySymbols + pHtml;
          }
          $(".shopCartModal .Shtml").hide();

          $('.shopCartModal .price').text(pHtml);//.data('singlePrice', price);
          $(".shopCartModal input[name=skuid]").val(skuid);
          $('.shopCartModal .productQuantity').text(productQuantity).attr('productQuantity', productQuantity);
        }
      });

      $('.shopCartModal .sys_spec_text>li:nth-child(1)').each(function () {
        $(this).click();
      });
      $(".shopCartModal .reduce").off().on('click', function () {
        var num = parseInt($("#ShopModalProNum").val());
        if (num == 1) return;
        else $("#ShopModalProNum").val(num - 1);
        var price = $('.shopCartModal .price').data('singlePrice');
      });
      $("https://www.gurki99.com/share/.shopCartModal .add").off().on('click', function () {
        var num = parseInt($("#ShopModalProNum").val());
        $("#ShopModalProNum").val(num + 1);
        var price = $('.shopCartModal .price').data('singlePrice');
      });
      $(".shopCartModal #ShopModalProNum").off().on('change', function () {
        var num = parseInt($("#ShopModalProNum").val());
        var price = $('.shopCartModal .price').data('singlePrice');
      });
      if (json.isSingleNorm) {
        $('.shopCartModal .price').data('singlePrice', json.price);
      }

      $('https://www.gurki99.com/share/.shopCartModal .ShopCart,.shopCartModal .Buy').off().on('click', function () {
        var islocation = $(this).attr('islocation');
        var skuid = $("form[name=ShopModalForm]").find("input[name=skuid]").val();
        var num = $("form[name=ShopModalForm]").find("input[name=Num]").val();
        if (!checkValid()) return false;

        $('.add-cart-result').remove();
        var hintHtml = '<div class="alert alert-danger add-cart-result" style="display:none;z-index:9999;background:#01bf65;color:white;border-color:#01a155"> <a href="#" class="close" style="color:white">&times;</a> <strong>' + lg.add_succ + '</strong> </div>';
        $(hintHtml).appendTo('body');
        $(".add-cart-result").find(".close").unbind('click').click(function () {
          $(".add-cart-result").hide();
          return false;
        });

        var url = '/index.php?c=front/Productorder&a=AddToCart&Action=Add&ProductID=' + productid + '&skuid=' + skuid + '&Num=' + num;
        var backurl = '/index.php?c=front/Productorder&Action=Add&ProductID=' + productid + '&skuid=' + skuid + '&Num=' + num;
        // 新底层更改加入购物车
        var params1 = "&productId=" + productid + "&skuId=" + skuid + "&count=" + num + '&isJiFen=' + isJiFenPage();
        var url = "/index.php?c=Api/shop/Cart&a=addToCart&" + params1;

        // 新底层更改立即购物
        var buyImmediately = getUrlParam('72e') == '72e' ? backurl : "/index.php?m=Home&c=front/Shop/Rewrite&a=buyImmediately&productId=" + productid + '&skuId=' + skuid + '&amount=' + num + '&isJiFen=' + $(this).attr('isJiFenPage');
        if (islocation == 1) {
          location.href = buyImmediately;
          return;
        }

        $.get(url, null, function (data, textStatus, jqXHR) {
          if (data.redirectUrl) {
            location.href = data.redirectUrl;
            return;
          }

          if (data.code == 200) {
            bootbox.hideAll();
            //立即购买会跳转
            if (islocation == 1) {
              location.href = backurl;
              return;
            }
            $(".add-cart-result").css({
              opacity: 1,
              top: ($(window).height() - $(".add-cart-result").outerHeight()) / 2 + $(window).scrollTop() + 'px',
              left: ($(window).width() - $(".add-cart-result").outerWidth()) / 2 + 'px',
              position: 'absolute',
              width: 'auto',
              height: 'auto'
            });
            $("#cartnum").html("(" + data.productnum + ")");
            $(".add-cart-result").slideToggle(300);
            setTimeout(function () {
              $(".add-cart-result").find(".close").click();
            }, 2000);

            // 加入购物车成功后，还需要给可能存在在页面中的 [ 购物车 ] 模块的数据增加相应的数量
            var ModuleShopCartGiantNumDom = $('.ModuleShopCartGiant .cart-pro-num-text');
            if (ModuleShopCartGiantNumDom) {
              // 获取原有的购物车数量
              var oldCartNumber = parseInt($.trim(ModuleShopCartGiantNumDom[0].innerHTML));
              // 跟现添加的数量相加，然后更新赋给所有的购物车模块
              ModuleShopCartGiantNumDom.text(oldCartNumber + parseInt(num));
            }
          } else {
            //没有登录的话直接跳到登录页面
            if (data.isLogin == '0') {
              location.href = '../index.php-c=front-Userlogin&a=GoLogin&BackUrl=.htm'/*tpa=https://www.gurki99.com/index.php?c=front/Userlogin&a=GoLogin&BackUrl=*/ + escape(backurl);
              return;
            }
            if (data.redirectUrl) {
              location.href = data.redirectUrl;
              return;
            } else {
              alert(data.msg);
            }
          }
        }, "json");
      });

      $('.shopCartModal .ViewCart').off().on('click', function () {
        location = 'https://www.gurki99.com/productorder';
      });

    },
    error: function () {
      alert('error');
    }
  });
}

function sortProductList(obj, moduleID, pageLink) {
  if ($(obj).hasClass('selected') && !$(obj).hasClass('sort')) return;
  var url = pageLink.replace("{PageNo}", 1);
  var orderBy = $(obj).attr('value') || '';
  var orderByStr = '&orderby=' + orderBy;
  var sortByStr = "";
  if ($.inArray(orderBy, ['price', 'lastest']) > -1) {
    sortByStr = '&sortby=' + ($(obj).hasClass('descent') ? 0 : 1);
  }

  var params = url.replace(new RegExp(/(\/)/g), '&');
  var paramss = params.replace(new RegExp(/(\-)/g), '=');
  var newUrl = '/index.php?c=front/LoadModulePageData' + paramss + orderByStr + sortByStr;
  $.ajax({
    url: newUrl, async: true, dataType: "text/html", complete: function (request, status, error) {
      $("#module_" + moduleID).replaceWith(request.responseText);
      BindPagerAction();
    }
  });
}

function checkBowerTip() {
  var $checkbower = $('<div id="checkBowerTip" style="display:block;z-index: 9999;width: 100%;padding:15px;height:auto;background: #fff9e8;border:1px solid #ffe08c;text-align: center;font-size: 14px;color:#333;position:fixed;top: 0;">' +
    '<span style="padding-right: 6%;font-family: 微软雅黑">当前浏览器版本过低，影响整体的访问体验.建议升级到IE9以上版本，或者下载<a style="font-size: 14px;color:#ff6700;" target="view_window" href="http://chrome.360.cn/">360浏览器</a>，<a style="font-size: 14px;color:#ff6700;" target="view_window" href="http://www.google.cn/intl/zh-CN/chrome/browser/desktop/index.html">谷歌浏览器</a>等</span>' +
    '<img title="关闭" style="cursor: pointer;padding: 0 10px;" src="../images/close_ie.png"/*tpa=https://www.gurki99.com/images/close_ie.png*//>' +
    '</div>');
  $('body').prepend($checkbower);
  $checkbower.width(window.innerWidth);
  $checkbower.find('img').eq(0).click(function () {
    $checkbower.addClass('hidden');
  });
  if ($checkbower.width() < 400) $checkbower.css({
    'font-size': '12px',
    'padding': '5px 0',
    'text-align': 'left'
  }).find('span').eq(0).css('padding-right', '10px')
}

function filterProductList_Pc(obj1, obj2, moduleID, pageLink) {
  var url = pageLink.replace("{PageNo}", 1);
  var params = '';
  var filterid2 = $(obj2).attr('filterid');
  var valueid2 = $(obj2).attr('valueid');

  // 拼接筛选条件
  if (!$(obj2).hasClass('setting-reset')) {
    $(obj1).find('li').each(function (index, element) {
      var filterid = $(element).attr('filterid');
      var valueid = $(element).attr('valueid');
      if (Number(valueid2) === 0) {
        if (valueid && filterid2 != filterid) params += valueid + ',';
      } else {
        if (valueid && valueid2 != valueid) params += valueid + ',';
      }
    });
  }
  if ($(obj2).hasClass('selected-light') && Number(valueid2) > 0) params += valueid2 + ',';

  var match = url.match(/filtervalue=([,]?\d+[,]?)+/);
  if (match && match.length > 1) url = url.replace(/filtervalue=([,]?\d+[,]?)+/, 'filtervalue=' + params);
  else url += '/filtervalue-' + params;

  var params = url.replace(new RegExp(/(\/)/g), '&');
  var paramss = params.replace(new RegExp(/(\-)/g), '=');
  var newUrl = '/index.php?c=front/LoadModulePageData' + paramss;
  $.ajax({
    url: newUrl, async: true, dataType: "text/html", complete: function (request, status, error) {
      $("#module_" + moduleID).replaceWith(request.responseText);
      BindPagerAction();
    }
  });
}

function filterProductList_Mobile(obj, moduleID, pageLink) {
  var url = pageLink.replace("{PageNo}", 1);
  var params = '';
  $(obj).find('li.items-active').each(function (index, element) {
    var valueid = $(element).attr('valueid');
    var filterid = $(element).attr('filterid');
    params += valueid + ',';
  });

  var match = url.match(/filtervalue=([,]?\d+[,]?)+/);
  if (match && match.length > 1) {
    url = url.replace(/filtervalue=([,]?\d+[,]?)+/, 'filtervalue=' + params);
  } else {
    url += '&filtervalue-' + params;
  }

  loadingText = getLang('loading') + '...';
  var pageLoadingHtml = '<div name="pageloading" class="PageLoading" style="position:fixed ! important;z-index: 9999">';
  pageLoadingHtml += '<div class="content" style="top:50%;height: 55px;width: 25%;left: 55%;background: rgba(0,0,0,.5);">';
  pageLoadingHtml += '<span class="iconfont icon-loading1 myrotateall" style="text-align: center;line-height:55px;color: #fff;font-size: 2rem;display: block;margin: 0 auto"></span>';
  pageLoadingHtml += '</div>';
  pageLoadingHtml += '</div>';
  $("#module_" + moduleID).children().append(pageLoadingHtml);
  var params = url.replace(new RegExp(/(\/)/g), '&');
  var paramss = params.replace(new RegExp(/(\-)/g), '=');
  //debugger
  var newUrl = '/index.php?c=front/LoadModulePageData&' + paramss;
  $.ajax({
    url: newUrl, async: true, dataType: "text/html", complete: function (request, status, error) {
      $("#module_" + moduleID).replaceWith(request.responseText);
      $("#module_" + moduleID).find('.PageLoading').remove();
      BindPagerAction();
    }
  });
}

// 初始化产品展示的瀑布流
function initProductListMasonry(moduleid) {
  var $container = $('#module_' + moduleid + ' .masonry-container');
  if ($container.length > 0) {
    $container.imagesLoaded(function () {
      $container.masonry({
        columnWidth: '.productItem',
        itemSelector: '.productItem'
      });
    });
  }
}

// 初始化产品展示
function initProductList(options) {
  if (typeof options.ModuleID == 'undefined' || typeof options.ShowStyle == 'undefined') return;

  var moduleid = parseInt(options.ModuleID);
  var showStyle = parseInt(options.ShowStyle);

  $(window).off('resize.productlistImgSizeType' + moduleid);
  $(window).off('resize.initProductListSlide' + moduleid);

  // 初始化瀑布流
  if (showStyle == 13) {
    initProductListMasonry(moduleid);
  }

  // 设置产品展示图片，确保比例
  var imgSizeType = options.ImgSizeType;
  setProductListImg(moduleid, showStyle, imgSizeType);

  // 是否显示滚动
  var isScroll = options.IsScroll;
  if (options.IsScroll == 1 && showStyle != 13) {
    var direction = options.Direction;
    $('#module_' + moduleid + ' .ModuleProductList .proMore').remove();
    $('#module_' + moduleid + ' .ModuleProductList').addClass('swiper-container');
    if (direction == 'right') {
      $('#module_' + moduleid + ' .ModuleProductList').attr('dir', "rtl");
    }
    $('#module_' + moduleid + ' .ModuleProductList .ProductList').addClass('swiper-wrapper').css('overflow', 'visible');
    $('#module_' + moduleid + ' .ModuleProductList .ProductList .productsBox').addClass('swiper-slide');
    var btnPrevNext = '<div class="swiper-button-prev btnPrev"></div><div class="swiper-button-next btnNext"></div>';
    $('#module_' + moduleid + ' .ModuleProductList').after(btnPrevNext);

    var slidePerGroup = calProductListSlidePerGroup(moduleid);
    var mySwiper = new Swiper('#module_' + moduleid + ' .swiper-container', {
      autoplay: 5000,
      speed: 1000,
      slidesPerView: slidePerGroup,
      slidesPerGroup: slidePerGroup,
      loopAdditionalSlides: slidePerGroup,
      spaceBetween: 0,
      autoplayDisableOnInteraction: false,
      loop: true
    });
    $(window).off('resize.initProductListSlide' + moduleid).on('resize.initProductListSlide' + moduleid, function () {
      var slidePerGroup = calProductListSlidePerGroup(moduleid);
      mySwiper.params.slidesPerGroup = slidePerGroup;
      mySwiper.params.slidesPerView = slidePerGroup;
      mySwiper.params.loopedSlides = slidePerGroup;
      mySwiper.updateSlidesSize();
      mySwiper.updateContainerSize();
      setProductListImg(moduleid, showStyle, imgSizeType);
    });
    $('#module_' + moduleid + ' .btnPrev').off().on('click', function () {
      mySwiper.animating = false;
      direction == 'left' ? mySwiper.slideNext() : mySwiper.slidePrev();
    }).disableSelection();
    $('#module_' + moduleid + ' .btnNext').off().on('click', function () {
      mySwiper.animating = false;
      direction == 'left' ? mySwiper.slidePrev() : mySwiper.slideNext();
    }).disableSelection();

  } else {
    $(window).off('resize.initProductListSlide' + moduleid);
  }

  if ($.inArray(showStyle, [11, 12, 13, 14, 15, 16]) > -1) {
    var productShowType = options.ProductShowType;
    // 购买按钮点击，弹出框
    var event = 'touchend.pro_join' + moduleid + ' click.pro_join' + moduleid;
    $(document).off(event).on(event, '#module_' + moduleid + ' .pro_join, #module_' + moduleid + ' .proBuyBtn', function (evt) {
      if (mySwiper) {
        if (mySwiper.animating) return false;
        mySwiper.stopAutoplay();
      }
      showShopModal($(this).attr('productid'), evt, productShowType);
      return false;
    });

    // 排序标签点击
    $('#module_' + moduleid + ' .orderCtrlPanel>li').off('touchend.orderCtrl click.orderCtrl').on('touchend.orderCtrl click.orderCtrl', function (e) {
      sortProductList(this, moduleid, options.PageLink);
    });
  }

  // 绑定更多点击事件
  var pcount = 2;
  var pagecount = options.PageCount;
  $('#module_' + moduleid + ' .ProductListMore').off("click").on("click", function (e) {
    if (pcount <= pagecount) {
      var url = options.PageLink.replace('{PageNo}', pcount);
      var self = this;
      $.ajax({
        type: "GET",
        url: '/index.php?c=front/LoadModulePageData&' + url.substring(url.indexOf("?") + 1),
        dataType: "html",
        success: function (response) {
          $resultlist = $(response).find(".ProductList");
          var newitems = $resultlist.find(".productsBox").clone();
          $('#module_' + moduleid + ' .ProductList').append(newitems);
          setProductListImg(moduleid, showStyle, imgSizeType);
          if ($(self).closest('.ModuleItem').find('.masonry-container').length > 0) {
            $('#module_' + moduleid + ' .ProductList').imagesLoaded(function () {
              $('#module_' + moduleid + ' .ProductList').masonry('appended', newitems);
            });
          }
          if (pcount == pagecount)
            $('#module_' + moduleid + ' .ProductListMore').removeClass('moreLoad').removeAttr('onclick').text(options.NoMoreProductText);
          pcount++;
        }
      });
    }
  });

  // 电脑访问点击产品，新开一个页面打开，移动设备在同一个页面跳转
  $('#module_' + moduleid + ' .proCont').attr('target', isMobileBroswer() || parent != window ? '_self' : '_blank');
}

// 设置产品展示图片，确保比例
function setProductListImg(moduleid, showStyle, imgSizeType) {
  if ($.inArray(showStyle, [12, 15, 16]) > -1 && imgSizeType == 3) {
    $('#module_' + moduleid + ' .proImg').height($('#module_' + moduleid + ' .proImg').width());
    $(window).off('resize.productlistImgSizeType' + moduleid).on('resize.productlistImgSizeType' + moduleid, function (evt) {
      $('#module_' + moduleid + ' .proImg').height($('#module_' + moduleid + ' .proImg').width());
    });
  } else {
    $(window).off('resize.productlistImgSizeType' + moduleid);
  }
}

// 获取购物车数量
function getShopCartNum(callback) {
  $.ajax({
    type: 'get',
    url: 'https://www.gurki99.com/index.php?c=front/productorder&a=GetShopCartNum',
    async: true,
    dataType: "json",
    success: function (json) {
      if (json.success) {
        if (typeof callback == 'function') {
          callback(json.num);
        }
      }
    },
    error: function () {
    }
  });
}

function calProductListSlidePerGroup(moduleid) {
  var itemCountPerGroup = 0;
  var classText = $('#module_' + moduleid).find('.productsBox').prop('class');
  var winWidth = window.innerWidth;
  if (winWidth >= 1200) {
    itemCountPerGroup = 12 / parseInt(classText.match(/col-lg-(\d+)/)[1]);
  } else if (winWidth >= 992) {
    itemCountPerGroup = 12 / parseInt(classText.match(/col-md-(\d+)/)[1]);
  } else if (winWidth >= 768) {
    itemCountPerGroup = 12 / parseInt(classText.match(/col-sm-(\d+)/)[1]);
  } else {
    itemCountPerGroup = 12 / parseInt(classText.match(/col-xs-(\d+)/)[1]);
  }
  return itemCountPerGroup;
}

function productListMouseOver(elem) {
  $(elem).attr('ishovering', 1);
}

function productListMouseOut(elem) {
  $(elem).attr('ishovering', 0);
}

function BindPagerAction() {
  $(".ModuleItem").off('click.pager_num_click').on('click.pager_num_click', '.PageNavigate a,.page-nav a,.page-more a', function (evt) {
    evt = evt || window.event;
    evt.preventDefault && evt.preventDefault();
    evt.stopPropagation && evt.stopPropagation();
    pagerSubmit(this, $(this).attr("href"));
    return false;
  });

  $(".ModuleItem").off('click.pager_submit').on('click.pager_submit', '.pagerGiant .submit', function (evt) {
    var pageNo = $(this).closest('.pagerGiant').find('.inputer').val() || '';
    var url = $(this).closest('.pagerGiant').find('[name=pagerUrl]').val() || '';
    url = url.replace('{pageNo}', pageNo);
    if (/^\d+$/.test(pageNo) && parseInt(pageNo) > 0) {
      var pagerCount = parseInt($(this).closest('.pagerGiant').find('[name=pagerCount]').val() || -1);
      if (pagerCount > -1 && parseInt(pageNo) > pagerCount) {
        return false;
      }
      pagerSubmit(this, url);
    }
    return false;
  });

  $(".ModuleItem").off('keypress.pager_inputer').on('keypress.pager_inputer', '.pagerGiant .inputer', function (evt) {
    evt = evt || window.event;
    var keyCode = evt.keyCode;
    if ((evt.keyCode < 48 || evt.keyCode > 57) && evt.keyCode != 13) {
      evt.preventDefault && evt.preventDefault();
      evt.stopPropagation && evt.stopPropagation();
      return false;
    }
    if (keyCode == 13) {
      var pageNo = $(this).closest('.pagerGiant').find('.inputer').val() || '';
      var url = $(this).closest('.pagerGiant').find('[name=pagerUrl]').val() || '';
      url = url.replace('{pageNo}', pageNo);
      if (/^\d+$/.test(pageNo) && parseInt(pageNo) > 0) {
        var pagerCount = parseInt($(this).closest('.pagerGiant').find('[name=pagerCount]').val() || -1);
        if (pagerCount > -1 && parseInt(pageNo) > pagerCount) {
          return false;
        }
        pagerSubmit(this, url);
      }
    }
  });
}

/**
 * js获取多语言
 * @param  string lang 要获取多语言的key
 * @return string 多语言
 */
function getLang(lang) {
  if (window.AllLang) {
    return window.AllLang[lang];
  } else {
    var sys_lang = 'cn,big5,en,fr,jp,kr';
    var site_lang = (getCookie && sys_lang.indexOf(getCookie('Lang')) > -1) ? getCookie('Lang') : 'en';
    //site_lang = site_lang == 'big5' ? 'cn' : site_lang
    var lang_url = '/share/lang/lang_' + site_lang + '.json?v=' + Math.random(1, 9999);
    $.ajax({
      url: lang_url,
      type: 'GET',
      dataType: 'json',
      async: false,
      success: function (json) {
        window.AllLang = json;
      }
    });
    return window.AllLang[lang];
  }
}

function pagerSubmit(item, url) {
  if (url && url.indexOf("PageNo=") > -1) {
    var path = url.split("?")[0];
    var params = url.split("?")[1];
    var classid = null;
    if (params) {
      var match = params.match(/classid=(\d*)/i);
      if (match && match.length > 1) classid = match[1];
    }
    var newUrl = "/index.php?c=Front/LoadModulePageData&" + params;
    /responseModuleId=(\d+)/.test(newUrl);
    var moduleId = parseInt(RegExp.$1);
    if (moduleId > 0) {
      var ispagemore = $(item).is(".page-more") || $(item).parent().is(".page-more");
      if (ispagemore) {
        if ($(item).attr("pagecount") == $(item).attr("curpage")) {
          alert(getLang('last_page'));
          return false;
        }
      }

      var top = $("#module_" + moduleId).outerHeight() / 2;
      loadingText = ispagemore ? getLang('loading_wait') : getLang('loading') + '...';
      if (ispagemore) {
        $("#module_" + moduleId).find('.page-more').hide();
        var pageLoadingHtml = '<div class="page-more-loading">';
        pageLoadingHtml += '<div class="content">';
        pageLoadingHtml += '<span class="fa fa-spinner fa-spin loading-icon"></span>';
        pageLoadingHtml += '<span class="loading-text">' + loadingText + '</span>';
        pageLoadingHtml += '</div>';
        pageLoadingHtml += '</div>';
        $("#module_" + moduleId).find('.page-more').after(pageLoadingHtml);
      } else {
        $("#module_" + moduleId).find('.BodyCenter').css({ 'opacity': '0', 'visibility': 'hidden' });
        var pageLoadingHtml = '<div name="pageloading" class="PageLoading">';
        pageLoadingHtml += '<div class="content">';
        pageLoadingHtml += '<span class="fa fa-spinner fa-spin loading-icon"></span>';
        pageLoadingHtml += '<span class="loading-text">' + loadingText + '</span>';
        pageLoadingHtml += '</div>';
        pageLoadingHtml += '</div>';
        $("#module_" + moduleId).children().append(pageLoadingHtml);
      }
      $("#module_" + moduleId).children().css('position', 'relative');

      $.ajax({
        url: newUrl, async: true, dataType: "text/html", complete: function (request, status, error) {
          if (ispagemore) {
            $("#module_" + moduleId).find('.PageLoading').remove();
            $("#module_" + moduleId).find('.page-more-loading').remove();
            $("#module_" + moduleId).find('.page-more').show();
            var newitems = $(request.responseText).find(".news-container,.pro-container,.download-container,.guestbooklist-container,.gallery-container").children();
            $("#module_" + moduleId).find(".news-container,.pro-container,.download-container,.guestbooklist-container,.gallery-container").append(newitems);

            var initFunc = window['initFunc' + moduleId];
            if (typeof initFunc == 'function') {
              initFunc({
                newitems: newitems
              });
            }
            //同步分页的状态
            var page_more = $(request.responseText).find(".page-more");
            if (page_more.length == 0) {
              page_more = $('<div style="text-align:center;line-height: 50px;padding: 20px 0px;color: #666;">' + getLang('all_loaded') + '！</div>');
            }
            $(item).closest(".page-more").replaceWith(page_more);
            $("#module_" + moduleId).find(".PageNavigate,.page-nav").replaceWith($(request.responseText).find(".PageNavigate,.page-nav"));
          } else {
            $("#module_" + moduleId).replaceWith(request.responseText);
          }
          BindPagerAction();
          if (typeof CanDesign != 'undefined' && CanDesign != "True") {
            var bodyClientHeight = document.documentElement.clientHeight // 因为有DOCTYPE
            if (bodyClientHeight == 0) bodyClientHeight = window.innerHeight;
            var bodySrollTop = $('body').scrollTop();
            if (bodySrollTop == 0) bodySrollTop = $(window).scrollTop();
            var relModule = $("#module_" + moduleId).eq(0);
            var originModuleHeight = relModule.height();
            if (relModule.length > 0) {
              if (!ispagemore) {
                if (SiteType == 0) {
                  if (originModuleHeight > bodyClientHeight || getElementTop(relModule[0]) < bodySrollTop) {
                    $('body,html').animate({ scrollTop: getElementTop(relModule[0]) }, 1000);
                  }
                } else {
                  window.location.href = "#module_" + moduleId;
                }
              }
            }
          }
          //加载完成后 重新调用一下该模块的init方法
          if (window["initFunc" + moduleId]) {
            window["initFunc" + moduleId]();
          }
        }
      });
      return false;
    }
  } else if (url && url.indexOf("PageNo") > -1) {

    var urlslashindex = url.indexOf('/', url.indexOf('/') + 1);
    var urldotindex = url.lastIndexOf('.');
    var param = url.substr(urlslashindex, urldotindex - urlslashindex);
    var params = param.replace(new RegExp(/(\/)/g), '&');
    var paramss = params.replace(new RegExp(/(\-)/g), '=');
    var classid = null;
    if (paramss) {
      var match = params.match(/classid=(\d*)/i);
      if (match && match.length > 1) classid = match[1];
    }
    var newUrl = "/index.php?c=Front/LoadModulePageData" + paramss;
    /responseModuleId=(\d+)/.test(newUrl);
    var moduleId = parseInt(RegExp.$1);
    if (moduleId > 0) {
      var ispagemore = $(item).is(".page-more") || $(item).parent().is(".page-more");
      if (ispagemore) {
        if ($(item).attr("pagecount") == $(item).attr("curpage")) {
          alert(getLang('last_page'));
          return false;
        }
      }

      var top = $("#module_" + moduleId).outerHeight() / 2;
      loadingText = ispagemore ? getLang('loading_wait') : getLang('loading') + '...';
      if (ispagemore) {
        $("#module_" + moduleId).find('.page-more').hide();
        var pageLoadingHtml = '<div class="page-more-loading">';
        pageLoadingHtml += '<div class="content">';
        pageLoadingHtml += '<span class="fa fa-spinner fa-spin loading-icon"></span>';
        pageLoadingHtml += '<span class="loading-text">' + loadingText + '</span>';
        pageLoadingHtml += '</div>';
        pageLoadingHtml += '</div>';
        $("#module_" + moduleId).find('.page-more').after(pageLoadingHtml);
      } else {
        $("#module_" + moduleId).find('.BodyCenter').css({ 'opacity': '0', 'visibility': 'hidden' });
        var pageLoadingHtml = '<div name="pageloading" class="PageLoading">';
        pageLoadingHtml += '<div class="content">';
        pageLoadingHtml += '<span class="fa fa-spinner fa-spin loading-icon"></span>';
        pageLoadingHtml += '<span class="loading-text">' + loadingText + '</span>';
        pageLoadingHtml += '</div>';
        pageLoadingHtml += '</div>';
        $("#module_" + moduleId).children().append(pageLoadingHtml);
      }
      $("#module_" + moduleId).children().css('position', 'relative');

      $.ajax({
        url: newUrl, async: true, dataType: "text/html", complete: function (request, status, error) {
          if (ispagemore) {
            $("#module_" + moduleId).find('.PageLoading').remove();
            $("#module_" + moduleId).find('.page-more-loading').remove();
            $("#module_" + moduleId).find('.page-more').show();
            var newitems = $(request.responseText).find(".news-container,.pro-container,.download-container,.guestbooklist-container,.gallery-container").children();
            $("#module_" + moduleId).find(".news-container,.pro-container,.download-container,.guestbooklist-container,.gallery-container").append(newitems);

            var initFunc = window['initFunc' + moduleId];
            if (typeof initFunc == 'function') {
              initFunc({
                newitems: newitems
              });
            }
            //同步分页的状态
            var page_more = $(request.responseText).find(".page-more");
            if (page_more.length == 0) {
              page_more = $('<div style="text-align:center;line-height: 50px;padding: 20px 0px;color: #666;">' + getLang('all_loaded') + '！</div>');
            }
            $(item).closest(".page-more").replaceWith(page_more);
            $("#module_" + moduleId).find(".PageNavigate,.page-nav").replaceWith($(request.responseText).find(".PageNavigate,.page-nav"));
          } else {
            $("#module_" + moduleId).replaceWith(request.responseText);
          }
          BindPagerAction();
          if (typeof CanDesign != 'undefined' && CanDesign != "True") {
            var bodyClientHeight = document.documentElement.clientHeight // 因为有DOCTYPE
            if (bodyClientHeight == 0) bodyClientHeight = window.innerHeight;
            var bodySrollTop = $('body').scrollTop();
            if (bodySrollTop == 0) bodySrollTop = $(window).scrollTop();
            var relModule = $("#module_" + moduleId).eq(0);
            var originModuleHeight = relModule.height();
            if (relModule.length > 0) {
              if (!ispagemore) {
                if (SiteType == 0) {
                  if (originModuleHeight > bodyClientHeight || getElementTop(relModule[0]) < bodySrollTop) {
                    $('body,html').animate({ scrollTop: getElementTop(relModule[0]) }, 1000);
                  }
                } else {
                  window.location.href = "#module_" + moduleId;
                }
              }
            }
          }
          //加载完成后 重新调用一下该模块的init方法
          if (window["initFunc" + moduleId]) {
            window["initFunc" + moduleId]();
          }
        }
      });
      return false;
    }
  }

}

function getElementTop(obj) {
  var i = obj.offsetTop;
  if (obj.offsetParent != null) i += getElementTop(obj.offsetParent);
  return i;
}

function getElementLeft(obj) {
  var i = obj.offsetLeft;
  if (obj.offsetParent != null) i += getElementLeft(obj.offsetParent);
  return i;
}

function getElementTopWithBorder(obj) {
  var i = obj.offsetTop + parseFloat($(obj).css('border-top-width'));
  if (obj.offsetParent != null) i += getElementTopWithBorder(obj.offsetParent);
  return i;
}

function getElementLeftWithBorder(obj) {
  var i = obj.offsetLeft + parseFloat($(obj).css('border-left-width'));
  if (obj.offsetParent != null) i += getElementLeftWithBorder(obj.offsetParent);
  return i;
}

function AddFavorite(sURL, sTitle) {
  if (!sURL) sURL = location.href;
  if (!sTitle) sTitle = document.title;
  try {
    window.external.addFavorite(sURL, sTitle);
  } catch (e) {
    try {
      window.sidebar.addPanel(sTitle, sURL, "");
    } catch (e) {
      alert("加入收藏失败，请使用Ctrl+D进行添加");
    }
  }
}

function SetHome() {
  if (document.all) {
    document.body.style.behavior = 'url(#default#homepage)';
    document.body.setHomePage(window.location.href);
  } else if (window.sidebar) {
    if (window.netscape) {
      try {
        netscape.security.PrivilegeManager.enablePrivilege("UniversalXPConnect");
      } catch (e) {
        alert("该操作被浏览器拒绝，如果想启用该功能，请在地址栏内输入 about:config,然后将项 signed.applets.codebase_principal_support 值改为true");
      }
    }
    var prefs = Components.classes['@mozilla.org/preferences-service;1'].getService(Components.interfaces.nsIPrefBranch);
    prefs.setCharPref('browser.startup.homepage', window.location.href);
  } else {
    alert('您的浏览器不支持自动自动设置首页, 请使用浏览器菜单手动设置!');
  }
}

/************
 2015年3月24日14:21:59  创建人：郑江  主要针对模块的高级功能的js
 ************/
//图片的半透明效果
function ShowTransparent(obj) {
  $(obj).animate({
    opacity: 0.7
  }, 300, function () {
  });
}

//图片不透明
function HideTransparent(obj) {
  $(obj).animate({
    opacity: 1
  }, 300, function () {
  });
}

//浮影
var oSetTimeout = null;

function ImgShade(obj, type) {
  var oDiv = $(obj).parent().find("div[name='shade']");
  $(obj).parent().css("position", "relative");
  if ($(obj).parent().is("a")) $(obj).parent().css("display", "block");
  if (oDiv.length == 0) {
    oDiv = $("<div name='shade'>" + $(obj).attr('alt') + "</div>").appendTo($(obj).parent()).css('height', 0);
  }
  var bc = $(obj);
  var module = $(obj).closest('.ModuleItem');
  var top = bc.position().top;
  var left = bc.offset().left - $(obj).closest('.BodyCenter').offset().left;
  var w = bc.width();
  var h = bc.height();
  if (type == 'ShadeTop') {
    $(oDiv).attr("class", "showShadeTop").css({ 'width': w, 'left': left, 'top': 0 }).show();
  } else if (type == 'ShadeBottom') {
    $(oDiv).attr("class", "showShadeBottom").css({ 'width': w, 'left': left, 'bottom': 0 }).show();
  } else {
    $(oDiv).attr("class", "showShadeTop").css({ 'width': w, 'left': left, 'top': 0 }).show();
  }
  var isShadeAll = type == 'Shade';
  if (isShadeAll) $(oDiv).css({ 'line-height': h + 'px', 'font-size': '18px' });
  $(oDiv).stop().animate({ height: (isShadeAll ? h + 'px' : "50px") }, (isShadeAll ? 100 : 200), function () {
  });

  //2015年6月1日17:44:45 郑江 当鼠标进入div（浮影）的时候关掉定时器
  $(oDiv).mouseenter(function () {
    clearTimeout(oSetTimeout);
  });
  $(oDiv).mouseleave(function () {
    divZoom(oDiv, type);
  });
}

function unImgShade(obj, type) {
  if ($(obj).parent().find("div[name='shade']").length == 0) $(obj).parent().append("<div name='shade'>" + $(obj).attr('alt') + "</div>");
  var oDiv = $(obj).parent().find("div[name='shade']");
  oSetTimeout = setTimeout(function () {
    divZoom(oDiv, type);
  }, 200);
}

//2015年6月2日14:19:10 郑江 隐藏div动画
function divZoom(obj, type) {
  $(obj).stop().animate({
    height: "0px"
  }, 200, function () {
    if (type == 'ShadeTop') $(obj).attr("class", "hideShadeTop").hide();
    else $(obj).attr("class", "hideShadeBottom").hide();
  });
}

function moduleImageHover(obj) {
  var width = $(obj).width();
  $(obj).stop().animate({ opacity: 0 }, 250, function () {
    $(this).css('visibility', 'hidden');
  });
  $(obj).parent().css('position', 'relative');
  if (!$(obj).parent().is('.BodyCenter')) {
    $(obj).parent().css('display', 'block');
  }
  var left = ($(obj).parent().width() - $(obj).width()) / 2;
  $(obj).siblings('img').stop().show().css({
    'visibility': 'visible',
    'box-sizing': 'border-box',
    'top': '0',
    'left': left + 'px',
    'padding-top': $(obj).parent().css('padding-top') || 0,
    'padding-left': $(obj).parent().css('padding-left') || 0,
    'padding-bottom': $(obj).parent().css('padding-bottom') || 0,
    'padding-right': $(obj).parent().css('padding-right') || 0
  }).animate({ opacity: 1 }, 250);
}

function moduleImageUnHover(obj) {
  $(obj).stop().animate({ opacity: 0 }, 250, function () {
    $(this).css('visibility', 'hidden');
  });
  $(obj).siblings('img').stop().show().css('visibility', 'visible').animate({ opacity: 1 }, 250);
}

function ImgZoom(obj) {
  var scale = $(obj).width() > 500 ? 1.02 : 1.10;
  var step = $(obj).width() > 500 ? 0.001 : 0.005;
  var curscale = 1;
  $(obj).attr('zoom-step', step);
  $(obj).parent().attr('zoom-overflow', $(obj).parent().css('overflow'));
  $(obj).parent().css({ 'overflow': 'hidden' });
  if ($(obj).parent().is('a')) $(obj).parent().css({ 'display': 'block' });
  var f = function () {
    $(obj).attr('zoom-scale', curscale);
    $(obj).css({
      '-webkit-transform': 'scale(' + curscale + ')',
      '-ms-transform': 'scale(' + curscale + ')',
      '-moz-transform': 'scale(' + curscale + ')',
      '-o-transform': 'scale(' + curscale + ')',
      'transform': 'scale(' + curscale + ')'
    });
    curscale += step;
    if (curscale < scale) setTimeout(f, 10);
  }
  f();
}

function unImgZoom(obj) {
  var scale = 1;
  var curscale = parseFloat($(obj).attr('zoom-scale'));
  var step = parseFloat($(obj).attr('zoom-step'));
  var f = function () {
    $(obj).css({
      '-webkit-transform': 'scale(' + curscale + ')',
      '-ms-transform': 'scale(' + curscale + ')',
      '-moz-transform': 'scale(' + curscale + ')',
      '-o-transform': 'scale(' + curscale + ')',
      'transform': 'scale(' + curscale + ')'
    });
    curscale -= step;
    if (curscale > scale) setTimeout(f, 10);
    else $(obj).parent().css('overflow', $(obj).parent().attr('zoom-overflow'));
  }
  f();
}

/* start of 图文自动隐藏 */
function moduleImageTextHide(option) {
  //多语言处理
  if (!window.lang && typeof option != 'undefined') {
    window.lang = {};
    window.lang.show_more = option.lang.show_more;
  }
  var show_more = '显示更多';
  if (typeof option != 'undefined') {
    show_more = option.lang.show_more;
  } else if (window.lang) {
    show_more = window.lang.show_more;
  }
  //如果有绝对定位的模块，那自动隐藏就会有问题
  if (SiteType == "1") {
    $(".ModuleImageText,.ModuleImageTextV2,.ModuleImageTextGiant").each(function (i, item) {
      var normalWidth = window.innerWidth;
      var id = eachImageTextNode(i, item, show_more)
      $(window).off('resize.moduleImageTextHide' + id).on('resize.moduleImageTextHide' + id, function () {
        if (window.innerWidth < 768 && normalWidth != window.innerWidth) {
          normalWidth = window.innerWidth
          eachImageTextNode(i, item, show_more)
        } else if (window.innerWidth >= 768 && normalWidth != window.innerWidth) {
          normalWidth = window.innerWidth
          moduleImageTextShow(id)
        }
      });
    });
  }
}

function eachImageTextNode(i, item, show_more) {
  var m = $(item).closest(".ModuleItem");
  var textcontainer = $(item).find(".imageTextContainer");
  var id = m.attr('id');
  var referwidth = $('#pagebody').width(); //m.width();
  var hidew = 800;
  if (textcontainer.attr('hidewidth')) hidew = parseInt(textcontainer.attr('hidewidth'));
  var hideh = 150;
  if (textcontainer.attr('hideheight')) hideh = parseInt(textcontainer.attr('hideheight'));
  if ((m.css("position") == 'static' || m.css("position") == '')) {
    if (referwidth < hidew && textcontainer.attr('autohide') == '1' && textcontainer.attr('hasResponsive') == '1' && textcontainer.attr('hasshow') != '1') {
      if (m.find('.showHandle').length == 0) {
        var $bodyc = m.find(".BodyCenter");
        $bodyc.css({ 'height': hideh + 'px', 'overflow': 'hidden' });
        $bodyc.parent().append("<div class='showHandle' style='width:100%;margin:10px auto 0 auto;text-align:center;float:left;'><div style='border-top:1px solid #ddd;margin-bottom:10px;'></div><input onclick=\"moduleImageTextShow('" + id + "')\" type='button' class='btn btn-success' value='" + show_more + "'></div>");
      }
    }
    else if (referwidth > hidew) {//添加到分栏时  编辑状态下 显示有问题 换为pagebody的宽度做比较
      moduleImageTextShow(id);
    }
  }
  return id
}

function moduleImageTextShow(id) {
  var m = $("#" + id);
  m.find(".showHandle").remove();
  m.find(".BodyCenter").css({ 'height': 'auto', 'overflow': 'visible' });
}

/* end of 图文自动隐藏 */

function showSubMenu(obj, direction, subItemLocation) {
  setTimeout(function () {
    var oModuleNav = $(obj).closest('.ModuleNav,.ModuleNavGiant');
    var oModuleItem = $(obj).closest('.ModuleItem');
    var oContent = $(obj).closest('.main-nav-content');
    var oNavSubMenu = $(obj).children('.NavSubMenu,.sub-nav-item-group');
    var subAlign = $(obj).closest('.pre_nav').attr('SubAlign'); //left:左对齐，right:右对齐, auto: 根据主菜单的在屏幕中的相对位置对齐
    var subHolder = $(obj).closest('.pre_nav').attr('SubHolder');
    $(obj).addClass('on').siblings().removeClass('on');
    var timeoutId = "moduleNavTimeout";
    if (typeof direction == 'undefined') direction = $(obj).closest('.pre_nav').attr('data-direction');
    if (typeof subItemLocation == 'undefined') subItemLocation = $(obj).closest('.pre_nav').attr('data-subitem-location');
    if (window[timeoutId]) {
      clearTimeout(window[timeoutId]);
    }
    oModuleNav.find('.NavSubMenu,.sub-nav-item-group').not(oNavSubMenu).hide();
    oModuleNav.find('.navMainItem,.main-nav-item').not($(obj).children('.navMainItem,.main-nav-item')).removeClass('navMainItemHover');
    $(obj).children('.navMainItem,.main-nav-item').addClass('navMainItemHover');
    if ($('.moduleNavFloatSubMenu').attr('submenuid') != $(obj).attr('id')) {
      $('.moduleNavFloatSubMenu').remove();
    }
    if (oNavSubMenu.children().length == 0) return;
    if (oModuleNav.is(".ModuleNavGiant") && oNavSubMenu.find(".sub-nav-item").length == 0) return;
    var navSubMenuClone = $(obj).clone(true).attr('onmouseover', null);
    var classes = oModuleItem.find(">div").attr('class');
    $(".moduleNavFloatSubMenu").remove();
    $(".sub-nav-holder").hide();
    var html = '<div id="' + oModuleItem.attr('id') + '" class="moduleNavFloatSubMenu ' + classes + '" submenuid="' + navSubMenuClone.attr('id') + '">';
    html += '<div class="ModuleNav">';
    html += '<div class="pre_nav" subHolder="' + subHolder + '">';
    html += '<div class="nav">';
    html += '<dl class="clearfix">';
    html += '</dl>';
    html += '</div>';
    html += '</div>';
    html += '</div>';
    html += '</div>';
    var floatSubMenu = $(html);
    floatSubMenu.appendTo('body');
    var originOpacity = oModuleItem.css('opacity');
    floatSubMenu.css('opacity', '1'); // 透明度不为1，会有bug。。。
    navSubMenuClone.find('.NavSubMenu,.sub-nav-item-group').css('opacity', originOpacity);
    floatSubMenu.find('dl').append(navSubMenuClone);
    floatSubMenu.find('.pre_nav').addClass($(obj).closest('.pre_nav').attr('class'));
    floatSubMenu.find('.navMainItem,.main-nav-item').remove();
    floatSubMenu.css({ position: 'static', height: 0, overflow: 'hidden' });
    floatSubMenu.on('mouseenter', function () {
      //debugger
      if (window[timeoutId]) {
        clearTimeout(window[timeoutId]);
      }
    });
    $(subHolder).mouseenter(function () {
      if (window[timeoutId]) clearTimeout(window[timeoutId]);
    }).mouseleave(function () {
      hideSubMenu(obj)
    });
    var iSubMenuMarginLeft = (floatSubMenu.find('.NavSubMenu,.sub-nav-item-group').outerWidth() - $(obj).find('.navMainItem,.main-nav-item').outerWidth()) / 2;
    var isAlignRight = false;
    if (subAlign == 'left') iSubMenuMarginLeft = 0;
    if (subAlign == 'auto') {
      if ($(obj).offset().left < (oModuleNav.offset().left + oModuleNav.width() / 2)) iSubMenuMarginLeft = 0;
      else isAlignRight = true;
    }
    // 测试中。。
    floatSubMenu.find('.NavSubMenu,.sub-nav-item-group').css({
      position: 'absolute',
      display: 'block',
      zIndex: '999999'
    });
    floatSubMenu.find('.main-nav-content').css('position', 'static');
    //全屏的子菜单背景（layout-109 专用 ）
    //$(subHolder).css({"top":($(obj).offset().top + $(obj).height()) + "px","position":"absolute","left":"0","width":"100%"}).show();
    if (direction == '1' && subItemLocation == '0') {
      floatSubMenu.find('.NavSubMenu,.sub-nav-item-group').css({
        left: $(obj).offset().left - floatSubMenu.find('.NavSubMenu,.sub-nav-item-group').outerWidth(),
        top: $(obj).offset().top,
        marginTop: $(obj).find('.navMainItem,.main-nav-item').css('margin-top')
      });
    } else if (direction == '1' && subItemLocation == '1') {
      floatSubMenu.find('.NavSubMenu,.sub-nav-item-group').css({
        position: 'absolute',
        display: 'block',
        left: $(obj).offset().left + $(obj).outerWidth(),
        top: $(obj).offset().top,
        marginTop: $(obj).find('.navMainItem,.main-nav-item').css('margin-top')
      });
    } else if (direction == '0' && subItemLocation == '0') {
      floatSubMenu.find('.NavSubMenu,.sub-nav-item-group').css({
        top: $(obj).offset().top - floatSubMenu.find('.NavSubMenu,.sub-nav-item-group').outerHeight(),
        left: $(obj).offset().left + (parseInt($(obj).css('padding-left')) || 0),
        marginLeft: -iSubMenuMarginLeft
      });
    } else {
      if (getCookie("SiteType") == "1") {
        if (false && window.isDesignMode == true) {
          var top = 0;
          var left = 0;
          var elem = $(obj)[0];
          while (elem != null && $(elem).closest('#pagebody').length > 0 && !$(elem).is('#pagebody')) {
            top += elem.offsetTop;
            left += elem.offsetLeft;
            elem = $(elem)[0].offsetParent;
          }
          floatSubMenu.find('.NavSubMenu,.sub-nav-item-group').css({
            top: top + $(obj).outerHeight(),
            left: left,
            marginLeft: -iSubMenuMarginLeft
          });
        } else {
          // 如果是居右的
          var positLeft = $(obj).find('.sub-nav-side-group').children().length > 0 ? $(obj).find('.OneRow').offset().left : $(obj).find('.sub-nav-side-group').hasClass('nav-giant-layout-112') ? $(obj).offset().left - 20 : $(obj).offset().left;
          var marLeft = $(obj).find('.sub-nav-side-group').hasClass('nav-giant-layout-112') ? 0 : -iSubMenuMarginLeft;
          if (isAlignRight && oModuleNav.hasClass('layout-109')) {
            positLeft = $(obj).find('.OneRow').offset().left;
            marLeft = 0
          }
          floatSubMenu.find('.NavSubMenu,.sub-nav-item-group').css({
            top: $(obj).offset().top + $(obj).outerHeight(),
            left: positLeft,
            marginLeft: marLeft,
            maxWidth: window.innerWidth
          });
        }
        floatSubMenu.find('.nav').show().css({ height: 0 });
      } else {
        floatSubMenu.find('.NavSubMenu,.sub-nav-item-group').css({
          top: $(obj).offset().top + $(obj).outerHeight(),
          left: $(obj).offset().left + (parseInt($(obj).css('padding-left')) || 0),
          marginLeft: -iSubMenuMarginLeft
        });

      }
    }
    if (isAlignRight && !floatSubMenu.find('.sub-nav-item-group').hasClass('nav-giant-layout-112') && !oModuleNav.hasClass('layout-109')) {
      floatSubMenu.find('.NavSubMenu,.sub-nav-item-group').css({ "left": $(obj).offset().left + $(obj).width() - floatSubMenu.find('.NavSubMenu,.sub-nav-item-group').outerWidth(true) });
    }
    //解决子菜单背景根据二级导航换行而自适应高度 by Kong 2017/8/1
    var diffHeight = 0;
    var subItemHeight = 40;
    var treeNavHeight = 13;
    if (floatSubMenu.find('.sub-nav-item').length > 0) {
      //2级菜单的高度
      diffHeight = floatSubMenu.find('.sub-nav-item:last').offset().top - floatSubMenu.find('.sub-nav-item:first').offset().top;
      subItemHeight = floatSubMenu.find('.sub-nav-item:first').outerHeight();
      //如果存在三级菜单
      if (floatSubMenu.find('.sub-nav-side-group.nav-giant-layout-112').children().length > 0) {
        var objs = floatSubMenu.find('.sub-nav-side-group');
        treeNavHeight += objs.eq(0).outerHeight();
        $.each(objs, function (idx, obj) {
          //当前这个ui的高度是否大于上一次ul的高度
          if (idx > 0) {
            if ($(obj).outerHeight() > objs.eq(idx - 1).outerHeight()) {
              treeNavHeight += $(obj).outerHeight();
            }
          }

        });
      } else {
        treeNavHeight = 0;
      }

    }

    // layout-111
    if (floatSubMenu.find('.sub-nav-item-group').hasClass('nav-giant-layout-111')) {
      // 当前菜单距右的偏移
      var navGiantOffsetRight = Math.abs($(window).width() - $(obj).offset().left);
      // 当前菜单的二级菜单的总宽度
      var navGiantWidth = floatSubMenu.find('.sub-nav-item-group.nav-giant-layout-111').children('.sub-menu-box').length *
        parseInt(floatSubMenu.find('.sub-nav-item-group.nav-giant-layout-111').children('.sub-menu-box').eq(0).css('width')) +
        parseInt(floatSubMenu.find('.sub-nav-item-group.nav-giant-layout-111').children('.sub-menu-box').eq(0).css('padding-right'));


      // 判断对齐方向
      if (oContent.css('text-align')) {
        var navGiantStyleObj = '';
        // 子菜单面板可能的最大宽度
        var navGiantContentWidth = navGiantOffsetRight;
        switch (oContent.css('text-align')) {
          // left 对齐
          case 'left':
            // 如果右边已经满了，但是左边还有空隙
            var navGiantContentStyleLeft = $(obj).offset().left
            if (navGiantContentWidth < navGiantWidth) {
              if (navGiantWidth < window.innerWidth) {
                navGiantContentStyleLeft = window.innerWidth - navGiantWidth
              } else {
                navGiantContentStyleLeft = parseInt(floatSubMenu.find('.sub-nav-item-group.nav-giant-layout-111').children('.sub-menu-box').eq(0).css('width')) / 4
              }
            }

            navGiantContentWidth += (navGiantContentStyleLeft * 6)
            navGiantStyleObj = {
              left: navGiantContentStyleLeft
            }
            break;
          // center 对齐
          case 'center':
            navGiantContentWidth += (navGiantContentStyleLeft * 6)
            navGiantStyleObj = {
              marginLeft: 0
            }
            break;
          // right 对齐
          case 'right':
            navGiantStyleObj = {
              left: '',
              right: navGiantOffsetRight - $(obj).width(),
              marginLeft: 0
            }
            navGiantContentWidth = $(obj).offset().left
            break;
        }
      }

      // 当前二级菜单个数
      var subMenuBoxItem = floatSubMenu.find('.sub-nav-item-group>.sub-menu-box').length;
      // 用于储存每个二级列表下的三级列表个数
      var threeItem = [];
      // 查找每个二级列表下的三级列表个数
      floatSubMenu.find('.sub-nav-item-group>.sub-menu-box').each(function () {
        threeItem.push($(this).find('.three-nav-item-group>p').length)
      });

      // 判断个数
      if (threeItem.length > 1) {
        // 获取三级列表数组的个数最大值
        var threeItemMAX = Math.max.apply(null, threeItem);
        // 用子菜单面板可能的最大宽度跟当前菜单的二级菜单的总宽度来判断是否满足换行
        if (navGiantContentWidth < navGiantWidth) {
          // 重置圆角
          floatSubMenu.find('.sub-nav-item-group>.sub-menu-box').eq(0).css('border-radius', '0px')
          // 循环判断是从第几个开始换行
          for (var i = 0, len = subMenuBoxItem; i < len; i++) {
            if (navGiantContentWidth < (i * floatSubMenu.find('.sub-nav-item-group.nav-giant-layout-111').children('.sub-menu-box').eq(0).width() + 25)) {
              break;
            }
          }
          // 重新设置换行后的圆角
          floatSubMenu.find('.sub-nav-item-group>.sub-menu-box').eq(i).css('border-radius', '0px 0px 0px 16px')
          // 判断是否需要补齐换行的宽度
          if ((subMenuBoxItem / 2) < i) {
            // 补全缺失的宽度
            for (var j = 0, len = (i - (subMenuBoxItem - i)); j < len; j++) {
              floatSubMenu.find('.sub-nav-item-group').append('<div class="sub-menu-box" style="height:' + (threeItemMAX * 30 + floatSubMenu.find('.sub-nav-item-group>.sub-menu-box>.sub-nav-item').eq(0).height() + 8) + 'px">&nbsp;</div>')
            }
          }
        }
      }

      floatSubMenu.find('.sub-nav-item-group').css(navGiantStyleObj)
    }
    if (floatSubMenu.find('.sub-nav-item-group').hasClass('nav-giant-layout-112')) {
      //已经放满
      if (window.innerWidth - (floatSubMenu.find('.sub-nav-item-group.nav-giant-layout-112').offset().left + floatSubMenu.find('.sub-nav-item-group.nav-giant-layout-112').outerWidth()) < 168) {
        if (window.innerWidth - (floatSubMenu.find('.nav-list').length + 1) * 168 > 0) {
          floatSubMenu.find('.sub-nav-item-group.sub-nav-item-group').css('left', window.innerWidth - (floatSubMenu.find('.nav-list').length + 1) * 168)
        } else {
          floatSubMenu.find('.sub-nav-item-group.sub-nav-item-group').css('left', 0)
        }
      } else {
        floatSubMenu.find('.sub-nav-item-group').css('left', $(obj).offset().left + 'px');
      }
      diffHeight = floatSubMenu.find('.sub-nav-item:last').offset().top - floatSubMenu.find('.sub-nav-item:first').offset().top;
    }
    $(subHolder).css({
      "top": ($(obj).offset().top + $(obj).height()) + "px",
      "position": "absolute",
      "left": "0",
      "width": "100%",
      "height": +(subItemHeight + diffHeight + treeNavHeight) + "px"
    }).show();
  }, 20);
}

function hideSubMenu(obj, evt) {
  var oModuleNav = $(obj).closest('.ModuleNav,.ModuleNavGiant');
  var oModuleItem = $(obj).closest('.ModuleItem');
  var subHolder = $(obj).closest('.pre_nav').attr('SubHolder');
  var timeoutId = "moduleNavTimeout";
  evt = evt || window.event || arguments.callee.caller.arguments[0];
  var relatedTarget = evt.relatedTarget || evt.toElement;
  if ($(relatedTarget).is('.moduleNavFloatSubMenu') || $(relatedTarget).closest('.moduleNavFloatSubMenu').length > 0) {
    return false;
  }
  if (window[timeoutId]) {
    clearTimeout(window[timeoutId]);
  }
  window[timeoutId] = setTimeout(function () {
    $('.moduleNavFloatSubMenu').remove();
    oModuleNav.find('.navMainItem').removeClass('navMainItemHover');
    //全屏的子菜单背景（layout-109 专用 ）
    $(subHolder).hide();
    $('.main-nav-item-group').removeClass('on').siblings().removeClass('on');
  }, 100);
}

function isHorizontalPad() {
  if (CanDesign != "True" && window.CanEditFront == "True") return false;
  var padscale = false;
  if (SiteType == "1" && CanDesign != "True") {
    if (navigator.userAgent.toLowerCase().indexOf("pad") > -1 || window.location.toString().indexOf("testpad") > -1 || ($(window).height() > 768 && $(window).width() > 768 && $(window).height() <= 1024 && $(window).width() <= 1024)) { //横向pad的分辨率一般都在7以上
      padscale = true;
    }
  }
  return padscale;
}

function showMobileNavFloatLayer(elem, direction) {

  var iCurNum = $('#MobileNav').attr('navnum') || 1;

  if (iCurNum == 1 || iCurNum == 5) {
    $("#pagebody").css({
      "-ms-transition": "https://www.gurki99.com/share/0.5s",
      "-webkit-transition": "https://www.gurki99.com/share/0.5s",
      "-khtml-transition": "0.5",
      "-o-transition": "https://www.gurki99.com/share/0.5s",
      "-moz-transition": "https://www.gurki99.com/share/0.5s",
      "transition": "https://www.gurki99.com/share/0.5s"
    });
    var iTranslateX = 0;
    $('#pagebody').css('left', iTranslateX);
  } else {
    $("#pagebody").css({
      "-ms-transition": "",
      "-webkit-transition": "",
      "-khtml-transition": "",
      "-o-transition": "",
      "-moz-transition": "",
      "transition": ""
    });
  }

  if (direction == 'right') {
      $('#MobileNav').toggleClass('showFloatNavright');
      $('#MobileNavRenderElem').toggleClass('showFloatNavright');
      $('#MobileNavFloatLayer').toggleClass('showFloatNavright');
      $('#pagebody').toggleClass('showFloatNavright');
      $('#MobileFootNav').toggleClass('showFloatNavright');
      $('#MobileNavMask').toggleClass('showFloatNavright');

  } else {
      $('#MobileNav').toggleClass('showFloatNav');
      $('#MobileNavRenderElem').toggleClass('showFloatNav');
      $('#MobileNavFloatLayer').toggleClass('showFloatNav');
      $('#pagebody').toggleClass('showFloatNav');
      $('#MobileFootNav').toggleClass('showFloatNav');
      $('#MobileNavMask').toggleClass('showFloatNav');
  }
}

function setMobileNav() {
  if ($('#MobileNav').length > 0) {
    var iCurNum = $('#MobileNav').attr('navnum') || 1;
    var iCurColor = $('#MobileNav').attr('navcolor') || 'black';
    var iItemType = $('#MobileNav').attr('navitemtype') || 0;
    var iEnable = $('#MobileNav').attr('enable') || 0;
    var direction = $('#MobileNav').attr('direction') || '';

    $('#MobileNav').attr('class', 'mobileNav mobileNav_' + iCurNum + ' ' + iCurColor);

    $('#MobileNavRenderElem').attr('class', 'mobileNavRenderElem mobileNavRenderElem_' + iCurNum + ' ' + iCurColor);
    $('#MobileNavFloatLayer').attr('class', 'mobileNavFloatLayer mobileNavFloatLayer_' + iCurNum + ' ' + iCurColor + ' itemType' + iItemType);



    if(direction=='right')  $('#MobileNavFloatLayer').addClass("mobileNavFloatLayer_r");
    $('#pagebody').attr('class', $('#pagebody').attr('class').replace(/(pagebody_nav(_\d+)?)|(showFloatNav)/ig, '') + ' pagebody_nav pagebody_nav_' + iCurNum);

    if ($('#MobileFootNav').length > 0) {
      $('#MobileFootNav').attr('class', $('#MobileFootNav').attr('class').replace(/(mobileFootNav(_\d+)?)|(showFloatNav)/ig, '') + ' mobileFootNav_' + iCurNum);
    }
    $('#MobileNavMask').attr('class', 'mobileNavMask mobileNavMask_' + iCurNum).off('click').on('click', function () {
      showMobileNavFloatLayer();
    }).off('touchstart').on('touchstart', function () {
      evt = window.event || evt;
      evt.preventDefault();
      showMobileNavFloatLayer();
      return false;
    })

    $('#MobileNavFloatLayer').off('click');
    $('#MobileNavFloatLayer').off('touchstart');
    $('#MobileNavFloatLayer').off('touchmove');

    // 分开写是因为pagebody scale后，会影响pagebody同级的100%高度的元素的高度
    if ($.inArray(iCurNum, ["1", "2", "5", "8"]) > -1) {
      $('#MobileNavFloatLayer').off().on('touchstart', function (evt) {
        evt = window.event || evt;
        iStartPosY = evt.targetTouches[0].pageY;
        var top = $(this).children('.itemList').css('top');
        if (top == 'auto' || top == '') top = 0;
        iMobileNavItemListStartTop = parseInt(top);
      }).on('touchmove', function (evt) {
        if ($(window).height() > $(this).children('.itemList').outerHeight()) {
          evt.preventDefault();
          return false;
        }
        evt = window.event || evt;
        evt.preventDefault();
        iEndPosY = evt.targetTouches[0].pageY;
        iSlideDistance = iEndPosY - iStartPosY;
        var iTop = iMobileNavItemListStartTop + iSlideDistance;
        if (iTop > 0) iTop = 0;
        var iHiddenHeight = $(window).height() - $(this).children('.itemList').outerHeight() - $('#MobileNavFloatLayer').position().top - parseInt($(this).children('.itemList').css('margin-top'));
        if (iTop < iHiddenHeight) iTop = iHiddenHeight;
        if (typeof (window.top.frames['pageframe']) == 'undefined') $('#MobileNavFloatLayer .itemList').css('top', iTop + "px");
        return false;
      });
    }

    if ($.inArray(iCurNum, ["2", "3", "8"]) > -1) {
      $('#MobileNavFloatLayer').css("top", $(".mobileNav").height())
    }
    if ($.inArray(iCurNum, ["1", "5"]) > -1) {
      try {
        if (typeof (window.top.frames['pageframe']) != 'undefined') $('#MobileNavFloatLayer').css("top", '0');
      } catch (ex) {
      }
    }
    if (iEnable != 1 || $.inArray(iCurNum, ["4", "6", "7"]) > -1) {
      $('#MobileNavRenderElem').hide();
    } else {
      //$('#MobileNavRenderElem').show();
    }
    if ($.inArray(iCurNum, ["4"]) > -1) {
      $('#MobileNavFloatLayer').off().on('touchstart', function (evt) {
        evt = window.event || evt;
        iStartPosY = evt.targetTouches[0].pageY;
        iMobileNavItemListStartTop = parseInt($(this).children('.itemList').css('top'));
      }).on('touchmove', function (evt) {
        if ($(this).height() > $(this).children('.itemList').outerHeight()) {
          evt.preventDefault();
          return false;
        }
        evt = window.event || evt;
        evt.preventDefault();
        iEndPosY = evt.targetTouches[0].pageY;
        iSlideDistance = iEndPosY - iStartPosY;
        var iTop = iMobileNavItemListStartTop + iSlideDistance;
        if (iTop > 0) iTop = 0;
        var iHiddenHeight = $(this).height() - $(this).children('.itemList').outerHeight();
        if (iTop < iHiddenHeight) iTop = iHiddenHeight;
        $('#MobileNavFloatLayer .itemList').css('top', iTop + "px");
        return false;
      });
    }

    if (iCurNum == 6) {
      if (typeof isDesignMode != 'undefined' && isDesignMode === true) {
        $('#MobileNavFloatLayer').on('click', function () {
          showMobileNavFloatLayer();
        })
      }

      $('#MobileNavFloatLayer').on('touchstart', function (evt) {
        evt = window.event || evt;
        var curTarget = $(evt.targetTouches[0].target);
        if (curTarget.is('.itemLink') || curTarget.is('.icon') || curTarget.is('.menuName')) {
          return true;
        }
        evt.preventDefault();
        showMobileNavFloatLayer();
        return false;
      });
    }

    if (iCurNum == 7) {
      $('#MobileNavFloatLayer').on('touchstart', function (evt) {
        evt = window.event || evt;
        iStartPosX = evt.targetTouches[0].pageX;
        iMobileNavFloatLayerItemListStartPosX = parseInt($(this).children('.itemList').css('left'));
      });

      $('#MobileNavFloatLayer').on('touchmove', function (evt) {
        evt = window.event || evt;
        if ($(this).width() > $(this).children('.itemList').outerWidth()) {
          evt.preventDefault();
          return false;
        }
        evt.preventDefault();
        iEndPosX = evt.targetTouches[0].pageX;
        iSlideDistance = iEndPosX - iStartPosX;
        var iItemListLeft = iMobileNavFloatLayerItemListStartPosX + iSlideDistance;
        if (iItemListLeft > 0) iItemListLeft = 0;
        var iHiddenWidth = $(this).width() - $(this).children('.itemList').outerWidth();
        if (iItemListLeft < iHiddenWidth) iItemListLeft = iHiddenWidth;
        $('#MobileNavFloatLayer .itemList').css('left', iItemListLeft + "px");
        return false;
      });
    } else {
      $('#MobileNavFloatLayer .itemList').css({
        width: ''
      });
    }
  }
}

function matchNavAndFootNavBgColor() {
  if ($('#MobileFootNav').attr('bgcolorrelatedtomobilenav') == 0) {
    var bgcolor = $('.ModuleMobileNavGiant #header').length > 0 ? $('.ModuleMobileNavGiant #header').css('background-color') : $('#MobileNav').css('background-color');
    if ($('#MobileFootNav .foot-nav-list').css('background-color') != bgcolor) $('#MobileFootNav .foot-nav-list').css('background-color', bgcolor);
  }

 /*  setInterval(function () {
    if ($('#MobileFootNav').attr('bgcolorrelatedtomobilenav') == 0) {
      var bgcolor = $('.ModuleMobileNavGiant #header').length > 0 ? $('.ModuleMobileNavGiant #header').css('background-color') : $('#MobileNav').css('background-color');
      if ($('#MobileFootNav .foot-nav-list').css('background-color') != bgcolor)

        $('#MobileFootNav .foot-nav-list').css('background-color', bgcolor);
    }
  }, 50); */
}

function doSomeWhanPreview() {
  if (window.location.getQueryString('view') == '1') {
    $("body").find('a').each(function (i, elm) {
      if (/^(javascript|#)/i.test($(this).attr('href'))) {
        return true;
      }

      if ($(this).prop('href').indexOf(location.protocol + "//" + location.hostname) == 0) {
        var url = $(this).attr('href');
        if (url) {
          if ($(this).hasClass("ui-tabs-anchor") == false) {
            url = url.replace(/^([^\?#]*)(\??)([^#]*)(#?)/, '$1\?$3&view=1$4');
          }
        }
        $(this).attr('href', url);
        $(this).attr('target', '_self');
      }
    });

    $('.ModuleUserLogin [registerurl]').off().on('click', function (evt) {
      var url = $(this).attr('registerUrl');
      window.location = url.indexOf("?") > -1 ? url + "&view=1" : url + "?view=1";
      evt.preventDefault();
      return false;
    });
  }
}

function doLoginWithUserNamePassword(obj) {
  obj = $(obj);
  var url = $(obj).attr('action');
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
          alert(data.msg);
          return;
        }
        if (data.msg) {
          window.location.href = decodeURIComponent(data.msg);
        }
      },
      error: function (req) {
        alert(req.responseText);
      }
    });
  }
}

function AjaxResetPassword(obj) {
  if (obj) {
    var data = $(obj).serialize() + '&act=resetpassword'
    $.ajax({
      type: "POST",
      url: $(obj).attr('action'),
      cache: false,
      beforeSend: function (XMLHttpRequest) {
        $('input[type="submit"]', $(obj)).hide();
        $('.Loading', $(obj)).show();
      },
      dataType: "json",
      data: data,
      success: function (data) {
        if (data) {
          if (!data.success) {
            $('input[type="submit"]', $(obj)).show();
          }
          $('.Loading', $(obj)).hide();
          $(".container", $(obj)).show();
          $(".errorMsg", $(obj)).html(data.msg);
        }
      },
      complete: function (XMLHttpRequest, textStatus) {
        $('input[type="submit"]', $(obj)).show();
        $('.Loading', $(obj)).hide();
      },
      error: function (XMLHttpRequest, textStatus, errorThrown) {
        $('input[type="submit"]', $(obj)).show();
        $('.Loading', $(obj)).hide();
      }
    });
  }
};

//弹出微信扫码支付的对话框
function WxScanPay(orderid) {
  if (!-[1,]) { // ie7,8不允许
    alert('很抱歉，当前浏览器不支持微信扫码支付，请升级或更换其他浏览器重试。');
    return;
  }
  $("#WxScanPayDiv").remove();
  var WxScanPayDiv = $('<div id="WxScanPayDiv" style="z-index:999999999"><iframe src="/index.php?c=front/Onlinepay&Action=WxScanPay&OrderID=' + orderid + '" width="100%" height="450"></iframe></div>');
  $("body").append(WxScanPayDiv);
  $(WxScanPayDiv).dialog({
    title: '微信支付 - Pay', modal: true, width: 500, position: 'center',
    resizable: false,
    buttons: {
      "取消": function () {
        $(this).dialog("close");
      }
    },
    close: function () {
      $("#WxScanPayDiv").remove();
    }
  });
}

// 全屏模块绝对定位100%宽度取的是屏幕的可视宽度，当设置的站点宽度超过屏幕可视宽度时候，全屏模块右侧留白，所以定时器设它门一个固定宽度
function keepFullScreenModules100Width() {
  if (getCookie("SiteType") == "1") return;
  setInterval(function () {
    $('body>.ModuleItem').each(function (i, item) {
      if (!$(this).attr('float')) $(this).css('width', $('#pagebody').width()); //非浮动模块保持全屏
    });
  }, 200);
}

function runSlide(id, pattern, time, imageready) {
  var module = $("#module_" + id);
  var mm = module.clone();
  var text = $('#txt_' + id);
  // 判断是否存在，存在则替换最新内容，不存在则添加
  if (text.length == 0) {
    var text = $("<textarea id='txt_" + id + "' style='display:none'>" + module[0].outerHTML + "</textarea>");
    $("body").append(text);
  } else {
    var text = text.val(module[0].outerHTML)
  }
  var obj = $("#myFocus" + id);
  // 以下特殊字符必须处理，防止myfocus解析错误
  obj.find('img').each(function () {
    $(this).attr('alt', ($(this).attr('alt') || '').replace(/[<>&"]/g, function (c) {
      return { '<': '&lt;', '>': '&gt;', '&': '&amp;', '"': '&quot;' }[c];
    }));
    $(this).attr('text', ($(this).attr('text') || '').replace(/[<>&"]/g, function (c) {
      return { '<': '&lt;', '>': '&gt;', '&': '&amp;', '"': '&quot;' }[c];
    }));
  });
  var readyCallback = function () {
    // 修复mF_ladyQ风格下，标题文字在第一次循环不显示的bug
    if (pattern == "mF_ladyQ") {
      module.find('.txt li').css({
        '-webkit-transition': 'none',
        '-moz-transition': 'none',
        '-o-transition': 'none'
      });
    }
  }
  if (module.css("position") != "absolute") {
    var width = module.parent().width() - parseInt(module.parent().css("padding-left")) - parseInt(module.parent().css("padding-right"));
    if (!obj.attr("hasreload")) {
      obj.find("*[name=slideImg]").each(function (i, item) {
        var src = $(item).attr("src");
        $(item).src = '';
        $(item).on("load", function () {
          if (obj.attr("hasreload")) return;
          if ($(item).height() == 0) return;
          obj.height($(item).height());
          module.height($(item).height());
          obj.width(width);
          module.width(width);
          obj.attr("hasreload", "1");
          myFocus.set({ id: "myFocus" + id, pattern: pattern, loadIMGTimeout: 0, time: time }, readyCallback);
        });
        $(item).src = src;
      });
    }
  } else {
    myFocus.set({ id: "myFocus" + id, pattern: pattern, loadIMGTimeout: 0, time: time }, readyCallback);
    var $Img = module.find('img[name=slideImg]');
    if (pattern == 'mF_slide3D') {
      $Img.attr({ 'style': null, 'width': null });
      setTimeout(function () {
        $('.mF_slide3D_wrap').css({ 'padding': 0 });
      }, 150)
    } else if (pattern == 'mF_YSlider') {
      var imgHeight = module.height();
      $Img.attr({ 'style': 'height:' + imgHeight + 'px' });
    } else if (pattern == 'mF_shutters') {
      var imgHeight = module.height();
      var imgWidth = module.width();
      $Img.attr({ 'style': 'height:' + imgHeight + 'px', 'width': imgWidth });
    }
  }
  module.attr({ "mid": id, "pattern": pattern, "time": time });
}

function runMobileSlide(moduleid) {
  $(window).load(function () {
    $('#swiper' + moduleid).width($('#module_' + moduleid).parent().width());
    $('#module_' + moduleid).resize(function () {
      $('#swiper' + moduleid).width($('#module_' + moduleid).parent().width());
      window['swiper' + moduleid].destroy(false);
      window['swiper' + moduleid] = new Swiper('#swiper' + moduleid, {
        autoplay: 3000,
        loop: true,
        pagination: '.SNum' + moduleid
      });
    });
    window['swiper' + moduleid] = new Swiper('#swiper' + moduleid, {
      autoplay: 3000,
      loop: true,
      pagination: '.SNum' + moduleid
    });
  });
}

// 调整幻灯片模块显示样式
function adjustModuleSlide(obj) {
  if (!obj) {
    var moduleSlides = $('.ModuleSlide').parent();
    for (var i = 0; i < moduleSlides.length; i++) {
      adjustModuleSlide(moduleSlides[i]);
    }
  }

  obj = $(obj);
  if (obj.children().is('.ModuleSlide') && SiteType == 0) {
    var moduleid = obj.attr('id').replace(/module_/i, '');
    var aa = $("#txt_" + moduleid);
    var mm = $(aa.val().replace("runSlide", ""));
    mm.css({
      "position": obj.css("position"),
      "left": obj.css("left"),
      "top": obj.css("top"),
      "width": obj.width() + "px",
      "height": obj.height() + "px"
    });
    var myfocusObj = mm.find('#myFocus' + moduleid);
    var moduleHead = mm.find('.ModuleHead').get(0);
    var moduleHeadHeight = moduleHead ? mm.find('.ModuleHead').get(0).offsetHeight : 0;
    myfocusObj.height(mm.height() - moduleHeadHeight);
    myfocusObj.width(mm.width());
    $(obj).replaceWith(mm);
    var id = obj.attr("mid");
    var pattern = obj.attr("pattern");
    var time = obj.attr("time");
    runSlide(id, pattern, time);
  }
}

//显示产品、文章等子分类
function setModuleCls(obj) {
  var strCls = ".ModuleProductCls,.ModuleNewsCls,.ModuleDownCls,.ModuleNewsClsV2,.ModuleProductClsV2";
  if (!obj) {
    var moduleCls = $(strCls);
    for (var i = 0; i < moduleCls.length; i++) {
      setModuleCls(moduleCls[i]);
    }
  }
  obj = $(obj);
  var showStyle = obj.find("[class*=ModuleClsShowStyle]").attr('showstyle');
  if (showStyle == 0) {
    var hidesubTimer = new Object();
    obj.find(".SHOWSUB>li").mouseover(function () {
      var moduleid = $(this).closest('.ModuleItem').attr("id").replace('module_', '');
      var id = 'subclass' + $(this).children("ul").attr("id");
      var obj = $(this).get(0);
      var type = '';
      var moduleClasses = $(this).closest(strCls).attr('class').split(/\s+/);
      var clsClasses = strCls.split(',');
      for (var i = 0; i < moduleClasses.length; i++) {
        for (var j = 0; j < clsClasses.length; j++) {
          if (clsClasses[j].replace(/\s|\./g, '') == moduleClasses[i]) {
            type = moduleClasses[i];
            break;
          }
        }
        if (type) break;
      }
      $(obj).removeClass("SubMaskColor");
      $(obj).removeClass("SubMaskBorder1");
      $("#mask" + id).remove();
      $("#" + id).remove();
      if (!$(this).children("ul").html()) return;
      var obj = $(this).get(0);
      var p = $("<div id='" + id + "' class='SubMask SubMask" + type + " SubMaskColor SubClassIn" + moduleid + "' style='position:absolute;display:none'></div>");
      p.append($(this).children("ul").clone());
      p.children("ul").css("display", "block");
      p.off().mouseenter(function () {
        clearTimeout(hidesubTimer[id]);
      }).mouseleave(function () {
        $("#" + id).remove();
        $("#mask" + id).remove();
        $(obj).removeClass("SubMaskColor");
        $(obj).removeClass("SubMaskBorder1");
      });
      $("body").append(p);
      var zindex = parseInt($(this).css("z-index"));
      if (isNaN(zindex)) zindex = 0;
      $("body").append("<div id='mask" + id + "' class='SubMaskColor SubClassMaskIn" + moduleid + "' style='width:0px;height:" + $(this).height() + "px;position:absolute;'></div>");
      $(this).addClass("SubMaskColor");
      $(this).addClass("SubMaskBorder1");
      var borderwidth = parseInt($("#" + id).css("border-top-width"));
      if (isNaN(borderwidth)) borderwidth = 0;
      var func = function () {
        $("#" + id).css({
          "display": "block",
          "top": $(obj).offset().top,
          "left": ($(obj).offset().left + $(obj).width())
        });
        $("#mask" + id).css({
          "top": $(obj).offset().top + borderwidth,
          "left": ($(obj).offset().left + $(obj).width() - 3)
        });
      };
      func();
      setTimeout(func, 50); //因为如果从一个分类快速切换到另一个分类，原分类会延时50ms才会消失，这时如果原分类有border，会占了几个像素的高度，会导致后面的分类位置计算不准，这里延时50ms重新计算一下解决了这个问题
    }).mouseleave(function () {
      $(this).children("ul").hide();
      var id = 'subclass' + $(this).children("ul").attr("id");
      var obj = $(this).get(0);
      hidesubTimer[id] = setTimeout(function () {
        $(obj).removeClass("SubMaskColor");
        $(obj).removeClass("SubMaskBorder1");
        $("#mask" + id).remove();
        $("#" + id).remove();
      }, 50);
    });
  } else if (showStyle == 3) {
    obj.find('.MainClassItem:last-child').css({
      borderBottom: '0px'
    });
  } else if (showStyle == 7) {
    obj.find('.clsAllList > .clsItem').off().on('mouseenter', function () {
      var moduleItem = $(this).closest('.ModuleItem');
      var moduleid = moduleItem.attr('id');
      moduleid = moduleid.replace('module_', '');
      var floatElem = $('<div id="ModuleClsShowStyle7_floatElem' + moduleid + '" class="ModuleClsShowStyle7 ModuleClsShowStyle7_floatElem" relatedmoduleid=' + moduleid + '></div>').append('<div class="clsAllList"></div>');
      floatElem.children('.clsAllList').append($(this).find('.clsItemList').clone());
      $('body').append(floatElem);
      $('body').append('<div id="ModuleProductClsStyle7_Mask' + moduleid + '" class="ModuleProductClsStyle7_Mask" relatedmoduleid=' + moduleid + '></div>');
      var moduleZIndex = parseFloat(moduleItem.css('z-index'));
      if (isNaN(moduleZIndex)) moduleZIndex = 0;
      moduleZIndex++;
      moduleZIndex = 9999;
      var floatElemMinHeight = moduleItem.find('.clsAllList').height();
      moduleItem.find('.clsAllList > .clsItem').removeClass('hover');
      $(this).addClass('hover');
      floatElem.css({
        position: 'absolute',
        top: getElementTopWithBorder(moduleItem[0]),
        left: getElementLeftWithBorder(moduleItem[0]) + moduleItem.outerWidth(false),
        zIndex: moduleZIndex
      });
      floatElem.find('.clsItemList').css({
        position: 'static',
        minHeight: floatElemMinHeight
      }).show();
      $('.ModuleProductClsStyle7_Mask').css({
        position: 'absolute',
        left: Math.ceil((getElementLeftWithBorder(this) + $(this).width()).toFixed(2)) * 100 / 100 - 1,
        top: getElementTopWithBorder(this),
        zIndex: moduleZIndex,
        width: parseFloat(moduleItem.find('.clsAllList').css('border-right-width')) + parseFloat(moduleItem.css('border-right-width')) + parseFloat(floatElem.find('.clsAllList').css('border-left-width')) + 1,
        height: parseFloat(moduleItem.find('.clsItem').height())
      });
      $('.ModuleClsShowStyle7_floatElem').off().on('mouseleave', function (evt) {
        $('.ModuleClsShowStyle7_floatElem').remove();
        $('.ModuleProductClsStyle7_Mask').remove();
        $('#module_' + $(this).attr('relatedmoduleid')).find('.clsAllList > .clsItem').removeClass('hover');
      });
      $('.ModuleProductClsStyle7_Mask').off().on('mouseleave', function (evt) {
        var relatedTarget = evt.toElement || evt.relatedTarget;
        if (!$(relatedTarget).closest('.ModuleClsShowStyle7').hasClass('ModuleClsShowStyle7_floatElem')
          && !$(relatedTarget).hasClass('ModuleProductClsStyle7_Mask')) {
          $('.ModuleClsShowStyle7_floatElem').remove();
          $('.ModuleProductClsStyle7_Mask').remove();
          $('#module_' + $(this).attr('relatedmoduleid')).find('.clsAllList > .clsItem').removeClass('hover');
        }
      });
    }).on('mouseleave', function (evt) {
      var relatedTarget = evt.toElement || evt.relatedTarget;
      if (!$(relatedTarget).closest('.ModuleClsShowStyle7').hasClass('ModuleClsShowStyle7_floatElem')
        && !$(relatedTarget).hasClass('ModuleProductClsStyle7_Mask')) {
        $('.ModuleClsShowStyle7_floatElem').remove();
        $('.ModuleProductClsStyle7_Mask').remove();
        $(this).removeClass('hover');
      }
    });
  }
}

/**
 * 克隆元素样式
 * @author tang bin
 * @version 0.1
 * @see http://www.planeart.cn/?p=1499
 * @param {HTMLElement} 被克隆的元素
 * @param {Boolean} 是否启用缓存（默认true）
 * @return {String} css类名
 */
var cloneStyle = (function (doc) {
  var rstyle = /^(number|string)$/,
    cloneName = '${cloneName}',
    sData = {},
    addHeadStyle = function (content) {
      var style = sData[doc];
      if (!style) {
        style = sData[doc] = doc.createElement('style');
        doc.getElementsByTagName('head')[0].appendChild(style);
      }
      ;
      style.styleSheet && (style.styleSheet.cssText += content) || style.appendChild(doc.createTextNode(content));
    },
    getStyle = 'getComputedStyle' in window ? function (elem, name) {
      return getComputedStyle(elem, null)[name];
    } : function (elem, name) {
      return elem.currentStyle[name];
    };

  return function (source, cache) {
    if (!cache && source[cloneName]) return source[cloneName];
    var className, name,
      cssText = [],
      sStyle = source.style;
    for (name in sStyle) {
      var val = getStyle(source, name);
      if (val !== '' && rstyle.test(typeof val)) {
        name = name.replace(/([A-Z])/g, "-$1").toLowerCase();
        cssText.push(name);
        cssText.push(':');
        cssText.push(val);
        cssText.push(';');
      }
      ;
    }
    ;
    cssText = cssText.join('');
    source[cloneName] = className = 'clone' + (new Date).getTime();
    addHeadStyle('.' + className + '{' + cssText + '}');
    return className;
  };
}(document));

function runAllAnimate(list) {
  if (!list) list = $(".ModuleItem");
  $(list).each(function (i, item) {
    var html = $(item)[0].outerHTML;
    var animatename = $(item).attr("animate");
    if (!animatename) {
      var match = html.match(/wow\s+([a-z]+)/gi);
      if (match) {
        animatename = match[0].replace(/wow\s+/, '');
      }
    }
    if (animatename) {
      if (html.indexOf("ModuleFullSwitch") > -1) return;
      $(item).removeClass(animatename);
      var duration = $(item).attr("data-wow-duration");
      var delay = $(item).attr("data-wow-delay");
      var animate = { "animation-name": animatename };
      if (duration) animate["animation-duration"] = duration;
      if (delay) animate["animation-delay"] = delay;
      $(item).css({ "animation-name": 'aaa' });
      setTimeout(function () {
        $(item).css({ "animation-name": animatename, "animation-duration": duration, "animation-delay": delay });
      }, 10);
      $(item).attr("animate", animatename);
    }
  });
}

// pc相册
function adjustModuleSiteGallery(moduleID) {
  // TODO box-sizing: content-box 计算margin
  var iSingleItemWidth = $("#module_" + moduleID + " .imgItem").outerWidth();
  var iModuleWidth = $("#module_" + moduleID).width();
  var iModuleHeight = $("#module_" + moduleID).height();
  var iColCount = Math.floor(iModuleWidth / iSingleItemWidth);
  var iTotalCount = $("#module_" + moduleID + " .imgItem").length;

  $("#module_" + moduleID + " .imgItem").each(function (i) {
    if (i % iColCount == 0) {
      $(this).css({ marginLeft: 0 });
    } else if (i % iColCount == iColCount - 1) {
      $(this).css({ marginRight: 0 });
    }
    if (i < iColCount) {
      $(this).css({ marginTop: 0 });
    } else if (i > iTotalCount - iColCount) {
      $(this).css({ marginBottom: 0 });
    }
  });
}

// 初始化pc相册
function setModuleSiteGallery(obj) {
  var defaults = {
    padding: 0,
    prevEffect: 'fade',
    nextEffect: 'fade',
    viewDetails: '查看详情',
    closeBtn: true,
    openOpacity: true,
    helpers: {
      overlay: {
        css: { 'background': 'rgba(0,0,0, 0.9)' },
        closeClick: false
      },
      title: { type: 'outside' },
      //buttons: {},
      thumbs: {
        width: 50,
        height: 50,
        position: 'bottom'
      }
    },
    modal: false,
    tpl: {
      next: '<a title="' + obj.btnNextText + '" class="fancybox-nav fancybox-next" href="javascript:;"><span></span></a>',
      prev: '<a title="' + obj.btnPreviousText + '" class="fancybox-nav fancybox-prev" href="javascript:;"><span></span></a>'
    },
    beforeLoad: function () {
      if (this.element) {
        var oImg = $(this.element).children('img');
        var sLink = '';
        if (oImg.attr('redirectUrl') + '' != '') {
          sLink = '<a href="' + oImg.attr('redirectUrl') + '" class="redirectUrl">' + obj.viewDetails + '</a>';
        }
        this.title = oImg.attr('alt') + sLink;
      } else {
        var sLink = '';
        if (this.url) {
          sLink = '<a href="' + this.url + '" class="redirectUrl">' + obj.viewDetails + '</a>';
        }
        this.title = this.title + sLink;
      }
    },
    afterShow: function () {
      if ($('.fancybox-overlay>.fancybox-prev').length == 0) {
        $('.fancybox-outer>.fancybox-prev').appendTo('.fancybox-overlay');
      } else {
        $('.fancybox-outer>.fancybox-prev').remove();
      }
      if ($('.fancybox-overlay>.fancybox-next').length == 0) {
        $('.fancybox-outer>.fancybox-next').appendTo('.fancybox-overlay');
      } else {
        $('.fancybox-outer>.fancybox-next').remove();
      }
      if ($('.fancybox-overlay>.fancybox-close').length == 0) {
        $('.fancybox-skin>.fancybox-close').appendTo('.fancybox-overlay').css({
          right: "0px",
          top: "0px"
        });
      } else {
        $('.fancybox-skin>.fancybox-close').remove();
      }

      //更新前一张和下一张的遮盖高度，不遮住下面的超链接
      var fancyboxInner = $(".fancybox-inner").eq(0);
      var fancyboxWrap = $(".fancybox-wrap").eq(0);
      if (fancyboxInner && fancyboxWrap) {
        var top = parseInt(fancyboxWrap.css("top").replace("px", ""));
        var height = fancyboxInner.height();
        $(".fancybox-next").css("height", height + top);
        $(".fancybox-prev").css("height", height + top);
      }
    }
  }

  if (obj.effectID != 0) delete defaults.helpers.thumbs;
  $("#module_" + obj.moduleID + " .imgBox img").css('position', 'relative');
  if (obj.isExpandDir == 0) {
    $("#module_" + obj.moduleID + " .imgBox").off().click(function () {
      $.fancybox.open(obj.galleryItems[$("#module_" + obj.moduleID + " .imgBox").index(this) + 1], defaults);
      return false;
    });
  } else {
    $("#module_" + obj.moduleID + " .imgBox").off().click(function () {
      var items = obj.galleryItems[1] || [];
      for (var i = 0; i < items.length; i++) {
        if (($(this).prop('href') + '').replace(/\?.*$/, '').indexOf((items[i].href + '').replace(/\?.*$/, '')) > -1) {
          break;
        }
      }
      var opts = $.extend({}, defaults);
      opts.index = i;
      $.fancybox.open(obj.galleryItems[1], opts);
      return false;

    });
  }

  $("#module_" + obj.moduleID + " .imgBox img").each(function () {
    var sSrc = $(this).attr('src');
    $(this).attr('src', '');
    $(this).off('load').on('load', function () {
      $(this).attr('originWidth', $(this).parent().width());
      $(this).attr('originHeight', $(this).parent().height());
    });
    $(this).attr('src', sSrc);
  });

  $("#module_" + obj.moduleID + " .imgBox img").off('mouseover').on('mouseover', function () {
    var oZoomImage = $(this);
    var iOriginWidth = oZoomImage.attr('originWidth') || $(this).parent().width();
    var iOriginHeight = oZoomImage.attr('originHeight') || $(this).parent().height();
    var iZoomPx = 50;
    oZoomImage.stop().animate({
      left: -iZoomPx / 2 + 'px',
      top: -iZoomPx / 2 + 'px',
      width: parseInt(iOriginWidth) + iZoomPx + 'px',
      height: parseInt(iOriginHeight) + iZoomPx + 'px'
    }, 600);

    $('.imgMask').remove();
    var iLeft = parseFloat($(this).closest('.imgItem').css('padding-left'));
    var iTop = parseFloat($(this).closest('.imgItem').css('padding-top'));

    $('<div class="imgMask"><img class="zoomIcon" src="../images/zoom.png"/*tpa=https://www.gurki99.com/images/zoom.png*//></div>').css({
      left: iLeft + 'px',
      top: iTop + 'px',
      width: iOriginWidth + 'px',
      height: iOriginHeight + 'px'
    }).insertAfter(this).off().on('mouseleave', function () {
      var oZoomImage = $(this).closest('.imgItem').find('.imgBox img');
      var iOriginWidth = oZoomImage.attr('originWidth');
      var iOriginHeight = oZoomImage.attr('originHeight');
      oZoomImage.stop().animate({
        left: '0',
        top: '0',
        width: iOriginWidth + 'px',
        height: iOriginHeight + 'px'
      }, 600);
      $('.imgMask').remove();
    }).on('click', function () {
    })
  });
}

function setMobileModuleSiteGallery(obj) {
  if (obj.isExpandDir == 0) {
    $("#module_" + obj.moduleID + " .grid-cont").off().click(function () {
      $(this).lightGallery({
        dynamic: true,
        thumbnail: true,
        dynamicEl: obj.galleryItems[$("#module_" + obj.moduleID + " .grid-cont").index(this) + 1]
      });
      return false;
    });
  }
}

// 初始化音乐模块
function initModuleMusic(opts) {
  var bgMusicFilePath = opts.bgMusicFilePath;
  var moduleid = opts.moduleid;
  var siteType = opts.siteType;
  var isAutoPlay = opts.isAutoPlay;
  var isLoop = opts.isLoop;
  var canPlay = opts.canPlay;

  if (canPlay) {
    var ua = navigator.userAgent.toLowerCase();
    var elem = $('#module_' + moduleid);
    if (siteType == 0) {
      if (ua.match(/msie ([\d.]+)/)) {
        $(elem).find('#music' + moduleid).html('<object classid="clsid:22D6F312-B0F6-11D0-94AB-0080C74C7E95" style="display:none;"><param name="AutoStart" value="' + (isAutoPlay ? '1' : '0') + '" /><param name="Src" value="' + bgMusicFilePath + '" /><param name="hidden" value="true" /><param name="loop" value="' + (isLoop ? 'true' : 'false') + '" /><param name="ShowControls" value="false" /></object>');
      } else if (ua.match(/firefox\/([\d.]+)/)) {
        $(elem).find('#music' + moduleid).html('<audio src="' + bgMusicFilePath + '" ' + (isAutoPlay ? 'autoplay="true"' : '') + ' ' + (isLoop ? 'loop="true"' : '') + ' hidden="true"></audio>');
      } else if (ua.match(/chrome\/([\d.]+)/)) {
        $(elem).find('#music' + moduleid).html('<audio src="' + bgMusicFilePath + '" ' + (isAutoPlay ? 'autoplay="true"' : '') + ' ' + (isLoop ? 'loop="true"' : '') + ' hidden="true"></audio>');
      } else if (ua.match(/opera.([\d.]+)/)) {
        $(elem).find('#music' + moduleid).html('<embed src="' + bgMusicFilePath + '" ' + (isAutoPlay ? 'autostart="true"' : 'autostart="false"') + ' ' + (isLoop ? 'loop="true"' : '') + ' hidden="true"><noembed><bgsounds src="' + bgMusicFilePath + '"></noembed>');
      } else if (ua.match(/version\/([\d.]+).*safari/)) {
        $(elem).find('#music' + moduleid).html('<audio src="' + bgMusicFilePath + '" ' + (isAutoPlay ? 'autoplay="true"' : '') + ' ' + (isLoop ? 'loop="true"' : '') + ' hidden="true"></audio>');
      } else {
        $(elem).find('#music' + moduleid).html('<embed src="' + bgMusicFilePath + '" ' + (isAutoPlay ? 'autostart="true"' : 'autostart="false"') + ' ' + (isLoop ? 'loop="true"' : '') + ' hidden="true" mastersound></embed>');
      }
    } else {
      $(elem).find('#music' + moduleid).html('<audio src="' + bgMusicFilePath + '" ' + (isAutoPlay ? 'autoplay="true"' : '') + ' ' + (isLoop ? 'loop="true"' : '') + ' hidden="true"></audio>');
    }

    if (/(iphone)|(ipad)/i.test(ua)) {
      function forceSafariPlayAudio() {
        audioEl.load(); // iOS 9   还需要额外的 load 一下, 否则直接 play 无效
        audioEl.play(); // iOS 7/8 仅需要 play 一下
      }

      var audioEl = $('#music' + moduleid).find('audio')[0];
      audioEl.addEventListener('play', function () {
        // 当 audio 能够播放后, 移除这个事件
        window.removeEventListener('touchstart', forceSafariPlayAudio, false);
      }, false);

      // 由于 iOS Safari 限制不允许 audio autoplay, 必须用户主动交互(例如 click)后才能播放 audio,
      // 因此我们通过一个用户交互事件来主动 play 一下 audio.
      window.addEventListener('touchstart', forceSafariPlayAudio, false);

      audioEl.src = bgMusicFilePath;
    }
  }

  function setMusicImg(moduleid, isPlaying) {
    var musicImg = $('#musicPic' + moduleid).find('img');
    if (isPlaying) {
      musicImg.attr('src', musicImg.attr('playing_src')).addClass('playing');
    } else {
      musicImg.attr('src', musicImg.attr('_src')).removeClass('playing');
    }
  }

  setMusicImg(moduleid, isAutoPlay);

  $('#musicPic' + moduleid).off().on('click', function () {
    var audioEl = $('#music' + moduleid).find('audio')[0];
    if (audioEl) {
      if (audioEl.paused) {
        audioEl.play();
        setMusicImg(moduleid, true);
      } else {
        audioEl.pause();
        setMusicImg(moduleid, false);
      }
    }
    audioEl = $('#music' + moduleid).find('embed')[0];
    if (audioEl) {
      if (audioEl.playState == 2) {
        audioEl.pause();
        setMusicImg(moduleid, false);
      } else {
        audioEl.play();
        setMusicImg(moduleid, true);
      }
    }
    audioEl = $('#music' + moduleid).find('object')[0];
    if (audioEl) {
      if (audioEl.PlayState == 2) {
        audioEl.Pause();
        setMusicImg(moduleid, false);
      } else {
        audioEl.Play();
        setMusicImg(moduleid, true);
      }
    }
  });
}

// 初始化标签页模块
function initModuleTabContainer(moduleID, showStyle, layout, tabSwitch, CanDesign, isSuspend) {
  if ((CanDesign == 1 && isSuspend == 1 && $.inArray(layout, ['103', '106', '110']) > -1)) {
    setTimeout(function () {
      for (var key in window) {
        if (key.indexOf('initSwiperFunc') > -1) {
          if ($('#tab_content_clone_module_' + moduleID).length > 0) {
            var fn = window[key];
            $('#tab_content_clone_module_' + moduleID).queue(function () {
              fn()
              $(this).dequeue()
            })
          }
        }
      }
    }, 3000)
  }
  //layout仅仅用于标签模块，其他模块没必要的话勿抄
  //有swiper组件的都要在初始化模块的时候讲模块名称增加"Swiper",以下为例子
  //其余正常例子只需要initFunc
  //*注:因为swper轮播组件初始化的时候回判断元素是否被隐藏,如果被隐藏泽不会被初始化成功
  //swper模块必须注册该事件
  //如果有swiper隐藏的模块,记得注册该事件
  var tabSwitchEvent = {
    "click.updateSwiper": (tabSwitch == 'click' || layout == '109') || (CanDesign == 1 && isSuspend == 1 && $.inArray(layout, ['103', '106', '110']) > -1) ? function () {
      if ($(this).hasClass('active')) {
        return
      }
      solvePluginEvent(this, tabSwitch);
    } : function () {
      return
    },
    // 并且不是编辑模式不是悬浮编辑
    "mouseover.updateSwiper": (tabSwitch == 'hover' || layout != '109' || (isSuspend == 1 && CanDesign != 1 && $.inArray(layout, ['103', '106', '110']) > -1)) ? function () {
      if ($(this).hasClass('active')) {
        return
      }
      solvePluginEvent(this, tabSwitch);
    } : function () {
      return
    }
  }
  $("#module_" + moduleID + " .Nav-Container>li, #module_" + moduleID + " .TabConOption,#module_" + moduleID + " .Nav-Container .nav>li").off('click.updateSwiper mouseover.updateSwiper').on(tabSwitchEvent);
  var solvePluginEvent = function (e, tabSwitch) {
    for (var key in window) {
      if (key.substr(0, 14) == 'initSwiperFunc' || key.substr(0, 11) == 'initMapFunc') {
        var mid = key.replace(/[^0-9]/g, '');
        // 横向排列的标签
        var tabIndex = $(e).index()
        if ($('#tab_content_clone_module_' + moduleID).length > 0 && $('#tab_content_clone_module_' + moduleID + ' .tab-pane').eq(tabIndex).find("#module_" + mid).length > 0) {
          var fn = window[key]
          $('#tab_content_clone_module_' + moduleID).queue(function () {
            fn()
            $(this).dequeue()
          })
        }
        if ($("#module_" + moduleID + " .tab-pane").eq(tabIndex).find("#module_" + mid).length > 0) {
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
  //layout仅仅用于标签模块，其他模块没必要的话勿抄
  if (parseInt(layout) == 107 || parseInt(layout) == 108 || parseInt(layout) == 109) {
    return;
  }
  if (showStyle == 0) {
    var module = $('#module_' + moduleID);
    if (module.length == 0) return;
    $('.btnScrollRight', module).off('click.linkClick').on('click.linkClick', function () {
      var targetElem = null;
      // 需要去掉内边框
      var oldscrollLeft = $('.nav', module).scrollLeft() - $('.Nav-Container', module).outerWidth() + $('.Nav-Container', module).innerWidth();
      $('.nav', module).children('li').each(function (index) {
        // 获取最大值
        var leftEdgeLeft = -$(this).position().left;
        if (oldscrollLeft <= leftEdgeLeft && $('.nav', module).width() + leftEdgeLeft < getNavRealWidth()) {
          targetElem = $(this);
          return false;
        } else {
          $('.btnScrollRight', module).css('color', 'rgb(204, 204, 204)')
        }
      });
      if (targetElem) {
        var scrollLeft2 = $('.nav', module).scrollLeft() + targetElem.outerWidth(true);
        $('.nav', module).stop().animate({ 'scrollLeft': scrollLeft2, 'margin-right': 0 }, 300, function () {
          var nextObj = $(this).find('li.active').next();
          if (nextObj.length > 0) {
            $(this).find('li.active').removeClass('active');
            nextObj.addClass('active');
            module.find('.tabContentGiant .tabContainerGiantGrid').removeClass('active')
            module.find('.tabContentGiant .tabContainerGiantGrid' + nextObj.find('.OneRow').attr('data-href-id')).addClass('active')
            solvePluginEvent(nextObj, tabSwitch);
          }
        });
      } else {
        var nextObj = $(this).parent().find('.nav li.active').next();
        if (nextObj.length > 0) {
          $(this).parent().find('.nav li.active').removeClass('active');
          nextObj.addClass('active');
          module.find('.tabContentGiant .tabContainerGiantGrid').removeClass('active')
          module.find('.tabContentGiant .tabContainerGiantGrid' + nextObj.find('.OneRow').attr('data-href-id')).addClass('active')
          solvePluginEvent(nextObj, tabSwitch);
        }
      }
    });

    $('.btnScrollLeft', module).on('click', function () {
      var targetElem = null;
      $('.nav', module).children('li').each(function (i) {
        if ($(this).position().left + $(this).outerWidth(true) >= 0) {
          targetElem = $(this);
          return false;
        }
      });
      if (targetElem) {
        var scrollLeft = $('.nav', module).scrollLeft() + targetElem.position().left;
        $('.nav', module).stop().animate({ 'scrollLeft': scrollLeft, 'margin-right': 0 }, 300, function () {
          var prevObj = $(this).find('li.active').prev();
          if (prevObj.length > 0) {
            $(this).find('li.active').removeClass('active');
            prevObj.addClass('active');
            module.find('.tabContentGiant .tabContainerGiantGrid').removeClass('active')
            module.find('.tabContentGiant .tabContainerGiantGrid' + prevObj.find('.OneRow').attr('data-href-id')).addClass('active')
            solvePluginEvent(prevObj, tabSwitch);
          }
        });
      }
    });
    $('.nav', module).scroll(function () {
      setButtonDisabled(this)
    });

    function getNavRealWidth() {
      var width = 0;
      $('.nav>li', module).each(function () {
        width += $(this).outerWidth(true);
      });
      return width;
    }

    function setButtonDisabled(evet) {
      var scrollLeft = $(evet).scrollLeft()
      if ($('.nav', module).scrollLeft() == 0) {
        $('.btnScrollLeft', module).css('color', '#ccc');
      } else {
        $('.btnScrollLeft', module).css('color', '');
      }
      if ($(evet).width() + scrollLeft >= $(evet)[0].scrollWidth) {
        $('.btnScrollRight', module).css('color', 'rgb(204, 204, 204)')
      } else {
        $('.btnScrollRight', module).css('color', '');
      }
    }

    function setPanelBtnScroll() {
      var navRealWidth = getNavRealWidth();
      if (isMobileBroswer()) {
        $('.nav', module).css('overflow', 'auto');
      }
      if (!isMobileBroswer() && navRealWidth > $('.nav', module).width()) {
        $('.btnScrollLeft', module).show();
        $('.btnScrollRight', module).show();
      } else if (isMobileBroswer() && navRealWidth > $('.nav', module).width()) {
        $('.btnScrollLeft', module).show();
        $('.btnScrollRight', module).show();
      } else {
        $('.btnScrollLeft', module).hide();
        $('.btnScrollRight', module).hide();
      }
      $('.panelBtnScroll').css({
        'height': $('.nav', module).outerHeight(),
        'padding-top': ($('.nav', module).outerHeight() - $('.panelBtnScroll>:first-child', module).outerHeight()) / 2
      });
      /*如果是新的标签模块；左右的按钮重新定位（基于按钮居中）*/
      if (module.find('.ModuleTabContainerGiant').length > 0) {
        var pdtp = Number($('.Nav-Container li', module).css('margin-top').replace(/px/, '')) + $('.Nav-Container li', module).outerHeight() / 2 - 11;
        module.find('.panelBtnScroll').css({
          'padding-top': pdtp
        })
      }
    }

    setPanelBtnScroll();
    $(window).off('resize.tabContainer' + moduleID).on('resize.tabContainer' + moduleID, function () {
      setPanelBtnScroll();
    });
    $('https://www.gurki99.com/share/.panelBtnScroll, .nav', module).disableSelection();
  }
}

// 重调全屏幻灯片模块
function adjustModuleFullSlide(moduleid) {
  moduleid = (moduleid + '').replace(/^module_/i, '');
  var data = $('#module_' + moduleid).find('#Full' + moduleid).data('params');
  if (data) {
    var height = $('#module_' + moduleid).height();
    CoolSlide('#Full' + moduleid, height, data.effect, data.time, data.imgshowtype);
  }
}

// 产品详情二维码控制
function initProductDetailQrcode(qrcodeText) {
  var moduleProductDetailQrcodeTimeoutId = "moduleProductDetailQrcode";
  $(".icon-qrcode").on("mouseenter click", function () {
    if (window[moduleProductDetailQrcodeTimeoutId]) {
      clearTimeout(window[moduleProductDetailQrcodeTimeoutId]);
    }
    $("#divQrcode").remove();
    var html = "<div id='divQrcode' style='z-index:9999;padding:5px;border:1px solid #cccccc;background:white;position:absolute;'>";
    html += "<div id='pro-qrcode' style='width:140px;height:140px;'></div><div style='margin:2px;text-align:center;padding:5px;font-weight:bold;'>" + qrcodeText + "</div>";
    html += "</div>";
    $("body").append(html);
    $('#pro-qrcode').qrcode({ text: location.href.replace(/(\?|#).*$/, ''), width: 140, height: 140 });
    $("#divQrcode").css({ top: $(this).offset().top + 30, left: $(this).offset().left - $('#divQrcode').width() + 30 });
    $('#divQrcode').off('mouseenter').on('mouseenter', function () {
      if (window[moduleProductDetailQrcodeTimeoutId]) {
        clearTimeout(window[moduleProductDetailQrcodeTimeoutId]);
      }
    });
    $(".icon-qrcode, #divQrcode").off("mouseleave").on("mouseleave", function (evt) {
      evt = evt || window.event;
      var relatedTarget = evt.relatedTarget || evt.toElement;
      if ($(relatedTarget).is('.icon-qrcode, #divQrcode') || $(relatedTarget).closest('.icon-qrcode, #divQrcode').length > 0) {
        return false;
      }
      if (window[moduleProductDetailQrcodeTimeoutId]) {
        clearTimeout(window[moduleProductDetailQrcodeTimeoutId]);
      }
      window[moduleProductDetailQrcodeTimeoutId] = setTimeout(function () {
        $("#divQrcode").remove();
      }, 300);
    });
  });
}

//点击发送短信验证码
var InterValObj; //timer变量，控制时间
var count = 60; //间隔函数，1秒执行
var curCount;//当前剩余秒数

function sendMessage(ModuleID) {
  var mobile = $('#resetMobile' + ModuleID).val();
  var mobilereg = /^1[3|4|5|7|8]\d{9}$/;
  if (!mobilereg.test(mobile)) {
    alert('请输入有效的手机号码！');
    return false;
  }
  curCount = count;
  //设置button效果，开始计时
  $("#btnSendCode" + ModuleID).attr("disabled", "true");
  $("#btnSendCode" + ModuleID).text("请在" + curCount + "秒内输入验证码");
  InterValObj = window.setInterval(function () {
    SetRemainTime(ModuleID);
  }, 1000); //启动计时器，1秒执行一次
  //向后台发送处理数据
  $.ajax({
    type: "POST", //用POST方式传输
    dataType: "JSON", //数据格式:JSON
    url: 'https://www.gurki99.com/index.php?c=Front/Userlogin&a=getcode', //目标地址
    data: { mobile: mobile },
    error: function (XMLHttpRequest, textStatus, errorThrown) {
    },
    success: function (data) {
      if (data.success) {
        alert(data.msg);
      }
      if (!data.success) {
        alert(data.msg);
      }
    }
  });
}

//timer处理函数
function SetRemainTime(ModuleID) {
  if (curCount == 0) {
    window.clearInterval(InterValObj);//停止计时器
    $("#btnSendCode" + ModuleID).removeAttr("disabled");//启用按钮
    $("#btnSendCode" + ModuleID).text("重新发送验证码");
  }
  else {
    curCount--;
    $("#btnSendCode" + ModuleID).text("请在" + curCount + "秒内输入验证码");
  }
}

//将url中的querystring转为对象
function getQueryParam() {
  if (!document.location.search) return null;
  var URLParams = new Object();
  var aParams = document.location.search.substr(1).split('&');
  for (i = 0; i < aParams.length; i++) {
    var aParam = aParams[i].split('=');
    var value = aParam[1];
    if (value && value.indexOf("#") > -1) value = value.substring(0, value.indexOf("#"));
    URLParams[aParam[0]] = decodeURIComponent(value);
  }
  return URLParams;
}

//替换指定的模块
window.replaceModules = {};

function replaceModule(moduleid) {
  if (window.replaceModules['moduleid'] || moduleid == 0 || moduleid == 'module_0') return;
  var params = getQueryParam();
  var str = '';
  for (key in params) {
    if (key != 'c' && key != 'moduleId') str += "&" + key + "=" + escape(params[key]);
  }
  $.get("/index.php?c=front/LoadModule&moduleId=" + moduleid + str, null, function (data) {
    window.replaceModules['moduleid'] = true;
    $('#' + moduleid).replaceWith(data);
    $('#' + moduleid).find('.ModuleUserLogin,.ModuleUserLoginV2').find('.userLoginContent').show().css('visibility', 'visible');
  });
}


// 获取当前页面url参数
if (!window.location.getQueryString) window.location.getQueryString = function (name) {
  var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)", "i");
  var r = window.location.search.substr(1).match(reg);
  if (r != null) return (r[2]);
  return null;
}


// *** 分享推广代码
if (typeof ENABLE_FENXIAO != "undefined" && ENABLE_FENXIAO == "1") {
  // 如果原来没有设置推广来源
  var match = window.location.href.match(/#invite(\d+)/i);
  if (match) {
    if (window.location.toString().indexOf("debug") > -1) alert(document.cookie);
    $.get("/index.php?c=SetCookie&name=invite&value=" + match[1]); //用js设置cookie会令.net取不到正确的值，要改为用aspnet的程序来设置
  }
  // 生成当前用户的推广链接
  var match = document.cookie.match(/WebUserID=(\d+)/i);
  if (match) {
    var WebUserID = match[1];
    var um = navigator.userAgent.match(/MicroMessenger/gi);
    if (um || true) {
      if (window.location.toString().indexOf("#invite") == -1 && window.location.toString().indexOf("?invite=" + WebUserID) == -1) {
        window.location.href = window.location + "#invite" + WebUserID;
      }
    }
  }
}
// *** END OF 分享推广代码
//*** start of 自动转换字体大小
var rootfont = parseFloat($("html").css('font-size'));

function torem(px) {
  if (px > 22) px = 22;
  if (px < 12) px = 12;
  return parseFloat(px / rootfont) + 'rem';
}

function changeFontSize(parentObj) {
  if (SiteType != "1") return;
  var modules = null;
  var selector = ".ModuleNewsDetail,.ModuleNewsDetailV2,.ModuleProductDetail,.ModuleProductDetailV2,.ModuleImageTextV2,.ModuleImageText,.ModuleNewsDetailGiant,.ModuleProductDetailGiant,.ModuleImageTextGiant,.ModulePlainTextGiant";
  if (parentObj) modules = $(parentObj).find(selector);
  else modules = $(selector);
  modules.each(function (i, module) {
    var mp = $(module).closest(".ModuleItem");
    if (mp.css("position") == "absolute") return;
    var texts = null;
    if (mp.is(".ModuleProductDetail") || mp.is(".ModuleProductDetailV2")) texts = $(module).find(".goods-detail-content,.pro-detail-content").find("div,span,td,p,li,a,font");
    else if (mp.is(".ModuleNewsDetail") || mp.is(".ModuleNewsDetailV2")) texts = $(module).find(".NewsContent").find("div,span,td,p,li,a,font");
    else texts = $(module).find("div,span,td,p,li,a,font");
    texts.each(function (j, item) {
      if ($(item).is(".goods-attrval-name")) return;
      // clone后，就算没加到body，clone元素里面的图片资源也会真的去请求
      // 这个特性会导致验证码失效，所以会另外一种方法
      // var tmp = $(item).clone();
      var tmp = $(item).children().length == 0 ? $(item).clone() : $("<div>" + $(item).html().replace(/<img[^>]+c=validatecode[^>]+>/ig, '') + "</div>");
      tmp.find(':nth-child(n)').remove();
      if (tmp.text().trim().length <= 4) return;
      if ($(window).width() > 900) {
        if ($(item).attr('ori-font-size')) {
          $(item).css('font-size', $(item).attr('ori-font-size'));
          $(item).attr('ori-font-size', null);
        }
        if ($(item).attr('ori-line-height')) {
          $(item).css('line-height', $(item).attr('ori-line-height'));
          $(item).attr('ori-line-height', null);
        }
        return;
      }
      var oldfontsize = $(item).css('font-size');
      var lineheightScal = parseFloat($(item).css('line-height')) / parseFloat(oldfontsize);
      if (/(px)$/.test(oldfontsize)) {
        var fontsize = parseFloat(oldfontsize);
        var newsize = torem(fontsize);
        $(item).css('font-size', newsize);
        if (!$(item).attr('ori-font-size')) $(item).attr('ori-font-size', oldfontsize);
        if (lineheightScal > 1) {
          $(item).css('line-height', (lineheightScal * 100) + "%"); //保持比例
          if (!$(item).attr('ori-line-height')) $(item).attr('ori-line-height', (lineheightScal * 100) + "%");
        }
      }
    });
  });
}

$(window).load(function () {
  console.log('JScsipt 自动转换字体大小');
  initSubtreeFont = function () {
  };
  changeFontSize()
});
$(window).resize(function () {
  changeFontSize()
});
//*** end of 自动转换字体大小
//** start of 模块浮动
if (typeof (floaters) != 'undefined') { //一些独立的页面（比如店掌柜的）要加载JScript，但又不需要模块浮动的功能，就不必初始化了
  var floatplayer = new floaters();
  var floatElems = new Array();

  function runFloaters(module, action) {
    if (typeof (module) == 'string') module = $('#' + module);
    if (action == 'remove') {
      module.css("overflow-y", 'auto');
      module.css("display", "block");
      floatplayer.remove(module.attr('id'));
      return;
    }
    if (/^(float\-)/i.test(module.attr('float'))) {
      module.css("overflow-y", 'hidden');
      module.appendTo("body");
      module.show();
      var top = parseInt(module.attr('floaty'));
      if (isNaN(top)) top = parseInt(module.css('top'));
      var id = module.attr('id');
      if (/^(float\-left)/i.test(module.attr('float'))) {
        var left = parseInt(module.attr('floatx'));
        if (isNaN(left)) left = parseInt(module.css('left'));
        var options = {
          'floaterID': id,
          'distanceFromPageLeft': left,
          'distanceFromPageTop': top,
          width: module.css('width'),
          'xFloat': 'left'
        };
        var floatElem = floatplayer.addItem2(options, action);
        floatElems.push(floatElem);
      } else if (/^(float\-right)/i.test(module.attr('float'))) {
        var right = parseInt(module.attr('floatx'));
        if (isNaN(right)) right = parseInt(module.css('right'));
        var options = { 'floaterID': id, 'distanceFromPageRight': right, 'distanceFromPageTop': top, 'xFloat': 'right' };
        var floatElem = floatplayer.addItem2(options, action);
        floatElems.push(floatElem);
      }
      floatplayer.play2();
    }
  }

  setInterval(function () {
    for (var k = 0; k < floatElems.length; k++) {
      if ($(window).width() < 700) $(floatElems[k]).css("display", "none");
      else $(floatElems[k]).css("display", "block");
    }
  }, 5);
  $(window).load(function () {
    $("div[float]").each(function (i, item) {
      runFloaters($(item))
    })
  });
}

//九宫格模块的响应式脚本
function computeJiuGondHeight(module) {
  if (SiteType != "1") return;
  if (module) {
    var m = null;
    if (typeof module == 'object') m = $(module);
    else m = $('#' + module);
    if (m.find(".ModuleJiuGongV2").length == 0) return; //不是v2版本，不处理
    var st = m.find('.JiuGongTab').attr("ShowType");
    m.find(".JiuGongItem").each(function (i, item) {
      var height = $(item).width();
      if (st == "2" || st == "4") height = height / 2; //纯文字
      if (height > 110) height = 110;
      if ((st == "2" || st == "4") && height > 80) height = 80;
      $(item).height(height);
    });
    var hasText = false;
    m.find(".JiuGongItemText").each(function (i, item) {
      if (st == 4) $(item).css('line-height', $(item).height() + 'px');
      hasText = true;
    });
    //只有图标没有标题时，不限制图标的大小
    if (hasText == false) {
      m.find(".JiuGongItemImg").each(function (i, item) {
        $(item).css({ "width": "auto", "height": "auto" });
      });
      m.find(".JiuGongItem").each(function (i, item) {
        $(item).css({ "width": "auto", "height": "auto" });
      });
      return;
    }
    var cc = parseInt(m.find('.JiuGongTab').attr("CellCount"));
    if (st == "0") { //上下结构
      m.find(".JiuGongItemImg").each(function (i, item) {
        var w = 50, h = 50;
        if (cc >= 5 && m.width() < 700) w = 40, h = 40;
        $(item).css({ "max-width": w, "max-height": h });
      });
    }
    if (st == "2") { //左右结构
      m.find(".JiuGongItemImg,.JiuGongItemImg2").each(function (i, item) {
        var w = 30, h = 30;
        if (cc <= 2) w = 40, h = 40;
        if (m.width() > 700) w = 50, h = 50;
        $(item).css({ "min-width": w, "min-height": h });
      });
    }
  } else {
    var modules = $(".ModuleJiuGongV2").closest(".ModuleItem");
    $.each(modules, function (i, item) {
      computeJiuGondHeight(item);
    });
  }
}

//地图模块初始化
var citylocation, map, marker, infoWin = null;

function moduleMap(latitude, longitude, title) {
  var center = new qq.maps.LatLng(latitude, longitude);
  var map = new qq.maps.Map(document.getElementById('mapContainer{{ModuleID}}'), {
    center: center,
    zoom: 13
  });
  infoWin = new qq.maps.InfoWindow({
    map: map
  });
  infoWin.open();
  infoWin.setContent(title);
  infoWin.setPosition(map.getCenter());
  marker = new qq.maps.Marker({
    position: center,
    draggable: true,
    map: map
  });
}

// swiper animation 效果
function runAnimate(jqobj, animate, duration, delay) {
  $(jqobj).css({ "animation-name": animate, "animation-duration": duration, "animation-delay": delay }).one(
    'webkitAnimationEnd mozAnimationEnd MSAnimationEnd oanimationend animationend', function () {
      $(jqobj).css({ "animation-name": "none", "animation-duration": "none", "animation-delay": "none" });
    }
  );
}

//模块悬停动画
function initHoverAnimate() {
  $(document).on("mouseenter", ".ModuleItem", function () {
    if (typeof CanDesign != 'undefined' && CanDesign == 'False') {
      var jqobj = $(this);
      if ($(jqobj).attr('hover-effect')) {
        runAnimate($(jqobj), $(jqobj).attr('hover-effect'), $(jqobj).attr('hover-duration'), $(jqobj).attr('hover-delay'));
      }
    }
  });
  $(document).on("mouseenter", ".image-animation,img", function () {
    if (typeof CanDesign != 'undefined' && CanDesign == 'False') {
      var jqobj = $(this).closest(".ModuleItem");
      var imgobj = $(this).closest(".image-animation");
      if (imgobj.length == 0) imgobj = $(this);
      if ($(jqobj).attr('image-hover-effect')) {
        if ($(jqobj).attr('image-hover-effect') == 'zoom') {
          ImgZoom(imgobj);
          imgobj.on("mouseleave", function () {
            unImgZoom(imgobj)
          });
        }
        else runAnimate($(imgobj), $(jqobj).attr('image-hover-effect'), $(jqobj).attr('image-hover-duration'), $(jqobj).attr('image-hover-delay'));
      }
    }
  });
}

function createCircleChartFunction(moduleId, redraw) {
  var colors = $('#module_' + moduleId + ' .digital-progress').css("color");
  var defaultColors = $('#module_' + moduleId + ' .digital-default').css("color")
  // 新需求，判断第一次进入可视区域的时候执行动画 by 2018/12/27 啟锋
  $('#module_' + moduleId).data('name', createCircleChartFunction)
  // 先去获取该模块到顶部的距离，当该距离少于屏幕高度的时候，开始进行初始化，且只进行初始化一次
  // 获取屏幕高度
  var windowTop = window.innerHeight;
  var lock = false;
  var drawCle = function () {
    for (var i = 0; i < $('#module_' + moduleId + ' .circle').length; i++) {
      $('#module_' + moduleId + ' #circleChart-' + moduleId + '-' + i).circleChart({
        size: 120,
        color: colors,
        backgroundColor: defaultColors,
        text: 0,
        module: moduleId,
        redraw: redraw,
        onDraw: function (el, circle) {
          circle.text(Math.round(circle.value) + "%");
        }
      });
    }
  }
  if (window.location.getQueryString('CanEditFront') === 'True') {
    drawCle()
  } else {
    if ($("#module_" + moduleId) && $("#module_" + moduleId).offset().top == 0) {
      return
    } else {
      if ($("#module_" + moduleId) && $("#module_" + moduleId).offset().top <= window.innerHeight) {
        drawCle()
      } else {
        $(window).off('scroll.offTop' + moduleId).on('scroll.offTop' + moduleId, function () {
          // 屏幕卷去的高度
          if ($("#module_" + moduleId)) {
            var moduleOffTop = $("#module_" + moduleId).offset().top
            var scrollTops = $(window).scrollTop();
            if (moduleOffTop < ($(window).scrollTop() + windowTop) && !lock) {
              // 已经进入可视区域
              drawCle()
              lock = true
            }
          }
        })
      }
    }
  }
}

// 强行改变建站的URL
function replaceNewShopUrl() {
  var href = '';
  var regExp = new RegExp('(^' + location.protocol + '//' + location.host + ')|(\\?.*$)', 'i');
  $('a').each(function () {
    href = ($(this).prop('href') || '');
    href = href.replace(regExp, '');
    if (/^\/userindex/i.test(href)) {  //会员中心
      $(this).attr('href', 'https://www.gurki99.com/index.php?m=Home&c=front/Shop/Rewrite&a=userIndex')
    }
    if (/^\/OrderList/i.test(href)) {  //订单
      $(this).attr('href', '/home/shop/#/orderform/noPay')
    }
    if (/^\/ProductOrder/i.test(href)) {  //购物车
      $(this).attr('href', '/jumpUrl=shopCart')
    }
    if (/^\/UserJiFen/i.test(href)) { //积分
      $(this).attr('href', '/home/shop/#/integral')
    }
    if (/^\/UserFenXiao/i.test(href)) {  //分销
      $(this).attr('href', '/home/shop/#/distribution')
    }
    if (/^\/UserMessage/i.test(href)) {  //会员留言
      $(this).attr('href', 'https://www.gurki99.com/index.php?m=Home&c=front/Shop/Rewrite&a=userIndex')
    }
    if (/^\/UserModify/i.test(href)) {  //会员信息
      $(this).attr('href', 'https://www.gurki99.com/index.php?m=Home&c=front/Shop/Rewrite&a=userIndex')
    }
  });
}

function CreateMShareBox(thiss){
    if($(".mShareBox").length==0){
        $('body').append('<div class="mShareBox"></div>')
        $.get('https://www.gurki99.com/index.php?c=front/ProductDetail&a=getProductPlug&type=mshare',function(data){
          $(".mShareBox").html(data);
        })
    }
}

function CreateShareBox(thiss,type){
      if($(".ShareBox").length==0){
        $('body').append('<div class="ShareBox"></div>')
        $.get('https://www.gurki99.com/index.php?c=front/ProductDetail&a=getProductPlug&type=share',function(data){
          $(".ShareBox").html(data);
          $(".ShareBox").find('.'+type).hide()
        })
      }
      var top = 0
      var left = 0
      //认为是九宫格模块的
      if($(thiss).closest('.jiugong-item').length>0){
        left = $(thiss).closest('.jiugong-item').offset().left +($(thiss).closest('.jiugong-item').outerWidth() / 2)
        top =  $(thiss).closest('.jiugong-item').offset().top + $(thiss).closest('.jiugong-item').outerHeight();
      }
      else if($(thiss).closest('.ModuleButtonGiant').length>0){
        left = $(thiss).offset().left +($(thiss).outerWidth() / 2)
        top =  $(thiss).offset().top + $(thiss).outerHeight();
      }
    $(".ShareBox").css('cssText','position: absolute;top:'+top +'px;left:'+left+'px');
}

function CreateXunpanBox(moduleId,ProductName,ImgBig,ProductID){
  if($(".XunpanBox"+moduleId).length==0){
      $('body').append('<div class="XunpanBox'+moduleId+'"></div>')
      $.get('/index.php?c=front/ProductDetail&a=getProductPlug&type=xunpan&ModuleID='+moduleId,function(data){
        $(".XunpanBox"+moduleId).html(data);
        $('#enquiryDailog' + moduleId).show(0, function () {
          $('#showcallback' + moduleId).data('enquiryCallBack') && $('#showcallback' + moduleId).data('enquiryCallBack')(ProductName, ProductID, ImgBig, moduleId)
        });
      })
    }
    if($(".XunpanBox"+moduleId).length>0){
      $('#enquiryDailog' + moduleId).show(0, function () {
        $('#showcallback' + moduleId).data('enquiryCallBack') && $('#showcallback' + moduleId).data('enquiryCallBack')(ProductName, ProductID, ImgBig, moduleId)
      });
   }
}

//时间推提醒
window['timeRemind'] = function(){
  if (window.CanDesign == 'True') {
    var setTime = 1000
    var inte
    var timedata = window['timedata']
    var timedata2 = window['timedata2']
    var html = '<style>#timeRemindbox{position: fixed; right:0;  bottom: 150px;  z-index: 9999;visibility: hidden;}'
    html +='.emojibox{ overflow: hidden;  position: absolute; right: 20px; width: 140px; height: 140px;} .emoji{visibility: hidden;position: absolute;top:140px;right:0; width:0;transition: top 1s;}'
    html +='.emojitrans{visibility: visible;top:0;width:140px}'
    html +='.ellipse{position: absolute;background: #fff; border-radius: 100%; box-shadow: 0px 3px 20px 0px rgba(0,0,0,0.16);}'
    html +='.ellipse1{padding:50px 40px; overflow: hidden;text-align: left;width: 240px;height: 160px;left: 0; top: -30px; } .ellipse2{width: 25px; height: 19px; right: 30px;top: 100px;} .ellipse3{right: 10px;top: 120px; width: 14px;height: 11px;}'
    html +='.ellipsebox{top: -35px;visibility: hidden;transition: transform 2s; transform: translateX(60px);;width: 300px; right: 140px;position: absolute;  height: 160px;}'
    html +='.ellipseboxtrans{visibility: visible;transform: translateX(0);}'
    html +='.timeRemindclose{ cursor: pointer;font-size: 12px;color: #FFFFFF;position: absolute;top: -23px;right: 15px; width: 60px;height: 24px; background: rgba(0,0,0,0.5); border-radius: 12px;text-align: center;line-height: 24px;}'
    html +='</style>'
    html +='<div id="timeRemindbox">'
    html += '<div class="emojibox"><img class="emoji" src="../images/Cartoon/eye.png"/*tpa=https://www.gurki99.com/images/Cartoon/eye.png*/></div>'
    html += '<div class="ellipsebox"><div class="ellipse ellipse1"></div>'
    html += '<div class="ellipse ellipse2"></div>'
    html += '<div class="ellipse ellipse3"></div></div>'
    html += '<div class="timeRemindclose">3S 关闭</div>'
    html += '</div>'

    if(top.$("#timeRemindbox").length == 0){
      top.$(html).appendTo('body')
    }
    if(timedata!=undefined && timedata2!= undefined){
      var myDate = new Date();
      //let time1 = myDate.getTime()
      let time1 = (myDate.getHours()>9 ?myDate.getHours() : '0' + myDate.getHours()) + ":" + (myDate.getMinutes() > 9? myDate.getMinutes(): '0'+myDate.getMinutes()) + ":" + (myDate.getSeconds() > 9 ? myDate.getSeconds(): "0"+myDate.getSeconds());
      var index = timedata2.indexOf(time1)
      if(index >-1) {
        setTime = 6000
        var contentjosn = JSON.parse(timedata[index].Content);
        var randomNum = Math.floor(Math.random()* ((contentjosn.length - 1) + 1));
        let curontentt = contentjosn[randomNum]
        //console.log(contentjosn,randomNum)
        if(top.$('#timeRemindbox').css('visibility') == 'hidden'){
              let count = 5
              top.$('.ellipse1').html(decodeURIComponent(curontentt.content))
              top.$('.emoji').attr('src','/images/Cartoon/'+curontentt.emoji+'.png')
              top.$('#timeRemindbox').css('visibility','visible')
              top. $('.ellipsebox').addClass('ellipseboxtrans')
              top.$('.emoji').addClass('emojitrans')
              top.$('.timeRemindclose').html('3S 关闭')
              inte = setInterval(function(){
                top.$('.timeRemindclose').html(count+'S 关闭')
                if(count == -1) {
                  clearInterval(inte)
                  top.$('#timeRemindbox').css('visibility','hidden')
                  top.$('.ellipsebox').removeClass('ellipseboxtrans')
                  top.$('.emoji').removeClass('emojitrans')
                  //count = 3
                  setTime = 1000
                }
                count--
              },1000)
              top.$('.timeRemindclose').click(function(){
                //count = 3
                top.$('#timeRemindbox').css('visibility','hidden')
                top.$('.ellipsebox').removeClass('ellipseboxtrans')
                top.$('.emoji').removeClass('emojitrans')
                clearInterval(inte)
                setTime = 1000
              })
        }
      }
    }
    setTimeout(window['timeRemind'],setTime)
  }
}

function timeRemindfunc(){
  if (window.CanDesign == 'True') {
    if(window['timedata'] == undefined){
      $.ajax(
        {
          url: "https://www.gurki99.com/index.php?c=Front/Teatimer&a=index&status=1&page=1&page_size=100",
          dataType: "json",
          success: function (res) {
            let data = res.data;
            let dataarr = []
            $(data).each(function(index){
              let time2 = $(this)[0].Time
              let RangeType = JSON.parse($(this)[0].RangeType)
              if(RangeType != undefined) {
                if(RangeType.indexOf('0')>-1) dataarr.push(time2)
              }
            })
            window['timedata'] = data
            window['timedata2']= dataarr
          }
        });
    }
    window['timeRemind']()
  }
}

// 全局所有模块提示弹窗
var GLBDM = GLBDM || {}
GLBDM.alertShowSuccessOrFalse = function (hint, isErr, options) {
  var autoClose = 1000;
  if (isErr) autoClose = 2500;
  var tip = hint || ''
  if (!isErr) {
    // 如果没有自定义
    if (!hint) {
      tip = '<i class="iconfont icon-chenggong" style="margin-right:10px;color:#3fcb40;font-size: 18px;vertical-align: text-bottom;"></i>您已保存成功'
    } else {
      // 有自定义
      tip = '<i class="iconfont icon-chenggong" style="margin-right:10px;color:#3fcb40;font-size: 18px;vertical-align: text-bottom;"></i>' + tip
    }
  } else {
    // 如果没有自定义
    if (!hint) {
      tip = '<i class="iconfont icon-warning" style="margin-right:10px;color:rgba(252,38,78);font-size: 18px;vertical-align: text-bottom;"></i>保存失败'
    } else {
      // 有自定义
      tip = '<i class="iconfont icon-warning" style="margin-right:10px;color:rgba(252,38,78);font-size: 18px;vertical-align: text-bottom;"></i>' + tip
    }
  }
  var optionsDefault = {
    title: '',
    dialogClass: 'messageBox',
    width: 'auto',
    height: 'auto',
    minWidth: 60,
    minHeight: 10,
    zIndex: 99999,
    modal: true,
    resizable: false
  };
  $.extend(optionsDefault, options || {})
  var oldClose = optionsDefault.close;
  optionsDefault.close = function () {
    oldClose && oldClose()
  }
  optionsDefault.open = function (e) {
    $(e.target.offsetParent).prev().css('opacity', '0')
  }
  var oDialogElem = $('<div style="padding: 10px 12px;font-size: 13px;font-size: 13px;border-radius: 5px;line-height: 14px;">' + tip + '</div>').dialog(optionsDefault);
  if (autoClose) {
    setTimeout(function () {
      oDialogElem.dialog('close')
    }, autoClose)
  }
  if (optionsDefault.title === '') {
    oDialogElem.siblings('.ui-dialog-titlebar').remove();
  }
  oDialogElem.closest('.ui-dialog').css({
    'border-radius': '5px',
    padding: 0,
    border: 0,
    'boxShadow': '0 3px 10px rgba(0,0,0,.5)',
    background: '#fff'
  })
}