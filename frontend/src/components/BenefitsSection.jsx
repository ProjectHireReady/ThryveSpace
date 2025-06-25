import "./BenefitsSection.css";

function BenefitsSection() {
  return (
    // This section highlights the main benefits of using ThryveSpace
    <section className="benefits-section section section-border">
      <div className="section-wrapper">
        <h2 className="benefits-section">Why ThryveSpace?</h2>
      </div>

      {/* Container for the three core benefits */}
      <div className="benefits-container">
        <div className="benefit-item">
          <div className="outer-circle">
            <div className="inner-circle">1</div>
          </div>
          <h3 className="benefit-title">Simple</h3>
          <p className="benefit-desc">
            Easy to use. Track moods and inputs in moments. No complexity.
          </p>
        </div>

         {/* Divider between Benefit 1 and 2 */}
        <div className="divider" />

        <div className="benefit-item">
          <div className="outer-circle">
            <div className="inner-circle">2</div>
          </div>
          <h3 className="benefit-title">Private</h3>
          <p className="benefit-desc">
            Your privacy first. Data stored locally. Account optional. You
            control.
          </p>
        </div>

       {/* Divider between Benefit 2 and 3 */}

        <div className="benefit-item">
          <div className="outer-circle">
            <div className="inner-circle">3</div>
          </div>
          <h3 className="benefit-title">Supportive</h3>
          <p className="benefit-desc">
            Gentle AI prompts. Encouraging and helpful, not intrusive.
          </p>
        </div>
      </div>
    </section>
  );
}

export default BenefitsSection;
