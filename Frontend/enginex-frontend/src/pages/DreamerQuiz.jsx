import { useState } from 'react';
import API from '../utils/api';

export default function DreamerQuiz() {
  const [formData, setFormData] = useState({
    portalType: 'dreamer',
    answers: {
      interestedDomain: 'Technology & Software',
      specialization: 'AI & Machine Learning',
      targetRoles: ['AI Engineer'],
      desiredSkills: ['Python', 'FastAPI'],
      acquiredSkills: ['JavaScript'],
      primaryGoal: 'Career growth'
    }
  });
  const [response, setResponse] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await API.post('/quiz/submit', formData);
      setResponse(res.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-8 max-w-xl mx-auto">
      <h1 className="text-3xl font-bold mb-6">Dreamer Portal Quiz</h1>
      <button
        onClick={handleSubmit}
        disabled={loading}
        className="bg-green-600 text-white px-6 py-2 rounded shadow hover:bg-green-700"
      >
        {loading ? 'Generating Roadmap...' : 'Submit Quiz'}
      </button>

      {response && (
        <div className="mt-8 p-4 bg-gray-50 border rounded">
          <h2 className="text-xl font-semibold mb-2">Generated Roadmap</h2>
          <pre className="text-sm overflow-x-auto">{JSON.stringify(response, null, 2)}</pre>
        </div>
      )}
    </div>
  );
}