import React from "react";
import { Card } from "./Card";

export const Musica = () => {
    return(
        <section className="mt-[200px] max-w-[1200px] mx-auto px-[10px]">
            <h1 className="mb-[30px] text-center">
                Lo mejor de
                <span className="pl-[20px] font-secundary">
                    Myke towers
                </span>
            </h1>

            {/* GRID */}
            <div className="grid grid-cols-3 gap-[20px]">
                <Card />
                <Card />
                <Card />
                <Card />
                <Card />
            </div>
        </section>
    )
}