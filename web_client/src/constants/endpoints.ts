const endpoints = {
  BASE_URL: import.meta.env.VITE_BASE_URL || "http://localhost:4000",
  LOGIN: "auth/login",
  SIGN_UP: "auth/signup",
  TASKS: "/tasks",
};

export default endpoints;
