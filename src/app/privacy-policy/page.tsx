
import Link from "next/link";

const sections = [
  {
    id: "introduction",
    title: "1. Introduction",
    paragraphs: [
      "Welcome to RefurnishNG. We respect your privacy and are committed to protecting the personal information you share with us when you visit our website, create an account, browse products, place orders, sell products, or contact our team.",
      "This Privacy Policy explains the types of personal information that may be collected, how it may be used and shared, how it may be protected, and the choices available to you.",
      "By using RefurnishNG, you acknowledge that you have read this Privacy Policy. Where consent is required by applicable law, we will seek it before processing your information for the relevant purpose.",
    ],
  },
  {
    id: "information-we-collect",
    title: "2. Information We Collect",
    paragraphs: [
      "The information we collect depends on how you use RefurnishNG and the features you choose to access.",
      "Information you may provide directly includes your name, email address, telephone number, account credentials, delivery address, billing details, messages to customer support, product reviews, and information you submit when registering as a seller.",
      "If you buy or sell products through the platform, we may process information associated with your orders, listings, transactions, deliveries, returns, disputes, and refunds.",
      "We may also collect technical and usage information, such as your IP address, browser type, device information, pages visited, approximate location derived from technical data, and interactions with our website, where permitted by law.",
      "Please do not submit information that is unnecessary for the service you are using, particularly sensitive personal information.",
    ],
  },
  {
    id: "how-we-collect",
    title: "3. How We Collect Information",
    paragraphs: [
      "We may collect information when you create or update an account, browse our website, place an order, list a product, contact customer support, submit a review, participate in a promotion, or otherwise interact with RefurnishNG.",
      "Some information may be generated automatically through website logs, cookies, and similar technologies, depending on the tools enabled on our platform.",
      "We may receive relevant information from service providers or transaction partners involved in delivering services to you, where permitted by law and necessary for the relevant purpose.",
    ],
  },
  {
    id: "how-we-use",
    title: "4. How We Use Your Information",
    paragraphs: [
      "Subject to applicable law, RefurnishNG may use personal information to:",
    ],
    bullets: [
      "Create, maintain, and secure user accounts.",
      "Process orders, payments, deliveries, returns, refunds, and seller transactions.",
      "Communicate order updates, account notices, and customer support responses.",
      "Help buyers and sellers coordinate transactions and fulfilment.",
      "Detect, investigate, and prevent fraud, abuse, unauthorised activity, and violations of our terms.",
      "Maintain, troubleshoot, improve, and develop our website and services.",
      "Respond to complaints, disputes, and legal requests.",
      "Send promotional communications where permitted and, when required, with your consent.",
      "Meet applicable legal, regulatory, accounting, and recordkeeping obligations.",
    ],
  },
  {
    id: "legal-basis",
    title: "5. Legal Grounds for Processing",
    paragraphs: [
      "Where applicable data protection law requires a lawful basis for processing, we will process personal information on an appropriate basis. Depending on the circumstances, this may include your consent, the performance of a contract or steps requested before entering into a contract, compliance with a legal obligation, protection of vital interests, performance of a task carried out in the public interest where applicable, or a legitimate interest that does not override your rights.",
      "Where we rely on consent, you may withdraw it, subject to legal requirements and the consequences explained when consent was obtained. Withdrawal does not affect processing that was lawful before withdrawal.",
    ],
  },
  {
    id: "orders-and-payments",
    title: "6. Orders, Payments, and Transactions",
    paragraphs: [
      "When you place an order or sell an item, we process the information necessary to manage the transaction, including order details, contact information, delivery information, payment status, and relevant communications.",
      "Payment information may be processed by third-party payment service providers. Where a provider handles payment card or bank information directly, its own privacy and security practices may also apply. Please review the relevant provider's terms and privacy information.",
      "RefurnishNG should collect or retain full payment card details only if its payment arrangements and security controls are specifically designed and authorised for that purpose. Do not submit payment credentials through ordinary support messages.",
      "We may retain transaction records for customer service, fraud prevention, accounting, dispute resolution, and compliance with applicable legal obligations.",
    ],
  },
  {
    id: "buyers-and-sellers",
    title: "7. Information Shared Between Buyers and Sellers",
    paragraphs: [
      "RefurnishNG connects buyers and sellers. To facilitate a transaction, relevant information may be shared between the parties, such as a buyer's name, contact details, delivery information, order details, and information about the item purchased.",
      "Sellers should use buyer information only for legitimate purposes connected with the transaction, delivery, customer service, and applicable legal obligations. Sellers must not use buyer information for unrelated marketing, sell it, or disclose it to unauthorised persons.",
      "Users should exercise care when sharing personal information with other users. Please report suspected misuse of information to RefurnishNG.",
    ],
  },
  {
    id: "sharing-information",
    title: "8. When We Share Information",
    paragraphs: [
      "We do not treat personal information as public simply because you use our platform. We may share information when reasonably necessary for the purposes described in this Policy and as permitted by law.",
    ],
    bullets: [
      "With buyers, sellers, and delivery partners when needed to complete a transaction.",
      "With hosting providers, payment providers, communications services, analytics providers, and other service providers engaged to support the platform.",
      "With professional advisers, auditors, insurers, or financial institutions where necessary.",
      "With regulators, law enforcement, courts, or other authorities where disclosure is legally required or permitted.",
      "In connection with a proposed or completed business restructuring, merger, acquisition, or transfer, subject to appropriate safeguards and applicable law.",
      "With your consent or at your direction.",
    ],
  },
  {
    id: "cookies",
    title: "9. Cookies and Similar Technologies",
    paragraphs: [
      "Our website may use cookies and similar technologies to support essential functionality, remember preferences, maintain sessions, understand website performance, and improve the user experience.",
      "The types of cookies used depend on the technologies enabled on the website. Where required by law, we will request consent before using non-essential cookies or similar technologies.",
      "You may be able to manage cookies through your browser settings or any cookie preference controls provided on the website. Disabling certain cookies may affect the availability or operation of some features.",
    ],
  },
  {
    id: "marketing",
    title: "10. Marketing and Communications",
    paragraphs: [
      "We may send service-related communications about account activity, orders, transactions, security, and changes to our policies where necessary.",
      "Where permitted by law, we may also send product updates, promotions, or other marketing communications. If consent is required, we will obtain it before sending those communications.",
      "You can opt out of marketing emails by using the unsubscribe instructions provided in the message or contacting us. Even if you opt out, we may still send important non-marketing communications about your account or transactions.",
    ],
  },
  {
    id: "retention",
    title: "11. How Long We Keep Information",
    paragraphs: [
      "We retain personal information only for as long as reasonably necessary for the purposes described in this Policy, including providing our services, maintaining transaction records, resolving disputes, enforcing agreements, preventing fraud, and meeting legal obligations.",
      "Retention periods vary according to the type of information, the reason it was collected, applicable legal requirements, and whether a dispute or investigation requires continued retention.",
      "When information is no longer required, we will take appropriate steps to delete it, anonymise it, or securely dispose of it, subject to applicable law and legitimate recordkeeping needs.",
    ],
  },
  {
    id: "security",
    title: "12. Data Security",
    paragraphs: [
      "We take reasonable technical and organisational measures designed to protect personal information against unauthorised access, loss, misuse, alteration, or disclosure.",
      "No website, online service, or method of electronic storage can be guaranteed to be completely secure. We therefore cannot promise absolute security.",
      "You are responsible for keeping your password confidential, using a secure device, and notifying us promptly if you suspect unauthorised access to your account.",
      "If a personal data breach occurs, we will assess and respond to it in accordance with applicable legal requirements, including any applicable notification obligations.",
    ],
  },
  {
    id: "international-transfers",
    title: "13. International Data Transfers",
    paragraphs: [
      "Some of our service providers or technology systems may process or store information outside Nigeria or the country where you are located.",
      "Where personal information is transferred across borders, we will take steps required by applicable data protection law to ensure that the transfer is lawful and that appropriate safeguards are in place.",
    ],
  },
  {
    id: "your-rights",
    title: "14. Your Privacy Rights",
    paragraphs: [
      "Subject to applicable law and any relevant exceptions, you may have the right to:",
    ],
    bullets: [
      "Request access to personal information we hold about you.",
      "Request correction of inaccurate or incomplete information.",
      "Request deletion of personal information where the law permits.",
      "Request restriction of, or object to, certain processing activities.",
      "Request a copy of certain information in a portable format where applicable.",
      "Withdraw consent where processing is based on consent.",
      "Opt out of direct marketing communications.",
      "Lodge a complaint with the relevant data protection authority.",
    ],
    ending:
      "To exercise a right, contact us using the details in the Contact section. We may need to verify your identity before responding. Some requests may be limited by legal obligations, the rights of others, or the need to retain certain records.",
  },
  {
    id: "children",
    title: "15. Children's Privacy",
    paragraphs: [
      "RefurnishNG is not intended for children who are not legally able to enter into the relevant transactions or agreements. Users must meet the applicable age and legal capacity requirements to use the services independently.",
      "We do not knowingly collect children's personal information in circumstances where doing so would violate applicable law. If you believe a child has provided personal information improperly, contact us so that we can assess the matter and take appropriate action.",
    ],
  },
  {
    id: "third-party-links",
    title: "16. Third-Party Websites and Services",
    paragraphs: [
      "Our website may contain links to third-party websites, payment services, social media platforms, or other external services. These services may have their own privacy policies and practices.",
      "RefurnishNG does not control the privacy practices of independent third parties. We encourage you to review their privacy policies before providing personal information to them.",
    ],
  },
  {
    id: "user-content",
    title: "17. Reviews and Public Content",
    paragraphs: [
      "If you submit a product review, comment, listing, or other content that is displayed publicly, information included in that content may be visible to other users and visitors.",
      "Please avoid including your private contact details, payment information, passwords, or other sensitive information in public content. If you need to correct or remove content, contact us or use the relevant account feature where available.",
    ],
  },
  {
    id: "automated-processing",
    title: "18. Automated Processing",
    paragraphs: [
      "We may use automated tools to support functions such as account security, fraud detection, service performance, and transaction administration.",
      "Where applicable law gives you rights concerning decisions made solely by automated processing that significantly affect you, you may contact us to ask about the processing and any rights available to you.",
    ],
  },
  {
    id: "nigeria-law",
    title: "19. Nigerian Data Protection Law",
    paragraphs: [
      "RefurnishNG aims to handle personal information in accordance with applicable data protection requirements, including the Nigeria Data Protection Act 2023 and applicable regulations or guidance, to the extent they apply to our activities.",
      "The precise rights, obligations, and safeguards that apply may depend on the nature of the processing and the circumstances of the user. Nothing in this Policy is intended to exclude rights that cannot lawfully be excluded.",
    ],
  },
  {
    id: "changes",
    title: "20. Changes to This Privacy Policy",
    paragraphs: [
      "We may update this Privacy Policy from time to time to reflect changes in our services, technology, business practices, or legal obligations.",
      "When changes are made, we will update the date shown at the top of this page. Where required by law, we will provide additional notice or seek consent for material changes.",
      "We encourage you to review this page periodically to understand how your information is handled.",
    ],
  },
  {
    id: "contact",
    title: "21. Contact Us",
    paragraphs: [
      "If you have questions about this Privacy Policy, want to exercise a privacy right, or wish to raise a concern about the handling of your personal information, please contact RefurnishNG.",
    ],
    bullets: [
      "Email: refurnishng@gmail.com",
      "Website: https://refurnishng.com",
    ],
    ending:
      "Please include enough information for us to understand and respond to your request. Do not send your password, full payment card details, or other unnecessary sensitive information by email.",
  },
];

