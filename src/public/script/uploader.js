
const formElement = document.querySelector("#urlForm");
const errorMessage = document.querySelector("#submitMessage");
formElement.addEventListener('submit', async (e) => {
    e.preventDefault()
    const urlForm = new FormData(e.currentTarget);
    const url = urlForm.get('site')
    const data = {
       url,
    }
    const result = await fetch("/sitesUpload", {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(data)
    });
    if (!result.ok) {
        errorMessage.innerHTML = "Oups 🥲 There was an error.. <br>" + result.statusText;
        setTimeout(() => {
          errorMessage.innerHTML = ""; 
        }, 2000);
    }
    const res = await result.json();
    // console.log("Data sent successfully:", res);
    errorMessage.innerHTML = "Thanks for uploading! ❤️";
    setTimeout(()=>{
        errorMessage.innerHTML = ""; 
    }, 2000)
})
