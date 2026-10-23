import { Link } from "@/lib/router";
import { ArrowRight, Droplets, FlaskConical, Leaf, Sprout } from "lucide-react";
import { useLocale } from "../app/auth/locale";
import Collection from "../components/collection/collection";
import "./HomePage.css";

const copy = {
  pt: {
    eyebrow: "MYCELIUM · SOLUÇÕES PARA CULTIVO", hero: "Flores Mágicas para o seu cultivo florescer.",
    intro: "Conheça a linha solo biomineral Flores Mágicas da Mycelium, disponível em diferentes apresentações para acompanhar o seu cultivo.",
    discover: "Conheça Flores Mágicas", contact: "Fale conosco", strip1: "Linha solo biomineral", strip3: "Quatro apresentações",
    productLabel: "NOSSO PRODUTO", productTitle: "Uma linha para a floração.", productIntro: "Conheça Flores Mágicas e suas diferentes apresentações.",
    productBody: "Linha solo biomineral 0-15-15, apresentada em frascos para diferentes necessidades de cultivo.",
    productBullet1: "Fórmula 0-15-15", productBullet2: "Com micro e argila, conforme a embalagem", productBullet3: "100 ml, 250 ml, 500 ml e 1 litro", more: "Saiba mais",
    guideLabel: "CULTIVE COM CONFIANÇA", guideTitle: "Cada etapa faz parte do seu cultivo.",
    guideBody: "Flores Mágicas integra a linha Mycelium para a fase de floração. Conheça as apresentações disponíveis e escolha a que combina com a sua rotina.",
    guideAction: "Tire suas dúvidas", guideCard: "O equilíbrio faz parte de cada etapa.",
    benefit1: "Floração", benefit1Body: "Uma linha criada para a fase de floração.", benefit2: "Solo biomineral", benefit2Body: "Conheça a composição indicada na embalagem.",
    benefit3: "Escolha o tamanho", benefit3Body: "Apresentações de 100 ml, 250 ml, 500 ml e 1 litro.",
    contactLabel: "VAMOS CONVERSAR?", contactTitle: "Quer saber mais sobre a Mycelium?", contactBody: "Fale com a gente sobre nossos produtos e encontre a solução ideal para o seu cultivo.", contactAction: "Entre em contato",
  },
  en: {
    eyebrow: "MYCELIUM · CULTIVATION SOLUTIONS", hero: "Flores Mágicas for a blooming grow.",
    intro: "Discover Mycelium's Flores Mágicas biomineral soil line, available in different sizes for your growing routine.",
    discover: "Explore Flores Mágicas", contact: "Contact us", strip1: "Biomineral soil line", strip3: "Four sizes",
    productLabel: "OUR PRODUCT", productTitle: "A line for flowering.", productIntro: "Discover Flores Mágicas and its different sizes.",
    productBody: "A 0-15-15 biomineral soil line in bottles for different growing needs.",
    productBullet1: "0-15-15 formula", productBullet2: "With micro and clay, as shown on the label", productBullet3: "100 ml, 250 ml, 500 ml and 1 litre", more: "Learn more",
    guideLabel: "GROW WITH CONFIDENCE", guideTitle: "Every stage is part of your grow.",
    guideBody: "Flores Mágicas is part of Mycelium's line for flowering. Explore the available sizes and choose one for your routine.",
    guideAction: "Ask us", guideCard: "Balance matters at every stage.",
    benefit1: "Flowering", benefit1Body: "A line made for the flowering stage.", benefit2: "Biomineral soil", benefit2Body: "Explore the ingredients listed on the label.",
    benefit3: "Choose a size", benefit3Body: "Available in 100 ml, 250 ml, 500 ml and 1 litre.",
    contactLabel: "LET'S TALK", contactTitle: "Want to know more about Mycelium?", contactBody: "Talk to us about our products and find the right option for your grow.", contactAction: "Get in touch",
  },
  es: {
    eyebrow: "MYCELIUM · SOLUCIONES PARA CULTIVO", hero: "Flores Mágicas para que tu cultivo florezca.",
    intro: "Conoce la línea de suelo biomineral Flores Mágicas de Mycelium, disponible en diferentes tamaños para tu cultivo.",
    discover: "Conoce Flores Mágicas", contact: "Contáctanos", strip1: "Línea de suelo biomineral", strip3: "Cuatro tamaños",
    productLabel: "NUESTRO PRODUCTO", productTitle: "Una línea para la floración.", productIntro: "Conoce Flores Mágicas y sus diferentes tamaños.",
    productBody: "Una línea de suelo biomineral 0-15-15 en botellas para diferentes necesidades de cultivo.",
    productBullet1: "Fórmula 0-15-15", productBullet2: "Con micro y arcilla, según la etiqueta", productBullet3: "100 ml, 250 ml, 500 ml y 1 litro", more: "Saber más",
    guideLabel: "CULTIVA CON CONFIANZA", guideTitle: "Cada etapa forma parte de tu cultivo.",
    guideBody: "Flores Mágicas forma parte de la línea Mycelium para la floración. Conoce los tamaños disponibles y elige el que se adapte a tu rutina.",
    guideAction: "Resuelve tus dudas", guideCard: "El equilibrio importa en cada etapa.",
    benefit1: "Floración", benefit1Body: "Una línea creada para la floración.", benefit2: "Suelo biomineral", benefit2Body: "Conoce la composición indicada en la etiqueta.",
    benefit3: "Elige el tamaño", benefit3Body: "Disponible en 100 ml, 250 ml, 500 ml y 1 litro.",
    contactLabel: "¿HABLAMOS?", contactTitle: "¿Quieres saber más sobre Mycelium?", contactBody: "Habla con nosotros sobre los productos y encuentra la opción ideal para tu cultivo.", contactAction: "Contactar",
  },
} as const;

