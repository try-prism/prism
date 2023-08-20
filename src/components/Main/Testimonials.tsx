import Image from 'next/image';

import GeorgiaTechLogo from '@/images/partners/georgiatech.svg';

export default function Testimonials() {
  return (
    <section className="relative isolate overflow-hidden bg-gray-900 px-6 py-24 sm:py-32 lg:px-8">
      <div className="mx-auto max-w-2xl lg:max-w-4xl">
        <Image className="mx-auto h-12" src={GeorgiaTechLogo} alt="" />
        <figure className="mt-10">
          <blockquote className="text-center text-xl font-semibold leading-8 text-white sm:text-2xl sm:leading-9">
            <p>
              “This platform has transformed how we manage our research data at
              the Georgia Tech lab. Navigating through vast documents is now a
              breeze, ensuring we always stay ahead in our research. Truly
              indispensable!”
            </p>
          </blockquote>
          <figcaption className="mt-10">
            <div className="mt-4 flex items-center justify-center space-x-3 text-base">
              <div className="font-semibold text-white">Anonymous</div>
              <svg
                viewBox="0 0 2 2"
                width={3}
                height={3}
                aria-hidden="true"
                className="fill-gray-900"
              >
                <circle cx={1} cy={1} r={1} />
              </svg>
              <div className="text-gray-600">
                Georgia Tech Research Institute
              </div>
            </div>
          </figcaption>
        </figure>
      </div>
    </section>
  );
}
