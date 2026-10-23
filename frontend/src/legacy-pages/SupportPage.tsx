import { useLocale } from "../app/auth/locale";

function SupportPage() {
  const locale = useLocale();
  const t = {
    pt: { eyebrow: "MYCELIUM / CONTATO", title: "Vamos conversar sobre o seu cultivo?", body: "Estamos preparando nossos canais de atendimento. Em breve, você poderá falar diretamente com a equipe Mycelium por aqui.", while: "ENQUANTO ISSO", product: "Conheça Flores Mágicas", productBody: "Veja a linha solo biomineral da Mycelium e as apresentações disponíveis para o seu cultivo.", action: "Ver produto" },
    en: { eyebrow: "MYCELIUM / CONTACT", title: "Let's talk about your grow", body: "We're preparing our contact channels. Soon you'll be able to speak directly with the Mycelium team here.", while: "IN THE MEANTIME", product: "Explore Flores Mágicas", productBody: "Explore Mycelium's biomineral soil line and the sizes available for your grow.", action: "View product" },
    es: { eyebrow: "MYCELIUM / CONTACTO", title: "Hablemos de tu cultivo", body: "Estamos preparando nuestros canales de atención. Pronto podrás hablar directamente con el equipo Mycelium aquí.", while: "MIENTRAS TANTO", product: "Conoce Flores Mágicas", productBody: "Conoce la línea de suelo biomineral de Mycelium y los tamaños disponibles para tu cultivo.", action: "Ver producto" },
  }[locale];
  return (
    <div className="myc-support-page">
      <section className="myc-support-hero">
        <div className="myc-shell">
          <span className="myc-kicker myc-kicker-light">{t.eyebrow}</span>
          <h1>{t.title}</h1>
          <p>{t.body}</p>
        </div>
      </section>
      <section className="myc-shell myc-support-content">
        <div>
          <span className="myc-kicker">{t.while}</span>
          <h2>{t.product}</h2>
          <p>{t.productBody}</p>
          <a className="myc-button myc-button-dark" href="/#produto">{t.action}</a>
        </div>
        <img src="/images/floresmagicas.webp" alt="Frascos da linha Mycelium Flores Mágicas" />
      </section>
    </div>
  );
}

export default SupportPage;
