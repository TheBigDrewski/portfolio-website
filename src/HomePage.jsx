import rLogo from "./icons/React-icon.svg.png";
import pLogo from "./icons/Python-logo.svg.png";
import mLogo from "./icons/Microsoft_dotNET_logo.svg.png";
import sLogo from "./icons/Sql_logo.svg.png";
import tLogo from "./icons/Tailwind_CSS_Logo.svg.png";
import SkillBar from "./SkillBar.jsx";

export default function HomePage() {
  return (
    <div>
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

      <section className="bg-gray-900 py-12">
        <h2 className="text-3xl font-bold text-center text-white mb-6">Tech Stacks</h2>
        <div className="grid grid-cols-3 md:grid-cols-5 gap-6 place-items-center text-gray-300">
          <div>
            <img src={rLogo} alt="React" className="w-24 h-24"/>
            <SkillBar skill="React " level={90} />
          </div>
          <div>
            <img src={mLogo} alt=".NET" className="w-24 h-24"/>
            <SkillBar skill=".NET " level={90} />
          </div>
          <div>
            <img src={sLogo} alt="SQL" className="w-48 h-24"/>
            <SkillBar skill="SQL " level={80} />
          </div>
          <div>
            <img src={pLogo} alt="Python" className="w-24 h-24"/>
            <SkillBar skill="Python " level={70} />
          </div>
          <div>
            <img src={tLogo} alt="Tailwind" className="w-32 h-24"/>
            <SkillBar skill="TailwindCSS " level={70} />
          </div>  
        </div>
      </section>
    </div>
  );
}
