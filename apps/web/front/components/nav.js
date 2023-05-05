import React from "react";
import Link from 'next/link';
import { useRouter, } from 'next/router';
import { Nav, NavItem, NavList } from "@patternfly/react-core";

export function Navigation() {
    const router = useRouter();

    return (
        <Nav theme="dark">
            <NavList>
                <NavItem id="home" isActive={router.pathname.endsWith("/")}>
                    <Link href="/">File URL</Link>
                </NavItem>
                <NavItem
                    id="live"
                    isActive={router.pathname.endsWith("/live")}
                >
                    <Link href="/live">Live Recording</Link>
                </NavItem>
            </NavList>
        </Nav>
    );
}