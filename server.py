from flask import Flask, render_template
import redis

app=Flask(__name__)
r=redis.Redis()

@app.route("/")
def index():
    return render_template("index.html")

@app.route("/read")
def read():
    return render_template("read.html")

@app.route("/read_file")
def read_file():
    return str(r.get("text").decode())

if __name__ == "__main__":
    app.run(debug=True)