export default function PrivacyPolicyPage() {
  const lastUpdated = "20 October 2026";

  return (
    <main className="min-h-screen bg-[#FAF4EC] text-[#211000]">
      {/* Hero */}
      <section className="border-b border-[#E8CEB0]">
        <div className="mx-auto max-w-6xl px-5 py-14 sm:px-8 sm:py-20">
          <Link
            href="/"
            className="inline-flex items-center gap-2 text-sm font-medium text-[#8B4B2D] transition hover:text-[#5E2E19]"
          >
            <span aria-hidden="true">←</span>
            Back to RefurnishNG
          </Link>

          <div className="mt-8 max-w-3xl">
            <p className="mb-3 text-sm font-semibold uppercase tracking-[0.2em] text-[#A65D3F]">
              Your privacy matters
            </p>

            <h1 className="text-4xl font-bold tracking-tight sm:text-5xl lg:text-6xl">
              Privacy Policy
            </h1>

            <p className="mt-6 max-w-2xl text-base leading-8 text-[#604B3C] sm:text-lg">
              Learn how RefurnishNG collects, uses, shares, and protects
              personal information when you use our marketplace.
            </p>

            <p className="mt-5 text-sm text-[#79614F]">
              Last updated: {lastUpdated}
            </p>
          </div>
        </div>
      </section>

      {/* Main content */}
      <div className="mx-auto grid max-w-6xl gap-10 px-5 py-10 sm:px-8 lg:grid-cols-[280px_minmax(0,1fr)] lg:gap-14 lg:py-16">
        {/* Table of contents */}
        <aside className="h-fit rounded-2xl border border-[#E8CEB0] bg-white/70 p-6 lg:sticky lg:top-8">
          <h2 className="text-lg font-bold">Contents</h2>

          <p className="mt-2 text-sm leading-6 text-[#79614F]">
            Jump to a section of our Privacy Policy.
          </p>

          <nav aria-label="Privacy Policy contents" className="mt-5">
            <ol className="space-y-3">
              {sections.map((section) => (
                <li key={section.id}>
                  <a
                    href={`#${section.id}`}
                    className="text-sm leading-6 text-[#79503A] transition hover:text-[#A65D3F] hover:underline"
                  >
                    {section.title}
                  </a>
                </li>
              ))}
            </ol>
          </nav>
        </aside>

        {/* Policy sections */}
        <article className="min-w-0">
          <div className="rounded-2xl border border-[#E8CEB0] bg-white p-6 sm:p-10">
            <div className="mb-10 rounded-xl bg-[#FAF4EC] p-5">
              <p className="text-sm leading-7 text-[#604B3C]">
                This Policy describes our intended privacy practices. The
                actual information collected and the technologies used must
                match the features and service providers operating on the
                RefurnishNG platform.
              </p>
            </div>

            <div className="space-y-10">
              {sections.map((section) => (
                <section
                  key={section.id}
                  id={section.id}
                  className="scroll-mt-8 border-b border-[#F0E2D2] pb-9 last:border-b-0 last:pb-0"
                >
                  <h2 className="text-xl font-bold leading-snug sm:text-2xl">
                    {section.title}
                  </h2>

                  <div className="mt-4 space-y-4 text-[15px] leading-8 text-[#604B3C]">
                    {section.paragraphs.map((paragraph, index) => (
                      <p key={index}>{paragraph}</p>
                    ))}

                    {section.bullets && (
                      <ul className="list-disc space-y-2 pl-6 marker:text-[#B66B44]">
                        {section.bullets.map((bullet, index) => (
                          <li key={index}>{bullet}</li>
                        ))}
                      </ul>
                    )}

                    {section.ending && <p>{section.ending}</p>}

                    {section.id === "contact" && (
                      <p>
                        You can also visit our{" "}
                        <Link
                          href="/support"
                          className="font-semibold text-[#A65D3F] underline underline-offset-4 hover:text-[#713B24]"
                        >
                          Support page
                        </Link>{" "}
                        for assistance.
                      </p>
                    )}
                  </div>
                </section>
              ))}
            </div>
          </div>

          {/* Related pages */}
          <div className="mt-8 rounded-2xl border border-[#E8CEB0] bg-white/70 p-6 sm:p-8">
            <h2 className="text-lg font-bold">Related information</h2>

            <p className="mt-2 text-sm leading-7 text-[#604B3C]">
              Please also read our Terms of Use to understand the rules
              governing your use of RefurnishNG.
            </p>

            <Link
              href="/terms"
              className="mt-4 inline-flex items-center gap-2 font-semibold text-[#A65D3F] transition hover:text-[#713B24]"
            >
              Read our Terms of Use
              <span aria-hidden="true">→</span>
            </Link>
          </div>
        </article>
      </div>

      {/* Footer */}
      <footer className="border-t border-[#E8CEB0]">
        <div className="mx-auto flex max-w-6xl flex-col gap-4 px-5 py-8 text-sm text-[#79614F] sm:flex-row sm:items-center sm:justify-between sm:px-8">
          <p>
            © {new Date().getFullYear()} RefurnishNG. All rights reserved.
          </p>

          <div className="flex flex-wrap gap-5">
            <Link
              href="/terms"
              className="transition hover:text-[#A65D3F]"
            >
              Terms of Use
            </Link>

            <Link
              href="/privacy-policy"
              className="font-semibold text-[#A65D3F]"
            >
              Privacy Policy
            </Link>

            <Link
              href="/support"
              className="transition hover:text-[#A65D3F]"
            >
              Support
            </Link>
          </div>
        </div>
      </footer>
    </main>
  );
}
