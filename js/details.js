function fillNewPage(id) {
  axios({
    method: "get",
    url: `${baseUrl}/posts/${id}`,
    headers: {
      Accept: "application/json",
    },
    redirect: "follow",
  })
    .then((response) => {
      let post = response.data.data;
      //   localStorage.setItem("post-data", JSON.stringify(post));
      const aouthor = post.author.name;
      const title = `<h1 class="py-5">${aouthor} Post</h1>`;
      const comments = post.comments.map((comment) => {
        time = comment.author.created_at.slice(0, 10);
        time += " " + comment.author.created_at.slice(11, 19);
        return `
        <div class="d-flex">
            <div class="d-flex flex-column w-100">
                <h4>
                    <img class="rounded-circle border border-2" src="${comment.author.profile_image}" width="40px" height="40px" alt="image">
                    <span class="card-text h6 ><small class="text-muted">@${comment.author.username}</small></span>
                </h4>
                <br>
                <div class="d-flex justify-content-between h6 font-weight-light font-italic ">
                    <h5 class="card-text d-inline">${comment.body}</h5> <span class="text-muted h6 font-weight-light font-italic font-size-sm">Date: ${time}</span>
                </div>               
                <hr>
            </div>
        </div>
        `;
      });
      const postContent = `
            ${title}
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
                        <div class="card-header py-3 pb-0 mb-0 px-2">
                            <button type="button" class="btn card-title pb-0 mb-0">
                                <i class="fa-regular fa-comment "></i>
                                <span>(${post.comments_count})</span>
                                Comments
                                <span id="postTags" class=" rounded-5 text-center px-2 text-light mx-2"> </span>
                            </button>                      
                            </p>
                        </div>
                        <div class="card-footer p-3 ">
                            ${comments}
                        </div>
                    </div>
                </div>
    `;
      document.getElementById("detaildPosts").innerHTML = postContent;
    })
    .catch((error) => console.log(error.message));
}
// fillNewPage(localStorage.getItem("post-id"));
const urlParams = new URLSearchParams(window.location.search);
const passUrlParams = urlParams.get("id");
fillNewPage(passUrlParams);
