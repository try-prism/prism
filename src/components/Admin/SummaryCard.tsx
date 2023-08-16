interface SummaryCardProps {
  title: string;
  data: {
    label: string;
    value: string | number;
  }[];
}

export default function SummaryCard({ title, data }: SummaryCardProps) {
  return (
    <div className="shadow border border-main-black/10 rounded-2xl px-3 pb-3">
      <div className="border-gray-200 bg-white px-4 py-5 sm:px-6">
        <div className="-ml-4 -mt-2 flex flex-wrap items-center justify-between sm:flex-nowrap">
          <div className="ml-4 mt-2">
            <h3 className="text-base font-semibold leading-6 text-gray-900">
              {title}
            </h3>
          </div>
        </div>

        <dl className="divide-y divide-gray-100 text-sm leading-6 pt-5">
          {data.map(item => (
            <div key={item.label} className="flex justify-between gap-x-4 py-2">
              <dt className="text-gray-500">{item.label}</dt>
              <dd className="text-gray-700">{item.value}</dd>
            </div>
          ))}
        </dl>
      </div>
    </div>
  );
}
