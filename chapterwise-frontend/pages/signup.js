import Header from "@/components/Header.js";
import Footer from "@/components/Footer.js";
import Head from "next/head";
import { useState } from "react";
import { useRouter } from "next/router";

export default function SignupPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [name, setName] = useState("");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);

  const router = useRouter();

  const isValidEmail = (email) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);

  const handleSignup = async () => {
    setMessage("");
    setLoading(true);

    if (password !== confirmPassword) {
      setMessage("Passwords do not match");
      setLoading(false);
      return;
    }

    if (!isValidEmail(email)) {
      setMessage("Please enter a valid email address");
      setLoading(false);
      return;
    }

    try {
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
        setTimeout(() => router.push("/login"), 2500);
      }
    } catch (err) {
      console.error(err);
      setMessage("Signup failed. Try again.");
    } finally {
      setLoading(false); // <-- stop loading
    }
  };

  return (
    <>
      <Head>
        <title>ChapterIQ - Contact</title>
        <meta name="description" content="Contact ChapterIQ team" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <main>
        <Header />
        <div className="Signup-container">
          <h1>Signup</h1>

          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleSignup();
            }}
          >
            <label>
              Name
              <input value={name} onChange={(e) => setName(e.target.value)} />
            </label>

            <label>
              Email
              <input value={email} onChange={(e) => setEmail(e.target.value)} />
            </label>

            <label>
              Password
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </label>

            <label>
              Confirm Password
              <input
                type="password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
              />
            </label>

            {message && (
              <p
                className={`message ${message.includes("successful") ? "success" : ""}`}
              >
                {message}
              </p>
            )}

            <button type="submit" disabled={loading}>
              {loading ? "Signing up..." : "Sign up"}
            </button>
          </form>
          <p className="terms-note">
            By signing up, you agree to our{" "}
            <a href="/terms-privacy" target="_blank">
              Terms of Service
            </a>{" "}
            and{" "}
            <a href="/terms-privacy#privacy-policy" target="_blank">
              Privacy Policy
            </a>
            .
          </p>
        </div>
      </main>
      <Footer />
    </>
  );
}
