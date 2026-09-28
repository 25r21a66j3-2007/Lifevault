import React, { useState, useEffect } from 'react';
import {
  Coins,
  Plus,
  Search,
  Filter,
  Eye,
  EyeOff,
  Edit2,
  Trash2,
  Lock,
  Landmark,
  Home,
  Globe,
  FileBox,
  HeartHandshake,
  ShieldAlert,
  ShieldCheck,
  CheckCircle2,
  Building,
  MoreVertical
} from 'lucide-react';
import { api } from '../services/api';
import AddAssetModal from '../components/modals/AddAssetModal';
import AssetDetailModal from '../components/modals/AssetDetailModal';

export default function AssetsPage() {
  const [assets, setAssets] = useState([]);
  const [nominees, setNominees] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [loading, setLoading] = useState(true);

  // Modals state
  const [showAddModal, setShowAddModal] = useState(false);
  const [editingAsset, setEditingAsset] = useState(null);
  const [inspectingAsset, setInspectingAsset] = useState(null);

  const categories = [
    { name: 'All', icon: Coins },
    { name: 'Financial', icon: Landmark },
    { name: 'Property', icon: Home },
    { name: 'Digital', icon: Globe },
    { name: 'Documents', icon: FileBox },
    { name: 'Personal', icon: HeartHandshake }
  ];

  const loadData = async () => {
    setLoading(true);
    try {
      const [assetsRes, nomineesRes] = await Promise.all([
        api.getAssets({
          category: selectedCategory !== 'All' ? selectedCategory : undefined,
          search: searchQuery || undefined
        }),
        api.getNominees()
      ]);

      if (assetsRes.success) setAssets(assetsRes.assets || []);
      if (nomineesRes.success) setNominees(nomineesRes.nominees || []);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, [selectedCategory, searchQuery]);

  const handleDelete = async (id, name, e) => {
    e.stopPropagation();
    if (window.confirm(`Are you sure you want to permanently delete asset "${name}" from your vault?`)) {
      try {
        await api.deleteAsset(id);
        loadData();
      } catch (err) {
        alert(err.message || 'Failed to delete asset.');
      }
    }
  };

  const totalValue = assets.reduce((sum, a) => sum + Number(a.approxValue || 0), 0);

  const getCategoryIcon = (cat) => {
    switch (cat) {
      case 'Financial': return <Landmark className="w-4 h-4 text-emerald-600" />;
      case 'Property': return <Home className="w-4 h-4 text-blue-600" />;
      case 'Digital': return <Globe className="w-4 h-4 text-purple-600" />;
      case 'Documents': return <FileBox className="w-4 h-4 text-amber-600" />;
      default: return <HeartHandshake className="w-4 h-4 text-rose-600" />;
    }
  };

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <span className="text-xs font-bold uppercase tracking-wider text-slate-400">Vault Assets</span>
          <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight">Asset Management</h1>
          <p className="text-xs text-slate-500 mt-0.5">
            Cataloged holdings across financial accounts, properties, legal instruments &amp; digital estates.
          </p>
        </div>

        <button
          onClick={() => {
            setEditingAsset(null);
            setShowAddModal(true);
          }}
          className="inline-flex items-center space-x-1.5 px-4 py-2.5 rounded-2xl bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold transition-all shadow-sm"
        >
          <Plus className="w-4 h-4 text-emerald-400" />
          <span>Add New Asset</span>
        </button>
      </div>

      {/* Category Tabs & Search Bar */}
      <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-4">
        {/* Category Pills */}
        <div className="flex items-center space-x-1 overflow-x-auto pb-1 max-w-full">
          {categories.map((c) => {
            const Icon = c.icon;
            const isSelected = selectedCategory === c.name;
            return (
              <button
                key={c.name}
                onClick={() => setSelectedCategory(c.name)}
                className={`flex items-center space-x-1.5 px-3.5 py-2 rounded-xl text-xs font-semibold whitespace-nowrap transition-all ${
                  isSelected
                    ? 'bg-slate-900 text-white shadow-sm'
                    : 'bg-white text-slate-600 hover:bg-slate-100 border border-slate-200/80'
                }`}
              >
                <Icon className={`w-3.5 h-3.5 ${isSelected ? 'text-emerald-400' : 'text-slate-400'}`} />
                <span>{c.name}</span>
              </button>
            );
          })}
        </div>

        {/* Search Input */}
        <div className="relative min-w-[240px]">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-2.5" />
          <input
            type="text"
            placeholder="Search assets, banks, policies..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-3.5 py-2 bg-white rounded-xl border border-slate-200/90 text-xs focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 outline-none shadow-subtle"
          />
        </div>
      </div>

      {/* Value Summary Banner */}
      <div className="bg-emerald-50/60 rounded-2xl p-4 border border-emerald-200/80 flex items-center justify-between text-xs text-emerald-900">
        <div className="flex items-center space-x-2">
          <ShieldCheck className="w-4 h-4 text-emerald-600 flex-shrink-0" />
          <span>
            Displaying <strong>{assets.length} assets</strong> in category &quot;{selectedCategory}&quot;
          </span>
        </div>
        <div>
          <span>Total Valuation: </span>
          <strong className="text-emerald-800 font-extrabold text-sm font-sans">
            ₹{totalValue.toLocaleString('en-IN')}
          </strong>
        </div>
      </div>

      {/* Assets Grid */}
      {loading ? (
        <div className="text-center py-16 text-xs text-slate-500">Loading cataloged assets...</div>
      ) : assets.length === 0 ? (
        <div className="bg-white rounded-3xl p-12 text-center border border-slate-200/80 shadow-premium">
          <Coins className="w-12 h-12 text-slate-300 mx-auto mb-3" />
          <h3 className="text-base font-bold text-slate-800">No assets found</h3>
          <p className="text-xs text-slate-500 max-w-sm mx-auto mt-1 mb-6">
            Get started by adding your first financial account, insurance policy, property deed, or digital credential.
          </p>
          <button
            onClick={() => {
              setEditingAsset(null);
              setShowAddModal(true);
            }}
            className="px-4 py-2 bg-slate-900 text-white rounded-xl text-xs font-bold hover:bg-slate-800"
          >
            + Add First Asset
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {assets.map((asset) => (
            <div
              key={asset.id}
              onClick={() => setInspectingAsset(asset)}
              className="bg-white rounded-3xl p-5 border border-slate-200/80 shadow-premium hover:border-emerald-300/80 hover:shadow-card-hover transition-all cursor-pointer flex flex-col justify-between group"
            >
              <div>
                {/* Header row */}
                <div className="flex items-start justify-between gap-2 mb-3">
                  <div className="flex items-center space-x-2.5 min-w-0">
                    <div className="w-9 h-9 rounded-xl bg-slate-50 border border-slate-200 flex items-center justify-center flex-shrink-0 shadow-subtle group-hover:bg-emerald-50 transition-colors">
                      {getCategoryIcon(asset.categoryName)}
                    </div>
                    <div className="min-w-0">
                      <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block truncate">
                        {asset.categoryName} {asset.subCategory ? `• ${asset.subCategory}` : ''}
                      </span>
                      <h3 className="text-sm font-bold text-slate-900 leading-tight truncate mt-0.5">
                        {asset.name}
                      </h3>
                    </div>
                  </div>

                  <span className="text-[10px] font-semibold text-emerald-800 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200 flex-shrink-0 flex items-center space-x-1">
                    <Lock className="w-2.5 h-2.5" />
                    <span>AES-256</span>
                  </span>
                </div>

                {/* Institution & Masked Account */}
                <div className="my-3 space-y-1.5 p-3 rounded-2xl bg-slate-50/80 border border-slate-200/70 text-xs">
                  <div className="flex items-center justify-between text-slate-600">
                    <span className="text-[11px] text-slate-400">Provider:</span>
                    <span className="font-semibold text-slate-800 truncate max-w-[150px]">
                      {asset.institution || 'Direct'}
                    </span>
                  </div>
                  <div className="flex items-center justify-between text-slate-600">
                    <span className="text-[11px] text-slate-400">Account ID:</span>
                    <span className="font-mono text-slate-800 font-semibold text-[11px]">
                      {asset.accountNumberMasked || '•••• •••• ••••'}
                    </span>
                  </div>
                </div>

                {/* Nominee Status */}
                <div className="mb-3 flex items-center justify-between text-xs">
                  <span className="text-[11px] text-slate-400">Beneficiary:</span>
                  {asset.nomineeName ? (
                    <span className="font-semibold text-slate-700 bg-slate-100 px-2 py-0.5 rounded-md">
                      {asset.nomineeName} ({asset.nomineeRelationship || 'Nominee'})
                    </span>
                  ) : (
                    <span className="font-semibold text-red-700 bg-red-50 border border-red-200 px-2 py-0.5 rounded-md text-[10px] flex items-center space-x-1">
                      <ShieldAlert className="w-3 h-3 text-red-500" />
                      <span>Unassigned</span>
                    </span>
                  )}
                </div>
              </div>

              {/* Bottom footer */}
              <div className="pt-3 border-t border-slate-100 flex items-center justify-between">
                <div>
                  <span className="text-[10px] uppercase font-bold text-slate-400 block">Est. Value</span>
                  <span className="text-sm font-extrabold text-slate-900 font-sans">
                    ₹{Number(asset.approxValue || 0).toLocaleString('en-IN')}
                  </span>
                </div>

                <div className="flex items-center space-x-1" onClick={(e) => e.stopPropagation()}>
                  <button
                    onClick={() => setInspectingAsset(asset)}
                    className="p-1.5 rounded-lg text-slate-500 hover:text-slate-900 hover:bg-slate-100 transition-colors"
                    title="View & Decrypt"
                  >
                    <Eye className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => {
                      setEditingAsset(asset);
                      setShowAddModal(true);
                    }}
                    className="p-1.5 rounded-lg text-slate-500 hover:text-slate-900 hover:bg-slate-100 transition-colors"
                    title="Edit Asset"
                  >
                    <Edit2 className="w-4 h-4" />
                  </button>
                  <button
                    onClick={(e) => handleDelete(asset.id, asset.name, e)}
                    className="p-1.5 rounded-lg text-slate-400 hover:text-red-600 hover:bg-red-50 transition-colors"
                    title="Delete Asset"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Modals */}
      <AddAssetModal
        isOpen={showAddModal}
        onClose={() => {
          setShowAddModal(false);
          setEditingAsset(null);
        }}
        onAssetSaved={loadData}
        editAsset={editingAsset}
        nominees={nominees}
      />

      <AssetDetailModal
        isOpen={!!inspectingAsset}
        onClose={() => setInspectingAsset(null)}
        asset={inspectingAsset}
        onEdit={(assetToEdit) => {
          setInspectingAsset(null);
          setEditingAsset(assetToEdit);
          setShowAddModal(true);
        }}
      />
    </div>
  );
}
