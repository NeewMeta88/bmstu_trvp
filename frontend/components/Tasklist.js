import AppModel from '../model/AppModel';
import Task from './Task';

export default class Tasklist {
    #tasks = [];
    #tasklistName = '';
    #tasklistID = null;
    #tasklistPosition = -1;

    constructor({
                    tasklistID = null,
                    name,
                    position,
                    onDropTaskInTasklist,
                    addNotification
                }) {
        this.#tasklistName = name;
        this.#tasklistID = tasklistID || crypto.randomUUID();
        this.#tasklistPosition = position;
        this.onDropTaskInTasklist = onDropTaskInTasklist;
        this.addNotification = addNotification;
    }

    get tasklistID() {
        return this.#tasklistID;
    }

    get tasklistPosition() {
        return this.#tasklistPosition;
    }


    pushTask = ({task}) => this.#tasks.push(task);

    getTaskById = ({taskID}) => this.#tasks.find(task => task.taskID === taskID);
    getTaskByIdN = ({n}) => this.#tasks.find(task => task.n === n);

    deleteTask = ({taskID}) => {
        const deleteTaskIndex = this.#tasks.findIndex(task => task.taskID === taskID);

        if (deleteTaskIndex === -1) return;

        const [deletedTask] = this.#tasks.splice(deleteTaskIndex, 1);

        return deletedTask;
    };

    reorderTasks = async () => {
        const orderedTasksIDs = Array.from(
            document.querySelector(`[id="${this.#tasklistID}"] .tasklist__tasks-list`).children,
            elem => elem.getAttribute('id')
        );

        const reorderedTasksInfo = [];

        orderedTasksIDs.forEach((taskID, position) => {
            const task = this.#tasks.find(task => task.taskID === taskID);
            if (task.taskPosition !== position) {
                task.taskPosition = position;
                reorderedTasksInfo.push({taskID, position});
            }
        });

        if (reorderedTasksInfo.length > 0) {
            try {
                await AppModel.updateTasks({reorderedTasks: reorderedTasksInfo});
            } catch (err) {
                this.addNotification({text: err.message, type: 'error'});
                console.error(err);
            }
        }
    };

    appendNewTask = async ({text}) => {
        try {
            if (this.getTaskByIdN === 0){
                console.log("PIZDA")
            }
            const taskID = crypto.randomUUID();

            const addTaskResult = await AppModel.addTask({
                taskID,
                text,
                position: this.#tasks.length,
                tasklistID: this.#tasklistID
            });

            this.addNewTaskLocal({
                taskID,
                text,
                position: this.#tasks.length
            });

            this.addNotification({text: addTaskResult.message, type: 'success'});
        } catch (err) {
            if (err.message === "Add task error: новая строка в отношении \"tasklists\" нарушает ограничение-проверку \"tasklists_n_check\""){
                err.message = "Работник не может выполнить больше заявок";
            }
            this.addNotification({text: err.message, type: 'error'});
            console.error(err);
        }
    };

    addNewTaskLocal = ({taskID = null, text, position}) => {
        const newTask = new Task({
            taskID,
            text,
            position
        });
        this.#tasks.push(newTask);

        const newTaskElement = newTask.render();
        document.querySelector(`[id="${this.#tasklistID}"] .tasklist__tasks-list`)
            .appendChild(newTaskElement);
    };

    render() {
        const liElement = document.createElement('li');
        liElement.classList.add(
            'tasklists-list__item',
            'tasklist'
        );
        liElement.setAttribute('id', this.#tasklistID);
        liElement.addEventListener(
            'dragstart',
            () => localStorage.setItem('srcTasklistID', this.#tasklistID)
        );
        liElement.addEventListener('drop', this.onDropTaskInTasklist);

        const h2Element = document.createElement('h2');
        h2Element.classList.add('tasklist__name');
        h2Element.innerHTML = this.#tasklistName;
        liElement.appendChild(h2Element);

        const innerUlElement = document.createElement('ul');
        innerUlElement.classList.add('tasklist__tasks-list');
        liElement.appendChild(innerUlElement);

        const button = document.createElement('button');
        button.setAttribute('type', 'button');
        button.classList.add('tasklist__add-task-btn');
        button.innerHTML = '&#10010; Добавить карточку';
        button.addEventListener('click', () => {
            localStorage.setItem('addTasklistID', this.#tasklistID);
            document.getElementById('modal-add-task').showModal();
        });
        liElement.appendChild(button);

        const adderElement = document.querySelector('.tasklist-adder');
        adderElement.parentElement.insertBefore(liElement, adderElement);
    }
};
