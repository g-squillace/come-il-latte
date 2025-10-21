import { useInView } from "react-intersection-observer";
import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay, A11y, Navigation } from "swiper";
import "swiper/css/autoplay";
import "swiper/css";

export default function Quote({ block }) {
  const { ref, inView, entry } = useInView({
    threshold: 0.3,
    triggerOnce: true,
  });

  const inViewClass = inView ? "fade-down-on" : "fade-down-off";

  return (
    <section className="container -mt-12 lg:-mt-32 overflow-hidden max-w-screen">
      <div ref={ref} className="mx-auto max-w-screen-2xl">
        <Swiper
          keyboard={true}
          modules={[Navigation, A11y, Autoplay]}
          spaceBetween={30}
          autoplay={true}
          navigation={true}
        >
          {block.quotes.map((q) => (
            <SwiperSlide key={q.id}>
              <div
                className={`${inViewClass} fade-down text-center relative mt-12 pt-10 pb-10 lg:mt-24 lg:pt-24 lg:pb-0 before:content-['“'] before:text-accent before:absolute before:text-[6rem] before:leading-none before:left-1/2 before:-translate-x-1/2 before:-top-0 lg:before:text-[10rem]`}
              >
                <div className="font-heading italic text-alt max-w-prose mx-auto mb-6 lg:text-lg xl:mb-12">
                  {q.text}
                </div>
                <div className="font-bold text-xs uppercase text-accent tracking-widest my-2">
                  {q.authorName}
                </div>
              </div>
            </SwiperSlide>
          ))}
        </Swiper>
      </div>
    </section>
  );
}
