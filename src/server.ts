import app from './app';
import config from './app/config';
import mongoose from 'mongoose';

// const mongoose = require("mongoose");

async function main() {
  try {
    await mongoose.connect(config.db_url as string);

    app.listen(config.port, () => {
      console.log(`app is listening on port ${config.port}`);
    });
  } catch (err) {
    console.log(err);
  }
}

main();
