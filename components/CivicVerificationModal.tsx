"use client";

import { useState } from "react";

interface CivicVerificationModalProps {
  isOpen: boolean;
  onClose: () => void;
  onVerify: () => void;
  isVerifying: boolean;
}

export default function CivicVerificationModal({
  isOpen,
  onClose,
  onVerify,
  isVerifying,
}: CivicVerificationModalProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-gradient-to-br from-purple-900 to-slate-900 rounded-2xl border border-purple-500/40 max-w-md w-full shadow-2xl">
        {/* Header */}
        <div className="p-6 border-b border-purple-500/30">
          <div className="flex justify-between items-center">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-purple-500/20 rounded-full flex items-center justify-center">
                <span className="text-2xl">🔐</span>
              </div>
              <div>
                <h2 className="text-xl font-bold text-white">Civic Verification</h2>
                <p className="text-xs text-purple-300">Identity Verification</p>
              </div>
            </div>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-white transition-colors text-2xl"
            >
              ×
            </button>
          </div>
        </div>

        {/* Content */}
        <div className="p-6 space-y-4">
          {/* Info Box */}
          <div className="bg-purple-500/10 border border-purple-500/30 rounded-xl p-4">
            <h3 className="font-bold text-purple-300 mb-2 flex items-center gap-2">
              <span>✨</span> Benefits
            </h3>
            <ul className="text-sm text-gray-300 space-y-1.5">
              <li className="flex items-start gap-2">
                <span className="text-green-400 mt-0.5">✓</span>
                <span><strong className="text-green-400">2x Score Multiplier</strong> - Earn double points!</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-blue-400 mt-0.5">✓</span>
                <span><strong className="text-blue-400">Trusted Player</strong> - Verified identity badge</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-purple-400 mt-0.5">✓</span>
                <span><strong className="text-purple-400">One-Time Setup</strong> - Verify once, play forever</span>
              </li>
            </ul>
          </div>

          {/* How it works */}
          <div className="space-y-3">
            <h3 className="font-semibold text-white text-sm">How it works:</h3>
            <div className="space-y-2">
              <div className="flex gap-3">
                <div className="w-6 h-6 bg-purple-500 rounded-full flex items-center justify-center text-xs font-bold flex-shrink-0">
                  1
                </div>
                <div className="text-sm text-gray-300">
                  Click <strong className="text-white">"Verify Now"</strong> below
                </div>
              </div>
              <div className="flex gap-3">
                <div className="w-6 h-6 bg-purple-500 rounded-full flex items-center justify-center text-xs font-bold flex-shrink-0">
                  2
                </div>
                <div className="text-sm text-gray-300">
                  Civic will verify your identity <span className="text-purple-300">(simulated)</span>
                </div>
              </div>
              <div className="flex gap-3">
                <div className="w-6 h-6 bg-purple-500 rounded-full flex items-center justify-center text-xs font-bold flex-shrink-0">
                  3
                </div>
                <div className="text-sm text-gray-300">
                  Start earning <strong className="text-green-400">2x points</strong> immediately!
                </div>
              </div>
            </div>
          </div>

          {/* Demo Notice */}
          <div className="bg-blue-500/10 border border-blue-500/30 rounded-lg p-3">
            <p className="text-xs text-blue-300 flex items-start gap-2">
              <span className="text-base">ℹ️</span>
              <span>
                <strong>Demo Mode:</strong> This is a simulated Civic verification for demonstration purposes. 
                In production, this would connect to the real Civic Auth system.
              </span>
            </p>
          </div>

          {/* Action Buttons */}
          <div className="flex gap-3 pt-2">
            <button
              onClick={onClose}
              className="flex-1 px-4 py-3 bg-gray-700 hover:bg-gray-600 rounded-xl transition-all font-semibold text-white"
            >
              Cancel
            </button>
            <button
              onClick={onVerify}
              disabled={isVerifying}
              className="flex-1 px-4 py-3 bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 rounded-xl transition-all font-semibold text-white disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isVerifying ? (
                <span className="flex items-center justify-center gap-2">
                  <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none"/>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"/>
                  </svg>
                  Verifying...
                </span>
              ) : (
                "Verify Now"
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

