angular.module("service",[])
.service('$Compiler',function($q,$http,$injector,$compile,$controller,$templateCache){
	var fetchTemplate 		= function(options){
		if(options.templateUrl){
			return $http.get(options.templateUrl,{cache:$templateCache}).then(function(res){
				return res.data;
			});
		}else{
			return $q.when(options.template);
		}
	}
	this.compile 			= function(options){
		var controller 		= options.controller;
		var transformTemplate = options.transformTemplate || angular.identity;
		var resolve 		= angular.copy(options.resolve || {});
		angular.forEach(resolve,function(value,kkey){
			if(angular.isString(value)){
				resolve[k]	= $injector.get(value);
			}else{
				resolve[k]	= $injector.invoke(value);
			}
		});
		resolve.$template 	= fetchTemplate(options);
		return $q.all(resolve).then(function(locals){
			var template 	= transformTemplate(locals.$template);
			var element 	= angular.element('<div></div>').html(template.trim()).contents();
			var linkFn 		= $compile(element);
			return {
				locals 		: locals,
				element 	: element,
				link 		: function(scope){
					locals.$scope 	= scope;
					locals.$element	= linkFn.apply(null,arguments);
					if(controller){
						$controller(controller,locals);
					}
					return locals.$element;
				}
			};
		});
	}
})
.service('fileReader',function($q){
	this.readAsDataUrl 		= function(file){
		var deferred 		= $q.defer();
		var reader 			= new FileReader();
		reader.onload 		= function(e){
			deferred.resolve(e.target.result);
		}
		reader.onerror 		= function(){
			deferred.reject(this.result);
		}
		reader.readAsDataURL(file);
		return deferred.promise;
	}
	var getObjectURL = function(file) {
		var url = null;
		if (window.createObjectURL != undefined) {
			url = window.createObjectURL(file)
		} else if (window.URL != undefined) {
			url = window.URL.createObjectURL(file)
		} else if (window.webkitURL != undefined) {
			url = window.webkitURL.createObjectURL(file)
		}
		return url
	}
})
.factory('autoImage',function($q){
	var root 		= location.pathname.replace(/^((?:.+)?\/).+$/,'$1');
	var imgAuto 	= function(img,image,w,h,deferred){
		var width   = img.width;
        var height  = img.height;
        var pwidth  = w;
        var pheight = h;
        if(width>0 && height>0){
            var rate = (pwidth/width < pheight/height) ? pwidth/width : pheight/height;
            if(rate <= 1){
                width  *=  rate;
                height *=  rate;
            }
            var left = (pwidth - width) * 0.5;
            var top  = (pheight - height) * 0.5;
            image.css({
                "margin-left" : left + "px",
                "margin-top"  : top + "px",
                "width"       : width + "px",
                "height"      : height + "px"
            });
            image.attr("src",img.src).show();
            deferred.resolve({w:img.width,h:img.height,src:img.src});
        }
	}
	return function(image,src,w,h){
		var deferred 		= $q.defer();
		var img     		= new Image();
		img.src     		= (/^(?:blob|data):/.test(src)?'':root)+src;
		if(img.complete){
            image.attr("src",img.src);
            imgAuto(img,image,w,h,deferred);
        }else{
        	img.onload 		= function(){
        		imgAuto(img,image,w,h,deferred);
        	}
        	img.onerror 	= function(){
        		image.hide();
        		deferred.reject(img.src);
        	}
        }
        return deferred.promise;
	};
});