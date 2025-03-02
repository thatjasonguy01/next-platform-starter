import $ from 'jquery';
import Script from 'next/script';
import Link from 'next/link'
import Handlebars from 'handlebars';

export function PageBuilder({ title, text, linkText, href, children }) {
    return (
        <div>
            <Script src="https://cdnjs.cloudflare.com/ajax/libs/jquery/3.1.0/jquery.min.js" strategy="beforeInteractive" />
            <Script src="https://rawgit.com/components/handlebars.js/master/handlebars.js" strategy="afterInteractive" />
            <Script src="scripts/pagebuilder.js" strategy="afterInteractive" />
            <Script src="https://cdn.jsdelivr.net/npm/bootstrap@5.3.3/dist/js/bootstrap.bundle.min.js" strategy="beforeInteractive" />
            <Link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.3/dist/css/bootstrap.min.css"></Link>

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
                                    <div class="dropdown">
                                        <button className="dropdown-toggle" type="button" data-bs-toggle="dropdown" aria-expanded="false">
                                        <span className="badge text-bg-primary">DEV01</span>
                                        </button>
                                        <ul className="dropdown-menu">
                                            <li><h6 class="dropdown-header">Environments</h6></li>
                                            <li><a className="dropdown-item" href="#">My Other Site</a></li>
                                            <li><hr className="dropdown-divider" /></li>
                                            <li><a className="dropdown-item" href="#">Create New Site</a></li>
                                        </ul>
                                    </div>
                                    </div>
                                </div>
                            </nav>







                        <div className="btn-group">
                            <div className="dropdown">
                                <button className="btn btn-info btn-sm dropdown-toggle" type="button" data-bs-toggle="dropdown" aria-expanded="false">
                                    DEV01
                                </button>
                                <ul className="dropdown-menu">
                                    <li><a className="dropdown-item" href="#">DEV01</a></li>
                                    <li><a className="dropdown-item" href="#">DEV02</a></li>
                                    <li><a className="dropdown-item" href="#">STG</a></li>
                                    <li><a className="dropdown-item" href="#">PROD</a></li>
                                </ul>
                            </div>
                            </div><div className="btn-group">
                            <div className="dropdown">
                                <button className="btn btn-outline-secondary btn-sm dropdown-toggle" type="button" data-bs-toggle="dropdown" aria-expanded="false">
                                    Home
                                </button>
                                <ul className="dropdown-menu">
                                    <li><a className="dropdown-item" href="#">Home</a></li>
                                    <li><a className="dropdown-item" href="#">About</a></li>
                                    <li><a className="dropdown-item" href="#">Contact Us</a></li>
                                    
                                </ul>
                            </div>
                            </div>
                        </div>
                        <div id="pnlEdit" className="panel"></div>
                        </div>
                    <div id="pnlWrapper">
                        <div id="pnlComponents" className="panel"></div>
                        <div id="canvasWrapper" className="panel">
                            <iframe id="canvas"
                                width="600"
                                height="400"
                                title="Example Embed"
                            ></iframe>
                        </div>
                        <div id="pnlStyles" className="panel"></div>
                    </div>
                </div>
            </section>
        </div>
    );
}
