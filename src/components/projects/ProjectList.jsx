import React from 'react';
import { useSelector } from 'react-redux';
import { formatDate, isAdmin as checkIsAdmin } from '../../utils/helpers';
import Button from '../ui/Button';
import Card from '../ui/Card';

const ProjectList = ({ projects = [], onSelectProject, onEditProject, onManageMembers, onDeleteProject }) => {
  const { user } = useSelector((state) => state.auth);
  const { selectedProject } = useSelector((state) => state.projects);
  
  const isAdmin = checkIsAdmin(user);

  // Ensure projects is always an array
  const projectsArray = Array.isArray(projects) ? projects : [];

  if (projectsArray.length === 0) {
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
              d="M19 11H5m14-4l-1.5 1.5M5 7l1.5 1.5"
            />
          </svg>
          <h3 className="mt-2 text-sm font-medium text-gray-900">No projects</h3>
          <p className="mt-1 text-sm text-gray-500">
            Get started by creating your first project.
          </p>
        </div>
      </Card>
    );
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4 sm:gap-6">
      {projectsArray.map((project, index) => (
        <Card 
          key={project.id || project._id || `project-${index}`} 
          className={`cursor-pointer hover:shadow-lg transition-all ${
            selectedProject && (selectedProject._id === project._id) ? 'ring-2 ring-blue-500' : ''
          }`}
          onClick={() => onSelectProject(project)}
        >
          <div className="flex items-start justify-between mb-4">
            <div className="flex-1">
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                {project.name}
              </h3>
              <p className="text-gray-600 text-sm mb-3 line-clamp-3">
                {project.description}
              </p>
            </div>
            
            {selectedProject && selectedProject._id === project._id && (
              <div className="ml-2">
                <span className="bg-blue-100 text-blue-800 px-2 py-1 rounded-full text-xs font-medium">
                  Selected
                </span>
              </div>
            )}
          </div>

          <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4">
            <div className="text-sm text-gray-500">
              <div>Created: {formatDate(project.createdAt)}</div>
              <div className="mt-1">
                Tickets: {project.ticketCount || 0}
              </div>
            </div>

            {isAdmin && (
              <div className="flex flex-col sm:flex-row gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={(e) => {
                    e.stopPropagation();
                    onEditProject(project);
                  }}
                  className="w-full sm:w-auto"
                >
                  Edit
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={(e) => {
                    e.stopPropagation();
                    onManageMembers(project);
                  }}
                  className="w-full sm:w-auto text-blue-600 border-blue-200 hover:bg-blue-50"
                >
                  Members
                </Button>
                <Button
                  variant="danger"
                  size="sm"
                  onClick={(e) => {
                    e.stopPropagation();
                    onDeleteProject(project);
                  }}
                >
                  Delete
                </Button>
              </div>
            )}
          </div>
        </Card>
      ))}
    </div>
  );
};

export default ProjectList;