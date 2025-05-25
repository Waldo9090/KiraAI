"use client";
import React, { useRef } from "react";
import SharedNav from "../shared-nav";
import { useAuth } from "@/context/AuthContext";
import { useRouter } from "next/navigation";
import { db, storage } from "@/lib/firebase/config";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { doc, setDoc, serverTimestamp } from "firebase/firestore";
import { v4 as uuidv4 } from "uuid";

export default function ChatPPTPage() {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { user } = useAuth();
  const router = useRouter();

  const handleBrowseClick = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || !user?.email) return;
    if (!storage) {
      alert("Firebase storage is not available. Please try again later.");
      return;
    }
    // 1. Generate unique ID
    const pdfId = uuidv4();

    // 2. Upload PDF to Firebase Storage
    const storageRef = ref(storage, `pdfs/${user.email}/${pdfId}/${file.name}`);
    await uploadBytes(storageRef, file);
    const pdfUrl = await getDownloadURL(storageRef);

    // 3. Create Firestore doc
    const pdfDocRef = doc(db, `savedHistory/${user.email}/pdfs/${pdfId}`);
    await setDoc(pdfDocRef, {
      fileName: file.name,
      pdfUrl,
      createdAt: serverTimestamp(),
      messages: [], // Start with empty chat
    });

    // 4. Redirect to chat page for this PDF
    router.push(`/pdf-chat/${pdfId}`);
  };

  return (
    <div className="min-h-screen bg-white dark:bg-gray-950 flex flex-col items-center py-12 px-4">
      <SharedNav />
      <div className="w-full max-w-2xl mx-auto mt-12">
        <h1 className="text-4xl md:text-5xl font-extrabold text-center mb-8 dark:text-white">
          3X better than Chat with PDF
        </h1>
        <div className="border-2 border-dashed border-gray-300 rounded-2xl p-12 flex flex-col items-center justify-center mb-6 bg-white dark:bg-gray-900">
          <div className="text-4xl mb-4 text-gray-400">⬆️</div>
          <div className="text-lg font-semibold mb-1 dark:text-white">Upload single or multiple files</div>
          <div className="text-gray-500 dark:text-gray-300">Drag and drop or click here</div>
          <button
            className="mt-6 bg-purple-600 hover:bg-purple-700 text-white font-semibold px-8 py-3 rounded-lg text-lg transition"
            onClick={handleBrowseClick}
          >
            Browse File
          </button>
          <input
            type="file"
            accept="application/pdf"
            ref={fileInputRef}
            style={{ display: "none" }}
            onChange={handleFileChange}
          />
        </div>
        <div className="flex gap-3 justify-center">
          <button className="bg-gray-100 text-gray-800 px-4 py-2 rounded-lg font-medium flex items-center gap-2 border border-gray-200 dark:bg-gray-800 dark:text-white dark:border-gray-700">
            <span className="bg-white dark:bg-gray-900 border border-gray-300 dark:border-gray-700 rounded px-2 py-0.5 text-sm font-bold mr-2">1</span>
            PDFs left
            <span className="ml-1 text-gray-400 cursor-pointer" title="PDF upload limit">i</span>
          </button>
          <button className="bg-white border border-gray-300 dark:bg-gray-900 dark:border-gray-700 text-gray-800 dark:text-white px-4 py-2 rounded-lg font-medium flex items-center gap-2 hover:bg-gray-50 dark:hover:bg-gray-800">
            <span className="text-lg">📄</span>
            Try out Demo PDF
          </button>
        </div>
      </div>
      <div className="max-w-3xl w-full space-y-10 text-gray-900 dark:text-gray-100">
        <section>
          <h2 className="text-2xl font-bold mb-4">Why Use ChatPPT by ChatAI for AI PPT Summarization?</h2>
          <p className="mb-4">ChatPPT is your all-in-one free AI PPT chat and summarizer tool, designed to help you quickly extract key points, summarize slides, and get instant answers from any PowerPoint file. Whether you're a student, educator, or professional, ChatPPT by ChatAI makes working with PPTs effortless and intelligent.</p>
          <ul className="list-disc ml-6 space-y-2">
            <li>
              <b>AI-Powered PPT Summaries:</b> ChatPPT uses advanced AI models—including GPT-4o Mini, Claude 3 Haiku, DeepSeek R1, DeepSeek V3, Llama 3.3 70B Instruct, and Gamma 3.0—to deliver fast, accurate PowerPoint summaries. Switch between models for the best results on your slides.
            </li>
            <li>
              <b>Chat with Your PPT:</b> Ask questions about your PowerPoint content and get instant, relevant answers. ChatPPT analyzes your slides so you never have to search manually again.
            </li>
            <li>
              <b>Copy, Edit, and Refine Summaries:</b> Instantly copy AI-generated PPT summaries and make quick edits to fit your needs. ChatPPT gives you full control over your summarized content.
            </li>
            <li>
              <b>View and Interact with PPTs Online:</b> No PowerPoint software required! Upload your PPT to ChatPPT and browse, chat, or summarize your presentation online—no sign-up needed.
            </li>
          </ul>
        </section>
        <section>
          <h2 className="text-2xl font-bold mb-4">How to Use ChatPPT (AI PPT Chat & Summarizer)</h2>
          <ol className="list-decimal ml-6 space-y-2">
            <li>
              <b>Step 1:</b> Upload your PPT file by dragging, dropping, or clicking the "Browse File" button in ChatPPT.
            </li>
            <li>
              <b>Step 2:</b> ChatPPT automatically scans, analyzes, and summarizes your uploaded PowerPoint presentation using AI.
            </li>
            <li>
              <b>Step 3:</b> Chat with your PPT, ask questions, or copy summaries using the default AI model (ChatGPT-4o Mini) or switch to another AI for deeper insights.
            </li>
          </ol>
        </section>
        <section>
          <h2 className="text-2xl font-bold mb-4">Frequently Asked Questions about ChatPPT</h2>
          <div className="space-y-4">
            <div>
              <b>Is ChatPPT by ChatAI free?</b><br />
              Yes! ChatPPT is a 100% free AI PPT chat and summarizer tool. Upload your PPT, get instant summaries, and chat with your presentation at no cost.
            </div>
            <div>
              <b>Can ChatPPT summarize PowerPoint slides?</b><br />
              Absolutely. ChatPPT uses ChatGPT-4o Mini and other top AI models to generate high-quality PPT summaries. Just upload your file and let the AI do the work.
            </div>
            <div>
              <b>How does ChatPPT ensure summary accuracy?</b><br />
              By leveraging multiple advanced AI models, ChatPPT scans and analyzes your presentation to extract the most important information, ensuring reliable and accurate summaries.
            </div>
            <div>
              <b>Can ChatPPT extract text and key points from PPT files?</b><br />
              Yes! ChatPPT can extract and summarize text, charts, and images from your PowerPoint slides. Ask any question about your PPT and get targeted answers instantly.
            </div>
            <div>
              <b>Who can benefit from ChatPPT?</b><br />
              Students, educators, professionals, and anyone using Microsoft Office PowerPoint can save time and boost productivity with ChatPPT by ChatAI.
            </div>
          </div>
        </section>
      </div>
    </div>
  );
} 