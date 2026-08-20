import React, { useState, useEffect } from 'react';
import { Plus, Image as ImageIcon, Search, Eye, Edit2, Trash2 } from 'lucide-react';
import api from '../../api';
import { toast } from 'sonner';
import { useConfirm } from '../../context/ConfirmContext';
import ArtworkModal from '../../components/ArtworkModal';
import ImageViewer from '../../components/ImageViewer';

export default function Artworks() {
  const [artworks, setArtworks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [editingArtwork, setEditingArtwork] = useState(null);
  const [isViewMode, setIsViewMode] = useState(false);
  const [viewingImage, setViewingImage] = useState(null);

  const fetchArtworks = async (currentPage = 1) => {
    setLoading(true);
    try {
      const response = await api.get(`/products/artist?page=${currentPage}&limit=10`);
      if (response.data.success) {
        setArtworks(response.data.data);
        setTotalPages(response.data.pagination.totalPages);
        setPage(response.data.pagination.page);
      }
    } catch (error) {
      toast.error('Failed to fetch artworks');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchArtworks(page);
  }, [page]);

  const openAddModal = () => {
    setEditingArtwork(null);
    setIsViewMode(false);
    setIsModalOpen(true);
  };

  const openEditModal = (artwork) => {
    setEditingArtwork(artwork);
    setIsViewMode(false);
    setIsModalOpen(true);
  };

  const openViewModal = (artwork) => {
    setEditingArtwork(artwork);
    setIsViewMode(true);
    setIsModalOpen(true);
  };

  const { confirm } = useConfirm();

  const handleDelete = async (id) => {
    const isConfirmed = await confirm({
      title: 'Delete Artwork',
      message: 'Are you sure you want to delete this artwork? This action cannot be undone.',
      confirmText: 'Delete',
      type: 'danger'
    });

    if (isConfirmed) {
      try {
        await api.delete(`/products/artist/${id}`);
        toast.success('Artwork deleted successfully');
        if (artworks.length === 1 && page > 1) {
          setPage(page - 1);
        } else {
          fetchArtworks(page);
        }
      } catch (error) {
        toast.error('Failed to delete artwork');
      }
    }
  };

  const getStatusBadge = (status) => {
    switch (status) {
      case 'approved':
        return <span className="px-2 py-1 bg-green-100 text-green-800 text-xs rounded-full font-medium">Approved</span>;
      case 'rejected':
        return <span className="px-2 py-1 bg-red-100 text-red-800 text-xs rounded-full font-medium">Rejected</span>;
      case 'pending':
      default:
        return <span className="px-2 py-1 bg-yellow-100 text-yellow-800 text-xs rounded-full font-medium">Pending Verification</span>;
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold font-display text-foreground">My Artworks</h1>
          <p className="text-muted-foreground mt-1">Manage your portfolio and listings</p>
        </div>
        <button onClick={openAddModal} className="flex items-center gap-2 px-4 py-2 bg-primary text-primary-foreground rounded-xl text-sm font-semibold hover:bg-primary/90 transition-colors shadow-sm cursor-pointer">
          <Plus className="w-4 h-4" />
          Add New Artwork
        </button>
      </div>

      <div className="bg-background rounded-2xl border border-border shadow-sm overflow-hidden">
        {loading ? (
          <div className="p-8 text-center text-muted-foreground">Loading artworks...</div>
        ) : artworks.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-16 text-center bg-canvas">
            <ImageIcon className="w-16 h-16 text-muted-foreground mb-4 opacity-50" />
            <h3 className="text-lg font-semibold text-foreground">No artworks yet</h3>
            <p className="text-sm text-muted-foreground mt-1 max-w-sm mb-6">Upload your first piece of art to start selling and showcasing your talent to the world.</p>
            <button onClick={openAddModal} className="flex items-center gap-2 px-6 py-3 bg-secondary text-foreground border border-border rounded-xl text-sm font-semibold hover:bg-secondary/80 transition-colors cursor-pointer">
              <Plus className="w-4 h-4" />
              Upload Artwork
            </button>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm text-muted-foreground">
              <thead className="bg-canvas text-foreground uppercase text-xs font-semibold border-b border-border">
                <tr>
                  <th className="px-6 py-4">Artwork Info</th>
                  <th className="px-6 py-4">Category</th>
                  <th className="px-6 py-4">Price</th>
                  <th className="px-6 py-4">Status</th>
                  <th className="px-6 py-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {artworks.map((artwork) => (
                  <tr key={artwork._id} className="hover:bg-canvas/50 transition-colors">
                    <td className="px-6 py-4 font-medium text-foreground flex items-center gap-3">
                      {artwork.image ? (
                        <button type="button" onClick={() => setViewingImage(artwork.image)} className="focus:outline-none rounded-lg transition-transform hover:scale-105 cursor-pointer">
                          <img src={artwork.image} alt={artwork.name} className="w-10 h-10 rounded-lg object-cover border border-border" />
                        </button>
                      ) : (
                        <div className="w-10 h-10 rounded-lg bg-muted flex items-center justify-center border border-border">
                          <ImageIcon className="w-5 h-5 text-muted-foreground" />
                        </div>
                      )}
                      <span className="max-w-[150px] truncate">{artwork.name}</span>
                    </td>
                    <td className="px-6 py-4">{artwork.category?.name || '-'}</td>
                    <td className="px-6 py-4 font-medium">₹{artwork.price}</td>
                    <td className="px-6 py-4">
                      {getStatusBadge(artwork.approvalStatus)}
                    </td>
                    <td className="px-6 py-4 text-right">
                      <div className="flex justify-end gap-2">
                        <button onClick={() => openViewModal(artwork)} title="View" className="p-2 text-muted-foreground hover:bg-muted rounded-lg transition-colors cursor-pointer">
                          <Eye className="w-4 h-4" />
                        </button>
                        <button onClick={() => openEditModal(artwork)} title="Edit" className="p-2 text-blue-600 hover:bg-blue-50 dark:hover:bg-blue-900/20 rounded-lg transition-colors cursor-pointer">
                          <Edit2 className="w-4 h-4" />
                        </button>
                        <button onClick={() => handleDelete(artwork._id)} title="Delete" className="p-2 text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-colors cursor-pointer">
                          <Trash2 className="w-4 h-4" />
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

      <ArtworkModal 
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        product={editingArtwork}
        onSuccess={() => fetchArtworks(page)}
        isViewMode={isViewMode}
      />
      <ImageViewer imageUrl={viewingImage} onClose={() => setViewingImage(null)} />
    </div>
  );
}
