import { Image } from "react-datocms";
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation, Pagination, A11y } from 'swiper';

import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';

export default function Cover({ block }) {
  return (
    <Swiper
      modules={[Navigation, Pagination, A11y]}
      navigation
      pagination={{ clickable: true }}
      slidesPerView={1}
    >
      {block.images && Object.values(block.images).map((image) => (
        <SwiperSlide key={image.id}>
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
