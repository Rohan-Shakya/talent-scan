import { ReactNode } from "react";
import { Header } from "@/components/header";
import { Footer } from "@/components/footer";

const DefaultLayout = ({ children }: { children: ReactNode }) => {
  return (
    <div className="flex min-h-screen flex-col bg-background text-foreground">
      <Header />
      <main className="flex-1">{children}</main>
      <Footer />
    </div>
  );
};

export default DefaultLayout;
