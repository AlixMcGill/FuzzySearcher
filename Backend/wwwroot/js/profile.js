// Really regretting not getting js modules working
const hostAddress = 'http://localhost:5273';
checkAlreadyLoggedInAndReroute(getCookie('userJwt', 1), '/login.html')
const loader = document.getElementById('loader-ctrn');
let loggedInUser = {
    id: '',
    firstName: '',
    lastName: '',
    username: getCookie('username', 1)
}
getUsernameId(getCookie('username', 1));

function getCookie(cookieName, index) {
    return document.cookie.split('; ').find((row) => row.startsWith(`${cookieName}=`))?.split("=")[index]
}

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
    const jwtValue = getCookie('userJwt', 1);
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
    const jwtValue = getCookie('userJwt', 1);
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
}

async function fetchPosts(userId) {
    const postContainer = document.getElementById('user-posts-section')
    postContainer.innerHTML = '';
    const url = `${hostAddress}/UserPosts/Posts/${userId}`;
    const jwtValue = getCookie('userJwt', 1);
    const bearer = 'Bearer ' + jwtValue;

    try {
        const response = await fetch(url, {
            method: "GET",
            headers: {
                Authorization: bearer,
                "Content-Type": "application/json",
            },
            cache: "force-cache"
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
