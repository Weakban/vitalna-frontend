import Footer from "@/components/Footer";
import Navbar from "@/components/Navbar";
import { Toaster } from "@/components/ui/toaster";
import { Outlet } from "react-router-dom";
//import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
//import Logo from "@/components/logo"

export default function AppLayout() {
  return (
    <>
      <Navbar />
      <Outlet />
      <Toaster />
      <Footer />
    </>
  );
}

// <ToastContainer />
