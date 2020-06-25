const editor = new EditorJS({ 
  /** 
   * Id of Element that should contain the Editor 
   */ 
  holder: 'editorjs', 
  
  /** 
   * Available Tools list. 
   * Pass Tool's class or Settings object for each Tool you want to use 
   */ 
  tools: { 
    image: SimpleImage,
    header: Header, 
    list: List,
    checklist: {
      class: Checklist,
      inlineToolbar: true,
    },
    raw: RawTool,
  }, 
})

function save () {
	editor.save().then(out =>{

		var post_name 	= document.querySelector("#name").value
		var des 	= document.querySelector("#des").value
		var post 	  	= JSON.stringify(out)




		var xhr = new XMLHttpRequest();
		xhr.open("POST","add_post",true)
		xhr.send(`${post_name}-|-${des}-|-${post}`)
		xhr.onreadystatechange = function () {
		    if (this.readyState == 4 && this.status == 200){
		        var response = this.response;
		        // document.body.innerHTML = response
		        console.log(response)
		    }
		}
	})
}


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