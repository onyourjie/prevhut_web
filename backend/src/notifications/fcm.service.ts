import { Injectable, Logger, OnModuleInit } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { initializeApp, getApps, cert, type App } from 'firebase-admin/app';
import {
  getMessaging,
  type Messaging,
  type MulticastMessage,
  type Message,
  type SendResponse,
} from 'firebase-admin/messaging';
import * as fs from 'fs';
import * as path from 'path';

export interface SendPushPayload {
  title: string;
  body: string;
  data?: Record<string, string>;
  url?: string;
}

export interface PushResult {
  successCount: number;
  failureCount: number;
  invalidTokens: string[];
}

@Injectable()
export class FcmService implements OnModuleInit {
  private readonly logger = new Logger(FcmService.name);
  private firebaseApp: App | null = null;
  private messaging: Messaging | null = null;
  private initialized = false;

  constructor(private configService: ConfigService) {}

  onModuleInit() {
    this.initializeFirebase();
  }

  private initializeFirebase() {
    const existingApps = getApps();
    if (existingApps.length > 0) {
      this.firebaseApp = existingApps[0];
      this.messaging = getMessaging(this.firebaseApp);
      this.initialized = true;
      return;
    }

    try {
      const configPath =
        this.configService.get<string>('FIREBASE_SERVICE_ACCOUNT_PATH') ||
        './firebase-service-account.json';
      const resolvedPath = path.isAbsolute(configPath)
        ? configPath
        : path.resolve(process.cwd(), configPath);

      if (!fs.existsSync(resolvedPath)) {
        this.logger.warn(
          `[FCM] File service account tidak ditemukan di: ${resolvedPath}. Push Notification dinonaktifkan sementara.`,
        );
        return;
      }

      const fileContent = fs.readFileSync(resolvedPath, 'utf8');
      const serviceAccount = JSON.parse(fileContent);

      this.firebaseApp = initializeApp({
        credential: cert(serviceAccount),
      });

      this.messaging = getMessaging(this.firebaseApp);
      this.initialized = true;
      this.logger.log(
        `[FCM] Firebase Admin SDK berhasil diinisialisasi untuk project: ${serviceAccount.project_id}`,
      );
    } catch (error) {
      this.logger.error('[FCM] Gagal menginisialisasi Firebase Admin SDK:', error);
      this.initialized = false;
    }
  }

  isReady(): boolean {
    return this.initialized && this.messaging !== null;
  }

  /**
   * Mengirim push notification ke daftar FCM registration token (Multicast).
   * Otomatis mengidentifikasi token yang sudah tidak valid/expired.
   */
  async sendMulticast(tokens: string[], payload: SendPushPayload): Promise<PushResult> {
    if (!this.initialized || !this.messaging || !tokens || tokens.length === 0) {
      return { successCount: 0, failureCount: 0, invalidTokens: [] };
    }

    const uniqueTokens = Array.from(new Set(tokens.filter((t) => Boolean(t?.trim()))));
    if (uniqueTokens.length === 0) {
      return { successCount: 0, failureCount: 0, invalidTokens: [] };
    }

    const webUrl = payload.url || '/';

    const message: MulticastMessage = {
      tokens: uniqueTokens,
      notification: {
        title: payload.title,
        body: payload.body,
      },
      data: {
        ...payload.data,
        url: webUrl,
        click_action: webUrl,
      },
      webpush: {
        notification: {
          title: payload.title,
          body: payload.body,
          icon: '/favicon.svg',
          badge: '/favicon.svg',
        },
        fcmOptions: {
          link: webUrl,
        },
      },
    };

    try {
      const response = await this.messaging.sendEachForMulticast(message);
      const invalidTokens: string[] = [];

      response.responses.forEach((resp: SendResponse, idx: number) => {
        if (!resp.success && resp.error) {
          const errorCode = resp.error.code;
          if (
            errorCode === 'messaging/invalid-registration-token' ||
            errorCode === 'messaging/registration-token-not-registered'
          ) {
            invalidTokens.push(uniqueTokens[idx]);
          }
        }
      });

      this.logger.log(
        `[FCM] Push dikirim: ${response.successCount} berhasil, ${response.failureCount} gagal dari total ${uniqueTokens.length} token`,
      );

      return {
        successCount: response.successCount,
        failureCount: response.failureCount,
        invalidTokens,
      };
    } catch (error) {
      this.logger.error('[FCM] Error saat mengirim multicast push notification:', error);
      return {
        successCount: 0,
        failureCount: uniqueTokens.length,
        invalidTokens: [],
      };
    }
  }

  /**
   * Mengirim push notification ke suatu topik (misal: 'warga-sintang', 'peringatan-karbar').
   */
  async sendTopic(topic: string, payload: SendPushPayload): Promise<boolean> {
    if (!this.initialized || !this.messaging) {
      return false;
    }

    const webUrl = payload.url || '/';

    const message: Message = {
      topic,
      notification: {
        title: payload.title,
        body: payload.body,
      },
      data: {
        ...payload.data,
        url: webUrl,
        click_action: webUrl,
      },
      webpush: {
        notification: {
          title: payload.title,
          body: payload.body,
          icon: '/favicon.svg',
        },
        fcmOptions: {
          link: webUrl,
        },
      },
    };

    try {
      const response = await this.messaging.send(message);
      this.logger.log(`[FCM] Broadcast topik '${topic}' terkirim dengan id: ${response}`);
      return true;
    } catch (error) {
      this.logger.error(`[FCM] Gagal mengirim broadcast ke topik '${topic}':`, error);
      return false;
    }
  }
}
