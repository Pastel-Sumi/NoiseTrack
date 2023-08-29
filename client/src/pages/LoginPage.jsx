import { useAuth } from "../context/authContext";
import { Link, useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { useEffect } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { Card, Message, Button, Input, Label } from "../components/ui";
import { loginSchema } from "../schemas/auth";
import { Chart } from "../components/Chart";

import logoSF from "../assets/logoSF.png"

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

  const onSubmit = (data) => {console.log("sumit")
  signin(data)};

  useEffect(() => {
    if (isAuthenticated) {
      
      navigate("/dashboard");
    }
  }, [isAuthenticated]);

  return (
    <div className="h-[calc(111vh-100px)] flex items-center justify-center">
      <Card>
        {loginErrors.map((error, i) => (
          <Message message={error} key={i} />
        ))}

        <div className="flex justify-center">
          <img width={100} height={100} fill="none" src={logoSF}/>
        </div>
        
        <div className="flex justify-center">
          <h1 className="text-4xl font-bold ">Bienvenido</h1>
        </div>

        <br/>

        <div className="flex justify-center"><h2 className="text-2l">Sistema de monitoreo de riesgos auditivos en </h2></div>
        <div className="flex justify-center"><h2 className="text-2l">trabajadores expuestos a altos niveles de ruidos </h2></div>

        <br></br>

        <form onSubmit={handleSubmit(onSubmit)}>
          <Input
            label="Ingresa tu correo electrónico"
            type="email"
            name="email"
            placeholder="Correo electrónico"
            {...register("email", { required: true })}
          />
          <p className="text-red-500">{errors.email?.message}</p>

          {!errors.email?.message && <br/>}
          <Input
            label="Ingresa tu contraseña"
            type="password"
            name="password"
            placeholder="Contraseña"
            {...register("password", { required: true, minLength: 6 })}
          />
          <p className="text-red-500">{errors.password?.message}</p>

          {!errors.password?.message && <br/>}
          <div className="flex justify-center">
            <Button>Iniciar sesión</Button>
          </div> 
        </form>

        {/* <p className="flex gap-x-2 justify-center">
          <Link to="/register" className="text-sky-500">¿Olvidaste tu contraseña?</Link>
        </p> */}
        <p className="flex gap-x-2 justify-center">
          <Link to="/register" className="text-sky-500">¿No tienes una cuenta?</Link>
        </p>
        
      </Card>
      <Chart />
    </div>
  );
}
