
var YH_JS={
			//事件对象
			EVENT:{
				addEvent : function( obj, type, fn ) {
				  if (obj.addEventListener)
					  obj.addEventListener( type, fn, false );
				  else if (obj.attachEvent) {
					  obj.attachEvent("on"+type,fn,false);
				  }
				},
				removeEvent:function( obj, type, fn ){
					 if (obj.removeEventListener)
						  obj.removeEventListener( type, fn, false );
					  else if (obj.detachEvent) {
							obj.detachEvent("on"+type,fn,false);
					  }	
				}
			},
			processThis:function(obj,fn){
				return function(e){fn.call(obj,e)}
			}
		}
	var rateobj={
			hasPrototype:false,
			rateObj:null,
			m_start_left:0,
			m_end_left:0,
			newPosi:0,
			minVal:0.1,
			maxVal:10,
			nowPosition:0,
			barLenth:null,
			ratio:null,
			inputObj:null,
			rateBar:null,
			userSelect:null,
			newRate:function(ele){
				var ele=ele||{}
				if(this.hasPrototype==false){
					this.init.prototype=rateobj;
					this.hasPrototype=true;
				};
				return new this.init(ele);
			},
			setPositionFn : function(){
				return function(setVal,maxVal,minVal){
					var setVal=Number(setVal),
						maxVal=Number(maxVal),
						minVal=Number(minVal);
						//console.log(setVal+"||"+maxVal+"||"+minVal);
						if(setVal && setVal>minVal && setVal<maxVal){
							this.maxVal=maxVal;
							this.minVal=minVal;
							var leftPosi = (setVal-minVal)/this.ratio;
							//console.log("leftPosi"+leftPosi);
							console.log($(this.rateObj));
							$(this.rateObj).css({"left":leftPosi+"px"});
							$("#inputObj").val(setVal);	
							$(".min-val").val(maxVal);
							$(".max-val").val(minVal);
						}	
				}
			},	
			mousemove:function(){
				var e=e||arguments[0];
				var a=e.clientX-this.m_start_left+this.nowPosition;
				if(a<0){
					a=0;
				}else if(a>this.barLength){
					a=this.barLength;
				}
				$(this.rateObj).css({"left":a+"px"});	
				//设置val值
				var mid_radio=this.ratio*a+this.minVal+"";							
				var str=Number(mid_radio).toFixed(1);//取小数点后一位,四舍五入
				$(this.inputObj).val(str);
			},
			getRatio:function(){
				this.ratio=(this.maxVal-this.minVal)/this.barLength;
			},
			mousedown:function(){
				var e= e||arguments[0];
				_this=this;
				_this.m_start_left=e.clientX;
				_this.nowPosition=parseInt($(_this.rateObj).css("left"));
				//当鼠标移动的时候，记录移动了多少。
				var bar=null;
				if($(_this.rateObj).get(0).setCapture){
					$(_this.rateObj).get(0).setCapture();
					bar=$(_this.rateObj).get(0);
				}else{
					bar=$(document).get(0);
				}
				if(typeof _this.userSelect === "string"){
					document.documentElement.style[_this.userSelect] = "none";
				}
				document.unselectable  = "on";
				document.onselectstart = function(){
				   return false;
				}
				YH_JS.EVENT.addEvent(bar,"mousemove",_this.MOUSEMOVE);
				YH_JS.EVENT.addEvent(bar,"mouseup",_this.MOUSEUP);
			},
			mouseup:function(){
				//console.log("up");
				if(typeof this.userSelect === "string"){
					document.documentElement.style[this.userSelect] = "text";
				}
				document.unselectable  = "off";
				document.onselectstart = null;
				var bar=null;
				if($(this.rateObj).get(0).releaseCapture){
					$(this.rateObj).get(0).releaseCapture();	
					bar = $(this.rateObj).get(0);
				}else{
					bar = document;
				}	
				YH_JS.EVENT.removeEvent(bar,"mousemove",this.MOUSEMOVE);
				YH_JS.EVENT.removeEvent(bar,"mouseup",this.MOUSEUP);
				return false;
			},
			getUserSelect:function(){
				  var prefixes = ['', '-ms-','-moz-', '-webkit-', '-khtml-', '-o-'];
				  var reg_cap = /-([a-z])/g;
				  function getStyleName(css, el) {
					el = el || document.documentElement;
					var style = el.style,test;
					for (var i=0, l=prefixes.length; i < l; i++) {
					  test = (prefixes[i] + css).replace(reg_cap,function($0,$1){
						return $1.toUpperCase();
					  });
					  if(test in style){
						return test;
					  }
					}
					return null;
				  }
				  return getStyleName;	
			},
			getBarLength:function(){
				var _this=this;
				var len=parseInt($(_this.rateBar).css("width"))-parseInt($(_this.rateObj).css("width"));
				return len;
			},
			init:function(ele){
				_this=this;
				_this.rateObj=ele.rateObj;
				_this.rateBar=ele.rateBar;
				_this.barLength=ele.barLength;
				_this.MOUSEDOWN=YH_JS.processThis(_this,_this.mousedown);
				_this.MOUSEMOVE=YH_JS.processThis(_this,_this.mousemove);
				_this.MOUSEUP=YH_JS.processThis(_this,_this.mouseup);
				//绑定事件
				YH_JS.EVENT.addEvent($(_this.rateObj).get(0),"mousedown",_this.MOUSEDOWN);
				YH_JS.EVENT.addEvent($(_this.rateObj).get(0),"mouseup",_this.MOUSEUP);
				_this.inputObj=ele.inputObj;
				_this.barLength=_this.getBarLength();
				_this.getRatio();
				_this.userSelect=_this.getUserSelect()("user-select");
				_this.setPosition=_this.setPositionFn();
			}
	};
	var obj={rateObj:'#rate-box .rate-move',rateBar:'#rate-box .rate-bar',maxVal:10,minVal:0.1,inputObj:"#ex6SliderVal"};
	var obj2={rateObj:'#rate-box2 .rate-move',rateBar:'#rate-box2 .rate-bar',maxVal:10,minVal:0.1,inputObj:"#ex6SliderVal2"};
	$(document).ready(function(e) {
		var newrate1=rateobj.newRate(obj);
		var newrate2=rateobj.newRate(obj2);
	});