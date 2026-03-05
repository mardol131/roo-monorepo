import React from "react";
import Sidebar from "./components/sidebar";

type Props = {
  children: React.ReactNode;
};

export default function layout({ children }: Props) {
  return (
    <div>
      <div className="flex min-h-screen bg-zinc-50">
        <Sidebar />
        <div className="flex-1 flex justify-center">
          <div className="max-w-4xl w-full flex flex-col px-8 py-10">
            {children}
          </div>
        </div>
      </div>
    </div>
  );
}
