var editor;


function save () {
  editor.save().then(out =>{

    var post_name   = document.querySelector("#name").value
    var des   = document.querySelector("#des").value
    var post       = JSON.stringify(out)

    var xhr = new XMLHttpRequest();
    xhr.open("POST",`/edit?post=${post_name}`,true)
    xhr.send(`${des}-|-${post}`)
    xhr.onreadystatechange = function () {
        if (this.readyState == 4 && this.status == 200){
            var response = this.response;
            // document.body.innerHTML = response
            console.log(response)
        }
    }
  })
}

function load (file) {
    var xhr = new XMLHttpRequest();
    xhr.open("GET", `/read_file?q=${file}`, true);
    xhr.send();

    xhr.onreadystatechange = function() {
        if (this.readyState == 4 && this.status == 200) {
            var response = this.responseText;

            var test = JSON.parse(response)

            editor = new EditorJS({
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
                data: test
            });
        }
    };
}