import TestFlow from '../components/test/TestFlow';

/**
 * Standalone /test sahifasi — endi barcha mantiq TestFlow'da, bu yerda
 * faqat sahifa darajasidagi konteyner (padding, fon) bor. Hero ichidagi
 * inline widget (HeroTestWidget) xuddi shu TestFlow'ni boshqacha
 * konteynerda ishlatadi.
 */
export default function TestPage() {
  return (
    <div className="pt-32 pb-20 min-h-screen bg-slate-50">
      <div className="container-narrow px-6">
        <TestFlow />
      </div>
    </div>
  );
}
