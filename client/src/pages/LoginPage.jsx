import { useAuth } from "../context/authContext";
import { Link, useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { useEffect } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { Card, Message, Button, Input, Label } from "../components/ui";
import { loginSchema } from "../schemas/auth";

export function LoginPage() {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(loginSchema),
  });
  const { signin, errors: loginErrors, isAuthenticated } = useAuth();
  const navigate = useNavigate();

  const onSubmit = (data) => signin(data);

  useEffect(() => {
    if (isAuthenticated) {
      navigate("/dashboard");
    }
  }, [isAuthenticated]);

  return (
    <div className="h-[calc(100vh-100px)] flex items-center justify-center">
      <Card>
        {loginErrors.map((error, i) => (
          <Message message={error} key={i} />
        ))}
        
        <div className="flex justify-center">
          <h1 className="text-2xl font-bold ">Inicio de sesión</h1>
        </div>

        <form onSubmit={handleSubmit(onSubmit)}>
          <Label htmlFor="email">Correo:</Label>
          <Input
            label="Ingresa tu correo electrónico"
            type="email"
            name="email"
            placeholder="youremail@domain.tld"
            {...register("email", { required: true })}
          />
          <p>{errors.email?.message}</p>

          <Label htmlFor="password">Contraseña:</Label>
          <Input
            type="password"
            name="password"
            placeholder="Ingresa tu contraseña"
            {...register("password", { required: true, minLength: 6 })}
          />
          <p>{errors.password?.message}</p>

          <div className="flex justify-center">
            <Button>Iniciar sesión</Button>
          </div>

          
          
        </form>

        <p className="flex gap-x-2 justify-center">
          <Link to="/register" className="text-sky-500">¿Olvidaste tu contraseña?</Link>
        </p>
        <p className="flex gap-x-2 justify-center">
          <Link to="/register" className="text-sky-500">¿No tienes una cuenta?</Link>
        </p>
        
      </Card>
    </div>
  );
}
