import React, { useEffect, useState } from 'react';
import { companyApi } from '../../api/client';
import { Company } from '../../types';
import { LoadingSpinner } from '../../components/LoadingSpinner';
import { EmptyState } from '../../components/EmptyState';
import { Modal } from '../../components/Modal';
import { ConfirmDialog } from '../../components/ConfirmDialog';
import { useToast } from '../../context/ToastContext';
import {
  Building2,
  Plus,
  Search,
  Edit2,
  Trash2,
  ExternalLink,
  Globe,
  MapPin,
  Eye,
} from 'lucide-react';

export const CompanyManagement: React.FC = () => {
  const [companies, setCompanies] = useState<Company[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');

  // Add / Edit Modal state
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingCompany, setEditingCompany] = useState<Company | null>(null);
  const [formData, setFormData] = useState({
    name: '',
    logo: '',
    industry: '',
    description: '',
    website: '',
    location: '',
  });

  // View Modal state
  const [viewingCompany, setViewingCompany] = useState<Company | null>(null);

  // Delete Dialog state
  const [deletingCompany, setDeletingCompany] = useState<Company | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  const toast = useToast();

  useEffect(() => {
    loadCompanies();
  }, []);

  const loadCompanies = async () => {
    try {
      setLoading(true);
      const res = await companyApi.getAll();
      setCompanies(res);
    } catch (err) {
      console.error('Failed to load companies', err);
      toast.error('Failed to load companies');
    } finally {
      setLoading(false);
    }
  };

  const openAddModal = () => {
    setEditingCompany(null);
    setFormData({
      name: '',
      logo: '',
      industry: '',
      description: '',
      website: '',
      location: '',
    });
    setIsModalOpen(true);
  };

  const openEditModal = (comp: Company) => {
    setEditingCompany(comp);
    setFormData({
      name: comp.name,
      logo: comp.logo || '',
      industry: comp.industry || '',
      description: comp.description || '',
      website: comp.website || '',
      location: comp.location || '',
    });
    setIsModalOpen(true);
  };

  const handleFormSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name.trim()) {
      toast.warning('Company name is required');
      return;
    }

    try {
      if (editingCompany) {
        await companyApi.update(editingCompany.id, formData);
        toast.success(`Company '${formData.name}' updated successfully`);
      } else {
        await companyApi.create(formData);
        toast.success(`Company '${formData.name}' added successfully`);
      }
      setIsModalOpen(false);
      loadCompanies();
    } catch (err: any) {
      const msg = err.response?.data?.message || 'Operation failed';
      toast.error(msg);
    }
  };

  const handleDeleteConfirm = async () => {
    if (!deletingCompany) return;

    try {
      setIsDeleting(true);
      await companyApi.delete(deletingCompany.id);
      toast.success(`Company '${deletingCompany.name}' deleted successfully`);
      setDeletingCompany(null);
      loadCompanies();
    } catch (err: any) {
      const msg = err.response?.data?.message || 'Cannot delete company';
      toast.error(msg);
    } finally {
      setIsDeleting(false);
    }
  };

  const filteredCompanies = companies.filter((c) =>
    c.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    (c.industry && c.industry.toLowerCase().includes(searchTerm.toLowerCase())) ||
    (c.location && c.location.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  if (loading) {
    return <LoadingSpinner message="Loading registered recruiters..." />;
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-800 tracking-tight">Recruiting Companies</h1>
          <p className="text-xs text-slate-500 mt-1">
            Manage corporate partners, recruiters, and participating campus placement organizations.
          </p>
        </div>
        <button
          onClick={openAddModal}
          className="inline-flex items-center gap-2 px-4 py-2.5 bg-brand-600 text-white rounded-xl text-xs font-bold hover:bg-brand-700 shadow-sm shadow-brand-600/20 transition-colors"
        >
          <Plus className="w-4 h-4" /> Add New Company
        </button>
      </div>

      {/* Search Bar */}
      <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm flex items-center justify-between">
        <div className="relative w-full max-w-md">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
          <input
            type="text"
            placeholder="Search by company name, industry, or location..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-9 pr-3 py-2 text-xs border border-slate-200 rounded-lg focus:ring-2 focus:ring-brand-500"
          />
        </div>
        <span className="text-xs text-slate-500 font-medium hidden sm:inline">
          Total: {filteredCompanies.length} companies
        </span>
      </div>

      {/* Companies Table */}
      {filteredCompanies.length === 0 ? (
        <EmptyState
          title="No Companies Found"
          description="No recruiting companies found matching your search. Add a company to start organizing drives."
          actionText="Add New Company"
          onAction={openAddModal}
        />
      ) : (
        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-slate-200 text-sm">
              <thead className="bg-slate-50 text-xs font-semibold text-slate-500 uppercase tracking-wider text-left">
                <tr>
                  <th className="px-6 py-4">Company</th>
                  <th className="px-6 py-4">Industry / Domain</th>
                  <th className="px-6 py-4">Location</th>
                  <th className="px-6 py-4">Active Drives</th>
                  <th className="px-6 py-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200 text-slate-700">
                {filteredCompanies.map((comp) => (
                  <tr key={comp.id} className="hover:bg-slate-50/70 transition-colors">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3.5">
                        {comp.logo ? (
                          <img
                            src={comp.logo}
                            alt={comp.name}
                            className="w-10 h-10 rounded-xl object-cover border border-slate-100 shadow-2xs"
                          />
                        ) : (
                          <div className="w-10 h-10 rounded-xl bg-slate-100 flex items-center justify-center text-slate-500">
                            <Building2 className="w-5 h-5" />
                          </div>
                        )}
                        <div>
                          <p className="font-bold text-slate-900 text-sm">{comp.name}</p>
                          {comp.website && (
                            <a
                              href={comp.website}
                              target="_blank"
                              rel="noreferrer"
                              className="text-[11px] text-brand-600 hover:underline flex items-center gap-0.5 mt-0.5"
                            >
                              <Globe className="w-3 h-3" /> Website
                            </a>
                          )}
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-xs font-medium text-slate-600">
                      {comp.industry || 'Information Technology'}
                    </td>
                    <td className="px-6 py-4 text-xs text-slate-600">
                      <span className="flex items-center gap-1">
                        <MapPin className="w-3.5 h-3.5 text-slate-400" />
                        {comp.location || 'Pan India'}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-xs">
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full font-semibold bg-blue-50 text-blue-700 border border-blue-200">
                        {comp.activeDrivesCount || 0} Drives
                      </span>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <div className="inline-flex items-center gap-1.5">
                        <button
                          onClick={() => setViewingCompany(comp)}
                          title="View Details"
                          className="p-1.5 text-slate-500 hover:text-slate-800 hover:bg-slate-100 rounded-lg transition-colors"
                        >
                          <Eye className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => openEditModal(comp)}
                          title="Edit Company"
                          className="p-1.5 text-brand-600 hover:text-brand-800 hover:bg-brand-50 rounded-lg transition-colors"
                        >
                          <Edit2 className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => setDeletingCompany(comp)}
                          title="Delete Company"
                          className="p-1.5 text-rose-500 hover:text-rose-700 hover:bg-rose-50 rounded-lg transition-colors"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Add / Edit Company Modal */}
      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title={editingCompany ? 'Edit Recruiting Company' : 'Add New Recruiting Company'}
        subtitle="Maintain recruiter profile details"
      >
        <form onSubmit={handleFormSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              Company Name <span className="text-rose-500">*</span>
            </label>
            <input
              type="text"
              required
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              placeholder="e.g. Google India"
              className="w-full px-3 py-2 text-xs border border-slate-300 rounded-lg focus:ring-2 focus:ring-brand-500"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Industry Domain
              </label>
              <input
                type="text"
                value={formData.industry}
                onChange={(e) => setFormData({ ...formData, industry: e.target.value })}
                placeholder="e.g. Cloud & AI / Fintech"
                className="w-full px-3 py-2 text-xs border border-slate-300 rounded-lg focus:ring-2 focus:ring-brand-500"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Corporate Location
              </label>
              <input
                type="text"
                value={formData.location}
                onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                placeholder="e.g. Bangalore / Hyderabad"
                className="w-full px-3 py-2 text-xs border border-slate-300 rounded-lg focus:ring-2 focus:ring-brand-500"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Company Website URL
              </label>
              <input
                type="url"
                value={formData.website}
                onChange={(e) => setFormData({ ...formData, website: e.target.value })}
                placeholder="https://example.com"
                className="w-full px-3 py-2 text-xs border border-slate-300 rounded-lg focus:ring-2 focus:ring-brand-500"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Logo Image URL
              </label>
              <input
                type="url"
                value={formData.logo}
                onChange={(e) => setFormData({ ...formData, logo: e.target.value })}
                placeholder="https://.../logo.png"
                className="w-full px-3 py-2 text-xs border border-slate-300 rounded-lg focus:ring-2 focus:ring-brand-500"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              Company Description
            </label>
            <textarea
              rows={3}
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              placeholder="Brief background on company activities, recruitment focus..."
              className="w-full px-3 py-2 text-xs border border-slate-300 rounded-lg focus:ring-2 focus:ring-brand-500"
            />
          </div>

          <div className="pt-2 flex justify-end gap-2.5">
            <button
              type="button"
              onClick={() => setIsModalOpen(false)}
              className="px-4 py-2 text-xs font-semibold text-slate-700 bg-white border border-slate-300 rounded-lg hover:bg-slate-50 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 text-xs font-bold text-white bg-brand-600 hover:bg-brand-700 rounded-lg shadow-sm shadow-brand-600/20 transition-colors"
            >
              {editingCompany ? 'Save Changes' : 'Create Company'}
            </button>
          </div>
        </form>
      </Modal>

      {/* View Details Modal */}
      <Modal
        isOpen={!!viewingCompany}
        onClose={() => setViewingCompany(null)}
        title="Company Information"
        subtitle={viewingCompany?.name}
        maxWidth="max-w-md"
      >
        {viewingCompany && (
          <div className="space-y-4">
            <div className="flex items-center gap-3 p-3 bg-slate-50 rounded-xl border border-slate-200">
              {viewingCompany.logo ? (
                <img
                  src={viewingCompany.logo}
                  alt={viewingCompany.name}
                  className="w-12 h-12 rounded-xl object-cover border border-slate-200"
                />
              ) : (
                <div className="w-12 h-12 rounded-xl bg-slate-200 flex items-center justify-center text-slate-500">
                  <Building2 className="w-6 h-6" />
                </div>
              )}
              <div>
                <h4 className="font-bold text-slate-900 text-sm">{viewingCompany.name}</h4>
                <p className="text-xs text-slate-500">{viewingCompany.industry || 'Technology'}</p>
              </div>
            </div>

            <div className="text-xs space-y-2 text-slate-600">
              <p>
                <strong className="text-slate-800">Location:</strong> {viewingCompany.location || 'Multiple'}
              </p>
              {viewingCompany.website && (
                <p>
                  <strong className="text-slate-800">Website:</strong>{' '}
                  <a
                    href={viewingCompany.website}
                    target="_blank"
                    rel="noreferrer"
                    className="text-brand-600 underline"
                  >
                    {viewingCompany.website}
                  </a>
                </p>
              )}
              <p>
                <strong className="text-slate-800">Active Placement Drives:</strong>{' '}
                {viewingCompany.activeDrivesCount || 0}
              </p>
              <div className="pt-2">
                <strong className="text-slate-800 block mb-1">Description:</strong>
                <p className="p-3 bg-slate-50 rounded-lg border border-slate-100 text-slate-600 leading-relaxed">
                  {viewingCompany.description || 'No description provided.'}
                </p>
              </div>
            </div>

            <div className="pt-2 flex justify-end">
              <button
                onClick={() => setViewingCompany(null)}
                className="px-4 py-2 text-xs font-semibold text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-lg transition-colors"
              >
                Close
              </button>
            </div>
          </div>
        )}
      </Modal>

      {/* Delete Confirmation Dialog */}
      <ConfirmDialog
        isOpen={!!deletingCompany}
        onClose={() => setDeletingCompany(null)}
        onConfirm={handleDeleteConfirm}
        title="Delete Company"
        message={`Are you sure you want to delete '${deletingCompany?.name}'? This action cannot be undone.`}
        confirmText="Delete Company"
        isLoading={isDeleting}
      />
    </div>
  );
};
