'use client';

import { useRef } from 'react';

import PromptTextArea from '@/components/PromptTextArea';
import Sidebar from '@/components/Sidebar';
import { Page } from '@/constants/Navigation';

export default function Search() {
  const user = 'user';
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const onSubmit = async (userQuery: string) => {
    console.log(userQuery);
    console.log(user);
  };

  return (
    <div className="bg-white min-h-screen">
      <Sidebar selectedPage={Page.SEARCH} />
      <main className="xl:pl-72 py-2">
        <div className="pl-4 pr-2 flex flex-col gap-y-3 ">
          <div className="fixed inset-x-0 bottom-0 mx-auto max-w-5xl sm:justify-center lg:pb-5 lg:pl-72">
            <PromptTextArea textareaRef={textareaRef} onSubmit={onSubmit} />
          </div>
        </div>
      </main>
    </div>
  );
}
