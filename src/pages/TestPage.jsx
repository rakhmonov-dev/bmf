import { useSearchParams, useNavigate } from 'react-router-dom';
import TestFlow from '../components/test/TestFlow';

export default function TestPage() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();

  const subject =
    searchParams.get('subject') === 'math'
      ? 'math'
      : 'english';

  function handleComplete() {
    navigate('/');
  }

  return (
    <div className="pt-32 pb-20 min-h-screen bg-slate-50">
      <div className="container-narrow px-6">
        <TestFlow
          initialSubject={subject}
          onClose={handleComplete}
        />
      </div>
    </div>
  );
}