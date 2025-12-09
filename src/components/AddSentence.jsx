import { useState } from 'react';
import '../App.css';

function AddSentence({ user, onAdd }) {
  const [hassani, setHassani] = useState('');
  const [arabic, setArabic] = useState('');
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);
  const [showDuplicateModal, setShowDuplicateModal] = useState(false);
  const [duplicateData, setDuplicateData] = useState(null);

  const handleAdd = async () => {
    if (!hassani.trim() || !arabic.trim()) {
      setMessage({ type: 'error', text: 'يرجى ملء جميع الحقول' });
      return;
    }

    setLoading(true);
    setMessage({ type: '', text: '' });

    try {
      // 1️⃣ التحقق من وجود الجملة مسبقًا
      const checkRes = await fetch(`${import.meta.env.VITE_API_URL}/api/sentences/check`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ hassani: hassani.trim(), arabic: arabic.trim() })
      });

      const checkData = await checkRes.json();

      if (checkData.exists && checkData.sentences.length > 0) {
        // 2️⃣ عرض نافذة التأكيد المخصصة
        setDuplicateData(checkData);
        setShowDuplicateModal(true);
        setLoading(false);
        return;
      }

      // 3️⃣ الإضافة الفعلية إذا لم تكن موجودة
      await addSentence();

    } catch (error) {
      console.error('Error checking sentence:', error);
      setMessage({ type: 'error', text: 'حدث خطأ في التحقق من الجملة' });
      setLoading(false);
    }
  };

  const addSentence = async () => {
    try {
      const res = await fetch(`${import.meta.env.VITE_API_URL}/api/sentences/add`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          hassani: hassani.trim(),
          arabic: arabic.trim(),
          addedBy: user.name
        })
      });

      const data = await res.json();

      if (res.ok) {
        setMessage({ type: 'success', text: '✅ تمت إضافة الجملة بنجاح' });
        setHassani('');
        setArabic('');
        onAdd(); // تحديث القائمة + الإحصائيات

        // إخفاء الرسالة بعد 3 ثواني
        setTimeout(() => {
          setMessage({ type: '', text: '' });
        }, 3000);

      } else {
        setMessage({ type: 'error', text: data.message || 'حدث خطأ في إضافة الجملة' });
      }
    } catch (error) {
      console.error('Error adding sentence:', error);
      setMessage({ type: 'error', text: 'تعذر الاتصال بالخادم' });
    } finally {
      setLoading(false);
    }
  };

  const handleConfirmAdd = async () => {
    setShowDuplicateModal(false);
    setLoading(true);
    await addSentence();
  };

  const handleCancelAdd = () => {
    setShowDuplicateModal(false);
    setLoading(false);
    setMessage({ type: 'warning', text: 'تم إلغاء إضافة الجملة' });
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !loading) {
      handleAdd();
    }
  };

  return (
    <div className="add-sentence-container">
      <div className="add-sentence-header">
        <h3>إضافة جملة جديدة</h3>
        <p>أضف جملة باللهجة الحسانية وترجمتها العربية</p>
      </div>

      <form className="add-sentence-form" onSubmit={(e) => e.preventDefault()}>
        <div className="form-row">
          <div className="form-group">
            <label htmlFor="hassani">الجملة الحسانية *</label>
            <div style={{ position: 'relative' }}>
              <textarea
                id="hassani"
                className="sentence-input hassani"
                placeholder="اكتب الجملة باللهجة الحسانية..."
                value={hassani}
                onChange={(e) => setHassani(e.target.value)}
                onKeyPress={handleKeyPress}
                disabled={loading}
                rows="3"
                required
              />
              <span className="field-icon hassani"></span>
            </div>
          </div>

          <div className="form-group">
            <label htmlFor="arabic">الترجمة العربية *</label>
            <div style={{ position: 'relative' }}>
              <textarea
                id="arabic"
                className="sentence-input arabic"
                placeholder="اكتب الترجمة بالعربية الفصحى..."
                value={arabic}
                onChange={(e) => setArabic(e.target.value)}
                onKeyPress={handleKeyPress}
                disabled={loading}
                rows="3"
                required
              />
              <span className="field-icon arabic"></span>
            </div>
          </div>
        </div>

        <button
          className="add-btn"
          onClick={handleAdd}
          disabled={loading || !hassani.trim() || !arabic.trim()}
        >
          {loading ? (
            <>
              <span className="spinner"></span>
              جاري الإضافة...
            </>
          ) : (
            <>
              <span>➕</span>
              إضافة الجملة
            </>
          )}
        </button>

        {message.text && (
          <div className={`message ${message.type}`}>
            {message.text}
          </div>
        )}
      </form>

      {/* نافذة التأكيد للجمل المكررة */}
      {showDuplicateModal && duplicateData && (
        <div className="duplicate-modal">
          <div className="modal-content">
            <div className="modal-header">
              <h4>⚠️ جملة موجودة مسبقاً</h4>
              <p>تم العثور على جمل مشابهة في قاعدة البيانات:</p>
            </div>

            <div className="modal-body">
              <div className="duplicate-list">
                {duplicateData.sentences.map((sentence, index) => (
                  <div key={index} className="duplicate-item">
                    <div><strong>الحسانية:</strong> {sentence.hassani}</div>
                    <div><strong>العربية:</strong> {sentence.arabic}</div>
                    <div><strong>أضيفت بواسطة:</strong> {sentence.addedBy}</div>
                  </div>
                ))}
              </div>
              <p style={{ color: '#856404', fontSize: '0.9rem' }}>
                هل تريد إضافة هذه الجملة على أي حال؟
              </p>
            </div>

            <div className="modal-actions">
              <button className="modal-btn confirm" onClick={handleConfirmAdd}>
                ✅ نعم، أضفها
              </button>
              <button className="modal-btn cancel" onClick={handleCancelAdd}>
                ❌ لا، ألغِ
              </button>
            </div>
          </div>
        </div>
      )}

      {/* طبقة التحميل */}
      {loading && (
        <div className="loading-overlay">
          <div className="loading-spinner"></div>
        </div>
      )}
    </div>
  );
}

export default AddSentence;