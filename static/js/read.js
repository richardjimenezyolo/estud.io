function read (file) {
    var xhr = new XMLHttpRequest();
    xhr.open("GET", `/read_file?q=${file}`, true);
    xhr.send();
    
    xhr.onreadystatechange = function() {
      if (this.readyState == 4 && this.status == 200) {
        var response = this.responseText;
        
        var converter = new showdown.Converter(),
        text      = response,
        html      = converter.makeHtml(text);

        document.querySelector("#content").innerHTML = html
      }
    };
}