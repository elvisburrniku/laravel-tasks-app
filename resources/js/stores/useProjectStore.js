import { defineStore } from 'pinia';
import axios from 'axios';
import { useTaskStore } from './useTaskStore';

export const useProjectStore = defineStore('projects', {
    state: () => ({
        projects: []
    }),
    actions: {
        async fetchProjects() {
            try {
                const response = await axios.get('/projects');
                this.projects = [...response.data];
            } catch (error) {
                console.error('Failed to fetch projects:', error);
            }
        },
        async addProject(newProject) {
            try {
                const response = await axios.post('/projects', newProject);
                this.projects.push(response.data);
            } catch (error) {
                console.error('Failed to add project:', error);
            }
        },

        async editProject(updatedProject) {
            try {
                const response = await axios.put(`/projects/${updatedProject.id}`, updatedProject);

                const index = this.projects.findIndex(project => project.id === updatedProject.id);
                if (index !== -1) {
                    this.projects[index] = response.data;
                }
                const taskStore = useTaskStore();
                console.log(taskStore.tasks);
                taskStore.tasks = taskStore.tasks.map(task => {
                    if (task.project_id === updatedProject.id) {
                        task.project = updatedProject;
                    }
                    return task;
                });
            } catch (error) {
                console.error('Failed to edit project:', error);
            }
        },

        async removeProject(projectId) {
            try {
                await axios.delete(`/projects/${projectId}`);
                this.projects = this.projects.filter(project => project.id !== projectId); 
            } catch (error) {
                console.error('Failed to remove project:', error);
            }
        },
        async reorderProjects(updatedProjects) {
            try {
                await axios.post('/projects/reorder', { projects: updatedProjects });
                this.projects = updatedProjects;
            } catch (error) {
                console.error('Failed to reorder projects:', error);
            }
        }
    }
});