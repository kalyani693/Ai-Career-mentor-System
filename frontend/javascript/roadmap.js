const fileInput = document.getElementById("resume_file");
const btn = document.getElementById("roadmap_btn");
let url = "http://127.0.0.1:8000/Roadmap_Generator";

async function connectbackend() {
    if (!fileInput.files || !fileInput.files[0]) {
        alert("Please select a resume file first.");
        return;
    }

    // Disable button and show loader
    btn.disabled = true;
    btn.textContent = "Generating Roadmap...";

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
        btn.textContent = "Generate Roadmap";

        // Display popup
        showRoadmapPopup(data);
    }
    catch (error) {
        console.error("error:", error);
        btn.disabled = false;
        btn.textContent = "Generate Roadmap";
        alert("Something went wrong while generating roadmap. Please check if backend is running.");
    }
}

function showRoadmapPopup(data) {
    let roadmapContent = "";

    // Process data into HTML
    if (Array.isArray(data)) {
        data.forEach((stepItem, idx) => {
            let title = stepItem.title || stepItem.Title || `Step ${idx + 1}`;
            let desc = stepItem.description || stepItem.Description || "";
            roadmapContent += `
                <div style="margin-bottom: 15px; border-bottom: 1px solid #eee; padding-bottom: 10px;">
                    <h4 style="color: rgb(59, 8, 84); margin-bottom: 5px;">Step ${stepItem.step || (idx + 1)}: ${title}</h4>
                    <p style="margin: 0; color: #555; font-size: 14px;">${desc}</p>
                </div>
            `;
        });
    } else if (typeof data === "object" && data !== null) {
        if (data.Roadmap && Array.isArray(data.Roadmap)) {
            data.Roadmap.forEach((stepItem, idx) => {
                let title = stepItem.title || stepItem.Title || `Step ${idx + 1}`;
                let desc = stepItem.description || stepItem.Description || "";
                roadmapContent += `
                    <div style="margin-bottom: 15px; border-bottom: 1px solid #eee; padding-bottom: 10px;">
                        <h4 style="color: rgb(59, 8, 84); margin-bottom: 5px;">Step ${stepItem.step || (idx + 1)}: ${title}</h4>
                        <p style="margin: 0; color: #555; font-size: 14px;">${desc}</p>
                    </div>
                `;
            });
        } else {
            Object.keys(data).forEach((key, index) => {
                roadmapContent += `
                    <div style="margin-bottom: 15px; border-bottom: 1px solid #eee; padding-bottom: 10px;">
                        <h4 style="color: rgb(59, 8, 84); margin-bottom: 5px;">${key.replace(/_/g, " ")}</h4>
                        <p style="margin: 0; color: #555; font-size: 14px;">${data[key]}</p>
                    </div>
                `;
            });
        }
    } else if (typeof data === "string") {
        roadmapContent = `<p style="white-space: pre-line; color: #555; font-size: 14px;">${data}</p>`;
    }

    if (!roadmapContent) {
        roadmapContent = "<p>No roadmap could be extracted. Response successfully received.</p>";
    }

    const contentHTML = `
        <h2 style="color: rgb(59, 8, 84); margin-bottom: 20px; font-size: 22px;">Your Learning Roadmap</h2>
        <div style="text-align: left; max-height: 60vh; overflow-y: auto; padding-right: 5px;">
            ${roadmapContent}
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