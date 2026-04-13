import app from "./app";

const PORT = 5120;

const server = app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
