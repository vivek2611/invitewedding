/**
 * Wedding Invitation Interactive Script - Himanshu & Shweta
 * Features:
 * - Envelope opening animation
 * - Indian wedding ambient raga music synthesis (Web Audio API)
 * - Fluttering floral petals canvas animation
 * - Live countdown timer to Nov 24, 2026
 * - Stacking & Overlapping "Fold Up" scroll physics
 * - WhatsApp direct wishing & sharing
 * - Add-to-Calendar (.ics file generator)
 */

document.addEventListener('DOMContentLoaded', () => {
  initEnvelope();
  initPetals();
  initCountdown();
  initStackingScroll();
  initAudio();
});

/* ==========================================================================
   1. ROYAL ENVELOPE / WAX SEAL OPENING
   ========================================================================== */
function initEnvelope() {
  const sealBtn = document.getElementById('wax-seal-btn');
  const overlay = document.getElementById('envelope-overlay');

  if (!sealBtn || !overlay) return;

  sealBtn.addEventListener('click', () => {
    if ('vibrate' in navigator) {
      navigator.vibrate([40, 60, 100]);
    }

    overlay.classList.add('opened');

    // Trigger music automatically on user interaction
    if (window.weddingAudio && !window.weddingAudio.isPlaying) {
      window.weddingAudio.toggle();
    }
  });
}

/* ==========================================================================
   2. GENTLE & SPARSE FLOATING PETALS (LOW VOLUME, TRANQUIL & SUBTLE)
   ========================================================================== */
function initPetals() {
  const canvas = document.getElementById('petals-canvas');
  if (!canvas) return;
  const ctx = canvas.getContext('2d');

  let width = (canvas.width = window.innerWidth);
  let height = (canvas.height = window.innerHeight);

  window.addEventListener('resize', () => {
    width = canvas.width = window.innerWidth;
    height = canvas.height = window.innerHeight;
  });

  // More petals with softer opacity for a dreamy, abundant floral effect
  const petalCount = window.innerWidth < 600 ? 10 : 16;
  const petals = [];

  const petalColors = [
    { fill: 'rgba(180, 24, 40, 0.22)', stroke: 'rgba(140, 10, 25, 0.25)' },     // Translucent Rose Red
    { fill: 'rgba(215, 38, 56, 0.20)', stroke: 'rgba(160, 20, 35, 0.22)' },     // Soft Pink Rose
    { fill: 'rgba(245, 166, 35, 0.22)', stroke: 'rgba(200, 130, 20, 0.25)' },   // Subtle Marigold
    { fill: 'rgba(255, 204, 0, 0.24)', stroke: 'rgba(220, 170, 0, 0.25)' },     // Golden Saffron
    { fill: 'rgba(230, 80, 100, 0.18)', stroke: 'rgba(200, 60, 80, 0.20)' },    // Light Pink
    { fill: 'rgba(255, 180, 80, 0.20)', stroke: 'rgba(220, 150, 60, 0.22)' }    // Soft Orange Marigold
  ];

  class Petal {
    constructor() {
      this.reset(true);
    }

    reset(initial = false) {
      this.x = Math.random() * width;
      this.y = initial ? Math.random() * height : -30;
      this.size = Math.random() * 8 + 7;
      this.speedY = Math.random() * 0.5 + 0.35; // very slow, tranquil float
      this.speedX = (Math.random() - 0.5) * 0.4;
      this.rotation = Math.random() * 360;
      this.rotationSpeed = (Math.random() - 0.5) * 0.8;
      this.wobble = Math.random() * Math.PI * 2;
      this.wobbleSpeed = Math.random() * 0.015 + 0.008;
      this.color = petalColors[Math.floor(Math.random() * petalColors.length)];
    }

    update() {
      this.wobble += this.wobbleSpeed;
      this.x += Math.sin(this.wobble) * 0.5 + this.speedX;
      this.y += this.speedY;
      this.rotation += this.rotationSpeed;

      if (this.y > height + 25 || this.x < -20 || this.x > width + 20) {
        this.reset(false);
      }
    }

    draw() {
      ctx.save();
      ctx.translate(this.x, this.y);
      ctx.rotate((this.rotation * Math.PI) / 180);

      ctx.beginPath();
      ctx.moveTo(0, -this.size / 2);
      ctx.bezierCurveTo(this.size * 0.55, -this.size * 0.55, this.size * 0.65, this.size * 0.45, 0, this.size);
      ctx.bezierCurveTo(-this.size * 0.65, this.size * 0.45, -this.size * 0.55, -this.size * 0.55, 0, -this.size / 2);
      ctx.closePath();

      ctx.fillStyle = this.color.fill;
      ctx.fill();
      ctx.strokeStyle = this.color.stroke;
      ctx.lineWidth = 0.4;
      ctx.stroke();

      ctx.restore();
    }
  }

  for (let i = 0; i < petalCount; i++) {
    petals.push(new Petal());
  }

  function animate() {
    ctx.clearRect(0, 0, width, height);
    for (let i = 0; i < petals.length; i++) {
      petals[i].update();
      petals[i].draw();
    }
    requestAnimationFrame(animate);
  }

  animate();
}

