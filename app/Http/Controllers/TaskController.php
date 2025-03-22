<?php

namespace App\Http\Controllers;

use App\Http\Requests\TaskRequest;
use App\Models\Task;
use Illuminate\Http\Request;

class TaskController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        return Task::with('project')->orderBy('priority')->get();
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(TaskRequest $request)
    {
        $task = Task::create([
            'name' => $request->name,
            'project_id' => $request->project_id,
            'priority' => Task::count() + 1,
        ]);
        return response()->json($task->load('project'));
    }

    /**
     * Display the specified resource.
     */
    public function show(Task $task)
    {
        return response()->json($task->load('project'));
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(TaskRequest $request, Task $task)
    {
        $task->update(['name' => $request->name, 'project_id' => $request->project_id]);
        return response()->json($task->load('project'));
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(Task $task)
    {
        $task->delete();
        return response()->json(['message' => 'Task deleted']);
    }

    public function reorder(Request $request)
    {
        foreach ($request->tasks as $index => $task) {
            Task::where('id', $task['id'])->update(['priority' => $index + 1]);
        }
        return response()->json(['message' => 'Tasks reordered']);
    }
}
