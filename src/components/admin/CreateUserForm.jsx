import { useState, useEffect } from 'react';
import { useForm, useWatch } from 'react-hook-form';
import { useSupabase } from '../../contexts/SupabaseContext';
import { useNotification } from '../common/notification/useNotification';
import jurisdictions from '../../utils/jurisdictions.json';

const CreateUserForm = ({ onUserCreated }) => {
  const { supabase } = useSupabase();
  const { register, handleSubmit, formState: { errors }, reset, control } = useForm();
  const { addNotification } = useNotification();
  const [loading, setLoading] = useState(false);

  const selectedRole = useWatch({
    control,
    name: 'role',
    defaultValue: 'authority'
  });

  const onSubmit = async (data) => {
    setLoading(true);
    try {
      const { data: functionData, error } = await supabase.functions.invoke('create-user', {
        body: {
          email: data.email,
          password: data.password,
          role: data.role,
          jurisdiction: data.jurisdiction,
        },
      });

      if (error) {
        throw error;
      }

      if (functionData.error) {
        throw new Error(functionData.error);
      }

      addNotification({ message: 'User created successfully!', type: 'success' });
      reset();
      if (onUserCreated) {
        onUserCreated();
      }
      await supabase.auth.refreshSession();
    } catch (error) {
      addNotification({ message: `Error creating user: ${error.message}`, type: 'error' });
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <h3>Create New User</h3>
      <input type="email" placeholder="Email" {...register('email', { required: true })} />
      {errors.email && <p>Email is required</p>}

      <input type="password" placeholder="Password" {...register('password', { required: true, minLength: 8 })} />
      {errors.password && <p>Password must be at least 8 characters</p>}

      <select {...register('role', { required: true })}>
        <option value="authority">Authority</option>
        <option value="admin">Admin</option>
      </select>
      {errors.role && <p>Role is required</p>}

      {selectedRole === 'authority' && (
        <>
          <select {...register('jurisdiction', { required: selectedRole === 'authority' })}>
            <option value="">Select Jurisdiction</option>
            {jurisdictions.map((j) => (
              <option key={j.psgc_code} value={j.psgc_code}>
                {j.barangay}, {j.city}
              </option>
            ))}
          </select>
          {errors.jurisdiction && <p>Jurisdiction is required</p>}
        </>
      )}

      <button type="submit" disabled={loading}>
        {loading ? 'Creating...' : 'Create User'}
      </button>
    </form>
  );
};

export default CreateUserForm;