const difficultyInput = document.getElementById("difficultylevel");
const btn = document.getElementById("Iq_btn");
let url = "http://127.0.0.1:8000/Practice_questions";

async function connectbackend() {
    const level = difficultyInput.value.trim() || "Medium";

    // Disable button and show loader text
    btn.disabled = true;
    btn.textContent = "Loading Questions...";

    // Generate FormData for the request
    const formdata = new FormData();
    formdata.append("difficulty", level);

    const token=localStorage.getItem("access_token");

    try {
        let response = await fetch(url, {
            method: 'POST',
            headers:{"Authorization":`Bearer ${token}`,
                     "Content-Type":"application/json"},
            body: formdata
        });
        let data = await response.json();

        // Restore button state
        btn.disabled = false;
        btn.textContent = "Practice Questions";

        // Redirect to new page with query param payload (stateless)
        window.location.href = "questions_answers.html?data=" + encodeURIComponent(JSON.stringify(data));
    }
    catch (error) {
        console.error("error:", error);
        btn.disabled = false;
        btn.textContent = "Practice Questions";
        alert("Something went wrong while fetching questions. Please make sure backend is running.");
    }   
}

btn.addEventListener('click', connectbackend);