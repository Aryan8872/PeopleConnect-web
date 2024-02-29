import React, { useState } from 'react'
import "./leftbar.css"
import { sidebarLinks } from '@/constants'
import { Link, useNavigate } from 'react-router-dom'
import Modal from '../EventsLeftbar/EventModal'


const Leftbar = () => {
    const navigate = useNavigate()
    const Logout = ()=>{
        localStorage.clear()
        navigate("/login")
        window.location.reload();
    }

    

    return (
        <>
            <div className="left-bar">
                <div className="left-bar-container">
                    <div className="left-bar-menu">
                        <div className="left-bar-user">
                            <img
                                src=""
                                alt="user image"
                            />
                            <span>Aryan</span>
                        </div>
                        {sidebarLinks.map((link, key) => (
                            <Link to={link.route} key={key} style={{ textDecoration: "none", color: "black" }}  >
                                <div key={key} className='left-bar-item'>
                                    <img src={link.imgURL}></img>
                                    <span>{link.label}</span>
                                </div>
                            </Link>


                        )
                        )}



                    </div>
                    <hr />
                    <div className="left-bar-menu">
                        <span>Your shortcuts</span>
                        <div className="left-bar-item">
                            <img src="/assets/icons/darktheme.png" alt="events icon" />
                            <span>Dark mode</span>
                        </div>

                        <div className="left-bar-item" onClick={()=>{Logout()}}>
                            <img src="/assets/icons/logout.png" alt="events icon" />
                            <span>Logout</span>
                        </div>


                    </div>
                    <hr />

                </div>
            </div>


            

        </>




    )
}

export default Leftbar