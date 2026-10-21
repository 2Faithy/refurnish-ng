
import Link from "next/link";

const terms = [
  {
    id: "introduction",
    title: "1. Introduction and Acceptance",
    content:
      "Welcome to RefurnishNG. These Terms of Use govern your access to and use of https://refurnishng.com/, our marketplace, accounts, communications and related services. By accessing or using the Services, you agree to these Terms and our Privacy Policy. If you do not agree, please do not use the Services.",
  },
  {
    id: "definitions",
    title: "2. Definitions",
    content:
      "“Refurnish”, “we”, “us” and “our” refer to RefurnishNG and the entity operating the Services. “You” and “your” refer to a visitor, customer, seller or other user. “Seller” includes participating brands, retailers, artisans, individuals and other providers. “Content” includes text, photographs, product information, reviews, designs, software and other materials made available through the Services.",
  },
  {
    id: "eligibility",
    title: "3. Eligibility and Account Registration",
    content:
      "You must provide accurate information when creating an account or completing a transaction. You are responsible for maintaining the confidentiality of your credentials and for activity conducted through your account. If you act for a company or other organisation, you represent that you have authority to bind that entity.",
  },
  {
    id: "use",
    title: "4. Use of the Services",
    content:
      "The Services help users discover, compare and purchase furniture, décor and related products and services. You may use the Services only for lawful purposes and in accordance with these Terms. You must not interfere with the operation or security of the Services or access them through unauthorised means.",
  },
  {
    id: "marketplace",
    title: "5. The Refurnish Marketplace",
    content:
      "Refurnish provides a marketplace that may connect customers with participating sellers and suppliers. Depending on the transaction, Refurnish may facilitate discovery, communications, payment, logistics or fulfilment. Refurnish is not necessarily the manufacturer, owner or seller of every product listed on the platform.",
  },
  {
    id: "sellers",
    title: "6. Sellers, Brands and Other Suppliers",
    content:
      "Sellers are responsible for the products and services they offer, including the accuracy of listings, lawful sale, quality, availability, fulfilment and applicable warranties or guarantees. Refurnish may establish seller standards, review listings and suspend or remove sellers or listings that breach applicable requirements.",
  },
  {
    id: "listings",
    title: "7. Product Listings and Information",
    content:
      "We seek to present useful and accurate product information, but listings may contain information supplied by third parties and may change. Product photographs, colours, dimensions, materials and other specifications may vary from actual products. Users should review the applicable listing and seller information before ordering.",
  },
  {
    id: "orders",
    title: "8. Orders, Availability and Acceptance",
    content:
      "An order is a request to purchase. Refurnish or the relevant seller may accept, reject or cancel an order where a product is unavailable, a pricing or listing error occurs, payment cannot be confirmed, fraud is suspected or other legitimate circumstances arise. Order confirmation does not remove any mandatory consumer rights.",
  },
  {
    id: "payments",
    title: "9. Prices, Payments and Taxes",
    content:
      "Prices and applicable delivery or service charges will be presented during the transaction where reasonably possible. Payments may be processed through third-party payment providers. You authorise the applicable payment provider to process the transaction and agree to provide accurate billing information. Taxes or statutory charges may apply depending on the transaction.",
  },
  {
    id: "delivery",
    title: "10. Delivery and Fulfilment",
    content:
      "Delivery times and methods vary by product, seller, destination and logistics provider. Refurnish may coordinate or facilitate delivery, but delivery estimates are not guarantees unless expressly stated. Delays may arise from inventory constraints, traffic, weather, logistics disruptions, public events or other circumstances outside reasonable control.",
  },
  {
    id: "returns",
    title: "11. Returns, Cancellations and Refunds",
    content:
      "Return, cancellation and refund rights depend on the product, seller, transaction terms and applicable Nigerian consumer law. Any applicable product-specific policy will be presented where relevant. Nothing in these Terms is intended to exclude a mandatory consumer right.",
  },
  {
    id: "promotions",
    title: "12. Promotions and Offers",
    content:
      "Promotions, discounts, credits and other offers may be subject to additional terms, eligibility requirements, expiry dates and availability. Refurnish may correct obvious pricing or promotional errors and may withdraw an offer where permitted by law.",
  },
  {
    id: "reviews",
    title: "13. Reviews, Comments and User Content",
    content:
      "Users who submit reviews, photographs, comments or other content must ensure that the content is truthful, lawful and does not infringe another person's rights. By submitting content, you grant Refurnish a non-exclusive, royalty-free, worldwide licence to host, reproduce, display and use it for operating, improving and promoting the Services, subject to applicable law and our Privacy Policy. We may remove content that breaches these Terms.",
  },
  {
    id: "prohibited",
    title: "14. Prohibited Activities",
    content:
      "You must not use the Services for fraud, deception, unlawful sales, harassment, impersonation, unauthorised access, malware distribution, manipulation of reviews or transactions, infringement of intellectual property or privacy rights, scraping or automated extraction without permission, or any activity that could harm users or the Services.",
  },
  {
    id: "intellectual-property",
    title: "15. Intellectual Property",
    content:
      "The Refurnish name, branding, website, software, design and materials owned or licensed by Refurnish are protected by applicable intellectual property laws. Except as expressly permitted, you may not copy, reproduce, modify, distribute, sell, publish or commercially exploit Refurnish materials without prior written permission.",
  },
  {
    id: "third-party",
    title: "16. Third-Party Sites and Services",
    content:
      "The Services may contain links, integrations or services operated by third parties, including payment processors, logistics providers, authentication providers and other technology partners. Third-party services may have their own terms and privacy policies. Refurnish is not responsible for independent third-party services or content except to the extent required by applicable law.",
  },
  {
    id: "privacy",
    title: "17. Privacy",
    content:
      "Our Privacy Policy explains how Refurnish collects, uses, stores, protects and shares personal information. It forms part of these Terms and is available at https://refurnishng.com/privacy-policy. If you use Google Sign-In, the Privacy Policy describes the Google account information Refurnish may receive and how that information is handled.",
  },
  {
    id: "disclaimers",
    title: "18. Disclaimers",
    content:
      "To the extent permitted by law, the Services and marketplace information are provided on an “as available” basis. Refurnish does not guarantee uninterrupted access, complete accuracy of third-party information or that every product or service will remain available. Nothing in these Terms excludes or limits a right or liability that cannot lawfully be excluded.",
  },
  {
    id: "liability",
    title: "19. Limitation of Liability",
    content:
      "To the maximum extent permitted by applicable law, Refurnish will not be liable for indirect, incidental, special or consequential losses arising from use of the Services. Where Refurnish is liable for a claim that cannot lawfully be excluded, liability will be limited to the extent permitted by law. This section does not override mandatory consumer protections.",
  },
  {
    id: "indemnification",
    title: "20. Indemnification",
    content:
      "To the extent permitted by law, you agree to be responsible for reasonable losses, claims or costs arising from your unlawful use of the Services, material breach of these Terms, infringement of third-party rights or fraud or wilful misconduct.",
  },
  {
    id: "suspension",
    title: "21. Suspension and Termination",
    content:
      "We may suspend or terminate access where necessary to protect users, the Services or our legal interests, including where a user breaches these Terms, engages in fraud, creates a security risk or uses the Services unlawfully. You may stop using the Services at any time.",
  },
  {
    id: "changes",
    title: "22. Changes to the Services and Terms",
    content:
      "The Services, products, features and these Terms may change over time. Material changes may be communicated through the Services or to the contact details associated with your account where appropriate. The effective date will identify the current version. Continued use after changes take effect constitutes acceptance to the extent permitted by law.",
  },
  {
    id: "governing-law",
    title: "23. Governing Law and Dispute Resolution",
    content:
      "These Terms are governed by the laws of the Federal Republic of Nigeria, subject to mandatory consumer rights. We encourage users to contact Refurnish first to resolve disputes. Where a dispute cannot be resolved informally, the parties may use mediation, arbitration or competent courts as permitted or required by applicable Nigerian law.",
  },
  {
    id: "general",
    title: "24. General Provisions",
    content:
      "If any provision is found invalid or unenforceable, the remaining provisions remain effective. Failure to enforce a provision is not a waiver. These Terms, together with applicable additional terms and the Privacy Policy, constitute the agreement governing use of the Services.",
  },
  {
    id: "contact",
    title: "25. Contact",
    content:
      "For questions about these Terms, please use the contact information published on https://refurnishng.com/.",
  },
];

