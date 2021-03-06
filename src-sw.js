importScripts('https://storage.googleapis.com/workbox-cdn/releases/5.1.2/workbox-sw.js');

workbox.precaching.precacheAndRoute(self.__WB_MANIFEST);
workbox.routing.registerRoute(new RegExp('api/observations/'), new workbox.strategies.NetworkFirst());
workbox.routing.registerRoute(new RegExp('api/turbines/'), new workbox.strategies.NetworkFirst());
workbox.precaching.precacheAndRoute([{
    url: 'https://fonts.googleapis.com/icon?family=Material+Icons'
}, {
    url: 'https://kit.fontawesome.com/a069fd15f6.js'
}, {
    url: 'https://kit-free.fontawesome.com/releases/latest/css/free-v4-shims.min.css'
}, {
    url: 'https://kit-free.fontawesome.com/releases/latest/css/free-v4-font-face.min.css'
}, {
    url: 'https://kit-free.fontawesome.com/releases/latest/css/free.min.css'
}, {
    url: 'https://kit-free.fontawesome.com/releases/latest/webfonts/free-fa-solid-900.woff2'
}, {
    url: 'https://kit-free.fontawesome.com/releases/latest/webfonts/free-fa-solid-900.woff'
}, {
    url: 'https://kit-free.fontawesome.com/releases/latest/webfonts/free-fa-solid-900.ttf'
}, {
    url: 'https://ajax.googleapis.com/ajax/libs/jquery/3.4.1/jquery.min.js'
}, {
    url: 'https://cdnjs.cloudflare.com/ajax/libs/underscore.js/1.9.1/underscore-min.js'
}, {
    url: 'https://fonts.googleapis.com/css?family=Barlow|Comfortaa|Krona+One|Nanum+Gothic|Odibee+Sans|Rubik|Ubuntu&display=swap'
}, {
    url: 'https://cdnjs.cloudflare.com/ajax/libs/Chart.js/2.9.3/Chart.min.js'
}, {
    url: 'https://cdnjs.cloudflare.com/ajax/libs/prism/1.17.1/themes/prism.min.css'
}, {
    url: 'https://cdnjs.cloudflare.com/ajax/libs/prism/1.17.1/components/prism-core.min.js'
}, {
    url: 'https://cdnjs.cloudflare.com/ajax/libs/prism/1.17.1/plugins/autoloader/prism-autoloader.min.js'
}, {
    url: 'https://cdnjs.cloudflare.com/ajax/libs/prism/1.17.1/components/prism-python.min.js'
}/*, {
    url: ''
}, {
    url: ''
}, {
    url: ''
}, {
    url: ''
}, {
    url: ''
}, {
    url: ''
}, {
    url: ''
}, {
    url: ''
}, {
    url: ''
}, {
    url: ''
}, {
    url: ''
}, {
    url: ''
}, {
    url: ''
}, {
    url: ''
}, {
    url: ''
}, {
    url: ''
}, {
    url: ''
}, {
    url: ''
}, {
    url: ''
}, {
    url: ''
}, {
    url: ''
}, {
    url: ''
}, {
    url: ''
}, {
    url: ''
}, {
    url: ''
}, {
    url: ''
}, {
    url: ''
}, {
    url: ''
}, {
    url: ''
}, {
    url: ''
}, {
    url: ''
}, {
    url: ''
}, {
    url: ''
}, {
    url: ''
}*/]);