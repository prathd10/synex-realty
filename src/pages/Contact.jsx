import { useState } from 'react';
import { Phone, Mail, MapPin, Clock, CheckCircle, Send } from 'lucide-react';

const SOCIAL = [
  { label: 'IG' },
  { label: 'IN' },
  { label: 'FB' },
];

const OFFICES = [
  { city: 'BKC – Head Office', address: 'Office 301, The Hub, Bandra Kurla Complex, Bandra East, Mumbai – 400051', phone: '+91 98765 43210', hours: 'Mon–Sat: 9 AM – 7 PM' },
  { city: 'Lower Parel', address: 'Suite 204, Peninsula Business Park, Lower Parel, Mumbai – 400013', phone: '+91 98765 43211', hours: 'Mon–Sat: 10 AM – 6 PM' },
];

const FAQS = [
  { q: 'Do you charge buyers a fee?', a: 'No. Our service is completely free for buyers. We are compensated by the sellers/developers.' },
  { q: 'How quickly can I get a property visit?', a: 'Most visits can be arranged within 24–48 hours. Our team is available 7 days a week.' },
  { q: 'Are the property listings RERA verified?', a: 'Yes. All our residential listings are RERA registered. RERA numbers are displayed on each listing.' },
  { q: 'Can I get NRI assistance?', a: 'Absolutely. We have a dedicated NRI desk with experts in cross-border property transactions and NRI legal requirements.' },
];

