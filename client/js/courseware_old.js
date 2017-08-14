
$("#ppt-content").load(function(){
    var iframe=$("#ppt-content").contents().find('body');
    var qtype=1;//1为讲解题目，2为练习题
    $('.hid-cid').val(window.location.search.substring(1));
    //同步调用添加缩略图
    function syncH2C(x){
		var i=x;
		var html = '<li><p>'+(i+1)+'</p><div class="thumbnail-view"></div></li>';
        $('.thumbnail-ul').append(html);
		return function(){
			html2canvas(iframe.find('.ppt-page-body').eq(i), {
                allowTaint: true,  
                taintTest: false, 
                useCORS:true, 
                async:false,
                onrendered: function(canvas) {  
                    $('.thumbnail-view').eq(i).append(canvas); 
                }
            });
		}
	}
	
    function updateThumbnail(x){
        html2canvas(iframe.find('.ppt-page-body').eq(x), {
            allowTaint: true,  
            taintTest: false, 
            useCORS:true, 
            async:false,
            onrendered: function(canvas) {  
                $('.thumbnail-view').eq(x).empty().append(canvas); 
            }
        });
    }

    function resortThumbnail(x){
    	for(var i=x ; i<$('.thumbnail-ul li').length;i++){
    		$('.thumbnail-ul li').eq(i).find('p').html(i+1);
    	}
    }

    //锁定课件页
    function focusThumbnail(x){
    	$('.thumbnail-ul li.active').removeClass('active');
    	$('.thumbnail-ul li').eq(x).addClass('active');
    }

    $("body").on("click",function(evt){ 
        if($('.courseware-thumbnail').height()!=166&&window.innerWidth<1500){
            if($(evt.target).parents(".courseware-thumbnail").length==0) 
            { 
                $('.courseware-thumbnail').css('height','167px');
                $('.courseware-thumbnail ul').css({'white-space':'nowrap','overflow-y':'hidden','overflow-x':'scroll','width':'1120px'});
                $('.toggle-thumbnail').show();
            }
        }
        
    })

    $('.up-thumbnail').click(function(){
        if($('.courseware-thumbnail').height()!=166){
            $('.courseware-thumbnail').css('height','167px');
            $('.courseware-thumbnail ul').css({'white-space':'nowrap','overflow-y':'hidden','overflow-x':'scroll','width':'1120px'});
            $('.toggle-thumbnail').show();
        }
    })

    $('.down-thumbnail').click(function(){
        if($('.courseware-thumbnail').height()==166){
            $('.courseware-thumbnail').css({'height':'316px','overflow-x':'hidden'});
            $('.courseware-thumbnail ul').css({'white-space':'normal','overflow-y':'scroll','overflow-x':'hidden','width':'1138px'});
            $('.toggle-thumbnail').hide();
        }
    })

    $(window).resize(function(){
        if(window.innerWidth>=1500){
            $('.courseware-thumbnail').css({'height':'768px','width':'335px'});
            $('.courseware-thumbnail ul').css({'white-space':'normal','overflow-y':'scroll','overflow-x':'hidden','width':'100%'});
            $('.toggle-thumbnail').hide();
        }
        else{
            
            $('.courseware-thumbnail').css({'height':'167px','width':'1138px','overflow':'auto'});
            $('.courseware-thumbnail ul').css({'white-space':'normal','overflow-y':'hidden','overflow-x':'scroll','width':'1120px'});
            $('.toggle-thumbnail').show();
        }
    })

    $('.thumbnail-ul').on('click','li',function(){
    	if(!$(this).hasClass('active')){
            var activeIndex = $('.thumbnail-ul li.active').index();
            if(iframe.find('.ppt-page-body').eq(activeIndex).attr('data-type')==3){
                updateThumbnail(activeIndex);
            }
    		$('.thumbnail-ul li').removeClass();
    		var index = $(this).index();
    		$(this).addClass('active');
    		iframe.find('.ppt-page-body').hide();
            iframe.find('.ppt-page-body').eq(index).show();
            $('.ppt_page').val(index+1);
            savePage(activeIndex);

            
    	}
    });
    

    $('.thumbnail-ul').on('click','.active',function(){
    	if($(this).find('.thumbnail-select').length>0)
    	{
    		$('.thumbnail-select').empty().remove();
    	}
    	else{
	    	var html='<nav class="thumbnail-select">'+
	    				// '<div class="new_page">新建页面</div>'+
	    				'<div class="former_page">上移一页</div>'+
	    				'<div class="next_page">下移一页</div>'+
	    				'<div class="delete_page">删除页面</div>'+
	    			 '</nav>';
	    	$(this).append(html);	
    	}
    	
    })

    $('.thumbnail-ul').on('mouseleave','.active',function(){
    	$(this).find('.thumbnail-select').empty().remove();
    })

    $('.thumbnail-ul').on('click','.former_page',function(event){
    	//event.stopPropagation();
    	moveThumbnail(-1);
    });

    $('.thumbnail-ul').on('click','.next_page',function(event){
    	//event.stopPropagation();
    	moveThumbnail(1);
    });

    //上移下移课件
    function moveThumbnail(x){
    	var index = parseInt($('.ppt_page').val()),
    		totalpage = parseInt($('.totalpage').html());
    	var html = $('.thumbnail-ul li.active')[0].outerHTML;
    	
    	var bhtml = iframe.find('.ppt-page-body').eq(index-1)[0].outerHTML;
    	var newIndex;
    	if(x==-1){
    		if(index==1||index==2){
    			warnDialog("无法上移到首页前");
    			return;
    		}
    		
    	}
    	else if(x==1){
    		if(index==totalpage||index==1){
    			warnDialog("无法下移末页或首页");
    			return;
    		}
    		
    	}
    	
        //resortThumbnail(newIndex-1);
        $.ajax({
        	type:'post',
        	url:'/courseware/api/movePage',
        	datatype:'json',
        	async:false,
        	data:{
        		coursewareId:$('.hid-cid').val(),
        		status:x,
        		index:index
        	},
        	success:function(data){
        		var data=JSON.parse(data);
        		if(data.status==0){
        			if(x==-1){
        				iframe.find('.ppt-page-body').eq(index-2).before(bhtml);
			    		iframe.find('.ppt-page-body').eq(index).empty().remove();
			    		$('.thumbnail-ul li.active').empty().remove();
			    		$('.thumbnail-ul li').eq(index-2).before(html);
			    		newIndex = index-2;
			    		$('.thumbnail-ul li').eq(newIndex).find('p').html(newIndex+1);
			    		$('.thumbnail-ul li').eq(newIndex+1).find('p').html(newIndex+2);
        			}
        			else if(x==1){
        				iframe.find('.ppt-page-body').eq(index-1).empty().remove();
			    		iframe.find('.ppt-page-body').eq(index-1).after(bhtml);
			    		$('.thumbnail-ul li.active').empty().remove();
			    		$('.thumbnail-ul li').eq(index-1).after(html);
			    		newIndex = index;
			    		$('.thumbnail-ul li').eq(newIndex).find('p').html(newIndex+1);
			    		$('.thumbnail-ul li').eq(newIndex-1).find('p').html(newIndex);
        			}
        			$('.thumbnail-select').empty().remove();
			        $('.ppt_page').val(newIndex+1);
			        $('.thumbnail-ul li').eq(newIndex).addClass('active');
			        html2canvas(iframe.find('.ppt-page-body').eq(newIndex), {
			            allowTaint: true,  
			            taintTest: false, 
			            useCORS:true, 
			            async:false,
			            onrendered: function(canvas) {
			                $('.thumbnail-view').eq(newIndex).empty().append(canvas); 
			            }
			        });
        		}
        		else{
        			warnDialog("移动失败");
        		}
        	}
        })
    }
    
    $.ajax({
        url:'/courseware/api/courseinfo',
        type:'post',
        datatype:'json',
        async:false,
        data:{
            coursewareId:$('.hid-cid').val()
        },
        success:function(data){
            var data=JSON.parse(data);
            if(data.status==0){
                
                if(cookie.getCookieValue('teacherInfo')==undefined){
                    alert('尚未登录');
                    window.history.go(-1);
                }
                var teacherInfo = JSON.parse(decodeURIComponent(cookie.getCookieValue('teacherInfo')));
                $('.teacher_avatar').attr("src",teacherInfo.avatar);
                $('.teacher_nick').html(teacherInfo.name+"老师");
                
                $('.stu_name').append(data.courseinfo.name+'&nbsp;'+'<img src="images/'+(data.courseinfo.gender==2?"girl":"boy")+'.png"/>');
                $('.class_time').html(data.courseinfo.time);
                $('.stu_school').html(data.courseinfo.edu_school);
                if(data.courseinfo.avatar==null){
                    $('.header_cover').attr('src',"./images/t_h.png");
                }
                else{
                    $('.header_cover').attr('src',data.courseinfo.avatar);
                }
                $('.stu_grade').html(data.courseinfo.grade);
                $('.stu_subject').html(data.courseinfo.subject);
                if(data.courseinfo.knowledge!=undefined){
                    var knowledge = JSON.parse(data.courseinfo.knowledge);
                    for(var i=0;i<knowledge.length;i++){
                        var html='<li data-by="'+knowledge[i].databy+'" data-s="'+knowledge[i].datas+'" data-g="'+knowledge[i].datag+'" data-id="'+knowledge[i].dataid+'" data-pid="'+knowledge[i].datapid+'" data-pname="'+knowledge[i].datapname+'">'+knowledge[i].text+'<img class="icon-remove-circle" src="images/exit.png"></li>';
                        $('.add_point_content ul').append(html);
                        var html2='<option data-id="'+knowledge[i].dataid+'" data-s="'+knowledge[i].datas+'" data-g="'+knowledge[i].datag+'" data-by="'+knowledge[i].databy+'">'+knowledge[i].text+'</option>';
                        $('.point-select').append(html2);
                    }   
                }

            }
            else if(data.status==9528){
                warnDialog('没有权限');
                setTimeout(function(){
                    window.history.go(-1);
                },500)
                
            }
            
        },
        error:function(){
        	warnDialog("获取课程信息失败");
        }
    });
    
    $("#qmodal").iziModal({
        title: "选择题目",
        //subtitle:"以下是根据知识点得到的题目",
        iconClass: 'icon-announcement',
        iconClass: 'icon-settings_system_daydream',
        transitionIn: 'transitionIn',
        transitionOut: 'transitionOut',
        headerColor: '#fff',
        theme: 'light',
        width: 700,
        overlayClose: true,
        padding:"15px 30px",
        onClosed: function() {
            // $('.add-question').show();
            $('.point-question-content ul li').find('.analysis').filter(function(){return $(this).css('display')!='none';});
            $('.point-question-content ul').off('click','li');
            questionClick();
        }
    });
    $("#modal").iziModal({
        title: "选择知识点",
        subtitle:"",
        textAlign:"center",
        iconClass: 'icon-announcement',
        //iconClass: 'icon-settings_system_daydream',
        transitionIn: 'transitionIn',
        transitionOut: 'transitionOut',
        headerColor: 'transparent',
        theme: 'light',
        width: 500,
        overlayClose: true,
        padding: 30,
        onClosed: function() {
            $('.point-choose').hide();
            $('.point-choose ul li').empty().remove();
        }
    });
    var subject,grade,stu_grade=$('.stu_grade').html().substring(0,1),stu_subject=$('.stu_subject').html(),editionId,xueqi;
    switch(stu_grade){
        case '初':
            grade='c';
            $('.grade-select').find("option[value='c']").prop("selected",true);
            break;
        case '高':
            grade='g';
            $('.grade-select').find("option[value='g']").prop("selected",true);
            break;
        default :
            grade='x';
            $('.grade-select').find("option[value='x']").prop("selected",true);
    }
    switch(stu_subject){
        case '数学':
            subject='02';
            $('.subject-select').find("option[value='02']").prop("selected",true);
            break;
        case '物理':
            subject='04';
            $('.subject-select').find("option[value='04']").prop("selected",true);
            break;
        case '化学':
            subject='05';
            $('.subject-select').find("option[value='05']").prop("selected",true);
            break;
    }

    $('.toggle-exit').click(function(){
        $('#exitLogin').toggle();
    })
    
    $('#exitLogin').click(function(){
        $.ajax({
            url:'/teacher/api/logout',
            type:'GET',
            success:function(data){
                var data = JSON.parse(data);
                if(data.status==0||data.status==1||data.status==9528){
                    if(data.status==9528){
                        alert('您的账户已在其他设备上登录，请重新登录!');
                        cookie.clearCookies();
                    }else{
                        cookie.setCookie('is_Login', true, 0);
                    }
                    window.location.replace("../../index.html");
                }else{
                    warnDialog('后台错误，退出失败！');
                }
            },
            error:function(data){
                warnDialog('后台错误，退出失败！');
            }
        })
        
    })  
    
    var init = function(){        
        //获取全部课件页
        $.ajax({
            url:'/courseware/api/listPage',
            type:'post',
            datatype:'json',
            data:{
                coursewareId:$('.hid-cid').val()
            },
            success:function(data){
                var data=JSON.parse(data);
                for(var i=0;i<data.pageList.length;i++){
                    var html='<div class="ppt-page-body" data-type="'+data.pageList[i].pageType+'" data-id="'+data.pageList[i].id+'" style="display:none;">'
                        html+=data.pageList[i].htmlContent;
                        html+='</div>';
                    iframe.append(html);
                    iframe.find('.ppt-page-body').eq(i).show();
                    
                    var h2c=syncH2C(i)();
                    
                }
                iframe.find('.ppt-page-body').hide().eq(0).show();
                
                $('.ppt_page').val(1);
                $('.totalpage').html(data.total);
                setTimeout(function(){
                    $('.thumbnail-ul li').eq(0).addClass('active');
                },200);
            }
        })
        //查找给该学生上过的课
        $.ajax({
            url:'/courseware/api/searchTeachCount',
            type:'post',
            datatype:'json',
            data:{
                coursewareId:$('.hid-cid').val()
            },
            success:function(data){
                var data=JSON.parse(data);
                $('.teachCount').html(data.teachCount);
                
            },
            error:function(){
                warnDialog("获取上课节数失败");
            }
        })
    	initPointSelect(grade,subject);
    }();
    function initPointSelect(grade,subject){
    	return $.ajax({
	    	url:'/xxbQuestion/searchBySession',
	    	datatype:'json',
	    	type:'post',
	    	data:{
	    		subject:subject,
                grade:grade
	    	},
	    	success:function(data){
	    		$('.pointBySession ul').empty();
	    		var data = JSON.parse(data),editionId;
                var gtdata={};
                gtdata.subject=subject;
                gtdata.grade=grade;

                if(data.sessionList.length>0){
                    gtdata.editionId=data.sessionList[0].editionId;
    	    		for(var i=0;i<data.sessionList.length;i++){
    	    			var html= '<li data-id="'+data.sessionList[i].editionId+'">'+data.sessionList[i].edition+'</li>';
    	    			$('.pointBySession ul').append(html);
    	    		}
                }
                else{
                    var html= '<li data-id="-1">全部</li>';
                    $('.pointBySession ul').append(html);
                    gtdata.editionId=-1;
                }
	    		$('.pointBySession ul li').eq(0).addClass('active');

	    		$.ajax({
			    	url:'/xxbQuestion/searchGradeOrType',
			    	datatype:'json',
			    	type:'post',
                    async:false,
			    	data:gtdata,
			    	success:function(_data){
			    		$('.pointByXueqi ul').empty();
			    		var _data = JSON.parse(_data),date = new Date();
                        var month = date.getMonth()+1;
                        console.log(month);

                        if(_data.xueqiList.length>0){
                            for(var i=0;i<_data.xueqiList.length;i++){
                                var html= '<li data-id="'+_data.xueqiList[i].xueqi+'">'+_data.xueqiList[i].name+'</li>';
                                $('.pointByXueqi ul').append(html);
                            }
                        }
			    		else{
                            var html= '<li data-id="-1">全部</li>';
                            $('.pointByXueqi ul').append(html);
                        }
			    		$('.pointByXueqi ul li').eq(0).addClass('active');
			    	}
			    })
	    	}
	    })
    }
    
    //改变知识点条件项
    $('.point-screening').on('click','li',function(){
    	if(!$(this).hasClass('active')){
    		$(this).siblings().removeClass('active');
    		$(this).addClass('active');
    		var cl=$(this).parent().attr("class");
    		if(cl=="bypoint-ul"){
    			if($(this).hasClass('pointBySection')){
    				$('.pointBySession').show();
    				$('.pointByXueqi').show();
    				$('.pointByDegree').hide();
    				$('.pointByFreq').hide();
    			}
    			else{
    				$('.pointByDegree').show();
    				$('.pointByFreq').show();
    				$('.pointBySession').hide();
    				$('.pointByXueqi').hide();
    			}
    		}
    		else if(cl=="session-ul"){
    			$.ajax({
			    	url:'/xxbQuestion/searchGradeOrType',
			    	datatype:'json',
			    	type:'post',
			    	async:false,
			    	data:{
			    		subject:subject,
		                grade:grade,
		                editionId:$('.session-ul li.active').attr('data-id')
			    	},
			    	success:function(_data){
			    		$('.pointByXueqi ul').empty();
			    		var _data = JSON.parse(_data);
                        
			    		for(var i=0;i<_data.xueqiList.length;i++){
			    			var html= '<li data-id="'+_data.xueqiList[i].xueqi+'">'+_data.xueqiList[i].name+'</li>';
			    			$('.pointByXueqi ul').append(html);
			    		}
			    		$('.pointByXueqi ul li').eq(0).addClass('active');
			    	}
			    })
    		}
    		
    		pointResult();
    	}
    })
	$('.add_point_content').on('click','.icon-remove-circle',function(){
        var id=$(this).parent().attr('data-id');
        $(this).parent().empty().remove();
        // if($('.point-select option').length>0){
        // if($('.point-select option[data-id="'+id+'"]').length>0){
        if($('.point-select').find('option:selected').attr('data-id')==id){
            $('.point-question-content ul').empty();
        }
        $('.point-select option[data-id="'+id+'"]').remove();
        // }
        // }
        saveKnowledge();
	})
    $('.add-point').click(function(){
        if($('.add_point_content ul li').length==10){
            warnDialog("最多选择10个知识点");
            return;
        }
        pointResult();
    })
    var pArray=[$('.subject-select'),$('.grade-select')];
    pArray.map(function(x){
        x.change(function(){
        	grade=$('.grade-select').find('option:selected').val(),subject=$('.subject-select').find('option:selected').val();
        	initPointSelect(grade,subject).then(function(){
        		pointResult();
        	})
        	            
        })
    })
    //获得知识点窗口
    function pointResult(){
        $('.point').empty();
        grade=$('.grade-select').find('option:selected').val(),subject=$('.subject-select').find('option:selected').val();

        
        $("#modal").iziModal('open', function(modal){
            modal.startLoading();
            var data={},url;
            
            data.subject=subject;
            data.grade=grade;

            if($('.pointBySection').hasClass('active')){
	        	editionId=$('.pointBySession li.active').attr('data-id'),xueqi=$('.pointByXueqi li.active').attr('data-id');
	        	data.editionId=editionId,
	        	data.xueqi=xueqi;
	        	url="/xxbQuestion/searchByXueqi"
	        }
	        else{
	        	url="/xxbQuestion/searchByPoint";
	        	if($('.freq-ul li.active').html()!='全部'){
	        		data.frequency=$('.degree-ul li.active').html();
	        	}
	        	if($('.degree-ul li.active').html()!='全部'){
	        		data.degree=$('.degree-ul li.active').attr('data-id');
	        	}
	        }
            $.ajax({
                url:url,
                type:"get",
                datatype:"json",
                async:false,
                data:data,
                error:function(){
                    modal.stopLoading();
                    var html='<div style="text-align:center;margin-top:30px;"><img style="width:30%;" src="images/lackinfo.png"><p style="margin-top:25px;line-height:20px;">暂时还未录入知识点<br>您可以采用上传图片和录入文字的方式<br>编辑课件哟~</p></div>';
                    $('.point').html(html);
                },
                success:function(data){
                    var data=JSON.parse(data);
                    var array=data.pointList;
                    modal.stopLoading();
                    $('.point').html(getTreeTable(array,true,0,0));
                    $(".tree").treemenu({delay:300}).openActive();
                    
                    $('.add_point_content ul li').each(function(){
                        $('.leaf-node[data-id='+$(this).attr('data-id')+']').addClass('leaf-node-focus');
                    })
                    
                }
            })
        })
    }
    function getTreeTable(treeList,flag,pName,pId){
        var str = '';
        for(var i=0;i<treeList.length;i++){
            var ifFlag = (treeList[i].children.length == 0);
            str = str+'<li><em data-id='+treeList[i].fId+' data-pName='+pName+' data-pId='+pId+' '+(!ifFlag ? '':"class='leaf-node'")+'>'
            +treeList[i].fName+'</em>'
            +(ifFlag ? '':getTreeTable(treeList[i].children,false,treeList[i].fName,treeList[i].fId))+'</li>';
        }
        
        if(flag){
            return '<ul class="tree">'+str+'</ul>';
        }
        return '<ul>'+str+'</ul>';
    }
    $('#modal').on("click",".leaf-node",function(){
        var k=0,fId=$(this).attr('data-id'),pointby;
        if($('.point-choose ul li').length+$('.add_point_content ul li').length==10){
            warnDialog("最多选择10个知识点");
            return;
        }
        $('.point-choose ul li').each(function(){
            if($(this).attr('data-id')==fId){
                ++k;
            }
        })
        $('.add_point_content ul li').each(function(){
            if($(this).attr('data-id')==fId){
                ++k;
            }
        })
        if(k){
            warnDialog('知识点已存在');
            return;
        }
        if($('.point-choose ul li').length==0){
            $('.point-choose').show();
        }
        console.log($('.bypoint-ul li.active').index());
        $(this).addClass('leaf-node-focus');
        $('.point-choose ul').append('<li data-id="'+$(this).attr('data-id')+'"  data-by="'+$('.bypoint-ul li.active').index()+'" data-pId="'+$(this).attr('data-pId')+'" data-pName="'+$(this).attr('data-pName')+'">'+$(this).text()+'<img class="icon-remove-circle" src="images/exit.png"></li>');
    })
    $('#modal').on("click",".icon-remove-circle",function(){
        var id = $(this).parent().attr('data-id');
        $('.leaf-node[data-id='+id+']').removeClass('leaf-node-focus');
        $(this).parent().empty().remove();
        if($('.point-choose ul li').length==0){
            $('.point-choose').fadeOut();
        }
    })
    $('.close-modal').click(function(){
        $('#modal').iziModal('close');
    })
    $('.confirm-point').click(function(){
        if($('.point-choose ul li').length==0){
            warnDialog("请选择知识点");
            return;
        }
        // if($('.point-select option').length>0){
        $('.point-choose ul li').each(function(){
            var fId=$(this).attr('data-id'),fName=$(this).text(),pId=$(this).attr('data-pId'),pName=$(this).attr('data-pName');
            $('.add_point_content ul').append('<li data-id="'+$(this).attr('data-id')+'" data-s="'+subject+'" data-g="'+grade+'" data-by="'+$(this).attr('data-by')+'" data-pId="'+$(this).attr('data-pId')+'" data-pName="'+$(this).attr('data-pName')+'">'+$(this).text()+'<img class="icon-remove-circle" src="images/exit.png"></li>');
            var html='<option data-id="'+$(this).attr('data-id')+'" data-s="'+subject+'" data-g="'+grade+'" data-by="'+$(this).attr('data-by')+'">'+$(this).text()+'</option>';
                $('.point-select').append(html);
        })
        // }
        // else{
        //     $('.point-choose ul li').each(function(){
        //         var fId=$(this).attr('data-id'),fName=$(this).text(),pId=$(this).attr('data-pId'),pName=$(this).attr('data-pName');
        //         $('.add_point_content ul').append('<li data-id="'+$(this).attr('data-id')+'" data-by="'+$(this).attr('data-by')+'" data-pId="'+$(this).attr('data-pId')+'" data-pName="'+$(this).attr('data-pName')+'">'+$(this).text()+'<img class="icon-remove-circle" src="images/exit.png"></li>');
                
        //     })   
        // }
        
        saveKnowledge();
        $('#modal').iziModal('close');
    })
    //初始化题目选择条件项
    function initQuestionSelect(){
    	var data={},diff,style;
        data.fName=$('.point-select').find('option:selected').html();

        if($('.style-ul li.active').html()!='全部'){
        	data.fStyleName=$('.style-ul li.active').html();
        }
        if($('.diff-ul li.active').html()!='全部'){
        	data.fAvgDiff=$('.diff-ul li.active').html();
        }

        if($('.source-ul li.active').html()=='全部'){
            var g=$('.point-select').find('option:selected').attr('data-g'),s=$('.point-select').find('option:selected').attr('data-s');
            data.subject = s!="undefined"?s:subject;
            data.grade = g!="undefined"?g:grade;
            $.ajax({
                url:'/xxbQuestion/fTypeNameList',
                type:'post',
                datatype:'json',
                async:false,
                data:data,
                success:function(_data){
                    var _data=JSON.parse(_data);
                    $('.source-ul').empty().append('<li class="active">全部</li>');
                    if(_data.fTypeNameList!=undefined)
                    for(var i=0;i<_data.fTypeNameList.length;i++){
                        var html='<li>'+_data.fTypeNameList[i]+'</li>';
                        $('.source-ul').append(html);
                    }
                }
            }) 
        }
    }

    //改变题目选择条件项
    $('.question-screening').on('click','li',function(){
    	if(!$(this).hasClass('active')){
    		$(this).siblings().removeClass('active');
    		$(this).addClass('active');
    		var cl=$(this).parent().attr("class");
    		if(cl=='style-ul'||cl=='diff-ul'){
    			$.Deferred(function(promise){
			    	initQuestionSelect();
			    	promise.resolve();
			    	return promise;
			    }).then(function(){
			    	questionResult(1);
			    });
    		}
    		else if(cl=='source-ul'){
    			questionResult(1);
    		}
    	}
    });
    //打开选择题目窗口
    var array=[$('.add_question_anlyse'),$('.add_exercises')];
    array.map(function(x){
        x.click(function(){
            qtype=$(this).attr('data-type');
            if($('.add_point_content ul li').length==0){
                warnDialog('请先添加知识点');
                return;
            }
            if($('.point-question-content ul li').length==0){
                // $('.point-select').empty();
                // $('.add_point_content ul li').each(function(){
                //     var html='<option data-id="'+$(this).attr('data-id')+'" data-by="'+$(this).attr('data-by')+'">'+$(this).text()+'</option>';
                //     $('.point-select').append(html);
                // })
                $.Deferred(function(promise){
                    if($('.point-select').find('option:selected').attr('data-by')==0){
                        $('.questionby-img').attr('src','images/bysession.png');
                    }
                    else{
                        $('.questionby-img').attr('src','images/bypoint.png');
                    }
                    initQuestionSelect();
                    promise.resolve();
                    return promise;
                }).done(function(){
                    questionResult(1);
                });  
            }
            else{
                $('#qmodal').iziModal('open');
            }
            
        })    
    })
    //题目左翻页
    $('.left-qpage').click(function(){
        var nowpage=parseInt($('.question-page input').val()),
            totalpage=parseInt($('.totalqpage').text());
        if(nowpage-1>0){
            questionResult(nowpage-1);
        }
        else{
            warnDialog('超出范围');
        }
    })
    //题目右翻页
    $('.right-qpage').click(function(){
        var nowpage=parseInt($('.question-page input').val()),
            totalpage=parseInt($('.totalqpage').text());
        if(nowpage+1<=totalpage){
            questionResult(nowpage+1);
        }
        else{
            warnDialog('超出范围');
        }
    })
    $('.question-sort label').click(function(){
    	if($(this).find('img').attr('data-id')==1){
    		$(this).find('img').attr({'src':'images/qsort_desc.png','data-id':0});
    	}
    	else if($(this).find('img').attr('data-id')==0){
    		$(this).find('img').attr({'src':'images/qsort_asc.png','data-id':1});
    	}
    	questionResult(1);
    })
    //获得题目方法
    function questionResult(pageIndex){
    	var data={},diff,style;
    	data.pageIndex=pageIndex;
    	data.sortNum=$('.question-sort img').attr('data-id');
        data.fName=$('.point-select').find('option:selected').html();
        if($('.style-ul li.active').html()!='全部'){
        	data.fStyleName=$('.style-ul li.active').html();
        }
        if($('.diff-ul li.active').html()!='全部'){
        	data.fAvgDiff=$('.diff-ul li.active').html();
        }
        if($('.source-ul li.active').html()!='全部'){
        	data.fTypeName=$('.source-ul li.active').html();
        }
        if($('#qmodal').is(':hidden')){
            $('#qmodal').iziModal('open');
        }
        var g=$('.point-select').find('option:selected').attr('data-g'),s=$('.point-select').find('option:selected').attr('data-s');
        data.subject = s!="undefined"?s:subject;
        data.grade = g!="undefined"?g:grade;
        $.ajax({
            url:"/xxbQuestion/result",
            type:"get",
            datatype:"json",
            data:data,
            success:function(data){
                var data=JSON.parse(data);
                $('.question-sort p span').html(data.total);
                $('.totalqpage').html(Math.floor((data.total+9)/10));
                $('.question-page input').val(pageIndex);
                $('.point-question-content ul').empty();
                if(data.returnList.length>0){
                    if($('.question-page-content').is(':hidden')){
                        $('.question-page-content').show();
                    }
                    var q_array = new Array();
                    for(var i=0;i<data.returnList.length;i++){
                        var html='<li data-id="'+data.returnList[i].questionId+'"><h3>题目'+(i+1)+':</h3>'+
                        '<div class="stem">'+data.returnList[i].fbody[0]+data.returnList[i].fbody[1]+'</div>'+
                        '<div class="seeQAnswer-content"><span class="question-style" style="display:none;">题型：<span>'+data.returnList[i].fStyleName+'</span></span><span class="question-diff">难度系数：<span>'+data.returnList[i].fAvgDiff+'</span></span><span class="question-frequency">选择次数：<span></span></span><button class="toggle-answer"><i class="icon-angle-down"></i><span>查看解析</span></button></div>'+
                        '<div class="analysis" style="display:none"><h3>试题答案:</h3><p class="question-answer">'+data.returnList[i].fAnswer[0]+'</p><h3>试题分析:</h3><div class="question-analysis">'+data.returnList[i].fWay+'</div><h3>考查知识点:</h3><p class="question-point">'+data.returnList[i].fSecPoint+'</p></div></li>';
                        $('.point-question-content ul').append(html);
                        q_array.push(data.returnList[i].questionId);
                    }
                    $('.sanwser').hide('div');
                    $.ajax({
                        url:"/xxbQuestion/searchQuestionFrequency",
                        type:"get",
                        datatype:"json",
                        data:{
                            questionIdList:JSON.stringify(q_array)
                        },
                        success:function(data){
                            var data=JSON.parse(data);
                            if (data.status==0) {
                                for (var i = 0;i<data.questionFrequencyMap.length;i++) {
                                    $('.question-frequency span').eq(i).html(data.questionFrequencyMap[i]);
                                }
                            }
                        }
                    })
                    iframe.find('.ppt-page-body[data-type=1],.ppt-page-body[data-type=2]').each(function(){
                        $('.point-question-content ul li[data-id='+$(this).find('.question_id').val()+']').addClass('unselect-question').append('<img src="images/unselect.png" style="position:absolute;right:0;top:0;">');
                        $('.point-question-content ul li[data-id='+$(this).find('.question_id').val()+']').find('.toggle-answer').addClass('unselect-answer');
                    });
                    setTimeout(function(){
                        MathJax.Hub.Queue(["Typeset",MathJax.Hub]);
                    },200);
                }
                else{
                    $('.question-page-content').hide();
                    var html='<div style="text-align:center;margin-top:30px;"><img style="width:30%;" src="images/lackinfo.png"><p style="margin-top:25px;line-height:20px;">暂时还未录入题目<br>您可以采用上传图片和录入文字的方式<br>编辑课件哟~</p></div>';
                    $('.point-question-content ul').append(html);
                }
                
            }
        })
    }
    $('.point-question-content ul').on('click','.toggle-answer',function(event){
    	event.stopPropagation();
        if(!$(this).hasClass('unselect-answer')){
        	$(this).find('span').text(($(this).text()=='查看解析'?'收起解析':'查看解析'))
        	$(this).find('i').attr('class',($(this).find('i').attr('class')=='icon-angle-down'?'icon-angle-up':'icon-angle-down'));
        	$(this).parent().parent().find('.analysis').slideToggle();
        }
    })
    $('.point-select').change(function(){

        $.Deferred(function(promise){
            if($('.point-select').find('option:selected').attr('data-by')==0){
                $('.questionby-img').attr('src','images/bysession.png');
            }
            else{
                $('.questionby-img').attr('src','images/bypoint.png');
            }
	    	initQuestionSelect();
	    	promise.resolve();
	    	return promise;
	    }).done(function(){
	    	questionResult(1);
	    });
    });

    function questionClick(){
        $('.point-question-content ul').one('click','li',function(){
            if(!$(this).hasClass('unselect-question')){
                $('.point-question-content ul li.active').removeClass('active');
                $(this).addClass('active');
                addQuestion();
            }
            else{
                warnDialog('该题目已在课件中');
                questionClick();
            }
        })
    };
    questionClick();

    //添加题目
    // $('.add-question').click(function(){
    //     addQuestion();
    // });
    //添加题目
    function addQuestion(){
        if($('.point-question-content ul li.active').length==0){
            warnDialog('请先选择题目');
            return;
        }
        // $('.add-question').hide();
        
        iframe.find('.ppt-page-body').hide();
        var html,html2;
        var arr = new Array();
        // if(qtype==1){
        //         html='<div class="ppt-page-body" data-type="1">';
        //         html+='<div class="ppt-page-header" style="position:relative;width:100%;border-bottom:1px dashed #dcdcdc;height:5%;"><img src="https://xuexibao1.b0.upaiyun.com/courseware/01cae80659204ae5b388c2fc9d01a8e0.jpg" />&nbsp;学习宝，用心做辅导</div>';
        //         html+='<input type="hidden" value="'+$('.point-question-content ul li.active').attr('data-id')+'" data-qid="'+$('.point-question-content ul li.active').attr('data-id')+'" class="question_id"/>';
        //         html+='<div class="ppt-page-content" style="overflow:hidden;width:100%;height:90%;box-sizing:border-box;">';
        //         html+='<div class="ppt-page-stem" style="overflow:hidden;width:100%;float:left;padding:20px;box-sizing:border-box"><h3>题目:</h3>'+$('.point-question-content ul li.active .stem').html()+'</div>';

        //         html+='<div style="clear:both;"></div>';
        //         html+='</div>';
        //         html+='<div class="ppt-page-footer" style="position:relative;width:100%;height:5%;font-size:14px;border-top:1px dashed #dcdcdc;line-height:1"><span style="position:absolute;bottom:0;">一对一直播课</span><span style="position:absolute;bottom:0;right:0;"></span></div>';
        //         html+='</div>';
        //         iframe.append(html);
        // }
        if(qtype==2){
            //题干不截断
            html='<div class="ppt-page-body" data-type="2">';
            html+='<input type="hidden" value="'+$('.point-question-content ul li.active').attr('data-id')+'" data-head="1" data-qid="'+$('.point-question-content ul li.active').attr('data-id')+'" class="question_id"/>';
            html+='<div class="ppt-page-content" style="background:url(https://xuexibao1.b0.upaiyun.com/courseware/1dee0c412a3c4592b65409c86451daa2.jpg) 100% 100%;overflow:hidden;width:100%;height:100%;box-sizing:border-box;padding:20px;">';
            html+='<h2 style="border-left:5px solid #f4a100;padding-left: 10px;margin:0;">'+$('.point-question-content ul li.active .question-style').html()+'</h2>';
            html+='<div class="ppt-page-stem" style="overflow:hidden;width:100%;float:left;box-sizing:border-box;padding: 0 10px;font-size:16px;"><h3>题目:</h3>'+$('.point-question-content ul li.active .stem').html()+'<i style="display:none;">??????</i></div>';
            html+='<div style="clear:both;"></div>';
            html+='</div>';
            html+='</div>';
            arr[0]=html;
            var h1='<h3 style="font-size:15px;width:75px;height:50px;background:url(https://xuexibao1.b0.upaiyun.com/courseware/6d685e4e688447ef8d5e5380f3fec6e3.jpg) no-repeat 100% 100%;color:#fff;font-weight:normal;line-height:50px;text-indent:10px;">答案</h3>';
            var h2='<h3 style="font-size:15px;width:75px;height:50px;background:url(https://xuexibao1.b0.upaiyun.com/courseware/9f920e63c5ba46d5940bfe3bc8793f9e.jpg) no-repeat 100% 100%;color:#fff;font-weight:normal;line-height:50px;text-indent:10px;">解析</h3>';
            var h3='<h3 style="font-size:15px;width:75px;height:50px;background:url(https://xuexibao1.b0.upaiyun.com/courseware/beeaf2e711514eb9b942e17d60fec7bc.jpg) no-repeat 100% 100%;color:#fff;font-weight:normal;line-height:50px;text-indent:10px;">知识点</h3>';
            var analysis_hd='<div class="ppt-page-body" data-type="2">';
                analysis_hd+='<input type="hidden" value="'+$('.point-question-content ul li.active').attr('data-id')+'" data-qid="'+$('.point-question-content ul li.active').attr('data-id')+'" class="question_id"/>';
                analysis_hd+='<div class="ppt-page-content" style="background:url(https://xuexibao1.b0.upaiyun.com/courseware/1dee0c412a3c4592b65409c86451daa2.jpg) 100% 100%;overflow:hidden;width:100%;height:100%;box-sizing:border-box;padding:20px;">';
                analysis_hd+='<div class="ppt-page-analysis" style="overflow:hidden;width:100%;height:100%;float:right;box-sizing:border-box;padding: 0 10px;font-size:16px;">'
            var analysis_ft='</div>';
                analysis_ft+='<div style="clear:both;"></div>';
                analysis_ft+='</div>';
                analysis_ft+='</div>'; 
            console.log($('.point-question-content ul li.active .analysis br').length);
            if($('.point-question-content ul li.active .analysis br').length<=18)//答案解析不截断
            {
                var analysis_html;
                var ana_img_num = $('.point-question-content ul li.active .analysis .question-answer img').length-$('.point-question-content ul li.active .analysis .question-answer img[style*="FLOAT"]').length,
                text_num=$('.point-question-content ul li.active .analysis').text().length/$('.point-question-content ul li.active .analysis br').length;
                if(ana_img_num>0&&$('.point-question-content ul li.active .analysis .question-answer img').eq(0).actual('height')>120||text_num>60){
                    analysis_html=analysis_hd
                            +h1
                            +'<p>'+$('.point-question-content ul li.active .analysis .question-answer').html()+'</p>';
                    analysis_html+=analysis_ft;
                    arr.push(analysis_html);

                    analysis_html=analysis_hd
                        +h2
                        +'<p>'+$('.point-question-content ul li.active .analysis .question-analysis').html()+'</p>'
                        +h3
                        +'<p>'+$('.point-question-content ul li.active .analysis .question-point').html()+'</p>';
                    analysis_html+=analysis_ft;
                    arr.push(analysis_html);

                }
                else{
                    analysis_html='<div class="ppt-page-body" data-type="2">';
                    analysis_html+='<input type="hidden" value="'+$('.point-question-content ul li.active').attr('data-id')+'" data-qid="'+$('.point-question-content ul li.active').attr('data-id')+'" class="question_id"/>';
                    analysis_html+='<div class="ppt-page-content" style="background:url(https://xuexibao1.b0.upaiyun.com/courseware/1dee0c412a3c4592b65409c86451daa2.jpg) 100% 100%;overflow:hidden;width:100%;height:100%;box-sizing:border-box;padding:20px;">';
                    analysis_html+='<div class="ppt-page-analysis" style="overflow:hidden;width:100%;height:100%;float:right;box-sizing:border-box;padding: 0 10px;font-size:16px;">'
                            +h1
                            +'<p>'+$('.point-question-content ul li.active .analysis .question-answer').html()+'</p>'
                            +h2
                            +'<p>'+$('.point-question-content ul li.active .analysis .question-analysis').html()+'</p>'
                            +h3
                            +'<p>'+$('.point-question-content ul li.active .analysis .question-point').html()+'</p>'
                            +'</div>';
                    analysis_html+='<div style="clear:both;"></div>';
                    analysis_html+='</div>';
                    analysis_html+='</div>';
                    arr.push(analysis_html);
                }
            }
            else if($('.point-question-content ul li.active .analysis br').length>18){//答案截断
                
                var analysis_html='';
                var text_num = $('.point-question-content ul li.active .analysis .question-answer').text().length/$('.point-question-content ul li.active .analysis .question-answer br').length;
                console.log($('.point-question-content ul li.active .analysis .question-answer br').length);
                var answer_limit;//答案一页行数
                
                //答案图片个数
                var ana_img_num = $('.point-question-content ul li.active .analysis .question-answer img').length-$('.point-question-content ul li.active .analysis .question-answer img[style*="FLOAT"]').length;
                if(ana_img_num==1){
                    answer_limit=18;
                }
                else if(ana_img_num>=2){
                    answer_limit=12;
                }
                else{
                    if(text_num>60){
                        answer_limit=18;
                    }
                    else{
                        answer_limit=24;
                    }
                }
                console.log('answerlimit:'+answer_limit);
                var answer_length=$('.point-question-content ul li.active .analysis .question-answer br').length;
                
                if(answer_length<=answer_limit){
                    analysis_html=analysis_hd
                            +h1
                            +'<p>'+$('.point-question-content ul li.active .analysis .question-answer').html()+'</p>';
                    analysis_html+=analysis_ft;
                    arr.push(analysis_html);

                    analysis_cut();
                }
                else{
                    var str=$('.point-question-content ul li.active .analysis .question-answer').html();
                    var answer_arr=str.split('<br>');
                    var answer_page;
                    var answer_arr_length=answer_arr.length;
                    if(answer_arr_length/answer_limit > parseInt(answer_arr_length/answer_limit)){   
                        answer_page=parseInt(answer_arr_length/answer_limit)+1;   
                    }else{
                        answer_page=parseInt(answer_arr_length/answer_limit);
                    }
                    for(var i=0;i<answer_page;i++){
                        if(i!=(answer_page-1)){
                            var answer_arr_str = answer_arr.slice(i*answer_limit,(i+1)*answer_limit).join('<br>');
                        }
                        else{
                            var answer_arr_str = answer_arr.slice(i*answer_limit).join('<br>');
                        }
                        analysis_html=analysis_hd
                                +h1
                                +'<p>'+answer_arr_str+'</p>';
                        analysis_html+=analysis_ft;
                        arr.push(analysis_html);
                    }
                        
                    analysis_cut();
                }
                function analysis_cut(){//解析截断
                    var analysis_limit;//解析一页行数
                    console.log('----------');
                    console.log($('.point-question-content ul li.active .analysis .question-analysis img[style*="FLOAT"]').length);
                    console.log($('.point-question-content ul li.active .analysis .question-analysis img').length-$('.point-question-content ul li.active .analysis .question-analysis img[style*="FLOAT"]').length);
                    console.log('----------');
                    //解析图片个数
                    var img_num = $('.point-question-content ul li.active .analysis .question-analysis img').length-$('.point-question-content ul li.active .analysis .question-analysis img[style*="FLOAT"]').length;
                    if(img_num==1){
                        analysis_limit=18;
                    }
                    else if(img_num>=2){
                        analysis_limit=12;
                    }
                    else{
                        analysis_limit=21;
                    }
                    var analysis_length=$('.point-question-content ul li.active .analysis .question-analysis br').length;
                    console.log($('.point-question-content ul li.active .analysis .question-analysis br').length);
                    if(analysis_length<=analysis_limit){
                        analysis_html=analysis_hd
                            +h2
                            +'<p>'+$('.point-question-content ul li.active .analysis .question-analysis').html()+'</p>'
                            +h3
                            +'<p>'+$('.point-question-content ul li.active .analysis .question-point').html()+'</p>';
                        analysis_html+=analysis_ft;
                        arr.push(analysis_html);
                    }
                    else{
                        if($('.point-question-content ul li.active .analysis .question-analysis div').length>0){
                            var astr=$('.point-question-content ul li.active .analysis .question-analysis>div').eq(1).html();
                        }
                        else{
                            var astr=$('.point-question-content ul li.active .analysis .question-analysis').html();
                        }                        
                        var analysis_arr=astr.split('<br>');
                        var analysis_page;
                        var analysis_arr_length=analysis_arr.length;
                        if(analysis_arr_length/analysis_limit > parseInt(analysis_arr_length/analysis_limit)){   
                            analysis_page=parseInt(analysis_arr_length/analysis_limit)+1;   
                        }else{
                            analysis_page=parseInt(analysis_arr_length/analysis_limit);
                        }
                        for(var i=0;i<analysis_page-1;i++){
                            if(i!=(analysis_page-1)){
                                var analysis_arr_str = analysis_arr.slice(i*analysis_limit,(i+1)*analysis_limit).join('<br>');
                            }
                            else{
                                var analysis_arr_str = analysis_arr.slice(i*analysis_limit).join('<br>');
                            }
                            analysis_html=analysis_hd
                                    +h2
                                    +'<p>'+analysis_arr_str+'</p>';
                            analysis_html+=analysis_ft;
                            arr.push(analysis_html);
                        }

                        analysis_html=analysis_hd
                            +h2
                            +'<p>'+analysis_arr.slice((analysis_page-1)*analysis_limit).join('<br>')+'</p>'
                            +h3
                            +'<p>'+$('.point-question-content ul li.active .analysis .question-point').html()+'</p>';
                        analysis_html+=analysis_ft;
                        // console.log(analysis_arr.slice((analysis_page-1)*analysis_limit).join('<br>'));
                        // console.log(analysis_html);
                        arr.push(analysis_html);
                    }
                }
            }
            
            for(var i in arr){
                iframe.append(arr[i]);
            }

        }        
        var totalpage=parseInt($('.totalpage').eq(0).text());
        var data={};
        data.pageType=qtype;
        data.coursewareId=$('.hid-cid').val();
        if(iframe.find('.ppt-page-body').length>0){
            
            if(iframe.find('.ppt-page-body').eq(totalpage-1).attr('data-type')==3){
                data.pageId=iframe.find('.ppt-page-body').eq(totalpage-1).attr('data-id');
                var textarea=iframe.find('.ppt-page-body').eq(totalpage-1).find('.ppt-textarea');
                textarea.html(textarea.val());
                data.htmlContent=iframe.find('.ppt-page-body').eq(totalpage-1).html();
            }
            
        }
        var qhtml_arr = new Array();
        for(var i=0;i<arr.length;i++){
            var pindex = totalpage+i;
            qhtml_arr.push(iframe.find('.ppt-page-body').eq(pindex).html());
            var h2c = syncH2C(pindex)();

        }
        data.qhtml=JSON.stringify(qhtml_arr);
        iframe.find('.ppt-page-body').hide().eq(totalpage).show();
        focusThumbnail(totalpage);
        
        $.ajax({
            url:'/courseware/api/createQuestionPage',
            type:'post',
            datatype:'json',
            async:false,
            data:data,
            success:function(data){
                var data=JSON.parse(data);
                if(data.status==0){
                    for(var i=0;i<data.pageList.length;i++){
                        iframe.find('.ppt-page-body').eq(totalpage+i).append('<input type="hidden" value="'+data.pageList[i]+'" class="pageId"/>');
                        iframe.find('.ppt-page-body').eq(totalpage+i).attr('data-id',data.pageList[i]);
                    }
                }
                else{
                    warnDialog(data.msg+",请刷新后重新添加");
                }
            }
        })
        $.ajax({
            url:'/xxbQuestion/updateQuestionFrequency',
            type:'post',
            datatype:'json',
            data:{
                questionId:$('.point-question-content ul li.active').attr('data-id')
            }
        })
        $('.totalpage').text(totalpage+arr.length);
        $('.ppt_page').val(totalpage+1);
        var question_frequency = parseInt($('.point-question-content ul li.active .question-frequency span').html())+1;
        $('.point-question-content ul li.active .question-frequency span').html(question_frequency);
        $('.point-question-content ul li.active').addClass('unselect-question').append('<img src="images/unselect.png" style="position:absolute;right:0;top:0;">').find('.toggle-answer').addClass('unselect-answer');
        $('.point-question-content ul li.active').removeClass('active');
        $('#qmodal').iziModal('close');

    }

	//添加空白页
    $('.add_textarea').click(function(){
        iframe.find('.ppt-page-body').hide();
        var html='<div class="ppt-page-body" data-type="3">';
            // html+='<div style="position:absolute;top:0;left:0;width:100%;height:100%;opacity:1;z-index:11;">'
            // html+='</div>';
            //html+='<div class="ppt-page-header" style="position:relative;width:100%;border-bottom:1px dashed #dcdcdc;height:5%;"><img src="https://xuexibao1.b0.upaiyun.com/courseware/01cae80659204ae5b388c2fc9d01a8e0.jpg"  />&nbsp;学习宝，用心做辅导</div>';
            html+='<textarea class="ppt-textarea" maxlength="850"  placeholder="在此处输入文本" style="background:url(https://xuexibao1.b0.upaiyun.com/courseware/1dee0c412a3c4592b65409c86451daa2.jpg) 100% 100%;position:relative;overflow:hidden;resize:none;color:#231815;font-family:黑体;line-height:1;letter-spacing:1px;word-spacing:normal;font-size:24px;width:100%;height:100%;box-sizing:border-box;border:none;padding:20px;"></textarea>';
            //html+='<div class="ppt-page-footer" style="position:relative;width:100%;height:5%;font-size:14px;border-top:1px dashed #dcdcdc;line-height:1"><span style="position:absolute;bottom:0;">一对一直播课</span><span style="position:absolute;bottom:0;right:0;"></span></div>';
            
            html+='</div>';
        // $('.courseware-body-left').append(html);
        iframe.append(html);
        var totalpage=parseInt($('.totalpage').eq(0).text());
        var data={};
        data.pageType=3;
        data.coursewareId=$('.hid-cid').val();
        if(iframe.find('.ppt-page-body').length>0){
            data.pageId=iframe.find('.ppt-page-body').eq(totalpage-1).attr('data-id');
            if(iframe.find('.ppt-page-body').eq(totalpage-1).attr('data-type')==3){
                var textarea=iframe.find('.ppt-page-body').eq(totalpage-1).find('.ppt-textarea');
                textarea.html(textarea.val());
            }
            data.htmlContent=iframe.find('.ppt-page-body').eq(totalpage-1).html();
        }
        var h2c = syncH2C(totalpage)();
        focusThumbnail(totalpage);
        $.ajax({
            url:'/courseware/api/createNewPage',
            type:'post',
            datatype:'json',
            async:false,
            data:data,
            success:function(data){
                var data=JSON.parse(data);
                iframe.find('.ppt-page-body').eq(totalpage).append('<input type="hidden" value="'+data.pageId+'" class="pageId"/>');
                iframe.find('.ppt-page-body').eq(totalpage).attr('data-id',data.pageId);
                $.ajax({
                    url:'/courseware/api/savePage',
                    type:'post',
                    datatype:'json',
                    async:false,
                    data:{pageId:data.pageId,htmlContent:iframe.find('.ppt-page-body').eq(totalpage).html()},
                    success:function(data){
                        
                    }
                })
            }
        })
        $('.totalpage').text(totalpage+1);
        $('.ppt_page').val(totalpage+1);
    })

    //向左翻页
    $('.left-page').click(function(){
        var nowpage=parseInt($('.ppt_page').val()),
            totalpage=parseInt($('.totalpage').eq(0).text());
        if(nowpage-1>0){
            savePage(nowpage-1);
            iframe.find('.ppt-page-body').hide();
            iframe.find('.ppt-page-body').eq(nowpage-2).show();
            focusThumbnail(nowpage-2);
            $('.ppt_page').val(nowpage-1);
        }
        else{
            warnDialog('超出范围');
        }
    })
    //向右翻页
    $('.right-page').click(function(){
        var nowpage=parseInt($('.ppt_page').val()),
            totalpage=parseInt($('.totalpage').eq(0).text());
        if(nowpage+1<=totalpage){
            savePage(nowpage-1);
            iframe.find('.ppt-page-body').hide();
            iframe.find('.ppt-page-body').eq(nowpage).show();
            focusThumbnail(nowpage);
            $('.ppt_page').val(nowpage+1);
        }
        else{
            warnDialog('超出范围');
        }
    })
    //删除页面
    $('.thumbnail-ul').on('click','.delete_page',function(event){
        deletePage(event);
    });
    $('.delete_page').click(function(event){
        deletePage(event);
    })
    function deletePage(event){
        event.stopPropagation();
        var data={},index=parseInt($('.ppt_page').val())-1,showindex,totalpage=parseInt($('.totalpage').eq(0).text()),page,type=iframe.find('.ppt-page-body').eq(index).attr('data-type');
        if(type!=0){
            if(totalpage==1){
                iframe.find('.ppt-page-body').empty().remove();
                page=0;
            }
            else if(index-1>=0){
                showindex=index-1;
                page=index;
            }
            else if(index-1<0){
                showindex=index;
                page=index+1;
            }
            else if(totalpage==0){
                return;
            }
        }
        else{
            warnDialog('无法删除首页');
            return;
        }
        var ifquestionhead = false,pageList=new Array(),pageIndex=new Array(),pid,qid;
        if(iframe.find('.ppt-page-body').eq(index).find('.question_id').length>0){
            pid=iframe.find('.ppt-page-body').eq(index).attr('data-id');
            qid=iframe.find('.ppt-page-body').eq(index).find('.question_id').val();
            
            iframe.find('.ppt-page-body .question_id[value='+qid+']').each(function(){
                pageList.push($(this).parent().attr('data-id'));
                pageIndex.push($(this).parent().index());
            })
            if(iframe.find('.ppt-page-body').eq(index).find('.question_id').attr('data-head')==1){//判断是否为题干
                ifquestionhead=true;
            }
        }
        if(ifquestionhead){
            if(confirm('该页为题干,删除该页会删除该题的解析和答案,是否删除？')){
                data.pageList=JSON.stringify(pageList);
                data.coursewareId=$('.hid-cid').val();
                $.ajax({
                    url:'/courseware/api/deleteQuestionPage',
                    type:'post',
                    datatype:'json',
                    async:false,
                    data:data,
                    success:function(data){
                        var data=JSON.parse(data);
                        if(data.status==0){
                            for(var i=0;i<pageIndex.length;i++){
                                $('.thumbnail-ul li').eq(pageIndex[i]).addClass('del_question');
                                iframe.find('.ppt-page-body').eq(pageIndex[i]).addClass('del_question');
                            }
                            $('.del_question').empty().remove();
                            iframe.find('.del_question').empty().remove();
                            focusThumbnail(pageIndex[0]-1);
                            resortThumbnail(pageIndex[0]-1);
                            iframe.find('.ppt-page-body').eq(pageIndex[0]-1).show();
                            $('.totalpage').html(totalpage-pageIndex.length);
                            $('.ppt_page').val(pageIndex[0]);
                            warnDialog('删除成功');
                            var question_frequency = parseInt($('.point-question-content ul li[data-id="'+qid+'"] .question-frequency span').html())-1;
                            $('.point-question-content ul li[data-id="'+qid+'"] .question-frequency span').html(question_frequency);
                            $('.point-question-content ul li[data-id="'+qid+'"]>img').remove();
                            $('.point-question-content ul li[data-id="'+qid+'"]').removeClass('unselect-question').find('.toggle-answer').removeClass('unselect-answer');
                        }
                        else{
                            warnDialog(data.msg);
                        }
                    }
                })
                $.ajax({
                    url:'/xxbQuestion/deleteQuestionFrequency',
                    type:'post',
                    datatype:'json',
                    data:{
                        questionId:qid
                    }
                })
            }
        }
        else{
            delSinglePage();
        }
        
        function delSinglePage(){
            data.pageId=iframe.find('.ppt-page-body').eq(index).attr('data-id');
            data.coursewareId=$('.hid-cid').val();
            $.ajax({
                url:'/courseware/api/deletePage',
                type:'post',
                datatype:'json',
                async:false,
                data:data,
                success:function(data){
                    var data=JSON.parse(data);
                    if(data.status==0){
                        iframe.find('.ppt-page-body').eq(index).empty().remove();
                        iframe.find('.ppt-page-body').eq(showindex).show();
                        focusThumbnail(showindex);
                        $('.thumbnail-ul li').eq(index).empty().remove();
                        $('.totalpage').html(totalpage-1);
                        $('.ppt_page').val(page);
                        resortThumbnail(index);
                        warnDialog('删除成功');
                    }
                    else{
                        warnDialog(data.msg);
                    }
                }
            })    
        }
        
    }

    //保存方法
    function savePage(index){
        var data={};
        data.pageId=iframe.find('.ppt-page-body').eq(index).attr('data-id');
        if(iframe.find('.ppt-page-body').eq(index).attr('data-type')==3){
            var textarea=iframe.find('.ppt-page-body').eq(index).find('.ppt-textarea');
            textarea.html(textarea.val());
        }
        data.htmlContent=iframe.find('.ppt-page-body').eq(index).html();
        if(data.pageId===undefined){
            return;
        }
        
        //$('.ppt-page-body').eq(index).HtmlToImage();
        $.ajax({
            url:'/courseware/api/savePage',
            type:'post',
            datatype:'json',
            data:data,
            success:function(data){
                
            }
        })
    }
    //保存知识点
    function saveKnowledge(){
        var data={},knowledges= new Array();
        data.coursewareId=$('.hid-cid').val();
        $('.add_point_content ul li').each(function(){
            var knowledge={};
            knowledge.databy=$(this).attr('data-by');
            knowledge.dataid=$(this).attr('data-id');
            knowledge.datapid=$(this).attr('data-pid');
            knowledge.datapname=$(this).attr('data-pname');
            knowledge.datag=$(this).attr('data-g');
            knowledge.datas=$(this).attr('data-s');
            knowledge.text=$(this).text();
            knowledges.push(knowledge);
        })
        data.knowledge=JSON.stringify(knowledges);
        $.ajax({
            url:'/courseware/api/saveKnowledge',
            type:'post',
            datatype:'json',
            data:data,
            success:function(data){
                
            }
        })
    }
    //打开保存窗口
    $('.save-ppt').click(function(){
        if(iframe.find('.ppt-page-body').length==1){
            warnDialog('你还未制作课件！');
            return;
        }
        $('.modal').show();
    })


    //点击保存
    $('.confirm-ppt').click(function(){
        var data={},index=parseInt($('.ppt_page').val())-1,image;
        data.pageId=iframe.find('.ppt-page-body').eq(index).attr('data-id');
        if(iframe.find('.ppt-page-body').eq(index).attr('data-type')==3){
            var textarea=iframe.find('.ppt-page-body').eq(index).find('.ppt-textarea');
            textarea.html(textarea.val());
        }
        data.htmlContent=iframe.find('.ppt-page-body').eq(index).html();
        if(data.pageId===undefined){
            return;
        }
        saveKnowledge();
        $.ajax({
            url:'/courseware/api/savePage',
            type:'post',
            datatype:'json',
            async:false,
            data:data,
            success:function(data){
                var data=JSON.parse(data);
                if(data.status==0){
                    $('.modal').fadeOut();
                    setTimeout(function(){
                        warnDialog('保存成功');
                    },500);
                    // location.reload();
                    window.location.replace('/static/broadcast/dist/#/courseMessage/List/1');
                    // window.location.replace('/index.html#/courseMessage/List/1');
                }
                else{
                    warnDialog(data.msg);
                }
            }
        })
    })

    //关闭保存窗口
    $('.close').click(function(){
        $('.modal').fadeOut();
    })
    //取消保存
    $('.cancel-ppt').click(function(){
        $('.modal').fadeOut();
    })
    //前往预览页面
    $('.preview').click(function(){
        var index=parseInt($('.ppt_page').val())-1;
        savePage(index);
        window.open('./preview.html?'+$('.hid-cid').val(),'_blank');
        
        
    })
    //关闭刷新前保存
    window.onbeforeunload=function(){
        var index=parseInt($('.ppt_page').val())-1;
        savePage(index);
    }
    //弹出窗方法
    function warnDialog(text){
        if($('.warnDialog').length>0){
            $('.warnDialog').empty().remove();
        }
        var html='<div class="warnDialog"style="display:none;z-index:9999;position:fixed;top:50%;left:45%;padding:10px 50px;color:#fff;background-color:#000;box-shadow:1px 1px 10px #000;border-radius:5px;"><p style="text-align:center;font-size:18px;font-family:"Microsoft Yahei"">'+text+'</p></div>';
        $('body').append(html);
        $('.warnDialog').show().delay(700).fadeOut();
        
    }
    uploader = WebUploader.create({
        swf: 'js/Uploader.swf',
        server: '/courseware/api/uploadImg',
        pick: {
            id: '.filePicker'
            /*label:'点击选择文件'*/
        },
        /*formData: {  
            record_id: el.attr("data-text")
        },*/
        accept: {
            title: 'Images',
            extensions: 'jpg,png,jpeg',
            mimeTypes: 'image/jpg,image/jpeg,image/png,image/gif'
        },
        multiple:false, //默认为true，就是可以多选
        duplicate : true,//去重， 根据文件名字、文件大小和最后修改时间来生成hash Key. 
        auto: true,
        disableGlobalDnd: true,  
        chunked: true,
        chunkSize : 5*1024*1024, // 分片大小， 5M
        resize:false,
        fileNumLimit: 1,  
        fileSizeLimit: 5*1024*1024,//5M  
        fileSingleSizeLimit: 5*1024*1024 //5M  
    });
    uploader.on('uploadSuccess', function (file,response,percentage ) {
        
        // if(response.type==-1){
        //     warnDialog("您上传的图片宽高比小于1.54，会显示不完整！");
        //     uploader.removeFile(file,true);
        //     console.log(uploader.getFiles().length);
        // }
        // else{
            uploader.removeFile( file, true );
            uploader.reset();
            iframe.find('.ppt-page-body').hide();
            var html='<div class="ppt-page-body" data-type="3">';
                //html+='<div class="ppt-page-header" style="position:relative;width:100%;border-bottom:1px dashed #dcdcdc;height:5%;"><img src="https://xuexibao1.b0.upaiyun.com/courseware/01cae80659204ae5b388c2fc9d01a8e0.jpg"  />&nbsp;学习宝，用心做辅导</div>';
                html+='<div class="ppt-img" style="width:100%;height:100%;box-sizing:border-box;"><span style="height:100%;display:inline-block;vertical-align:middle;"></span>';
                html+='<img crossorigin="anonymous" style="width:100%;vertical-align:middle;'+(response.type==-1?'height:100%':'')+'" src="'+response.url+'"/>';
                html+='</div>';
                //html+='<div class="ppt-page-footer" style="position:relative;width:100%;height:5%;font-size:14px;border-top:1px dashed #dcdcdc;line-height:1"><span style="position:absolute;bottom:0;">一对一直播课</span><span style="position:absolute;bottom:0;right:0;"></span></div>';
                html+='</div>';
            // $('.courseware-body-left').append(html);
            iframe.append(html);
            var totalpage=parseInt($('.totalpage').eq(0).text());
            var data={};
            data.pageType=4;
            data.coursewareId=$('.hid-cid').val();
            if(iframe.find('.ppt-page-body').length>0){
                data.pageId=iframe.find('.ppt-page-body').eq(totalpage-1).attr('data-id');
                if(iframe.find('.ppt-page-body').eq(totalpage-1).attr('data-type')==3){
                    var textarea=iframe.find('.ppt-page-body').eq(totalpage-1).find('.ppt-textarea');
                    textarea.html(textarea.val());
                }
                data.htmlContent=iframe.find('.ppt-page-body').eq(totalpage-1).html();
            }
            syncH2C(totalpage)();
        	focusThumbnail(totalpage);
            $.ajax({
                url:'/courseware/api/createNewPage',
                type:'post',
                datatype:'json',
                data:data,
                success:function(data){
                    var data=JSON.parse(data);
                    iframe.find('.ppt-page-body').eq(totalpage).append('<input type="hidden" value="'+data.pageId+'" class="pageId"/>');
                    iframe.find('.ppt-page-body').eq(totalpage).attr('data-id',data.pageId);
                    $.ajax({
                        url:'/courseware/api/savePage',
                        type:'post',
                        datatype:'json',
                        async:false,
                        data:{pageId:data.pageId,htmlContent:iframe.find('.ppt-page-body').eq(totalpage).html()},
                        success:function(data){
                            
                        }
                    })
                }
            })
            $('.totalpage').text(totalpage+1);
            $('.ppt_page').val(totalpage+1);
        // }
    });
    /*
     * 验证文件格式以及文件大小
     */
    uploader.on("error",function (type){
        console.log(type);
        if (type=="Q_TYPE_DENIED"){
            warnDialog("请上传JPG、PNG格式文件");
        }else if(type=="Q_EXCEED_SIZE_LIMIT"){
            warnDialog("文件大小不能超过5M");
        }
    });
});


