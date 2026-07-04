import Image from 'next/image';

export default function ComingSoon() {
  return (
    <div className="min-h-screen w-full flex flex-col items-center justify-center bg-white px-6 text-center">
      <Image
        src="/eda-perfumes-logo.jpeg"
        alt="EDA Perfumes"
        width={140}
        height={140}
        priority
        className="mb-8 rounded-full object-cover"
      />

      <h1 className="text-2xl md:text-4xl font-light tracking-wide text-gray-900 mb-4">
        We&apos;re currently available in offline markets only
      </h1>

      <div className="w-16 h-px bg-gray-300 mb-6" />

      <p className="text-gray-600 text-base md:text-lg font-light max-w-xl">
        Our online store is taking a short break. We&apos;ll be back online soon —
        thank you for your patience.
      </p>

      <p className="text-gray-500 text-sm mt-8">
        For orders &amp; enquiries, reach us at{' '}
        <a href="tel:+918799795681" className="underline hover:text-gray-800">
          +91 87997 95681
        </a>
      </p>
    </div>
  );
}
