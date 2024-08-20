let usersArray;
const hostAddress = "http://localhost:5273";
checkAlreadyLoggedInAndReroute(getCookie("userJwt", 1), "/login.html");
const loader = document.getElementById("loader-ctrn");
getUsernameId(getCookie("username", 1));
let loggedInUser = {
    id: "",
    username: getCookie("username", 1),
};

function getCookie(cookieName, index) {
    return document.cookie
        .split("; ")
        .find((row) => row.startsWith(`${cookieName}=`))
        ?.split("=")[index];
}

function checkAlreadyLoggedInAndReroute(cookie, route) {
    if (!cookie) {
        window.location = `${hostAddress}${route}`;
    }
}

function resetLoader() {
    const loaderDiv = document.createElement("div");
    loaderDiv.classList = "loader";
    loader.appendChild(loaderDiv);
}

function createNewPost(parent, posts) {
    for (let i = 0; i < posts.length; i++) {
        const post = document.createElement("div");
        post.className = "post";
        post.id = posts[i].id;

        const postHeader = document.createElement("div");
        postHeader.className = "post-header";

        const postUsername = document.createElement("p");
        postUsername.className = "post-username";
        postUsername.innerText = usersArray[posts[i].user_Id].userName;
        postHeader.appendChild(postUsername);

        const postTitle = document.createElement("p");
        postTitle.className = "post-title";
        postTitle.innerText = posts[i].post_Title;
        postHeader.appendChild(postTitle);

        post.appendChild(postHeader);

        const postBody = document.createElement("p");
        postBody.className = "post-body";
        postBody.innerText = posts[i].post_Body;
        post.appendChild(postBody);

        const postFooter = document.createElement("div");
        postFooter.className = "post-footer";

        const postDate = document.createElement("span");
        postDate.className = "post-date";
        postDate.id = "post-date-id";
        postDate.innerText = posts[i].date_Time.slice(0, -9);
        postFooter.appendChild(postDate);

        const postLikesButton = document.createElement("button");
        postLikesButton.className = "post-likes";

        const likeHeart = document.createElement("span");
        likeHeart.className = "material-symbols-outlined";
        likeHeart.innerText = "favorite";
        postLikesButton.appendChild(likeHeart);

        const likesAmount = document.createElement("span");
        likesAmount.className = "post-likes-amount";
        likesAmount.innerText = posts[i].post_Likes;
        postLikesButton.appendChild(likesAmount);

        postFooter.appendChild(postLikesButton);

        post.appendChild(postFooter);

        parent.appendChild(post);
    }
    loader.innerText = "";
    likeButtonEvents();
    dropdownContentEvents();
}

async function fetchPosts() {
    const postContainer = document.getElementById("post-ctrn");
    postContainer.innerHTML = "";
    const url = `${hostAddress}/UserPosts`;
    const jwtValue = getCookie("userJwt", 1);
    const bearer = "Bearer " + jwtValue;

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
    } catch (error) {
        console.error(error.message);
    }
}

window.onload = function() {
    getUsername();
};

// Definitely not the best implementation
async function getUsername() {
    const url = `${hostAddress}/DbSearch`;
    const jwtValue = getCookie("userJwt", 1);
    const bearer = "Bearer " + jwtValue;

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

        const usernames = await response.json();
        usersArray = usernames;
    } catch (error) {
        console.error(error.message);
    }
    fetchPosts();
}

async function incrementLikes(postId) {
    url = `${hostAddress}/UserPosts/IncrementLikes/${postId}`;

    try {
        const response = await fetch(url, {
            method: "PUT",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({}),
        });

        if (!response.ok) {
            throw new Error(`Response status: ${response.status}`);
        }
    } catch (error) {
        console.error(error.message);
    }
}

async function decrementLikes(postId) {
    url = `${hostAddress}/UserPosts/DecrementLikes/${postId}`;

    try {
        const response = await fetch(url, {
            method: "PUT",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({}),
        });

        if (!response.ok) {
            throw new Error(`Response status: ${response.status}`);
        }
    } catch (error) {
        console.error(error.message);
    }
}

