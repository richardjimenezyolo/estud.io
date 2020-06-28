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