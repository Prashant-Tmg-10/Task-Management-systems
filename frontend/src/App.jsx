import { useEffect, useMemo, useState } from "react";
import { BrowserRouter, NavLink, Navigate, Route, Routes, useNavigate } from "react-router-dom";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { checkAuth, getTasks } from "./api";
import Dashboard from "./components/dashboard";
import TaskList from "./components/tasklist";
import Profile from "./components/Profile";
import Login from "./components/login";
import Register from "./components/register";

function AuthLayout({ setToken }) {
  return (
    <div className="min-h-screen px-4 py-10 sm:px-6">
      <div className="mx-auto grid min-h-[calc(100vh-5rem)] max-w-6xl items-center gap-8 lg:grid-cols-[1.05fr_0.95fr]">
        <section className="space-y-6">
          <div className="inline-flex rounded-full border border-[#cbd8d3] bg-white/70 px-4 py-2 text-sm font-semibold text-[#347065] shadow-sm">
            Task Management System
          </div>
          <div className="space-y-4">
            <h1 className="max-w-2xl text-4xl font-bold tracking-normal text-[#18202f] sm:text-5xl">
              Plan your work, finish your tasks, and keep everything in one place.
            </h1>
            <p className="max-w-xl text-base leading-7 text-[#5f6b7a]">
              Sign in to manage your personal task list with protected FastAPI routes.
            </p>
          </div>
          <div className="grid max-w-2xl gap-3 sm:grid-cols-3">
            {["Protected account", "Private tasks", "Fast updates"].map((item) => (
              <div key={item} className="rounded-lg border border-[#d8e1dd] bg-white/80 p-4 shadow-sm">
                <p className="text-sm font-semibold text-[#253044]">{item}</p>
              </div>
            ))}
          </div>
        </section>

        <Routes>
          <Route path="/login" element={<Login setToken={setToken} />} />
          <Route path="/register" element={<Register />} />
          <Route path="*" element={<Navigate to="/login" replace />} />
        </Routes>
      </div>
    </div>
  );
}

function AppShell({ user, tasks, refreshTasks, setUser, setToken }) {
  const navigate = useNavigate();

  const navItems = [
    { to: "/", label: "Dashboard" },
    { to: "/tasks", label: "Tasks" },
    { to: "/profile", label: "Profile" },
  ];

  function handleLogout() {
    localStorage.removeItem("token");
    setToken(null);
    setUser(null);
    navigate("/login", { replace: true });
    toast.info("Logged out");
  }

  return (
    <div className="min-h-screen">
      <aside className="fixed inset-y-0 left-0 hidden w-72 border-r border-[#dbe3e0] bg-white/85 p-5 shadow-sm backdrop-blur lg:block">
        <div className="flex h-full flex-col">
          <div className="mb-8">
            <p className="text-sm font-semibold uppercase tracking-[0.14em] text-[#347065]">Task App</p>
            <h1 className="mt-2 text-2xl font-bold text-[#18202f]">Workspace</h1>
          </div>
          <nav className="space-y-2">
            {navItems.map((item) => (
              <NavLink
                key={item.to}
                to={item.to}
                className={({ isActive }) =>
                  `block rounded-lg px-4 py-3 text-sm font-semibold transition ${
                    isActive
                      ? "bg-[#347065] text-white shadow-sm"
                      : "text-[#5f6b7a] hover:bg-[#eef4f2] hover:text-[#253044]"
                  }`
                }
              >
                {item.label}
              </NavLink>
            ))}
          </nav>
          <div className="mt-auto rounded-lg border border-[#d8e1dd] bg-[#f7faf9] p-4">
            <p className="text-sm font-semibold text-[#253044]">{user?.name || user?.username}</p>
            <p className="mt-1 break-all text-xs text-[#6b7584]">{user?.email}</p>
            <button
              onClick={handleLogout}
              className="focus-ring mt-4 w-full rounded-lg bg-[#c84343] px-4 py-2 text-sm font-bold text-white transition hover:bg-[#a93636]"
            >
              Logout
            </button>
          </div>
        </div>
      </aside>

      <div className="lg:pl-72">
        <header className="sticky top-0 z-10 border-b border-[#dbe3e0] bg-white/85 px-4 py-4 backdrop-blur sm:px-6 lg:px-8">
          <div className="mx-auto flex max-w-6xl items-center justify-between gap-4">
            <div>
              <p className="text-sm font-semibold text-[#347065]">Hello, {user?.name || "there"}</p>
              <h2 className="text-xl font-bold text-[#18202f]">Task Management</h2>
            </div>
            <div className="flex gap-2 lg:hidden">
              {navItems.map((item) => (
                <NavLink
                  key={item.to}
                  to={item.to}
                  className={({ isActive }) =>
                    `rounded-lg px-3 py-2 text-sm font-semibold ${
                      isActive ? "bg-[#347065] text-white" : "bg-white text-[#5f6b7a]"
                    }`
                  }
                >
                  {item.label}
                </NavLink>
              ))}
            </div>
          </div>
        </header>

        <main className="mx-auto max-w-6xl px-4 py-6 sm:px-6 lg:px-8">
          <Routes>
            <Route path="/" element={<Dashboard tasks={tasks} user={user} />} />
            <Route path="/tasks" element={<TaskList tasks={tasks} refreshTasks={refreshTasks} />} />
            <Route path="/profile" element={<Profile user={user} tasks={tasks} onLogout={handleLogout} />} />
            <Route path="/login" element={<Navigate to="/" replace />} />
            <Route path="/register" element={<Navigate to="/" replace />} />
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </main>
      </div>
    </div>
  );
}

function App() {
  const [token, setToken] = useState(localStorage.getItem("token"));
  const [user, setUser] = useState(null);
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(Boolean(token));

  const isLoggedIn = useMemo(() => Boolean(token), [token]);

  async function refreshTasks() {
    const data = await getTasks();
    setTasks(Array.isArray(data) ? data : []);
  }

  useEffect(() => {
    async function loadSession() {
      if (!token) {
        setLoading(false);
        return;
      }

      try {
        const [userData, taskData] = await Promise.all([checkAuth(), getTasks()]);
        setUser(userData);
        setTasks(Array.isArray(taskData) ? taskData : []);
      } catch (error) {
        localStorage.removeItem("token");
        setToken(null);
        setUser(null);
        setTasks([]);
        toast.error(error.message || "Please login again");
      } finally {
        setLoading(false);
      }
    }

    loadSession();
  }, [token]);

  if (loading) {
    return (
      <div className="grid min-h-screen place-items-center px-4">
        <div className="rounded-lg border border-[#d8e1dd] bg-white p-6 text-center shadow-sm">
          <p className="text-sm font-semibold text-[#347065]">Loading your workspace...</p>
        </div>
      </div>
    );
  }

  return (
    <BrowserRouter>
      {isLoggedIn ? (
        <AppShell
          user={user}
          tasks={tasks}
          refreshTasks={refreshTasks}
          setUser={setUser}
          setToken={setToken}
        />
      ) : (
        <AuthLayout setToken={setToken} />
      )}
      <ToastContainer position="top-right" autoClose={2500} />
    </BrowserRouter>
  );
}

export default App;
