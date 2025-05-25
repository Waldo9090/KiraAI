"use client";
import React, { useState } from "react";
import { Upload, ChevronDown, FileText, MessageSquare, Bot, Chrome } from "lucide-react";
import SharedNav from "../shared-nav";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import { db } from "@/lib/firebase/config";
import { collection, addDoc, serverTimestamp, Timestamp } from "firebase/firestore";

const EXAMPLES = [
  {
    type: "text",
    text: "A triangle has sides of 3 cm and 4 cm. What is the hypotenuse?"
  },
  {
    type: "text",
    text: "An isosceles triangle has a base of 10 cm and two sides of 13 cm.\n\nFind:\n1. The height of the triangle;\n2. The area of the triangle."
  },
  {
    type: "photo",
    alt: "Math Problem Image"
  },
  {
    type: "photo",
    alt: "Math Problem Image"
  }
];

const FAQS = [
  {
    q: "Is this math solver free to use online?",
    a: "Absolutely! Our math solver is available for everyone, anytime, on any device. No sign up needed—just visit the site and start solving your math questions."
  },
  {
    q: "Can I scan math problems with a photo?",
    a: "Yes! You can upload or drag-and-drop a picture or screenshot of your math problem. Our math solver will read it and provide a step-by-step solution."
  },
  {
    q: "What can I do with this math solver?",
    a: "Teachers can check homework and create new math questions. Parents and students can learn formulas and understand mistakes. Professionals can analyze advanced math content, too."
  },
  {
    q: "Do I need to register to use the math solver?",
    a: "No registration is required. Get instant math answers and explanations for free—no sign up, no hassle."
  },
  {
    q: "What are the best AI tools for solving math problems?",
    a: "There are many great math solvers out there, but our tool stands out for its flexibility: type your question, upload a photo, or scan a document. Get fast, accurate math help whenever you need it."
  }
];

