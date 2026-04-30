import Landing from './Landing';
import { useState, useEffect, useCallback } from 'react';
import './App.css';
import { supabase } from './supabase';
import Auth from './Auth';

const API = process.env.REACT_APP_API_URL || 'http://localhost:5001';

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
  const [session, setSession] = useState(null);
  const [authLoading, setAuthLoading] = useState(true);
  const [trades, setTrades] = useState([]);
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);
  const [insights, setInsights] = useState([]);
  const [activeTab, setActiveTab] = useState('log');

  const [pair, setPair] = useState('EUR/USD');
  const [direction, setDirection] = useState('');
  const [outcome, setOutcome] = useState('');
  const [emotion, setEmotion] = useState('');
  const [notes, setNotes] = useState('');
  const [screenshot, setScreenshot] = useState(null);
  const [screenshotPreview, setScreenshotPreview] = useState(null);
  const [showLanding, setShowLanding] = useState(true);
  

  // Auth state listener
  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      setAuthLoading(false);
    });
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
    });
    return () => subscription.unsubscribe();
  }, []);

  const fetchData = useCallback(async () => {
    if (!session) return;
    try {
      const [tradesRes, statsRes, insightsRes] = await Promise.all([
        fetch(`${API}/api/trades/${session.user.id}`),
        fetch(`${API}/api/trades/${session.user.id}/stats`),
        fetch(`${API}/api/trades/${session.user.id}/insights`)
      ]);
      const tradesData = await tradesRes.json();
      const statsData = await statsRes.json();
      const insightsData = await insightsRes.json();
      setTrades(tradesData);
      setStats(statsData);
      setInsights(insightsData);
    } catch (err) {
      console.error('Failed to fetch data:', err);
    } finally {
      setLoading(false);
    }
  }, [session]);

  useEffect(() => {
    if (session) fetchData();
  }, [session, fetchData]);

  const handleSubmit = async () => {
    if (!direction || !outcome || !emotion) return;
    setSubmitting(true);
    try {
      const formData = new FormData();
      formData.append('user_id', session.user.id);
      formData.append('pair', pair);
      formData.append('direction', direction);
      formData.append('outcome', outcome);
      formData.append('emotion', emotion);
      if (notes) formData.append('notes', notes);
      if (screenshot) formData.append('screenshot', screenshot);

      await fetch(`${API}/api/trades`, {
        method: 'POST',
        body: formData
      });

      setSuccess(true);
      setDirection('');
      setOutcome('');
      setEmotion('');
      setNotes('');
      setScreenshot(null);
      setScreenshotPreview(null);
      setTimeout(() => fetchData(), 500);
      setTimeout(() => setSuccess(false), 3000);
    } catch (err) {
      console.error('Failed to log trade:', err);
    } finally {
      setSubmitting(false);
    }
  };

  const winRate = stats ? parseFloat(stats.win_rate) || 0 : 0;
  const streak = trades.reduce((acc, trade, i) => {
    if (i === 0 && trade.outcome === 'win') return 1;
    if (trade.outcome === 'win' && trades[i-1]?.outcome === 'win') return acc + 1;
    return acc;
  }, 0);

  // Loading screen
  if (authLoading) return (
    <div style={{
      minHeight: '100vh', background: '#0a0a0a',
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      color: '#666', fontFamily: 'JetBrains Mono, monospace', fontSize: '13px'
    }}>
      loading cadence...
    </div>
  );

  // Landing + Auth screen
