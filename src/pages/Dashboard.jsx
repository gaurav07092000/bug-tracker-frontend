import React, { useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { fetchProjects, selectProject, clearSelection, deleteProject } from '../store/slices/projectSlice';
import { deleteTicket, fetchUsers } from '../store/slices/ticketSlice';
import { useTicketFilters } from '../hooks/useTicketFilters';
import Layout from '../components/layout/Layout';
import ProjectList from '../components/projects/ProjectList';
import ProjectForm from '../components/projects/ProjectForm';
import ProjectMembers from '../components/projects/ProjectMembers';
import TicketList from '../components/tickets/TicketList';
import TicketForm from '../components/tickets/TicketForm';
import TicketDetails from '../components/tickets/TicketDetails';
import TicketFilters from '../components/tickets/TicketFilters';
import Button from '../components/ui/Button';
import Card from '../components/ui/Card';
import LoadingSpinner from '../components/ui/LoadingSpinner';
import Modal from '../components/ui/Modal';
import { isAdmin } from '../utils/helpers';

const Dashboard = () => {
  const dispatch = useDispatch();
  const { projects, selectedProject, loading: projectsLoading } = useSelector((state) => state.projects);
  const { tickets, users, loading: ticketsLoading } = useSelector((state) => state.tickets);
  const { user } = useSelector((state) => state.auth);
  const { filteredTickets } = useTicketFilters();

  // Ensure projects is always an array
  const projectsArray = Array.isArray(projects) ? projects : [];

  const [showProjectForm, setShowProjectForm] = useState(false);
  const [showProjectMembers, setShowProjectMembers] = useState(false);
  const [showTicketForm, setShowTicketForm] = useState(false);
  const [showTicketDetails, setShowTicketDetails] = useState(false);
  const [editingProject, setEditingProject] = useState(null);
  const [editingTicket, setEditingTicket] = useState(null);
  const [selectedTicket, setSelectedTicket] = useState(null);
  
  // Confirmation modal states
  const [showDeleteProjectModal, setShowDeleteProjectModal] = useState(false);
  const [showDeleteTicketModal, setShowDeleteTicketModal] = useState(false);
  const [projectToDelete, setProjectToDelete] = useState(null);
  const [ticketToDelete, setTicketToDelete] = useState(null);
  const [isDeleting, setIsDeleting] = useState(false);

  const isUserAdmin = isAdmin(user);

  useEffect(() => {
    dispatch(fetchProjects());
  }, [dispatch]);

  useEffect(() => {
    if (selectedProject) {
      const projectId = selectedProject._id || selectedProject.id;
      dispatch(fetchUsers(projectId));
    }
  }, [dispatch, selectedProject]);

  const handleSelectProject = (project) => {
    // Toggle selection - if same project is clicked, deselect it
    if (selectedProject && selectedProject._id === project._id) {
      dispatch(clearSelection());
    } else {
      dispatch(selectProject(project));
    }
  };

  const handleCreateProject = () => {
    setEditingProject(null);
    setShowProjectForm(true);
  };

  const handleEditProject = (project) => {
    setEditingProject(project);
    setShowProjectForm(true);
  };

  const handleManageMembers = (project) => {
    setEditingProject(project); // Reuse editingProject for member management
    setShowProjectMembers(true);
  };

  const handleDeleteProject = (project) => {
    setProjectToDelete(project);
    setShowDeleteProjectModal(true);
  };

  const confirmDeleteProject = async () => {
    if (!projectToDelete) return;

    setIsDeleting(true);
    try {
      await dispatch(deleteProject(projectToDelete._id || projectToDelete.id)).unwrap();
      setShowDeleteProjectModal(false);
      setProjectToDelete(null);
    } catch (err) {
      console.error('Error deleting project:', err);
    } finally {
      setIsDeleting(false);
    }
  };

  const cancelDeleteProject = () => {
    setShowDeleteProjectModal(false);
    setProjectToDelete(null);
  };

  const handleCreateTicket = () => {
    if (!selectedProject) {
      alert('Please select a project first');
      return;
    }
    setEditingTicket(null);
    setShowTicketForm(true);
  };

  const handleEditTicket = (ticket) => {
    setEditingTicket(ticket);
    setShowTicketForm(true);
  };

  const handleViewTicket = (ticket) => {
    setSelectedTicket(ticket);
    setShowTicketDetails(true);
  };

  const handleDeleteTicket = (ticket) => {
    setTicketToDelete(ticket);
    setShowDeleteTicketModal(true);
  };

  const confirmDeleteTicket = async () => {
    if (!ticketToDelete) return;

    setIsDeleting(true);
    try {
      await dispatch(deleteTicket(ticketToDelete.id)).unwrap();
      setShowDeleteTicketModal(false);
      setTicketToDelete(null);
    } catch (err) {
      console.error('Error deleting ticket:', err);
    } finally {
      setIsDeleting(false);
    }
  };

  const cancelDeleteTicket = () => {
    setShowDeleteTicketModal(false);
    setTicketToDelete(null);
  };

  const handleTicketFormClose = () => {
    setShowTicketForm(false);
    setEditingTicket(null);
  };

  const handleTicketDetailsEdit = (ticket) => {
    setShowTicketDetails(false);
    handleEditTicket(ticket);
  };

  return (
    <Layout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">Dashboard</h1>
            <p className="text-gray-600 mt-1">
              Manage your projects and track issues
            </p>
          </div>
        </div>

        {/* Projects Section */}
        <Card
          title="Projects"
          subtitle={`${projectsArray.length} project${projectsArray.length !== 1 ? 's' : ''}${
            selectedProject ? ` • ${selectedProject.name} selected` : ''
          }`}
          actions={
            <div className="flex flex-col sm:flex-row gap-2">
              {selectedProject && (
                <Button 
                  variant="outline" 
                  onClick={() => dispatch(clearSelection())}
                  className="w-full sm:w-auto"
                >
                  Clear Selection
                </Button>
              )}
              {isUserAdmin && (
                <Button 
                  onClick={handleCreateProject}
                  className="w-full sm:w-auto"
                >
                  Create Project
                </Button>
              )}
            </div>
          }
        >
          {projectsLoading ? (
            <LoadingSpinner size="lg" className="py-8" />
          ) : (
            <ProjectList
              projects={projectsArray}
              onSelectProject={handleSelectProject}
              onEditProject={handleEditProject}
              onManageMembers={handleManageMembers}
              onDeleteProject={handleDeleteProject}
            />
          )}
        </Card>

        {/* Tickets Section */}
        {selectedProject && (
          <Card
            title={`Tickets - ${selectedProject.name}`}
            subtitle={`${tickets.length} ticket${tickets.length !== 1 ? 's' : ''} in this project`}
            actions={
              <Button onClick={handleCreateTicket}>
                Create Ticket
              </Button>
            }
          >
            <div className="space-y-4">
              <TicketFilters users={users} />
              
              {ticketsLoading ? (
                <LoadingSpinner size="lg" className="py-8" />
              ) : (
                <TicketList
                  tickets={filteredTickets}
                  onEditTicket={handleEditTicket}
                  onViewTicket={handleViewTicket}
                  onDeleteTicket={handleDeleteTicket}
                />
              )}
            </div>
          </Card>
        )}

        {/* No Project Selected */}
        {!selectedProject && !projectsLoading && projectsArray.length > 0 && (
          <Card>
            <div className="text-center py-12">
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
                  d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"
                />
              </svg>
              <h3 className="mt-2 text-sm font-medium text-gray-900">
                Select a project
              </h3>
              <p className="mt-1 text-sm text-gray-500">
                Choose a project above to view and manage its tickets.
              </p>
            </div>
          </Card>
        )}

        {/* Modals */}
        <ProjectForm
          isOpen={showProjectForm}
          onClose={() => setShowProjectForm(false)}
          project={editingProject}
        />

        <ProjectMembers
          isOpen={showProjectMembers}
          onClose={() => setShowProjectMembers(false)}
          project={editingProject}
        />

        <TicketForm
          isOpen={showTicketForm}
          onClose={handleTicketFormClose}
          ticket={editingTicket}
          projectId={selectedProject?._id || selectedProject?.id}
        />

        <TicketDetails
          isOpen={showTicketDetails}
          onClose={() => setShowTicketDetails(false)}
          ticket={selectedTicket}
          onEdit={handleTicketDetailsEdit}
        />

        {/* Delete Project Confirmation Modal */}
        <Modal
          isOpen={showDeleteProjectModal}
          onClose={cancelDeleteProject}
          title="Delete Project"
          maxWidth="sm"
        >
          <div className="text-center py-4">
            <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-red-100 mb-4">
              <svg className="h-6 w-6 text-red-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.732-.833-2.5 0L4.268 19.5c-.77.833.192 2.5 1.732 2.5z" />
              </svg>
            </div>
            <h3 className="text-lg font-medium text-gray-900 mb-2">
              Delete "{projectToDelete?.name}"?
            </h3>
            <p className="text-sm text-gray-500 mb-6">
              Are you sure you want to delete this project? This action will also delete all associated tickets and cannot be undone.
            </p>
            <div className="flex justify-center space-x-3">
              <Button
                variant="outline"
                onClick={cancelDeleteProject}
                disabled={isDeleting}
              >
                Cancel
              </Button>
              <Button
                variant="danger"
                onClick={confirmDeleteProject}
                loading={isDeleting}
              >
                Delete Project
              </Button>
            </div>
          </div>
        </Modal>

        {/* Delete Ticket Confirmation Modal */}
        <Modal
          isOpen={showDeleteTicketModal}
          onClose={cancelDeleteTicket}
          title="Delete Ticket"
          maxWidth="sm"
        >
          <div className="text-center py-4">
            <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-red-100 mb-4">
              <svg className="h-6 w-6 text-red-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.732-.833-2.5 0L4.268 19.5c-.77.833.192 2.5 1.732 2.5z" />
              </svg>
            </div>
            <h3 className="text-lg font-medium text-gray-900 mb-2">
              Delete "{ticketToDelete?.title}"?
            </h3>
            <p className="text-sm text-gray-500 mb-6">
              Are you sure you want to delete this ticket? This action cannot be undone.
            </p>
            <div className="flex justify-center space-x-3">
              <Button
                variant="outline"
                onClick={cancelDeleteTicket}
                disabled={isDeleting}
              >
                Cancel
              </Button>
              <Button
                variant="danger"
                onClick={confirmDeleteTicket}
                loading={isDeleting}
              >
                Delete Ticket
              </Button>
            </div>
          </div>
        </Modal>
      </div>
    </Layout>
  );
};

export default Dashboard;