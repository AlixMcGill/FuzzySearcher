
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
    
        const json = await response.json();
        console.log(json);
    } 
    catch (error) {
        console.error(error.message);
    }
}


const btn = document.getElementById("myBtn");

btn.addEventListener("click", () => {
    getData();
});
