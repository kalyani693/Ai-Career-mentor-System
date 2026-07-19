const popup = document.getElementById("pop");
const menubtn = document.getElementById("menu");
const back = document.getElementById("back");

// Open and close navigation overlay
menubtn.addEventListener('click', () => {
    popup.classList.add('show');
});

back.addEventListener('click', () => {
    popup.classList.remove('show');
});

// Logout handler (clears dynamic URL params and redirects)
const logoutItem = document.querySelector(".menucard p:nth-child(4)");
if (logoutItem) {
    logoutItem.style.cursor = "pointer";
    logoutItem.addEventListener("click", () => {
        
        localStorage.removeItem("access_token");
        window.location.href = "index.html";
    });
}

// Function to load and display user profile details dynamically
const url = "http://127.0.0.1:8000/getUserProfile";
 async function loadUserProfile() {
    const token=localStorage.getItem("access_token")
    
    try{
         let response = await fetch(url, {
            method: 'POST',
            headers:{"Authorization":`Bearer ${token}`,
                     "Content-Type":"application/json"},
            body: formdata
        });
        let data = await response.json();

    
    
    // COMMENTED: Normally, we would retrieve user info from storage or perform a session fetch API call:
    // const user = JSON.parse(localStorage.getItem('currentUser'));
    // If not logged in, redirect to login: if (!user) window.location.href = 'index.html';
    let userinfo=data.user;
    const user = {
        username: userinfo.Username|| "kalyani_dev",
        fullname: userinfo.Full_Name|| "Kalyani Sonawane",
        email:userinfo.Email|| "kalyani@example.com",
        highestclass:userinfo.Highest_Class|| "B.Tech (Computer Science & Engineering)",
        careergoal:userinfo.Career_goal || "Full Stack Developer & AI Engineer",
        university: userinfo.University|| "Savitribai Phule Pune University",
        cgpa:userinfo.get("CGPA")|| "9.2",
        resumeName:"your_resume.pdf"
    };

    // Update greeting heading
    const greetingText = document.querySelector(".greetings h2");
    if (greetingText) {
        greetingText.textContent = `Welcome ${user.fullname}!`;
    }

    // Populate user profile info block dynamically
    const infoContainer = document.querySelector(".info");
    if (infoContainer) {
        infoContainer.innerHTML = `
            <p><strong>Username:</strong> ${user.username}</p>
            <p><strong>Full Name:</strong> ${user.fullname}</p>
            <p><strong>Email:</strong> ${user.email}</p>
            <p><strong>Highest Class:</strong> ${user.highestclass}</p>
            <p><strong>Career Goal:</strong> ${user.careergoal}</p>
            <p><strong>University Name:</strong> ${user.university}</p>
            <p><strong>CGPA:</strong> ${user.cgpa}</p>
            <p><strong>Uploaded Resume:</strong> <a href="#" style="color: #3b0854; text-decoration: underline;">${user.resumeName}</a></p>
        `;
    }
    }
    catch{
       alert("Something went wrong while fetching user information. Please make sure backend is running.");
    }
    
}

// Execute profile load
document.addEventListener("DOMContentLoaded", loadUserProfile);