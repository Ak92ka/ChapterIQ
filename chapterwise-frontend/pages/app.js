"use client";
import { useState, useRef, useEffect } from "react";
import Head from "next/head";
import Header from "@/components/Header.js";
import Footer from "@/components/Footer.js";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faArrowUpFromBracket } from "@fortawesome/free-solid-svg-icons";
import { faCopy as faCopyRegular } from "@fortawesome/free-regular-svg-icons";
import {
  faCopy as faCopySolid,
  faCheck,
} from "@fortawesome/free-solid-svg-icons";
import mammoth from "mammoth/mammoth.browser";
import JSZip from "jszip";
import { parseStringPromise } from "xml2js";


export default function App() {
  const [text, setText] = useState("");
  const [textareaActive, setTextareaActive] = useState(false);
  const [aiOutput, setAiOutput] = useState("");
  const [isAiOutput, setIsAiOutput] = useState(false);
  const [loading, setLoading] = useState(false);
  const [copied, setCopied] = useState(false);
  const generateButtonRef = useRef(null);
  const [uploaded, setUploaded] = useState(false);
  const successRef = useRef(null);

  const handleSummarize = async () => {
    if (!text.trim()) {
      setAiOutput("Please paste some text before generating notes.");
      setIsAiOutput(false); // not AI output
      return;
    }

    // Validation: maximum length (e.g., 50,000 characters)
    const minLength = 1000; // minimum characters for a chapter
    if (text.length < minLength) {
      setAiOutput(
        `Chapter is too short. Minimum length is ${minLength} characters.`
      );
      return;
    }

    // Validation: maximum length (e.g., 50,000 characters)
    const maxLength = 50000;
    if (text.length > maxLength) {
      setAiOutput(
        `Chapter is too long. Please split it into smaller sections (max 50,000 characters).`
      );
      return;
    }

    setLoading(true); // show loading
    setAiOutput(""); // clear previous output

    try {
      let userId = localStorage.getItem("userId");
      if (!userId) {
        userId = crypto.randomUUID(); // generate a unique id
        localStorage.setItem("userId", userId);
      }

      const res = await fetch("http://localhost:5000/api/generate-notes", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ text, userId }),
      });

      if (res.status === 429) {
        const data = await res.json();
        setAiOutput(data.error); // show daily limit message
        setIsAiOutput(false); // backend error
      } else if (!res.ok) {
        setAiOutput("Error: Could not generate notes.");
      } else {
        const data = await res.json();
        setAiOutput(data.output);
        setIsAiOutput(true); // this is actual AI output

        // Focus the success message after render
        setTimeout(() => {
          successRef.current?.focus();
        }, 100);
      }
    } catch (err) {
      console.error(err);
      setAiOutput("Error: Could not connect to server.");
      setIsAiOutput(false);
    } finally {
      setLoading(false);
      setText("");
      // / Remove focus from the button after submitting
      generateButtonRef.current?.blur();
    }
  };

  // copy to clipboard output
  const handleCopy = () => {
    if (!aiOutput) return;

    navigator.clipboard.writeText(aiOutput); // copy to clipboard
    setCopied(true);

    setTimeout(() => {
      setCopied(false); // revert after 5-10 seconds
    }, 5000); // 5000ms = 5 seconds
  };

  const handleReset = () => {
    setText(""); // clears the input
    setAiOutput(""); // clears the output
    setLoading(false); // reset loading state if needed
  };

