const urlParams = new URLSearchParams(window.location.search);
const passUrlParams = urlParams.get("id");
fillNewPage(passUrlParams);
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
      const aouthor = post.author.name;
      const title = `<h1 class="py-5">${aouthor} Post</h1>`;
      const comments = post.comments.map((comment) => {
        let timeF = comment.author.created_at.slice(0, 10);
        let timeS = " " + comment.author.created_at.slice(11, 19);
        return `
        <div class="d-flex">
            <div class="d-flex flex-column w-100">
                <h4 class="py-2 pt-0 mt-0">
                    <img class="rounded-circle border border-2" src="${comment.author.profile_image}" width="40px" height="40px" alt="image">
                    <span class="card-text h6 ><small class="text-muted">@${comment.author.username}</small></span>
                </h4>
                <div class="d-flex justify-content-between h6 font-weight-light font-italic ">
                    <h5 class="card-text d-inline m-0 py-0">${comment.body}</h5> <span id="time" class="text-muted h6 font-weight-light font-italic font-size-sm">Date: ${timeF}<span class="d-block"">Time: ${timeS}</span>
                </div>               
                <hr class="w-100 mx-auto my-0 py-0">
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
                        <span  class="position-absolute top-0 start-100 translate-middle badge rounded-pill bg-danger time">${post.created_at}
                        </span>
                        <div class="card-body">
                            <h5 class="card-title">${post.title}</h5>
                            <p class="card-text">
                                ${post.body}
                            </p>
                        </div>
                        <div class="card-header py-3 mb-0 px-2 d-flex">
                            <button type="button" class="btn card-title pb-0 mb-0">
                                <i class="fa-regular fa-comment "></i>
                                <span>(${post.comments_count})</span>
                                Comments
                                <span id="postTags" class=" rounded-5 text-center px-2 text-light mx-2"> </span>
                            </button>                      
                            <i onclick="checkIfUserOwnsPost(${post.id})" id="editPostBtn" data-bs-toggle="modal" data-bs-target="#update" class="fa-regular fa-edit ms-auto p-2 h4 cursor-pointer text-primary" role="button"></i>
                        </div>
                        <div class="card-footer" id="commentsPlace">
                            ${comments}
                        </div>
                        <div id="commentSection" class="bg-light p-3  d-flex">
                        <input type="text" class="form-control d-inline" id="comment" placeholder="Add a comment">
                        <button onclick="addComment(${post.id})" class="btn btn-primary p-2 d-inline"  id="addComment">Send comment </button>
                        </div>    
                    </div>
                </div>
      `;
      document.getElementById("detaildPosts").innerHTML = postContent;
    })
    .catch((error) => {
      console.log(error.message);
    });
}
function addComment(id) {
  const token = localStorage.getItem("token");
  const comment = document.getElementById("comment").value;
  axios({
    method: "post",
    url: `${baseUrl}/posts/${id}/comments`,
    headers: {
      Accept: "application/json",
      Authorization: `Bearer ${token}`,
    },
    data: {
      body: comment,
    },
  })
    .then((response) => {
      fillNewPage(id);
    })
    .catch((error) => {
      showSuccessMessage(error.response.data.message, "danger");
    });
}
