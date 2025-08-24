import type { AppProps } from 'next/app';
import '../styles/globals.css';

function MyApp({ Component, pageProps }: AppProps) {
  console.log('_app: App component rendered with Component:', Component.name || 'Unknown');
  console.log('_app: pageProps:', pageProps);
  
  return <Component {...pageProps} />;
}

export default MyApp;
