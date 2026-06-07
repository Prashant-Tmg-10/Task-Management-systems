import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { registerUser } from "../api";

export default function Register() {
  const navigate = useNavigate();
  const [form, setForm] = useState({
    name: "",
    username: "",
    email: "",
    password: "",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  function updateField(event) {
    setForm((current) => ({ ...current, [event.target.name]: event.target.value }));
  }

  async function handleRegister(event) {
    event.preventDefault();
    setIsSubmitting(true);

    try {
      await registerUser(form);
      toast.success("Account created. Please login.");
      navigate("/login");
    } catch (error) {
      toast.error(error.message || "Registration failed");
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <form onSubmit={handleRegister} className="rounded-lg border border-[#d8e1dd] bg-white p-6 shadow-xl sm:p-8">
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-[#18202f]">Create Account</h2>
        <p className="mt-2 text-sm text-[#6b7584]">Register first, then login with your username.</p>
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <label className="block">
          <span className="mb-2 block text-sm font-semibold text-[#253044]">Name</span>
          <input
            name="name"
            value={form.name}
            onChange={updateField}
            required
            className="focus-ring w-full rounded-lg border border-[#cfd9d6] px-4 py-3"
            placeholder="Prashant"
          />
        </label>

        <label className="block">
          <span className="mb-2 block text-sm font-semibold text-[#253044]">Username</span>
          <input
            name="username"
            value={form.username}
            onChange={updateField}
            required
            className="focus-ring w-full rounded-lg border border-[#cfd9d6] px-4 py-3"
            placeholder="prashant"
          />
        </label>
      </div>

      <label className="mt-4 block">
        <span className="mb-2 block text-sm font-semibold text-[#253044]">Email</span>
        <input
          name="email"
          type="email"
          value={form.email}
          onChange={updateField}
          required
          className="focus-ring w-full rounded-lg border border-[#cfd9d6] px-4 py-3"
          placeholder="you@example.com"
        />
      </label>

      <label className="mt-4 block">
        <span className="mb-2 block text-sm font-semibold text-[#253044]">Password</span>
        <input
          name="password"
          type="password"
          value={form.password}
          onChange={updateField}
          required
          className="focus-ring w-full rounded-lg border border-[#cfd9d6] px-4 py-3"
          placeholder="Create a password"
        />
      </label>

      <button
        type="submit"
        disabled={isSubmitting}
        className="focus-ring mt-6 w-full rounded-lg bg-[#347065] px-4 py-3 font-bold text-white transition hover:bg-[#2b5d54] disabled:cursor-not-allowed disabled:opacity-60"
      >
        {isSubmitting ? "Creating account..." : "Create account"}
      </button>

      <p className="mt-5 text-center text-sm text-[#6b7584]">
        Already have an account?{" "}
        <Link to="/login" className="font-bold text-[#347065] hover:underline">
          Login
        </Link>
      </p>
    </form>
  );
}
