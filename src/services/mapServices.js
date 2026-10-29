export const mapService = {
  getMapUrl(lat, lng) {
    return `https://maps.google.com/maps?q=${lat},${lng}&output=embed`;
  },

  simulateMovement(cb) {
    let km = 5;
    const interval = setInterval(() => {
      km -= 0.3;
      if (km <= 0) {
        clearInterval(interval);
        cb(0);
      } else {
        cb(km);
      }
    }, 1500);
  }
}
