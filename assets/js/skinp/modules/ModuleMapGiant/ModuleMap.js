if (typeof window.mapInfoWin == 'undefined') window.mapInfoWin = {};
// 初始化百度地图
function initBaiDuMap(moduleid, layout, option) {
    var module = $('#module_' + moduleid);
    module.find('#mapContainer' + moduleid).addClass('baiduMapContainer');
    // 将腾讯地图坐标转换为百度地图
    var latLng = convertGCJ02ToBD09(option.Latitude, option.Longitude);
    option.Latitude = latLng['lat'];
    option.Longitude = latLng['lng'];

    var map = new BMap.Map('mapContainer' + moduleid);  // 创建地图实例
    var center = new BMap.Point(option.Longitude, option.Latitude);   // 设置中心点坐标
    var marker = new BMap.Marker(center);   // 创建标注
    var geocoder = new BMap.Geocoder();     // 创建地理编码实例
    map.addOverlay(marker);                 // 将标注添加到地图中
    map.centerAndZoom(center, option.Zoom);
    map.enableScrollWheelZoom(true);        //开启鼠标滚轮缩放
    map.addControl(new BMap.MapTypeControl({mapTypes:[BMAP_NORMAL_MAP, BMAP_HYBRID_MAP]})); // 添加地图类型控件
    map.addControl(new BMap.NavigationControl({type: BMAP_NAVIGATION_CONTROL_LARGE}));      // 添加平移缩放控件

    var opts = {
        width : 200,            // 信息窗口宽度
        height: '',             // 信息窗口高度
        title : '' ,            // 信息窗口标题
        enableMessage: true,    // 设置允许信息窗发送短息
        message: ''
    }
    option.ItemTitle = option.ItemTitle.replace(/\<br\>/ig, '');
    var infoWindow = new BMap.InfoWindow(option.ItemTitle, opts);  // 创建信息窗口对象
    map.openInfoWindow(infoWindow, center); //开启信息窗口
    if (option.ItemTitle == '') {
        // 根据坐标得到地址描述
        geocoder.getLocation(center, function(result){
            option.ItemTitle = result.surroundingPois[0].address;
            infoWindow.setContent(option.ItemTitle);
            if (option.ShowType) setToAddress(moduleid, option.ItemTitle);
        });
    }
    marker.addEventListener("click", function(){
        map.openInfoWindow(infoWindow, center); //开启信息窗口
    });

    window['initMapFunc' + moduleid] = function () {
        map.centerAndZoom(center, option.Zoom);
        map.openInfoWindow(infoWindow, center); //开启信息窗口
    }
    if (option.ShowType == 1) {
        setToAddress(moduleid, option.ItemTitle);
        module.find('.navBtn').off().click(function () {
            $(this).parent().find('p').removeClass('active');
            $(this).addClass('active');
            module.find('.fromKeywordLabel').removeClass('busBtn');
            module.find('.searchBtn').attr('data-type', 'navBtn');
        });

        module.find('.busBtn').off().click(function () {
            $(this).parent().find('p').removeClass('active');
            $(this).addClass('active');
            module.find('.fromKeywordLabel').addClass('busBtn');
            module.find('.searchBtn').attr('data-type', 'busBtn');
        });

        module.find('.searchBtn').off().click(function () {
            var fromKeyword = module.find('.fromKeyword').val();
            var dataType = $(this).attr('data-type');
            if (fromKeyword != '' && fromKeyword != null && fromKeyword != undefined) {
                var url = 'http://api.map.baidu.com/direction?';
                url += 'origin='+ fromKeyword;
                url += '&destination=latlng:'+ center.lat + ',' + center.lng+'|name:'+ option.ItemTitle;
                if (dataType == 'navBtn') url += '&mode=driving';
                else if (dataType == 'busBtn') url += '&mode=transit';
                url += '&region=佛山&output=html&src=webapp.baidu.openAPIdemo';
                window.open(url);
            }
        });
    }
}

