import { app } from "./server";

const port = process.env.HTTP_PORT || 8080;

app.listen(port, () => {
  console.log(`Listening on port ${port}...`);
});