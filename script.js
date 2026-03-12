const taskInput = document.getElementById("taskInput");
const addBtn = document.getElementById("addBtn");
const taskList = document.getElementById("taskList");
const themeToggle = document.getElementById('themeToggle');
const savedTasks = JSON.parse(localStorage.getItem('tasks')) || [];

savedTasks.forEach(task => {
    const li = createTaskElement(task.text, task.completed, task.color, task.time);
    taskList.appendChild(li);
});
updateCount();


if (localStorage.getItem('theme') === 'dark') {
    document.body.classList.add('dark-theme');
    themeToggle.textContent = "Light Mode";
}

function addTask() {
    const taskText = taskInput.value.trim();
    if (taskText === "") return alert("Please enter a task!");

    const li = createTaskElement(taskText);
    taskList.appendChild(li);

    taskInput.value = "";
    saveTasks();
    updateCount();
}

addBtn.addEventListener('click', addTask);

taskInput.addEventListener('keypress', function (e) {
    if (e.key === 'Enter') {
        addTask();
    }
});


themeToggle.addEventListener('click', () => {
    document.body.classList.toggle('dark-theme');

    const isDark = document.body.classList.contains('dark-theme');

    themeToggle.textContent = isDark ? "Light Mode" : "Dark Mode";

    localStorage.setItem('theme', isDark ? 'dark' : 'light');
});

function saveTasks() {
    const tasks = [];

    document.querySelectorAll('#taskList li').forEach(li => {
        const spanText = li.querySelector('.task-text');
        const timeText = li.querySelector('.timestamp');

        if (spanText) {

            const colorClasses = ['task-red', 'task-blue', 'task-green'];
            const activeColor = colorClasses.find(cls => li.classList.contains(cls)) || "";
        
        tasks.push ({
            text: spanText.textContent,
            completed: li.classList.contains('completed'),
            color: activeColor,
            time: timeText ? timeText.textContent : ""
        });
        }  
    });

    localStorage.setItem('tasks', JSON.stringify(tasks))
}

function updateCount() {
    const countElement = document.getElementById('taskCount');
    const allTasks = document.querySelectorAll('#taskList li');
    const activeTasks = Array.from(allTasks).filter(li => !li.classList.contains('completed'));
    const count = activeTasks.length;

    if (allTasks.length === 0) {
        countElement.textContent = "No tasks yet!";
    } else if (count === 0) {
        countElement.textContent = "All caught up!";
    } else {
        countElement.textContent = `${count} ${count === 1 ? 'task' : 'tasks'} remaining`;
    }
}

const clearBtn = document.getElementById("clearAll");

clearBtn.addEventListener('click', () => {

    if (confirm("Are you sure you want to delete ALL tasks?")) {

    const allTasks = document.querySelectorAll('#taskList li');

    allTasks.forEach(li => li.remove());

    saveTasks();
    updateCount();
    }   
})

function createTaskElement(taskText, isCompleted = false, taskColor = "", timestamp = "") {
    const li = document.createElement("li");
    if (isCompleted) li.classList.add('completed');
    if (taskColor) li.classList.add(taskColor);

    const time = timestamp || new Date().toLocaleString([], {
        month: 'short',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
    });

    li.innerHTML = `
    <div class="task-main" style="display: flex; width: 100%; align-items: center; justify-content: space-between;">
        <div class="color-palette">
            <div class="color-dot color-default" data-color=""></div>
            <div class="color-dot color-red" data-color="task-red"></div>
            <div class="color-dot color-blue" data-color="task-blue"></div>
            <div class="color-dot color-green" data-color="task-green"></div>
        </div>
        <span class="task-text">${taskText}</span>
        <button class="delete-btn">Delete</button>
    </div>
    <div class="task-footer">
        <span class="timestamp">${time}</span>
    </div>
    `;

    li.querySelectorAll('.color-dot').forEach(dot => {
        dot.addEventListener('click', (e) => {
            e.stopPropagation();
            li.classList.remove('task-red', 'task-blue', 'task-green', 'task-yellow');

            const colorClass =dot.getAttribute('data-color');
            if (colorClass) li.classList.add(colorClass);
            saveTasks();
        })
    })

const span = li.querySelector('.task-text');

    span.addEventListener('click', () => {
        li.classList.toggle('completed');
        saveTasks();
        updateCount();
    });

    span.addEventListener('dblclick', () => {
        const input = document.createElement('input');
        input.type = 'text';
        input.value = span.textContent;
        input.classList.add('edit-input');

        li.insertBefore(input, span);
        span.style.display = 'none';
        input.focus();

        const saveEdit = () => {
            const newText = input.value.trim();
            if (newText !== "") {
                span.textContent = newText;
            }
            span.style.display = "";
            input.remove();
            saveTasks();
        };

        input.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') saveEdit();
        });

        input.addEventListener('blur', saveEdit);
    });

    const deleteBtn = li.querySelector('.delete-btn');
    deleteBtn.addEventListener('click', (e) => {
        e.stopPropagation();
        li.style.opacity = '0';
        li.style.transform = 'scale(0.9)';
        li.style.transition = 'all 0.2s ease';

        setTimeout(() => {
            li.remove();
            saveTasks();
            updateCount();
        }, 200);
    });
    return li;

}
