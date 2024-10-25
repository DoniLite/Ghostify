/* eslint-disable no-undef */

import { notificationPush, notificationsComponent } from "./notifications.js";


const userIMG = document.querySelector('#userProfileImg');
const inputFile = document.querySelector('#profileUpdateInput');

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