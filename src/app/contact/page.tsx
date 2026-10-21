
"use client";

import Link from "next/link";
import { FormEvent, useState } from "react";

const contactEmail = "operations@refurnishg.com";

type ContactForm = {
  name: string;
  email: string;
  subject: string;
  orderNumber: string;
  message: string;
};

const initialForm: ContactForm = {
  name: "",
  email: "",
  subject: "General enquiry",
  orderNumber: "",
  message: "",
};

const inputClass =
  "mt-2 w-full rounded-xl border border-[#E7D8C8] bg-white px-4 py-3.5 text-sm text-[#2D2118] outline-none transition placeholder:text-[#AA9B8E] focus:border-[#A65D3F] focus:ring-4 focus:ring-[#A65D3F]/10";

function ContactIcon({
  type,
}: {
  type: "email" | "support" | "seller" | "clock" | "location";
}) {
  const common = {
    fill: "none",
    stroke: "currentColor",
    strokeWidth: 1.7,
    strokeLinecap: "round" as const,
    strokeLinejoin: "round" as const,
  };

  return (
    <svg
      viewBox="0 0 24 24"
      className="h-5 w-5"
      aria-hidden="true"
      {...common}
    >
      {type === "email" && (
        <>
          <rect x="3" y="5" width="18" height="14" rx="2" />
          <path d="m4 7 8 6 8-6" />
        </>
      )}

      {type === "support" && (
        <>
          <path d="M4 13v-2a8 8 0 0 1 16 0v2" />
          <path d="M4 12H3v4a2 2 0 0 0 2 2h2v-6H4Z" />
          <path d="M20 12h1v4a2 2 0 0 1-2 2h-2v-6h3Z" />
          <path d="M17 18a5 5 0 0 1-5 3h-1" />
        </>
      )}

      {type === "seller" && (
        <>
          <path d="M3 10 12 4l9 6" />
          <path d="M5 10v9h14v-9" />
          <path d="M9 19v-6h6v6" />
        </>
      )}

      {type === "clock" && (
        <>
          <circle cx="12" cy="12" r="9" />
          <path d="M12 7v5l3 2" />
        </>
      )}

      {type === "location" && (
        <>
          <path d="M20 10c0 5-8 11-8 11S4 15 4 10a8 8 0 1 1 16 0Z" />
          <circle cx="12" cy="10" r="2.5" />
        </>
      )}
    </svg>
  );
}

