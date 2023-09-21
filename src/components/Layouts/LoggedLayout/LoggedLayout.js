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
            <Icon className='top-bar__menu' name="content" onClick={handleHiddenMenu}/>
            <TopBar/>
          </div>

          <div className={`${show ? 'translate-x-0' : 'translate-x-220'} logged-layout__left-menu`}>
            <LeftMenu/>
          </div> 

          <div className={`logged-layout__children-content${show ? '__translate-children-x-0' : '__translate-children-x-220'} `}>
            <div>{children}</div>
          </div>

      </div>
    </div>
  )
}
