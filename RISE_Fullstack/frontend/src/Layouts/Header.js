import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Dropdown, DropdownMenu, DropdownToggle, Form } from 'reactstrap';
import { verifyToken } from '../Common/AuthToken';
const Header = () => {
    const [status, setStatus] = useState();
    const storedToken = localStorage.getItem('auth_token');
    const [userData, setUserData] = useState([]);

    useEffect(() => {
        async function fetchData() {
            try {
                let user = {
                    token: storedToken
                }
                let token_res = await verifyToken(user);
                setUserData([token_res?.data]);
                setStatus(token_res.status);
            } catch (error) {
                console.error('Error fetching data:', error);
            }
        }
        fetchData()
    }, [status, storedToken]);

    const logoutHandler = () => {
        localStorage.removeItem('auth_token');
        window.location.reload(false);
    }

    return (
        <React.Fragment>
            <header id="page-topbar" className='sticky-top'>
                <div className="navbar-header bg-dark">
                    <div className="px-4 py-3 text-light  d-flex justify-content-between">
                        <h4 className='fw-bold m-0'>RISE</h4>
                        {
                            userData ? <>
                                <div>
                                    <span className='me-2'>{userData[0]?.email ? userData[0]?.email : ""}</span>
                                    <svg className='me-3' xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24"><g transform="translate(24 0) scale(-1 1)"><g fill="none"><path stroke="currentColor" stroke-width="2" d="M21 12a8.958 8.958 0 0 1-1.526 5.016A8.991 8.991 0 0 1 12 21a8.991 8.991 0 0 1-7.474-3.984A9 9 0 1 1 21 12Z" /><path fill="currentColor" d="M13 9a1 1 0 0 1-1 1v2a3 3 0 0 0 3-3h-2Zm-1 1a1 1 0 0 1-1-1H9a3 3 0 0 0 3 3v-2Zm-1-1a1 1 0 0 1 1-1V6a3 3 0 0 0-3 3h2Zm1-1a1 1 0 0 1 1 1h2a3 3 0 0 0-3-3v2Zm-6.834 9.856l-.959-.285l-.155.523l.355.413l.759-.65Zm13.668 0l.76.651l.354-.413l-.155-.523l-.959.285ZM9 16h6v-2H9v2Zm0-2a5.002 5.002 0 0 0-4.793 3.571l1.917.57A3.002 3.002 0 0 1 9 16v-2Zm3 6a7.98 7.98 0 0 1-6.075-2.795l-1.518 1.302A9.98 9.98 0 0 0 12 22v-2Zm3-4c1.357 0 2.506.902 2.876 2.142l1.916-.571A5.002 5.002 0 0 0 15 14v2Zm3.075 1.205A7.98 7.98 0 0 1 12 20v2a9.98 9.98 0 0 0 7.593-3.493l-1.518-1.302Z" /></g></g></svg>
                                    <span className='cursor-pointer me-2' onClick={() => logoutHandler()}>Logout</span>
                                </div>
                            </> : null
                        }
                    </div>
                </div>
            </header>
        </React.Fragment >
    );
};

export default Header;