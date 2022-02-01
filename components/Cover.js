import { Image } from "react-datocms";
import { Swiper, SwiperSlide } from 'swiper/react';

import 'swiper/css';

export default function Cover({ block }) {
  return (
    <Swiper
      slidesPerView={1}
    >
      {block.images && Object.values(block.images).map((image) => (
        <SwiperSlide>
          <Image
            key={image}
            data={image.responsiveImage}
            alt={image.alt}
            title={image.title}
          />
        </SwiperSlide>
      ))}
    </Swiper>
  );
}
