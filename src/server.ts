/* eslint-disable no-console */
import app from './app';
import config from './app/config';
import mongoose from 'mongoose';
import { Server } from 'http';
import seedSuperAdmin from './app/DB';

// const mongoose = require("mongoose");

let server: Server;

async function main() {
  try {
    await mongoose.connect(config.db_url as string);

    // seed super admin
    seedSuperAdmin();

    server = app.listen(config.port, () => {
      console.log(`app is listening on port ${config.port}`);
    });
  } catch (err) {
    console.log(err);
  }
}

main();

process.on('unhandledRejection', () => {
  console.log('unhandledRejection is detected. Server is shutting down...');
  if (server) {
    server.close(() => {
      process.exit(1);
    });
  }
  process.exit(1);
});

process.on('uncaughtException', () => {
  console.log('uncaughtException occurred. Server is shutting down...');
  process.exit(1);
});

/**
 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
 */
