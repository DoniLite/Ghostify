import { cvDownloader } from "./utils";


const url = `http://localhost:3085/cv/eyJhbGciOiJIUzI1NiJ9.MTczMDgxNTI1MjU2Nw.7BSmwiQVh6saMuUcglktq3lH60fW8QRtzWn_l4pe2co`;
const id = 1;


cvDownloader({url, id}).then(res => {
    console.log(res);
}).catch(err => {
    console.log(err);
});