import { useState, useEffect, useMemo } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { fetchFilteredTickets } from '../store/slices/ticketSlice';

export const useTicketFilters = () => {
  const dispatch = useDispatch();
  const { tickets, loading } = useSelector((state) => state.tickets);
  const { selectedProject } = useSelector((state) => state.projects);
  
  const [localFilters, setLocalFilters] = useState({
    search: '',
    status: 'all',
    priority: 'all',
    assignedUser: 'all',
  });

  const [debouncedFilters, setDebouncedFilters] = useState(localFilters);

  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedFilters(localFilters);
    }, 300);

    return () => clearTimeout(timer);
  }, [localFilters]);

  useEffect(() => {
    if (selectedProject) {
      const projectId = selectedProject._id || selectedProject.id;
      dispatch(fetchFilteredTickets({
        projectId,
        filters: debouncedFilters
      }));
    }
  }, [dispatch, selectedProject, debouncedFilters]);

  const updateFilter = (key, value) => {
    setLocalFilters(prev => ({
      ...prev,
      [key]: value,
    }));
  };

  const clearAllFilters = () => {
    setLocalFilters({
      search: '',
      status: 'all',
      priority: 'all',
      assignedUser: 'all',
    });
  };

  const filteredTickets = tickets || [];

  return {
    filters: localFilters,
    filteredTickets,
    updateFilter,
    clearAllFilters,
    totalTickets: filteredTickets.length,
    filteredCount: filteredTickets.length,
    loading,
  };
};