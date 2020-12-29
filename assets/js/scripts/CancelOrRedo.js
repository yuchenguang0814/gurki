function cancelorredo(){
    //撤销列表
    this.cancellist=[];
    //重做列表
    this.redolist=[];
    //临时存储数据
    this.tempdata=[];
    //实例化隐藏
    var hiddenInstance=null;
    this.savecancellist=function(data){
        this.cancellist.push(data);
        //当用户重新操作的时候，需要清空重做的列表
        $.ajax(
            {
                url: "https://www.gurki99.com/index.php?c=Front/CancelOrRedo&a=clearRedoData",
                dataType: "json",
                success: function (json) {
                    this.redolist=[];
                    top.$('#wxheader').find('.icon-zhongzuo').attr('disabled','true')
                }
            });
        //先检测里面是否超过10步
        if(this.cancellist.length > 10 ){
            this.cancellist.splice(0,1);
        }
    }

    /**
     * 撤销
     * 具体思路：
     * action 是用户的操作
     * delete:用户删除动作
     * editoradd：是指前台做增加模块或者对模块进行编辑
     * move:前台移动模块
     * hidden:前台用户操作显示隐藏
     * 否则就是改变模块的数据，包括modules的数据或者modulestyle的数据
     */
    this.cancel=function(){
        //当用户点击撤销的时候，为了不让用户多次点击撤销以及重做，需要return
        if(top.$('#wxheader').find('.icon-tubiao-').attr('disabled')){
            return ;
        }
        //在队列里面拉去数据
        var data=this.cancellist.pop();
        if(data== undefined ){
            alert('无法撤销');
            return;
        }
        top.$('#wxheader').find('.icon-tubiao-').attr('disabled','true');
        top.$('#wxheader').find('.icon-zhongzuo').attr('disabled','true');
        //往重做列表里面push数据
        this.redolist.push(data);

        if(data.action=='delete'){
            this.cancelactiondel(data);
        }else if(data.action=='editoradd'){
            this.cancelactioneditoradd(data);
        }else if(data.action=='module_move' || data.action=='module_resize' || data.action=='moduleslide_move'){
            this.cancelactionmove(data);
        }else if(data.action=='module_hidden'){
            this.cancelactionhidden(data);
        }
    }

    /**
     * 用户做删除动作，需要撤销回来时候所执行的方法
     */
    this.cancelactiondel=function(data){
        $.ajax(
            {
                url: "https://www.gurki99.com/index.php?c=Front/CancelOrRedo&a=cancel",
                dataType: "json",
                beforeSend: function () {
                    var html='<div class="tplSelectMask">';
                    html += '<div class="templateLoadingPanel" style="height: 100%;position: relative;top: 40%;text-align:center">';
                    html += '<i class="fa fa-spinner fa-spin" style="font-size: 20px;color:#ffffff"></i>';
                    html += '<span style="font-size: 18px;margin-left: 10px;color:#ffffff">撤销中</span>';
                    html += '</div>';
                    html += '</div>';
                    $("body").prepend(html);
                    $('.tplSelectMask').show();
                },
                success: function (json) {
                    top.$('#wxheader').find('.icon-tubiao-').removeAttr('disabled');
                    top.$('#wxheader').find('.icon-zhongzuo').removeAttr('disabled');
                    if(!json.success){
                        alert(json.msg);
                        $('.tplSelectMask').remove();
                        return ;
                    }

                    var moduleid= 'module_'+ json.moduleid;
                    if(data.data.prevmodule_id==''&&data.data.nextmodule_id=='' ){
                        $('#'+data.zone).append(data.data.dom);
                        //  window.findEditWin().ShowModuleContainerHelper($(data.data.dom));
                        if($('#'+data.zone).children('.addnewhelper').length==1){
                            $('#'+data.zone).children('.addnewhelper').remove();
                        }
                    }
                    if(data.data.prevmodule_id=='' || data.data.prevmodule_id==undefined){
                        $("#" + data.data.nextmodule_id).before(data.data.dom);
                        $('#'+moduleid).css('display','block');
                    }else{
                        $("#" + data.data.prevmodule_id).after(data.data.dom);
                        $('#'+moduleid).css('display','block');
                    }
                    if(data.data.windowDom){
                        $('body').append(data.data.windowDom);
                    }
                    createHideShowModule()
                },
                complete(XHR, TS){
                    $('.tplSelectMask').remove();
                }
            });
    };

    /**
     * 用户做增加或编辑动作，需要撤销回来时候所执行的方法
     */
    this.cancelactioneditoradd=function(data){
        var pageid= $('body').attr('id').substr(5);
        $.ajax(
            {
                url: "https://www.gurki99.com/index.php?c=Front/CancelOrRedo&a=cancel",
                dataType: "json",
                beforeSend: function () {
                    var html='<div class="tplSelectMask">';
                    html += '<div class="templateLoadingPanel" style="height: 100%;position: relative;top: 40%;text-align:center">';
                    html += '<i class="fa fa-spinner fa-spin" style="font-size: 20px;color:#ffffff"></i>';
                    html += '<span style="font-size: 18px;margin-left: 10px;color:#ffffff">撤销中</span>';
                    html += '</div>';
                    html += '</div>';
                    $("body").prepend(html);
                    $('.tplSelectMask').show();
                },
                success: function (json) {
                    top.$('#wxheader').find('.icon-tubiao-').removeAttr('disabled');
                    top.$('#wxheader').find('.icon-zhongzuo').removeAttr('disabled');
                    if(!json.success){
                        alert(json.msg);
                        $('.tplSelectMask').remove();
                        return ;
                    }
                    var moduleid= 'module_'+ json.moduleid;
                    var location=$('#'+moduleid).parent().attr('id');
                    var isParentSlide=$('#'+moduleid).parents("[moduletype='ModuleSlideGiant']").length == 0 || $('#'+moduleid).parents("[moduletype='ModuleSlideV2Giant']").length == 0 ? true : false;

                    if(json.action=='del'){
                        $("#" + moduleid).detach();
                        if(data.data.windowDom){
                            var str = 'body>div[id$=' + data.moduleid + '],body>button[id$=' + data.moduleid + ']';
                            $("#module_" + data.moduleid).find('.ModuleItem').each(function() {
                                var childModuleID = $(this).attr('id').substr(7)
                                if (Number(childModuleID)) {
                                    str += ',body>div[id$=' + childModuleID + ']'
                                }
                            })
                            data.data.windowDom= $(str);
                            $(str).detach();
                        }
                        if($("#"+data.zone).find('.ModuleItem').length==0 && $("#"+data.zone).find('.addnewhelper').length==0 && isParentSlide){

                            if(data.zone=='BodyMain1Zone'){
                                zoneheight=200;
                                text='请把模块拖动到主体区域'
                            }else if(data.zone=='FooterZone'){
                                zoneheight=60
                                text='请把模块拖动到尾部区域'
                            }else if(data.zone=='HeaderZone'){
                                zoneheight=60
                                text='请把模块拖动到头部区域'
                            }else{
                                zoneheight=60
                                text='请把模块拖动到此区域'
                            }

                            var style = "text-align:center;height:" + zoneheight + "px;line-height:" + zoneheight + "px;color:#999999;background:#E6ECF2;margin-bottom:6px;";
                            $('#'+data.zone).append( "<div class='addnewhelper' style='" + style + "'>" + text + "</div>");
                        }
                        $('.tplSelectMask').remove();
                    }else{

                        var classIdMr = rawUrl.match(/[\?&](?:Product|News|)ClassID=(\d+)/i);
                        var classIdParam = classIdMr ? "&ClassID=" + classIdMr[1] : '';
                        $.ajax({ url: "https://www.gurki99.com/index.php?c=Front/LoadModule",
                            data: "moduleId=" + moduleid + "&SiteType=" + window.SiteType + "&PageID=" + pageid + "&location=" + location + "&loadpage=" + escape(window.Page)+ "&" + rawUrl.substring(rawUrl.indexOf("?") + 1).replace(/(((&+)|(^))[ca])=[^&]*/ig, '') + classIdParam,
                            success: function (msg) {

                                if($('.styleForModule_'+moduleid.substring(7)).length>=1){
                                    $('.styleForModule_'+moduleid.substring(7)).remove();
                                }
                                if($('#commonstyle_'+moduleid.substring(7)).length>=1){
                                    $('#commonstyle_'+moduleid.substring(7)).remove();
                                }
                                if($('#private_style_'+moduleid.substring(7)).length>=1){
                                    $('#private_style_'+moduleid.substring(7)).remove();
                                }
                                $("#" + moduleid).replaceWith(msg);
                                $('.tplSelectMask').remove();
                                if ($('#'+moduleid).attr('moduletype') == 'ModuleGridCustomGiant') {
                                    ModuleShield($("#" + moduleid));
                                    adjustModuleSlide($("#" + moduleid));
                                    addZoneTipsAll();
                                    $('#'+moduleid).DragGrid({MinWidth:40}) //自定义分栏模块重新初始化拖动条
                                    if (window['initFunc' + moduleid])
                                        window['initFunc' + moduleid]();
                                }
                            },
                            complete(XHR, TS){
                                $('.tplSelectMask').remove();
                            }
                        });
                    }
                }
            });
    };

    /**
     * 用户做移动模块，幻灯片上模块的拉伸大小，幻灯片上模块的移动
     */
    this.cancelactionmove=function(data){
        var pageid= $('body').attr('id').substr(5);
        $.ajax(
            {
                url: "https://www.gurki99.com/index.php?c=Front/CancelOrRedo&a=cancel",
                dataType: "json",
                beforeSend: function () {
                    var html='<div class="tplSelectMask">';
                    html += '<div class="templateLoadingPanel" style="height: 100%;position: relative;top: 40%;text-align:center">';
                    html += '<i class="fa fa-spinner fa-spin" style="font-size: 20px;color:#ffffff"></i>';
                    html += '<span style="font-size: 18px;margin-left: 10px;color:#ffffff">撤销中</span>';
                    html += '</div>';
                    html += '</div>';
                    $("body").prepend(html);
                    $('.tplSelectMask').show();
                },
                success: function (json) {
                    top.$('#wxheader').find('.icon-tubiao-').removeAttr('disabled');
                    top.$('#wxheader').find('.icon-zhongzuo').removeAttr('disabled');
                    if(!json.success){
                        alert(json.msg);
                        $('.tplSelectMask').remove();
                        return ;
                    }
                    if(data.action=='module_resize' || data.action=='moduleslide_move'){
                        $('#module_'+data.moduleid).css('height',data.data.start.height);
                        $('#module_'+data.moduleid).css('width',data.data.start.width);
                        $('#module_'+data.moduleid).css('top',data.data.start.top);
                        $('#module_'+data.moduleid).css('left',data.data.start.left);
                        return
                    }
                    if(data.data.start.prevmodule_id==''&&data.data.start.nextmodule_id=='' ){
                        $('#'+data.data.start.zone).append($('#module_'+data.moduleid));
                        if($('#'+data.data.start.zone).children('.addnewhelper').length==1){
                            $('#'+data.data.start.zone).children('.addnewhelper').remove();
                        }
                    }
                    //需要记录移动之前的位置。在哪个模块上面或下面。注意模块是第一位和最后一位的时候，
                    if(data.data.start.prevmodule_id=='' || data.data.start.prevmodule_id==undefined){
                        $("#" + data.data.start.nextmodule_id).before( $('#module_'+data.moduleid));
                    }else{
                        $("#" + data.data.start.prevmodule_id).after( $('#module_'+data.moduleid));
                    }
                },
                complete(XHR, TS){
                    $('.tplSelectMask').remove();
                }
            });
    };
    this.cancelactionhidden=function(data){
        $.ajax(
            {
                url: "https://www.gurki99.com/index.php?c=Front/CancelOrRedo&a=cancel",
                dataType: "json",
                beforeSend: function () {
                    var html='<div class="tplSelectMask">';
                    html += '<div class="templateLoadingPanel" style="height: 100%;position: relative;top: 40%;text-align:center">';
                    html += '<i class="fa fa-spinner fa-spin" style="font-size: 20px;color:#ffffff"></i>';
                    html += '<span style="font-size: 18px;margin-left: 10px;color:#ffffff">撤销中</span>';
                    html += '</div>';
                    html += '</div>';
                    $("body").prepend(html);
                    $('.tplSelectMask').show();
                },
                success: function (json) {
                    top.$('#wxheader').find('.icon-tubiao-').removeAttr('disabled');
                    top.$('#wxheader').find('.icon-zhongzuo').removeAttr('disabled');
                    if(!json.success){
                        alert(json.msg);
                        $('.tplSelectMask').remove();
                        return ;
                    }
                    window.addScript('../share/ZB/ModuleHiddenSetting.js'/*tpa=https://www.gurki99.com/share/ZB/ModuleHiddenSetting.js*/,function(){
                        var hideinfo
                        //实例化ModuleHiddenSetting
                        $.ajax({ url: "/index.php?c=admin/module/ModuleStyleSetting&mid=" + data.moduleid, async: false, dataType: "json",
                            success: function(json){
                                var selector = window.parent.findEditWin().$('#module_'+data.moduleid);
                                hiddenInstance = new ModuleHiddenSetting(data.moduleid,selector,json.MsModel.StyleData.Hidden);
                                data.data.hiddenInstance=hiddenInstance;
                                hiddenInstance.init();
                                hideinfo=json.MsModel.StyleData.Hidden;
                                // HiddenInfo = json.MsModel.StyleData.Hidden || "";
                                // if(HiddenInfo){
                                //     if(HiddenInfo.indexOf('mhidden-lg') > -1) setActive('pcHide');
                                //     else setActive('pcShow');
                                //     if(HiddenInfo.indexOf('mhidden-xs') > -1) setActive('phoneHide');
                                //     else setActive('phoneShow');
                                // }else{
                                //     setActive('pcShow');
                                //     setActive('phoneShow');
                                // }
                                top.$('#ModuleHiddenDialog').data('reset', hiddenInstance)
                            }
                        });
                        var hideclass;
                        var action;
                        //1.由空变为电脑隐藏/手机隐藏
                        if(data.data.initHideClass != '' && data.data.initHideClass!=data.data.hideClass && data.data.initHideClass!=null &&  !data.data.ismodule){
                            //这里为什么需要循环，因为只要有一方是隐藏的。另一端必须是显示,所以默认用户是执行两次的动作的。先点PC显示，再点手机端隐藏。
                            for(var i=0;i<=1;i++){
                                if(i== 0){
                                    hideclass ='mhidden-xs mhidden-lg mhidden-md mhidden-sm'
                                    action = 'remove'
                                }


                                if(i== 1 && data.data.hideClass.indexOf('mhidden-xs') > -1){
                                    hideclass ='mhidden-lg mhidden-md mhidden-sm'
                                    action ='add'
                                }
                                if(i== 1 && data.data.hideClass.indexOf('mhidden-xs') == -1){
                                    hideclass ='mhidden-xs'
                                    action ='add'
                                }

                                $.each(hideclass.split(/\s+/), function(index, el) {
                                    if (!hiddenInstance.setHideShow(action, el)) {
                                        flag = false
                                        resetPCShow()
                                        // 跳出each循环
                                        return false
                                    }

                                })
                                // 移除隐藏属性
                                function resetPCShow() {
                                    $.each(hideclass.split(/\s+/), function(index, el) {
                                        hiddenInstance.setHideShow('remove', el)
                                    })
                                }
                            }
                        }else{
                            for(var i=0;i<=1;i++){

                                if(i== 0){
                                    hideclass ='mhidden-xs mhidden-lg mhidden-md mhidden-sm'
                                    action = 'remove'
                                }

                                if(i== 1){
                                    hideclass=data.data.hideClass;
                                    action=data.data.action=='remove'?'add':'remove';
                                }

                                $.each(hideclass.split(/\s+/), function(index, el) {
                                    if (!hiddenInstance.setHideShow(action, el)) {
                                        flag = false
                                        resetPCShow()
                                        // 跳出each循环
                                        return false
                                    }

                                })
                                // 移除隐藏属性
                                function resetPCShow() {
                                    $.each(hideclass.split(/\s+/), function(index, el) {
                                        hiddenInstance.setHideShow('remove', el)
                                    })
                                }
                            }
                        }

                        //2.由电脑隐藏变为手机隐藏
                        //data.data.hideclass='pc ipad ipad ' add
                        //data.data.hideclass='iphone' add
                        //3.由手机隐藏变为电脑隐藏
                        //data.data.hideclass='pc ipad ipad ' add
                        //4.由有变为无
                        //data.data.hideclass='pc ipad ipad iphone' remove
                        createHideShowModule()

                    });
                },
                complete(XHR, TS){
                    $('.tplSelectMask').remove();
                }
            });
    }
    /**
     * 重做=反撤销
     * 具体思路：
     * action 是用户的操作
     * delete:用户删除动作，并撤销就是把模块加回来，重做就是把重新删除
     * editoradd：是指前台做增加模块或者对模块进行编辑，回到原来的数据
     * move:前台移动模块，回到撤销前的位置
     * hidden:前台用户操作显示隐藏
     * 否则就是改变模块的数据，包括modules的数据或者modulestyle的数据
     */
    this.redo=function(){
        //
        if(top.$('#wxheader').find('.icon-tubiao-').attr('disabled') || top.$('#wxheader').find('.icon-zhongzuo').attr('disabled') ){
            return ;
        }
        var data=this.redolist.pop();
        if(data== undefined ){
            alert('无法重做');
            return;
        }
        this.cancellist.push(data);

        if(data.action=='delete'){
            this.redoactiondel(data);
        }else if(data.action=='editoradd'){
            this.redoactioneditoradd(data);
        }else if(data.action=='module_move' || data.action=='module_resize' || data.action=='moduleslide_move'){
            this.redoactionmove(data);
        }else if(data.action=='module_hidden'){
            this.redoactionhidden(data);
        }
    }

    this.redoactiondel=function(data){
        $.ajax(
            {
                url: "https://www.gurki99.com/index.php?c=Front/CancelOrRedo&a=redo",
                dataType: "json",
                beforeSend: function () {
                    var html='<div class="tplSelectMask">';
                    html += '<div class="templateLoadingPanel" style="height: 100%;position: relative;top: 40%;text-align:center">';
                    html += '<i class="fa fa-spinner fa-spin" style="font-size: 20px;color:#ffffff"></i>';
                    html += '<span style="font-size: 18px;margin-left: 10px;color:#ffffff">重做中</span>';
                    html += '</div>';
                    html += '</div>';
                    $("body").prepend(html);
                    $('.tplSelectMask').show();
                },
                success: function (json) {
                    top.$('#wxheader').find('.icon-tubiao-').removeAttr('disabled');
                    top.$('#wxheader').find('.icon-zhongzuo').removeAttr('disabled');
                    if(!json.success){
                        alert(json.msg);
                        $('.tplSelectMask').remove();
                        return ;
                    }
                    var moduleid= 'module_'+ json.moduleid;
                    var isParentSlide=$('#'+moduleid).parents("[moduletype='ModuleSlideGiant']").length==0 || $('#'+moduleid).parents("[moduletype='ModuleSlideV2Giant']").length == 0 ? true : false;
                    $('#'+moduleid).detach();
                    if(data.data.windowDom){
                        $(data.data.windowDom).detach();
                    }
                    if($("#"+data.zone).find('.ModuleItem').length==0 && $("#"+data.zone).find('.addnewhelper').length==0 && isParentSlide){

                        if(data.zone=='BodyMain1Zone'){
                            zoneheight=200;
                            text='请把模块拖动到主体区域'
                        }else if(data.zone=='FooterZone'){
                            zoneheight=60
                            text='请把模块拖动到尾部区域'
                        }else if(data.zone=='HeaderZone'){
                            zoneheight=60
                            text='请把模块拖动到头部区域'
                        }else{
                            zoneheight=60
                            text='请把模块拖动到此区域'
                        }

                        var style = "text-align:center;height:" + zoneheight + "px;line-height:" + zoneheight + "px;color:#999999;background:#E6ECF2;margin-bottom:6px;";
                        $('#'+data.zone).append( "<div class='addnewhelper' style='" + style + "'>" + text + "</div>");
                        top.$('#wxheader').find('.icon-tubiao-').removeAttr('disabled');
                        top.$('#wxheader').find('.icon-zhongzuo').removeAttr('disabled');
                    }
                },
                complete(XHR, TS){
                    $('.tplSelectMask').remove();
                }
            });
    };

    this.redoactioneditoradd = function(data){
        var pageid= $('body').attr('id').substr(5);
        $.ajax(
            {
                url: "https://www.gurki99.com/index.php?c=Front/CancelOrRedo&a=redo",
                dataType: "json",
                beforeSend: function () {
                    var html='<div class="tplSelectMask">';
                    html += '<div class="templateLoadingPanel" style="height: 100%;position: relative;top: 40%;text-align:center">';
                    html += '<i class="fa fa-spinner fa-spin" style="font-size: 20px;color:#ffffff"></i>';
                    html += '<span style="font-size: 18px;margin-left: 10px;color:#ffffff">重做中</span>';
                    html += '</div>';
                    html += '</div>';
                    $("body").prepend(html);
                    $('.tplSelectMask').show();
                },
                success: function (json) {
                    top.$('#wxheader').find('.icon-tubiao-').removeAttr('disabled');
                    top.$('#wxheader').find('.icon-zhongzuo').removeAttr('disabled');
                    if(!json.success){
                        $('.tplSelectMask').remove();
                        alert(json.msg);
                        return ;
                    }
                    var moduleid= 'module_'+ json.moduleid;
                    var location=$('#'+moduleid).parent().attr('id');

                    if(json.action=='add'){
                        if(data.data.prevmodule_id==''&&data.data.nextmodule_id=='' ){

                            $('#'+data.zone).append(data.data.dom);
                            if($('#'+data.zone).children('.addnewhelper').length==1){
                                $('#'+data.zone).children('.addnewhelper').remove();
                            }
                        }
                        //需要记录移动之前的位置。在哪个模块上面或下面。注意模块是第一位和最后一位的时候，
                        if(data.data.prevmodule_id=='' || data.data.prevmodule_id==undefined){
                            $("#" + data.data.nextmodule_id).before( data.data.dom);
                        }else{
                            $("#" + data.data.prevmodule_id).after( data.data.dom);
                        }
                        if(data.data.windowDom){
                            $('body').append(data.data.windowDom);
                        }
                        $('.tplSelectMask').remove();
                    }else{
                        var classIdMr = rawUrl.match(/[\?&](?:Product|News|)ClassID=(\d+)/i);
                        var classIdParam = classIdMr ? "&ClassID=" + classIdMr[1] : '';
                        $.ajax({ url: "https://www.gurki99.com/index.php?c=Front/LoadModule",
                            data: "moduleId=" + moduleid + "&SiteType=" + window.SiteType + "&PageID=" + pageid + "&location=" + location + "&loadpage=" + escape(window.Page)+ "&" + rawUrl.substring(rawUrl.indexOf("?") + 1).replace(/(((&+)|(^))[ca])=[^&]*/ig, '') + classIdParam,
                            success: function (msg) {
                                if($('.styleForModule_'+moduleid.substring(7)).length>=1){
                                    $('.styleForModule_'+moduleid.substring(7)).remove();
                                }
                                if($('#commonstyle_'+moduleid.substring(7)).length>=1){
                                    $('#commonstyle_'+moduleid.substring(7)).remove();
                                }
                                if($('#private_style_'+moduleid.substring(7)).length>=1){
                                    $('#private_style_'+moduleid.substring(7)).remove();
                                }
                                $("#" + moduleid).replaceWith(msg);
                            },
                            complete(XHR, TS){
                                $('.tplSelectMask').remove();
                            }
                        });
                    }
                }
            });
    };

    this.redoactionmove=function(data){
        var pageid= $('body').attr('id').substr(5);
        $.ajax(
            {
                url: "https://www.gurki99.com/index.php?c=Front/CancelOrRedo&a=redo",
                dataType: "json",
                beforeSend: function () {
                    var html='<div class="tplSelectMask">';
                    html += '<div class="templateLoadingPanel" style="height: 100%;position: relative;top: 40%;text-align:center">';
                    html += '<i class="fa fa-spinner fa-spin" style="font-size: 20px;color:#ffffff"></i>';
                    html += '<span style="font-size: 18px;margin-left: 10px;color:#ffffff">重做中</span>';
                    html += '</div>';
                    html += '</div>';
                    $("body").prepend(html);
                    $('.tplSelectMask').show();
                },
                success: function (json) {
                    top.$('#wxheader').find('.icon-tubiao-').removeAttr('disabled');
                    top.$('#wxheader').find('.icon-zhongzuo').removeAttr('disabled');
                    if(!json.success){
                        alert(json.msg);
                        $('.tplSelectMask').remove();
                        return ;
                    }

                    if(data.action=='module_resize' || data.action=='moduleslide_move'){
                        $('#module_'+data.moduleid).css('height',data.data.end.height);
                        $('#module_'+data.moduleid).css('width',data.data.end.width);
                        $('#module_'+data.moduleid).css('top',data.data.end.top);
                        $('#module_'+data.moduleid).css('left',data.data.end.left);
                        $('.tplSelectMask').remove();
                        return
                    }
                    if(data.data.end.prevmodule_id==''&&data.data.end.nextmodule_id=='' ){
                        $('#'+data.data.end.zone).append($('#module_'+data.moduleid));
                    }
                    if($('#'+data.data.end.zone).children('.addnewhelper').length==1){
                        $('#'+data.data.end.zone).children('.addnewhelper').remove();
                    }

                    //需要记录移动之前的位置。在哪个模块上面或下面。注意模块是第一位和最后一位的时候，
                    if(data.data.end.prevmodule_id=='' || data.data.end.prevmodule_id==undefined){
                        $("#" + data.data.end.nextmodule_id).after( $('#module_'+data.moduleid));
                    }else{
                        $("#" + data.data.end.prevmodule_id).before( $('#module_'+data.moduleid));
                    }
                },
                complete(XHR, TS){
                    $('.tplSelectMask').remove();
                }
            });
    };

    this.redoactionhidden=function (data){
        $.ajax(
            {
                url: "https://www.gurki99.com/index.php?c=Front/CancelOrRedo&a=redo",
                dataType: "json",
                beforeSend: function () {
                    var html='<div class="tplSelectMask">';
                    html += '<div class="templateLoadingPanel" style="height: 100%;position: relative;top: 40%;text-align:center">';
                    html += '<i class="fa fa-spinner fa-spin" style="font-size: 20px;color:#ffffff"></i>';
                    html += '<span style="font-size: 18px;margin-left: 10px;color:#ffffff">重做中</span>';
                    html += '</div>';
                    html += '</div>';
                    $("body").prepend(html);
                    $('.tplSelectMask').show();
                },
                success: function (json) {
                    top.$('#wxheader').find('.icon-tubiao-').removeAttr('disabled');
                    top.$('#wxheader').find('.icon-zhongzuo').removeAttr('disabled');
                    if(!json.success){
                        alert(json.msg);
                        $('.tplSelectMask').remove();
                        return ;
                    }
                    //1.由空变为电脑隐藏/手机隐藏
                    console.log(data);
                    if(data.data.initHideClass != '' && data.data.initHideClass!=data.data.hideClass && data.data.initHideClass!=null &&  !data.data.ismodule){
                        //这里为什么需要循环，因为只要有一方是隐藏的。另一端必须是显示,所以默认用户是执行两次的动作的。先点PC显示，再点手机端隐藏。
                        for(var i=0;i<=1;i++){
                            if(i== 0){
                                hideclass ='mhidden-xs mhidden-lg mhidden-md mhidden-sm'
                                action = 'remove'
                            }

                            if(i== 1 && data.data.hideClass.indexOf('mhidden-xs') > -1){
                                hideclass ='mhidden-xs'
                                action ='add'
                            }
                            if(i== 1 && data.data.hideClass.indexOf('mhidden-xs') == -1){
                                hideclass ='mhidden-lg mhidden-md mhidden-sm'
                                action ='add'
                            }

                            $.each(hideclass.split(/\s+/), function(index, el) {
                                if (!hiddenInstance.setHideShow(action, el)) {
                                    flag = false
                                    resetPCShow()
                                    // 跳出each循环
                                    return false
                                }

                            })
                            // 移除隐藏属性
                            function resetPCShow() {
                                $.each(hideclass.split(/\s+/), function(index, el) {
                                    hiddenInstance.setHideShow('remove', el)
                                })
                            }
                        }
                    }else{
                        console.log(data.data.hiddenInstance);
                        for(var i=0;i<=1;i++){
                            if(i== 0){
                                hideclass ='mhidden-xs mhidden-lg mhidden-md mhidden-sm'
                                action = 'remove'
                            }

                            if(i== 1){
                                hideclass=data.data.hideClass;
                                action=data.data.action;
                            }

                            $.each(hideclass.split(/\s+/), function(index, el) {
                                if (!data.data.hiddenInstance.setHideShow(action, el)) {
                                    flag = false
                                    resetPCShow()
                                    // 跳出each循环
                                    return false
                                }

                            })
                            // 移除隐藏属性
                            function resetPCShow() {
                                $.each(hideclass.split(/\s+/), function(index, el) {
                                    data.data.hiddenInstance.setHideShow('remove', el)
                                })
                            }
                        }
                    }
                    createHideShowModule()
                    //2.由电脑隐藏变为手机隐藏
                    //data.data.hideclass='pc ipad ipad ' add
                    //data.data.hideclass='iphone' add
                    //3.由手机隐藏变为电脑隐藏
                    //data.data.hideclass='pc ipad ipad ' add
                    //4.由有变为无
                    //data.data.hideclass='pc ipad ipad iphone' remove
                },
                complete(XHR, TS){
                    $('.tplSelectMask').remove();
                }
            });
    }

}
