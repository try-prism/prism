'use client';

import { useEffect, useRef, useState } from 'react';
import ReconnectingWebSocket from 'reconnecting-websocket';

import PromptTextArea from '@/components/Search/PromptTextArea';
import Sidebar from '@/components/Sidebar';
import { API_BASE_DOMAIN } from '@/constant';
import { Page } from '@/constants/Navigation';

export default function Search() {
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const [messages, setMessages] = useState<string[]>([]);
  const socket = useRef<ReconnectingWebSocket | null>(null);

  useEffect(() => {
    socket.current = new ReconnectingWebSocket(`ws://${API_BASE_DOMAIN}/query`);

    socket.current.addEventListener('open', () => console.log('ws opened'));
    socket.current.addEventListener('close', () => console.log('ws closed'));
    socket.current.addEventListener('message', event => {
      const data = JSON.parse(event.data);
      setMessages(messages => [...messages, data.message]);
    });

    return () => {
      socket.current?.close();
    };
  }, []);

  const onSubmit = async (userQuery: string) => {
    console.log(`Message: ${userQuery}`);
    socket.current?.send(userQuery);
    setMessages([...messages, userQuery]);
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
