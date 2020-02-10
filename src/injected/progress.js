import document from 'document';
// import window from 'window';
// import browser from '../utils/extension';
// var $ = window.$;
import styles from './progress.scss';
import {
  Tweenable
} from 'shifty';

console.log(styles);

var numberOfSlices = 5;
var slicePercent = 100 / numberOfSlices;
var previousSlice = 0;
var slices = [];
// for (var i = 0; i < numberOfSlices; i++) {
  slices.push( {
    from: {
      percent: 0
    },
    to: {
      percent: 100
    }
  } );
  // previousSlice += slicePercent;
// }

/**
 * Percent (0-100) into polar coordinates. Assumes radius of 1.
 */
function pctToXY(percent) {
  const x = Math.cos(2 * Math.PI * percent / 100);
  const y = Math.sin(2 * Math.PI * percent / 100);

  return {
    x: x,
    y: y
  };
}

const svgContainer = document.createElement('div');
// svgContainer.innerHTML = `<svg viewBox="-1 -1 2 2" style="transform: rotate(-90deg)"></svg>`;
svgContainer.className = 'progress';
svgContainer.innerHTML = `<svg viewBox="-1 -1 2 2"></svg>`;
document.body.prepend(svgContainer);

const svgEl = document.querySelector('svg');
let cumulativePercent = 0;
let sliceCounter = 0;

function createPath(percent) {
  const start = pctToXY(0);
  const end = pctToXY(percent);
  console.log('end', end);

  // if the slice is more than 50%, take the large arc (the long way around)
  const largeArcFlag = percent / 100 > .5 ? 1 : 0;

  // create an array and join it just for code readability
  return [
    `M ${start.x} ${start.y}`, // Move
    `A 1 1 0 ${largeArcFlag} 1 ${end.x} ${end.y}`, // Arc
    `L 0 0`, // Line
  ].join(' ');
}

// let pathData = createPath(0);

// create a <path> and append it to the <svg> element


function getLinePath(percent) {
  const end = pctToXY(percent);
  return `M 0 0 L ${end.x} ${end.y}`;
}

function drawLine(percent) {
  let pathData = getLinePath(percent);
  const pathEl = document.createElementNS('http://www.w3.org/2000/svg', 'path');
  pathEl.setAttribute('d', pathData);
  pathEl.setAttribute('stroke', '#333');
  pathEl.setAttribute('stroke-width', '.01px');
  svgEl.appendChild(pathEl);
}

function closeToModulous(num1, num2) {
  let num3 = num1 % num2;
  return closeTo(num3, 0);
}

function closeTo(num1, num2) {
  return num1 - .2 < num2 && num1 + .2 > num2;
}


slices.forEach(slice => {

  // var pieProgress = document.getElementById('piePath' + sliceCounter);


  const pathEl = document.createElementNS('http://www.w3.org/2000/svg', 'path');
  // pathEl.setAttribute('d', pathData);
  // pathEl.setAttribute('fill', 'blue');
  pathEl.setAttribute('id', 'piePath' + sliceCounter++);
  svgEl.appendChild(pathEl);

  const tweenable = new Tweenable();

  tweenable.setConfig({
    from: {
      percent: slice.from.percent,
    },
    to: {
      percent: slice.to.percent,
    },
    duration: 4000,
    easing: 'easeOutQuad',
    step: (state) => {
    console.log('state.percent = ' + state.percent);
      if (closeToModulous(state.percent, 25)) {
        drawLine(state.percent);
      }
      cumulativePercent = 0
      pathEl.setAttribute('d', createPath(state.percent));
    }
  });

  setTimeout(function () {
  tweenable.tween();
  }, 2000);
});

// // var start = null;
// const progressBar = document.createElement('div');
// // progressBar.className = styles['b-progress'];
// progressBar.id = 'b-progress'
// progressBar.classList.add('buddy-feature');

// $('body').prepend(progressBar)
// progressBar2.innerHTML = `<svg height="200" width="200" viewBox="0 0 200 200">
// <circle r="100" cx="100" cy="100" fill="white" />
// <circle r="50" cx="100" cy="100" fill="red" id="b-progresscircle"
//         stroke="tomato"
//         stroke-width="100"
//         stroke-dasharray="calc(25 * 31.4 / 100) 31.4"
//         transform="rotate(-90) translate(-200)" />
// </svg>`; //document.createElement('div');

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