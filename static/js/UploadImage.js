class UploadImage {

    constructor({api, config}) {
        this.api = api;
        this.config = config
        this.server = config.server
    }

    static get toolbox() {
        return {
            title: 'Upload',
            icon: '<i class="material-icons">photo</i>'
        }
    }

    render() {
        this.add_photo()

        return document.createElement("a")
    }

    save(blockContent) {
        return {
            done: "yes"
        }
    }

    add_photo() {
        console.log("add_photo")
        var input = document.querySelector("#img-input")

        input.onchange = () => {

            const form = document.querySelector("#img-form")
            const data = new FormData(form)

            var xhr = new XMLHttpRequest();

            console.log(`${this.server}`)

            xhr.open("POST", `${this.server}`, true)
            xhr.send(data)
            console.log("sending")
            xhr.onreadystatechange = () => {
                if (xhr.readyState == 4 && xhr.status == 200) {
                    var response = xhr.response;
                    
            console.log("sended")
                    this.api.blocks.insert("image", {"url": `https://estud-io.s3-us-west-1.amazonaws.com/estud-io/${response}`})

                    console.log(`https://estud-io.s3-us-west-1.amazonaws.com/estud-io/${response}`)
                    
                }
            }
        }

        input.click()
    }
}