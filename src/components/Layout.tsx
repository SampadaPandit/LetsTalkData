
import { useLocation } from "react-router-dom";
import { Navbar } from "./Navbar";
import { Footer } from "./Footer";
import { AdminNav } from "./AdminNav";

interface LayoutProps {
  children: React.ReactNode;
}

export const Layout = ({ children }: LayoutProps) => {
  const location = useLocation();
  const isAdminPage = location.pathname.startsWith('/admin') && location.pathname !== '/admin/login';

  return (
    <div className="flex flex-col min-h-screen">
      <AdminNav />
      {!isAdminPage && <Navbar />}
      <main className="flex-1">{children}</main>
      <Footer />
    </div>
  );
}
