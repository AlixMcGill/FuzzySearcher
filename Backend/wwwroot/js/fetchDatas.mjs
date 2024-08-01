
async function getData() {
    const url = "http://localhost:5273/DbSearch"

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
    
        const userData = await response.json();
        appendData(userData);
        console.log(userData);
    } 
    catch (error) {
        console.error(error.message);
    }
}


const btn = document.getElementById("myBtn");

btn.addEventListener("click", () => {
    getData();
});

function appendData(userD) {
    const dataContainer = document.getElementById("content-container");
    dataContainer.innerHTML = '';

    for (let i = 0; i < userD.length; i++) {
        let userContainer = document.createElement('div');
        userContainer.setAttribute('class', 'user-element')
        userContainer.setAttribute('id', `user${userD[i].id}`);

        let firstname = document.createElement('p');
        firstname.setAttribute('class', 'user-firstname');
        firstname.innerText = `Firstname: ${userD[i].firstName}`;
        userContainer.appendChild(firstname);

        let lastname = document.createElement('p');
        lastname.setAttribute('class', 'user-lastname');
        lastname.innerText = `Lastname: ${userD[i].lastName}`;
        userContainer.appendChild(lastname);

        let username = document.createElement('p');
        username.setAttribute('class', 'user-username');
        username.innerText = `Username: ${userD[i].userName}`;
        userContainer.appendChild(username);

        dataContainer.appendChild(userContainer);
    }

}

