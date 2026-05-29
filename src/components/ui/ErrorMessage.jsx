const ErrorMessage = ({ message }) =>
  message ? (
    <p className="text-red-600 text-sm mt-1" role="alert">
      {message}
    </p>
  ) : null;

export default ErrorMessage;
