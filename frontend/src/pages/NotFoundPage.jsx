import PageTransition from "../components/PageTransition";

export default function NotFoundPage() {
  return (
    <PageTransition>
      <div className="error-page">
        <div className="error-content">
          <h1 className="error-title">404 - Page Not Found</h1>
          <p className="error-message">The page you're looking for doesn't exist.</p>
        </div>
      </div>
    </PageTransition>
  );
}