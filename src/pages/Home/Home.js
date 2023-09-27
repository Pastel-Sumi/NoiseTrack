import React, { useState } from 'react'
import { Select } from "semantic-ui-react";
import "./Home.scss";

import { Tracker, Decibels } from "../../components/Tracing";

const videoSources = [
  { key: 'video1', text: 'Video 1', value: 'http://localhost:8000/video' },
  { key: 'video2', text: 'Video 2', value: 'http://localhost:8001/video' },
];

export function Home() {

  const [selectedSource, setSelectedSource] = useState(videoSources[0].value);

  const handleVideoSourceChange = (event, { value }) => {
    setSelectedSource(value);
  };

  return (
    <div className='home-container'>
      <h1 className='home-container__title'>Seguimiento área de trabajo</h1>
      <div className='home-container__selector'>
        <div className='selector'>
          <p className='label-selector'>Seleccione un área de trabajo:</p>
          <Select
            id="video-source"
            options={videoSources}
            value={selectedSource}
            onChange={handleVideoSourceChange}
          />
          <img id="video-player" src={selectedSource} alt="Video" />
          <div style={{ width: '100', display: 'flex', justifyContent: 'center' }}>
          </div>
        </div>
      </div>
      <div className='home-container__body'>
        <Decibels/>
        <Tracker/> 
      </div>
      
    </div>

  )
}
