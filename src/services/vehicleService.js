export const vehicleService = {
  findBestVehicle(options) {
    return {
      name: "Joan Riera",
      vehicle: "Citroën Berlingo Adaptada",
      plate: "5482-KDL",
      assisted: options.vehicleType === "assisted",
      adapted: options.vehicleType === "adapted",
      eta: 7
    };
  }
};
