import { component$, useSignal, $, useComputed$, useTask$ } from '@builder.io/qwik';
import type { DocumentHead } from '@builder.io/qwik-city';
import { createChatCompletion } from '~/services/openai';

export default component$(() => {
  const CONTENT_PREFIX = 'Unit Test with Jest, ';

  const isGenerating = useSignal(false);
  const hasApiKey = useSignal(true);
  const textContent = useSignal('');
  const generatedResult = useSignal('');

  useTask$(async () => {
    if (!import.meta.env.VITE_AI_API_KEY) hasApiKey.value = false;
  });

  const shouldBeDisabled = useComputed$(() => {
    return !textContent.value || isGenerating.value;
  });
  
  const onGenerateResult = $(async() => {
    isGenerating.value = true;
    if (shouldBeDisabled.value) return;
    
    try {
      const { data } = await createChatCompletion(`${CONTENT_PREFIX} ${textContent}`);

      if (data?.choices[0]?.message?.content) {
        generatedResult.value = data?.choices[0]?.message?.content;
      }
    } catch(e) {
      console.log('Error: ', e)
    } finally {
      isGenerating.value = false;
    }
    
  })

  return (
    <div class="h-full w-5/6 md:w-4/6 mx-auto mb-10">
      <div class="mb-14">
        <p class="text-3xl">
          <span class="font-bold">Qwik-Jestify! </span><span class="text-lg">Let's have your funtion tested with Jest!</span>
        </p>
        <small>Made with ❤️‍🔥 by <a href="https://www.linkedin.com/in/michaellarrubis/" target="_blank" class="text-sky-600">Michael Larrubis</a></small>
      </div>

      {!hasApiKey.value && (
        <div class="relative bg-slate-700 rounded-md w-full p-4">
          <pre class="text-white whitespace-pre-wrap">
            Please make sure to have the OpenAPI API_KEY is installed.
          </pre>
        </div>
      )}
      {hasApiKey.value && (
        <>
          {generatedResult.value && (
            <div class="relative bg-slate-700 rounded-md w-full p-4">
              <pre class="text-white whitespace-pre-wrap">
                {generatedResult}
              </pre>

              <button
                onClick$={() => {
                  generatedResult.value = '';
                  textContent.value = '';
                }}
                class="w-full bg-white text-gray-800 py-2 px-4 rounded mt-10"
              >
                Generate again.
              </button>
            </div>
          )}

          {!generatedResult.value && (
            <div class="h-4/6 w-full mx-auto">
              <textarea
                disabled={isGenerating.value}
                placeholder="Drop your code here!"
                bind:value={textContent}
                class="resize-none rounded-md bg-white w-full h-full focus:outline-gray-600 p-3"
              />
              <button
                disabled={shouldBeDisabled.value}
                onClick$={onGenerateResult}
                class={['w-full hover:bg-gray-600 bg-gray-700 text-white py-2 px-4 rounded mt-4', { 'opacity-80': isGenerating.value }]}
              >
                {isGenerating.value ? <span>Generating.....</span> : <span>Generate Unit Test</span>}
              </button>
            </div>
          )}
        </>
      )}
      
    </div>
  );
});

export const head: DocumentHead = {
  title: 'Qwik-Jestify: Simple Unit Test Generator!',
  meta: [
    {
      name: "Simple Unit Test Generator!",
      content: "Let's have your funtion tested with Jest!",
    },
  ],
};
