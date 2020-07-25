function LoadCard(post) {
    var PostCard = post;

    var card = PostCard.split("|")

    // Card Name

    var name = card[1].replace("post:", "")

    document.getElementById(`title-${post}`).innerHTML = name

    // Description

    var des = card[2]
    document.getElementById(`des-${post}`).innerHTML = des

    // Card Link

    document.getElementById(`link-${post}`).href = "/read?q=" + card[0].replace("post:", "")
}

let load2 = (id) =>{
    var xhr = new XMLHttpRequest();
    xhr.open("GET",`/index_api?id=${id}`,true)
    xhr.send()
    xhr.onreadystatechange = function () {
        if (this.readyState == 4 && this.status == 200){
            var response = JSON.parse(this.response);
            console.log(response)

            tag=id.split(":")
            tagP2 = tag[1].split(".")

            console.log(tag[0],tagP2[1])

            console.log(document.querySelector(`a#${tag[0]}\\:0\\.${tagP2[1]}`))

            document.querySelector(`a#${tag[0]}\\:0\\.${tagP2[1]}`).href = `/read?q=${tag[1]}`

            document.querySelector(`h2#${tag[0]}\\:0\\.${tagP2[1]}`).innerHTML = response.name

            document.querySelector(`p#${tag[0]}\\:0\\.${tagP2[1]}`).innerHTML = response.des

        }
    }
}