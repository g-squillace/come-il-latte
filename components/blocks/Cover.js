import { Image } from "react-datocms";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Pagination, A11y } from "swiper";

import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";

export default function Cover({ block }) {
  return (
    <div className="mx-auto max-w-screen-2xl relative">
      <Image
        data={block.images[0].responsiveImage}
        alt={block.images[0].alt}
        title={block.images[0].title}
      />
    </div>
  );
}
