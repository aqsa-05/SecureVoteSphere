export default function Footer() {
  return (
    <footer className="bg-white border-t border-gray-200 py-4 mt-auto">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row items-center justify-between">
          <div className="text-sm text-gray-500">
            Secure AI-Driven Voting System v2.3.1
          </div>
          <div className="flex items-center space-x-4 mt-2 md:mt-0">
            <a href="#" className="text-sm text-gray-500 hover:text-gray-700">Privacy Policy</a>
            <a href="#" className="text-sm text-gray-500 hover:text-gray-700">Terms of Service</a>
            <a href="#" className="text-sm text-gray-500 hover:text-gray-700">Security</a>
            <a href="#" className="text-sm text-gray-500 hover:text-gray-700">Help</a>
          </div>
        </div>
      </div>
    </footer>
  );
}
