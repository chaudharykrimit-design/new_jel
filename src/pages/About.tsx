import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { motion } from "framer-motion";
import { Shield, Award, Heart, Gem } from "lucide-react";

const About = () => {
  return (
    <div className="min-h-screen bg-background">
      <Header />
      <div className="bg-cream py-4">
        <div className="container mx-auto px-4">
          <div className="flex items-center gap-2 text-xs font-body text-muted-foreground">
            <a href="/" className="hover:text-primary transition-colors">Home</a>
            <span>/</span>
            <span className="text-foreground">About Us</span>
          </div>
        </div>
      </div>

      {/* Hero */}
      <section className="section-padding bg-secondary">
        <div className="container mx-auto text-center">
          <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }}>
            <span className="text-primary text-xs tracking-[0.3em] uppercase font-body font-medium">Our Story</span>
            <h1 className="font-display text-4xl md:text-5xl text-secondary-foreground mt-3 mb-4">About Aurum Jewels</h1>
            <p className="text-secondary-foreground/70 font-body max-w-2xl mx-auto leading-relaxed">
              Since 1985, Aurum Jewels has been at the forefront of fine jewelry craftsmanship in India.
              Our journey began in the historic lanes of Mumbai's Zaveri Bazaar, and today we bring the same
              tradition of excellence to customers across the nation.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Values */}
      <section className="section-padding bg-background">
        <div className="container mx-auto">
          <div className="text-center mb-12">
            <span className="text-primary text-xs tracking-[0.3em] uppercase font-body font-medium">What We Stand For</span>
            <h2 className="font-display text-3xl text-foreground mt-2">Our Values</h2>
            <div className="w-16 h-px bg-primary mx-auto mt-4" />
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {[
              { icon: Shield, title: "Purity Guaranteed", desc: "Every piece is BIS Hallmarked, ensuring the highest standards of gold purity." },
              { icon: Award, title: "Master Craftsmanship", desc: "Our artisans carry generations of expertise, creating jewelry that tells a story." },
              { icon: Heart, title: "Customer First", desc: "From selection to service, we ensure every interaction exceeds expectations." },
              { icon: Gem, title: "Ethical Sourcing", desc: "We source our materials responsibly, ensuring quality and sustainability." },
            ].map((v, i) => (
              <motion.div
                key={v.title}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className="text-center"
              >
                <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                  <v.icon className="w-7 h-7 text-primary" />
                </div>
                <h3 className="font-display text-lg text-foreground mb-2">{v.title}</h3>
                <p className="text-muted-foreground text-sm font-body leading-relaxed">{v.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Story */}
      <section className="section-padding bg-cream">
        <div className="container mx-auto max-w-3xl">
          <motion.div initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: true }} className="text-center">
            <span className="text-primary text-xs tracking-[0.3em] uppercase font-body font-medium">Heritage</span>
            <h2 className="font-display text-3xl text-foreground mt-2 mb-6">Our Journey</h2>
            <div className="space-y-4 text-foreground/70 font-body text-sm leading-relaxed text-left">
              <p>
                Founded in 1985 by master goldsmith Rajesh Mehta, Aurum Jewels began as a small workshop in Mumbai's
                iconic Zaveri Bazaar. With an unwavering commitment to quality and craftsmanship, the brand quickly
                gained recognition for its exquisite designs that seamlessly blend traditional Indian artistry with
                contemporary aesthetics.
              </p>
              <p>
                Over the decades, Aurum Jewels has grown from a single workshop to a beloved name trusted by thousands
                of families across India. Today, under the stewardship of the second generation, we continue the legacy
                of creating timeless pieces that become family heirlooms.
              </p>
              <p>
                Every piece at Aurum Jewels is crafted with BIS Hallmarked 22K gold, ensuring the highest standards
                of purity. Our master artisans bring together traditional techniques passed down through generations
                with modern precision, creating jewelry that is as much a work of art as it is a symbol of love and celebration.
              </p>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Stats */}
      <section className="py-16 bg-secondary">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
            {[
              { number: "40+", label: "Years of Heritage" },
              { number: "10,000+", label: "Happy Customers" },
              { number: "5,000+", label: "Unique Designs" },
              { number: "100%", label: "BIS Hallmarked" },
            ].map((s, i) => (
              <motion.div
                key={s.label}
                initial={{ opacity: 0, scale: 0.8 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
              >
                <span className="font-display text-3xl md:text-4xl gold-text font-bold">{s.number}</span>
                <p className="text-secondary-foreground/60 text-xs font-body tracking-wider uppercase mt-2">{s.label}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default About;
