angular.module("directives",[])
/**
 * 计时器
 * 例子：
 * 		<timer format="y-M-d h:mm:ss"></timer>
 * 		<span timer="y-M-d h:mm:ss"></span>
 */
.directive('timer', ['$interval','dateFilter', function($interval,dateFilter){
	return {
		restrict: 'EA', // E = Element, A = Attribute, C = Class, M = Comment
		link: function($scope, iElm, iAttrs) {
			var format		= iAttrs.timer || iAttrs.format || "M/d/yy h:mm:ss a";
			var interval 	= null;
			function updateTime(){
				iElm.text(dateFilter(new Date(),format));
			}
			interval 		= $interval(updateTime,1000);
			$scope.$on('$destroy', function(e) {
				$interval.cancel(interval);
			});
		}
	};
}])
.directive('slide',function($interval){
	return {
		restrict 	: 'EA', // E = Element, A = Attribute, C = Class, M = Comment
		link 		: function($scope, iElm, iAttrs){
			var selector 		= {
				'container'		: '.slide-container',
				'wrapper'		: '.slide-wrapper',
				'item'			: '.slide-item',
				'pagination'	: '.slide-pagination',
				'arrows'		: '.slide-arrow'
			};
			var itemTag 		= iAttrs.tag || selector.item;
			var items 			= iElm.find(itemTag);
			var pagination		= iElm.find(selector.pagination);
			var arrows 			= iElm.find(selector.arrows);
			var count 			= items.size();
			var i 				= 0;
			var interval		= null;
			iElm.css({
				'position': 'relative',
				'overflow': 'hidden'
			});
			items.css('z-index','10000');
			items.hide();
			items.first().show();
			items.each(function(i){
				pagination.append('<span>'+(i+1)+'</span>');
			});
			pagination 			= pagination.find('span');
			$scope.$on('$destroy',function(e){
				$interval.cancel(interval);
			});
			var slide 			= function(step){
				items.eq(i).css('z-index','10001').fadeOut(2000);
				i 				= (i+step) % count;
				items.eq(i).css('z-index','10000').show();
				pagination.removeClass('active').eq(i).addClass('active');
			}
			pagination.click(function(){
				var index 		= pagination.index(this);
				alert(index)
			});
			iElm.hover(function(){
				arrows.css('opacity',1);
				$interval.cancel(interval);
			},function(){
				arrows.css('opacity',0.3);
				slides(1);
			});
			arrows.filter('.prev').click(function(){
				slide(-1);
			});
			arrows.filter('.next').click(function(){
				slide(1);
			});
		}
	};
})
/**
 * 倒计数
 * 例子：
 * 		<wait:second seconds="10"></wait:second>
 * 		<span wait:second seconds="10"></span>
 * 		<span wait:second="10"></span>
 * 		<span wait-second seconds="10"></span>
 * 		<span wait-second="10"></span>
 * 		<span class="waitSecond" seconds="10"></span>
 */
.directive('waitSecond', ['$timeout','$location',function($timeout,$location){
	return {
		restrict: 'EAC', // E = Element, A = Attribute, C = Class, M = Comment
		link: function($scope, iElm, iAttrs, controller) {
			var seconds		= iAttrs.waitSecond  || iAttrs.seconds  || 5;
			var jump		= iAttrs.jump;
			var timeout 	= null;
			(function waitSecond(){
				iElm.text(seconds--);
				if(seconds>=0){
					timeout = $timeout(waitSecond,1000);
				}else if(jump){
					$location.path(jump);
				}else{
					iElm.hide();
				}
			})();
			$scope.$on('$destroy', function(e) {
				$timeout.cancel(timeout);
			});
		}
	};
}])
/**
 * 对齐
 */
.directive('section', function(){
	return {
		restrict 	: 'C',
		link 		: function($scope, iElm, iAttrs) {
			// alert(iElm.offset().top)
			// alert(iElm.outerHeight())
			// alert($($window).outerHeight(true))
			// alert($($window).height() - iElm.offset().top);
			iElm.css('min-height',$(window).height() - iElm.offset().top);
		}
	};
})
/**
 * 验证码
 * 例子：
 * 		<captcha seconds="10"></captcha>
 * 		<span captcha seconds="10"></span>
 * 		<span captcha="10"></span>
 * 		<span class="captcha" seconds="10"></span>
 */
.directive('captcha', ['$timeout','$http',function($timeout,$http){
	return {
		restrict 	: 'A',
		link 		: function($scope, iElm, iAttrs, controller) {
			var text 		= ['获取验证码','重新获取(0)']
			var seconds		= iAttrs.seconds  || 60;
			var second 		= seconds;
			var timeout 	= null;
			iElm.attr('disabled',false);
			function waitSecond(){
				iElm.text(text[1].replace(/\d/,--second));
				if(second>0){
					timeout = $timeout(waitSecond,1000);
				}else{
					iElm.attr('disabled',false);
					iElm.text(text[0]);
				}
			};
			iElm.click(function(){
				var telphone 	= $(":input[name="+iAttrs.captcha+"]",iElm[0].form).val();
				if(!telphone){
					alert("请输入手机号码！");
				}else if(!/^\d{11}$/.test(telphone)){
					alert("请输入11位手机号码！");
				}else{
					iElm.prev().val('');
					second 		= seconds;
					$http.post('?s=Index/captcha',{telphone:telphone}).success(function(data){
						// alert(angular.toJson(data))
						switch(data.error){
							case 0:
								iElm.attr('disabled',true);
								waitSecond();
								break;
							case -1:
								alert('获取验证码失败！');
								break;
							default:
								alert(data.msg);
						}
						if(data['result']){
							iElm.prev().val(data['captcha']);
						}
					});
				}
			});
			$scope.$on('$destroy', function(e) {
				$timeout.cancel(timeout);
			});
		}
	};
}])
/**
 * 密码眼睛                                                                                                                                                                                                                  [description]
 */
.directive('eye', function(){
	return {
		restrict 	: 'C',
		link 		: function($scope, iElm, iAttrs){
			var state 		= 0;
			var status 		= [
				{'class':'glyphicon-eye-close','type':'password'},
				{'class':'glyphicon-eye-open','type':'text'}
			];
			iElm.css('cursor','pointer');
			iElm.addClass('glyphicon');
			iElm.addClass(status[state]['class']);
			iElm.click(function(){
				iElm.removeClass(status[state]['class']);
				state 		= state?state ^ 1:state | 1;
				iElm.addClass(status[state]['class']);
				iElm.prev().attr('type',status[state]['type']);
			});
		}
	};
})
.directive('submit', function($http){
	return {
		restrict 	: 'C',
		link 		: function($scope, iElm, iAttrs){
			var form 	= $(iElm[0].form);
			var action 	= form.attr('action') || location.search;
			iElm.click(function(){
				$http.post(action,params(form.serializeArray())).success(function(data){
					// alert(angular.toJson(data))
					if(data['success']){
						form.submit();
					}else{
						$scope.$parent.error 	= data['msg'];
					}
				});
				return false;
			});
		}
	};
})
/**
 * 等待字符串
 * 例子：
 * 		<wait:loading num="10"></wait:loading>
 * 		<span wait:loading num="10"></span>
 * 		<span wait:loading="10"></span>
 * 		<span wait-loading seconds="10"></span>
 * 		<span wait-loading="10"></span>
 */
.directive('waitLoading', ['$interval',function($interval){
	return {
		restrict: 'EA', // E = Element, A = Attribute, C = Class, M = Comment
		link: function($scope, iElm, iAttrs, controller) {
			var num			= (iAttrs.num || 3) * 1 + 1;
			var mask		= iAttrs.waitLoading || '.';
			var interval 	= null;
			var i 			= 0;
			function updateTime(){
				i++;
				iElm.text(Array(i % num + 1).join(mask));
			}
			interval 		= $interval(updateTime,500);
			$scope.$on('$destroy', function(e) {
				$interval.cancel(interval);
			});
		}
	};
}])
.directive('ngTemplate',function($compile,$sce){
	return {
		restrict 	: 'A',
		link 		: function($scope, iElm, iAttrs){
			$scope.$watch(iAttrs.ngTemplate, function(newValue, oldValue){
				if(angular.isObject(newValue)){
					newValue	= $sce.getTrustedHtml(newValue);
				}
				var html 		= angular.element('<div></div>').html(newValue);
				var compiled	= $compile(html)($scope);
				iElm.html(compiled.contents());
			});
		}
	};
})
/**
 * <btn:link icon="user" disabled="!selected" href="{:JU('status?ids=__VALUE__&val=1')}" value="{{ids|join}}">批量启用</btn:link>
 */
