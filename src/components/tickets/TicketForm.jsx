import React, { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { createTicket, updateTicket, fetchUsers } from '../../store/slices/ticketSlice';
import { TICKET_STATUS, TICKET_PRIORITY, TICKET_TYPE } from '../../utils/constants';
import { isAdmin as checkIsAdmin } from '../../utils/helpers';
import Button from '../ui/Button';
import Input from '../ui/Input';
import Select from '../ui/Select';
import Modal from '../ui/Modal';

const TicketForm = ({ isOpen, onClose, ticket = null, projectId }) => {
  const dispatch = useDispatch();
  const { users, loading } = useSelector((state) => state.tickets);
  const { user } = useSelector((state) => state.auth);

  const [formData, setFormData] = useState({
    title: '',
    description: '',
    priority: TICKET_PRIORITY.MEDIUM,
    status: TICKET_STATUS.OPEN,
    type: TICKET_TYPE.BUG,
    assignedTo: '',
    estimatedHours: '',
    dueDate: '',
    tags: '',
  });

  const [errors, setErrors] = useState({});

  const isEditing = !!ticket;
  const isAdmin = checkIsAdmin(user);

  // Fetch users when form opens
  useEffect(() => {
    if (isOpen) {
      const currentProjectId = ticket?.project?._id || ticket?.project || projectId;
      if (currentProjectId) {
        dispatch(fetchUsers(currentProjectId));
      }
    }
  }, [dispatch, isOpen, ticket, projectId]);

  useEffect(() => {
    if (ticket) {
      setFormData({
        title: ticket.title || '',
        description: ticket.description || '',
        priority: ticket.priority || TICKET_PRIORITY.MEDIUM,
        status: ticket.status || TICKET_STATUS.OPEN,
        type: ticket.type || TICKET_TYPE.BUG,
        assignedTo: ticket.assignedTo?._id || ticket.assignedTo || '',
        estimatedHours: ticket.estimatedHours || '',
        dueDate: ticket.dueDate ? new Date(ticket.dueDate).toISOString().split('T')[0] : '',
        tags: Array.isArray(ticket.tags) ? ticket.tags.join(', ') : ticket.tags || '',
      });
    } else {
      setFormData({
        title: '',
        description: '',
        priority: TICKET_PRIORITY.MEDIUM,
        status: TICKET_STATUS.OPEN,
        type: TICKET_TYPE.BUG,
        assignedTo: '',
        estimatedHours: '',
        dueDate: '',
        tags: '',
      });
    }
    setErrors({});
  }, [ticket, isOpen]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value,
    }));
    
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: '',
      }));
    }
  };

  const validateForm = () => {
    const newErrors = {};

    if (!formData.title.trim()) {
      newErrors.title = 'Title is required';
    } else if (formData.title.trim().length < 3) {
      newErrors.title = 'Title must be at least 3 characters';
    }

    if (!formData.description.trim()) {
      newErrors.description = 'Description is required';
    } else if (formData.description.trim().length < 10) {
      newErrors.description = 'Description must be at least 10 characters';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    try {
      const ticketData = {
        title: formData.title.trim(),
        description: formData.description.trim(),
        priority: formData.priority,
        type: formData.type,
        project: projectId,
        assignedTo: formData.assignedTo && formData.assignedTo.trim() ? formData.assignedTo.trim() : null,
      };

      if (formData.dueDate) {
        ticketData.dueDate = new Date(formData.dueDate).toISOString();
      }
      
      if (formData.estimatedHours && formData.estimatedHours.trim()) {
        ticketData.estimatedHours = parseInt(formData.estimatedHours);
      }
      
      if (formData.tags && formData.tags.trim()) {
        ticketData.tags = formData.tags.split(',').map(tag => tag.trim()).filter(tag => tag);
      }
      
      // Only include status for editing
      if (isEditing) {
        ticketData.status = formData.status;
      }

      if (isEditing) {
        await dispatch(updateTicket({ 
          id: ticket._id || ticket.id, 
          ticketData 
        })).unwrap();
      } else {
        await dispatch(createTicket(ticketData)).unwrap();
      }
      
      onClose();
    } catch (err) {
      console.error('Error saving ticket:', err);
      
      // Handle validation errors from backend
      if (err.isValidationError && err.errors) {
        const backendErrors = {};
        err.errors.forEach(error => {
          if (error.field && error.message) {
            backendErrors[error.field] = error.message;
          }
        });
        setErrors(backendErrors);
      } else {
        // Show general error message for non-validation errors
        setErrors({ 
          general: err.message || 'An error occurred while saving the ticket' 
        });
      }
    }
  };

  const statusOptions = Object.values(TICKET_STATUS).map(status => ({
    value: status,
    label: status,
  }));

  const priorityOptions = Object.values(TICKET_PRIORITY).map(priority => ({
    value: priority,
    label: priority,
  }));

  const typeOptions = Object.values(TICKET_TYPE).map(type => ({
    value: type,
    label: type,
  }));

  const userOptions = users.map(user => ({
    value: user._id || user.id,
    label: user.name,
  }));

  return (
    <Modal 
      isOpen={isOpen} 
      onClose={onClose}
      title={isEditing ? 'Edit Ticket' : 'Create New Ticket'}
      maxWidth="lg"
    >
      <form onSubmit={handleSubmit}>
        {errors.general && (
          <div className="mb-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded">
            {errors.general}
          </div>
        )}
        
        <div className="space-y-4">
          <Input
            label="Title"
            name="title"
            value={formData.title}
            onChange={handleChange}
            placeholder="Enter ticket title"
            error={errors.title}
            required
          />

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Description <span className="text-red-500">*</span>
            </label>
            <textarea
              name="description"
              value={formData.description}
              onChange={handleChange}
              placeholder="Describe the issue in detail..."
              rows={4}
              className={`input-field resize-none ${errors.description ? 'border-red-500 focus:border-red-500 focus:ring-red-500' : ''}`}
            />
            {errors.description && (
              <p className="text-red-600 text-sm mt-1">{errors.description}</p>
            )}
          </div>

          <div className="grid grid-cols-2 gap-4">
            <Select
              label="Type"
              name="type"
              value={formData.type}
              onChange={handleChange}
              options={typeOptions}
              required
            />

            <Select
              label="Priority"
              name="priority"
              value={formData.priority}
              onChange={handleChange}
              options={priorityOptions}
              required
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <Select
              label="Status"
              name="status"
              value={formData.status}
              onChange={handleChange}
              options={statusOptions}
              required
            />

            <Input
              label="Estimated Hours"
              type="number"
              name="estimatedHours"
              value={formData.estimatedHours}
              onChange={handleChange}
              placeholder="e.g., 8"
              min="0"
              step="0.5"
            />

            <Input
              label="Due Date"
              type="date"
              name="dueDate"
              value={formData.dueDate}
              onChange={handleChange}
            />
          </div>

          <Input
            label="Tags"
            name="tags"
            value={formData.tags}
            onChange={handleChange}
            placeholder="e.g., urgent, frontend, bug (comma-separated)"
          />

          {isAdmin && (
            <Select
              label="Assign to"
              name="assignedTo"
              value={formData.assignedTo}
              onChange={handleChange}
              options={userOptions}
              placeholder="Select user to assign"
            />
          )}
        </div>

        <div className="flex justify-end space-x-3 mt-6 pt-4 border-t">
          <Button
            type="button"
            variant="secondary"
            onClick={onClose}
          >
            Cancel
          </Button>
          <Button
            type="submit"
            loading={loading}
          >
            {isEditing ? 'Update Ticket' : 'Create Ticket'}
          </Button>
        </div>
      </form>
    </Modal>
  );
};

export default TicketForm;