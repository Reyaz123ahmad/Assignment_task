import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { getUsers, deleteUser } from '../services/api';
import UserForm from './UserForm';
import Loading from './Loading';
import ErrorMessage from './ErrorMessage';
import './UserList.css';

const UserList = () => {
  const [users, setUsers] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [editingUser, setEditingUser] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const { logout } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    fetchUsers();
  }, [currentPage]);

  const fetchUsers = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await getUsers(currentPage);
      setUsers(response.data.data);
      setTotalPages(response.data.total_pages);
    } catch (err) {
      setError('Failed to fetch users. Please try again.');
      if (err.response?.status === 401) {
        logout();
      }
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this user?')) {
      try {
        await deleteUser(id);
        // Remove the user from the local state to update UI immediately
        setUsers(users.filter(user => user.id !== id));
        // If the current page becomes empty, go to previous page
        if (users.length === 1 && currentPage > 1) {
          setCurrentPage(currentPage - 1);
        }
      } catch (err) {
        setError('Failed to delete user. Please try again.');
        if (err.response?.status === 401) {
          logout();
        }
      }
    }
  };

  const handleEdit = (user) => {
    setEditingUser(user);
    setShowModal(true);
  };

  const handleUserUpdated = (updatedUser) => {
    setUsers(users.map(user => 
      user.id === updatedUser.id ? { ...user, ...updatedUser } : user
    ));
    setShowModal(false);
  };

  return (
    <div className="user-list-container">
      <div className="user-list-header">
        <h2>User Management</h2>
        <button onClick={logout} className="logout-btn">
          Logout
        </button>
      </div>

      {error && <ErrorMessage message={error} />}

      {loading && users.length === 0 ? (
        <Loading />
      ) : (
        <>
          <div className="user-list">
            {users.length === 0 ? (
              <p>No users found.</p>
            ) : (
              <table>
                <thead>
                  <tr>
                    <th>Avatar</th>
                    <th>First Name</th>
                    <th>Last Name</th>
                    <th>Email</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {users.map((user) => (
                    <tr key={user.id}>
                      <td>
                        <img 
                          src={user.avatar} 
                          alt={`${user.first_name} ${user.last_name}`} 
                          className="avatar"
                        />
                      </td>
                      <td>{user.first_name}</td>
                      <td>{user.last_name}</td>
                      <td>{user.email}</td>
                      <td>
                        <button 
                          onClick={() => handleEdit(user)}
                          className="edit-btn"
                        >
                          Edit
                        </button>
                        <button 
                          onClick={() => handleDelete(user.id)}
                          className="delete-btn"
                        >
                          Delete
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>

          {totalPages > 1 && (
            <div className="pagination">
              <button
                onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                disabled={currentPage === 1}
              >
                Previous
              </button>
              <span>Page {currentPage} of {totalPages}</span>
              <button
                onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                disabled={currentPage === totalPages}
              >
                Next
              </button>
            </div>
          )}
        </>
      )}

      {showModal && (
        <div className="modal">
          <div className="modal-content">
            <span 
              className="close-btn" 
              onClick={() => setShowModal(false)}
            >
              &times;
            </span>
            <UserForm 
              user={editingUser} 
              onSuccess={handleUserUpdated} 
              onCancel={() => setShowModal(false)}
            />
          </div>
        </div>
      )}
    </div>
  );
};

export default UserList;
