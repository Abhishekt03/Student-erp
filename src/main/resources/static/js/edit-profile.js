const token = localStorage.getItem("token");
if (!token) location.href = "../login.html";

function changePassword() {
    const oldPassword = document.getElementById("oldPassword").value;
    const newPassword = document.getElementById("newPassword").value;
    const confirmPassword = document.getElementById("confirmPassword").value;

    if (newPassword !== confirmPassword) {
        alert("Passwords do not match");
        return;
    }

    fetch("http://localhost:8080/api/profile/change-password", {
        method: "POST",
        headers: {
            "Authorization": "Bearer " + token,
            "Content-Type": "application/json"
        },
        body: JSON.stringify({ oldPassword, newPassword })
    })
    .then(res => {
        if (!res.ok) throw new Error();
        return res.text();
    })
    .then(msg => alert(msg))
    .catch(() => alert("Password change failed"));
}



function goBack() {
    history.back();
}
