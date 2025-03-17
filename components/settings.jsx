import Script from 'next/script';

export function Settings({ title, text, linkText, href, children }) {
    return (
        <div id="pnlSettings" className="panel" style={{display: 'none'}}>
            <Script src="scripts/forms.js" strategy="afterInteractive" />
            
        </div>
    );
}
