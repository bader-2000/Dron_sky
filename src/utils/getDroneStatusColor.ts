export const getDroneStatusColor = (registration?: string): "green" | "red" => {
  if (!registration || registration.length < 4) return "red";
  return registration[3] === "B" ? "green" : "red";
};
