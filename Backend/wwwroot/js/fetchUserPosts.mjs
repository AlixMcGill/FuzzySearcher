let usersArray;
const loader = document.getElementById('loader-ctrn');

function createNewPost(parent, posts){
    for (let i = 0; i < posts.length; i++) {
        const post = document.createElement('div');
        post.className = 'post';
        post.id = posts[i].id;

        const postHeader = document.createElement('div');
        postHeader.className = 'post-header';

        const postUsername = document.createElement('p');
        postUsername.className = 'post-username';
        postUsername.innerText = usersArray[posts[i].user_Id].userName;
        postHeader.appendChild(postUsername);

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

        //postLikesButton.onClick = incrementLikes(post.id);

        postFooter.appendChild(postLikesButton);

        post.appendChild(postFooter);

        parent.appendChild(post);
    }
    loader.innerText = '';
    //likeButtonEvents();
}


async function fetchPosts() {
    const postContainer = document.getElementById('post-ctrn')
    const url = 'http://localhost:5273/UserPosts';

    try {
        const response = await fetch(url, {
            mode: "no-cors",
            method: "GET",
            headers: {
                "Content-Type": "application/json"
            },
        });

        if (!response.ok) {
          throw new Error(`Response status: ${response.status}`);
        }
    
        const posts = await response.json();
        createNewPost(postContainer, posts);
        
    } catch (error) {
        console.error(error.message);
    }
}

window.onload = function() {
    setTimeout(getUsername, 1500)
    //getUsername();
};

// Definitely not the best implementation
async function getUsername() {
    const url = `http://localhost:5273/DbSearch`;

    try {
        const response = await fetch(url, {
            mode: "no-cors",
            method: "GET",
            headers: {
                "Content-Type": "application/json"
            },
        });

        if (!response.ok) {
          throw new Error(`Response status: ${response.status}`);
        }
    
        const usernames = await response.json();
        usersArray = usernames
        
    } catch (error) {
        console.error(error.message);
    }

    fetchPosts();
}

async function incrementLikes(postId) {
    url = `http://localhost:5273/UserPosts/IncrementLikes/${postId}`

    try {
        const response = await fetch(url, {
            method: "PUT",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({})
        });

        if (!response.ok) {
            throw new Error(`Response status: ${response.status}`);
        }

        console.log(response);
    } catch (error) {
        console.error(error.message);
    }
}

function likeButtonEvents() {
    const posts = document.querySelectorAll('.post');
    posts.forEach(post => {
        const btn = post.querySelector('.post-likes');
        btn.onClick = incrementLikes(post.id);
        console.log(post.id);
    });
}

// Create New Post

const createNewPostForm = document.getElementById('create-new-post');

function createPostForm(parent) {
    const createPostContainer = document.createElement('div');
    createPostContainer.className = 'create-post-container';

    const createPostHeader = document.createElement('div');
    createPostHeader.className = 'create-post-header';  

    const createPostTitleText = document.createElement('p');
    createPostTitleText.className = 'create-post-title-text';
    createPostTitleText.innerText = 'Create Post'
    createPostHeader.appendChild(createPostTitleText);

    const closePostCreation = document.createElement('span');
    closePostCreation.className = 'material-symbols-outlined';
    closePostCreation.innerText = 'close';
    createPostHeader.appendChild(closePostCreation);

    createPostContainer.appendChild(createPostHeader);

    const createPostTitleInput = document.createElement('input');
    createPostTitleInput.type = 'text';
    createPostTitleInput.className = 'create-post-title';
    createPostTitleInput.id = 'create-post-title';
    createPostContainer.appendChild(createPostTitleInput);

    const createPostInput = document.createElement('input');
    createPostInput.type = 'text';
    createPostInput.className = 'create-post-text';
    createPostInput.id = 'create-post-text';
    createPostContainer.appendChild(createPostInput);

    const createPostButton = document.createElement('button');
    createPostButton.className = 'create-post-button';
    createPostButton.innerText = 'Post';
    createPostContainer.appendChild(createPostButton);

    parent.appendChild(createPostContainer);
}