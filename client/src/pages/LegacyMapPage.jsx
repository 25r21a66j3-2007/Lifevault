import React, { useState, useEffect } from 'react';
import {
  GitFork,
  Shield,
  Coins,
  Home,
  Globe,
  FileBox,
  Users,
  Radio,
  Lock,
  ArrowRight,
  ChevronDown,
  ChevronRight,
  Sparkles,
  CheckCircle2,
  AlertTriangle
} from 'lucide-react';
import { api } from '../services/api';
import { useAuth } from '../context/AuthContext';

export default function LegacyMapPage() {
  const { user } = useAuth();
  const [assets, setAssets] = useState([]);
  const [nominees, setNominees] = useState([]);
  const [documents, setDocuments] = useState([]);
  const [settings, setSettings] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadData() {
      try {
        const [assetsRes, nomineesRes, docsRes, settingsRes] = await Promise.all([
          api.getAssets(),
          api.getNominees(),
          api.getDocuments(),
          api.getActivationSettings()
        ]);
        if (assetsRes.success) setAssets(assetsRes.assets || []);
        if (nomineesRes.success) setNominees(nomineesRes.nominees || []);
        if (docsRes.success) setDocuments(docsRes.documents || []);
        if (settingsRes.success) setSettings(settingsRes.settings);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    }
    loadData();
  }, []);

  const financialAssets = assets.filter(a => a.categoryName === 'Financial');
  const propertyAssets = assets.filter(a => a.categoryName === 'Property');
  const digitalAssets = assets.filter(a => a.categoryName === 'Digital');
  const personalAssets = assets.filter(a => a.categoryName === 'Personal' || a.categoryName === 'Documents');

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <span className="text-xs font-bold uppercase tracking-wider text-slate-400">Relationship Topology</span>
          <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight">Legacy Architecture Map</h1>
          <p className="text-xs text-slate-500 mt-0.5">
            Visual relationship graph mapping: Owner → Categories → Assets → Documents → Nominees → Release Rules.
          </p>
        </div>

        <div className="flex items-center space-x-2 bg-emerald-50 text-emerald-800 border border-emerald-200 px-3.5 py-1.5 rounded-xl text-xs font-bold">
          <Sparkles className="w-3.5 h-3.5 text-emerald-600" />
          <span>Interactive Hierarchy Engine</span>
        </div>
      </div>

      {loading ? (
        <div className="text-center py-16 text-xs text-slate-500">Mapping vault topology...</div>
      ) : (
        <div className="bg-white rounded-3xl p-6 sm:p-10 border border-slate-200/80 shadow-premium overflow-x-auto">
          {/* ROOT LEVEL: OWNER */}
          <div className="flex flex-col items-center">
            <div className="p-4 sm:p-5 rounded-3xl bg-slate-900 text-white shadow-xl border-2 border-emerald-500/40 text-center min-w-[260px] relative">
              <div className="w-10 h-10 rounded-2xl bg-emerald-500/20 text-emerald-400 border border-emerald-500/40 flex items-center justify-center mx-auto mb-2">
                <Shield className="w-5 h-5" />
              </div>
              <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-400">Vault Owner</span>
              <h2 className="text-base font-extrabold">{user?.full_name || 'Ravi Kumar'}</h2>
              <p className="text-xs text-slate-300 font-mono mt-0.5">{user?.email || 'ravi@lifevault.com'}</p>
              
              <div className="mt-2.5 pt-2 border-t border-slate-800 flex items-center justify-center space-x-3 text-[11px] text-slate-400">
                <span>{assets.length} Assets</span>
                <span>•</span>
                <span>{nominees.length} Nominees</span>
                <span>•</span>
                <span>{documents.length} Docs</span>
              </div>
            </div>

            {/* Connecting Vertical Stem */}
            <div className="w-0.5 h-10 bg-slate-300"></div>
          </div>

          {/* LEVEL 2: ASSET CATEGORIES HORIZONTAL BUS */}
          <div className="relative">
            {/* Horizontal connector line */}
            <div className="hidden lg:block absolute top-0 left-12 right-12 h-0.5 bg-slate-300"></div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 pt-6">
              {/* Branch 1: Financial Assets */}
              <div className="flex flex-col space-y-3">
                <div className="p-3.5 rounded-2xl bg-emerald-50 border border-emerald-200 text-emerald-950 flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <Coins className="w-4 h-4 text-emerald-600" />
                    <span className="text-xs font-bold">Financial Assets ({financialAssets.length})</span>
                  </div>
                  <span className="text-[10px] font-bold text-emerald-700 bg-white px-2 py-0.5 rounded-full border border-emerald-200">
                    Banking &amp; Ins.
                  </span>
                </div>

                {financialAssets.map((asset) => (
                  <div
                    key={asset.id}
                    className="p-3.5 rounded-2xl border border-slate-200 bg-slate-50/70 hover:bg-white transition-all text-xs space-y-1.5 shadow-subtle"
                  >
                    <div className="flex items-center justify-between">
                      <span className="font-bold text-slate-900 truncate">{asset.name}</span>
                      <span className="text-[10px] font-mono text-slate-500">₹{(asset.approxValue / 100000).toFixed(1)}L</span>
                    </div>

                    <div className="flex items-center justify-between text-[11px] pt-1 border-t border-slate-200/60">
                      <span className="text-slate-400">Nominee:</span>
                      {asset.nomineeName ? (
                        <span className="font-semibold text-emerald-700 flex items-center space-x-1">
                          <span>→ {asset.nomineeName}</span>
                        </span>
                      ) : (
                        <span className="font-semibold text-red-600 flex items-center space-x-1">
                          <AlertTriangle className="w-3 h-3" />
                          <span>Unassigned (AI Flag)</span>
                        </span>
                      )}
                    </div>
                  </div>
                ))}
              </div>

              {/* Branch 2: Property Assets */}
              <div className="flex flex-col space-y-3">
                <div className="p-3.5 rounded-2xl bg-blue-50 border border-blue-200 text-blue-950 flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <Home className="w-4 h-4 text-blue-600" />
                    <span className="text-xs font-bold">Real Estate ({propertyAssets.length})</span>
                  </div>
                  <span className="text-[10px] font-bold text-blue-700 bg-white px-2 py-0.5 rounded-full border border-blue-200">
                    Physical Title
                  </span>
                </div>

                {propertyAssets.map((asset) => (
                  <div
                    key={asset.id}
                    className="p-3.5 rounded-2xl border border-slate-200 bg-slate-50/70 hover:bg-white transition-all text-xs space-y-1.5 shadow-subtle"
                  >
                    <div className="flex items-center justify-between">
                      <span className="font-bold text-slate-900 truncate">{asset.name}</span>
                      <span className="text-[10px] font-mono text-slate-500">₹{(asset.approxValue / 100000).toFixed(1)}L</span>
                    </div>

                    <div className="flex items-center justify-between text-[11px] pt-1 border-t border-slate-200/60">
                      <span className="text-slate-400">Nominee:</span>
                      <span className="font-semibold text-slate-800">
                        {asset.nomineeName ? `→ ${asset.nomineeName}` : 'Unassigned'}
                      </span>
                    </div>
                  </div>
                ))}
              </div>

              {/* Branch 3: Documents Vault */}
              <div className="flex flex-col space-y-3">
                <div className="p-3.5 rounded-2xl bg-amber-50 border border-amber-200 text-amber-950 flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <FileBox className="w-4 h-4 text-amber-600" />
                    <span className="text-xs font-bold">Documents Vault ({documents.length})</span>
                  </div>
                  <span className="text-[10px] font-bold text-amber-700 bg-white px-2 py-0.5 rounded-full border border-amber-200">
                    Legal Deeds
                  </span>
                </div>

                {documents.map((doc) => (
                  <div
                    key={doc.id}
                    className="p-3.5 rounded-2xl border border-slate-200 bg-slate-50/70 hover:bg-white transition-all text-xs space-y-1 shadow-subtle"
                  >
                    <div className="flex items-center justify-between">
                      <span className="font-bold text-slate-900 truncate">{doc.name}</span>
                      <span className="text-[10px] font-bold text-slate-500">{doc.category}</span>
                    </div>
                    <p className="text-[10px] text-slate-400 truncate">
                      Status: {doc.access_status} • AES-256
                    </p>
                  </div>
                ))}
              </div>

              {/* Branch 4: Nominees & Release Rules */}
              <div className="flex flex-col space-y-3">
                <div className="p-3.5 rounded-2xl bg-purple-50 border border-purple-200 text-purple-950 flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <Users className="w-4 h-4 text-purple-600" />
                    <span className="text-xs font-bold">Beneficiaries &amp; Rules</span>
                  </div>
                  <span className="text-[10px] font-bold text-purple-700 bg-white px-2 py-0.5 rounded-full border border-purple-200">
                    Release Gateway
                  </span>
                </div>

                {nominees.map((nominee) => (
                  <div
                    key={nominee.id}
                    className="p-3.5 rounded-2xl border border-purple-200/70 bg-purple-50/30 hover:bg-white transition-all text-xs space-y-2 shadow-subtle"
                  >
                    <div className="flex items-center justify-between">
                      <span className="font-bold text-slate-900">{nominee.name}</span>
                      <span className="text-[10px] font-bold text-purple-700 bg-purple-100 px-2 py-0.5 rounded-full">
                        {nominee.relationship}
                      </span>
                    </div>
                    <div className="text-[11px] text-slate-500 space-y-0.5">
                      <p>• {nominee.assigned_assets_count || 0} Assets Granted Access</p>
                      <p>• Trigger: {settings?.inactivity_days || 90}d Inactivity + Verification</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* LEVEL 3: RELEASE GATEWAY BANNER */}
          <div className="mt-10 p-5 rounded-2xl bg-slate-900 text-white flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 rounded-xl bg-emerald-500/20 text-emerald-400 flex items-center justify-center">
                <Radio className="w-5 h-5" />
              </div>
              <div>
                <h4 className="text-xs font-bold uppercase tracking-wider text-emerald-400">Release Pipeline</h4>
                <p className="text-xs text-slate-300">
                  Trigger: {settings?.inactivity_days || 90} Days Inactivity → Trusted Contact ({settings?.trusted_contact_name || 'Designated Physician'}) → Admin Approval → Nominee Release
                </p>
              </div>
            </div>

            <span className="text-xs font-bold text-slate-300 bg-slate-800 px-3 py-1.5 rounded-xl border border-slate-700 whitespace-nowrap">
              Status: {settings?.status?.toUpperCase() || 'NORMAL'}
            </span>
          </div>
        </div>
      )}
    </div>
  );
}
