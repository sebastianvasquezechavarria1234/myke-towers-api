import React from "react";

export const Bg = () => {
    return(
        <section className="fixed top-0 left-0 w-full h-screen">
            {/* CIRCLE GREEN */}
            <div className="absolute w-[20vw] h-[20vw] bg-[var(--green)] rounded-full blur-[140px] opacity-80"></div>
            {/* CIRCLE BLUE */}
            <div className="absolute left-[-10%] bottom-[-20%] w-[20vw] h-[20vw] bg-[var(--blue)] rounded-full blur-[140px] opacity-80"></div>
            {/* CIRCLE PURPLE */}
            <div className="absolute left-[20%] bottom-[10%] w-[20vw] h-[20vw] bg-[var(--purple)] rounded-full blur-[140px] opacity-50"></div>
            {/* CIRCLE PRPLE RIGHT */}
            <div className="absolute right-[-5%] top-[-5%] w-[30vw] h-[30vw] bg-[var(--purple)] rounded-full blur-[200px] opacity-60"></div>
        </section>
    )
}