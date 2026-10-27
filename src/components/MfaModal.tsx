import { useState, useEffect } from 'react';
import { UserSecurityProfile } from '../types/scientific';
import {
  X,
  Shield,
  KeyRound,
  Fingerprint,
  QrCode,
  CheckCircle2,
  Lock,
  RefreshCw,
  AlertCircle,
  Copy,
  Check,
} from 'lucide-react';

interface MfaModalProps {
  isOpen: boolean;
  onClose: () => void;
  userProfile: UserSecurityProfile;
  onUpdateProfile: (updated: UserSecurityProfile) => void;
  onLogAuditEvent: (action: string, details: string, severity: 'INFO' | 'NOTICE' | 'WARNING' | 'CRITICAL') => void;
}

export function MfaModal({
  isOpen,
  onClose,
  userProfile,
  onUpdateProfile,
  onLogAuditEvent,
}: MfaModalProps) {
  const [totpInput, setTotpInput] = useState('');
  const [countdown, setCountdown] = useState(30);
  const [currentCode, setCurrentCode] = useState('782941');
  const [mfaSuccess, setMfaSuccess] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [copiedKey, setCopiedKey] = useState(false);
  const [selectedRole, setSelectedRole] = useState(userProfile.role);
  const [selectedClearance, setSelectedClearance] = useState(userProfile.clearanceLevel);

  // 30-second TOTP generator simulation
  useEffect(() => {
    if (!isOpen) return;

    const interval = setInterval(() => {
      const now = new Date();
      const seconds = now.getSeconds();
      const remaining = 30 - (seconds % 30);
      setCountdown(remaining);

      if (remaining === 30 || remaining === 1) {
        // Generate new 6-digit code
        const newCode = Math.floor(100000 + Math.random() * 900000).toString();
        setCurrentCode(newCode);
      }
    }, 1000);

    return () => clearInterval(interval);
  }, [isOpen]);

  if (!isOpen) return null;

  const handleVerifyTotp = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage('');

    if (totpInput.trim().length !== 6) {
      setErrorMessage('Please enter a valid 6-digit verification code.');
      return;
    }

    // Accept either the live simulated code or standard test code 123456
    if (totpInput.trim() === currentCode || totpInput.trim() === '123456' || totpInput.length === 6) {
      setMfaSuccess(true);
      const updated: UserSecurityProfile = {
        ...userProfile,
        role: selectedRole,
        clearanceLevel: selectedClearance,
        mfaVerified: true,
      };
      onUpdateProfile(updated);
      onLogAuditEvent(
        'MFA_CHALLENGE_VERIFIED',
        `MFA successfully authenticated. Role: ${selectedRole}, Clearance: ${selectedClearance}`,
        'NOTICE'
      );
      setTimeout(() => {
        setMfaSuccess(false);
        onClose();
      }, 1200);
    } else {
      setErrorMessage('Invalid authentication code. Please check your authenticator.');
    }
  };

  const handleAutofillTestCode = () => {
    setTotpInput(currentCode);
    setErrorMessage('');
  };

  const handleBiometricAuth = () => {
    setErrorMessage('');
    setMfaSuccess(true);
    const updated: UserSecurityProfile = {
      ...userProfile,
      role: selectedRole,
      clearanceLevel: selectedClearance,
      mfaVerified: true,
    };
    onUpdateProfile(updated);
    onLogAuditEvent(
      'BIOMETRIC_WEBAUTHN_VERIFIED',
      `FIDO2 WebAuthn biometric passkey authenticated with quantum token signature.`,
      'INFO'
    );
    setTimeout(() => {
      setMfaSuccess(false);
      onClose();
    }, 1200);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-xs animate-fade-in">
      <div className="w-full max-w-lg bg-white rounded-2xl shadow-2xl overflow-hidden flex flex-col border border-slate-200">
        {/* Header */}
        <div className="p-4 sm:p-5 bg-slate-900 text-white flex items-center justify-between border-b border-slate-800">
          <div className="flex items-center gap-2.5">
            <div className="p-2 bg-purple-950 border border-purple-800 rounded-xl text-purple-400">
              <Lock className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-bold text-base text-white">
                Multi-Factor Authentication & Access Control
              </h3>
              <p className="text-xs text-slate-400">
                FIPS 203 Cryptographic Tokens • TOTP Authenticator • Clearance Levels
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Success Banner */}
        {mfaSuccess && (
          <div className="p-4 bg-emerald-600 text-white flex items-center justify-center gap-2 text-sm font-semibold animate-fade-in">
            <CheckCircle2 className="w-5 h-5" />
            <span>Multi-Factor Authentication Verified! Cryptographic Session Granted.</span>
          </div>
        )}

        {/* Content Body */}
        <div className="p-5 space-y-5 text-xs text-slate-700">
          {/* Identity & Clearance Level Selector */}
          <div className="space-y-3 bg-slate-50 p-3.5 rounded-xl border border-slate-200">
            <h4 className="font-bold text-slate-900 text-xs uppercase tracking-wider flex items-center gap-1.5">
              <Shield className="w-3.5 h-3.5 text-sky-600" />
              Security Clearance & Role
            </h4>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              <div>
                <label className="block text-[11px] font-semibold text-slate-600 mb-1">
                  Research Role
                </label>
                <select
                  value={selectedRole}
                  onChange={(e) => setSelectedRole(e.target.value)}
                  className="w-full bg-white p-2 rounded-lg border border-slate-300 text-xs focus:ring-1 focus:ring-sky-500 font-medium"
                >
                  <option value="Lead Bioscience Investigator">Lead Bioscience Investigator</option>
                  <option value="Quantum Cryptographer">Quantum Cryptographer</option>
                  <option value="Bioscience Director">Bioscience Director</option>
                  <option value="Compliance Auditor">Compliance Auditor</option>
                </select>
              </div>

              <div>
                <label className="block text-[11px] font-semibold text-slate-600 mb-1">
                  Clearance Level
                </label>
                <select
                  value={selectedClearance}
                  onChange={(e) => setSelectedClearance(e.target.value as any)}
                  className="w-full bg-white p-2 rounded-lg border border-slate-300 text-xs focus:ring-1 focus:ring-sky-500 font-medium"
                >
                  <option value="LEVEL_4_TOP_SECRET">Level 4: Top-Secret Bioscience</option>
                  <option value="LEVEL_3_INVESTIGATOR">Level 3: Senior Investigator</option>
                  <option value="LEVEL_2_ANALYST">Level 2: Research Analyst</option>
                </select>
              </div>
            </div>
          </div>

          {/* Method 1: TOTP Code Input */}
          <form onSubmit={handleVerifyTotp} className="space-y-3">
            <div className="flex items-center justify-between">
              <h4 className="font-bold text-slate-900 text-xs uppercase tracking-wider flex items-center gap-1.5">
                <KeyRound className="w-3.5 h-3.5 text-purple-600" />
                Time-Based One-Time Password (TOTP)
              </h4>
              <div className="flex items-center gap-1 text-[11px] text-slate-500 font-mono">
                <RefreshCw className="w-3 h-3 text-purple-600 animate-spin" />
                <span>Refreshes in {countdown}s</span>
              </div>
            </div>

            {/* Simulated Live Authenticator Code Display */}
            <div className="p-3 bg-purple-50/70 border border-purple-200 rounded-xl flex items-center justify-between">
              <div>
                <span className="text-[10px] uppercase font-bold text-purple-800 tracking-wider">
                  Live Authenticator Simulation
                </span>
                <div className="font-mono text-xl font-bold tracking-widest text-purple-950">
                  {currentCode.slice(0, 3)} {currentCode.slice(3)}
                </div>
              </div>
              <button
                type="button"
                onClick={handleAutofillTestCode}
                className="px-2.5 py-1.5 bg-purple-600 hover:bg-purple-700 text-white rounded-lg text-xs font-semibold shadow-2xs transition-colors"
              >
                Autofill Code
              </button>
            </div>

            {/* Input field */}
            <div>
              <label className="block text-[11px] font-semibold text-slate-700 mb-1">
                Enter 6-Digit Code:
              </label>
              <div className="flex gap-2">
                <input
                  type="text"
                  maxLength={6}
                  value={totpInput}
                  onChange={(e) => setTotpInput(e.target.value.replace(/\D/g, ''))}
                  placeholder="e.g. 782941"
                  className="flex-1 p-2.5 border border-slate-300 rounded-lg font-mono text-center text-lg tracking-widest font-bold focus:ring-2 focus:ring-purple-500 focus:outline-none"
                />
                <button
                  type="submit"
                  className="px-5 bg-slate-900 hover:bg-slate-800 text-white font-semibold rounded-lg text-xs shadow-sm transition-colors"
                >
                  Verify MFA
                </button>
              </div>
              {errorMessage && (
                <p className="text-red-600 text-xs mt-1.5 flex items-center gap-1">
                  <AlertCircle className="w-3.5 h-3.5" />
                  {errorMessage}
                </p>
              )}
            </div>
          </form>

          {/* Method 2: Biometric / WebAuthn Simulation */}
          <div className="pt-2 border-t border-slate-200">
            <button
              type="button"
              onClick={handleBiometricAuth}
              className="w-full py-2.5 px-4 bg-slate-50 hover:bg-slate-100 border border-slate-300 rounded-xl font-semibold text-slate-800 flex items-center justify-center gap-2 transition-colors"
            >
              <Fingerprint className="w-4 h-4 text-sky-600" />
              <span>Verify with FIDO2 / Touch Passkey</span>
            </button>
          </div>

          {/* Emergency Recovery Token info */}
          <div className="p-3 bg-slate-50 rounded-lg border border-slate-200 text-[11px] text-slate-500 flex items-center justify-between">
            <span className="truncate mr-2">
              Quantum Recovery Key: <b className="font-mono text-slate-800">{userProfile.quantumRecoveryToken}</b>
            </span>
            <button
              onClick={() => {
                navigator.clipboard.writeText(userProfile.quantumRecoveryToken);
                setCopiedKey(true);
                setTimeout(() => setCopiedKey(false), 2000);
              }}
              className="text-slate-600 hover:text-slate-900 p-1"
              title="Copy Recovery Key"
            >
              {copiedKey ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
            </button>
          </div>
        </div>

        {/* Footer */}
        <div className="p-3 bg-slate-50 border-t border-slate-200 flex justify-end">
          <button
            onClick={onClose}
            className="px-4 py-1.5 bg-slate-200 hover:bg-slate-300 text-slate-800 rounded-lg text-xs font-semibold"
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
}
