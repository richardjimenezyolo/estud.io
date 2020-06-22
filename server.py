from flask import Flask, render_template,request,redirect
import redis

app=Flask(__name__)
r=redis.Redis()

def get_db():
    keys=r.keys()
    res=[]
    for i in keys:
        res.append(i.decode())

    return res

#########
# INDEX #
#########
@app.route("/")
def index():
    test=get_db()
    res=[]
    for i in test:
        if "post:" in i:
            res.append(i+"|"+str(r.hget(i,"description").decode()))

    return render_template("index.html",list=res)


########
# READ #
########
@app.route("/read")
def read():
    q=request.args.get("q")
    post_name="post:"+q
    return render_template("read.html",post=q)

@app.route("/read_file")
def read_file():
    q=request.args.get("q")
    post_name="post:"+q
    return str(r.hget(post_name,"post").decode())

#######
# ADD #
#######
@app.route("/add")
def add():
    return render_template("add.html")

@app.route("/add_post",methods=["POST"])
def upload_post():
    post_name=request.form.get("post-name")
    description=request.form.get("description")
    post=request.form.get("post")

    r.hset("post:"+post_name, "post", post)
    r.hset("post:"+post_name, "description", description)

    return redirect("/")

if __name__ == "__main__":
    app.run(debug=True)