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
        underline: Underline,
        table: {
            class: Table,
        },
        upload: {
            class: UploadImage,
            config: {
                server: `/upload_img` // Here you can write your backend's url
            }
        }
    },
})

function save() {
    editor.save().then(out => {

        var post_name = document.querySelector("#name").value
        var des = document.querySelector("#des").value
        var post = JSON.stringify(out)

        var xhr = new XMLHttpRequest();
        xhr.open("POST", `/add_post?name=${post_name}`, true)
        xhr.send(`${des}-|-${post}`)
        xhr.onreadystatechange = function() {
            if (this.readyState == 4 && this.status == 200) {
                var response = this.response;
                var res = response.split("|")
                if (res[0] == "ok") {
                    location.href = `/read?q=${res[1]}`
                } else {
                    alert(response)
                }
            }
        }
    })
}