export default function Footer() {
  return (
    <footer className="bg-dark text-gray-400 text-sm border-t border-gray-800">
      <div className="max-w-7xl mx-auto px-6 py-4 flex flex-col sm:flex-row justify-between items-center">
        <p>© {new Date().getFullYear()} Andrew Jeschke</p>
        <div className="flex gap-4 mt-2 sm:mt-0">
          <a href="https://github.com/TheBigDrewski" target="_blank" className="hover:text-primary-300">GitHub</a>
          <a href="https://linkedin.com/in/andrew-jeschke" target="_blank" className="hover:text-primary-300">LinkedIn</a>
        </div>
      </div>
    </footer>
  );
}