function likeButtonEvents() {
    const posts = document.querySelectorAll(".post");
    posts.forEach((post) => {
        const btn = post.querySelector(".post-likes");
        btn.addEventListener("click", () => {
            if (btn.id === "liked") {
                decrementLikes(post.id);
                const likesAmount = post.querySelector(".post-likes-amount");
                let parsedBtn = parseInt(likesAmount.innerText);
                parsedBtn--;
                likesAmount.innerText = parsedBtn;
                btn.id = "";
            } else {
                incrementLikes(post.id);
                const likesAmount = post.querySelector(".post-likes-amount");
                let parsedBtn = parseInt(likesAmount.innerText);
                parsedBtn++;
                likesAmount.innerText = parsedBtn;
                btn.id = "liked";
            }
        });
    });
}

// Create New Post

function createPostForm() {
    const maximumTitleCharacters = 50;
    const maximumPostCharacters = 300;
    const createNewPostSection = document.getElementById(
        "create-new-post-section",
    );

    const createPostWrapper = document.createElement("div");
    createPostWrapper.className = "create-post-wrapper";
    createPostWrapper.id = "create-post-wrapper-id";

    const createPostContainer = document.createElement("div");
    createPostContainer.className = "create-post-container roboto-regular";
    createPostContainer.id = "create-post-container-id";

    const createPostHeader = document.createElement("div");
    createPostHeader.className = "create-post-header";

    const createPostTitleText = document.createElement("p");
    createPostTitleText.className = "create-post-title-text";
    createPostTitleText.innerText = "Create Post";
    createPostHeader.appendChild(createPostTitleText);

    const closePostCreation = document.createElement("span");
    closePostCreation.className = "material-symbols-outlined";
    closePostCreation.id = "close-post";
    closePostCreation.innerText = "close";
    createPostHeader.appendChild(closePostCreation);

    createPostContainer.appendChild(createPostHeader);

    const createPostTitleLabel = document.createElement("label");
    createPostTitleLabel.className =
        "create-post-title-label create-post-input-label";
    createPostTitleLabel.for = "create-post-title";
    createPostTitleLabel.innerText = "Title: ";
    createPostContainer.appendChild(createPostTitleLabel);

    const createPostTitleInput = document.createElement("input");
    createPostTitleInput.type = "text";
    createPostTitleInput.className = "create-post-title";
    createPostTitleInput.id = "create-post-title";
    createPostTitleInput.maxLength = maximumTitleCharacters;
    createPostContainer.appendChild(createPostTitleInput);

    const createPostInputLabel = document.createElement("label");
    createPostInputLabel.className =
        "create-post-input-label create-post-input-label";
    createPostInputLabel.for = "create-post-text";
    createPostInputLabel.innerText = "Post Content: ";
    createPostContainer.appendChild(createPostInputLabel);

    const createPostInput = document.createElement("textarea");
    createPostInput.type = "text";
    createPostInput.className = "create-post-text";
    createPostInput.id = "create-post-text";
    createPostInput.rows = "5";
    createPostInput.cols = "40";
    createPostInput.maxLength = maximumPostCharacters;
    createPostContainer.appendChild(createPostInput);

    const createPostFooter = document.createElement("div");
    createPostFooter.className = "create-post-footer";
    createPostFooter.id = "create-post-footer-id";
    createPostContainer.appendChild(createPostFooter);

    const currentChars = document.createElement("span");
    currentChars.className = "create-post-current-chars";
    currentChars.id = "create-post-current-chars-id";
    currentChars.innerText = "0";

    const createPostCharsRemainingContainer = document.createElement("div");
    createPostCharsRemainingContainer.className = "chars-remaining-container";
    createPostCharsRemainingContainer.id = "chars-remaining-container-id";
    createPostCharsRemainingContainer.appendChild(currentChars);
    createPostCharsRemainingContainer.innerHTML += ` / ${maximumPostCharacters}`;
    createPostFooter.appendChild(createPostCharsRemainingContainer);

    const createPostButton = document.createElement("button");
    createPostButton.className = "create-post-button";
    createPostButton.id = "create-post-button-id";
    createPostButton.innerText = "Post";
    createPostFooter.appendChild(createPostButton);
    createPostContainer.appendChild(createPostFooter);

    createNewPostSection.appendChild(createPostWrapper);
    createNewPostSection.appendChild(createPostContainer);
}

function closeCreatePost() {
    const closePost = document.getElementById("close-post");
    closePost.addEventListener("click", () => {
        const postCreationContainer = document.getElementById(
            "create-new-post-section",
        );
        postCreationContainer.innerHTML = "";
    });
}

