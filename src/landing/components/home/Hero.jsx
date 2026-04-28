import React from "react";
import VideoHero from '/hero-video.mp4'
import MalDeAmores from '/mal-de-amores.avif'
import Sport from '/sport.avif'

export const Hero = () => {
    return (
        <section className="relative max-w-[800px] mx-auto px-[10px] text-center pt-[120px]">
            {/* HERO TEXT */}
            <div className="relative z-20">
                <p className="italic mb-[20px] text-[var(--green)]">#No sigo tendencias. Yo soy la tendencia</p>
                <h1>
                    Solo quienes se
                    {/* FONT SECUNDARY */}
                    <span className="pl-[10px] font-secundary text-[var(--blue)]">
                        atreven a ser diferentes
                    </span>
                    , tienen el poder de escribir su
                    {/* FONT SECUNDARY */}
                    <span className="pl-[10px] font-secundary text-[var(--blue)]">
                        propia historia
                    </span>
                </h1>
            </div>


            {/* PICTURE */}
            <picture className="mt-[60px] relative flex justify-center item-center">
                {/* video */}
                <div className="z-30 w-[400px] h-[400px] block">
                    <video
                        className="w-full h-full object-cover bg-blue-600"
                        autoPlay
                        muted
                        loop
                        src={VideoHero}>
                    </video>

                    {/* MAL DE AMORES */}
                    <div className="absolute top-0 left-[-10%] -z-10 w-[400px] h-[400px] block rotate-[-10deg] translate-y-[35px]">
                        <img
                            className="w-full h-full object-cover"
                            src={MalDeAmores}
                            alt="Mal de amores" />
                    </div>

                    {/* SPORT */}
                    <div className="absolute top-0 right-[-10%] -z-10 w-[400px] h-[400px] block rotate-[10deg] translate-y-[35px]">
                        <img
                            className="w-full h-full object-cover"
                            src={Sport}
                            alt="Mal de amores" />
                    </div>
                </div>
            </picture>
        </section>
    )

}