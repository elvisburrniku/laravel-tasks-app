<template>
    <div class="w-full max-w-lg bg-white shadow-lg rounded-lg p-6">
        <div class="flex justify-end gap-2 mb-4">
            <input
                v-model="newProject.name"
                @keyup.enter="addOrUpdateProject"
                :placeholder="selectedProject ? 'Edit project' : 'Add new project'"
                class="w-full p-2 border rounded"
            />
            <button
                @click="addOrUpdateProject()"
                class="px-3 py-2 bg-blue-500 text-white rounded"
            >
                {{ selectedProject ? 'Update' : 'Save' }}
            </button>
        </div>
        <ul ref="projectList" class="space-y-2">
            {{
                projects
            }}
            <li
                v-for="project in projectStore.projects"
                :key="project.id"
                @click="selectProject(project)"
                :class="{
                    'border border-red-200': selectedProject?.id === project.id,
                }"
                class="p-3 bg-white rounded shadow flex justify-between items-center cursor-grab"
            >
                <span>{{ project.name }}</span>
                <button
                    @click="deleteProject(project.id)"
                    class="px-2 py-1 bg-red-500 text-white rounded"
                >
                    X
                </button>
            </li>
        </ul>
    </div>
</template>

<script>
import { ref, onMounted, nextTick } from "vue";
import Sortable from "sortablejs";
import { useProjectStore } from "../stores/useProjectStore";

export default {
    setup() {
        const projectStore = useProjectStore();
        const newProject = ref({ name: ''});
        const projectList = ref(null);
        const selectedProject = ref(null);

        const addNewProject = async () => {
            if (!newProject.value) return;
            await projectStore.addProject(newProject.value);
            newProject.value = { name: ''};
            initSortable();
        };


        const editProject = async () => {
            if (!newProject.value) return;
            await projectStore.editProject(newProject.value);
            newProject.value = { name: ''};
            selectedProject.value = null;
            initSortable();
        };

        const addOrUpdateProject = async () => {
            if (selectedProject.value) {
                return editProject();
            }

            return addNewProject();
        };

        const deleteProject = async (id) => {
            await projectStore.removeProject(id);
        };

        const selectProject = async (project) => {
            if (selectedProject.value && selectedProject.value == project) {
                newProject.value = { name: ''};
                return (selectedProject.value = null);
            }
            selectedProject.value = project;
            newProject.value = project;
        };

        const initSortable = () => {
            nextTick(() => {
                if (projectList.value) {
                    new Sortable(projectList.value, {
                        animation: 150,
                        onEnd: async (evt) => {
                            const updatedProjects = [...projectStore.projects];
                            const movedProject = updatedProjects.splice(
                                evt.oldIndex,
                                1
                            )[0];
                            updatedProjects.splice(
                                evt.newIndex,
                                0,
                                movedProject
                            );

                            await projectStore.reorderProjects(updatedProjects);
                        },
                    });
                }
            });
        };

        onMounted(async () => {
            initSortable();
        });

        return {
            projectStore,
            newProject,
            projectList,
            addOrUpdateProject,
            deleteProject,
            selectProject,
            selectedProject,
        };
    },
};
</script>
