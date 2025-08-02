import React from "react";
import Header from "../componets/Header";
import Footer from "../componets/footer";


const AboutUs = () => {
  return (
    <div className="min-h-screen flex flex-col bg-background text-foreground">
      {/* Header */}
      <Header />

      {/* Page Content */}
      <main className="flex-grow px-6 py-12 max-w-5xl mx-auto">
        <h1 className="text-4xl font-bold text-center mb-6">About Us</h1>
        <p className="text-lg text-muted-foreground text-center max-w-3xl mx-auto mb-12">
          At <span className="text-primary font-semibold">MyApp</span>, we are
          dedicated to delivering high-quality solutions that make your digital
          life easier. Our team is passionate about innovation, user experience,
          and building tools that truly help people.
        </p>

        {/* Mission & Vision */}
        <div className="grid md:grid-cols-2 gap-8 mb-12">
          <div className="p-6 rounded-2xl shadow-md bg-card">
            <h2 className="text-2xl font-semibold mb-3">Our Mission</h2>
            <p className="text-muted-foreground">
              To empower individuals and businesses by providing intuitive,
              reliable, and innovative digital products that drive growth and
              success.
            </p>
          </div>
          <div className="p-6 rounded-2xl shadow-md bg-card">
            <h2 className="text-2xl font-semibold mb-3">Our Vision</h2>
            <p className="text-muted-foreground">
              To be a leading platform recognized globally for transforming
              ideas into impactful solutions that improve lives.
            </p>
          </div>
        </div>

        {/* Team Section */}
        <section>
          <h2 className="text-3xl font-bold text-center mb-8">Meet Our Team</h2>
          <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-8">
            <div className="p-6 rounded-2xl shadow-md bg-card text-center">
              <div className="w-24 h-24 mx-auto rounded-full bg-primary mb-4"></div>
              <h3 className="text-xl font-semibold">John Doe</h3>
              <p className="text-muted-foreground">CEO & Founder</p>
            </div>
            <div className="p-6 rounded-2xl shadow-md bg-card text-center">
              <div className="w-24 h-24 mx-auto rounded-full bg-primary mb-4"></div>
              <h3 className="text-xl font-semibold">Jane Smith</h3>
              <p className="text-muted-foreground">CTO</p>
            </div>
            <div className="p-6 rounded-2xl shadow-md bg-card text-center">
              <div className="w-24 h-24 mx-auto rounded-full bg-primary mb-4"></div>
              <h3 className="text-xl font-semibold">Mark Lee</h3>
              <p className="text-muted-foreground">Lead Designer</p>
            </div>
          </div>
        </section>
      </main>

      {/* Footer */}
      <Footer />
    </div>
  );
};

export default AboutUs;
