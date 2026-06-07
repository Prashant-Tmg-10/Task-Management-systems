import { useState } from "react";
import { Link } from "react-router-dom";
import { toast } from "react-toastify";
import { loginUser } from "../api";

export default function Login({ setToken }) {
  const [form, setForm] = useState({ username: "", password: "" });
  const [isSubmitting, setIsSubmitting] = useState(false);

  function updateField(event) {
    setForm((current) => ({ ...current, [event.target.name]: event.target.value }));
  }

  async function handleLogin(event) {
    event.preventDefault();
    setIsSubmitting(true);

    try {
      const data = await loginUser(form);
      localStorage.setItem("token", data.token);
      setToken(data.token);
      toast.success("Welcome back");
    } catch (error) {
      toast.error(error.message || "Login failed");
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <form onSubmit={handleLogin} className="rounded-lg border border-[#d8e1dd] bg-white p-6 shadow-xl sm:p-8">
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-[#18202f]">Login</h2>
        <p className="mt-2 text-sm text-[#6b7584]">Use your username and password.</p>
      </div>

      <label className="mb-4 block">
        <span className="mb-2 block text-sm font-semibold text-[#253044]">Username</span>
        <input
          name="username"
          value={form.username}
          onChange={updateField}
          required
          className="focus-ring w-full rounded-lg border border-[#cfd9d6] bg-white px-4 py-3 text-[#18202f]"
          placeholder="your_username"
        />
      </label>

      <label className="mb-5 block">
        <span className="mb-2 block text-sm font-semibold text-[#253044]">Password</span>
        <input
          name="password"
          type="password"
          value={form.password}
          onChange={updateField}
          required
          className="focus-ring w-full rounded-lg border border-[#cfd9d6] bg-white px-4 py-3 text-[#18202f]"
          placeholder="Your password"
        />
      </label>

      <button
        type="submit"
        disabled={isSubmitting}
        className="focus-ring w-full rounded-lg bg-[#347065] px-4 py-3 font-bold text-white transition hover:bg-[#2b5d54] disabled:cursor-not-allowed disabled:opacity-60"
      >
        {isSubmitting ? "Logging in..." : "Login"}
      </button>

      <p className="mt-5 text-center text-sm text-[#6b7584]">
        New here?{" "}
        <Link to="/register" className="font-bold text-[#347065] hover:underline">
          Create account
        </Link>
      </p>
    </form>
  );
}
