'use client'

import React, { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useQuery } from '@tanstack/react-query'
import { fetchProducts } from '../../../../lib/woocommerceApi'
import { useCart } from '../../../../lib/cart'
import { toast } from '../../../../hooks/use-toast'
import { useFacebookPixel } from '../../../../hooks/useFacebookPixel'
import ImageGallery from '../../../../components/ImageGallery'
import { Tab } from '@headlessui/react'
// import ProductFAQ from '../../../../components/ProductFaq'
import RelatedProducts from '../../../../components/RelatedProducts'
import ProductReviews from '../../../../components/ProductReviews'
import { Heart, Star, Shield, Truck, Award, CreditCard, Plus, Minus, Gift } from 'lucide-react'

function decodeHtml(html: string): string {
  const txt = typeof document !== 'undefined' ? document.createElement('textarea') : null
  if (txt) { txt.innerHTML = html; return txt.value }
  return html.replace(/&amp;/g, '&').replace(/&lt;/g, '<').replace(/&gt;/g, '>').replace(/&quot;/g, '"').replace(/&#039;/g, "'")
}

export interface ImageData { src: string }
export interface Attribute { option: string }
export interface Product {
  id: number
  name: string
  slug: string
  price: string
  regular_price: string
  description?: string
  short_description?: string
  images: ImageData[]
  attributes?: Attribute[]
}

export default function ProductClient({
  initialProduct,
  allProductsInitial,
  slug,
}: {
  initialProduct?: Product | undefined
  allProductsInitial?: Product[] | undefined
  slug: string
}) {
  const router = useRouter()
  const { addToCart, items } = useCart()
  const { trackViewContent, trackAddToCart, trackInitiateCheckout } = useFacebookPixel()

  const { data: products, isLoading, error } = useQuery<Product[]>({
    queryKey: ['all-products'],
    queryFn: async () => await fetchProducts() as Product[],
    initialData: allProductsInitial,
    staleTime: 60_000,
    enabled: Boolean(slug),
  })

  const rawProduct: Product | undefined =
    initialProduct ??
    products?.find((p) => p.slug === slug || p.id.toString() === slug)

  // Product short_description overrides
  const shortDescOverrides: Record<string, string> = {
    'oudh-shukran-eau-de-parfum-100ml': '<p><span style="font-weight: 400;">Discover the timeless richness of</span><strong> Oudh Shukran</strong><span style="font-weight: 400;">, a luxurious Arabic fragrance crafted to reflect tradition, depth, and quiet confidence. Designed for those </span><strong>who appreciate bold oriental scents</strong><span style="font-weight: 400;">, this perfume blends elegance with intensity to create a truly memorable presence.</span></p>\n<p><span style="font-weight: 400;">With its deep oudh character and warm woody undertones, </span><strong>Oudh Shukran</strong><span style="font-weight: 400;"> is more than a fragrance — it\'s a</span><strong> statement of sophistication</strong><span style="font-weight: 400;"> rooted in </span><strong>Middle Eastern perfumery</strong><span style="font-weight: 400;">. Powerful yet refined, it leaves a lasting impression wherever you go.</span></p>',
    'oudh-shukran-eau-de-parfum-10ml': '<p><span style="font-weight: 400;">Carry luxury wherever you go with the </span><strong>Oudh Shukran pocket spray perfume</strong><span style="font-weight: 400;">, a compact version of the classic </span><strong>Arabic attar fragrance</strong><span style="font-weight: 400;">. Designed for those who value bold oriental richness in a travel-friendly format, this miniature perfume retains the same deep oudh character and woody sophistication as the full-sized bottle.</span></p>\n<p><span style="font-weight: 400;">Perfect as the </span><strong>best pocket perfume for men</strong><span style="font-weight: 400;">, this 10ml spray is also appreciated as a </span><strong>mens attar perfume</strong><span style="font-weight: 400;">, offering an easy way to refresh your scent throughout the day.</span></p>',
    'bite-me-seductive-floral-citrus-eau-de-parfum-10ml': '<p><span style="font-weight: 400;">Take the allure of Bite Me Seductive Floral Citrus wherever you go with this compact </span><strong>pocket size perfume</strong><span style="font-weight: 400;">. Crafted for women who love vibrant, refreshing scents, this 10ml perfume combines zesty citrus with delicate floral notes for a versatile fragrance.</span></p>\n<p><span style="font-weight: 400;">Perfect as a </span><strong>pocket perfume for womens</strong><span style="font-weight: 400;">, it also works beautifully as a </span><strong>Floral citrus perfume for her</strong><span style="font-weight: 400;"> or </span><strong>citrus notes perfume</strong><span style="font-weight: 400;"> for daily wear. Its travel-friendly design ensures you can refresh your scent anytime, anywhere.</span></p>',
    'guilty-premium-eau-de-parfum-10ml': '<p><span style="font-weight: 400;">Carry the allure of Guilty Premium wherever you go with this compact </span><strong>small pocket perfume</strong><span style="font-weight: 400;">. Designed for women who love bold and expressive fragrances, it combines modern floral-aromatic sophistication with long-lasting performance.</span></p>\n<p><span style="font-weight: 400;">Perfect as a </span><strong>girls pocket perfume</strong><span style="font-weight: 400;">, this travel-friendly 10ml bottle delivers the same statement-making presence as the full-sized version. Inspired by </span><strong>Guilty Midnight Shades perfume</strong><span style="font-weight: 400;">, it\u2019s ideal for evening wear, special occasions, or anytime you want to feel unforgettable.</span></p>',
    'lusty-nights-premium-unisex-eau-de-parfum-10ml': '<p><span style="font-weight: 400;">Carry the captivating charm of Lusty Nights wherever you go with this </span><strong>pocket size perfume</strong><span style="font-weight: 400;">. Designed for both men and women, it blends citrus freshness with woody depth to create a balanced, long-lasting fragrance.</span></p>\n<p><span style="font-weight: 400;">Ideal as the </span><strong>best pocket perfume for men</strong><span style="font-weight: 400;">, this 10ml travel-friendly bottle allows you to refresh your scent anytime. With its modern unisex appeal, Lusty Nights is perfect for evenings, special occasions, or whenever you want to make an unforgettable impression.</span></p>',
    'nude-poison-elegant-unisex-eau-de-parfum-10ml': '<p><span style="font-weight: 400;">Carry sophistication in your pocket with Nude Poison, a </span><strong>mini pocket perfume</strong><span style="font-weight: 400;"> designed for versatile elegance. This </span><strong>Elegant Unisex perfume</strong><span style="font-weight: 400;"> opens with crisp citrus freshness and evolves into soft jasmine layers with warm sandalwood undertones, creating a luxurious scent experience for both men and women.</span></p>\n<p><span style="font-weight: 400;">Its compact 10ml size makes it perfect for travel or quick fragrance touch-ups, while its balanced profile ensures it remains one of the </span><strong>best luxury perfumes for her</strong><span style="font-weight: 400;">. From daytime elegance to evening allure, Nude Poison leaves a lasting impression wherever you go.</span></p>',
    'bad-habits-eau-de-parfum-10ml': '<p><span style="font-weight: 400;">Carry allure in your pocket with Bad Habits, a </span><strong>small pocket perfume</strong><span style="font-weight: 400;"> crafted to balance fresh citrus brightness with seductive floral undertones. This </span><strong>pocket size perfume</strong><span style="font-weight: 400;"> is perfect for those who want a refreshing yet captivating fragrance anywhere, anytime.</span></p>\n<p><span style="font-weight: 400;">Its 10ml mini size makes it ideal for travel, quick touch-ups, or daily use, while the carefully layered scent ensures it remains a </span><strong>seductive perfume for women</strong><span style="font-weight: 400;">. From casual outings to evening events, Bad Habits creates an unforgettable impression.</span></p>',
  };

  // Product full description overrides
  const descriptionOverrides: Record<string, string> = {
    'oudh-shukran-eau-de-parfum-100ml': `<p><span style="font-weight: 400;">Oudh Shukran by EDA Perfumes is a refined </span><strong>Arabic attar perfume</strong><span style="font-weight: 400;"> inspired by the depth and richness of traditional Middle Eastern perfumery. Designed for those who appreciate bold, long-lasting fragrances, this Eau de Parfum delivers a luxurious scent experience rooted in authenticity and craftsmanship.</span></p>
<p><span style="font-weight: 400;">The fragrance opens with warm, resinous accords that immediately set a powerful tone. As it evolves, rich oudh notes take center stage, offering depth, intensity, and a distinctly premium character. The base settles into smooth woody undertones that enhance longevity and leave a strong, confident impression.</span></p>
<p><span style="font-weight: 400;">Ideal as an </span><strong>Arabic attar perfume for men</strong><span style="font-weight: 400;">, Oudh Shukran reflects strength, elegance, and timeless appeal. Its composition places it among </span><strong>premium arabic perfumes</strong><span style="font-weight: 400;">, making it suitable for evening wear, formal occasions, and cooler weather. For those seeking the </span><strong>best arabic attar perfume</strong><span style="font-weight: 400;">, this fragrance delivers both tradition and modern refinement.</span></p>
<p><span style="font-weight: 400;">Crafted with precision and quality-focused ingredients, Oudh Shukran represents EDA Perfumes\u2019 commitment to creating authentic, high-performance fragrances that honor Middle Eastern scent traditions.</span></p>
<h2><strong>How to Use</strong></h2>
<ul>
<li style="font-weight: 400;"><span style="font-weight: 400;">Apply on clean, dry skin for optimal performance</span></li>
<li style="font-weight: 400;"><span style="font-weight: 400;">Spray lightly on pulse points such as the neck, wrists, and behind the ears</span></li>
<li style="font-weight: 400;"><span style="font-weight: 400;">Hold the bottle 5 to 7 inches away while applying</span></li>
<li style="font-weight: 400;"><span style="font-weight: 400;">Do not rub after spraying to maintain the fragrance structure</span></li>
<li style="font-weight: 400;"><span style="font-weight: 400;">A little goes a long way due to its rich and intense profile</span></li>
</ul>
<h2><strong>Key Highlights</strong></h2>
<ul>
<li style="font-weight: 400;"><span style="font-weight: 400;">Authentic arabic attar inspired fragrance</span></li>
<li style="font-weight: 400;"><span style="font-weight: 400;">Rich oudh-based scent with premium depth</span></li>
<li style="font-weight: 400;"><span style="font-weight: 400;">Long-lasting Eau de Parfum concentration</span></li>
<li style="font-weight: 400;"><span style="font-weight: 400;">Ideal for men who prefer bold fragrances</span></li>
<li style="font-weight: 400;"><span style="font-weight: 400;">Crafted by EDA Perfumes with traditional influence</span></li>
</ul>
<h3><strong>Inspired by Traditional Arabic Perfumery</strong></h3>
<p><span style="font-weight: 400;">Oudh Shukran captures the essence of classic Middle Eastern fragrances, blending rich oudh notes with modern refinement.</span></p>
<h3><strong>Deep and Long-Lasting Scent Profile</strong></h3>
<p><span style="font-weight: 400;">This premium arabic perfume is designed to evolve beautifully on the skin, offering depth, warmth, and lasting presence.</span></p>
<h3><strong>Perfect for Evening and Special Occasions</strong></h3>
<p><span style="font-weight: 400;">With its bold character, this </span><strong>arabic attar perfume</strong><span style="font-weight: 400;"> is best suited for formal wear, celebrations, and cooler climates.</span></p>
<h3><strong>Why Choose EDA Perfumes</strong></h3>
<p><span style="font-weight: 400;">EDA Perfumes creates thoughtfully crafted fragrances that respect tradition while delivering modern performance and consistency.</span></p>`,
    'oudh-shukran-eau-de-parfum-10ml': `<p><span style="font-weight: 400;">Oudh Shukran by EDA Perfumes in 10ml is a travel-ready </span><strong>pocket spray perfume</strong><span style="font-weight: 400;"> that encapsulates the luxurious depth of the classic </span><strong>Arabic attar fragrance</strong><span style="font-weight: 400;">. Crafted for convenience without compromising on richness, this compact </span><strong>oud pocket perfume</strong><span style="font-weight: 400;"> delivers long-lasting, sophisticated aroma on-the-go.</span></p>
<h2><strong>Key Fragrance Notes</strong></h2>
<ul>
<li style="font-weight: 400;"><span style="font-weight: 400;"><strong>Top Notes:</strong> Subtle citrus brightness</span></li>
<li style="font-weight: 400;"><span style="font-weight: 400;"><strong>Heart Notes:</strong> Rich oud accords, resinous warmth</span></li>
<li style="font-weight: 400;"><span style="font-weight: 400;"><strong>Base Notes:</strong> Smooth woody undertones, lasting depth</span></li>
</ul>
<p><span style="font-weight: 400;">This combination ensures that Oudh Shukran retains its premium character, whether carried in your pocket, bag, or travel kit.</span></p>
<h2><strong>Perfect On-the-Go Companion</strong></h2>
<p><span style="font-weight: 400;">As the </span><strong>best pocket perfume for men</strong><span style="font-weight: 400;">, this 10ml spray provides all the elegance and intensity of the full-sized Oudh Shukran. Its compact size makes it ideal for office use, evening outings, or quick refreshes during travel.</span></p>
<p><span style="font-weight: 400;">Whether you seek a </span><strong>mens attar perfume</strong><span style="font-weight: 400;">, </span><strong>oud attar perfume</strong><span style="font-weight: 400;">, or simply a portable touch of luxury, this </span><strong>pocket spray perfume</strong><span style="font-weight: 400;"> is a versatile addition to your fragrance collection.</span></p>
<h2><strong>How to Use</strong></h2>
<ul>
<li style="font-weight: 400;"><span style="font-weight: 400;">Apply on clean, dry skin for optimal performance</span></li>
<li style="font-weight: 400;"><span style="font-weight: 400;">Spray lightly on pulse points such as the neck, wrists, and behind the ears</span></li>
<li style="font-weight: 400;"><span style="font-weight: 400;">Hold the bottle 3 to 5 inches away while applying</span></li>
<li style="font-weight: 400;"><span style="font-weight: 400;">Do not rub after spraying to maintain fragrance integrity</span></li>
<li style="font-weight: 400;"><span style="font-weight: 400;">Perfect for reapplication throughout the day due to its travel-friendly size</span></li>
</ul>
<h2><strong>Key Highlights</strong></h2>
<ul>
<li style="font-weight: 400;"><span style="font-weight: 400;">Travel-ready <strong>pocket spray perfume</strong> \u2013 10ml</span></li>
<li style="font-weight: 400;"><span style="font-weight: 400;">Rich <strong>oud attar perfume</strong> with oriental depth</span></li>
<li style="font-weight: 400;"><span style="font-weight: 400;">Long-lasting <strong>mens attar perfume</strong></span></li>
<li style="font-weight: 400;"><span style="font-weight: 400;">Perfect as the <strong>best pocket perfume for men</strong></span></li>
<li style="font-weight: 400;"><span style="font-weight: 400;">Compact design for convenience and portability</span></li>
<li style="font-weight: 400;"><span style="font-weight: 400;">Maintains full-sized fragrance experience in a mini format</span></li>
<li style="font-weight: 400;"><span style="font-weight: 400;">Crafted by EDA Perfumes with premium quality</span></li>
</ul>
<h3><strong>Bold Arabic Elegance in a Pocket Spray</strong></h3>
<p><span style="font-weight: 400;">Oudh Shukran 10ml delivers the sophistication and timelessness of traditional Arabic perfumery in a compact, portable format. Its rich oud, resin, and woody notes evolve beautifully, making it perfect for daily wear or special occasions.</span></p>
<h3><strong>Deep and Long-Lasting Scent Profile</strong></h3>
<p><span style="font-weight: 400;">Despite its small size, this </span><strong>pocket spray perfume</strong><span style="font-weight: 400;"> provides strong projection and impressive longevity. From vibrant top notes to a deep, woody base, the scent unfolds elegantly throughout the day.</span></p>
<h3><strong>Ideal for Travel and Everyday Use</strong></h3>
<p><span style="font-weight: 400;">Carry Oudh Shukran wherever life takes you. Its portable design ensures that your fragrance remains fresh during office hours, evening outings, or trips, making it the versatile and ultimate </span><strong>best pocket perfume for men</strong><span style="font-weight: 400;">.</span></p>
<h3><strong>Why Choose EDA Perfumes</strong></h3>
<p><span style="font-weight: 400;">EDA Perfumes creates high-performance fragrances that honor tradition while delivering modern convenience. This </span><strong>pocket spray perfume</strong><span style="font-weight: 400;"> reflects our commitment to quality, consistency, and memorable scent experiences designed for fragrance enthusiasts on-the-go.</span></p>`,
    'bite-me-seductive-floral-citrus-eau-de-parfum-10ml': `<p><span style="font-weight: 400;">Bite Me Seductive Floral Citrus by EDA Perfumes is a travel-ready </span><strong>pocket size perfume</strong><span style="font-weight: 400;"> that captures the perfect balance of freshness and elegance. Ideal for women who want a luxurious fragrance in a convenient, portable format, this 10ml Eau de Parfum retains the same seductive power as the full-sized version.</span></p>
<h2><strong>Fragrance Profile</strong></h2>
<ul>
<li style="font-weight: 400;"><span style="font-weight: 400;"><strong>Top Notes:</strong> Bright citrus accents for an invigorating opening</span></li>
<li style="font-weight: 400;"><span style="font-weight: 400;"><strong>Heart Notes:</strong> Soft floral bouquet for feminine sophistication</span></li>
<li style="font-weight: 400;"><span style="font-weight: 400;"><strong>Base Notes:</strong> Subtle musk and warmth for lasting impression</span></li>
</ul>
<p><span style="font-weight: 400;">The combination delivers a </span><strong>Floral citrus perfume for her</strong><span style="font-weight: 400;"> that evolves beautifully on the skin while maintaining a refreshing character throughout the day.</span></p>
<h2><strong>Perfect Travel Companion</strong></h2>
<p><span style="font-weight: 400;">This </span><strong>pocket size perfume</strong><span style="font-weight: 400;"> is ideal for quick touch-ups during office hours, evening outings, or weekend getaways. Its compact size makes it the ultimate </span><strong>pocket perfume for womens</strong><span style="font-weight: 400;">, while the elegant floral-citrus blend ensures it works in any setting.</span></p>
<h2><strong>How to Use</strong></h2>
<ul>
<li style="font-weight: 400;"><span style="font-weight: 400;">Apply on clean, dry skin for best results</span></li>
<li style="font-weight: 400;"><span style="font-weight: 400;">Spray lightly on pulse points such as the neck, wrists, and behind the ears</span></li>
<li style="font-weight: 400;"><span style="font-weight: 400;">Hold the bottle 3 to 5 inches away while applying</span></li>
<li style="font-weight: 400;"><span style="font-weight: 400;">Avoid rubbing to preserve the fragrance structure</span></li>
<li style="font-weight: 400;"><span style="font-weight: 400;">Reapply lightly throughout the day for a continuous fresh scent</span></li>
</ul>
<h2><strong>Key Highlights</strong></h2>
<ul>
<li style="font-weight: 400;"><span style="font-weight: 400;">Travel-ready <strong>pocket size perfume</strong> \u2013 10ml</span></li>
<li style="font-weight: 400;"><span style="font-weight: 400;">Vibrant <strong>Floral citrus perfume for her</strong></span></li>
<li style="font-weight: 400;"><span style="font-weight: 400;">Refreshing citrus top notes and soft floral heart</span></li>
<li style="font-weight: 400;"><span style="font-weight: 400;">Works as a <strong>pocket perfume for womens</strong></span></li>
<li style="font-weight: 400;"><span style="font-weight: 400;">Long-lasting Eau de Parfum concentration</span></li>
<li style="font-weight: 400;"><span style="font-weight: 400;">Ideal for office, evenings, or quick scent refreshes</span></li>
<li style="font-weight: 400;"><span style="font-weight: 400;">Compact design for convenience without compromising quality</span></li>
<li style="font-weight: 400;"><span style="font-weight: 400;">Crafted by EDA Perfumes for elegance and performance</span></li>
</ul>
<h3><strong>Seductive Citrus Elegance Anywhere</strong></h3>
<p><span style="font-weight: 400;">Bite Me Seductive Floral Citrus pocket spray captures the essence of feminine sophistication in a portable format. Its zesty citrus top notes blend seamlessly with a delicate floral bouquet, creating a fragrance that is uplifting, confident, and versatile.</span></p>
<h3><strong>Deep and Long-Lasting Scent Profile</strong></h3>
<p><span style="font-weight: 400;">Despite its small size, this </span><strong>pocket size perfume</strong><span style="font-weight: 400;"> delivers strong projection and lasting aroma. From fresh citrus brightness to soft floral elegance, the scent develops gracefully for all-day enjoyment.</span></p>
<h3><strong>Ideal for Everyday and Travel</strong></h3>
<p><span style="font-weight: 400;">Perfect as a </span><strong>pocket perfume for womens</strong><span style="font-weight: 400;">, this 10ml bottle allows you to maintain your signature scent anywhere. Whether for office, social events, or travel, it ensures your fragrance is always at its best.</span></p>
<h3><strong>Why Choose EDA Perfumes</strong></h3>
<p><span style="font-weight: 400;">EDA Perfumes combines modern sophistication with convenience. This </span><strong>pocket size perfume</strong><span style="font-weight: 400;"> demonstrates their commitment to quality, consistency, and memorable fragrance experiences, making it a must-have for women who love floral-citrus elegance on-the-go.</span></p>`,
    'guilty-premium-eau-de-parfum-10ml': `<p><span style="font-weight: 400;">Guilty Premium by EDA Perfumes is a </span><strong>small pocket perfume</strong><span style="font-weight: 400;"> crafted for confident women who love expressive scents in a portable format. This 10ml pocket spray offers the luxury of the full-sized Guilty Premium in a convenient, travel-ready size.</span></p>
<h2><strong>Fragrance Profile</strong></h2>
<ul>
<li style="font-weight: 400;"><span style="font-weight: 400;"><strong>Top Notes:</strong> Vibrant, contemporary notes that capture attention immediately</span></li>
<li style="font-weight: 400;"><span style="font-weight: 400;"><strong>Heart Notes:</strong> Floral-aromatic composition adding depth and sophistication</span></li>
<li style="font-weight: 400;"><span style="font-weight: 400;"><strong>Base Notes:</strong> Warm undertones for long-lasting projection and intensity</span></li>
</ul>
<p><span style="font-weight: 400;">The result is a </span><strong>guilty midnight perfume for women</strong><span style="font-weight: 400;"> that blends boldness with elegance. Whether for a casual outing or a special evening, this fragrance ensures you leave a memorable impression.</span></p>
<h2><strong>Travel-Friendly Elegance</strong></h2>
<p><span style="font-weight: 400;">Compact yet powerful, this </span><strong>small pocket perfume</strong><span style="font-weight: 400;"> is perfect as a </span><strong>girls pocket perfume</strong><span style="font-weight: 400;"> for everyday touch-ups. Its 10ml design fits easily into purses, handbags, or pockets without compromising on quality or longevity.</span></p>
<h2><strong>How to Use</strong></h2>
<ul>
<li style="font-weight: 400;"><span style="font-weight: 400;">Apply on clean, dry skin for optimal results</span></li>
<li style="font-weight: 400;"><span style="font-weight: 400;">Spray lightly on pulse points such as the neck, wrists, and behind the ears</span></li>
<li style="font-weight: 400;"><span style="font-weight: 400;">Hold the bottle 3 to 5 inches away while applying</span></li>
<li style="font-weight: 400;"><span style="font-weight: 400;">Avoid rubbing to maintain fragrance integrity</span></li>
<li style="font-weight: 400;"><span style="font-weight: 400;">Reapply lightly for extended wear</span></li>
</ul>
<h2><strong>Key Highlights</strong></h2>
<ul>
<li style="font-weight: 400;"><span style="font-weight: 400;">Compact <strong>small pocket perfume</strong> \u2013 10ml</span></li>
<li style="font-weight: 400;"><span style="font-weight: 400;">Inspired by <strong>Guilty Midnight Shades perfume</strong></span></li>
<li style="font-weight: 400;"><span style="font-weight: 400;">Bold floral-aromatic fragrance for confident women</span></li>
<li style="font-weight: 400;"><span style="font-weight: 400;">Ideal <strong>girls pocket perfume</strong> for travel and everyday use</span></li>
<li style="font-weight: 400;"><span style="font-weight: 400;">Long-lasting Eau de Parfum concentration</span></li>
<li style="font-weight: 400;"><span style="font-weight: 400;">Convenient pocket spray for on-the-go freshness</span></li>
<li style="font-weight: 400;"><span style="font-weight: 400;">Crafted by EDA Perfumes for quality and performance</span></li>
</ul>
<h3><strong>Bold and Expressive Presence</strong></h3>
<p><span style="font-weight: 400;">This </span><strong>small pocket perfume</strong><span style="font-weight: 400;"> captures the bold spirit of Guilty Premium. Its floral-aromatic notes develop elegantly on the skin, delivering sophistication and confidence in every spray.</span></p>
<h3><strong>Long-Lasting Scent Profile</strong></h3>
<p><span style="font-weight: 400;">Despite its compact size, this 10ml pocket spray offers impressive projection and lasting aroma. From vibrant opening notes to warm, lingering depth, the fragrance evolves beautifully throughout the day.</span></p>
<h3><strong>Perfect for Every Occasion</strong></h3>
<p><span style="font-weight: 400;">Whether you\u2019re heading to an evening party, a casual outing, or traveling, this </span><strong>guilty midnight perfume for women</strong><span style="font-weight: 400;"> ensures your scent is always impactful. Its portability makes it the ultimate </span><strong>girls pocket perfume</strong><span style="font-weight: 400;"> for modern lifestyles.</span></p>
<h3><strong>Why Choose EDA Perfumes</strong></h3>
<p><span style="font-weight: 400;">EDA Perfumes combines modern elegance with convenience. This </span><strong>small pocket perfume</strong><span style="font-weight: 400;"> reflects their commitment to creating high-quality, memorable fragrances that are perfect for women on-the-go.</span></p>`,
    'lusty-nights-premium-unisex-eau-de-parfum-10ml': `<p><span style="font-weight: 400;">Lusty Nights by EDA Perfumes is a </span><strong>pocket size perfume</strong><span style="font-weight: 400;"> crafted for modern fragrance lovers who desire a luxurious scent on the go. This 10ml pocket spray combines zesty citrus top notes with a warm, woody base, delivering a sophisticated and versatile aroma suitable for all occasions.</span></p>
<h2><strong>Fragrance Profile</strong></h2>
<ul>
<li style="font-weight: 400;"><span style="font-weight: 400;"><strong>Top Notes:</strong> Zesty citrus bursts for instant freshness</span></li>
<li style="font-weight: 400;"><span style="font-weight: 400;"><strong>Heart Notes:</strong> Subtle floral hints to add complexity and elegance</span></li>
<li style="font-weight: 400;"><span style="font-weight: 400;"><strong>Base Notes:</strong> Rich woody undertones for lasting depth and sophistication</span></li>
</ul>
<p><span style="font-weight: 400;">The result is a </span><strong>Woody Scent Premium Perfume</strong><span style="font-weight: 400;"> with </span><strong>premium unisex citrus perfume</strong><span style="font-weight: 400;"> qualities, ideal for those who want a confident and refined scent anytime.</span></p>
<h2><strong>Travel-Ready Elegance</strong></h2>
<p><span style="font-weight: 400;">Compact and portable, this </span><strong>pocket size perfume</strong><span style="font-weight: 400;"> is perfect as the </span><strong>best pocket perfume for men</strong><span style="font-weight: 400;"> or as a versatile unisex fragrance. Its 10ml design fits seamlessly in purses, backpacks, or pockets, making it ideal for quick touch-ups or travel.</span></p>
<h2><strong>How to Use</strong></h2>
<ul>
<li style="font-weight: 400;"><span style="font-weight: 400;">Apply on clean, dry skin for optimal performance</span></li>
<li style="font-weight: 400;"><span style="font-weight: 400;">Spray lightly on pulse points such as neck, wrists, and behind the ears</span></li>
<li style="font-weight: 400;"><span style="font-weight: 400;">Hold the bottle 3 to 5 inches away while applying</span></li>
<li style="font-weight: 400;"><span style="font-weight: 400;">Avoid rubbing after spraying to maintain the fragrance integrity</span></li>
<li style="font-weight: 400;"><span style="font-weight: 400;">Reapply lightly for longer-lasting wear</span></li>
</ul>
<h2><strong>Key Highlights</strong></h2>
<ul>
<li style="font-weight: 400;"><span style="font-weight: 400;">Compact <strong>pocket size perfume</strong> \u2013 10ml</span></li>
<li style="font-weight: 400;"><span style="font-weight: 400;"><strong>Premium unisex citrus perfume</strong> with balanced woody undertones</span></li>
<li style="font-weight: 400;"><span style="font-weight: 400;">Travel-friendly <strong>best pocket perfume for men</strong></span></li>
<li style="font-weight: 400;"><span style="font-weight: 400;">Long-lasting Eau de Parfum concentration</span></li>
<li style="font-weight: 400;"><span style="font-weight: 400;">Modern unisex appeal suitable for all occasions</span></li>
<li style="font-weight: 400;"><span style="font-weight: 400;">Crafted by EDA Perfumes with quality and performance</span></li>
<li style="font-weight: 400;"><span style="font-weight: 400;">Perfect for quick refreshes, travel, or gifting</span></li>
</ul>
<h3><strong>Sophisticated Citrus Meets Woody Depth</strong></h3>
<p><span style="font-weight: 400;">This </span><strong>pocket size perfume</strong><span style="font-weight: 400;"> blends bright citrus freshness with rich woody tones, creating a modern, versatile fragrance experience. Its unisex composition makes it suitable for any gender while maintaining a bold, memorable presence.</span></p>
<h3><strong>Long-Lasting Performance</strong></h3>
<p><span style="font-weight: 400;">Despite its compact size, this 10ml spray provides long-lasting projection. From vibrant citrus openings to warm woody depth, the fragrance evolves beautifully throughout the day.</span></p>
<h3><strong>Perfect for Every Occasion</strong></h3>
<p><span style="font-weight: 400;">Whether at work, a dinner date, or a night out, this </span><strong>Woody Scent Premium Perfume</strong><span style="font-weight: 400;"> offers a convenient solution for maintaining a sophisticated, fresh aroma anytime. Its pocket size makes it an essential accessory for modern lifestyles.</span></p>
<h3><strong>Why Choose EDA Perfumes</strong></h3>
<p><span style="font-weight: 400;">EDA Perfumes delivers high-quality fragrances designed for portability, performance, and style. Lusty Nights </span><strong>pocket size perfume</strong><span style="font-weight: 400;"> reflects their commitment to blending modern elegance with convenience, giving you a premium scent experience wherever life takes you.</span></p>`,
    'nude-poison-elegant-unisex-eau-de-parfum-10ml': `<p><span style="font-weight: 400;">Nude Poison by EDA Perfumes is a premium </span><strong>mini pocket perfume</strong><span style="font-weight: 400;"> crafted for individuals who appreciate modern sophistication and portability. This </span><strong>Elegant Unisex perfume</strong><span style="font-weight: 400;"> blends bright citrus top notes with soft jasmine and gentle sandalwood, delivering a harmonious fragrance that evolves beautifully throughout the day.</span></p>
<h2><strong>Fragrance Profile</strong></h2>
<ul>
<li style="font-weight: 400;"><span style="font-weight: 400;"><strong>Top Notes:</strong> Fresh lemon and citrus for instant brightness</span></li>
<li style="font-weight: 400;"><span style="font-weight: 400;"><strong>Heart Notes:</strong> Delicate jasmine and floral accents for elegance</span></li>
<li style="font-weight: 400;"><span style="font-weight: 400;"><strong>Base Notes:</strong> Warm sandalwood for depth and long-lasting presence</span></li>
</ul>
<p><span style="font-weight: 400;">Designed as a </span><strong>small pocket perfume</strong><span style="font-weight: 400;">, Nude Poison offers versatility for all occasions. Its compact size ensures you can carry luxury with you and refresh your scent on the go, making it an ideal </span><strong>best luxury perfume for her</strong><span style="font-weight: 400;"> while remaining appealing for men.</span></p>
<h2><strong>Travel-Friendly Design</strong></h2>
<p><span style="font-weight: 400;">The 10ml </span><strong>mini pocket perfume</strong><span style="font-weight: 400;"> easily fits into pockets, purses, or handbags, making it perfect for commuting, travel, or quick touch-ups. Its high-quality Eau de Parfum concentration ensures long-lasting scent performance in a convenient format.</span></p>
<h2><strong>How to Use</strong></h2>
<ul>
<li style="font-weight: 400;"><span style="font-weight: 400;">Apply on clean, dry skin for best results</span></li>
<li style="font-weight: 400;"><span style="font-weight: 400;">Spray lightly on pulse points such as neck, wrists, and behind the ears</span></li>
<li style="font-weight: 400;"><span style="font-weight: 400;">Hold the bottle 3\u20135 inches away while applying</span></li>
<li style="font-weight: 400;"><span style="font-weight: 400;">Avoid rubbing after spraying to preserve fragrance structure</span></li>
<li style="font-weight: 400;"><span style="font-weight: 400;">Reapply lightly for extended wear</span></li>
</ul>
<h2><strong>Key Highlights</strong></h2>
<ul>
<li style="font-weight: 400;"><span style="font-weight: 400;"><strong>Mini pocket perfume</strong> \u2013 compact 10ml for on-the-go use</span></li>
<li style="font-weight: 400;"><span style="font-weight: 400;"><strong>Elegant Unisex perfume</strong> with versatile appeal</span></li>
<li style="font-weight: 400;"><span style="font-weight: 400;">Crisp citrus top notes and soft jasmine heart</span></li>
<li style="font-weight: 400;"><span style="font-weight: 400;">Warm sandalwood base for depth and longevity</span></li>
<li style="font-weight: 400;"><span style="font-weight: 400;">Convenient <strong>small pocket perfume</strong> ideal for travel</span></li>
<li style="font-weight: 400;"><span style="font-weight: 400;">Long-lasting Eau de Parfum concentration</span></li>
<li style="font-weight: 400;"><span style="font-weight: 400;">One of the <strong>best luxury perfumes for her</strong></span></li>
<li style="font-weight: 400;"><span style="font-weight: 400;">Crafted by EDA Perfumes for premium quality</span></li>
</ul>
<h3><strong>Citrus Freshness Meets Warm Elegance</strong></h3>
<p><span style="font-weight: 400;">This </span><strong>mini pocket perfume</strong><span style="font-weight: 400;"> combines bright citrus with floral jasmine and subtle sandalwood, creating a harmonious and versatile </span><strong>Elegant Unisex perfume</strong><span style="font-weight: 400;">. Its compact size makes it perfect for maintaining sophistication anytime, anywhere.</span></p>
<h3><strong>Long-Lasting Scent</strong></h3>
<p><span style="font-weight: 400;">Despite its small 10ml size, Nude Poison delivers a rich, evolving fragrance. From crisp citrus openings to warm sandalwood depth, it ensures a memorable presence throughout the day.</span></p>
<h3><strong>Perfect for Every Occasion</strong></h3>
<p><span style="font-weight: 400;">Whether at work, social gatherings, or evening outings, this </span><strong>small pocket perfume</strong><span style="font-weight: 400;"> offers convenience without compromising luxury. Its unisex appeal makes it suitable for everyone while remaining elegant and distinctive.</span></p>
<h3><strong>Why Choose EDA Perfumes</strong></h3>
<p><span style="font-weight: 400;">EDA Perfumes creates fragrances that combine portability, performance, and modern sophistication. Nude Poison </span><strong>mini pocket perfume</strong><span style="font-weight: 400;"> reflects this commitment, delivering a high-quality </span><strong>Elegant Unisex perfume</strong><span style="font-weight: 400;"> experience in a travel-ready format.</span></p>`,
    'bad-habits-eau-de-parfum-10ml': `<p><span style="font-weight: 400;">Bad Habits by EDA Perfumes is a versatile </span><strong>small pocket perfume</strong><span style="font-weight: 400;"> designed for modern women who value convenience without compromising on luxury. Its fragrance profile blends crisp citrus top notes with gentle floral and subtle musky undertones, delivering a vibrant and seductive scent experience.</span></p>
<h2><strong>Fragrance Profile</strong></h2>
<ul>
<li style="font-weight: 400;"><span style="font-weight: 400;"><strong>Top Notes:</strong> Fresh citrus for immediate energy and brightness</span></li>
<li style="font-weight: 400;"><span style="font-weight: 400;"><strong>Heart Notes:</strong> Soft floral notes for feminine allure</span></li>
<li style="font-weight: 400;"><span style="font-weight: 400;"><strong>Base Notes:</strong> Warm musky undertones for depth and longevity</span></li>
</ul>
<p><span style="font-weight: 400;">This </span><strong>pocket size perfume</strong><span style="font-weight: 400;"> is compact yet powerful, making it ideal for on-the-go fragrance needs. Its portable 10ml design ensures you can carry luxury with you wherever you go, while the rich Eau de Parfum concentration guarantees long-lasting performance.</span></p>
<h2><strong>Travel-Ready Convenience</strong></h2>
<p><span style="font-weight: 400;">The mini 10ml size of Bad Habits </span><strong>small pocket perfume</strong><span style="font-weight: 400;"> allows it to fit easily into pockets, handbags, or clutches. Perfect for daily commutes, business trips, or spontaneous adventures, it offers a quick refresh of seductive freshness anytime.</span></p>
<h2><strong>How to Use</strong></h2>
<ul>
<li style="font-weight: 400;"><span style="font-weight: 400;">Apply on clean, dry skin for best results</span></li>
<li style="font-weight: 400;"><span style="font-weight: 400;">Spray lightly on pulse points: neck, wrists, and behind the ears</span></li>
<li style="font-weight: 400;"><span style="font-weight: 400;">Hold the bottle 3\u20135 inches away while applying</span></li>
<li style="font-weight: 400;"><span style="font-weight: 400;">Avoid rubbing after spraying to maintain fragrance integrity</span></li>
<li style="font-weight: 400;"><span style="font-weight: 400;">Reapply lightly as needed for longer wear</span></li>
</ul>
<h2><strong>Key Highlights</strong></h2>
<ul>
<li style="font-weight: 400;"><span style="font-weight: 400;"><strong>Small pocket perfume</strong> \u2013 compact 10ml for portability</span></li>
<li style="font-weight: 400;"><span style="font-weight: 400;"><strong>Pocket size perfume</strong> ideal for travel and on-the-go freshness</span></li>
<li style="font-weight: 400;"><span style="font-weight: 400;">Fresh citrus top notes for instant vibrancy</span></li>
<li style="font-weight: 400;"><span style="font-weight: 400;">Seductive floral heart for feminine allure</span></li>
<li style="font-weight: 400;"><span style="font-weight: 400;">Musky base notes for depth and lasting presence</span></li>
<li style="font-weight: 400;"><span style="font-weight: 400;">Long-lasting Eau de Parfum concentration</span></li>
<li style="font-weight: 400;"><span style="font-weight: 400;">Perfect as a <strong>seductive perfume for women</strong></span></li>
<li style="font-weight: 400;"><span style="font-weight: 400;">Crafted by EDA Perfumes with premium quality</span></li>
</ul>
<h3><strong>Fresh, Seductive, and Portable</strong></h3>
<p><span style="font-weight: 400;">Bad Habits combines the energy of citrus with the elegance of floral notes and a sensual musky finish. This </span><strong>small pocket perfume</strong><span style="font-weight: 400;"> provides a refined, modern fragrance experience in a convenient travel-friendly size.</span></p>
<h3><strong>Long-Lasting Aroma</strong></h3>
<p><span style="font-weight: 400;">Despite its compact 10ml design, Bad Habits delivers rich projection and enduring scent. Its citrus and floral blend evolves beautifully on the skin, creating a memorable impression throughout the day or night.</span></p>
<h3><strong>Perfect for Every Occasion</strong></h3>
<p><span style="font-weight: 400;">From casual brunches to evening dates, this </span><strong>pocket size perfume</strong><span style="font-weight: 400;"> is ideal for women seeking a seductive yet fresh fragrance that fits seamlessly into their lifestyle.</span></p>
<h3><strong>Why Choose EDA Perfumes</strong></h3>
<p><span style="font-weight: 400;">EDA Perfumes designs high-quality fragrances that combine performance, portability, and modern sophistication. Bad Habits </span><strong>small pocket perfume</strong><span style="font-weight: 400;"> reflects this philosophy, offering a </span><strong>seductive perfume for women</strong><span style="font-weight: 400;"> in a convenient and luxurious mini format.</span></p>`,
    'nude-poison-elegant-unisex-eau-de-parfum-100ml': `<p><span style="font-weight: 400;">Nude Poison by EDA Perfumes is an elegant unisex perfume created for individuals who appreciate fresh citrus fragrances with a soft floral character. Designed as a premium Eau de Parfum, it delivers a balanced scent profile that feels light, modern, and long-lasting.</span></p>
<p><span style="font-weight: 400;">The fragrance opens with the brightness of a</span><strong> fresh lemon perfume</strong><span style="font-weight: 400;"> accord, immediately creating a crisp and uplifting impression. This citrus introduction is complemented by vibrant </span><strong>grapefruit perfume</strong><span style="font-weight: 400;"> notes that add energy and a refreshing edge to the composition.</span></p>
<p><span style="font-weight: 400;">As the fragrance evolves, the heart reveals a smooth </span><strong>jasmine perfume note</strong><span style="font-weight: 400;"> that introduces softness and elegance. This floral layer balances the citrus freshness, creating a fragrance that feels clean yet sophisticated.</span></p>
<p><span style="font-weight: 400;">The scent settles into a gentle and refined base that supports long-lasting performance throughout the day. Its versatility makes Nude Poison suitable for both daytime wear and relaxed evening settings.</span></p>
<p><span style="font-weight: 400;">Designed to perform beautifully on different skin types, Nude Poison stands out as an elegant unisex perfume that adapts naturally to personal style. It reflects EDA Perfumes\u2019 commitment to creating fragrances that combine freshness, balance, and modern simplicity.</span></p>
<h2><strong>How to Use</strong></h2>
<ul>
<li style="font-weight: 400;"><span style="font-weight: 400;">Apply on clean, dry skin for best performance</span></li>
<li style="font-weight: 400;"><span style="font-weight: 400;">Spray lightly on pulse points such as the neck, wrists, and behind the ears</span></li>
<li style="font-weight: 400;"><span style="font-weight: 400;">Hold the bottle 5 to 7 inches away while applying</span></li>
<li style="font-weight: 400;"><span style="font-weight: 400;">Avoid rubbing after application to preserve fragrance notes</span></li>
<li style="font-weight: 400;"><span style="font-weight: 400;">Reapply lightly if needed for extended wear</span></li>
</ul>
<h2><strong>Key Highlights</strong></h2>
<ul>
<li style="font-weight: 400;"><span style="font-weight: 400;">Elegant unisex perfume with citrus-floral balance</span></li>
<li style="font-weight: 400;"><span style="font-weight: 400;">Fresh lemon perfume opening with grapefruit freshness</span></li>
<li style="font-weight: 400;"><span style="font-weight: 400;">Soft</span><strong> jasmine perfume</strong><span style="font-weight: 400;"> heart note</span></li>
<li style="font-weight: 400;"><span style="font-weight: 400;">Long-lasting Eau de Parfum concentration</span></li>
<li style="font-weight: 400;"><span style="font-weight: 400;">Crafted by EDA Perfumes</span></li>
</ul>
<h3><strong>Fresh Citrus Opening</strong></h3>
<p><span style="font-weight: 400;">Nude Poison begins with bright lemon and grapefruit notes that create an instantly refreshing fragrance experience.</span></p>
<h3><strong>Soft Floral Elegance</strong></h3>
<p><span style="font-weight: 400;">The j</span><strong>asmine perfume</strong><span style="font-weight: 400;"> heart adds a smooth and sophisticated floral character that enhances balance.</span></p>
<h3><strong>Perfect Everyday Unisex Fragrance</strong></h3>
<p><span style="font-weight: 400;">This elegant unisex perfume is designed for daily wear, offering freshness without overpowering intensity.</span></p>
<h3><strong>Why Choose EDA Perfumes</strong></h3>
<p><span style="font-weight: 400;">EDA Perfumes creates thoughtfully balanced fragrances that combine modern freshness with reliable performance, making them suitable for everyday lifestyles.</span></p>`,
    'bad-habits-eau-de-parfum-100ml': `<p><span style="font-weight: 400;">Bad Habits by EDA Perfumes is a modern </span><strong>unisex luxury fragrance</strong><span style="font-weight: 400;"> created for individuals who appreciate bold scents with a balanced and sophisticated character. Crafted as a premium Eau de Parfum, it offers a fragrance experience that feels energetic, expressive, and long-lasting.\u00a0</span></p>
<p><span style="font-weight: 400;">The fragrance opens with a vibrant </span><strong>fresh citrus perfume</strong><span style="font-weight: 400;"> profile that immediately feels clean and uplifting. This bright introduction creates a refreshing presence that works beautifully in daily wear while maintaining a premium identity.\u00a0</span></p>
<p><span style="font-weight: 400;">As the scent develops, it reveals a deeper and warmer composition that adds personality and dimension. The evolving notes create a smooth transition into a sensual base, giving the fragrance a </span><strong>seductive perfume for women</strong><span style="font-weight: 400;"> appeal while remaining confidently unisex.\u00a0</span></p>
<p><span style="font-weight: 400;">Designed for versatility, Bad Habits performs well across different occasions, from casual daytime settings to evening outings. Its long-lasting Eau de Parfum concentration ensures the fragrance remains noticeable without feeling overpowering.\u00a0</span></p>
<p><span style="font-weight: 400;">Developed with attention to balance, longevity, and modern fragrance preferences, </span><strong>Bad Habits</strong><span style="font-weight: 400;"> reflects EDA Perfumes\u2019 commitment to creating premium scents that combine freshness, elegance, and lasting impact.\u00a0</span></p>
<h2><strong>How to Use</strong></h2>
<ul>
<li style="font-weight: 400;"><span style="font-weight: 400;">Apply on clean, dry skin for best performance</span></li>
<li style="font-weight: 400;"><span style="font-weight: 400;">Spray lightly on pulse points such as the neck, wrists, and behind the ears</span></li>
<li style="font-weight: 400;"><span style="font-weight: 400;">Hold the bottle 5 to 7 inches away while applying</span></li>
<li style="font-weight: 400;"><span style="font-weight: 400;">Avoid rubbing after application to maintain fragrance structure</span></li>
<li style="font-weight: 400;"><span style="font-weight: 400;">Reapply lightly if needed for extended wear</span></li>
</ul>
<h2><strong>Key Highlights</strong></h2>
<ul>
<li style="font-weight: 400;"><span style="font-weight: 400;">Unisex luxury fragrance with modern appeal</span></li>
<li style="font-weight: 400;"><span style="font-weight: 400;">Fresh citrus perfume opening with warm depth</span></li>
<li style="font-weight: 400;"><span style="font-weight: 400;">Long-lasting Eau de Parfum concentration</span></li>
<li style="font-weight: 400;"><span style="font-weight: 400;">Suitable for both men and women</span></li>
<li style="font-weight: 400;"><span style="font-weight: 400;">Crafted by EDA Perfumes</span></li>
</ul>
<h3><strong>A Fresh Yet Seductive Signature</strong></h3>
<p><span style="font-weight: 400;">Bad Habits combines citrus freshness with a sensual dry-down, creating a fragrance that feels energetic yet sophisticated.</span></p>
<h3><strong>Designed for Confident Personalities</strong></h3>
<p><span style="font-weight: 400;">This unisex luxury fragrance is created for individuals who enjoy expressive scents that leave a lasting impression.</span></p>
<h3><strong>Versatile for Any Occasion</strong></h3>
<p><span style="font-weight: 400;">From daytime freshness to evening elegance, Bad Habits adapts easily to different settings and styles.</span></p>
<h2><strong>Why Choose EDA Perfumes</strong></h2>
<p><span style="font-weight: 400;">EDA Perfumes focuses on crafting premium fragrances that balance freshness, performance, and modern luxury, allowing every scent to become a personal signature.</span></p>`,
  };

  const product = rawProduct ? {
    ...rawProduct,
    ...(rawProduct.slug && shortDescOverrides[rawProduct.slug] ? { short_description: shortDescOverrides[rawProduct.slug] } : {}),
    ...(rawProduct.slug && descriptionOverrides[rawProduct.slug] ? { description: descriptionOverrides[rawProduct.slug] } : {}),
  } : undefined;

  const [quantity, setQuantity] = useState(1)
  const [isAddingToCart, setIsAddingToCart] = useState(false)
  const [isBuyingNow, setIsBuyingNow] = useState(false)
  const [isWishlisted, setIsWishlisted] = useState(false)

  useEffect(() => {
    if (product) {
      trackViewContent({
        id: product.id,
        name: product.name,
        price: product.price,
      })
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [product?.id])

  if (isLoading && !product) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-white">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-2 border-gray-900 border-t-transparent mx-auto mb-3"></div>
          <p className="text-gray-600 text-sm font-light">Loading...</p>
        </div>
      </div>
    )
  }

  if (error || (!products && !product) || !product) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-white">
        <div className="text-center max-w-md p-8">
          <h2 className="text-xl font-light text-gray-900 mb-3">Product Not Found</h2>
          <p className="text-sm text-gray-600 font-light mb-6">The product you are looking for does not exist.</p>
          <button 
            onClick={() => router.push('/shop')}
            className="px-8 py-3 text-xs text-white bg-black hover:bg-gray-800 transition-colors tracking-widest uppercase font-light"
          >
            Back to Shop
          </button>
        </div>
      </div>
    )
  }

  const salePrice = parseFloat(product.price || '0')
  const regularPrice = parseFloat(product.regular_price || product.price || '0')
  const hasSale = salePrice < regularPrice
  
  const totalPrice = salePrice * quantity
  const totalRegularPrice = regularPrice * quantity
  const totalSaving = hasSale ? totalRegularPrice - totalPrice : 0
  
  // Free gift calculation - 1 x 10ml perfume per bottle purchased
  const freeGiftsCount = quantity

  const handleQuantityChange = (delta: number) => {
    setQuantity(Math.max(1, quantity + delta))
  }

  const handleAddToCart = async () => {
    setIsAddingToCart(true)
    try {
      for (let i = 0; i < quantity; i++) {
        addToCart({
          ...product,
          name: product.name,
          price: salePrice.toString(),
          images: product.images || [],
        })
      }
      trackAddToCart({ id: product.id, name: product.name, price: salePrice }, quantity)
      toast({
        title: 'Added to Cart',
        description: `${quantity} x ${product.name} + ${freeGiftsCount} FREE 10ml perfume${freeGiftsCount > 1 ? 's' : ''}`,
      })
    } catch (error) {
      console.error('Add to cart failed:', error)
      toast({ title: 'Error', description: 'Failed to add item to cart', variant: 'destructive' })
    } finally {
      setTimeout(() => setIsAddingToCart(false), 1000)
    }
  }

  const handleBuyNow = async () => {
    setIsBuyingNow(true)
    try {
      // Only add to cart if the product isn't already there
      const alreadyInCart = items.some((i) => i.id === product.id)
      if (!alreadyInCart) {
        for (let i = 0; i < quantity; i++) {
          addToCart({
            ...product,
            name: product.name,
            price: salePrice.toString(),
            images: product.images || [],
          })
        }
        trackAddToCart({ id: product.id, name: product.name, price: salePrice }, quantity)
      }
      const cartItems = [{ id: product.id, name: product.name, price: salePrice, quantity }]
      const total = totalPrice
      trackInitiateCheckout(cartItems, total)
      setTimeout(() => {
        router.push('/checkout')
        setIsBuyingNow(false)
      }, 800)
    } catch (error) {
      console.error('Buy now failed:', error)
      toast({ title: 'Error', description: 'Failed to process buy now', variant: 'destructive' })
      setIsBuyingNow(false)
    }
  }

  return (
    <div className="min-h-screen bg-white pb-20 lg:pb-8">
      {/* Breadcrumb - Minimal */}
      <div className="border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 py-4">
          <div className="flex items-center space-x-2 text-xs text-gray-500 font-light">
            <button onClick={() => router.push('/shop')} className="hover:text-black transition-colors">
              Shop
            </button>
            <span>›</span>
            <span className="text-black truncate">{decodeHtml(product.name)}</span>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto mt-8 px-4 flex flex-col lg:flex-row gap-12">
        {/* Image Section */}
        <div className="lg:w-1/2">
          <div className="sticky top-8">
            <ImageGallery images={product.images || []} />
          </div>
        </div>

        {/* Details Section */}
        <div className="lg:w-1/2">
          <div className="space-y-6">
            {/* Category */}
            {product.attributes && product.attributes.length > 0 && (
              <div className="text-xs text-gray-500 uppercase tracking-widest font-light">
                {product.attributes[0]?.option || 'Collection'}
              </div>
            )}

            {/* Product Name */}
            <h1 className="text-3xl lg:text-4xl font-light text-gray-900 tracking-wide">
              {decodeHtml(product.name)}
            </h1>

            {/* Rating */}
            <div className="flex items-center gap-4 pb-6 border-b border-gray-200">
              <div className="flex items-center gap-1">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className="w-3.5 h-3.5 text-gray-900 fill-gray-900" />
                ))}
              </div>
              <span className="text-xs text-gray-600 font-light">4.8 (247 reviews)</span>
              <button
                onClick={() => setIsWishlisted(!isWishlisted)}
                className="ml-auto"
              >
                <Heart className={`w-5 h-5 transition-colors ${isWishlisted ? 'fill-black text-black' : 'text-gray-400'}`} />
              </button>
            </div>

            {/* Short Description */}
            {product.short_description && (
              <div
                className="prose prose-sm max-w-none text-gray-600 leading-relaxed"
                dangerouslySetInnerHTML={{ __html: product.short_description }}
              />
            )}

            {/* Free Gift Offer Badge */}
            <div className="bg-gradient-to-r from-emerald-600 to-teal-600 text-white p-4 rounded-sm">
              <div className="flex items-center gap-2 mb-1">
                <Gift className="w-4 h-4" />
                <span className="text-sm font-medium tracking-wide">Special Gift Offer</span>
              </div>
              <p className="text-xs font-light">
                Get a <span className="font-semibold">FREE 10ml perfume</span> with every 100ml bottle purchase
              </p>
            </div>

            {/* Price Section - Minimal */}
            <div className="py-6 border-y border-gray-200">
              <div className="flex items-baseline gap-3">
                <span className="text-2xl font-light text-gray-900">
                  ₹{totalPrice.toLocaleString()}
                </span>
                {hasSale && (
                  <>
                    <span className="line-through text-gray-400 font-light">
                      ₹{totalRegularPrice.toLocaleString()}
                    </span>
                    <span className="text-xs text-gray-600 font-light">
                      Save ₹{totalSaving.toLocaleString()}
                    </span>
                  </>
                )}
              </div>
              {quantity > 1 && (
                <div className="text-xs text-gray-500 mt-2 font-light">
                  ₹{salePrice.toLocaleString()} per bottle
                </div>
              )}
              
              {/* Free gifts indicator */}
              <div className="mt-3 p-3 bg-emerald-50 border border-emerald-100 rounded-sm">
                <div className="flex items-center gap-2 text-emerald-800">
                  <Gift className="w-3.5 h-3.5" />
                  <span className="text-xs font-medium">
                    You will receive {freeGiftsCount} FREE 10ml perfume{freeGiftsCount > 1 ? 's' : ''} with this order!
                  </span>
                </div>
              </div>
            </div>

            {/* Quantity Selector - Minimal */}
            <div>
              <label className="block text-xs font-light text-gray-600 mb-3 uppercase tracking-widest">
                Quantity
              </label>
              <div className="flex items-center gap-4">
                <div className="flex items-center border border-gray-300">
                  <button
                    onClick={() => handleQuantityChange(-1)}
                    className="p-3 hover:bg-gray-50 transition-colors"
                    disabled={quantity <= 1}
                  >
                    <Minus className="w-3.5 h-3.5 text-gray-600" />
                  </button>
                  <span className="px-6 py-3 font-light text-gray-900 text-sm">
                    {quantity}
                  </span>
                  <button
                    onClick={() => handleQuantityChange(1)}
                    className="p-3 hover:bg-gray-50 transition-colors"
                  >
                    <Plus className="w-3.5 h-3.5 text-gray-600" />
                  </button>
                </div>
              </div>
            </div>

            {/* Action Buttons - Minimal */}
            <div className="hidden lg:flex flex-col gap-3 pt-6">
              <button
                className={`w-full bg-black text-white font-light px-8 py-4 text-xs tracking-widest uppercase hover:bg-gray-800 transition-colors ${isAddingToCart ? 'opacity-50' : ''}`}
                onClick={handleAddToCart}
                disabled={isAddingToCart}
              >
                {isAddingToCart ? 'Added' : 'Add to Cart'}
              </button>
              <button
                className={`w-full border border-gray-300 text-black font-light px-8 py-4 text-xs tracking-widest uppercase hover:bg-gray-50 transition-colors ${isBuyingNow ? 'opacity-50' : ''}`}
                onClick={handleBuyNow}
                disabled={isBuyingNow}
              >
                {isBuyingNow ? 'Processing...' : 'Buy Now'}
              </button>
            </div>

            {/* Trust Badges - Minimal */}
            <div className="grid grid-cols-2 gap-4 pt-6 border-t border-gray-200">
              {[
                { icon: <Truck className="w-4 h-4" />, label: 'Free Shipping', subtitle: 'Orders above ₹999' },
                { icon: <Shield className="w-4 h-4" />, label: 'Authentic', subtitle: 'Guaranteed original' },
                { icon: <Award className="w-4 h-4" />, label: 'Premium Quality', subtitle: 'Long-lasting EDP' },
                { icon: <CreditCard className="w-4 h-4" />, label: 'Secure Payment', subtitle: 'Protected checkout' },
              ].map((item, idx) => (
                <div key={idx} className="text-center p-4 border border-gray-100">
                  <div className="text-gray-600 mb-2 flex justify-center">
                    {item.icon}
                  </div>
                  <div className="font-light text-xs text-gray-900 mb-1">{item.label}</div>
                  <div className="text-xs text-gray-500 font-light">{item.subtitle}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Mobile Fixed Bottom - Minimal */}
      <div className="lg:hidden fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 z-50 p-4">
        <div className="max-w-md mx-auto">
          {/* Free gift indicator for mobile */}
          <div className="mb-3 p-2 bg-emerald-50 border border-emerald-200 rounded-sm">
            <div className="flex items-center justify-center gap-1 text-emerald-800">
              <Gift className="w-3 h-3" />
              <span className="text-xs font-medium">+{freeGiftsCount} FREE 10ml perfume{freeGiftsCount > 1 ? 's' : ''}</span>
            </div>
          </div>
          
          <div className="flex items-center gap-3 mb-4">
            <div className="flex-1">
              <div className="text-xs text-gray-500 mb-1 font-light">Total</div>
              <div className="flex items-center gap-2">
                <span className="text-xl font-light text-gray-900">
                  ₹{totalPrice.toLocaleString()}
                </span>
                {hasSale && (
                  <span className="line-through text-gray-400 text-sm font-light">
                    ₹{totalRegularPrice.toLocaleString()}
                  </span>
                )}
              </div>
            </div>
            <div className="flex items-center border border-gray-300">
              <button
                onClick={() => handleQuantityChange(-1)}
                className="p-2 hover:bg-gray-50"
                disabled={quantity <= 1}
              >
                <Minus className="w-3 h-3" />
              </button>
              <span className="px-4 py-2 text-sm font-light">{quantity}</span>
              <button
                onClick={() => handleQuantityChange(1)}
                className="p-2 hover:bg-gray-50"
              >
                <Plus className="w-3 h-3" />
              </button>
            </div>
          </div>
          <div className="flex gap-3">
            <button
              className="flex-1 bg-black text-white font-light px-4 py-3 text-xs tracking-widest uppercase hover:bg-gray-800"
              onClick={handleAddToCart}
              disabled={isAddingToCart}
            >
              {isAddingToCart ? 'Added' : 'Add to Cart'}
            </button>
            <button
              className="flex-1 border border-gray-300 text-black font-light px-4 py-3 text-xs tracking-widest uppercase hover:bg-gray-50"
              onClick={handleBuyNow}
              disabled={isBuyingNow}
            >
              {isBuyingNow ? 'Processing' : 'Buy Now'}
            </button>
          </div>
        </div>
      </div>

      {/* Tabs - Minimal */}
      <div className="max-w-7xl mx-auto mt-16 px-4">
        <div className="border-t border-gray-200">
          <Tab.Group>
            <Tab.List className="flex border-b border-gray-200">
              {['Description', 'Fragrance Notes', 'How to Use'].map((label, idx) => (
                <Tab key={idx} className={({ selected }) =>
                  `flex-1 py-4 px-6 text-xs font-light outline-none transition-all uppercase tracking-widest ${
                    selected 
                      ? 'text-black border-b-2 border-black' 
                      : 'text-gray-500 hover:text-black'
                  }`
                }>
                  {label}
                </Tab>
              ))}
            </Tab.List>
            <Tab.Panels className="py-8">
              <Tab.Panel>
                <div className="prose prose-sm max-w-none text-gray-700 leading-relaxed"
                     dangerouslySetInnerHTML={{ __html: product.description || '' }} />
              </Tab.Panel>
              <Tab.Panel>
                <div className="space-y-6">
                  <h3 className="text-lg font-light text-gray-900 tracking-wide">Fragrance Profile</h3>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    {[
                      { title: 'Top Notes', notes: 'Bergamot, Pink Pepper, Fresh Mint' },
                      { title: 'Heart Notes', notes: 'Jasmine, Rose, Spicy Cardamom' },
                      { title: 'Base Notes', notes: 'Sandalwood, Musk, Vanilla' },
                    ].map((item, idx) => (
                      <div key={idx} className="border border-gray-200 p-6">
                        <h4 className="font-light text-sm text-gray-900 mb-3 uppercase tracking-wide">{item.title}</h4>
                        <p className="text-sm text-gray-600 font-light">{item.notes}</p>
                      </div>
                    ))}
                  </div>
                </div>
              </Tab.Panel>
              <Tab.Panel>
                <div className="space-y-6">
                  <h3 className="text-lg font-light text-gray-900 tracking-wide">Application Tips</h3>
                  <div className="border border-gray-200 p-6">
                    <ul className="space-y-3 text-gray-700 font-light text-sm">
                      <li>Apply to pulse points: wrists, neck, and behind ears</li>
                      <li>For best longevity, apply to well-moisturized skin</li>
                      <li>Allow the fragrance to dry naturally - do not rub</li>
                      <li>For evening occasions, lightly spray on clothing or hair</li>
                    </ul>
                  </div>
                </div>
              </Tab.Panel>
            </Tab.Panels>
          </Tab.Group>
        </div>
      </div>

      {/* <div className="max-w-7xl mx-auto mt-16 px-4">
        <ProductFAQ productSlug={slug} productName={product.name} />
      </div> */}
      <div className="max-w-7xl mx-auto mt-16 px-4">
        <ProductReviews productId={product.id} productName={product.name} />
      </div>
      <RelatedProducts currentProduct={product} allProducts={products || []} />
    </div>
  )
}
