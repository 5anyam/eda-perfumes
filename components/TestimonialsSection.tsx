'use client';

import Slider from 'react-slick';
import Image from 'next/image';
import { Star, Quote, ShieldCheck } from 'lucide-react';

const testimonials = [
  {
    name: 'Priya Sharma',
    quote: "Bought Bite Me on a whim and honestly, I'm obsessed. Wore it to a dinner party and got compliments the entire night. The dry-down is gorgeous — warm, slightly spicy, stays close to the skin. Already on my second bottle.",
    image: '/users/parul.avif',
    rating: 5,
    perfume: 'Bite Me',
    location: 'Mumbai',
    date: '2 weeks ago',
  },
  {
    name: 'Dr. Abhinav Rana',
    quote: "As someone who's tried dozens of ouds, Oudh Shukran genuinely surprised me. It's not synthetic or overpowering — there's a smoothness to it that works even in the office. Solid 8+ hours of longevity on my skin.",
    image: '/users/dr-abhinav-rana.jpeg',
    rating: 5,
    perfume: 'Oudh Shukran',
    location: 'Delhi',
    date: '1 month ago',
  },
  {
    name: 'Savita Mehra',
    quote: "Nude Poison is that effortlessly elegant scent I was looking for. Not too sweet, not too strong — just the right amount of sophistication. My husband noticed it immediately. This is my everyday go-to now.",
    image: '/users/savita.webp',
    rating: 5,
    perfume: 'Nude Poison',
    location: 'Jaipur',
    date: '3 weeks ago',
  },
  {
    name: 'Ankit Verma',
    quote: "Lusty Nights lives up to its name. The woody base with that spicy kick is perfect for evenings out. I get asked what I'm wearing almost every time. Projection is insane for the first 3-4 hours, then it settles beautifully.",
    image: '/users/ankit.jpeg',
    rating: 5,
    perfume: 'Lusty Nights',
    location: 'Pune',
    date: '1 week ago',
  },
  {
    name: 'Vanshika Kapoor',
    quote: "Bad Habits is dangerously addictive! It's bold and unapologetic — exactly the kind of fragrance that makes you feel powerful. Lasted through a full workday plus evening drinks. Worth every rupee.",
    image: '/users/vanshika.jpeg',
    rating: 5,
    perfume: 'Bad Habits',
    location: 'Chandigarh',
    date: '5 days ago',
  },
  {
    name: 'Anil Tyagi',
    quote: "Picked up the Guilty Premium pocket perfume for travel. Perfect size, and the scent punches way above its price. Clean, fresh, and versatile. Now I carry it everywhere — gym bag, office drawer, you name it.",
    image: '/users/anil-tyagi.jpeg',
    rating: 4,
    perfume: 'Guilty Premium',
    location: 'Lucknow',
    date: '2 months ago',
  },
];

