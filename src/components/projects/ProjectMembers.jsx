import React, { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { fetchUsers } from '../../store/slices/ticketSlice';
import { addProjectMember, removeProjectMember, fetchProjects } from '../../store/slices/projectSlice';
import Button from '../ui/Button';
import Select from '../ui/Select';
import Modal from '../ui/Modal';
import { toast } from 'react-toastify';

const ProjectMembers = ({ isOpen, onClose, project }) => {
  const dispatch = useDispatch();
  const { users } = useSelector((state) => state.tickets);
  const { projects, selectedProject } = useSelector((state) => state.projects);
  const [loading, setLoading] = useState(false);
  const [addingMember, setAddingMember] = useState(false);
  const [selectedUserId, setSelectedUserId] = useState('');
  const [selectedRole, setSelectedRole] = useState('CONTRIBUTOR');
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [memberToRemove, setMemberToRemove] = useState(null);

  const projectId = project?._id || project?.id;
  const currentProject = projects.find(p => (p._id || p.id) === projectId) || 
                         selectedProject || 
                         project;
  
  const members = currentProject?.members || [];

  const roleOptions = [
    { value: 'CONTRIBUTOR', label: 'Contributor' },
    { value: 'MANAGER', label: 'Manager' }
  ];

  useEffect(() => {
    if (isOpen && currentProject) {
      // Always fetch users when the modal opens to ensure we have current data
      dispatch(fetchUsers(null));
    }
  }, [dispatch, isOpen, currentProject]);

  const availableUsers = users.filter(user => 
    !members.some(member => {
      const memberId = member.user?._id || member.user?.id || member.userId || member._id || member.id;
      const userId = user._id || user.id;
      return memberId === userId;
    })
  );

  const userOptions = availableUsers.map(user => ({
    value: user._id || user.id,
    label: `${user.name} (${user.email})`
  }));

  const handleAddMember = async () => {
    if (!selectedUserId) {
      toast.error('Please select a user');
      return;
    }

    setAddingMember(true);
    try {
      await dispatch(addProjectMember({
        projectId: currentProject._id || currentProject.id,
        userId: selectedUserId,
        role: selectedRole
      })).unwrap();

      // Refresh projects to get updated member data
      dispatch(fetchProjects());
      
      setSelectedUserId('');
      setSelectedRole('CONTRIBUTOR');
      toast.success('Member added successfully');
    } catch (error) {
      console.error('Error adding member:', error);
      toast.error(error || 'Failed to add member');
    } finally {
      setAddingMember(false);
    }
  };

  const handleRemoveMember = async (member, memberName) => {
    let memberId;
    if (member.user && (member.user._id || member.user.id)) {
      memberId = member.user._id || member.user.id;
    } else if (member.userId) {
      memberId = member.userId;
    } else if (member._id) {
      memberId = member._id;
    } else if (member.id) {
      memberId = member.id;
    } else {
      console.error('Cannot extract member ID from:', member);
      toast.error('Unable to identify member to remove');
      return;
    }
    
    setMemberToRemove({ member, memberName, memberId });
    setShowConfirmModal(true);
  };

  const confirmRemoveMember = async () => {
    if (!memberToRemove) return;

    const { memberId } = memberToRemove;
    
    setLoading(true);
    try {
      await dispatch(removeProjectMember({
        projectId: currentProject._id || currentProject.id,
        userId: memberId
      })).unwrap();
      
      toast.success('Member removed successfully');
      setShowConfirmModal(false);
      setMemberToRemove(null);
    } catch (error) {
      console.error('Error removing member:', error);
      toast.error(error || 'Failed to remove member');
    } finally {
      setLoading(false);
    }
  };

  const cancelRemoveMember = () => {
    setShowConfirmModal(false);
    setMemberToRemove(null);
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={`Manage Members - ${currentProject?.name}`}
      maxWidth="lg"
    >
      <div className="space-y-6">
        <div className="border-b pb-4">
          <h3 className="text-lg font-medium text-gray-900 mb-4">Add Member</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="md:col-span-1">
              <Select
                label="User"
                value={selectedUserId}
                onChange={(e) => setSelectedUserId(e.target.value)}
                options={userOptions}
                placeholder={userOptions.length > 0 ? "Select user to add" : "No users available"}
              />
              {userOptions.length === 0 && (
                <p className="text-sm text-red-600 mt-1">
                  {users.length === 0 ? "Loading users..." : "All users are already members"}
                </p>
              )}
            </div>
            <div className="md:col-span-1">
              <Select
                label="Role"
                value={selectedRole}
                onChange={(e) => setSelectedRole(e.target.value)}
                options={roleOptions}
              />
            </div>
            <div className="md:col-span-1 flex items-end">
              <Button
                onClick={handleAddMember}
                loading={addingMember}
                disabled={!selectedUserId || addingMember}
                className="w-full"
              >
                Add Member
              </Button>
            </div>
          </div>
        </div>

        <div>
          <h3 className="text-lg font-medium text-gray-900 mb-4">
            Current Members ({members.length})
          </h3>
          
          {members.length === 0 ? (
            <div className="text-center py-8 text-gray-500">
              <p>No members added to this project yet.</p>
              <p className="text-sm mt-1">Add members to assign tickets to them.</p>
            </div>
          ) : (
            <div className="space-y-3">
              {members.map((member) => (
                <div
                  key={member._id || member.userId || member.id}
                  className="flex items-center justify-between p-4 border border-gray-200 rounded-lg"
                >
                  <div className="flex-1">
                    <h4 className="font-medium text-gray-900">
                      {member.user?.name || member.name || 'Unknown User'}
                    </h4>
                    <p className="text-sm text-gray-500">
                      {member.user?.email || member.email || 'No email provided'}
                    </p>
                    <span className="inline-block px-2 py-1 text-xs font-medium bg-blue-100 text-blue-800 rounded-full mt-1">
                      {member.role || 'CONTRIBUTOR'}
                    </span>
                  </div>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleRemoveMember(
                      member,
                      member.user?.name || member.name || 'this user'
                    )}
                    disabled={loading}
                    className="text-red-600 border-red-200 hover:bg-red-50"
                  >
                    Remove
                  </Button>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      <div className="flex justify-end mt-6 pt-4 border-t">
        <Button variant="outline" onClick={onClose}>
          Close
        </Button>
      </div>

      <Modal
        isOpen={showConfirmModal}
        onClose={cancelRemoveMember}
        title="Remove Member"
        maxWidth="sm"
      >
        <div className="text-center py-4">
          <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-red-100 mb-4">
            <svg className="h-6 w-6 text-red-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.732-.833-2.5 0L4.268 19.5c-.77.833.192 2.5 1.732 2.5z" />
            </svg>
          </div>
          <h3 className="text-lg font-medium text-gray-900 mb-2">
            Remove {memberToRemove?.memberName}?
          </h3>
          <p className="text-sm text-gray-500 mb-6">
            Are you sure you want to remove this member from the project? This action cannot be undone.
          </p>
          <div className="flex justify-center space-x-3">
            <Button
              variant="outline"
              onClick={cancelRemoveMember}
              disabled={loading}
            >
              Cancel
            </Button>
            <Button
              variant="danger"
              onClick={confirmRemoveMember}
              loading={loading}
            >
              Remove Member
            </Button>
          </div>
        </div>
      </Modal>
    </Modal>
  );
};

export default ProjectMembers;