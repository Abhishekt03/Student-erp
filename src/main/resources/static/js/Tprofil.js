document.addEventListener("DOMContentLoaded", () => {
    loadProfile();
    loadPhoto();
});

function loadProfile() {
    fetch("/api/teacher/profile", {
        headers: {
            Authorization: "Bearer " + localStorage.getItem("token")
        }
    })
    .then(r => {
        if (!r.ok) throw new Error("Unauthorized");
        return r.json();
    })
    .then(d => {
        document.getElementById("userId").innerText = d.id;
        document.getElementById("name").innerText = d.name;
        document.getElementById("email").innerText = d.email;
        document.getElementById("role").innerText = d.role;
         document.getElementById("dob").innerText = d.dob;
          document.getElementById("phone").innerText = d.phone;
           document.getElementById("address").innerText = d.address;
        
    });
}
function openFilePicker() {
    document.getElementById("photoInput").click();
}
function loadPhoto() {
    fetch("/api/teacher/profile/photo", {
        headers: {
            Authorization: "Bearer " + localStorage.getItem("token")
        }
    })
    .then(r => r.blob())
    .then(b => {
        document.getElementById("profilePic").src = URL.createObjectURL(b);
    });
}
function uploadPhoto() {
    const fileInput = document.getElementById("photoInput");
    const file = fileInput.files[0];

    if (!file) return;

    const formData = new FormData();
    formData.append("photo", file);

    fetch("http://localhost:8080/api/teacher/profile/photo", {
        method: "POST",
        headers: {
            "Authorization": "Bearer " + localStorage.getItem("token")
        },
        body: formData
    })
        .then(res => {
            if (!res.ok) {
                throw new Error("Upload failed");
            }
            loadPhoto();
        })
        .catch(() => alert("Photo upload failed"));
}
