import React from 'react';
import { Link } from 'react-router-dom';

import { withTranslation } from "react-i18next";
import withRouter from '../../Common/withRouter';

const VerticalLayout = (props) => {
    return (
        <React.Fragment>
            {/* menu Items */}
            <li class="list-group-item border-0 p-0">
                <Link to="/daskboard" className='text-decoration-none' >
                    <div class={`alert ${window.location.pathname === "/daskboard" ? "alert-primary" : "alert-light"}`} role="button">
                        <div className='d-flex align-items-center'>
                            <svg className='me-3' xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24">
                                <path fill="currentColor" d="M3 3h8v8H3V3Zm10 0h8v8h-8V3ZM3 13h8v8H3v-8Zm13 0h2v3h3v2h-3v3h-2v-3h-3v-2h3v-3Z" />
                            </svg>
                            <span className='fw-semibold'>Dashboard</span>
                        </div>
                    </div>
                </Link>
            </li>
            <li class="list-group-item border-0 p-0">
                <Link to="/instruments" className='text-decoration-none' >
                    <div class={`alert ${window.location.pathname === "/instruments" ? "alert-primary" : "alert-light"}`} role="button">
                        <div className='d-flex align-items-center'>
                            <svg className='me-3' xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24">
                                <g transform="translate(24 0) scale(-1 1)"><g fill="none" fill-rule="evenodd"><path d="M24 0v24H0V0h24ZM12.593 23.258l-.011.002l-.071.035l-.02.004l-.014-.004l-.071-.035c-.01-.004-.019-.001-.024.005l-.004.01l-.017.428l.005.02l.01.013l.104.074l.015.004l.012-.004l.104-.074l.012-.016l.004-.017l-.017-.427c-.002-.01-.009-.017-.017-.018Zm.265-.113l-.013.002l-.185.093l-.01.01l-.003.011l.018.43l.005.012l.008.007l.201.093c.012.004.023 0 .029-.008l.004-.014l-.034-.614c-.003-.012-.01-.02-.02-.022Zm-.715.002a.023.023 0 0 0-.027.006l-.006.014l-.034.614c0 .012.007.02.017.024l.015-.002l.201-.093l.01-.008l.004-.011l.017-.43l-.003-.012l-.01-.01l-.184-.092Z" /><path fill="currentColor" d="M15.682 3.282a2 2 0 0 1 2.701-.116l.127.116l.707.708a2 2 0 0 1 .117 2.7l-.116.128l-.708.707a2.007 2.007 0 0 1-.194.17a2 2 0 0 1-.397 1.826l-.116.125l-.99.99A6.485 6.485 0 0 1 19 15.5c0 1.644-.61 3.145-1.616 4.29l-.194.21H20a1 1 0 0 1 .117 1.993L20 22H4a1 1 0 0 1-.117-1.993L4 20h8.5a4.5 4.5 0 0 0 3.075-7.786l-.18-.16l-3.249 3.25a2 2 0 0 1-2.7.116l-.128-.117l-2.121-2.121a2 2 0 0 1-.117-2.701l.117-.127l5.657-5.657a2 2 0 0 1 1.95-.513l.082-.1l.089-.094l.707-.708ZM6.49 13.89l2.12 2.121a1 1 0 1 1-1.413 1.415l-2.122-2.122A1 1 0 1 1 6.49 13.89Zm10.606-9.192l-.707.707l.707.707l.707-.707l-.707-.707Z" /></g></g>
                            </svg>
                            <span className='fw-semibold'>Instruments</span>
                        </div>
                    </div>
                </Link>
            </li>
            <li class="list-group-item border-0 p-0">
                <Link to="/projects" className='text-decoration-none' >
                    <div class={`alert ${window.location.pathname === "/projects" ? "alert-primary" : "alert-light"}`} role="button">
                        <div className='d-flex align-items-center'>
                            <svg className='me-3' xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 1024 1024">
                                <g transform="rotate(180 512 512)"><path fill="currentColor" d="M880 112H144c-17.7 0-32 14.3-32 32v736c0 17.7 14.3 32 32 32h736c17.7 0 32-14.3 32-32V144c0-17.7-14.3-32-32-32zM368 744c0 4.4-3.6 8-8 8h-80c-4.4 0-8-3.6-8-8V280c0-4.4 3.6-8 8-8h80c4.4 0 8 3.6 8 8v464zm192-280c0 4.4-3.6 8-8 8h-80c-4.4 0-8-3.6-8-8V280c0-4.4 3.6-8 8-8h80c4.4 0 8 3.6 8 8v184zm192 72c0 4.4-3.6 8-8 8h-80c-4.4 0-8-3.6-8-8V280c0-4.4 3.6-8 8-8h80c4.4 0 8 3.6 8 8v256z" /></g>
                            </svg>
                            <span className='fw-semibold'>Projects</span>
                        </div>
                    </div>
                </Link>
            </li>
            <li class="list-group-item border-0 p-0">
                <Link to="/storage" className='text-decoration-none' >
                    <div class={`alert ${window.location.pathname === "/storage" ? "alert-primary" : "alert-light"}`} role="button">
                        <div className='d-flex align-items-center'>
                            <svg className='me-3' xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24">
                                <g transform="rotate(180 12 12)"><path fill="currentColor" d="M2 20h20v-4H2v4zm2-3h2v2H4v-2zM2 4v4h20V4H2zm4 3H4V5h2v2zm-4 7h20v-4H2v4zm2-3h2v2H4v-2z" /></g>
                            </svg>
                            <span className='fw-semibold'>Storage</span>
                        </div>
                    </div>
                </Link>
            </li>
        </React.Fragment>
    );
};

export default withRouter(withTranslation()(VerticalLayout));
