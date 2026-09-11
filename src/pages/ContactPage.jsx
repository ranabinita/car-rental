import React, { useState } from "react";
import { Phone, Mail, MapPin, Send } from "lucide-react";

export default function ContactPage() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    message: "",
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log("Form Submitted:", formData);
    alert("Thank you! We will get back to you shortly.");
  };

  return (
    <div className="wrap" style={{ padding: "60px 32px", minHeight: "70vh" }}>
      <div style={{ marginBottom: "40px" }}>
        <span className="kicker">Get in Touch</span>
        <h2>Contact Spark Car</h2>
        <p style={{ color: "#5b5b52", marginTop: "12px", maxWidth: "60ch" }}>
          Have questions about vehicle rentals, driver bookings, or custom routes across Nepal? Reach out to our team anytime.
        </p>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "1fr 1.2fr", gap: "48px" }}>
        {/* Contact Information Column */}
        <div style={{ display: "flex", flexDirection: "column", gap: "28px" }}>
          <div style={{ display: "flex", gap: "16px", alignItems: "center" }}>
            <div style={{ width: 44, height: 44, borderRadius: "50%", background: "var(--ink)", display: "flex", alignItems: "center", justifyContent: "center", color: "#fff" }}>
              <Phone size={20} />
            </div>
            <div>
              <div style={{ fontSize: "13px", color: "#5b5b52" }}>Call Us</div>
              <div style={{ fontWeight: 600 }}>+977 1-4XXXXXX / +977 98XXXXXXXX</div>
            </div>
          </div>

          <div style={{ display: "flex", gap: "16px", alignItems: "center" }}>
            <div style={{ width: 44, height: 44, borderRadius: "50%", background: "var(--ink)", display: "flex", alignItems: "center", justifyContent: "center", color: "#fff" }}>
              <Mail size={20} />
            </div>
            <div>
              <div style={{ fontSize: "13px", color: "#5b5b52" }}>Email Us</div>
              <div style={{ fontWeight: 600 }}>support@sparkcar.org</div>
            </div>
          </div>

          <div style={{ display: "flex", gap: "16px", alignItems: "center" }}>
            <div style={{ width: 44, height: 44, borderRadius: "50%", background: "var(--ink)", display: "flex", alignItems: "center", justifyContent: "center", color: "#fff" }}>
              <MapPin size={20} />
            </div>
            <div>
              <div style={{ fontSize: "13px", color: "#5b5b52" }}>Main Office</div>
              <div style={{ fontWeight: 600 }}>Thamel, Kathmandu, Nepal</div>
            </div>
          </div>
        </div>

        {/* Self-contained Contact Form */}
        <form onSubmit={handleSubmit} style={{ background: "#fff", padding: "32px", borderRadius: "16px", border: "1px solid var(--line)", display: "flex", flexDirection: "column", gap: "16px" }}>
          <div>
            <label style={{ fontSize: "13px", fontWeight: 600, display: "block", marginBottom: "6px" }}>Full Name</label>
            <input
              type="text"
              required
              placeholder="Your Name"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              style={{ width: "100%", padding: "12px", borderRadius: "8px", border: "1px solid var(--line)" }}
            />
          </div>

          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "16px" }}>
            <div>
              <label style={{ fontSize: "13px", fontWeight: 600, display: "block", marginBottom: "6px" }}>Email</label>
              <input
                type="email"
                required
                placeholder="name@example.com"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                style={{ width: "100%", padding: "12px", borderRadius: "8px", border: "1px solid var(--line)" }}
              />
            </div>
            <div>
              <label style={{ fontSize: "13px", fontWeight: 600, display: "block", marginBottom: "6px" }}>Phone</label>
              <input
                type="tel"
                placeholder="+977"
                value={formData.phone}
                onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                style={{ width: "100%", padding: "12px", borderRadius: "8px", border: "1px solid var(--line)" }}
              />
            </div>
          </div>

          <div>
            <label style={{ fontSize: "13px", fontWeight: 600, display: "block", marginBottom: "6px" }}>Message</label>
            <textarea
              rows={4}
              required
              placeholder="How can we help you?"
              value={formData.message}
              onChange={(e) => setFormData({ ...formData, message: e.target.value })}
              style={{ width: "100%", padding: "12px", borderRadius: "8px", border: "1px solid var(--line)", fontFamily: "inherit" }}
            />
          </div>

          <button type="submit" className="btn-primary" style={{ justifyContent: "center", marginTop: "8px" }}>
            Send Message <Send size={16} />
          </button>
        </form>
      </div>
    </div>
  );
}