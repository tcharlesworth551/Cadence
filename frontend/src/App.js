import { useState, useEffect, useCallback } from 'react';
import './App.css';

// Temporary test user ID - replace with real auth later
const TEST_USER_ID = '82ffa2e4-79e7-4041-b8e1-3d0795903d4f';
const API = 'http://localhost:5001';

const EMOTIONS = [
  { value: 'disciplined', label: '🧘 Disciplined' },
  { value: 'patient', label: '⏳ Patient' },
  { value: 'fomo', label: '😰 FOMO' },
  { value: 'revenge', label: '😤 Revenge' },
  { value: 'hesitant', label: '😬 Hesitant' },
  { value: 'overconfident', label: '😎 Overconfident' },
];

const PAIRS = [
  'EUR/USD', 'GBP/USD', 'USD/JPY', 'USD/CHF',
  'AUD/USD', 'USD/CAD', 'NZD/USD', 'GBP/JPY',
  'EUR/GBP', 'XAU/USD', 'BTC/USD', 'ETH/USD',
  'SOL/USD', 'Other'
];

function formatTime(dateString) {
  const date = new Date(dateString);
  return date.toLocaleDateString('en-GB', {
    day: 'numeric', month: 'short', hour: '2-digit', minute: '2-digit'
  });
}

