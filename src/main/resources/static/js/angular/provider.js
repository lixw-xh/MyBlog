angular.module("provider",[])
.provider('$compiler',function(){
	this.$get 				= function($q,$http,$compile,$templateCache){
		var fetchTemplate 		= function(options){
			if(options.templateUrl){
				return $http.get(options.templateUrl,{cache:$templateCache}).then(function(res){
					return res.data;
				});
			}else{
				return $q.when(options.template);
			}
		}
		return function(options){
			var resolve 		= angular.copy(options.resolve || {});
			resolve.$template 	= fetchTemplate(options);
			return $q.all(resolve).then(function(locals){
				var element		= angular.element('<div></div>').html(locals.$template.trim()).contents();
				var linkFn 		= $compile(element);
				$element 		= linkFn(options.scope);
				options.element.replaceWith($element);
				return $element;
			});
		};
	}
})
.provider('$compileFactory',function(){
	this.$get 				= function($window,$q,$http,$templateCache,$compile,$animate){
		var bodyElement		= angular.element($window.document.body);
		var fetchTemplate	= function(options){
			if(options.templateUrl){
				return $http.get(options.templateUrl,{cache:$templateCache}).then(function(res){
					return res.data;
				});
			}else{
				return $q.when(options.template);
			}
		}
		return function(options){
			return fetchTemplate(options).then(function(html){
				var element	= angular.element('<div></div>').html(html.trim()).contents();
				var linkFn	= $compile(element);
				return {
					element : element,
					compile : function(scope){
						compiled 	= linkFn(scope);
						return element;
					},
					css 	: function(style){
						element.css(style);
					},
					show 	: function(){
						$animate.enter(element,bodyElement,null);
					},
					hide 	: function(){
						$animate.leave(element);
					}
				};
			});
		};
	}
})
.provider('overlay',function(){
	var defaults 			= {
		templateUrl 		: '',
		template 			: '',
		backdrop 			: true,
		keyboard 			: true,
		show 				: true
	};
	this.$get				= function($window,$rootScope,$Compiler,$animate){
		var bodyElement 	= angular.element($window.document.body);
		var Factory 		=  function(config){
			var $modal 		= {};
			var options 	= $modal.$options = angular.extend({},defaults,config);
			var promise 	= $modal.$promise = $Compiler.compile(options);
			var scope 		= $modal.$scope = options.scope && options.scope.$new() || $rootScope.$new();
			scope.$hide 	= function(){
				// scope.$$postDigest(function(){
					$modal.hide();
				// });
			};
			scope.$show 	= function(){
				scope.$$postDigest(function(){
					$modal.show();
				});
			};
			// scope.$toggle 	= function(){
			// 	scope.$$postDigest(function(){
			// 		$modal.toggle();
			// 	});
			// };
			var compileData, modalElement, modalScope;
			if(options.backdrop){
				var backdrop  	= angular.element('<div class="dialog-overlay"></div>');
				// backdrop.one('click',function(evt){
				// 	$modal.hide();
				// });
				// if(options.keyboard){
				// 	bodyElement.one('keyup',function(evt){
				// 		if(evt.which == 27)
				// 			$modal.hide();
				// 	});
				// }
			}
			promise.then(function(data){
				compileData = data;
				$modal.init();
			});
			var resize		= function(){
				modalElement.css({
					'top'		: angular.element(window).height() / 2 - modalElement.height() / 2,
					'left'		: angular.element(window).width() / 2 - modalElement.width() / 2,
				});
			}
			var show 		= function(){
				modalScope 	= $modal.$scope.$new();
				modalElement= $modal.$element = compileData.link(modalScope,function(clonedElement,scope){});
				options.$element = modalElement;
				// modalScope.$digest(function(){
				// 	alert(1)
				// });
				// modalScope.$watch(function(){
				// 	return new Date();
				// }, function(newValue, oldValue){
				// 	console.log(newValue);
				// 	resize();
				// });
				$animate.enter(modalElement,bodyElement,null).then(function(){
					modalElement[0].focus();
					resize();
					if(angular.isFunction(options.showFn))
						options.showFn.call($modal,modalScope);
				});
				if(options.backdrop)
					$animate.enter(backdrop,bodyElement,null);
			}
			var hide 		= function(){
				$animate.leave(modalElement)
				if(options.backdrop)
					$animate.leave(backdrop);
				if(angular.isFunction(options.hideFn))
					options.hideFn.call($modal,modalScope);
			}
			$modal.init 	= function(){
				if(options.show){
					scope.$$postDigest(function(){
						$modal.show();
					});
				}
				return this;
			}
			$modal.destroy 	= function(){
				scope.$destroy();
				return this;
			}
			$modal.resize 	= function(){
				promise.then(resize);
				return this;
			}
			$modal.show 	= function(){
				promise.then(show);
				return this;
			}
			$modal.hide 	= function(){
				promise.then(hide);
				return this;
			}
			return $modal;
		}
		return Factory;
	}
})
.provider('dialog',function(){
	this.$get				= function($rootScope,$sce,overlay,$timeout){
		return function(config){
			var options 	= angular.extend({
				submit 		: false,
				width 		: 0,
				height 		: 0,
				title 		: '标题',
				content		: '',
				btns 		: 1 | 2 | 4,
				show 		: true
			},config);
			var scope 		= options.scope && options.scope.$new() || $rootScope.$new();
			scope.$size 	= {};
			if(options.width>0)
				scope.$size.width 	= options.width;
			if(options.height>0)
				scope.$size.height 	= options.height;
			angular.forEach(['title','content'],function(key){
				if(options[key]) scope[key] = $sce.trustAsHtml(options[key]);
			});// ng-template="content"
			var tagStart 	= 'div class="dialog',
				tagEnd		= 'div',
				alert		= '',
				confirm 	= '<button ng-if="$btns[2]" type="button" class="btn btn-primary" ng-click="$confirm()">确定</button>';
			if(options.submit){
				tagStart 	= 'form class="dialog form-horizontal" name="xForm" novalidate ng-submit="$submit(xForm)"';
				tagEnd		= 'form';
				alert 		= '<div ng-if="$error&&$error.status" class="alert" ng-class="{\'alert-danger\':$error.status==-1,\'alert-info\':$error.status==1}">'+
					'	<span class="glyphicon glyphicon-exclamation-sign"></span>'+
					'	<span class="sr-only">Error:</span>{{$error.msg}}'+
					'</div>';
				confirm 	= '<button ng-if="$btns[2]" type="submit" class="btn btn-primary">'+options.submit+'</button>';
			}
			return overlay({
				title 		: options.title,
				scope 		: scope,
				show 		: options.show,
				template 	: '<'+tagStart+' ng-style="$size">'+
					'<div class="dialog-header">'+
					'	<div class="dialog-title">{{title}}</div>'+
					'	<button ng-if="$btns[0]" type="button" class="close" ng-click="$close()"><span>&times;</span></button>'+
					'</div>'+
					'<div class="dialog-body">'+
					'	<div class="dialog-body-content">'+alert+options.content+
					'	</div>'+
					'</div>'+
					'<div class="dialog-buttons">'+
					'	<div class="btn-group">'+confirm+
					// '		<button ng-if="$btns[0]" type="button" class="btn btn-primary" ng-click="$confirm()">确定</button>'+
					'		<button ng-if="$btns[1]" type="button" class="btn btn-default" ng-click="$close()">关闭</button>'+
					'	</div>'+
					'</div>'+
					'</'+tagEnd+'>',
				controller 	: function($scope,$element){
					$scope.$btns		= [
						(options.btns & 1) > 0,
						(options.btns & 2) > 0,
						(options.btns & 4) > 0
					];
					$scope.$watch('$error.status', function(newValue, oldValue){
						if(newValue != oldValue){
							var seconds = newValue < 0?3:1;
							$timeout(function(){
								$scope.$error.status 	= 0;
								if(newValue==1)
									$timeout(function(){
										$scope.$error.fn($scope);
									},500);
							},1000 * seconds);
						}
					});
					$scope.$close		= function(){
						$scope.$hide();
						if(angular.isFunction(options.close))
							options.close($scope);
					}
					$scope.$confirm		= function(){
						$scope.$hide();
						if(angular.isFunction(options.confirm))
							options.confirm($scope,$element);
					}
					$scope.$submit 		= function(xForm){
						if(xForm.$valid){
							if(angular.isFunction(options.submitFn) && options.submitFn($scope) !== false)
								$scope.$hide();
						}
					}
					if(angular.isFunction(options.controller))
						options.controller.apply(this,arguments);
				},
				showFn 		: function($scope){
					$element 		= this.$element;
					$scope.$resize	= function(){
						$timeout(function(){
						var w			= angular.element(window).width(),
							h			= angular.element(window).height();
						console.log(w);
						console.log(h);
						var head 		= $element.find('.dialog-header').outerHeight(),
							foot 		= $element.find('.dialog-buttons').outerHeight();
						$element.find('.dialog-body').css('max-height',Math.round(h * 0.8) - head - foot);
						$element.css({
							'top'		: h / 2 - $element.height() / 2,
							'left'		: w / 2 - $element.width() / 2,
						});
						});
					}
					$scope.$resize();
				}
			});
		}
	}
})

