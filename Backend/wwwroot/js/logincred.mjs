const username = document.getElementById("username-form");
const password = document.getElementById("password-form");

const submitBtn = document.getElementById("submit-login");

submitBtn.addEventListener('click', () => {
  //sendLogin(username, password);
  cleanLoginForm(username, password);
});

async function sendLogin(loginUsername, loginPassword) {
    let username = loginUsername.value;
    let password = loginPassword.value;
    let url = "http://localhost:5273/DbSearch/Login";

    try {
        const response = await fetch(url,{
            method: "POST",
            body: JSON.stringify({username: username, password: password})
        });

        if (!response.ok) {
            throw new Error(`Response status: ${response.status}`);
        }

        const json = await response.json();
        console.log(json);

    } catch (error) {
        console.error(error.message);
    }
}

function cleanLoginForm(loginUsername, loginPassword) {
  loginUsername.value = "";
  loginPassword.value = "";
}
