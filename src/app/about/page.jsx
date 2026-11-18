
import React from "react";
import Link from "next/link";
import {
  FaArrowRight,
  FaHandshake,
  FaRecycle,
  FaUsers,
  FaLightbulb,
  FaShieldAlt,
  FaCouch,
  FaSearch,
  FaTag,
  FaLeaf,
  FaHeart,
  FaCheckCircle,
  FaEnvelope,
  FaGlobe,
  FaChevronRight,
  FaSeedling,
  FaBoxOpen,
} from "react-icons/fa";

const coreValues = [
  {
    title: "Trust & Transparency",
    description:
      "We believe buying and selling pre-owned furniture should feel straightforward. We encourage clear listings, honest descriptions and open communication between buyers and sellers.",
    icon: <FaHandshake />,
  },
  {
    title: "Convenience",
    description:
      "Finding furniture or giving an item a new home should not be complicated. RefurnishNG brings buyers and sellers together in one accessible marketplace.",
    icon: <FaLightbulb />,
  },
  {
    title: "Sustainability",
    description:
      "Every piece of furniture reused is an opportunity to reduce waste, extend the life of quality items and make more responsible use of resources.",
    icon: <FaRecycle />,
  },
  {
    title: "Community",
    description:
      "We are building a marketplace where people can exchange value, discover affordable finds and make better use of the furniture they already own.",
    icon: <FaUsers />,
  },
];

const marketplaceBenefits = [
  {
    title: "For Buyers",
    subtitle: "Find pieces that feel like home.",
    description:
      "Explore furniture and home items listed by sellers. Discover pre-owned pieces, compare options and find something that suits your space and budget.",
    icon: <FaSearch />,
    points: [
      "Explore furniture across different categories",
      "Discover affordable pre-owned finds",
      "Find pieces that suit your home and lifestyle",
    ],
    link: "/shop",
    linkText: "Explore the shop",
  },
  {
    title: "For Sellers",
    subtitle: "Give your furniture a new home.",
    description:
      "Have furniture you no longer need? RefurnishNG gives you a place to showcase your items and connect with people looking for them.",
    icon: <FaTag />,
    points: [
      "Give unused furniture another opportunity",
      "Showcase your items to potential buyers",
      "Make more value from furniture you own",
    ],
    link: "/contact",
    linkText: "Get in touch",
  },
];

