const fileInput = document.getElementById("resume_file");
const btn = document.getElementById("report_btn");
let url = "http://127.0.0.1:8000/resume_analyzer";

async function connectbackend() {
    
    // Disable button and show loader
    btn.disabled = true;
    btn.textContent = "Analyzing...";

    const formdata = new FormData();
    formdata.append("file", fileInput.files[0]);

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
    let Summary= "N/A";
    let ATS_Score= "N/A";
    let Strengths='None'
    let Weakness='None'
    let MissingSkills = "None";
    let Recommendations = "None";

    if (typeof data === "object" && data !== null) {
        Summary= data.Summary||Summary;
        ATS_Score = data.ATS_Score ||score;

        let Strength= data.Strengths||Strengths;
        if (Array.isArray(Strength)) {
            Strengths = Strength.join(", ");
        } else if (Strength) {
            Strengths = Strength;
        }

        let weakness= data.Weakness||Weakness;
        if (Array.isArray(weakness)) {
            Weakness = weakness.join(", ");
        } else if (weakness) {
            Weakness = weakness;
        }


        
        let skills = data.Missing_skills || data.missing_skills;
        if (Array.isArray(skills)) {
            MissingSkills = skills.join(", ");
        } else if (skills) {
            MissingSkills = skills;
        }

        Recommendations = data.Recommendations || data.recommendations || Recommendations;

        
    } else {
        Recommendations = data;
    }

    // Create popup HTML
    const contentHTML = `
        <h2 style="color: rgb(59, 8, 84); margin-bottom: 20px; font-size: 22px;">Resume Analysis Report</h2>
        <div style="font-size: 15px; color: #333; line-height: 1.6; text-align: left;">
            <p><strong>Summary:</strong> ${Summary}</p>
            <p><strong>ATS Score:</strong> ${ATS_Score}</p>
            <p><strong>Strengths:</strong> ${Strengths}</p>
            <p><strong>Weakness:</strong> ${Weakness}</p>
            <p><strong>Missing Skills:</strong> ${MissingSkills}</p>
            <p style="margin-top: 10px;"><strong>Recommendations:</strong></p>
            <p style="background-color: #f9f9f9; padding: 10px; border-left: 4px solid rgb(150, 84, 211); border-radius: 4px; white-space: pre-line; margin-top: 5px;">${Recommendations}</p>
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