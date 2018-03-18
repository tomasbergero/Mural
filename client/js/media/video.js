const MEDIA = [];
const DATA = [];

function insertBackgroundVideo (scrollStory, $el, id, srcs, attrs) {
  const video = prepareVideo(scrollStory, $el, id, srcs, attrs);

  video.loop = attrs.loop;
  video.autoplay = (DATA[video].paused !== undefined) ? !DATA[video].paused : attrs.autoplay;
  video.muted = attrs.muted;
  video.poster = attrs.poster;
  video.currentTime = DATA[video].currentTime || 0;
  video.load();
}

// remove video to prevent more downloading if it won't be watched.
// store current time that had been reached.
function removeBackgroundVideo ($el, id) {
  const $container = $el.find('.video-container');
  $container.css('position', '');
  const video = MEDIA[id];
  DATA[video].currentTime = video.currentTime;
  video.innerHTML = '';
  video.removeAttribute('autoplay');
  video.load();
}

function fixBackgroundVideo ($el) {
  const $container = $el.find('.video-container');
  $container.css('position', 'fixed');
}

function unfixBackgroundVideo ($el) {
  const $container = $el.find('.video-container');
  $container.css('position', '');
}

function prepareVideo (scrollStory, $el, id, srcs, attrs) {
  let video;

  if (MEDIA[id]) {
    video = MEDIA[id];
  } else {
    video = document.createElement('video');
    DATA[video] = {};
    $el.find('.video-container').html(video);

    $el.find('.play').click(function() {
      video.play();
      DATA[video].paused = false;
      $(this).hide();
      $el.find('.pause').show();
    });

    $el.find('.pause').click(function() {
      // TODO check for cancelling problems with promises
      video.pause();
      DATA[video].paused = true;
      $(this).hide();
      $el.find('.play').show();
    });

    if (attrs.autoplay === true) {
      $el.find('.play').hide();
    } else {
      $el.find('.pause').hide();
    }

    if (attrs.autoAdvance) {
      video.addEventListener('ended', () => {
        const count = scrollStory.getItems().length;
        const next = id + 1;

        if (next < count) {
          scrollStory.index(id + 1);
        }

        // Allow it to restart from the beginning.
        video.currentTime = 0;
      });
    }
  }

  srcs.forEach((src) => {
    const source = document.createElement('source'); 
    source.type = src.type;
    source.src = src.src;
    video.appendChild(source);
  });

  video.preload = 'auto';
  MEDIA[id] = video;

  return video;
}

function setMuted (id, muted) {
  const video = MEDIA[id];
  video.muted = muted;
}

module.exports = {
  insertBackgroundVideo,
  prepareVideo,
  removeBackgroundVideo,
  fixBackgroundVideo,
  unfixBackgroundVideo,
  setMuted
};
