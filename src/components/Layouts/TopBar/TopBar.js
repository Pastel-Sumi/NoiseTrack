import React, { useEffect, useState } from 'react'
import { Icon, Image, Button } from "semantic-ui-react";
import { Link, useNavigate } from "react-router-dom";
import { onSnapshot, collection, orderBy, query, where } from "firebase/firestore";
import { bd } from "../../../config";

import "./TopBar.scss";
import { Auth } from "../../../api"

//images
import { logoSF } from "../../../assets"

const auth = new Auth();

export function TopBar() {

  let alerts = [];
  //let [numAlerts, setNumAlerts]= useState(0);
  let numAlerts = 0;
  const [newAlert, setNewAlert] = useState(false);
  const [contAlert, setContAlert] = useState(0);
  const navigate = useNavigate();

  useEffect( () =>  {
    var startOfToday = new Date(); 
    startOfToday.setHours(0,0,0,0);
    const q = query(collection(bd, "alerts"), where("created", ">=", startOfToday), orderBy("created","desc"));
    // Create the DB listener
    getAlert(q)
  });

  const handleGoAlert = () => {
    setContAlert(0);
    setNewAlert(false);
    navigate("/alert");
  };

  const getAlert = async (query) => {
    const unsuscribe = await onSnapshot(query, (doc) => {
      if(alerts.length === 0){
        for(let i=0; i < doc.docs.length; i++){
          alerts.push(doc.docs[i].id)
        }
      }else{
          numAlerts += (doc.docs.length - alerts.length);
          setContAlert(numAlerts)
          setNewAlert(true)
          alerts.push(doc.docs[doc.docs.length-1].id)
      } 
  });
    return () => {
        unsuscribe();
    }
  }

  return (
    <div className='top-bar'>

        <div className='top-bar__content'>

            <div className='home'>
                <Image className='logo' src={logoSF} as={Link} to="/"/> 
                <p className='typo'>NoiseTrack</p>
            </div>

            <div className='info'> 
              <Button icon onClick={handleGoAlert}>
                <Icon className='icon-bell' name={`bell${newAlert ? "" : " outline"}`}/>
              </Button>

              <p className='num-alert' as={Link} to="/alert">{contAlert}</p>
              <div className='logout' onClick={auth.logout}>
                  <Icon className='icon' name='log out'/>                  
                  <p className='button'>Cerrar sesión</p>
              </div>
            </div>
            
        </div>
    </div>
  )
}
