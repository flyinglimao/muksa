import Head from "next/head"
import React, { FC } from "react"
import { BlitzLayout } from "@blitzjs/next"
import { Nav } from "../components/Nav"
import { Header } from "../components/Header"
import { VenomProvider } from "../services/venom"

const Layout: BlitzLayout<{ title?: string; children?: React.ReactNode }> = ({
  title,
  children,
}) => {
  return (
    <>
      <Head>
        <title>{title || "muksa"}</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <VenomProvider>
        <Header />
        <Nav spaces={[]} />
        <div className="py-12">{children}</div>
      </VenomProvider>
    </>
  )
}

export default Layout
