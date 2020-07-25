let LoadCard = (id) =>{
    var xhr = new XMLHttpRequest();
    xhr.open("GET",`/index_api?id=${id}`,true)
    xhr.send()
    xhr.onreadystatechange = function () {
        if (this.readyState == 4 && this.status == 200){
            var response = JSON.parse(this.response);
            console.log(response)

            tag=id.split(":")
            tagP2 = tag[1].split(".")

            // Print Link

            console.log(document.querySelector(`a#${tag[0]}\\:0\\.${tagP2[1]}`))

            // set <a> href
            document.querySelector(`a#${tag[0]}\\:0\\.${tagP2[1]}`).href = `/read?q=${tag[1]}`

            // Set the card name
            document.querySelector(`h2#${tag[0]}\\:0\\.${tagP2[1]}`).innerHTML = response.name

            // Set the card description
            document.querySelector(`p#${tag[0]}\\:0\\.${tagP2[1]}`).innerHTML = response.des

        }
    }
}