export default function Contact() {
  const [form, setForm] = useState({ name: '', phone: '', email: '', type: 'Buying', budget: '', message: '' });
  const [submitted, setSubmitted] = useState(false);
  const set = (k, v) => setForm(f => ({ ...f, [k]: v }));

  const handleSubmit = (e) => {
    e.preventDefault();
    setSubmitted(true);
  };

  return (
    <div className="pt-20 page-enter bg-transparent min-h-screen">
      {/* Hero */}
      <div className="bg-[#110D1A]/50 backdrop-blur-md py-16 px-4 border-b border-white/5">
        <div className="container-wide text-center text-white">
          <p className="text-cream/60 text-[9px] uppercase tracking-widest font-bold mb-3">We're Here to Help</p>
          <h1 className="font-serif text-3xl md:text-5xl font-bold text-white mb-4">Get In Touch</h1>
          <p className="text-cream/50 text-sm max-w-xl mx-auto leading-relaxed">
            Looking for your next property? Have questions? Our experts are ready to guide you — no pressure, no spam.
          </p>
        </div>
      </div>

      <div className="container-wide py-14">
        <div className="grid lg:grid-cols-5 gap-10">
          {/* Form */}
          <div className="lg:col-span-3">
            <div className="glass rounded-3xl p-8 shadow-luxury border border-white/10">
              <h2 className="font-serif font-bold text-white text-2xl mb-1">Send Us a Message</h2>
              <p className="text-cream/55 text-xs uppercase tracking-wider font-bold mb-6">We'll respond within 24 hours.</p>

              {submitted ? (
                <div className="text-center py-10 bg-white/[0.04] border border-white/5 rounded-2xl">
                  <CheckCircle size={48} className="text-white mx-auto mb-4" />
                  <h3 className="font-serif text-xl font-bold text-white mb-2">Message Sent!</h3>
                  <p className="text-cream/50 text-xs max-w-xs mx-auto mb-6 leading-relaxed">
                    Thank you, {form.name}. Our property advisor will reach you at {form.phone || form.email} within 24 hours.
                  </p>
                  <button
                    onClick={() => { setSubmitted(false); setForm({ name: '', phone: '', email: '', type: 'Buying', budget: '', message: '' }); }}
                    className="text-white hover:text-white text-xs font-bold uppercase tracking-wider"
                  >
                    Send another message
                  </button>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="text-[10px] uppercase tracking-wider font-bold text-cream/50 block mb-1.5">Full Name *</label>
                      <input
                        required value={form.name} onChange={e => set('name', e.target.value)}
                        placeholder="Rahul Sharma"
                        className="w-full border border-white/10 rounded-xl px-4 py-3 text-xs text-white font-medium focus:outline-none focus:border-accent bg-white/[0.03] placeholder:text-cream/20 transition-all duration-300"
                      />
                    </div>
                    <div>
                      <label className="text-[10px] uppercase tracking-wider font-bold text-cream/50 block mb-1.5">Phone Number *</label>
                      <input
                        required value={form.phone} onChange={e => set('phone', e.target.value)}
                        placeholder="+91 98765"
                        className="w-full border border-white/10 rounded-xl px-4 py-3 text-xs text-white font-medium focus:outline-none focus:border-accent bg-white/[0.03] placeholder:text-cream/20 transition-all duration-300"
                      />
                    </div>
                  </div>
                  <div>
                    <label className="text-[10px] uppercase tracking-wider font-bold text-cream/50 block mb-1.5">Email Address</label>
                    <input
                      type="email" value={form.email} onChange={e => set('email', e.target.value)}
                      placeholder="rahul@email.com"
                      className="w-full border border-white/10 rounded-xl px-4 py-3 text-xs text-white font-medium focus:outline-none focus:border-accent bg-white/[0.03] placeholder:text-cream/20 transition-all duration-300"
                    />
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="text-[10px] uppercase tracking-wider font-bold text-cream/50 block mb-1.5">I'm Looking To</label>
                      <select
                        value={form.type} onChange={e => set('type', e.target.value)}
                        className="w-full border border-white/10 rounded-xl px-4 py-3 text-xs text-white bg-[#110D1A] font-bold focus:outline-none focus:border-accent cursor-pointer"
                      >
                        <option className="bg-[#110D1A]">Buying</option>
                        <option className="bg-[#110D1A]">Renting</option>
                        <option className="bg-[#110D1A]">Invest</option>
                        <option className="bg-[#110D1A]">Sell My Property</option>
                        <option className="bg-[#110D1A]">Commercial</option>
                      </select>
                    </div>
                    <div>
                      <label className="text-[10px] uppercase tracking-wider font-bold text-cream/50 block mb-1.5">Budget Range</label>
                      <select
                        value={form.budget} onChange={e => set('budget', e.target.value)}
                        className="w-full border border-white/10 rounded-xl px-4 py-3 text-xs text-white bg-[#110D1A] font-bold focus:outline-none focus:border-accent cursor-pointer"
                      >
                        <option className="bg-[#110D1A]" value="">Select budget</option>
                        <option className="bg-[#110D1A]">Under ₹1 Cr</option>
                        <option className="bg-[#110D1A]">₹1 Cr – ₹2 Cr</option>
                        <option className="bg-[#110D1A]">₹2 Cr – ₹5 Cr</option>
                        <option className="bg-[#110D1A]">₹5 Cr – ₹10 Cr</option>
                        <option className="bg-[#110D1A]">₹10 Cr+</option>
                      </select>
                    </div>
                  </div>
                  <div>
                    <label className="text-[10px] uppercase tracking-wider font-bold text-cream/50 block mb-1.5">Your Requirements</label>
                    <textarea
                      value={form.message} onChange={e => set('message', e.target.value)}
                      placeholder="Tell us what you're looking for — preferred area, BHK, lifestyle requirements…"
                      rows={4}
                      className="w-full border border-white/10 rounded-xl px-4 py-3 text-xs text-white font-medium focus:outline-none focus:border-accent bg-white/[0.03] placeholder:text-cream/20 transition-all duration-300 resize-none"
                    />
                  </div>
                  <button
                    type="submit"
                    className="w-full bg-accent hover:bg-accent-dark text-white font-bold uppercase tracking-wider py-4 rounded-xl transition-all duration-300 flex items-center justify-center gap-2 text-xs shadow-luxury hover:shadow-luxury-hover hover:-translate-y-0.5"
                  >
                    <Send size={14} /> Send Message
                  </button>
                  <p className="text-[10px] text-cream/35 text-center leading-relaxed">
                    Your details are completely secure and will never be shared with third parties.
                  </p>
                </form>
              )}
            </div>
          </div>

          {/* Info sidebar */}
          <div className="lg:col-span-2 space-y-6">
            {/* Quick contact */}
            <div className="glass-dark rounded-3xl p-7 text-cream shadow-luxury border border-white/10">
              <h3 className="font-serif font-bold text-lg mb-5 text-white border-b border-white/5 pb-3">Quick Contact</h3>
              <div className="space-y-4">
                <a href="tel:+919876543210" className="flex items-center gap-4 hover:text-white transition-colors duration-300 group">
                  <div className="w-9 h-9 bg-white/[0.04] border border-white/10 rounded-full flex items-center justify-center shrink-0 shadow-sm group-hover:border-accent transition-colors">
                    <Phone size={14} className="text-white" />
                  </div>
                  <div>
                    <div className="text-[9px] uppercase tracking-wider font-bold text-cream/40">Call Us</div>
                    <div className="text-sm font-semibold text-white/90">+91 98765 43210</div>
                  </div>
                </a>
                <a href="mailto:hello@synexrealty.com" className="flex items-center gap-4 hover:text-white transition-colors duration-300 group">
                  <div className="w-9 h-9 bg-white/[0.04] border border-white/10 rounded-full flex items-center justify-center shrink-0 shadow-sm group-hover:border-accent transition-colors">
                    <Mail size={14} className="text-white" />
                  </div>
                  <div>
                    <div className="text-[9px] uppercase tracking-wider font-bold text-cream/40">Email Us</div>
                    <div className="text-sm font-semibold text-white/90">hello@synexrealty.com</div>
                  </div>
                </a>
                <div className="flex items-center gap-4 group">
                  <div className="w-9 h-9 bg-white/[0.04] border border-white/10 rounded-full flex items-center justify-center shrink-0 shadow-sm transition-colors">
                    <Clock size={14} className="text-white" />
                  </div>
                  <div>
                    <div className="text-[9px] uppercase tracking-wider font-bold text-cream/40">Working Hours</div>
                    <div className="text-sm font-semibold text-white/90">Mon – Sat, 9 AM – 7 PM</div>
                  </div>
                </div>
              </div>
              <div className="flex gap-3 mt-6 border-t border-white/5 pt-5">
                {SOCIAL.map((s) => (
                  <button key={s.label} className="w-9 h-9 rounded-full border border-white/10 flex items-center justify-center hover:border-accent hover:text-white hover:bg-white/[0.02] transition-colors text-[10px] font-bold">
                    {s.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Offices */}
            <div className="glass rounded-3xl p-6 shadow-luxury border border-white/10 space-y-6">
              <h3 className="font-serif font-bold text-white text-lg">Our Offices</h3>
              {OFFICES.map(o => (
                <div key={o.city} className="pb-5 border-b border-white/5 last:border-0 last:pb-0">
                  <div className="font-serif font-bold text-white text-sm mb-2">{o.city}</div>
                  <div className="flex gap-2.5 text-xs text-cream/55 leading-relaxed mb-1.5">
                    <MapPin size={13} className="text-white shrink-0 mt-0.5" />
                    {o.address}
                  </div>
                  <div className="text-xs text-cream/55 font-medium mb-0.5">{o.phone}</div>
                  <div className="text-xs text-cream/45">{o.hours}</div>
                </div>
              ))}
            </div>

            {/* FAQ */}
            <div className="bg-white/[0.04] border border-white/5 rounded-3xl p-6 shadow-sm">
              <h3 className="font-serif font-bold text-white text-lg mb-5 border-b border-white/5 pb-3">Common Questions</h3>
              <div className="space-y-4">
                {FAQS.map(({ q, a }) => (
                  <div key={q} className="border-b border-white/5 last:border-0 pb-3 last:pb-0">
                    <div className="font-serif font-bold text-white text-sm mb-1.5">{q}</div>
                    <div className="text-cream/65 text-xs leading-relaxed">{a}</div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
