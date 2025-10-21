import { Image } from "react-datocms";
import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay, A11y } from "swiper";
import "swiper/css/autoplay";
import "swiper/css";

export default function Carousel({ block }) {
  return (
    <div className="">
      <Swiper
        keyboard={true}
        modules={[A11y, Autoplay]}
        slidesPerView={"auto"}
        spaceBetween={30}
        autoplay={true}
        className="slider-auto-width"
      >
        {block.images &&
          Object.values(block.images).map((image) => (
            <SwiperSlide key={image.id}>
              <div className="max-w-[60vw] cover">
                <Image
                  key={image}
                  data={image.responsiveImage}
                  alt={image.alt}
                  title={image.title}
                  objectFit="cover"
                  className="h-full"
                />
              </div>
            </SwiperSlide>
          ))}
      </Swiper>
    </div>
  );
}
