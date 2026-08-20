import { useState } from 'react';
import { 
  Building2, 
  ShieldCheck, 
  Clock, 
  CheckCircle2, 
  FileText, 
  Search, 
  Sparkles,
  UserCheck,
  Send
} from 'lucide-react';

const DEALS = [
  {
    id: 'DEAL-9041',
    property: 'The Imperial Sky Villa & Penthouse',
    location: 'Worli Sea Face, Mumbai',
    price: '₹54.5 Cr',
    priceUsd: '$6.5M',
    type: 'Penthouse · 7,800 sq.ft',
    buyer: 'Vikramaditya S. (Tech Founder)',
    buyerTier: 'Verified VIP',
    seller: 'Private Family Trust',
    stage: '10% Token Received',
    stageColor: 'text-amber-400 bg-amber-950/40 border-amber-800/40',
    progress: 85,
    lastUpdate: '2 hours ago',
    projectedCommission: '₹1.09 Cr (2% fee)',
    leadBroker: 'Pratham D.',
    milestones: [
      { name: 'Property Visit & Price Finalized', done: true },
      { name: 'Agreement (LOI) Signed', done: true },
      { name: '10% Token Advance Paid', done: true },
      { name: 'Legal Papers & Title Verified', done: true },
      { name: 'Final Registration at Sub-Registrar', done: false }
    ],
    image: 'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?auto=format&fit=crop&w=800&q=80'
  },
  {
    id: 'DEAL-8832',
    property: 'Sea-Facing Bungalow',
    location: 'Bandstand, Bandra West, Mumbai',
    price: '₹82.0 Cr',
    priceUsd: '$9.8M',
    type: 'Standalone Villa · 11,200 sq.ft',
    buyer: 'Aarav K. (Film Director & Producer)',
    buyerTier: 'VIP Buyer',
    seller: 'Industrialist Estate Holdings',
    stage: 'Legal Check in Progress',
    stageColor: 'text-blue-400 bg-blue-950/40 border-blue-800/40',
    progress: 60,
    lastUpdate: '4 hours ago',
    projectedCommission: '₹1.64 Cr (2% fee)',
    leadBroker: 'Senior Team',
    milestones: [
      { name: 'Property Visit & Price Finalized', done: true },
      { name: 'Agreement (LOI) Signed', done: true },
      { name: '10% Token Advance Paid', done: true },
      { name: 'Legal Papers & Title Verified', done: false },
      { name: 'Final Registration at Sub-Registrar', done: false }
    ],
    image: 'https://images.unsplash.com/photo-1613977257363-707ba9348227?auto=format&fit=crop&w=800&q=80'
  },
  {
    id: 'DEAL-8419',
    property: 'Oceanview Duplex Home',
    location: 'Juhu Tara Road, Mumbai',
    price: '₹38.0 Cr',
    priceUsd: '$4.5M',
    type: 'Duplex · 5,600 sq.ft',
    buyer: 'Meera Singhania (Hedge Fund Partner)',
    buyerTier: 'Verified Buyer',
    seller: 'Promoter Group Mumbai',
    stage: 'Ready for Registration',
    stageColor: 'text-emerald-400 bg-emerald-950/40 border-emerald-800/40',
    progress: 95,
    lastUpdate: 'Today, 11:30 AM',
    projectedCommission: '₹76.0 L (2% fee)',
    leadBroker: 'Director Desk',
    milestones: [
      { name: 'Property Visit & Price Finalized', done: true },
      { name: 'Agreement (LOI) Signed', done: true },
      { name: '10% Token Advance Paid', done: true },
      { name: 'Legal Papers & Title Verified', done: true },
      { name: 'Final Registration at Sub-Registrar', done: true }
    ],
    image: 'https://images.unsplash.com/photo-1512917774080-9991f1c4c750?auto=format&fit=crop&w=800&q=80'
  },
  {
    id: 'DEAL-7952',
    property: 'Altamount Manor Sky Home',
    location: 'Altamount Road, Mumbai',
    price: '₹68.5 Cr',
    priceUsd: '$8.2M',
    type: 'Full Floor · 8,400 sq.ft',
    buyer: 'Rohit & Natasha Goenka',
    buyerTier: 'VIP Buyer',
    seller: 'Diamond Exporters Trust',
    stage: 'Offer Accepted',
    stageColor: 'text-purple-400 bg-purple-950/40 border-purple-800/40',
    progress: 45,
    lastUpdate: 'Yesterday',
    projectedCommission: '₹1.37 Cr (2% fee)',
    leadBroker: 'Private Client Team',
    milestones: [
      { name: 'Property Visit & Price Finalized', done: true },
      { name: 'Agreement (LOI) Signed', done: true },
      { name: '10% Token Advance Paid', done: false },
      { name: 'Legal Papers & Title Verified', done: false },
      { name: 'Final Registration at Sub-Registrar', done: false }
    ],
    image: 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=800&q=80'
  }
];

