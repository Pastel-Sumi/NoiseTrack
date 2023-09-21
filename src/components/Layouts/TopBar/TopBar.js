import React from 'react'
import { Icon, Image } from "semantic-ui-react";
import { Link } from "react-router-dom";
import "./TopBar.scss";
import { Auth } from "../../../api"

//images
import { logoSF } from "../../../assets"

const auth = new Auth();

export function TopBar() {
  return (
    <div className='top-bar'>

        <div className='top-bar__content'>

            <div className='home'>
                <Image className='logo' src={logoSF} as={Link} to="/"/> 
                <p className='typo'>NoiseTrack</p>
            </div>

            <div className='logout' onClick={auth.logout}>
                <Icon className='icon' name='log out'/>
                <p className='button'>Cerrar sesión</p>
            </div>
        </div>
    </div>
  )
}
