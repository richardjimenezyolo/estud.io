from flask import Flask, render_template,request,redirect, session
import redis
import os
import boto3
import random

try:
    from dotenv import load_dotenv
    load_dotenv()
except Exception as e:
    pass

app=Flask(__name__)
r=redis.Redis.from_url(os.getenv("DB"))
app.config["SECRET_KEY"] = 'key'
s3_id=os.environ["AWSAccessKeyId"]
s3_key=os.environ["AWSSecretKey"]
s3=boto3.client('s3',aws_access_key_id=s3_id,aws_secret_access_key=s3_key)


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
            if len(i) != len("post:"):
                res.append(i+"|"+str(r.hget(i,"description").decode()))

    return render_template("index.html",list=res)


########
# READ #
########
@app.route("/read")
def read():
    q=request.args.get("q")
    post_name="post:"+q

    by=r.hget(post_name,"by").decode().replace("user:","")
    return render_template("read.html",post=q,by=by)

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
    if "user" in session:

        return render_template("add.html")

    return redirect("/loggin")

@app.route("/add_post",methods=["POST"])
def upload_post():
    post_name=request.form.get("post-name")
    description=request.form.get("description")
    post=request.form.get("post")



    db=get_db()

    if "post:"+post_name in db:
        return render_template("add.html",msg="Post Name Already taken!")

    r.hset("post:"+post_name, "post", post)
    r.hset("post:"+post_name, "description", description)
    r.hset("post:"+post_name, "by", session["user"])

    r.lpush("lts-posts:"+session["user"],"post:"+post_name)

    return redirect("/")


@app.route("/upload_img",methods=["POST"])
def upload_img():
    print("uploading")
    img=request.files['img']
    fname=str(random.random())+".jpg"
    img.save(os.path.join("static/imgs",fname))
    s3.upload_file("static/imgs/"+fname,'estud-io','estud-io/'+fname,ExtraArgs={'ACL':'public-read'})

    return fname



###########
# PROFILE #
###########
@app.route("/profile")
def profile():
    if "user" in session:
        return render_template("profile.html")

    return redirect("/loggin")

@app.route("/loggin")
def loggin():
    return render_template("loggin.html")

@app.route("/loggin",methods=["POST"])
def loggin_post():
    name=request.form.get("name")
    pwd=request.form.get("pwd")

    db=get_db()

    if "user:"+name in db:
        if r.hget("user:"+name, "pwd").decode() == pwd:
            session["user"]="user:"+name
            return redirect("/")

    return render_template("loggin.html",msg="User Name or Password incorrect")


@app.route("/signup")
def singup():
    return render_template("signup.html")

@app.route("/signup",methods=["POST"])
def signup_post():
    name=request.form.get("name")
    pwd=request.form.get("pwd")

    db=get_db()


    if "user:"+name in db:
        return render_template("signup.html",msg="User Name Already taken")


    else:
        r.hset("user:"+name, "pwd", pwd)
        r.hset("user:"+name, "posts", "")
        r.hset("user:"+name, "pts", 0)

    return redirect("/loggin")



if __name__ == "__main__":
    app.run(debug=True)