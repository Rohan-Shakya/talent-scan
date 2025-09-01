import { ReactNode } from "react";
import { SimpleHeader } from "../header/simple-header";

const MinimalLayout = ({ children }: { children: ReactNode }) => {
  return (
    <div className="flex min-h-screen flex-col bg-background text-white">
      <div className="min-h-screen container mx-auto flex flex-col items-center justify-center bg-surface py-4">
        <SimpleHeader />
        <main className="flex-1">{children}</main>
      </div>
    </div>
  );
};

export default MinimalLayout;
