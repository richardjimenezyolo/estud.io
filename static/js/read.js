function read(file) {
    var xhr = new XMLHttpRequest();
    xhr.open("GET", `/read_file?q=${file}`, true);
    xhr.send();

    xhr.onreadystatechange = function() {
        if (this.readyState == 4 && this.status == 200) {
            var response = this.responseText;

            var test = JSON.parse(response)

            const editor = new EditorJS({
                holder: "read",
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

function like(post) {
    var ajax = new XMLHttpRequest();
    ajax.onreadystatechange = function() {
        if (ajax.readyState == 4 && ajax.status == 200) {
            var response = ajax.responseText;
        }
    };
    ajax.open("GET", `/like?post=${post}`, true);
    ajax.send();
}

function dislike(post) {
    var ajax = new XMLHttpRequest();
    ajax.onreadystatechange = function() {
        if (ajax.readyState == 4 && ajax.status == 200) {
            var response = ajax.responseText;
        }
    };
    ajax.open("GET", `/dislike?post=${post}`, true);
    ajax.send();
}

function SendComment(post_name) {
    var form = document.querySelector("#comment")

    var data = new FormData(form)

    var xhr = new XMLHttpRequest();
    xhr.open("POST", `/comment?post=${post_name}`, true)
    xhr.send(data)
    xhr.onreadystatechange = function() {
        if (this.readyState == 4 && this.status == 200) {
            var response = this.response;
            console.log(response)

            if (response == "Error") {
                alert("You must sign in")
            } else {
                document.querySelector("#text2").value = "";
                ReadComments(post_name)
            }
        }
    }
}

function ReadComments(post) {
    var xhr = new XMLHttpRequest();
    xhr.open("GET", `/read_comment?post=${post}`, true)
    xhr.send()
    xhr.onreadystatechange = function() {
        if (this.readyState == 4 && this.status == 200) {

            var div = document.querySelector("#comments")
            div.innerHTML = ""


            var response = this.response;
            console.log(response)
            response = JSON.parse(response)


            response.comments.forEach(i => {

                var raw = i.split("-|-")

                var user = raw[0].replace("user:", "")
                var comment = raw[1]
                var card2 = `<div class="comment">
        <p class="comment-user"><a href="/user?user=${user}">${user}</a></p>
        <p class="comment-text">${comment}</div><br>`


                var box = document.createElement("div")

                div.append(box)

                box.innerHTML = card2
            })

        }
    }
}