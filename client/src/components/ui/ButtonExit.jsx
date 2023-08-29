export function ButtonExit({ onClick, children }) {
  return (
    <button
      className="bg-white-500 px-4 py-1 rounded-md my-2 disabled:bg-indigo-300"
      onClick={onClick}
    >
      <div  className="flex justify-between  items-center space-x-3">
          <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
              <path d="M10 3H6a2 2 0 0 0-2 2v14c0 1.1.9 2 2 2h4M16 17l5-5-5-5M19.8 12H9"/>
          </svg>
          {children}

      </div>
    </button>
  );
}
