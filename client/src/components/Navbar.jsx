import { Link } from "react-router-dom";
import { useAuth } from "../context/authContext";
import { ButtonLink } from "./ui/ButtonLink";

export function Navbar() {
  const { isAuthenticated, logout, user } = useAuth();
  console.log(isAuthenticated, user)

  return (
    <nav className="bg-zinc-700 my-3 flex justify-between py-5 px-10 rounded-lg">
      <h1 className="text-2xl font-bold">
        <Link to={isAuthenticated ? "/dashboard" : "/"}>NoiseTrack</Link>
      </h1>
      <ul className="flex gap-x-2">
        {isAuthenticated ? (
          <>
            <li>
              {user.username}
            </li>
            {/* <li>
              <ButtonLink to="/add-task">Add Task</ButtonLink>
            </li> */}
            <li>
              <ButtonLink to="/" onClick={() => logout()}>
               Cerrar sesión
              </ButtonLink>
            </li>
          </>
        ) : (
          <>
            <li>
              <ButtonLink to="/login">Iniciar sesión</ButtonLink>
            </li>
            {/* <li>
              <ButtonLink to="/register">Registrar</ButtonLink>
            </li> */}
          </>
        )}
      </ul>
    </nav>
  );
}
