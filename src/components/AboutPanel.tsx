export function AboutPanel() {
  return (
    <section className="panel about">
      <h2>About this system</h2>
      <div className="about-grid">
        <article>
          <h3>Anomalistic year</h3>
          <p>
            The anomalistic year measures perihelion-to-perihelion return, not equinox-to-equinox. This model uses it as
            the architectural base for a 360-day interpretive cycle.
          </p>
        </article>
        <article>
          <h3>Perihelion anchor</h3>
          <p>
            Perihelion is Earth&apos;s closest orbital point to the Sun. Here, each selected perihelion timestamp defines the
            model&apos;s 0° orbital reference and day 1.
          </p>
        </article>
        <article>
          <h3>Why the custom day is longer</h3>
          <p>
            The year is forced into 360 equal custom days, so each day is slightly longer than 24 civil hours. This keeps
            the model mathematically uniform.
          </p>
        </article>
        <article>
          <h3>Why it feels elegant</h3>
          <p>
            Twelve equal 30-day months map directly to 12 equal 30° sign sectors. This creates simple conversion rules,
            legible tables, and a clean visual grammar.
          </p>
        </article>
        <article>
          <h3>What it does not claim</h3>
          <p>
            Real constellations are unequal and orbital dynamics are non-uniform; this app uses intentional approximations.
            It is designed for exploration and interpretation, not precise observational astronomy.
          </p>
        </article>
        <article>
          <h3>Scope</h3>
          <p>
            Treat this as a thoughtful comparison framework alongside Gregorian, tropical, and sidereal references—not as a
            civil-time replacement.
          </p>
        </article>
      </div>
    </section>
  );
}
