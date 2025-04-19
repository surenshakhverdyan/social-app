import { Injectable, Logger } from '@nestjs/common';
import { readdir, readFile } from 'fs/promises';
import { join } from 'path';

import { DatabaseService } from './database.service';

@Injectable()
export class MigrationService {
  private readonly logger = new Logger(MigrationService.name);
  private readonly migrationsPath = join(__dirname, 'migrations');

  constructor(private readonly databaseService: DatabaseService) {}

  async runMigrations(): Promise<void> {
    try {
      await this.createMigrationsTable();
      const migrations = await this.getPendingMigrations();

      for (const migration of migrations) {
        await this.runMigration(migration);
      }

      this.logger.log('All migrations completed successfully');
    } catch (error) {
      this.logger.error('Failed to run migrations', error);
      throw error;
    }
  }

  private async createMigrationsTable(): Promise<void> {
    const query = `
      CREATE TABLE IF NOT EXISTS migrations (
        id SERIAL PRIMARY KEY,
        name VARCHAR(255) NOT NULL UNIQUE,
        executed_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
      );
    `;
    await this.databaseService.query(query);
  }

  private async getPendingMigrations(): Promise<string[]> {
    const files = await readdir(this.migrationsPath);
    const sqlFiles = files.filter((file) => file.endsWith('.sql')).sort();

    const { rows } = await this.databaseService.query<{ name: string }>(
      'SELECT name FROM migrations',
    );
    const executedMigrations = new Set(rows.map((row) => row.name));

    return sqlFiles.filter((file) => !executedMigrations.has(file));
  }

  private async runMigration(migrationFile: string): Promise<void> {
    const filePath = join(this.migrationsPath, migrationFile);
    const content = await readFile(filePath, 'utf-8');

    try {
      await this.databaseService.query('BEGIN');
      await this.databaseService.query(content);
      await this.databaseService.query(
        'INSERT INTO migrations (name) VALUES ($1)',
        [migrationFile],
      );
      await this.databaseService.query('COMMIT');

      this.logger.log(`Migration ${migrationFile} completed successfully`);
    } catch (error) {
      await this.databaseService.query('ROLLBACK');
      this.logger.error(`Failed to run migration ${migrationFile}`, error);
      throw error;
    }
  }
}
