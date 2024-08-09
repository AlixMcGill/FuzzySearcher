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
    setTimeout(getUsername, 500)
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

function createPostForm() {
    const maximumTitleCharacters = 50;
    const maximumPostCharacters = 300;
    const createNewPostSection = document.getElementById('create-new-post-section');

    const createPostWrapper = document.createElement('div')
    createPostWrapper.className = 'create-post-wrapper';
    createPostWrapper.id = 'create-post-wrapper-id';

    const createPostContainer = document.createElement('div');
    createPostContainer.className = 'create-post-container roboto-regular';
    createPostContainer.id = 'create-post-container-id';

    const createPostHeader = document.createElement('div');
    createPostHeader.className = 'create-post-header';  

    const createPostTitleText = document.createElement('p');
    createPostTitleText.className = 'create-post-title-text';
    createPostTitleText.innerText = 'Create Post'
    createPostHeader.appendChild(createPostTitleText);

    const closePostCreation = document.createElement('span');
    closePostCreation.className = 'material-symbols-outlined';
    closePostCreation.id = 'close-post';
    closePostCreation.innerText = 'close';
    createPostHeader.appendChild(closePostCreation);

    createPostContainer.appendChild(createPostHeader);

    const createPostTitleLabel = document.createElement('label')
    createPostTitleLabel.className = 'create-post-title-label create-post-input-label'
    createPostTitleLabel.for = 'create-post-title';
    createPostTitleLabel.innerText = 'Title: ';
    createPostContainer.appendChild(createPostTitleLabel);

    const createPostTitleInput = document.createElement('input');
    createPostTitleInput.type = 'text';
    createPostTitleInput.className = 'create-post-title';
    createPostTitleInput.id = 'create-post-title';
    createPostTitleInput.maxLength = maximumTitleCharacters;
    createPostContainer.appendChild(createPostTitleInput);

    const createPostInputLabel = document.createElement('label');
    createPostInputLabel.className = 'create-post-input-label create-post-input-label';
    createPostInputLabel.for = 'create-post-text';
    createPostInputLabel.innerText = 'Post Content: ';
    createPostContainer.appendChild(createPostInputLabel);

    const createPostInput = document.createElement('textarea');
    createPostInput.type = 'text';
    createPostInput.className = 'create-post-text';
    createPostInput.id = 'create-post-text';
    createPostInput.rows = '5';
    createPostInput.cols = '40';
    createPostInput.maxLength = maximumPostCharacters;
    createPostContainer.appendChild(createPostInput);

    const createPostFooter = document.createElement('div');
    createPostFooter.className = 'create-post-footer';
    createPostFooter.id = 'create-post-footer-id';
    createPostContainer.appendChild(createPostFooter);

    const currentChars = document.createElement('span');
    currentChars.className = 'create-post-current-chars';
    currentChars.id = 'create-post-current-chars-id';
    currentChars.innerText = '0';

    const createPostCharsRemainingContainer = document.createElement('div');
    createPostCharsRemainingContainer.className = 'chars-remaining-container';
    createPostCharsRemainingContainer.id = 'chars-remaining-container-id';
    createPostCharsRemainingContainer.appendChild(currentChars);
    createPostCharsRemainingContainer.innerHTML += ` / ${maximumPostCharacters}`;
    createPostFooter.appendChild(createPostCharsRemainingContainer);

    const createPostButton = document.createElement('button');
    createPostButton.className = 'create-post-button';
    createPostButton.innerText = 'Post';
    createPostFooter.appendChild(createPostButton);
    createPostContainer.appendChild(createPostFooter);

    createNewPostSection.appendChild(createPostWrapper);
    createNewPostSection.appendChild(createPostContainer);

}

function closeCreatePost() {
    const closePost = document.getElementById('close-post');

    closePost.addEventListener('click', () => {
       const postCreationContainer = document.getElementById('create-new-post-section');
       postCreationContainer.innerHTML = "";
    });
}

function updateChractersRemaining() {
    const textInput = document.getElementById('create-post-text')

    textInput.addEventListener('input', () => {
        const textInputLength = textInput.value.length;
        const currentCharsElement = document.getElementById('create-post-current-chars-id');
        currentCharsElement.innerText = textInputLength;

        if (textInputLength > 200 && textInputLength < 300) {
            currentCharsElement.style.color = "#ffa600";
        } else if (textInputLength >= 300) {
            currentCharsElement.style.color = "#ff6361";
        } else {
            currentCharsElement.style.color = "whitesmoke";
        }
    })
}

const createNewPostBtn = document.getElementById('create-new-post');

createNewPostBtn.addEventListener('click', () => {  
    createPostForm();
    closeCreatePost();
    updateChractersRemaining();
});