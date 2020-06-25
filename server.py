from flask import Flask, render_template,request,redirect, session, jsonify
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
            if len(i) != len("post:") and r.type(i) == b'hash':
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
    likes=r.hget(post_name, "pts").decode()
    return render_template("read.html",post=q,by=by,likes=likes)

@app.route("/read_file")
def read_file():
    q=request.args.get("q")
    post_name="post:"+q
    return str(r.hget(post_name,"post").decode())


########
# LIKE #
########
@app.route("/like")
def like():
    post=request.args.get("post")

    pts=r.hget("post:"+post, "pts")

    pts=int(pts)

    pts += 1

    r.hset("post:"+post, "pts", pts)

    return ""

@app.route("/dislike")
def dislike():
    post=request.args.get("post")

    pts=r.hget("post:"+post, "pts")

    pts=int(pts)

    pts -= 1

    r.hset("post:"+post, "pts", pts)

    return ""

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
    data=request.data

    post_data=data.decode().split("-|-")

    post_name=post_data[0]
    post_des=post_data[1]
    post=post_data[2]

    by=session["user"]

    r.hset("post:"+post_name, "description", post_des)
    r.hset("post:"+post_name, "post", post)
    r.hset("post:"+post_name, "by", session["user"])
    r.hset("post:"+post_name, "pts", 0)

    return "ok"


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
        posts=r.lrange("lts-posts:"+session["user"], 0, -1)

        res_posts=[]

        for i in posts:
            res_posts.append(i.decode().replace("post:",""))

        return render_template("profile.html",posts=res_posts)


    return redirect("/loggin")

##########
# LOGGIN #
##########
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

@app.route("/logout")
def logout():
    session.pop("user")
    return redirect("/")

############
#  SIGN UP #
############
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


########
# USER #
########
@app.route("/user")
def user():
    user=request.args.get("user")
    posts=r.lrange("lts-posts:"+"user:"+user, 0, -1)

    res_posts=[]
    for i in posts:
        res_posts.append(i.decode().replace("post:",""))

    return render_template("user.html",posts=posts)


###########
# COMMENT #
###########
@app.route("/comment",methods=["POST"])
def comment():
    if "user" in session:
        post=request.args.get("post")
        user=session["user"]
        comment=request.form.get("comment")

        r.lpush("comments-post:"+post,user+"-|-"+comment)

        return "ok"

    return "Error"

@app.route("/read_comment")
def read_comment():
    post=request.args.get("post")

    comments=r.lrange("comments-post:"+post, 0, -1)

    res=[]

    for i in comments:
        res.append(i.decode())

    return jsonify(comments=res)




########
# EDIT #
########
@app.route("/edit")
def edit():
    if "user" in session:
        post_name=request.args.get("post")

        post_by=r.hget("post:"+post_name, "by").decode()

        if session["user"] == post_by:
            des=r.hget("post:"+post_name, "description").decode()
            post=r.hget("post:"+post_name, "post").decode()

            return render_template("edit.html",post=post,des=des,name=post_name)

        return "Error"

    return "Error1"

@app.route("/edit",methods=["POST"])
def edit_post():
    if "user" in session:
        post_name=request.args.get("post")

        post_by=r.hget("post:"+post_name, "by").decode()

        if session["user"] == post_by:
            new_post=request.form.get("post")
            new_des=request.form.get("des")

            r.hset("post:"+post_name, "post", new_post)
            r.hset("post:"+post_name, "description", new_des)

            return redirect("/read?q="+post_name)


@app.route("/test")
def test():
    return render_template("test.html")

if __name__ == "__main__":
    app.run(debug=True)