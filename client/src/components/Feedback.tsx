import { useState } from 'react';
import { t } from '../utils/i18n';

export function Feedback() {
  const [category, setCategory] = useState('Bug');
  const [subject, setSubject] = useState('');
  const [description, setDescription] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [successMsg, setSuccessMsg] = useState('');

  const API_URL = "http://localhost:3000";

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setIsSubmitting(true);
    setSuccessMsg('');

    const token = localStorage.getItem('token');
    
    try {
      const res = await fetch(`${API_URL}/feedback`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          category,
          subject,
          description
        })
      });

      if (!res.ok) {
        throw new Error("Failed to send feedback");
      }

      setSuccessMsg(t('feedback_success'));
      setCategory('Bug');
      setSubject('');
      setDescription('');
    } catch (err) {
      alert("Error submitting feedback. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '80vh' }}>
      <div className="card" style={{ width: '100%', maxWidth: '600px' }}>
        <h2 className="page-title">{t('feedback_form_title')}</h2>
        
        {successMsg && (
          <div style={{ padding: '16px', backgroundColor: 'rgba(16, 185, 129, 0.1)', border: '1px solid var(--success)', borderRadius: '6px', color: 'var(--success)', marginBottom: '24px', fontWeight: 600 }}>
            ✓ {successMsg}
          </div>
        )}

        <form onSubmit={handleSubmit}>
          <label>{t('category')}</label>
          <select 
            value={category} 
            onChange={e => setCategory(e.target.value)}
            style={{ width: "100%", padding: "10px 12px", border: "1px solid var(--border)", backgroundColor: "var(--input-bg)", color: "var(--text-main)", borderRadius: "6px", marginBottom: "20px", fontSize: "14px" }}
          >
            <option value="Bug">{t('bug')}</option>
            <option value="Improvement">{t('improvement')}</option>
            <option value="Question">{t('question')}</option>
            <option value="Other">{t('other')}</option>
          </select>

          <label>{t('subject')}</label>
          <input 
            type="text" 
            placeholder="E.g., App crashes on login" 
            value={subject} 
            onChange={e => setSubject(e.target.value)} 
            required 
            style={{ width: "100%", padding: "10px 12px", border: "1px solid var(--border)", backgroundColor: "var(--input-bg)", color: "var(--text-main)", borderRadius: "6px", marginBottom: "20px", fontSize: "14px", boxSizing: "border-box" }}
          />

          <label>{t('feedback_description')}</label>
          <textarea 
            rows={5} 
            placeholder="Please provide details..." 
            value={description} 
            onChange={e => setDescription(e.target.value)} 
            required 
            style={{ width: "100%", padding: "10px 12px", border: "1px solid var(--border)", backgroundColor: "var(--input-bg)", color: "var(--text-main)", borderRadius: "6px", marginBottom: "20px", fontSize: "14px", resize: "vertical", boxSizing: "border-box" }}
          />

          <button type="submit" className="btn btn-primary" style={{ width: '100%', padding: '12px' }} disabled={isSubmitting}>
            {isSubmitting ? '...' : t('send_feedback')}
          </button>
        </form>
      </div>
    </div>
  );
}
