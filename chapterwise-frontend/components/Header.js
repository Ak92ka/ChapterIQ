import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faBars } from "@fortawesome/free-solid-svg-icons";
import Link from "next/link";
import { useState, useEffect } from "react";

export default function Header() {
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    document.body.style.overflow = menuOpen ? "hidden" : "";
    return () => (document.body.style.overflow = "");
  }, [menuOpen]);

  return (
    <header className="header-container">
      <Link href="/">
        <img
          className="logo-header"
          src="/ChapterWise_logo.svg"
          alt="ChapterWise logo"
          width={130}
          height={60}
        />
      </Link>
      <a href="/app" className="header-cta">
        TRY free
      </a>
      <button
        className="hamburger-btn"
        aria-label="Open menu"
        onClick={() => setMenuOpen(true)}
      >
        <FontAwesomeIcon className="hamburger" icon={faBars} />
      </button>

      <div className={`mobile-menu ${menuOpen ? "open" : ""}`}>
        <div className="slider-menu-top">
          <Link href="/">
      <img
        className="slider-menu-logo"
        src="/ChapterWise_logo.svg"
        alt="ChapterWise logo"
        width={130}
        height={60}
      />
      </Link>
        <a href="/app" className="slider-menu-cta">
        TRY free
      </a>
<button className="close-btn" onClick={() => setMenuOpen(false)}>
          ✕
        </button>
      </div>
        <nav className="mobile-nav">
          <Link href="/" onClick={() => setMenuOpen(false)}>
            Home
          </Link>
          <Link href="/account" onClick={() => setMenuOpen(false)}>
            Account
          </Link>
          <Link href="/app" onClick={() => setMenuOpen(false)}>
            Upload Chapter
          </Link>
          <Link href="/about-us" onClick={() => setMenuOpen(false)}>
            About us
          </Link>
          <Link href="/pricing" onClick={() => setMenuOpen(false)}>
            Pricing
          </Link>
          <Link href="/blog" onClick={() => setMenuOpen(false)}>
            Blog
          </Link>
          <Link href="/contact" onClick={() => setMenuOpen(false)}>
            Contact
          </Link>
          <Link href="/terms-privacy" onClick={() => setMenuOpen(false)}>
            Terms & privacy
          </Link>
        </nav>
        <div className="account-div">
        <a href="" className="account-button create-account-button">Create Account</a>
        <a href="" className="account-button login-button">Log in</a>

        </div>
      </div>
      

      {menuOpen && (
        <div className="backdrop" onClick={() => setMenuOpen(false)} />
      )}
    </header>
  );
}
