import {
  ArrowsPointingInIcon,
  ClockIcon,
  MagnifyingGlassIcon,
} from '@heroicons/react/24/outline';
import Link from 'next/link';

const features = [
  {
    name: 'Precision-Oriented Search',
    description:
      'Dive deep with AI-enhanced searches that understand the context and user intent, delivering the most relevant results every time.',
    href: '#',
    icon: MagnifyingGlassIcon,
  },
  {
    name: 'Unified Data Accessibility',
    description:
      "Seamlessly connect and pull data from popular storage solutions like Google Drive, OneDrive, and Dropbox, ensuring everything's at your fingertips.",
    href: '#',
    icon: ArrowsPointingInIcon,
  },
  {
    name: 'Real-Time Document Sync',
    description:
      'Stay in the loop, always. Our platform ensures you always work with the latest document version, reducing mix-ups and inefficiencies.',
    href: '#',
    icon: ClockIcon,
  },
];

export default function Features() {
  return (
    <section id="features">
      <div className="bg-white py-24">
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <div className="mx-auto max-w-2xl lg:mx-0">
            <h2 className="text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">
              Stay on top of your data
            </h2>
            <p className="mt-6 text-lg leading-8 text-gray-700">
              Harness AI-powered searches, unify data from top storage
              solutions, and always access the latest document versions
            </p>
          </div>
          <div className="mx-auto mt-16 max-w-2xl sm:mt-20 lg:mt-24 lg:max-w-none">
            <dl className="grid max-w-xl grid-cols-1 gap-x-8 gap-y-16 lg:max-w-none lg:grid-cols-3">
              {features.map(feature => (
                <div key={feature.name} className="flex flex-col">
                  <dt className="text-base font-semibold leading-7 text-gray-900">
                    <div className="mb-6 flex h-10 w-10 items-center justify-center rounded-lg bg-purple-500">
                      <feature.icon
                        className="h-6 w-6 text-white"
                        aria-hidden="true"
                      />
                    </div>
                    {feature.name}
                  </dt>
                  <dd className="mt-1 flex flex-auto flex-col text-base leading-7 text-gray-700">
                    <p className="flex-auto">{feature.description}</p>
                    <p className="mt-6">
                      <Link
                        href={feature.href}
                        className="text-sm font-semibold leading-6 text-purple-400"
                      >
                        Learn more <span aria-hidden="true">→</span>
                      </Link>
                    </p>
                  </dd>
                </div>
              ))}
            </dl>
          </div>
        </div>
      </div>
    </section>
  );
}
