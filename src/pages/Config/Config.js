import React from 'react';
import "./Config.scss";

import { Configuration } from "../../components/Config"

export function Config() {

  return (
    <div className='config-container'>
      <h1 className='config-container__title'>Panel de configuraciones</h1>
      <div className='config-container__body'>
        <Configuration/>
      </div>
    </div>
  )
}
