/*
 *
 * CreateFeedbackContainer actions
 *
 */

import {
  SUBMIT_FEEDBACK
} from './constants';

export function submitFeedback(title, comments) {
  return {
    type: SUBMIT_FEEDBACK,
    title,
    comments
  };
}
