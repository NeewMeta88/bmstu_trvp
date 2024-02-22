export default class Task {
    #taskID = '';
    #taskText = '';
    #taskPosition = -1;

    constructor({
                    taskID = null,
                    text,
                    position
                }) {
        this.#taskID = taskID || crypto.randomUUID();
        this.#taskText = text;
        this.#taskPosition = position;
    }

    get taskID() {
        return this.#taskID;
    }

    get taskText() {
        return this.#taskText;
    }

    set taskText(value) {
        if (typeof value === 'string') {
            this.#taskText = value;
        }
    }

    get taskPosition() {
        return this.#taskPosition;
    }

    set taskPosition(value) {
        if (typeof value === 'number' && value >= 0) {
            this.#taskPosition = value;
        }
    }

    render() {
        const liElement = document.createElement('li');
        liElement.classList.add('tasklist__tasks-list-item', 'task');
        liElement.setAttribute('id', this.#taskID);
        liElement.setAttribute('draggable', true);
        liElement.addEventListener('dragstart', (evt) => {
            evt.target.classList.add('task_selected');
            localStorage.setItem('movedTaskID', this.#taskID);
        });
        liElement.addEventListener('dragend', (evt) => evt.target.classList.remove('task_selected'));

        const span = document.createElement('span');
        span.classList.add('task__text');
        span.innerHTML = this.#taskText;
        liElement.appendChild(span);

        const controlsDiv = document.createElement('div');
        controlsDiv.classList.add('task__controls');

        const lowerRowDiv = document.createElement('div');
        lowerRowDiv.classList.add('task__controls-row');

        const editBtn = document.createElement('button');
        editBtn.setAttribute('type', 'button');
        editBtn.classList.add('task__contol-btn', 'edit-icon');
        editBtn.addEventListener('click', () => {
            localStorage.setItem('editTaskID', this.#taskID);
            document.getElementById('modal-edit-task').showModal();
        });
        lowerRowDiv.appendChild(editBtn);

        const deleteBtn = document.createElement('button');
        deleteBtn.setAttribute('type', 'button');
        deleteBtn.classList.add('task__contol-btn', 'delete-icon');
        deleteBtn.addEventListener('click', () => {
            localStorage.setItem('deleteTaskID', this.#taskID);

            const deleteTaskModal = document.getElementById('modal-delete-task');
            deleteTaskModal.querySelector('.app-modal__question')
                .innerHTML = `Задача '${this.#taskText}' будет удалена. Продолжить?`;
            deleteTaskModal.showModal();
        });
        lowerRowDiv.appendChild(deleteBtn);

        controlsDiv.appendChild(lowerRowDiv);

        liElement.appendChild(controlsDiv);

        return liElement;
    }
};
