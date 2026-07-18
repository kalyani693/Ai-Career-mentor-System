const fileInput = document.getElementById("resume_file");
const btn = document.getElementById("report_btn");
let url = "http://127.0.0.1:8000/resume_analyzer";

async function connectbackend() {
    if (!fileInput.files || !fileInput.files[0]) {
        alert("Please select a resume file first.");
        return;
    }

    // Disable button and show loader
    btn.disabled = true;
    btn.textContent = "Analyzing...";

    const formdata = new FormData();
    formdata.append("file", fileInput.files[0]);

    try {
        let response = await fetch(url, {
            method: 'POST',
            body: formdata
        });
        let data = await response.json();

        // Restore button state
        btn.disabled = false;
        btn.textContent = "Generate Report";

        // Display popup
        showResponsePopup(data);
    }
    catch (error) {
        console.error("error:", error);
        btn.disabled = false;
        btn.textContent = "Generate Report";
        alert("Something went wrong while communicating with the backend. Please check if backend is running.");
    }
}

function showResponsePopup(data) {
    // Extract properties
    let score = "N/A";
    let missingSkills = "None";
    let improvements = "None";
    let extraProperties = "";

    if (typeof data === "object" && data !== null) {
        score = data.ATS_Score || data.score || score;
        
        let skills = data.Missing_Skills || data.missing_skills;
        if (Array.isArray(skills)) {
            missingSkills = skills.join(", ");
        } else if (skills) {
            missingSkills = skills;
        }

        improvements = data.Improvements || data.improvements || data.suggestions || data.Suggestions || improvements;

        // Collect other properties dynamically
        Object.keys(data).forEach(key => {
            const normalizedKey = key.toLowerCase();
            if (!["ats_score", "score", "missing_skills", "improvements", "suggestions"].includes(normalizedKey)) {
                let value = data[key];
                if (typeof value === "object" && value !== null) {
                    value = JSON.stringify(value);
                }
                extraProperties += `<p style="margin-top: 10px;"><strong>${key.replace(/_/g, " ")}:</strong> ${value}</p>`;
            }
        });
    } else {
        improvements = data;
    }

    // Create popup HTML
    const contentHTML = `
        <h2 style="color: rgb(59, 8, 84); margin-bottom: 20px; font-size: 22px;">Resume Analysis Report</h2>
        <div style="font-size: 15px; color: #333; line-height: 1.6; text-align: left;">
            <p><strong>ATS Score:</strong> ${score}</p>
            <p><strong>Missing Skills:</strong> ${missingSkills}</p>
            <p style="margin-top: 10px;"><strong>Improvements:</strong></p>
            <p style="background-color: #f9f9f9; padding: 10px; border-left: 4px solid rgb(150, 84, 211); border-radius: 4px; white-space: pre-line; margin-top: 5px;">${improvements}</p>
            ${extraProperties}
        </div>
    `;

    // Render modal overlay
    const overlay = document.createElement("div");
    overlay.style.position = "fixed";
    overlay.style.top = "0";
    overlay.style.left = "0";
    overlay.style.width = "100vw";
    overlay.style.height = "100vh";
    overlay.style.backgroundColor = "rgba(0, 0, 0, 0.5)";
    overlay.style.display = "flex";
    overlay.style.justify = "center";
    overlay.style.alignItems = "center";
    overlay.style.zIndex = "1000";

    // Create modal container card
    const card = document.createElement("div");
    card.style.backgroundColor = "white";
    card.style.padding = "30px";
    card.style.borderRadius = "10px";
    card.style.maxWidth = "550px";
    card.style.width = "90%";
    card.style.maxHeight = "80vh";
    card.style.overflowY = "auto";
    card.style.boxShadow = "0px 4px 15px rgba(0, 0, 0, 0.3)";
    card.style.position = "relative";

    // Close button
    const closeBtn = document.createElement("button");
    closeBtn.textContent = "X";
    closeBtn.style.position = "absolute";
    closeBtn.style.top = "15px";
    closeBtn.style.right = "15px";
    closeBtn.style.border = "none";
    closeBtn.style.backgroundColor = "transparent";
    closeBtn.style.fontSize = "20px";
    closeBtn.style.fontWeight = "bold";
    closeBtn.style.color = "rgb(59, 8, 84)";
    closeBtn.style.cursor = "pointer";
    closeBtn.addEventListener("click", () => overlay.remove());

    const contentDiv = document.createElement("div");
    contentDiv.innerHTML = contentHTML;

    card.appendChild(closeBtn);
    card.appendChild(contentDiv);
    overlay.appendChild(card);
    document.body.appendChild(overlay);
}

btn.addEventListener('click', connectbackend);