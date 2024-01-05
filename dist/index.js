"use strict";
const getUsername = document.querySelector("#user");
const formSubmit = document.querySelector("#form");
const main_container = document.querySelector(".main_container");
//reusable function
async function myCustomeFetcher(url, options) {
    const response = await fetch(url, options);
    if (!response.ok) {
        throw new Error(`Network Error - status: ${response.status}`);
    }
    const data = await response.json();
    // console.log(data);
    return data;
}
//Show data on UI
const showResultUI = (singleUser) => {
    // console.group(singleUser);
    const { avatar_url, login, url, location } = singleUser;
    main_container.insertAdjacentHTML("beforeend", `<div class='card'>
        <img src=${avatar_url} alt=${login}/>
        <hr/>
        <div class='card-footer'>
        <img src="${avatar_url}" alt="${login}"/>
        <a href="${url}"> Github</a>
        </div>
        </div>
        `);
};
function fetchUserData(url) {
    myCustomeFetcher(url, {}).then((userInfo) => {
        for (const singleUser of userInfo) {
            showResultUI(singleUser);
        }
    });
}
// default function call
fetchUserData("https://api.github.com/users");
//Search Function
formSubmit.addEventListener("submit", async (e) => {
    e.preventDefault();
    const searchTerm = getUsername.value.toLowerCase();
    // console.log(searchTerm)
    try {
        const url = "https://api.github.com/users";
        const allUserData = await myCustomeFetcher(url, {});
        const matchingUsers = allUserData.filter((user) => {
            return user.login.toLowerCase().includes(searchTerm);
        });
        main_container.innerHTML = "";
        if (matchingUsers.length == 0) {
            main_container?.insertAdjacentHTML("beforeend", `<p class="empty-msg">No matching users found.</p>`);
        }
        else {
            for (const singleUser of matchingUsers) {
                showResultUI(singleUser);
            }
        }
    }
    catch (error) {
        console.log(error);
    }
});
