import React, { useState } from 'react';

function Login({ onLogin }) {
  const [email, setEmail] = useState('');
  const [code, setCode] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleLogin = async () => {
    if (!email || !code) {
      setError('يرجى ملء البريد الإلكتروني ورمز الدخول');
      return;
    }

    setLoading(true);
    setError('');

    try {
      const res = await fetch(`${import.meta.env.VITE_API_URL}/api/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, code })
      });

      const data = await res.json();

      if (res.ok) {
        onLogin(data.user);
      } else {
        setError(data.message || 'رمز الدخول غير صحيح');
      }
    } catch (err) {
      setError('فشل الاتصال بالخادم، تأكد من تشغيل الباك إند');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-page">
      <div className="login-box">
        <div className="login-logo">
          <span>قاموس اللهجة الحسانية</span>
        </div>

        <h2>مرحباً بعودتك</h2>
        <p>سجل دخولك لإضافة وتعديل الجمل</p>

        <div className="login-form">
          <div className="input-group">
            <input
              type="email"
              placeholder="البريد الإلكتروني"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && handleLogin()}
              disabled={loading}
            />
            <span className="icon">✉️</span>
          </div>

          <div className="input-group">
            <input
              type="password"
              placeholder="رمز الدخول"
              value={code}
              onChange={(e) => setCode(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && handleLogin()}
              disabled={loading}
            />
            <span className="icon">🔐</span>
          </div>

          <button 
            className="login-button"
            onClick={handleLogin}
            disabled={loading || !email || !code}
          >
            {loading ? (
              <>جاري التحقق...</>
            ) : (
              <>تسجيل الدخول</>
            )}
          </button>

          {error && <div className="error-alert">{error}</div>}
        </div>

        <div className="login-footer">
          <p>مشروع تطوعي للحفاظ على اللهجة الحسانية</p>
        </div>
      </div>

      {/* خلفية متحركة جميلة */}
      <div className="bg-animation"></div>
    </div>
  );
}

export default Login;