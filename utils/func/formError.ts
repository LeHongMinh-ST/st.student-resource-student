import { FieldValues, UseFormSetError } from 'react-hook-form';

/**
 * Sets form errors dynamically based on the errors object received from the server.
 *
 * @param errors - The errors object from the server response (e.g., e.response?.data?.errors)
 * @param setError - The `setError` function from react-hook-form
 */
export const setFormErrors = (errors: any, setError: UseFormSetError<FieldValues>) => {
  Object.keys(errors).forEach((field) => {
    setError(field, {
      type: 'manual',
      message: errors[field][0], // Assumes the error message is in the first element of the array
    });
  });
};
