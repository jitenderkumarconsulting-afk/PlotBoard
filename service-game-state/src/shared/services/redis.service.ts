import {
  Injectable,
  OnModuleDestroy,
  OnModuleInit,
  Logger,
} from '@nestjs/common';
import IORedis, { Redis, RedisOptions } from 'ioredis';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class RedisService implements OnModuleInit, OnModuleDestroy {
  private readonly logger: Logger;

  private redisSubscriber: Redis;
  private redisPublisher: Redis;

  private readonly subscribers: Map<string, Set<string>> = new Map(); // Store subscribers using a Map

  constructor(
    private readonly configService: ConfigService, // Inject ConfigService to access environment variables
  ) {
    this.logger = new Logger(RedisService.name);
  }

  // Initialize the Redis service
  onModuleInit() {
    const redisOptions: RedisOptions = {
      host: this.configService.get('REDIS_HOST'), // Redis host address
      port: this.configService.get('REDIS_PORT'), // Redis port number
      password: this.configService.get('REDIS_PASSWORD'), // Redis password
      db: parseInt(this.configService.get('REDIS_DB_INDEX')), // Redis database index
      connectTimeout: parseInt(this.configService.get('REDIS_CONNECT_TIMEOUT')), // Connection timeout in milliseconds
      retryStrategy: (times) => Math.min(times * 50, 2000), // Retry strategy for failed connection attempts
      // Add more configuration options according to the ioredis documentation
    };

    this.logger.log(
      `onModuleInit :: Initializing Redis Service with redisOptions - ${JSON.stringify(
        redisOptions,
      )}`,
    );

    this.redisSubscriber = new IORedis(redisOptions);
    this.redisPublisher = new IORedis(redisOptions);

    // Event handler for successful connection to Redis
    this.redisSubscriber.on('connect', () => {
      this.logger.log('Connected to Redis Subscriber');
    });
    this.redisPublisher.on('connect', () => {
      this.logger.log('Connected to Redis Publisher');
    });

    // Event handler for Redis connection errors
    this.redisSubscriber.on('error', (error) => {
      this.logger.error('Error connecting to Redis Subscriber:', error);
    });
    this.redisPublisher.on('error', (error) => {
      this.logger.error('Error connecting to Redis Publisher:', error);
    });

    // Listen for incoming messages on subscribed channels
    this.redisSubscriber.on('message', (channel, message) => {
      this.handleMessage(channel, message);
    });
  }

  // Handle incoming messages on subscribed channels
  private handleMessage(channel: string, message: string) {
    const subscribers = this.subscribers.get(channel);
    if (subscribers) {
      for (const userName of subscribers) {
        this.logger.log(
          `${userName} --> Received message on channel ${channel}: ${message}`,
        );
      }
    }
  }

  // Get the Redis subscriber instance
  getSubscriber(): Redis {
    return this.redisSubscriber;
  }

  // Get the Redis publisher instance
  getPublisher(): Redis {
    return this.redisPublisher;
  }

  // Publish a message to a Redis channel
  async publish(channel: string, message: string): Promise<void> {
    await this.redisPublisher.publish(channel, message);
    this.logger.log(`Published message to channel ${channel}: ${message}`);
  }

  // Subscribe a user to a Redis channel
  async subscribe(userName: string, channel: string): Promise<void> {
    const subscriber = this.getSubscriber();
    await subscriber.subscribe(channel);

    if (!this.subscribers.has(channel)) {
      this.subscribers.set(channel, new Set([userName]));
      this.logger.log(`${userName} subscribed to channel ${channel}`);
    } else {
      const userSet = this.subscribers.get(channel);
      if (userSet && !userSet.has(userName)) {
        userSet.add(userName);
        this.logger.log(`${userName} subscribed to channel ${channel}`);
      }
    }
  }

  // Unsubscribe a user from a Redis channel
  async unsubscribe(userName: string, channel: string): Promise<void> {
    const userSet = this.subscribers.get(channel);

    if (userSet) {
      userSet.delete(userName);
      if (userSet.size === 0) {
        await this.redisSubscriber.unsubscribe(channel);
        this.subscribers.delete(channel);
        this.logger.log(`All users unsubscribed from channel ${channel}`);
      } else {
        this.logger.log(`${userName} unsubscribed from channel ${channel}`);
      }
    }
  }

  // Clean up the Redis service on module destroy
  async onModuleDestroy() {
    this.logger.log('Destroying Redis Service');

    // Unsubscribe from all channels and close the Redis clients
    for (const channel of this.subscribers.keys()) {
      await this.redisSubscriber.unsubscribe(channel);
    }

    this.redisSubscriber.quit();
    this.redisPublisher.quit();
  }

  // /**
  //  * Set a key-value pair in Redis.
  //  * @param key The Redis key.
  //  * @param value The value to set for the key.
  //  */
  // async setKey(key: string, value: string): Promise<void> {
  //   this.logger.log(`setKey :: key - ${key}`);

  //   await this.client.set(key, value);
  // }

  // /**
  //  * Get the value for a specific key from Redis.
  //  * @param key The Redis key to retrieve the value for.
  //  * @returns The value associated with the key, or null if the key does not exist.
  //  */
  // async getKey(key: string): Promise<string | null> {
  //   this.logger.log(`getKey :: key - ${key}`);

  //   return this.client.get(key);
  // }

  // /**
  //  * Delete a key from Redis.
  //  * @param key The Redis key to delete.
  //  * @returns The number of keys deleted (0 or 1).
  //  */
  // async deleteKey(key: string): Promise<number> {
  //   this.logger.log(`deleteKey :: key - ${key}`);

  //   return this.client.del(key);
  // }

  // /**
  //  * Get all keys matching a given pattern in Redis.
  //  * @param pattern The pattern to match keys against (e.g., 'prefix:*').
  //  * @returns An array of keys matching the pattern.
  //  */
  // async getKeys(pattern: string): Promise<string[]> {
  //   this.logger.log(`getKeys :: pattern - ${pattern}`);

  //   return this.client.keys(pattern);
  // }

  // /**
  //  * Publish a message to a specific channel in Redis.
  //  * @param channel The channel to publish the message to.
  //  * @param message The message to publish.
  //  * @returns The number of subscribers that received the message.
  //  */
  // async publishMessage(channel: string, message: string): Promise<number> {
  //   this.logger.log(`publishMessage :: channel - ${channel}`);

  //   return this.client.publish(channel, message);
  // }

  // /**
  //  * Subscribe to a Redis channel and receive messages published to it.
  //  * @param channel The channel to subscribe to.
  //  */
  // async subscribeToChannel(channel: string): Promise<void> {
  //   this.logger.log(`subscribeToChannel :: channel - ${channel}`);

  //   await this.client.subscribe(channel);

  //   this.client.on('message', (subscribedChannel, receivedMessage) => {
  //     this.logger.log(
  //       `Received message on channel ${subscribedChannel}: ${receivedMessage}`,
  //     );
  //   });
  // }

  // /**
  //  * Unsubscribe from a Redis channel.
  //  * @param channel The channel to unsubscribe from.
  //  */
  // async unsubscribeFromChannel(channel: string): Promise<void> {
  //   this.logger.log(`unsubscribeFromChannel :: channel - ${channel}`);

  //   await this.client.unsubscribe(channel);
  // }

  // /**
  //  * Set an expiration time (in seconds) for a key.
  //  * @param key The Redis key.
  //  * @param seconds The number of seconds until the key expires.
  //  * @returns The number of seconds until the key's expiration.
  //  */
  // async expireKey(key: string, seconds: number): Promise<number> {
  //   this.logger.log(`expireKey :: key - ${key}`);

  //   return this.client.expire(key, seconds);
  // }

  // /**
  //  * Get the remaining time to live (in seconds) for a key.
  //  * @param key The Redis key.
  //  * @returns The number of seconds until the key's expiration, or -2 if the key does not exist,
  //  * or -1 if the key exists but has no associated expiration.
  //  */
  // async ttlKey(key: string): Promise<number> {
  //   this.logger.log(`ttlKey :: key - ${key}`);

  //   return this.client.ttl(key);
  // }

  // /**
  //  * Set a field-value pair in a Redis hash.
  //  * @param key The Redis key representing the hash.
  //  * @param field The field name.
  //  * @param value The value to set for the field.
  //  */
  // async setHashField(key: string, field: string, value: string): Promise<void> {
  //   this.logger.log(`setHashField :: key - ${key}`);

  //   await this.client.hset(key, field, value);
  // }

  // /**
  //  * Get the value of a field in a Redis hash.
  //  * @param key The Redis key representing the hash.
  //  * @param field The field name to retrieve the value for.
  //  * @returns The value of the field, or null if the field or hash does not exist.
  //  */
  // async getHashField(key: string, field: string): Promise<string | null> {
  //   this.logger.log(`getHashField :: key - ${key}`);

  //   return this.client.hget(key, field);
  // }

  // /**
  //  * Delete a field from a Redis hash.
  //  * @param key The Redis key representing the hash.
  //  * @param field The field to delete.
  //  * @returns The number of fields deleted (0 or 1).
  //  */
  // async deleteHashField(key: string, field: string): Promise<number> {
  //   this.logger.log(`deleteHashField :: key - ${key}`);

  //   return this.client.hdel(key, field);
  // }

  // /**
  //  * Get all field names from a Redis hash.
  //  * @param key The Redis key representing the hash.
  //  * @returns An array of field names in the hash.
  //  */
  // async getHashKeys(key: string): Promise<string[]> {
  //   this.logger.log(`getHashKeys :: key - ${key}`);

  //   return this.client.hkeys(key);
  // }

  // /**
  //  * Get all values from a Redis hash.
  //  * @param key The Redis key representing the hash.
  //  * @returns An array of values in the hash.
  //  */
  // async getHashValues(key: string): Promise<string[]> {
  //   this.logger.log(`getHashValues :: key - ${key}`);

  //   return this.client.hvals(key);
  // }

  // /**
  //  * Get all field-value pairs from a Redis hash.
  //  * @param key The Redis key representing the hash.
  //  * @returns An object containing all field-value pairs in the hash.
  //  */
  // async getAllHashFields(key: string): Promise<Record<string, string>> {
  //   this.logger.log(`getAllHashFields :: key - ${key}`);

  //   return this.client.hgetall(key);
  // }
}