export default function ContactPage() {
  const [form, setForm] = useState<ContactForm>(initialForm);
  const [error, setError] = useState("");
  const [status, setStatus] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  function updateField<K extends keyof ContactForm>(
    field: K,
    value: ContactForm[K]
  ) {
    setForm((previous) => ({ ...previous, [field]: value }));
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError("");
    setStatus("");

    if (
      !form.name.trim() ||
      !form.email.trim() ||
      !form.message.trim()
    ) {
      setError("Please complete your name, email address, and message.");
      return;
    }

    setIsSubmitting(true);

    try {
      const response = await fetch("/api/contact", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name: form.name.trim(),
          email: form.email.trim(),
          subject: form.subject,
          orderNumber: form.orderNumber.trim(),
          message: form.message.trim(),
        }),
      });

      const data = await response.json().catch(() => ({}));

      if (!response.ok) {
        throw new Error(
          data.error || "We couldn't send your message. Please try again."
        );
      }

      setForm(initialForm);
      setStatus(
        "Thank you for reaching out! Your message has been sent to our operations team."
      );
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : `Something went wrong. You can contact us at ${contactEmail}.`
      );
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <main className="min-h-screen bg-[#FAF7F2] text-[#2D2118]">
      {/* Page navigation */}
      <header className="border-b border-[#EDE3D8]">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-5 py-5 sm:px-8">
          <Link href="/" className="group flex items-center gap-3">
            <span className="flex h-11 w-11 items-center justify-center rounded-2xl bg-[#8B4B32] text-xl font-bold text-white transition group-hover:bg-[#693723]">
              R
            </span>

            <span>
              <span className="block text-lg font-bold tracking-tight">
                RefurnishNG
              </span>
              <span className="mt-0.5 block text-[10px] font-medium uppercase tracking-[0.18em] text-[#927866]">
                A better space starts here
              </span>
            </span>
          </Link>

          <nav className="flex items-center gap-4 text-sm font-medium sm:gap-7">
            <Link
              href="/"
              className="text-[#756355] transition hover:text-[#A65D3F]"
            >
              Home
            </Link>

            <Link
              href="/support"
              className="text-[#756355] transition hover:text-[#A65D3F]"
            >
              Support
            </Link>

            <a
              href={`mailto:${contactEmail}`}
              className="rounded-full bg-[#8B4B32] px-4 py-2.5 text-white transition hover:bg-[#693723] sm:px-5"
            >
              Email us
            </a>
          </nav>
        </div>
      </header>

      {/* Hero section */}
      <section className="mx-auto max-w-7xl px-5 pb-14 pt-12 sm:px-8 sm:pb-20 sm:pt-16">
        <div className="grid items-center gap-12 lg:grid-cols-2 lg:gap-16">
          <div className="max-w-2xl">
            <div className="inline-flex items-center gap-2 rounded-full border border-[#E9D9C8] bg-white px-4 py-2 text-xs font-semibold uppercase tracking-[0.15em] text-[#8B4B32]">
              <span className="h-2 w-2 rounded-full bg-[#8B4B32]" />
              We'd love to hear from you
            </div>

            <h1 className="mt-7 text-4xl font-semibold leading-[1.13] tracking-tight sm:text-5xl lg:text-6xl">
              Let's make things
              <span className="mt-1 block font-serif italic text-[#A65D3F]">
                feel right.
              </span>
            </h1>

            <p className="mt-6 max-w-xl text-base leading-8 text-[#776657] sm:text-lg">
              Questions about an order? Interested in selling with us? Or
              simply want to share some feedback? We're here to help make
              your RefurnishNG experience better.
            </p>

            <div className="mt-8 flex flex-wrap gap-3">
              <a
                href="#contact-form"
                className="inline-flex items-center justify-center gap-2 rounded-full bg-[#8B4B32] px-6 py-3.5 text-sm font-semibold text-white shadow-sm transition hover:-translate-y-0.5 hover:bg-[#693723]"
              >
                Send a message
                <span aria-hidden="true">↗</span>
              </a>

              <Link
                href="/support"
                className="inline-flex items-center justify-center rounded-full border border-[#DCCABB] bg-white px-6 py-3.5 text-sm font-semibold text-[#6E4937] transition hover:border-[#A65D3F]"
              >
                Visit support
              </Link>
            </div>

            <a
              href={`mailto:${contactEmail}`}
              className="mt-8 inline-flex max-w-full items-center gap-3 text-sm text-[#776657] transition hover:text-[#8B4B32]"
            >
              <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-[#F0E4D8] text-[#8B4B32]">
                <ContactIcon type="email" />
              </span>

              <span className="min-w-0">
                <span className="block text-xs text-[#927866]">
                  Email our team
                </span>
                <span className="mt-1 block break-all font-semibold text-[#8B4B32]">
                  {contactEmail}
                </span>
              </span>
            </a>
          </div>

          {/* Interior photography */}
          <div className="relative">
            <div className="absolute -inset-3 rounded-[2rem] bg-[#E9DED0]" />

            <div className="relative overflow-hidden rounded-[1.6rem] bg-[#E6D8C8]">
              <img
                src="https://images.unsplash.com/photo-1600210492486-724fe5c67fb0?auto=format&fit=crop&w=1400&q=85"
                alt="Warm, thoughtfully furnished modern living room"
                className="h-[350px] w-full object-cover sm:h-[460px] lg:h-[520px]"
              />

              <div className="absolute inset-0 bg-gradient-to-t from-[#21160F]/70 via-transparent to-transparent" />

              <div className="absolute inset-x-0 bottom-0 p-6 sm:p-9">
                <p className="text-xs font-semibold uppercase tracking-[0.2em] text-[#F1D8C5]">
                  Spaces that feel like home
                </p>

                <p className="mt-3 max-w-sm font-serif text-2xl leading-snug text-white sm:text-3xl">
                  Good things begin with a conversation.
                </p>
              </div>
            </div>

            <div className="absolute -bottom-5 left-5 rounded-2xl border border-[#EDE3D8] bg-white p-4 shadow-lg shadow-[#38251A]/10 sm:left-8 sm:p-5">
              <div className="flex items-center gap-3">
                <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#F4E8DC] text-[#8B4B32]">
                  <ContactIcon type="support" />
                </span>

                <span>
                  <span className="block text-sm font-bold">
                    We're listening
                  </span>
                  <span className="mt-1 block text-xs text-[#8B7B6D]">
                    Your message matters to us
                  </span>
                </span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Contact options */}
      <section className="mx-auto max-w-7xl px-5 pb-16 pt-10 sm:px-8 sm:pb-20 sm:pt-14">
        <div className="mb-8 max-w-xl">
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-[#A65D3F]">
            How can we help?
          </p>

          <h2 className="mt-3 text-2xl font-semibold tracking-tight sm:text-3xl">
            We're only a message away.
          </h2>

          <p className="mt-3 leading-7 text-[#776657]">
            Choose the option that best matches what you need.
          </p>
        </div>

        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          <a
            href={`mailto:${contactEmail}?subject=${encodeURIComponent("General enquiry - RefurnishNG")}`}
            className="group rounded-2xl border border-[#E9DED2] bg-white p-6 transition hover:-translate-y-1 hover:border-[#C8A58C] hover:shadow-lg hover:shadow-[#38251A]/5"
          >
            <span className="flex h-12 w-12 items-center justify-center rounded-xl bg-[#F4E8DC] text-[#8B4B32] transition group-hover:bg-[#EBD7C5]">
              <ContactIcon type="email" />
            </span>

            <h3 className="mt-5 font-semibold">General enquiries</h3>

            <p className="mt-2 text-sm leading-6 text-[#827163]">
              Questions, feedback, or want to know more about RefurnishNG?
            </p>

            <span className="mt-5 inline-flex items-center gap-2 text-sm font-semibold text-[#8B4B32]">
              Email our team <span aria-hidden="true">↗</span>
            </span>
          </a>

          <Link
            href="/support"
            className="group rounded-2xl border border-[#E9DED2] bg-white p-6 transition hover:-translate-y-1 hover:border-[#C8A58C] hover:shadow-lg hover:shadow-[#38251A]/5"
          >
            <span className="flex h-12 w-12 items-center justify-center rounded-xl bg-[#F4E8DC] text-[#8B4B32] transition group-hover:bg-[#EBD7C5]">
              <ContactIcon type="support" />
            </span>

            <h3 className="mt-5 font-semibold">Customer support</h3>

            <p className="mt-2 text-sm leading-6 text-[#827163]">
              Get help with your account, a purchase, or a platform issue.
            </p>

            <span className="mt-5 inline-flex items-center gap-2 text-sm font-semibold text-[#8B4B32]">
              Visit support <span aria-hidden="true">↗</span>
            </span>
          </Link>

          <a
            href={`mailto:${contactEmail}?subject=${encodeURIComponent("Selling on RefurnishNG")}`}
            className="group rounded-2xl border border-[#E9DED2] bg-white p-6 transition hover:-translate-y-1 hover:border-[#C8A58C] hover:shadow-lg hover:shadow-[#38251A]/5 sm:col-span-2 lg:col-span-1"
          >
            <span className="flex h-12 w-12 items-center justify-center rounded-xl bg-[#F4E8DC] text-[#8B4B32] transition group-hover:bg-[#EBD7C5]">
              <ContactIcon type="seller" />
            </span>

            <h3 className="mt-5 font-semibold">Sell with us</h3>

            <p className="mt-2 text-sm leading-6 text-[#827163]">
              Interested in listing furniture, homeware, or other products?
            </p>

            <span className="mt-5 inline-flex items-center gap-2 text-sm font-semibold text-[#8B4B32]">
              Become a seller <span aria-hidden="true">↗</span>
            </span>
          </a>
        </div>
      </section>

      {/* Contact form */}
      <section
        id="contact-form"
        className="scroll-mt-8 border-y border-[#E9DED2] bg-[#F0E8DE]"
      >
        <div className="mx-auto grid max-w-7xl gap-10 px-5 py-14 sm:px-8 sm:py-20 lg:grid-cols-[0.8fr_1.2fr] lg:gap-16">
          <div className="pt-2">
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-[#A65D3F]">
              Get in touch
            </p>

            <h2 className="mt-4 text-3xl font-semibold leading-tight tracking-tight sm:text-4xl">
              Tell us what's
              <span className="block font-serif italic text-[#A65D3F]">
                on your mind.
              </span>
            </h2>

            <p className="mt-5 max-w-md leading-8 text-[#776657]">
              Fill out the form with a few details and our team will receive
              your enquiry by email.
            </p>

            <div className="mt-9 space-y-5">
              <div className="flex items-start gap-4">
                <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-white text-[#8B4B32]">
                  <ContactIcon type="email" />
                </span>

                <div className="min-w-0">
                  <p className="text-sm font-semibold">Email us</p>
                  <a
                    href={`mailto:${contactEmail}`}
                    className="mt-1 block break-all text-sm text-[#8B4B32] hover:underline"
                  >
                    {contactEmail}
                  </a>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-white text-[#8B4B32]">
                  <ContactIcon type="support" />
                </span>

                <div>
                  <p className="text-sm font-semibold">Need support?</p>
                  <Link
                    href="/support"
                    className="mt-1 block text-sm text-[#8B4B32] hover:underline"
                  >
                    Visit our support page
                  </Link>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-white text-[#8B4B32]">
                  <ContactIcon type="location" />
                </span>

                <div>
                  <p className="text-sm font-semibold">Connect with RefurnishNG</p>
                  <p className="mt-1 text-sm leading-6 text-[#776657]">
                    We're here to help buyers and sellers have a better
                    marketplace experience.
                  </p>
                </div>
              </div>
            </div>
          </div>

          <div className="rounded-3xl border border-[#E5D7C9] bg-white p-5 shadow-sm shadow-[#38251A]/5 sm:p-8 lg:p-10">
            <div className="mb-7">
              <h3 className="text-xl font-semibold">Send us a message</h3>
              <p className="mt-2 text-sm leading-6 text-[#827163]">
                Fields marked with * are required.
              </p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-5">
              <div className="grid gap-5 sm:grid-cols-2">
                <div>
                  <label
                    htmlFor="contact-name"
                    className="text-sm font-semibold text-[#49372A]"
                  >
                    Full name *
                  </label>

                  <input
                    id="contact-name"
                    name="name"
                    type="text"
                    autoComplete="name"
                    required
                    maxLength={120}
                    value={form.name}
                    onChange={(event) =>
                      updateField("name", event.target.value)
                    }
                    placeholder="Your full name"
                    className={inputClass}
                  />
                </div>

                <div>
                  <label
                    htmlFor="contact-email"
                    className="text-sm font-semibold text-[#49372A]"
                  >
                    Email address *
                  </label>

                  <input
                    id="contact-email"
                    name="email"
                    type="email"
                    autoComplete="email"
                    required
                    maxLength={254}
                    value={form.email}
                    onChange={(event) =>
                      updateField("email", event.target.value)
                    }
                    placeholder="you@example.com"
                    className={inputClass}
                  />
                </div>
              </div>

              <div>
                <label
                  htmlFor="contact-subject"
                  className="text-sm font-semibold text-[#49372A]"
                >
                  What can we help you with? *
                </label>

                <select
                  id="contact-subject"
                  name="subject"
                  required
                  value={form.subject}
                  onChange={(event) =>
                    updateField("subject", event.target.value)
                  }
                  className={inputClass}
                >
                  <option>General enquiry</option>
                  <option>Order or delivery</option>
                  <option>Payment or refund</option>
                  <option>Seller enquiry</option>
                  <option>Product question</option>
                  <option>Report a problem</option>
                  <option>Feedback or suggestion</option>
                  <option>Privacy enquiry</option>
                  <option>Other</option>
                </select>
              </div>

              <div>
                <label
                  htmlFor="contact-order"
                  className="text-sm font-semibold text-[#49372A]"
                >
                  Order number{" "}
                  <span className="font-normal text-[#9B8B7D]">
                    (optional)
                  </span>
                </label>

                <input
                  id="contact-order"
                  name="orderNumber"
                  type="text"
                  maxLength={100}
                  value={form.orderNumber}
                  onChange={(event) =>
                    updateField("orderNumber", event.target.value)
                  }
                  placeholder="Your order reference"
                  className={inputClass}
                />
              </div>

              <div>
                <label
                  htmlFor="contact-message"
                  className="text-sm font-semibold text-[#49372A]"
                >
                  Your message *
                </label>

                <textarea
                  id="contact-message"
                  name="message"
                  required
                  rows={6}
                  maxLength={5000}
                  value={form.message}
                  onChange={(event) =>
                    updateField("message", event.target.value)
                  }
                  placeholder="Tell us how we can help..."
                  className={`${inputClass} resize-y`}
                />

                <p className="mt-2 text-right text-xs text-[#9B8B7D]">
                  {form.message.length}/5000
                </p>
              </div>

              {error && (
                <p
                  role="alert"
                  className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700"
                >
                  {error}
                </p>
              )}

              {status && (
                <p
                  role="status"
                  className="rounded-xl border border-[#D8E4D1] bg-[#F1F5ED] px-4 py-3 text-sm leading-6 text-[#476342]"
                >
                  {status}
                </p>
              )}

              <button
                type="submit"
                disabled={isSubmitting}
                className="inline-flex w-full items-center justify-center gap-2 rounded-full bg-[#8B4B32] px-6 py-4 text-sm font-semibold text-white transition hover:bg-[#693723] focus:outline-none focus:ring-4 focus:ring-[#A65D3F]/20 disabled:cursor-not-allowed disabled:opacity-60 sm:w-auto sm:min-w-[200px]"
              >
                {isSubmitting ? "Sending message..." : "Send message"}
                {!isSubmitting && <span aria-hidden="true">↗</span>}
              </button>

              <p className="text-xs leading-6 text-[#928173]">
                By contacting us, you acknowledge our{" "}
                <Link
                  href="/privacy-policy"
                  className="font-medium text-[#8B4B32] underline underline-offset-2 hover:text-[#693723]"
                >
                  Privacy Policy
                </Link>
                . Please do not include passwords or payment card details.
              </p>
            </form>
          </div>
        </div>
      </section>

      {/* Helpful links section — shared site footer remains in your layout */}
      <section className="mx-auto max-w-7xl px-5 py-14 sm:px-8 sm:py-16">
        <div className="flex flex-col justify-between gap-8 rounded-3xl bg-[#2D2118] p-7 text-white sm:p-10 lg:flex-row lg:items-center">
          <div className="max-w-2xl">
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-[#D7B69E]">
              Need a quick answer?
            </p>

            <h2 className="mt-3 text-2xl font-semibold sm:text-3xl">
              Find your way around RefurnishNG.
            </h2>

            <p className="mt-3 leading-7 text-[#D4C5B8]">
              Explore our support resources or read our policies.
            </p>
          </div>

          <div className="flex flex-wrap gap-3">
            <Link
              href="/support"
              className="rounded-full bg-white px-5 py-3 text-sm font-semibold text-[#2D2118] transition hover:bg-[#F0E8DE]"
            >
              Support centre
            </Link>

            <Link
              href="/terms"
              className="rounded-full border border-white/30 px-5 py-3 text-sm font-semibold text-white transition hover:bg-white/10"
            >
              Terms of Use
            </Link>

            <Link
              href="/privacy-policy"
              className="rounded-full border border-white/30 px-5 py-3 text-sm font-semibold text-white transition hover:bg-white/10"
            >
              Privacy Policy
            </Link>
          </div>
        </div>
      </section>
    </main>
  );
}
