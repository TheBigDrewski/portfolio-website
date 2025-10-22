export default function HomePage() {
  return (
    <section className="flex flex-col items-center justify-center text-center py-24 px-6 bg-dark text-light">
      <h1 className="text-5xl font-extrabold text-primary-300 mb-4">
        Hey, I’m Andrew Jeschke
      </h1>
      <p className="text-lg text-gray-300 max-w-2xl mb-8">
        A systems developer and software engineer building efficient, data-driven solutions across web, automation, and game design.
      </p>
      <a
        href="/projects"
        className="px-6 py-3 bg-primary-500 hover:bg-primary-400 text-white font-semibold rounded-lg transition-all duration-200"
      >
        View My Projects
      </a>
    </section>
  );
}