if (!session && showLanding) return <Landing onGetStarted={() => setShowLanding(false)} />;
if (!session) return <Auth />;

  // Main app
  return (
    <div className="app">

      {/* Header */}
      <div className="header">
        <div className="logo">cadence<span>.</span></div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          {streak > 0 && (
            <div className="streak-badge">🔥 {streak} streak</div>
          )}
          <button
            onClick={() => supabase.auth.signOut()}
            style={{
              background: 'none', border: '1px solid #222', borderRadius: '20px',
              padding: '6px 12px', color: '#666', fontFamily: 'var(--font-ui)',
              fontSize: '12px', cursor: 'pointer'
            }}
          >
            Sign out
          </button>
        </div>
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
            {loading ? '—' : `${stats?.wins || 0}W / ${stats?.losses || 0}L`}
          </div>
          <div className="stat-label">W / L</div>
        </div>
      </div>

      {/* Tabs */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', borderBottom: '1px solid var(--border)' }}>
  {['log', 'history', 'insights'].map(tab => (
    <button
      key={tab}
      onClick={() => setActiveTab(tab)}
      style={{
        background: 'none', border: 'none',
        borderBottom: activeTab === tab ? '2px solid var(--accent)' : '2px solid transparent',
        padding: '14px 8px',
        color: activeTab === tab ? 'var(--accent)' : 'var(--text-dim)',
        fontFamily: 'var(--font-ui)', fontSize: '12px', fontWeight: '600',
        textTransform: 'uppercase', letterSpacing: '0.08em', cursor: 'pointer',
        transition: 'all 0.15s'
      }}
    >
      {tab === 'log' ? '+ Log' : tab === 'history' ? `History (${trades.length})` : '📊 Insights'}
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

            <div>
              <div className="field-label">Pair</div>
              <select className="field-input" value={pair} onChange={e => setPair(e.target.value)}>
                {PAIRS.map(p => <option key={p} value={p}>{p}</option>)}
              </select>
            </div>

            <div>
              <div className="field-label">Direction</div>
              <div className="toggle-group cols-2">
                <button className={`toggle-btn ${direction === 'long' ? 'active-win' : ''}`} onClick={() => setDirection('long')}>↑ Long</button>
                <button className={`toggle-btn ${direction === 'short' ? 'active-loss' : ''}`} onClick={() => setDirection('short')}>↓ Short</button>
              </div>
            </div>

            <div>
              <div className="field-label">Outcome</div>
              <div className="toggle-group cols-3">
                <button className={`toggle-btn ${outcome === 'win' ? 'active-win' : ''}`} onClick={() => setOutcome('win')}>Win</button>
                <button className={`toggle-btn ${outcome === 'loss' ? 'active-loss' : ''}`} onClick={() => setOutcome('loss')}>Loss</button>
                <button className={`toggle-btn ${outcome === 'breakeven' ? 'active-accent' : ''}`} onClick={() => setOutcome('breakeven')}>B/E</button>
              </div>
            </div>

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

            <div>
              <div className="field-label">Notes (optional)</div>
              <textarea
                className="notes-input"
                placeholder="What happened? What did you learn?"
                value={notes}
                onChange={e => setNotes(e.target.value)}
              />
            </div>

<div>
  <div className="field-label">Screenshot (optional)</div>
  <label style={{
    display: 'block',
    background: 'var(--bg-input)',
    border: '1px dashed var(--border)',
    borderRadius: '8px',
    padding: '20px',
    textAlign: 'center',
    cursor: 'pointer',
    transition: 'border-color 0.15s'
  }}
  onMouseOver={e => e.currentTarget.style.borderColor = 'var(--accent)'}
  onMouseOut={e => e.currentTarget.style.borderColor = 'var(--border)'}
  >
    <input
      type="file"
      accept="image/*"
      style={{ display: 'none' }}
      onChange={e => {
        const file = e.target.files[0];
        if (file) {
          setScreenshot(file);
          setScreenshotPreview(URL.createObjectURL(file));
        }
      }}
    />
    {screenshotPreview ? (
      <img
        src={screenshotPreview}
        alt="Screenshot preview"
        style={{ width: '100%', borderRadius: '6px', maxHeight: '200px', objectFit: 'cover' }}
      />
    ) : (
      <div style={{ color: 'var(--text-dim)', fontSize: '13px' }}>
        <div style={{ fontSize: '24px', marginBottom: '8px' }}>📸</div>
        Tap to attach your chart screenshot
      </div>
    )}
  </label>
  {screenshotPreview && (
    <button
      onClick={() => { setScreenshot(null); setScreenshotPreview(null); }}
      style={{
        background: 'none', border: 'none', color: 'var(--text-dim)',
        fontSize: '12px', cursor: 'pointer', marginTop: '6px'
      }}
    >
      Remove screenshot
    </button>
  )}
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
                    {trade.screenshot_url && (
  <div style={{ gridColumn: '1 / -1', marginTop: '10px' }}>
    <img
      src={trade.screenshot_url}
      alt="Trade screenshot"
      style={{ width: '100%', borderRadius: '6px', maxHeight: '180px', objectFit: 'cover', cursor: 'pointer' }}
      onClick={() => window.open(trade.screenshot_url, '_blank')}
    />
  </div>
)}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    {/* Insights Tab */}
{activeTab === 'insights' && (
  <div className="section">
    <div className="section-title">Emotion Performance</div>
    {insights.length === 0 ? (
      <div className="empty-state">
        <span>📊</span>
        Log at least 5 trades to unlock your emotion insights.
      </div>
    ) : (
      <div className="trade-list">
        {insights.map(insight => (
          <div key={insight.emotion} style={{
            background: 'var(--bg-card)',
            border: '1px solid var(--border)',
            borderRadius: '10px',
            padding: '16px',
            marginBottom: '2px'
          }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '10px' }}>
              <div style={{ fontSize: '14px', fontWeight: '500', textTransform: 'capitalize', color: 'var(--text)' }}>
                {insight.emotion}
              </div>
              <div style={{
                fontFamily: 'var(--font-data)',
                fontSize: '18px',
                fontWeight: '500',
                color: parseFloat(insight.win_rate) >= 50 ? 'var(--win)' : 'var(--loss)'
              }}>
                {insight.win_rate}%
              </div>
            </div>
            {/* Progress bar */}
            <div style={{ background: 'var(--bg-input)', borderRadius: '4px', height: '4px', overflow: 'hidden' }}>
              <div style={{
                height: '100%',
                width: `${insight.win_rate}%`,
                background: parseFloat(insight.win_rate) >= 50 ? 'var(--win)' : 'var(--loss)',
                borderRadius: '4px',
                transition: 'width 0.6s ease'
              }} />
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '8px' }}>
              <span style={{ fontSize: '12px', color: 'var(--text-dim)', fontFamily: 'var(--font-data)' }}>
                {insight.total} trades
              </span>
              <span style={{ fontSize: '12px', color: 'var(--text-dim)', fontFamily: 'var(--font-data)' }}>
                {insight.wins}W / {insight.total - insight.wins}L
              </span>
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