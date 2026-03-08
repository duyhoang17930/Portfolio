import { FaGithub, FaLinkedin, FaFacebook, FaInstagram } from "react-icons/fa";

export function Home() {
  return (
    <div className="min-h-screen flex items-center justify-center relative">
      <div className="text-center z-10">

        {/* I am */}
        <p className="text-sm md:text-base text-muted-foreground mb-2 text-left">
          I AM
        </p>

        {/* Main Name */}
        <h1 className="text-7xl md:text-8xl lg:text-9xl font-bold tracking-tight text-foreground mb-4 animate-fade-in">
          Duy Hoàng
        </h1>

        {/* Subtitle */}
        <p className="text-lg md:text-xl lg:text-2xl font-light tracking-[0.3em] text-muted-foreground uppercase animate-fade-in-up">
          Web Developer | Mobile Developer
        </p>

        {/* Social Icons */}
        <div className="flex justify-center gap-6 mt-8 text-2xl text-muted-foreground animate-fade-in-up">
          <a
            href="https://github.com/duyhoang17930"
            target="_blank"
            className="hover:text-foreground transition"
          >
            <FaGithub />
          </a>

          <a
            href="https://www.linkedin.com/in/nguyen-duy-hoang-18207b350"
            target="_blank"
            className="hover:text-foreground transition"
          >
            <FaLinkedin />
          </a>

          <a
            href="https://www.facebook.com/trucnhi222"
            target="_blank"
            className="hover:text-foreground transition"
          >
            <FaFacebook />
          </a>
          <a
            href="https://www.instagram.com/_hoangg.rett_/"
            target="_blank"
            className="hover:text-foreground transition"
          >
            <FaInstagram />
          </a>
        </div>
      </div>

      {/* Copyright */}
      <p className="absolute bottom-4 right-6 text-lg text-muted-foreground/70">
        ©️2026 Duy Hoang. All rights reserved
      </p>
    </div>
  );
}