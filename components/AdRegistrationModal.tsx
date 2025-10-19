"use client";

import { useState } from "react";

interface AdRegistrationModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (brandName: string, logoFile: File, amount: number) => void;
  currentCompetitors: number;
  minBid: number;
}

export default function AdRegistrationModal({
  isOpen,
  onClose,
  onSubmit,
  currentCompetitors,
  minBid,
}: AdRegistrationModalProps) {
  const [brandName, setBrandName] = useState("");
  const [logoFile, setLogoFile] = useState<File | null>(null);
  const [amount, setAmount] = useState(minBid);
  const [logoPreview, setLogoPreview] = useState<string>("");

  if (!isOpen) return null;

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setLogoFile(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setLogoPreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = () => {
    if (!brandName || !logoFile || amount < minBid) {
      alert("Please fill all fields and meet minimum bid!");
      return;
    }
    onSubmit(brandName, logoFile, amount);
    onClose();
    // Reset form
    setBrandName("");
    setLogoFile(null);
    setAmount(minBid);
    setLogoPreview("");
  };

  const calculateDifficulty = (bid: number) => {
    return Math.floor(bid / minBid);
  };

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-gradient-to-br from-slate-800 to-slate-900 rounded-2xl border border-white/20 max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="p-6 border-b border-white/10">
          <div className="flex justify-between items-center">
            <h2 className="text-2xl font-bold text-white">📢 Register Your Ad</h2>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-white transition-colors text-2xl"
            >
              ×
            </button>
          </div>
        </div>

        {/* Content */}
        <div className="p-6 space-y-6">
          {/* Info Box */}
          <div className="bg-purple-500/20 border border-purple-500/40 rounded-xl p-4">
            <h3 className="font-bold text-purple-300 mb-2">💡 How It Works</h3>
            <ul className="text-sm text-gray-300 space-y-1">
              <li>• Minimum bid: <span className="text-green-400">${minBid}</span></li>
              <li>• Current competitors: <span className="text-yellow-400">{currentCompetitors}</span></li>
              <li>• Higher bids = Higher priority & Faster balls</li>
              <li>• Players win 70% of total ad pool</li>
              <li>• No limits - pay more for more visibility!</li>
            </ul>
          </div>

          {/* Brand Name */}
          <div>
            <label className="block text-sm font-semibold text-gray-300 mb-2">
              Brand Name
            </label>
            <input
              type="text"
              value={brandName}
              onChange={(e) => setBrandName(e.target.value)}
              placeholder="Enter your brand name"
              className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:border-purple-400"
            />
          </div>

          {/* Logo Upload */}
          <div>
            <label className="block text-sm font-semibold text-gray-300 mb-2">
              Brand Logo
            </label>
            <div className="flex gap-4 items-center">
              <label className="flex-1 px-4 py-3 bg-white/10 border border-white/20 rounded-xl text-gray-300 cursor-pointer hover:bg-white/20 transition-all text-center">
                {logoFile ? logoFile.name : "Choose file..."}
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleFileChange}
                  className="hidden"
                />
              </label>
              {logoPreview && (
                <div className="w-16 h-16 rounded-full overflow-hidden border-2 border-white/40">
                  <img
                    src={logoPreview}
                    alt="Preview"
                    className="w-full h-full object-cover"
                  />
                </div>
              )}
            </div>
          </div>

          {/* Bid Amount */}
          <div>
            <label className="block text-sm font-semibold text-gray-300 mb-2">
              Your Bid (USD)
            </label>
            <input
              type="number"
              value={amount}
              onChange={(e) => setAmount(Number(e.target.value))}
              min={minBid}
              step="0.01"
              className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white focus:outline-none focus:border-purple-400"
            />
            <div className="mt-2 flex justify-between text-xs text-gray-400">
              <span>Min: ${minBid}</span>
              <span>Difficulty multiplier: {calculateDifficulty(amount)}x</span>
            </div>
          </div>

          {/* Preview Stats */}
          <div className="grid grid-cols-3 gap-3">
            <div className="bg-blue-500/20 border border-blue-500/40 rounded-lg p-3 text-center">
              <p className="text-xs text-blue-300">Your Bid</p>
              <p className="text-lg font-bold text-blue-400">${amount}</p>
            </div>
            <div className="bg-green-500/20 border border-green-500/40 rounded-lg p-3 text-center">
              <p className="text-xs text-green-300">Prize Pool</p>
              <p className="text-lg font-bold text-green-400">${(amount * 0.7).toFixed(2)}</p>
            </div>
            <div className="bg-purple-500/20 border border-purple-500/40 rounded-lg p-3 text-center">
              <p className="text-xs text-purple-300">Platform</p>
              <p className="text-lg font-bold text-purple-400">${(amount * 0.3).toFixed(2)}</p>
            </div>
          </div>

          {/* Submit Button */}
          <button
            onClick={handleSubmit}
            className="w-full px-6 py-4 bg-gradient-to-r from-purple-500 to-pink-500 rounded-xl hover:from-purple-600 hover:to-pink-600 transition-all font-bold text-white text-lg"
          >
            Register Ad for ${amount}
          </button>
        </div>
      </div>
    </div>
  );
}

