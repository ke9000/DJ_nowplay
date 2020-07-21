//ハッシュタグ登録用
hashtags = new Array();
hashtag_join = "";
//テキスト長確認用
check_text = "";

function click_btn(num) {
	//hashtag
	let hash_tag1 = document.getElementById("hash_tag1").value;
	let hash_tag2 = document.getElementById("hash_tag2").value;
	
	hash_tag1 = hash_tag1.replace(/#/g, '');
	hash_tag2 = hash_tag2.replace(/#/g, '');
	
	hashtags.push(hash_tag1);
	hashtags.push(hash_tag2);
	
	//tb1_general
	let table = document.getElementById("tb1");
	let row = table.rows[num];

	//song_name
	let song_name = row.cells[1].children[0].value;
	if(song_name){
		song_name = check_hashtag(song_name);
		song_name = song_name+"/";
		check_text += song_name;
	}
	song_name = fixedEncodeURIComponent(song_name);

	//singer_name
	let singer= row.cells[2].children[0].value;
	if(singer){
		singer = check_hashtag(singer);
		singer = singer+"/";
		check_text += singer;
	}
	singer = fixedEncodeURIComponent(singer);

	//product
	let product = row.cells[3].children[0].value;
	if(product){
		product = check_hashtag(product);
		check_text += product;
	}
	product = fixedEncodeURIComponent(product);

	//other
	let other = row.cells[4].children[0].value;
	other = other.replace(/\r\n/g, '\n');
	other = other.replace(/\r/g, '\n');
	other = check_hashtag(other);
	check_text += '\n'+other;
	other = fixedEncodeURIComponent(other);
	let other_text = other.split('\n').join('%0A');
	
	//output
	create_hashtag(hashtags)
	console.log("No."+num+"/"+check_text); //debug

	let join_text = "No."+num+"/"+song_name+singer+product+"%0A"+other_text;
	console.log(check_text.length);//debug

	if(check_text.length <= 144){
		let url = "https://twitter.com/share?text="+join_text+"&hashtags="+hashtag_join+"&url=%0A";
		window.open(url, 'tweetwindow', 'width=650, height=470, personalbar=0, toolbar=0, scrollbars=1, sizable=1');
		
		//初期化
		hashtags = [];
		hashtag_join = "";
		check_text = "";

	} else {
		alert("投稿可能文字数を超過しています。文字数を減らしてください");
	}
}

function addrow(){
	let table = document.getElementById("tb1");
	let row = table.insertRow(-1);
	let cell = new Array(5);

	if (table.rows.length >= 1){
		for(i=0; i<=5; i++){
			cell[i] = row.insertCell(-1);
		}
		cell[0].innerHTML = (table.rows.length -1);
		cell[1].innerHTML = '<input class="form-control" type="text" name="">';
		cell[2].innerHTML = '<input class="form-control" type="text" name="">';
		cell[3].innerHTML = '<input class="form-control" type="text" name="">';
		cell[4].innerHTML = '<textarea id="my-textarea" class="form-control" name="" rows="1"></textarea>';
		cell[5].innerHTML = '<button class="btn btn-primary" type="button" onclick="click_btn('+(table.rows.length -1)+');">投稿</button>';
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

function check_hashtag(str){
	tag = str.match(/\s#\S+/g);
	if(tag){
		for(i=0;i<tag.length; i++){
			tag[i] = tag[i].replace(/\s#/g, '');
			hashtags.push(tag[i]);
		}
	}
	return str.replace(/\s#\S+/g, ' ');
}

function create_hashtag(data){
	hashtag_join = data[0];
	for(i=1; i<data.length; i++){
		hashtag_join += ","+data[i];
	}
}