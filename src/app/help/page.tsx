'use client';

import React from 'react';
import Link from 'next/link';
import { FaSearch, FaComments, FaHandshake, FaTruck, FaChevronDown, FaChevronUp, FaQuestionCircle, FaArrowRight } from 'react-icons/fa';

const faqs = [
    {
      q: 'What is Refurnish NG?',
      a: 'Refurnish NG is an online marketplace that connects buyers and sellers of furniture in Nigeria. Whether new or fairly used, we make buying and selling furniture easy and safe.',
    },
    {
      q: 'Is it free to use?',
      a: 'Yes! Browse and listing items on Refurnish NG is completely free. We only charge for premium promotions and successful transactions based on our transparent fee structure.',
    },
    {
      q: 'How do I contact a seller or buyer?',
      a: 'You can chat directly with a seller or buyer through our secure in-site messaging feature. Once you both agree on the price and terms, you can finalize the deal within the chat, ensuring a smooth and recorded transaction process.',
    },
    {
      q: 'Is pricing available on the listings?',
      a: 'Yes. Every item listed on Refurnish NG clearly displays a price. However, we encourage buyers and sellers to negotiate via chat before finalizing the deal to ensure satisfaction for both parties.',
    },
    {
      q: 'Can I sell used furniture?',
      a: 'Absolutely! We actively encourage individuals and businesses to list their gently used furniture for resale. Our platform is designed to promote sustainability by giving quality items a second life.',
    },
    {
      q: 'Is delivery available?',
      a: 'We partner with reputable logistics providers to offer delivery services. The availability and terms of delivery often depend on the seller and the specific product. Delivery options and associated costs are usually clearly stated on each product page.',
    },
    {
      q: 'How do I ensure safety while buying or selling?',
      a: 'Your safety is paramount. We recommend using our secure in-site messaging for all communication, arranging to meet in public places for item inspections, and utilizing our verified payment and delivery services. Never share sensitive personal or financial information outside the platform.',
    },
    {
      q: 'What if I encounter a scam or fraudulent activity?',
      a: 'We have a zero-tolerance policy for fraudulent activity. If you suspect a scam or encounter any suspicious behavior, please report the listing and contact our support team immediately. We will investigate thoroughly and take appropriate action.',
    },
    {
      q: 'How are disputes resolved?',
      a: 'In the rare event of a dispute, our dedicated support team is available to mediate and facilitate a fair resolution between buyers and sellers. We strive for amicable solutions that uphold our platform\'s integrity and user trust.',
    },
    {
      q: 'Do you offer customer support?',
      a: 'Yes, our customer support team is available to assist you with any questions or issues you may encounter. You can reach us via the contact form on our website, email, or through our social media channels during business hours.',
    },
  ];

