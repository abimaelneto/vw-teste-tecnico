import React, { useState, useEffect, useCallback } from 'react';
import { api } from '../../services/api';
import { Vehicle, PaginationState, FiltersState } from '../../types';
import './styles.css';
import AddVehicleModal from './AddVehicleModal';
import EditVehicleModal from './EditVehicleModal';

const Vehicles: React.FC = () => {
  const [vehicles, setVehicles] = useState<Vehicle[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [search, setSearch] = useState('');
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [currentPage, setCurrentPage] = useState(1);
  const [sortField, setSortField] = useState<keyof Vehicle>('creationDate');
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('desc');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedVehicle, setSelectedVehicle] = useState<Vehicle | null>(null);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);

  const [pagination, setPagination] = useState<PaginationState>({
    currentPage: 1,
    totalPages: 0,
    totalItems: 0,
    itemsPerPage: 10,
    hasNextPage: false,
    hasPrevPage: false
  });

  const [filters, setFilters] = useState<FiltersState>({
    model: '',
    color: '',
    year: '',
    creationDate: ''
  });

  const handleFilterChange = useCallback((field: keyof FiltersState, value: string) => {
    setFilters(prev => ({
      ...prev,
      [field]: value
    }));
    setCurrentPage(1);
  }, []);

  const fetchVehicles = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      
      const response = await api.getVehicles(
        currentPage,
        rowsPerPage,
        sortField,
        sortDirection,
        search
      );

      setVehicles(response.data);
      setPagination({
        currentPage: response.pagination.currentPage,
        totalPages: response.pagination.totalPages,
        totalItems: response.pagination.total,
        itemsPerPage: response.pagination.limit,
        hasNextPage: response.pagination.hasNextPage,
        hasPrevPage: response.pagination.hasPrevPage
      });
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch vehicles');
    } finally {
      setLoading(false);
    }
  }, [currentPage, rowsPerPage, sortField, sortDirection, search]);

  useEffect(() => {
    fetchVehicles();
  }, [fetchVehicles]);

  const handleDelete = async (uuid: string) => {
    if (window.confirm('Tem certeza que deseja excluir este veículo?')) {
      try {
        setLoading(true);
        
        await api.deleteVehicle(uuid);
        
        // Show success message
        alert('Veículo excluído com sucesso!');
        
        // If we're on the last page and it's empty after deletion, go to previous page
        if (vehicles.length === 1 && currentPage > 1) {
          setCurrentPage(prev => prev - 1);
        } else {
          // Otherwise, just refresh the current page
          await fetchVehicles();
        }
      } catch (err) {
        const errorMessage = err instanceof Error ? err.message : 'Erro ao excluir veículo';
        setError(errorMessage);
        alert('Erro ao excluir veículo: ' + errorMessage);
      } finally {
        setLoading(false);
      }
    }
  };

  const handleAddVehicle = () => {
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
  };

  const handleVehicleAdded = () => {
    fetchVehicles();
  };

  const handleEdit = (vehicle: Vehicle) => {
    setSelectedVehicle(vehicle);
    setIsEditModalOpen(true);
  };

  const handleCloseEditModal = () => {
    setIsEditModalOpen(false);
    setSelectedVehicle(null);
  };

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  const handleItemsPerPageChange = (items: number) => {
    setRowsPerPage(items);
    setCurrentPage(1);
  };

  const handleSort = (field: keyof Vehicle) => {
    if (sortField === field) {
      setSortDirection(prev => prev === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortDirection('asc');
    }
  };

  const renderPagination = () => {
    const maxVisiblePages = 5; // Number of page buttons to show
    const pages = [];
    
    // Calculate range of visible page numbers
    let startPage = Math.max(1, pagination.currentPage - Math.floor(maxVisiblePages / 2));
    let endPage = Math.min(pagination.totalPages, startPage + maxVisiblePages - 1);
    
    // Adjust start page if we're near the end
    if (endPage - startPage + 1 < maxVisiblePages) {
      startPage = Math.max(1, endPage - maxVisiblePages + 1);
    }
  
    // Add first page button if not visible
    if (startPage > 1) {
      pages.push(
        <button
          key="1"
          onClick={() => handlePageChange(1)}
          className="pagination-button"
        >
          1
        </button>
      );
      if (startPage > 2) {
        pages.push(
          <span key="ellipsis1" className="pagination-ellipsis">...</span>
        );
      }
    }
  
    // Add page buttons
    for (let i = startPage; i <= endPage; i++) {
      pages.push(
        <button
          key={i}
          onClick={() => handlePageChange(i)}
          className={`pagination-button ${i === pagination.currentPage ? 'active' : ''}`}
          aria-current={i === pagination.currentPage ? 'page' : undefined}
        >
          {i}
        </button>
      );
    }
  
    // Add last page button if not visible
    if (endPage < pagination.totalPages) {
      if (endPage < pagination.totalPages - 1) {
        pages.push(
          <span key="ellipsis2" className="pagination-ellipsis">...</span>
        );
      }
      pages.push(
        <button
          key={pagination.totalPages}
          onClick={() => handlePageChange(pagination.totalPages)}
          className="pagination-button"
        >
          {pagination.totalPages}
        </button>
      );
    }
  
    return (
      <div className="pagination">
        <button
          onClick={() => handlePageChange(1)}
          disabled={!pagination.hasPrevPage}
          className="pagination-button pagination-nav"
          aria-label="Primeira página"
        />
        <button
          onClick={() => handlePageChange(pagination.currentPage - 1)}
          disabled={!pagination.hasPrevPage}
          className="pagination-button pagination-nav"
          aria-label="Página anterior"
        />
        
        <div className="pagination-pages">
          {pages}
        </div>
  
        <button
          onClick={() => handlePageChange(pagination.currentPage + 1)}
          disabled={!pagination.hasNextPage}
          className="pagination-button pagination-nav"
          aria-label="Próxima página"
        />
        <button
          onClick={() => handlePageChange(pagination.totalPages)}
          disabled={!pagination.hasNextPage}
          className="pagination-button pagination-nav"
          aria-label="Última página"
        />
      </div>
    );
  };

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;

  return (
    <div className="vehicles-container">
      <div className="vehicles-header">
        <h1>Veículos</h1>
        <button 
          onClick={handleAddVehicle}
          className="add-button"
          aria-label="Adicionar novo veículo"
        >
          Adicionar Veículo
        </button>
      </div>

      <div className="filters">
        <input
          type="text"
          placeholder="Buscar por modelo, cor, ano..."
          value={search}
          onChange={(e) => {
            setSearch(e.target.value);
            setCurrentPage(1); // Reset to first page on search
          }}
          className="search-input"
        />

        <select
          value={rowsPerPage}
          onChange={(e) => handleItemsPerPageChange(Number(e.target.value))}
          className="rows-select"
        >
          <option value={5}>5 por página</option>
          <option value={10}>10 por página</option>
          <option value={20}>20 por página</option>
        </select>
      </div>

      <table className="vehicles-table">
        <thead>
          <tr>
            <th>Imagem</th>
            <th onClick={() => handleSort("model")} className="sortable">
              Modelo {sortField === 'model' && (sortDirection === 'asc' ? '↑' : '↓')}
            </th>
            <th onClick={() => handleSort("color")} className="sortable">
              Cor {sortField === 'color' && (sortDirection === 'asc' ? '↑' : '↓')}
            </th>
            <th onClick={() => handleSort("year")} className="sortable">
              Ano {sortField === 'year' && (sortDirection === 'asc' ? '↑' : '↓')}
            </th>
            <th onClick={() => handleSort("creationDate")} className="sortable">
              Data de Criação {sortField === 'creationDate' && (sortDirection === 'asc' ? '↑' : '↓')}
            </th>
            <th>Ações</th>
          </tr>
        </thead>
        <tbody>
          {vehicles.map((vehicle) => (
            <tr key={vehicle.uuid}>
              <td>
                <img
                  src={`http://localhost:1880${vehicle.imagePath}`}
                  alt={`${vehicle.model.modelName}`}
                  className="vehicle-image"
                />
              </td>
              <td>{vehicle.model.modelName}</td>
              <td>{vehicle.color.colorName}</td>
              <td>{vehicle.year}</td>
              <td>{new Date(vehicle.creationDate).toLocaleDateString()}</td>
              <td>
                <button 
                  className="edit-button" 
                  onClick={() => handleEdit(vehicle)}
                >
                  Editar
                </button>
                <button
                  className="delete-button"
                  onClick={() => handleDelete(vehicle.uuid)}
                >
                  Excluir
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {renderPagination()}

      {selectedVehicle && (
        <EditVehicleModal
          isOpen={isEditModalOpen}
          onClose={handleCloseEditModal}
          onVehicleUpdated={fetchVehicles}
          vehicle={selectedVehicle}
        />
      )}
      
      <AddVehicleModal
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        onVehicleAdded={handleVehicleAdded}
      />
    </div>
  );
};

export default Vehicles;