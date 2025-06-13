import "./FaqSection.css";

function FaqSection() {
  const faqs = [
    { id: 1, question: "Is ThryveSpace free to use?" },
    { id: 2, question: "Do I need to create an account?" },
    { id: 3, question: "Is my data safe and private?" },
    { id: 4, question: "Can I use it offline?" },
  ];

  return (
    <section className="faq-section section section-border">
      <div className="section-wrapper">
        <h2 className="faq-title">FAQs</h2>
        <div className="faq-list">
          {faqs.map((faq) => (
            <div key={faq.id} className="faq-item">
              <span className="faq-question">{faq.question}</span>
              <span className="faq-icon">+</span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

export default FaqSection;
