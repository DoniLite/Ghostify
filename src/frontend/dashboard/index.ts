

const actionBtn = document.querySelector('#sidebarActionBtn');
const showOrNot = document.querySelectorAll('.showOrHide');
const container = document.querySelector('#dashboardContainer');
const variants = {
  show: 'show-dash-nav',
  hide: 'hide-dash-nav',
  iconRotateNone: 'rotate-icon-just',
  iconRotate: 'rotate-icon-inverse',
} as const;

actionBtn?.addEventListener('click', (e) => {
    e.preventDefault()
    if(actionBtn.classList.contains(variants.iconRotateNone)) {
        actionBtn.classList.replace(variants.iconRotateNone, variants.iconRotate);
        container?.classList.replace(variants.hide, variants.show);
        showOrNot.forEach(el => {
            el.classList.remove('hidden');
        });
        return;
    }
    actionBtn.classList.replace(variants.iconRotate, variants.iconRotateNone);
    container?.classList.replace(variants.show, variants.hide);
    showOrNot.forEach((el) => {
      el.classList.add('hidden');
    });
});