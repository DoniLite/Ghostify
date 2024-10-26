/* eslint-disable no-undef */

import { notificationPush, notificationsComponent } from "./notifications.js";


const userIMG = document.querySelector('#userProfileImg');
const inputFile = document.querySelector('#profileUpdateInput');
const userName = document.querySelector('#userNamePrint');

document.onclick = async (e) => {
    e.preventDefault();
    if(e.target.getAttribute('id') === 'userNamePrint' ) return
    console.log(e);
    userName.setAttribute('readonly', 'true');
}

userName.addEventListener('keyup', async (e) => {
    console.log(e.currentTarget.value);
    const req = await fetch(`/user/exists/${e.currentTarget.value}`);
    const res = await req.json();
    if (res.exist) {
        //adding red border...
        e.currentTarget.classList.add('wrong-data');
    }
    console.log('not exist');
})

userName.addEventListener('click', (e) => {
    e.preventDefault();
    console.log('user name clicked');
    e.currentTarget.removeAttribute('readonly')
})

userIMG.addEventListener('click', (e) => {
    e.preventDefault();
    inputFile.click();
})

inputFile.addEventListener('change', async (e) => {
    e.preventDefault();
    const file = e.currentTarget.files[0];
    if(file) {
        const form = new FormData();
        form.append('file', file);

        const req = await fetch('/user/profile/file', {
            method: 'POST',
            body: form,
        });

        if(req.status === 200) {
            const data = await req.json();
            console.log(data);
            userIMG.src = data.file;
            notificationPush(notificationsComponent.success('your profile has been updated!'));
            inputFile.value = '';
            return;
        }

        notificationPush(notificationsComponent.info('something went wrong please try again'));
        return;

    }
})