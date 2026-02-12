// ===============================
// AUTH CHECK
// ===============================



// ===============================
// ADD COURSE
// ===============================
function addCourse() {
    const title = document.getElementById("courseTitle").value;
    const description = document.getElementById("courseDesc").value;

    if (!title || !description) return alert("Fill all fields");

    fetch("/api/teacher/courses", {
        method: "POST",
        headers: {
            "Authorization": "Bearer " + window.token,
            "Content-Type": "application/json"
        },
        body: JSON.stringify({ title, description })
    })
    .then(res => res.text())
    .then(msg => {
        alert(msg || "Course added");
        loadCourses();
        loadCourseList();
    })
    .catch(err => alert(err.message));
}

// ===============================
// COURSE LIST (UL)
// ===============================
function loadCourseList() {
    fetch("/api/teacher/courses", {
        headers: { "Authorization": "Bearer " + window.token }
    })
    .then(res => {
        if (res.status === 204) return [];
        if (!res.ok) throw new Error("403 Forbidden");
        return res.json();
    })
    .then(data => {
        const ul = document.getElementById("courseList");
        if (!ul) return;

        ul.innerHTML = "";
        if (!data.length) return ul.innerHTML = "<li>No courses</li>";

        data.forEach(c => {
            const li = document.createElement("li");
            li.textContent = c.title;
            ul.appendChild(li);
        });
    })
    .catch(err => alert(err.message));
}

// ===============================
// COURSE DROPDOWN
// ===============================
function loadCourses() {
    const select = document.getElementById("courseSelect");
    if (!select) return;

    fetch("/api/teacher/courses", {
        headers: { "Authorization": "Bearer " + window.token }
    })
    .then(res => {
        if (res.status === 204) return [];
        return res.json();
    })
    .then(data => {
        select.innerHTML = `<option value="">-- Select Course --</option>`;
        data.forEach(c => {
            select.innerHTML += `<option value="${c.id}">${c.title}</option>`;
        });
    });
}

// ===============================
// LOAD STUDENTS
// ===============================
function loadStudents() {
    const courseId = document.getElementById("courseSelect").value;
    if (!courseId) return;

    fetch(`/api/teacher/students?courseId=${courseId}`, {
        headers: { "Authorization": "Bearer " + window.token }
    })
    .then(res => res.json())
    .then(students => {
        const tbody = document.getElementById("studentTable");
        tbody.innerHTML = "";

        if (!students.length) {
            tbody.innerHTML = `<tr><td colspan="3">No students</td></tr>`;
            return;
        }

        students.forEach(s => {
            tbody.innerHTML += `
                <tr>
                    <td>${s.name}</td>
                    <td>${s.email}</td>
                    <td>
                        <button onclick="markAttendance(${s.id}, true)">Present</button>
                        <button onclick="markAttendance(${s.id}, false)">Absent</button>
                    </td>
                </tr>`;
        });
    });
}

// ===============================
// ATTENDANCE
// ===============================
function markAttendance(studentId, status) {
    const courseId = document.getElementById("courseSelect").value;
    if (!courseId) return alert("Select course");

    fetch(`/api/teacher/attendance?studentId=${studentId}&courseId=${courseId}&status=${status}`, {
        method: "POST",
        headers: { "Authorization": "Bearer " + window.token }
    })
    .then(res => res.text())
    .then(msg => alert(msg || "Attendance marked"));
}

// ===============================
// UPLOAD MARKS
// ===============================
function uploadMarks() {
    fetch("/api/teacher/marks", {
        method: "POST",
        headers: {
            "Authorization": "Bearer " + window.token,
            "Content-Type": "application/json"
        },
        body: JSON.stringify({
            studentId: document.getElementById("studentId").value,
            courseId: document.getElementById("course").value,
            internal: document.getElementById("internal").value,
            external: document.getElementById("external").value
        })
    })
    .then(res => res.text())
    .then(alert)
    .catch(err => alert(err.message));
}