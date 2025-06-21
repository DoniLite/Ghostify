const $404 = () => {
  return (
    <html
      lang="en"
      data-theme="light"
    >
      <head>
        <meta charSet="UTF-8" />
        <meta
          name="viewport"
          content="width=device-width, initial-scale=1.0"
        />
        <title>Not Found</title>
        <link
          rel="stylesheet"
          href="/static/all.min.css"
        />
        <link
          rel="icon"
          type="image/svg+xml"
          href="/static/SVG/gostify.svg"
        />
        <link
          rel="stylesheet"
          href="/static/css/main.css"
        />
      </head>

      <body>
        <main className="grid min-h-full place-items-center bg-white px-6 py-24 sm:py-32 lg:px-8">
          <div className="text-center">
            <p className="text-base font-semibold text-indigo-600">404</p>
            <h1 className="mt-4 text-3xl font-bold tracking-tight text-gray-900 sm:text-5xl">
              Page not found
            </h1>
            <p className="mt-6 text-base leading-7 text-gray-600">
              Sorry, we couldn’t find the page you’re looking for.
            </p>
            <div className="mt-10 flex items-center justify-center gap-x-6">
              <a
                href="/"
                className="rounded-md bg-indigo-600 px-3.5 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
              >
                Go back home
              </a>
              <a
                href="#"
                className="text-sm font-semibold text-gray-900"
              >
                Contact support <span aria-hidden="true">&rarr;</span>
              </a>
            </div>
          </div>
        </main>
      </body>
    </html>
  )
}

export default $404
