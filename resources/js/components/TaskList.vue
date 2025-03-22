<template>
    <div class="w-full max-w-lg bg-white shadow-lg rounded-lg p-6">
        <div class="flex justify-end gap-2 mb-4">
            <input
                v-model="newTask.name"
                @keyup.enter="addOrEditTask"
                :placeholder="selectedTask ? 'Edit task' : 'Add new task'"
                class="w-full p-2 border rounded"
            />
            <select class="p-1 border rounded" v-model="newTask.project_id">
                <option value="null" selected>Projects</option>
                <option
                    v-for="project in projectStore.projects"
                    :key="project.id"
                    :value="project.id"
                >
                    {{ project.name }}
                </option>
            </select>
            <button
                @click="addOrEditTask"
                class="px-3 py-2 bg-blue-500 text-white rounded"
            >
                {{ selectedTask ? "Update" : "Save" }}
            </button>
        </div>
        <ul ref="taskList" class="space-y-2">
            <li
                v-for="task in taskStore.tasks"
                @click="selectTask(task)"
                :key="task.id"
                :class="{
                    'border border-red-200': selectedTask?.id === task.id,
                }"
                class="p-3 bg-white rounded shadow flex justify-between items-center cursor-grab"
            >
                <span
                    >{{ task.name }}
                    <span v-if="task.project">
                        <span
                            class="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-blue-100 text-blue-800"
                        >
                            {{ task.project.name }}
                            <button
                                type="button"
                                @click.prevent="removeProjectTask(task)"
                                class="ml-2 text-blue-500 hover:text-blue-700"
                            >
                                &times;
                            </button>
                        </span>
                    </span></span
                >
                <button
                    @click="deleteTask(task.id)"
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
import { useTaskStore } from "../stores/useTaskStore";
import { useProjectStore } from "../stores/useProjectStore";

export default {
    setup() {
        const taskStore = useTaskStore();
        const projectStore = useProjectStore();
        const taskList = ref(null);
        const selectedTask = ref(null);
        const newTask = ref({ name: "", project_id: null });

        const addTask = async () => {
            if (!newTask.value.name) return;
            await taskStore.addTask(newTask.value);
            newTask.value = { name: "", project_id: null };
            initSortable();
        };

        const editTask = async () => {
            if (!newTask.value.name) return alert("Please write task name!");
            await taskStore.editTask(newTask.value);
            newTask.value = { name: "", project_id: null };
            selectedTask.value = null;
            initSortable();
        };

        const selectTask = async (task) => {
            if (selectedTask.value && selectedTask.value == task) {
                newTask.value = { name: "", project_id: null };
                return (selectedTask.value = null);
            }
            selectedTask.value = task;
            newTask.value = task;
        };

        const addOrEditTask = async () => {
            if (selectedTask.value) {
                return editTask();
            }

            return addTask();
        };

        const removeProjectTask = async (task) => {
            newTask.value = { id: task.id, project_id: null, name: task.name };
            await editTask();
        };

        const deleteTask = async (id) => {
            await taskStore.deleteTask(id);
        };

        const initSortable = () => {
            nextTick(() => {
                new Sortable(taskList.value, {
                    onEnd: async (evt) => {
                        const updatedTasks = [...taskStore.tasks];
                        const movedTask = updatedTasks.splice(
                            evt.oldIndex,
                            1
                        )[0];
                        updatedTasks.splice(evt.newIndex, 0, movedTask);
                        taskStore.reorderTasks(updatedTasks);
                    },
                });
            });
        };

        onMounted(() => {
            taskStore.fetchTasks();
            projectStore.fetchProjects();
            initSortable();
        });

        return {
            taskStore,
            projectStore,
            newTask,
            taskList,
            addTask,
            deleteTask,
            selectedTask,
            selectTask,
            addOrEditTask,
            removeProjectTask,
        };
    },
};
</script>
