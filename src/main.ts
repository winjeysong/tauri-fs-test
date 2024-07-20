import { save } from "@tauri-apps/plugin-dialog";
import { writeFile } from "@tauri-apps/plugin-fs";
import { join, pictureDir } from '@tauri-apps/api/path';

function paint() {
  const canvas = document.createElement('canvas');
  canvas.width = 400;
  canvas.height = 400;
  const ctx = canvas.getContext('2d');
  ctx!.fillStyle = 'white';
  ctx!.fillRect(0, 0, 400, 400);
  ctx!.fillStyle = 'black';
  ctx!.fillText('Tauri Tauri.', 100, 100);

  return canvas;
}

window.addEventListener("DOMContentLoaded", () => {
  const canvas = paint();
  const btn = document.querySelector('#btn') as HTMLButtonElement;
  const msg = document.querySelector('#msg') as HTMLPreElement;
  btn.onclick = async () => {
    const filename = `image_${Date.now()}`;
    const downloaddir = await pictureDir();
    const savePath = await join(downloaddir, filename);
    const path = await save({
      defaultPath: savePath,
      filters: [{ name: filename, extensions: ['jpg', 'jpeg'] }],
    });
    path && canvas.toBlob(async blob => {
      if (blob) {
        try {
          const buf = await blob.arrayBuffer();
          await writeFile(path, new Uint8Array(buf));
          msg.style.color = 'cyan';
          msg.textContent = `save successfully to ${path}`;
        } catch(e) {
          msg.style.color = 'red';
          msg.textContent = 'Error: ' + String(e);
        }
      }
    }, 'image/jpeg', 0.5)
  }
});
