export function Button({ onClick, children }) {
  return (
    <button
      className="bg-gray-700 px-4 py-1 rounded-md my-2 disabled:bg-indigo-300"
      onClick={onClick}
      style={{marginRight:"0.5rem"}}
    >
      {children}
    </button>
  );
}