export default function MathSolverPage() {
  const [faqOpen, setFaqOpen] = useState<number | null>(null);
  const [inputValue, setInputValue] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();
  const { user } = useAuth();

  const handleSubmit = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    setError(null);
    if (!inputValue.trim()) return;
    if (!user || !user.email) {
      router.push("/login");
      return;
    }
    if (!db) {
      setError("Database is not available. Please try again later.");
      return;
    }
    setLoading(true);
    try {
      // 1. Create a new chat document in Firestore
      const userChatsCollectionPath = `savedHistory/${user.email}/chats`;
      const initialChatData = {
        userId: user.uid,
        title: inputValue.slice(0, 40) || "Math Solver Chat",
        createdAt: serverTimestamp(),
        messages: [
          {
            sender: "user",
            text: inputValue,
            timestamp: Timestamp.now(),
          },
        ],
      };
      const newChatRef = await addDoc(collection(db, userChatsCollectionPath), initialChatData);
      // 2. Redirect to /chat/[chatId]
      router.push(`/chat/${newChatRef.id}`);
    } catch (err) {
      setError("Failed to start chat. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-purple-50 via-white to-white dark:from-gray-900 dark:via-gray-950 dark:to-gray-950">
      <SharedNav />
      {/* Hero Section */}
      <section className="max-w-4xl mx-auto pt-12 pb-8 px-4 text-center">
        <h1 className="text-4xl md:text-5xl font-extrabold mb-4 dark:text-white">Your All-in-One AI Math Solver</h1>
        <p className="text-lg text-gray-700 dark:text-gray-300 mb-8">Solve math problems in seconds—just upload a photo or type your question. Our AI-powered math solver helps you learn, practice, and master math concepts faster than ever.</p>
        <form onSubmit={handleSubmit} className="flex flex-col md:flex-row gap-6 justify-center items-stretch bg-white/80 dark:bg-gray-900/80 rounded-2xl shadow-lg p-6 max-w-3xl mx-auto">
          {/* Upload Box */}
          <div className="flex-1 flex flex-col items-center justify-center border-2 border-dashed border-purple-300 rounded-xl p-6 min-h-[220px] bg-white dark:bg-gray-900">
            <Upload className="w-10 h-10 text-purple-400 mb-2" />
            <span className="text-gray-700 dark:text-gray-200 mb-2">Drop a math image here or <span className="text-purple-500 underline cursor-pointer">choose a file</span></span>
            <label className="inline-block bg-purple-100 text-purple-700 px-4 py-2 rounded-lg cursor-pointer mb-2 text-base font-medium">
              Upload Math Photo
              <input type="file" className="hidden" />
            </label>
            <span className="text-xs text-gray-400">Max file size: 32MB</span>
          </div>
          {/* Math Input */}
          <div className="flex-1 flex flex-col">
            <textarea
              className="w-full h-full min-h-[160px] rounded-xl border border-gray-200 dark:border-gray-700 p-4 text-base bg-white dark:bg-gray-900 dark:text-gray-100 resize-none"
              placeholder="Type your math question or equation here..."
              value={inputValue}
              onChange={e => setInputValue(e.target.value)}
              disabled={loading}
            />
          </div>
        </form>
        <div className="flex justify-end mt-6">
          <button
            className="px-10 py-3 rounded-xl bg-gradient-to-r from-purple-500 to-pink-500 text-white font-semibold text-lg shadow hover:from-purple-600 hover:to-pink-600 transition disabled:opacity-60"
            onClick={handleSubmit}
            disabled={loading || !inputValue.trim()}
            type="button"
          >
            {loading ? "Starting..." : "Solve Now"}
          </button>
        </div>
        {error && <div className="text-red-500 mt-2">{error}</div>}
      </section>

      {/* Example Questions */}
      <section className="max-w-5xl mx-auto px-4 mt-8">
        <div className="flex flex-wrap gap-4 justify-center">
          {EXAMPLES.map((ex, i) => (
            <div key={i} className="bg-white dark:bg-gray-900 rounded-xl shadow p-4 w-64 min-h-[100px] flex flex-col items-start border border-gray-100 dark:border-gray-800">
              {ex.type === "text" ? (
                <span className="text-gray-900 dark:text-gray-100 text-base whitespace-pre-line">{ex.text}</span>
              ) : (
                <div className="w-full flex flex-col items-center">
                  <div className="w-32 h-32 bg-yellow-50 dark:bg-yellow-900 rounded-lg flex items-center justify-center">
                    <span className="text-gray-700 dark:text-gray-100">Math Problem Image</span>
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      </section>

      {/* Why Choose Section */}
      <section className="max-w-5xl mx-auto px-4 mt-16">
        <h2 className="text-3xl font-bold text-center mb-6 dark:text-white">Why Use This Math Solver?</h2>
        <p className="text-center text-gray-700 dark:text-gray-300 mb-8">Check homework, learn from mistakes, and master math concepts with instant, step-by-step solutions.</p>
        <div className="bg-gradient-to-br from-green-50 via-yellow-50 to-pink-50 dark:from-gray-800 dark:via-gray-900 dark:to-gray-900 rounded-2xl p-8 flex flex-col md:flex-row items-center gap-8 shadow">
          <div className="flex-1">
            <h3 className="text-2xl font-bold mb-2 dark:text-white">Free Math Help for Everyone</h3>
            <p className="text-gray-700 dark:text-gray-300 mb-4">Whether you're a student, parent, or teacher, our math solver gives you instant answers and clear explanations—so you can learn and improve faster.</p>
            <ul className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-6">
              <li className="flex flex-col items-center text-center">
                <span className="text-2xl mb-2">🧑‍🏫</span>
                <span className="font-semibold mb-1 dark:text-white">Teaching Support</span>
                <span className="text-gray-600 dark:text-gray-300 text-sm">Create math lessons, get teaching tips, and check homework with ease.</span>
              </li>
              <li className="flex flex-col items-center text-center">
                <span className="text-2xl mb-2">🪄</span>
                <span className="font-semibold mb-1 dark:text-white">Formula Interpreter</span>
                <span className="text-gray-600 dark:text-gray-300 text-sm">Quickly understand new math concepts and formulas with AI help.</span>
              </li>
              <li className="flex flex-col items-center text-center">
                <span className="text-2xl mb-2">💡</span>
                <span className="font-semibold mb-1 dark:text-white">Multiple Ways to Solve</span>
                <span className="text-gray-600 dark:text-gray-300 text-sm">Type your question, upload a photo, or scan a document—get answers your way.</span>
              </li>
            </ul>
          </div>
          <div className="flex-1 flex justify-center">
            <div className="w-[340px] h-[220px] bg-white dark:bg-gray-900 rounded-xl shadow flex items-center justify-center">
              <span className="text-4xl text-purple-300">🧮</span>
            </div>
          </div>
        </div>
      </section>

      {/* How to Use Section */}
      <section className="max-w-5xl mx-auto px-4 mt-16">
        <h2 className="text-3xl font-bold text-center mb-8 dark:text-white">How to Use the Math Solver</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="flex flex-col items-center bg-white dark:bg-gray-900 rounded-xl shadow p-6">
            <Upload className="w-10 h-10 text-purple-400 mb-4" />
            <h3 className="font-semibold mb-2 dark:text-white">Step 1</h3>
            <p className="text-gray-700 dark:text-gray-300 text-center text-sm">Upload or type your math problem. You can drag and drop an image, screenshot, or file, or just type your question.</p>
          </div>
          <div className="flex flex-col items-center bg-white dark:bg-gray-900 rounded-xl shadow p-6">
            <FileText className="w-10 h-10 text-purple-400 mb-4" />
            <h3 className="font-semibold mb-2 dark:text-white">Step 2</h3>
            <p className="text-gray-700 dark:text-gray-300 text-center text-sm">Click "Solve Now" and our AI will analyze your problem and generate a step-by-step answer.</p>
          </div>
          <div className="flex flex-col items-center bg-white dark:bg-gray-900 rounded-xl shadow p-6">
            <MessageSquare className="w-10 h-10 text-purple-400 mb-4" />
            <h3 className="font-semibold mb-2 dark:text-white">Step 3</h3>
            <p className="text-gray-700 dark:text-gray-300 text-center text-sm">Review the solution and learn how to solve similar problems in the future.</p>
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="max-w-3xl mx-auto px-4 mt-16 mb-16">
        <h2 className="text-3xl font-bold text-center mb-8 dark:text-white">Frequently Asked Questions</h2>
        <div className="flex flex-col gap-4">
          {FAQS.map((faq, i) => (
            <div key={i} className="bg-white dark:bg-gray-900 rounded-xl shadow p-4">
              <button className="w-full flex justify-between items-center text-left font-semibold text-gray-900 dark:text-white text-lg" onClick={() => setFaqOpen(faqOpen === i ? null : i)}>
                {faq.q}
                <ChevronDown className={`w-5 h-5 ml-2 transition-transform ${faqOpen === i ? 'rotate-180' : ''}`} />
              </button>
              {faqOpen === i && (
                <div className="mt-3 text-gray-700 dark:text-gray-300 text-base">{faq.a}</div>
              )}
            </div>
          ))}
        </div>
      </section>

      {/* AI Toolkit Section */}
      <section className="w-full bg-gradient-to-b from-purple-100 to-purple-300 dark:from-gray-900 dark:to-gray-800 py-16">
        <div className="max-w-6xl mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-12 dark:text-white">Math Solver Toolkit</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="bg-white dark:bg-gray-900 rounded-xl shadow p-8 flex flex-col items-center">
              <FileText className="w-10 h-10 text-purple-400 mb-4" />
              <h3 className="font-semibold text-xl mb-2 dark:text-white">PDF Math Chat</h3>
              <p className="text-gray-700 dark:text-gray-300 text-center">Chat with your math PDFs and get instant explanations.</p>
            </div>
            <div className="bg-white dark:bg-gray-900 rounded-xl shadow p-8 flex flex-col items-center">
              <Bot className="w-10 h-10 text-purple-400 mb-4" />
              <h3 className="font-semibold text-xl mb-2 dark:text-white">AI Math Bot</h3>
              <p className="text-gray-700 dark:text-gray-300 text-center">Ask any math question and get a clear, step-by-step answer.</p>
            </div>
            <div className="bg-white dark:bg-gray-900 rounded-xl shadow p-8 flex flex-col items-center">
              <Chrome className="w-10 h-10 text-purple-400 mb-4" />
              <h3 className="font-semibold text-xl mb-2 dark:text-white">Side-by-Side Math Help</h3>
              <p className="text-gray-700 dark:text-gray-300 text-center">Use our math solver alongside your work for quick help anytime.</p>
            </div>
          </div>
        </div>
      </section>

      {/* --- BEGIN: Extra Content Section --- */}
      <section className="max-w-4xl mx-auto px-4 mt-16 text-left space-y-8">
        <div>
          <h2 className="text-2xl font-bold mb-2 dark:text-white">Sample AI Math Solver Questions</h2>
          <ul className="space-y-4">
            <li>
              <b>text</b><br />
              A right triangle has legs measuring 3 cm and 4 cm. Find the length of the hypotenuse using the AI math solver.
            </li>
            <li>
              <b>text</b><br />
              Given an isosceles triangle with a base of 10 cm and equal sides of 13 cm each.<br />
              <br />
              Find:<br />
              1. The height of the isosceles triangle;<br />
              2. The area of the isosceles triangle.<br />
              Let the AI math solver show you the steps!
            </li>
            <li>
              <b>photo</b><br />
              Upload a math problem image and let the AI math solver analyze and solve it instantly.
            </li>
            <li>
              <b>photo</b><br />
              Snap a picture of your math homework and get step-by-step solutions from the AI math solver.
            </li>
          </ul>
        </div>
        <div>
          <h2 className="text-2xl font-bold mb-2 dark:text-white">Why Choose Chat AI Math Solver?</h2>
          <p className="mb-2">Chat AI Math Solver is your all-in-one AI math solver for homework, learning, and mastering new math concepts. With advanced AI, you get fast, accurate answers and clear explanations every time.</p>
          <ul className="list-disc ml-6 space-y-2">
            <li><b>Free AI Math Homework Assistant:</b> Chat AI Math Solver is a free online AI math solver for students, parents, and teachers. Instantly check answers, get step-by-step solutions, and learn from mistakes with AI-powered explanations.</li>
            <li><b>AI-Powered Teaching Utility:</b> Teachers can use the AI math solver to create math materials, get teaching tips, and correct homework efficiently with the help of artificial intelligence.</li>
            <li><b>Advanced Formula Interpretation:</b> Whether you're a student or a professional, Chat AI Math Solver helps you understand new math concepts and formulas quickly using AI.</li>
            <li><b>Multiple Ways to Solve:</b> Type your question, upload a photo, or scan a document—our AI math solver adapts to your needs for fast, accurate results.</li>
          </ul>
        </div>
        <div>
          <h2 className="text-2xl font-bold mb-2 dark:text-white">How to Use Chat AI Math Solver</h2>
          <ol className="list-decimal ml-6 space-y-2">
            <li>
              <b>Step 1:</b> Upload your math problem, type it in, or drag and drop an image or document. The AI math solver supports photos, screenshots, PDFs, DOCs, and PPTs.
            </li>
            <li>
              <b>Step 2:</b> Click "Solve Now" and let the AI math solver analyze your problem and generate a detailed, step-by-step answer.
            </li>
            <li>
              <b>Step 3:</b> Review the AI-generated solution, explore related concepts, and strengthen your math skills with instant feedback.
            </li>
          </ol>
        </div>
        <div>
          <h2 className="text-2xl font-bold mb-2 dark:text-white">Frequently Asked Questions about AI Math Solver</h2>
          <div className="space-y-4">
            <div>
              <b>Can I use Chat AI Math Solver online for free?</b><br />
              Yes! Chat AI Math Solver is a completely free AI math solver you can use on any device. No sign up required—just visit the site and start solving math problems with AI.
            </div>
            <div>
              <b>Can I use the AI math solver to scan math problems from pictures?</b><br />
              Absolutely. Upload or drag-and-drop a photo or screenshot of your math problem, and the AI math solver will read and solve it for you instantly.
            </div>
            <div>
              <b>What can I do with Chat AI Math Solver?</b><br />
              Teachers can check homework, create test questions, and write teaching materials. Parents and students can learn formulas and understand mistakes. Professionals can analyze advanced math documents—all with the help of the AI math solver.
            </div>
            <div>
              <b>Is Chat AI Math Solver really free, with no sign up?</b><br />
              Yes—get answers to your math questions in seconds, no registration needed. The AI math solver is always available for you.
            </div>
            <div>
              <b>What is the best AI tool for solving math problems?</b><br />
              Chat AI Math Solver is one of the best AI math solvers available, offering flexibility to type questions, upload photos, or scan documents for fast, accurate help.
            </div>
          </div>
        </div>
        <div>
          <h2 className="text-2xl font-bold mb-2 dark:text-white">Chat AI Math Solver Toolkit</h2>
          <p className="mb-2">Discover the right AI math solver tool for every challenge—right at your fingertips.</p>
          <ul className="list-disc ml-6 space-y-2">
            <li><b>PDF Math Chat:</b> Chat with your math PDFs and get instant, AI-powered explanations.</li>
            <li><b>AI Math Bot:</b> Ask any math question and get a clear, step-by-step answer from the AI math solver.</li>
            <li><b>Side-by-Side Math Help:</b> Use Chat AI Math Solver alongside your work for quick, AI-driven help whenever you need it.</li>
          </ul>
        </div>
      </section>
      {/* --- END: Extra Content Section --- */}
    </div>
  );
} 