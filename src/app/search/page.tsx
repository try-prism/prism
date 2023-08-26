'use client';

import { Tooltip } from '@material-tailwind/react';
import clsx from 'clsx';
import Image from 'next/image';
import React, { useContext, useEffect, useRef, useState } from 'react';
import ReconnectingWebSocket from 'reconnecting-websocket';

import PromptTextArea from '@/components/Search/PromptTextArea';
import Sidebar from '@/components/Sidebar';
import { API_BASE_DOMAIN } from '@/constant';
import { Page } from '@/constants/Navigation';
import { UserContext } from '@/contexts/UserContext';
import PrismLogo from '@/images/prism/prism.svg';

interface Source {
  name: string;
  url: string;
}

enum Sender {
  USER,
  CHAT_ENGINE,
}

interface Query {
  sender: Sender;
  message?: string;
  sources?: Source[];
  related?: string[];
}

export default function Search() {
  const { currentUser } = useContext(UserContext)!;
  const conversationReference = useRef<HTMLDivElement>(null);
  const [queries, setQueries] = useState<Query[]>([]);
  const [isWaiting, setIsWaiting] = useState<boolean>(false);

  const textareaReference = useRef<HTMLTextAreaElement>(null);
  const socket = useRef<ReconnectingWebSocket | null>(null);

  useEffect(() => {
    if (conversationReference.current) {
      conversationReference.current.scrollIntoView({
        behavior: 'smooth',
        block: 'end',
      });
    }
  }, [queries]);

  useEffect(() => {
    if (!currentUser) {
      return;
    }

    socket.current = new ReconnectingWebSocket(
      `ws://${API_BASE_DOMAIN}/query?user_id=${currentUser.userId}&org_id=${currentUser.organizationId}`,
      undefined,
      {
        maxRetries: 5,
        connectionTimeout: 5000,
      }
    );

    socket.current.addEventListener('open', () =>
      console.log('Connected to the server')
    );
    socket.current.addEventListener('close', () =>
      console.log('Disconnected with the server')
    );
    socket.current.addEventListener('message', (event: MessageEvent) => {
      const data = JSON.parse(event.data);
      setQueries(previousQueries => {
        previousQueries[previousQueries.length - 1] = {
          sender: Sender.CHAT_ENGINE,
          message: data.response,
          sources: data.sources,
        };
        return previousQueries;
      });
      setIsWaiting(false);
    });

    return () => {
      socket.current?.close();
    };
  }, [currentUser]);

  const sendQuery = (message: string) => {
    socket.current?.send(message.trim());
    setQueries(previousQueries => [
      ...previousQueries,
      { sender: Sender.USER, message },
      { sender: Sender.CHAT_ENGINE },
    ]);
    setIsWaiting(true);
    if (textareaReference.current) {
      textareaReference.current.value = '';
    }
  };

  return (
    <div className="bg-white min-h-screen">
      <Sidebar selectedPage={Page.SEARCH} />
      <main className="xl:pl-72 py-2">
        <div
          ref={conversationReference}
          className="grid-cols-search-page max-w-3xl mx-auto px-3 pt-16 grid gap-x-2 gap-y-3 pb-28"
        >
          {queries.map((query, index) =>
            query.sender === Sender.USER ? (
              <React.Fragment key={index}>
                <div className="col-start-2 grid gap-2 opacity-100 transform-none">
                  <div className="rounded-xl px-3 py-2 break-words text-stone-900 transition-all grid gap-3 grid-cols-1 max-w-[75ch] bg-main-black/30 place-self-end">
                    <div className="contents">
                      <p className="whitespace-pre-wrap">{query.message}</p>
                    </div>
                  </div>
                </div>
                <div className="flex items-end col-start-3 pb-1 opacity-100 transform-none">
                  <div className="font-bold rounded-full flex items-center justify-center h-8 w-8 text-[14px] bg-purple-500 text-white">
                    {getAbbreviatedName(
                      currentUser?.name ?? 'Anonymous Person'
                    )}
                  </div>
                </div>
              </React.Fragment>
            ) : (
              <React.Fragment key={index}>
                <div className="flex items-end col-start-1 pb-1 opacity-100 transform-none">
                  <div className="font-bold rounded-full flex items-center justify-center h-8 w-8 bg-main-black">
                    <Image className="w-6" src={PrismLogo} alt="" />
                  </div>
                </div>
                <div className="col-start-2 grid gap-2 opacity-100 transform-none">
                  <div className="rounded-xl px-3 py-2 break-words text-stone-900 transition-all w-full grid gap-3 grid-cols-1 bg-main-black/5 place-self-start">
                    <div className="contents">
                      <h1 className="font-bold">Answer</h1>
                      {query.message ? (
                        <p className="whitespace-pre-wrap">{query.message}</p>
                      ) : (
                        <div
                          role="status"
                          className="space-y-2.5 animate-pulse max-w-lg"
                        >
                          <div className="flex items-center w-full space-x-2">
                            <div className="h-2.5 bg-gray-400 rounded-full dark:bg-gray-700 w-32"></div>
                            <div className="h-2.5 bg-gray-500 rounded-full dark:bg-gray-600 w-24"></div>
                            <div className="h-2.5 bg-gray-500 rounded-full dark:bg-gray-600 w-full"></div>
                          </div>
                          <div className="flex items-center w-full space-x-2 max-w-[480px]">
                            <div className="h-2.5 bg-gray-400 rounded-full dark:bg-gray-700 w-full"></div>
                            <div className="h-2.5 bg-gray-500 rounded-full dark:bg-gray-600 w-full"></div>
                            <div className="h-2.5 bg-gray-500 rounded-full dark:bg-gray-600 w-24"></div>
                          </div>
                          <div className="flex items-center w-full space-x-2 max-w-[400px]">
                            <div className="h-2.5 bg-gray-500 rounded-full dark:bg-gray-600 w-full"></div>
                            <div className="h-2.5 bg-gray-400 rounded-full dark:bg-gray-700 w-80"></div>
                            <div className="h-2.5 bg-gray-500 rounded-full dark:bg-gray-600 w-full"></div>
                          </div>
                          <span className="sr-only">Loading...</span>
                        </div>
                      )}
                      {query.sources && <h1 className="font-bold">Sources</h1>}
                      <ul className="grid grid-cols-1 gap-5 sm:grid-cols-2 sm:gap-3 lg:grid-cols-3">
                        {query.sources?.map(source => (
                          <Tooltip key={source.name} content={source.name}>
                            <li className="col-span-1 flex rounded-md shadow-sm">
                              <div className="bg-purple-900 flex w-12 flex-shrink-0 items-center justify-center rounded-l-md text-sm font-medium text-white">
                                {source.name.split('.')[1]}
                              </div>
                              <div className="flex flex-1 items-center justify-between truncate rounded-r-md border-b border-r border-t border-gray-200 bg-white">
                                <div className="flex-1 truncate px-4 py-2 text-sm">
                                  <a
                                    href={source.url}
                                    target="_blank"
                                    className="font-medium text-gray-900 hover:text-gray-600"
                                    rel="noreferrer"
                                  >
                                    {source.name}
                                  </a>
                                </div>
                              </div>
                            </li>
                          </Tooltip>
                        ))}
                      </ul>
                      {query.related && <h1 className="font-bold">Related</h1>}
                    </div>
                  </div>
                </div>
              </React.Fragment>
            )
          )}
        </div>
        <div className="fixed inset-x-0 bottom-0 mx-auto max-w-5xl sm:justify-center lg:pb-5 lg:pl-72">
          <PromptTextArea
            textareaRef={textareaReference}
            isWaiting={isWaiting}
            onSubmit={sendQuery}
          />
        </div>
      </main>
    </div>
  );
}

const getAbbreviatedName = (fullName: string): string => {
  return fullName
    .split(' ')
    .map(name => name.at(0))
    .join('');
};
