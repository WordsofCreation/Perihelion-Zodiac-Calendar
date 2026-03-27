import type { ContentSection } from '../../content/siteContent';

interface KnowledgePageProps {
  title: string;
  intro: string;
  sections: ContentSection[];
}

export function KnowledgePage({ title, intro, sections }: KnowledgePageProps) {
  return (
    <article className="panel page-article">
      <header>
        <h1>{title}</h1>
        <p className="page-intro">{intro}</p>
      </header>
      {sections.map((section) => (
        <section key={section.title} className="content-block">
          <h2>{section.title}</h2>
          {section.body.map((paragraph) => (
            <p key={paragraph}>{paragraph}</p>
          ))}
          {section.bullets && (
            <ul>
              {section.bullets.map((bullet) => (
                <li key={bullet}>{bullet}</li>
              ))}
            </ul>
          )}
        </section>
      ))}
    </article>
  );
}
