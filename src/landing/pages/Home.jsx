import React from "react";
import { Layout } from "../layout/Layout";
import { Hero } from "../components/home/Hero";
import { Musica } from "../components/home/Musica";

export const Home = () => {
    return(
        <Layout>
            <Hero />
            <Musica />
            
        </Layout>
    )
}