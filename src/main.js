//ハッシュタグ管理用
hashtag_join = "";
arrow_post = 1;
//テキスト長確認用
check_text_length = "";

function click_btn(num) {
	//hashtag
	let hash_tag1 = document.getElementById("hash_tag1").value;
	let hash_tag2 = document.getElementById("hash_tag2").value;
	
	hash_tag1 = hash_tag1.replace(/#/g, '');
	hash_tag2 = hash_tag2.replace(/#/g, '');

	if(hash_tag1.match(/\s/g) || hash_tag2.match(/\s/g) ){
		alert("ハッシュタグにはスペースを入れないで下さい");
		arrow_post = 0;
	}

	if(hash_tag1&&hash_tag2){
		hashtag_join = hash_tag1+"," + hash_tag2;
	} else if(hash_tag1){
		hashtag_join = hash_tag1;
	} else if(hash_tag2){
		hashtag_join = hash_tag2;
	}
	
	//tb1_general
	let table = document.getElementById("tb1");
	let row = table.rows[num];

	//song_name
	let song_name = row.cells[1].children[0].value;
	if(song_name){
		song_name = check_text(song_name)+"/";
		check_text_length += song_name;
	}
	song_name = fixedEncodeURIComponent(song_name);

	//singer_name
	let singer= row.cells[2].children[0].value;
	if(singer){
		singer = check_text(singer)+"/";
		check_text_length += singer;
	}
	singer = fixedEncodeURIComponent(singer);

	//product
	let product = row.cells[3].children[0].value;
	if(product){
		product = check_text(product);
		check_text_length += product;
	}
	product = fixedEncodeURIComponent(product);

	//other
	let other = row.cells[4].children[0].value;
	other = other.replace(/\r\n/g, '\n');
	other = other.replace(/\r/g, '\n');
	check_text_length += '\n'+other;
	other = fixedEncodeURIComponent(other);
	let other_text = other.split('\n').join('%0A');
	
	//output
	console.log("No."+num+"/"+check_text_length); //debug

	let join_text = "No."+num+"/"+song_name+singer+product+"%0A"+other_text;
	console.log(check_text_length.length);//debug

	if(check_text_length.length <= 144 && arrow_post == 1){
		let url = "https://twitter.com/share?text="+join_text+"&hashtags="+hashtag_join+"&url=%0A";
		window.open(url, 'tweetwindow', 'width=650, height=470, personalbar=0, toolbar=0, scrollbars=1, sizable=1');
	} else  if (check_text_length.length > 144){
		alert("投稿可能文字数を超過しています。文字数を減らしてください");
	}
	hashtag_join = "";
	check_text_length = "";
	arrow_post = 1;
}

function addrow(n){
	let table = document.getElementById("tb1");
	
	for(i=0; i<n; i++){
		let row = table.insertRow(-1);
		let cell = new Array(6);

		if (table.rows.length >= 1){
			for(j=0; j<=6; j++){
				cell[j] = row.insertCell(-1);
			}
			cell[0].innerHTML = (table.rows.length -1);
			cell[1].innerHTML = '<input class="form-control" type="text" name="">';
			cell[2].innerHTML = '<input class="form-control" type="text" name="">';
			cell[3].innerHTML = '<input class="form-control" type="text" name="">';
			cell[4].innerHTML = '<textarea id="my-textarea" class="form-control" name="" rows="1"></textarea>';
			cell[5].innerHTML = '<button class="btn btn-primary" type="button" onclick="click_btn('+(table.rows.length -1)+');">投稿</button>';
			cell[6].innerHTML = (table.rows.length -1);
		}
	}
}

function delrow(){
	let table = document.getElementById("tb1");
	if(table.rows.length >=3){
		let rows =table.deleteRow(table.rows.length - 1)
	}
	
}

/**
 * `encodeURIComponent(str)`の拡張
 * `.!'()*_~-`に対応
 * @param String str
 */
function fixedEncodeURIComponent(str) {
	return encodeURIComponent(str).replace(/[.!'()*_~-]/g, function (c) {
		return '%' + c.charCodeAt(0).toString(16);
	});
}

function check_text(str){
	if(str.match(/\//g)){
		str = str.replace(/\//g, '\"\/\"');
	}
	return str;
}

function check_hashtag(str){
	let tag1 = str.match(/^#.+/g);
	if(tag1){
		alert("文頭にはハッシュタグをつけないでください");
		arrow_post = 0;
	}
	tag2 = str.match(/\s#\S+/g);
	if(tag2){
		for(i=0;i<tag2.length; i++){
			tag2[i] = tag2[i].replace(/\s#/g, '');
			hashtags.push(tag2[i]);
		}
	}
	return str.replace(/\s#\S+/g, ' ');
}

function create_url(){
	let jsondata = {};
	
	//hashtag
	let hash_tag1 = document.getElementById("hash_tag1").value.replace(/#/g, '');
	let hash_tag2 = document.getElementById("hash_tag2").value.replace(/#/g, '');
	
	jsondata["hash_tag1"] = hash_tag1;
	jsondata["hash_tag2"] = hash_tag2;

	//tb1_general
	let table = document.getElementById("tb1");
	let count_row = table.rows.length;
	jsondata["count"] = count_row-1;
	for (i=1; i<table.rows.length; i++){
		jsondata[i] = {};
		let songdata = jsondata[i];
		songdata["songname"] = table.rows[i].cells[1].children[0].value;
		songdata["singer"] = table.rows[i].cells[2].children[0].value;
		songdata["product"] = table.rows[i].cells[3].children[0].value;
		songdata["other"] = table.rows[i].cells[4].children[0].value.replace(/\n/g, '\\n');
	}
	console.log(jsondata);
	json_txt = JSON.stringify(jsondata);
	compress = LZString.compressToBase64(json_txt);

	let url_input = document.getElementById("share_url")
	url_input.value = "http://suomomo.com/nowplay/index.html?list="+compress;

	//コピー
	url_input.select();
	document.execCommand("Copy");
	window.getSelection().removeAllRanges();
}

function create_csv(){
	let csvdata = "";
	
	//hashtag
	let hash_tag1 = document.getElementById("hash_tag1").value.replace(/#/g, '');
	let hash_tag2 = document.getElementById("hash_tag2").value.replace(/#/g, '');
	
	csvdata += "tag1:,"+hash_tag1+"\r\n";
	csvdata += "tag2:,"+hash_tag2+"\r\n";

	//tb1_general
	let table = document.getElementById("tb1");
	for (i=1; i<table.rows.length; i++){
		csvdata += i+",";
		csvdata += table.rows[i].cells[1].children[0].value+",";
		csvdata += table.rows[i].cells[2].children[0].value+",";
		csvdata += table.rows[i].cells[3].children[0].value+",";
		csvdata += table.rows[i].cells[4].children[0].value.replace(/\n/g, ' ')+"\r\n";
	}

	let link = document.createElement("a");
	link.download = "setlist.csv";
	link.href = URL.createObjectURL(new Blob([csvdata],{type: "text/csv"}));
	link.dataset.downloadurl = ["text/csv", link.download, link.href];
	link.click();

}

document.addEventListener("DOMContentLoaded", function() {
	let list = location.search;
	if(list){
		compress = list.replace(/\?list=/g, '').toString();
		json_txt = LZString.decompressFromBase64(compress);
		jsondata = JSON.parse(json_txt);
		console.log(jsondata);

		document.getElementById("hash_tag1").value = jsondata["hash_tag1"];
		document.getElementById("hash_tag2").value = jsondata["hash_tag2"];

		let table = document.getElementById("tb1");
		for(j=1; j<=jsondata["count"]; j++){
			if(j >= 2){
				addrow();
			}
			console.log(j);

			table.rows[j].cells[1].children[0].value = jsondata[j]["songname"];
			table.rows[j].cells[2].children[0].value = jsondata[j]["singer"];
			table.rows[j].cells[3].children[0].value = jsondata[j]["product"];
			table.rows[j].cells[4].children[0].value = jsondata[j]["other"].replace(/\\n/g, '\n');
		}
	}
})