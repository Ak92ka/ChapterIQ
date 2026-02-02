"use client";
import { useState } from "react";
import emailjs from "@emailjs/browser";
import Head from "next/head";
import Header from "@/components/Header.js";
import Footer from "@/components/Footer.js";

export default function ContactForm() {
  const [formData, setFormData] = useState({
    user_name: "",
    user_email: "",
    message: "",
    to_name: "ChapterIQ Team",
  });

  const [status, setStatus] = useState("");
  const [errors, setErrors] = useState({});

  // Handle input changes
  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    setErrors({ ...errors, [e.target.name]: "" }); // clear error on change
    setStatus("");
  };

  // Validate inputs
  const validate = () => {
    const newErrors = {};
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!formData.user_name.trim()) newErrors.user_name = "Name is required.";
    if (!formData.user_email.trim()) newErrors.user_email = "Email is required.";
    else if (!emailRegex.test(formData.user_email))
      newErrors.user_email = "Please enter a valid email address.";

    if (!formData.message.trim())
      newErrors.message = "Message is required.";
    else if (formData.message.trim().length < 10)
      newErrors.message = "Message is too short.";

    setErrors(newErrors);

    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setStatus("");

    if (!validate()) return;

    setStatus("Sending...");

    try {
      const result = await emailjs.send(
        "service_rpdgvlv",
        "template_bsk2k8k",
        formData,
        "DWEyILDMuBUmpx6ia"
      );

      console.log("Email sent:", result.text);
      setStatus("Message sent successfully!");
      setFormData({ user_name: "", user_email: "", message: "", to_name: "ChapterIQ Team" });
    } catch (error) {
      console.error("Email send error:", error);
      setStatus("Failed to send message. Try again later.");
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
        <div className="contact-container">
          <h1 className="contact-h1">Contact Us</h1>
          <form onSubmit={handleSubmit} className="contact-form">
            <div className="form-group">
              <input
                type="text"
                name="user_name"
                placeholder="Your Name"
                value={formData.user_name}
                onChange={handleChange}
              />
              {errors.user_name && <span className="error-message">{errors.user_name}</span>}
            </div>

            <div className="form-group">
              <input
                type="email"
                name="user_email"
                placeholder="Your Email"
                value={formData.user_email}
                onChange={handleChange}
              />
              {errors.user_email && <span className="error-message">{errors.user_email}</span>}
            </div>

            <div className="form-group">
              <textarea
                name="message"
                placeholder="Your Message"
                value={formData.message}
                onChange={handleChange}
              />
              {errors.message && <span className="error-message">{errors.message}</span>}
            </div>

            <button type="submit" className="submit-button">
              Send Message
            </button>
            {status && <p className={`status-message ${status.includes("successfully") ? "success" : "error-message"}`}>{status}</p>}
          </form>
        </div>
      </main>
      <Footer />
    </>
  );
}
