// 📁 src/utils/loadScript.js

export default function loadScript(src) {
  return new Promise((resolve, reject) => {
    const script = document.createElement("script");
    script.src = src;
    script.onload = () => resolve(true);
    script.onerror = () => reject(new Error("Script load failed"));
    document.body.appendChild(script);
  });
}
