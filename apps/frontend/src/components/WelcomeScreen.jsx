export default function WelcomeScreen({ onStart }) {
  return (
    <main className="entry-screen welcome-screen" aria-labelledby="welcome-title">
      <div className="entry-content welcome-content">
        <img
          className="welcome-logo"
          src="ciitlogo.png"
          alt="CIIT College of Innovation and Integrated Technology"
        />
        <h1 id="welcome-title">GLITCH TOWER</h1>
        <div className="welcome-rule" />
        <p className="welcome-subtitle">360° VIRTUAL TOUR</p>
        <button className="entry-button" type="button" onClick={onStart}>
          START
        </button>
      </div>
    </main>
  )
}