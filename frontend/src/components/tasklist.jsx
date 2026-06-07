import { useMemo, useState } from "react";
import { toast } from "react-toastify";
import { addTask, deleteTask, updateTask } from "../api";

const emptyTask = {
  title: "",
  description: "",
  is_completed: false,
};

export default function TaskList({ tasks = [], refreshTasks }) {
  const [form, setForm] = useState(emptyTask);
  const [editingId, setEditingId] = useState(null);
  const [editingTask, setEditingTask] = useState(emptyTask);
  const [filter, setFilter] = useState("all");
  const [isSaving, setIsSaving] = useState(false);

  const filteredTasks = useMemo(() => {
    if (filter === "completed") return tasks.filter((task) => task.is_completed);
    if (filter === "pending") return tasks.filter((task) => !task.is_completed);
    return tasks;
  }, [filter, tasks]);

  function updateForm(event) {
    const { name, value } = event.target;
    setForm((current) => ({ ...current, [name]: value }));
  }

  function updateEditForm(event) {
    const { name, value } = event.target;
    setEditingTask((current) => ({ ...current, [name]: value }));
  }

  async function handleCreateTask(event) {
    event.preventDefault();

    if (!form.title.trim()) {
      toast.error("Task title is required");
      return;
    }

    setIsSaving(true);
    try {
      await addTask({
        title: form.title.trim(),
        description: form.description.trim(),
        is_completed: false,
      });
      setForm(emptyTask);
      await refreshTasks();
      toast.success("Task created");
    } catch (error) {
      toast.error(error.message || "Could not create task");
    } finally {
      setIsSaving(false);
    }
  }

  async function handleToggle(task) {
    try {
      await updateTask(task.id, {
        title: task.title,
        description: task.description || "",
        is_completed: !task.is_completed,
      });
      await refreshTasks();
    } catch (error) {
      toast.error(error.message || "Could not update task");
    }
  }

  function startEditing(task) {
    setEditingId(task.id);
    setEditingTask({
      title: task.title,
      description: task.description || "",
      is_completed: task.is_completed,
    });
  }

  async function saveEditing(event) {
    event.preventDefault();

    if (!editingTask.title.trim()) {
      toast.error("Task title is required");
      return;
    }

    setIsSaving(true);
    try {
      await updateTask(editingId, {
        title: editingTask.title.trim(),
        description: editingTask.description.trim(),
        is_completed: editingTask.is_completed,
      });
      setEditingId(null);
      setEditingTask(emptyTask);
      await refreshTasks();
      toast.success("Task updated");
    } catch (error) {
      toast.error(error.message || "Could not update task");
    } finally {
      setIsSaving(false);
    }
  }

  async function handleDelete(taskId) {
    try {
      await deleteTask(taskId);
      await refreshTasks();
      toast.success("Task deleted");
    } catch (error) {
      toast.error(error.message || "Could not delete task");
    }
  }

  return (
    <div className="grid gap-6 xl:grid-cols-[0.78fr_1.22fr]">
      <section className="rounded-lg border border-[#d8e1dd] bg-white p-6 shadow-sm">
        <h1 className="text-2xl font-bold text-[#18202f]">Create task</h1>
        <p className="mt-2 text-sm text-[#6b7584]">Add a task with a clear title and useful description.</p>

        <form onSubmit={handleCreateTask} className="mt-6 space-y-4">
          <label className="block">
            <span className="mb-2 block text-sm font-semibold text-[#253044]">Title</span>
            <input
              name="title"
              value={form.title}
              onChange={updateForm}
              className="focus-ring w-full rounded-lg border border-[#cfd9d6] px-4 py-3"
              placeholder="Finish backend integration"
            />
          </label>

          <label className="block">
            <span className="mb-2 block text-sm font-semibold text-[#253044]">Description</span>
            <textarea
              name="description"
              value={form.description}
              onChange={updateForm}
              rows="5"
              className="focus-ring w-full resize-none rounded-lg border border-[#cfd9d6] px-4 py-3"
              placeholder="Write the details here"
            />
          </label>

          <button
            type="submit"
            disabled={isSaving}
            className="focus-ring w-full rounded-lg bg-[#347065] px-4 py-3 font-bold text-white transition hover:bg-[#2b5d54] disabled:cursor-not-allowed disabled:opacity-60"
          >
            {isSaving ? "Saving..." : "Add task"}
          </button>
        </form>
      </section>

      <section className="rounded-lg border border-[#d8e1dd] bg-white p-6 shadow-sm">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h2 className="text-2xl font-bold text-[#18202f]">Your tasks</h2>
            <p className="mt-1 text-sm text-[#6b7584]">{filteredTasks.length} task shown</p>
          </div>

          <div className="inline-flex rounded-lg border border-[#cfd9d6] bg-[#f7faf9] p-1">
            {["all", "pending", "completed"].map((value) => (
              <button
                key={value}
                onClick={() => setFilter(value)}
                className={`focus-ring rounded-md px-3 py-2 text-sm font-bold capitalize ${
                  filter === value ? "bg-[#347065] text-white shadow-sm" : "text-[#5f6b7a]"
                }`}
              >
                {value}
              </button>
            ))}
          </div>
        </div>

        <div className="mt-6 space-y-3">
          {filteredTasks.length ? (
            filteredTasks.map((task) => (
              <article key={task.id} className="rounded-lg border border-[#e1e7e5] bg-[#fbfcfc] p-4">
                {editingId === task.id ? (
                  <form onSubmit={saveEditing} className="space-y-3">
                    <input
                      name="title"
                      value={editingTask.title}
                      onChange={updateEditForm}
                      className="focus-ring w-full rounded-lg border border-[#cfd9d6] px-4 py-3 font-semibold"
                    />
                    <textarea
                      name="description"
                      value={editingTask.description}
                      onChange={updateEditForm}
                      rows="3"
                      className="focus-ring w-full resize-none rounded-lg border border-[#cfd9d6] px-4 py-3"
                    />
                    <label className="flex items-center gap-2 text-sm font-semibold text-[#253044]">
                      <input
                        type="checkbox"
                        checked={editingTask.is_completed}
                        onChange={(event) =>
                          setEditingTask((current) => ({ ...current, is_completed: event.target.checked }))
                        }
                        className="h-4 w-4 accent-[#347065]"
                      />
                      Completed
                    </label>
                    <div className="flex flex-wrap gap-2">
                      <button
                        type="submit"
                        disabled={isSaving}
                        className="focus-ring rounded-lg bg-[#347065] px-4 py-2 text-sm font-bold text-white"
                      >
                        Save
                      </button>
                      <button
                        type="button"
                        onClick={() => setEditingId(null)}
                        className="focus-ring rounded-lg border border-[#cfd9d6] px-4 py-2 text-sm font-bold text-[#5f6b7a]"
                      >
                        Cancel
                      </button>
                    </div>
                  </form>
                ) : (
                  <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
                    <div className="flex gap-3">
                      <input
                        type="checkbox"
                        checked={task.is_completed}
                        onChange={() => handleToggle(task)}
                        className="mt-1 h-5 w-5 accent-[#347065]"
                      />
                      <div>
                        <h3
                          className={`text-base font-bold ${
                            task.is_completed ? "text-[#8a95a3] line-through" : "text-[#253044]"
                          }`}
                        >
                          {task.title}
                        </h3>
                        <p className="mt-1 text-sm leading-6 text-[#6b7584]">{task.description || "No description"}</p>
                      </div>
                    </div>
                    <div className="flex gap-2 sm:justify-end">
                      <button
                        onClick={() => startEditing(task)}
                        className="focus-ring rounded-lg border border-[#cfd9d6] px-3 py-2 text-sm font-bold text-[#253044] transition hover:bg-white"
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => handleDelete(task.id)}
                        className="focus-ring rounded-lg border border-[#f0b8b8] px-3 py-2 text-sm font-bold text-[#c84343] transition hover:bg-[#fff1f1]"
                      >
                        Delete
                      </button>
                    </div>
                  </div>
                )}
              </article>
            ))
          ) : (
            <div className="rounded-lg border border-dashed border-[#cfd9d6] p-8 text-center">
              <p className="font-bold text-[#253044]">No tasks found</p>
              <p className="mt-2 text-sm text-[#6b7584]">Create a new task or switch filters.</p>
            </div>
          )}
        </div>
      </section>
    </div>
  );
}
