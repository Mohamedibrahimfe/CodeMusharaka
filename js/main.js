var requestOptions = {
  method: "GET",
  redirect: "follow",
};
getAllPosts();
function getAllPosts() {
  fetch(`${baseUrl}/posts?limit=2`, requestOptions)
    .then((response) => response.json())
    .then(function (response) {
      let posts = response.data;
      document.getElementById("posts").innerHTML = "";
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
                        <div class="card-header py-3 pb-0 mb-0 px-2">
                            <button type="button" class="btn card-title pb-0 mb-0">
                                <i class="fa-regular fa-comment "></i>
                                <span>(${post.comments_count})</span>
                                Comments
                                <span id="postTags" class=" rounded-5 text-center px-2 text-light mx-2"> </span>
                            </button>                      
                              
                            </p>
                        </div>
                    </div>
                </div>
                `;
        document.getElementById("posts").innerHTML += postBox;
      });
    })
    .catch((error) => console.log("error", error));
}

function Login() {
  body = {
    username: document.getElementById("login-name").value,
    password: document.getElementById("password-input-login").value,
  };
  fetch(`${baseUrl}/login`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(body),
  })
    .then((response) => response.json())
    .then(function (response) {
      localStorage.setItem("token", response.token);
      localStorage.setItem("user-data", JSON.stringify(response.user));
      showSuccessMessage("Logged in successfully", "success");
      const loginModal = document.getElementById("Login");
      const modalInstance = bootstrap.Modal.getInstance(loginModal);
      modalInstance.hide();
      setUiAfterLogin();
    })
    .catch((error) => console.log("error", error));
}
function checkIfUserIsLoggedIn() {
  if (
    localStorage.getItem("token") == null ||
    localStorage.getItem("token") == undefined
  ) {
    return;
  } else {
    setUiAfterLogin();
  }
}
checkIfUserIsLoggedIn();

function showSuccessMessage(MyMessage, MyType) {
  const alertPlaceholder = document.getElementById("liveAlertPlaceholder");
  const appendAlert = (message, type) => {
    const wrapper = document.createElement("div");
    wrapper.innerHTML = [
      `<div class="alert alert-${type} alert-dismissible" role="alert">`,
      `   <div>${message}</div>`,
      '   <button type="button" class="btn-close" data-bs-dismiss="alert" aria-label="Close"></button>',
      "</div>",
    ].join("");

    alertPlaceholder.append(wrapper);
  };
  appendAlert(MyMessage, MyType);
  setTimeout(() => {
    const alert = bootstrap.Alert.getOrCreateInstance("#liveAlertPlaceholder");
    // alert.close();
  }, 2000);
}

function setUiAfterLogin() {
  document.getElementById("login-form").style.display = "none";
  document.getElementById("Register-form").style.display = "none";
  const myList = document.getElementById("list");
  const userData = JSON.parse(localStorage.getItem("user-data"));
  const name = userData.name.split(" ")[0];
  myList.innerHTML += `
                    <li>
                        <a class="vlink rounded" href="#">
                          <img class=" rounded-circle border border-1 w-50 mb-5" src="${
                            userData.profile_image
                          }" ></img>
                          <span>${name.toUpperCase()}</span>
                        </a>
                    </li>
                    <li>
                        <a id="logOut" onClick="logOut(event)" class="vlink rounded" href="#">
                          <i class="fa-solid fa-arrow-right-from-bracket"></i>
                          <span>Log out</span>
                        </a>
                    </li>
  `;
  document
    .getElementById("create-post")
    .style.setProperty("display", "block", "important");
}

function logOut(event) {
  const ask = confirm("Are you sure you want to log out?");
  if (!ask) {
    return;
  }
  event.preventDefault();
  localStorage.removeItem("token");
  localStorage.removeItem("user-data");
  showSuccessMessage("Logged out successfully", "danger");
  setTimeout(() => {
    location.reload();
  }, 500);
}

function Registration() {
  const form = new FormData();
  form.append("username", document.getElementById("userNameRegister").value);
  form.append("password", document.getElementById("password-input").value);
  form.append("name", document.getElementById("name-register").value);
  form.append("email", document.getElementById("recipient-email").value);
  form.append("image", document.getElementById("image-input").files[0]);

  axios({
    method: "POST",
    url: `${baseUrl}/register`,
    headers: {
      Accept: "application/json",
    },
    data: form,
  })
    .then((data) => {
      data = data.data;
      localStorage.setItem("token", data.token);
      localStorage.setItem("user-data", JSON.stringify(data.user));
      showSuccessMessage("Registered successfully", "success");
      const registerModal = document.getElementById("Register");
      const modalInstance = bootstrap.Modal.getInstance(registerModal);
      modalInstance.hide();
      setUiAfterLogin();
    })
    .catch((error) => {
      showSuccessMessage(error.message, "danger");
    });
}

function createPost() {
  let form = new FormData();
  form.append("title", document.getElementById("postTitle").value);
  form.append("body", document.getElementById("postBody").value);
  form.append("image", document.getElementById("postImage").files[0]);

  axios({
    method: "post",
    url: `${baseUrl}/posts`,
    headers: {
      Accept: "application/json",
      Authorization: `Bearer ${localStorage.getItem("token")}`,
    },
    data: form,
  })
    .then((response) => {
      showSuccessMessage("Post created successfully", "success");
      const createPostModal = document.getElementById("create-post-modal");
      const modalInstance = bootstrap.Modal.getInstance(createPostModal);
      modalInstance.hide();
      getAllPosts();
    })
    .catch((error) => {
      showSuccessMessage("Error creating post", "danger");
    });
}
