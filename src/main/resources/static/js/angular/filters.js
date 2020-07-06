angular.module("filters",[])
.filter('default',function(){
	return function(val,def){
		return val||def;
	};
})
.filter('join',function(){
	return function(val){
		return (val||[]).join(',');
	};
})
.filter('find',function(){
	return function(val,search){
		return val.indexOf(search)>-1;
	};
})
.filter('bit',function(){
	return function(val){
		var res = 0;
		for(var i = 0; i < val; i++){
			res |= 1<<i;
		};
		return res;
	};
})
.filter('displacement',function(){
	return function(val){
		return 1 << val;
	};
})
.filter('operation',function(){
	return function(val,args,operator){
		var operator = args[1] || '+';
		// return operator;
		return new Function('v1,v2','return v1'+(operator||'+')+'v2')(val,args[0]);
	};
})
.filter('keywords',function(){
	return function(val,word){
		if(word){
			var re = new RegExp("("+word.replace(/[(){}.+*?^$|\\\[\]]/g,"\\$&")+")","ig");
			return val.replace(re,'<b style="color:red;">$1</b>');
		}else
			return val;
	};
})
;
function isset(variable){
	return variable === undefined || variable == null ? false : true;
}
function params(ary){
	var json 	= {};
	ary.map(function(n,i){
		if(/\[\]$/.test(n.name)){
			var key 		= n.name.replace(/\[\]$/,'');
			if(empty(json[key])){
				json[key]	= [];
			}
			json[key].push(n.value);
		}else if(/\[.+?\]$/.test(n.name)){
			var key 		= n.name.replace(/\[.+$/,'');
			var res 		= [];
			var result 		= 'json["'+key+'"]';
			n.name.replace(/\[([^\]]+)\]/ig,function(m,i){
				if(/^\d+$/.test(i)){
					res.push('if(empty('+result+'))'+result+'=[];');
					result += m;
				}else{
					res.push('if(empty('+result+'))'+result+'={};');
					result += '["'+i+'"]';
				}
			});
			result += '=n.value;';
			try{
				eval(res.join('')+result);
			}catch(e){alert(e)}
		}else
			json[n.name]	= n.value;
	});
	return json;
}
Number.prototype.toPercent = function() {
	return Math.round(this * 10000) / 100.00;
}
function Percentage(number1, number2){
	return Math.round(number1 / number2 * 10000) / 100.00;
}