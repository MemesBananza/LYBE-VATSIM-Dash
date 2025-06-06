function fs() {
  if (!document.fullscreenElement) {
    document.documentElement.requestFullscreen();
  } else {
    document.exitFullscreen?.();
  }
}

document.addEventListener("keydown", (e) => {
  if (e.key === "Enter") {
    fs();
    console.log("enter");
  }
});

