import Script from 'next/script';

export function Components({ title, text, linkText, href, children }) {
    return (
        <div id="pnlComponents" className="panel" style={{display: "none"}}>
            <Script src="scripts/components.js" strategy="afterInteractive" />
            <Script src="scripts/dragdrop.js" strategy="afterInteractive" />
        </div >
    );
}
