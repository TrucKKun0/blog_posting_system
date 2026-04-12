import AppSiderbar from "@/components/ui/AppSiderbar";
import Footer from "@/components/ui/Footer";
import { SidebarProvider } from "@/components/ui/sidebar";
import Topbar from "@/components/ui/Topbar";
import React from "react";
import { Outlet } from "react-router-dom";

const Layout = () => {
  return (
    
    <SidebarProvider>
        <Topbar />
        <AppSiderbar/>
      <main className='w-full'>
        <div className='w-500 min-h-[calc(100vh-45px)] py-28 px-8'>
        <Outlet /> {/* Page Content will be rendered here */}
        </div>
        <Footer />
      </main>
    </SidebarProvider>

  );
};

export default Layout;

