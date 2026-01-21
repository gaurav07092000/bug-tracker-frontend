import React from 'react';
import { useTicketFilters } from '../../hooks/useTicketFilters';
import { TICKET_STATUS, TICKET_PRIORITY } from '../../utils/constants';
import { debounce } from '../../utils/helpers';
import Input from '../ui/Input';
import Select from '../ui/Select';
import Button from '../ui/Button';

const TicketFilters = ({ users = [] }) => {
  const { filters, updateFilter, clearAllFilters, totalTickets, filteredCount } = useTicketFilters();

  // Debounced search to avoid too many updates
  const debouncedSearch = debounce((value) => {
    updateFilter('search', value);
  }, 300);

  const handleSearchChange = (e) => {
    debouncedSearch(e.target.value);
  };

  const statusOptions = [
    { value: 'all', label: 'All Status' },
    ...Object.values(TICKET_STATUS).map(status => ({
      value: status,
      label: status,
    })),
  ];

  const priorityOptions = [
    { value: 'all', label: 'All Priorities' },
    ...Object.values(TICKET_PRIORITY).map(priority => ({
      value: priority,
      label: priority,
    })),
  ];

  const userOptions = [
    { value: 'all', label: 'All Users' },
    ...users.map(user => {
      const userId = user._id || user.id;
      return {
        value: userId,
        label: user.name,
      };
    }),
  ];

  const hasActiveFilters = 
    filters.search || 
    filters.status !== 'all' || 
    filters.priority !== 'all' || 
    filters.assignedUser !== 'all';

  return (
    <div className="bg-white rounded-lg shadow-md p-3 sm:p-4 lg:p-6 mb-6 overflow-hidden">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 sm:gap-0 mb-4">
        <h3 className="text-base sm:text-lg font-semibold text-gray-900">Filter Tickets</h3>
        <div className="text-xs sm:text-sm text-gray-600">
          Showing {filteredCount} of {totalTickets} tickets
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-3 mb-4">
        <div className="min-w-0">
          <Input
            placeholder="Search tickets..."
            defaultValue={filters.search}
            onChange={handleSearchChange}
            className="mb-0 w-full"
          />
        </div>

        <div className="min-w-0">
          <Select
            value={filters.status}
            onChange={(e) => updateFilter('status', e.target.value)}
            options={statusOptions}
            className="mb-0 w-full"
          />
        </div>

        <div className="min-w-0">
          <Select
            value={filters.priority}
            onChange={(e) => updateFilter('priority', e.target.value)}
            options={priorityOptions}
            className="mb-0 w-full"
          />
        </div>

        <div className="min-w-0">
          <Select
            value={filters.assignedUser}
            onChange={(e) => updateFilter('assignedUser', e.target.value)}
            options={userOptions}
            className="mb-0 w-full"
          />
        </div>
      </div>

      {hasActiveFilters && (
        <div className="flex items-center justify-between pt-4 border-t">
          <div className="flex flex-wrap gap-2">
            {filters.search && (
              <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                Search: "{filters.search}"
                <button
                  onClick={() => updateFilter('search', '')}
                  className="ml-1.5 text-blue-600 hover:text-blue-500"
                >
                  ×
                </button>
              </span>
            )}
            {filters.status !== 'all' && (
              <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                Status: {filters.status}
                <button
                  onClick={() => updateFilter('status', 'all')}
                  className="ml-1.5 text-green-600 hover:text-green-500"
                >
                  ×
                </button>
              </span>
            )}
            {filters.priority !== 'all' && (
              <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800">
                Priority: {filters.priority}
                <button
                  onClick={() => updateFilter('priority', 'all')}
                  className="ml-1.5 text-yellow-600 hover:text-yellow-500"
                >
                  ×
                </button>
              </span>
            )}
            {filters.assignedUser !== 'all' && (
              <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-purple-100 text-purple-800">
                User: {users.find(u => (u._id || u.id) === filters.assignedUser)?.name || 'Unknown'}
                <button
                  onClick={() => updateFilter('assignedUser', 'all')}
                  className="ml-1.5 text-purple-600 hover:text-purple-500"
                >
                  ×
                </button>
              </span>
            )}
          </div>
          
          <Button
            variant="outline"
            size="sm"
            onClick={clearAllFilters}
          >
            Clear All
          </Button>
        </div>
      )}
    </div>
  );
};

export default TicketFilters;