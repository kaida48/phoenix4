export default function ErrorAlert({ message }: { message: string }) {
  return (
    <div className="bg-red-600 text-white p-4 rounded my-4">
      {message}
    </div>
  );
}