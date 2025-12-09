import { useEffect, useState } from 'react';
import Login from './components/Login';
import AddSentence from './components/AddSentence';
import SentenceList from './components/SentenceList';
import Stats from './components/Stats';

function App() {
  const [user, setUser] = useState(null);
  const [sentences, setSentences] = useState([]);
  const [stats, setStats] = useState(null);

  // جلب الجمل
  const fetchSentences = async () => {
    const res = await fetch(`${import.meta.env.VITE_API_URL}/api/sentences/all`);
    const data = await res.json();
    setSentences(data);
  };

  // جلب الإحصائيات
  const fetchStats = async () => {
    const res = await fetch(`${import.meta.env.VITE_API_URL}/api/sentences/stats`);
    const data = await res.json();
    setStats(data);
  };

  useEffect(() => {
    if (user) {
      fetchSentences();
      fetchStats();
    }
  }, [user]);

  if (!user) {
    return <Login onLogin={setUser} />;
  }

  return (
    <div style={{ padding: 20 }}>
      <h2>مرحبا {user.name} 👋</h2>

      <AddSentence
        user={user}
        onAdd={() => {
          fetchSentences();
          fetchStats();
        }}
      />

      <hr />

      <Stats stats={stats} />

      <hr />

      <SentenceList
        sentences={sentences}
        onDelete={() => {
          fetchSentences();
          fetchStats();
        }}
      />
    </div>
  );
}

export default App;