const TestimonialsCarousel = () => {
  const settings = {
    dots: true,
    infinite: true,
    speed: 600,
    autoplay: true,
    autoplaySpeed: 5000,
    slidesToShow: 3,
    slidesToScroll: 1,
    arrows: false,
    cssEase: 'ease-in-out',
    dotsClass: 'slick-dots custom-dots',
    responsive: [
      {
        breakpoint: 1024,
        settings: {
          slidesToShow: 2,
          slidesToScroll: 1,
        },
      },
      {
        breakpoint: 768,
        settings: {
          slidesToShow: 1,
          slidesToScroll: 1,
        },
      },
    ],
  };

  const StarRating = ({ rating }: { rating: number }) => (
    <div className="flex gap-0.5">
      {[...Array(5)].map((_, i) => (
        <Star
          key={i}
          className={`w-4 h-4 ${
            i < rating
              ? 'text-amber-400 fill-amber-400'
              : 'text-gray-200 fill-gray-200'
          }`}
        />
      ))}
    </div>
  );

  return (
    <section className="relative bg-white py-20 px-4 overflow-hidden">
      <div className="max-w-7xl mx-auto relative z-10">
        {/* Header */}
        <div className="text-center mb-14">
          <p className="text-amber-600 text-xs font-semibold tracking-[0.2em] uppercase mb-3">
            Testimonials
          </p>
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            What Our Customers Say
          </h2>
          <div className="flex items-center justify-center gap-2 mb-4">
            <div className="w-8 h-px bg-amber-400" />
            <div className="w-2 h-2 rounded-full bg-amber-400" />
            <div className="w-8 h-px bg-amber-400" />
          </div>
          <div className="flex items-center justify-center gap-2 text-gray-500 text-sm">
            <div className="flex gap-0.5">
              {[...Array(5)].map((_, i) => (
                <Star key={i} className="w-4 h-4 text-amber-400 fill-amber-400" />
              ))}
            </div>
            <span className="font-medium text-gray-700">4.9/5</span>
            <span>from 2,500+ reviews</span>
          </div>
        </div>

        {/* Testimonials Carousel */}
        <div className="testimonials-slider">
          <Slider {...settings}>
            {testimonials.map((testimonial, index) => (
              <div key={index} className="px-3 pb-4">
                <div className="group bg-white rounded-2xl shadow-sm hover:shadow-xl border border-gray-100 p-7 min-h-[370px] flex flex-col transition-all duration-500 relative overflow-hidden">
                  {/* Accent top border */}
                  <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-amber-400 via-amber-500 to-orange-400 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

                  {/* Quote icon */}
                  <div className="absolute top-5 right-5 opacity-[0.06] group-hover:opacity-[0.1] transition-opacity duration-500">
                    <Quote className="w-16 h-16 text-gray-900" />
                  </div>

                  {/* Rating + Product tag */}
                  <div className="flex items-center justify-between mb-5">
                    <StarRating rating={testimonial.rating} />
                    <span className="text-[11px] font-medium bg-amber-50 text-amber-700 px-2.5 py-1 rounded-full border border-amber-100">
                      {testimonial.perfume}
                    </span>
                  </div>

                  {/* Quote */}
                  <blockquote className="text-gray-600 text-[13.5px] leading-relaxed flex-1 mb-6 relative z-10">
                    {testimonial.quote}
                  </blockquote>

                  {/* Divider */}
                  <div className="w-full h-px bg-gray-100 mb-5" />

                  {/* Profile Section */}
                  <div className="flex items-center gap-3.5">
                    <div className="w-11 h-11 rounded-full overflow-hidden ring-2 ring-amber-100 ring-offset-2 flex-shrink-0">
                      <Image
                        src={testimonial.image}
                        alt={testimonial.name}
                        width={44}
                        height={44}
                        className="object-cover w-full h-full"
                      />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-1.5">
                        <h3 className="text-gray-900 font-semibold text-sm truncate">
                          {testimonial.name}
                        </h3>
                        <ShieldCheck className="w-3.5 h-3.5 text-emerald-500 flex-shrink-0" />
                      </div>
                      <p className="text-gray-400 text-xs">
                        {testimonial.location} &middot; {testimonial.date}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </Slider>
        </div>

        {/* Bottom trust bar */}
        <div className="mt-16 flex flex-col sm:flex-row items-center justify-center gap-6 sm:gap-10">
          <div className="flex items-center gap-2.5">
            <div className="flex -space-x-2.5">
              {testimonials.slice(0, 5).map((testimonial, index) => (
                <Image
                  key={index}
                  src={testimonial.image}
                  alt={testimonial.name}
                  width={36}
                  height={36}
                  className="w-9 h-9 rounded-full border-[2.5px] border-white object-cover shadow-sm"
                />
              ))}
              <div className="w-9 h-9 rounded-full border-[2.5px] border-white bg-amber-50 flex items-center justify-center shadow-sm">
                <span className="text-amber-600 text-[10px] font-bold">+2k</span>
              </div>
            </div>
            <p className="text-gray-700 text-sm font-medium">
              Loved by <span className="text-amber-600 font-bold">2,500+</span> customers
            </p>
          </div>

          <div className="hidden sm:block w-px h-8 bg-gray-200" />

          <div className="flex items-center gap-2 text-gray-500 text-xs">
            <ShieldCheck className="w-4 h-4 text-emerald-500" />
            <span>All reviews from verified purchases</span>
          </div>
        </div>
      </div>

      <style jsx>{`
        .testimonials-slider .custom-dots {
          bottom: -50px;
          display: flex !important;
          justify-content: center;
          align-items: center;
          gap: 6px;
        }
        .testimonials-slider .custom-dots li {
          margin: 0;
          width: auto;
          height: auto;
        }
        .testimonials-slider .custom-dots li button {
          width: 8px;
          height: 8px;
          border-radius: 50%;
          background: #d1d5db;
          border: none;
          transition: all 0.3s ease;
          padding: 0;
        }
        .testimonials-slider .custom-dots li button:before {
          display: none;
        }
        .testimonials-slider .custom-dots li.slick-active button {
          background: #f59e0b;
          width: 24px;
          border-radius: 5px;
        }
        .testimonials-slider .custom-dots li button:hover {
          background: #9ca3af;
        }
      `}</style>
    </section>
  );
};

export default TestimonialsCarousel;
