import React,{useState} from "react";
import { useAuth } from "../context/authContext";
import { Link } from "react-router-dom";

//Icons
import logoSF from "../assets/logoSF.png"
import { ButtonExit } from "./ui/ButtonExit";

//Components
import Tracker from "./dashboard/tracker";
import Report from "./dashboard/report";
import Alert from "./dashboard/alert";
import Config from "./dashboard/config";

export function Navbar() {
    //Carga datos de usuario
    const { isAuthenticated, logout, user } = useAuth();

    let menuArray = [true, false, false];
    const [menu, setMenu] = useState(menuArray);
    const [show, setShow] = useState(true);

    const [screen, setScreen] = useState({
        monitoring:true,
        report:false,
        alert:false,
        config:false,
    })

    const setMenuValue = (props) => {
        let newArr = [...menu];
        newArr[props] = !newArr[props];
        setMenu(newArr);
    }

    const handleShow = (type) => {
        switch (type){
            case 1:
                setScreen({monitoring:true,report:false,alert:false,config:false})
                break;
            case 2:
                setScreen({monitoring:false,report:true,alert:false,config:false})
                break;
            case 3:
                setScreen({monitoring:false,report:false,alert:true,config:false})
                break;
            case 4:
                setScreen({monitoring:false,report:false,alert:false,config:true})
                break;
            default:
                setScreen({monitoring:true,report:false,alert:false,config:false})
                break;
        }
    }

    return (
        <div className="content-container">
            <div className="bg-gray-900 flex justify-between w-full p-6 items-center">
                <div className="flex justify-start items-center space-x-3">
                    
                    <div aria-label="toggler" className="flex justify-center items-center ">
                        <button aria-label="close" id="close"onClick={()=>setShow(show ? false: true)} className="focus:outline-none focus:ring-2">
                        <svg width={24} height={24} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                <path d="M4 6H20" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                                <path d="M4 12H20" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                                <path d="M4 18H20" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                            </svg>
                        </button>
                    </div>

                    <div className="flex justify-between  items-center space-x-3">
                        <img width={65} height={65} fill="none" src={logoSF}/>
                        <Link to={isAuthenticated ? "/dashboard" : "/"}>
                            <p className="text-2xl leading-6 text-white">NoiseTrack</p>
                        </Link>
                    </div>
                </div>

                <div className="flex justify-between  items-center space-x-3">
                    <svg xmlns="http://www.w3.org/2000/svg" width={24} height={24} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M22 17H2a3 3 0 0 0 3-3V9a7 7 0 0 1 14 0v5a3 3 0 0 0 3 3zm-8.27 4a2 2 0 0 1-3.46 0"/>
                    </svg>
                    
                   
                    <ButtonExit onClick={() => logout()}>Cerrar sesión</ButtonExit>
                </div>
                
            </div>
             
            <div className="flexbox-container">
                <div id="Main" className={`${show ? 'translate-x-0' : '-translate-x-full'} xl:rounded-r transform ease-in-out transition duration-500 flex justify-start items-start h-full  w-full sm:w-64 bg-gray-900 flex-col`}>
                    <div className="mt-6 flex flex-col justify-start items-center  pl-4 w-full border-gray-600 border-b space-y-3 pb-5 ">
                        <button onClick={() => handleShow(1)} className="flex jusitfy-start items-center space-x-6 w-full  focus:outline-none  focus:text-indigo-400  text-white rounded ">
                            <svg className="fill-stroke " width={24} height={24} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                <path d="M9 4H5C4.44772 4 4 4.44772 4 5V9C4 9.55228 4.44772 10 5 10H9C9.55228 10 10 9.55228 10 9V5C10 4.44772 9.55228 4 9 4Z" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                                <path d="M19 4H15C14.4477 4 14 4.44772 14 5V9C14 9.55228 14.4477 10 15 10H19C19.5523 10 20 9.55228 20 9V5C20 4.44772 19.5523 4 19 4Z" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                                <path d="M9 14H5C4.44772 14 4 14.4477 4 15V19C4 19.5523 4.44772 20 5 20H9C9.55228 20 10 19.5523 10 19V15C10 14.4477 9.55228 14 9 14Z" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                                <path d="M19 14H15C14.4477 14 14 14.4477 14 15V19C14 19.5523 14.4477 20 15 20H19C19.5523 20 20 19.5523 20 19V15C20 14.4477 19.5523 14 19 14Z" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                            </svg>
                            <p className="text-base leading-4 ">Monitoreo</p>
                        </button>
                    </div>
                    <div className="flex flex-col justify-start items-center px-6 border-b border-gray-600 w-full  ">
                        <button onClick={()=>setMenuValue(0)} className="focus:outline-none focus:text-indigo-400  text-white flex justify-between items-center w-full py-3 space-x-14  ">
                            <p className="text-sm leading-5  uppercase">Menu</p>
                            <svg id="icon1" className={`${menu[0] ? '' : 'rotate-180'} transform duration-100`} width={24} height={24} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                <path d="M18 15L12 9L6 15" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                            </svg>
                        </button>
                        <div id="menu1" className={`${menu[0] ? 'flex' : 'hidden'} justify-start  flex-col w-full md:w-auto items-start pb-1 `}>
                            <button onClick={() => handleShow(3)} className="flex justify-start items-center space-x-6 hover:text-white focus:bg-gray-700 focus:text-white hover:bg-gray-700 text-gray-400 rounded px-3 py-2  w-full md:w-52">
                                <svg xmlns="http://www.w3.org/2000/svg" width={24} height={24} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                                    <path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"/>
                                    <line x1="12" y1="9" x2="12" y2="13"/>
                                    <line x1="12" y1="17" x2="12.01" y2="17"/>
                                </svg>
                                <p className="text-base leading-4">Alertas</p>
                            </button>
                            <button onClick={() => handleShow(2)} className="flex justify-start items-center space-x-6 hover:text-white focus:bg-gray-700 focus:text-white hover:bg-gray-700 text-gray-400 rounded px-3 py-2  w-full md:w-52">
                                <svg  width={24} height={24} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                    <path d="M14 2H6a2 2 0 0 0-2 2v16c0 1.1.9 2 2 2h12a2 2 0 0 0 2-2V8l-6-6z" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                                    <path d="M14 3v5h5M16 13H8M16 17H8M10 9H8" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                                </svg>
                                <p className="text-base leading-4">Reportes</p>
                            </button>
                            <button onClick={() => handleShow(4)} className="flex justify-start items-center space-x-6 hover:text-white focus:bg-gray-700 focus:text-white hover:bg-gray-700 text-gray-400 rounded px-3 py-2 w-full md:w-52">
                                <svg width={24} height={24} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                    <path d="M14 8.00002C15.1046 8.00002 16 7.10459 16 6.00002C16 4.89545 15.1046 4.00002 14 4.00002C12.8954 4.00002 12 4.89545 12 6.00002C12 7.10459 12.8954 8.00002 14 8.00002Z" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                                    <path d="M4 6H12" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                                    <path d="M16 6H20" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                                    <path d="M8 14C9.10457 14 10 13.1046 10 12C10 10.8954 9.10457 10 8 10C6.89543 10 6 10.8954 6 12C6 13.1046 6.89543 14 8 14Z" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                                    <path d="M4 12H6" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                                    <path d="M10 12H20" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                                    <path d="M17 20C18.1046 20 19 19.1046 19 18C19 16.8955 18.1046 16 17 16C15.8954 16 15 16.8955 15 18C15 19.1046 15.8954 20 17 20Z" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                                    <path d="M4 18H15" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                                    <path d="M19 18H20" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                                </svg>
                                <p className="text-base leading-4">Configuración</p>
                            </button>
                        </div>
                    </div>                
                    
                    <div className="flex flex-col justify-end items-center h-full pb-6 w-full space-y-32">
                        <div className=" flex justify-between items-center w-full">
                            <div className="flex justify-center items-center space-x-2">
                                <div className="avatar" id='openMenu'>
                                    {user.username.charAt(0).toLowerCase()}
                                </div>

                                <div className="flex justify-start flex-col items-start">
                                    <p className="cursor-pointer text-sm leading-5 text-white">{user.username}</p>
                                    <p className="cursor-pointer text-xs leading-3 text-gray-300">{user.email}</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                <div className={`${show ? 'translate-x-0' : 'translate-x-[-150px]'}  xl:rounded-r transform ease-in-out transition duration-500 video-container`}>
                    {screen.monitoring && <Tracker/>}
                    {screen.alert && <Alert/>}
                    {screen.report && <Report/>}
                    {screen.config && <Config/>}
                </div>
            </div>
        </div>
    );
}
