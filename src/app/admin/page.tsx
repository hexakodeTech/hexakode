import React from "react";
import LoginForm from "@/components/admin/LoginForm";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Admin Login | HexaKode Console",
  description: "Secure authorization gateway for HexaKode Admin Management Console.",
};

export default function AdminLoginPage() {
  return <LoginForm />;
}
