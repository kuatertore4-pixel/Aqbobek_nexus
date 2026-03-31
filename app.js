// 🔹 Пользователи
let users = JSON.parse(localStorage.getItem("users")) || [];
let schedule = JSON.parse(localStorage.getItem("schedule")) || [];
let grades = JSON.parse(localStorage.getItem("grades")) || [];

// 🔹 Язык
function chooseLang(lang){
    localStorage.setItem("lang", lang);
    window.location.href = "login.html";
}

// 🔹 Регистрация
function register(){
    let iin = document.getElementById("iin").value;
    let password = document.getElementById("password").value;
    let role = document.getElementById("role").value;
    let className = document.getElementById("className")?.value || "";

    if(iin.length !== 12){
        alert("ИИН 12 цифр!");
        return;
    }

    users.push({iin,password,role,className});
    localStorage.setItem("users", JSON.stringify(users));
    alert("Готово!");
}

// 🔹 Вход
function login(){
    let iin = document.getElementById("iin").value;
    let password = document.getElementById("password").value;
    let user = users.find(u=>u.iin===iin && u.password===password);

    if(!user){
        alert("Ошибка");
        return;
    }

    localStorage.setItem("currentUser", JSON.stringify(user));
    window.location.href = "dashboard.html";
}

// 🔹 Выход
function logout(){
    localStorage.removeItem("currentUser");
    window.location.href = "login.html";
}

// 🔹 Переход на панель по роли
function goToPanel(){
    let user = JSON.parse(localStorage.getItem("currentUser"));
    if(user.role==="admin") window.location.href="admin.html";
    if(user.role==="teacher") window.location.href="teacher.html";
    if(user.role==="student") window.location.href="student.html";
    if(user.role==="parent") window.location.href="parent.html";
}

// 🔹 Расписание
function addSchedule(){
    let lesson = document.getElementById("lesson")?.value || "";
    let time = document.getElementById("time")?.value || "";
    let teacher = document.getElementById("teacher")?.value || "";
    let className = document.getElementById("className")?.value || "";
    let room = document.getElementById("room")?.value || "";

    // проверка конфликтов
    let conflict = schedule.find(s=>s.time===time && s.className===className);
    if(conflict){
        alert("Конфликт!");
        return;
    }

    schedule.push({lesson,time,teacher,className,room});
    localStorage.setItem("schedule", JSON.stringify(schedule));
    renderSchedule();
}

// 🔹 Отрисовка расписания
function renderSchedule(){
    let list = document.getElementById("list");
    if(!list) return;
    list.innerHTML="";
    schedule.forEach(s=>{
        let li=document.createElement("li");
        li.innerText=`${s.time} | ${s.className} | ${s.lesson} | ${s.teacher} | ${s.room}`;
        list.appendChild(li);
    });
}

// 🔹 Загрузка для учеников
function loadScheduleUser(){
    let list = document.getElementById("schedule");
    let user = JSON.parse(localStorage.getItem("currentUser"));
    if(!list || !user) return;

    list.innerHTML="";
    schedule.filter(s=>s.className===user.className).forEach(s=>{
        let li=document.createElement("li");
        li.innerText=`${s.time} - ${s.lesson} (${s.teacher})`;
        list.appendChild(li);
    });
}

// 🔹 Загрузка оценок и AI советов
function loadStudentExtras(){
    let user = JSON.parse(localStorage.getItem("currentUser"));
    if(!user) return;

    let gradesList = document.getElementById("grades");
    let tipsList = document.getElementById("aiTips");

    if(gradesList){
        gradesList.innerHTML="";
        grades.filter(g=>g.studentIIN===user.iin).forEach(g=>{
            let li=document.createElement("li");
            li.innerText=`${g.subject}: ${g.grade}`;
            gradesList.appendChild(li);
        });
    }

    if(tipsList){
        tipsList.innerHTML="";
        schedule.filter(s=>s.className===user.className).forEach(s=>{
            let li=document.createElement("li");
            li.innerText=`Совет: повтори ${s.lesson} к ${s.time}`;
            tipsList.appendChild(li);
        });
    }
}

// 🔹 Загрузка при старте
window.onload = function(){
    renderSchedule();
    loadScheduleUser();
    loadStudentExtras();

    let user = JSON.parse(localStorage.getItem("currentUser"));
    let info = document.getElementById("info");
    if(info && user) info.innerText = `${user.role} | ${user.iin}`;
}
function addGrade(){
    let studentIIN = document.getElementById("studentIIN").value;
    let subject = document.getElementById("subject").value;
    let grade = document.getElementById("grade").value;

    if(!studentIIN || !subject || !grade){
        alert("Заполни все поля!");
        return;
    }

    grades.push({studentIIN, subject, grade});
    localStorage.setItem("grades", JSON.stringify(grades));
    alert("Оценка сохранена!");
}