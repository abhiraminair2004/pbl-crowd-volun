import React from 'react';

const Footer: React.FC = () => {
  return (
    <footer className="bg-white py-8">
      <div className="container mx-auto px-4">
        <div className="text-center text-gray-600">
          <p>© {new Date().getFullYear()} VeridaX. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;