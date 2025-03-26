import React from 'react';
import Header from './Header';
import Sidebar_MainContent from './Sidebar_MainContent';

const Layout: React.FC = () => {
  return (
    <div className="flex flex-col h-screen w-full bg-[#f4f4f4]">
      <Header />
      <div className="flex flex-row flex-grow justify-center align-middle p-4">
        <Sidebar_MainContent />
      </div>
    </div>
  );
};

export default Layout;