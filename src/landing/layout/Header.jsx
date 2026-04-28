import React from "react";
import { Link } from "react-router-dom";

export const Header = () => {
    return(
        <header className="bg-white/10 backdrop-blur-[10px] border border-white/20 fixed left-[50%] translate-x-[-50%] top-[20px] py-[10px] px-[25px] rounded-[30px] z-50">
            <nav className="">
                <ul className="flex items-center gap-[20px]">
                    <li>
                        <Link to="">Inicio</Link>
                    </li>
                    <li>
                        <Link to="">Música</Link>
                    </li>
                    <li>
                        <Link to="">Albunes</Link>
                    </li>
                    <li>
                        <Link to="">Api</Link>
                    </li>
                </ul>
            </nav>
        </header>
    )
}