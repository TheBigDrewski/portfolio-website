export default function HomePage() {
  return (
    <section className="flex flex-col items-center justify-center text-center py-24 px-6 bg-dark text-light">
      <h1 className="text-5xl font-extrabold text-primary-300 mb-4">
        Hey, I’m Andrew Jeschke
      </h1>
      <p className="text-lg text-gray-300 max-w-2xl mb-8">
        A Systems Developer & Software Engineer focused on building efficient, intelligent tools for real-world operations.
      </p>
      <div className="flex space-x-4">
        <a href="/projects" className="px-6 py-3 bg-primary-500 hover:bg-primary-400 rounded-lg">View My Work</a>
        <a href="/Andrew_Jeschke_Resume.pdf" className="px-6 py-3 border border-primary-500 hover:bg-primary-500 hover:text-black rounded-lg">Download Resume</a>
      </div>
    </section>
  );
}
