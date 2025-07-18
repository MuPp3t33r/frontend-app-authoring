import { useCallback, useContext, useMemo } from 'react';
import { useIntl } from '@edx/frontend-platform/i18n';
import { Icon } from '@openedx/paragon';
import { Error, Warning, School } from '@openedx/paragon/icons';

import DeleteModal from '../../generic/delete-modal/DeleteModal';
import { useSidebarContext } from '../common/context/SidebarContext';
import { ToastContext } from '../../generic/toast-context';
import { useContentFromSearchIndex, useDeleteContainer, useRestoreContainer } from '../data/apiHooks';
import messages from './messages';
import { ContainerType } from '../../generic/key-utils';
import { ContainerHit } from '../../search-manager';
import { useContainerEntityLinks } from '../../course-libraries/data/apiHooks';
import { LoadingSpinner } from '../../generic/Loading';

type ContainerDeleterProps = {
  isOpen: boolean,
  close: () => void,
  containerId: string,
};

const ContainerDeleter = ({
  isOpen,
  close,
  containerId,
}: ContainerDeleterProps) => {
  const intl = useIntl();
  const {
    sidebarItemInfo,
    closeLibrarySidebar,
  } = useSidebarContext();
  const deleteContainerMutation = useDeleteContainer(containerId);
  const restoreContainerMutation = useRestoreContainer(containerId);
  const { showToast } = useContext(ToastContext);
  const { hits, isLoading } = useContentFromSearchIndex([containerId]);
  const containerData = (hits as ContainerHit[])?.[0];
  const {
    data: dataDownstreamLinks,
    isLoading: linksIsLoading,
  } = useContainerEntityLinks({ upstreamContainerKey: containerId });
  const downstreamCount = dataDownstreamLinks?.length ?? 0;

  const messageMap = useMemo(() => {
    const containerType = containerData?.blockType;
    let parentCount = 0;
    let parentMessage: React.ReactNode;
    switch (containerType) {
      case ContainerType.Section:
        return {
          title: intl.formatMessage(messages.deleteSectionWarningTitle),
          parentMessage: '',
          courseCount: downstreamCount,
          courseMessage: messages.deleteSectionCourseMessaage,
          deleteSuccess: intl.formatMessage(messages.deleteSectionSuccess),
          deleteError: intl.formatMessage(messages.deleteSectionFailed),
          undoDeleteError: messages.undoDeleteSectionToastFailed,
        };
      case ContainerType.Subsection:
        parentCount = containerData?.sections?.displayName?.length || 0;
        if (parentCount === 1) {
          parentMessage = intl.formatMessage(
            messages.deleteSubsectionParentMessage,
            { parentName: <b>{containerData?.sections?.displayName?.[0]}</b> },
          );
        } else if (parentCount > 1) {
          parentMessage = intl.formatMessage(messages.deleteSubsectionMultipleParentMessage, {
            parentCount: <b>{parentCount}</b>,
          });
        }
        return {
          title: intl.formatMessage(messages.deleteSubsectionWarningTitle),
          parentMessage,
          courseCount: downstreamCount,
          courseMessage: messages.deleteSubsectionCourseMessaage,
          deleteSuccess: intl.formatMessage(messages.deleteSubsectionSuccess),
          deleteError: intl.formatMessage(messages.deleteSubsectionFailed),
          undoDeleteError: messages.undoDeleteSubsectionToastFailed,
        };
      default:
        parentCount = containerData?.subsections?.displayName?.length || 0;
        if (parentCount === 1) {
          parentMessage = intl.formatMessage(
            messages.deleteUnitParentMessage,
            { parentName: <b>{containerData?.subsections?.displayName?.[0]}</b> },
          );
        } else if (parentCount > 1) {
          parentMessage = intl.formatMessage(messages.deleteUnitMultipleParentMessage, {
            parentCount: <b>{parentCount}</b>,
          });
        }
        return {
          title: intl.formatMessage(messages.deleteUnitWarningTitle),
          parentMessage,
          courseCount: downstreamCount,
          courseMessage: messages.deleteUnitCourseMessage,
          deleteSuccess: intl.formatMessage(messages.deleteUnitSuccess),
          deleteError: intl.formatMessage(messages.deleteUnitFailed),
          undoDeleteError: messages.undoDeleteUnitToastFailed,
        };
    }
  }, [containerData, downstreamCount, messages, intl]);

  const deleteText = intl.formatMessage(messages.deleteUnitConfirm, {
    unitName: <b>{containerData?.displayName}</b>,
    message: (
      <div className="text-danger-900">
        {messageMap.parentMessage && (
          <div className="d-flex align-items-center mt-2">
            <Icon className="mr-2" src={Error} />
            <span>{messageMap.parentMessage}</span>
          </div>
        )}
        {(messageMap.courseCount || 0) > 0 && (
          <div className="d-flex align-items-center mt-2">
            <Icon className="mr-2" src={School} />
            <span>
              {intl.formatMessage(messageMap.courseMessage, {
                courseCount: messageMap.courseCount,
                courseCountText: <b>{messageMap.courseCount}</b>,
              })}
            </span>
          </div>
        )}
      </div>
    ),
  });

  const restoreComponent = useCallback(async () => {
    try {
      await restoreContainerMutation.mutateAsync();
      showToast(intl.formatMessage(messages.undoDeleteContainerToastMessage));
    } catch (e) {
      showToast(intl.formatMessage(messageMap.undoDeleteError));
    }
  }, [messageMap]);

  const onDelete = useCallback(async () => {
    await deleteContainerMutation.mutateAsync().then(() => {
      if (sidebarItemInfo?.id === containerId) {
        closeLibrarySidebar();
      }
      showToast(
        messageMap.deleteSuccess,
        {
          label: intl.formatMessage(messages.undoDeleteContainerToastAction),
          onClick: restoreComponent,
        },
      );
    }).catch(() => {
      showToast(messageMap.deleteError);
    }).finally(() => {
      close();
    });
  }, [sidebarItemInfo, showToast, deleteContainerMutation, messageMap]);

  return (
    <DeleteModal
      isOpen={isOpen}
      close={close}
      variant="warning"
      title={messageMap?.title}
      icon={Warning}
      description={isLoading || linksIsLoading ? <LoadingSpinner size="sm" /> : deleteText}
      onDeleteSubmit={onDelete}
    />
  );
};

export default ContainerDeleter;
