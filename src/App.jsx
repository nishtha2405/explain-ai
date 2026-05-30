import { useState, useEffect } from "react";
import ReactMarkdown from "react-markdown";
import { explain } from "./api";

function App() {
  const [topic, setTopic] = useState("");
  const [result, setResult] = useState("");
  const [loading, setLoading] = useState(false);
  const [copied, setCopied] = useState(false);
  const [currentMode, setCurrentMode] = useState("");
  const [history, setHistory] = useState([]);

  useEffect(() => {
    const savedHistory =
      JSON.parse(localStorage.getItem("history")) || [];

    setHistory(savedHistory);
  }, []);

  const saveToHistory = (topic) => {
    const updatedHistory = [
      topic,
      ...history.filter((item) => item !== topic),
    ].slice(0, 5);

    setHistory(updatedHistory);

    localStorage.setItem(
      "history",
      JSON.stringify(updatedHistory)
    );
  };

  const handleMode = async (mode) => {
    if (!topic.trim()) {
      setResult("Please enter a topic.");
      return;
    }

    setLoading(true);
    setCopied(false);
    setCurrentMode(mode);

    try {
      const response = await explain(topic, mode);

      setResult(response);

      saveToHistory(topic);
    } catch (error) {
      console.error(error);
      setResult(
        "❌ Failed to generate explanation. Please try again."
      );
    } finally {
      setLoading(false);
    }
  };

  const copyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(result);

      setCopied(true);

      setTimeout(() => {
        setCopied(false);
      }, 2000);
    } catch (error) {
      console.error(error);
    }
  };

  const handleKeyDown = (e) => {
    if ((e.ctrlKey || e.metaKey) && e.key === "Enter") {
      handleMode("ELI5");
    }
  };

  return (
    <div className="container">
      <h1>ExplainAI 🧠</h1>

      <textarea
        rows="5"
        placeholder="Enter any topic..."
        value={topic}
        onChange={(e) => setTopic(e.target.value)}
        onKeyDown={handleKeyDown}
      />

      <p className="counter">
        Characters: {topic.length}
      </p>

      <div className="button-group">
        <button
          disabled={loading}
          onClick={() => handleMode("ELI5")}
        >
          👶 ELI5
        </button>

        <button
          disabled={loading}
          onClick={() => handleMode("Student")}
        >
          🎓 Student
        </button>

        <button
          disabled={loading}
          onClick={() => handleMode("Expert")}
        >
          🧑‍💻 Expert
        </button>

        <button
          disabled={loading}
          onClick={() => handleMode("Summary")}
        >
          📝 Summary
        </button>

        <button
          disabled={loading}
          onClick={() => handleMode("Quiz")}
        >
          ❓ Quiz
        </button>
      </div>

      {currentMode && (
        <div className="mode-badge">
          Current Mode: {currentMode}
        </div>
      )}

      {loading && (
        <div className="output">
          Generating explanation...
        </div>
      )}

      {result && !loading && (
        <>
          <div className="action-bar">
            <button onClick={copyToClipboard}>
              📋 Copy Response
            </button>

            {copied && (
              <span className="copied">
                ✅ Copied!
              </span>
            )}
          </div>

          <div className="output">
            <ReactMarkdown>
              {result}
            </ReactMarkdown>
          </div>
        </>
      )}

      {history.length > 0 && (
        <div className="history">
          <h3>Recent Topics</h3>

          {history.map((item, index) => (
            <button
              key={index}
              className="history-item"
              onClick={() => setTopic(item)}
            >
              {item}
            </button>
          ))}
        </div>
      )}

      <p className="tip">
        Press ⌘ + Enter (Mac) or Ctrl + Enter
        (Windows/Linux) for a quick ELI5 explanation.
      </p>
    </div>
  );
}

export default App;