//1.将div转成svg  
(function($){
	
	
	$.fn.HtmlToImage=function(){

	    var divContent = this.html();  
	    var data = "data:image/svg+xml," +  
	    "<svg xmlns='http://www.w3.org/2000/svg' width='100%' height='100%'>" +  
	    "<foreignObject width='100%' height='100%'>" +  
	    "<div xmlns='http://www.w3.org/1999/xhtml' style='font-size:16px;font-family:Helvetica'>" +  
	    divContent +  
	    "</div>" +  
	    "</foreignObject>" +  
	    "</svg>";  
	    var img = new Image();  
	    img.src = data;  
	    document.getElementsByTagName('body')[0].appendChild(img);  
	    
	    //2.svg转成canvas  
	    var canvas = document.createElement('canvas');  //准备空画布  
	    canvas.width = img.width;  
	    canvas.height = img.height;  
	  
	    var context = canvas.getContext('2d');  //取得画布的2d绘图上下文  
	    context.drawImage(img, 0, 0);  
	  
	     
	    //var a = document.createElement('a');  
	    //a.href = canvas.toDataURL('image/png');  //将画布内的信息导出为png图片数据  
	    //a.download = "MapByMathArtSys";  //设定下载名称  
	    //a.click(); //点击触发下载  
	  
	  
	    //3. 图片导出为 png 格式  
	    var type = 'png';  
	    var imgData = canvas.toDataURL(type);  
	  
	        /**  
	     * 获取mimeType  
	     * @param  {String} type the old mime-type  
	     * @return the new mime-type  
	     */  
	    var _fixType = function (type) {  
	        type = type.toLowerCase().replace(/jpg/i, 'jpeg');  
	        var r = type.match(/png|jpeg|bmp|gif/)[0];  
	        return 'image/' + r;  
	    };  
	  
	    // 加工image data，替换mime type  
	    imgData = imgData.replace(_fixType(type), 'image/octet-stream');  
	  
	  
	  
	    /**  
	     * 在本地进行文件保存  
	     * @param  {String} data     要保存到本地的图片数据  
	     * @param  {String} filename 文件名  
	     */  
	    var saveFile = function (data, filename) {  
	        var save_link = document.createElementNS('http://www.w3.org/1999/xhtml', 'a');  
	        save_link.href = data;  
	        save_link.download = filename;  
	  
	        var event = document.createEvent('MouseEvents');  
	        event.initMouseEvent('click', true, false, window, 0, 0, 0, 0, 0, false, false, false, false, 0, null);  
	        save_link.dispatchEvent(event);  
	    };  
	  
	    // 下载后的图片名  
	    var filename = 'code_' + (new Date()).getTime() + '.' + type;  
	    // download  
	    saveFile(imgData, filename);  
	    
	    var _parentElement = img.parentNode;
	    
	    _parentElement.removeChild(img);
	    
	    return this;
	}
})(jQuery);