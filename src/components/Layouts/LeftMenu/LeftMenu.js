import React, { useState } from 'react';
import { Link, useLocation } from "react-router-dom";
import { Menu, Accordion, Icon } from "semantic-ui-react"
import { User } from "../../../api"
import "./LeftMenu.scss";

const user = new User();

export function LeftMenu() {

  const [activeIndex, setActiveIndex] = useState(0)
  const {pathname} = useLocation();
  const userData = user.getMe();

  const displayName = userData.displayName || "Mi cuenta";
  const email = userData.email || "Correo electronico";

  const handleShowMenu = (e, titleProps) => {
    const { index } = titleProps
    const newIndex = activeIndex === index ? -1 : index

    setActiveIndex(newIndex)
  }

  const isCurrentPage = (route) => {
    return route === pathname
  }

  return (
    <div className='left-menu'>
      <Menu secondary vertical fluid>
        <Menu.Item
          as={Link} to="/"
          name='Monitoreo'
          icon="th large"
          active={isCurrentPage("/")}
        />

       <div className='left-menu__menu-devider'/> 

        <Accordion className='left-menu__menu-accordion'>
          <Accordion.Title 
            className="title"
            active={activeIndex === 0}
            index={0}
            onClick={handleShowMenu}
          >
            MENU
            <Icon name={activeIndex === 0 ? 'angle down':'angle up'}/>
          </Accordion.Title>
          <Accordion.Content active={activeIndex === 0}>
            <Menu.Item
              as={Link} to="/alert"
              name='Alertas'
              icon="exclamation triangle"
              active={isCurrentPage("/alert")}
            />
            <Menu.Item
              as={Link} to="/report"
              name='Informes'
              icon="file alternate outline"
              active={isCurrentPage("/report")}
            />
            <Menu.Item
              as={Link} to="/config"
              name='Configuración'
              icon="cog"
              active={isCurrentPage("/config")}
            />
          </Accordion.Content>
        </Accordion>

        <div className='left-menu__menu-devider'/> 
      </Menu>

      <div className='left-menu__user'>
        <div className='left-menu__avatar'>
          {displayName.charAt(0).toLowerCase()}
        </div>

        <div className='left-menu__user-info'>
            <p>{displayName}</p>
            <p>{email}</p>
        </div>
      
      </div>

    </div>
  )
}
