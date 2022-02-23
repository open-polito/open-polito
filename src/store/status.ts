/**
 * @file Functions and types for async thunk status management, and for minimizing Redux boilerplate
 */

import { SerializedError } from '@reduxjs/toolkit';

/**
 * Status codes to be used in store thunks.
 * Storing whole strings for status codes is useless.
 */
export const STATUS = {
  IDLE: 0, // Action not called yet.
  PENDING: 1, // Action pending
  SUCCESS: 2, // Action completed
  ERROR: 3, // Action returned error
};

export type StatusCode =
  | typeof STATUS.IDLE
  | typeof STATUS.PENDING
  | typeof STATUS.SUCCESS
  | typeof STATUS.ERROR;

/**
 * Status to use in store.
 */
export type Status = {
  code: StatusCode;
  lastUpdated: number; // For rate limiter. UNIX millis, otherwise 0 when never fetched or if rate limiter not needed
  error: SerializedError | null; // Error returned by async thunk. null when initialized

  // From @reduxjs/toolkit:
  // interface SerializedError {
  //   name?: string
  //   message?: string
  //   code?: string
  //   stack?: string
  // }
};

/**
 * Initial status to use in store
 */
export const initialStatus: Status = {
  code: STATUS.IDLE,
  lastUpdated: 0,
  error: null,
};

/**
 * Success status
 * @returns success status
 */
export const successStatus = (): Status => {
  return {
    code: STATUS.SUCCESS,
    lastUpdated: Date.now(),
    error: null,
  };
};

/**
 * Pending status
 * @returns pending status
 */
export const pendingStatus = (): Status => {
  return {
    code: STATUS.PENDING,
    lastUpdated: Date.now(),
    error: null,
  };
};

/**
 * Error status
 * @param error SerializedError generated by async thunk
 * @returns error status
 */
export const errorStatus = (error: SerializedError): Status => {
  return {
    code: STATUS.ERROR,
    lastUpdated: Date.now(),
    error: { ...error, stack: '' }, // Don't record stack for now
  };
};

/**
 * Auth status codes. These determine app routing.
 *
 * @remarks
 * PENDING:   Still authenticating. Show Splash screen.
 * VALID:     Access granted. Show {@link AppStack}.
 * NOT_VALID: Access denied. Show Login screen.
 * OFFLINE:   Can't connect. Act accordingly.
 */
export const AUTH_STATUS = {
  PENDING: 0,
  VALID: 1,
  NOT_VALID: 2,
  OFFLINE: 3,
};

/**
 * Auth status type
 */
export type AuthStatus =
  | typeof AUTH_STATUS.PENDING
  | typeof AUTH_STATUS.VALID
  | typeof AUTH_STATUS.NOT_VALID
  | typeof AUTH_STATUS.OFFLINE;