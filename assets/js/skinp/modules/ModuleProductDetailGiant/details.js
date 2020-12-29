function details(moduleid, layout, allProductQuantity, productSkus, productSkusAll, showZoomer, ImgBig, ProductName) {
    var module = $('#module_' + moduleid + '.ModuleItem');
    //是否是IE9 start
    var DEFAULT_VERSION = 9;
    var ua = navigator.userAgent.toLowerCase();
    var isIE = ua.indexOf("msie") > -1;
    var safariVersion;
    var contentImgArr = [];
    var IEunder9 = false;
    if (isIE) {
        safariVersion = ua.match(/msie ([\d.]+)/)[1];
        if (safariVersion <= DEFAULT_VERSION) {
            IEunder9 = true;
        }
    }
    //end

    module.off()
    //询盘按钮时间
    $('#module_' + moduleid + ' .enquiry').click(function () {
        $('#enquiryDailog' + moduleid).show(0, function () {
            $('#showcallback' + moduleid).data('enquiryCallBack') && $('#showcallback' + moduleid).data('enquiryCallBack')(ProductName, $('[name="ProductID"]').val(), ImgBig, moduleid)
        });

    })
    $('#module_' + moduleid + ' .mob-enquiry').click(function () {
        $('#enquiryDailog' + moduleid).show(0, function () {
            $('#showcallback' + moduleid).data('enquiryCallBack') && $('#showcallback' + moduleid).data('enquiryCallBack')(ProductName, $('[name="ProductID"]').val(), ImgBig, moduleid)
        });

    })
    // 先隐藏分享模块，目前只通过他来调分享的接口
    $(".ModuleShare").css("display", "none");
    //pc的分享
    $('.pc-share-list .inpc-share img').off('click').on('click', function () {
        var thisshare = $(this).parent().attr('data-cmd');
        $('.bdsharebuttonbox img[data-cmd=' + thisshare + ']').click();
    })
    // 处理积分商城 订单详情页 隐藏加入购物车按钮
    if ($('#isJiFen').val() === '1') {

        module.find('.ShopCart').remove();
        module.find('.mobile-joinCar').remove();
        // 103手机端的加入购物车
        if (module.find('.join-car-btn').length) {
            if (!module.find('.join-car-btn').siblings().length) {
                module.find('.mobile-joincarAndBuynow-left').remove();
            } else {
                module.find('.join-car-btn').remove();
            }
        }
        module.find(".join-car").remove();
        // 加入购物车隐藏则将购买按钮宽度撑大
        module.find('.mobile-buyNow').css('width', '100%')
    } else {
        module.find('#join-car').css('display', '')
    }

    var galleryTop = null,
        galleryThumbs = null,
        productDetailIndex = false;
    var haveMobileFooter = 'true';
    var currentbigpic = 0; //当前显示的大图
    haveMobileFooter = $('#MobileFootNav').length;
    var productShowType = $('#isJiFen').length > 0 ? $('#isJiFen').val() : 0;
    if (productSkus && productSkusAll) {
        productSkus = JSON.parse(productSkus);
        productSkusAll = JSON.parse(productSkusAll);
        var outStockSku = []; //没有库存的sku
        var noOutStockSku = []; //有库存的sku
        $.each(productSkusAll, function (index, el) {
            if (el.ProductQuantity <= 0) {
                outStockSku.push(el);
            } else {
                noOutStockSku.push(el);
            }
        });
    }
    // 添加到浏览记录
    addBrowseRecord(module.find("input[name=ProductID]").val());

    function setTowLineByTitle(row) {
        if (row.hasClass('webkitbox')) row.removeClass('webkitbox');
        if ($.inArray(layout, ['101', '102', '103', '105', '108']) > -1 || (window.innerWidth < 992 && layout == '104')) {
            if (row.css('lineHeight')) {
                var RowHeight = Number(row.css('lineHeight').replace('px', '')),
                    Height = row.outerHeight();
                if (RowHeight * 2 < Height) {
                    row.addClass('webkitbox');
                } else {
                    row.removeClass('webkitbox');
                }
            }
        }
    }
    // 检测是否有库存
    function hasSpec(skuArr) {
        var hasPQ = false;
        $.each(noOutStockSku, function (index, el) {
            var this_sku_spec = 1;
            $.each(skuArr, function (ind, elm) {
                if (el.Path.indexOf(',' + elm + ',') == -1) {
                    this_sku_spec = 0;
                    return false;
                }
            });
            if (this_sku_spec == 1) {
                hasPQ = true;
                return false;
            }
        });
        return hasPQ;
    }

    //检测没有库存的规格 并显示
    function checkOutStock(selectedSku) {
        // 有多规格  并且要有售空的规格
        if (productSkusAll && outStockSku.length > 0) {
            var selected = module.find('.repertory-active');
            module.find('.no-repertory').each(function (index, el) {
                if (!$(el).hasClass('outStock')) {
                    $(el).removeClass('no-repertory').addClass('have-repertory');
                }
            });
            selected.each(function (index, el) {
                var thisValId = $(el).attr('data-value');
                //获取除了当前规格的 所有有库存的规格 一一组合比对是否有库存
                module.find('.specification-choose').not($(el).closest('.specification-choose')).each(function (ind, elm) {
                    $(elm).find('.have-repertory').each(function (ind_have, el_has) {
                        if (!hasSpec([thisValId, $(el_has).attr('data-value')])) {
                            $(el_has).removeClass('have-repertory').addClass('no-repertory');
                        }
                    });
                });
            });
        }
    }

    detailslayout101();
    rightAigin();

    function rightAigin() {
        if (layout == '101' || layout == 108) {
            var max = module.find('.specification-box .specification-AttrKeyName').eq(0).width();
            module.find('.specification-box .specification-AttrKeyName').each(function (idx, el) {
                idx == 0 ? max = $(el).width() : max = max = Math.max(max, $(el).width())
            })
            module.find('.specification-box .specification-AttrValName-wb').css({
                'margin-left': max + 10
            })
        }
    }

    //风格1规格点击规格
    if ($.inArray(parseInt(layout), [101, 104, 106, 107, 108, 110]) > -1) {
        module.find('.specification-box .specification-AttrValName').off('click').on('click', function () {
            if (productSkus.length <= 0) return;
            var _this = $(this);
            var SpecificationParent = _this.closest('.specification');
            _this.siblings().removeClass('active');
            _this.toggleClass('active');
            if (_this.closest('.specification-box').attr('data-hove-pic') == 'yes' && $(window).width() > 768) {
                if (!_this.hasClass('active')) {
                    if (layout == 104) {
                        if($('#module_'+moduleid).find('.swiper-slide-active').find('.boshiweb_bofang').length>0){
                            $('#module_'+moduleid).find('.swiper-slide-active').find('.mobile-inSlide-size').show()
                            $('#module_'+moduleid).find('.swiper-slide-active').find('.boshiweb_bofang').show();
                        }
                    }
                    module.find('#pro-bigPic .inSwiper-slide').eq(currentbigpic).css({
                        'background-image': _this.parent().data('active-src')
                    });
                    if (galleryTop && (_this.find('.ImgCenterboxwb').length > 0 || layout == '104' || layout == '106')) {
                        galleryTop.startAutoplay()
                        module.find('.gallery-thumbswb .swiper-slide.active  .inSwiper-slide').removeClass('active-transparent')
                    }
                } else {
                    if (layout == 104) {
                        if($('#module_'+moduleid).find('.swiper-slide-active').find('.boshiweb_bofang').length>0){
                            $('#module_'+moduleid).find('.swiper-slide-active').find('.mobile-inSlide-size').hide()
                            $('#module_'+moduleid).find('.swiper-slide-active').find('.boshiweb_bofang').hide();
                        }
                    }
                    if (galleryTop && (_this.find('.ImgCenterboxwb').length > 0 || layout == '104' || layout == '106')) {
                        galleryTop.stopAutoplay()
                        module.find('.gallery-thumbswb .swiper-slide.active  .inSwiper-slide').addClass('active-transparent').siblings().removeClass('active-transparent')
                    }
                    _this.parent().data('active-src', module.find('#pro-bigPic .inSwiper-slide').eq(currentbigpic).css('background-image'));
                    var newsrc = _this.attr('data-src');
                    module.find('#pro-bigPic .inSwiper-slide').eq(currentbigpic).css({
                        'background-image': "url(" + newsrc + ")"
                    });
                    module.find('#pro-bigPic').attr('rel', newsrc);

                }
            };
            //这里是积分跟价格
            module.find('#pro-bigPic').attr('rel', newsrc);
            if (module.find('.specification-box').length == module.find('.specification-AttrValName.active').length) {
                var data = '';
                module.find('.specification-AttrValName.active').each(function () {
                    data += $(this).attr('data-value') + ',';
                });
                data = data.replace(/(^,)|(,$)/g, '');
                data = data.split(',').sort().join(',');
                var price = 0;
                var priceAbbr = 0;
                var surplus = 0;
                if (productSkus[0] != undefined) {
                    for (var i = 0; i < productSkus.length; i++) {
                        if (data == productSkus[i].Path.split(',').sort().join(',')) {
                            point = productSkus[i].Jf_convert; //需要付的积分
                            price = productSkus[i].Price; //需要付的原价钱
                            skuid = productSkus[i].SkuID; //产品id
                            surplus = productSkus[i].surplus; //除去积分还要付的价格
                            productQuantity = productSkus[i].ProductQuantity;
                        }
                    };
                    if (getCookie('Lang') == 'cn' || getCookie('Lang') == 'big5') {
                        var unit = getCookie('Lang') == 'cn' ? '万' : '萬';
                        priceAbbr = (price / 10000) + unit;
                    } else {
                        priceAbbr = price;
                    }
                    module.find('.pro-price .price-text').text(priceAbbr);
                };
            }
        });
        module.find('.img-text-detail').off('click').on('click', function () {
            var scrtop = module.find('.particularsMain')[0].offsetTop;
            $(window).scrollTop(scrtop - 50);
        })
        module.find('.pro-btn-share:not(.pro-item-fujian)').off('click').on('click', function () {
            $('.ShareIcon').click();
        })
    }

    if (layout == 101 || layout == 108) {
        var topNavSwper101 = new Swiper('#module_' + moduleid + ' .particulars .swiper-container', {
            slidesPerView: 'auto',
            freeMode: true,
            onClick: function (e) {
                topNavSwper101.slideTo(e.clickedIndex)
            }
        })
    }
    if (layout == 105) {
        resizeSwiperCenter105()
    }
    function resizeSwiperCenter105() {
        module.find('.particulars').off('resize.resizeli').on('resize.resizeli', function (e, data) {
            e.stopPropagation();
            resizeWin($(this));
        })
        var windowWith = window.innerWidth;
        function resizeWin(elem, flag) {
            if (!flag && windowWith == window.innerWidth) {
                return
            }
            windowWith = window.innerWidth;
            var allSlideWidth = 0;
            elem.find('.swiper-slide').each(function () {
                allSlideWidth += elem.outerWidth()
            })
            if (allSlideWidth < elem.find('.swiper-container').outerWidth()) {
                elem.find('.swiper-wrapper').addClass('justify-content');
            } else {
                elem.find('.swiper-wrapper').removeClass('justify-content');
            }
            var topNavSwiper = elem.data('topNavSwiper');
            if (topNavSwiper) {
                topNavSwiper.update()
            } else {
                topNavSwiper = new Swiper('#module_' + moduleid + ' .particulars .swiper-container', {
                    slidesPerView: 'auto',
                    freeMode: true,
                    onClick: function (e) {
                        topNavSwiper.slideTo(e.clickedIndex)
                    }
                })
                elem.data('topNavSwiper', topNavSwiper)
            }
        }
        resizeWin(module.find('.particulars'), true);
    }
    // pc的分享
    module.find('.pc-share-list-wb .inpc-share').off('click').on('click', function () {
        var thisshare = $(this).attr('data-cmd');
        $('.bdsharebuttonbox img[data-cmd=' + thisshare + ']').click()
    })
    if (layout == 102 || layout == 103 || layout == 105) {
        var data = '';
        var shoulePrice = 0; //应付价格
        var univalence = 0; //单价
        module.find('.introduceBottom').find('.pro-style-containt').each(function (index, el) {
            if ($(el).hasClass('repertory-active')) {
                data += $(el).attr('data-value') + ',';
            }
        });
        /*
         没选择完时，
         1)价格不改变
         2)库存是总数
         选择完成时
         1）价格是一个选中产品应付的钱
         2）库存是选中产品库存
         */
        //选择规格
        var productQuantity = allProductQuantity; //库存
        //获取规格数量
        var sumLen = module.find('.introduceBottom .pro-row').length; //规格数量
        var oInput = module.find('#buy-num'); //存储购买数量的imput框
        var skuid = 0; //产品id
        var buyNum = 1; //购买数量
        var point = 0; //需要付的积分
        //选择规格
        // 选择规格中停止轮播，防止切换了图片
        module.find('.introduceBottom').find('.pro-style-containt').off('click').on('click', function (e, data) {
            // 点击规格去除下至滚轮的所有选中状态
            var transparent_slide
            switch (Number(layout)) {
                case 102:
                    transparent_slide = '.gallery-thumbs-box .swiper-slide.active  .inSwiper-slide'
                    break;
                case 103:
                    transparent_slide = '.gallery-thumbs .swiper-slide.active'
                    break;
                default:
                    break;
            }
            if (productSkus.length <= 0) return;
            var _this = $(this);
            if (_this.hasClass('no-repertory')) {
                alert('没有库存');
                return;
            };

            if (_this.closest('.specification-container').attr('data-hove-pic') == 'yes' && $(window).width() > 768) {
                var newsrc = _this.attr('data-src');
                module.find('#pro-bigPic .inSwiper-slide').eq(currentbigpic).css({
                    'background-image': "url(" + newsrc + ")"
                });
                module.find('#pro-bigPic .inSwiper-slide').eq(currentbigpic).find('.mobile-inSlide-size').css({
                    'opacity': '0'
                });
                module.find('#pro-bigPic').attr('rel', newsrc);
            };

            if (_this.hasClass('repertory-active')) {
                _this.removeClass('repertory-active');
                if (galleryTop && data != 'trigger' && _this.hasClass('have-repertory')) {
                    var numIndex = ($('#module_' + moduleid + ' .gallery-top .swiper-slide').length - $('#module_' + moduleid + ' .gallery-thumbs .swiper-slide').length) / 2;
                    var swiperSlide = $(galleryTop.container).find('.swiper-slide.swiper-slide-active .inSwiper-slide')
                    swiperSlide.css({
                        'background': "url(" + swiperSlide.find('.mobile-inSlide-size').attr('src') + ") center center / contain no-repeat"
                    })
                    galleryTop.startAutoplay()
                    module.find(transparent_slide).removeClass('active-transparent')
                }
            } else {
                if (galleryTop && data != 'trigger' && _this.hasClass('have-repertory')) {
                    galleryTop.stopAutoplay()
                    module.find(transparent_slide).addClass('active-transparent').siblings().removeClass('active-transparent')
                }
                _this.closest('.pro-row').find('.pro-style-containt').removeClass('repertory-active')
                _this.addClass('repertory-active');
                // layout-105 样式处理
                if ($(window).width() <= 792 && $.inArray(parseInt(layout), [105]) !== -1) {
                    _this.closest('.pro-row').find('.pro-style-containt').removeClass('layout-105-repertory-active')
                    _this.addClass('layout-105-repertory-active')
                }
            };

            if (_this.attr("isshop") !== "0") checkOutStock(_this);
            if ($(window).width() <= 792 && $(this).closest('.specification-container').attr('data-hove-pic') == "yes") {
                module.find('.mobile-pro-big-pic').attr("src", $(this).attr("data-src"))
            }
            var len = module.find('.introduceBottom').find('.pro-style-containt.repertory-active').length;
            if (len == sumLen) {
                var data = '';
                //全部选择完时
                module.find('.introduceBottom').find('.pro-style-containt.repertory-active').each(function (idx, el) {
                    data += $(this).attr('data-value') + ',';
                });
                data = data.replace(/(^,)|(,$)/g, '');
                data = data.split(',').sort().join(',');
                var price = 0;
                var surplus = 0;
                if (productSkus[0] != undefined) {
                    for (var i = 0; i < productSkus.length; i++) {
                        if (data == productSkus[i].Path.split(',').sort().join(',')) {
                            point = productSkus[i].Jf_convert; //需要付的积分
                            price = productSkus[i].Price; //需要付的原价钱
                            skuid = productSkus[i].SkuID; //产品id
                            surplus = productSkus[i].surplus; //除去积分还要付的价格
                            productQuantity = productSkus[i].ProductQuantity; //库存
                            break;
                        }
                    };

                    if (module.find('#buy-num').val() > productQuantity) {
                        module.find('#buy-num').val(1)
                    };
                    //区分积分产品和非积产品单价
                    if (productShowType == 1) {
                        shoulePrice = parseFloat(surplus).toFixed(2);
                        univalence = surplus;

                    } else {
                        shoulePrice = parseFloat(price).toFixed(2);
                        univalence = price;
                    };
                    var strs = '';
                    if (layout == '103' || layout == '105') {
                        module.find('.mobile-price .mobile-price-num').text(shoulePrice); //售价
                        module.find('.pro-price.color-system b strong').text(shoulePrice); //售价

                        // layout-105
                        if (layout == '105') {
                            module.find('.pro-price em b').text(point); // 积分
                        } else {
                            module.find('.pro-pricee.color-system b span').text(point); // 积分
                        }

                        module.find('.pro-pricee.color-system b span').text(point);
                        module.find('.mobile-Repertory span').text(productQuantity); //mobile库存
                        module.find('.repertory .pc-pro-repertory').text(productQuantity); //PC库存

                        // 移动端价格处理
                        if ($(window).width() <= 769) {
                            module.find('.mobile-price b span').text(shoulePrice); // 售价
                        }
                    } else {
                        module.find('.pro-price-box .pro-price strong').html(shoulePrice); //售价
                        module.find('.mobile-Repertory span').text(productQuantity); //库存
                        module.find('.pro-price-box .pro-price b').text(point) //积分
                        module.find('.mobile-price b span').text(shoulePrice); //价格
                        module.find('.pc-productQuantity').text(productQuantity) //pc库存
                        module.find('.mobile-Repertory span').text(productQuantity) //mobile库存
                    }
                    module.find('.mobile-price strong').text(point);

                    JfenshowOrHide(productShowType);
                }
            } else {
                productQuantity = 0;
                //没有选择完成
                for (var i = 0; i < productSkus.length; i++) {
                    productQuantity += Number(productSkus[i].ProductQuantity);
                };
                if (layout == 103 || layout == 105) {
                    module.find('.mobile-Repertory span').text(productQuantity);
                    module.find('.repertory .pc-pro-repertory').text(productQuantity);
                    module.find('.mobile-Repertory span').text(productQuantity) //mobile库存
                } else {
                    module.find('.pc-productQuantity').text(productQuantity) //pc库存
                    module.find('.mobile-Repertory span').text(productQuantity); //库存
                }
            };
            if (productSkus[0] != undefined) {
                module.find('#pro-repertory .pc-productQuantity').html(productQuantity); //填入库存
            }
        })
        //加减数量change-num
        module.find('.buy-btn .change-num').off('click').on('click', function () {
            var isJian = true;
            $(this).hasClass('jian-btn') ? isJian = true : isJian = false;
            //如果所以规格都选完了

            if (module.find('.introduceBottom').find('.pro-style-containt.repertory-active').length == sumLen) {
                var nNumber = oInput.val(),
                    minNum = productQuantity > 0 ? 1 : 0;

                if (isJian) {
                    // 减 最小为1
                    if (nNumber <= 0) {
                        oInput.val(minNum);
                        shoulePrice = parseFloat(univalence * minNum).toFixed(2);
                        // module.find('#pro-price-box .pro-price em').hide();
                        buyNum = minNum;
                    } else {
                        if (nNumber - 1 <= 0) {
                            oInput.val(minNum);
                            shoulePrice = parseFloat(univalence * minNum).toFixed(2);
                            buyNum = minNum;
                        } else {
                            oInput.val(--nNumber);
                            productShowType == 1 ? module.find('#pro-price-box .pro-price em').show() : '';
                            shoulePrice = parseFloat(univalence * nNumber).toFixed(2);
                            buyNum = nNumber;
                        }
                    }
                    if (buyNum == 0) module.find('#pro-price-box .pro-price em').hide();
                } else {
                    //加
                    if (Number(nNumber) > productQuantity) {
                        oInput.val(productQuantity)
                        buyNum = productQuantity;
                        //alert('库存不够');
                        alert(getLang('InventoryShortage'))
                    } else {
                        if (nNumber == productQuantity) {
                            oInput.val(productQuantity);
                            shoulePrice = parseFloat(univalence * productQuantity).toFixed(2);
                            buyNum = productQuantity;
                        } else {
                            oInput.val(++nNumber);
                            buyNum = nNumber;
                            shoulePrice = parseFloat(univalence * nNumber).toFixed(2);
                        }

                    }
                    productShowType == 1 ? module.find('#pro-price-box .pro-price em').show() : '';
                }
                var strs = '';
                productShowType == 1 ? strs = '<em>+' + point + '积分</em>' : strs = '';
                JfenshowOrHide(productShowType)
            } else {
                alert(getLang('select_spec'))
                //alert('请选择规格')
            }
        });
        //手动输入购买件数时
        oInput.off('blur').on('blur', function () {
            if (module.find('.introduceBottom').find('.pro-style-containt.repertory-active').length == sumLen) {
                var _this = $(this);
                var buyNums = _this.val();
                if (Number(buyNums) >= productQuantity) {
                    Number(buyNums) > productQuantity ? alert(getLang('InventoryShortage')) : "";
                    _this.val(productQuantity);
                    shoulePrice = parseFloat(productQuantity).toFixed(2);
                    buyNum = productQuantity;

                } else {
                    buyNum = buyNums;
                    shoulePrice = parseFloat(univalence * buyNums).toFixed(2);
                }
                var strs = '';
                productShowType == 1 ? strs = '<em>+' + point + '积分</em>' : strs = '';
                JfenshowOrHide(productShowType)
            } else {
                $(this).val(1);
                //alert('请选择规格');
                 alert(getLang('select_spec'))
            }
        })

        function JfenshowOrHide(productShowType) {
            if (productShowType == 1) {
                if (buyNum == 0) {
                    module.find('#pro-price-box .pro-price em').hide();
                } else {
                    module.find('#pro-price-box .pro-price em').show();
                }
            } else {
                module.find('#pro-price-box .pro-price em').hide();
            }
        }


        //立即购买pc
        module.find('#buy-now').off('click').on('click', function () {
            buyNowAndJoinCar(0);
        })
        // 加入购物车pc
        // 新增代码--关联到detailDialog里面的JS
        module.find('#join-car,.J_ViewerAddCart').off('click').on('click', function () {
            var blo = buyNowAndJoinCar(1);
            var windowWidth1 = $(window).width();
            //  start
            if ($('[data-pluns="detailDialog' + moduleid + '"]').is(':visible') && !blo) {
                $('.ks-overlay-mask').remove()
                $('[data-pluns="detailDialog' + moduleid + '"]').hide()
                module.find('.close-buycar-warnning').show()
                module.find('.introduce-warnning').addClass('common-border-color')
                module.find('.tb-choice').show()

            } else if ($('[data-pluns="detailDialog' + moduleid + '"]').is(':visible')) {
                $('.ks-overlay-mask').remove()
                $('[data-pluns="detailDialog' + moduleid + '"]').hide()
            }
            // end
            if (windowWidth1 < 768 && blo) {
                $(this).closest('.dialog-mobile-content').find('.close-dialog-mobile').click();
            }
        })
        var specificationDialog = module.find('.mobile-specification-dialog'); //立即购买弹窗
        //弹窗mobile加入购物车
        module.find('.mobile-joinCar').off('click').on('click', function () {
            var isparameter = false;
            var isJoinCar = true;
            dialogShow(specificationDialog, isJoinCar, isparameter);
            if ($(window).width() < 991) {
                $("#pro-bigPic .ProVideoDiv").css("display", 'none');
                if ($("#pro-bigPic .ProVideoDiv").find('video').length > 0) {
                    $("#pro-bigPic .ProVideoDiv").find('video')[0].pause();
                }
                module.find('.guanbidiv').parent().remove();
            }
        })
        //弹窗mobile立即购买
        module.find('.mobile-buyNow').off('click').on('click', function () {
            var isparameter = false;
            var isJoinCar = false;
            dialogShow(specificationDialog, isJoinCar, isparameter);
            if ($(window).width() < 991) {
                $("#pro-bigPic .ProVideoDiv").css("display", 'none');
                if ($("#pro-bigPic .ProVideoDiv").find('video').length > 0) {
                    $("#pro-bigPic .ProVideoDiv").find('video')[0].pause();
                }
                module.find('.guanbidiv').parent().remove();
            }
        })
        //弹窗mobile立即购买
        module.find('.mobile-specification-choose').off('click').on('click', function () {
            var isParameter = $(this).attr('isparameter') == 'pro-parameter';
            var isJoinCar = false;
            isParameter ? dialogShow() : dialogShow(specificationDialog, false, isParameter);
            if ($(window).width() < 991) {
                $("#pro-bigPic .ProVideoDiv").css("display", 'none');
                if ($("#pro-bigPic .ProVideoDiv").find('video').length > 0) {
                    $("#pro-bigPic .ProVideoDiv").find('video')[0].pause();
                }
                module.find('.guanbidiv').parent().remove();
            }
        })
        //弹窗mobile加入购物车
        module.find('.mobile-parameter-choose').off('click').on('click', function () {
            var isParameter = $(this).attr('isparameter') == 'pro-parameter';
            var isJoinCar = true;
            argumentsDialog = module.find('.mobile-arguments-dialog');
            dialogShow(argumentsDialog, isJoinCar, isParameter);
            if ($(window).width() < 991) {
                $("#pro-bigPic .ProVideoDiv").css("display", 'none');
                if ($("#pro-bigPic .ProVideoDiv").find('video').length > 0) {
                    $("#pro-bigPic .ProVideoDiv").find('video')[0].pause();
                }
                module.find('.guanbidiv').parent().remove();
            }
        })
        //完成按钮
        module.find('.finish').off('click').on('click', function () {
            $(this).closest('.dialog-mobile-content').find('.close-dialog-mobile').click();
        })

        //给后台的数据
        function buyNowAndJoinCar(isJoinCar) {
            var standards = module.find('.introduceBottom').find('.pro-style-containt.repertory-active');
            if (standards.length == sumLen) {
                var data = {
                    skuid: skuid, //购买产品的id
                    isJoinCar: isJoinCar,
                };
                sendData(data);
                var sStandards = '';
                standards.each(function (el, idx) {
                    sStandards += $(el).find('b').text;
                    idx == sumLen - 1 ? sStandards += '' : sStandards += ',';
                })

                return sStandards;
            } else {
                //alert("请选择规格");
                alert(getLang('select_spec'))
                return false;
            }
        }

        //关闭弹窗
        module.find('.close-dialog-mobile').on('click', function () {
            var isSpecification = $(this).attr('isspecification') == 'specification' ? true : false;
            dialogHied($(this), isSpecification)
        });

        // 弹窗出出现
        function dialogShow(obj, isJoinCar, isparameter) {
            var oDialog = obj.find('.dialog-mobile-content');
            oDialog.css('height', '')
            oDialog.find('.introduceBottom').css('max-height', '');
            oDialog.find('.mobile-dialog-bottom').css({
                'height': '',
                'padding-top': ''
            })
            var ofooterBtn = obj.find(".footer-mobile");
            oDialog.siblings('.mobile-dialog-maskLayer').fadeIn();
            ofooterBtn.css({ 'position': 'absolute' });
            obj.css({
                'display': 'block'
            })
            var bottom = obj.height();
            var oDialogHeight = oDialog.height();
            oDialog.css({
                'bottom': -bottom,
            });

            if (!isparameter) {
                module.find(".footer-mobile").find('button').css('display', 'none');
                isJoinCar ? ofooterBtn.find('.join-car').show() : ofooterBtn.find('.buy-now').css('display', 'block');
                bottom += obj.find('.mobile-pro-pic-dialog').height() - oDialogHeight;

                //处理loyou-102弹窗突出部分
                var footHeight = $('#MobileFootNav').length && $('#MobileFootNav').is(':visible') ? $('#MobileFootNav').height() : 0
                oDialog.find('.inmobile-dialog-content').height(oDialogHeight);
                var oDialogContentHeight = oDialogHeight - oDialog.find('.mobile-dialog-content-top').outerHeight() - footHeight;
                oDialog.find('.mobile-dialog-bottom').css({
                    'height': oDialogContentHeight,
                    'padding-top': parseInt(oDialog.find('.mobile-dialog-content-top').outerHeight()) < 75 ? '75px' : oDialog.find('.mobile-dialog-content-top').outerHeight()
                })
                if (layout == 105) {
                    oDialog.find('.introduce-warnning').css('height', oDialogContentHeight - (oDialog.find('.buyAndCarBox').height() || 0));
                    oDialog.find('.introduceBottom').css('max-height', oDialogContentHeight - (oDialog.find('.buyAndCarBox').height() || 0) - oDialog.find('.introduceLast').outerHeight())
                } else {
                    oDialog.find('.introduce-warnning').css('max-height', oDialogContentHeight - (oDialog.find('.buyAndCarBox').height() || 0));
                }
                oDialog.find('.buyAndCarBox').css('paddingBottom', footHeight);
            };
            var speed = 20;
            obj.Tem = setInterval(function () {
                bottom <= 0 ? bottom = 0 : bottom = (bottom * 7 / 8 - 1);
                oDialog.css({
                    'bottom': -bottom
                })
                if (bottom <= 0) {
                    oDialog.css({
                        'bottom': 0,
                    });
                    module.find(".footer-mobile").css({ 'position': 'fixed' });
                    clearInterval(obj.Tem);
                }
            }, 10)
        }

        $(window).on("scroll." + moduleid, function () {
            if (productDetailIndex) {
                productDetailIndex = false
                return
            }
            if ($(window).width() >= 992) {
                return
            }
            rezieTitleClass()
        })

        var prodetail = module.find('.mobile-pro-details');
        var listdetail = module.find('.nav-list-top li');
        var listdetailmobile = module.find('.nav-list-top li.mobile-pro');
        var lidetail = module.find('.nav-list-top li.mobile-details');

        // 头部导航切换
        module.find('.nav-list-top li').off('click').on('click', function (e) {
            var _this = $(this);
            var detailContentTop = module.find('.ModuleProduteDetailMain').offset().top;
            var evaluate = module.find('.pro-evaluate');
            if (_this.hasClass('mobile-details')) {
                var index1 = 0
                module.find('.mobile-details').each(function (index, elem) {
                    if (_this[0] == elem) {
                        index1 = index
                    }
                })
                var scrtop = null;
                if ($(prodetail.get(index1)).length > 0) {
                    scrtop = $(prodetail.get(index1)).position().top + detailContentTop;
                }
                evaluate.removeClass('position').hide();
                $(window).scrollTop(scrtop - 45);
                productDetailIndex = true;
            } else if (_this.hasClass('mobile-pro')) {
                module.find('.pro-evaluate').removeClass('position').hide();
                $(window).scrollTop(detailContentTop);
                productDetailIndex = true;
                evaluate.removeClass('position');
            } else if (_this.hasClass('mobile-comment')) {
                evaluate.addClass('position').show()
                updetaPicwidth();
            }
            _this.closest('.nav-list-top').find('li').removeClass('active');
            _this.addClass('active');

        })

        function rezieTitleClass() {
            var windowTop = $(window).scrollTop()
            var detailContentTop = module.find('.ModuleProduteDetailMain').offset().top;
            var topNavSwiper = module.find('.modulePro-top-nav').data('topNavSwiper');
            module.find('.nav-list-top li.active').removeClass('active');
            if (windowTop != 0 && $(prodetail[0]).length > 0 && windowTop + window.innerHeight >= $(prodetail[0]).position().top + detailContentTop) {
                //给详情添加高亮
                var status = 0
                prodetail.each(function (index) {
                    // 只有详情标题在轮动位置下边的才可能符合要求
                    if ($(this).position().top + detailContentTop >= windowTop) {
                        // 如果标题在肉眼可见区域内
                        if ($(this).position().top + detailContentTop < windowTop + window.innerHeight) {
                            status = index
                        }
                        // 否则内容区在肉眼可见区域
                    } else if ($(this).position().top + detailContentTop + $(this).outerHeight(true) >= windowTop + window.innerHeight) {
                        // 如果标题在肉眼可见区域内
                        status = index
                    }
                })
                // 如果所有详情项都在上面选最后一个
                if ($(prodetail[prodetail.length - 1]).position().top + detailContentTop + $(prodetail[prodetail.length - 1]).outerHeight(true) < windowTop + window.innerHeight) {
                    status = prodetail.length - 1
                }
                if ($('#goods-comment').is(':visible') && ($('#goods-comment').position().top + detailContentTop < windowTop + window.innerHeight)) {
                    module.find('.nav-list-top li.mobile-comment').addClass('active')
                    topNavSwiper && topNavSwiper.slideTo(status + 2);
                } else {
                    $(lidetail[status]).addClass('active')
                    topNavSwiper && topNavSwiper.slideTo(status + 1);
                }
                //给产品添加高亮
            } else {
                listdetailmobile.addClass("active")
                topNavSwiper && topNavSwiper.slideTo(0);
            }
        }

        //关闭弹窗
        function dialogHied(obj, isSpecification) {
            var oDialog = obj.closest('.dialog-mobile-content');
            var nDialogHeight = oDialog.height();
            module.find('.footer-mobile').css({ 'position': 'absolute' });
            oDialog.siblings('.mobile-dialog-maskLayer').fadeOut();
            oDialog.closest('.dialog-mobile-content').animate({
                'bottom': -(nDialogHeight + module.find('.mobile-pro-pic-dialog').height() - module.find('.mobile-dialog-priceAndRepertory').height()),
            }, function () {
                module.find('.footer-mobile').css({ 'position': 'fixed' });
                if (layout == 103 && !isSpecification) {

                } else {
                    module.find('.mobile-dialog-wb').hide();
                }
                //如果是规格弹窗
                if (isSpecification) {
                    var len = module.find('.introduceBottom').find('.pro-style-containt.repertory-active').length;
                    var sChooseSpecification = '';
                    module.find('.introduceBottom').find('.pro-style-containt.repertory-active').each(function (idx, el) {
                        sChooseSpecification += $(el).find('b').text();
                        idx == len - 1 ? sChooseSpecification += '' : sChooseSpecification += ',';
                    })

                    if ($.inArray(parseInt(layout), [105]) === -1) {
                        module.find('.mobile-specification-choose .pro-specification-mobile').text(sChooseSpecification)
                    } else {
                        module.find('.product-spec').html(getLang('product_spec') + '&nbsp;&nbsp;' + sChooseSpecification)
                    }
                }
            });
        }

        //默认选择
        module.find('.specification-choose').each(function (idx, el) {
            $(el).find('.have-repertory').eq(0).trigger('click', 'trigger')
        })
        // pc选项卡
        module.find('.particularsNavBox .particularsNav').off('click').on('click', function () {
            $(this).closest('.particularsNavBox').find('.particularsNav').removeClass('active');
            var showBox = $(this).attr('show-div');
            module.find('.particularsMain .pro-nav-box').hide();
            module.find('.particularsMain .' + showBox).show();
            $(this).addClass('active');
        });

        module.find('.particularsNavBox .particularsNav').eq(0).click(); //默认显示详情
        //头部选项居中
        function resizeSwiperCenter() {
            module.find('.modulePro-top-nav').off('resize.resizeli').on('resize.resizeli', function (e, data) {
                e.stopPropagation();
                resizeWidth($(this))
            })
            var windowWidth = window.innerWidth;
            function resizeWidth(elem, flag) {
                if (!flag && windowWidth == window.innerWidth) {
                    return
                }
                var allSlideWidth = 0;
                module.find('.nav-list-top .swiper-slide').each(function () {
                    allSlideWidth += $(this).outerWidth()
                })
                if (allSlideWidth < module.find('.nav-list-top').outerWidth()) {
                    module.find('.nav-list-top .swiper-wrapper').addClass('justify-content');
                } else {
                    module.find('.nav-list-top .swiper-wrapper').removeClass('justify-content');
                }
                var topNavSwiper = elem.data('topNavSwiper');
                if (topNavSwiper) {
                    topNavSwiper.update()
                } else {
                    topNavSwiper = new Swiper('#module_' + moduleid + ' .nav-list-top', {
                        slidesPerView: 'auto',
                        freeMode: true,
                        onClick: function (e) {
                            topNavSwiper.slideTo(e.clickedIndex)
                        }
                    })
                    elem.data('topNavSwiper', topNavSwiper)
                }
            }
            resizeWidth(module.find('.modulePro-top-nav'), true)
        }
        resizeSwiperCenter()
        var mobilePicSwiper = null;
        module.find('.mobile-big-pic #back').off('click').on('click', function () {
            $(this).closest('.mobile-big-pic').fadeOut();
        })
        module.find('.mobile-introduce').off('click').on('click', function () {
            var _this = $(this);
            if (_this.attr('isup') == 'up') {
                _this.animate({
                    'bottom': 0
                });
                _this.attr('isup', 'down');
            } else {
                _this.animate({
                    'bottom': 16 - _this.height()
                })
                _this.attr('isup', 'up');
            }
        })

        module.find('.mobile-specification-dialog').off('touchstart').on('touchstart', function () { $('body').css('overflow', 'hidden') });
        module.find('.close-dialog-mobile').off('click.touchend').on('click.touchend', function () { $('body').css('overflow', '') });
        // layout-103特有
        if (layout == '103' || layout == '105') {
            //加入购物车
            module.find('.join-car-btn').off('click').on('click', function () {
                module.find('.mobile-joinCar').click()
            })
        }
    };
    if (layout == 102 || layout == 103) {
        $('body').find('ModuleProductDetailGiant.layout-' + layout + '.clone').remove();
        $('body').prepend('<div class="ModuleProductDetailGiant layout-' + layout + ' clone" id="fixed_module_' + moduleid + '"></div>');
        module.off('remove').on('remove', function () {
            $('#fixed_module_' + moduleid).remove()
        })
    }
    // 初始化产品详情109模块
    function detaillayout109() {
        // 上下页跳转
        module.find('.por-prev,.prev-icon').off().on('click', function () {
            var link = module.find('.prev>a').attr('href')
            if (link) {
                window.location.href = link
            }
        })
        module.find('.por-next,.next-icon').off().on('click', function () {
            var link = module.find('.next>a').attr('href')
            if (link) {
                window.location.href = link
            }
        })

        // 初始化轮播
        if (galleryTop && typeof galleryTop.destroy == 'function') {
            galleryTop.destroy(true, true)
            galleryTop = null;
        }
        var res = module.find(".swiper-slide"),
            effect = null,
            slidesPerView = null
        if (res.length < 2 || window.CanDesign != 'False') {
            numTimes = false
        } else {
            numTimes = 3000
        }

        if (window.innerWidth >= 768) {
            effect = 'coverflow'
            slidesPerView = 2.7
        } else {
            effect = 'effect'
            slidesPerView = 1
        }

        if (IEunder9) {
            //ie9以下，调用swiper2
            galleryTop = new Swiper("#module_" + moduleid + '  .ModuleProduteDetailMain .swiper-container', {
                pagination: "#module_" + moduleid + ' .swiper-pagination',
                paginationClickable: true,
                loop: true,
                mode: 'horizontal',
                autoplay: false,
                speed: 500,
                swipeNext: '#module_' + moduleid + ' .swiper-button-next',
                swipePrev: '#module_' + moduleid + ' .swiper-button-prev',
                onInit: function (swiper) {
                    $(swiper.container).find('.swiper-wrapper').css({ 'height': '' }).find('.swiper-slide').css('height', '')
                    $('#pro-bigPic').attr('style', 'height:100%');
                },
            });
            $('.swiper-button-next').click(function () {
                galleryTop.swipeNext();
            })
            $('.swiper-button-prev').click(function () {
                galleryTop.swipePrev();
            })
            return false;
        }

        galleryTop = new Swiper('#module_' + moduleid + ' .ModuleProduteDetailMain .swiper-container', {
            nextButton: '#module_' + moduleid + ' .swiper-button-next.swiper-button-white',
            prevButton: '#module_' + moduleid + ' .swiper-button-prev.swiper-button-white',
            pagination: '#module_' + moduleid + ' .swiper-pagination',
            paginationType: 'bullets',
            paginationClickable: true,
            autoplay: numTimes,
            effect: effect,
            slidesPerView: slidesPerView,
            centeredSlides: true,
            freeMode: false,
            observer: true,
            observeParents: true,
            coverflow: {
                rotate: 0,
                stretch: -60,
                depth: 260,
                modifier: 3,
                slideShadows: false
            },
            speed: 500,
            loop: true,
            loopAdditionalSlides: 2,
            autoplayDisableOnInteraction: false,
            onInit: function (swiper) {
                //Swiper初始化了
                $('#module_' + moduleid + ' .swiper-right').off().click(function () {
                    swiper.slideNext();
                })
                $('#module_' + moduleid + ' .swiper-left').off().click(function () {
                    swiper.slidePrev();
                })
            }
        });
    }


    function detailslayout101() {
        var direction = 'horizontal';
        var slidesPerView = 5;
        if (layout == '103' || layout == '105') {
            direction = 'vertical';
            slidesPerView = 4;
        };
        if (layout == '110') {
            slidesPerView = 8
        }
        //swiper
        var res = module.find(".swiper-slide")
        var numTimes
        if (layout <= 103 || layout == 108 || layout == 110) {
            res = module.find("#pro-thumbnail .swiper-slide")
            var pagType = 'bullets';
            if (window.innerWidth < 992 && layout == 103) {
                pagType = 'fraction';
            }
            if (res.length < 2 || window.CanDesign != 'False') {
                numTimes = false
            } else {
                numTimes = 3000
            }

            var moduleIdSelector = "#module_" + moduleid;

            if (IEunder9) {
                //ie9以下，调用swiper2
                galleryTop = new Swiper(moduleIdSelector + ' .gallery-top', {
                    pagination: moduleIdSelector + ' .swiper-pagination',
                    paginationClickable: true,
                    loop: false,
                    autoplay: false,
                    speed: 500,
                    onInit: function (swiper) {
                        $(swiper.container).find('.swiper-wrapper').css({ 'height': '' }).find('.swiper-slide').css('height', '')
                    },
                    onSlideChangeStart: function (swiper) {
                        currentbigpic = swiper.activeIndex;
                    },
                    onSlideChangeEnd: function (swiper) {
                        //让下层滚轮选择
                        if (galleryThumbs && window.innerWidth > 992) {
                            if (swiper.realIndex == '0') {
                                galleryThumbs.swipeTo(0, 1000, false)
                            }
                            if (layout <= 102) {
                                if (swiper.realIndex > 4) {
                                    galleryThumbs.swipeTo(swiper.realIndex, 1000, false)
                                }
                            } else if (layout == 103) {
                                if (swiper.realIndex > 3) {
                                    galleryThumbs.swipeTo(swiper.realIndex, 1000, false)
                                }
                            }
                        }

                        module.find('.gallery-thumbs .swiper-slide').eq(swiper.activeIndex).click();
                        var rel = module.find('.gallery-top .swiper-slide').eq(swiper.activeIndex).attr('rel');
                        module.find('.gallery-top').attr('rel', rel);
                    }
                });
                galleryThumbs = new Swiper(moduleIdSelector + ' .gallery-thumbs', {
                    slidesPerView: slidesPerView,
                    paginationClickable: true,
                    spaceBetween: 10,
                    mode: direction,
                    swipeNext: '.pro-thumbnail-next',
                    swipePrev: '.pro-thumbnail-prev',
                    observer: true,
                    observeParents: true,
                    onInit: function (swiper) {
                        if (layout == 103) {
                            $('#pro-thumbnail').addClass('swiper-container-vertical');
                            $(swiper.container).find('.swiper-slide').css('margin-bottom', '10px');
                            $('.ModuleProductDetailGiant .pro-small-pic-wb-top').css('width', '112px')
                        }
                        $(swiper.container).find('.swiper-wrapper').css({ 'height': '' }).find('.swiper-slide').css('height', '')
                        $(swiper.container).find('.inSwiper-slide').hover(function () {
                            $(this).parents('.swiper-wrapper').find('.active-transparent').removeClass('active-transparent')
                            galleryTop.stopAutoplay();
                        }, function () {
                            galleryTop.startAutoplay();
                        })

                    }
                });
                if (layout == 103) {
                    $('.pro-thumbnail-next').click(function () {
                        galleryThumbs.swipeNext();
                    })
                    $('.pro-thumbnail-prev').click(function () {
                        galleryThumbs.swipePrev();
                    })

                } else {
                    $('.pro-thumbnail-next').click(function () {
                        galleryThumbs.swipePrev();
                    })
                    $('.pro-thumbnail-prev').click(function () {
                        galleryThumbs.swipeNext();
                    })
                }


                return false;
            }
            galleryTop = new Swiper('#module_' + moduleid + ' .gallery-top', {
                nextButton: '#module_' + moduleid + ' .swiper-button-next',
                prevButton: '#module_' + moduleid + ' .swiper-button-prev',
                pagination: '#module_' + moduleid + ' .swiper-pagination',
                paginationClickable: true,
                paginationType: pagType,
                speed: 500,
                autoplay: numTimes,
                loop: true,
                loopAdditionalSlides: 2,
                autoplayDisableOnInteraction: false,
                observer: true,
                observeParents: true,
                onSlideChangeStart: function (swiper) {
                    currentbigpic = swiper.activeIndex;
                },
                onSlideChangeEnd: function (swiper) {
                    //让下层滚轮选择
                    if (galleryThumbs && window.innerWidth > 992) {
                        galleryThumbs.slides.removeClass('active')
                        galleryThumbs.slides.eq(swiper.realIndex).addClass('active');
                        if (swiper.realIndex == '0') {
                            galleryThumbs.slideTo(0, 1000, false)
                        }
                        if (layout <= 102) {
                            if (swiper.realIndex > 4) {
                                galleryThumbs.slideTo(swiper.realIndex, 1000, false)
                            }
                        } else if (layout == 103) {
                            if (swiper.realIndex > 3) {
                                galleryThumbs.slideTo(swiper.realIndex, 1000, false)
                            }
                        }
                    }
                    module.find('.gallery-thumbs .swiper-slide').eq(swiper.activeIndex).click();
                    var rel = module.find('.gallery-top .swiper-slide').eq(swiper.activeIndex).attr('rel');
                    module.find('.gallery-top').attr('rel', rel);
                }
            });
            //下层滚轮
            galleryThumbs = new Swiper('#module_' + moduleid + ' .gallery-thumbs', {
                slidesPerView: slidesPerView,
                paginationClickable: true,
                spaceBetween: 10,
                direction: direction,
                prevButton: '.pro-thumbnail-next',
                nextButton: '.pro-thumbnail-prev',
                onInit: function (swiper) {
                    $(swiper.container).find('.inSwiper-slide').hover(function () {
                        $(this).parents('.swiper-wrapper').find('.active-transparent').removeClass('active-transparent')
                        galleryTop.stopAutoplay();
                    }, function () {
                        galleryTop.startAutoplay();
                    })
                }
            });
            if (galleryTop) {
                $(galleryTop.container).off('mouseover.mouseoverGalleryTopContainer').on('mouseover.mouseoverGalleryTopContainer', function () {
                    galleryTop.stopAutoplay();
                })
            }
            //鼠标移出开始自动切换
            // 先判断有没有视频
            if (module.find('.boshiweb_bofang').length > 0) {
                galleryTop.container[0].onmouseleave = function () {
                    galleryTop.startAutoplay();
                }
            } else {
                $(document).on('mouseleave.zoomask', '.zoomMask', function () {
                    galleryTop.startAutoplay();
                });
            }
        } else if (layout == 104 || layout == '106') {
            if (layout == '104') {
                if (window.innerWidth < 768) {
                    //手机端，切换图片的分页器样式类型改为圆点
                    var paginationType = 'bullets';
                } else {
                    //不是手机端，则为分式
                    var paginationType = 'fraction';
                }
            } else {
                var paginationType = 'bullets';
            }
            if (res.length < 2 || window.CanDesign != 'False') {
                numTimes = false
            } else {
                numTimes = 3000
            }
            if (IEunder9) {
                //ie9以下，调用swiper2
                galleryTop = new Swiper("#module_" + moduleid + '  .ModuleProduteDetailMain .swiper-container', {
                    pagination: "#module_" + moduleid + ' .swiper-pagination',
                    paginationClickable: false,
                    loop: false,
                    mode: 'horizontal',
                    autoplay: false,
                    speed: 500,
                    swipeNext: '#module_' + moduleid + ' .swiper-button-next',
                    swipePrev: '#module_' + moduleid + ' .swiper-button-prev',
                    observer: true,
                    observeParents: true,
                    onInit: function (swiper) {
                        if (layout == 104) {
                            $('.ModuleProductDetailGiant .swiper-container .inSwiper-slide').css('position', 'static')
                        } else if (layout == 106) {
                            $('.ModuleProductDetailGiant .swiper-container .inSwiper-slide').css('position', 'static')
                            $('.swiper-button-prev').css({ 'position': 'absolute', 'top': '50%', 'z-index': '100', 'left': '0%', 'cursor': 'pointer' })
                            $('.swiper-button-next').css({ 'position': 'absolute', 'top': '50%', 'z-index': '100', 'right': '0%', 'cursor': 'pointer' })
                        }
                        $('#module_' + moduleid + ' .swiper-right').click(function () {
                            swiper.swipeNext();
                        })
                        $('#module_' + moduleid + ' .swiper-left').click(function () {
                            swiper.swipePrev();
                        })
                    },
                    onSlideChangeEnd: function (swiper) {
                        var rel = module.find('.gallery-top .swiper-slide').eq(swiper.activeIndex).attr('rel');
                        module.find('.gallery-top').attr('rel', rel);
                        currentbigpic = swiper.activeIndex;
                        if ($.inArray(layout, ['102', '103', '104', '105', '106', '108']) < 0) {
                            module.find('#pro-bigPic .inSwiper-slide').each(function (idx, el) {
                                $(el).css({
                                    "background-image": "url(" + $(el).attr('data-old-src') + ")"
                                });
                            });
                        }
                    }
                });


                return false;
            }

            galleryTop = new Swiper('#module_' + moduleid + ' .ModuleProduteDetailMain .swiper-container', {
                nextButton: '#module_' + moduleid + ' .swiper-button-next',
                prevButton: '#module_' + moduleid + ' .swiper-button-prev',
                pagination: '#module_' + moduleid + ' .swiper-pagination',
                paginationType: paginationType,
                paginationClickable: true,
                speed: 500,
                autoplay: false,
                loop: true,
                loopAdditionalSlides: 2,
                autoplayDisableOnInteraction: false,
                observer: true,
                observeParents: true,
                onInit: function (swiper) {
                    //Swiper初始化了
                    $('#module_' + moduleid + ' .swiper-right').click(function () {
                        swiper.slideNext();
                    })
                    $('#module_' + moduleid + ' .swiper-left').click(function () {
                        swiper.slidePrev();
                    })
                },
                onSlideChangeEnd: function (swiper) {
                    var rel = module.find('.gallery-top .swiper-slide').eq(swiper.activeIndex).attr('rel');
                    module.find('.gallery-top').attr('rel', rel);
                    currentbigpic = swiper.activeIndex;
                    if ($.inArray(layout, ['102', '103', '104', '105', '106', '108']) < 0) {
                        module.find('#pro-bigPic .inSwiper-slide').each(function (idx, el) {
                            $(el).css({
                                "background-image": "url(" + $(el).attr('data-old-src') + ")"
                            });
                        });
                    }
                }

            });
        } else if (layout == 105) {
            res = module.find("div.swiper-slide")
            if (res.length < 2 || window.CanDesign != 'False') {
                numTimes = false
            } else {
                numTimes = 3000
            }

            if (IEunder9) {
                //ie9以下，调用swiper2
                galleryTop = new Swiper("#module_" + moduleid + ' .gallery-top', {
                    pagination: "#module_" + moduleid + ' .swiper-pagination',
                    paginationClickable: true,
                    loop: true,
                    mode: 'horizontal',
                    autoplay: false,
                    speed: 500,
                    swipeNext: '#module_' + moduleid + ' .swiper-button-next',
                    swipePrev: '#module_' + moduleid + ' .swiper-button-prev',
                    onInit: function (swiper) {
                        $(swiper.container).find('.swiper-wrapper').css({ 'height': '' }).find('.swiper-slide').css('height', '')
                        $(swiper.container).find('.swiper-button-prev').css({ 'position': 'absolute', 'top': '50%', 'z-index': '100', 'left': '0%', 'cursor': 'pointer' })
                        $(swiper.container).find('.swiper-button-next').css({ 'position': 'absolute', 'top': '50%', 'z-index': '100', 'right': '0%', 'cursor': 'pointer' })
                    },
                    onSlideChangeStart: function (swiper) { },
                    onSlideChangeEnd: function (swiper) {
                        var rel = module.find('.gallery-top .swiper-slide').eq(swiper.activeIndex).attr('rel');
                        module.find('.gallery-top').attr('rel', rel);
                    }
                });
                $('.swiper-button-next').click(function () {
                    galleryTop.swipeNext();
                })
                $('.swiper-button-prev').click(function () {
                    galleryTop.swipePrev();
                })
                return false;
            }

            galleryTop = new Swiper('#module_' + moduleid + ' .gallery-top', {
                nextButton: '#module_' + moduleid + ' .swiper-button-next',
                prevButton: '#module_' + moduleid + ' .swiper-button-prev',
                pagination: '#module_' + moduleid + ' .swiper-pagination',
                speed: 500,
                autoplay: numTimes,
                loop: true,
                loopAdditionalSlides: 2,
                paginationClickable: true,
                autoplayDisableOnInteraction: false,
                observer: true,
                observeParents: true,
                onSlideChangeStart: function (swiper) {
                    currentbigpic = swiper.activeIndex;
                },
                onSlideChangeEnd: function (swiper) {
                    module.find('.gallery-thumbs .swiper-slide').eq(swiper.activeIndex).click();
                    var rel = module.find('.gallery-top .swiper-slide').eq(swiper.activeIndex).attr('rel');
                    module.find('.gallery-top').attr('rel', rel);
                }
            });
        } else if (layout == 109) {
            detaillayout109()
        }
        magnifyingMirror(layout)
    }
    // 101的上边轮播经过了swiper的复制对了三屏
    var showIndex = 0;
    if ($.inArray(parseInt(layout), [101, 102, 103, 108, 110]) > -1) {
        showIndex = ($('#module_' + moduleid + ' .gallery-top .swiper-slide').length - $('#module_' + moduleid + ' .gallery-thumbs .swiper-slide').length) / 2;
    }
    module.find('.gallery-thumbs .swiper-slide').eq(0).addClass('active');
    module.find('.gallery-top').attr('rel', module.find('.gallery-top .swiper-slide').eq(showIndex).attr('rel'));
    module.find('.gallery-thumbs .swiper-slide').off('mouseenter').on('mouseenter', function () {

        if (module.find('.gallery-thumbs .swiper-slide').eq(0).hasClass('off')) {
            return;
        }

        galleryTop.params.speed = 0
        if (!IEunder9) {
            galleryTop.update()
            galleryTop.slideTo($(this).index() + showIndex);
        }
        galleryTop.swipeTo && galleryTop.swipeTo($(this).index() + showIndex);

        if ($.inArray(parseInt(layout), [102, 103]) < 0 && (module.find('.specification-AttrValName-wb .specification-AttrValName.active').length > 0 || module.find('.specification-container .have-repertory.repertory-active').length > 0)) {
            module.find('#pro-bigPic .inSwiper-slide').eq(currentbigpic).css({
                'background-image': "url(" + $(this).find('img.mobile-inSlide-size').attr('src') + ")"
            });
        }
        if ($.inArray(parseInt(layout), [102, 103] > 0)) {
            module.find('#pro-bigPic .inSwiper-slide').eq(currentbigpic).css({
                'background-image': "none"
            });
            module.find('#pro-bigPic .inSwiper-slide').eq(currentbigpic).find('.mobile-inSlide-size').css({
                'opacity': "1"
            });
        }

        module.find('.gallery-thumbs .swiper-slide').removeClass('active');
        $(this).addClass('active');
    }).off('mouseleave').on('mouseleave', function () {
        if (galleryTop) {
            galleryTop.params.speed = 500
        }
        if (!IEunder9) {
            galleryTop && galleryTop.update()
        }
    })
    var windowWidth3 = window.innerWidth;
    $(window).off('resize.' + moduleid).on('resize.' + moduleid, function () {
        if (windowWidth3 == window.innerWidth) {
            return
        }
        var mobileStatus = window.innerWidth < 992 && windowWidth3 >= 992
        if (layout == 103) {
            if (mobileStatus && galleryTop) {
                galleryTop.params.paginationType = 'fraction'
            } else if (window.innerWidth >= 992 && windowWidth3 < 992 && galleryTop) {
                galleryTop.params.paginationType = ''
            }
        }
        if (layout == 104) {
            if (window.innerWidth < 768 && windowWidth3 >= 768 && galleryTop) {
                galleryTop.params.paginationType = 'bullets'
            } else if (window.innerWidth >= 768 && windowWidth3 < 768 && galleryTop) {
                galleryTop.params.paginationType = 'fraction'

            }
        }
        windowWidth3 = window.innerWidth
        if (layout == 104) {
            galleryTop && typeof galleryTop.update == 'function' && galleryTop.update();
            if (galleryTop.params.paginationType == 'fraction' && galleryTop.wrapper) {
                $(galleryTop.wrapper[0]).siblings('.swiper-pagination').removeClass('swiper-pagination-bullets').addClass('swiper-pagination-fraction')
            } else {
                if (galleryTop.wrapper) {
                    $(galleryTop.wrapper[0]).siblings('.swiper-pagination').removeClass('swiper-pagination-fraction').addClass('swiper-pagination-bullets')
                }
            }
        }
        if (layout == 103) {
            galleryTop && typeof galleryTop.update == 'function' && galleryTop.update();
            if (galleryTop.params.paginationType == 'fraction') {
                galleryTop && $(galleryTop.wrapper[0]).siblings('.swiper-pagination').addClass('swiper-pagination-fraction')
            } else {
                galleryTop && $(galleryTop.wrapper[0]).siblings('.swiper-pagination').removeClass('swiper-pagination-fraction')
            }
        }
        if (layout == 109) {
            detaillayout109()
        }
        rightAigin()
        windowResize(mobileStatus);
    });
    countParameterHeiht();
    initMoreEvent(module.find('.parameter'), 'row');
    windowResize(true);

    function less769() {
        module.find('.mobile-arguments-dialog').attr('style', '');
        module.find('.pro-evaluate .big_picbox').hide();
        module.find('.pro-evaluate .swiper-container-horizontal li').removeClass('active');
        module.find('.modulePro-top-nav li.active').click();
        countParameterHeiht();
        initMoreEvent(module.find('.specification-mobile'), "height");
    }

    function countParameterHeiht() {
        var parameterList = module.find('.pro-parameter-list');
        var minHeight = parameterList.find('li').eq(1).height() * 4 + parameterList.find('li').eq(0).outerHeight();
        //如果元素不显示 获取不到高度 所以要先让元素显示 再去获取
        if (minHeight == 0 && !module.find('.pro-parameter').is(':visible')) {
            module.find('.pro-parameter').show(0, function () {
                minHeight = parameterList.find('li').eq(1).height() * 4 + parameterList.find('li').eq(0).outerHeight();
                $(this).hide();
            });
        }
        // 产品参数个数
        var moduleProductLimit = 5;
        // layout-105 需要大于 3 个才出现, 并且手动设置产品参数容器的高度
        if ($.inArray(parseInt(layout), [105]) !== -1) {
            moduleProductLimit = 3;
            minHeight = moduleProductLimit * 30;
        }
        if (parameterList.find('li').length <= moduleProductLimit) {
            module.find('.finishWb').hide();
        } else {
            module.find('.finishWb').show();
            module.find('.parameter-boxwb').css('height', minHeight);
            module.find('.showAll img').attr('src', 'images/down.png'/*tpa=https://www.gurki99.com/skinp/modules/ModuleProductDetailGiant/images/down.png*/)
            module.find('.showAll').attr('show', 'up');
            module.find('.showAll span').text('展开全部');
        }

        // 103参数展开
        module.find('.showAll').off('click').on('click', function () {
            var _this = $(this);
            var oParameterBox = _this.closest('.parameter-box');
            var oParameterBoxheight = 0;
            var isup = 'down';
            var src = '';
            var text = '';
            if (_this.attr('show') != 'down') {
                //展开
                oParameterBoxheight = oParameterBox.find('.pro-parameter-list').height();
                isup = 'down';
                src = 'images/up.png'/*tpa=https://www.gurki99.com/skinp/modules/ModuleProductDetailGiant/images/up.png*/;
                text = '收起';
            } else {
                //收起
                oParameterBoxheight = minHeight;
                isup = 'up';
                src = 'images/down.png'/*tpa=https://www.gurki99.com/skinp/modules/ModuleProductDetailGiant/images/down.png*/;
                text = '展开全部';
            }
            oParameterBox.find('.parameter-boxwb').animate({
                'height': oParameterBoxheight
            },
                function () {
                    _this.find('img').attr('src', src);
                    _this.attr('show', isup)
                    _this.find('span').text(text);
                }
            )
        });
    };

    function windowResize(flag) {
        setTowLineByTitle(module.find('.pro-name'))
        if (window.innerWidth < 992) {
            if ($.inArray(parseInt(layout), [102, 103, 104, 105, 106, 107, 108, 109]) > -1 && flag && $('.ModuleProductDetailGiant .mobile-footer').children().length > 0) {
                if ($('#MobileFootNav').length > 0 && !$('#MobileFootNav').is(':hidden')) {
                    $('.ModuleProductDetailGiant .mobile-footer').css({ 'bottom': $('#MobileFootNav').height() + 'px' })
                    $('#BodyMain1Zone').css({ 'padding-bottom': '35px' })
                } else {
                    $('.ModuleProductDetailGiant .mobile-footer').css({ 'bottom': '0px' })
                    $('#BodyMain1Zone').css({ 'padding-bottom': '30px' })
                }
            } else {
                $('#BodyMain1Zone').css({ 'padding-bottom': '0px' })
            }
        } else {
            $('.ModuleProductDetailGiant .mobile-footer').css({ 'bottom': '0' })
            $('#BodyMain1Zone').css({ 'padding-bottom': '0px' })
        }
        updatelineHeight();
        if ($(window).width() >= 769) {
            module.find('.hide-panel').css('padding-top', module.find('.introduce').outerHeight());
            module.find('.mobile-arguments-dialog').attr('style', '');
            module.find('.product_pic li').attr('style', '')
            module.find('.product_pic li .inproduct_pic').attr('style', '');
            module.find('.mobile-big-pic').fadeOut();
            module.find('.pro-evaluate').removeClass('position');
            module.find('.particularsNavBox .particularsNav.active').click();
            module.find('#join-car').addClass('join-car-pc');
            module.find('.mobile-dialog-bottom').css({ 'height': 'auto', 'padding-top': 0 });
            module.find('.inmobile-dialog-content').css({ 'height': 'auto' });
            module.find('.finishWb').hide();
            // layout-105 样式处理，处理 PC 端规格选中样式
            if ($.inArray(parseInt(layout), [105]) !== -1) {
                // 如果 快递/销量/关注 只存在一个的时候，处理下样式
                if (module.find('.features').children('p').length === 1) {
                    module.find('.features').children('p').css('margin-top', '28px')
                }
                module.find('.pro-style-containt').removeClass('layout-105-repertory-active')
            }
        } else {
            module.find('#join-car').removeClass('join-car-pc');
            //少于769走这里
            less769();
            updetaPicwidth();
            // layout-105 样式不需要该方法
            if ($.inArray(parseInt(layout), [105]) !== -1) {
                // layout-105 样式处理，处理移动端规格选中样式
                module.find('.repertory-active').addClass('layout-105-repertory-active')
                // 如果 快递/销量/关注 只存在一个的时候，处理下样式
                if (module.find('.mobile-A-SV-F').children('span').length === 1) {
                    module.find('.mobile-A-SV-F').children('span').css('text-align', 'left')
                }
            }
        }
        if (galleryTop != null && typeof galleryTop.onResize === 'function') galleryTop.onResize();
        // layout-105 样式不需要该方法
        if ($.inArray(parseInt(layout), [105, 104, 106]) === -1) {
            if (galleryThumbs != null && typeof galleryThumbs.onResize === 'function') galleryThumbs.onResize();
        }
    }
    // 放大镜
    /**
     * TODO：有放大镜的轮播图，鼠标移入图片展示放大镜效果，停止轮播
     * author 啟锋
     * @param {*} layout 
     */
    function magnifyingMirror(layout) {
        //在原图基础上放大
        if (Number(showZoomer) == 1) {
            if ($.inArray(parseInt(layout), [104, 105, 106, 109]) > -1) {
                if ($(window).width() < 992) return;
                if (module.find('.inSwiper-slide>i').length != 0) return;
                addScript('../../../scripts/jQPlugins/jquery.zoom.min.js'/*tpa=https://www.gurki99.com/scripts/jQPlugins/jquery.zoom.min.js*/, function () {
                    module.find('.gallery-top .inSwiper-slide').zoom({});
                });
            } else {
                if (module.find('.inSwiper-slide>i').length != 0) return;
                //另外弹窗放大
                addScript('../../../scripts/jQPlugins/jquery.imagezoom.min.js'/*tpa=https://www.gurki99.com/scripts/jQPlugins/jquery.imagezoom.min.js*/, function () {
                    module.find('.gallery-top').imagezoom({
                        windowMinWidth: 992,
                        xzoom: 400,
                        yzoom: 400,
                    });
                });
            }
            module.find('.swiper-slide').off('mouseenter.magnifyStop,mouseleave.magnifyStop').on('mouseenter.magnifyStop', function () {
                if (galleryTop && typeof galleryTop.stopAutoplay === 'function') {
                    galleryTop.stopAutoplay()
                }
            }).on('mouseleave.magnifyStop', function (e) {
                if (!$(e.currentTarget).hasClass('swiper-slide-active')) {
                    galleryTop.startAutoplay()
                } else if ($.inArray(parseInt(layout), [104, 105, 106, 109]) > -1) {
                    galleryTop.startAutoplay()
                }
            })
        }
    }
    function updatelineHeight() {
        module.find('.ModuleProductDetailGiant.layout-104 .specification-AttrValName .pro_text_specification,.ModuleProductDetailGiant.layout-106 .specification-AttrValName .pro_text_specification').each(function () {
            $(this).width() < ($(this).parent().width() * .9) ? $(this).addClass('alcenter') : '';
        })
    }
    function updetaPicwidth() {
        var smapicwidth = module.find('.product_pic li').eq(0).width();
        module.find('.product_pic li').css({
            'height': smapicwidth
        })
        module.find('.product_pic li .inproduct_pic').css({
            'height': smapicwidth
        })
    }
    function getUrlParam(name) {
        //构造一个含有目标参数的正则表达式对象
        var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)");
        //匹配目标参数
        var r = window.location.search.substr(1).match(reg);
        //返回参数值
        if (r != null) {
            return decodeURI(r[2]);
        }
        return null;
    }
    //点击购买按钮时如何提交数据到后台的事件
    function sendData(data) {
        var product_id = $("*[name=ShopForm]").find("input[name=ProductID]").val();
        if (!$("form[name=ShopForm]").valid()) return;
        var islocation = data.isJoinCar;
        var skuid = data.skuid;
        var num = $("*[name=ShopForm]").find("input[name=Num]").val();
        var webuserid = $("*[name=ShopForm]").find("input[name=webuserid]").val();
        webuserid = webuserid ? webuserid : 0;
        if (!checkValid({ ProductID: product_id, skuid: skuid })) return;
        var params = "webuserid=" + webuserid + "&ProductID=" + product_id + "&skuid=" + skuid + "&Num=" + num;
        var params1 = "webuserid=" + webuserid + "&productId=" + product_id + "&skuId=" + skuid + "&count=" + num;
        var url = "/index.php?c=front/Productorder&a=AddToCart&Action=Add&" + params;
        var url1 = "/index.php?c=Api/shop/Cart&a=addToCart&" + params1 + '&isJiFen=' + isJiFenPage();
        var jumpUrl = getUrlParam('72e') == '72e' ? url : url1;
        var backurl = "/index.php?c=front/Productorder&Action=Add&" + params;
        var buyImmediately = getUrlParam('72e') == '72e' ? backurl : "/index.php?m=Home&c=front/Shop/Rewrite&a=buyImmediately&productId=" + product_id + '&skuId=' + skuid + '&amount=' + num + '&isJiFen=' + isJiFenPage();
        if (islocation == 0) {
            location.href = buyImmediately;
            return;
        }
        $.get(jumpUrl, null, function (json, textStatus, jqXHR) {
            if (json.redirectUrl) {
                location.href = json.redirectUrl;
                return;
            }
            if (json.success) {
                //购买 或者加入购物车成功
                $('.mod-shop-panel-close').click();
                if (islocation == 0) {
                    location.href = buyImmediately;
                    return;
                }
                $("#cartnum").html("(" + json.productnum + ")");
                $('.subn').text(json.productnum);
                //加入成功弹窗
                alertDialog("加入成功！")
            } else {
                //没有登录的话直接跳到登录页面
                if (json.isLogin == '0') {
                    location.href = '../../../index.php-c=front-Userlogin&a=GoLogin&backurl=-index.php-c=front-Productorder&a=gotoLogin&BackUrl=&failto=.htm'/*tpa=https://www.gurki99.com/index.php?c=front/Productorder&a=gotoLogin&BackUrl=*/ + escape(backurl);
                    return;
                }
                if (json.redirectUrl) {
                    location.href = json.redirectUrl;
                    return;
                } else {
                    getCartTotal();
                    if (json.code != 200) {
                        getUrlParam('72e') == '72e' ? alert(json.msg) : alert(json.msg);
                    } else {
                        getUrlParam('72e') == '72e' ? alert(json.msg) : alertDialog("加入成功！");

                    }
                }
            }
        }, "json");
    }

    function getCartTotal() {
        var jumpUrl = "https://www.gurki99.com/index.php?c=Api/shop/Cart&a=getTotalCount";
        $.get(jumpUrl, null, function (json, textStatus, jqXHR) {
            if (json.code == 200) {
                $('.subn').html(json.data.total);
            }
        }, "json");
    }

    function initMoreEvent(parameter, type) {
        var loadBtn = parameter.next('.load-more');
        if (!loadBtn) return
        if (type == 'row') {
            var loadNum = $.inArray(parseInt(layout), [106]) > -1 ? 10 : 4;
            if (parameter.children().length > loadNum) {
                $.each(parameter.children(), function (key, index) {
                    if (key >= loadNum) {
                        $(this).addClass('hidden');
                    }
                });
                loadBtn.show();
            }
            loadBtn.off('click').click(function () {
                if (parameter.children(':hidden').length > 0) {
                    parameter.children(':hidden').addClass('vill').toggleClass("hidden");
                    loadBtn.find('.open-text').hide();
                    loadBtn.find('.close-text').show();
                } else {
                    parameter.children('.vill').toggleClass("hidden");
                    loadBtn.find('.close-text').hide();
                    loadBtn.find('.open-text').show();
                }
            })
        } else if (type == 'height') {
            parameter.removeClass('autoscreen');
            loadBtn.find('.open-text').show();
            loadBtn.find('.close-text').hide();
            if (parameter.height() > 250 && window.innerWidth < 992) {
                loadBtn.addClass('on');
                parameter.addClass('autoscreen');
                loadBtn.off('click').click(function () {
                    parameter.toggleClass('autoscreen');
                    if (loadBtn.find('.open-text').is(':hidden')) {
                        loadBtn.find('.close-text').hide();
                        loadBtn.find('.open-text').show();
                    } else {
                        loadBtn.find('.close-text').show();
                        loadBtn.find('.open-text').hide();
                    }
                })
            } else {
                loadBtn.hide();
            }
        }
    }

    //购买时检查库存
    function checkOverProductQuantity(data) {
        var num = parseInt($("*[name=ShopForm]").find("input[name=Num]").val());
        var skuid = parseInt(data.skuid) || 0;
        var result = false;
        $.ajax({
            type: 'get',
            url: '/index.php?c=front/productorder&a=CheckOverProductQuantity&_rand=' + Math.random(),
            data: { ProductID: data.ProductID, SkuID: skuid, Num: num },
            async: false,
            success: function (json) {
                if (json.success == undefined) {
                    $('body').append(json);
                    return false;
                }
                if (!json.success) {
                    alert(json.msg);
                }
                if (!isNaN(json.curProductQuantity)) {
                    $('#ProductQuantity').val(json.curProductQuantity);
                    // $('.inventory_count').text(json.curProductQuantity);
                }
                result = json.success;
            },
            error: function () {
                alert(argument[0].responseText);
            }
        });
        return result;
    }

    //购买时验证用户输入
    function checkValid(data) {
        var skuid = parseInt(data.skuid) || 0;
        if (!/^\d+$/.test($('#buy-num').val() + '')) {
            //alert('请填写购买数量');
            alert(getLang('file_in_quantity'))
            return;
        }
        if (!checkOverProductQuantity(data)) return false;
        return true;
    }

    function gotoback() {
        var restr = window.location.href;
        //当第一次进入的时候,历史记录是1个或者朋友圈或者微信群或者分享好友，返回到首页
        if (history.length == 1 || restr.indexOf('from=timeline') > -1 || restr.indexOf('from=groupmessage') > -1 || restr.indexOf('from=singlemessage') > -1) {
            window.location.href = '../../../index.htm'/*tpa=https://www.gurki99.com/*/;
        } else {
            if (restr && restr.indexOf('#invite') >= 0 && restr.indexOf('storeproinfo') >= 0) {
                history.go(-2);
            } else {
                history.go(-1);
            }
        }
    }

    module.find('.mobile-back,.back-btn').off().on('click', function () {
        gotoback();
    });
    //弹窗
    function alertDialog(text, fn) {
        if (module.find('.join-success').length <= 0) {
            $('<p class="join-success">' + text + '</p>').appendTo(module.find('.ModuleProduteDetailMain'))
        };

        var joinSuccess = module.find('.join-success');
        joinSuccess.text(text);
        clearInterval(joinSuccess.tem);
        joinSuccess.css({
            'height': 0,
            'z-index': 9999999,
            'display': 'block'
        }).text(text);
        joinSuccess.stop().animate({ 'height': 50 },
            function () {
                joinSuccess.tem = setTimeout(function () {
                    joinSuccess.css({
                        'height': 0,
                        'z-index': -1,
                        'display': 'none'
                    });
                    if (typeof fn == "function") {
                        fn();
                    }
                }, 800);
            }
        );
    }

    // 收藏产品
    module.on('click', '.add-product-collection', function () {
        var product_id = module.find('input[name=ProductID]').val();
        var _this = $(this);
        if (_this.attr("click-finish") != 'true') return;
        _this.attr("click-finish", "false");
        $.post('https://www.gurki99.com/index.php?c=Api/shop/Cart&a=addToFavorites', { productId: product_id }, function (data, textStatus, xhr) {
            if (data.code == 200) {
                module.find('.add-product-collection').removeClass('add-product-collection').addClass('is-collection');
                if (layout == '101' || layout == '108') {
                    $(".icon-pic-share ").addClass("icon-zan1").removeClass('icon-xiangqu');
                } else if (layout == "103") {
                    $(".icon-pic-share").removeClass('icon-xiangqu').addClass("icon-zan1");
                } else if ($.inArray(layout, ['105', '102', '103', '104', '106', '107']) > -1) {
                    if ($(".icon-pic-share").is('icon-shoucang')) {
                        $(".icon-pic-share").removeClass('icon-shoucang').addClass("icon-shoucang1")
                    } else {
                        $(".icon-pic-share").removeClass('icon-shoucang').addClass("icon-shoucang1");
                        $('.is-collection').css('line-height', '35px');
                        $('.collectionText').show()
                    }
                }

                $('.collection-text').html(data.data.text);
                $('.icon-shoucang').addClass('icon-shoucang1').removeClass('icon-shoucang');
                alertDialog(data.msg, function () {
                    _this.attr("click-finish", "true")
                });
            } else if (data.error && data.error == 'noLogin') {
                //没有登录 跳转到登录页面
                var back_url = document.URL;
                location.href = '../../../index.php-c=front-Userlogin&BackUrl=.htm'/*tpa=https://www.gurki99.com/index.php?c=front/Userlogin&BackUrl=*/ + escape(back_url);
            } else {
                alert(data.msg);
                _this.attr("click-finish", "true");
            }
        });
    });
    // 取消收藏产品
    module.on('click', '.is-collection', function () {
        var product_id = module.find('input[name=ProductID]').val();
        var _this = $(this);
        if (_this.attr('click-finish') != "true") return;
        _this.attr("click-finish", "false");
        $.post('https://www.gurki99.com/index.php?c=Api/UserCore&a=productDetaiolDeleteFavorites', { productId: product_id }, function (data, textStatus, xhr) {
            if (data.code == 200) {
                module.find('.is-collection').addClass('add-product-collection').removeClass('is-collection');
                if (layout == 101 || layout == 108) {
                    $(".icon-pic-share ").removeClass("icon-zan1").addClass('icon-xiangqu');
                } else if (layout == "103") {
                    $(".icon-pic-share").removeClass('icon-zan1').addClass("icon-xiangqu");
                } else if (layout == '105') {
                    $(".icon-pic-share").removeClass('icon-shoucang1').addClass("icon-shoucang");
                    $('.add-product-collection').css('line-height', '50px');
                    $('.collectionText').hide()
                }
                $('.collection-text').html(data.data.text);
                $('.icon-shoucang1').addClass('icon-shoucang').removeClass('icon-shoucang1');
                alertDialog(data.msg, function () {
                    _this.attr("click-finish", "true")
                });
            } else if (data.error && data.error == 'noLogin') {
                //没有登录 跳转到登录页面
                var back_url = document.URL;
                location.href = '../../../index.php-c=front-Userlogin&BackUrl=.htm'/*tpa=https://www.gurki99.com/index.php?c=front/Userlogin&BackUrl=*/ + escape(back_url);
            } else {
                alert(data.msg);
                _this.attr("click-finish", "true");
            }
        });
    });

    //显示视频
    module.on('click', '.boshiweb_bofang', function () {
        module.find('.gallery-thumbs .swiper-slide').eq(0).addClass('off');
        $("#pro-bigPic .ProVideoDiv").css("display", 'block');
        if ($(window).width() < 991) {
            var html = '<div  style="z-index:100;width:100%;height:20px;text-align:center;margin-bottom:20px;margin-top:10px;">'
            html += '<input type="button" class="guanbidiv" style="width:80px;height:30px;color:red;border-radius: 5px;border: 1px solid;background-color: white;" value="关闭视频"/>'
            html += '</div>'
        }
        var myPlayer = videojs && typeof videojs === 'function' && videojs('example_video_1');
        videojs && typeof videojs === 'function' && videojs("example_video_1").ready(function () {
            var myPlayer = this;
            myPlayer.play();
            galleryTop.stopAutoplay();
            module.find('.pro-shar').css('display', 'none');
            module.find('.back-btn').css('display', 'none');
            module.find('#example_video_1').on('mouseenter', function () {
                $('.icon-guanbi').css('display', 'block');
            })
            module.find('#example_video_1').on('mouseleave', function () {
                setTimeout("$('.icon-guanbi').css('display','none')", 2500);

            })

        });
        myPlayer.on("ended", function () {
            module.find('.gallery-thumbs .swiper-slide').eq(0).removeClass('off');
            $("#pro-bigPic .ProVideoDiv").css("display", 'none');
            module.find('.pro-shar').css('display', '');
            module.find('.back-btn').css('display', '');
            galleryTop.startAutoplay();
            if ($(window).width() < 991) {
                module.find('.guanbidiv').parent().remove();
            }
        });
        if ($(window).width() < 991) {
            $(".introduceTop").prepend(html);
        }

    })
    //关闭视频
    module.on('click', '.icon-guanbi,.guanbidiv', function () {
        module.find('.gallery-thumbs .swiper-slide').eq(0).removeClass('off');
        $("#pro-bigPic .ProVideoDiv").css("display", 'none');
        if ($("#pro-bigPic .ProVideoDiv").find('video').length > 0) {
            $("#pro-bigPic .ProVideoDiv").find('video')[0].pause();
        }
        module.find('.pro-shar').css('display', '');
        module.find('.back-btn').css('display', '');
        galleryTop.startAutoplay();
        if ($(window).width() < 991) {
            module.find('.guanbidiv').parent().remove();
        }
    })
    // 方法尽量放在局部，避免裸露在全局污染
    // 加入商品浏览记录
    function addBrowseRecord(ProductID) {
        $.getJSON("https://www.gurki99.com/index.php?c=Api/UserCore&a=addBrowseRecord", { ProductID: ProductID }, function (json) { });
    }
    /**
    * 108模块手机端右上角...处的弹出层初始化
    */
    function toastMore108() {
        if (layout == 108) {
            var watchMore = module.find('.watch-more');
            watchMore.data('content', module.find('.watch-more-content').html())
            watchMore.popover()
            // 拿到初始化后的弹出节点
            watchMore.data('bs.popover')
            // 显示出来由于靠右没有空隙，需要每一次弹出时处理一下
            watchMore.on('show.bs.popover', function (e) {
                // 利用异步，避免节点还没有初始化
                setTimeout(function () {
                    // 弹出层左移10px
                    module.find('.popover').css('margin-left', '-10px')
                    // 箭头本身有-11px的margin，加上左移10px，变成了-1px
                    module.find('.popover .arrow').css('margin-left', '-1px')
                }, 0)
            })
            var poper = module.find('.popover');
            // 隐藏时需要还原属性，(由于每次一弹出的时候，popover都会计算长度，导致原来的设置不准确)
            watchMore.on('hide.bs.popover', function () {
                poper = module.find('.popover');
            })
            watchMore.on('hidden.bs.popover', function () {
                poper.css('margin-left', '')
                poper.find('.arrow').css('margin-left', '')
            })
            // 触发隐藏的按钮点击事件，弹出二维码
            module.on('click', '.popover .shareImg-mobile-btn', function () {
                module.find('.watch-more-content .shareImg-mobile-btn').click()
            })
            // 触发询盘按钮
            module.on('click', '.popover .mob-enquiry', function () {
                $('#enquiryDailog' + moduleid).show(0, function () {
                    $('#showcallback' + moduleid).data('enquiryCallBack') && $('#showcallback' + moduleid).data('enquiryCallBack')(ProductName, $('[name="ProductID"]').val(), ImgBig)
                });
            })
        }
    }
    toastMore108()

    // 将内容内图片初始化为灯箱，以实现点击图片放大效果
    function initContentLightGallery() {
        contentImgArr = []
        if (module.find('.particularsMain img').length > 0) {
            module.find('.particularsMain img').each(function () {
                var obj = {
                    src: $(this).attr('_src') ? $(this).attr('_src') : $(this).attr('src'),
                    thumb: $(this).attr('_src') ? $(this).attr('_src') : $(this).attr('src'),
                    subHtml: $(this).attr('alt')
                }
                contentImgArr.push(obj)
            });
        } else {
            module.find('.pro-content img').each(function (i, item) {
                var obj = {
                    src: $(this).attr('_src') ? $(this).attr('_src') : $(this).attr('src'),
                    thumb: $(this).attr('_src') ? $(this).attr('_src') : $(this).attr('src'),
                    subHtml: $(this).attr('alt')
                }
                contentImgArr.push(obj)
            });
        }
        loadStyleSheet('../../../scripts/wookmark/css/lightgallery.min.css'/*tpa=https://www.gurki99.com/scripts/wookmark/css/lightgallery.min.css*/);
        addScript('../../../scripts/wookmark/lightgallery.js'/*tpa=https://www.gurki99.com/scripts/wookmark/lightgallery.js*/, function () {
            addScript('../../../scripts/wookmark/lg-fullscreen.min.js'/*tpa=https://www.gurki99.com/scripts/wookmark/lg-fullscreen.min.js*/);
            addScript('../../../scripts/wookmark/lg-thumbnail.min.js'/*tpa=https://www.gurki99.com/scripts/wookmark/lg-thumbnail.min.js*/);
            addScript('../../../scripts/wookmark/lg-zoom.min.js'/*tpa=https://www.gurki99.com/scripts/wookmark/lg-zoom.min.js*/);

            if (module.find('.particularsMain').length > 0) {
                module.find('.particularsMain').on('click', 'img', function () {
                    if ($(this).closest('a').length > 0) return
                    if ($(this).hasClass('close-dialog-mobile')) return
                    if ($(this).hasClass('showAllImg')) return
                    $(this).lightGallery({
                        index: $(this).index('.particularsMain img'),
                        dynamic: true,
                        thumbnail: true,
                        fullScreen: false,
                        download: false,
                        dynamicEl: contentImgArr
                    });
                })
            }
            if (module.find('.pro-content').length > 0) {
                module.find('.pro-content').on('click', 'img', function () {
                    if ($(this).closest('a').length > 0) return
                    if ($(this).hasClass('close-dialog-mobile')) return
                    if ($(this).hasClass('showAllImg')) return
                    $(this).lightGallery({
                        index: $(this).index('.pro-content img'),
                        dynamic: true,
                        thumbnail: true,
                        fullScreen: false,
                        download: false,
                        dynamicEl: contentImgArr
                    });
                })
            }
            if (module.find('.mobile-pro-details').length > 0) {
                module.find('.mobile-pro-details').on('click', 'img', function () {
                    if ($(this).closest('a').length > 0) return
                    if ($(this).hasClass('close-dialog-mobile')) return
                    if ($(this).hasClass('showAllImg')) return
                    $(this).lightGallery({
                        index: $(this).index('.mobile-pro-details img'),
                        dynamic: true,
                        thumbnail: true,
                        fullScreen: false,
                        download: false,
                        dynamicEl: contentImgArr
                    });
                })
            }
        });
    }
    initContentLightGallery()
}