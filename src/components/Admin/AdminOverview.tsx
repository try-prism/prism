import { Organization } from '@/models/Organization';
import { timestampToDate } from '@/utils';

interface AdminOverviewProps {
  organization: Organization;
}

export default function AdminOverview({ organization }: AdminOverviewProps) {
  return (
    <div>
      <dl className="grid grid-cols-1 sm:grid-cols-3">
        <div className="sm:border-none border-t border-gray-100 px-4 py-6 sm:col-span-1 sm:px-0">
          <dt className="text-sm font-medium leading-6 text-gray-900">
            Organization Name
          </dt>
          <dd className="mt-1 text-sm leading-6 text-gray-700 sm:mt-2">
            {organization.name}
          </dd>
        </div>
        <div className="sm:border-none border-t border-gray-100 px-4 py-6 sm:col-span-1 sm:px-0">
          <dt className="text-sm font-medium leading-6 text-gray-900">
            Contact Email
          </dt>
          <dd className="mt-1 text-sm leading-6 text-gray-700 sm:mt-2">
            {organization.email}
          </dd>
        </div>
        <div className="sm:border-none border-t border-gray-100 px-4 py-6 sm:col-span-1 sm:px-0">
          <dt className="text-sm font-medium leading-6 text-gray-900">
            Organization Admin
          </dt>
          <dd className="mt-1 text-sm leading-6 text-gray-700 sm:mt-2">
            {organization.admin_email}
          </dd>
        </div>

        <div className="border-t border-gray-100 px-4 py-6 sm:col-span-1 sm:px-0">
          <dt className="text-sm font-medium leading-6 text-gray-900">
            Total Users
          </dt>
          <dd className="mt-1 text-sm leading-6 text-gray-700 sm:mt-2">
            {organization.user_list.length +
              organization.invited_user_list.length}
          </dd>
        </div>
        <div className="border-t border-gray-100 px-4 py-6 sm:col-span-1 sm:px-0">
          <dt className="text-sm font-medium leading-6 text-gray-900">
            Total Files
          </dt>
          <dd className="mt-1 text-sm leading-6 text-gray-700 sm:mt-2">
            {organization.document_list.length}
          </dd>
        </div>

        <div className="border-t border-gray-100 px-4 py-6 sm:col-span-1 sm:px-0">
          <dt className="text-sm font-medium leading-6 text-gray-900">
            Last Synced
          </dt>
          <dd className="mt-1 text-sm leading-6 text-gray-700 sm:mt-2">
            {timestampToDate(organization.updated_at)}
          </dd>
        </div>

        <form className="border-t border-gray-100 px-4 py-6 sm:px-0 col-span-full">
          <div className="grid grid-cols-1 gap-x-6 gap-y-8 sm:max-w-xl sm:grid-cols-6">
            <div className="col-span-full">
              <label
                htmlFor="email"
                className="block text-sm font-medium leading-6 text-stone-900"
              >
                Change Organization Admin
              </label>
              <div className="mt-2">
                <input
                  id="email"
                  name="email"
                  type="email"
                  autoComplete="email"
                  placeholder="you@example.com"
                  className="block w-full rounded-md border border-gray-300 bg-white/5 py-1.5 text-stone-900 shadow-sm ring-1 ring-inset ring-white/10 focus:ring-2 focus:ring-inset focus:ring-purple-500 sm:text-sm sm:leading-6"
                />
              </div>
            </div>
          </div>

          <div className="mt-8 flex">
            <button
              type="submit"
              className="rounded-md bg-purple-500 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-purple-400"
            >
              Make Admin
            </button>
          </div>
        </form>
        <form className="border-t border-gray-100 px-4 py-6 sm:px-0 col-span-full">
          <div className="grid grid-cols-1 gap-x-6 gap-y-8 sm:max-w-xl sm:grid-cols-6">
            <div className="col-span-full">
              <label
                htmlFor="email"
                className="block text-sm font-medium leading-6 text-stone-900"
              >
                Delete Organization
              </label>
              <div className="mt-2">
                <input
                  id="text"
                  name="text"
                  type="text"
                  placeholder="Please enter your organization name"
                  className="block w-full rounded-md border border-gray-300 bg-white/5 py-1.5 text-stone-900 shadow-sm ring-1 ring-inset ring-white/10 focus:ring-2 focus:ring-inset focus:ring-purple-500 sm:text-sm sm:leading-6"
                />
              </div>
            </div>
          </div>

          <div className="mt-8 flex">
            <button
              type="submit"
              className="rounded-md bg-red-500 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-red-400"
            >
              Delete
            </button>
          </div>
        </form>
      </dl>
    </div>
  );
}
