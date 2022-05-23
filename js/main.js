/* ----- VIEW ----- */
const cameraView = document.querySelector('[data-camera-view]')
const galleryView = document.querySelector('[data-gallery-view]')

const toggleViewButtons = document.querySelectorAll('[data-toggle-view-button]')

toggleViewButtons.forEach(button => {
    button.onclick = () => {
        cameraView.classList.toggle('active');
        galleryView.classList.toggle('active');
    }
})

/* ----- CAMERA ----- */
const pictureButton = document.querySelector('[data-picture-button]')
const picture = document.querySelector('[data-picture]')
const camera = document.querySelector('[data-camera]')

const LOCAL_STORAGE_KEY = 'bröllopsFotografen.images';
let images = JSON.parse(localStorage.getItem(LOCAL_STORAGE_KEY)) || [];
let stream;
const ctx = picture.getContext('2d')

pictureButton.onclick = () => { takePicture(); }

const takePicture = () => {
    camera.style.display = 'none';
    picture.style.display = 'block';
    pictureButton.innerText = 'fånga ett nytt ögonblick';
    pictureButton.onclick = resetPictureButton;
    
    ctx.drawImage(camera, 0, 0, picture.width, picture.height);
    const imageData = picture.toDataURL('image/png');
    
    
    images.push({
        id: images.length ? images[images.length-1].id + 1 : 1, 
        image: imageData
    })
    localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(images))
    renderImages()
    
    new Notification(
        `ADDED`, { 
            body: `Image-${images[images.length-1].id} was added to gallery.`,
            icon: imageData 
    });
}

const resetPictureButton = () => {
    camera.style.display = 'block';
    picture.style.display = 'none';
    pictureButton.innerText = 'föreviga ett ögonblick';
    pictureButton.onclick = takePicture;
}

window.onload = async () => {
    if ('mediaDevices' in navigator) {
        stream = await navigator.mediaDevices.getUserMedia({ video: true, audio: false })
        camera.srcObject = stream;
    }
    Notification.requestPermission().then((permission) => {
        notificationPermission = permission;
    })
}

/* ----- Gallery ----- */
const galleryContainer = document.querySelector('[data-gallery-container]')
const galleryActive = document.querySelector('[data-gallery-active]')

const renderImages = () => {
    let images = JSON.parse(localStorage.getItem(LOCAL_STORAGE_KEY))
    galleryContainer.innerHTML = '';
    images.forEach(image => {
        const imageDiv = document.createElement('div')
        const imageElem = document.createElement('img');
        const deleteButton = document.createElement('span');
        deleteButton.innerText = '+';
        deleteButton.onclick = () => deletePicture(image.id);
        imageElem.setAttribute('src', image.image)
        imageElem.onclick = () => renderActive(image.id);
        imageDiv.append(deleteButton)
        imageDiv.append(imageElem)
        galleryContainer.append(imageDiv)
    })
}

const deletePicture = (id) => {
    const image = images.find(image => image.id === id)
    new Notification(
        `DELETED`, { 
            body: `Image${image.id} was deleted from list.`,
            icon: image.image 
    });

    const newImages = images.filter(image => image.id !== id)
    images = newImages;
    localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(newImages))
    renderImages()
    galleryActive.innerHTML = '';
}

const renderActive = (id) => {
    const imagesForActive = JSON.parse(localStorage.getItem(LOCAL_STORAGE_KEY))
    galleryActive.innerHTML = '';
    const activeImage = imagesForActive.find(image => image.id === id)
    const imageData = activeImage.image
    const imageElem = document.createElement('img')
    imageElem.setAttribute('src', imageData)
    galleryActive.append(imageElem)
}

renderImages()

/* ----- serviceWorker ----- */

const registerServiceWorker = () => {
    if ('serviceWorker' in navigator) {
        navigator.serviceWorker.register('../service-worker.js')
            .then(() => { console.log('Registered service worker')})
            .catch(() => { console.log('Could not register service-worker')})
    }
}

registerServiceWorker()

/* ----- Offline ----- */



/* ----- Notifications ----- */

const createNotification = () => {
    const text = 'Detta är en notifikation';

    const notification = new Notification('Notis', { body: text });

    notification.addEventListener('click', () => {
        window.open('https://localhost:443')
    })
}