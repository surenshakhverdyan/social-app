import { Module, OnModuleInit } from '@nestjs/common';
import { DatabaseService } from './database.service';
import { MigrationService } from './migration.service';

@Module({
  providers: [DatabaseService, MigrationService],
  exports: [DatabaseService],
})
export class DatabaseModule implements OnModuleInit {
  constructor(private readonly migrationService: MigrationService) {}

  async onModuleInit() {
    await this.migrationService.runMigrations();
  }
}
