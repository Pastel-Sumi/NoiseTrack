import React, { useState } from 'react';
import { Link, useLocation } from "react-router-dom";
import { Menu, Accordion, Icon } from "semantic-ui-react"
import "./LeftMenu.scss";

export function LeftMenu() {

  const [activeIndex, setActiveIndex] = useState(0)
  const {pathname} = useLocation();

  const handleShowMenu = (e, titleProps) => {
    const { index } = titleProps
    const newIndex = activeIndex === index ? -1 : index

    setActiveIndex(newIndex)
  }

  const isCurrentPage = (route) => {
    console.log("---------------")
    console.log(route)
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
              name='Reportes'
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
          N
        </div>

        <div className='left-menu__user-info'>
            <p>Nombre usuario</p>
            <p>Nombre empresa</p>
            <p>Email</p>
        </div>
      
      </div>

    </div>
  )
}