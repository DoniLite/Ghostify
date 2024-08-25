
const loader = document.querySelector('#loaderHead');

const getLoaderInfo = async () => {
  const storageData = localStorage.getItem('session');
  if(storageData) {
    const result = await fetch('/home', {
      method: 'POST',
      body: storageData,
    });
    if(!result.ok) {
      loader.innerHTML = 'Une erreur s\'est produite';
      return;
    }
    window.location.href = '/home?persisted=true';
    return;
  }
  window.location.href = '/home?noApiData=true';
};

try {
  await getLoaderInfo();
} catch (e) {
  console.error(e)
  window.location.href = '/home?noApiData=true';
}
