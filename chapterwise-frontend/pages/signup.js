import Header from "@/components/Header.js";
import Footer from "@/components/Footer.js";
import Head from "next/head";
import { useState } from "react";

export default function SignupPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [message, setMessage] = useState("");

  const handleSignup = async () => {
    const res = await fetch("http://localhost:5000/auth/signup", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password, name }),
    });

    const data = await res.json();

    if (!res.ok) {
      setMessage(data.error);
    } else {
      setMessage("Signup successful 🎉");
    }
  };

  return (
    <>
          <Head>
            <title>ChapterWise - Contact</title>
            <meta name="description" content="Contact ChapterWise team" />
            <meta name="viewport" content="width=device-width, initial-scale=1" />
            <link rel="icon" href="/favicon.ico" />
          </Head>
          <main>
            <Header />
<div className="Signup-container">
  <h1>Signup</h1>

  <label>
    Name
    <input
      value={name}
      onChange={(e) => setName(e.target.value)}
    />
  </label>

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

  <button onClick={handleSignup}>Sign up</button>

  <p className="message">{message}</p>
</div>
    </main>
          <Footer />
        </>
  );
}
