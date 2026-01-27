import Header from "@/components/Header";
import Footer from "@/components/Footer";
import Head from "next/head";
import { useEffect, useState } from "react";

export default function Account() {
  const [user, setUser] = useState(null);

  useEffect(() => {
    const savedUser = JSON.parse(localStorage.getItem("user"));
    if (savedUser) setUser(savedUser);
  }, []);

  const formatDate = (dateStr) => {
    const d = new Date(dateStr);
    return d.toLocaleDateString();
  };

  if (!user) {
    return (
      <>
        <Head>
          <title>Account</title>
        </Head>
        <Header />
        <div className="account-container">
          <h2>Please login to view your account</h2>
        </div>
        <Footer />
      </>
    );
  }

  const isSubscribed = user.subscribed;

  return (
    <>
      <Head>
        <title>Account</title>
      </Head>
      <Header />

      <div className="account-container">
        <h1>Account</h1>

        <div className="account-card">
          <p>
            <strong>Name:</strong> {user.name}
          </p>
          <p>
            <strong>Email:</strong> {user.email}
          </p>

          {isSubscribed ? (
            <>
              <p>
                <strong>Status:</strong> Subscribed
              </p>
              <p>
                <strong>Subscribed from:</strong> {formatDate(user.subscribedAt)}
              </p>
            </>
          ) : (
            <>
              <p>
                <strong>Status:</strong> Not subscribed
              </p>
              <button className="subscribe-btn">
                Subscribe (coming soon)
              </button>
            </>
          )}
        </div>
      </div>

      <Footer />
    </>
  );
}
