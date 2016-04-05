let infoExpanded = false;

document.querySelector('#infoExpand').addEventListener('click', function() {
    let infoElement = document.querySelector('#infoText');
    if(!infoExpanded) {
        infoExpanded = true;
        infoElement.style.display = 'flex';
        this.style.transform = 'rotate(180deg)';
        window.scrollBy(0, window.innerHeight);
    } else {
        infoExpanded = false;
        this.style.transform = '';
        infoElement.style.display = 'none';
    }
});


function fitProgressToImage() {
    var bar = document.querySelector('#progress');
    bar.style.width = document.querySelector('#currentPage').offsetWidth + 'px';
}

function setProgressValue(currVal, max) {
    var value = document.querySelector('#value');
    value.style.width = (currVal / max * 100) + '%';
}

fitProgressToImage();
