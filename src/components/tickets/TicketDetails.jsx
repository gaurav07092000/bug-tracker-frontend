import React from 'react';
import { useSelector } from 'react-redux';
import { formatDate, getStatusClass, getPriorityClass } from '../../utils/helpers';
import Modal from '../ui/Modal';

const TicketDetails = ({ isOpen, onClose, ticket, onEdit }) => {
  const { users } = useSelector((state) => state.tickets);
  const { user } = useSelector((state) => state.auth);

  if (!ticket) return null;

  const getUserName = (assignedUser) => {
    // If assignedUser is already a user object with name, return it
    if (assignedUser && typeof assignedUser === 'object' && assignedUser.name) {
      return assignedUser.name;
    }
    
    // If it's a user ID, find the user in users array
    if (assignedUser && typeof assignedUser === 'string') {
      const foundUser = users.find(u => (u._id || u.id) === assignedUser);
      return foundUser ? foundUser.name : 'Unassigned';
    }
    
    return 'Unassigned';
  };

  const isAdmin = user?.role === 'ADMIN';
  const assignedUserId = ticket.assignedTo?._id || ticket.assignedTo?.id || ticket.assignedTo;
  const canEdit = isAdmin || assignedUserId === user?.id;

  return (
    <Modal 
      isOpen={isOpen} 
      onClose={onClose}
      title="Ticket Details"
      maxWidth="2xl"
    >
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-start justify-between">
          <div>
            <h2 className="text-2xl font-bold text-gray-900 mb-2">
              {ticket.title}
            </h2>
            <div className="flex items-center space-x-3">
              <span className={getStatusClass(ticket.status)}>
                {ticket.status}
              </span>
              <span className={getPriorityClass(ticket.priority)}>
                {ticket.priority} Priority
              </span>
              {ticket.type && (
                <span className="bg-gray-100 text-gray-700 px-2 py-1 rounded text-xs font-medium">
                  {ticket.type}
                </span>
              )}
            </div>
          </div>
          {canEdit && (
            <button
              onClick={() => onEdit(ticket)}
              className="btn-secondary"
            >
              Edit Ticket
            </button>
          )}
        </div>

        {/* Description */}
        <div>
          <h3 className="text-lg font-semibold text-gray-900 mb-2">
            Description
          </h3>
          <div className="bg-gray-50 rounded-md p-4">
            <p className="text-gray-700 whitespace-pre-wrap">
              {ticket.description}
            </p>
          </div>
        </div>

        {/* Details Grid */}
        <div className="grid grid-cols-2 gap-6">
          <div>
            <h4 className="font-semibold text-gray-900 mb-2">Assignment</h4>
            <div className="space-y-2">
              <div>
                <span className="text-sm text-gray-600">Assigned to:</span>
                <div className="mt-1">
                  {ticket.assignedTo ? (
                    <div className="flex items-center">
                      <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center mr-2">
                        <span className="text-sm font-medium text-blue-600">
                          {getUserName(ticket.assignedTo).charAt(0)}
                        </span>
                      </div>
                      <span className="text-gray-900">
                        {getUserName(ticket.assignedTo)}
                      </span>
                    </div>
                  ) : (
                    <span className="text-gray-500">Unassigned</span>
                  )}
                </div>
              </div>
            </div>
          </div>

          <div>
            <h4 className="font-semibold text-gray-900 mb-2">Timeline</h4>
            <div className="space-y-2">
              <div>
                <span className="text-sm text-gray-600">Created:</span>
                <div className="text-gray-900">
                  {formatDate(ticket.createdAt)}
                </div>
              </div>
              {ticket.updatedAt && ticket.updatedAt !== ticket.createdAt && (
                <div>
                  <span className="text-sm text-gray-600">Last updated:</span>
                  <div className="text-gray-900">
                    {formatDate(ticket.updatedAt)}
                  </div>
                </div>
              )}
              {ticket.dueDate && (
                <div>
                  <span className="text-sm text-gray-600">Due date:</span>
                  <div className="text-gray-900">
                    {formatDate(ticket.dueDate)}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Additional Details */}
        {(ticket.estimatedHours || ticket.actualHours || ticket.tags?.length > 0) && (
          <div className="grid grid-cols-2 gap-6">
            <div>
              <h4 className="font-semibold text-gray-900 mb-2">Time Tracking</h4>
              <div className="space-y-2">
                {ticket.estimatedHours && (
                  <div>
                    <span className="text-sm text-gray-600">Estimated hours:</span>
                    <div className="text-gray-900">{ticket.estimatedHours}h</div>
                  </div>
                )}
                {ticket.actualHours && (
                  <div>
                    <span className="text-sm text-gray-600">Actual hours:</span>
                    <div className="text-gray-900">{ticket.actualHours}h</div>
                  </div>
                )}
              </div>
            </div>

            {ticket.tags?.length > 0 && (
              <div>
                <h4 className="font-semibold text-gray-900 mb-2">Tags</h4>
                <div className="flex flex-wrap gap-2">
                  {ticket.tags.map((tag, index) => (
                    <span 
                      key={index}
                      className="bg-blue-100 text-blue-800 px-2 py-1 rounded text-xs font-medium"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}

        {/* Activity Timeline (placeholder for future implementation) */}
        <div>
          <h4 className="font-semibold text-gray-900 mb-2">Activity</h4>
          <div className="bg-gray-50 rounded-md p-4">
            <p className="text-gray-500 text-sm italic">
              Activity history will be displayed here in future updates.
            </p>
          </div>
        </div>
      </div>
    </Modal>
  );
};

export default TicketDetails;