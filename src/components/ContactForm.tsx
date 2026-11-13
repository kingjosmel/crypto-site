"use client";

import { useState } from "react";

export function ContactForm() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [orderNumber, setOrderNumber] = useState("");
  const [message, setMessage] = useState("");
  const [status, setStatus] = useState<"idle" | "submitting" | "success" | "error">("idle");
  const [submittedData, setSubmittedData] = useState<{ name: string; email: string } | null>(null);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !email.trim() || !message.trim()) {
      setStatus("error");
      return;
    }

    setStatus("submitting");
    setTimeout(() => {
      setSubmittedData({ name: name.trim(), email: email.trim() });
      setStatus("success");
      setName("");
      setEmail("");
      setOrderNumber("");
      setMessage("");
    }, 700);
  };

  if (status === "success" && submittedData) {
    return (
      <div className="bg-[#f0fdf4] border border-[#bbf7d0] p-8 rounded-xs text-neutral-900 my-6">
        <div className="flex items-center gap-3 mb-3">
          <div className="w-8 h-8 rounded-full bg-[#10b981] text-white flex items-center justify-center font-bold text-sm">
            ✓
          </div>
          <div>
            <h3 className="font-semibold text-base text-neutral-950">Message Sent Successfully</h3>
            <p className="text-xs text-neutral-600">Reference ticket opened for {submittedData.name}</p>
          </div>
        </div>
        <p className="text-xs text-neutral-700 leading-relaxed mb-4">
          Thank you for getting in touch. Our concierge team has received your message and will reply to{" "}
          <strong className="text-neutral-900 font-mono">{submittedData.email}</strong> within 1 to 2 business hours.
        </p>
        <button
          type="button"
          onClick={() => setStatus("idle")}
          className="px-4 py-2 bg-neutral-950 text-white text-xs font-semibold uppercase tracking-wider rounded-xs hover:bg-neutral-800 transition-colors"
        >
          Send Another Message
        </button>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="bg-white border border-[#dcdcdc] p-6 sm:p-8 rounded-xs space-y-5 my-6">
      <div className="border-b border-[#dcdcdc] pb-4">
        <h2 className="font-serif text-xl text-neutral-950 font-normal">Send Us a Message</h2>
        <p className="text-xs text-neutral-500 mt-1">
          Have an inquiry regarding sizing, cryptocurrency checkout, or delivery coordination? Drop us a note below.
        </p>
      </div>

      {status === "error" && (
        <div className="p-3 bg-red-50 border border-red-200 text-red-700 text-xs rounded-xs">
          Please fill in your name, email, and message before submitting.
        </div>
      )}

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <label htmlFor="contact-name" className="block text-xs font-bold uppercase tracking-wider text-neutral-700 mb-1.5">
            Your Name <span className="text-red-500">*</span>
          </label>
          <input
            id="contact-name"
            type="text"
            required
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="e.g. Alex Morgan"
            className="w-full bg-[#ebebeb] border border-[#cccccc] px-3.5 py-2.5 text-xs text-neutral-900 rounded-xs focus:outline-none focus:border-black transition-colors"
          />
        </div>

        <div>
          <label htmlFor="contact-email" className="block text-xs font-bold uppercase tracking-wider text-neutral-700 mb-1.5">
            Email Address <span className="text-red-500">*</span>
          </label>
          <input
            id="contact-email"
            type="email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="alex@example.com"
            className="w-full bg-[#ebebeb] border border-[#cccccc] px-3.5 py-2.5 text-xs text-neutral-900 rounded-xs focus:outline-none focus:border-black transition-colors"
          />
        </div>
      </div>

      <div>
        <label htmlFor="contact-order" className="block text-xs font-bold uppercase tracking-wider text-neutral-700 mb-1.5">
          Order Number <span className="text-neutral-400 font-normal normal-case">(optional, if inquiring about an order)</span>
        </label>
        <input
          id="contact-order"
          type="text"
          value={orderNumber}
          onChange={(e) => setOrderNumber(e.target.value)}
          placeholder="e.g. NS-00000001"
          className="w-full bg-[#ebebeb] border border-[#cccccc] px-3.5 py-2.5 text-xs text-neutral-900 rounded-xs focus:outline-none focus:border-black transition-colors font-mono"
        />
      </div>

      <div>
        <label htmlFor="contact-message" className="block text-xs font-bold uppercase tracking-wider text-neutral-700 mb-1.5">
          Your Message <span className="text-red-500">*</span>
        </label>
        <textarea
          id="contact-message"
          rows={5}
          required
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          placeholder="How can we assist you today? Let us know about specific items, sizing, crypto transfers, or delivery arrangements..."
          className="w-full bg-[#ebebeb] border border-[#cccccc] p-3.5 text-xs text-neutral-900 rounded-xs focus:outline-none focus:border-black transition-colors resize-y"
        />
      </div>

      <div className="flex items-center justify-between pt-2">
        <span className="text-[11px] text-neutral-500">
          Typical response time: under 2 hours
        </span>
        <button
          type="submit"
          disabled={status === "submitting"}
          className="px-6 py-3 bg-neutral-950 text-white text-xs font-semibold uppercase tracking-widest rounded-xs hover:bg-neutral-800 disabled:opacity-50 transition-colors cursor-pointer"
        >
          {status === "submitting" ? "Sending…" : "Send Message"}
        </button>
      </div>
    </form>
  );
}
