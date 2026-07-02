import { useState } from 'react';
import { Link } from 'react-router-dom';
import { MapPin, Heart, BadgeCheck, TrendingDown, Sparkles, ChevronLeft, ChevronRight } from 'lucide-react';

export default function PropertyCard({ property, className = '' }) {
  const [liked, setLiked] = useState(false);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [imgLoaded, setImgLoaded] = useState(false);

  const handleLike = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setLiked(!liked);
  };

  const nextImage = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (property.images && property.images.length > 0) {
      setCurrentImageIndex((prev) => (prev + 1) % property.images.length);
    }
  };

  const prevImage = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (property.images && property.images.length > 0) {
      setCurrentImageIndex((prev) => (prev - 1 + property.images.length) % property.images.length);
    }
  };

  const handleDotClick = (e, idx) => {
    e.preventDefault();
    e.stopPropagation();
    setCurrentImageIndex(idx);
  };

  return (
    <Link
      to={`/properties/${property.id}`}
      className={`group block glass rounded-3xl overflow-hidden shadow-luxury hover:shadow-luxury-hover border border-white/10 transition-all duration-500 hover:-translate-y-1.5 ${className}`}
    >
      {/* Image Carousel Container */}
      <div className="relative overflow-hidden aspect-[4/3] bg-[#110D1A]/40">
        {!imgLoaded && (
          <div className="absolute inset-0 bg-[#110D1A]/50 animate-pulse" />
        )}
        <img
          src={property.images && property.images.length > 0 ? property.images[currentImageIndex] : ''}
          alt={`${property.title} - Image ${currentImageIndex + 1}`}
          className={`w-full h-full object-cover group-hover:scale-103 transition-transform duration-700 ${imgLoaded ? 'opacity-100' : 'opacity-0'}`}
          onLoad={() => setImgLoaded(true)}
          loading="lazy"
        />

        {/* Carousel Arrow Controls */}
        {property.images && property.images.length > 1 && (
          <>
            <button
              onClick={prevImage}
              className="absolute top-1/2 -translate-y-1/2 left-3.5 w-7 h-7 rounded-full bg-black/50 hover:bg-black/75 text-white flex items-center justify-center opacity-100 sm:opacity-0 sm:group-hover:opacity-100 transition-all duration-300 hover:scale-105 z-10 border border-white/10"
              aria-label="Previous image"
            >
              <ChevronLeft size={14} className="stroke-[2.5]" />
            </button>
            <button
              onClick={nextImage}
              className="absolute top-1/2 -translate-y-1/2 right-3.5 w-7 h-7 rounded-full bg-black/50 hover:bg-black/75 text-white flex items-center justify-center opacity-100 sm:opacity-0 sm:group-hover:opacity-100 transition-all duration-300 hover:scale-105 z-10 border border-white/10"
              aria-label="Next image"
            >
              <ChevronRight size={14} className="stroke-[2.5]" />
            </button>
          </>
        )}

        {/* Carousel Dots Indicators */}
        {property.images && property.images.length > 1 && (
          <div className="absolute bottom-3 left-1/2 -translate-x-1/2 flex gap-1.5 z-10">
            {property.images.map((_, idx) => (
              <button
                key={idx}
                onClick={(e) => handleDotClick(e, idx)}
                className={`w-1.5 h-1.5 rounded-full transition-all duration-300 ${
                  idx === currentImageIndex ? 'bg-white scale-125' : 'bg-white/40 hover:bg-white/70'
                }`}
                aria-label={`Go to slide ${idx + 1}`}
              />
            ))}
          </div>
        )}

        {/* Top-Left Badges */}
        <div className="absolute top-3.5 left-3.5 flex flex-col gap-1.5 z-10">
          {property.isNew && (
            <span className="flex items-center gap-1 bg-accent/25 text-white text-[9px] font-bold px-2.5 py-1 rounded-full uppercase tracking-wider backdrop-blur-md border border-accent/30 shadow-sm">
              <Sparkles size={9} className="text-white" /> New Launch
            </span>
          )}
          {property.featured && !property.isNew && (
            <span className="bg-primary/80 text-cream text-[9px] font-bold px-2.5 py-1 rounded-full uppercase tracking-wider shadow-sm border border-white/10 backdrop-blur-md">
              Featured
            </span>
          )}
          {property.isPriceDrop && (
            <span className="flex items-center gap-1 bg-red-950/40 text-red-300 text-[9px] font-bold px-2.5 py-1 rounded-full uppercase tracking-wider backdrop-blur-md border border-red-900/30 shadow-sm">
              <TrendingDown size={9} /> Price Drop
            </span>
          )}
        </div>

        {/* Top-Right Controls */}
        <div className="absolute top-3.5 right-3.5 flex items-center gap-1.5 z-10">
          {property.reraApproved && (
            <div className="bg-white/15 text-green-300 text-[9px] font-bold tracking-wider uppercase px-2.5 py-1 rounded-full flex items-center gap-1 shadow-sm backdrop-blur-md border border-white/10">
              <BadgeCheck size={11} className="text-green-400" /> RERA
            </div>
          )}
          <button
            onClick={handleLike}
            className={`w-7 h-7 rounded-full flex items-center justify-center transition-all duration-300 border border-white/10 ${
              liked ? 'bg-red-500 text-white border-transparent shadow-md' : 'bg-black/55 hover:bg-black/70 text-cream/80 hover:text-red-400 hover:scale-105 backdrop-blur-md'
            }`}
            aria-label="Save property"
          >
            <Heart size={12} fill={liked ? 'currentColor' : 'none'} className="transition-transform duration-300" />
          </button>
        </div>

        {/* Status Pill */}
        <div className="absolute bottom-3.5 left-3.5 z-10">
          <span
            className={`text-[9px] font-bold uppercase tracking-wider px-2.5 py-1 rounded-full backdrop-blur-md ${
              property.status === 'Available'
                ? 'bg-green-950/40 text-green-300 border border-green-900/30 shadow-sm'
                : 'bg-amber-950/40 text-amber-300 border border-amber-900/30 shadow-sm'
            }`}
          >
            {property.status}
          </span>
        </div>
      </div>

      {/* Content */}
      <div className="p-3 sm:p-5 flex flex-col gap-1.5 sm:gap-2.5">
        {/* Category + Location tag */}
        <div className="flex items-center justify-between gap-1.5 text-[9px] sm:text-[10px] uppercase tracking-wider font-bold text-cream/40">
          <span className="truncate">{property.category} · {property.area}</span>
          <span className="hidden sm:inline text-[9px] text-accent bg-accent/5 px-2 py-0.5 rounded border border-accent/15 shrink-0">
            {property.type}
          </span>
        </div>

        {/* Title */}
        <h3 className="font-serif text-sm sm:text-base font-semibold text-white leading-snug line-clamp-1 group-hover:text-accent transition-colors duration-300">
          {property.title}
        </h3>

        {/* Address */}
        <div className="flex items-center gap-1 text-cream/50 text-[11px] sm:text-xs">
          <MapPin size={11} className="text-accent shrink-0" />
          <span className="truncate">{property.address}</span>
        </div>

        {/* Specifications */}
        <div className="flex items-center flex-wrap gap-x-2.5 gap-y-1 sm:gap-3 text-[10px] sm:text-xs text-cream/60 border-t border-white/5 pt-2.5 sm:pt-3.5 mt-1">
          {property.bhk && (
            <span className="flex items-center gap-1 sm:gap-1.5">
              <span className="w-1.5 h-1.5 rounded-full bg-accent/60" />
              {property.bhk} BHK
            </span>
          )}
          <span className="flex items-center gap-1 sm:gap-1.5">
            <span className="w-1.5 h-1.5 rounded-full bg-accent/60" />
            {property.bathrooms} Bath
          </span>
          <span className="flex items-center gap-1 sm:gap-1.5">
            <span className="w-1.5 h-1.5 rounded-full bg-accent/60" />
            {property.sqftDisplay}
          </span>
        </div>

        {/* Price Section */}
        <div className="flex items-end justify-between border-t border-white/5 pt-2.5 sm:pt-3.5 mt-1">
          <div>
            <div className="text-[8px] sm:text-[9px] text-cream/40 uppercase tracking-widest font-bold mb-0.5">
              {property.purpose === 'Rent' ? 'Rent' : 'Price'}
            </div>
            <div className="font-serif font-bold text-sm sm:text-lg text-white tracking-wide">{property.priceDisplay}</div>
          </div>
          <div className="text-right">
            {property.purpose === 'Rent' ? (
              <>
                <div className="text-[8px] sm:text-[9px] text-cream/40 uppercase tracking-widest font-bold mb-0.5">Type</div>
                <div className="text-[10px] sm:text-xs text-accent font-bold uppercase tracking-wider">For Rent</div>
              </>
            ) : (
              <>
                <div className="text-[8px] sm:text-[9px] text-cream/40 uppercase tracking-widest font-bold mb-0.5">Rate</div>
                <div className="text-[10px] sm:text-xs text-cream/70 font-semibold">{property.pricePerSqft} / sq.ft</div>
              </>
            )}
          </div>
        </div>
      </div>
    </Link>
  );
}