.provider('$upload',function(){
	this.$get 						= function($q,$http){
		return function(file,url){
			var deferred 			= $q.defer();
			var promise 			= deferred.promise;
			var chunk				= 2 * 1024 * 1024;
			var name 				= file.name;
			var size				= file.size;
			var chunks				= Math.ceil(size / chunk);
			var prog 				= 0;
			(function(i){
				var __callee__		= arguments.callee;
				var start 			= (i - 1) * chunk,
					end 			= Math.min(size, start + chunk);
				var fd 				= new FormData();
					fd.append("file",file.slice(start,end));
					fd.append("name",name);
					fd.append("chunk",i);
					fd.append("chunks",chunks);
					$http.post(url,fd,{
						headers:{'Content-Type': undefined},
						// uploadEventHandlers:{
						// 	'progress' : function(e){
						// 		if(e.lengthComputable){
						// 			// prog += e.loaded;
						// 			deferred.notify({loaded:e.loaded+start,total:size});
						// 		}
						// 		// alert('progress'+angular.toJson(e))
						// 	},
						// 	'load' : function(e){
						// 		// alert('load'+e.loaded+' '+e.total+' '+e.type+' '+e.target)
						// 		if(e.lengthComputable){
						// 			deferred.notify({loaded:e.loaded+start,total:size});
						// 		}
						// 	}
						// }
					}).success(function(res){
						if(res.success){
							deferred.notify({chunk:i,loaded:end,total:size});
							if(i < chunks){
								__callee__(i+1);
							}else{
								deferred.resolve(res);
							}
						}else{
							alert(res.msg);
						}
					}).error(function(e){
						deferred.reject(e);
					});
			})(1);
			promise.progress 			= function(fn){
				promise.then(null,null,function(n){
					fn(n);
				});
				return promise;
			};
			promise.success 			= function(fn) {
				promise.then(function(n) {
					fn(n);
				});
				return promise;
			};
			return promise;
		};
	}
})