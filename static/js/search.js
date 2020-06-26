function Search (x) {
	if (x == ""){
	document.querySelector("#results").innerHTML = ""

	}else{
		document.querySelector("#results").innerHTML = ""
		var xhr = new XMLHttpRequest();
		xhr.open("GET",`/SeachArticle?q=${x}`,true)
		xhr.send()
		xhr.onreadystatechange = function () {
		    if (this.readyState == 4 && this.status == 200){
				document.querySelector("#results").innerHTML = ""
		        var response = this.response;

		        var res = JSON.parse(response)

		        res.res.forEach(i =>{
		        	var card = `
		        	<a href="#" class="card" id="link-${i}">
						<div>
							<h2 class="card-title" id="title-${i}">Title</h2>
							
						</div>
					</a>`

					var div = document.createElement("div")

					document.querySelector("#results").append(div)

					div.innerHTML = card

					LoadCard(i)

		        })
		    }
	}
	}
}

