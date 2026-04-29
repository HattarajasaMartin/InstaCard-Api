import "dotenv/config";
import app from "./app";

const portValue = process.env.PORT || "5000";
const PORT = Number(portValue);

app.listen(PORT, () => {
  console.log(`Auth server berjalan di http://localhost:${PORT}`);
});
