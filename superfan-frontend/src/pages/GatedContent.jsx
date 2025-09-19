import { useState, useEffect } from "react";
import axios from "axios";
import ConnectXionDaveButton from "../components/ConnectXionDaveButton";
import ConnectZKTLSButton from "../components/ConnectZKTLSButton";

export default function GatedContent({ user }) {
  const [content, setContent] = useState([]);
  const [loading, setLoading] = useState(true);
  const [missingProofs, setMissingProofs] = useState({});

  useEffect(() => {
    const fetchContent = async () => {
      try {
        const res = await axios.get("/api/gated-content");
        setContent(res.data);
        setMissingProofs({}); // Reset missing proofs
      } catch (err) {
        const data = err.response?.data;
        if (data?.missing) {
          setMissingProofs(data.missing);
        }
      } finally {
        setLoading(false);
      }
    };
    fetchContent();
  }, []);

  if (loading) return <p>Loading gated content...</p>;

  // Show missing proof buttons if any
  if (missingProofs?.xionDave || missingProofs?.zktls) {
    return (
      <div>
        <p>🔒 This content requires verification:</p>
        {missingProofs.xionDave && (
          <ConnectXionDaveButton
            userId={user._id}
            onVerified={() => window.location.reload()}
          />
        )}
        {missingProofs.zktls && (
          <ConnectZKTLSButton
            userId={user._id}
            onVerified={() => window.location.reload()}
          />
        )}
      </div>
    );
  }

  if (!content.length) return <p>No gated content available yet.</p>;

  return (
    <div>
      <h1>Exclusive Content</h1>
      {content.map((item) => (
        <div key={item._id} className="card">
          <h3>{item.title}</h3>
          <p>{item.description}</p>
          <a href={item.contentUrl} target="_blank" rel="noopener noreferrer">
            Access
          </a>
        </div>
      ))}
    </div>
  );
}
