import { useState, useRef, useEffect } from 'react';
import { Play, Pause, Volume2, VolumeX, X, Phone, CheckCircle } from 'lucide-react';

export default function VideoTourModal({ property, onClose }) {
  const [isPlaying, setIsPlaying] = useState(true);
  const [isMuted, setIsMuted] = useState(true); // Default to muted for seamless autoplay
  const [progress, setProgress] = useState(0);
  const [currentTime, setCurrentTime] = useState('0:00');
  const [duration, setDuration] = useState('0:00');
  const [formSubmitted, setFormSubmitted] = useState(false);
  const [form, setForm] = useState({ name: '', phone: '', email: '' });
  const videoRef = useRef(null);

  useEffect(() => {
    if (videoRef.current) {
      videoRef.current.muted = isMuted;
      const playPromise = videoRef.current.play();
      if (playPromise !== undefined) {
        playPromise
          .then(() => {
            setIsPlaying(true);
          })
          .catch((error) => {
            console.log("Autoplay check failed, setting state to paused:", error);
            setIsPlaying(false);
          });
      }
    }
  }, [property.videoUrl]);

  const togglePlay = () => {
    if (videoRef.current) {
      if (isPlaying) {
        videoRef.current.pause();
      } else {
        videoRef.current.play();
      }
      setIsPlaying(!isPlaying);
    }
  };

  const toggleMute = () => {
    if (videoRef.current) {
      videoRef.current.muted = !isMuted;
      setIsMuted(!isMuted);
    }
  };

  const handleTimeUpdate = () => {
    if (videoRef.current) {
      const current = videoRef.current.currentTime;
      const total = videoRef.current.duration;
      setProgress((current / total) * 100);

      // Format time
      const curM = Math.floor(current / 60);
      const curS = Math.floor(current % 60).toString().padStart(2, '0');
      setCurrentTime(`${curM}:${curS}`);
    }
  };

  const handleLoadedMetadata = () => {
    if (videoRef.current) {
      const total = videoRef.current.duration;
      const totM = Math.floor(total / 60);
      const totS = Math.floor(total % 60).toString().padStart(2, '0');
      setDuration(`${totM}:${totS}`);
    }
  };

  const handleProgressBarClick = (e) => {
    if (videoRef.current) {
      const rect = e.currentTarget.getBoundingClientRect();
      const clickX = e.clientX - rect.left;
      const width = rect.width;
      const percentage = clickX / width;
      videoRef.current.currentTime = percentage * videoRef.current.duration;
      setProgress(percentage * 100);
    }
  };

  const handleInquiry = (e) => {
    e.preventDefault();
    setFormSubmitted(true);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#0a0710]/95 backdrop-blur-xl">
      <button
        onClick={onClose}
        className="absolute top-6 right-6 text-white/50 hover:text-white p-2.5 rounded-full hover:bg-white/5 border border-white/5 transition-all duration-300 z-50"
      >
        <X size={20} />
      </button>

      <div className="w-full max-w-5xl glass rounded-3xl overflow-hidden border border-white/10 shadow-float flex flex-col lg:flex-row aspect-video lg:aspect-[16/9] max-h-[85vh] relative z-40">
        {/* Video Area */}
        <div className="flex-1 relative bg-black flex items-center justify-center group/player">
          <video
            ref={videoRef}
            src={property.videoUrl}
            autoPlay
            muted={isMuted}
            playsInline
            onTimeUpdate={handleTimeUpdate}
            onLoadedMetadata={handleLoadedMetadata}
            onClick={togglePlay}
            className="w-full h-full object-cover cursor-pointer"
          />

          {/* Custom Controls Bar */}
          <div className="absolute bottom-0 inset-x-0 p-4 bg-gradient-to-t from-black/80 via-black/40 to-transparent flex flex-col gap-3 opacity-100 lg:opacity-0 lg:group-hover/player:opacity-100 transition-opacity duration-300 z-10">
            {/* Progress Slider */}
            <div 
              onClick={handleProgressBarClick}
              className="w-full h-1 bg-white/20 hover:h-1.5 rounded-full cursor-pointer transition-all relative overflow-hidden"
            >
              <div 
                style={{ width: `${progress}%` }} 
                className="absolute top-0 left-0 bottom-0 bg-accent rounded-full" 
              />
            </div>

            <div className="flex items-center justify-between text-white text-xs">
              <div className="flex items-center gap-4">
                {/* Play/Pause */}
                <button onClick={togglePlay} className="hover:text-accent transition-colors">
                  {isPlaying ? <Pause size={16} fill="currentColor" /> : <Play size={16} fill="currentColor" />}
                </button>

                {/* Mute/Unmute */}
                <button onClick={toggleMute} className="hover:text-accent transition-colors">
                  {isMuted ? <VolumeX size={16} /> : <Volume2 size={16} />}
                </button>

                {/* Time Display */}
                <span className="font-semibold tracking-wider text-[10px] text-cream/60">
                  {currentTime} / {duration}
                </span>
              </div>

              <div>
                <span className="text-[10px] bg-accent/25 border border-accent/30 text-white font-bold px-2 py-0.5 rounded uppercase tracking-wider">
                  Live walkthrough
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Sidebar Form Area */}
        <div className="w-full lg:w-80 bg-[#161220]/95 border-t lg:border-t-0 lg:border-l border-white/5 p-6 flex flex-col justify-between overflow-y-auto">
          <div>
            <span className="text-accent text-[9px] uppercase tracking-widest font-bold block mb-1">Exclusive Access</span>
            <h3 className="font-serif font-bold text-white text-lg leading-tight mb-1">{property.title}</h3>
            <p className="text-cream/50 text-xs mb-4">{property.address}</p>
            <div className="text-serif font-bold text-white text-xl border-b border-white/5 pb-4 mb-4">
              {property.priceDisplay}
            </div>

            {formSubmitted ? (
              <div className="text-center py-6 bg-white/[0.02] rounded-2xl border border-white/5">
                <CheckCircle size={28} className="text-accent mx-auto mb-2" />
                <h4 className="font-serif font-bold text-white text-sm mb-1">Brochure Requested</h4>
                <p className="text-cream/50 text-[10px] leading-relaxed max-w-xs mx-auto px-2">
                  We have sent the HD walkthrough and premium floor plans to your email. Our consultant will contact you shortly.
                </p>
              </div>
            ) : (
              <form onSubmit={handleInquiry} className="space-y-3.5">
                <div>
                  <label className="text-[9px] uppercase tracking-wider font-bold text-cream/50 block mb-1">Your Name *</label>
                  <input
                    required
                    type="text"
                    placeholder="Rahul Sharma"
                    value={form.name}
                    onChange={e => setForm(f => ({ ...f, name: e.target.value }))}
                    className="w-full border border-white/10 rounded-xl px-3 py-2.5 text-xs text-white font-medium focus:outline-none focus:border-accent bg-white/[0.02] placeholder:text-cream/20"
                  />
                </div>
                <div>
                  <label className="text-[9px] uppercase tracking-wider font-bold text-cream/50 block mb-1">Your Phone *</label>
                  <input
                    required
                    type="tel"
                    placeholder="+91 98765"
                    value={form.phone}
                    onChange={e => setForm(f => ({ ...f, phone: e.target.value }))}
                    className="w-full border border-white/10 rounded-xl px-3 py-2.5 text-xs text-white font-medium focus:outline-none focus:border-accent bg-white/[0.02] placeholder:text-cream/20"
                  />
                </div>
                <div>
                  <label className="text-[9px] uppercase tracking-wider font-bold text-cream/50 block mb-1">Your Email</label>
                  <input
                    type="email"
                    placeholder="rahul@email.com"
                    value={form.email}
                    onChange={e => setForm(f => ({ ...f, email: e.target.value }))}
                    className="w-full border border-white/10 rounded-xl px-3 py-2.5 text-xs text-white font-medium focus:outline-none focus:border-accent bg-white/[0.02] placeholder:text-cream/20"
                  />
                </div>
                <button
                  type="submit"
                  className="w-full bg-accent hover:bg-accent-dark text-white font-bold uppercase tracking-wider py-3 rounded-xl transition-all duration-300 text-[10px] shadow-luxury"
                >
                  Request Full Walkthrough
                </button>
              </form>
            )}
          </div>

          <div className="border-t border-white/5 pt-4 mt-6 flex items-center justify-between gap-3 text-[9px] text-cream/35">
            <span className="flex items-center gap-1">
              <Phone size={10} className="text-accent" /> +91 22 8976 5432
            </span>
            <span>ID: #00{property.id}</span>
          </div>
        </div>
      </div>
    </div>
  );
}
