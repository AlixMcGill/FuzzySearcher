import cookies from './modules/cookies.js';

const cokie = new cookies;
const hostAddress = 'http://localhost:5273';
checkAlreadyLoggedInAndReroute(cokie.getCookie('userJwt', 1), '/login.html')
const loader = document.getElementById('loader-ctrn');
let loggedInUser = {
    id: '',
    firstName: '',
    lastName: '',
    username: cokie.getCookie('username', 1)
}
getUsernameId(cokie.getCookie('username', 1));

function checkAlreadyLoggedInAndReroute(cookie, route) {
    if (!cookie) {
        window.location = `${hostAddress}${route}`;
    }
}

function populateUserAccount() {
    const userFirstName = document.getElementById('user-first-name-span');
    const userLastName = document.getElementById('user-last-name-span');
    const userUsername = document.getElementById('user-username-span');
        
    userFirstName.innerText = loggedInUser.firstName;
    userLastName.innerText = loggedInUser.lastName;
    userUsername.innerText = loggedInUser.username;
}

async function getUsernameId(usernameCookie) {
    const url = `${hostAddress}/DbSearch/filterbyusername=${usernameCookie}`;
    const jwtValue = cokie.getCookie('userJwt', 1);
    const bearer = 'Bearer ' + jwtValue;

    try {
       const response = await fetch(url,{
           method: "GET",
           headers: {
               Authorization: bearer,
               "Content-Type": "application/json"
           }
       });
    if (!response.ok) {
        throw new Error(`Response status: ${response.status}`);
    }

    if (response.ok) {
        const res = await response.json();
        loggedInUser.id = res[0].id
        fetchUserInformation(loggedInUser.id);
    }
    } catch (error) {
        
    }
}

async function fetchUserInformation(idToFetch) {
    const url = `${hostAddress}/DbSearch/userInformation/${idToFetch}`;
    const jwtValue = cokie.getCookie('userJwt', 1);
    const bearer = 'Bearer ' + jwtValue;

    try {
        const response = await fetch(url, {
            method: "GET",
            headers: {
                Authorization: bearer,
                "Content-Type": "application/json"
            },
        });

        if (!response.ok) {
          throw new Error(`Response status: ${response.status}`);
        }
    
        const usernames = await response.json();
        loggedInUser.firstName = usernames[0].firstName;
        loggedInUser.lastName = usernames[0].lastName;
        populateUserAccount();
        fetchPosts(loggedInUser.id);
        
    } catch (error) {
        console.error(error.message);
    }
}

function createNewPost(parent, posts){
    for (let i = 0; i < posts.length; i++) {
        const post = document.createElement('div');
        post.className = 'post';
        post.id = posts[i].id;

        const deletePost = document.createElement('span');
        deletePost.className = 'material-symbols-outlined post-delete';
        deletePost.innerText = 'delete';
        deletePost.style.textAlign = 'right';
        post.appendChild(deletePost);

        const postHeader = document.createElement('div');
        postHeader.className = 'post-header';

        const postTitle = document.createElement('p');
        postTitle.className = 'post-title';
        postTitle.innerText = posts[i].post_Title;
        postHeader.appendChild(postTitle);
        
        post.appendChild(postHeader);

        const postBody = document.createElement('p');
        postBody.className = 'post-body';
        postBody.innerText = posts[i].post_Body;
        post.appendChild(postBody);

        const postFooter = document.createElement('div');
        postFooter.className = 'post-footer';

        const postDate = document.createElement('span');
        postDate.className = 'post-date';
        postDate.id = 'post-date-id';
        postDate.innerText = posts[i].date_Time.slice(0, -9);
        postFooter.appendChild(postDate);

        const postLikesButton = document.createElement('button');
        postLikesButton.className = 'post-likes';

        const likeHeart = document.createElement('span');
        likeHeart.className = 'material-symbols-outlined';
        likeHeart.innerText = 'favorite';
        postLikesButton.appendChild(likeHeart);

        const likesAmount = document.createElement('span');
        likesAmount.className = 'post-likes-amount';
        likesAmount.innerText = posts[i].post_Likes;
        postLikesButton.appendChild(likesAmount);

        postFooter.appendChild(postLikesButton);

        post.appendChild(postFooter);

        parent.appendChild(post);
    }
    loader.innerText = '';
    deletePostButtonEvents();
}

