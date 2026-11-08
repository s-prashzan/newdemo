import { createContext, useCallback, useContext, useEffect, useState } from "react";
import { API_URL } from "../api";

const AuthContext = createContext(null);

function loadAuth() {
  try {
    const saved = localStorage.getItem("auth");
    return saved ? JSON.parse(saved) : { token: null, user: null };
  } catch {
    return { token: null, user: null };
  }
}

export function AuthProvider({ children }) {
  const [auth, setAuth] = useState(loadAuth);

  useEffect(() => {
    try {
      localStorage.setItem("auth", JSON.stringify(auth));
    } catch {
      // storage blocked: login still works until the page is refreshed
    }
  }, [auth]);

  const logout = useCallback(() => setAuth({ token: null, user: null }), []);

  // fetch() that automatically adds the login token
  const authFetch = useCallback(
    (url, options = {}) => {
      const headers = { ...options.headers };
      if (auth.token) headers.Authorization = `Bearer ${auth.token}`;
      return fetch(url, { ...options, headers });
    },
    [auth.token]
  );

  // Log out automatically if the saved token has expired
  useEffect(() => {
    if (!auth.token) return;
    authFetch(`${API_URL}/auth/me`)
      .then(res => {
        if (res.status === 401 || res.status === 404) logout();
      })
      .catch(() => {}); // server offline: keep the user logged in
  }, [auth.token, authFetch, logout]);

  async function sendAuth(path, body) {
    const res = await fetch(`${API_URL}/auth/${path}`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.error || "Something went wrong");
    setAuth({ token: data.token, user: data.user });
    return data.user;
  }

  const login = (email, password) => sendAuth("login", { email, password });
  const register = (name, email, password) => sendAuth("register", { name, email, password });

  return (
    <AuthContext.Provider value={{ user: auth.user, login, register, logout, authFetch }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) throw new Error("useAuth must be used inside <AuthProvider>");
  return context;
}