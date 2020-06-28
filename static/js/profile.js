function LoadCard (post) {
	var PostCard = post;
	var card = PostCard.split("|")
	// Card Name
	var name = card[0].replace("post:","")
	document.getElementById(`title-${post}`).innerHTML = name
	// Card Link
	document.getElementById(`link-${post}`).href = "/read?q="+card[1].replace("post:","")


	document.getElementById(post).href = "/edit?post="+card[1]

	console.log(post)
}