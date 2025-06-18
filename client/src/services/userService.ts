import { User } from '../types';
import { api } from '../lib/api';
import { supabase } from '../lib/supabase';

export const updateUserProfile = async (userId: string, data: { name: string; email: string }): Promise<{ user: User; message: string }> => {
  try {
    // First, update the email in Supabase Auth if it has changed
    const { data: { user: currentUser } } = await supabase.auth.getUser();
    if (currentUser?.email !== data.email) {
      // First update the email in Supabase Auth
      const { error: updateError } = await supabase.auth.updateUser({
        email: data.email
      });
      
      if (updateError) {
        if (updateError.message.includes('already registered')) {
          throw new Error('This email is already registered');
        }
        throw new Error('Failed to update email in authentication system');
      }

      // Then update our database
      const response = await api.put(`/users/${userId}`, data);
      return {
        user: response.data,
        message: 'Profile updated successfully. Please check your email to verify your new email address. You will need to verify your new email before you can use it to log in.'
      };
    }

    // If only name was changed, just update the database
    const response = await api.put(`/users/${userId}`, data);
    return {
      user: response.data,
      message: 'Profile updated successfully'
    };
  } catch (error) {
    if (error instanceof Error) {
      throw error;
    }
    throw new Error('Failed to update profile');
  }
};

export const changePassword = async (userId: string, data: { currentPassword: string; newPassword: string }): Promise<{ message: string }> => {
  try {
    // First verify the current password
    const { data: { user } } = await supabase.auth.getUser();
    if (!user?.email) {
      throw new Error('User not found');
    }

    const { error: signInError } = await supabase.auth.signInWithPassword({
      email: user.email,
      password: data.currentPassword
    });

    if (signInError) {
      throw new Error('Current password is incorrect');
    }

    // Update password in Supabase Auth
    const { error: updateError } = await supabase.auth.updateUser({
      password: data.newPassword
    });

    if (updateError) {
      throw new Error('Failed to change password');
    }

    // Update our database if needed
    await api.put(`/users/${userId}/password`, data);

    return {
      message: 'Password changed successfully. You will need to use your new password next time you log in.'
    };
  } catch (error) {
    if (error instanceof Error) {
      throw error;
    }
    throw new Error('Failed to change password');
  }
}; 