export default function AboutPage() {
  return (
    <main className="font-sans text-[#211000] bg-[#F9F8F5] overflow-hidden">

      {/* HERO SECTION */}
      <section className="relative bg-[#E8CEB0] pt-32 sm:pt-36 lg:pt-40 pb-20 sm:pb-28 px-4 sm:px-8 lg:px-16 overflow-hidden">
        <div className="absolute -top-24 -right-20 w-72 h-72 rounded-full border-[40px] border-[#775522]/5 pointer-events-none" />
        <div className="absolute -bottom-32 -left-20 w-80 h-80 rounded-full border-[45px] border-[#775522]/5 pointer-events-none" />

        <div className="relative max-w-7xl mx-auto grid lg:grid-cols-2 gap-12 lg:gap-16 items-center">
          <div>
            <span className="inline-flex items-center gap-2 bg-white/50 text-[#775522] rounded-full px-4 py-2 text-[10px] sm:text-xs font-bold uppercase tracking-[0.2em] mb-7">
              <FaLeaf />
              A more thoughtful way to furnish
            </span>

            <h1 className="font-serif text-4xl sm:text-5xl lg:text-7xl leading-[1.08] tracking-tight text-[#3D2A16] mb-7">
              Furniture deserves
              <span className="block italic text-[#775522]">
                a second life.
              </span>
            </h1>

            <p className="text-base sm:text-lg text-[#5F7161] leading-relaxed max-w-xl mb-9">
              RefurnishNG is a furniture resale marketplace built to make
              furnishing your space more affordable, convenient and
              sustainable. We connect people who have furniture to sell
              with people looking for quality pieces to make their spaces
              feel like home.
            </p>

            <div className="flex flex-col sm:flex-row gap-4">
              <Link
                href="/shop"
                className="inline-flex items-center justify-center gap-3 bg-[#775522] hover:bg-[#5E441B] text-white px-7 py-4 rounded-full text-xs font-bold uppercase tracking-widest transition-all duration-300 hover:-translate-y-1 shadow-lg shadow-[#775522]/15"
              >
                Explore the shop
                <FaArrowRight />
              </Link>

              <Link
                href="/contact"
                className="inline-flex items-center justify-center gap-3 bg-white/60 hover:bg-white text-[#775522] border border-[#775522]/15 px-7 py-4 rounded-full text-xs font-bold uppercase tracking-widest transition-all duration-300"
              >
                Get in touch
                <FaChevronRight />
              </Link>
            </div>
          </div>

          <div className="relative max-w-xl mx-auto w-full">
            <div className="relative rounded-[2rem] overflow-hidden aspect-[5/4] bg-[#D6B994] shadow-2xl shadow-[#775522]/15">
              <img
                src="/living.jpg"
                alt="A thoughtfully furnished living space"
                className="w-full h-full object-cover"
              />

              <div className="absolute inset-0 bg-gradient-to-t from-[#211000]/40 via-transparent to-transparent" />

              <div className="absolute bottom-6 left-6 right-6 text-white">
                <p className="text-[10px] font-bold uppercase tracking-[0.25em] mb-2 text-white/80">
                  The RefurnishNG idea
                </p>
                <p className="font-serif text-2xl sm:text-3xl leading-tight max-w-sm">
                  Better spaces. Thoughtful choices. New beginnings.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* INTRODUCTION */}
      <section className="py-20 sm:py-24 px-4 sm:px-8 lg:px-16 bg-white">
        <div className="max-w-5xl mx-auto text-center">
          <span className="text-[10px] sm:text-xs font-bold uppercase tracking-[0.25em] text-[#B66B44]">
            WHO WE ARE
          </span>

          <h2 className="font-serif text-3xl sm:text-4xl lg:text-5xl leading-tight text-[#3D2A16] mt-5 mb-8 max-w-4xl mx-auto">
            Making furniture resale a better experience.
          </h2>

          <p className="text-base sm:text-lg leading-relaxed text-[#5F7161] max-w-4xl mx-auto mb-6">
            RefurnishNG is a modern furniture resale platform created with
            the needs of people in Lagos, Nigeria, in mind. We understand
            that furnishing a home can be expensive, while perfectly useful
            furniture often goes unused when people move, upgrade or
            simply change their spaces.
          </p>

          <p className="text-base sm:text-lg leading-relaxed text-[#5F7161] max-w-4xl mx-auto">
            We bring these two needs together. Our marketplace gives sellers
            an opportunity to showcase furniture they no longer need and
            gives buyers a place to discover pieces that suit their taste,
            needs and budget. Our goal is to make the experience more
            accessible while encouraging a culture of reuse.
          </p>

          <div className="w-16 h-1 bg-[#B66B44] rounded-full mx-auto mt-10" />
        </div>
      </section>

      {/* MISSION AND VISION */}
      <section className="py-20 sm:py-24 px-4 sm:px-8 lg:px-16 bg-[#F6F1EB]">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-14">
            <span className="text-[10px] sm:text-xs font-bold uppercase tracking-[0.25em] text-[#B66B44]">
              OUR PURPOSE
            </span>

            <h2 className="font-serif text-3xl sm:text-4xl text-[#3D2A16] mt-4">
              What drives us
            </h2>
          </div>

          <div className="grid md:grid-cols-2 gap-7 lg:gap-10">
            <div className="group bg-white rounded-3xl p-8 sm:p-10 shadow-sm border border-[#775522]/5 hover:shadow-xl hover:-translate-y-1 transition-all duration-300">
              <div className="w-16 h-16 rounded-2xl bg-[#E8CEB0]/40 flex items-center justify-center text-[#775522] text-3xl mb-7">
                <FaLightbulb />
              </div>

              <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-[#B66B44]">
                OUR MISSION
              </span>

              <h3 className="font-serif text-2xl sm:text-3xl text-[#3D2A16] mt-3 mb-5">
                Making buying and selling easier.
              </h3>

              <p className="text-sm sm:text-base text-[#5F7161] leading-relaxed">
                To simplify how people buy and sell furniture and decorative
                items by providing an accessible marketplace that brings
                buyers and sellers together through convenience, trust
                and thoughtful design.
              </p>
            </div>

            <div className="group bg-[#775522] rounded-3xl p-8 sm:p-10 shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300">
              <div className="w-16 h-16 rounded-2xl bg-white/10 flex items-center justify-center text-[#E8CEB0] text-3xl mb-7">
                <FaSeedling />
              </div>

              <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-[#E8CEB0]">
                OUR VISION
              </span>

              <h3 className="font-serif text-2xl sm:text-3xl text-white mt-3 mb-5">
                A future where good furniture lives on.
              </h3>

              <p className="text-sm sm:text-base text-white/80 leading-relaxed">
                We envision a community where people can furnish and refresh
                their spaces affordably, where useful furniture finds new
                homes and where reuse becomes a natural part of how we live.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* BUYERS AND SELLERS */}
      <section className="py-20 sm:py-24 px-4 sm:px-8 lg:px-16 bg-white">
        <div className="max-w-7xl mx-auto">
          <div className="max-w-2xl mb-14">
            <span className="text-[10px] sm:text-xs font-bold uppercase tracking-[0.25em] text-[#B66B44]">
              HOW WE BRING PEOPLE TOGETHER
            </span>

            <h2 className="font-serif text-3xl sm:text-4xl lg:text-5xl text-[#3D2A16] mt-4 mb-5 leading-tight">
              A marketplace that works both ways.
            </h2>

            <p className="text-sm sm:text-base text-[#5F7161] leading-relaxed">
              Whether you are searching for something special or ready to
              let go of furniture you no longer need, RefurnishNG gives
              you a place to start.
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-8">
            {marketplaceBenefits.map((benefit) => (
              <div
                key={benefit.title}
                className="rounded-3xl bg-[#F9F8F5] border border-[#775522]/10 p-8 sm:p-10 hover:shadow-xl transition-all duration-300"
              >
                <div className="w-14 h-14 rounded-2xl bg-[#E8CEB0]/50 flex items-center justify-center text-[#775522] text-2xl mb-7">
                  {benefit.icon}
                </div>

                <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-[#B66B44]">
                  {benefit.title}
                </p>

                <h3 className="font-serif text-2xl sm:text-3xl text-[#3D2A16] mt-3 mb-4">
                  {benefit.subtitle}
                </h3>

                <p className="text-sm text-[#5F7161] leading-relaxed mb-7">
                  {benefit.description}
                </p>

                <ul className="space-y-4 mb-8">
                  {benefit.points.map((point) => (
                    <li
                      key={point}
                      className="flex items-start gap-3 text-sm text-[#5F7161]"
                    >
                      <FaCheckCircle className="text-[#B66B44] mt-1 flex-shrink-0" />
                      <span>{point}</span>
                    </li>
                  ))}
                </ul>

                <Link
                  href={benefit.link}
                  className="inline-flex items-center gap-3 text-xs font-bold uppercase tracking-widest text-[#775522] hover:text-[#B66B44] transition-colors"
                >
                  {benefit.linkText}
                  <FaArrowRight />
                </Link>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CORE VALUES */}
      <section className="py-20 sm:py-24 px-4 sm:px-8 lg:px-16 bg-[#F6F1EB]">
        <div className="max-w-7xl mx-auto">
          <div className="text-center max-w-2xl mx-auto mb-14">
            <span className="text-[10px] sm:text-xs font-bold uppercase tracking-[0.25em] text-[#B66B44]">
              WHAT MATTERS TO US
            </span>

            <h2 className="font-serif text-3xl sm:text-4xl text-[#3D2A16] mt-4 mb-5">
              Our core values
            </h2>

            <p className="text-sm sm:text-base text-[#5F7161] leading-relaxed">
              The principles behind the marketplace we are building and
              the experience we want people to have.
            </p>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {coreValues.map((value) => (
              <div
                key={value.title}
                className="bg-white rounded-2xl p-7 shadow-sm border border-[#775522]/5 hover:shadow-lg hover:-translate-y-1 transition-all duration-300"
              >
                <div className="text-3xl text-[#B66B44] mb-6">
                  {value.icon}
                </div>

                <h3 className="font-serif text-xl text-[#3D2A16] mb-3">
                  {value.title}
                </h3>

                <p className="text-sm text-[#5F7161] leading-relaxed">
                  {value.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* SUSTAINABILITY */}
      <section className="py-20 sm:py-24 px-4 sm:px-8 lg:px-16 bg-white">
        <div className="max-w-7xl mx-auto grid lg:grid-cols-2 gap-12 lg:gap-16 items-center">
          <div className="relative">
            <div className="rounded-[2rem] overflow-hidden aspect-[5/4] bg-[#E8CEB0]">
              <img
                src="/hero-bg4.png"
                alt="A warm and thoughtfully styled home interior"
                className="w-full h-full object-cover"
              />
            </div>

            <div className="absolute -bottom-6 -right-3 sm:-right-6 bg-[#E8CEB0] rounded-2xl p-5 sm:p-6 shadow-lg max-w-[220px]">
              <FaLeaf className="text-2xl text-[#775522] mb-3" />
              <p className="font-serif text-lg text-[#3D2A16]">
                A more circular way to furnish.
              </p>
            </div>
          </div>

          <div className="pt-5 lg:pt-0">
            <span className="text-[10px] sm:text-xs font-bold uppercase tracking-[0.25em] text-[#B66B44]">
              FURNITURE WITH A FUTURE
            </span>

            <h2 className="font-serif text-3xl sm:text-4xl lg:text-5xl text-[#3D2A16] mt-4 mb-7 leading-tight">
              Good furniture should not go to waste.
            </h2>

            <p className="text-sm sm:text-base text-[#5F7161] leading-relaxed mb-5">
              Furniture can have a useful life beyond its first owner.
              When people choose to reuse and resell items, they create
              opportunities for others to furnish their spaces while
              reducing the need to discard usable belongings.
            </p>

            <p className="text-sm sm:text-base text-[#5F7161] leading-relaxed mb-8">
              At RefurnishNG, sustainability is part of the bigger picture.
              We want to encourage more thoughtful consumption, make
              pre-owned furniture easier to discover and support a
              marketplace where useful items can find new homes.
            </p>

            <div className="flex items-start gap-4 border-l-2 border-[#B66B44] pl-5">
              <FaHeart className="text-[#B66B44] mt-1 flex-shrink-0" />
              <p className="font-serif italic text-lg text-[#775522] leading-relaxed">
                Refresh your space. Give good furniture another story.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* BRAND IDENTITY */}
      <section className="py-20 sm:py-24 px-4 sm:px-8 lg:px-16 bg-[#E8CEB0]/35">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-14">
            <span className="text-[10px] sm:text-xs font-bold uppercase tracking-[0.25em] text-[#B66B44]">
              THE REFURNISHNG EXPERIENCE
            </span>

            <h2 className="font-serif text-3xl sm:text-4xl text-[#3D2A16] mt-4">
              What we stand for
            </h2>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            <div className="bg-white/80 rounded-2xl p-7">
              <FaCouch className="text-3xl text-[#775522] mb-5" />
              <h3 className="font-serif text-xl text-[#3D2A16] mb-3">
                Thoughtful Living
              </h3>
              <p className="text-sm text-[#5F7161] leading-relaxed">
                We believe a beautiful and functional home is about making
                thoughtful choices, not simply buying more things.
              </p>
            </div>

            <div className="bg-white/80 rounded-2xl p-7">
              <FaShieldAlt className="text-3xl text-[#775522] mb-5" />
              <h3 className="font-serif text-xl text-[#3D2A16] mb-3">
                Responsible Marketplace
              </h3>
              <p className="text-sm text-[#5F7161] leading-relaxed">
                We encourage clear product information and communication
                so buyers and sellers can make informed decisions.
              </p>
            </div>

            <div className="bg-white/80 rounded-2xl p-7">
              <FaBoxOpen className="text-3xl text-[#775522] mb-5" />
              <h3 className="font-serif text-xl text-[#3D2A16] mb-3">
                New Possibilities
              </h3>
              <p className="text-sm text-[#5F7161] leading-relaxed">
                Every listing creates another possibility for a useful
                piece of furniture to be appreciated in a different home.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CONTACT SECTION */}
      <section className="py-20 sm:py-24 px-4 sm:px-8 lg:px-16 bg-[#F9F8F5]">
        <div className="max-w-5xl mx-auto bg-[#775522] rounded-[2rem] px-6 py-14 sm:px-12 sm:py-16 text-center relative overflow-hidden">
          <div className="absolute -top-20 -right-20 w-64 h-64 rounded-full border-[35px] border-white/5" />
          <div className="absolute -bottom-24 -left-20 w-72 h-72 rounded-full border-[40px] border-white/5" />

          <div className="relative">
            <span className="inline-block text-[10px] sm:text-xs font-bold uppercase tracking-[0.25em] text-[#E8CEB0] mb-5">
              LET'S CONNECT
            </span>

            <h2 className="font-serif text-3xl sm:text-4xl lg:text-5xl text-white leading-tight max-w-3xl mx-auto mb-6">
              Be part of a more thoughtful way to furnish.
            </h2>

            <p className="text-sm sm:text-base text-white/75 max-w-2xl mx-auto leading-relaxed mb-9">
              Whether you are looking for your next furniture find,
              ready to give an item a new home or simply want to learn
              more about RefurnishNG, we would love to hear from you.
            </p>

            <div className="flex flex-col sm:flex-row justify-center gap-4">
              <Link
                href="/shop"
                className="inline-flex items-center justify-center gap-3 bg-[#E8CEB0] hover:bg-white text-[#3D2A16] px-7 py-4 rounded-full text-xs font-bold uppercase tracking-widest transition-all duration-300"
              >
                Start exploring
                <FaArrowRight />
              </Link>

              <Link
                href="/contact"
                className="inline-flex items-center justify-center gap-3 border border-white/40 hover:bg-white/10 text-white px-7 py-4 rounded-full text-xs font-bold uppercase tracking-widest transition-all duration-300"
              >
                Contact us
                <FaEnvelope />
              </Link>
            </div>
          </div>
        </div>

        {/* CONTACT DETAILS */}
        <div className="max-w-5xl mx-auto mt-12 grid sm:grid-cols-2 gap-6">
          <a
            href="mailto:refurnishng@gmail.com"
            className="flex items-center justify-center gap-4 bg-white border border-[#775522]/10 rounded-2xl p-6 hover:shadow-md transition-all"
          >
            <div className="w-12 h-12 rounded-full bg-[#E8CEB0]/40 flex items-center justify-center text-[#775522] text-xl">
              <FaEnvelope />
            </div>

            <div>
              <p className="text-[10px] font-bold uppercase tracking-widest text-[#B66B44] mb-1">
                Email us
              </p>
              <p className="text-sm font-semibold text-[#3D2A16]">
                refurnishng@gmail.com
              </p>
            </div>
          </a>

          <a
            href="https://www.refurnishng.com"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center justify-center gap-4 bg-white border border-[#775522]/10 rounded-2xl p-6 hover:shadow-md transition-all"
          >
            <div className="w-12 h-12 rounded-full bg-[#E8CEB0]/40 flex items-center justify-center text-[#775522] text-xl">
              <FaGlobe />
            </div>

            <div>
              <p className="text-[10px] font-bold uppercase tracking-widest text-[#B66B44] mb-1">
                Visit our website
              </p>
              <p className="text-sm font-semibold text-[#3D2A16]">
                www.refurnishng.com
              </p>
            </div>
          </a>
        </div>
      </section>
    </main>
  );
}
