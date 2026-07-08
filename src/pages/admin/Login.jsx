import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Eye, EyeOff } from 'lucide-react';
import { supabase } from '../../lib/supabaseClient';

export default function AdminLogin() {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSubmitting(true);
    const { error: signInError } = await supabase.auth.signInWithPassword({ email, password });
    setSubmitting(false);
    if (signInError) {
      setError('Invalid email or password.');
      return;
    }
    navigate('/admin/dashboard');
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-[#110D1A] px-4 py-12">
      <div className="text-center mb-8 select-none">
        <span className="font-serif font-bold text-3xl tracking-[0.2em] text-white">SYNEX</span>
        <div className="text-[9px] font-bold tracking-[0.38em] text-accent/95 uppercase -mt-0.5">Realty</div>
      </div>

      <div className="w-full max-w-md glass rounded-3xl border border-white/10 shadow-luxury p-8">
        <div className="text-center mb-7">
          <h1 className="font-serif text-2xl font-bold text-white mb-1.5">Admin Panel</h1>
          <p className="text-cream/50 text-[10px] uppercase tracking-widest font-bold">Sign in to manage your website</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="text-[10px] uppercase tracking-wider font-bold text-cream/50 block mb-1.5">Email</label>
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full border border-white/10 rounded-xl px-4 py-3 text-sm text-white font-medium focus:outline-none focus:border-accent bg-white/[0.03] transition-all duration-300"
            />
          </div>
          <div>
            <label className="text-[10px] uppercase tracking-wider font-bold text-cream/50 block mb-1.5">Password</label>
            <div className="relative">
              <input
                type={showPassword ? 'text' : 'password'}
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full border border-white/10 rounded-xl px-4 py-3 pr-11 text-sm text-white font-medium focus:outline-none focus:border-accent bg-white/[0.03] transition-all duration-300"
              />
              <button
                type="button"
                onClick={() => setShowPassword((s) => !s)}
                className="absolute right-3.5 top-1/2 -translate-y-1/2 text-cream/40 hover:text-white"
              >
                {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
              </button>
            </div>
          </div>

          {error && <p className="text-xs text-red-400">{error}</p>}

          <button
            type="submit"
            disabled={submitting}
            className="w-full bg-accent hover:bg-accent-dark text-white font-bold uppercase tracking-wider py-3.5 rounded-xl transition-all duration-300 text-xs shadow-luxury disabled:opacity-60"
          >
            {submitting ? 'Signing In…' : 'Continue'}
          </button>
        </form>
      </div>

      <Link to="/" className="mt-8 text-cream/40 hover:text-white text-[10px] uppercase tracking-widest font-bold transition-colors">
        ← Back to Website
      </Link>
    </div>
  );
}
