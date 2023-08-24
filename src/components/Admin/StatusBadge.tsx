/* eslint-disable security/detect-object-injection */
import clsx from 'clsx';

interface ColorMapping {
  [key: string]: string;
}

const COLOR_MAPPING: ColorMapping = {
  SYNCING: 'bg-blue-100 text-blue-700',
  INDEXING: 'bg-purple-100 text-purple-700',
  SUCCESS: 'bg-green-100 text-green-700',
  FAIL: 'bg-red-100 text-red-700',
};

interface StatusBadgeProperties {
  status: string;
}

export default function StatusBadge({ status }: StatusBadgeProperties) {
  return (
    <span
      className={clsx(
        'inline-flex items-center rounded-md px-2 py-1 text-xs font-medium',
        COLOR_MAPPING[status]
      )}
    >
      {status}
    </span>
  );
}