export default function App() {
  const [trades, setTrades] = useState([]);
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);
  const [activeTab, setActiveTab] = useState('log');

  // Form state
  const [pair, setPair] = useState('EUR/USD');
  const [direction, setDirection] = useState('');
  const [outcome, setOutcome] = useState('');
  const [emotion, setEmotion] = useState('');
  const [notes, setNotes] = useState('');

  const fetchData = useCallback(async () => {
    try {
      const [tradesRes, statsRes] = await Promise.all([
        fetch(`${API}/api/trades/${TEST_USER_ID}`),
        fetch(`${API}/api/trades/${TEST_USER_ID}/stats`)
      ]);
      const tradesData = await tradesRes.json();
      const statsData = await statsRes.json();
      setTrades(tradesData);
      setStats(statsData);
    } catch (err) {
      console.error('Failed to fetch data:', err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const handleSubmit = async () => {
    if (!direction || !outcome || !emotion) return;
    setSubmitting(true);
    try {
      await fetch(`${API}/api/trades`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          user_id: TEST_USER_ID,
          pair,
          direction,
          outcome,
          emotion,
          screenshot_url: null,
          notes: notes || null
        })
      });
      setSuccess(true);
      setDirection('');
      setOutcome('');
      setEmotion('');
      setNotes('');
      fetchData();
      setTimeout(() => setSuccess(false), 3000);
    } catch (err) {
      console.error('Failed to log trade:', err);
    } finally {
      setSubmitting(false);
    }
  };

  const winRate = stats ? parseFloat(stats.win_rate) || 0 : 0;
  const streak = trades.filter((t, i) => {
    if (i === 0) return t.outcome === 'win';
    return trades[i - 1]?.outcome === 'win' && t.outcome === 'win';
  }).length;

  return (
    <div className="app">
      {/* Header */}
      <div className="header">
        <div className="logo">cadence<span>.</span></div>
        {streak > 0 && (
          <div className="streak-badge">
            🔥 {streak} streak
          </div>
        )}
      </div>

      {/* Stats */}
      <div className="stats-grid">
        <div className="stat-card">
          <div className={`stat-value ${winRate >= 50 ? 'win-rate' : ''}`}>
            {loading ? '—' : `${winRate}%`}
          </div>
          <div className="stat-label">Win Rate</div>
        </div>
        <div className="stat-card">
          <div className="stat-value">
            {loading ? '—' : stats?.total_trades || 0}
          </div>
          <div className="stat-label">Total Trades</div>
        </div>
        <div className="stat-card">
          <div className="stat-value">
            {loading ? '—' : stats?.wins || 0}W / {loading ? '—' : stats?.losses || 0}L
          </div>
          <div className="stat-label">W / L</div>
        </div>
      </div>

      {/* Tabs */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', borderBottom: '1px solid var(--border)' }}>
        {['log', 'history'].map(tab => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            style={{
              background: 'none',
              border: 'none',
              borderBottom: activeTab === tab ? '2px solid var(--accent)' : '2px solid transparent',
              padding: '14px',
              color: activeTab === tab ? 'var(--accent)' : 'var(--text-dim)',
              fontFamily: 'var(--font-ui)',
              fontSize: '13px',
              fontWeight: '600',
              textTransform: 'uppercase',
              letterSpacing: '0.08em',
              cursor: 'pointer',
              transition: 'all 0.15s'
            }}
          >
            {tab === 'log' ? '+ Log Trade' : `History (${trades.length})`}
          </button>
        ))}
      </div>

      {/* Log Trade Tab */}
      {activeTab === 'log' && (
        <div className="section">
          {success && (
            <div className="success-flash" style={{ marginBottom: '16px' }}>
              ✓ Trade logged successfully
            </div>
          )}
          <div className="log-form">

            {/* Pair */}
            <div>
              <div className="field-label">Pair</div>
              <select className="field-input" value={pair} onChange={e => setPair(e.target.value)}>
                {PAIRS.map(p => <option key={p} value={p}>{p}</option>)}
              </select>
            </div>

            {/* Direction */}
            <div>
              <div className="field-label">Direction</div>
              <div className="toggle-group cols-2">
                <button
                  className={`toggle-btn ${direction === 'long' ? 'active-win' : ''}`}
                  onClick={() => setDirection('long')}
                >
                  ↑ Long
                </button>
                <button
                  className={`toggle-btn ${direction === 'short' ? 'active-loss' : ''}`}
                  onClick={() => setDirection('short')}
                >
                  ↓ Short
                </button>
              </div>
            </div>

            {/* Outcome */}
            <div>
              <div className="field-label">Outcome</div>
              <div className="toggle-group cols-3">
                <button
                  className={`toggle-btn ${outcome === 'win' ? 'active-win' : ''}`}
                  onClick={() => setOutcome('win')}
                >
                  Win
                </button>
                <button
                  className={`toggle-btn ${outcome === 'loss' ? 'active-loss' : ''}`}
                  onClick={() => setOutcome('loss')}
                >
                  Loss
                </button>
                <button
                  className={`toggle-btn ${outcome === 'breakeven' ? 'active-accent' : ''}`}
                  onClick={() => setOutcome('breakeven')}
                >
                  B/E
                </button>
              </div>
            </div>

            {/* Emotion */}
            <div>
              <div className="field-label">How did you feel?</div>
              <div className="emotion-grid">
                {EMOTIONS.map(e => (
                  <button
                    key={e.value}
                    className={`emotion-btn ${emotion === e.value ? 'selected' : ''}`}
                    onClick={() => setEmotion(e.value)}
                  >
                    {e.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Notes */}
            <div>
              <div className="field-label">Notes (optional)</div>
              <textarea
                className="notes-input"
                placeholder="What happened? What did you learn?"
                value={notes}
                onChange={e => setNotes(e.target.value)}
              />
            </div>

            <button
              className="submit-btn"
              onClick={handleSubmit}
              disabled={!direction || !outcome || !emotion || submitting}
            >
              {submitting ? 'Logging...' : 'Log Trade →'}
            </button>

          </div>
        </div>
      )}

      {/* History Tab */}
      {activeTab === 'history' && (
        <div className="section">
          {loading ? (
            <div className="loading">Loading trades...</div>
          ) : trades.length === 0 ? (
            <div className="empty-state">
              <span>📋</span>
              No trades logged yet.<br />
              Log your first trade to start building your cadence.
            </div>
          ) : (
            <div className="trade-list">
              {trades.map(trade => (
                <div key={trade.id} className="trade-item">
                  <div>
                    <div className="trade-pair">{trade.pair}</div>
                    <div className="trade-meta">
                      <span className="trade-direction">{trade.direction}</span>
                      <span className="trade-dot" />
                      <span className="trade-emotion">{trade.emotion}</span>
                    </div>
                  </div>
                  <div style={{ textAlign: 'right' }}>
                    <span className={`trade-outcome outcome-${trade.outcome}`}>
                      {trade.outcome === 'breakeven' ? 'B/E' : trade.outcome}
                    </span>
                    <div className="trade-time">{formatTime(trade.created_at)}</div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
