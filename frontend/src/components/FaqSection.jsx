import { useState, useRef, useEffect } from "react";
import "./FaqSection.css";

function FaqSection() {
  const faqs = [
    { id: 1, question: "Is ThryveSpace free to use?", answer: "Yes, it is completely free to use." },
    { id: 2, question: "Do I need to create an account?", answer: "Yes, creating an account helps you save progress." },
    { id: 3, question: "Is my data safe and private?", answer: "Absolutely, your data is encrypted and private." },
    { id: 4, question: "Can I use it offline?", answer: "Currently offline usage is limited, but some features work." },
  ];

  const [openId, setOpenId] = useState(null);
  const contentRefs = useRef({});

  const toggleFaq = (id) => {
    setOpenId(openId === id ? null : id);
  };

  // Expand/collapse with maxHeight
  useEffect(() => {
    faqs.forEach((faq) => {
      const el = contentRefs.current[faq.id];
      if (el) {
        if (openId === faq.id) {
          el.style.maxHeight = el.scrollHeight + "px";
        } else {
          el.style.maxHeight = "0px";
        }
      }
    });
  }, [openId, faqs]);

  return (
    <section className="faq-section section section-border">
      <div className="section-wrapper">
        <h2 className="faq-title">FAQs</h2>
        <div className="faq-list">
          {faqs.map((faq) => (
            <div
              key={faq.id}
              className={`faq-item ${openId === faq.id ? "open" : ""}`}
              onClick={() => toggleFaq(faq.id)}
            >
              <div className="faq-header">
                <span className="faq-question">{faq.question}</span>
                <span className="faq-icon">+</span>
              </div>
              <div
                className="faq-content"
                ref={(el) => (contentRefs.current[faq.id] = el)}
              >
                <p className="faq-answer">{faq.answer}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

export default FaqSection;
