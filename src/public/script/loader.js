const getLoaderInfo = async () => {
  const response = await fetch(
    `https://api.ipgeolocation.io/ipgeo?apiKey=f9f42822b0aa4b5daed3fd944a0ed341`
  );

  const data = await response.json();
  const redirect = await fetch("/home", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({data: data}),
  });
  const redirectData = await redirect.json();
  const {url} =redirectData;
  console.log(url)
  if(url){
    window.location.href = url;
    return;
  }
  console.log(data);
};

await getLoaderInfo();
