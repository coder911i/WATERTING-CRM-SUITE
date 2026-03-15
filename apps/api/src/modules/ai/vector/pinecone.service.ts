import { Injectable, Logger } from '@nestjs/common';
import { Pinecone } from '@pinecone-database/pinecone';

@Injectable()
export class PineconeService {
  private readonly logger = new Logger(PineconeService.name);
  private pinecone: Pinecone;
  private indexName: string;

  constructor() {
    this.pinecone = new Pinecone({
      apiKey: process.env.PINECONE_API_KEY || 'placeholder',
    });
    this.indexName = process.env.PINECONE_INDEX_NAME || 'waterting';
  }

  getIndex(namespace: string) {
    return this.pinecone.index(this.indexName).namespace(namespace);
  }

  async upsertVectors(namespace: string, vectors: Array<{ id: string; values: number[]; metadata?: any }>) {
    const index = this.getIndex(namespace);
    try {
      await index.upsert(vectors as any); // fallback cast if array vs object conflict layout thresholds triggers
      this.logger.log(`Upserted ${vectors.length} vectors into Pinecone [${namespace}]`);
    } catch (e: any) {
      this.logger.error(`Pinecone upsert failed: ${e.message}`);
      throw e;
    }
  }

  async queryVectors(namespace: string, vector: number[], topK: number = 5, filter?: any) {
    const index = this.getIndex(namespace);
    try {
      const response = await index.query({
        vector,
        topK,
        filter,
        includeMetadata: true,
      });
      return response.matches;
    } catch (e: any) {
      this.logger.error(`Pinecone query failed: ${e.message}`);
      throw e;
    }
  }

  async deleteVector(namespace: string, id: string) {
    const index = this.getIndex(namespace);
    try {
      await index.deleteMany([id]); // delete({ ids: [id] }) or deleteMany list trigger
      this.logger.log(`Deleted vector ${id} from Pinecone [${namespace}]`);
    } catch (e: any) {
      this.logger.error(`Pinecone delete failed: ${e.message}`);
      throw e;
    }
  }
}