function forceCloseCreatePost() {
    const postCreationContainer = document.getElementById(
        "create-new-post-section",
    );
    postCreationContainer.innerHTML = "";
}

function updateChractersRemaining() {
    const textInput = document.getElementById("create-post-text");

    textInput.addEventListener("input", () => {
        const textInputLength = textInput.value.length;
        const currentCharsElement = document.getElementById(
            "create-post-current-chars-id",
        );
        currentCharsElement.innerText = textInputLength;

        if (textInputLength > 200 && textInputLength < 300) {
            currentCharsElement.style.color = "#ffa600";
        } else if (textInputLength >= 300) {
            currentCharsElement.style.color = "#ff6361";
        } else {
            currentCharsElement.style.color = "whitesmoke";
        }
    });
}

function isInputEmpty(input) {
    return !input.value && !input.validity.badInput;
}

function postNewUserPost(currentUserID) {
    const createPostButton = document.getElementById("create-post-button-id");
    createPostButton.addEventListener("click", async () => {
        const title = document.getElementById("create-post-title");
        const content = document.getElementById("create-post-text");
        const titleValue = title.value;
        const contentValue = content.value;
        const url = `${hostAddress}/UserPosts`;
        const jwtValue = getCookie("userJwt", 1);
        const bearer = "Bearer " + jwtValue;

        if (!isInputEmpty(title) && !isInputEmpty(content)) {
            try {
                const response = await fetch(url, {
                    method: "POST",
                    headers: {
                        Authorization: bearer,
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify({
                        user_Id: `${currentUserID}`,
                        post_Title: `${titleValue}`,
                        post_Body: `${contentValue}`,
                    }),
                });

                if (!response.ok) {
                    throw new Error(`Response status: ${response.status}`);
                }

                if (response.ok) {
                    forceCloseCreatePost();
                    alert("post Sucessful!");
                    getUsername();
                }
            } catch (error) {
                console.error(error.message);
            }
        } else {
            forceCloseCreatePost();
            alert("Could Not Verify Post Information.");
        }
    });
}

async function getUsernameId(usernameCookie) {
    const url = `${hostAddress}/DbSearch/filterbyusername=${usernameCookie}`;
    const jwtValue = getCookie("userJwt", 1);
    const bearer = "Bearer " + jwtValue;

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

        if (response.ok) {
            const res = await response.json();
            loggedInUser.id = res[0].id;
            profilePageNavigation();
        }
    } catch (error) { }
}

const createNewPostBtn = document.getElementById("create-new-post");

createNewPostBtn.addEventListener("click", () => {
    createPostForm();
    closeCreatePost();
    updateChractersRemaining();
    postNewUserPost(loggedInUser.id);
});

function filterPostByDate(direction) {
    const posts = document.querySelectorAll(".post");

    postTemporaryObjectArray = [];
    posts.forEach((post) => {
        postTemporaryObjectArray.push({
            postId: post.id,
            postYear: parseInt(
                post.querySelector(".post-date").innerText.slice(0, 4),
            ),
            postMonth: parseInt(
                post.querySelector(".post-date").innerText.slice(5, 7),
            ),
            postDay: parseInt(
                post.querySelector(".post-date").innerText.slice(8, 10),
            ),
        });
    });

    if (direction === true) {
        // Asecnding by date
        postTemporaryObjectArray.sort((a, b) => {
            const dateA = new Date(a.postYear, a.postMonth - 1, a.postDay);
            const dateB = new Date(b.postYear, b.postMonth - 1, b.postDay);
            return dateB - dateA;
        });
        sortElementsBySortedArray(postTemporaryObjectArray);
    }
    if (direction == false) {
        // Decending by date
        postTemporaryObjectArray.sort((a, b) => {
            const dateA = new Date(a.postYear, a.postMonth - 1, a.postDay);
            const dateB = new Date(b.postYear, b.postMonth - 1, b.postDay);
            return dateA - dateB;
        });
        sortElementsBySortedArray(postTemporaryObjectArray);
    }
}