/* ==========================================================================
   3. COUNTDOWN TIMER TO NOV 24, 2026
   ========================================================================== */
function initCountdown() {
  const daysEl = document.getElementById('days-val');
  const hoursEl = document.getElementById('hours-val');
  const minsEl = document.getElementById('minutes-val');
  const secsEl = document.getElementById('seconds-val');

  if (!daysEl || !hoursEl || !minsEl || !secsEl) return;

  // First Ceremony: 24 November 2026 at 02:00:00 (2:00 AM IST) - Barat Prasthan
  const targetDate = new Date('2026-11-24T02:00:00').getTime();

  function update() {
    const now = new Date().getTime();
    const distance = targetDate - now;

    if (distance < 0) {
      daysEl.textContent = '00';
      hoursEl.textContent = '00';
      minsEl.textContent = '00';
      secsEl.textContent = '00';
      return;
    }

    const days = Math.floor(distance / (1000 * 60 * 60 * 24));
    const hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    const mins = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
    const secs = Math.floor((distance % (1000 * 60)) / 1000);

    daysEl.textContent = days < 10 ? '0' + days : days;
    hoursEl.textContent = hours < 10 ? '0' + hours : hours;
    minsEl.textContent = mins < 10 ? '0' + mins : mins;
    secsEl.textContent = secs < 10 ? '0' + secs : secs;
  }

  update();
  setInterval(update, 1000);
}

/* ==========================================================================
   4. STACKING / OVERLAPPING "FOLD UP" SCROLL ANIMATION
   As user scrolls, each section stacks stickily and the previous card
   subtly folds up (scales down and recedes with 3D depth)
   ========================================================================== */
function initStackingScroll() {
  const cards = document.querySelectorAll('.stack-section');
  if (!cards.length) return;

  let ticking = false;

  function updateStack() {
    const stickyTop = window.innerWidth < 600 ? 60 : 75;

    cards.forEach((card, index) => {
      const nextCard = cards[index + 1];
      if (!nextCard) {
        card.style.transform = 'none';
        card.style.filter = 'none';
        return;
      }

      const nextRect = nextCard.getBoundingClientRect();
      const distance = nextRect.top - stickyTop;
      const windowH = window.innerHeight;

      if (distance < windowH && distance > 0) {
        // Next card is scrolling up and starting to overlap the current card
        const progress = Math.min(1, Math.max(0, 1 - (distance / (windowH * 0.85))));
        const scale = 1 - (progress * 0.055); // Scales down from 1 to 0.945
        const translateY = -(progress * 18); // Folds up slightly
        const brightness = 1 - (progress * 0.12); // Subtle luxury depth dimming
        
        card.style.transform = `scale(${scale}) translateY(${translateY}px)`;
        card.style.filter = `brightness(${brightness})`;
      } else if (distance <= 0) {
        // Next card has completely overlapped
        card.style.transform = `scale(0.945) translateY(-18px)`;
        card.style.filter = `brightness(0.88)`;
      } else {
        // Next card is still down below
        card.style.transform = 'scale(1) translateY(0px)';
        card.style.filter = 'brightness(1)';
      }
    });

    ticking = false;
  }

  window.addEventListener('scroll', () => {
    if (!ticking) {
      window.requestAnimationFrame(updateStack);
      ticking = true;
    }
  }, { passive: true });

  window.addEventListener('resize', updateStack, { passive: true });
  updateStack();
}

