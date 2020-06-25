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
    code: CodeTool,
  }, 
})

function save () {
	editor.save().then(out =>{

		var post_name 	= document.querySelector("#name").value
		var des 	= document.querySelector("#des").value
		var post 	  	= JSON.stringify(out)

		var xhr = new XMLHttpRequest();
		xhr.open("POST",`/add_post?name=${post_name}`,true)
		xhr.send(`${des}-|-${post}`)
		xhr.onreadystatechange = function () {
		    if (this.readyState == 4 && this.status == 200){
		        var response = this.response;
		        console.log(response)
		        if (response == "ok"){
		        	location.href = `/read?q=${post_name}`
		        }
		        else {
		        	alert(response)
		        }
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

			var add = `https://estud-io.s3-us-west-1.amazonaws.com/estud-io/${response}`

			alert(`Now just paste this url in the editor: ${add}`)
		}
	};
	ajax.open("POST", "/upload_img", true);
	ajax.send(data);
}