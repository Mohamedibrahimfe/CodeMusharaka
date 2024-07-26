var requestOptions = {
    method: 'GET',
    redirect: 'follow'
};

    fetch("https://tarmeezacademy.com/api/v1/posts?limit=5", requestOptions)
        .then(response => response.json())
        .then(function (response) {
            let posts = response.data
            console.log(posts)
            document.getElementById('posts').innerHTML = ""
            posts.map(function (post) {
                let postBox = `
            <div class="mt-4 pb-2" id="post">
                    <div class="card border border-1 shadow" style="width:55rem;">
                        <div class="card-header">
                            <button class=" pe-auto border-0 btn px-0"><img class="rounded-circle border border-4"
                                    src="${post.author.profile_image}" width="40px" height="40px"
                                    alt="profile image">${post.author.username}
                            </button>
                        </div>
                        <img class="p-2 w-100" src="${post.image}"
                            alt="Post image">
                        <span class="position-absolute top-0 start-100 translate-middle badge rounded-pill bg-danger time">${post.created_at}
                        </span>
                        <div class="card-body">
                            <h5 class="card-title">${post.title}</h5>
                            <p class="card-text">
                                ${post.body}
                            </p>
                        </div>
                        <div class="card-header py-2 pb-0 mb-0 px-2">
                            <button type="button" class="btn card-title pb-0 mb-0">
                                <i class="fa-regular fa-comment "></i>
                                <span>(${post.comments_count})</span>
                                Comments
                            </button>
                            </p>
                        </div>
                    </div>
                </div>
                `
                document.getElementById('posts').innerHTML += postBox
            })
        })
        .catch(error => console.log('error', error));