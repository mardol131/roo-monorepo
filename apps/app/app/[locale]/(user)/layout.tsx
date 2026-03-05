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
        {children}
      </div>
    </div>
  );
}
