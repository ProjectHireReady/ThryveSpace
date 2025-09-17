import PageTransition from "../components/PageTransition";

export default function UnauthorizedPage() {
  return (
    <PageTransition>
      <div className="error-page">
        <div className="error-content">
          <h1 className="error-title access-denied">Access Denied</h1>
          <p className="error-message">You don't have permission to access this page.</p>
        </div>
      </div>
    </PageTransition>
  );
}