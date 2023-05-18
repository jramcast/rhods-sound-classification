import { useState } from 'react'
import { Brand, Page, PageHeader, PageSidebar } from "@patternfly/react-core";
import { Navigation } from '../components/nav';

export default function Layout({ children }) {
    const [isNavOpen, setIsNavOpen] = useState(true);

    const Header = (
        <PageHeader
            logo={
                <Brand
                    src="logo"
                    alt="Red Hat Training Logo"
                    className="logo"
                />
            }
            logoProps={{ href: "/" }}
            showNavToggle
            isNavOpen={isNavOpen}
            onNavToggle={() => setIsNavOpen(!isNavOpen)}
            style={{ borderTop: "2px solid #c00" }}
        />
    );

    const Sidebar = (
        <PageSidebar nav={<Navigation />} isNavOpen={isNavOpen} theme="dark" />
    );

    return (
        <Page header={Header} sidebar={Sidebar} style={{ minHeight: 800 }}>
            {children}
        </Page>
    );
}
