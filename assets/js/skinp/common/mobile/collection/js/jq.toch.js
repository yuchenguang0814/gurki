/**
 * 用该方法的时候千万记住不要用它的方法名作为var,不然报错!!!
 * @param positions
 */
function jQtochfn(positions){
	this.positions =  $.extend({
		obj:null,
		tochStart:null,
		tochMove:null,
		tochEnd:null
	},positions);
	this.startX = 0;//触摸初始x值
	this.startY = 0;//触摸初始y值
	this.chaX   = 0;//触摸初始与手中滑动过程中的x的差值(和触摸结束)
	this.chaY   = 0;//触摸初始与手中滑动过程中的y的差值(和触摸结束)
	this.direction = {
        x:0,
        y:0
	}

	var jQtochThat = this;
    this.update = function(){
        if($(this.positions.objID).find(".collect-list-pro").length>0){
            $(this.positions.objID).find(".collect-list-pro").off("touchstart").on("touchstart",function(e){
            jQtochThat.tohStartFn(e,this);
            })
            $(this.positions.objID).find(".collect-list-pro").off("touchmove").on("touchmove",function(e){
                jQtochThat.tochMoveFn(e,this);
            })
            $(this.positions.objID).find(".collect-list-pro").off("touchend").on("touchend",function(e){
                jQtochThat.tochEndFn(e,this);
            })
        }else{
            $(this.positions.objID).off("touchstart").on("touchstart",function(e){
                jQtochThat.tohStartFn(e,this);
            })
            $(this.positions.objID).off("touchmove").on("touchmove",function(e){
                jQtochThat.tochMoveFn(e,this);
            })
            $(this.positions.objID).off("touchend").on("touchend",function(e){
                jQtochThat.tochEndFn(e,this);
            })

        }

    },
     this.update();
	
}
jQtochfn.prototype.tohStartFn = function(e,oSelf){
	e = window.event || e;
	if (e.touches) {
        this.startX = e.targetTouches[0].clientX;
        this.startY = e.targetTouches[0].clientY;
    } else {
        this.startX = e.clientX;
        this.startY = e.clientY;
    };
    if(typeof this.positions.tochStart == "function"){
    	this.positions.tochStart(e,this.startX,this.startY,oSelf,this.positions)
    }
}

jQtochfn.prototype.tochMoveFn = function(e,oSelf){
	e = window.event || e;
    if (e.touches) {
        //移动端
        this.chaX = e.targetTouches[0].clientX - this.startX;
        this.chaY = e.targetTouches[0].clientY - this.startY;
    } else {
        //pc端
        this.chaX = e.clientX - this.startX;
        this.chaY = e.clientY - this.startY;
    };
    this.direction.x = this.chaX;
    this.direction.y = this.chaY;
    if(typeof this.positions.tochMove == "function"){
    	this.positions.tochMove(e,this.direction,oSelf,this.positions)
    }

}
jQtochfn.prototype.tochEndFn = function(e,oSelf){
	e = window.event || e;
    if(e.changedTouches){
        // 移动端
        this.chaX = e.changedTouches[0].clientX - this.startX;
        this.chaY = e.changedTouches[0].clientY - this.startY;

    } else {
        //pc端
        this.chaX = e.clientX - this.startX;
        this.chaY = e.clientY - this.startY;
    };
    
    this.direction.x = this.chaX;
    this.direction.y = this.chaY;
    if(typeof this.positions.tochEnd == "function"){
    	this.positions.tochEnd(e,this.direction,oSelf,this.positions)
    };
}


