import { RefObject } from 'react';

interface PromptTextAreaProps {
  textareaRef: RefObject<HTMLTextAreaElement>;
  onSubmit: (userQuery: string) => void;
}

export default function PromptTextArea({
  textareaRef,
  onSubmit,
}: PromptTextAreaProps) {
  return (
    <form className="mx-4">
      <div className="flex items-center rounded-2xl bg-white px-3 py-2 shadow-md border border-gray-300">
        <textarea
          ref={textareaRef}
          id="chat"
          rows={1}
          className="mr-3 block w-full resize-none rounded-lg border-none bg-white p-2.5 text-sm text-gray-900 focus:ring-0 focus-visible:ring-0"
          placeholder="Start typing your question"
          onKeyDown={e => {
            if (e.key === 'Enter' && !e.shiftKey) {
              e.preventDefault();
              if (
                textareaRef.current &&
                textareaRef.current.value.trim().length > 0
              ) {
                onSubmit(textareaRef.current.value);
                textareaRef.current.value = '';
              }
            }
          }}
        />
        <button
          type="submit"
          onClick={e => {
            e.preventDefault();
            if (
              textareaRef.current &&
              textareaRef.current.value.trim().length > 0
            ) {
              onSubmit(textareaRef.current.value);
              textareaRef.current.value = '';
            }
          }}
          className="inline-flex items-center rounded-md bg-purple-600 px-1.5 py-1.5 text-sm font-semibold text-white shadow-sm hover:bg-purple-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-purple-600"
        >
          <svg
            aria-hidden="true"
            className="h-6 w-6 rotate-90"
            fill="currentColor"
            viewBox="0 0 20 20"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path d="M10.894 2.553a1 1 0 00-1.788 0l-7 14a1 1 0 001.169 1.409l5-1.429A1 1 0 009 15.571V11a1 1 0 112 0v4.571a1 1 0 00.725.962l5 1.428a1 1 0 001.17-1.408l-7-14z" />
          </svg>
        </button>
      </div>
    </form>
  );
}
