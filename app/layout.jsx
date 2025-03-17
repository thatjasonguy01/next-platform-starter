import '../styles/globals.css';
import 'bootstrap/dist/css/bootstrap.min.css';

import { config } from '@fortawesome/fontawesome-svg-core'
import '@fortawesome/fontawesome-svg-core/styles.css'
config.autoAddCss = false

export const metadata = {
    title: {
        template: '%s | Easibly',
        default: 'Easibly'
    }
};

export default function RootLayout({ children }) {
    return (
        <html lang="en" data-theme="lofi">
            <head>
                <link rel="icon" href="/favicon.svg" sizes="any" />
                
            </head>
            <body className="antialiased text-white bg-blue-900">
                <div className="flex flex-col min-h-screen">
                    <div className="flex flex-col w-full mx-auto grow">
                       <div className="grow">{children}</div>
                    </div>
                </div>
            </body>
        </html>
    );
}
