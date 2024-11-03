import 'express-session';
import { Auth, DocumentStorage, RawCV, Service, StatsData } from '.';
import { SuperUser } from '../class/SuperUser';

declare module "express-session" {
  

  interface SessionData {
    Persisted?: boolean;
    NoAPIsData?: boolean;
    Cookies?: Record<string, unknown>;
    Token?: string;
    ServerKeys?: {
      secretKey: Buffer;
      iv: Buffer;
    };
    Theme?: {
      time: 'Morning' | 'Midday' | 'Evening' | 'Night';
      sun_1: ' #FFD700';
      sun_2: ' #FFA500';
      sun_3: ' #FF8C00';
      sun_4: ' #FF6347';
      sun_5: '#FFA500';
      moon_1: '#8B4513';
      moon_2: '#7B68EE';
      morning_bg_from: 'from-blue-300';
      morning_bg_to: 'to-lime-500';
      evening_bg_from: 'from-blue-300';
      evening_bg_to: 'to-lime-500';
      night_bg_from: 'from-blue-300';
      nigh_bg_from: 'to-lime-500';
      footer: string;
    };
    Poster?: {
      title: string;
      metaData: string;
      section: {
        index: number;
        title: string;
        content: string;
        file?: { url: string; description: string }[];
      }[];
    };
    Stats?: StatsData;
    Services?: Service;
    Auth?: Auth;
    SuperUser?: SuperUser;
    Storage?: DocumentStorage;
    CVData?: RawCV;
    RedirectUrl?: string;
  }

}
