'use client';
import { Tooltip } from '@material-tailwind/react';
import Image from 'next/image';
import React, { useContext, useEffect, useRef, useState } from 'react';
import ReconnectingWebSocket from 'reconnecting-websocket';

import PromptTextArea from '@/components/Search/PromptTextArea';
import Sidebar from '@/components/Sidebar';
import { API_BASE_DOMAIN } from '@/constant';
import { Page } from '@/constants/Navigation';
import { UserContext } from '@/contexts/UserContext';
import PrismLogo from '@/images/prism.svg';

interface Source {
  name: string;
  url: string;
}

interface Query {
  sender: Sender;
  message: string;
  sources?: Source[];
  related?: string[];
}

enum Sender {
  USER,
  CHAT_ENGINE,
}

export default function Search() {
  const { currentUser } = useContext(UserContext)!;
  const [queries, setQueries] = useState<Query[]>([]);

  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const socket = useRef<ReconnectingWebSocket | null>(null);

  useEffect(() => {
    socket.current = new ReconnectingWebSocket(`ws://${API_BASE_DOMAIN}/query`);

    socket.current.addEventListener('open', () => console.log('ws opened'));
    socket.current.addEventListener('close', () => console.log('ws closed'));
    socket.current.addEventListener('message', (event: MessageEvent) => {
      const data = JSON.parse(event.data);
      setQueries([
        ...queries,
        {
          sender: Sender.CHAT_ENGINE,
          message: data.response,
          sources: data.sources,
        },
      ]);
    });

    return () => {
      socket.current?.close();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const sendQuery = (message: string) => {
    socket.current?.send(message);
    setQueries([...queries, { sender: Sender.USER, message }]);
    if (textareaRef.current) {
      textareaRef.current.value = '';
    }
  };

  return (
    <div className="bg-white min-h-screen">
      <Sidebar selectedPage={Page.SEARCH} />
      <main className="xl:pl-72 py-2">
        <div className="grid-cols-search-page max-w-3xl mx-auto px-3 pt-16 grid gap-x-2 gap-y-3 pb-28">
          {mockQueries.map((query, index) =>
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
                  <div className="font-bold rounded-full flex items-center justify-center h-8 w-8 text-[14px] bg-purple-300 text-main-black">
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
                  <div className="rounded-xl px-3 py-2 break-words text-stone-900 transition-all grid gap-3 grid-cols-1 max-w-[75ch] bg-main-black/5 place-self-start">
                    <div className="contents">
                      <h1 className="font-bold">Answer</h1>
                      <p className="whitespace-pre-wrap">{query.message}</p>
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
          <PromptTextArea textareaRef={textareaRef} onSubmit={sendQuery} />
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

const mockQueries: Query[] = [
  {
    sender: Sender.USER,
    message: 'What is life?',
  },
  {
    sender: Sender.CHAT_ENGINE,
    message: 'Life is a meaningful process.',
    sources: [
      {
        name: 'kpmg-esg-report.pdf',
        url: 'https://www.tcenergy.com/siteassets/pdfs/sustainability/sustainability-report/2022/tce-2022-3rd-party-assurance-report.pdf',
      },
      {
        name: 'mckinsey-tech-trends-outlook-2022-full-report.pdf',
        url: 'https://www.mckinsey.com/~/media/mckinsey/business%20functions/mckinsey%20digital/our%20insights/the%20top%20trends%20in%20tech%202022/mckinsey-tech-trends-outlook-2022-full-report.pdf',
      },
    ],
  },
  {
    sender: Sender.USER,
    message: 'What is Lorem Ipsum?',
  },
  {
    sender: Sender.CHAT_ENGINE,
    message:
      "Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book.It has survived not only five centuries, but also the leap into electronic typesetting, remaining essentially unchanged.It was popularised in the 1960s with the release of Letraset sheets containing Lorem Ipsum passages, and more recently with desktop publishing software like Aldus PageMaker including versions of Lorem Ipsum.",
  },
  {
    sender: Sender.USER,
    message: 'Why do we use it?',
  },
  {
    sender: Sender.CHAT_ENGINE,
    message:
      "It is a long established fact that a reader will be distracted by the readable content of a page when looking at its layout. The point of using Lorem Ipsum is that it has a more-or-less normal distribution of letters, as opposed to using 'Content here, content here', making it look like readable English. Many desktop publishing packages and web page editors now use Lorem Ipsum as their default model text, and a search for 'lorem ipsum' will uncover many web sites still in their infancy. Various versions have evolved over the years, sometimes by accident, sometimes on purpose (injected humour and the like).",
  },
  {
    sender: Sender.USER,
    message: 'Where does it come from?',
  },
  {
    sender: Sender.CHAT_ENGINE,
    message:
      'Contrary to popular belief, Lorem Ipsum is not simply random text. It has roots in a piece of classical Latin literature from 45 BC, making it over 2000 years old. Richard McClintock, a Latin professor at Hampden-Sydney College in Virginia, looked up one of the more obscure Latin words, consectetur, from a Lorem Ipsum passage, and going through the cites of the word in classical literature, discovered the undoubtable source. Lorem Ipsum comes from sections 1.10.32 and 1.10.33 of "de Finibus Bonorum et Malorum" (The Extremes of Good and Evil) by Cicero, written in 45 BC. This book is a treatise on the theory of ethics, very popular during the Renaissance. The first line of Lorem Ipsum, "Lorem ipsum dolor sit amet..", comes from a line in section 1.10.32.',
  },
];
