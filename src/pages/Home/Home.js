import React from 'react'
import { Button } from "semantic-ui-react";

import { Measurement } from "../../api";

const measurement = new Measurement();

export function Home() {

  const handleMeasurement = async () => {
    try{
      await measurement.getDecibels();
    }catch(error){
      console.error(error);
    }
  }

  return (
    <div>
      <h1>Home Screen</h1>
      <Button primary onClick={handleMeasurement}>Decibeles</Button>
    </div>
  )
}
