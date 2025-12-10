import React, { useState } from 'react';

const AIAssistantPage = () => {
  const [prompt, setPrompt] = useState('');
  const [response, setResponse] = useState('');
  const [loading, setLoading] = useState(false);

  const getAuthHeaders = () => {
    const token = localStorage.getItem('authToken');
    return { 'Content-Type': 'application/json', 'Authorization': token ? `Bearer ${token}` : '' };
  };

  const handlePromptSubmit = async (e) => {
    e.preventDefault();
    if (!prompt) return;

    setLoading(true);
    setResponse('');

    try {
      const res = await fetch('/api/ai/summary', {
        method: 'POST',
        headers: getAuthHeaders(),
        body: JSON.stringify({ prompt }),
      });

      if (!res.ok) {
        throw new Error(`API error! status: ${res.status}`);
      }

      const summary = await res.text();
      setResponse(summary);

    } catch (error) {
      console.error("Error fetching AI summary:", error);
      setResponse("Sorry, I couldn't generate a summary at this time. Please check the console for more details.");
    } finally {
      setLoading(false);
    }
  };

  const styles = {
    container: {
      minHeight: '100vh',
      padding: '2rem',
      background: `linear-gradient(135deg, #0f172a 0%, #1e293b 100%)`,
      fontFamily: 'Inter, SF Pro Display, system-ui, -apple-system, sans-serif',
      color: '#f9fafb',
    },
    header: {
      marginBottom: '2rem',
    },
    title: { 
      margin: 0, 
      fontSize: '2rem', 
      fontWeight: '800', 
      letterSpacing: '-0.025em',
    },
    assistantContainer: {
      maxWidth: '800px',
      margin: '0 auto',
    },
    promptForm: {
      display: 'flex',
      gap: '1rem',
      marginBottom: '2rem',
    },
    textarea: {
      flexGrow: 1,
      padding: '1rem',
      borderRadius: '10px',
      border: '1px solid #374151',
      backgroundColor: '#1f2937',
      color: '#f9fafb',
      fontSize: '1rem',
      fontFamily: 'inherit',
      resize: 'vertical',
      minHeight: '50px',
    },
    button: {
      background: `linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%)`,
      color: 'white',
      border: 'none',
      padding: '0 2rem',
      borderRadius: '8px',
      cursor: 'pointer',
      fontSize: '1rem',
      fontWeight: '500',
      transition: 'all 0.2s ease-in-out',
    },
    responseCard: {
      backgroundColor: '#111827',
      borderRadius: '12px',
      padding: '2rem',
      border: '1px solid rgba(255, 255, 255, 0.1)',
      whiteSpace: 'pre-wrap', // Preserves line breaks
      lineHeight: '1.6',
    },
    loadingText: {
      color: '#d1d5db',
      fontStyle: 'italic',
    }
  };

  return (
    <div style={styles.container}>
      <div style={styles.header}>
        <h1 style={styles.title}>🤖 AI Assistant</h1>
      </div>
      <div style={styles.assistantContainer}>
        <form onSubmit={handlePromptSubmit} style={styles.promptForm}>
          <textarea
            style={styles.textarea}
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
            placeholder="e.g., Summarize license status by location..."
          />
          <button type="submit" style={styles.button} disabled={loading}>
            {loading ? 'Thinking...' : 'Ask'}
          </button>
        </form>
        
        {(loading || response) && (
          <div style={styles.responseCard}>
            {loading ? (
              <p style={styles.loadingText}>Generating response...</p>
            ) : (
              <p>{response}</p>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default AIAssistantPage;
