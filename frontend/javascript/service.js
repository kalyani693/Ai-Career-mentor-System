


export async function apiRequest(url, options = {}) {
    const token = localStorage.getItem("access_token");

    const headers = {
        ...options.headers,
        "Authorization": `Bearer ${token}`
    };

    const response = await fetch(url, {
        ...options,
        headers: headers
    });

    if (response.status === 401) {
        localStorage.removeItem("access_token");
        // window.location.href = "/index.html";
    }

    return response;
}

export function saveToken(token) {
    localStorage.setItem("access_token", token);
}

export function getToken() {
    return localStorage.getItem("access_token");
}

export function logout() {
    localStorage.removeItem("access_token");
    // window.location.href = "/index.html";
}