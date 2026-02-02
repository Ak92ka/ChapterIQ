import Header from "@/components/Header";
import Footer from "@/components/Footer";
import Head from "next/head";
import { useEffect, useState } from "react";

export default function Account() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // ---------------- Fetch latest user info ----------------
  const refreshUser = async () => {
    const savedToken = localStorage.getItem("token");
    if (!savedToken) {
      setLoading(false);
      return;
    }

    try {
      const res = await fetch("http://localhost:5000/api/me", {
  credentials: "include", // this sends your cookie
});


      if (!res.ok) {
        console.error("Failed to fetch user:", res.statusText);
        setUser(null);
        setLoading(false);
        return;
      }

      const updatedUser = await res.json();
      localStorage.setItem("user", JSON.stringify(updatedUser));
      setUser(updatedUser);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  // ---------------- Handle Stripe Checkout ----------------
  const handleSubscribe = async () => {
    const savedUser = JSON.parse(localStorage.getItem("user"));
    const savedToken = localStorage.getItem("token");
    if (!savedUser || !savedToken) return alert("Please log in first.");

    const priceId = "price_monthly_id"; // replace with your Stripe price IDs

    try {
      const res = await fetch("http://localhost:5000/api/create-checkout-session", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${savedToken}`,
        },
        body: JSON.stringify({ userId: savedUser.id, priceId }),
      });

      const data = await res.json();
      if (data.url) {
        window.location.href = data.url;
      } else {
        alert("Failed to start checkout.");
      }
    } catch (err) {
      console.error(err);
      alert("Failed to start checkout.");
    }
  };

  // ---------------- On mount ----------------
  useEffect(() => {
    refreshUser();
  }, []);

  const formatDate = (dateStr) => {
    if (!dateStr) return "-";
    const d = new Date(dateStr);
    if (isNaN(d)) return "-";
    return d.toLocaleDateString();
  };

  if (loading) {
    return (
      <>
        <Head>
          <title>Account</title>
        </Head>
        <Header />
        <div className="account-container">
          <h2>Loading account info...</h2>
        </div>
        <Footer />
      </>
    );
  }

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
        <title>ChapterIQ</title>
      </Head>
      <Header />

      <div className="account-container">
        <h1>Account</h1>

        <div className="account-card">
          <p><strong>Name:</strong> {user.name}</p>
          <p><strong>Email:</strong> {user.email}</p>

{isSubscribed ? (
  <>
    <p><strong>Status:</strong> Subscribed</p>
    <p><strong>Plan:</strong> {user.planName} ({user.planPrice})</p>
    <p><strong>Billing interval:</strong> {user.billingInterval}</p>
    <p><strong>Subscribed from:</strong> {formatDate(user.subscribedAt)}</p>
    <p><strong>Subscribed until:</strong> {formatDate(user.subscribedUntil)}</p>

    {user.cancelAtPeriodEnd ? (
      // Subscription is canceled, allow Reactivate only
      <button
        className="reactivate-btn"
        onClick={async () => {
          const confirmReactivate = window.confirm(
            "This will reactivate your subscription and continue auto-renewal. Proceed?"
          );
          if (!confirmReactivate) return;

          const token = localStorage.getItem("token");
          try {
            await fetch("http://localhost:5000/api/reactivate-subscription", {
              method: "POST",
              headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${token}`,
              },
              body: JSON.stringify({ userId: user.id }),
            });
            refreshUser();
          } catch (err) {
            console.error(err);
          }
        }}
      >
        Reactivate
      </button>
    ) : (
      // Subscription is active, allow Cancel Renewal only
      <button
        className="cancel-btn"
        onClick={async () => {
          const confirmCancel = window.confirm(
            "Canceling will stop auto-renewal. You will retain access until the end of the current billing period. No refunds will be issued. Proceed?"
          );
          if (!confirmCancel) return;

          const token = localStorage.getItem("token");
          try {
            await fetch("http://localhost:5000/api/cancel-subscription", {
              method: "POST",
              headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${token}`,
              },
              body: JSON.stringify({ userId: user.id }),
            });
            refreshUser();
          } catch (err) {
            console.error(err);
          }
        }}
      >
        Cancel Renewal
      </button>
    )}
  </>
) : (
  <button
    className="subscribe-btn"
    onClick={() => window.location.href = "/pricing"}
  >
    Subscribe
  </button>
)}




        </div>
      </div>

      <Footer />
    </>
  );
}
