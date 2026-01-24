"use client"

import { useState } from "react"

const faqs = [
  {
    question: "What is InsureSense?",
    answer:
      "InsureSense is an AI-powered insurance & investment intelligence platform that recommends if, when and what to insure or invest — using real-time external signals and a personalised risk profile.",
  },
  {
    question: "How does the AI decide whether I need insurance now?",
    answer:
      "InsureSense combines your personal context (travel, job, health, assets) with live signals — weather, regional accident rates, health alerts, job-market trends and news — to compute a short-term risk score and timing-aware recommendations.",
  },
  {
    question: "Is my data private and secure?",
    answer:
      "Yes. Personal inputs are processed and stored according to strict privacy rules; sensitive data is never shared with third parties without consent. Explanations and decisions are generated with privacy-preserving practices in mind.",
  },
  {
    question: "How are insurer recommendations chosen?",
    answer:
      "When insurance is recommended, InsureSense filters plans by relevance to your risk, affordability and insurer trust signals (claim settlement history, complaints and transparency), then presents a concise, explainable shortlist.",
  },
  {
    question: "What external data sources power the system?",
    answer:
      "The platform ingests trusted feeds — news, weather, public health alerts, transportation disruption trends and industry job indicators — and aggregates agent outputs to reflect the current external risk landscape.",
  },
  {
    question: "Can I override or ignore recommendations?",
    answer:
      "Absolutely. Recommendations are advisory and fully transparent; you can accept, delay, or customise coverage. The platform explains the why behind each suggestion so you can decide with confidence.",
  },
]

export function InsureSenseFAQ() {
  const [openIndex, setOpenIndex] = useState(0)

  const toggleFAQ = (index: number) => {
    setOpenIndex(openIndex === index ? -1 : index)
  }

  return (
    <div className="w-full">
      {/* Section header - Bold style from Shastra */}
      <div className="mb-12 text-center">
        <p className="mb-4 text-[10px] font-semibold uppercase tracking-[0.4em] text-purple-600">
          FAQ
        </p>
        <h2 className="text-4xl sm:text-5xl lg:text-6xl font-black tracking-[-0.02em] text-gray-900 leading-tight">
          FREQUENTLY<br />
          <span className="bg-clip-text text-transparent bg-gradient-to-r from-purple-600 to-violet-600">ASKED</span>
        </h2>
      </div>

      <div className="flex flex-col gap-2 max-w-3xl mx-auto">
        {faqs.map((faq, index) => (
          <div key={index} className="border-b border-gray-200 py-3">
            <button
              onClick={() => toggleFAQ(index)}
              className="w-full text-left py-6 text-base sm:text-lg font-semibold text-gray-900 hover:text-purple-600 flex justify-between items-center transition-colors group"
              aria-expanded={openIndex === index}
              aria-controls={`faq-answer-${index}`}
            >
              <span>{faq.question}</span>
              <span className={`ml-4 text-gray-400 transition-transform duration-300 ${openIndex === index ? 'rotate-180' : ''}`} aria-hidden="true">▾</span>
            </button>
            {openIndex === index && (
              <div
                id={`faq-answer-${index}`}
                className="pb-6 text-gray-600 leading-relaxed pr-8 animate-in fade-in slide-in-from-top-2 duration-300"
                role="region"
              >
                {faq.answer}
              </div>
            )}
          </div>
        ))}
      </div>

      {/* Contact CTA */}
      <div className="mt-16 text-center">
        <p className="text-[10px] uppercase tracking-[0.3em] text-gray-500 font-semibold mb-3">
          Still have questions?
        </p>
        <a
          href="#contact"
          className="text-base font-semibold text-purple-600 hover:text-purple-700 transition-colors inline-flex items-center gap-2"
        >
          Contact our team <span className="text-xl">→</span>
        </a>
      </div>
    </div>
  )
}

export default InsureSenseFAQ
