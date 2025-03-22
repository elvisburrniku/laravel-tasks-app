<template>
    <div class="flex justify-center items-center mb-2">
        <h2 class="text-2xl">Implemented with ❤️ by Elvis for Coalition Technologies</h2>
    </div>
    <div class="flex gap-2">
        <project-list></project-list>
        <task-list></task-list>
    </div>
</template>
<script setup>
import ProjectList from "./ProjectList.vue";
import TaskList from "./TaskList.vue";
import { useProjectStore } from "../stores/useProjectStore";
import { onMounted } from "vue";
import { nextTick } from "vue";
const projectStore = useProjectStore();
onMounted(async () => {
    await nextTick();
    await projectStore.fetchProjects();
});
</script>
