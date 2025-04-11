export default function Footer() {
  return (
    <footer className="bg-secondary text-white py-6">
      <div className="container mx-auto px-4">
        <div className="flex flex-col md:flex-row justify-between items-center">
          <div className="mb-4 md:mb-0">
            <p className="text-sm">&copy; {new Date().getFullYear()} Stock Data Analyzer. All rights reserved.</p>
            <p className="text-xs text-muted mt-1">Data provided by Yahoo Finance API</p>
          </div>
          <div className="flex gap-6">
            <a href="#" className="text-sm hover:underline">Terms of Service</a>
            <a href="#" className="text-sm hover:underline">Privacy Policy</a>
            <a href="#" className="text-sm hover:underline">Contact Us</a>
          </div>
        </div>
      </div>
    </footer>
  );
}