function filterPostByLikes(direction) {
    const posts = document.querySelectorAll(".post");

    postTemporaryObjectArray = [];
    posts.forEach((post) => {
        postTemporaryObjectArray.push({
            postId: post.id,
            postLikes: parseInt(post.querySelector(".post-likes-amount").innerText),
        });
    });

    if (direction === true) {
        // Asecnding by likes
        postTemporaryObjectArray.sort((a, b) => {
            const likesA = a.postLikes;
            const likesB = b.postLikes;
            return likesB - likesA;
        });
        sortElementsBySortedArray(postTemporaryObjectArray);
    }
    if (direction === false) {
        // Asecnding by likes
        postTemporaryObjectArray.sort((a, b) => {
            const likesA = a.postLikes;
            const likesB = b.postLikes;
            return likesA - likesB;
        });
        sortElementsBySortedArray(postTemporaryObjectArray);
    }
}

function sortElementsBySortedArray(sortedObjects) {
    const container = document.getElementById("post-ctrn");
    const elements = Array.from(container.querySelectorAll(".post"));

    const elementMap = elements.reduce((acc, element) => {
        const id = parseInt(element.getAttribute("id"), 10);
        acc[id] = element;
        return acc;
    }, {});

    const fragment = document.createDocumentFragment();

    sortedObjects.forEach((id) => {
        if (elementMap[id.postId]) {
            fragment.appendChild(elementMap[id.postId]);
        }
    });
    container.innerHTML = "";
    container.appendChild(fragment);
}

function changeActiveAttribute(nodes, index) {
    nodes.forEach((element) => {
        element.id = "";
    });
    nodes[index].id = activeAttribute;
}

function dropdownContentEvents() {
    const container = document.getElementById("post-ctrn");
    if (container.innerHTML === "" || container.innerHTML === null) {
        alert("Please Reload The Page No Posts To Filter");
        return;
    }

    const dropdownContent = document.querySelectorAll(".filter-button");
    activeAttribute = "active-dropdown-content";

    dropdownContent[0].addEventListener("click", () => {
        changeActiveAttribute(dropdownContent, 0);
        filterPostByDate(true); // Asecnding by date
    });
    dropdownContent[1].addEventListener("click", () => {
        changeActiveAttribute(dropdownContent, 1);
        filterPostByDate(false); // decnding by date
    });
    dropdownContent[2].addEventListener("click", () => {
        changeActiveAttribute(dropdownContent, 2);
        filterPostByLikes(true); // Asecnding by Likes
    });
    dropdownContent[3].addEventListener("click", () => {
        changeActiveAttribute(dropdownContent, 3);
        filterPostByLikes(false); // decnding by Likes
    });
}

function cleanInnerHtml(tagToClean) {
    tagToClean.innerHTML = "";
}

function createNavList(parent) {
    const listElement = document.createElement("li");
    const anchorElement = document.createElement("a");

    listElement.classList = "nav-list-item roboto-regular";
    anchorElement.href = "./profile.html";
    anchorElement.innerText = "Profile";

    listElement.appendChild(anchorElement);
    parent.appendChild(listElement);
}

function profilePageNavigation() {
    if (loggedInUser.id !== "") {
        const navList = document.getElementById("nav-ul-list");
        cleanInnerHtml(navList);
        createNavList(navList);
    }
}

async function searchPostsByTitle() {
    const postContainer = document.getElementById("post-ctrn");
    const searchValue = document.getElementById("search-post-text-input").value;
    postContainer.innerHTML = "";
    resetLoader();
    const url = `${hostAddress}/UserPosts/filter=${searchValue}`;
    const jwtValue = getCookie("userJwt", 1);
    const bearer = "Bearer " + jwtValue;

    try {
        const response = await fetch(url, {
            method: "GET",
            headers: {
                Authorization: bearer,
                "Content-Type": "application/json",
            },
        });

        if (!response.ok) {
            alert("Could not find a search result");
            location.reload();
            throw new Error(`Response status: ${response.status}`);
        }
        if (response.ok) {
            const posts = await response.json();
            createNewPost(postContainer, posts);
        }
    } catch (error) {
        console.error(error.message);
    }
}

async function getNewUsernames() {
    usersArray = "";
    const url = `${hostAddress}/DbSearch`;
    const jwtValue = getCookie("userJwt", 1);
    const bearer = "Bearer " + jwtValue;

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

        const usernames = await response.json();
        usersArray = usernames;
        searchPostsByTitle();
    } catch (error) {
        console.error(error.message);
    }
}

const searchButton = document.getElementById("search-post-button");
searchButton.addEventListener("click", async () => {
    await getNewUsernames();
});
