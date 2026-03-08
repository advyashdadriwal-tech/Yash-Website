import React, { useState, useEffect } from "react";
import {
  Scale,
  Mail,
  Linkedin,
  Phone,
  BookOpen,
  CheckCircle,
  Send,
  User,
  Shield,
  Gavel,
  Briefcase,
  ChevronRight,
  Sparkles,
  Quote,
  Star,
  Award,
  AlertCircle,
  MapPin,
  History,
  Scale as ScaleIcon,
  Check,
  Loader2,
  ExternalLink,
  MessageSquare,
  FileText,
  X
} from "lucide-react";

/**
 * 🛠️ LOCAL PHOTO SETUP:
 * 1. Ensure your photo is saved as 'photo.jpg' in 'yash-portfolio/src/assets/'
 * 2. Uncomment the import line below:
 * // import profilePhoto from './assets/photo.jpg';
 * 3. Replace the placeholder constant 'PROFILE_IMAGE_URL' with 'profilePhoto' inside the <img> tags.
 */
const PROFILE_IMAGE_URL = "src/assets/photo.jpg"; 
const PROFILE_IMAGE_URL2 = "src/assets/photo2.jpeg";// Replace with imported photo variable if using local import

const App = () => {
  const [supabaseClient, setSupabaseClient] = useState(null);
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState("");
  const [initStatus, setInitStatus] = useState("initializing");
  
  // Disclaimer State - Set to true by default for BCI compliance
  const [showDisclaimer, setShowDisclaimer] = useState(true);
  const [disclaimerCheckbox, setDisclaimerCheckbox] = useState(false);

  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    phone: "",
    subject: "Legal Consultation",
    query: "",
  });

  // Resilient Supabase Initialization
  useEffect(() => {
    let isMounted = true;
    const loadSupabase = () => {
      let url = "";
      let key = "";
      try {
        url = import.meta.env.VITE_SUPABASE_URL || "";
        key = import.meta.env.VITE_SUPABASE_ANON_KEY || "";
      } catch (e) {
        console.warn("Vite environment meta not accessible.");
      }

      if (!window.supabase) {
        const script = document.createElement("script");
        script.src = "https://cdn.jsdelivr.net/npm/@supabase/supabase-js";
        script.async = true;
        script.onload = () => {
          if (isMounted && window.supabase && url && key) {
            try {
              const client = window.supabase.createClient(url, key);
              setSupabaseClient(client);
              setInitStatus("ready");
            } catch (err) {
              setInitStatus("error");
            }
          } else if (isMounted && !url) {
            setInitStatus("missing_keys");
          }
        };
        script.onerror = () => isMounted && setInitStatus("error");
        document.body.appendChild(script);
      } else if (url && key) {
        const client = window.supabase.createClient(url, key);
        setSupabaseClient(client);
        setInitStatus("ready");
      } else {
        setInitStatus("missing_keys");
      }
    };

    loadSupabase();
    return () => { isMounted = false; };
  }, []);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    if (!supabaseClient) {
      if (initStatus === "missing_keys") {
        setError("Setup Required: Please ensure your .env.local file is inside the 'yash-portfolio' folder.");
      } else {
        setError("Database connection is initializing. Please try again in a few seconds.");
      }
      setLoading(false);
      return;
    }

    try {
      const { error: dbError } = await supabaseClient.from("inquiries").insert([
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
      
    } catch (err) {
      console.error("Submission error:", err);
      setError(`Storage Error: ${err.message || "Failed to reach database."}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="relative min-h-screen bg-[#fcfcfd] text-slate-900 scroll-smooth font-sans selection:bg-blue-100 selection:text-blue-900 overflow-x-hidden">
      
      {/* LEGAL DISCLAIMER MODAL */}
      {showDisclaimer && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 md:p-6">
          <div className="absolute inset-0 bg-slate-950/60 backdrop-blur-md" />
          <div className="relative bg-white w-full max-w-3xl rounded-[2rem] shadow-2xl overflow-hidden animate-in fade-in zoom-in duration-300 border border-slate-200">
            <div className="p-8 md:p-12">
              <div className="flex items-center gap-3 text-blue-950 mb-6">
                <div className="bg-slate-50 p-2 rounded-lg border border-slate-200">
                  <Shield size={24} className="text-blue-600" />
                </div>
                <h2 className="text-3xl font-serif font-bold text-slate-900">Disclaimer</h2>
              </div>
              
              <div className="space-y-4 text-sm text-slate-600 leading-relaxed max-h-[50vh] overflow-y-auto pr-2 custom-scrollbar">
                <p>
                  The Bar Council of India does not permit advertisement or solicitation by advocates in any form or manner. 
                  By accessing this website, you acknowledge and confirm that you are seeking information relating to 
                  <strong> Yash Dadriwal</strong> of your own accord and that there has been no form of solicitation, 
                  advertisement or inducement by Yash Dadriwal or his office.
                </p>
                <p>
                  The content of this website is for informational purposes only and should not be interpreted as soliciting 
                  or advertisement. No material or information provided on this website should be construed as legal advice. 
                  Yash Dadriwal shall not be liable for consequences of any action taken by relying on the material or 
                  information provided on this website.
                </p>
                <p>
                  The contents of this website are the intellectual property of Yash Dadriwal.
                </p>
              </div>

              <div className="mt-10 space-y-6">
                <label className="flex items-start gap-3 cursor-pointer group">
                  <div className="relative flex items-center mt-1">
                    <input 
                      type="checkbox" 
                      className="peer h-5 w-5 cursor-pointer appearance-none rounded border border-slate-300 bg-slate-50 transition-all checked:border-blue-600 checked:bg-blue-600"
                      checked={disclaimerCheckbox}
                      onChange={(e) => setDisclaimerCheckbox(e.target.checked)}
                    />
                    <Check className="absolute h-3.5 w-3.5 text-white opacity-0 peer-checked:opacity-100 left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 transition-opacity pointer-events-none" strokeWidth={4} />
                  </div>
                  <span className="text-sm font-medium text-slate-700 group-hover:text-slate-900 transition-colors">I accept the terms stated above.</span>
                </label>

                <button 
                  onClick={() => setShowDisclaimer(false)}
                  disabled={!disclaimerCheckbox}
                  className="w-full md:w-auto px-10 py-4 bg-[#0f172a] text-white rounded-xl font-bold uppercase tracking-widest text-xs disabled:opacity-30 disabled:cursor-not-allowed hover:bg-blue-900 transition-all shadow-xl active:scale-95"
                >
                  Proceed to Website
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* NAVIGATION */}
      <nav className="fixed top-0 w-full bg-white/70 backdrop-blur-xl border-b border-slate-200 z-50 transition-all duration-300">
        <div className="max-w-7xl mx-auto px-6 py-4 flex justify-between items-center">
          <div className="flex items-center gap-3">
            <div className="bg-[#0f172a] p-2.5 rounded-xl text-white shadow-lg">
              <Scale size={24}/>
            </div>
            <div>
              <p className="font-bold text-slate-900 text-lg leading-tight tracking-tight uppercase">YASH DADRIWAL</p>
              <p className="text-[10px] text-blue-600 uppercase tracking-[0.2em] font-black">Advocate & Legal Consultant</p>
            </div>
          </div>
          
          <div className="hidden md:flex gap-10 text-[11px] font-black text-slate-500 uppercase tracking-widest">
            <a href="#about" className="hover:text-blue-700 transition-colors">About</a>
            <a href="#expertise" className="hover:text-blue-700 transition-colors">Expertise</a>
            <a href="#reviews" className="hover:text-blue-700 transition-colors">Reviews</a>
            <a href="#contact" className="bg-[#0f172a] text-white px-7 py-2.5 rounded-full hover:bg-blue-800 transition-all shadow-xl hover:-translate-y-0.5">Consult Now</a>
          </div>
        </div>
      </nav>

      {/* HERO SECTION */}
      <header className="pt-48 pb-32 bg-[#020617] text-white relative overflow-hidden">
        <div className="absolute top-0 right-0 w-full h-full bg-[radial-gradient(circle_at_70%_30%,rgba(37,99,235,0.15),transparent_50%)]" />
        <div className="absolute -bottom-24 -left-24 w-[500px] h-[500px] bg-blue-600/10 rounded-full blur-[120px] pointer-events-none" />

        <div className="max-w-7xl mx-auto px-6 grid md:grid-cols-2 gap-20 items-center relative z-10">
          <div className="space-y-10 animate-in fade-in slide-in-from-bottom-8 duration-700">
            <div className="inline-flex items-center gap-2 bg-blue-500/10 border border-blue-500/20 px-4 py-2 rounded-full text-blue-400 text-[10px] font-black uppercase tracking-widest">
              <Sparkles size={12} className="animate-pulse"/> NLU Alumnus • Strategic Litigation
            </div>

            <h1 className="text-6xl md:text-[5.5rem] font-serif font-medium leading-[1] tracking-tight text-white text-balance">
              Precision <br />
              <span className="text-blue-500 font-bold not-italic">In Legal Strategy.</span>
            </h1>

            <p className="text-slate-400 max-w-lg text-xl leading-relaxed font-light">
              Practising across <span className="text-white font-medium">Delhi & Mumbai</span>. Specialized in Civil, Commercial, and Criminal litigation with a results-oriented approach.
            </p>

            <div className="flex flex-wrap gap-6 pt-4">
              <a href="#contact" className="bg-blue-600 px-12 py-5 rounded-2xl font-bold hover:bg-blue-500 transition-all shadow-2xl flex items-center gap-3 group text-white">
                Book Consultation <ChevronRight size={20} className="group-hover:translate-x-1 transition-transform"/>
              </a>
              <a href="https://www.linkedin.com/in/yash-dadriwal-8a30161b2/" target="_blank" rel="noreferrer" className="bg-white/5 border border-white/10 px-10 py-5 rounded-2xl font-bold hover:bg-white/10 transition-all flex items-center gap-2 backdrop-blur-sm text-white">
                <Linkedin size={20} className="text-blue-400"/> LinkedIn Profile
              </a>
            </div>
          </div>

          <div className="hidden md:flex justify-end animate-in fade-in zoom-in duration-1000">
            <div className="relative group">
              <div className="absolute -inset-1 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-[3.5rem] blur opacity-25 group-hover:opacity-50 transition duration-1000 group-hover:duration-200"></div>
              <div className="relative bg-slate-900 rounded-[3.5rem] overflow-hidden border border-white/10 shadow-2xl w-full max-w-[420px]">
                <img 
                  src={PROFILE_IMAGE_URL} 
                  alt="Adv. Yash Dadriwal" 
                  className="w-full h-[550px] object-cover object-top filter brightness-95 contrast-105 group-hover:scale-105 transition-transform duration-700"
                />
                <div className="absolute bottom-0 left-0 right-0 p-10 bg-gradient-to-t from-slate-950 via-slate-950/60 to-transparent">
                  <Quote size={32} className="text-blue-500/40 mb-4" />
                  <p className="italic text-2xl text-white font-serif mb-4 leading-tight">"Integrity is the cornerstone of Justice."</p>
                  <div className="flex items-center gap-3">
                    <div className="h-px w-10 bg-blue-500"></div>
                    <p className="text-blue-400 text-[10px] font-black uppercase tracking-[0.4em]">Adv. Yash Dadriwal</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* ABOUT SECTION - THE PROFESSIONAL BIO */}
      <section id="about" className="py-32 bg-white relative overflow-hidden border-b border-slate-100">
        <div className="max-w-7xl mx-auto px-6 relative z-10">
          <div className="grid md:grid-cols-12 gap-16 items-start">
            <div className="md:col-span-4 space-y-10">
              <div className="relative w-40 h-40 rounded-[2rem] overflow-hidden border-4 border-slate-50 shadow-2xl mx-auto md:mx-0 group">
                 <img 
                    src={PROFILE_IMAGE_URL2} 
                    alt="Profile Thumbnail" 
                    className="w-full h-full object-cover transition-transform group-hover:scale-110"
                 />
              </div>

              <div className="space-y-4">
                <h2 className="text-4xl font-serif font-bold text-slate-900 tracking-tight">About <br /></h2>
                <div className="h-1 w-20 bg-blue-600 rounded-full shadow-sm"></div>
              </div>
              
              <div className="space-y-4">
                {[
                  { icon: Award, label: "Enrollment", val: "Maharashtra & Goa Bar (2023)" },
                  { icon: BookOpen, label: "Qualifications", val: "B.A.LL.B (Hons),LL.M. (Corporate & Commercial Law)" },
                  { icon: BookOpen, label: "Credentials", val: "UGC-NET (Law) " },
                  { icon: MapPin, label: "Jurisdictions", val: "Delhi & Mumbai " }
                ].map((item, idx) => (
                  <div key={idx} className="flex items-start gap-4 p-5 bg-slate-50 rounded-3xl border border-slate-100 group hover:border-blue-200 transition-all">
                    <div className="bg-white p-2.5 rounded-xl text-blue-600 shadow-sm group-hover:bg-blue-600 group-hover:text-white transition-all">
                      <item.icon size={22} />
                    </div>
                    <div>
                      <p className="text-[10px] font-black uppercase tracking-widest text-slate-400">{item.label}</p>
                      <p className="text-sm font-bold text-slate-800">{item.val}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="md:col-span-8 space-y-10">
              <div className="prose prose-slate max-w-none">
                <p className="text-xl text-slate-700 leading-relaxed font-light">
                  <span className="font-bold text-blue-900">Yash P. Dadriwal</span> is a disputes lawyer practising across Delhi and Mumbai, with a focused practice in civil, commercial and criminal litigation. An alumnus of <span className="font-semibold text-slate-950 underline decoration-blue-500/30">National Law University, Aurangabad</span> and <span className="font-semibold text-slate-950 underline decoration-blue-500/30">National Law University, Mumbai</span>, he combines strong academic grounding with hands-on courtroom experience before constitutional courts, tribunals and district courts.
                </p>
                
                <p className="text-xl text-slate-700 leading-relaxed py-2">
                  Yash maintains an independent litigation practice, regularly appearing before the <span className="font-medium text-slate-900">Delhi High Court</span> and the <span className="font-medium text-slate-900">Bombay High Court</span>, as well as various district courts and tribunals. His independent work reflects a results-oriented and strategy-driven approach to dispute resolution.
                </p>

                <div className="grid md:grid-cols-2 gap-8 my-8">
                  <div className="p-8 bg-blue-50/50 rounded-[2.5rem] border border-blue-100 space-y-4 group hover:bg-white hover:shadow-xl transition-all duration-500">
                    <div className="flex items-center gap-2 text-blue-800 font-bold uppercase text-[10px] tracking-widest">
                      <History size={16} /> Notable Successes
                    </div>
                    <p className="text-sm text-slate-600 leading-relaxed">
                      Successfully argued and secured a favourable order in a <span className="font-semibold text-blue-950">writ petition challenging an incorrect CLAT-UG question</span> before the Hon'ble Chief Justice of the Delhi High Court.
                    </p>
                  </div>
                  <div className="p-8 bg-slate-900 rounded-[2.5rem] text-white space-y-4 shadow-2xl group hover:-translate-y-1 transition-transform duration-500">
                    <div className="flex items-center gap-2 text-blue-400 font-bold uppercase text-[10px] tracking-widest">
                      <Shield size={16} /> Complex Matters
                    </div>
                    <p className="text-sm text-slate-300 leading-relaxed">
                      Represented clients in <span className="text-white font-medium">landlord–tenant revisions</span>, Section 138 NI Act matters, and secured interim protections in sensitive <span className="text-white">Section 498A IPC</span> criminal proceedings.
                    </p>
                  </div>
                </div>

                <p className="text-xl text-slate-600 leading-relaxed">
                  His exposure extends to <span className="font-medium text-slate-900">high-stakes commercial disputes</span> and arbitration. He has assisted in construction arbitrations concerning breach of contract and project abandonment, as well as multi-jurisdictional defaults under collateral management arrangements.
                </p>

                <div className="pt-8 border-t border-slate-100 mt-8">
                   <p className="font-serif italic text-xl text-blue-900">
                      "Defining the path to justice through meticulous drafting, thorough research, and effective oral advocacy."
                   </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* EXPERTISE SECTION */}
      <section id="expertise" className="py-32 bg-slate-50 relative">
        <div className="max-w-7xl mx-auto px-6 text-center">
          <div className="mb-20">
            <h2 className="text-5xl font-serif font-bold text-slate-900">Practice Specializations</h2>
            <p className="text-blue-600 mt-4 uppercase tracking-[0.3em] text-[10px] font-black">Strategic Advisory & Advocacy</p>
          </div>
          <div className="grid md:grid-cols-3 gap-12 text-left">
            {[
              { 
                title: "Civil & Commercial", 
                icon: Briefcase, 
                list: ["Landlord-Tenant Disputes", "Contractual Breaches", "Revision Petitions", "Real Estate (RERA)"] 
              },
              { 
                title: "Criminal & Matrimonial", 
                icon: Gavel, 
                list: ["Section 138 NI Act", "Section 498A IPC Matters", "Interim Protections", "White Collar Defense"] 
              },
              { 
                title: "Arbitration & ADR", 
                icon: ScaleIcon, 
                list: ["Construction Disputes", "Multi-jurisdictional Defaults", "Mediation Advocacy", "Domestic/Intl Arbitration"] 
              }
            ].map((item, i) => (
              <div key={i} className="group bg-white p-10 rounded-[3rem] border border-slate-100 hover:shadow-2xl transition-all duration-500">
                <div className="bg-blue-50 w-16 h-16 rounded-2xl flex items-center justify-center mb-8 text-blue-900 group-hover:bg-blue-900 group-hover:text-white transition-colors duration-300">
                  <item.icon size={30}/>
                </div>
                <h3 className="text-2xl font-bold mb-6 text-slate-900">{item.title}</h3>
                <ul className="space-y-3">
                   {item.list.map((li, idx) => (
                     <li key={idx} className="flex items-center gap-2 text-sm text-slate-500 font-medium">
                        <Check size={14} className="text-blue-600" /> {li}
                     </li>
                   ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* REVIEWS SECTION */}
      <section id="reviews" className="py-32 bg-white relative overflow-hidden">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-20">
            <h2 className="text-4xl font-serif font-bold text-slate-900">Client Experiences</h2>
            <p className="text-blue-600 mt-4 uppercase tracking-[0.3em] text-[10px] font-black">Professional Peer & Client Feedback</p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {[
              { 
                text: "Advocate Yash provided exceptional clarity on a complex property dispute. His research is meticulous and his court strategy is incredibly sharp.",
                client: "S. K. Verma",
                role: "Director, Real Estate Group"
              },
              { 
                text: "Incredibly professional and approachable. He handled our corporate ADR matter with such precision that we reached a settlement within weeks.",
                client: "Megha Singhania",
                role: "Legal Head, Tech Firm"
              },
              { 
                text: "Efficient, empathetic, and effective. His knowledge of the RERA framework saved our family from years of potential litigation. Highly recommend.",
                client: "Amit Dadwal",
                role: "Individual Client"
              }
            ].map((review, i) => (
              <div key={i} className="bg-slate-50 p-10 rounded-[2.5rem] shadow-sm border border-slate-100 flex flex-col justify-between hover:shadow-xl transition-all group duration-500">
                <div className="flex gap-1 text-yellow-500 mb-8">
                  {[...Array(5)].map((_, j) => <Star key={j} size={16} fill="currentColor" />)}
                </div>
                <p className="text-slate-600 leading-relaxed italic text-sm mb-10 font-medium italic">"{review.text}"</p>
                <div className="flex items-center gap-4">
                  <div className="bg-white p-3 rounded-full text-blue-900 font-bold text-xs uppercase tracking-widest border border-slate-100 shadow-sm">
                    {review.client.split(' ').map(n => n[0]).join('')}
                  </div>
                  <div>
                    <p className="font-bold text-slate-900">{review.client}</p>
                    <p className="text-[10px] uppercase font-black text-slate-400 tracking-tighter">{review.role}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CONTACT SECTION */}
      <section id="contact" className="py-32 bg-[#020617] text-white">
        <div className="max-w-6xl mx-auto px-6">
          <div className="bg-white text-slate-900 rounded-[4rem] p-10 md:p-20 shadow-3xl relative overflow-hidden border border-white/5">
            <div className="absolute top-0 right-0 w-64 h-64 bg-blue-50/30 blur-[100px] -mr-32 -mt-32 rounded-full" />
            
            <div className="grid md:grid-cols-5 gap-20 relative z-10">
              <div className="md:col-span-2 space-y-10">
                <h2 className="text-5xl font-serif font-bold text-slate-900 leading-tight">Begin Your <br />Consultation</h2>
                <p className="text-slate-500 leading-relaxed text-lg font-light">
                  Submit your details securely. Our office will review your case and respond within 24 business hours.
                </p>
                
                <div className="space-y-6 pt-6">
                  <div className="flex items-center gap-5 group cursor-pointer" onClick={() => window.location.href='mailto:advyashdadriwal@gmail.com'}>
                    <div className="bg-blue-50 p-4 rounded-2xl text-blue-950 group-hover:bg-blue-600 group-hover:text-white transition-all shadow-sm">
                      <Mail size={22}/>
                    </div>
                    <div>
                      <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Email Address</p>
                      <p className="font-bold text-slate-900">advyashdadriwal@gmail.com</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-5 group cursor-pointer" onClick={() => window.open('https://www.linkedin.com/in/yash-dadriwal-8a30161b2/', '_blank')}>
                    <div className="bg-blue-50 p-4 rounded-2xl text-blue-950 group-hover:bg-[#0077b5] group-hover:text-white transition-all shadow-sm">
                      <Linkedin size={22}/>
                    </div>
                    <div>
                      <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">LinkedIn Profile</p>
                      <p className="font-bold text-slate-900 underline decoration-blue-500/30">Adv. Yash Dadriwal</p>
                    </div>
                  </div>
                </div>
              </div>

              <div className="md:col-span-3">
                <div className="bg-slate-50 rounded-[3rem] p-8 md:p-12 border border-slate-200 shadow-inner">
                  {submitted ? (
                    <div className="text-center py-20 animate-in fade-in zoom-in">
                      <div className="bg-green-100 p-8 rounded-full w-fit mx-auto mb-8 shadow-lg shadow-green-100">
                        <CheckCircle size={56} className="text-green-600"/>
                      </div>
                      <h3 className="text-3xl font-serif font-bold text-slate-900">Request Received</h3>
                      <p className="text-slate-500 mt-5 max-w-xs mx-auto font-medium text-sm">
                        Your inquiry has been stored in our Supabase database. We will be in touch shortly.
                      </p>
                      <button onClick={() => setSubmitted(false)} className="mt-8 text-blue-600 font-bold hover:underline text-sm tracking-wide">Send another request</button>
                    </div>
                  ) : (
                    <form onSubmit={handleSubmit} className="space-y-6">
                      <div className="grid md:grid-cols-2 gap-6">
                        <div className="space-y-2">
                          <label className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] px-2 flex justify-between items-center">
                            Full Name
                            {initStatus === "missing_keys" && (
                              <span className="text-[8px] text-amber-600 animate-pulse">⚠️ Check .env.local</span>
                            )}
                          </label>
                          <input
                            name="fullName"
                            placeholder="e.g. John Doe"
                            required
                            value={formData.fullName}
                            onChange={handleInputChange}
                            className="w-full bg-white border border-slate-200 p-5 rounded-2xl outline-none focus:ring-4 focus:ring-blue-100 transition-all font-medium text-slate-800 shadow-sm"
                          />
                        </div>
                        <div className="space-y-2">
                          <label className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] px-2">Phone Number</label>
                          <input
                            name="phone"
                            type="tel"
                            placeholder="+91..."
                            required
                            value={formData.phone}
                            onChange={handleInputChange}
                            className="w-full bg-white border border-slate-200 p-5 rounded-2xl outline-none focus:ring-4 focus:ring-blue-100 transition-all font-medium text-slate-800 shadow-sm"
                          />
                        </div>
                      </div>
                      <div className="space-y-2">
                        <label className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] px-2">Email Address</label>
                        <input
                          name="email"
                          type="email"
                          placeholder="client@mail.com"
                          required
                          value={formData.email}
                          onChange={handleInputChange}
                          className="w-full bg-white border border-slate-200 p-5 rounded-2xl outline-none focus:ring-4 focus:ring-blue-100 transition-all font-medium text-slate-800 shadow-sm"
                        />
                      </div>
                      <div className="space-y-2">
                        <label className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] px-2">Legal Query Detail</label>
                        <textarea
                          name="query"
                          rows="4"
                          placeholder="Briefly describe your legal concern..."
                          required
                          value={formData.query}
                          onChange={handleInputChange}
                          className="w-full bg-white border border-slate-200 p-5 rounded-2xl outline-none focus:ring-4 focus:ring-blue-100 transition-all resize-none font-medium text-slate-800 shadow-sm"
                        />
                      </div>

                      {error && (
                        <div className="flex items-center gap-2 text-red-600 bg-red-50 p-4 rounded-2xl text-xs font-bold border border-red-100 shadow-sm">
                          <AlertCircle size={16} />
                          <span>{error}</span>
                        </div>
                      )}

                      <button
                        type="submit"
                        disabled={loading || initStatus === "initializing"}
                        className="w-full bg-[#0f172a] text-white py-6 rounded-[1.5rem] font-bold text-lg hover:bg-blue-900 transition-all shadow-2xl active:scale-95 disabled:opacity-50 flex items-center justify-center gap-3 group"
                      >
                        {loading || initStatus === "initializing" ? (
                          <Loader2 className="animate-spin" />
                        ) : (
                          <>
                            Register Lead <Send size={20} className="group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" />
                          </>
                        )}
                      </button>
                      <p className="text-[9px] text-center text-slate-400 font-bold uppercase tracking-widest pt-2 flex items-center justify-center gap-1">
                        <Shield size={12} className="text-blue-900" /> Secure Legal Cloud Storage Active
                      </p>
                    </form>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* FLOATING ACTION BUTTON */}
      <a
        href="#contact"
        className="fixed bottom-8 right-8 z-40 bg-blue-600 text-white px-8 py-5 rounded-full shadow-[0_20px_50px_rgba(37,99,235,0.4)] hover:bg-blue-700 hover:scale-110 transition-all flex gap-3 items-center font-bold text-sm active:scale-95"
      >
        <Phone size={20}/> Consult Now
      </a>

      {/* FOOTER */}
      <footer className="py-32 bg-white text-center border-t border-slate-100">
        <div className="max-w-7xl mx-auto px-6">
          <ScaleIcon size={40} className="mx-auto text-[#0f172a] mb-8"/>
          <p className="font-serif font-bold text-3xl text-slate-950 tracking-tight uppercase">Yash Dadriwal</p>
          <div className="flex items-center justify-center gap-3 mt-4">
             <Award size={16} className="text-blue-600" />
             <p className="text-[10px] uppercase tracking-[0.5em] text-slate-400 font-black">Justice • Integrity • Excellence</p>
          </div>
          
          <div className="flex justify-center gap-12 mt-12">
            <a href="https://www.linkedin.com/in/yash-dadriwal-8a30161b2/" target="_blank" rel="noreferrer" className="text-slate-400 hover:text-blue-600 transition-all hover:scale-125">
              <Linkedin size={24}/>
            </a>
            <a href="mailto:advyashdadriwal@gmail.com" className="text-slate-400 hover:text-blue-600 transition-all hover:scale-125">
              <Mail size={24}/>
            </a>
          </div>
          
          <div className="mt-20 pt-10 border-t border-slate-50 flex flex-col md:flex-row justify-between items-center gap-6">
             <p className="text-[10px] text-slate-300 font-black uppercase tracking-widest">
                © {new Date().getFullYear()} Yash Dadriwal. All rights reserved.
             </p>
             <div className="flex gap-8 text-[10px] text-slate-400 font-bold uppercase tracking-tighter">
                <a href="#" className="hover:text-blue-600 transition-colors">Privacy Policy</a>
                <a href="#" className="hover:text-blue-600 transition-colors">Legal Notice</a>
                <a href="#" className="hover:text-blue-600 transition-colors">Site Map</a>
             </div>
          </div>
        </div>
      </footer>

    </div>
  );
};

export default App;