const handleFileUpload = async (event) => {
  const file = event.target.files[0];
  if (!file) return;

  const fileName = file.name.toLowerCase();
  let extractedText = "";

  try {
    // ---------------- TXT ----------------
    if (fileName.endsWith(".txt")) {
      extractedText = await file.text();
    } 
    // ---------------- Word ----------------
    else if (fileName.endsWith(".docx") || fileName.endsWith(".doc")) {
      const arrayBuffer = await file.arrayBuffer();
      const result = await mammoth.extractRawText({ arrayBuffer });
      extractedText = result.value;
    } 
    // ---------------- PPTX ----------------
    else if (fileName.endsWith(".pptx") || fileName.endsWith(".ppt")) {
      const arrayBuffer = await file.arrayBuffer();
      const zip = await JSZip.loadAsync(arrayBuffer);
      let pptText = "";

      const slideFiles = Object.keys(zip.files).filter(
        (f) => f.startsWith("ppt/slides/slide") && f.endsWith(".xml")
      );

      for (const slidePath of slideFiles) {
        const slideData = await zip.files[slidePath].async("text");
        const slideXml = await parseStringPromise(slideData);

        const texts = [];
        const extractText = (obj) => {
          for (let key in obj) {
            if (key === "a:t") {
              if (Array.isArray(obj[key])) texts.push(obj[key].join(" "));
            } else if (typeof obj[key] === "object") extractText(obj[key]);
          }
        };
        extractText(slideXml);
        pptText += texts.join(" ") + "\n";
      }

      extractedText = pptText || "Could not extract text from this PPTX file.";
    } 
    // ---------------- PDF ----------------
    else if (fileName.endsWith(".pdf")) {
      // send PDF to Node.js server for extraction
      const formData = new FormData();
      formData.append("file", file);

      const res = await fetch("http://localhost:5000/api/extract-text", {
        method: "POST",
        body: formData,
      });

      if (!res.ok) throw new Error("Failed to extract text from PDF.");

      const data = await res.json();
      extractedText = data.text;
    } 
    // ---------------- Unsupported ----------------
    else {
      alert("Unsupported file type. Allowed: PDF, Word, PPTX, TXT.");
      return;
    }

    // ---------------- Update textarea ----------------
    setText(extractedText);
    setUploaded(true);

    if (generateButtonRef.current) {
      generateButtonRef.current.classList.add("highlight");
      setTimeout(() => {
        generateButtonRef.current.classList.remove("highlight");
      }, 3000);
      generateButtonRef.current.scrollIntoView({ behavior: "smooth", block: "center" });
    }

  } catch (err) {
    console.error("File parsing error:", err);
    alert("Failed to extract text from the uploaded file.");
  }
};



  return (
    <>
      <Head>
        <title>ChapterWise</title>
        <meta name="description" content="Generated by create next app" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <main>
        <Header />
        <div className="app-container">
          {(!aiOutput || !isAiOutput) && (
            <>
              <h1 className="app-h1">
                Turn chapters into{" "}
                <span className="highlight">exam-ready notes instantly</span>
              </h1>
              <p className="app-p">
                Paste your chapter or upload a file, and get clear, exam-ready
                notes in seconds.
              </p>
              <div className="textarea-wrapper">
                <label htmlFor="chapterTextarea" className="sr-only"></label>
                <textarea
                  id="chapterTextarea"
                  value={text}
                  onChange={(e) => setText(e.target.value)}
                  onFocus={() => setTextareaActive(true)}
                  onBlur={() => setTextareaActive(false)}
                  placeholder="Paste your chapter here…"
                ></textarea>
                {!text && !textareaActive && (
                  <>
                    <button
                      className="upload-button"
                      onClick={() =>
                        document.getElementById("fileInput").click()
                      }
                    >
                      <FontAwesomeIcon
                        className="upload-icon"
                        icon={faArrowUpFromBracket}
                      />
                      Upload chapter
                    </button>
                    <p className="files-allowed">pdf, word, ppt, txt</p>
                    <input
                      type="file"
                      id="fileInput"
                      accept=".pdf,.doc,.docx,.ppt,.pptx,.txt"
                      style={{ display: "none" }}
                      onChange={handleFileUpload}
                    />
                  </>
                )}
              </div>
              {/* character count */}
              {/* Validation: check text length, prevent empty submission. */}
              {/* file upload (PDF, DOCX) support. */}
              <button
                ref={generateButtonRef}
                onClick={handleSummarize}
                disabled={!text || loading}
                className="app-button"
              >
                {loading ? "Creating your notes..." : "Create My Notes"}
              </button>
              {uploaded && !loading && (
                <p className="upload-feedback">
                  Text loaded! Press{" "}
                  <span className="span-message-upload">Create My Notes</span>{" "}
                  to continue.
                </p>
              )}
            </>
          )}
          {!isAiOutput && aiOutput && (
            <p className="error-message">{aiOutput}</p>
          )}

          {/* Disabled while AI is processing */}
          {/* Show a spinner or “Generating notes…” message while API call is in progress. */}
          {/* Error message handling (e.g., network errors, API errors). */}
          {isAiOutput && aiOutput && (
            <>
              <p
                className="output-success-message"
                ref={successRef}
                tabIndex={-1}
                aria-live="polite"
              >
                Your notes are ready!
              </p>
              <pre className="ai-output">{aiOutput}</pre>
              <button
                onClick={handleCopy}
                disabled={!aiOutput}
                className="copy-button"
              >
                {copied ? (
                  <>
                    <FontAwesomeIcon icon={faCheck} className="copied-icon" />
                    <span className="copied-text">copied</span>
                  </>
                ) : (
                  <>
                    <FontAwesomeIcon
                      icon={faCopyRegular}
                      className="copy-icon"
                    />
                    <span className="copy-text">copy</span>
                  </>
                )}
              </button>
              <div>
                <button onClick={handleReset} className="back-button">
                  Summarize another chapter
                </button>
              </div>
            </>
          )}
        </div>
      </main>
      <Footer />
    </>
  );
}
