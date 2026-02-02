import Header from "@/components/Header.js";
import Footer from "@/components/Footer.js";
import Head from "next/head";
import { useState } from "react";
import { useRouter } from "next/router";

// import jwtDecode from "jwt-decode"; // optional, only if you need user info on the frontend

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  const login = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const res = await fetch("http://localhost:5000/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
        credentials: "include",
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.error);
        return;
      }

      // Optional: decode JWT to get user info
      // const user = jwtDecode(data.token);
      // console.log("Logged in user:", user);

      // Store only the JWT
      localStorage.setItem("token", data.token);
      localStorage.setItem(
        "user",
        JSON.stringify({
          id: data.id,
          name: data.name,
          email: data.email,
          subscribed: data.subscribed,
          subscribedAt: data.subscribedAt,
          subscribedUntil: data.subscribedUntil,
        }),
      );

      router.push("/app");
    } catch (err) {
      console.error("Login failed:", err);
      setError("Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Head>
        <title>ChapterIQ - Login</title>
        <meta name="description" content="Login to ChapterIQ" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <main>
        <Header />
        <div className="login-container">
          <div className="auth-card">
            <h1>Login</h1>
            <form onSubmit={login}>
              <label>
                Email
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </label>

              <label>
                Password
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
              </label>

              <p className="forgot-password">
  <a href="/forgot-password">Forgot password?</a>
</p>


              {error && <p className="error">{error}</p>}

              <button type="submit" disabled={loading}>
                {loading ? "Logging in..." : "Login"}
              </button>
            </form>
          </div>
        </div>
      </main>

      <Footer />
    </>
  );
}
