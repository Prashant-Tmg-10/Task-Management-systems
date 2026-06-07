import { Link } from "react-router-dom";

export default function Dashboard({ tasks = [], user }) {
  const completed = tasks.filter((task) => task.is_completed).length;
  const pending = tasks.length - completed;
  const completionRate = tasks.length ? Math.round((completed / tasks.length) * 100) : 0;
  const recentTasks = tasks.slice(-4).reverse();

  const stats = [
    { label: "Total tasks", value: tasks.length, accent: "text-[#347065]" },
    { label: "Completed", value: completed, accent: "text-[#2f855a]" },
    { label: "Pending", value: pending, accent: "text-[#b7791f]" },
    { label: "Progress", value: `${completionRate}%`, accent: "text-[#4c51bf]" },
  ];

  return (
    <div className="space-y-6">
      <section className="rounded-lg border border-[#d8e1dd] bg-white p-6 shadow-sm">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <p className="text-sm font-semibold uppercase tracking-[0.14em] text-[#347065]">Overview</p>
            <h1 className="mt-2 text-3xl font-bold text-[#18202f]">Welcome back, {user?.name || "friend"}</h1>
            <p className="mt-2 max-w-2xl text-sm leading-6 text-[#6b7584]">
              Your personal task workspace is ready. Add new work, mark progress, and keep your list focused.
            </p>
          </div>
          <Link
            to="/tasks"
            className="focus-ring inline-flex rounded-lg bg-[#347065] px-5 py-3 text-sm font-bold text-white transition hover:bg-[#2b5d54]"
          >
            Manage tasks
          </Link>
        </div>
      </section>

      <section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {stats.map((stat) => (
          <div key={stat.label} className="rounded-lg border border-[#d8e1dd] bg-white p-5 shadow-sm">
            <p className="text-sm font-semibold text-[#6b7584]">{stat.label}</p>
            <p className={`mt-3 text-3xl font-bold ${stat.accent}`}>{stat.value}</p>
          </div>
        ))}
      </section>

      <section className="grid gap-6 lg:grid-cols-[1fr_0.8fr]">
        <div className="rounded-lg border border-[#d8e1dd] bg-white p-6 shadow-sm">
          <div className="mb-5 flex items-center justify-between gap-4">
            <h2 className="text-xl font-bold text-[#18202f]">Recent tasks</h2>
            <Link to="/tasks" className="text-sm font-bold text-[#347065] hover:underline">
              View all
            </Link>
          </div>

          {recentTasks.length ? (
            <div className="space-y-3">
              {recentTasks.map((task) => (
                <div key={task.id} className="rounded-lg border border-[#e1e7e5] bg-[#fbfcfc] p-4">
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <h3 className="font-bold text-[#253044]">{task.title}</h3>
                      <p className="mt-1 text-sm text-[#6b7584]">{task.description || "No description"}</p>
                    </div>
                    <span
                      className={`rounded-full px-3 py-1 text-xs font-bold ${
                        task.is_completed ? "bg-[#e3f5ec] text-[#2f855a]" : "bg-[#fff4d8] text-[#9a6a16]"
                      }`}
                    >
                      {task.is_completed ? "Done" : "Pending"}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="rounded-lg border border-dashed border-[#cfd9d6] p-6 text-center">
              <p className="text-sm font-semibold text-[#6b7584]">No tasks yet.</p>
              <Link to="/tasks" className="mt-3 inline-flex font-bold text-[#347065] hover:underline">
                Create your first task
              </Link>
            </div>
          )}
        </div>

        <div className="rounded-lg border border-[#d8e1dd] bg-white p-6 shadow-sm">
          <h2 className="text-xl font-bold text-[#18202f]">Progress</h2>
          <div className="mt-6 h-3 overflow-hidden rounded-full bg-[#edf2f1]">
            <div className="h-full rounded-full bg-[#347065]" style={{ width: `${completionRate}%` }} />
          </div>
          <p className="mt-4 text-sm leading-6 text-[#6b7584]">
            {completionRate}% of your tasks are completed. Keep the list small and clear for better focus.
          </p>
        </div>
      </section>
    </div>
  );
}
