import document from 'document';
// import window from 'window';
// import browser from '../utils/extension';
// var $ = window.$;
import styles from './progress.scss';
// import {
//   Tweenable
// } from 'shifty';


// const tweenable = new Tweenable();

// // var start = null;
// const progressBar = document.createElement('div');
// // progressBar.className = styles['b-progress'];
// progressBar.id = 'b-progress'
// progressBar.classList.add('buddy-feature');

// $('body').prepend(progressBar)

const progressBar2 = document.createElement('div');
progressBar2.id = 'b-progress2'
document.body.prepend(progressBar2);

// var x = 3;
// var startTime = Date.now();
// var progressBarInterval = setInterval(function() {
//   // progressBar2.style['animation-duration'] = x + 's';
//   // x = x + (x/20)
//   // if (x > 10 || (Date.now() - startTime) > x)
//   // clearInterval(progressBarInterval)
//   console.log(progressBar2.style.animation);
// }, 800);

// var element = document.getElementById('b-progress');

// function step(state, attachment, timeElapsed) {
//   // if (!start) start = timestamp;
//   // var progress = timestamp - start;
//   element.style.transform = 'translateX(' + state.x + '%)';
//   // if (progress < 2000) {
//   //   window.requestAnimationFrame(step);
//   // }
//   // console.log(state);
//   //   $('#b-progress').width(state.x + '%');
// }

// tweenable.setConfig({
//   from: {
//     x: 2
//   },
//   to: {
//     x: 100
//   },
//   duration: 1500,
//   easing: 'easeOutQuad',
//   step: (state) => {
//     console.log(Date.now(), state);
//     if (progressBar == null) {
//       progressBar = document.getElementById('b-progress');
//     }
//     progressBar.style.transform = 'scaleX(' + state.x + ')';
//   }
// });


// // window.requestAnimationFrame(step);

// console.log('progress.js: registering pageinit');
// $(document).on('pageshow', function () {

//   console.log(Date.now(), 'pageshow end');
//   tweenable.stop(true);
//   progressBar.style.transform = null
// }).on('pagebeforechange', function () {

//   // $('#b-progress')
//   //   .animate({
//   //     width: '20%'
//   //   }, 3000)
//   //   .delay(100)
//   //   .animate({
//   //     width: '99%'
//   //   }, 
//   //   5000,
//   //   function () {
//   //     $(this).removeAttr('style');
//   //   });


//   // tweenable.tween() could be called again later
//   tweenable.tween().then(() => {
//     console.log(Date.now(), 'end');
//     progressBar.style.transform = null
//   });

//   // var start = null;
//   // var element = document.getElementById('b-progress');

//   // function step(timestamp) {
//   //   if (!start) start = timestamp;
//   //   var progress = timestamp - start;
//   //   element.style.transform = 'translateX(' + Math.min(progress / 10, 200) + 'px)';
//   //   if (progress < 2000) {
//   //     window.requestAnimationFrame(step);
//   //   }
//   // }

//   // window.requestAnimationFrame(step);
// });