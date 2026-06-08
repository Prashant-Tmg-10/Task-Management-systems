const API_URL =
  import.meta.env.VITE_API_URL ||
  "https://task-management-systems-ka10.onrender.com";

function getToken() {
  return localStorage.getItem("token");
}

async function request(path, options = {}) {
  try {
    const token = getToken();

    const headers = {
      "Content-Type": "application/json",
      ...(options.headers || {}),
    };

    if (token) {
      headers.Authorization = `Bearer ${token}`;
    }

    const response = await fetch(`${API_URL}${path}`, {
      ...options,
      headers,
    });

    // Handle no content response
    if (response.status === 204) {
      return null;
    }

    // Parse response safely
    let data;
    try {
      data = await response.json();
    } catch (err) {
      data = {};
    }

    // Handle errors properly
    if (!response.ok) {
      throw new Error(data.detail || "Request failed");
    }

    return data;
  } catch (error) {
    console.error("API Error:", error.message);
    throw error;
  }
}

/* =========================
   AUTH APIs
========================= */

export function loginUser(credentials) {
  return request("/user/login", {
    method: "POST",
    body: JSON.stringify(credentials),
  });
}

export function registerUser(user) {
  return request("/user/register", {
    method: "POST",
    body: JSON.stringify(user),
  });
}

export function checkAuth() {
  return request("/user/is_auth");
}

/* =========================
   TASK APIs
========================= */

export function getTasks() {
  return request("/tasks/all_tasks");
}

export function getTask(taskId) {
  return request(`/tasks/one_task/${taskId}`);
}

export function addTask(task) {
  return request("/tasks/create", {
    method: "POST",
    body: JSON.stringify(task),
  });
}

export function updateTask(taskId, task) {
  return request(`/tasks/update_task/${taskId}`, {
    method: "PUT",
    body: JSON.stringify(task),
  });
}

export function deleteTask(taskId) {
  return request(`/tasks/delete_task/${taskId}`, {
    method: "DELETE",
  });
}