function HomePage() {
  const locale = useLocale();
  const t = copy[locale];
  const benefits = [
    { icon: <Sprout aria-hidden="true" />, title: t.benefit1, text: t.benefit1Body },
    { icon: <Leaf aria-hidden="true" />, title: t.benefit2, text: t.benefit2Body },
    { icon: <FlaskConical aria-hidden="true" />, title: t.benefit3, text: t.benefit3Body },
  ];
  return (
    <div className="myc-home">
      <section className="myc-hero" aria-labelledby="hero-title">
        <div className="myc-hero-glow" aria-hidden="true" />
        <div className="myc-shell myc-hero-grid">
          <div className="myc-hero-copy">
            <span className="myc-eyebrow">{t.eyebrow}</span>
            <h1 id="hero-title">{t.hero}</h1>
            <p>{t.intro}</p>
            <div className="myc-hero-actions">
              <Link className="myc-button myc-button-light" to="/products/flores-magicas">{t.discover} <ArrowRight aria-hidden="true" /></Link>
              <Link className="myc-text-link" to="/support">{t.contact}</Link>
            </div>
          </div>
          <div className="myc-hero-visual">
            <div className="myc-orbit myc-orbit-one" aria-hidden="true" />
            <div className="myc-orbit myc-orbit-two" aria-hidden="true" />
            <img src="/images/floresmagicas.webp" alt="Quatro frascos da linha Mycelium Flores Mágicas" />
            <span className="myc-hero-tag">Flores Mágicas <small>0-15-15</small></span>
          </div>
        </div>
      </section>

      <div className="myc-benefit-strip" aria-label="Destaques Mycelium">
        <div className="myc-shell myc-benefit-strip-inner">
          <span><Leaf aria-hidden="true" /> {t.strip1}</span>
          <span><Droplets aria-hidden="true" /> 0-15-15</span>
          <span><Sprout aria-hidden="true" /> {t.strip3}</span>
        </div>
      </div>

      <Collection embedded />

      <section id="produto" className="myc-section myc-product-section" aria-labelledby="product-title">
        <div className="myc-shell">
          <div className="myc-section-heading">
            <span className="myc-kicker">{t.productLabel}</span>
            <h2 id="product-title">{t.productTitle}</h2>
            <p>{t.productIntro}</p>
          </div>
          <div className="myc-feature-card">
            <div className="myc-feature-image">
              <span className="myc-feature-badge">LINHA SOLO BIOMINERAL</span>
              <img src="/images/floresmagicas.webp" alt="Embalagens Mycelium Flores Mágicas" loading="lazy" />
            </div>
            <div className="myc-feature-content">
              <span className="myc-kicker myc-kicker-light">MYCELIUM · FLORES MÁGICAS</span>
              <h3>Flores Mágicas</h3>
              <p>{t.productBody}</p>
              <ul><li>{t.productBullet1}</li><li>{t.productBullet2}</li><li>{t.productBullet3}</li></ul>
              <Link className="myc-button myc-button-outline" to="/products/flores-magicas">{t.more} <ArrowRight aria-hidden="true" /></Link>
            </div>
          </div>
        </div>
      </section>

      <section id="cultivo" className="myc-section myc-guide-section" aria-labelledby="guide-title">
        <div className="myc-shell myc-guide-grid">
          <div className="myc-guide-art" aria-hidden="true">
            <div className="myc-guide-card myc-guide-card-back"><Leaf /></div>
            <div className="myc-guide-card myc-guide-card-front">
              <span>MYCELIUM / CULTIVO</span><Sprout />
              <strong>{t.guideCard}</strong>
              <div className="myc-guide-lines"><i /><i /><i /></div>
            </div>
          </div>
          <div className="myc-guide-copy">
            <span className="myc-kicker">{t.guideLabel}</span>
            <h2 id="guide-title">{t.guideTitle}</h2>
            <p>{t.guideBody}</p>
            <div className="myc-guide-benefits">
              {benefits.map((benefit) => (
                <div className="myc-guide-benefit" key={benefit.title}>
                  <span>{benefit.icon}</span><div><strong>{benefit.title}</strong><p>{benefit.text}</p></div>
                </div>
              ))}
            </div>
            <Link className="myc-button myc-button-dark" to="/support">{t.guideAction} <ArrowRight aria-hidden="true" /></Link>
          </div>
        </div>
      </section>

      <section className="myc-contact-section" aria-labelledby="contact-title">
        <div className="myc-shell myc-contact-panel">
          <div>
            <span className="myc-kicker myc-kicker-light">{t.contactLabel}</span>
            <h2 id="contact-title">{t.contactTitle}</h2>
            <p>{t.contactBody}</p>
          </div>
          <Link className="myc-button myc-button-light" to="/support">{t.contactAction} <ArrowRight aria-hidden="true" /></Link>
        </div>
      </section>
    </div>
  );
}

export default HomePage;
