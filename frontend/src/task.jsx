import { useMutation, useQueryClient } from "@tanstack/react-query";
import React, { useState } from "react";
import { Button } from "@/components/ui/button"
async function createTodo(newtask) {
  const response = await fetch("http://localhost:5000/api/tasks", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(newtask),
  });

  if (!response.ok) {
    throw new Error("Failed to create task");
  }

  return response.json();
}

function Task() {
  const [task, setTask] = useState("");
const queryClient= useQueryClient('')
  const mutation = useMutation({
    mutationFn: createTodo,

    onSuccess: () => {
  queryClient.invalidateQueries({queryKey: ['tasks']})
    },

    onError: (error) => {
      console.log(error.message);
    },
  });

  const handleTask = () => {
    if (!task.trim()) return;

    mutation.mutate({
      title: task,
      completed: false,
    });
  };

  return (
    <div>
      <input
        type="text"
        value={task}
        onChange={(e) => setTask(e.target.value)}
        placeholder="Enter task"
      />

      <button onClick={handleTask} disabled={mutation.isPending}>
        {mutation.isPending ? "Adding..." : "Add Task"}
      </button>
      <Button> add task </Button>
    </div>
  );
}

export default Task;