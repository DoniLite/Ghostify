/* eslint-disable no-undef */

const loader = document.querySelector('#loaderHead');

const getLoaderInfo = async () => {
  const storageData = localStorage.getItem('session');
  if(typeof storageData === 'string') {
    const result = await fetch('/home', {
      method: 'POST',
      body: storageData,
    });
    if(!result.ok) {
      loader.innerHTML = 'Une erreur s\'est produite';
      return;
    }
    const data = await result.json();
    if (data.persisted === true) {
      window.location.href = '/home?persisted=true';
      return;
    }
    throw new Error('something went wrong');
  }
  const result = await fetch('/home', {
    method: 'POST',
    body: JSON.stringify({requestInit: true}),
  });
  if (!result.ok) {
    throw new Error('error happened');
  }
  const data = await result.json();
  if(data.req === true) {
    window.location.href = '/home?noApiData=true';
    return;
  }
  throw new Error('nothing matching');
};

try {
  await getLoaderInfo();
} catch (e) {
  console.error(e)
  window.location.href = '/home?noApiData=true';
}
