export default function Navbar() {
    return (
        <nav className="bg-dark text-light border-b border-gray-800 sticky top-0 z-50">
            <div className="max-w-7xl mx-auto flex items-center justify-between px-6 py-3">
                <h1 className="text-xl font-bold text-primary-400 tracking-wide">
                    AJ Portfolio
                </h1>

                <div className="flex gap-6 text-sm font-medium">
                    <a href="/" className="hover:text-primary-300 transition-colors">Home</a>
                    <a href="/projects" className="hover:text-primary-300 transition-colors">Projects</a>
                    <a href="/contact" className="hover:text-primary-300 transition-colors">Contact</a>
                </div>
            </div>
        </nav>
    )
}