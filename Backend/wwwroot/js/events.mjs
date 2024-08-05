import {sendLogin} from "./fetch.mjs";

// Login Form
let loginBtn = document.getElementById("submit-login");

loginBtn.addEventListener('click', sendLogin);