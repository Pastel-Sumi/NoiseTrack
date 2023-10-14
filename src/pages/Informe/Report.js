import React from 'react';

import { Reports } from "../../api";
import { InfoReport } from "../../components/Report";
import "./Report.scss";

const reportController = new Reports();

export function Report() {
  
  return ( 
    <div className='report-container'>
      <h1 className='report-container__title'>Informes</h1>
      <div className='report-container__body'>
        <InfoReport/>
      </div>
    </div>
  )
}
