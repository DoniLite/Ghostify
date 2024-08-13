
const getLoaderInfo = async () => {
  const htmlFetch = await fetch('/');
  const testData = await htmlFetch.text();
  console.log(testData);
  const response = await fetch(
    `https://api.ipgeolocation.io/ipgeo?apiKey=f9f42822b0aa4b5daed3fd944a0ed341`
  );
  if ( ! response.ok) {
    throw new Error("Network response was not ok");
  }
  const data = await response.json();
  const redirect = await fetch("/home", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ data: data }),
  });
  if (!redirect.ok) {
    throw new Error(redirect.statusText)
  }
  const redirectData = await redirect.json();
  const {url} = redirectData;
  console.log(url)
  if(url){
    window.location.href = url;
    return;
  }
  console.log(data);
};

await getLoaderInfo();
