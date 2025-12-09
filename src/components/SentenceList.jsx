import { useState, useMemo } from 'react';
import '../App.css';

function SentenceList({ sentences, onDelete }) {
  const [editId, setEditId] = useState(null);
  const [editHassani, setEditHassani] = useState('');
  const [editArabic, setEditArabic] = useState('');
  const [search, setSearch] = useState('');
  const [authorFilter, setAuthorFilter] = useState('all');
  const [loading, setLoading] = useState(false);

  // ✅ استخراج أسماء الكُتاب بدون تكرار
  const authors = useMemo(() => {
    const names = sentences.map(s => s.addedBy || 'غير محدد');
    return ['all', ...new Set(names.filter(name => name !== 'غير محدد'))];
  }, [sentences]);

  // ✅ البحث + الفلترة معًا
  const filteredSentences = useMemo(() => {
    return sentences.filter(s => {
      const searchLower = search.toLowerCase();
      const matchesSearch =
        (s.hassani || '').toLowerCase().includes(searchLower) ||
        (s.arabic || '').toLowerCase().includes(searchLower) ||
        (s.addedBy || '').toLowerCase().includes(searchLower);

      const matchesAuthor =
        authorFilter === 'all' || (s.addedBy || 'غير محدد') === authorFilter;

      return matchesSearch && matchesAuthor;
    });
  }, [sentences, search, authorFilter]);

  const handleDelete = async (id) => {
    if (!window.confirm('هل أنت متأكد من حذف هذه الجملة؟')) return;

    setLoading(true);
    try {
      const response = await fetch(`${import.meta.env.VITE_API_URL}/api/sentences/delete/${id}`, {
        method: 'DELETE'
      });

      if (response.ok) {
        onDelete();
      } else {
        alert('حدث خطأ في حذف الجملة');
      }
    } catch (error) {
      console.error('Error deleting sentence:', error);
      alert('تعذر الاتصال بالخادم');
    } finally {
      setLoading(false);
    }
  };

  const handleEditClick = (s) => {
    setEditId(s._id);
    setEditHassani(s.hassani || '');
    setEditArabic(s.arabic || '');
  };

  const handleCancel = () => {
    setEditId(null);
    setEditHassani('');
    setEditArabic('');
  };

  const handleSave = async (id) => {
    if (!editHassani.trim() || !editArabic.trim()) {
      alert('يرجى ملء جميع الحقول');
      return;
    }

    setLoading(true);
    try {
      const response = await fetch(`${import.meta.env.VITE_API_URL}/api/sentences/edit/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          hassani: editHassani.trim(),
          arabic: editArabic.trim()
        })
      });

      if (response.ok) {
        setEditId(null);
        setEditHassani('');
        setEditArabic('');
        onDelete();
      } else {
        alert('حدث خطأ في حفظ التعديلات');
      }
    } catch (error) {
      console.error('Error updating sentence:', error);
      alert('تعذر الاتصال بالخادم');
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (dateString) => {
    if (!dateString) return 'غير محدد';
    try {
      const date = new Date(dateString);
      return new Intl.DateTimeFormat('ar-SA', {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
      }).format(date);
    } catch {
      return 'غير محدد';
    }
  };

  return (
    <div className="sentence-list-container">
      <div className="sentence-list-header">
        <h3>قائمة الجمل</h3>
        <p>إدارة وتصفح جميع الجمل في قاعدة البيانات</p>
      </div>

      {/* أدوات البحث والفلترة */}
      <div className="search-filter-section">
        <div className="search-filter-grid">
          <div className="search-input-wrapper">
            <input
              type="text"
              className="search-input"
              placeholder="🔍 ابحث في الجمل، النصوص، أو الأسماء..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              disabled={loading}
            />
            <span className="search-icon"></span>
          </div>

          <div className="filter-wrapper">
            <select
              className="filter-select"
              value={authorFilter}
              onChange={(e) => setAuthorFilter(e.target.value)}
              disabled={loading}
            >
              {authors.map((name, i) => (
                <option key={i} value={name}>
                  {name === 'all' ? '👥 جميع الأعضاء' : `👤 ${name}`}
                </option>
              ))}
            </select>
            <span className="filter-icon"></span>
          </div>

          <div className="results-count">
            📊 {filteredSentences.length} جملة
          </div>
        </div>
      </div>

      {/* حالة التحميل */}
      {loading && (
        <div className="loading-state">
          جاري المعالجة...
        </div>
      )}

      {/* عرض النتائج */}
      {!loading && (
        <>
          {filteredSentences.length === 0 ? (
            <div className="no-results">
              <h4>لا توجد نتائج</h4>
              <p>لم يتم العثور على جمل تطابق معايير البحث</p>
            </div>
          ) : (
            <div className="sentences-grid">
              {filteredSentences.map((s) => (
                <div key={s._id} className="sentence-card">
                  {editId === s._id ? (
                    <div className="edit-form">
                      <div className="edit-inputs">
                        <input
                          className="edit-input"
                          placeholder="الجملة الحسانية"
                          value={editHassani}
                          onChange={(e) => setEditHassani(e.target.value)}
                          disabled={loading}
                        />
                        <input
                          className="edit-input"
                          placeholder="الترجمة العربية"
                          value={editArabic}
                          onChange={(e) => setEditArabic(e.target.value)}
                          disabled={loading}
                        />
                      </div>

                      <div className="actions-section">
                        <div>
                          <button
                            className="action-btn save"
                            onClick={() => handleSave(s._id)}
                            disabled={loading}
                          >
                            ✅ حفظ
                          </button>
                          <button
                            className="action-btn cancel"
                            onClick={handleCancel}
                            disabled={loading}
                            style={{ marginLeft: '0.5rem' }}
                          >
                            ❌ إلغاء
                          </button>
                        </div>
                      </div>
                    </div>
                  ) : (
                    <>
                      <div className="sentence-content">
                        <div className="language-section hassani">
                          <div className="language-label hassani">الحسانية</div>
                          <div className="language-text">{s.hassani || 'غير محدد'}</div>
                        </div>

                        <div className="language-section arabic">
                          <div className="language-label arabic">العربية</div>
                          <div className="language-text">{s.arabic || 'غير محدد'}</div>
                        </div>

                        <div className="author-section">
                          <div className="author-label">أضيفت بواسطة</div>
                          <div className="author-name">{s.addedBy || 'غير محدد'}</div>
                        </div>
                      </div>

                      <div className="date-info">
                        {formatDate(s.createdAt)}
                      </div>

                      <div className="actions-section">
                        <div>
                          <button
                            className="action-btn edit"
                            onClick={() => handleEditClick(s)}
                            disabled={loading}
                          >
                            ✏️ تعديل
                          </button>
                          <button
                            className="action-btn delete"
                            onClick={() => handleDelete(s._id)}
                            disabled={loading}
                            style={{ marginLeft: '0.5rem' }}
                          >
                            🗑 حذف
                          </button>
                        </div>
                      </div>
                    </>
                  )}
                </div>
              ))}
            </div>
          )}
        </>
      )}
    </div>
  );
}

export default SentenceList;