/* ==========================================================================
   5. INDIAN WEDDING AMBIENT MUSIC (WEB AUDIO API SYNTHESIZER)
   ========================================================================== */
function initAudio() {
  const musicBtn = document.getElementById('music-controller');
  if (!musicBtn) return;

  let audioCtx = null;
  let isPlaying = false;
  let masterGain = null;
  let intervalId = null;

  const ragaFrequencies = [
    146.83, // D3
    220.00, // A3
    293.66, // D4
    329.63, // E4
    369.99, // F#4
    440.00, // A4
    493.88, // B4
    587.33, // D5
    659.25  // E5
  ];

  function startDrone() {
    if (!audioCtx) {
      const AudioContext = window.AudioContext || window.webkitAudioContext;
      audioCtx = new AudioContext();
    }

    if (audioCtx.state === 'suspended') {
      audioCtx.resume();
    }

    masterGain = audioCtx.createGain();
    masterGain.gain.setValueAtTime(0.01, audioCtx.currentTime);
    masterGain.gain.exponentialRampToValueAtTime(0.2, audioCtx.currentTime + 2);
    masterGain.connect(audioCtx.destination);

    [146.83, 220.00, 293.66].forEach((freq) => {
      const osc = audioCtx.createOscillator();
      const droneGain = audioCtx.createGain();
      const filter = audioCtx.createBiquadFilter();

      osc.type = 'sawtooth';
      osc.frequency.setValueAtTime(freq, audioCtx.currentTime);

      filter.type = 'lowpass';
      filter.frequency.setValueAtTime(380, audioCtx.currentTime);

      droneGain.gain.setValueAtTime(0.08, audioCtx.currentTime);

      osc.connect(filter);
      filter.connect(droneGain);
      droneGain.connect(masterGain);
      osc.start();
    });

    function playMelodicNote() {
      if (!isPlaying || !audioCtx) return;
      
      const noteFreq = ragaFrequencies[Math.floor(Math.random() * ragaFrequencies.length)];
      const osc = audioCtx.createOscillator();
      const noteGain = audioCtx.createGain();
      const filter = audioCtx.createBiquadFilter();

      osc.type = 'triangle';
      osc.frequency.setValueAtTime(noteFreq, audioCtx.currentTime);

      filter.type = 'bandpass';
      filter.frequency.setValueAtTime(noteFreq, audioCtx.currentTime);
      filter.Q.setValueAtTime(4, audioCtx.currentTime);

      const now = audioCtx.currentTime;
      const duration = 2.4;

      noteGain.gain.setValueAtTime(0.001, now);
      noteGain.gain.linearRampToValueAtTime(0.12, now + 0.4);
      noteGain.gain.exponentialRampToValueAtTime(0.001, now + duration);

      osc.connect(filter);
      filter.connect(noteGain);
      noteGain.connect(masterGain);

      osc.start(now);
      osc.stop(now + duration + 0.1);
    }

    intervalId = setInterval(playMelodicNote, 1400);
  }

  function stopMusic() {
    if (intervalId) clearInterval(intervalId);
    if (masterGain && audioCtx) {
      masterGain.gain.exponentialRampToValueAtTime(0.0001, audioCtx.currentTime + 0.8);
      setTimeout(() => {
        if (audioCtx) audioCtx.suspend();
      }, 900);
    }
  }

  function toggleMusic() {
    isPlaying = !isPlaying;
    if (isPlaying) {
      startDrone();
      musicBtn.classList.add('playing');
    } else {
      stopMusic();
      musicBtn.classList.remove('playing');
    }
  }

  musicBtn.addEventListener('click', toggleMusic);

  window.weddingAudio = {
    toggle: toggleMusic,
    get isPlaying() {
      return isPlaying;
    }
  };
}

/* ==========================================================================
   6. WHATSAPP BLESSINGS & SHARING HELPERS
   ========================================================================== */
