import { BrowserRouter, Routes, Route } from "react-router-dom";


import Navbar from "./components/layout/NavBar";
import JobListingsPage from "./pages/JobListingsPage";
import JobDetailsPage from "./pages/JobDetailsPage";
import JobApplicationPage from "./pages/JobApplicationPage";



export default function App() {
  return (

      <BrowserRouter>
        <div className="min-h-screen bg-slate-50 text-slate-900">
          <Navbar />

          <main className="max-w-3xl mx-auto px-4 py-6">
            <Routes>
              <Route path="/" element={<JobListingsPage />} />
              <Route path="/jobs/:id" element={<JobDetailsPage />} />
              <Route path="/jobs/:id/apply" element={<JobApplicationPage />} />
            </Routes>
          </main>
        </div>
      </BrowserRouter>

  );
}