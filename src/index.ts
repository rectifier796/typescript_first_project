const getUsername = document.querySelector("#user") as HTMLInputElement;
const formSubmit = document.querySelector("#form") as HTMLFormElement;
const main_container = document.querySelector(".main_container") as HTMLElement;


// so lets define the contract of an object
interface UserData {
    id:number;
    login: string;
    avatar_url:string;
    location:string;
    url:string;
}

//reusable function
async function myCustomeFetcher<T>(url:string,options?:RequestInit):Promise<T>{
    const response = await fetch(url,options);
    if(!response.ok){
        throw new Error(`Network Error - status: ${response.status}`);
    }

    const data :Promise<T> =await response.json();
    // console.log(data);
    return data;
}

//Show data on UI
const showResultUI = (singleUser: UserData)=>{
    // console.group(singleUser);
    const {avatar_url, login, url, location} = singleUser;
    main_container.insertAdjacentHTML(
        "beforeend",
        `<div class='card'>
        <img src=${avatar_url} alt=${login}/>
        <hr/>
        <div class='card-footer'>
        <img src="${avatar_url}" alt="${login}"/>
        <a href="${url}"> Github</a>
        </div>
        </div>
        `
    )
}

function fetchUserData(url:string){
    myCustomeFetcher<UserData[]>(url,{}).then((userInfo: UserData[])=>{
        for(const singleUser of userInfo){
            showResultUI(singleUser);
        }
    })
}

// default function call
fetchUserData("https://api.github.com/users");

//Search Function
formSubmit.addEventListener("submit",async(e)=>{
    e.preventDefault();

    const searchTerm: string = getUsername.value.toLowerCase();
    // console.log(searchTerm)
    try{
        const url = "https://api.github.com/users";
        const allUserData : UserData[] = await myCustomeFetcher<UserData[]>(url,{});
        const matchingUsers: UserData[] = allUserData.filter((user: UserData): boolean=>{
            return user.login.toLowerCase().includes(searchTerm)
        });
        main_container.innerHTML="";
        if(matchingUsers.length==0){
            main_container?.insertAdjacentHTML(
                "beforeend",
                `<p class="empty-msg">No matching users found.</p>`
            )
        }
        else{
            for(const singleUser of matchingUsers){
                showResultUI(singleUser);
            } 
        }
    }
    catch(error){
        console.log(error);
    }
})