window.sendCustomWish = function(eventName) {
  const text = 
`🎉 *बधाई हो हिमांशु एवं श्वेता!* ❤️
आपके और दोनों परिवारों के साथ इस पावन *${eventName}* के उत्सव में सम्मिलित होने के लिए अत्यंत उत्सुक हैं!
आपको दिव्य प्रेम, आनंद और शाश्वत आशीर्वाद से भरे उत्सव की हार्दिक शुभकामनाएं! 🥂✨`;

  const encodedText = encodeURIComponent(text);
  window.open(`https://api.whatsapp.com/send?text=${encodedText}`, '_blank');
};

window.shareInviteLink = function() {
  const shareTitle = "शादी का निमंत्रण | हिमांशु & श्वेता ❤️";
  const shareText = 
`✨ *हिमांशु एवं श्वेता के विवाह समारोह का निमंत्रण* ✨

📅 *तिथियाँ:* 24 एवं 25 नवंबर 2026
🚩 24-नवंबर: बारात प्रस्थान (रात 2:00 बजे), साखरपुड़ा विधि (दोपहर 3:00 बजे)
🎶 24-नवंबर: अंगूठी रस्म एवं संगीत (शाम 7:00 बजे)
☀️ 25-नवंबर: हल्दी रस्म (सुबह 9:00 बजे)
👑 25-नवंबर: स्वागत (शाम 4:00 बजे), बारात (शाम 6:00 बजे), जयमाला (रात 8:00 बजे), हस्त मिलाप (रात 9:30 बजे)

शाही डिजिटल निमंत्रण पत्र देखने के लिए लिंक पर क्लिक करें:
${window.location.href}`;

  if (navigator.share) {
    navigator.share({
      title: shareTitle,
      text: shareText,
      url: window.location.href
    }).catch(() => {
      openWhatsAppShare(shareText);
    });
  } else {
    openWhatsAppShare(shareText);
  }
};

function openWhatsAppShare(text) {
  const url = `https://api.whatsapp.com/send?text=${encodeURIComponent(text)}`;
  window.open(url, '_blank');
}

/* ==========================================================================
   7. ADD TO CALENDAR (.ICS DOWNLOAD)
   ========================================================================== */
window.addToCalendar = function(eventType) {
  let title = 'हिमांशु एवं श्वेता विवाह समारोह';
  let description = 'हिमांशु एवं श्वेता का विवाह समारोह';
  let location = 'श्री रामचंद्र निगम गार्डन, पीथमपुर, धार, मध्य प्रदेश';
  let start = '20261124T020000';
  let end = '20261124T235900';

  if (eventType === 'sangeet') {
    title = 'हिमांशु एवं श्वेता - दिन 1: बारात प्रस्थान, साखरपुड़ा एवं संगीत';
    description = 'बारात प्रस्थान (रात 2:00), साखरपुड़ा विधि (दोपहर 3:00), अंगूठी रस्म एवं संगीत (शाम 7:00)!';
    start = '20261124T020000';
    end = '20261124T235900';
  } else if (eventType === 'haldi') {
    title = 'हिमांशु एवं श्वेता - हल्दी रस्म';
    description = 'शुभ प्रातःकालीन हल्दी, गेंदे के फूलों की बौछार एवं भोज!';
    start = '20261125T090000';
    end = '20261125T130000';
  } else if (eventType === 'shadi') {
    title = 'हिमांशु एवं श्वेता - भव्य शादी (विवाह)';
    description = 'स्वागत एवं सेहरा बंदी (शाम 4:00), भव्य बारात (शाम 6:00), जयमाला (रात 8:00), हस्त मिलाप एवं फेरे (रात 9:30)!';
    start = '20261125T160000';
    end = '20261126T010000';
  }

  const icsData = 
`BEGIN:VCALENDAR
VERSION:2.0
PRODID:-//Himanshu Shweta Wedding Invitation//EN
CALSCALE:GREGORIAN
METHOD:PUBLISH
BEGIN:VEVENT
SUMMARY:${title}
DESCRIPTION:${description}
LOCATION:${location}
DTSTART:${start}
DTEND:${end}
STATUS:CONFIRMED
SEQUENCE:0
END:VEVENT
END:VCALENDAR`;

  const blob = new Blob([icsData], { type: 'text/calendar;charset=utf-8' });
  const link = document.createElement('a');
  link.href = window.URL.createObjectURL(blob);
  link.setAttribute('download', `${eventType || 'wedding'}_himanshu_shweta.ics`);
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
};
