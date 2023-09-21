import React, { useState } from 'react'
import { AuthOptions, RegisterForm, LoginForm } from "../../components/Auth";
import { Image } from 'semantic-ui-react';
import "./Auth.scss"

//images
import { logoSF } from "../../assets"

export function Auth() {
    const [typeForm, setTypeForm] = useState(null);

    const openLogin = () => setTypeForm("login");
    const openRegister = () => setTypeForm("register");
    const goBack = () => setTypeForm(null);

    const renderForm = () => {
        if(typeForm === "login"){
            return <LoginForm openRegister={openRegister} goBack={goBack}/>
        }
        if(typeForm === "register"){
            return <RegisterForm openLogin={openLogin} goBack={goBack}/>
        }

       return <LoginForm openLogin={openLogin} openRegister={openRegister}/> 
    }
    return (
        <div className='auth'>
            <div className='auth__content'>
                <Image 
                    src={logoSF}
                    alt='LogoLogIn'
                    className='auth__content-logo'
                    /> 
                {renderForm()}
            </div>
        </div>
    )
}
