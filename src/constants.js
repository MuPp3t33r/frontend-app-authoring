import { getConfig } from '@edx/frontend-platform';
export const DATE_FORMAT = 'MM/dd/yyyy';
export const TIME_FORMAT = 'HH:mm';
export const DATE_TIME_FORMAT = 'YYYY-MM-DDTHH:mm:ss\\Z';
export const COMMA_SEPARATED_DATE_FORMAT = 'MMMM D, YYYY';
export const DEFAULT_EMPTY_WYSIWYG_VALUE = '<p>&nbsp;</p>';
export const STATEFUL_BUTTON_STATES = {
  default: 'default',
  pending: 'pending',
  error: 'error',
};

export const USER_ROLES = {
  admin: 'instructor',
  staff: 'staff',
};

export const BADGE_STATES = {
  danger: 'danger',
  secondary: 'secondary',
};

export const NOTIFICATION_MESSAGES = {
  adding: 'Adding',
  saving: 'Saving',
  duplicating: 'Duplicating',
  deleting: 'Deleting',
  copying: 'Copying',
  pasting: 'Pasting',
  discardChanges: 'Discarding changes',
  moving: 'Moving',
  undoMoving: 'Undo moving',
  publishing: 'Publishing',
  hidingFromStudents: 'Hiding from students',
  makingVisibleToStudents: 'Making visible to students',
  empty: '',
};

export const DEFAULT_TIME_STAMP = '00:00';

export const COURSE_CREATOR_STATES = {
  unrequested: 'unrequested',
  pending: 'pending',
  granted: 'granted',
  denied: 'denied',
  disallowedForThisSite: 'disallowed_for_this_site',
};

export const DECODED_ROUTES = {
  COURSE_UNIT: [
    '/container/:blockId/:sequenceId',
    '/container/:blockId',
  ],
};

/**
 * Config override for the max asset upload size
 * uses default value unless an override is configured
 */
const DEFAULT_MAX_UPLOAD_SIZE_MB = 20;
const BYTES_IN_MB = 1024 * 1024;
export const getMaxUploadFileSize = () => {
  const config = getConfig();
  const valueInMb = config.MAX_FILE_UPLOAD_SIZE_IN_MB;
  const parsed = parseInt(valueInMb, 10);
  if (valueInMb && isNaN(parsed)) {
    console.warn('Invalid MAX_FILE_UPLOAD_SIZE_IN_MB, falling back to default.');
  }
  const sizeInMb = (!valueInMb || isNaN(parsed)) ? DEFAULT_MAX_UPLOAD_SIZE_MB : parsed;
  return sizeInMb * BYTES_IN_MB;
};

export const COURSE_BLOCK_NAMES = ({
  chapter: { id: 'chapter', name: 'Section' },
  sequential: { id: 'sequential', name: 'Subsection' },
  vertical: { id: 'vertical', name: 'Unit' },
  libraryContent: { id: 'library_content', name: 'Library content' },
  splitTest: { id: 'split_test', name: 'Split Test' },
  component: { id: 'component', name: 'Component' },
});

export const STUDIO_CLIPBOARD_CHANNEL = 'studio_clipboard_channel';

export const CLIPBOARD_STATUS = {
  loading: 'loading',
  ready: 'ready',
  expired: 'expired',
  error: 'error',
};

export const STRUCTURAL_XBLOCK_TYPES = ['vertical', 'sequential', 'chapter', 'course'];

export const REGEX_RULES = {
  specialCharsRule: /^[a-zA-Z0-9_\-.'*~\s]+$/,
  noSpaceRule: /^\S*$/,
};

/**
 * Feature policy for iframe, allowing access to certain courseware-related media.
 *
 * We must use the wildcard (*) origin for each feature, as courseware content
 * may be embedded in external iframes. Notably, xblock-lti-consumer is a popular
 * block that iframes external course content.

 * This policy was selected in conference with the edX Security Working Group.
 * Changes to it should be vetted by them (security@edx.org).
 */
export const IFRAME_FEATURE_POLICY = (
  'microphone *; camera *; midi *; geolocation *; encrypted-media *; clipboard-write *'
);

export const iframeStateKeys = {
  iframeHeight: 'iframeHeight',
  hasLoaded: 'hasLoaded',
  showError: 'showError',
  windowTopOffset: 'windowTopOffset',
};

export const iframeMessageTypes = {
  modal: 'plugin.modal',
  resize: 'plugin.resize',
  videoFullScreen: 'plugin.videoFullScreen',
  xblockEvent: 'xblock-event',
};