// 初始化腾讯地图
function initQQMap(moduleid, layout, option) {
    var module = $('#module_' + moduleid);
    module.find('#mapContainer' + moduleid).removeClass('baiduMapContainer');
    var map, marker, infoWindow = null;
    // 以纬度和经度表示的地理坐标点
    var center = new qq.maps.LatLng(option.Latitude, option.Longitude);
    // 地址解析类, 用于在地址和经纬度之间进行转换的服务。
    var geocoder = new qq.maps.Geocoder();
    // 创建地图实例
    map = new qq.maps.Map(
        document.getElementById('mapContainer' + moduleid), {
            center: center,
            zoom: option.Zoom
        }
    )
    infoWindow = window.mapInfoWin[moduleid] = new qq.maps.InfoWindow({map: map})

    infoWindow.open();
    //setContent()设置信息窗口显示区的内容
    //设置服务请求成功的回调函数
    if (option.ItemTitle == '') {
        //对指定经纬度进行解析
        geocoder.getAddress(center)
        geocoder.setComplete(function (result) {
            option.ItemTitle = result.detail.address;
            infoWindow.setContent(option.ItemTitle);
            if (option.ShowType) setToAddress(moduleid, option.ItemTitle);
        })
    } else {
        infoWindow.setContent(decodeURIComponent(option.ItemTitle))
    }
    infoWindow.setPosition(map.getCenter())
    // 添加标记
    marker = new qq.maps.Marker({
        position: center,
        draggable: true,
        map: map
    });

    //获取标记的点击事件
    qq.maps.event.addListener(marker, 'click', function() {
        infoWindow.open();
    });
    window['initMapFunc' + moduleid] = function () {
        window.mapInfoWin[moduleid].setContent(option.ItemTitle)
    }
    if (option.ShowType == 1) {
        setToAddress(moduleid, option.ItemTitle);

        module.find('.navBtn').off().click(function () {
            $(this).parent().find('p').removeClass('active');
            $(this).addClass('active');
            module.find('.fromKeywordLabel').removeClass('busBtn');
            module.find('.searchBtn').attr('data-type', 'navBtn');
        });

        module.find('.busBtn').off().click(function () {
            $(this).parent().find('p').removeClass('active');
            $(this).addClass('active');
            module.find('.fromKeywordLabel').addClass('busBtn');
            module.find('.searchBtn').attr('data-type', 'busBtn');
        });

        module.find('.searchBtn').off().click(function () {
            var fromKeyword = module.find('.fromKeyword').val();
            var dataType = $(this).attr('data-type');
            if (fromKeyword != '' && fromKeyword != null && fromKeyword != undefined) {
                var url = 'https://apis.map.qq.com/uri/v1/routeplan?policy=1&referer=XCUBZ-PYS6S-H2SO2-6DBF3-G77OS-NNFXR';
                url += '&tocoord='+ center.lat + ',' + center.lng;
                url += '&from='+ fromKeyword;
                url += '&to='+ option.ItemTitle.replace(/\<br\>/ig, '');
                if (dataType == 'navBtn') url += '&type=drive';
                else if (dataType == 'busBtn') url += '&type=bus';
                window.open(url);
            }
        });
    }
}

// 初始化谷歌地图
function initGoogleMap(moduleid, layout, option) {
    var module = $('#module_' + moduleid);
    module.find('#mapContainer' + moduleid).removeClass('baiduMapContainer');

    // 以纬度和经度表示的地理坐标点
    var center = new google.maps.LatLng(option.Latitude, option.Longitude);
    var mapProp = {center: center, zoom: option.Zoom, mapTypeId: 'roadmap'};
    var map = new google.maps.Map(document.getElementById('mapContainer' + moduleid), mapProp);
    var marker = new google.maps.Marker({position: center,});
    var geocoder = new google.maps.Geocoder();
    option.ItemTitle = option.ItemTitle.replace(/\<br\>/ig, '');
    var infoWindow = new google.maps.InfoWindow({content: option.ItemTitle});

    marker.setMap(map);
    if (option.ItemTitle == '') {
        geocoder.geocode({'location': center}, function (results, status) {
            if (status == google.maps.GeocoderStatus.OK) {
                if (results[0]) {
                    option.ItemTitle = results[0].formatted_address;
                    infoWindow.setContent(option.ItemTitle);
                    if (option.ShowType) setToAddress(moduleid, option.ItemTitle);
                }
            }
            infoWindow.open(map, marker);
        });
    } else {
        infoWindow.open(map, marker);
    }
    google.maps.event.addListener(marker, 'click', function() {
        infoWindow.open(map, marker);
    });

    window['initMapFunc' + moduleid] = function () {
        marker.setMap(map);
        infoWindow.open(map, marker);
    }

    if (option.ShowType == 1) {
        setToAddress(moduleid, option.ItemTitle);

        module.find('.navBtn').off().click(function () {
            $(this).parent().find('p').removeClass('active');
            $(this).addClass('active');
            module.find('.fromKeywordLabel').removeClass('busBtn');
            module.find('.searchBtn').attr('data-type', 'navBtn');
        });

        module.find('.busBtn').off().click(function () {
            $(this).parent().find('p').removeClass('active');
            $(this).addClass('active');
            module.find('.fromKeywordLabel').addClass('busBtn');
            module.find('.searchBtn').attr('data-type', 'busBtn');
        });

        module.find('.searchBtn').off().click(function () {
            var fromKeyword = module.find('.fromKeyword').val();
            var dataType = $(this).attr('data-type');
            if (fromKeyword != '' && fromKeyword != null && fromKeyword != undefined) {
                var url = 'https://www.google.com/maps/dir/?api=1';
                url += '&origin='+ fromKeyword;
                url += '&destination='+ option.Latitude + ',' + option.Longitude;
                if (dataType == 'navBtn') url += '&travelmode=driving';
                else if (dataType == 'busBtn') url += '&travelmode=transit';
                window.open(url);
            }
        });
    }
}

/**
 * Fun convertGCJ02ToBD09 中国正常GCJ02坐标---->百度地图BD09坐标
 *
 * @param double $lat 纬度
 * @param double $lng 经度
 *
 * @return array
 */
function convertGCJ02ToBD09(lat, lng) {
    var arr = {};
    var xPi   = 3.14159265358979324 * 3000.0 / 180.0;
    var x     = lng;
    var y     = lat;
    var z     = Math.sqrt(x * x + y * y) + 0.00002 * Math.sin(y * xPi);
    var theta = Math.atan2(y, x) + 0.000003 * Math.cos(x * xPi);
    arr['lng']   = z * Math.cos(theta) + 0.0065;
    arr['lat']   = z * Math.sin(theta) + 0.006;

    return arr;
}

function setToAddress(moduleid, address) {
    $('#module_' + moduleid + ' .toKeyword').attr('title', address.replace(/\<br\>/ig, ''));
    $('#module_' + moduleid + ' .toKeyword').val(address.replace(/\<br\>/ig, ''));
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
        site_lang = site_lang == 'big5' ? 'cn' : site_lang
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
