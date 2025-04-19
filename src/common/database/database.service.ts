import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Pool, QueryResult, QueryResultRow } from 'pg';

@Injectable()
export class DatabaseService {
  private pool: Pool;
  private readonly logger = new Logger(DatabaseService.name);

  constructor(private readonly configService: ConfigService) {
    this.pool = new Pool({
      host: this.configService.get<string>('DB_HOST'),
      port: this.configService.get<number>('DB_PORT'),
      user: this.configService.get<string>('DB_USER'),
      password: this.configService.get<string>('DB_PASS'),
      database: this.configService.get<string>('DB_NAME'),
    });

    this.pool.on('error', (err) => {
      this.logger.error('Unexpected error on idle client', err);
    });
  }

  async query<T extends QueryResultRow>(
    query: string,
    params?: any[],
  ): Promise<QueryResult<T>> {
    try {
      return await this.pool.query<T>(query, params);
    } catch (error) {
      this.logger.error(`Failed to execute query: ${query}`, error);
      throw error;
    }
  }

  async end(): Promise<void> {
    await this.pool.end();
  }
}