.directive('btnLink',function($compile){
	return {
		restrict 	: 'E',
		scope 		: {
			disabled 	: '=?',
			value 		: '@'
		},
		link 		: function($scope, iElm, iAttrs){
			var cl 	= iAttrs.click?' onclick="'+iAttrs.click+'"':'';
			var h 	= (iAttrs.href||'').replace(/__VALUE__/ig,'{{value}}');
			var t 	= iElm.html();
			var i 	= iAttrs.icon?'<i class="glyphicon glyphicon-'+iAttrs.icon+'"></i> ':'';
			var a	= '<a ng-if="!disabled" class="btn btn-sm btn-default" href="'+h+'"'+cl+'>'+i+t+'</a>';
			var b	= '<b ng-if="disabled" class="btn btn-sm btn-default disabled">'+i+t+'</b>';
			var c	= '<div>'+a+b+'</div>';
			var d	= $compile(c)($scope);
			iElm.replaceWith(d.contents());
		}
	};
})
/**
 * <btn:delete icon="trash" disabled="!selected" href="{:JU('status?ids=__VALUE__')}" value="{{ids|join}}">批量删除</btn:delete>
 */
.directive('btnDelete',function($compile){
	return {
		restrict 	: 'E',
		scope 		: {
			disabled 	: '=?',
			value 		: '@'
		},
		link 		: function($scope, iElm, iAttrs){
			var cl 	= "return confirm('"+(iAttrs.confrm||'您确定要批量删除吗？')+"')";
			var t 	= iElm.html();
			var c 	= '<div><btn:link disabled="disabled" icon="'+iAttrs.icon+'" href="'+iAttrs.href+'" value="{{value}}" click="'+cl+'">'+(t||'删除')+'</btn:link></div>';
			var d	= $compile(c)($scope);
			iElm.replaceWith(d.contents());
		}
	};
})
.directive('btn',function($compiler,$parse){
	return {
		restrict 	: 'E',
		replace		: true,
		scope 		: {
			disable	: '=?',
			style	: '@',
			icon	: '@',
			title	: '@',
			text	: '@'
		},
		link 		: function($scope, iElm, iAttrs){
			var fn 			= $parse(iAttrs.ngClick,null,true);
			$scope.text 	= $scope.text || iElm.html();
			$scope.title 	= $scope.title || iElm.html();
			$scope.style 	= $scope.style || 'btn-default';
			// ['btn-default','btn-primary','btn-success','btn-info','btn-warning','btn-danger','btn-link'];
			$compiler({
				element 	: iElm,
				scope 		: $scope,
				template 	: '<button ng-if="!disable" type="button" class="btn btn-sm" ng-class="style" ng-click="$click()" title="{{title}}">'
					+'<i ng-if="icon" class="glyphicon glyphicon-{{icon}}"></i> '
					+'{{text}}'
					+'</button>'
					+'<div class="btn btn-sm disabled" ng-class="style" ng-if="disable">'
					+'<i ng-if="icon" class="glyphicon glyphicon-{{icon}}"></i> '
					+'{{text}}'
					+'</div>'
			});
			$scope.$click 	= function(){
				fn($scope.$parent);
			}
		}
	};
})
.directive('btnIf',function($compiler,$parse){
	return {
		restrict 	: 'E',
		replace		: true,
		scope 		: {
			disable	: '=?',
			name	: '=?',
			value	: '=?'
		},
		link 		: function($scope, iElm, iAttrs){
			var fn 			= $parse(iAttrs.ngClick,null,true);
			var styles		= (iAttrs.style || 'btn-default|btn-default').split('|');
			var icons  		= (iAttrs.icon || 'remove|ok').split('|');
			var titles 		= (iElm.html() || '禁用|启用').split('|');
			var status 		= iAttrs.status || 1;
			$scope.value 	= $scope.value || 1;
			$compiler({
				element 	: iElm,
				scope 		: $scope,
				template 	: '<btn style="{{style}}" icon="{{icon}}" ng-click="$click()" disable="disable" title="{{title}}" text="{{text}}"></btn>'
			});
			$scope.$click 	= function(){
				$scope.name 		^= $scope.value;
				fn($scope.$parent);
			}
			$scope.$watch('name',function(newValue, oldValue, scope){
				if(newValue & $scope.value){
					$scope.style	= styles[1];
					if(status & 1) $scope.icon		= icons[1];
					$scope.title 	= titles[1];
					if(status & 2) $scope.text 	= titles[1];
				}else{
					$scope.style	= styles[0];
					if(status & 1) $scope.icon		= icons[0];
					$scope.title 	= titles[0];
					if(status & 2) $scope.text 	= titles[0];
				}
			});
		}
	};
})
.directive('btnIcon',function($compiler,$parse){
	return {
		restrict 	: 'E',
		replace		: true,
		scope 		: {
			disable	: '=?',
			icon	: '@',
			title	: '@',
		},
		link 		: function($scope, iElm, iAttrs){
			var fn 			= $parse(iAttrs.ngClick,null,true);
			$scope.title 	= $scope.title || iElm.html();
			$compiler({
				element 	: iElm,
				scope 		: $scope,
				template 	: '<btn icon="{{icon}}" ng-click="$click()" disable="disable" title="{{title}}"></btn>'
			});
			$scope.$click 	= function(){
				fn($scope.$parent);
			}
		}
	};
})
.directive('btnButton',function($parse,$compile){
	return {
		restrict 	: 'E',
		scope 		: {
			disabled 	: '=?'
		},
		link 		: function($scope, iElm, iAttrs){
			var fn 			= $parse(iAttrs.click,null,true);
			$scope.$click 	= function(){
				fn($scope.$parent);
			}
			var t 	= iElm.html();
			var i 	= iAttrs.icon?'<i class="glyphicon glyphicon-'+iAttrs.icon+'"></i> ':'';
			var a	= '<button ng-if="!disabled" type="button" class="btn btn-sm btn-default" ng-click="$click()" title="'+(iAttrs.title||t)+'">'+i+t+'</button>';
			var b	= '<b ng-if="disabled" class="btn btn-sm btn-default disabled">'+i+t+'</b>';
			var c	= '<div>'+a+b+'</div>';
			var d	= $compile(c)($scope);
			iElm.replaceWith(d.contents());
		}
	};
})
.directive('btnButtonIcon',function($parse,$compile){
	return {
		restrict 	: 'E',
		scope 		: {
			disabled 	: '=?',
			icon 		: '@'
		},
		link 		: function($scope, iElm, iAttrs){
			var h 	= iElm.html();
			$scope.$glyphicon	= function(){
				var icons 		= {
					'save'		: {icon:'floppy-save',text:'保存'},
					'up'		: {icon:'arrow-up',text:'向上'},
					'down'		: {icon:'arrow-down',text:'向下'},
					'edit'		: {icon:'edit',text:'编辑'},
					'modify'	: {icon:'pencil',text:'修改'},
					'delete'	: {icon:'trash',text:'删除'},
					'remove'	: {icon:'remove',text:'移除'},
					'select'	: {icon:'ok',text:'选择'},
					'view'		: {icon:'list-alt',text:'查看'},
				};
				return icons[$scope.icon];
			}
			var fn 			= $parse(iAttrs.click,null,true);
			$scope.$click 	= function(){
				fn($scope.$parent);
			}
			var o 	= $scope.$glyphicon();
			var i 	= o.icon||$scope.icon;
			var t 	= h || o.text;
			var b	= '<div><btn:button disabled="disabled" icon="'+i+'" click="$click()" title="'+t+'"></btn:button></div>';
			var d	= $compile(b)($scope);
			iElm.replaceWith(d.contents());
		}
	};
})
.directive('btnDownload',function($compile,$http){
	return {
		restrict 	: 'E',
		scope 		: {
			disabled 	: '=?',
			data 		: '=?'
		},
		link 		: function($scope, iElm, iAttrs){
			var i 	= iAttrs.icon||'download';
			var t 	= iElm.html() || '下载';
			var c 	= '<div><btn:button disabled="disabled" icon="'+i+'" click="$click()">'+t+'</btn:button></div>';
			var d	= $compile(c)($scope);
			iElm.replaceWith(d.contents());
			$scope.$click 	= function(){
				$http({
					url: iAttrs.href,
					method: "POST",
					responseType: 'arraybuffer',
					data: $scope.data || null,
					headers: {
						'Content-type': 'application/json',
						// 'Accept-Charset': 'utf-8',
						'Accept': 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
					}
				}).success(function(data, status, headers, config){
					alert(1)
					// alert(urldecode(headers('Content-Disposition').match(/\"(.+?)\"/)[1]))
					var blob = new Blob([data], {
						type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
					});
					saveAs(blob, urldecode(headers('Content-Disposition').match(/\"(.+?)\"/)[1]));
				}).error(function(data, status, headers, config) {
					alert(data)
				});
			}
		}
	}
})
.directive('btnButtonIf',function($parse,$compile){
	return {
		restrict 	: 'E',
		scope 		: {
			disabled 	: '=?',
			checked 	: '=?',
			value 		: '&'
		},
		link 		: function($scope, iElm, iAttrs){
			if(!isset($scope.checked)){
				$scope.checked 	= isset(iAttrs.value)? $scope.value : false;
			}
			var i 				= '';
			if(isset(iAttrs.icon)){
				var icons		= iAttrs.icon.split('|');
				$scope.icon 	= icons[0];
				i 				= '<i class="glyphicon glyphicon-{{icon}}"></i> ';
			}
			var t 	= (iElm.html()||'').split('|');
			var alt	= (iAttrs.title||'').split('|');
			$scope.text 	= t[0];
			$scope.title 	= alt[0]||t[0];
			var a	= '<button ng-if="!disabled" type="button" class="btn btn-sm btn-default" ng-click="$click();" title="{{title}}">'+i+'{{text}}</button>';
			var b	= '<b ng-if="disabled" class="btn btn-sm btn-default disabled">'+i+'{{text}}</b>';
			var c	= '<div>'+a+b+'</div>';
			var d	= $compile(c)($scope);
			iElm.replaceWith(d.contents());
			var fn 			= $parse(iAttrs.click,null,true);
			$scope.$click 	= function(){
				$scope.checked 			= !$scope.checked;
				$scope.$parent.checked 	= $scope.checked;
				fn($scope.$parent);
			}
			$scope.$watch('checked', function(newValue, oldValue){
				if(isset(icons))
					$scope.icon 	= newValue?icons[1]:icons[0];
				$scope.text 	= newValue?t[1]:t[0];
				if(alt.length>0)
					$scope.title 	= newValue?alt[1]:alt[0];
				else
					$scope.title 	= newValue?t[1]:t[0];
				// if(newValue){
				// 	$scope.text 	= t[1];
				// 	$scope.title 	= alt[1]||t[1];
				// }else{
				// 	$scope.icon 	= icons[0];
				// 	$scope.text 	= t[0];
				// 	$scope.title 	= alt[0]||t[0];
				// }
			});
		}
	};
})
.directive('btnButtonIfIcon',function($parse,$compile){
	return {
		restrict 	: 'E',
		scope 		: {
			disabled 	: '=?',
			checked 	: '=?',
			value 		: '&'
		},
		link 		: function($scope, iElm, iAttrs){
			var t 	= iElm.html();
			var b	= '<div><btn:button:if disabled="disabled" checked="checked" value="value" icon="remove|ok" title="'+t+'"></btn:button:if></div>';
			var d	= $compile(b)($scope);
			iElm.replaceWith(d.contents());
		}
	};
})
.directive('btnButtonAll',function($compile){
	return {
		restrict 	: 'E',
		scope 		: {
			disabled 	: '=?',
			items 		: '=?',
			all 		: '=?',
			selected	: '=?'
		},
		link 		: function($scope, iElm, iAttrs){
			$scope.selected	= false;
			$scope.checked 	= false;
			$scope.items 	= $scope.items || [];
			$scope.all 		= $scope.all || [];
			var flag 		= true;
			var t 	= iElm.html();
			var b	= '<div><btn:button:if disabled="disabled" checked="checked" click="click()">'+t+'</btn:button:if></div>';
			var d	= $compile(b)($scope);
			iElm.replaceWith(d.contents());
			$scope.click 	= function(){
				var self 	= this;
				angular.forEach($scope.all, function(value, key){
					$scope.all[key] 	= self.checked;
				});
			}
			$scope.$watch('all', function(newValue, oldValue){
				if(!$scope.disabled)
					$scope.disabled	= newValue.length == 0;
				if(!$scope.disabled){
					flag 			= true;
					$scope.selected	= false;
					angular.forEach(newValue, function(value, key){
						if(value === false){
							flag 	= false;
						}else{
							$scope.selected 	= true;
						}
					});
					$scope.checked 	= flag;
				}
			},true);
		}
	};
})
/**
<radio key="sex" name="info[sex]" value="0" checked="{$item.sex|default=''}">保密</radio>
<radio key="sex" name="info[sex]" value="1" checked="{$item.sex|default=''}">男</radio>
<radio key="sex" name="info[sex]" value="2" checked="{$item.sex|default=''}">女</radio>
 */
.directive('radio',function(){
	return {
		restrict 		: 'E',
		replace 		: true,
		transclude 		: true,
		scope 			: {
			key			: '=?',
			name 		: '@',
			value 		: '@',
			disabled	: '=?',
			checked 	: '@'
		},
		template 		: '\
			<label class="radio" ng-class="{active:key == value,disabled:disabled}" ng-click="click()">\
				<input type="radio" ng-model="key" name="{{name}}" value="{{value}}" />\
				<span ng-transclude></span>\
			</label>\
		',
		link 			: function($scope, iElm, iAttrs){
			$scope.key 			= $scope.key || $scope.checked;
		}
	};
})
.directive('radioGroup',function(){
	return {
		restrict 		: 'E',
		replace 		: true,
		transclude 		: true,
		scope 			: {
			name 		: '@',
			values 		: '@',
			disabled	: '=?',
			value 		: '@'
		},
		template 		: '\
			<label class="radio" ng-repeat="v in items" ng-class="{active:$parent.checked == v[0],disabled:disabled}">\
				<input type="radio" ng-model="$parent.checked" name="{{$parent.name}}" value="{{v[0]}}" />\
				<span>{{v[1]}}</span>\
			</label>\
		',
		link 			: function($scope, iElm, iAttrs){
			$scope.checked		= $scope.value;
			$scope.items 		= new Function('return [["'+$scope.values.replace(/\,/g,'"],["').replace(/\|/g,'","')+'"]]')();
		}
	};
})
.directive('checkbox',function($compile){
	return {
		restrict 	: 'E',
		replace 	: true,
		transclude 	: true,
		scope 		: {
			name 		: '@',
			value 		: '@',
			disabled	: '=?',
			items		: '=?'
		},
		template 	: '<label class="checkbox" ng-class="{active:checked,disabled:disabled}">'+
			'<input ng-if="!disabled" type="checkbox" ng-checked="checked" ng-click="click()" name="{{name}}[]" value="{{value}}" />'+
			'<span ng-transclude></span>'+
			'</label>',
		link 		: function($scope, iElm, iAttrs){
			$scope.disabled		= $scope.disabled || false;
			$scope.items		= $scope.items || [];
			$scope.checked 		= $scope.items.indexOf($scope.value)>-1|| false;
			$scope.click 		= function(){
				$scope.checked 	= !$scope.checked;
			}
		}
	};
})
.directive('groupCheckbox',function($compile){
	return {
		restrict 	: 'E',
		scope 		: {
			name 		: '=?',
			all 		: '=?',
			disabled	: '=?'
		},
		link 		: function($scope, iElm, iAttrs){
			$scope.disabled	= $scope.disabled || false;
			var v 	= iAttrs.value;
			var idx = -1;
			var update 		= false;
			$scope.name 	= $scope.name || [];
			$scope.all 		= $scope.all || [];
			$scope.checked 	= false;
			var t 	= iElm.html();
			var a 	= '<label ng-if="!disabled" class="checkbox" ng-class="{active:checked}"><input type="checkbox" ng-checked="checked" ng-click="click()" name="'+iAttrs.name+'" value="'+v+'" />'+t+'</label>';
			var b 	= '<label ng-if="disabled" class="checkbox disabled">'+t+'</label>';
			var c	= angular.element('<div></div>').html(a+b).contents();
			var d	= $compile(c)($scope);
			iElm.replaceWith(d);
			$scope.click 		= function(){
				$scope.checked 	= !$scope.checked;
			}
			$scope.$watch('checked', function(newValue, oldValue){
				if((newValue === false || newValue === true) && $scope.disabled === false){
					if(idx < 0){
						idx = $scope.all.length;
						$scope.index = idx;
						$scope.all.push(newValue);
						update 			= false;
					}else{
						$scope.all[idx]	= newValue;
						update 			= true;
					}
					var i 	= $scope.name.indexOf(v);
					if(newValue && i < 0){
						$scope.name.push(v);
					}else if(newValue === false && i>-1){
						$scope.name.splice(i,1);
					}
				}
			});
			$scope.$watch(function(){
				return $scope.all[idx];
			},function(newValue, oldValue){
				if((newValue === false || newValue === true) && $scope.disabled === false){
					$scope.checked 	= newValue;
				}
			});
		}
	};
})
.directive('groupGrid', function($compile){
	return {
		restrict 	: 'EC',
		scope 		: {
			size	: '=?',
			data	: '=?',
			items	: '=?'
		},
		compile 	: function($element){
			$element.find('code').hide();
			var c	= angular.element('<div></div>').html($element.html()).contents();
			return function($scope, iElm, iAttrs){
				var getJSON 	= function(){
					var html 	= iElm.find('code').hide().html();
					if (html && html != 'null') {
						return new Function('return ' + html)();
					}
					return [];
				}
				$scope.items	= $scope.items || getJSON();
				$scope.$add		= true;
				if($scope.size > 0){
					$scope.$watch('items', function(newValue, oldValue){
						$scope.$add	= newValue.length < $scope.size
					},true);
				}
				$scope.add		= function(){
					var json	= {}
					$scope.items.push(json);
				}
				$scope.up		= function(idx){
	        		var item 	= $scope.items[idx];
	        		$scope.items.splice(idx,1);
	        		$scope.items.splice(idx-1,0,item);
			    }
			    $scope.down		= function(idx){
	        		var item 	= $scope.items[idx];
	        		$scope.items.splice(idx,1);
	        		$scope.items.splice(idx+1,0,item);
			    }
				$scope.remove	= function(idx){
			        $scope.items.splice(idx,1);
			    }
				var d	= $compile(c)($scope);
				iElm.html(d);
			}
		}
	};
})
.directive('groupArray', function(){
	return {
		restrict 	: 'EC',
		replace 	: true,
		transclude 	: true,
		scope 		: {
			name 	: '@',
			size	: '=?',
			items	: '=?',
			sort	: '=?',
			click	: '=?'
		},
		template 	: '<div><code ng-transclude></code>'
			+'<button class="btn btn-default btn-sm" type="button" ng-click="$add()" ng-if="$items.length<=0">'
			+'	<span class="glyphicon glyphicon-plus"></span>'
			+'</button>'
			+'<div class="col-sm-12" ng-repeat="n in $items" style="margin:0;padding:0" ng-style="{paddingBottom:$last?0:5}">'
			+'	<div class="input-group">'
			+'		<input class="form-control" type="text" name="{{name}}[{{$index}}]" ng-model="n[\'value\']" placeholder="{{empty}}" />'
			+'		<span class="input-group-btn">'
			+'			<button class="btn btn-default btn-sm" type="button" ng-click="$add()" ng-if="$last&&(!size||items.length<size)" title="添加">'
			+'				<span class="glyphicon glyphicon-plus"></span>'
			+'			</button>'
			+'			<button class="btn btn-default btn-sm" type="button" ng-click="$remove($index)" title="删除">'
			+'				<span class="glyphicon glyphicon-minus"></span>'
			+'			</button>'
			+'			<button ng-if="sort" class="btn btn-default btn-sm" type="button" ng-disabled="$first" ng-click="$up($index)" title="删除">'
			+'				<span class="glyphicon glyphicon-arrow-up"></span>'
			+'			</button>'
			+'			<button ng-if="sort" class="btn btn-default btn-sm" type="button" ng-disabled="$last" ng-click="$down($index)" title="删除">'
			+'				<span class="glyphicon glyphicon-arrow-down"></span>'
			+'			</button>'
			+'		</span>'
			+'	</div>'
			+'</div>'
			+'</div>',
		link 		: function($scope, iElm, iAttrs){
			$scope.buffer	= [];
			var parseJSON 	= function(data){
				var res = [];
				angular.forEach(data, function(value, key){
					res.push({"value":value});
				});
				return res;
			}
			var getJSON 	= function(){
				var html 	= iElm.find('code').hide().find('span').html();
				if (html && html != 'null') {
					$scope.buffer	= new Function('return ' + html)();
					return parseJSON($scope.buffer);
				}
				return [];
			}
			var findJSON	= function(json,search,key){
				key 		= key || 'value';
				for(i in json){
					if(json[i][key] == search)
						return i;
				}
				return -1;
			}
			$scope.$items	= $scope.items&&$scope.items.length>0 ? $scope.items : getJSON();
			$scope.name		= $scope.name || 'items';
			$scope.empty 	= iAttrs.empty || iAttrs.placeholder;
		    var methods		= {
		    	add			: function(value){
		    		var index 	= findJSON($scope.$items,value);
		    		// var index 	= $scope.buffer.indexOf(value);
					$scope.buffer.push(value);
					var json	= {"value":value};
					$scope.$items.push(json);
					return true;
				},
				replace 	: function(items){
					items  			= items || [];
					$scope.buffer	= items;
					$scope.$items	= parseJSON($scope.buffer);
					return true;
				},
				remove		: function(index){
					if(index > -1 && index < $scope.buffer.length){
				        $scope.buffer.splice(index,1);
				        $scope.$items.splice(index,1);
				        return true;
				    }else{
				    	return false;
				    }
			    },
			    up 			: function(index){
			    	var item 	= $scope.buffer[index];
	        		$scope.buffer.splice(index,1);
	        		$scope.buffer.splice(index-1,0,item);
			    	var item 	= $scope.$items[index];
	        		$scope.$items.splice(index,1);
	        		$scope.$items.splice(index-1,0,item);
			    },
			    down		: function(index){
			    	var item 	= $scope.buffer[index];
	        		$scope.buffer.splice(index,1);
	        		$scope.buffer.splice(index+1,0,item);
			    	var item 	= $scope.$items[index];
	        		$scope.$items.splice(index,1);
	        		$scope.$items.splice(index+1,0,item);
			    },
				toJSON		: function(){
			    	return $scope.buffer;
			    }
		    };
			$scope.$add		= function(){
				if(angular.isFunction($scope.click)){
					$scope.click(methods);
				}else{
					methods.add("");
				}
			}
			$scope.$remove	= function(idx){
				methods.remove(idx);
		    }
		    $scope.$up		= function(idx){
				methods.up(idx);
		    }
		    $scope.$down	= function(idx){
				methods.down(idx);
		    }
		    $scope.$watch('buffer', function(newValue, oldValue, scope){
		    	$scope.items 	= newValue;
		    }, true);
		}
	};
})
.directive('groupJson', function(){
	return {
		restrict 	: 'EC',
		replace 	: true,
		transclude 	: true,
		scope 		: {
			name 	: '@',
			key 	: '@',
			size	: '=?',
			items	: '=?',
			disable	: '=?',
			nodes	: '=?',
			click	: '=?'
		},
		template 	: '<div><code ng-transclude></code>'
			+'<button class="btn btn-default btn-sm" type="button" ng-disabled="disable" ng-click="$add()" ng-if="items.length<=0">'
			+'	<span class="glyphicon glyphicon-plus"></span>'
			+'</button>'
			+'<div class="col-sm-12" ng-repeat="n in items" style="margin:0;padding:0" ng-style="{paddingBottom:$last?0:5}">'
			+'	<input type="hidden" name="{{name}}[{{$index}}][id]" value="{{n.id}}" />'
			+'	<div class="input-group">'
			+'		<select ng-disabled="disable" class="form-control input-sm" name="{{name}}[{{$index}}][{{key}}]" ng-model="n[key]">'
			+'			<option ng-if="empty" value="">{{empty}}</option>'
			+'			<option ng-repeat="node in nodes" value="{{node.id}}">{{node.name}}</option>'
			+'		</select>'
			+'		<span class="input-group-btn">'
			+'			<button ng-disabled="disable" class="btn btn-default btn-sm" type="button" ng-click="$add()" ng-if="$last&&(!size||items.length<size)" title="添加">'
			+'				<span class="glyphicon glyphicon-plus"></span>'
			+'			</button>'
			+'			<button ng-disabled="disable" class="btn btn-default btn-sm" type="button" ng-click="$remove($index)" title="删除">'
			+'				<span class="glyphicon glyphicon-minus"></span>'
			+'			</button>'
			+'		</span>'
			+'	</div>'
			+'</div>'
			+'</div>',
		link 		: function($scope, iElm, iAttrs){
			var getJSON 	= function($tag){
				var html 	= iElm.find('code').hide().find($tag).html();
				if (html && html != 'null') {
					return new Function('return ' + html)();
				}
				return [];
			}
			$scope.items	= $scope.items&&$scope.items.length>0 ? $scope.items : getJSON('items');
			$scope.nodes	= $scope.nodes&&$scope.nodes.length>0 ? $scope.nodes : getJSON('nodes');
			$scope.name		= $scope.name || 'items';
			$scope.key		= $scope.key || 'name';
			$scope.empty 	= iAttrs.empty || iAttrs.placeholder;
			$scope.$add		= function(){
				var def 	= $scope.empty?'':$scope.nodes[0].id;
				var json	= angular.fromJson('{"'+$scope.key+'":"'+def+'"}');
				$scope.items.push(json);
			}
			$scope.$remove	= function(idx){
		        $scope.items.splice(idx,1);
		    }
		}
	};
})
/**
 * Tabs
 */
.directive('tabs', function($location){
	return {
		restrict: 'C',
		link: function($scope, iElm, iAttrs){
			var id 		= $location.url().replace(/^\//,'');
			var items 	= iElm.find('ul.head>li').click(function(){
				var idx 	= iElm.find('ul.head>li').removeClass('active').index(this);
				$(this).addClass('active');
				iElm.find('.content>.item').hide().eq(idx).show();
			})
			if(id){
				items.filter('.'+id).click();
			}else{
				items.first().click();
			}
		}
	};
})
.directive('checkboxAll',function($parse){
	return {
		require 	: 'ngModel',
		restrict 	: 'A',
		link 		: function($scope, iElm, iAttrs, ngModel){
			var parts		= iAttrs.checkboxAll.match(/(.+)\.(.+)\.(.+)\.(.+)/).slice(1);
			var items		= $scope.$eval(parts[0]);
			var values		= $scope.$eval(parts[2])||[];
			iElm.bind('click',function(){
				angular.forEach(items,function(value){
					value[parts[1]]	= ngModel.$modelValue;
				});
				$scope.$apply();
			});
			if(items.length>0){
				var flag = false;
				$scope.$watch(parts[0],function(newValue){
					if(flag){
						var hasChecked		= true;
						angular.forEach(newValue,function(value){
							if(!value[parts[1]]){
								value[parts[1]] = false;
								hasChecked 		= false;
							}else{
								value[parts[1]] = true;
							}
						});
						$parse(iAttrs['ngModel']).assign($scope,hasChecked);
					}else
						flag = true;
				},true);
				var hasChecked		= true;
				angular.forEach(items, function(v, k){
					v[parts[1]]	= values.indexOf(v[parts[3]]) > -1;
					if(!v[parts[1]]){
						hasChecked 		= false;
					}
				});
				$parse(iAttrs['ngModel']).assign($scope,hasChecked);
			}
		}
	};
})
.directive('browse',function($modal,$parse){
	return {
		restrict 	: 'C',
		scope 		: {
			title	: '@'
		},
		link 		: function($scope, iElm, iAttrs){
			var browse 			= $modal({
				scope 			: $scope,
				// contentTemplate : iElm.attr('url'),
				templateUrl 	: iElm.attr('url'),
				show 			: false
			});
			$scope.$confirm		= function(item){
				if(item){
					$parse(iAttrs['name']).assign($scope.$parent,item);
					browse.$promise.then(browse.hide);
				}
			}
			iElm.click(function(){
				browse.$promise.then(browse.show);
			});
		}
	};
})
.directive('sort',function($compiler,$http){
	return {
		restrict 	: 'E',
		replace		: true,
		scope 		: {
			id 		: '@',
			name 	: '@',
			value 	: '@',
			url 	: '@',
			disable	: '='
		},
		link 		: function($scope, iElm, iAttrs){
			var key 			= $scope.name || 'value'
			$scope.value 		= $scope.value || iElm.html();
			$scope.backup		= $scope.value;
			$scope.edit			= false;
			$compiler({
				element 		: iElm,
				scope 			: $scope,
				template 		: ''
					+'<div class="input-group input-group-sm">'
					+'<input type="text" class="form-control" placeholder="" ng-model="value" ng-disabled="disable" />'
					+'<span class="input-group-btn">'
					+'<button class="btn btn-default" type="button" ng-disabled="backup == value || disable" ng-click="$click(value)">'
					+'<span class="glyphicon glyphicon-floppy-save"></span>'
					+'</button>'
					+'</span>'
					+'</div>'
			});
			$scope.$click 		= function(value){
				$scope.backup 	= value;
				$scope.value 	= value;
				if(!value){
					alert("请输入内容！");
				}else if($scope.url && $scope.id){
					var postdata 	= {id:$scope.id};
					postdata[key]	= value;
					$http.post($scope.url,postdata).success(function(data){
						if(data.code == 201){
							alert(data.msg);
						}else if(data.code == 202){
							alert(angular.toJson(data))
						}
					});
				}else{
					alert("参数错误！");
				}
			}
		}
	};
})
.directive('plus',function($ocLazyLoad){
	return {
		restrict		:'E',
		replace			: true,
		scope			: {
			foreground	: '@',
			background	: '@'
		},
		template 		: '',
		link			: function($scope, iElm, iAttrs){

		}
	};
})
.directive('jplayer',function($ocLazyLoad){
	return {
		restrict		:'E',
		replace			: true,
		scope			: {
		},
		template 		: '\
			<div id="jp_container_1" class="jp-video jp-video-360p">\
				<div id="jquery_jplayer_1" class="jp-jplayer"></div>\
				<div class="jp-gui">\
				    <div class="jp-interface">\
				        <div class="jp-controls-holder">\
				            <a href="javascript:;" class="jp-play" tabindex="1">play</a>\
				            <a href="javascript:;" class="jp-pause" tabindex="1">pause</a>\
				            <span class="separator sep-1"></span>\
				            <div class="jp-progress">\
				                <div class="jp-seek-bar">\
				                    <div class="jp-play-bar"><span></span></div>\
				                </div>\
				            </div>\
				            <div class="jp-current-time"></div>\
				            <span class="time-sep">/</span>\
				            <div class="jp-duration"></div>\
				            <span class="separator sep-2"></span>\
				            <a href="javascript:;" class="jp-mute" tabindex="1" title="mute">mute</a>\
				            <a href="javascript:;" class="jp-unmute" tabindex="1" title="unmute">unmute</a>\
				            <div class="jp-volume-bar">\
				                <div class="jp-volume-bar-value"><span class="handle"></span></div>\
				            </div>\
				            <span class="separator sep-2"></span>\
				            <a href="javascript:;" class="jp-full-screen" tabindex="1" title="full screen">full screen</a>\
				            <a href="javascript:;" class="jp-restore-screen" tabindex="1" title="restore screen">restore screen</a>\
				        </div>\
				    </div>\
				</div>\
			</div>\
		',
		/*template 		: '\
			<div id="jp_container_1" class="jp-video jp-video-360p">\
				<div class="jp-type-single">\
					<div id="jquery_jplayer_1" class="jp-jplayer"></div>\
					<div class="jp-gui">\
						<div class="jp-video-play">\
							<button class="jp-video-play-icon" role="button" tabindex="0">play</button>\
						</div>\
						<div class="jp-interface">\
							<div class="jp-progress">\
								<div class="jp-seek-bar">\
									<div class="jp-play-bar"></div>\
								</div>\
							</div>\
							<div class="jp-current-time">&nbsp;</div>\
							<div class="jp-duration">&nbsp;</div>\
							<div class="jp-controls-holder">\
								<div class="jp-controls">\
									<button class="jp-play" role="button" tabindex="0">play</button>\
									<button class="jp-stop" role="button" tabindex="0">stop</button>\
								</div>\
								<div class="jp-volume-controls">\
									<button class="jp-mute" role="button" tabindex="0">mute</button>\
									<button class="jp-volume-max" role="button" tabindex="0">max volume</button>\
									<div class="jp-volume-bar">\
										<div class="jp-volume-bar-value"></div>\
									</div>\
								</div>\
								<div class="jp-toggles">\
									<button class="jp-repeat" role="button" tabindex="0">repeat</button>\
									<button class="jp-full-screen" role="button" tabindex="0">full screen</button>\
								</div>\
							</div>\
						</div>\
					</div>\
				</div>\
			</div>\
		',*/
		link			: function($scope, iElm, iAttrs){
			$ocLazyLoad.load([
				'/sjhpxj/bower_components/jplayer/jquery.jplayer.min.js',
				// '/sjhpxj/bower_components/jplayer/blue/css/jplayer.blue.monday.css'
				'/sjhpxj/bower_components/jplayer/jplayer.css'
			]).then(function(res){
				iElm.find("#jquery_jplayer_1").jPlayer({
			        ready: function () {
			            $(this).jPlayer("setMedia", {
			                m4v: "http://www.jq22.com/demo/src/mi4.m4v",
			                ogv: "http://www.jq22.com/demo/src/mi4.ogv",
			                webmv: "http://jq22.qiniudn.com/www.jq22.commi4.webm",
			                poster: "http://www.jq22.com/demo/src/mi4.png"
			            });
			        },
			        swfPath: "js",
			        supplied: "webmv, ogv, m4v",
			        size: {
			            width: "570px",
			            height: "340px",
			            cssClass: "jp-video-360p"
			        }
	    		});
	 		});
		}
	};
})
.directive('thumbs',function(autoImage){
	return {
		restrict		:'E',
		replace			: true,
		scope			: {
			cls			: '@',
			src			: '@',
			image		: '=',
			size		: '@',
			width		: '=',
			table		: '='
		},
		template 		: '<div ng-class="cls" style="width:{{w}}px;height:{{h}}px">\
			<img ng-show="flag" width="{{w}}" height="{{h}}" />\
			<div class="empty" ng-show="!flag" style="line-height:{{h}}px">{{empty}}</div>\
			<div class="size" ng-if="info">{{info}}</span>\
		</div>',
		link			: function($scope, iElm, iAttrs){
			var root 	= location.pathname.replace(/^((?:.+)?\/).+$/,'$1');
			var rate	= iAttrs.rate && iAttrs.rate != 'undefined' ? iAttrs.rate : 1;
			$scope.cls	= $scope.cls || 'thumbnail';
			$scope.size	= $scope.size || '100x100';
			$scope.empty= iAttrs.empty || $scope.size;
			var ret		= $scope.size.split('x');
			if($scope.width){
				rate 	= Math.round(($scope.width - ($scope.table?22:0)) / ret[0] * 100) / 100;
			}
			$scope.w	= parseInt(ret[0] * rate);
			$scope.h	= parseInt(ret[1] * rate);
			$scope.flag	= false;
			$scope.$watchGroup(["image","src"], function (newValue,oldValue) {
				autoImage(iElm.find('img'),newValue[0] || newValue[1],$scope.w,$scope.h).then(function(res){
					$scope.info	= res.w+'x'+res.h;
					$scope.flag	= true;
				}).catch(function(res){
					$scope.flag	= false;
				});
			});
		}
	};
})
.directive('thumbnail',function(){
	return {
		restrict		:'EA',
		replace			: true,
		scope			: {
			src			: '@',
			size		: '@',
			rate		: '=?',
			width		: '=',
			table		: '='
		},
		template 		: '\
			<div class="thumbnail" style="width:{{w}}px;">\
				<thumbs cls="thumbnail-image" image="src" size="{{size}}" rate="{{rate}}" width="width" table="table"></thumbs>\
			</div>\
		',
		link			: function($scope, iElm, iAttrs){
			$scope.size	= $scope.size || '100x100';
			var rate	= $scope.rate || 1;
			var ret		= $scope.size.split('x');
			if($scope.width){
				rate 	= Math.round(($scope.width - ($scope.table?22:0)) / ret[0] * 100) / 100;
			}
			$scope.w	= parseInt($scope.size.split('x')[0] * rate);
		}
	};
})
.directive('videofile',function($ocLazyLoad,$http,$q,$timeout,$upload){
	return {
		restrict		:'E',
		replace			: true,
		scope			: {
			name 	: '@',
			value 	: '@',
			accept 	: '@'
		},
		template 		: '\
		<div>\
			<input type="file" style="display:none" accept="{{accept}}" />\
			<div class="progress" ng-if="percentageshow">\
	            <div class="progress-bar" style="width: {{percentage}}%;">{{percentage}} %</div>\
	        </div>\
			<div class="input-group input-group-sm">\
	            <input class="form-control" type="text" name="{{name}}" value="{{value}}" placeholder="{{empty}}" />\
	            <span class="input-group-btn">\
	            	<button class="btn btn-default" type="button" ng-click="browse()" title="选择文件" ng-disabled="file">\
						<span class="glyphicon glyphicon-folder-open"></span>\
					</button>\
					<button class="btn btn-default" type="button" ng-click="upload()" title="上传文件" ng-disabled="!file||uploading">\
						<span class="glyphicon glyphicon-upload"></span>\
					</button>\
	            </span>\
	        </div>\
		</div>\
        ',
		link			: function($scope, iElm, iAttrs){
			var deferred 		= $q.defer();
			var root 			= location.pathname.replace(/^((?:.+)?\/).+$/,'$1');
			$scope.accept		= $scope.accept || 'video/*';
			$scope.empty 		= iAttrs.placeholder || '请上传视频';
			$scope.file 		= null;
			$scope.uploading	= false;
			$scope.percentage 		= -1;
			$scope.percentageshow	= false;
			var chunk 			= 2 * 1024 * 1024;
			var file 			= iElm.find('input:file');
			file.change(function(){
				$scope.file 	= this.files[0];
				$scope.value 	= $(this).val();
				$scope.$apply();
			});
			$scope.browse 		= function(){
				file.click();
			}
			$scope.upload 		= function(){
				if($scope.file){
					$scope.uploading	= true;
					$upload($scope.file,'?s=/Video/upload').progress(function(n){
						$scope.percentage = Percentage(n.loaded,n.total);
					}).success(function(data){
						$scope.value = data['file'];
						$scope.file = null;
						$scope.uploading	= false;
						$scope.$apply();
					});
				}
			}

			// var formData = new window.FormData();
			// iElm.find('input:text').parents('form').one('submit',function(){
			// 	var __this 	= $(this);
			// 	if($scope.file){
			// 		$upload($scope.file,'?s=/Video/upload').progress(function(n){
			// 			$scope.percentage = Percentage(n.loaded,n.total);
			// 		}).success(function(data){
			// 			$scope.value = data['file'];
			// 			$scope.$apply();
			// 			__this.submit();
			// 		});
			// 	}
			// 	return false;
			// });
			$scope.$watch('percentage',function(newValue, oldValue, scope){
				if(newValue == 100){
					$timeout(function(){
						$scope.percentageshow	= false;
					},1000);
				}else if(newValue >= 0){
					$scope.percentageshow	= true;
				}
			});
			// $(iElm.find('input:text')[0].form).submit(function(){
			// 	alert(1)
			// 	return false;
			// });
			/*
			name = file.name,        //文件名
			size = file.size,        //总大小
			var shardSize = 2 * 1024 * 1024,    //以2MB为一个分片
			shardCount = Math.ceil(size / shardSize);  //总片数
			//计算每一片的起始与结束位置
				for(var i = 0;i < shardCount;++i){
                var start = i * shardSize,
                end = Math.min(size, start + shardSize);

				var blob = file.slice(start,start+step+1);
				file.slice(start,end)
                 var form = new FormData();

                form.append("data", file.slice(start,end));  //slice方法用于切出文件的一部分

                form.append("name", name);

                form.append("total", shardCount);  //总片数

                form.append("index", i + 1); 
                 $.ajax({

                    url: "../File/Upload",

                    type: "POST",

                    data: form,

                    async: true,        //异步

                    processData: false,  //很重要，告诉jquery不要对form进行处理

                    contentType: false,  //很重要，指定为false才能形成正确的Content-Type

                    success: function(){

                        ++succeed;

                        $("#output").text(succeed + " / " + shardCount);

                    }

                });
var formData = new FormData();
formData.append('file', $('#file')[0].files[0]);
$.ajax({
    url: '/upload',
    type: 'POST',
    cache: false,
    data: formData,
    processData: false,
    contentType: false
}).done(function(res) {
}).fail(function(res) {});
			*/
			// $ocLazyLoad.load([
			// 	'/sjhpxj/bower_components/webuploader/webuploader.js'
			// ]).then(function(res){
			// 	if (!WebUploader.Uploader.support()) {
			// 		alert('Web Uploader 不支持您的浏览器！如果你使用的是IE浏览器，请尝试升级 flash 播放器');
			// 		throw new Error('WebUploader does not support the browser you are using.');
			// 	}
			// 	alert(root)
			// 	var uploader = WebUploader.create({
			// 		pick: {
			// 			id: '#filePicker',
			// 			label: '点击选择图片'
			// 		},
			// 		dnd: '#uploader .queueList',
			// 		paste: document.body,

			// 		accept: {
			// 			title: 'Images',
			// 			extensions: 'gif,jpg,jpeg,bmp,png',
			// 			mimeTypes: 'image/*'
			// 		},
			// 		// swf文件路径
			// 		swf: root + '/js/Uploader.swf',
			// 		disableGlobalDnd: true,
			// 		chunked: true,
			// 		server: 'http://2betop.net/fileupload.php',
			// 		fileNumLimit: 300,
			// 		fileSizeLimit: 5 * 1024 * 1024, // 200 M
			// 		fileSingleSizeLimit: 1 * 1024 * 1024 // 50 M
			// 	});
	 	// 	});
		}
	};
})
/* <?php
 2         $filename = "upload/".$_GET['fileName'];
 3         //$filename = "upload/".$_GET['fileName']."_".$_GET['nocache'];
 4         $xmlstr = $GLOBALS['HTTP_RAW_POST_DATA'];
 5         if(empty($xmlstr)){
 6                 $xmlstr = file_get_contents('php://input');
 7         }
 8         $is_ok = false;
 9         while(!$is_ok){
10                 $file = fopen($filename,"ab");
11         
12                 if(flock($file,LOCK_EX)){
13                         fwrite($file,$xmlstr);
14                         flock($file,LOCK_UN);
15                         fclose($file);
16                         $is_ok = true;
17                 }else{
18                         fclose($file);
19                         sleep(3);
20                 }
21         }


//取得chunk和chunks
int chunk = Convert.ToInt32(context.Request.Form["chunk"]);//当前分片在上传分片中的顺序（从0开始）
int chunks = Convert.ToInt32(context.Request.Form["chunks"]);//总分片数
//根据GUID创建用该GUID命名的临时文件夹
string folder = context.Server.MapPath("~/1/" + context.Request["guid"]+"/");
string path = folder + chunk;//每个分片用数字命名


string name = Request["name"];

    int total = Convert.ToInt32(Request["total"]);

    int index = Convert.ToInt32(Request["index"]);

    var data = Request.Files["data"];
    //保存一个分片到磁盘上

    string dir = Server.MapPath("~/Upload");

    string file = Path.Combine(dir, name + "_" + index);

    data.SaveAs(file);
    //如果已经是最后一个分片，组合
     if(index == total)
    {

        file = Path.Combine(dir, name);
        var fs = new FileStream(file, FileMode.Create);
        for(int i = 1;i <= total;++i)
        {
            string part = Path.Combine(dir, name + "_" + i);

            var bytes = System.IO.File.ReadAllBytes(part);

            fs.Write(bytes, 0, bytes.Length);

            bytes = null;

            System.IO.File.Delete(part);
        }
        fs.Close();
    }
*/
.directive('file', function(fileReader){
	return {
		restrict 	: 'C',
		replace 	: true,
		scope  		: {
			name 	: '@',
			key 	: '@',
			size 	: '@',
			rate	: '=?',
			value 	: '@',
			accept 	: '@'
		},
		template: '\
            <div class="image-preview">\
            	<input type="file" name="{{name}}" style="display:none" accept="{{accept}}" />\
            	<input type="hidden" name="{{key}}" value="{{value}}" />\
                <div class="thumbnail" style="width:{{w}}px;">\
                    <thumbs cls="thumbnail-image" image="src" size="{{size}}" rate="{{rate}}" empty="{{empty}}"></thumbs>\
                    <div class="tip" style="line-height:{{h}}px">{{empty}}</div>\
                    <button class="btn btn-default btn-sm" type="button" ng-click="upload()" title="上传图片">\
                    	<span class="glyphicon glyphicon-upload"></span>\
                    </button>\
                </div>\
            </div>\
        ',
		link: function($scope, iElm, iAttrs) {
			$scope.flag		= false;
			$scope.key		= $scope.key || $scope.name;
			$scope.src		= $scope.value;
			$scope.rate		= $scope.rate || 1;
			$scope.size		= $scope.size || '100x100';
			$scope.accept	= $scope.accept || 'image/jpg,image/jpe,image/jpeg,image/png,image/bmp,image/gif';
			var ret			= $scope.size.split('x');
			$scope.w		= parseInt(ret[0] * $scope.rate);
			$scope.h		= parseInt(ret[1] * $scope.rate);
			$scope.empty 	= iAttrs.placeholder || $scope.size;
			iElm.find('.thumbnail').hover(function(){
				$(this).find('.tip').show();
				$(this).find('.btn').show();
			},function(){
				$(this).find('.tip').hide();
				$(this).find('.btn').hide();
			});
			iElm.find('input:file').change(function(){
				fileReader.readAsDataUrl(this.files[0]).then(function(result) {
					$scope.src 		= result;
				});
			})
			$scope.upload 	= function(){
				iElm.find('input:file').click();
			}
		}
	};
})
.directive('files', function(fileReader){
	return {
		restrict 	: 'E',
		replace 	: true,
		transclude	: true,
		scope  		: {
			name 	: '@',
			size 	: '@',
			value 	: '@',
			rate	: '=?',
			count	: '=?'
		},
		template 		: '<div>\
			<textarea ng-hide="true" ng-transclude></textarea>\
			<button class="btn btn-default btn-sm" type="button" ng-click="$add()" ng-if="items.length<=0">\
				<span class="glyphicon glyphicon-plus"></span>\
			</button>\
			<input type="hidden" ng-repeat="v in backup" name="{{name}}_backup[]" value="{{v}}" />\
			<div class="images-preview" ng-repeat="n in items">\
				<input type="file" name="{{$parent.name}}{{$index+1}}" style="display:none" accept="{{accept}}" />\
				<input type="hidden" name="{{$parent.name}}[]" value="{{n.image}}" />\
				<div class="thumbnail">\
					<thumbs cls="thumbnail-image" image="n.image" size="{{size}}" rate="{{rate}}" empty="{{empty}}"></thumbs>\
					<div class="btn-group btn-group-sm">\
						<button class="btn btn-default" type="button" ng-click="$upload($index)" title="上传图片">\
							<span class="glyphicon glyphicon-upload"></span>\
						</button>\
						<button class="btn btn-default" type="button" ng-click="$add()" ng-if="$last&&items.length<count" title="添加">\
							<span class="glyphicon glyphicon-plus"></span>\
						</button>\
						<button class="btn btn-default" type="button" ng-click="$remove($index)" title="删除">\
							<span class="glyphicon glyphicon-minus"></span>\
						</button>\
					</div>\
				</div>\
			</div>\
		</div>',
		link: function($scope, iElm, iAttrs) {
			var root 		= location.pathname.replace(/^((?:.+)?\/).+$/,'$1');
			$scope.count	= $scope.count || 5;
			$scope.empty 	= iAttrs.placeholder || $scope.size;
			$scope.accept	= $scope.accept || 'image/jpg,image/jpe,image/jpeg,image/png,image/bmp,image/gif';
			iElm.delegate('.images-preview .thumbnail','mouseenter',function(){
				$(this).find('.btn-group').show();
			}).delegate('.images-preview .thumbnail','mouseleave',function(){
				$(this).find('.btn-group').hide();
			});
			var images 		= new Function('return '+iElm.find('>textarea').text())();
			$scope.backup	= angular.copy(images);
			angular.forEach(images, function(value,key){
				images[key]	= {'image':value}
			});
			$scope.items	= $scope.items || images || [];
			$scope.$upload 	= function($index){
				iElm.find('input:file').eq($index).one('change',function(){
					fileReader.readAsDataUrl(this.files[0]).then(function(result){
						$scope.items[$index]['image']	= result;
					});
				});
				iElm.find('input:file').eq($index).click();
			}
			$scope.$add		= function(){
				var json	= angular.fromJson('{"image":""}');
				$scope.items.push(json);
			}
			$scope.$remove	= function($index){
		        $scope.items.splice($index,1);
		    }
		}
	};
})
.directive('pagination',function($parse){
	return {
		restrict	:'EA',
		transclude	: false,
		replace		: true,
		scope		: {
			'cfg'	: '=?',
			'page'	: '=?',
			'size'	: '=?',
			'count'	: '=?',
			'goto'	: '=?'
		},
		template	: '\
			<ul class="pagination pagination-sm">\
			    <li ng-class="{disabled:$first}"><span ng-click="$go($first,1)"><b class="glyphicon glyphicon-fast-backward"></b></span></li>\
			    <li ng-class="{disabled:$first}"><span ng-click="$go($first,page-1)"><b class="glyphicon glyphicon-step-backward"></b></span></li>\
			    <li ng-repeat="i in pages" ng-class="{active:page === i}"><span ng-click="$go(page === i,i)">{{i}}</span></li>\
			    <li ng-class="{disabled:$last}"><span ng-click="$go($last,page+1)"><b class="glyphicon glyphicon-step-forward"></b></span></li>\
			    <li ng-class="{disabled:$last}"><span ng-click="$go($last,pagecount)"><b class="glyphicon glyphicon-fast-forward"></b></span></li>\
			    <li ng-if="cfg==1"><div class="info">从 {{firstRow}} 到 {{lastRow}} /共 {{count}} 条数据</div></li>\
			    <li ng-if="cfg==2"><div class="info">第 {{page}} 页 / 共 {{pagecount}} 页 / 每页 {{pagesize}} 条数据</div></li>\
			    <li>\
			        <div class="go">\
			            <div class="input-group input-group-sm">\
			                <input type="text" ng-model="g" />\
			                <div class="input-group-btn">\
			                    <span class="btn btn-default" type="button" ng-click="$goto()" ng-disabled="page==g">GO</span>\
			                </div>\
			            </div>\
			        </div>\
			    </li>\
			</ul>',
		link 		: function($scope, iElm, iAttrs){
			var fn 				= $parse($scope.goto,null,true);
			var limit 			= 5;
			$scope.cfg 			= 1;
			$scope.page 		= 1;
			$scope.pagesize		= $scope.size || 10;
			$scope.pagecount	= Math.ceil($scope.count / $scope.pagesize);
			$scope.sizes 		= [10,20,50,80,100];
			$scope.$go 			= function(where,v){
				if(where) return false;
				$scope.page  	= parseInt(v);
				if(angular.isFunction($scope.goto))
					$scope.goto($scope.page,$scope.pagesize);
			}
			$scope.$watch('page', function(page, oldValue, scope){
				$scope.$first	= page === 1;
				$scope.$last	= page === $scope.pagecount;
				$scope.firstRow	= (page - 1) * $scope.pagesize + 1;
				$scope.lastRow	= Math.min($scope.firstRow + $scope.pagesize - 1,$scope.count);
				var p			= Math.floor(limit / 2);
				var startPage	= Math.max(Math.min(page - p,$scope.pagecount - limit + 1),1);
				var endPage		= Math.min(Math.max(page + p,limit),$scope.pagecount);
				var pages		= [];
				for(var number = startPage; number <= endPage; number++){
					pages.push(number);
				}
				$scope.pages 	= pages;
				$scope.g 		= page;
			});
			$scope.$goto 		= function(){
				if($scope.page != $scope.g && $scope.g <= $scope.pagecount)
					$scope.$go(false,$scope.g);
			}
			$scope.$watch('g', function(newValue, oldValue) {
				if(newValue){
					if(/^\d+$/.test(newValue)){
						if(parseInt(newValue) > $scope.pagecount){
							$scope.p 	= $scope.pagecount;
						}
					}else{
						$scope.p 		= 1;
					}
				}
			});
		}
	};
})
.directive('editor', function($q,$timeout){
	var deferred 		= $q.defer();
	function LoadJS(fileUrl) {
		var body 	= document.getElementsByTagName('body')[0];
		var node 	= document.createElement('script');
		node.type = 'text/javascript';
        node.charset = 'utf-8';
        node.addEventListener('load', function(evt){
        	if (evt.type === 'load' || (/^(complete|loaded)$/.test((evt.currentTarget || evt.srcElement).readyState))) {
        		deferred.resolve(fileUrl);
        	}
        }, false);
        node.addEventListener('error', function(){
        	deferred.reject(fileUrl);
        }, false);
        node.async = true;
        node.src 	= fileUrl;
        body.appendChild(node);
	}
	return {
		restrict 	: 'C',
		scope 		: {
			name 	: '@',
			empty 	: '@'
		},
		link 		: function($scope, iElm, iAttrs){
			var root 			= location.pathname.replace(/^((?:.+)?\/).+$/,'$1');
			var resolve			= {};
			var dependencies 	= [
				root+'Public/ueditor/ueditor.config.js',
				root+'Public/ueditor/ueditor.all.min.js',
			];
			if(typeof UE === 'undefined') {
				angular.forEach(dependencies, function(value, key) {
					LoadJS(value);
				});
			}else{
				deferred.resolve();
			}
			deferred.promise.then(function(){
				// alert(typeof UE !== 'undefined')
				if(typeof UE !== 'undefined'){
					var editor = new UE.ui.Editor({                                       
						imagePath: 'Uploads/images/',
						initialFrameWidth: 600,
						initialFrameHeight: 300,
						autoHeightEnabled: false,
						autoFloatEnabled: false                                   
					});
					editor.render(iElm[0]);
				}
			}).catch(function(res){
				alert('加载出错:'+res);
			});
		}
	};
})
.directive('editor1', function(){
	var asyncjs  			= function(paths){
		var resolve 		= [];
		angular.forEach(paths, function(value, key){
			resolve[key]	= $http.get(value).then(function(res){
				return res.data;
			});
		});
		return $q.all(resolve).then(function(locals){
			// eval(locals.join('\n'));
			angular.element('script').append(locals[0]).appendTo('head');
			angular.element('script').append(locals[1]).appendTo('head');
		});
	}
	function IncludeJS(sId, fileUrl, source){
		if ((source != null) && (!document.getElementById(sId))) {
			var oHead = document.getElementsByTagName('HEAD').item(0);
			var oScript = document.createElement("script");
			oScript.language = "javascript";
			oScript.type = "text/javascript";
			oScript.id = sId;
			oScript.defer = true;
			oScript.text = source;
			oHead.appendChild(oScript);
		}
	}
	function LoadJS(id, fileUrl) {
		var scriptTag = document.getElementById(id);
		var oHead = document.getElementsByTagName('HEAD').item(0);
		var oScript = document.createElement("script");
		if (scriptTag) oHead.removeChild(scriptTag);
			oScript.id = id;
		oScript.type = "text/javascript";
		oScript.src = fileUrl;
		oScript.defer = true;
		oHead.appendChild(oScript);
	}
	return {
		restrict 	: 'C',
		// replace 	: true,
		// transclude 	: true,
		scope 		: {
			name 	: '@',
			empty 	: '@'
		},
		// template	: '\
		// 	<textarea id="editor" name="{{name}}" placeholder="{{empty}}" ng-transclude></textarea>\
		// 	',
		link 		: function($scope, iElm, iAttrs){
			var root 			= location.pathname.replace(/^(.+\/).+$/,'$1');
			var resolve			= {};
			var dependencies 	= [
				root+'Public/ueditor/ueditor.config.js',
				root+'Public/ueditor/ueditor.all.min.js'
			];
			// LoadJS(1,dependencies[0]);
			// LoadJS(1,dependencies[1]);
			// $('head').append("<script type='text/javascript' src='"+dependencies[0]+"'</script>");
			// $('head').append("<script type='text/javascript' src='"+dependencies[1]+"'</script>");
			// IncludeJS(1,);
			// alert(typeof UE !== 'undefined')
			// $ocLazyLoad.load({
			// 	cache: false,
			// 	files: dependencies
			// }).then(function(){
			// 	// alert(1)
			// 	alert(typeof UE !== 'undefined')
			// 	var ue = 	UE.getEditor('editor');
			// })
			// asyncjs(dependencies).then(function(){
				// alert(typeof UE !== 'undefined')
				// var id 		= "_editor" + (Date.now())+'_'+Math.floor(Math.random() * 10000);
				// alert(id)
				// iElm.attr('id','editor');
				// iAttrs.id 	= editor;
				// alert(iAttrs.id)
				if(typeof UE !== 'undefined'){
					var editor = UE.getEditor('editor',{
						imagePath			: 'Uploads/images/',
						initialFrameWidth 	: 600,
						initialFrameHeight 	: 300,
	        			autoFloatEnabled 	: false
					});
				}
			// });
		}
	};
})