import Header from "@/components/Header.js";
import Footer from "@/components/Footer.js";
import Head from "next/head";
import { useState } from "react";
import { useRouter } from "next/router";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const router = useRouter();

  const login = async (e) => {
    e.preventDefault();
    setError("");

    const res = await fetch("http://localhost:5000/auth/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password }),
    });

    const data = await res.json();

    if (!res.ok) {
      setError(data.error);
      return;
    }

    localStorage.setItem("user", JSON.stringify(data));
    router.push("/app");
  };

  return (
    <>
      <Head>
        <title>ChapterWise - Login</title>
        <meta name="description" content="Contact ChapterWise team" />
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
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
      </label>

      <label>
        Password
        <input
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
      </label>

      {error && <p className="error">{error}</p>}

      <button type="submit">Login</button>
    </form>
  </div>
</div>

      </main>

      <Footer />
    </>
  );
}
