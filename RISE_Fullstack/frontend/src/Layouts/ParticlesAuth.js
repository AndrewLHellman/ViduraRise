import React from 'react';
import withRouter from '../Common/withRouter';

const ParticlesAuth = ({ children }) => {
    return (
        <React.Fragment>
            <div className="auth-page-wrapper pt-5">
                {/* pass the children */}
                {children}
                <footer className="footer">
                    <div className="container">
                        <div className="row">
                            <div className="col-lg-12">
                                <div className="text-center">
                                    <p className="mb-0 text-muted">&copy; {new Date().getFullYear()} All rights reserved <i className="mdi mdi-heart text-danger"></i> by RISE</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </footer>
            </div>
        </React.Fragment>
    );
};

export default withRouter(ParticlesAuth);