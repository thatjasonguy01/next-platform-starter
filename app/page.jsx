import Script from 'next/script';
import Link from 'next/link'
import { PageBuilder  } from 'components/pagebuilder';
import { Inter } from 'next/font/google'

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faThumbsUp } from '@fortawesome/free-solid-svg-icons'
 
// If loading a variable font, you don't need to specify the font weight
const inter = Inter({ subsets: ['latin'] })

export default async function Page() {
    return (
        <main className={inter.className}>
            <Script src="https://cdnjs.cloudflare.com/ajax/libs/jquery/3.1.0/jquery.min.js" strategy="beforeInteractive" />
            <Script src="https://cdn.jsdelivr.net/npm/bootstrap@5.3.3/dist/js/bootstrap.bundle.min.js" strategy="beforeInteractive" />
            <Link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.3/dist/css/bootstrap.min.css"></Link>
            <PageBuilder></PageBuilder>     
        </main>
    );
}