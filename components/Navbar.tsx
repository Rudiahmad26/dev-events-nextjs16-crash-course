'use client'

import React from 'react'
import Link from "next/link";
import Image from "next/image";
import posthog from 'posthog-js';

const Navbar = () => {
    return (
        <header>
            <nav>
                <Link href="/" className="logo" onClick={() => posthog.capture('navbar-link-clicked', { link_text: 'logo', link_href: '/' })}>
                    <Image src="/icons/logo.png" alt="logo" width={24} height={24} />

                    <p>DevEvent</p>
                </Link>

                <ul>
                    <Link href="/" onClick={() => posthog.capture('navbar-link-clicked', { link_text: 'Home', link_href: '/' })}>
                        Home
                    </Link>
                    <Link href="/" onClick={() => posthog.capture('navbar-link-clicked', { link_text: 'Events', link_href: '/' })}>
                        Events
                    </Link>
                    <Link href="/" onClick={() => posthog.capture('navbar-link-clicked', { link_text: 'Create Event', link_href: '/' })}>
                        Create Event
                    </Link>
                </ul>
            </nav>
        </header>
    )
}
export default Navbar
