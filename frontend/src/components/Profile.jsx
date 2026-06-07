export default function Profile({ user, tasks = [], onLogout }) {
  const completed = tasks.filter((task) => task.is_completed).length;

  return (
    <div className="grid gap-6 lg:grid-cols-[0.8fr_1.2fr]">
      <section className="rounded-lg border border-[#d8e1dd] bg-white p-6 shadow-sm">
        <div className="flex h-16 w-16 items-center justify-center rounded-lg bg-[#347065] text-2xl font-bold text-white">
          {(user?.name || user?.username || "U").slice(0, 1).toUpperCase()}
        </div>
        <h1 className="mt-5 text-2xl font-bold text-[#18202f]">{user?.name}</h1>
        <p className="mt-1 text-sm text-[#6b7584]">@{user?.username}</p>

        <div className="mt-6 space-y-4">
          <div>
            <p className="text-xs font-bold uppercase tracking-[0.14em] text-[#8a95a3]">Email</p>
            <p className="mt-1 break-all text-sm font-semibold text-[#253044]">{user?.email}</p>
          </div>
          <div>
            <p className="text-xs font-bold uppercase tracking-[0.14em] text-[#8a95a3]">User ID</p>
            <p className="mt-1 text-sm font-semibold text-[#253044]">{user?.id}</p>
          </div>
        </div>

        <button
          onClick={onLogout}
          className="focus-ring mt-8 w-full rounded-lg border border-[#c84343] px-4 py-3 text-sm font-bold text-[#c84343] transition hover:bg-[#fff1f1]"
        >
          Logout
        </button>
      </section>

      <section className="rounded-lg border border-[#d8e1dd] bg-white p-6 shadow-sm">
        <h2 className="text-xl font-bold text-[#18202f]">Account activity</h2>
        <div className="mt-5 grid gap-4 sm:grid-cols-3">
          <div className="rounded-lg bg-[#f7faf9] p-4">
            <p className="text-sm font-semibold text-[#6b7584]">Tasks</p>
            <p className="mt-2 text-2xl font-bold text-[#347065]">{tasks.length}</p>
          </div>
          <div className="rounded-lg bg-[#f7faf9] p-4">
            <p className="text-sm font-semibold text-[#6b7584]">Completed</p>
            <p className="mt-2 text-2xl font-bold text-[#2f855a]">{completed}</p>
          </div>
          <div className="rounded-lg bg-[#f7faf9] p-4">
            <p className="text-sm font-semibold text-[#6b7584]">Pending</p>
            <p className="mt-2 text-2xl font-bold text-[#b7791f]">{tasks.length - completed}</p>
          </div>
        </div>
      </section>
    </div>
  );
}
