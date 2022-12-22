const imageInput = document.getElementById('image-input');
const canvas = document.getElementById('canvas');
const ctx = canvas.getContext('2d');

const ASCII_CHARS = ['@', '#', '%', '=', '+', '*', ':', '-', '.', ' '];
const ASCII_SIZE = 10;
const ASCII_COLORS = {
  '@': '#000000',
  '#': '#555555',
  '%': '#AAAAAA',
  '=': '#FFFFFF',
  '+': '#FF0000',
  '*': '#00FF00',
  ':': '#0000FF',
  '-': '#FFFF00',
  '.': '#00FFFF',
  ' ': '#FF00FF',
};

imageInput.addEventListener('change', () => {
    const reader = new FileReader();
    reader.onload = (event) => {
        const image = new Image();
        image.onload = () => {
            canvas.width = image.width;
            canvas.height = image.height;
            ctx.drawImage(image, 0, 0);
        };
        image.src = event.target.result;
    };
    reader.readAsDataURL(imageInput.files[0]);
});
const convertButton = document.getElementById('convert-button');
const asciiOutput = document.getElementById('ascii-output');

convertButton.addEventListener('click', () => {
    const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
    const pixels = imageData.data;
    let ascii = '';
    let counter = 0;
    for (let i = 0; i < pixels.length; i += 4) {
        const r = pixels[i];
        const g = pixels[i + 1];
        const b = pixels[i + 2];
        const a = pixels[i + 3];
        const gray = (r + g + b) / 3;
        const char = ASCII_CHARS[Math.round((gray / 255) * (ASCII_CHARS.length - 1))];
        ascii += char;
        counter += 1;
        if (counter === canvas.width) {
            ascii += '\n';
            counter = 0;
        }
    }
    asciiOutput.value = ascii;
});

const copyButton = document.getElementById('copy-button');

copyButton.addEventListener('click', () => {
  asciiOutput.select();
  document.execCommand('copy');
});

const convertAsciiButton = document.getElementById('convert-ascii-button');
const asciiCanvas = document.getElementById('ascii-canvas');
const asciiCtx = asciiCanvas.getContext('2d');

convertAsciiButton.addEventListener('click', () => {
  const ascii = asciiOutput.value;
  const lines = ascii.split('\n');
  asciiCanvas.width = lines[0].length * ASCII_SIZE;
  asciiCanvas.height = lines.length * ASCII_SIZE;
  asciiCtx.font = `${ASCII_SIZE}px monospace`;
  for (let y = 0; y < lines.length; y += 1) {
    for (let x = 0; x < lines[y].length; x += 1) {
      const char = lines[y][x];
      asciiCtx.fillStyle = ASCII_COLORS[char] || 'black';
      asciiCtx.fillText(char, x * ASCII_SIZE, (y + 1) * ASCII_SIZE);
    }
  }
});