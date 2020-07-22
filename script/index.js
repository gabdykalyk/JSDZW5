function renderTask(task) {
    return `
         <div class="tasks__item ${task.completed ? 'completed' : ''}" data-id="${task.id}">
                <div class="tasks__name">
                    ${task.title}
                </div>
                <div class="tasks__priority tasks__priority--${task.priority}">
                    ${task.priority} Priority
                </div>
                <div class="tasks__data">
                    ${task.date}
                </div>
                <div class="tasks__check">
                    <form  action="">
                        <label class="check">
                        <input class="check__item" type="checkbox" name="" ${task.completed ? 'checked' : ''}>
                        <div class="custom__check">
                            <div class="check__inner">

                            </div>
                        </div>
                        </label>
                    </form>
                </div>
                <div class="tasks__delete">
                    <a href="">
                        <svg class="delete" width="1em" height="1em" viewBox="0 0 16 16" class="bi bi-trash-fill" fill="currentColor"
                            xmlns="http://www.w3.org/2000/svg">
                            <path fill-rule="evenodd"
                                d="M2.5 1a1 1 0 0 0-1 1v1a1 1 0 0 0 1 1H3v9a2 2 0 0 0 2 2h6a2 2 0 0 0 2-2V4h.5a1 1 0 0 0 1-1V2a1 1 0 0 0-1-1H10a1 1 0 0 0-1-1H7a1 1 0 0 0-1 1H2.5zm3 4a.5.5 0 0 1 .5.5v7a.5.5 0 0 1-1 0v-7a.5.5 0 0 1 .5-.5zM8 5a.5.5 0 0 1 .5.5v7a.5.5 0 0 1-1 0v-7A.5.5 0 0 1 8 5zm3 .5a.5.5 0 0 0-1 0v7a.5.5 0 0 0 1 0v-7z" />
                        </svg>
                    </a>
                </div>
            </div>
    `;
}

function renderTasks(tasks) {
    const tasksToRender = [];

    for (let i = 0; i < tasks.length; i++) {
        const taskHTML = renderTask(tasks[i]);

        tasksToRender.push(taskHTML);
    }

    return tasksToRender.join('');
}

const todoApp = new ToDoList([
    new Task(
        'Standup meeting with the team @5pm',
        PRIORITIES.LOW,
        '2020-07-10'
    ),
    new Task(
        'Order pizza for Granny tonight',
        PRIORITIES.MEDIUM,
        '2020-07-10'
    ),
    new Task(
        'Design, Develop and Deploy Apps to Netlify for Clients',
        PRIORITIES.HIGH,
        '2020-07-10'
    )
]);

// cписок задач
const tasksList = document.querySelector('#tasks-list');

function updateTasksList(filterValue) {
    const stats = todoApp.getStats();

    for (let key in stats) {
        const statHTML = document.getElementById(`stats-${key}`);

        statHTML.querySelector('span').innerText = stats[key];
    }

    tasksList.innerHTML = renderTasks(todoApp.getTasksList(filterValue));
}

tasksList.addEventListener('click', function (event) {
    const idAttribute = 'data-id';

    if (event.target.getAttribute('data-action') === 'remove' || event.target.closest('[data-action="remove"]')) {
        event.preventDefault();

        const id = event.target.closest('[data-id]').getAttribute('data-id');

        todoApp.removeTask(id);
    } else {
        let id = event.target.getAttribute(idAttribute);

        if (!id) {
            id = event.target.closest('[data-id]').getAttribute(idAttribute);
        }

        todoApp.toggle(id);
    }

    updateTasksList(searchField.value);
});

updateTasksList();

// фильтр
const searchField = document.getElementById('search');

searchField.addEventListener('input', function () {
    updateTasksList(searchField.value);
});


// модальное окно

const modalTrigger = document.getElementById('new-task');

function popupHandler(selector) {
    const modal = document.querySelector(selector);

    const controls = {
        open() {
            modal.classList.add('open');
        },
        close() {
            modal.classList.remove('open');
        }
    };

    return controls;
}

const newTaskModal = popupHandler('#modal');

modalTrigger.addEventListener('click', function (event) {
    event.preventDefault();

    newTaskModal.open();
});

document.querySelector('.popup').addEventListener('click', newTaskModal.close);

document.querySelector('.task').addEventListener('click', e => e.stopPropagation());

document.querySelector('#clear').addEventListener('click', () => {
    todoApp.clear();

    updateTasksList(searchField.value);
});

const newTaskForm = document.querySelector('#new-task-form');
console.log(newTaskForm.elements)

newTaskForm.addEventListener('submit', function () {
    event.preventDefault();

    const formElements = newTaskForm.elements;

    todoApp.addTask(
        new Task(
            formElements.title.value,
            PRIORITIES[formElements.priority.value],
            formElements.date.value
        )
    );

    formElements.title.value = '';
    formElements.date.value = '';
    formElements.priority.value = 0;

    newTaskModal.close();
    updateTasksList(searchField.value);
});