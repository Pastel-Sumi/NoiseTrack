import { Link } from "react-router-dom";

export function ButtonLink({ to, onClick, children }) {
  return (
    <button
      className="bg-indigo-500 px-4 py-1 rounded-md my-2 disabled:bg-indigo-300"
      onClick={onClick}
    >
      <Link to={to} className="bg-indigo-500 px-4 py-1 rounded-md">
        {children}
      </Link>
    </button>
  );
}