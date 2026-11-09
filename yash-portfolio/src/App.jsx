import React, { useState, useEffect } from "react";
import {
  Scale,
  Mail,
  Linkedin,
  MapPin,
  ArrowRight,
  ArrowUpRight,
  Check,
  Loader2,
  AlertCircle,
  Menu,
  X,
  FileText,
} from "lucide-react";
import { supabase } from "./lib/supabase";
import portraitPhoto from "./assets/portrait.jpg";
import chambersPhoto from "./assets/chambers.jpg";

const EMAIL = "advyashdadriwal@gmail.com";
const LINKEDIN_URL = "https://www.linkedin.com/in/yash-dadriwal-8a30161b2/";
const MAPS_URL =
  "https://www.google.com/maps/place/F-17,+Jangpura,+Block+F,+Jungpura+Extension,+New+Delhi,+Delhi+110014/@28.5812089,77.2382263,17z/data=!3m1!4b1!4m6!3m5!1s0x390ce30060c48ee9:0x928e017ae236bbd2!8m2!3d28.581209!4d77.2430972!16s%2Fg%2F11w7q2s3rd";
const PROFILE_PDF_URL = "/Yash-Dadriwal-Profile.pdf";
const DISCLAIMER_KEY = "yd-disclaimer-accepted";

const NAV_LINKS = [
  { href: "#about", label: "About" },
  { href: "#practice", label: "Practice" },
  { href: "#matters", label: "Matters" },
  { href: "#contact", label: "Contact" },
];

const CREDENTIALS = [
  { label: "Enrolment", value: "Bar Council of Maharashtra & Goa, 2023" },
  { label: "B.A. LL.B. (Hons.)", value: "National Law University, Aurangabad" },
  { label: "LL.M.", value: "Corporate & Commercial Law, NLU Mumbai" },
  { label: "UGC-NET", value: "Qualified in Law" },
];

const PRACTICE_AREAS = [
  {
    title: "Civil & Commercial",
    list: [
      "Property disputes",
      "Contractual breaches",
      "Insolvency & bankruptcy matters",
      "Intellectual property disputes",
    ],
  },
  {
    title: "Criminal & Matrimonial",
    list: [
      "Offences against body & property",
      "White-collar defence",
      "Cheque dishonour (Section 138 NI Act)",
      "Divorce, separation & custody",
    ],
  },
  {
    title: "Arbitration & ADR",
    list: [
      "Domestic & international arbitration",
      "Contractual & construction disputes",
      "Multi-jurisdictional defaults",
      "Mediation & conciliation",
    ],
  },
];

const MATTERS = [
  {
    forum: "Delhi High Court",
    text: "Argued and secured a favourable order in a writ petition challenging an incorrect CLAT-UG question, before the Hon'ble Chief Justice of the Delhi High Court.",
  },
  {
    forum: "Trial courts & tribunals",
    text: "Landlord–tenant disputes, bail matters, matrimonial proceedings and Section 138 NI Act litigation across Delhi and Mumbai.",
  },
  {
    forum: "Commercial & arbitration",
    text: "Assisted in high-value commercial disputes and arbitrations concerning contractual breaches, construction claims and multi-jurisdictional challenges.",
  },
];

const readDisclaimerAccepted = () => {
  try {
    return sessionStorage.getItem(DISCLAIMER_KEY) === "1";
  } catch {
    return false;
  }
};

const SectionHeading = ({ index, eyebrow, title, light = false }) => (
  <div className="space-y-4">
    <p className={`eyebrow ${light ? "text-brass-light" : ""}`}>
      <span className="tabular-nums">{index}</span>
      <span className="mx-2 opacity-60">—</span>
      {eyebrow}
    </p>
    <h2
      className={`font-serif text-4xl md:text-5xl font-semibold leading-[1.1] tracking-tight ${
        light ? "text-ivory" : "text-ink"
      }`}
    >
      {title}
    </h2>
  </div>
);

