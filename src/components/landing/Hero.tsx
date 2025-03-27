export default function () {
  return (
    <section class='py-20 md:py-28'>
      <div class='container mx-auto px-4'>
        <div class='flex flex-col md:flex-row items-center justify-between'>
          <div class='md:w-1/2 mb-12 md:mb-0'>
            <h1 class='text-4xl md:text-5xl lg:text-6xl font-bold leading-tight mb-6'>
              Une plateforme pour booster votre
              <span class='bg-gradient-to-r from-orange-500 to-orange-300 bg-clip-text text-transparent'>
                productivité
              </span>
            </h1>
            <p class='text-xl text-gray-400 mb-8 max-w-lg'>
              Ghostify est une plateforme de production et de partage de
              contenu. incluant des services comme la création et la conversion
              de document et de Cirruculum Vitae.
            </p>
            <div class='flex flex-col sm:flex-row space-y-4 sm:space-y-0 sm:space-x-4'>
              <a
                href='#demo'
                class='px-8 py-3 bg-gradient-to-br from-orange-500 to-orange-300 text-gray-950 font-medium rounded-full hover:shadow-lg hover:shadow-orange-500/20 transition transform hover:-translate-y-1 text-center'
              >
                Essayer gratuitement
              </a>
              <a
                href='#'
                class='px-8 py-3 border border-gray-700 hover:border-orange-500 text-white rounded-full transition hover:bg-gray-800 text-center'
              >
                Consulter la doc
              </a>
            </div>

            <div class='mt-10 grid grid-cols-3 gap-4'>
              <div class='flex flex-col items-center'>
                <div class='text-2xl font-bold bg-gradient-to-r from-orange-500 to-orange-300 bg-clip-text text-transparent'>
                  99.9%
                </div>
                <div class='text-sm text-gray-400'>Uptime garanti</div>
              </div>
              <div class='flex flex-col items-center'>
                <div class='text-2xl font-bold bg-gradient-to-r from-orange-500 to-orange-300 bg-clip-text text-transparent'>
                  Cloud
                </div>
                <div class='text-sm text-gray-400'>First</div>
              </div>
              <div class='flex flex-col items-center'>
                <div class='text-2xl font-bold bg-gradient-to-r from-orange-500 to-orange-300 bg-clip-text text-transparent'>
                  Full IA
                </div>
                <div class='text-sm text-gray-400'>support</div>
              </div>
            </div>
          </div>

          <div class='md:w-5/12 floating relative'>
            <div class='relative bg-gray-800 rounded-xl overflow-hidden border border-gray-700 shadow-xl'>
              <div class='h-8 bg-gray-900 flex items-center px-4'>
                <div class='flex space-x-1.5'>
                  <div class='w-3 h-3 rounded-full bg-red-500'></div>
                  <div class='w-3 h-3 rounded-full bg-yellow-500'></div>
                  <div class='w-3 h-3 rounded-full bg-green-500'></div>
                </div>
              </div>
              <div class='p-4'>
                <div class='glass rounded-lg p-4 border border-gray-700'>
                  <div class='flex space-x-2 mb-4'>
                    <div class='px-2 py-1 rounded-md bg-orange-600 text-xs font-medium'>
                      Create
                    </div>
                    <div class='px-2 py-1 rounded-md bg-orange-400 text-xs font-medium'>
                      Convert
                    </div>
                    <div class='px-2 py-1 rounded-md bg-orange-400 text-xs font-medium'>
                      CV
                    </div>
                  </div>
                  <div class='space-y-2'>
                    <div class='h-5 bg-gray-700 rounded w-3/4'></div>
                    <div class='h-5 bg-gray-700 rounded'></div>
                    <div class='h-5 bg-gray-700 rounded w-5/6'></div>
                    <div class='h-20 bg-gray-700 rounded mt-4'></div>
                  </div>
                  <div class='mt-4 pb-2 border-t border-gray-700 pt-4'>
                    <div class='h-8 w-28 rounded-md bg-gradient-to-r from-orange-500 to-orange-300'></div>
                  </div>
                </div>
              </div>
            </div>

            <div class='absolute -bottom-4 -right-4 w-32 h-32 bg-gradient-to-r from-indigo-600 to-cyan-500 rounded-full mix-blend-multiply filter blur-3xl opacity-20'></div>
            <div class='absolute -top-4 -left-4 w-32 h-32 bg-gradient-to-r from-pink-500 to-indigo-600 rounded-full mix-blend-multiply filter blur-3xl opacity-20'></div>
          </div>
        </div>
      </div>
    </section>
  );
}
