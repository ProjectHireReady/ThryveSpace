import { Lightbulb } from "lucide-react";
import "./InsightBanner.css";

export default function InsightBanner({ type = "tip", message }) {
    if (!message) return null;

    return (
        <div className={`insight-banner ${type}`}>
            <Lightbulb className="insight-icon" size={20} />
            <span className="insight-text">{message}</span>
        </div>
    );
}
