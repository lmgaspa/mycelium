import { Link } from "@/lib/router";
import { useLocale } from "../../app/auth/locale";

function Footer() {
  const locale = useLocale();
  const t = {
    pt: { body: "Soluções para acompanhar o equilíbrio do seu cultivo.", explore: "Explore", home: "Início", products: "Produtos", grow: "Cultivo", service: "Atendimento", contact: "Contato", motto: "Cultive com mais equilíbrio." },
    en: { body: "Solutions to support balance in your grow.", explore: "Explore", home: "Home", products: "Products", grow: "Growing", service: "Support", contact: "Contact", motto: "Grow with more balance." },
    es: { body: "Soluciones para acompañar el equilibrio de tu cultivo.", explore: "Explorar", home: "Inicio", products: "Productos", grow: "Cultivo", service: "Atención", contact: "Contacto", motto: "Cultiva con más equilibrio." },
  }[locale];
  return (
    <footer className="myc-footer">
      <div className="myc-shell myc-footer-grid">
        <div className="myc-footer-brand"><Link to="/" aria-label="Mycelium — início"><img src="/images/logomycelium.webp" alt="Mycelium" /></Link><p>{t.body}</p></div>
        <div><h2>{t.explore}</h2><Link to="/">{t.home}</Link><a href="/#produto">{t.products}</a><a href="/#cultivo">{t.grow}</a></div>
        <div><h2>{t.service}</h2><Link to="/support">{t.contact}</Link></div>
        <div className="myc-footer-note"><h2>Mycelium</h2><p>{t.motto}</p></div>
      </div>
      <div className="myc-shell myc-footer-bottom"><span>© {new Date().getFullYear()} Mycelium</span></div>
    </footer>
  );
}

export default Footer;
