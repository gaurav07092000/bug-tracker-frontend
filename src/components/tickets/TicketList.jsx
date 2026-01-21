import React from 'react';
import { useSelector } from 'react-redux';
import { formatDate, getStatusClass, getPriorityClass, isAdmin as checkIsAdmin } from '../../utils/helpers';
import { TICKET_STATUS, TICKET_PRIORITY } from '../../utils/constants';
import Button from '../ui/Button';
import Card from '../ui/Card';

const TicketList = ({ onEditTicket, onViewTicket, onDeleteTicket, tickets = [] }) => {
  const { users } = useSelector((state) => state.tickets);
  const { user } = useSelector((state) => state.auth);

  // Ensure tickets is always an array
  const ticketsArray = Array.isArray(tickets) ? tickets : [];

  const getUserName = (userId) => {
    const foundUser = users.find(u => (u._id || u.id) === userId);
    return foundUser ? foundUser.name : 'Unassigned';
  };

  const isAdmin = checkIsAdmin(user);

  if (ticketsArray.length === 0) {
    return (
      <Card>
        <div className="text-center py-8">
          <svg
            className="mx-auto h-12 w-12 text-gray-400"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            aria-hidden="true"
          >
            <path
              vectorEffect="non-scaling-stroke"
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M9 13h6m-3-3v6m-9 1V7a2 2 0 012-2h6l2 2h6a2 2 0 012 2v8a2 2 0 01-2 2H5a2 2 0 01-2-2z"
            />
          </svg>
          <h3 className="mt-2 text-sm font-medium text-gray-900">No tickets</h3>
          <p className="mt-1 text-sm text-gray-500">
            Get started by creating a new ticket for this project.
          </p>
        </div>
      </Card>
    );
  }

  return (
    <div className="space-y-4">
      {ticketsArray.map((ticket, index) => (
        <Card key={ticket._id || ticket.id || `ticket-${index}`} className="hover:shadow-lg transition-shadow">
          <div className="flex items-start justify-between">
            <div className="flex-1">
              <div className="flex items-center space-x-2 mb-2">
                <h3 
                  className="text-lg font-semibold text-gray-900 cursor-pointer hover:text-blue-600"
                  onClick={() => onViewTicket(ticket)}
                >
                  {ticket.title}
                </h3>
                <span className={getStatusClass(ticket.status)}>
                  {ticket.status}
                </span>
                <span className={getPriorityClass(ticket.priority)}>
                  {ticket.priority}
                </span>
              </div>

              <p className="text-gray-600 mb-3 line-clamp-2">
                {ticket.description}
              </p>

              <div className="flex items-center text-sm text-gray-500 space-x-4">
                <span>Assigned to: {getUserName(ticket.assignedTo)}</span>
                <span>Created: {formatDate(ticket.createdAt)}</span>
                {ticket.updatedAt && ticket.updatedAt !== ticket.createdAt && (
                  <span>Updated: {formatDate(ticket.updatedAt)}</span>
                )}
                {ticket.type && (
                  <span className="bg-gray-100 text-gray-700 px-2 py-1 rounded text-xs">
                    {ticket.type}
                  </span>
                )}
              </div>
            </div>

            <div className="flex space-x-2 ml-4">
              <Button
                variant="outline"
                size="sm"
                onClick={() => onViewTicket(ticket)}
              >
                View
              </Button>
              
              {(isAdmin || ticket.assignedTo === user?.id) && (
                <Button
                  variant="secondary"
                  size="sm"
                  onClick={() => onEditTicket(ticket)}
                >
                  Edit
                </Button>
              )}
              
              {isAdmin && (
                <Button
                  variant="danger"
                  size="sm"
                  onClick={() => onDeleteTicket(ticket)}
                >
                  Delete
                </Button>
              )}
            </div>
          </div>
        </Card>
      ))}
    </div>
  );
};

export default TicketList;