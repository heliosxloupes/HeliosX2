function OrderingInfoSection() {
  return (
    <section className="border-t border-neutral-800 bg-transparent">
      <div className="mx-auto max-w-6xl px-4 py-16 sm:px-6 lg:px-8">
        <div className="mb-10 max-w-3xl space-y-3">
          <p className="text-xs uppercase tracking-[0.25em] text-neutral-500">
            Ordering information
          </p>
          <h2 className="text-2xl font-semibold text-white sm:text-3xl">
            How HeliosX ordering works.
          </h2>
          <p className="text-sm text-neutral-300 sm:text-[0.9rem]">
            We separate two things: choosing your system and magnification, and dialing in your fit
            (PD, working distance, and optional prescription). You can place your order first - your
            loupes do not go into production until your measurements are confirmed.
          </p>
        </div>

        <div className="grid gap-8 md:grid-cols-3">
          <div className="space-y-3 rounded-3xl border border-neutral-800 bg-neutral-950/70 p-5">
            <p className="text-[0.7rem] uppercase tracking-[0.25em] text-neutral-500">Step 1</p>
            <h3 className="text-sm font-semibold text-white sm:text-base">
              Choose your system and magnification
            </h3>
            <p className="text-xs leading-relaxed text-neutral-300">
              Start on the product page: pick the HeliosX system that matches your work
              (Galileo, Newton, Apollo, Kepler), choose your frame style, and select your
              preferred magnification.
            </p>
            <ul className="mt-2 space-y-1.5 text-xs text-neutral-400">
              <li>&bull; 2.5x-3.5x for most general and training use</li>
              <li>&bull; Higher magnification for fine, focused work</li>
              <li>&bull; You can always discuss changes with us before we build</li>
            </ul>
          </div>

          <div className="space-y-3 rounded-3xl border border-neutral-800 bg-neutral-950/80 p-5">
            <p className="text-[0.7rem] uppercase tracking-[0.25em] text-neutral-500">Step 2</p>
            <h3 className="text-sm font-semibold text-white sm:text-base">
              Secure checkout, then fit request email
            </h3>
            <p className="text-xs leading-relaxed text-neutral-300">
              Complete checkout on our encrypted payment page. Once your order is placed, you will
              receive an email with simple instructions to submit:
            </p>
            <ul className="mt-2 space-y-1.5 text-xs text-neutral-300">
              <li>&bull; Pupillary distance (PD)</li>
              <li>&bull; Preferred working distance (approximate is okay)</li>
              <li>&bull; Optional prescription details if you are using Rx lenses</li>
            </ul>
            <p className="mt-2 text-[0.7rem] text-neutral-400">
              If you do not know your PD or working distance, we will guide you through measuring
              it or using a phone-based tool - no special equipment required.
            </p>
          </div>

          <div className="space-y-3 rounded-3xl border border-neutral-800 bg-neutral-950/90 p-5">
            <p className="text-[0.7rem] uppercase tracking-[0.25em] text-neutral-500">Step 3</p>
            <h3 className="text-sm font-semibold text-white sm:text-base">
              We build your loupes, then ship
            </h3>
            <p className="text-xs leading-relaxed text-neutral-300">
              Once we receive and confirm your measurements, your loupes move into production.
              We verify alignment, optics, and ergonomics before they leave the lab.
            </p>
            <ul className="mt-2 space-y-1.5 text-xs text-neutral-300">
              <li>&bull; Your card is charged at checkout, but build starts after fit confirmation</li>
              <li>&bull; You will receive status updates as your order progresses</li>
              <li>&bull; If something looks off with your measurements, we will reach out before shipping</li>
            </ul>
          </div>
        </div>

        <div className="mt-10 rounded-3xl border border-sky-500/40 bg-sky-500/5 px-5 py-4 sm:px-6">
          <p className="text-[0.7rem] uppercase tracking-[0.25em] text-sky-300">
            PD and prescription workflow
          </p>
          <p className="mt-2 text-xs text-neutral-100 sm:text-[0.8rem]">
            You do not need your PD or Rx ready to explore frames and magnification. Place your
            order, and we will handle the fit process step-by-step via email. No guessing, no
            pressure - just clear instructions and a final double-check before your HeliosX system is built.
          </p>
        </div>
      </div>
    </section>
  );
}

export default OrderingInfoSection;
