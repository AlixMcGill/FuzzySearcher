// Send Login info to server
export async function sendLogin() {
    let username = document.getElementById("username-form").value;
    let password = document.getElementById("password-form").value;
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
};