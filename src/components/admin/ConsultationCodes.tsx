'use client';

import React, { useState, useEffect } from 'react';
import {
  PlusIcon,
  TrashIcon,
  PowerIcon,
  UsersIcon,
  KeyIcon,
  CheckCircleIcon,
  XCircleIcon,
  AlertCircleIcon,
  RefreshCwIcon,
  FileDownIcon,
  PackageIcon,
  SearchIcon,
  SettingsIcon,
} from 'lucide-react';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';

interface ConsultationCode {
  id: string;
  code: string;
  status: string;
  description?: string | null;
  maxUses?: number | null;
  usedCount: number;
  expiresAt?: Date | null;
  createdBy?: string | null;
  createdAt: Date;
  updatedAt: Date;
}

interface CodeStats {
  total: number;
  active: number;
  inactive: number;
  expired: number;
  totalUsage: number;
  mostUsed?: ConsultationCode;
}

interface ConsultationCodesAdminProps {
  admin?: {
    id: string;
    email: string;
    name: string;
    role: string;
  };
}

const ConsultationCodesAdmin: React.FC<ConsultationCodesAdminProps> = () => {
  const [codes, setCodes] = useState<ConsultationCode[]>([]);
  const [stats, setStats] = useState<CodeStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showBulkCreateModal, setShowBulkCreateModal] = useState(false);
  const [selectedCodes, setSelectedCodes] = useState<string[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [newCode, setNewCode] = useState({
    code: '',
    description: '',
    maxUses: '',
    expiresAt: '',
    createdBy: 'Admin',
  });
  const [bulkCodeSettings, setBulkCodeSettings] = useState({
    quantity: '10',
    prefix: 'OT',
    description: '',
    maxUses: '',
    expiresAt: '',
    createdBy: 'Admin',
  });
  const [newlyCreatedCodes, setNewlyCreatedCodes] = useState<ConsultationCode[]>([]);
  const [showDownloadModal, setShowDownloadModal] = useState(false);
  const [showBulkActionsModal, setShowBulkActionsModal] = useState(false);
  const [bulkAction, setBulkAction] = useState({
    type: 'status', // 'status', 'expire', 'description'
    status: 'active',
    expiresAt: '',
    description: '',
  });

  useEffect(() => {
    fetchCodes();
    fetchStats();
  }, []);

  const fetchCodes = async () => {
    try {
      setLoading(true);
      const response = await fetch('/api/admin/consultation-codes');
      const data = await response.json();
      setCodes(data);
    } catch (error) {
      console.error('Error fetching codes:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchStats = async () => {
    try {
      const response = await fetch('/api/admin/consultation-codes/stats');
      const data = await response.json();
      setStats(data);
    } catch (error) {
      console.error('Error fetching stats:', error);
    }
  };

  const handleCreateCode = async () => {
    try {
      const codeData = {
        code: newCode.code || undefined,
        description: newCode.description || undefined,
        maxUses: newCode.maxUses ? parseInt(newCode.maxUses) : undefined,
        expiresAt: newCode.expiresAt || undefined,
        createdBy: newCode.createdBy,
      };

      const response = await fetch('/api/admin/consultation-codes', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(codeData),
      });

      if (response.ok) {
        setShowCreateModal(false);
        setNewCode({
          code: '',
          description: '',
          maxUses: '',
          expiresAt: '',
          createdBy: 'Admin',
        });
        fetchCodes();
        fetchStats();
      }
    } catch (error) {
      console.error('Error creating code:', error);
    }
  };

  const handleToggleStatus = async (code: ConsultationCode) => {
    try {
      const newStatus = code.status === 'active' ? 'inactive' : 'active';
      const response = await fetch(`/api/admin/consultation-codes/${code.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ status: newStatus }),
      });

      if (response.ok) {
        fetchCodes();
        fetchStats();
      }
    } catch (error) {
      console.error('Error toggling code status:', error);
    }
  };

  const handleDeleteCode = async (codeId: string) => {
    if (window.confirm('Are you sure you want to delete this code?')) {
      try {
        const response = await fetch(`/api/admin/consultation-codes/${codeId}`, {
          method: 'DELETE',
        });

        if (response.ok) {
          fetchCodes();
          fetchStats();
        }
      } catch (error) {
        console.error('Error deleting code:', error);
      }
    }
  };

  const handleBulkCreate = async () => {
    try {
      const response = await fetch('/api/admin/consultation-codes/bulk', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          quantity: parseInt(bulkCodeSettings.quantity),
          prefix: bulkCodeSettings.prefix,
          description: bulkCodeSettings.description || undefined,
          maxUses: bulkCodeSettings.maxUses ? parseInt(bulkCodeSettings.maxUses) : undefined,
          expiresAt: bulkCodeSettings.expiresAt || undefined,
          createdBy: bulkCodeSettings.createdBy,
        }),
      });

      if (response.ok) {
        const result = await response.json();
        setNewlyCreatedCodes(result.codes || []);
        setShowBulkCreateModal(false);
        setBulkCodeSettings({
          quantity: '10',
          prefix: 'OT',
          description: '',
          maxUses: '',
          expiresAt: '',
          createdBy: 'Admin',
        });
        fetchCodes();
        fetchStats();
        // Show download modal after successful creation
        if (result.codes && result.codes.length > 0) {
          setShowDownloadModal(true);
        }
      }
    } catch (error) {
      console.error('Error creating bulk codes:', error);
    }
  };

  const handleExportPDF = () => {
    const doc = new jsPDF();
    const pageWidth = doc.internal.pageSize.width;
    
    // Add header
    doc.setFontSize(20);
    doc.text('Consultation Codes Report', pageWidth / 2, 20, { align: 'center' });
    
    doc.setFontSize(12);
    doc.text(`Generated on: ${new Date().toLocaleDateString()}`, pageWidth / 2, 30, { align: 'center' });
    doc.text(`Total Codes: ${codes.length}`, 14, 40);
    
    // Filter codes based on selection or export all
    const codesToExport = selectedCodes.length > 0 
      ? codes.filter(code => selectedCodes.includes(code.id))
      : codes;
    
    // Prepare table data
    const tableData = codesToExport.map(code => [
      code.code,
      code.status,
      code.description || '-',
      `${code.usedCount}/${code.maxUses || 'Unlimited'}`,
      code.expiresAt ? new Date(code.expiresAt).toLocaleDateString() : 'Never',
      code.createdBy || 'System',
    ]);
    
    // Add table
    autoTable(doc, {
      head: [['Code', 'Status', 'Description', 'Usage', 'Expires', 'Created By']],
      body: tableData,
      startY: 50,
      theme: 'grid',
      styles: {
        fontSize: 10,
        cellPadding: 3,
      },
      headStyles: {
        fillColor: [59, 130, 246],
        textColor: 255,
        fontStyle: 'bold',
      },
      alternateRowStyles: {
        fillColor: [245, 245, 245],
      },
    });
    
    // Add footer
    doc.setFontSize(10);
    doc.text(`Page 1 of 1`, pageWidth / 2, doc.internal.pageSize.height - 10, { align: 'center' });
    
    // Save the PDF
    doc.save(`consultation-codes-${new Date().toISOString().split('T')[0]}.pdf`);
  };

  const toggleCodeSelection = (codeId: string) => {
    setSelectedCodes(prev => 
      prev.includes(codeId)
        ? prev.filter(id => id !== codeId)
        : [...prev, codeId]
    );
  };

  const toggleSelectAll = () => {
    if (selectedCodes.length === filteredCodes.length) {
      setSelectedCodes([]);
    } else {
      setSelectedCodes(filteredCodes.map(code => code.id));
    }
  };

  const handleBulkAction = async () => {
    if (selectedCodes.length === 0) return;
    
    try {
      const updates: Record<string, unknown> = {};
      
      if (bulkAction.type === 'status') {
        updates.status = bulkAction.status;
      } else if (bulkAction.type === 'expire') {
        updates.expiresAt = bulkAction.expiresAt || null;
      } else if (bulkAction.type === 'description') {
        updates.description = bulkAction.description;
      }
      
      const response = await fetch('/api/admin/consultation-codes/bulk-update', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          codeIds: selectedCodes,
          updates,
        }),
      });
      
      if (response.ok) {
        setShowBulkActionsModal(false);
        setSelectedCodes([]);
        setBulkAction({
          type: 'status',
          status: 'active',
          expiresAt: '',
          description: '',
        });
        fetchCodes();
        fetchStats();
      }
    } catch (error) {
      console.error('Error performing bulk action:', error);
    }
  };

  const handleDownloadNewCodes = () => {
    const doc = new jsPDF();
    const pageWidth = doc.internal.pageSize.width;
    
    // Add header
    doc.setFontSize(20);
    doc.text('Newly Created Consultation Codes', pageWidth / 2, 20, { align: 'center' });
    
    doc.setFontSize(12);
    doc.text(`Generated on: ${new Date().toLocaleDateString()}`, pageWidth / 2, 30, { align: 'center' });
    doc.text(`Total New Codes: ${newlyCreatedCodes.length}`, 14, 40);
    
    // Prepare table data
    const tableData = newlyCreatedCodes.map(code => [
      code.code,
      code.status,
      code.description || '-',
      `0/${code.maxUses || 'Unlimited'}`,
      code.expiresAt ? new Date(code.expiresAt).toLocaleDateString() : 'Never',
    ]);
    
    // Add table
    autoTable(doc, {
      head: [['Code', 'Status', 'Description', 'Usage', 'Expires']],
      body: tableData,
      startY: 50,
      theme: 'grid',
      styles: {
        fontSize: 10,
        cellPadding: 3,
      },
      headStyles: {
        fillColor: [147, 51, 234], // Purple color for new codes
        textColor: 255,
        fontStyle: 'bold',
      },
      alternateRowStyles: {
        fillColor: [245, 245, 255],
      },
    });
    
    // Add footer note
    doc.setFontSize(10);
    doc.setTextColor(100);
    doc.text('Keep these codes secure. Share only with authorized users.', 14, 60);
    
    // Save the PDF
    doc.save(`new-consultation-codes-${new Date().toISOString().split('T')[0]}.pdf`);
    setShowDownloadModal(false);
    setNewlyCreatedCodes([]);
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'active':
        return (
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
            <CheckCircleIcon size={12} className="mr-1" />
            Active
          </span>
        );
      case 'inactive':
        return (
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
            <XCircleIcon size={12} className="mr-1" />
            Inactive
          </span>
        );
      case 'expired':
        return (
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-800">
            <AlertCircleIcon size={12} className="mr-1" />
            Expired
          </span>
        );
      default:
        return null;
    }
  };

  // Filter codes based on search query
  const filteredCodes = codes.filter(code => {
    if (!searchQuery) return true;
    const query = searchQuery.toLowerCase();
    return (
      code.code.toLowerCase().includes(query) ||
      code.description?.toLowerCase().includes(query) ||
      code.status.toLowerCase().includes(query) ||
      code.createdBy?.toLowerCase().includes(query)
    );
  });

  return (
    <div className="p-6">
      {/* Header */}
      <div className="bg-white shadow rounded-lg mb-6">
        <div className="px-6 py-4 border-b border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Consultation Codes</h1>
              <p className="mt-1 text-sm text-gray-500">
                Manage consultation invitation codes for expert consultation bookings
              </p>
            </div>
            <div className="flex space-x-2">
              <button
                onClick={handleExportPDF}
                className="inline-flex items-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                disabled={codes.length === 0}
              >
                <FileDownIcon size={16} className="mr-2" />
                Export PDF
              </button>
              <button
                onClick={() => setShowBulkCreateModal(true)}
                className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-purple-600 hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500"
              >
                <PackageIcon size={16} className="mr-2" />
                Bulk Create
              </button>
              <button
                onClick={() => setShowCreateModal(true)}
                className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
              >
                <PlusIcon size={16} className="mr-2" />
                Create Code
              </button>
            </div>
          </div>
        </div>

        {/* Statistics */}
        {stats && (
          <div className="px-6 py-4 grid grid-cols-1 md:grid-cols-5 gap-4">
            <div className="bg-blue-50 rounded-lg p-4">
              <div className="flex items-center">
                <KeyIcon size={20} className="text-blue-600 mr-2" />
                <div>
                  <p className="text-sm text-gray-600">Total Codes</p>
                  <p className="text-2xl font-bold text-gray-900">{stats.total}</p>
                </div>
              </div>
            </div>
            <div className="bg-green-50 rounded-lg p-4">
              <div className="flex items-center">
                <CheckCircleIcon size={20} className="text-green-600 mr-2" />
                <div>
                  <p className="text-sm text-gray-600">Active</p>
                  <p className="text-2xl font-bold text-gray-900">{stats.active}</p>
                </div>
              </div>
            </div>
            <div className="bg-gray-50 rounded-lg p-4">
              <div className="flex items-center">
                <XCircleIcon size={20} className="text-gray-600 mr-2" />
                <div>
                  <p className="text-sm text-gray-600">Inactive</p>
                  <p className="text-2xl font-bold text-gray-900">{stats.inactive}</p>
                </div>
              </div>
            </div>
            <div className="bg-red-50 rounded-lg p-4">
              <div className="flex items-center">
                <AlertCircleIcon size={20} className="text-red-600 mr-2" />
                <div>
                  <p className="text-sm text-gray-600">Expired</p>
                  <p className="text-2xl font-bold text-gray-900">{stats.expired}</p>
                </div>
              </div>
            </div>
            <div className="bg-purple-50 rounded-lg p-4">
              <div className="flex items-center">
                <UsersIcon size={20} className="text-purple-600 mr-2" />
                <div>
                  <p className="text-sm text-gray-600">Total Usage</p>
                  <p className="text-2xl font-bold text-gray-900">{stats.totalUsage}</p>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Codes Table */}
      <div className="bg-white shadow rounded-lg overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-200">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-medium text-gray-900">All Codes</h2>
            <div className="flex items-center space-x-2">
              <div className="relative">
                <SearchIcon size={18} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search codes..."
                  className="pl-10 pr-4 py-2 border border-gray-300 rounded-md text-sm focus:ring-blue-500 focus:border-blue-500"
                />
              </div>
              <button
                onClick={() => setShowBulkActionsModal(true)}
                disabled={selectedCodes.length === 0}
                className={`inline-flex items-center px-3 py-2 border rounded-md text-sm font-medium transition-colors ${
                  selectedCodes.length > 0
                    ? 'border-indigo-600 text-indigo-600 bg-indigo-50 hover:bg-indigo-100'
                    : 'border-gray-300 text-gray-400 bg-gray-50 cursor-not-allowed'
                }`}
              >
                <SettingsIcon size={14} className="mr-1.5" />
                Bulk Actions {selectedCodes.length > 0 && `(${selectedCodes.length})`}
              </button>
              <button
                onClick={fetchCodes}
                className="inline-flex items-center px-3 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
              >
                <RefreshCwIcon size={14} className="mr-1" />
                Refresh
              </button>
            </div>
          </div>
        </div>

        {loading ? (
          <div className="px-6 py-12 text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
            <p className="mt-4 text-gray-500">Loading codes...</p>
          </div>
        ) : filteredCodes.length === 0 ? (
          <div className="px-6 py-12 text-center">
            <KeyIcon size={48} className="mx-auto text-gray-400 mb-4" />
            <p className="text-gray-500">
              {searchQuery ? `No codes found matching "${searchQuery}"` : 'No consultation codes found'}
            </p>
            {searchQuery ? (
              <button
                onClick={() => setSearchQuery('')}
                className="mt-4 inline-flex items-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50"
              >
                Clear Search
              </button>
            ) : (
              <button
                onClick={() => setShowCreateModal(true)}
                className="mt-4 inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700"
              >
                <PlusIcon size={16} className="mr-2" />
                Create First Code
              </button>
            )}
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-3 py-3 text-center">
                    <input
                      type="checkbox"
                      checked={selectedCodes.length === filteredCodes.length && filteredCodes.length > 0}
                      onChange={toggleSelectAll}
                      className="w-5 h-5 rounded border-gray-300 text-blue-600 focus:ring-blue-500 cursor-pointer"
                    />
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Code
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Status
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Description
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Usage
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Expires
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Created
                  </th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {filteredCodes.map((code) => (
                  <tr 
                    key={code.id} 
                    className="hover:bg-gray-50"
                  >
                    <td className="px-3 py-4 text-center" onClick={(e) => e.stopPropagation()}>
                      <input
                        type="checkbox"
                        checked={selectedCodes.includes(code.id)}
                        onChange={() => toggleCodeSelection(code.id)}
                        className="w-5 h-5 rounded border-gray-300 text-blue-600 focus:ring-blue-500 cursor-pointer"
                      />
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <KeyIcon size={16} className="text-gray-400 mr-2" />
                        <span className="text-sm font-mono font-medium text-gray-900">
                          {code.code}
                        </span>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">{getStatusBadge(code.status)}</td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className="text-sm text-gray-900">{code.description || '-'}</span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">
                        {code.usedCount} / {code.maxUses || '∞'}
                      </div>
                      {code.maxUses && (
                        <div className="w-full bg-gray-200 rounded-full h-1.5 mt-1">
                          <div
                            className="bg-blue-600 h-1.5 rounded-full"
                            style={{
                              width: `${Math.min((code.usedCount / code.maxUses) * 100, 100)}%`,
                            }}
                          ></div>
                        </div>
                      )}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className="text-sm text-gray-900">
                        {code.expiresAt ? new Date(code.expiresAt).toLocaleDateString() : 'Never'}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">
                        {new Date(code.createdAt).toLocaleDateString()}
                      </div>
                      <div className="text-xs text-gray-500">{code.createdBy || 'System'}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium" onClick={(e) => e.stopPropagation()}>
                      <div className="flex items-center justify-end space-x-2">
                        {code.status !== 'expired' && (
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              handleToggleStatus(code);
                            }}
                            className={`inline-flex items-center p-1 rounded-md ${
                              code.status === 'active'
                                ? 'text-gray-600 hover:text-gray-900'
                                : 'text-green-600 hover:text-green-900'
                            }`}
                            title={code.status === 'active' ? 'Deactivate' : 'Activate'}
                          >
                            <PowerIcon size={16} />
                          </button>
                        )}
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            handleDeleteCode(code.id);
                          }}
                          className="inline-flex items-center p-1 text-red-600 hover:text-red-900 rounded-md"
                          title="Delete"
                        >
                          <TrashIcon size={16} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Bulk Create Modal */}
      {showBulkCreateModal && (
        <div className="fixed inset-0 bg-gray-500 bg-opacity-75 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg max-w-md w-full p-6">
            <h3 className="text-lg font-medium text-gray-900 mb-4">Bulk Create Codes</h3>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Number of Codes
                </label>
                <input
                  type="number"
                  value={bulkCodeSettings.quantity}
                  onChange={(e) => setBulkCodeSettings({ ...bulkCodeSettings, quantity: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                  min="1"
                  max="100"
                  placeholder="10"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Code Prefix
                </label>
                <input
                  type="text"
                  value={bulkCodeSettings.prefix}
                  onChange={(e) => setBulkCodeSettings({ ...bulkCodeSettings, prefix: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                  placeholder="OT"
                />
                <p className="mt-1 text-xs text-gray-500">
                  Codes will be generated as: {bulkCodeSettings.prefix}-XXXXXX
                </p>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Description (applies to all)
                </label>
                <input
                  type="text"
                  value={bulkCodeSettings.description}
                  onChange={(e) => setBulkCodeSettings({ ...bulkCodeSettings, description: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                  placeholder="e.g., Bulk generated for campaign"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Max Uses Per Code (optional)
                </label>
                <input
                  type="number"
                  value={bulkCodeSettings.maxUses}
                  onChange={(e) => setBulkCodeSettings({ ...bulkCodeSettings, maxUses: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                  placeholder="Leave empty for unlimited"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Expiration Date (optional)
                </label>
                <input
                  type="date"
                  value={bulkCodeSettings.expiresAt}
                  onChange={(e) => setBulkCodeSettings({ ...bulkCodeSettings, expiresAt: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                />
              </div>
            </div>
            <div className="mt-6 flex justify-end space-x-3">
              <button
                onClick={() => setShowBulkCreateModal(false)}
                className="px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 bg-white hover:bg-gray-50"
              >
                Cancel
              </button>
              <button
                onClick={handleBulkCreate}
                className="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-purple-600 hover:bg-purple-700"
              >
                Generate {bulkCodeSettings.quantity} Codes
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Download New Codes Modal */}
      {showDownloadModal && (
        <div className="fixed inset-0 bg-gray-500 bg-opacity-75 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg max-w-md w-full p-6">
            <div className="text-center">
              <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-green-100 mb-4">
                <CheckCircleIcon className="h-6 w-6 text-green-600" />
              </div>
              <h3 className="text-lg font-medium text-gray-900 mb-2">
                Successfully Created {newlyCreatedCodes.length} Codes!
              </h3>
              <p className="text-sm text-gray-500 mb-6">
                Your consultation codes have been created successfully. Download them now to share with your team or keep for your records.
              </p>
              
              {/* Preview of created codes */}
              <div className="bg-gray-50 rounded-lg p-4 mb-6 max-h-48 overflow-y-auto">
                <p className="text-xs font-semibold text-gray-700 mb-2">Created Codes:</p>
                <div className="space-y-1">
                  {newlyCreatedCodes.slice(0, 5).map((code) => (
                    <div key={code.id} className="flex items-center justify-between text-xs">
                      <span className="font-mono text-gray-900">{code.code}</span>
                      <span className="text-gray-500">{code.description || 'No description'}</span>
                    </div>
                  ))}
                  {newlyCreatedCodes.length > 5 && (
                    <p className="text-xs text-gray-500 italic">
                      ... and {newlyCreatedCodes.length - 5} more
                    </p>
                  )}
                </div>
              </div>
              
              <div className="flex justify-center space-x-3">
                <button
                  onClick={() => {
                    setShowDownloadModal(false);
                    setNewlyCreatedCodes([]);
                  }}
                  className="px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 bg-white hover:bg-gray-50"
                >
                  Skip Download
                </button>
                <button
                  onClick={handleDownloadNewCodes}
                  className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-purple-600 hover:bg-purple-700"
                >
                  <FileDownIcon className="mr-2 h-4 w-4" />
                  Download PDF
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Create Code Modal */}
      {showCreateModal && (
        <div className="fixed inset-0 bg-gray-500 bg-opacity-75 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg max-w-md w-full p-6">
            <h3 className="text-lg font-medium text-gray-900 mb-4">Create New Code</h3>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Code (optional - auto-generated if empty)
                </label>
                <input
                  type="text"
                  value={newCode.code}
                  onChange={(e) => setNewCode({ ...newCode, code: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                  placeholder="e.g., OT-SPECIAL-2024"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
                <input
                  type="text"
                  value={newCode.description}
                  onChange={(e) => setNewCode({ ...newCode, description: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                  placeholder="e.g., Partner organization code"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Max Uses (optional)
                </label>
                <input
                  type="number"
                  value={newCode.maxUses}
                  onChange={(e) => setNewCode({ ...newCode, maxUses: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                  placeholder="Leave empty for unlimited"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Expiration Date (optional)
                </label>
                <input
                  type="date"
                  value={newCode.expiresAt}
                  onChange={(e) => setNewCode({ ...newCode, expiresAt: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                />
              </div>
            </div>
            <div className="mt-6 flex justify-end space-x-3">
              <button
                onClick={() => setShowCreateModal(false)}
                className="px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 bg-white hover:bg-gray-50"
              >
                Cancel
              </button>
              <button
                onClick={handleCreateCode}
                className="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700"
              >
                Create Code
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Bulk Actions Modal */}
      {showBulkActionsModal && (
        <div className="fixed inset-0 bg-gray-500 bg-opacity-75 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg max-w-md w-full p-6">
            <h3 className="text-lg font-medium text-gray-900 mb-4">
              Bulk Actions for {selectedCodes.length} Codes
            </h3>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Action Type
                </label>
                <select
                  value={bulkAction.type}
                  onChange={(e) => setBulkAction({ ...bulkAction, type: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                >
                  <option value="status">Change Status</option>
                  <option value="expire">Change Expiration Date</option>
                  <option value="description">Change Description</option>
                </select>
              </div>
              
              {bulkAction.type === 'status' && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    New Status
                  </label>
                  <select
                    value={bulkAction.status}
                    onChange={(e) => setBulkAction({ ...bulkAction, status: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                  >
                    <option value="active">Active</option>
                    <option value="inactive">Inactive</option>
                  </select>
                </div>
              )}
              
              {bulkAction.type === 'expire' && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    New Expiration Date
                  </label>
                  <input
                    type="date"
                    value={bulkAction.expiresAt}
                    onChange={(e) => setBulkAction({ ...bulkAction, expiresAt: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                  />
                  <p className="mt-1 text-xs text-gray-500">
                    Leave empty to remove expiration date
                  </p>
                </div>
              )}
              
              {bulkAction.type === 'description' && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    New Description
                  </label>
                  <textarea
                    value={bulkAction.description}
                    onChange={(e) => setBulkAction({ ...bulkAction, description: e.target.value })}
                    rows={3}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                    placeholder="Enter new description for all selected codes"
                  />
                </div>
              )}
              
              <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-3">
                <div className="flex">
                  <AlertCircleIcon size={16} className="text-yellow-600 mr-2 flex-shrink-0 mt-0.5" />
                  <div className="text-sm text-yellow-800">
                    <p className="font-medium">Warning</p>
                    <p>This action will affect {selectedCodes.length} codes and cannot be undone.</p>
                  </div>
                </div>
              </div>
            </div>
            <div className="mt-6 flex justify-end space-x-3">
              <button
                onClick={() => setShowBulkActionsModal(false)}
                className="px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 bg-white hover:bg-gray-50"
              >
                Cancel
              </button>
              <button
                onClick={handleBulkAction}
                className="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700"
              >
                Apply to {selectedCodes.length} Codes
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ConsultationCodesAdmin;
