function updateClocks() {
  // Options for formatting the time
  const options = {
    year: 'numeric',
    month: 'numeric',
    day: 'numeric',
    hour: 'numeric',
    minute: 'numeric',
    second: 'numeric',
    hourCycle: 'h23',
  };

  // Formatters for UTC and Europe/Belgrade time zones
  const utcFormatter = new Intl.DateTimeFormat('en-US', { ...options, timeZone: 'UTC' });
  const belgradeFormatter = new Intl.DateTimeFormat('en-US', { ...options, timeZone: 'Europe/Belgrade' });

  // Get the current time in both time zones
  const utcTime = utcFormatter.format(new Date());
  const belgradeTime = belgradeFormatter.format(new Date());

  // Update the DOM elements with the current time
  document.getElementById('utc-time').textContent = `${utcTime}`;
  document.getElementById('belgrade-time').textContent = `${belgradeTime}`;
}

// Call updateClocks every second to keep the time updated
setInterval(updateClocks, 1000);

// Initial call to display the time immediately
updateClocks();