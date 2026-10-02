import TestFlow from '../components/test/TestFlow';

/**
 * Standalone /test sahifasi.
 * Default holatda English testi ochiladi.
 */
export default function TestPage() {
  return (
    <div className="pt-32 pb-20 min-h-screen bg-slate-50">
      <div className="container-narrow px-6">
        <TestFlow initialSubject="english" />
      </div>
    </div>
  );
}