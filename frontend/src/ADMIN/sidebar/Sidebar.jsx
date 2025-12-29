import React, { useState, useRef, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { sidebarData } from './sidebarData';
import './sidebar.css';
import {
  AiFillHome,
  AiOutlineBook,
  AiOutlinePlus,
  AiOutlineSolution,
  AiOutlineUser,
  AiOutlineCheckCircle,
  AiOutlineUpload,
  AiOutlineClockCircle,
  AiOutlineLogout,
  AiOutlineMenu, // Hamburger Menu Icon
  AiOutlineClose, // Close Icon
} from 'react-icons/ai';
import { MdOutlineManageAccounts } from "react-icons/md";

const Sidebar = () => {
  const location = useLocation();
  const [isOpen, setIsOpen] = useState(false);
  const overlayRef = useRef(null);
  const sidebarRef = useRef(null);

  const toggleSidebar = () => {
    setIsOpen(!isOpen);
  };

  const handleClickOutside = (event) => {
    if (sidebarRef.current && !sidebarRef.current.contains(event.target) && isOpen) {
      setIsOpen(false);
    }
  };

  useEffect(() => {
    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    } else {
      document.removeEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isOpen]);

  return (
    <>
      <div className={`sidebar-overlay ${isOpen ? 'open' : ''}`} ref={overlayRef} onClick={toggleSidebar}></div>
      <nav className={`sidebar ${isOpen ? 'open' : ''}`} ref={sidebarRef}>
        <ul className="nav flex-column">
          {sidebarData.map((panelItem) => {
            let icon;
            switch (panelItem.id) {
              case 1:
                icon = <AiFillHome className='icon' />;
                break;
              case 2:
                icon = <AiOutlineBook className='icon' />;
                break;
              case 3:
                icon = <AiOutlinePlus className='icon' />;
                break;
              case 4:
                icon = <AiOutlineSolution className='icon' />;
                break;
              case 5:
                icon = <AiOutlineUser className='icon' />;
                break;
              case 6:
                icon = <AiOutlineCheckCircle className='icon' />;
                break;
              case 7:
                icon = <AiOutlineUpload className='icon' />;
                break;
              case 8:
                icon = <AiOutlineClockCircle className='icon' />;
                break;
              case 9:
                icon = <MdOutlineManageAccounts/>;
                break;
              case 10:
                icon = <AiOutlineLogout className='icon' />;
                break;
              default:
                icon = null;
            }

            return (
              <li className='nav-item sidebar-nav-item' key={panelItem.id}>
                <Link
                  to={panelItem.url}
                  className={`nav-link sidebar-nav-link ${location.pathname === panelItem.url ? 'active' : ''}`}
                >
                  {icon}
                  {panelItem.title}
                </Link>
              </li>
            );
          })}
        </ul>
      </nav>
      {/* Toggle Button */}
      <div className="sidebar-toggle-button" onClick={toggleSidebar}>
        {isOpen ? <AiOutlineClose className="toggle-icon" /> : <AiOutlineMenu className="toggle-icon" />}
      </div>
    </>
  );
};

export default Sidebar;