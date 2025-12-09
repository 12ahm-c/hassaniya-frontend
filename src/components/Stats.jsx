import { useEffect, useState } from 'react';
import '../App.css';

function Stats({ stats }) {
  if (!stats) {
    return (
      <div className="stats-loading">
        <div className="stats-spinner"></div>
        <p>جاري تحميل الإحصائيات...</p>
      </div>
    );
  }

  return (
    <div className="stats-container">
      <h3 className="stats-title">
        الإحصائيات العامة
      </h3>

      <div className="stats-total-card">
        <div className="total-icon">Total</div>
        <div className="total-number">{stats.total.toLocaleString('ar-SA')}</div>
        <div className="total-label">جملة في القاموس</div>
      </div>

      <div className="stats-grid">
        {stats.stats.map((item, index) => (
          <div key={index} className="stat-card">
            <div className="stat-name">{item._id || 'غير محدد'}</div>
            <div className="stat-count">{item.count.toLocaleString('ar-SA')}</div>
            <div className="stat-bar" style={{ width: `${(item.count / stats.total) * 100}%` }}></div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default Stats;