export default function DealRoom() {
  const [selectedDeal, setSelectedDeal] = useState(DEALS[0]);
  const [searchTerm, setSearchTerm] = useState('');
  const [currency, setCurrency] = useState('INR');

  const filteredDeals = DEALS.filter(
    (d) =>
      d.property.toLowerCase().includes(searchTerm.toLowerCase()) ||
      d.location.toLowerCase().includes(searchTerm.toLowerCase()) ||
      d.buyer.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-pulse" />
            <h1 className="font-serif text-3xl text-white">Active Property Deals</h1>
            <span className="text-[10px] uppercase tracking-wider font-bold bg-accent/15 text-accent border border-accent/30 px-2.5 py-0.5 rounded-full">
              Live Deals
            </span>
          </div>
          <p className="text-cream/50 text-xs font-medium">
            Track ongoing deals, advance tokens, and legal paperwork · Total: ₹243.0 Cr
          </p>
        </div>

        <div className="flex items-center gap-3">
          <div className="flex bg-[#0D0A14] p-1 rounded-xl border border-white/10">
            <button
              onClick={() => setCurrency('INR')}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                currency === 'INR' ? 'bg-accent text-white shadow-luxury' : 'text-cream/40 hover:text-white'
              }`}
            >
              ₹ INR
            </button>
            <button
              onClick={() => setCurrency('USD')}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                currency === 'USD' ? 'bg-accent text-white shadow-luxury' : 'text-cream/40 hover:text-white'
              }`}
            >
              $ USD
            </button>
          </div>

          <button className="flex items-center gap-2 bg-accent hover:bg-accent-dark text-white font-bold px-4 py-2.5 rounded-xl text-xs shadow-luxury transition-all">
            <Sparkles size={14} /> + New Deal
          </button>
        </div>
      </div>

      {/* Top 4 Numbers */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="glass border border-white/10 rounded-2xl p-5 bg-gradient-to-br from-white/[0.04] to-transparent">
          <div className="text-[10px] uppercase tracking-widest font-bold text-cream/45 mb-1">Total Deals in Progress</div>
          <div className="font-serif font-bold text-2xl lg:text-3xl text-white">
            {currency === 'INR' ? '₹243.0 Cr' : '$29.0M'}
          </div>
          <div className="text-[10px] text-emerald-400 font-bold mt-1">4 active sales closing soon</div>
        </div>

        <div className="glass border border-white/10 rounded-2xl p-5 bg-gradient-to-br from-white/[0.04] to-transparent">
          <div className="text-[10px] uppercase tracking-widest font-bold text-cream/45 mb-1">Brokerage Earnings</div>
          <div className="font-serif font-bold text-2xl lg:text-3xl text-accent">
            {currency === 'INR' ? '₹4.86 Cr' : '$580k'}
          </div>
          <div className="text-[10px] text-cream/40 font-bold mt-1">Standard 2% commission</div>
        </div>

        <div className="glass border border-white/10 rounded-2xl p-5 bg-gradient-to-br from-white/[0.04] to-transparent">
          <div className="text-[10px] uppercase tracking-widest font-bold text-cream/45 mb-1">Avg. Closing Time</div>
          <div className="font-serif font-bold text-2xl lg:text-3xl text-white">21 Days</div>
          <div className="text-[10px] text-emerald-400 font-bold mt-1">Fast turnaround</div>
        </div>

        <div className="glass border border-white/10 rounded-2xl p-5 bg-gradient-to-br from-white/[0.04] to-transparent">
          <div className="text-[10px] uppercase tracking-widest font-bold text-cream/45 mb-1">Verified Buyers</div>
          <div className="font-serif font-bold text-2xl lg:text-3xl text-white">100%</div>
          <div className="text-[10px] text-accent font-bold mt-1">Bank verified funds</div>
        </div>
      </div>

      {/* Main Deal List and Details */}
      <div className="grid lg:grid-cols-12 gap-6">
        {/* Deal List */}
        <div className="lg:col-span-5 space-y-3">
          <div className="relative mb-4">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 text-cream/40" size={15} />
            <input
              type="text"
              placeholder="Search properties, locations, buyers..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full bg-[#0D0A14] border border-white/10 rounded-xl pl-10 pr-4 py-2.5 text-xs text-white placeholder-cream/40 focus:outline-none focus:border-accent"
            />
          </div>

          <div className="space-y-3">
            {filteredDeals.map((deal) => {
              const isSelected = selectedDeal.id === deal.id;
              return (
                <div
                  key={deal.id}
                  onClick={() => setSelectedDeal(deal)}
                  className={`cursor-pointer rounded-2xl p-4 transition-all duration-300 border ${
                    isSelected
                      ? 'bg-accent/15 border-accent/50 shadow-luxury'
                      : 'glass border-white/10 hover:border-white/20 hover:bg-white/[0.03]'
                  }`}
                >
                  <div className="flex items-start justify-between gap-3 mb-2">
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="text-[9px] font-mono font-bold text-cream/40">{deal.id}</span>
                        <span className={`text-[9px] font-bold px-2 py-0.5 rounded-full border ${deal.stageColor}`}>
                          {deal.stage}
                        </span>
                      </div>
                      <h3 className="font-serif font-bold text-white text-sm mt-1">{deal.property}</h3>
                      <p className="text-cream/50 text-xs">{deal.location}</p>
                    </div>

                    <div className="text-right">
                      <div className="font-serif font-bold text-white text-sm">
                        {currency === 'INR' ? deal.price : deal.priceUsd}
                      </div>
                      <div className="text-[10px] text-accent font-bold mt-0.5">{deal.progress}% Done</div>
                    </div>
                  </div>

                  {/* Progress Bar */}
                  <div className="w-full bg-white/5 h-1.5 rounded-full overflow-hidden mt-3">
                    <div
                      className="h-full bg-gradient-to-r from-accent to-emerald-400 rounded-full transition-all duration-500"
                      style={{ width: `${deal.progress}%` }}
                    />
                  </div>

                  <div className="flex items-center justify-between text-[10px] text-cream/40 mt-3 pt-2.5 border-t border-white/5">
                    <span className="flex items-center gap-1">
                      <UserCheck size={11} className="text-accent" /> {deal.buyerTier}
                    </span>
                    <span className="flex items-center gap-1">
                      <Clock size={11} /> {deal.lastUpdate}
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Selected Deal Details */}
        <div className="lg:col-span-7">
          <div className="glass border border-white/10 rounded-2xl p-6 shadow-luxury space-y-6">
            <div className="relative rounded-xl overflow-hidden h-44 border border-white/10">
              <img src={selectedDeal.image} alt="" className="w-full h-full object-cover" />
              <div className="absolute inset-0 bg-gradient-to-t from-[#0B0813] via-[#0B0813]/40 to-transparent" />
              
              <div className="absolute top-3 left-3 flex items-center gap-2">
                <span className="bg-black/60 backdrop-blur-md text-white font-mono text-[10px] px-2.5 py-1 rounded-lg border border-white/20">
                  {selectedDeal.id}
                </span>
                <span className={`text-[10px] font-bold px-2.5 py-1 rounded-lg border backdrop-blur-md ${selectedDeal.stageColor}`}>
                  {selectedDeal.stage}
                </span>
              </div>

              <div className="absolute bottom-3 left-4 right-4 flex items-end justify-between">
                <div>
                  <h2 className="font-serif font-bold text-white text-xl">{selectedDeal.property}</h2>
                  <p className="text-cream/70 text-xs">{selectedDeal.location} · {selectedDeal.type}</p>
                </div>
                <div className="text-right">
                  <div className="text-[10px] uppercase tracking-wider font-bold text-cream/50">Agreed Price</div>
                  <div className="font-serif font-bold text-2xl text-accent">
                    {currency === 'INR' ? selectedDeal.price : selectedDeal.priceUsd}
                  </div>
                </div>
              </div>
            </div>

            {/* Buyer & Seller */}
            <div className="grid sm:grid-cols-2 gap-4">
              <div className="bg-white/[0.02] border border-white/5 rounded-xl p-4">
                <div className="text-[10px] uppercase tracking-widest font-bold text-cream/40 mb-1 flex items-center gap-1.5">
                  <UserCheck size={12} className="text-accent" /> Buyer
                </div>
                <div className="font-serif font-bold text-white text-sm">{selectedDeal.buyer}</div>
                <div className="text-[10px] text-accent font-bold mt-0.5">{selectedDeal.buyerTier} · Payment Verified</div>
              </div>

              <div className="bg-white/[0.02] border border-white/5 rounded-xl p-4">
                <div className="text-[10px] uppercase tracking-widest font-bold text-cream/40 mb-1 flex items-center gap-1.5">
                  <ShieldCheck size={12} className="text-emerald-400" /> Seller
                </div>
                <div className="font-serif font-bold text-white text-sm">{selectedDeal.seller}</div>
                <div className="text-[10px] text-emerald-400 font-bold mt-0.5">Title Papers Verified</div>
              </div>
            </div>

            {/* Step by step checklist */}
            <div>
              <h4 className="text-xs uppercase tracking-wider font-bold text-cream/60 mb-3 flex items-center gap-2">
                <FileText size={14} className="text-accent" /> Deal Progress Checklist
              </h4>
              <div className="space-y-2">
                {selectedDeal.milestones.map((m, idx) => (
                  <div
                    key={idx}
                    className={`flex items-center justify-between p-3 rounded-xl border text-xs transition-all ${
                      m.done
                        ? 'bg-emerald-950/20 border-emerald-900/30 text-emerald-300'
                        : 'bg-white/[0.02] border-white/5 text-cream/50'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      {m.done ? (
                        <CheckCircle2 size={16} className="text-emerald-400 shrink-0" />
                      ) : (
                        <Clock size={16} className="text-cream/30 shrink-0" />
                      )}
                      <span className={m.done ? 'font-medium text-white' : ''}>{m.name}</span>
                    </div>
                    <span className="text-[10px] font-mono font-bold">
                      {m.done ? 'DONE' : 'PENDING'}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* Bottom Actions */}
            <div className="bg-[#0D0A14] border border-white/10 rounded-xl p-4 flex flex-col sm:flex-row items-center justify-between gap-4">
              <div>
                <div className="text-[10px] uppercase tracking-wider font-bold text-cream/40">Commission Due</div>
                <div className="font-serif font-bold text-lg text-white">{selectedDeal.projectedCommission}</div>
                <div className="text-[10px] text-cream/40">Lead: {selectedDeal.leadBroker}</div>
              </div>

              <div className="flex items-center gap-2 w-full sm:w-auto">
                <button className="flex-1 sm:flex-initial flex items-center justify-center gap-1.5 bg-white/5 hover:bg-white/10 text-white font-bold text-xs px-4 py-2.5 rounded-xl border border-white/10 transition-all">
                  <FileText size={13} /> View Agreement
                </button>
                <button className="flex-1 sm:flex-initial flex items-center justify-center gap-1.5 bg-accent hover:bg-accent-dark text-white font-bold text-xs px-4 py-2.5 rounded-xl shadow-luxury transition-all">
                  <Send size={13} /> Update Status
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
