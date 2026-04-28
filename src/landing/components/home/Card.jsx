import React from "react";

export const Card = () => {
    return(
        <a 
            className="" 
            target="_blank" 
            href="">
            {/* CARD PICTURE */}
            <picture className="relative w-full h-[400px]">

                {/* IMG */}
                <img 
                    className="w-full h-hull object-cover" 
                    src="https://static.wixstatic.com/media/538d7e_5f608dd0e8dd4d97b239a45c754f0e32~mv2.jpg/v1/fill/w_298,h_298,q_75,enc_avif,quality_auto/538d7e_5f608dd0e8dd4d97b239a45c754f0e32~mv2.jpg" 
                    alt="ulala" />
            </picture>
            {/* card body */}
            <div className="mt-[20px]">
                <h4 className="font-secundary">Ulala ohh lala</h4>
                <p>Myke towers - dary yanky</p>
                <p>13/89/2023</p>

            </div>
        </a>
    )
}