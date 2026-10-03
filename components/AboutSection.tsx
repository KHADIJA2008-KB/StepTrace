export function AboutSection() {
  return (
    <section id="about" className="border-t border-[#203b30] bg-[#081510] px-6 py-16 text-center text-[#f1f5eb] sm:px-10 sm:py-20" aria-labelledby="about-heading">
      <div className="mx-auto max-w-3xl">
        <p className="text-xs font-semibold uppercase tracking-[0.18em] text-[#9bb99b]">Why I built this</p>
        <h2 id="about-heading" className="mt-3 !text-2xl !font-semibold !tracking-tight !text-[#f1f5eb] sm:!text-3xl">Pseudocode is a start. Seeing it is different.</h2>
        <p className="mt-5 text-base leading-7 text-[#a8bdb1] sm:text-lg sm:leading-8">
          I made this because I wanted to close the gap between reading pseudocode and understanding what an algorithm actually does to data. Here, you can slow it down, follow every change, and build that intuition one step at a time.
        </p>
      </div>
    </section>
  )
}