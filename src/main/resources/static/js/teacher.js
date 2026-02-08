const token = localStorage.getItem("token");

if (!token) {
    alert("Session expired. Please login again.");
    window.location.href = "../login.html";
}


// Fetch teacher courses
function addCourse() {
    fetch("http://localhost:8080/api/teacher/courses", {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            "Authorization": "Bearer " + token
        },
        body: JSON.stringify({
            title: document.getElementById("courseTitle").value,
            description: document.getElementById("courseDesc").value
        })
    })
    .then(res => res.json())
    .then(() => {
        alert("Course added");
        loadCourses();
    });
}
function loadCourseList() {
    fetch("http://localhost:8080/api/teacher/courses", {
        headers: {
            "Authorization": "Bearer " + localStorage.getItem("token")
        }
    })
    .then(res => {
        if (!res.ok) {
            throw new Error("403 Forbidden – Teacher access required");
        }
        return res.json();
    })
    .then(data => {
        const ul = document.getElementById("courseList");
        ul.innerHTML = "";

        data.forEach(c => {
            const li = document.createElement("li");
            li.textContent = c.title;
            ul.appendChild(li);
        });
    })
    .catch(err => {
        alert(err.message);
        console.error(err);
    });
}

/* Load students for selected course */


/* LOAD STUDENTS */
function loadStudents() {
    const courseId = document.getElementById("courseSelect").value;
    if (!courseId) return;

    fetch(`http://localhost:8080/api/teacher/students?courseId=${courseId}`, {
        headers: { "Authorization": "Bearer " + token }
    })
    .then(res => res.json())
    .then(students => {
        const tbody = document.getElementById("studentTable");
        tbody.innerHTML = "";

        if (students.length === 0) {
            tbody.innerHTML = `<tr><td colspan="3">No students enrolled</td></tr>`;
            return;
        }

        students.forEach(s => {
            const tr = document.createElement("tr");
            tr.innerHTML = `
                <td>${s.name}</td>
                <td>${s.email}</td>
                <td>
                    <button onclick="markAttendance(${s.id}, true)">Present</button>
                    <button onclick="markAttendance(${s.id}, false)">Absent</button>
                </td>
            `;
            tbody.appendChild(tr);
        });
    });
}

/* MARK ATTENDANCE */
function markAttendance(studentId, status) {

    const token = localStorage.getItem("token");

    const courseSelect = document.getElementById("courseSelect");

    if (!courseSelect) {
        alert("Course dropdown not found in HTML");
        console.error("courseSelect element missing");
        return;
    }

    const courseId = courseSelect.value;

    if (!courseId) {
        alert("Select course first");
        return;
    }

    fetch(
        `http://localhost:8080/api/teacher/attendance?studentId=${studentId}&courseId=${courseId}&status=${status}`,
        {
            method: "POST",
            headers: {
                "Authorization": "Bearer " + token
            }
        }
    )
    .then(res => {
        if (!res.ok) {
            return res.text().then(t => { throw new Error(t); });
        }
        return res.text();
    })
    .then(msg => {
        alert(msg);   // success
    })
    .catch(err => {
        alert("Error: " + err.message);
        console.error(err);
    });
}


function uploadMarks() {

    fetch("http://localhost:8080/api/teacher/marks", {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            "Authorization": "Bearer " + localStorage.getItem("token")
        },
        body: JSON.stringify({
            studentId: document.getElementById("studentId").value,
            courseId: document.getElementById("course").value,
            internal: document.getElementById("internal").value,
            external: document.getElementById("external").value
        })
    })
    .then(res => {
        if (!res.ok) throw new Error("Access denied or bad request");
        return res.text();
    })
    .then(alert)
    .catch(err => alert(err.message));
}
function loadCourses() {

    const courseSelect = document.getElementById("courseSelect");

    // ✅ EXIT if page doesn't have this dropdown
    if (!courseSelect) {
        console.warn("courseSelect not found — skipping loadCourses()");
        return;
    }

    const token = localStorage.getItem("token");

    fetch("http://localhost:8080/api/teacher/courses", {
        headers: {
            "Authorization": "Bearer " + token
        }
    })
    .then(res => res.json())
    .then(data => {
        console.log("Loaded courses:", data);

        courseSelect.innerHTML = `<option value="">-- Select Course --</option>`;

        data.forEach(c => {
            courseSelect.innerHTML += `
                <option value="${c.id}">${c.title}</option>
            `;
        });
    })
    .catch(err => console.error(err));
}



function addTimetable() {

    const courseId = document.getElementById("courseSelect").value;

    if (!courseId) {
        alert("Please select a course");
        return;
    }

    fetch("http://localhost:8080/api/teacher/timetable", {
        method: "POST",
        headers: {
            "Authorization": "Bearer " + localStorage.getItem("token"),
            "Content-Type": "application/x-www-form-urlencoded"
        },
        body: new URLSearchParams({
            courseId: courseId,
            day: document.getElementById("day").value,
            startTime: document.getElementById("startTime").value,
            endTime: document.getElementById("endTime").value,
            room: document.getElementById("room").value
        })
    })
    .then(res => res.text())
    .then(alert);
}
