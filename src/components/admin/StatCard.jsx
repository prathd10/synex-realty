export default function StatCard({ label, value }) {
  return (
    <div className="glass border border-white/10 rounded-2xl p-5 shadow-luxury">
      <div className="text-[10px] uppercase tracking-widest font-bold text-cream/40 mb-2">{label}</div>
      <div className="font-serif font-bold text-3xl text-white">{value}</div>
    </div>
  );
}
