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
        // COMMENTED: Normally we would clear user session storage here:
        // localStorage.removeItem("currentUser");
        window.location.href = "index.html";
    });
}

// Function to load and display user profile details dynamically
function loadUserProfile() {
    // Read query parameters from URL (stateless transmission as per user requirement to avoid localStorage)
    const params = new URLSearchParams(window.location.search);
    
    // COMMENTED: Normally, we would retrieve user info from storage or perform a session fetch API call:
    // const user = JSON.parse(localStorage.getItem('currentUser'));
    // If not logged in, redirect to login: if (!user) window.location.href = 'index.html';
    
    const user = {
        username: params.get("username") || "kalyani_dev",
        fullname: params.get("fullname") || "Kalyani Sonawane",
        email: params.get("email") || "kalyani@example.com",
        highestclass: params.get("highestclass") || "B.Tech (Computer Science & Engineering)",
        careergoal: params.get("careergoal") || "Full Stack Developer & AI Engineer",
        university: params.get("university") || "Savitribai Phule Pune University",
        cgpa: params.get("cgpa") || "9.2",
        resumeName: params.get("resume") || "kalyani_resume.pdf"
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

// Execute profile load
document.addEventListener("DOMContentLoaded", loadUserProfile);