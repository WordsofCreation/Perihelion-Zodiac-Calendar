import type { NoteEntry } from '../content/siteContent';

interface NotesPageProps {
  notes: NoteEntry[];
}

export function NotesPage({ notes }: NotesPageProps) {
  return (
    <article className="panel page-article">
      <header>
        <h1>Notes / Essays</h1>
        <p className="page-intro">
          Seed essays for future publication. Each note can evolve into a full article while staying linked to formulas and explorer
          views.
        </p>
      </header>
      <div className="notes-grid">
        {notes.map((note) => (
          <section className="comparison-card" key={note.slug}>
            <h2>{note.title}</h2>
            <p>{note.summary}</p>
            {note.body.map((paragraph) => (
              <p key={paragraph}>{paragraph}</p>
            ))}
          </section>
        ))}
      </div>
    </article>
  );
}
