/**
 * MSW Browser setup
 * Initializes Mock Service Worker for browser environment
 */

import { setupWorker } from 'msw/browser';
import { handlers } from './handlers';

export const worker = setupWorker(...handlers);
