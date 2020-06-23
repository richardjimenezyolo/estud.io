function UploadImg () {
	var form = document.querySelector("#img")

	var data = new FormData(form)

	var ajax = new XMLHttpRequest();
	ajax.onreadystatechange = function() {
		if (ajax.readyState == 4 && ajax.status == 200) {
			var response = ajax.responseText;

			var add = `\n\n<img src="https://estud-io.s3-us-west-1.amazonaws.com/estud-io/${response}" width="200" height="200">`

			document.querySelector("#text").value += add

			alert("Done")
		}
	};
	ajax.open("POST", "/upload_img", true);
	ajax.send(data);
}