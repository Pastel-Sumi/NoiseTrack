import React from 'react'
import { Image } from 'semantic-ui-react'

export function Tracker(props) {

  const {selectedSource} = props;
  console.log(selectedSource);
  return (
    <div className='tracker'>
      <h1>Video tracker</h1>
      <Image id="video-player" src={selectedSource} alt="Video" />
    </div>
  )
}