export default function HelpPage() {
  const [openIndex, setOpenIndex] = React.useState(null);

  const toggleFAQ = (index) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  return (
    <main className="text-[#5F7161]">
      {/* How It Works Section */}
      <section id="how-it-works" className="py-20 px-4 sm:px-8 lg:px-16 max-w-6xl mx-auto">
        <div className="text-center mb-16">
          <h1 className="text-4xl sm:text-5xl font-bold text-[#775522] mb-4">How It Works</h1>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Refurnish NG makes buying and selling furniture easy, safe, and efficient.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-12">
          {/* Steps */}
          {[{
            icon: <FaSearch />,
            title: '1. Browse Listings',
            desc: 'Explore curated furniture by type, location, and budget.',
          }, {
            icon: <FaComments />,
            title: '2. Chat in Real-Time',
            desc: 'Negotiate and finalize deals via in-site chat.',
          }, {
            icon: <FaHandshake />,
            title: '3. Confirm & Checkout',
            desc: 'Once you agree, securely check out right from the chat.',
          }, {
            icon: <FaTruck />,
            title: '4. Delivery or Pickup',
            desc: 'Choose delivery or pickup—seller lists available options.',
          }].map((step, i) => (
            <div key={i} className="bg-white rounded-xl p-6 shadow-lg text-center">
              <div className="text-4xl text-[#E8CEB0] mx-auto mb-4">{step.icon}</div>
              <h3 className="text-2xl font-semibold mb-2">{step.title}</h3>
              <p className="text-gray-600">{step.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* FAQ Section */}
      <section id="faqs" className="relative py-20 px-4 sm:px-8 lg:px-16 bg-[#F9F9F9]">
        <div className="max-w-4xl mx-auto text-center mb-16">
          <FaQuestionCircle className="text-6xl text-[#775522] mx-auto mb-4" />
          <h2 className="text-4xl sm:text-5xl font-extrabold text-[#775522]">Frequently Asked Questions</h2>
          <p className="text-lg text-gray-700 mt-4 max-w-2xl mx-auto">
            Got questions about Refurnish NG? Find answers here.
          </p>
        </div>

        <div className="space-y-4 max-w-4xl mx-auto">
          {faqs.map((faq, idx) => (
            <div
              key={idx}
              className={`bg-white rounded-xl shadow-md overflow-hidden border ${openIndex === idx ? 'border-[#E8CEB0]' : 'border-transparent'}`}
            >
              <button
                onClick={() => toggleFAQ(idx)}
                className="w-full text-left p-6 flex justify-between items-center"
              >
                <h3 className="text-xl font-semibold text-[#5F7161]">{faq.q}</h3>
                {openIndex === idx ? <FaChevronUp className="text-[#775522]" /> : <FaChevronDown className="text-[#775522]" />}
              </button>
              {openIndex === idx && (
                <div className="px-6 pb-6 pt-0 text-gray-700">
                  <p>{faq.a}</p>
                </div>
              )}
            </div>
          ))}
        </div>

        <div className="text-center mt-16">
          <p className="text-xl text-gray-700 mb-6">Still need help?</p>
          <Link
            href="/help#support"
            className="inline-flex items-center bg-[#775522] text-white px-8 py-4 rounded-full font-bold text-lg shadow-lg hover:bg-[#5E441B] transition"
          >
            Contact Support <FaArrowRight className="ml-3" />
          </Link>
        </div>
      </section>
      {/* Support Section */}
<section id="support" className="py-20 px-4 sm:px-8 lg:px-16 bg-white border-t border-gray-200">
  <div className="max-w-3xl mx-auto text-center">
    <h2 className="text-4xl sm:text-5xl font-bold text-[#775522] mb-6">Need More Help?</h2>
    <p className="text-lg text-gray-700 mb-10">
      Our support team is here to assist you with anything you need—from technical issues to account support.
      You can reach us using the methods below.
    </p>

    <div className="grid gap-8 sm:grid-cols-2 text-left text-[#5F7161]">
      {/* Email Support */}
      <div className="bg-[#F9F9F9] p-6 rounded-xl shadow-md hover:shadow-lg transition">
        <h3 className="text-xl font-semibold mb-2">📧 Email</h3>
        <p className="text-gray-600 mb-2">Send us a detailed message and we’ll get back to you within 24–48 hours.</p>
        <a href="mailto:support@refurnishng.com" className="text-[#775522] font-semibold hover:underline">
          support@refurnishng.com
        </a>
      </div>

      {/* WhatsApp or Live Chat */}
      <div className="bg-[#F9F9F9] p-6 rounded-xl shadow-md hover:shadow-lg transition">
        <h3 className="text-xl font-semibold mb-2">💬 Live Chat / WhatsApp</h3>
        <p className="text-gray-600 mb-2">Chat with us for quick help or updates about your orders.</p>
        <a href="https://wa.me/2340000000000" target="_blank" rel="noopener noreferrer" className="text-[#775522] font-semibold hover:underline">
          Start Chat
        </a>
      </div>
    </div>

    <p className="mt-10 text-gray-500 text-sm">
      Available Monday – Friday, 9 AM – 6 PM (WAT)
    </p>

    <Link
      href="/contact"
      className="inline-block mt-8 bg-[#775522] text-white px-8 py-3 rounded-full font-bold text-lg shadow hover:bg-[#5E441B] transition"
    >
      Go to Contact Page
    </Link>
  </div>
</section>
    </main>
  );
}
