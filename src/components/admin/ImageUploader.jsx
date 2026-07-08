import { useRef, useState } from 'react';
import { Upload, X, Loader2 } from 'lucide-react';
import { uploadFiles } from '../../lib/imagekit';

export default function ImageUploader({ images, onChange, folder, label = 'Images' }) {
  const inputRef = useRef(null);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState('');

  const handleFiles = async (e) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;
    setUploading(true);
    setError('');
    try {
      const urls = await uploadFiles(files, { folder });
      onChange([...(images || []), ...urls]);
    } catch (err) {
      setError(err.message || 'Upload failed');
    } finally {
      setUploading(false);
      if (inputRef.current) inputRef.current.value = '';
    }
  };

  const removeAt = (idx) => {
    onChange((images || []).filter((_, i) => i !== idx));
  };

  return (
    <div>
      <label className="text-[10px] uppercase tracking-wider font-bold text-cream/50 block mb-2">{label}</label>
      <div className="flex flex-wrap gap-3 mb-2">
        {(images || []).map((url, idx) => (
          <div key={url + idx} className="relative w-20 h-20 rounded-xl overflow-hidden border border-white/10 shrink-0">
            <img src={url} alt="" className="w-full h-full object-cover" />
            <button
              type="button"
              onClick={() => removeAt(idx)}
              className="absolute top-1 right-1 w-5 h-5 rounded-full bg-black/60 hover:bg-red-500 text-white flex items-center justify-center"
            >
              <X size={11} />
            </button>
          </div>
        ))}
        <button
          type="button"
          onClick={() => inputRef.current?.click()}
          disabled={uploading}
          className="w-20 h-20 rounded-xl border border-dashed border-white/15 hover:border-accent flex items-center justify-center text-cream/50 hover:text-white transition-all duration-300 shrink-0 disabled:opacity-50"
        >
          {uploading ? <Loader2 size={18} className="animate-spin" /> : <Upload size={18} />}
        </button>
      </div>
      <input ref={inputRef} type="file" accept="image/*" multiple onChange={handleFiles} className="hidden" />
      {error && <p className="text-[10px] text-red-400">{error}</p>}
    </div>
  );
}
