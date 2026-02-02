import Head from "next/head";
import Header from "@/components/Header.js";
import Footer from "@/components/Footer.js";

export default function About() {
  return (
    <>
      <Head>
        <title>ChapterIQ - Terms & Privacy</title>
        <meta name="description" content="ChapterIQ Terms & Privacy" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <main>
        <Header />
        <div className="terms-privacy-container">
          <h1>Terms & Privacy</h1>

          <h2>Terms of Service</h2>
          <p className="numbered-list">1. Acceptance of Terms</p>
          <p>
            By using ChapterIQ, you agree to comply with these Terms of Service.
            If you do not agree, please do not use the website or app.
          </p>

          <p className="numbered-list">2. Use of the Service</p>
          <p>
            ChapterIQ provides generated study notes for personal educational use.
            Commercial use, plagiarism, or distributing content that violates laws is prohibited.
          </p>

          <p className="numbered-list">3. User Responsibility</p>
          <p>
            You are responsible for the accuracy and legality of any content you submit.
            ChapterIQ is not responsible for errors in uploaded chapters or misuse of generated notes.
          </p>

          <p className="numbered-list">4. Intellectual Property</p>
          <p>
            All generated notes and materials remain property of ChapterIQ.
            Users may use notes for personal study only. Redistribution or commercial use is prohibited.
          </p>

          <p className="numbered-list">5. Account & Security</p>
          <p>
            You are responsible for keeping your login credentials secure.
            Notify us immediately if you suspect unauthorized access.
          </p>

          <p className="numbered-list">6. Changes to Terms</p>
          <p>
            ChapterIQ may update these terms at any time. Continued use constitutes acceptance of changes.
          </p>

          <h2 className="privacy-policy-h2" id="privacy-policy">Privacy Policy</h2>

          <p className="numbered-list">1. Information We Collect</p>
          <p>
            We collect information you provide, such as account details, uploaded chapters, and usage data.
          </p>

          <p className="numbered-list">2. How We Use Your Data</p>
          <p>
            Data is used to generate study notes, improve the service, provide support, and personalize your experience.
            Legal basis: performance of contract and legitimate interest.
          </p>

          <p className="numbered-list">3. Data Sharing</p>
          <p>
            We do not sell your data. We may share information only when legally required.
          </p>

          <p className="numbered-list">4. Security</p>
          <p>
            We use reasonable technical measures to protect your data. No method is completely secure.
          </p>

          <p className="numbered-list">5. Retention</p>
          <p>
            Uploaded chapters and generated notes are stored temporarily. Data in your account is retained until you delete your account.
          </p>

          <p className="numbered-list">6. Cookies & Tracking</p>
          <p>
            ChapterIQ uses cookies for session management and analytics. You may accept or reject non-essential cookies.
          </p>

          <p className="numbered-list">7. User Rights (GDPR)</p>
          <p>
            You have the following rights regarding your personal data:
            <ul>
              <li><strong>Access:</strong> Request a copy of your data.</li>
              <li><strong>Correction:</strong> Correct inaccurate or incomplete data.</li>
              <li><strong>Erasure:</strong> Delete your account and data.</li>
              <li><strong>Restriction:</strong> Temporarily limit how we process your data.</li>
              <li><strong>Portability:</strong> Receive your data in a machine-readable format.</li>
              <li><strong>Object:</strong> Object to processing for marketing or other purposes.</li>
            </ul>
            Requests can be made by contacting us at <a href="mailto:support@ChapterIQ.com">support@ChapterIQ.com</a>.
          </p>

          <p className="numbered-list">8. Complaints</p>
          <p>
            If you believe your data rights have been violated, you may file a complaint with your local data protection authority.
          </p>
        </div>
      </main>
      <Footer />
    </>
  );
}
