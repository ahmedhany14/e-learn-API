import { Injectable, OnApplicationBootstrap } from '@nestjs/common';
import { DataSource } from 'typeorm';
import dataSource from '../common/config/typeORM.conf';

@Injectable()
export class MigrationService implements OnApplicationBootstrap {
  constructor() {}

  async onApplicationBootstrap() {
    try {
      // Run migrations
      const dataSourceInstance = new DataSource(dataSource.options);

      await dataSourceInstance.initialize();
      console.log('Data Source Initialized');

      await dataSourceInstance.runMigrations();
      console.log('Migrations executed successfully.');
    } catch (error) {
      console.error('Error running migrations:', error);
    }
  }
}
