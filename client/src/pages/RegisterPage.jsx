import { useEffect } from "react";
import { useAuth } from "../context/authContext";
import { Link, useNavigate } from "react-router-dom";
import { Card, Message, Button, Input, Label } from "../components/ui";
import { useForm } from "react-hook-form";
import { registerSchema } from "../schemas/auth";
import { zodResolver } from "@hookform/resolvers/zod";

import logoSF from "../assets/logoSF.png"

function Register() {
  const { signup, errors: registerErrors, isAuthenticated } = useAuth();
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(registerSchema),
  });
  const navigate = useNavigate();

  const onSubmit = async (value) => {
    await signup(value);
  };

  useEffect(() => {
    if (isAuthenticated) navigate("/dashboard");
  }, [isAuthenticated]);

  return (
    <div className="h-[calc(100vh-100px)] flex items-center justify-center">
      <Card>
        {registerErrors.map((error, i) => (
          <Message message={error} key={i} />
        ))}

        <div className="flex justify-center">
          <img width={100} height={100} fill="none" src={logoSF}/>
        </div>

        <p className="flex justify-center">
          <h1 className="text-4xl font-bold">Registro</h1>
        </p>
        
        <br></br>
        <form onSubmit={handleSubmit(onSubmit)}>
          <Input
            label="Ingresa tu nombe y apellido"
            type="text"
            name="username"
            placeholder="Nombre y apellido"
            {...register("username")}
            autoFocus
          />
          <p className="text-red-500">{errors.username?.message}</p>

          {!errors.username?.message && <br/>}
          <Input
            label="Ingresa tu correo electrónico"
            name="email"
            placeholder="Correo electrónico"
            {...register("email")}
          />
            <p className="text-red-500">{errors.email?.message}</p>

          {!errors.email?.message && <br/>}
          <Input
            label="Ingresa tu contraseña"
            type="password"
            name="password"
            placeholder="Contraseña"
            {...register("password")}
          />
          
          <p className="text-red-500">{errors.password?.message}</p>
          
          {!errors.password?.message && <br/>}
          <Input
            label="Ingresa nuevamente tu contraseña"
            type="password"
            name="confirmPassword"
            placeholder="Confirmar contraseña"
            {...register("confirmPassword")}
          />
          <p className="text-red-500">{errors.confirmPassword?.message}</p>

          {!errors.confirmPassword?.message && <br/>}
          <p className="flex justify-center">
            <Button>Enviar</Button>
          </p>
          
        </form>
        <p className="flex gap-x-2 justify-center">
          <Link className="text-sky-500" to="/login">¿Ya tienes una cuenta?</Link>
        </p>
      </Card>
    </div>
  );
}

export default Register;
