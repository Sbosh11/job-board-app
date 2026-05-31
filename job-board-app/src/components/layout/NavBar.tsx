// Purpose: Top navigation bar.
import { Link } from "react-router-dom";

export default function Navbar() {
  return (
    <header
      className="bg-white shadow-sm 
  hover:shadow-lg
  transition-all 
  border border-transparent 
  hover:border-slate-100"
    >
      <div className="max-w-3xl mx-auto px-4 py-4 flex justify-between">
        <Link to="/" className="text-xl font-bold text-blue-600">
          NextHire
        </Link>

        <nav className="text-sm text-slate-600">
          <Link to="/" className="hover:text-brand">
            Jobs
          </Link>
        </nav>
      </div>
    </header>
  );
}
