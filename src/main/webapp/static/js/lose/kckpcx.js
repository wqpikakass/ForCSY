
$(function() {
	initResize();
	//初始化尺寸
	$(window).resize(function(){
		initResize();
	});
	initComponent();
	loadLxk();
	restParam();
	$('#user-name').val($('#hidden_param').val());
});
function initResize(){
	var  winWidth = $(window).width();//窗口宽度
	var  winHeight = $(window).height();//窗口高度
	$(".whole-div").width(winWidth); //整体的宽度
	$(".whole-div").height(winHeight - 45);//整体的高度
	$(".main-top").height(winHeight/6);//整体的高度
	$('#dataGrid').height($('.main-top').height() - $('.titleDiv').height());
	$('.main-top1').height($('.whole-div').height() - $('.main-top').height()-35);
	$('.main-top1').width($('.main-top').width());
	$('#mainDiv1').height($('.main-top1').height() - $('.titleDiv').height()-4);
	$('#mainDiv1').width(($('.main-top1').width()/100)*28);
	$('#mainDiv2').height($('.main-top1').height() - $('.titleDiv').height()-4);
	$('#mainDiv2').width(($('.main-top1').width()/100)*71);
}
//加载省份简称
var values = "";
function loadLxk(){
	$.ajax({
		type: "post",
		url: rootPath + "/xtpz",
		data: {
		},
		dataType: "json",
		async: false,
		success: function(rst){
			if(rst.error != ""){
				alert(rst.error);
				return ;
			}else{
				if(null != rst.data && rst.data.length > 0){
					$.each(rst.data, function (i, item) {
						jQuery("#list").append("<option value="+ item.id+">"+ item.dmxywm+"</option>");
					}); 
				}
				$("#values").html(rst.cysf.val);
				values = rst;
			}
		}
	});
}
//注册点击事件
function initComponent(){
	//查询按钮注册
	$("#vehicleSearchBtn").click(function(){
		btnSearch();
	});
	//重置按钮注册
	$("#vehicleSearchResetBtn").click(function(){
		restParam();
	});
}
//把条件参数重置成空
function restParam(){
	$("#list").val("-1");
	$('#wxh').val('');
	$('#hphmInput').val('');
	$('#kssj').val($('#hidden_kssj').val());
	$('#jssj').val($('#hidden_jssj').val());
}
//选中默认省份值改变对应的下拉框值
function Switch() {
    $("#list").val(values.cysf.description);
}
//查询方法
function btnSearch(){
	var hphm = "";
	for(var i = 0; i < values.data.length; i ++){
		if($("#list").val() == values.data[i].id){
			hphm = values.data[i].dmxywm;
		}
	}
	if($('#hphmInput').val() != "" && $('#hphmInput').val() != null){
		hphm = hphm + $('#hphmInput').val();
	}
	$.ajax({
		type: "post",
		url: rootPath + "/kckpcx",
		data: {
			kssj:$('#kssj').val(),
			jssj:$('#jssj').val(),
			wxzh:$('#wxh').val(),
			hphm:hphm
		},
		dataType: "json",
		async: false,
		success: function(data){
			if(data.error != ""){
				alert(data.error);
				return ;
			}else{
				$("#mainDiv1").empty(); 
				$("#mainDiv2").empty();
				if(data.length == 0){
					alert("没有查询到数据");
				}
				makeLeftTable(data);
			}
		}
	});
}
var jsonData = "";
//左侧动态生成快处快赔查询列表
function makeLeftTable(data){
	if(data.data != null && data.data.length > 0){
		jsonData = data;
		$.each(data.data, function (i, item) {
			var j = i + 1;
			$("#mainDiv1").append("<div id='main"+i+"' class='item_over' onmouseover='sizeOver("+i+")' onmouseout='sizeOut("+i+")' style='width: 100%;height:100px;border: 1px solid #d1d1d1;cursor:pointer' onclick='onClick(this,"+JSON.stringify(item)+","+i+")'></div>");
			$("#main"+i).append("<div id='divDiv"+i+"' style='width:25%;float: left;margin-top: 15px;text-align: center;position: relative'></div>");
			$("#divDiv"+i).append("<div id='text' style='position: absolute; top: 25px; left: 45%;'><p>"+j+"</p></div>");
			$("#divDiv"+i).append("<img  id='images' src='"+rootPath+"/static/img/common/background.png' />");
			$("#main"+i).append("<div id='divTable"+i+"' style='width:75%;float: right;margin-top: 5px;'></div>");
			$("#divTable"+i).append("<table id='table"+i+"'></table>");
			$("#table"+i).append("<tr id='tr1"+i+"'></tr>");
			$("#tr1"+i).append("<td style='height:30px;'><strong>号牌号码:</strong></td>");
			var hphm = "";
			if(item.bDriverInfos != null && item.bDriverInfos.length > 0){
				$.each(item.bDriverInfos, function (i, items) {
					if(items == null || items.hphm == ""){
						hphm = hphm + "无车牌  ";
					}else{
						hphm = hphm + items.hphm + " ";
					}
				});
			}
			$("#tr1"+i).append("<td style='height:30px;'>"+hphm+"</td>");
			$("#table"+i).append("<tr id='tr2"+i+"'></tr>");
			$("#tr2"+i).append("<td style='height:30px;'><strong>微信号:</strong></td>");
			$("#tr2"+i).append("<td style='height:30px;'>"+item.wxzh+"</td>");
			$("#table"+i).append("<tr id='tr3"+i+"'></tr>");
			$("#tr3"+i).append("<td style='height:30px;'><strong>事故时间:</strong></td>");
			$("#tr3"+i).append("<td style='height:30px;'>"+item.sgsj+"</td>");
		}); 
	}
}
//鼠标移入事件
function sizeOver(e){
	if($("#main"+e).attr('class') != "d_over item_over"){
		$("#main"+e).removeClass("item_over");
		$("#main"+e).addClass("d_out");
	}
}
//鼠标移出事件
function sizeOut(e){
	$("#main"+e).removeClass("d_out");
	$("#main"+e).addClass("item_over");
}
//选中区域的点击事件
function onClick(value,data,e){
	$.each(jsonData.data, function (i, item) {
		if(i != e && $("#main"+i).attr('class') == "d_over item_over"){
			$("#main"+i).removeClass("d_over");
		}
	});
	codeLatLng(data);
	$("#main"+e).removeClass("d_out");
	$("#main"+e).addClass("d_over");
}
//根据地图上面的经纬度来获取具体城市坐在位置名称
var sgwzmc = "";
function codeLatLng(data){
	var geocoder = new qq.maps.Geocoder();
	var latLng = new qq.maps.LatLng(data.sgwd,data.sgjd);
	geocoder.getAddress(latLng);//对指定经纬度进行解析
	geocoder.setComplete(function(result) {
		sgwzmc = result.detail.address;
		makeRightLane(data);
     });
	//若服务请求失败，则运行以下函数
    geocoder.setError(function() {
       alert("出错了，请输入正确的经纬度！！！");
    });

}
//点击图片进行放大
function onClickImage(e,url){
	window.open(url);
}
//右侧区域动态生成
function makeRightLane(data){
	$("#mainDiv2").empty();
	//微信
	$("#mainDiv2").append("<div id='right1' style='width: 99.7%;border: 1px solid #d1d1d1;'></div>");
	$("#right1").height(($("#mainDiv2").height()/100)*15);
	$("#right1").append("<table id='rightTable' style='width:100%;height:100%;'></table>");
	$("#rightTable").append("<tr id='rightTr'></tr>");
	$("#rightTr").append("<td></td>");
	$("#rightTr").append("<td style='text-align: center;width: 10%;'><img src='"+data.wxtx+"'></td>");
	$("#rightTr").append("<td style='text-align: left;width: 30%;font-size:18px'><font color='#41D4FF'>"+data.wxzh+"</font></td>");
	$("#rightTr").append("<td></td>");
	//事故信息
	$("#mainDiv2").append("<div id='right2'style='width:99.7%;border: 1px solid #d1d1d1;'></div>");
	$("#right2").height(($("#mainDiv2").height()/100)*30);
	$("#right2").append("<div id='accident'style='width: 100%;'></div>");
	$("#accident").height(($("#right2").height()/100)*20);
	$("#accident").append("<div id='accidentdiv'style='padding-left:20px;margin-top: 10px;'></div>");
	$("#accidentdiv").append("<img style='float: left;' src='"+rootPath+"/static/img/common/accident.png'/>");
	$("#accidentdiv").append("<font color='#41D4FF' style='float: left;padding-left: 10px;font-size:18px;' >事故信息</font>");
	$("#right2").append("<div id='accidentTable' style='width: 100%;'></div>");
	$("#accidentTable").height(($("#right2").height()/100)*73);
	$("#accidentTable").append("<table id='accidenttable' style='width:100%;height:100%;border: 1px solid #d1d1d1;'></table>");
	$("#accidenttable").append("<tr id='accidenttr1' style='border: 1px solid #d1d1d1;'></tr>");
	$("#accidenttable").append("<tr id='accidenttr2' style='border: 1px solid #d1d1d1;'></tr>");
	if(data.sgms.length > 60){
		$("#right2").height(($("#mainDiv2").height()/100)*40);
		$("#accidentTable").height(($("#right2").height()/100)*79);
		$("#accidenttr1").append("<td style='width:10%;font-size:17px' class='znjt-search-label znjt-color-background-5 znjt-text-align-center'><strong>事故时间</strong></td>");
		$("#accidenttr1").append("<td style='width:17%;font-size:15px'>"+data.sgsj+"</td>");
		$("#accidenttr1").append("<td style='width:10%;font-size:17px'class='znjt-search-label znjt-color-background-5 znjt-text-align-center'><strong>事故地点</strong></td>");
		$("#accidenttr1").append("<td style='width:63%;font-size:15px'>"+sgwzmc+"</td>");
		$("#accidenttr2").append("<td style='width:10%;font-size:17px'class='znjt-search-label znjt-color-background-5 znjt-text-align-center'><strong>事故责任</strong></td>");
		$("#accidenttr2").append("<td style='width:17%;font-size:15px'>"+data.sgzr+"</td>");
		$("#accidenttr2").append("<td style='width:10%;font-size:17px'class='znjt-search-label znjt-color-background-5 znjt-text-align-center'><strong>事故描述</strong></td>");
		$("#accidenttr2").append("<td style='width:63%;font-size:15px'>"+data.sgms+"</td>");
	}else{
		$("#accidenttr1").append("<td style='width:10%;font-size:17px' class='znjt-search-label znjt-color-background-5 znjt-text-align-center'><strong>事故时间</strong></td>");
		$("#accidenttr1").append("<td style='width:25%;font-size:15px'>"+data.sgsj+"</td>");
		$("#accidenttr1").append("<td style='width:10%;font-size:17px'class='znjt-search-label znjt-color-background-5 znjt-text-align-center'><strong>事故地点</strong></td>");
		$("#accidenttr1").append("<td style='width:55%;font-size:15px'>"+sgwzmc+"</td>");
		$("#accidenttr2").append("<td style='width:10%;font-size:17px'class='znjt-search-label znjt-color-background-5 znjt-text-align-center'><strong>事故责任</strong></td>");
		$("#accidenttr2").append("<td style='width:25%;font-size:15px'>"+data.sgzr+"</td>");
		$("#accidenttr2").append("<td style='width:10%;font-size:17px'class='znjt-search-label znjt-color-background-5 znjt-text-align-center'><strong>事故描述</strong></td>");
		$("#accidenttr2").append("<td style='width:55%;font-size:15px'>"+data.sgms+"</td>");
	}
	//驾驶员信息
	if(data.bDriverInfos != null && data.bDriverInfos.length > 0){
		$.each(data.bDriverInfos, function (i, items) {
			$("#mainDiv2").append("<div id='driverDiv"+i+"' style='width:99.7%;border: 1px solid #d1d1d1;'></div>");
			$("#driverDiv"+i).height(($("#mainDiv2").height()/100)*20);
			$("#driverDiv"+i).append("<div id='driverdiv"+i+"' style='width: 100%;'></div>");
			$("#driverdiv"+i).height(($("#driverDiv"+i).height()/100)*30);
			$("#driverdiv"+i).append("<div id='driverdiv1"+i+"' style='padding-left:20px;margin-top: 10px;'></div>");
			$("#driverdiv1"+i).append("<img style='float: left;' src='"+rootPath+"/static/img/common/driver.png'/>");
			if(items.name == ""){
				$("#driverdiv1"+i).append("<font color='#41D4FF' style='float: left;padding-left: 10px;font-size:18px;'>第"+(i+1)+"位驾驶员信息</font>");
			}else{
				$("#driverdiv1"+i).append("<font color='#41D4FF' style='float: left;padding-left: 10px;font-size:18px;'>驾驶员信息："+items.name+"</font>");
			}
			$("#driverDiv"+i).append("<div id='driver"+i+"' style='width: 100%;'></div>");
			$("#driver"+i).height(($("#driverDiv"+i).height()/100)*60);
			$("#driver"+i).append("<table id='driverTable"+i+"' style='width:100%;height:100%;border: 1px solid #d1d1d1;'></table>");
			$("#driverTable"+i).append("<tr id='driverTr"+i+"' style='border: 1px solid #d1d1d1;'></tr>");
			$("#driverTr"+i).append("<td style='width:10%;font-size:17px' class='znjt-search-label znjt-color-background-5 znjt-text-align-center'><strong>姓名</strong></td>");
			$("#driverTr"+i).append("<td style='width:16%;font-size:15px'>"+items.name+"</td>");
			$("#driverTr"+i).append("<td style='width:10%;font-size:17px' class='znjt-search-label znjt-color-background-5 znjt-text-align-center'><strong>号牌号码</strong></td>");
			$("#driverTr"+i).append("<td style='width:12%;font-size:15px'>"+items.hphm+"</td>");
			$("#driverTr"+i).append("<td style='width:10%;font-size:17px' class='znjt-search-label znjt-color-background-5 znjt-text-align-center'><strong>联系方式</strong></td>");
			$("#driverTr"+i).append("<td style='width:12%;font-size:15px'>"+items.contact+"</td>");
			$("#driverTr"+i).append("<td style='width:30%;'></td>");
		});
	}
	//现场照片
	var imagePath = data.imagePath+"/"+data.sgsj.substring(0,10)+"/"+data.wxid+"/";
	if(data.liveImage != ""){
		$("#mainDiv2").append("<div id='imageDiv' style='width:99.7%;border: 1px solid #d1d1d1;'></div>");
		$("#imageDiv").height(($("#mainDiv2").height()/100)*45);
		$("#imageDiv").append("<div id='imageFirst'style='width: 100%;'></div>");
		$("#imageFirst").height(($("#imageDiv").height()/100)*10);
		$("#imageFirst").append("<div id='imageTwo'style='padding-left:20px;margin-top: 10px;'></div>");
		$("#imageTwo").append("<img style='float: left;' src='"+rootPath+"/static/img/common/site.png'/>");
		$("#imageTwo").append("<font color='#41D4FF' style='float: left;padding-left: 10px;font-size:18px;'>现场照片</font>");
		$("#imageDiv").append("<div id='imageFirst1'style='width: 100%;'></div>");
		$("#imageFirst1").height(($("#imageDiv").height()/100)*82);
		$("#imageFirst1").append("<table id='imageTable' style='width:100%;height:100%;border: 1px solid #d1d1d1;'></table>");
		var str = data.liveImage.split(",");
		if(str != null && str.length > 0){
			if(str.length <= 5){
				$("#imageTable").append("<tr id='imageTr1' style='border: 1px solid #d1d1d1;'></tr>");
				for(var i = 0; i < str.length; i ++){
					$("#imageTr1").append("<td style='width:20%;text-align:center;'><img style='width:140px;height:140px;cursor:pointer'onclick='onClickImage(this,"+JSON.stringify(imagePath+str[i])+")' src='"+(imagePath+str[i])+"'/></td>");
				}
			}else{
				$("#imageDiv").height(($("#mainDiv2").height()/100)*85);
				$("#imageFirst").height(($("#imageDiv").height()/100)*5);
				$("#imageFirst1").height(($("#imageDiv").height()/100)*90);
				var a = str.length/5;
				if(str.length > a*5){
					a = a+1;
				}
				for(var i = 0; i < a; i++){
					$("#imageTable").append("<tr id='imageTr"+i+"' style='border: 1px solid #d1d1d1;'></tr>");
					if((i+1)*5 > str.length){
						for(var j = i*5; j < str.length; j ++){
							$("#imageTr"+i).append("<td style='width:20%;text-align:center;'><img style='width:140px;height:140px;cursor:pointer'onclick='onClickImage(this,"+JSON.stringify(imagePath+str[j])+")' src='"+(imagePath+str[j])+"'/></td>");
						}
					}else{
						for(var j = i*5; j < (i+1)*5; j ++){
							$("#imageTr"+i).append("<td style='width:20%;text-align:center;'><img style='width:140px;height:140px;cursor:pointer'onclick='onClickImage(this,"+JSON.stringify(imagePath+str[j])+")' src='"+(imagePath+str[j])+"'/></td>");
						}
					}
				}

			}
		}
	}
	//现场录音
	if(data.liveVoice != ""){
		$("#mainDiv2").append("<div id='voiceDiv' style='width:99.7%;border: 1px solid #d1d1d1;'></div>");
		$("#voiceDiv").height(($("#mainDiv2").height()/100)*50);
		$("#voiceDiv").append("<div id='voiceFirst'style='width: 100%;'></div>");
		$("#voiceFirst").height(($("#voiceDiv").height()/100)*10);
		$("#voiceFirst").append("<div id='voiceTwo'style='padding-left:20px;margin-top: 10px;'></div>");
		$("#voiceTwo").append("<img style='float: left;' src='"+rootPath+"/static/img/common/voice.png'/>");
		$("#voiceTwo").append("<font color='#41D4FF' style='float: left;padding-left: 10px;font-size:18px;'>现场录音</font>");
		$("#voiceDiv").append("<div id='voiceFirst1'style='width: 100%;'></div>");
		$("#voiceFirst1").height(($("#voiceDiv").height()/100)*85);
		$("#voiceFirst1").append("<table id='voiceTable' style='width:100%;height:100%;border: 1px solid #d1d1d1;'></table>");
		var str = data.liveVoice.split(",");
		if(str != null && str.length > 0){
			if(navigator.appName.indexOf("Microsoft Internet Explorer")!=-1 && document.all){//ie8
				if(str.length <= 2){
					 $("#voiceTable").append("<tr id='voiceTr1' style='border: 1px solid #d1d1d1;'></tr>");
					 for(var i = 0; i < str.length; i ++){
						 $("#voiceTr1").append("<td style='width:30%;height:100%;text-align:center;'><object autoplay='false' PLAY='false' data='"+(imagePath+str[i])+"' height='90%' width='90%'><embed src='"+(imagePath+str[i])+"' height='90%' width='90%' autoplay='false' autostart='false'/></object></td>");
					 }
				}else{
					$("#voiceDiv").height(($("#mainDiv2").height()/100)*90);
					$("#voiceFirst").height(($("#voiceDiv").height()/100)*5);
					$("#voiceFirst1").height(($("#voiceDiv").height()/100)*91);
					$("#voiceTable").append("<tr id='voiceTr1' style='border: 1px solid #d1d1d1;'></tr>");
					$("#voiceTr1").append("<td style='width:30%;height:50%;text-align:center;'><object autoplay='false' PLAY='false' data='"+(imagePath+str[0])+"' height='90%' width='90%'><embed src='"+(imagePath+str[0])+"' height='90%' width='90%' autoplay='false' autostart='false'/></object></td>");
					$("#voiceTr1").append("<td style='width:30%;height:50%;text-align:center;'><object autoplay='false' PLAY='false' data='"+(imagePath+str[1])+"' height='90%' width='90%'><embed src='"+(imagePath+str[1])+"' height='90%' width='90%' autoplay='false' autostart='false'/></object></td>");
					$("#voiceTable").append("<tr id='voiceTr2' style='border: 1px solid #d1d1d1;'></tr>");
					$("#voiceTr2").append("<td style='width:30%;height:50%;text-align:center;'><object autoplay='false' PLAY='false' data='"+(imagePath+str[2])+"' height='90%' width='90%'><embed src='"+(imagePath+str[2])+"' height='90%' width='90%' autoplay='false' autostart='false'/></object></td>");
				}
			}else{
				for(var i = 0; i < str.length; i ++){
					$("#voiceTable").append("<tr id='voiceTr"+i+"' style='border: 1px solid #d1d1d1;'></tr>");
					$("#voiceTr"+i).append("<td style='text-align:center;'><audio src='"+(imagePath+str[i])+"' preload='auto' controls='controls'></audio></td>");
				}
			}
		}
	}
	
}

