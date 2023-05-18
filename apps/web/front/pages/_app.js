import App from 'next/app'
import '@patternfly/react-core/dist/styles/base.css'
import Layout from '../components/layout'



export default function MyApp({ Component, pageProps }) {
    return (
      <Layout>
        <Component {...pageProps} />
      </Layout>
    );
}
