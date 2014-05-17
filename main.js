var urls;		//フォームデータ->url
var classes;	//クラス名->url
var forms;		//フォームデータ一覧
var suggest;
var rurl;
var currenturl = "overview-summary.html";

$(function(){
	$('#o_text').bind("keyup", keychange);
	$('#o_text').bind("change", keychange);
	$('#o_suggest').bind("click", keychange);
	$("#o_iframe").attr("height", $(window).height() - 40);
	$(window).resize(function() {
		$("#o_iframe").attr("height", $(window).height() - 40);
	});
	$("#o_header .url").bind("change", function() {
		rurl = $("#o_header .url select option:selected").text();
		$("#o_text").attr('disabled', 'true');
		$.get(rurl + "allclasses-noframe.html", parseClassList);
	});
	
	rurl = $("#o_header .url select option:selected").text();
	console.log("url" + rurl);
	
	var list = [];
	suggest =   new Suggest.Local(
        "o_text",    // 入力のエレメントID
        "o_suggest", // 補完候補を表示するエリアのID
        list,      // 補完候補の検索対象となる配列
        {dispMax: 10, interval: 1000}); // オプション
	$("#o_text").attr('disabled', 'true');
	$.get(rurl + "/allclasses-noframe.html", parseClassList);
});

function parseClassList(data){
	urls = new Array();
	classes = new Array();
	forms = new Array();
	var flg = 1;
	$('<div/>').append($.parseHTML(data.responseText)).find(".indexContainer a").each(function(){
		var url = $(this).attr('href');
		url.match(/^(.*?)\/?([^\/]*)\.html$/);
		var pac = RegExp.$1;
		var cname = RegExp.$2;
		var str;
		//console.log(pac + cname);
		
		
		if (pac != ""){
			pac = pac.replace(/\//g, ".");
			//str = cname + " - " + pac + " package";
			str = pac+"."+cname;
		}else{
			str = cname;
		}
		
		classes[cname] = url;
		urls[str] = url;
		forms.push(str);
		
    });
	 suggest.candidateList = forms;
	 $("#o_text").removeAttr("disabled");
	 changeIFrame();
}

var old_val = "";
function keychange(){
	var new_val = $('#o_text').val();
	if(new_val != old_val){
		old_val = new_val;
		var tmp;
		if(tmp = (urls[old_val] || classes[old_val])){
			currenturl = tmp;
			changeIFrame();
		}
	}
}


function changeIFrame(){
	$("#o_iframe").attr("src", rurl + currenturl);
}






