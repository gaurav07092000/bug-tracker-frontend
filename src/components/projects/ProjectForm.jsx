import React, { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { createProject, updateProject } from '../../store/slices/projectSlice';
import Button from '../ui/Button';
import Input from '../ui/Input';
import Modal from '../ui/Modal';

const ProjectForm = ({ isOpen, onClose, project = null }) => {
  const dispatch = useDispatch();
  const { loading } = useSelector((state) => state.projects);

  const [formData, setFormData] = useState({
    name: '',
    description: '',
  });

  const [errors, setErrors] = useState({});

  const isEditing = !!project;

  useEffect(() => {
    if (project) {
      setFormData({
        name: project.name || '',
        description: project.description || '',
      });
    } else {
      setFormData({
        name: '',
        description: '',
      });
    }
    setErrors({});
  }, [project, isOpen]);

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

    if (!formData.name.trim()) {
      newErrors.name = 'Project name is required';
    } else if (formData.name.trim().length < 3) {
      newErrors.name = 'Project name must be at least 3 characters';
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
      const projectData = {
        name: formData.name.trim(),
        description: formData.description.trim(),
      };

      if (isEditing) {
        await dispatch(updateProject({ 
          id: project._id || project.id, 
          projectData 
        })).unwrap();
      } else {
        await dispatch(createProject(projectData)).unwrap();
      }
      
      onClose();
    } catch (err) {
      console.error('Error saving project:', err);
      
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
          general: err.message || 'An error occurred while saving the project' 
        });
      }
    }
  };

  return (
    <Modal 
      isOpen={isOpen} 
      onClose={onClose}
      title={isEditing ? 'Edit Project' : 'Create New Project'}
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
            label="Project Name"
            name="name"
            value={formData.name}
            onChange={handleChange}
            placeholder="Enter project name"
            error={errors.name}
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
              placeholder="Describe your project..."
              rows={4}
              className={`input-field resize-none ${errors.description ? 'border-red-500 focus:border-red-500 focus:ring-red-500' : ''}`}
            />
            {errors.description && (
              <p className="text-red-600 text-sm mt-1">{errors.description}</p>
            )}
          </div>
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
            {isEditing ? 'Update Project' : 'Create Project'}
          </Button>
        </div>
      </form>
    </Modal>
  );
};

export default ProjectForm;