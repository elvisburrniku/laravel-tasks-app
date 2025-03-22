import { defineStore } from 'pinia';
import axios from 'axios';

export const useTaskStore = defineStore('tasks', {
    state: () => ({
        tasks: []
    }),
    actions: {
        async fetchTasks() {
            try {
                const response = await axios.get('/tasks');
                this.tasks = [...response.data];
            } catch (error) {
                console.error('Failed to fetch tasks:', error);
            }
        },
        async addTask(newTask) {
            try {
                const response = await axios.post('/tasks', {
                    name: newTask.name,
                    project_id: newTask.project_id
                });
                this.tasks.push(response.data);
            } catch (error) {
                console.error('Failed to add task:', error);
            }
        },

        async editTask(updatedTask) {
            try {
                const response = await axios.put(`/tasks/${updatedTask.id}`, {
                    name: updatedTask.name,
                    project_id: updatedTask.project_id
                });
                const index = this.tasks.findIndex(task => task.id === updatedTask.id);
                if (index !== -1) {
                    this.tasks[index] = response.data;
                }
            } catch (error) {
                console.error('Failed to edit task:', error);
            }
        },

        async deleteTask(taskId) {
            try {
                await axios.delete(`/tasks/${taskId}`);
                this.tasks = this.tasks.filter(task => task.id !== taskId);
            } catch (error) {
                console.error('Failed to delete task:', error);
            }
        },
        async reorderTasks(updatedTasks) {
            try {
                await axios.post('/tasks/reorder', { tasks: updatedTasks });
                this.tasks = updatedTasks;
            } catch (error) {
                console.error('Failed to reorder tasks:', error);
            }
        }
    }
});
