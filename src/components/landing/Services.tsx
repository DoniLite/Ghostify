export default function() {
    return (
      <section id='services' class='py-20'>
        <div class='container mx-auto px-4'>
          <div class='text-center mb-16'>
            <span class='bg-gradient-to-r from-orange-600 to-orange-400 py-1 px-4 rounded-full text-sm font-medium text-white'>
              Nos Services
            </span>
            <h2 class='text-3xl md:text-4xl font-bold mt-4 mb-6'>
              Solutions documentaires complètes pour les développeurs
            </h2>
            <p class='text-gray-400 max-w-2xl mx-auto'>
              Intégrez des fonctionnalités avancées de gestion documentaire à
              vos applications avec nos APIs hautement performantes et
              évolutives.
            </p>
          </div>

          <div class='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8'>
            <div class='glass rounded-xl p-6 border border-gray-800 hover:border-orange-500 transition-all duration-300 hover:shadow-lg hover:shadow-indigo-500/20 flex flex-col'>
              <div class='w-14 h-14 rounded-2xl bg-gradient-to-br from-indigo-600 to-indigo-800 flex items-center justify-center mb-6 text-white'>
                <svg
                  xmlns='http://www.w3.org/2000/svg'
                  class='h-7 w-7'
                  fill='none'
                  viewBox='0 0 24 24'
                  stroke='currentColor'
                >
                  <path
                    stroke-linecap='round'
                    stroke-linejoin='round'
                    stroke-width='2'
                    d='M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z'
                  />
                </svg>
              </div>
              <h3 class='text-xl font-bold mb-3'>Traduction de Documents</h3>
              <p class='text-gray-400 mb-5 flex-1'>
                Traduisez vos documents dans différents types de formats
              </p>

              <div class='mt-auto'>
                <div class='mb-4'>
                  <div class='flex items-center mb-2'>
                    <svg
                      xmlns='http://www.w3.org/2000/svg'
                      class='h-5 w-5 text-green-500 mr-2'
                      viewBox='0 0 20 20'
                      fill='currentColor'
                    >
                      <path
                        fill-rule='evenodd'
                        d='M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z'
                        clip-rule='evenodd'
                      />
                    </svg>
                    <span class='text-sm'>Performance et optimisation</span>
                  </div>
                  <div class='flex items-center mb-2'>
                    <svg
                      xmlns='http://www.w3.org/2000/svg'
                      class='h-5 w-5 text-green-500 mr-2'
                      viewBox='0 0 20 20'
                      fill='currentColor'
                    >
                      <path
                        fill-rule='evenodd'
                        d='M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z'
                        clip-rule='evenodd'
                      />
                    </svg>
                    <span class='text-sm'>Formats PDF, DOCX, HTML</span>
                  </div>
                  <div class='flex items-center'>
                    <svg
                      xmlns='http://www.w3.org/2000/svg'
                      class='h-5 w-5 text-green-500 mr-2'
                      viewBox='0 0 20 20'
                      fill='currentColor'
                    >
                      <path
                        fill-rule='evenodd'
                        d='M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z'
                        clip-rule='evenodd'
                      />
                    </svg>
                    <span class='text-sm'>Traduction en masse</span>
                  </div>
                </div>

                <div class='bg-gray-800 rounded-lg overflow-hidden p-2'>
                  <pre class='text-xs text-cyan-400 overflow-x-auto custom-scrollbar'>
                    <code>POST /api/documents/translate</code>
                  </pre>
                  <pre class='text-xs text-gray-400 overflow-x-auto custom-scrollbar'>
                    <code>
                      {JSON.stringify({
                        template: 'invoice_v2',
                        data: { client: 'Acme Inc.', items: [...[]] },
                      }, null, 4)}
                    </code>
                  </pre>
                </div>
              </div>
            </div>

            {/* <div class='glass rounded-xl p-6 border border-gray-800 hover:border-orange-500 transition-all duration-300 hover:shadow-lg hover:shadow-indigo-500/20 flex flex-col'>
              <div class='w-14 h-14 rounded-2xl bg-gradient-to-br from-cyan-600 to-cyan-800 flex items-center justify-center mb-6 text-white'>
                <svg
                  xmlns='http://www.w3.org/2000/svg'
                  class='h-7 w-7'
                  fill='none'
                  viewBox='0 0 24 24'
                  stroke='currentColor'
                >
                  <path
                    stroke-linecap='round'
                    stroke-linejoin='round'
                    stroke-width='2'
                    d='M19 20H5a2 2 0 01-2-2V6a2 2 0 012-2h10a2 2 0 012 2v1m2 13a2 2 0 01-2-2V7m2 13a2 2 0 002-2V9a2 2 0 00-2-2h-2m-4-3H9M7 16h6M7 8h6v4H7V8z'
                  />
                </svg>
              </div>
              <h3 class='text-xl font-bold mb-3'>Blogs & CMS</h3>
              <p class='text-gray-400 mb-5 flex-1'>
                API complète pour créer et gérer du contenu de blog structuré
                avec support pour le markdown et les médias.
              </p>

              <div class='mt-auto'>
                <div class='mb-4'>
                  <div class='flex items-center mb-2'>
                    <svg
                      xmlns='http://www.w3.org/2000/svg'
                      class='h-5 w-5 text-green-500 mr-2'
                      viewBox='0 0 20 20'
                      fill='currentColor'
                    >
                      <path
                        fill-rule='evenodd'
                        d='M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z'
                        clip-rule='evenodd'
                      />
                    </svg>
                    <span class='text-sm'>Support Markdown avancé</span>
                  </div>
                  <div class='flex items-center mb-2'>
                    <svg
                      xmlns='http://www.w3.org/2000/svg'
                      class='h-5 w-5 text-green-500 mr-2'
                      viewBox='0 0 20 20'
                      fill='currentColor'
                    >
                      <path
                        fill-rule='evenodd'
                        d='M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z'
                        clip-rule='evenodd'
                      />
                    </svg>
                    <span class='text-sm'>Système de commentaires</span>
                  </div>
                  <div class='flex items-center'>
                    <svg
                      xmlns='http://www.w3.org/2000/svg'
                      class='h-5 w-5 text-green-500 mr-2'
                      viewBox='0 0 20 20'
                      fill='currentColor'
                    >
                      <path
                        fill-rule='evenodd'
                        d='M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z'
                        clip-rule='evenodd'
                      />
                    </svg>
                    <span class='text-sm'>Gestion des médias</span>
                  </div>
                </div>

                <div class='bg-gray-800 rounded-lg overflow-hidden p-2'>
                  <pre class='text-xs text-cyan-400 overflow-x-auto custom-scrollbar'>
                    <code>POST /api/blog/post</code>
                  </pre>
                  <pre class='text-xs text-gray-400 overflow-x-auto custom-scrollbar'>
                    <code>
                      &rbrace; "title": "Mon Article", "content": "#
                      Titre\nContenu...", "tags": ["tech", "api"] &rbrace;
                    </code>
                  </pre>
                </div>
              </div>
            </div> */}

            <div class='glass rounded-xl p-6 border border-gray-800 hover:border-orange-500 transition-all duration-300 hover:shadow-lg hover:shadow-indigo-500/20 flex flex-col'>
              <div class='w-14 h-14 rounded-2xl bg-gradient-to-br from-pink-600 to-pink-800 flex items-center justify-center mb-6 text-white'>
                <svg
                  xmlns='http://www.w3.org/2000/svg'
                  class='h-7 w-7'
                  fill='none'
                  viewBox='0 0 24 24'
                  stroke='currentColor'
                >
                  <path
                    stroke-linecap='round'
                    stroke-linejoin='round'
                    stroke-width='2'
                    d='M8 7h12m0 0l-4-4m4 4l-4 4m0 6H4m0 0l4 4m-4-4l4-4'
                  />
                </svg>
              </div>
              <h3 class='text-xl font-bold mb-3'>Conversion de Documents</h3>
              <p class='text-gray-400 mb-5 flex-1'>
                Convertissez vos documents entre différents formats tout en
                préservant la mise en forme et les éléments complexes.
              </p>

              <div class='mt-auto'>
                <div class='mb-4'>
                  <div class='flex items-center mb-2'>
                    <svg
                      xmlns='http://www.w3.org/2000/svg'
                      class='h-5 w-5 text-green-500 mr-2'
                      viewBox='0 0 20 20'
                      fill='currentColor'
                    >
                      <path
                        fill-rule='evenodd'
                        d='M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z'
                        clip-rule='evenodd'
                      />
                    </svg>
                    <span class='text-sm'>PDF, DOCX, HTML, Markdown</span>
                  </div>
                  <div class='flex items-center mb-2'>
                    <svg
                      xmlns='http://www.w3.org/2000/svg'
                      class='h-5 w-5 text-green-500 mr-2'
                      viewBox='0 0 20 20'
                      fill='currentColor'
                    >
                      <path
                        fill-rule='evenodd'
                        d='M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z'
                        clip-rule='evenodd'
                      />
                    </svg>
                    <span class='text-sm'>Préservation de la mise en page</span>
                  </div>
                  <div class='flex items-center'>
                    <svg
                      xmlns='http://www.w3.org/2000/svg'
                      class='h-5 w-5 text-green-500 mr-2'
                      viewBox='0 0 20 20'
                      fill='currentColor'
                    >
                      <path
                        fill-rule='evenodd'
                        d='M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z'
                        clip-rule='evenodd'
                      />
                    </svg>
                    <span class='text-sm'>Traitement par lots</span>
                  </div>
                </div>

                <div class='bg-gray-800 rounded-lg overflow-hidden p-2'>
                  <pre class='text-xs text-cyan-400 overflow-x-auto custom-scrollbar'>
                    <code>POST /api/documents/convert</code>
                  </pre>
                  <pre class='text-xs text-gray-400 overflow-x-auto custom-scrollbar'>
                    <code>
                      {JSON.stringify({
                        source: 'pdf',
                        target: 'docx',
                        options: { preserveImages: true },
                      }, null, 4)}
                    </code>
                  </pre>
                </div>
              </div>
            </div>

            <div class='glass rounded-xl p-6 border border-gray-800 hover:border-orange-500 transition-all duration-300 hover:shadow-lg hover:shadow-indigo-500/20 flex flex-col'>
              <div class='w-14 h-14 rounded-2xl bg-gradient-to-br from-purple-600 to-purple-800 flex items-center justify-center mb-6 text-white'>
                <svg
                  xmlns='http://www.w3.org/2000/svg'
                  class='h-7 w-7'
                  fill='none'
                  viewBox='0 0 24 24'
                  stroke='currentColor'
                >
                  <path
                    stroke-linecap='round'
                    stroke-linejoin='round'
                    stroke-width='2'
                    d='M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z'
                  />
                </svg>
              </div>
              <h3 class='text-xl font-bold mb-3'>Création de CV</h3>
              <p class='text-gray-400 mb-5 flex-1'>
                Générez des CV professionnels avec des modèles personnalisables
                pour les applications RH et les sites de recrutement.
              </p>

              <div class='mt-auto'>
                <div class='mb-4'>
                  <div class='flex items-center mb-2'>
                    <svg
                      xmlns='http://www.w3.org/2000/svg'
                      class='h-5 w-5 text-green-500 mr-2'
                      viewBox='0 0 20 20'
                      fill='currentColor'
                    >
                      <path
                        fill-rule='evenodd'
                        d='M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z'
                        clip-rule='evenodd'
                      />
                    </svg>
                    <span class='text-sm'>Templates modernes</span>
                  </div>
                  <div class='flex items-center mb-2'>
                    <svg
                      xmlns='http://www.w3.org/2000/svg'
                      class='h-5 w-5 text-green-500 mr-2'
                      viewBox='0 0 20 20'
                      fill='currentColor'
                    >
                      <path
                        fill-rule='evenodd'
                        d='M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z'
                        clip-rule='evenodd'
                      />
                    </svg>
                    <span class='text-sm'>Personnalisation avancée</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    );
}