const searchBar = () => {
	return (
		<div
			id="searcher"
			className="fixed top-12 right-2 z-50 flex w-[55%] flex-col transition-all sm:top-20 lg:top-16 lg:left-[13%] lg:w-1/3 xl:top-6"
		>
			<div className="flex items-center justify-between rounded-md border-gray-700 bg-gray-800 px-3 text-white shadow-sm sm:text-sm">
				<input
					type="text"
					id="PrimarySearch"
					placeholder="Trouvons quelque chose..."
					className="w-full bg-transparent py-2.5 pe-10 text-xs outline-none"
				/>

				<span>
					<svg
						xmlns="http://www.w3.org/2000/svg"
						fill="none"
						viewBox="0 0 24 24"
						strokeWidth="1.5"
						stroke="currentColor"
						className="h-4 w-4"
					>
						<title>Searchbar icon</title>
						<path
							strokeLinecap="round"
							strokeLinejoin="round"
							d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z"
						/>
					</svg>
				</span>
			</div>
			<div
				id="containerPaser"
				className="hidden w-full flex-col gap-y-3 rounded-sm bg-gray-700 p-3 font-bold text-white"
			>
				<div id="searchLoader" className="hidden w-full justify-center">
					<svg
						stroke="currentColor"
						fill="currentColor"
						strokeWidth="0"
						viewBox="0 0 24 24"
						className="h-4 w-4 animate-spin"
						xmlns="http://www.w3.org/2000/svg"
					>
						<title>Searchbar icon</title>
						<path d="M12 2C17.5228 2 22 6.47715 22 12C22 17.5228 17.5228 22 12 22C6.47715 22 2 17.5228 2 12C2 6.47715 6.47715 2 12 2ZM13.6695 15.9999H10.3295L8.95053 17.8969L9.5044 19.6031C10.2897 19.8607 11.1286 20 12 20C12.8714 20 13.7103 19.8607 14.4956 19.6031L15.0485 17.8969L13.6695 15.9999ZM5.29354 10.8719L4.00222 11.8095L4 12C4 13.7297 4.54894 15.3312 5.4821 16.6397L7.39254 16.6399L8.71453 14.8199L7.68654 11.6499L5.29354 10.8719ZM18.7055 10.8719L16.3125 11.6499L15.2845 14.8199L16.6065 16.6399L18.5179 16.6397C19.4511 15.3312 20 13.7297 20 12L19.997 11.81L18.7055 10.8719ZM12 9.536L9.656 11.238L10.552 14H13.447L14.343 11.238L12 9.536ZM14.2914 4.33299L12.9995 5.27293V7.78993L15.6935 9.74693L17.9325 9.01993L18.4867 7.3168C17.467 5.90685 15.9988 4.84254 14.2914 4.33299ZM9.70757 4.33329C8.00021 4.84307 6.53216 5.90762 5.51261 7.31778L6.06653 9.01993L8.30554 9.74693L10.9995 7.78993V5.27293L9.70757 4.33329Z"></path>
					</svg>
				</div>
			</div>
		</div>
	);
};

export default searchBar;
