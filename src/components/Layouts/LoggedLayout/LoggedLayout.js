import React, { useState } from 'react';
import "./LoggedLayout.scss";

import { LeftMenu } from "../LeftMenu";
import { TopBar } from "../TopBar";
import { Icon } from "semantic-ui-react";


export function LoggedLayout(props) {

  const { children } = props;
  const [show, setShow] = useState(true)

  const handleHiddenMenu = () => {
    setShow(show ? false : true);
  }

  return (
    <div className="logged-layout">
      <div className='logged-layout__content'>
          <div className='logged-layout__top-bar'>
            <TopBar/>
          </div>

          <div className='logged-layout__menu-children'>
            <div className='logged-layout__left-menu'>
              <LeftMenu/>
            </div> 

            <div className='logged-layout__children-content'>
              <div>{children}</div>
            </div>
          </div>
          

      </div>
    </div>
  )
}