export default function TermsPage() {
  return (
    <main className="min-h-screen bg-[#FAF4EC] text-[#211000]">
      <header className="bg-[#211000] text-[#FAF4EC]">
        <div className="mx-auto max-w-6xl px-5 py-16 sm:px-8 sm:py-20">
          <p className="mb-4 text-xs font-bold uppercase tracking-[0.25em] text-[#E8CEB0]">
            RefurnishNG · Legal
          </p>
          <h1 className="font-serif text-4xl font-medium sm:text-6xl">
            Terms of Use
          </h1>
          <p className="mt-5 max-w-2xl text-sm leading-7 text-white/70 sm:text-base">
            Please read these terms carefully before using the RefurnishNG
            marketplace, creating an account or placing an order.
          </p>
          <p className="mt-6 text-xs text-white/60">
            Effective date: 11 August 2026
          </p>
          <Link
            href="/privacy-policy"
            className="mt-4 inline-block text-sm text-[#E8CEB0] underline underline-offset-4 hover:text-white"
          >
            Read our Privacy Policy
          </Link>
        </div>
      </header>

      <div className="mx-auto grid max-w-6xl gap-8 px-5 py-10 sm:px-8 sm:py-14 lg:grid-cols-[260px_minmax(0,1fr)]">
        <aside className="h-fit rounded-2xl border border-[#211000]/10 bg-white p-5 lg:sticky lg:top-8">
          <h2 className="mb-4 text-xs font-bold uppercase tracking-widest text-[#B66B44]">
            On this page
          </h2>
          <nav aria-label="Terms of Use sections">
            <ol className="space-y-3">
              {terms.map((term) => (
                <li key={term.id}>
                  <a
                    href={`#${term.id}`}
                    className="text-sm leading-5 text-[#211000]/65 hover:text-[#B66B44]"
                  >
                    {term.title}
                  </a>
                </li>
              ))}
            </ol>
          </nav>
        </aside>

        <article className="min-w-0 rounded-2xl border border-[#211000]/10 bg-white p-5 sm:p-9">
          <div className="mb-9 rounded-xl border border-[#E8CEB0] bg-[#FAF4EC] p-5">
            <p className="text-sm leading-7 text-[#211000]/75">
              These Terms describe the rules for using RefurnishNG and the
              general responsibilities of users, buyers and sellers. Please
              read them together with our Privacy Policy and any
              transaction-specific terms presented to you.
            </p>
          </div>

          <div className="space-y-9">
            {terms.map((term) => (
              <section
                key={term.id}
                id={term.id}
                className="scroll-mt-8 border-b border-[#211000]/10 pb-8 last:border-0 last:pb-0"
              >
                <h2 className="font-serif text-xl font-medium sm:text-2xl">
                  {term.title}
                </h2>
                <p className="mt-3 text-sm leading-7 text-[#211000]/70 sm:text-[15px]">
                  {term.content}
                </p>
              </section>
            ))}
          </div>

          <section className="mt-10 rounded-2xl bg-[#211000] p-6 text-[#FAF4EC]">
            <h2 className="font-serif text-2xl font-medium">
              Need help?
            </h2>
            <p className="mt-2 text-sm leading-6 text-white/70">
              Contact our support team if you have questions about these Terms
              or need help using RefurnishNG.
            </p>
            <Link
              href="/support"
              className="mt-5 inline-flex rounded-full bg-[#B66B44] px-5 py-3 text-xs font-bold uppercase tracking-wider text-white hover:bg-[#a05934]"
            >
              Contact support
            </Link>
          </section>
        </article>
      </div>

      <footer className="border-t border-[#211000]/10">
        <div className="mx-auto flex max-w-6xl flex-col gap-3 px-5 py-7 text-xs text-[#211000]/50 sm:flex-row sm:items-center sm:justify-between sm:px-8">
          <p>© {new Date().getFullYear()} RefurnishNG. All rights reserved.</p>
          <div className="flex gap-4">
            <Link href="/terms" className="hover:text-[#B66B44]">
              Terms of Use
            </Link>
            <Link href="/privacy-policy" className="hover:text-[#B66B44]">
              Privacy Policy
            </Link>
          </div>
        </div>
      </footer>
    </main>
  );
}
