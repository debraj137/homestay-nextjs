import Link from 'next/link';

const defaultSteps = ['Your email', 'Your details', 'Ready to stay'];

export default function AuthShell({
  title,
  description,
  children,
  footer,
  step,
  steps = defaultSteps,
  eyebrow = 'Awadh Hotels account',
}) {
  return (
    <main className="auth-page">
      <div className="auth-layout">
        <aside className="auth-story" aria-label="Awadh Hotels welcome">
          <Link href="/" className="auth-brand" aria-label="Awadh Hotels home">
            Awadh<span>Hotels</span>
          </Link>
          <div className="auth-story-content">
            <p className="eyebrow text-[#f7d493]">Stay with a story</p>
            <h1 className="font-display">More than a room. A place to belong.</h1>
            <p>
              Discover welcoming homes, thoughtful hosts, and the living heritage of Awadh.
            </p>
            {step && (
              <ol className="auth-steps" aria-label="Account setup progress">
                {steps.map((label, index) => {
                  const number = index + 1;
                  return (
                    <li key={label} className={number === step ? 'is-current' : number < step ? 'is-complete' : ''}>
                      <span>{number < step ? '✓' : number}</span>
                      {label}
                    </li>
                  );
                })}
              </ol>
            )}
          </div>
          <p className="auth-story-note">Handpicked stays across the sacred city of Ayodhya.</p>
        </aside>

        <section className="auth-form-area">
          <div className="auth-mobile-brand">
            <Link href="/">Awadh<span>Hotels</span></Link>
          </div>
          <div className="auth-card surface-card">
            <p className="eyebrow">{eyebrow}</p>
            <h2 className="font-display">{title}</h2>
            {description && <p className="auth-description">{description}</p>}
            {children}
            {footer && <div className="auth-footer">{footer}</div>}
          </div>
        </section>
      </div>
    </main>
  );
}