const App = () => {
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState("");
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  // Bar Council of India rules: visitors must acknowledge the disclaimer before browsing
  const [showDisclaimer, setShowDisclaimer] = useState(() => !readDisclaimerAccepted());
  const [disclaimerCheckbox, setDisclaimerCheckbox] = useState(false);

  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    phone: "",
    subject: "Legal Consultation",
    query: "",
  });

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    const lock = isMenuOpen || showDisclaimer;
    document.body.classList.toggle("menu-open", lock);
    return () => document.body.classList.remove("menu-open");
  }, [isMenuOpen, showDisclaimer]);

  const acceptDisclaimer = () => {
    try {
      sessionStorage.setItem(DISCLAIMER_KEY, "1");
    } catch {
      // Storage unavailable (private mode); the disclaimer will show again next visit.
    }
    setShowDisclaimer(false);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    if (!supabase) {
      setError(`The enquiry form is temporarily unavailable. Please write to ${EMAIL}.`);
      setLoading(false);
      return;
    }

    try {
      const { error: dbError } = await supabase.from("inquiries").insert([
        {
          full_name: formData.fullName,
          email: formData.email,
          phone: formData.phone,
          subject: formData.subject,
          query: formData.query,
          created_at: new Date().toISOString(),
        },
      ]);

      if (dbError) throw dbError;
      setSubmitted(true);
      setFormData({ fullName: "", email: "", phone: "", subject: "Legal Consultation", query: "" });
    } catch (err) {
      console.error("Submission error:", err);
      setError(`We couldn't send your enquiry. Please try again or write to ${EMAIL}.`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="relative min-h-screen bg-ivory text-ink">
      {/* LEGAL DISCLAIMER MODAL */}
      {showDisclaimer && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 md:p-6">
          <div className="absolute inset-0 bg-ink/70 backdrop-blur-sm" />
          <div
            role="dialog"
            aria-modal="true"
            aria-labelledby="disclaimer-title"
            className="relative w-full max-w-2xl bg-ivory shadow-2xl animate-fade-in-up"
          >
            <div className="h-1 bg-brass" />
            <div className="p-7 md:p-12">
              <div className="flex items-center gap-3 mb-6">
                <Scale size={22} className="text-brass" strokeWidth={1.5} />
                <h2 id="disclaimer-title" className="font-serif text-3xl font-semibold">
                  Disclaimer
                </h2>
              </div>

              <div className="space-y-4 text-[15px] text-ink-muted leading-relaxed max-h-[45vh] overflow-y-auto pr-2">
                <p>
                  The Bar Council of India does not permit advertisement or solicitation by advocates in any form or
                  manner. By accessing this website, you acknowledge and confirm that you are seeking information relating
                  to <strong className="text-ink font-semibold">Yash Dadriwal</strong> of your own accord and that there
                  has been no form of solicitation, advertisement or inducement by Yash Dadriwal or his office.
                </p>
                <p>
                  The content of this website is for informational purposes only and should not be interpreted as
                  soliciting or advertisement. No material or information provided on this website should be construed as
                  legal advice. Yash Dadriwal shall not be liable for consequences of any action taken by relying on the
                  material or information provided on this website.
                </p>
                <p>The contents of this website are the intellectual property of Yash Dadriwal.</p>
              </div>

              <div className="mt-8 pt-6 border-t border-rule flex flex-col md:flex-row md:items-center md:justify-between gap-6">
                <label className="flex items-center gap-3 cursor-pointer">
                  <span className="relative flex items-center">
                    <input
                      type="checkbox"
                      className="peer h-5 w-5 cursor-pointer appearance-none border border-ink/40 bg-white transition-colors checked:border-ink checked:bg-ink"
                      checked={disclaimerCheckbox}
                      onChange={(e) => setDisclaimerCheckbox(e.target.checked)}
                    />
                    <Check
                      className="absolute left-1/2 top-1/2 h-3.5 w-3.5 -translate-x-1/2 -translate-y-1/2 text-ivory opacity-0 peer-checked:opacity-100 pointer-events-none"
                      strokeWidth={3}
                    />
                  </span>
                  <span className="text-sm text-ink">I have read and accept the above.</span>
                </label>

                <button onClick={acceptDisclaimer} disabled={!disclaimerCheckbox} className="btn-primary">
                  Proceed to website <ArrowRight size={16} />
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* NAVIGATION */}
      <nav
        className={`fixed top-0 inset-x-0 z-50 bg-ivory/95 backdrop-blur transition-[border-color,box-shadow] ${
          scrolled ? "border-b border-rule shadow-[0_1px_0_rgba(11,26,46,0.03)]" : "border-b border-transparent"
        }`}
      >
        <div className="max-w-6xl mx-auto px-5 md:px-8 h-[72px] flex items-center justify-between">
          <a href="#top" className="flex items-baseline gap-3" onClick={() => setIsMenuOpen(false)}>
            <span className="font-serif text-2xl font-semibold tracking-tight text-ink">Yash P. Dadriwal</span>
            <span className="hidden sm:inline text-[11px] uppercase tracking-[0.22em] text-brass font-semibold">
              Advocate
            </span>
          </a>

          <div className="hidden md:flex items-center gap-9">
            {NAV_LINKS.slice(0, 3).map((link) => (
              <a key={link.href} href={link.href} className="nav-link">
                {link.label}
              </a>
            ))}
            <a href="#contact" className="btn-outline !py-2.5 !px-5">
              Contact
            </a>
          </div>

          <button
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className="md:hidden -mr-2 p-2 text-ink"
            aria-label={isMenuOpen ? "Close menu" : "Open menu"}
            aria-expanded={isMenuOpen}
          >
            {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>

        {/* MOBILE MENU */}
        <div
          className={`md:hidden fixed inset-x-0 top-[72px] bottom-0 bg-ivory transition-[opacity,visibility] duration-300 ${
            isMenuOpen ? "opacity-100 visible" : "opacity-0 invisible"
          }`}
        >
          <div className="px-5 pt-6">
            {NAV_LINKS.map((link) => (
              <a
                key={link.href}
                href={link.href}
                onClick={() => setIsMenuOpen(false)}
                className="flex items-center justify-between py-5 border-b border-rule font-serif text-3xl font-semibold"
              >
                {link.label}
                <ArrowRight size={20} className="text-brass" />
              </a>
            ))}
          </div>
        </div>
      </nav>

      {/* HERO */}
      <header id="top" className="pt-[72px]">
        <div className="max-w-6xl mx-auto px-5 md:px-8 pt-12 md:pt-24 pb-16 md:pb-24 grid md:grid-cols-12 gap-12 md:gap-10 items-center">
          <div className="md:col-span-7 space-y-8 animate-fade-in-up">
            <p className="eyebrow">Advocate · Delhi &amp; Mumbai</p>
            <h1 className="font-serif text-[2.75rem] leading-[1.05] sm:text-6xl lg:text-[4.5rem] font-semibold tracking-tight text-ink text-balance">
              Disputes counsel before the High Courts of Delhi and Bombay.
            </h1>
            <p className="max-w-xl text-lg leading-relaxed text-ink-muted">
              An independent litigation practice in civil, commercial and criminal matters — built on careful drafting,
              thorough research and clear oral advocacy.
            </p>
            <div className="flex flex-wrap items-center gap-4 pt-2">
              <a href="#contact" className="btn-primary">
                Send an enquiry <ArrowRight size={16} />
              </a>
              <a href={LINKEDIN_URL} target="_blank" rel="noreferrer" className="btn-outline">
                <Linkedin size={16} /> LinkedIn
              </a>
              <a href={PROFILE_PDF_URL} target="_blank" rel="noreferrer" className="btn-outline">
                <FileText size={16} /> Profile (PDF)
              </a>
            </div>
          </div>

          <div className="md:col-span-5 animate-fade-in-up [animation-delay:150ms]">
            <figure className="relative mx-auto max-w-[360px] md:max-w-none">
              <div className="absolute -right-3 -bottom-3 md:-right-5 md:-bottom-5 inset-0 border border-brass/60" aria-hidden="true" />
              <img
                src={portraitPhoto}
                alt="Advocate Yash Dadriwal outside the Supreme Court of India"
                className="relative w-full aspect-[4/5] object-cover object-[50%_35%] bg-ivory-deep"
              />
            </figure>
          </div>
        </div>

        {/* CREDENTIALS STRIP */}
        <div className="border-y border-rule bg-ivory-deep/60">
          <dl className="max-w-6xl mx-auto px-5 md:px-8 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4">
            {CREDENTIALS.map((item, i) => (
              <div
                key={item.label}
                className={`py-6 lg:py-8 lg:px-6 first:lg:pl-0 border-rule ${
                  i > 0 ? "border-t sm:border-t-0" : ""
                } ${i >= 2 ? "sm:border-t lg:border-t-0" : ""} ${i % 2 === 1 ? "sm:pl-6 sm:border-l lg:pl-6" : ""} ${
                  i === 2 ? "lg:border-l" : ""
                }`}
              >
                <dt className="text-[11px] font-semibold uppercase tracking-[0.18em] text-brass">{item.label}</dt>
                <dd className="mt-2 text-[15px] leading-snug text-ink">{item.value}</dd>
              </div>
            ))}
          </dl>
        </div>
      </header>

      {/* ABOUT */}
      <section id="about" className="py-20 md:py-32">
        <div className="max-w-6xl mx-auto px-5 md:px-8 grid lg:grid-cols-12 gap-12 lg:gap-16">
          <div className="lg:col-span-5 space-y-10">
            <SectionHeading index="01" eyebrow="About" title="A practice grounded in the courtroom." />
            <img
              src={chambersPhoto}
              alt="Advocate Yash Dadriwal in chambers"
              loading="lazy"
              className="w-full aspect-[4/3] object-cover object-[48%_30%] bg-ivory-deep"
            />
          </div>

          <div className="lg:col-span-7 lg:pt-16 space-y-6 text-[17px] md:text-lg leading-[1.8] text-ink-muted">
            <p className="font-serif text-2xl md:text-[1.75rem] leading-snug text-ink">
              Yash P. Dadriwal is a disputes lawyer practising across Delhi and Mumbai, with a focused practice in civil,
              commercial and criminal litigation.
            </p>
            <p>
              An alumnus of <span className="text-ink font-medium">National Law University, Aurangabad</span> and{" "}
              <span className="text-ink font-medium">National Law University, Mumbai</span>, he combines strong academic
              grounding with hands-on courtroom experience before constitutional courts, tribunals and district courts.
            </p>
            <p>
              Yash maintains an independent litigation practice, regularly appearing before the{" "}
              <span className="text-ink font-medium">Delhi High Court</span> and the{" "}
              <span className="text-ink font-medium">Bombay High Court</span>, as well as various district courts and
              tribunals. His work reflects a strategy-driven approach to dispute resolution.
            </p>
            <p>
              His exposure extends to high-value commercial disputes and arbitration, including contractual breaches,
              construction arbitrations and multi-jurisdictional legal challenges.
            </p>

            <blockquote className="mt-10 border-l-2 border-brass pl-6 py-1">
              <p className="font-serif italic text-2xl leading-snug text-ink">
                “Defining the path to justice through meticulous drafting, thorough research, and effective oral
                advocacy.”
              </p>
            </blockquote>
          </div>
        </div>
      </section>

      {/* PRACTICE AREAS */}
      <section id="practice" className="py-20 md:py-32 bg-ink text-ivory">
        <div className="max-w-6xl mx-auto px-5 md:px-8">
          <div className="grid md:grid-cols-2 gap-8 items-end mb-14 md:mb-20">
            <SectionHeading index="02" eyebrow="Practice" title="Areas of practice" light />
            <p className="text-ivory/60 leading-relaxed md:text-right md:max-w-sm md:ml-auto">
              Advisory and advocacy across trial courts, High Courts and arbitral tribunals.
            </p>
          </div>

          <div className="grid md:grid-cols-3 border-t border-ivory/15">
            {PRACTICE_AREAS.map((area, i) => (
              <div
                key={area.title}
                className={`pt-8 pb-10 md:pb-0 md:px-8 first:md:pl-0 last:md:pr-0 ${
                  i > 0 ? "border-t md:border-t-0 md:border-l border-ivory/15" : ""
                }`}
              >
                <p className="font-serif text-brass-light text-lg tabular-nums">0{i + 1}</p>
                <h3 className="mt-2 font-serif text-3xl font-semibold">{area.title}</h3>
                <ul className="mt-6 space-y-3">
                  {area.list.map((item) => (
                    <li key={item} className="flex gap-3 text-[15px] text-ivory/75 leading-snug">
                      <span className="mt-2 h-px w-3 shrink-0 bg-brass-light" aria-hidden="true" />
                      {item}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* SELECT MATTERS */}
      <section id="matters" className="py-20 md:py-32">
        <div className="max-w-6xl mx-auto px-5 md:px-8 grid lg:grid-cols-12 gap-12">
          <div className="lg:col-span-4">
            <SectionHeading index="03" eyebrow="Experience" title="Select matters" />
          </div>
          <ol className="lg:col-span-8 border-t border-rule">
            {MATTERS.map((matter) => (
              <li key={matter.forum} className="grid sm:grid-cols-[200px_1fr] gap-2 sm:gap-8 py-8 border-b border-rule">
                <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-brass sm:pt-1.5">
                  {matter.forum}
                </p>
                <p className="text-[17px] leading-relaxed text-ink">{matter.text}</p>
              </li>
            ))}
          </ol>
        </div>
      </section>

      {/* CONTACT */}
      <section id="contact" className="py-20 md:py-32 bg-ivory-deep/60 border-t border-rule">
        <div className="max-w-6xl mx-auto px-5 md:px-8 grid lg:grid-cols-12 gap-14 lg:gap-16">
          <div className="lg:col-span-5 space-y-10">
            <SectionHeading index="04" eyebrow="Contact" title="Get in touch" />
            <p className="text-ink-muted leading-relaxed max-w-md">
              Share a brief outline of your matter and the office will respond, ordinarily within one working day.
              Please do not send confidential documents through this form.
            </p>

            <ul className="space-y-6">
              <li>
                <a href={`mailto:${EMAIL}`} className="group flex items-start gap-4">
                  <Mail size={18} className="mt-1 text-brass shrink-0" strokeWidth={1.75} />
                  <span className="min-w-0">
                    <span className="field-label">Email</span>
                    <span className="mt-1 block text-ink break-all group-hover:underline underline-offset-4 decoration-brass">
                      {EMAIL}
                    </span>
                  </span>
                </a>
              </li>
              <li>
                <a href={LINKEDIN_URL} target="_blank" rel="noreferrer" className="group flex items-start gap-4">
                  <Linkedin size={18} className="mt-1 text-brass shrink-0" strokeWidth={1.75} />
                  <span>
                    <span className="field-label">LinkedIn</span>
                    <span className="mt-1 inline-flex items-center gap-1 text-ink group-hover:underline underline-offset-4 decoration-brass">
                      Yash Dadriwal <ArrowUpRight size={14} />
                    </span>
                  </span>
                </a>
              </li>
              <li>
                <a href={PROFILE_PDF_URL} target="_blank" rel="noreferrer" className="group flex items-start gap-4">
                  <FileText size={18} className="mt-1 text-brass shrink-0" strokeWidth={1.75} />
                  <span>
                    <span className="field-label">Profile</span>
                    <span className="mt-1 inline-flex items-center gap-1 text-ink group-hover:underline underline-offset-4 decoration-brass">
                      Dispute Resolution Profile (PDF) <ArrowUpRight size={14} />
                    </span>
                  </span>
                </a>
              </li>
              <li>
                <a href={MAPS_URL} target="_blank" rel="noreferrer" className="group flex items-start gap-4">
                  <MapPin size={18} className="mt-1 text-brass shrink-0" strokeWidth={1.75} />
                  <span>
                    <span className="field-label">Chambers</span>
                    <span className="mt-1 block text-ink leading-relaxed group-hover:underline underline-offset-4 decoration-brass">
                      1st Floor, F-17, Jungpura Extension
                      <br />
                      New Delhi – 110014
                    </span>
                  </span>
                </a>
              </li>
            </ul>
          </div>

          <div className="lg:col-span-7">
            <div className="bg-ivory border border-rule p-6 sm:p-10 md:p-12">
              {submitted ? (
                <div className="py-12 text-center animate-fade-in-up">
                  <div className="mx-auto mb-6 flex h-14 w-14 items-center justify-center border border-brass text-brass">
                    <Check size={26} />
                  </div>
                  <h3 className="font-serif text-3xl font-semibold">Thank you</h3>
                  <p className="mt-3 text-ink-muted max-w-sm mx-auto">
                    Your enquiry has been received. The office will be in touch shortly.
                  </p>
                  <button
                    onClick={() => setSubmitted(false)}
                    className="mt-8 text-sm text-ink underline underline-offset-4 decoration-brass hover:text-brass"
                  >
                    Send another enquiry
                  </button>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-8">
                  <div className="grid sm:grid-cols-2 gap-8">
                    <label className="block">
                      <span className="field-label">Full name</span>
                      <input
                        name="fullName"
                        autoComplete="name"
                        required
                        value={formData.fullName}
                        onChange={handleInputChange}
                        className="field"
                      />
                    </label>
                    <label className="block">
                      <span className="field-label">Phone</span>
                      <input
                        name="phone"
                        type="tel"
                        autoComplete="tel"
                        placeholder="+91"
                        required
                        value={formData.phone}
                        onChange={handleInputChange}
                        className="field"
                      />
                    </label>
                  </div>

                  <label className="block">
                    <span className="field-label">Email</span>
                    <input
                      name="email"
                      type="email"
                      autoComplete="email"
                      required
                      value={formData.email}
                      onChange={handleInputChange}
                      className="field"
                    />
                  </label>

                  <label className="block">
                    <span className="field-label">Brief description of your matter</span>
                    <textarea
                      name="query"
                      rows="5"
                      required
                      value={formData.query}
                      onChange={handleInputChange}
                      className="field resize-none"
                    />
                  </label>

                  {error && (
                    <div className="flex items-start gap-2 border-l-2 border-red-700 bg-red-50 px-4 py-3 text-sm text-red-800">
                      <AlertCircle size={16} className="mt-0.5 shrink-0" />
                      <span>{error}</span>
                    </div>
                  )}

                  <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 pt-2">
                    <p className="text-xs text-ink-muted max-w-xs leading-relaxed">
                      Submitting this form does not create an advocate–client relationship.
                    </p>
                    <button type="submit" disabled={loading} className="btn-primary min-w-[180px]">
                      {loading ? (
                        <Loader2 size={18} className="animate-spin" />
                      ) : (
                        <>
                          Send enquiry <ArrowRight size={16} />
                        </>
                      )}
                    </button>
                  </div>
                </form>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* FOOTER */}
      <footer className="bg-ink text-ivory/60">
        <div className="max-w-6xl mx-auto px-5 md:px-8 py-12 flex flex-col md:flex-row md:items-center md:justify-between gap-8">
          <div>
            <p className="font-serif text-2xl font-semibold text-ivory">Yash P. Dadriwal</p>
            <p className="mt-1 text-[11px] uppercase tracking-[0.22em] text-brass-light">Advocate · Delhi &amp; Mumbai</p>
          </div>
          <div className="flex items-center gap-6">
            <a href={LINKEDIN_URL} target="_blank" rel="noreferrer" aria-label="LinkedIn" className="hover:text-ivory transition-colors">
              <Linkedin size={20} />
            </a>
            <a href={`mailto:${EMAIL}`} aria-label="Email" className="hover:text-ivory transition-colors">
              <Mail size={20} />
            </a>
            <a href={PROFILE_PDF_URL} target="_blank" rel="noreferrer" aria-label="Profile (PDF)" className="hover:text-ivory transition-colors">
              <FileText size={20} />
            </a>
            <a href={MAPS_URL} target="_blank" rel="noreferrer" aria-label="Chambers on Google Maps" className="hover:text-ivory transition-colors">
              <MapPin size={20} />
            </a>
          </div>
        </div>
        <div className="border-t border-ivory/10">
          <div className="max-w-6xl mx-auto px-5 md:px-8 py-6 flex flex-col md:flex-row md:justify-between gap-2 text-xs">
            <p>© {new Date().getFullYear()} Yash Dadriwal. All rights reserved.</p>
            <p>This website is for information only and does not constitute legal advice or solicitation.</p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default App;
