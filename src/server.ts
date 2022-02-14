import app from "./app";
import * as dotenv from 'dotenv';
dotenv.config()

const PORT = process.env.PORT || 3000;

// Listen for incoming requests
app.listen(PORT, () =>
  console.log(`server listening on PORT ${PORT}`)
);