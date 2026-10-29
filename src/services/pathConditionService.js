export const pathConditionService = {
  getPathCondition(address) {
    if (address.toLowerCase().includes("camí")) {
      return "Camí rural: terra compactada, accessible";
    }
    return "Asfaltat i en bon estat";
  }
};
