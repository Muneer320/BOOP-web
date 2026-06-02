import React from "react";
import { Helmet } from "react-helmet-async";

const Section = ({ section }) => {
  switch (section.type) {
    case "h1":
      return <h1 className="legal-h1">{section.text}</h1>;
    case "h2":
      return <h2 className="legal-h2">{section.text}</h2>;
    case "h3":
      return <h3 className="legal-h3">{section.text}</h3>;
    case "h4":
      return <h4 className="legal-h4">{section.text}</h4>;
    case "p":
      return <p className="legal-p">{section.text}</p>;
    case "list":
      return (
        <ul className="legal-list">
          {section.items.map((item, i) => (
            <li key={i} className="legal-li">{item}</li>
          ))}
        </ul>
      );
    case "link-p":
      return (
        <p className="legal-p">
          {section.before && <>{section.before} </>}
          <a href={section.href} target="_blank" rel="noopener noreferrer" className="legal-link">{section.text}</a>
          {section.after && <> {section.after}</>}
        </p>
      );
    case "spacer":
      return <div className="legal-spacer" />;
    default:
      return null;
  }
};

const LegalPage = ({ title, description, sections }) => {
  return (
    <div className="legal-page">
      <Helmet>
        <title>{title} - BOOP Web</title>
        <meta name="description" content={description} />
      </Helmet>
      <div className="container">
        <div className="legal-content">
          {sections.map((section, i) => (
            <Section key={i} section={section} />
          ))}
        </div>
      </div>
    </div>
  );
};

export default LegalPage;
