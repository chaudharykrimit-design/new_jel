import { useParams } from "react-router-dom";
import Header from "@/components/Header";
import Footer from "@/components/Footer";

const policyContent: Record<string, { title: string; content: string }> = {
  shipping: {
    title: "Shipping Policy",
    content: `
## Domestic Shipping

We offer **free shipping** on all orders above ₹25,000 across India. For orders below ₹25,000, a flat shipping charge of ₹500 applies.

### Delivery Timeline
- **Metro cities** (Mumbai, Delhi, Bangalore, Chennai, Hyderabad, Kolkata): 3-5 business days
- **Other cities**: 5-7 business days
- **Remote areas**: 7-10 business days

### Shipping Partners
All our orders are shipped through trusted and insured logistics partners to ensure the safety of your precious jewelry.

### Packaging
- Every piece is carefully placed in our signature luxury box
- Jewelry is wrapped in anti-tarnish tissue paper
- Package is sealed and tamper-proof
- Insurance is included for all shipments

### Order Tracking
Once your order is shipped, you will receive a tracking number via email and SMS. You can track your order through your account dashboard.

### Important Notes
- Signature is required upon delivery for all jewelry shipments
- Delivery attempts will be made up to 3 times
- Undelivered packages will be returned to our warehouse after the 3rd attempt
    `,
  },
  returns: {
    title: "Return & Exchange Policy",
    content: `
## 15-Day Return Policy

We want you to be completely satisfied with your purchase. If for any reason you're not, you can return your jewelry within 15 days of delivery.

### Return Conditions
- Item must be in its **original condition** with all tags attached
- Item must be in the **original packaging** with the certificate of authenticity
- Item must not show signs of wear, alteration, or damage
- Return request must be raised within **15 days** of delivery

### Exchange Policy
- We offer **100% exchange value** on all gold jewelry (excluding making charges)
- Exchange is available for a different design, size, or category
- The gold rate applicable will be the **current market rate** at the time of exchange

### Refund Process
- Refunds are processed within **7-10 business days** after we receive the returned item
- Refund will be credited to the original payment method
- Making charges and GST may be deducted from the refund amount

### How to Initiate a Return
1. Log in to your account and go to "My Orders"
2. Select the order and click "Request Return"
3. Our team will arrange a secure pickup from your address
4. Item will be inspected and refund/exchange will be processed

### Non-Returnable Items
- Customized or personalized jewelry
- Items purchased during final sale promotions
- Gift cards
    `,
  },
  privacy: {
    title: "Privacy Policy",
    content: `
## Your Privacy Matters

At Aurum Jewels, we are committed to protecting your personal information. This Privacy Policy describes how we collect, use, and safeguard your data.

### Information We Collect
- **Personal Information**: Name, email, phone number, shipping address
- **Payment Information**: Payment method details (processed securely through payment gateways)
- **Browsing Data**: Pages viewed, products browsed, search queries
- **Device Information**: Browser type, IP address, device type

### How We Use Your Information
- To process and fulfill your orders
- To communicate order updates and delivery status
- To provide customer support
- To send promotional offers (with your consent)
- To improve our website and services

### Data Security
- All data is encrypted using industry-standard SSL/TLS protocols
- Payment information is never stored on our servers
- We maintain strict access controls for employee data access
- Regular security audits are conducted

### Your Rights
- **Access**: You can request a copy of your personal data
- **Correction**: You can update or correct your information
- **Deletion**: You can request deletion of your account and data
- **Opt-out**: You can unsubscribe from marketing communications at any time

### Cookies
We use cookies to enhance your browsing experience. You can manage your cookie preferences through your browser settings.

### Contact
For privacy-related queries, contact us at **privacy@aurumjewels.com**
    `,
  },
  terms: {
    title: "Terms & Conditions",
    content: `
## Terms of Service

By accessing and using the Aurum Jewels website, you agree to be bound by these Terms and Conditions.

### Account Registration
- You must be at least 18 years old to create an account
- You are responsible for maintaining the confidentiality of your account credentials
- You agree to provide accurate and current information

### Product Information
- Product images are for representation purposes and may vary slightly from the actual product
- Gold weight mentioned is approximate and may vary by ±2%
- Prices are subject to change based on live gold rates
- All jewelry is BIS Hallmarked 22K gold unless otherwise specified

### Pricing & Payment
- All prices are in Indian Rupees (INR) and inclusive of GST
- Prices are calculated based on: Gold Rate × Weight + Making Charges + GST (3%)
- We accept Cash on Delivery (COD), UPI, and major credit/debit cards
- Gold rates are updated in real-time from market sources

### Order Cancellation
- Orders can be cancelled within **2 hours** of placement
- Once the order is shipped, cancellation is not possible
- Cancelled orders will receive a full refund within 5-7 business days

### Intellectual Property
- All content on the website (images, text, designs) is the property of Aurum Jewels
- Unauthorized reproduction or distribution is prohibited

### Limitation of Liability
- Aurum Jewels shall not be liable for any indirect, incidental, or consequential damages
- Our total liability shall not exceed the purchase amount of the product in question

### Governing Law
These terms are governed by the laws of India. Any disputes shall be subject to the jurisdiction of courts in Mumbai, Maharashtra.

### Contact
For any questions regarding these terms, contact us at **legal@aurumjewels.com**
    `,
  },
};

const Policies = () => {
  const { type } = useParams<{ type: string }>();
  const policy = policyContent[type || "shipping"];

  if (!policy) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <div className="flex items-center justify-center h-[60vh]">
          <p className="font-display text-xl text-foreground/50">Policy not found</p>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <div className="bg-cream py-4">
        <div className="container mx-auto px-4">
          <div className="flex items-center gap-2 text-xs font-body text-muted-foreground">
            <a href="/" className="hover:text-primary transition-colors">Home</a>
            <span>/</span>
            <span className="text-foreground">{policy.title}</span>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-12 md:py-16">
        <div className="max-w-3xl mx-auto">
          <h1 className="font-display text-3xl text-foreground mb-8">{policy.title}</h1>
          <div
            className="prose prose-sm max-w-none font-body
              prose-headings:font-display prose-headings:text-foreground
              prose-h2:text-xl prose-h2:mt-8 prose-h2:mb-4
              prose-h3:text-base prose-h3:mt-6 prose-h3:mb-3
              prose-p:text-foreground/70 prose-p:leading-relaxed
              prose-li:text-foreground/70
              prose-strong:text-foreground
              prose-ul:space-y-1"
            dangerouslySetInnerHTML={{ __html: markdownToHtml(policy.content) }}
          />
        </div>
      </div>
      <Footer />
    </div>
  );
};

// Simple markdown-to-HTML converter for policy content
function markdownToHtml(md: string): string {
  return md
    .replace(/^### (.+)$/gm, '<h3>$1</h3>')
    .replace(/^## (.+)$/gm, '<h2>$1</h2>')
    .replace(/^\- (.+)$/gm, '<li>$1</li>')
    .replace(/(<li>.*<\/li>\n?)+/gs, (m) => `<ul>${m}</ul>`)
    .replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>')
    .replace(/^\d+\.\s+(.+)$/gm, '<li>$1</li>')
    .replace(/\n\n/g, '</p><p>')
    .replace(/^(?!<[hul])/gm, '')
    .replace(/<p><\/p>/g, '')
    ;
}

export default Policies;
