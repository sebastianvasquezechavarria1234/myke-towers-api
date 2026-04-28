import React from "react";
import { Header } from "./Header";
import { Footer } from "./Footer";
import { Bg } from "./Bg";

export const Layout = ({children}) => {
    return(
        <main>
            <Bg />
            <Header />
            {children}
            {/* <Footer /> */}
        </main>
    )
}