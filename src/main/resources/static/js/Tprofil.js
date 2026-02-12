// ===============================
// TEACHER PROFILE
// ===============================




document.addEventListener("DOMContentLoaded", () => {
    loadProfile();
    loadPhoto();
    loadCourses();
    loadCourseList();
});

function loadProfile() {
    fetch("/api/teacher/profile", {
        headers: {
            "Authorization": "Bearer " + window.token
        }
    })
    .then(res => {
        if (!res.ok) throw new Error("Unauthorized");
        return res.json();
    })
    .then(d => {
        document.getElementById("userId").innerText = d.id ?? "-";
        document.getElementById("name").innerText = d.name ?? "-";
        document.getElementById("email").innerText = d.email ?? "-";
        document.getElementById("role").innerText = d.role ?? "-";
        document.getElementById("dob").innerText = d.dob ?? "-";
        document.getElementById("phone").innerText = d.phone ?? "-";
        document.getElementById("address").innerText = d.address ?? "-";
    })
    .catch(() => {
        alert("Session expired. Login again.");
        window.location.href = "/login.html";
    });
}

// ===============================
// PHOTO
// ===============================
function openFilePicker() {
    document.getElementById("photoInput").click();
}

function loadPhoto() {
    fetch("/api/teacher/profile/photo", {
        headers: {
            "Authorization": "Bearer " + window.token
        }
    })
    .then(res => {
        if (!res.ok) throw new Error();
        return res.blob();
    })
    .then(blob => {
        document.getElementById("profilePic").src =
            URL.createObjectURL(blob);
    })
    .catch(() => console.warn("No profile photo"));
}

function uploadPhoto() {
    const file = document.getElementById("photoInput").files[0];
    if (!file) {
        alert("Select a file");
        return;
    }

    const formData = new FormData();
    formData.append("photo", file);

    fetch("/api/teacher/profile/photo", {
        method: "POST",
        headers: {
            "Authorization": "Bearer " + window.token
        },
        body: formData
    })
    .then(res => {
        if (!res.ok) throw new Error("Upload failed");
        alert("Photo uploaded");
        loadPhoto();
    })
    .catch(() => alert("Photo upload failed"));
}