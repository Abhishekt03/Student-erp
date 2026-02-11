async function login() {

    const email = document.getElementById("email").value;
    const password = document.getElementById("password").value;

    try {
        const response = await fetch(
            "/api/auth/login",
            {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({
                    email: email,
                    password: password
                })
            }
        );

        if (!response.ok) {
            document.getElementById("msg").innerText = "Invalid email or password";
            return;
        }

        const data = await response.json();

        localStorage.setItem("token", data.token);
        localStorage.setItem("role", data.role);

        if (data.role === "ROLE_STUDENT") {
            window.location.href = "/student/student-dashboard.html";
        } else if (data.role === "ROLE_TEACHER") {
            window.location.href = "/teacher/teacher-dashboard.html";
        } else if (data.role === "ROLE_ADMIN") {
            window.location.href = "/admin/admin-dashboard.html";
        }

    } catch (error) {
        console.error("Login error:", error);
        document.getElementById("msg").innerText = "Server not reachable";
    }
}
