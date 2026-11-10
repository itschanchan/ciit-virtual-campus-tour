const instructions = [
  {
    title: "Drag with Mouse",
    description: "Hold the left mouse button and drag to look around.",
    visual: "/mouse_drag.png",
  },
  {
    title: "Use Arrow Keys",
    description:
      "Press the arrow keys to move camera upward, downward, left, or right.",
    visual: "/arrow_keys.png",
  },
  {
    title: "Scroll to Zoom",
    description: "Use the scroll wheel to zoom in or out.",
    visual: "/mouse_scroll.png",
  },
];

export default function InstructionsScreen({ onContinue }) {
  function handleKeyDown(event) {
    if (event.key === "Enter" || event.key === " ") {
      event.preventDefault();
      onContinue();
    }
  }

  return (
    <main
      className="entry-screen instructions-screen"
      aria-labelledby="instructions-title"
      tabIndex={0}
      onClick={onContinue}
      onKeyDown={handleKeyDown}
    >
      <div className="entry-content instructions-content">
        <h1 id="instructions-title">How to Move Around</h1>
        <p className="instructions-lead">
          Use your mouse and keyboard to explore the area.
        </p>

        <div className="instruction-grid">
          {instructions.map((instruction) => (
            <section className="instruction-card" key={instruction.title}>
              <div className="instruction-visual">
                <img
                  className="instruction-visual-image"
                  src={instruction.visual}
                  alt=""
                />
              </div>
              <h2>{instruction.title}</h2>
              <p>{instruction.description}</p>
            </section>
          ))}
        </div>

        <p className="continue-prompt">CLICK ANYWHERE TO START!</p>
      </div>
    </main>
  );
}
