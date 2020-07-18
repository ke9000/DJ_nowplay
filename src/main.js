function click_btn(num) {

	//hashtag
	let hash_tag1 = document.getElementById("hash_tag1");
	let hash_tag2 = document.getElementById("hash_tag2");

	let hash_tag1_text = hash_tag1.value;
	let hash_tag2_text = hash_tag2.value;
	
	hash_tag1_text = hash_tag1_text.replace(/#/g, '');
	hash_tag2_text = hash_tag2_text.replace(/#/g, '');
	
	let hashtag_join = hash_tag1_text;
	if(hash_tag1_text && hash_tag2_text){
		hashtag_join = hash_tag1_text+","+hash_tag2_text;
	} else if(hash_tag2_text) {
		hashtag_join = hash_tag2_text;
	}
	
	//tb1_general
	let table = document.getElementById("tb1");
	let row = table.rows[num];

	//song_name
	let song_name = row.cells[1].children[0].value;
	if(song_name){
		song_name = song_name+"/";
	}
	song_name = song_name.replace(/&/g, '＆');

	//singer_name
	let singer= row.cells[2].children[0].value;
	if(singer){
		singer = singer+"/";
	}
	singer = singer.replace(/&/g, '＆');

	//product
	let product = row.cells[3].children[0].value;
	if(product){
		product = product;
	}
	product = product.replace(/&/g, '＆');

	//other
	let other = row.cells[4].children[0].value;
	other = other.replace(/&/g, '＆');
	other = other.replace(/\r\n/g, '\n');
	other = other.replace(/\r/g, '\n');
	let other_lines = other.split('\n');
	let other_text = other_lines.join('%0A');

	//output
	console.log("No."+num+"/"+song_name+singer+product+hashtag_join+"%0A"+other_text); //debug

	let join_text = "No."+num+"/"+song_name+singer+product+"%0A"+other_text;
	console.log(join_text.length);//debug

	if(join_text.length <= 144){
		let url = "https://twitter.com/share?text="+join_text+"&hashtags="+hashtag_join+"&url=%0A";
		window.open(url, 'tweetwindow', 'width=650, height=470, personalbar=0, toolbar=0, scrollbars=1, sizable=1');
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