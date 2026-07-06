import React from "react";
import HeroSection from "../components/HeroSection";
import SobreMi from "./SobreMi";
import ServicesPreview from "../components/ServicesPreview";
import ServicesDocumentsPreview from "../components/ServicesDocumentsPreview";
import ServicesWhyPreview from "../components/ServicesWhyPreview";
import MediaPreview from "../components/MediaPreview";
import FinalCta from "../components/FinalCta";
import BlogPreview from "../components/BlogPreview";

const Home = ({ translations }) => {
  return (
    <>
      <HeroSection translations={translations} />

      <SobreMi translations={translations} />

      <ServicesPreview translations={translations} />

      <ServicesDocumentsPreview translations={translations} />

      <ServicesWhyPreview translations={translations} />

      <MediaPreview translations={translations} />

      <section id="blog">
        <BlogPreview translations={translations} />
      </section>

      <FinalCta translations={translations} />
    </>
  );
};

export default Home;