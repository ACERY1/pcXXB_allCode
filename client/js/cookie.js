
var cookie = {
      getCookieValue:function(name){
          var cookieArr = document.cookie.split('; ');
          for(var i = 0; i < cookieArr.length; i++){
              if(cookieArr[i].indexOf(name) >= 0){
                  return cookieArr[i].split('=')[1];
              }
          }
      },
      setCookie:function(name, value, time){
          var d = new Date();
          d.setHours(d.getHours() + time);
          document.cookie = name + '=' + value + '; expires=' + d.toGMTString();
      },
      clearCookies:function(){
          var myDate=new Date();    
        myDate.setTime(-1000);//设置时间    
        var data=document.cookie;    
        var dataArray=data.split("; ");    
        for(var i=0;i<dataArray.length;i++){    
             var varName=dataArray[i].split("=");    
             document.cookie=varName[0]+"=''; expires="+myDate.toGMTString();    
        } 

      }
  };
