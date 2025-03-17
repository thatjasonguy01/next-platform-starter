import $ from 'jquery';
import Script from 'next/script';
import { Components  } from 'components/components';
import { Settings  } from 'components/settings';
import Handlebars from 'handlebars';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faSave, faPen, faXmark, faAlignLeft, faAlignRight, faAlignCenter } from '@fortawesome/free-solid-svg-icons'

export function PageBuilder({ title, text, linkText, href, children }) {
    return (
        <div>
            <Script src="https://rawgit.com/components/handlebars.js/master/handlebars.js" strategy="afterInteractive" />
            <Script src="scripts/handlebarsHelpers.js" strategy="afterInteractive" />
            <Script src="scripts/pagebuilder.js" strategy="afterInteractive" />
            <section>
                <div id="pageBuilder">
                    <div id="navMain">
                        <div id="pnlPreview" className="panel">
                            <nav className="navbar navbar-expand-lg navbar-dark bg-dark">
                                <div className="container-fluid">
                                    <div>
                                        <div className="dropdown">
                                            <div className="btn-group mr-2">
                                                <button className="dropdown-toggle" type="button" data-bs-toggle="dropdown" aria-expanded="false">
                                                    My First Site
                                                </button>
                                                <ul className="dropdown-menu">
                                                    <li><a className="dropdown-item" href="#">My Other Site</a></li>
                                                </ul>
                                            </div>
                                        </div>
                                        <div className="dropdown">
                                            <button className="dropdown-toggle" type="button" data-bs-toggle="dropdown" aria-expanded="false">
                                                <span className="badge text-bg-primary">DEV01</span>
                                            </button>
                                            <ul className="dropdown-menu">
                                                <li><h6 className="dropdown-header">Environments</h6></li>
                                                <li><a className="dropdown-item" href="#">My Other Site</a></li>
                                                <li><hr className="dropdown-divider" /></li>
                                                <li><a className="dropdown-item" href="#">Create New Site</a></li>
                                            </ul>
                                        </div>
                                    </div>
                                </div>
                            </nav>                            
                        </div>
                        <div id="pnlEdit" className="panel"></div>
                    </div>
                    <div id="pnlWrapper">



                        
                        <div id="pnlDesigner" className="admin">
                                <nav id="navTabsDesigner"><button className="btn btn-sm" data-target="#pnlComponents">Components</button><button className="btn btn-sm"  data-target="#pnlSettings">Settings</button></nav>

                            <Components></Components>
                            <Settings></Settings>
                        </div>
                        <div id="canvasWrapper" className="panel">
                            <div className="btn-toolbar" role="toolbar" aria-label="Toolbar with button groups">
                                <div id="navPreviewSize" className="btn-group me-2" role="group" aria-label="First group">
                                    <button type="button" className="btn btn-sm" data-width="390px" data-size="xs" data-height="844px" data-minwidth="" data-value="390x844" data-title="mobile and up"><i className="fa-solid fa-mobile-screen"></i></button>
                                    <button type="button" className="btn btn-sm" data-width="769px" data-size="md" data-height="1024px" data-minwidth="" data-value="769x1024" data-title="tablets and up"><i className="fa-solid fa-tablet-screen-button"></i></button>
                                    <button type="button" className="btn btn-sm" data-width="100%" data-height="100%" data-minwidth="1200" data-value="1024x768" data-size="lg" data-title="desktops"><i className="fa-solid fa-laptop"></i></button>
                                </div>
                            </div>
                            <div id="canvasbackdrop" className="panel">
                                <iframe id="canvas"
                                    width="600"
                                    height="400"
                                    title="Example Embed"
                                ></iframe>
                                <div id="btnsCanvasMode">
                                    <button id="btnSave" className="btn btn-circle btn-success"> <FontAwesomeIcon icon={faSave} className="fa-fw" />      </button>
                                    <button id="btnEdit" className="btn btn-circle btn-success"><FontAwesomeIcon icon={faPen} className="fa-fw" /> </button>
                                    <button id="btnCancelEdit" className="btn btn-circle btn-warning"><FontAwesomeIcon icon={faXmark} className="fa-fw" /> </button>
                                </div>
                            </div>
                        </div>
                        <div id="pnlStyles" className="panel admin"></div>
                    </div>
                </div>
            </section >
        </div >
    );
}