async function fetchPosts(userId) {
    const postContainer = document.getElementById('user-posts-section')
    postContainer.innerHTML = '';
    const url = `${hostAddress}/UserPosts/Posts/${userId}`;
    const jwtValue = cokie.getCookie('userJwt', 1);
    const bearer = 'Bearer ' + jwtValue;

    try {
        const response = await fetch(url, {
            method: "GET",
            headers: {
                Authorization: bearer,
                "Content-Type": "application/json",
            },
        });

        if (!response.ok) {
          throw new Error(`Response status: ${response.status}`);
        }
        const posts = await response.json();
        createNewPost(postContainer, posts);
        updateTotalProfileLikes()
    } catch (error) {
        console.error(error.message);
    }
}

function updateTotalProfileLikes() {
    let totalLikes = 0;
    const totalLikesElement = document.getElementById('total-profile-likes-item');
    const postLikes = document.querySelectorAll('.post-likes-amount');
    postLikes.forEach(post => {
        totalLikes += parseInt(post.textContent);
    });
    totalLikesElement.innerText = totalLikes;
}

async function fetchPostDelete(postId, callback) {
    const url = `${hostAddress}/UserPosts/${postId}`;
    const jwtValue = cokie.getCookie('userJwt', 1);
    const bearer = 'Bearer ' + jwtValue;
    try {
        const response = await fetch(url, {
            method: "DELETE",
            headers: {
                Authorization: bearer
            }
        });
        if (!response.ok) {
            throw new Error(`Response status: ${response.status}`);
        }
        if (response.ok) {
            callback();
        }
    } catch (error) {
        console.error(error.message);
    }
}

function areYouSureDeletePopUp(parentId) {
    document.body.style.overflow = 'hidden';
    const parentEl = document.getElementById('delete-post-popup-parent');

    const wrapper = document.createElement('div');
    wrapper.className = 'wrap-delete-popup';

    const container = document.createElement('div');
    container.className = 'delete-post-popup-container';

    const text = document.createElement('p');
    text.innerText = 'Are you sure you would like to delete this post?';
    text.className = 'delete-post-popup-text';

    const buttonWrapper = document.createElement('div');
    buttonWrapper.className = 'delete-post-btn-wrapper';

    const buttonYes = document.createElement('button');
    buttonYes.innerText = 'Yes';
    buttonYes.className = 'delete-post-btn delete-post-popup-yes';
    buttonYes.addEventListener('click', () => {
        parentEl.innerHTML = '';
        document.body.style.overflow = 'scroll';
        fetchPostDelete(parentId,() => {
            document.getElementById(parentId).remove();
        });
    });
    
    const buttonNo = document.createElement('button');
    buttonNo.innerText = 'No';
    buttonNo.className = 'delete-post-btn delete-post-popup-no';
    buttonNo.addEventListener('click', () => {
        parentEl.innerHTML = '';
        document.body.style.overflow = 'scroll';
    });

    container.appendChild(text);
    buttonWrapper.appendChild(buttonYes);
    buttonWrapper.appendChild(buttonNo);
    container.appendChild(buttonWrapper);
    wrapper.appendChild(container);
    parentEl.appendChild(wrapper);
}

function deletePostButtonEvents() {
    const deletePosts = document.querySelectorAll('.post-delete');
    console.log(deletePosts);
    deletePosts.forEach(deleteBtn => {
        deleteBtn.addEventListener('click', () => {
            areYouSureDeletePopUp(deleteBtn.parentNode.id);
        });
    });
}
