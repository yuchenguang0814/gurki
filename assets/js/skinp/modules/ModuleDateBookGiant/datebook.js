if (typeof window.dateBookSwiper == 'undefined') window.dateBookSwiper ={};
if (typeof window.dateBookSwiperIndex == 'undefined') window.dateBookSwiperIndex = {};
if (typeof window.dateBookSwiperLength == 'undefined') window.dateBookSwiperLength = {};

function initDateBookSwiper(moduleId, layout, options) {
    //初始化数据
    var itemCount = $('#module_' + moduleId).find(".swiper-slide").length;
    if (itemCount == 0) {
        //没有数据，隐藏
        $('#module_' + moduleId + ' .show-container').hide();
        return;
    }
    var showNum = options.showNum;
    if(showNum >= itemCount){
        showNum = itemCount;
    }else{
        $('#module_' + moduleId + " .show-container .swiper-btn").show();
    }
    var swiperWidth = showNum * options.slideWidth;
    var slidesPerView = showNum;
    if(swiperWidth > 0){
        $('#module_' + moduleId + ' .swiper-container').width(swiperWidth);
    }

    //初始化Swiper
    var mySwiper = window.dateBookSwiper[moduleId] = new Swiper('#module_' + moduleId + ' .swiper-container', {
        slidesPerView: slidesPerView,
        resistanceRatio: 0,
        onlyExternal: true
    });

    //设置线条位置与长度
    if(options.slideWidth == 0){
        //自适应
        var widthStr = "calc(100% * " + (showNum - 1) + " / " + showNum + ")";
        var leftStr = "calc(50% / " + showNum + ")";
        $('#module_' + moduleId + ' .swiper-line').css("width", widthStr);
        $('#module_' + moduleId + ' .swiper-line').css("left", leftStr);
    }else{
        //固定长度时的计算
        var lineWidth = (showNum - 1) * options.slideWidth;
        $('#module_' + moduleId + ' .swiper-line').width(lineWidth);
        $('#module_' + moduleId + ' .swiper-line').css("left", options.slideWidth / 2);
    }

    window.dateBookSwiper[moduleId] = mySwiper;
    window.dateBookSwiperLength[moduleId] = itemCount;
    window.dateBookSwiperIndex[moduleId] = -1;

    //上一个点击事件
    $('#module_' + moduleId + " .swiper-btn-prev").off().on("click", function(){
        var maxNum = $('#module_' + moduleId).find(".swiper-slide").length;
        var curIndex = window.dateBookSwiper[moduleId].realIndex;
        window.dateBookSwiper[moduleId].slidePrev();
        if(window.dateBookSwiperIndex[moduleId] < maxNum - showNum + 1){
            window.dateBookSwiper[moduleId].slidePrev();
        }
        if(window.dateBookSwiperIndex[moduleId] >= 1) {
            dateBookSwiperActive(moduleId, parseInt(window.dateBookSwiperIndex[moduleId]) - 1, itemCount);
        }
    })

    //下一个点击事件
    $('#module_' + moduleId + " .swiper-btn-next").off().on("click", function(){
        var maxNum = $('#module_' + moduleId).find(".swiper-slide").length;
        var curIndex = window.dateBookSwiper[moduleId].realIndex;
        if(curIndex < maxNum - showNum){
            window.dateBookSwiper[moduleId].slideNext();
        }
        if(window.dateBookSwiperIndex[moduleId] < maxNum - 1) {
            dateBookSwiperActive(moduleId, parseInt(window.dateBookSwiperIndex[moduleId]) + 1, itemCount);
        }
    })

    //设置默认选中的样式
    dateBookSwiperActive(moduleId, 0, itemCount);

    if(options.chooseFunType == "click") {
        //每一项的点击、鼠标移出移入事件
        $('#module_' + moduleId + " .swiper-slide").off().on("click", function () {
            var curIndex = $(this).attr("data-index");
            dateBookSwiperActive(moduleId, curIndex, window.dateBookSwiperLength[moduleId]);
            window.dateBookSwiperIndex[moduleId] = curIndex;
        }).on("mouseenter", function () {
            if (!$(this).find(".item-icon").hasClass("item-icon-active")) {
                $(this).find(".item-icon").addClass("icon-dingwei").addClass("item-icon-active");
            }
        }).on("mouseleave", function () {
            var curIndex = $(this).attr("data-index");
            if (curIndex != window.dateBookSwiperIndex[moduleId]) {
                $(this).find(".item-icon").removeClass("icon-dingwei").removeClass("item-icon-active");
            }
        })
    }else{
        $('#module_' + moduleId + " .swiper-slide").off().on("mouseenter", function () {
            var curIndex = $(this).attr("data-index");
            dateBookSwiperActive(moduleId, curIndex, window.dateBookSwiperLength[moduleId]);
            window.dateBookSwiperIndex[moduleId] = curIndex;
        })
    }
}

//让选中节点生效
function dateBookSwiperActive(moduleId, index, itemLength){
    if(window.dateBookSwiperIndex[moduleId] != index){

        $('#module_' + moduleId + " .show-container .title-container-show").hide();
        $('#module_' + moduleId + " .show-container .item-title").css('display', 'none').filter(".item-title-" + index).css('display', '')
        $('#module_' + moduleId + " .show-container .title-container-show").fadeIn("slow");

        $('#module_' + moduleId + " .show-container .item-content").hide();
        $('#module_' + moduleId + " .show-container .item-content .item-content-list").css('display', 'none').filter(".item-content-" + index).css('display', '')
        $('#module_' + moduleId + " .show-container .item-content").fadeIn("slow");

        $('#module_' + moduleId + " .swiper-wrapper .item-icon").removeClass("icon-dingwei").removeClass("item-icon-active");
        $('#module_' + moduleId + " .swiper-wrapper .item-icon").eq(index).addClass("icon-dingwei").addClass("item-icon-active");

        if(itemLength){
            if(index >= 1) {
                $('#module_' + moduleId + " .show-container .swiper-btn-prev").removeClass("swiper-btn-noactive");
            }else {
                $('#module_' + moduleId + " .show-container .swiper-btn-prev").addClass("swiper-btn-noactive");
            }
            if(index < itemLength - 1){
                $('#module_' + moduleId + " .show-container .swiper-btn-next").removeClass("swiper-btn-noactive");
            }else{
                $('#module_' + moduleId + " .show-container .swiper-btn-next").addClass("swiper-btn-noactive");
            }
        }

        window.dateBookSwiperIndex[moduleId] = parseInt(index);
    }
}

//初始化
function initDateBook(moduleId, layout, options) {
    options = $.extend({}, dateBookDefaultOptions, options || {});
    initDateBookSwiper(moduleId, layout, options);

    window["initFunc" + moduleId] = function () {
        if(window.dateBookSwiper[moduleId]){
            window.dateBookSwiper[moduleId].update();
        }
    }

    $(window).off('resize.module' + moduleId).on('resize.module' + moduleId, function () {
        window["initFunc" + moduleId]();
    });
}

var dateBookDefaultOptions = {
    'showNum': 6, //展示个数
    'slideWidth': 0, //每个滑动块的宽度，0 代表自适应
    'chooseFunType' : 'mouse', //除了上一个下一个按钮外，如何切换选项。默认 mouse：鼠标悬停，click：点击
}