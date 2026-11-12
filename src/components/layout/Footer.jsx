import React from "react";
import {
  FaFacebook,
  FaTwitter,
  FaInstagram,
  FaLinkedin,
  FaGithub,
  FaHeart,
  FaCode,
  FaShieldAlt,
  FaQuestionCircle,
  FaNewspaper,
  FaPhone,
  FaEnvelope,
  FaMapMarkerAlt,
  FaRss
} from "react-icons/fa";
import { TfiWorld } from "react-icons/tfi";
import profileLogo from "../../assets/ownerPhoto.jpg"
import logo from "../../assets/image-smal-transparent.png"

function Footer() {
  const currentYear = new Date().getFullYear();

  const footerLinks = {
    Sobre: [
      { name: "Sobre o Proprietário", href: "/sobre" },
      { name: "Nossa História", href: "/historia" },
      { name: "Equipe", href: "/equipe" },
      { name: "Trabalhe Conosco", href: "/carreiras" },
    ],
    Recursos: [
      { name: "Em alta", href: "/" },
      { name: "Ver mais tarde", href: "/library/saved" },
      { name: "Histórico", href: "/library/history" },
      { name: "O meu perfil", href: "/perfil" },
      { name: "Privacidade", href: "/privacidade" },
    ],
    Suporte: [
      { name: "Central de Ajuda", href: "/ajuda" },
      { name: "FAQ", href: "/faq" },
      { name: "Contato", href: "/contato" },
      { name: "Status do Sistema", href: "/status" },
      { name: "Reportar Bug", href: "/bug-report" },
    ],
    Legal: [
      { name: "Termos de Uso", href: "/termos" },
      { name: "Política de Privacidade", href: "/privacidade" },
      { name: "Cookies", href: "/cookies" },
      { name: "LGPD", href: "/lgpd" },
      { name: "Compliance", href: "/compliance" },
    ],
  };

  const socialLinks = [
    { icon: <FaFacebook />, name: "Facebook", href: "https://facebook.com/edilson1vita", color: "hover:text-blue-500" },
    { icon: <FaTwitter />, name: "Twitter", href: "https://twitter.com/edilson1eduardo", color: "hover:text-sky-400" },
    { icon: <FaInstagram />, name: "Instagram", href: "https://instagram.com/edilson_vita", color: "hover:text-pink-500" },
    { icon: <FaLinkedin />, name: "LinkedIn", href: "https://www.linkedin.com/in/edilson-vita/", color: "hover:text-blue-600" },
    { icon: <FaGithub />, name: "GitHub", href: "https://github.com/edilson-eduardo", color: "hover:text-muted" },
    { icon: <TfiWorld />, name: "Editube - plataforma oficial", href: "https://editube.netlify.app", color: "hover:text-red-300" },
  ];

  const contactInfo = [
    { icon: <FaPhone />, text: "+244 953 220 581" },
    { icon: <FaEnvelope />, text: "editube.support@gmail.com" },
    { icon: <FaMapMarkerAlt />, text: "Luanda, Angola" },
  ];

  return (
    <footer className="bg-surface text-fg pt-12 pb-6 border-t border-line">
      <div className="container mx-auto px-4">

        {/* Top Section */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-8 mb-12">

          {/* Logo e Descrição */}
          <div className="lg:col-span-2">
            <div className="flex items-center mb-4">
              <div className="flex items-center">
                <img src={logo} alt="" className="w-12 h-8 mr-2" />
                <span className="text-2xl font-bold">
                  <span>edi</span>
                  <span className="text-brand">Tube</span>
                </span>
              </div>
              <span className="ml-2 px-2 py-1 bg-brand/20 text-brand text-xs rounded-full">
                Beta
              </span>
            </div>
            <p className="text-muted mb-6 max-w-md">
              Streaming de vídeos gratuito, rápido e sem complicações. Cria a tua conta para guardar vídeos e acompanhar o que já viste.
            </p>

            {/* Newsletter */}
            <div className="mb-6">
              <h3 className="font-semibold mb-3 flex items-center">
                <FaRss className="mr-2 text-blue-400" />
                Newsletter
              </h3>
              <div className="flex">
                <input
                  type="email"
                  placeholder="Seu e-mail"
                  className="flex-1 px-4 py-2 rounded-l-lg bg-elevated border border-line text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                <button className="px-4 py-2 bg-gradient-to-r bg-brand hover:bg-brand-strong rounded-r-lg font-medium transition-all duration-200">
                  Inscrever
                </button>
              </div>
            </div>

            {/* Social Media */}
            <div>
              <h3 className="font-semibold mb-3">Conecte-se conosco</h3>
              <div className="flex space-x-4">
                {socialLinks.map((social) => (
                  <a
                    key={social.name}
                    href={social.href}
                    className={`w-10 h-10 rounded-full bg-elevated flex items-center justify-center text-lg transition-all duration-200 hover:scale-110 ${social.color}`}
                    aria-label={social.name}
                    title={social.name}
                  >
                    {social.icon}
                  </a>
                ))}
              </div>
            </div>
          </div>

          {/* Links Columns */}
          {Object.entries(footerLinks).map(([category, links]) => (
            <div key={category}>
              <h3 className="font-bold text-lg mb-4 pb-2 border-b border-line flex items-center">
                {category === "Sobre" && <FaQuestionCircle className="mr-2 text-blue-400" />}
                {category === "Recursos" && <FaCode className="mr-2 text-purple-400" />}
                {category === "Suporte" && <FaShieldAlt className="mr-2 text-green-400" />}
                {category === "Legal" && <FaNewspaper className="mr-2 text-yellow-400" />}
                {category}
              </h3>
              <ul className="space-y-3">
                {links.map((link) => (
                  <li key={link.name}>
                    <a
                      href={link.href}
                      className="text-muted hover:text-fg hover:pl-2 transition-all duration-200 flex items-center group"
                    >
                      <span className="w-1 h-1 bg-brand rounded-full opacity-0 group-hover:opacity-100 mr-2 transition-opacity duration-200"></span>
                      {link.name}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Contact Info */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 py-8 border-t border-line">
          {contactInfo.map((contact, index) => (
            <div key={index} className="flex items-center">
              <div className="w-10 h-10 rounded-full bg-elevated flex items-center justify-center mr-3 text-blue-400">
                {contact.icon}
              </div>
              <span className="text-muted">{contact.text}</span>
            </div>
          ))}
        </div>

        {/* Bottom Section */}
        <div className="pt-8 border-t border-line">
          <div className="flex flex-col md:flex-row justify-between items-center">

            {/* Copyright */}
            <div className="mb-4 md:mb-0">
              <p className="text-muted text-sm">
                © {currentYear} ediTube. Todos os direitos reservados.
              </p>
            </div>

            {/* Badges/Certifications */}
            <div className="flex flex-wrap gap-4">
              <div className="px-3 py-1 bg-elevated rounded-full text-xs flex items-center">
                <FaShieldAlt className="mr-1 text-green-400" />
                <span>SSL Seguro</span>
              </div>
              <div className="px-3 py-1 bg-elevated rounded-full text-xs">
                <span className="text-muted">100%</span>
                <span className="text-green-400 ml-1">Online</span>
              </div>
              <div className="px-3 py-1 bg-elevated rounded-full text-xs">
                <span>🇦🇴</span>
                <span className="ml-1">PT-AO</span>
              </div>
            </div>
          </div>

          {/* Proprietário Info */}
          <div className="mt-8 pt-6 border-t border-line/50 text-center">
            <div className="inline-flex items-center px-4 py-2 bg-elevated/60 rounded-lg">
              <img
                src={profileLogo}
                alt="Proprietário"
                className="w-8 h-8 rounded-full mr-3 border border-blue-500"
              />
              <div className="text-left">
                <p className="text-sm font-medium">Sobre o Proprietário</p>
                <p className="text-xs text-muted">Edilson Eduardo • Desenvolvedor Full-Stack</p>
              </div>
              <a
                href="https://ao.linkedin.com/in/edilson-vita"
                className="ml-4 text-blue-400 hover:text-blue-300 text-sm font-medium"
              >
                Conheça mais →
              </a>
            </div>
            <p className="text-muted/70 text-xs mt-4 max-w-2xl mx-auto">
              Este projeto foi desenvolvido com React, Node.js, PostgreSQL e muito café. Conteúdo destinado a maiores de 18 anos.
              Nosso compromisso é com a privacidade e segurança dos usuários.
            </p>
          </div>
        </div>

        {/* Back to Top */}
        <div className="text-center mt-8">
          <button
            onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
            className="inline-flex items-center px-4 py-2 bg-elevated hover:bg-white/10 rounded-lg transition-colors duration-200 text-sm"
          >
            ↑ Voltar ao topo
          </button>
        </div>
      </div>
    </footer>
  );
}

export default Footer;