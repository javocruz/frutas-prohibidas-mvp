import { useEffect, useState } from 'react';
import { User } from '../types';
import { getAllUsers } from '../services/userService';
import { Table } from '../components/Table';
import { LoadingSpinner } from '../components/LoadingSpinner';
import { ErrorMessage } from '../components/ErrorMessage';
import { format } from 'date-fns';

const UserManagement = () => {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        setLoading(true);
        const fetchedUsers = await getAllUsers();
        setUsers(fetchedUsers);
        setError(null);
      } catch (err) {
        setError('Failed to fetch users. You may not have permission to view this page.');
      } finally {
        setLoading(false);
      }
    };

    fetchUsers();
  }, []);

  const columns = [
    { header: 'Name', accessor: 'name' },
    { header: 'Email', accessor: 'email' },
    { header: 'Role', accessor: 'role' },
    { header: 'Points', accessor: 'points' },
    { 
      header: 'Joined Date', 
      accessor: (user: User) => format(new Date(user.created_at), 'MMM d, yyyy')
    },
  ];

  if (loading) return <LoadingSpinner />;
  if (error) return <ErrorMessage message={error} />;

  return (
    <div className="p-6">
      <h1 className="text-2xl font-semibold text-gray-900 dark:text-white mb-4">User Management</h1>
      <Table columns={columns} data={users} />
    </div>
  );
};

export default UserManagement; 