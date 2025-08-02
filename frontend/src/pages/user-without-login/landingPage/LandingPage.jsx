import React from "react";
import Header from "../componets/Header";
import Footer from "../componets/footer";


const LandingPage = () => {
  return (
    <div className="min-h-screen flex flex-col bg-background text-foreground">
      {/* Header */}
      <Header />

      {/* Page Content */}
      <main className="flex-grow p-6">
        <h1 className="text-3xl font-bold">Welcome to the Landing Page</h1>
        <p className="mt-4 text-lg">
          This is your main landing section. You can add hero banners, call-to-action, or features here.
        </p>
      </main>

      {/* Footer */}
      <Footer />
    </div>
  );
};

export default LandingPage;
