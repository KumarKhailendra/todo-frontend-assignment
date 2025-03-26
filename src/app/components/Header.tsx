import React from 'react';
import Image from 'next/image';
import Link from 'next/link';

const Header: React.FC = () => {
  return (
    <div className="flex items-center justify-between w-full min-w-[401px] h-[72px] bg-white shadow-md px-4">
      <Link href="/" className="flex items-center gap-2">
        <div className="w-[32px] h-[30px] relative">
          <Image 
            src="https://figma-alpha-api.s3.us-west-2.amazonaws.com/images/66605816-4457-4cd9-871b-ccb6a991698d" 
            alt="Logo" 
            fill
            className="object-contain"
          />
        </div>
        <span className="font-inter font-bold text-[25px] text-black">TODO</span>
      </Link>
      
    </div>
  );
};

export default Header;

