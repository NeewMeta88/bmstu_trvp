export default class AppModel {
    static async getTasklists() {
        try {
            const tasklistsResponse = await fetch('http://localhost:4321/tasklists');
            const tasklistsBody = await tasklistsResponse.json();

            if (tasklistsResponse.status !== 200) {
                return Promise.reject(tasklistsBody);
            }

            return tasklistsBody.tasklists;
        } catch (err) {
            return Promise.reject({
                timestamp: new Date().toISOString(),
                statusCode: 0,
                messageg: err.message
            });
        }
    }

    static async addTasklist({tasklistID, name, position = -1} = {tasklistID: null, name: '', position: -1}) {
        try {
            const addTasklistResponse = await fetch(
                'http://localhost:4321/tasklists',
                {
                    method: 'POST',
                    body: JSON.stringify({tasklistID, name, position}),
                    headers: {
                        'Content-Type': 'application/json'
                    }
                }
            );

            if (addTasklistResponse.status !== 200) {
                const addTasklistBody = await addTasklistResponse.json();
                return Promise.reject(addTasklistBody);
            }

            return {
                timestamp: new Date().toISOString(),
                message: `Список задач '${name}' был успешно добавлен в перечень списков`
            };
        } catch (err) {
            return Promise.reject({
                timestamp: new Date().toISOString(),
                statusCode: 0,
                message: err.message
            });
        }
    }

    static async addTask({taskID, text, position = -1, tasklistID} = {
        taskID: null,
        text: '',
        position: -1,
        tasklistID: null
    }) {
        try {
            const addTaskResponse = await fetch(
                'http://localhost:4321/tasks',
                {
                    method: 'POST',
                    body: JSON.stringify({taskID, text, position, tasklistID}),
                    headers: {
                        'Content-Type': 'application/json'
                    }
                }
            );
            if (addTaskResponse.status !== 200) {
                const addTaskBody = await addTaskResponse.json();
                return Promise.reject(addTaskBody);
            }

            return {
                timestamp: new Date().toISOString(),
                message: `Задача '${text}' была успешно добавлена в список задач`
            };
        } catch (err) {
            return Promise.reject({
                timestamp: new Date().toISOString(),
                statusCode: 0,
                message: err.message
            });
        }
    }

    static async updateTask({taskID, text, position = -1} = {taskID: null, text: '', position: -1}) {
        try {
            const updateTaskResponse = await fetch(
                `http://localhost:4321/tasks/${taskID}`,
                {
                    method: 'PATCH',
                    body: JSON.stringify({text, position}),
                    headers: {
                        'Content-Type': 'application/json'
                    }
                }
            );
            if (updateTaskResponse.status !== 200) {
                const updateTaskBody = await updateTaskResponse.json();
                return Promise.reject(updateTaskBody);
            }

            return {
                timestamp: new Date().toISOString(),
                message: `Параметры задачи '${text}' были успешно изменены`
            };
        } catch (err) {
            return Promise.reject({
                timestamp: new Date().toISOString(),
                statusCode: 0,
                message: err.message
            });
        }
    }

    static async updateTasks({reorderedTasks = []} = {reorderedTasks: []}) {
        try {
            const updateTasksResponse = await fetch(
                `http://localhost:4321/tasks`,
                {
                    method: 'PATCH',
                    body: JSON.stringify({reorderedTasks}),
                    headers: {
                        'Content-Type': 'application/json'
                    }
                }
            );
            if (updateTasksResponse.status !== 200) {
                const updateTasksBody = await updateTasksResponse.json();
                return Promise.reject(updateTasksBody);
            }

            return {
                timestamp: new Date().toISOString(),
                message: `Порядок задач в списке(ах) был успешно изменен`
            };
        } catch (err) {
            return Promise.reject({
                timestamp: new Date().toISOString(),
                statusCode: 0,
                message: err.message
            });
        }
    }

    static async deleteTask({taskID} = {taskID: null}) {
        try {
            const deleteTasksResponse = await fetch(
                `http://localhost:4321/tasks/${taskID}`,
                {
                    method: 'DELETE',
                }
            );
            if (deleteTasksResponse.status !== 200) {
                const deleteTasksBody = await deleteTasksResponse.json();
                return Promise.reject(deleteTasksBody);
            }

            return {
                timestamp: new Date().toISOString(),
                message: `Задача (ID = ${taskID}) была удалена из списка задач`
            };
        } catch (err) {
            return Promise.reject({
                timestamp: new Date().toISOString(),
                statusCode: 0,
                message: err.message
            });
        }
    }

    static async moveTask({taskID, srcTasklistID, destTasklistID} = {
        taskID: null,
        srcTasklistID: null,
        destTasklistID: null
    }) {
        try {
            const moveTaskResponse = await fetch(
                'http://localhost:4321/tasklists',
                {
                    method: 'PATCH',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({taskID, srcTasklistID, destTasklistID})
                }
            );

            if (moveTaskResponse.status !== 200) {
                const moveTaskBody = await moveTaskResponse.json();
                return Promise.reject(moveTaskBody);
            }

            return {
                timestamp: new Date().toISOString(),
                message: `Задача (ID = ${taskID}) была перемещена между списками`
            };
        } catch (err) {
            return Promise.reject({
                timestamp: new Date().toISOString(),
                statusCode: 0,
                message: err.message
            });
        }
    }
}