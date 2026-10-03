import { useToastContext } from '../context/ToastContext';

/**
 * useToast Hook
 * Provides direct access to toast dispatchers and active toasts array.
 *
 * Usage:
 * const { toast } = useToast();
 * toast.success('Car successfully saved to favorites!');
 * toast.error('Failed to submit inquiry. Please try again.');
 * toast.promise(saveListingAPI(), {
 *   loading: 'Publishing your car listing...',
 *   success: 'Car listing is live on CarBazaar!',
 *   error: 'Failed to publish listing.'
 * });
 */
export const useToast = () => {
  return useToastContext();
};

export default useToast;
