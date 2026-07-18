{
    /* Registration and Login Logic */

// Registration elements
const fullname = document.getElementById("fullname");
const username = document.getElementById("username");
const email = document.getElementById("email");
const university = document.getElementById("university");
const cgpa = document.getElementById("cgpa");
const resume = document.getElementById("resume");
const careergoal = document.getElementById("careergoal");
const highestclass = document.getElementById("highestclass");
const password = document.getElementById("password");
const register = document.getElementById("Registerbtn");
const card = document.getElementsByClassName("regcard");
const popupoverlay = document.getElementById("popupoverlay");

let url = "http://127.0.0.1:8000/registration";

async function registration() {
    // Clear any previous error/success messages
    const existingMsg = card[0].querySelector(".result-msg");
    if (existingMsg) existingMsg.remove();

    // Create loader
    let loader = document.createElement("div");
    loader.classList.add("loader");
    loader.textContent = "";
    card[0].append(loader);

    register.disabled=true;

    // Create new FormData locally for each submission
    const formdata = new FormData();
    let input = {
        "Full_Name": fullname.value,
        "Username": username.value,
        "Email": email.value,
        "Password": password.value,
        "Highest_Class": highestclass.value,
        "Career_goal": careergoal.value,
        "University": university.value,
        "CGPA": cgpa.value
    };
    
    //if input field is empty
    for (const [key,value] of Object.entries(input)){
        if (value==null){
            loader.remove();

            let error= document.createElement("h4");
            error.classList.add("result-msg");
            error.textContent = `Please fill ${key} value.`;
            existingMsg.innerHTML=error;
        }

    }

    formdata.append("info", JSON.stringify(input));
    if (resume.files && resume.files[0]) {
        formdata.append("resume", resume.files[0]);
    }
    //changes
    else{
        formdata.append("resume",null);
    }

    try {
        const response = await fetch(url, {
            method: 'POST',
            body: formdata
        });
        const data = await response.json();
        loader.remove();
        register.disabled=false;

        let result = document.createElement("h3");
        result.classList.add("result-msg");
        result.style.color = "green";
        result.textContent = data.Result||data.detail||data["Error in Data Saving"]||"Registration Successful!";
        register.after(result);


    }
    catch (error) {
        console.error("error:", error);
        loader.remove();
        let error_msg = document.createElement("h4");
        error_msg.classList.add("result-msg");
        error_msg.textContent = "something went wrong";
        error_msg.style.color = "red";
        register.after(error_msg);
    }
}

register.addEventListener('click', registration);



// Login elements
const _username = document.getElementById("_username");
const _password = document.getElementById("_password");
const login = document.getElementById("logbtn");
const loginpopupoverlay = document.getElementById("loginpopup");
const logincard = document.querySelector(".logincard");

let _url = "http://127.0.0.1:8000/login";

async function loginUser() {
    // Clear previous feedback messages
    const existingMsg = logincard.querySelector(".result-msg");
    if (existingMsg) existingMsg.remove();

    let loader = document.createElement("div");
    loader.classList.add("loader");
    loader.textContent = "";
    logincard.append(loader);

    const _formdata = new FormData();
    let input = {
        "username": _username.value,
        "password": _password.value,
    };

    _formdata.append("info", JSON.stringify(input));

    try {
        const response = await fetch(_url, {
            method: 'POST',
            body: _formdata
        });
        const data = await response.json();
        loader.remove();

        if (response.ok) {
            let result = document.createElement("h3");
            result.classList.add("result-msg");
            result.style.color = "green";
            result.textContent = "Login Successful!";
            login.after(result);

            //profile icon is now clickable
            const profile = document.querySelector('.profile');
            profile.disabled="false"

            // COMMENTED: Normally we would store user session here:
            // localStorage.setItem('currentUser', JSON.stringify(data));
            // Instead, we will store the user data in memory for this session
            window.sessionUser = {
                username: _username.value,
                fullname: data.Full_Name || "Kalyani",
                email: data.Email || "kalyani@example.com",
                highestclass: data.Highest_Class || "B.tech 3rd year",
                careergoal: data.Career_goal || "Software Engineer",
                university: data.University || "State University",
                cgpa: data.CGPA || "9.0",
                resume: data.Resume || "resume.pdf"
            };

            // Dynamically update UI on the current page to reflect logged-in state
            updateLoggedInUI(window.sessionUser);

            setTimeout(() => {
                loginpopupoverlay.classList.remove('show');
                result.remove();
            }, 2000);
        } else {
            let error_msg = document.createElement("h4");
            error_msg.classList.add("result-msg");
            error_msg.textContent = data.detail || "Invalid username or password";
            error_msg.style.color = "red";
            login.after(error_msg);
        }
    }
    catch (error) {
        console.error("error:", error);
        loader.remove();
        let error_msg = document.createElement("h4");
        error_msg.classList.add("result-msg");
        error_msg.textContent = "something went wrong";
        error_msg.style.color = "red";
        login.after(error_msg);
    }
}

// Function to update main page UI upon login
function updateLoggedInUI(user) {
    const btnsSection = document.querySelector(".btns");
    if (btnsSection) {
        btnsSection.innerHTML = `
            <div class="user-welcome-card" style="text-align: center; color: white;">
                <h3>Welcome back, <span style="color: antiquewhite;">${user.fullname}</span>!</h3>
                <p>Ready to level up your career today?</p>
                <button class="btn" id="logout_btn" style="margin-top: 15px;">Logout</button>
            </div>
        `;
        document.getElementById("logout_btn").addEventListener("click", () => {
            window.sessionUser = null;
            location.reload();
        });
    }

    // Dynamic link generation for profile page (to pass user state without localStorage)
    const profileLink = document.querySelector('.right-menu a');
    if (profileLink) {
        // Construct query parameter to pass user details to userProfile.html
        const params = new URLSearchParams({
            username: user.username,
            fullname: user.fullname,
            email: user.email,
            highestclass: user.highestclass,
            careergoal: user.careergoal,
            university: user.university,
            cgpa: user.cgpa,
            resume: user.resume
        });
        profileLink.href = `userProfile.html?${params.toString()}`;
    }
}

login.addEventListener('click', loginUser);

}
