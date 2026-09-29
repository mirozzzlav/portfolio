import {
  Suspense,
  lazy,
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState
} from "react";
import { ProjectCard } from "src/components/ProjectCard.jsx";
import { ProjectTitleNavigation } from "src/components/ProjectTitleNavigation.jsx";
import { className } from "src/styles/classNames.js";
import { useI18n } from "src/useI18n.js";
import { getSwipeDirection } from "src/utils/swipe.js";

const PreviewDialog = lazy(() =>
  import("src/components/PreviewDialog.jsx").then((module) => ({
    default: module.PreviewDialog
  }))
);

const styles = {
  stage: {
    position: "relative",
    width: "100%",
    minHeight: 0,
    overflow: "hidden",
    touchAction: "pan-y",
    /* This trick is to see outlines of the children buttons */
    left: "calc(var(--space-0) * -1)",
    paddingLeft: "var(--space-0)",
    top: "calc(var(--space-0) * -1)",
    paddingBottom: "var(--space-0)"
  },

  track: {
    display: "flex",
    width: "100%",
    alignItems: "flex-start",
    transition: "transform 280ms ease",
    willChange: "transform",

    "@media (prefers-reduced-motion: reduce)": {
      transition: "none"
    }
  }
};

function isKeyboardNavigationTarget(target) {
  return Boolean(
    target?.closest?.(
      'input, textarea, select, button, a, [role="button"], [role="dialog"]'
    )
  );
}

export function ProjectsPage() {
  const { content } = useI18n();
  const [activeProjectIndex, setActiveProjectIndex] = useState(0);
  const [preview, setPreview] = useState(null);
  const touchStart = useRef(null);
  const projects = content.projects;
  const activeProject = projects[activeProjectIndex];

  const trackStyle = useMemo(
    () => ({ transform: `translateX(-${activeProjectIndex * 100}%)` }),
    [activeProjectIndex]
  );

  function openPreview(images, imageIndex) {
    setPreview({ images, imageIndex });
  }

  const navigateProject = useCallback(
    (direction) => {
      setActiveProjectIndex((currentIndex) =>
        Math.min(Math.max(currentIndex + direction, 0), projects.length - 1)
      );
    },
    [projects.length]
  );

  function navigatePreview(direction) {
    setPreview((currentPreview) => {
      if (!currentPreview) {
        return currentPreview;
      }

      return {
        ...currentPreview,
        imageIndex:
          (currentPreview.imageIndex + direction + currentPreview.images.length) %
          currentPreview.images.length
      };
    });
  }

  function handleTouchStart(event) {
    if (projects.length <= 1 || preview || event.touches.length !== 1) {
      touchStart.current = null;
      return;
    }

    const touch = event.touches[0];
    touchStart.current = {
      x: touch.clientX,
      y: touch.clientY
    };
  }

  function handleTouchEnd(event) {
    if (!touchStart.current || projects.length <= 1 || preview) {
      return;
    }

    const direction = getSwipeDirection(touchStart.current, event.changedTouches[0]);
    touchStart.current = null;

    if (!direction) {
      return;
    }

    event.preventDefault();
    navigateProject(direction);
  }

  useEffect(() => {
    if (projects.length <= 1 || preview) {
      return undefined;
    }

    function handleKeyDown(event) {
      if (
        event.defaultPrevented ||
        event.altKey ||
        event.ctrlKey ||
        event.metaKey ||
        event.shiftKey ||
        isKeyboardNavigationTarget(event.target)
      ) {
        return;
      }

      if (event.key === "ArrowLeft") {
        event.preventDefault();
        navigateProject(-1);
      }

      if (event.key === "ArrowRight") {
        event.preventDefault();
        navigateProject(1);
      }
    }

    document.addEventListener("keydown", handleKeyDown);

    return () => {
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [navigateProject, preview, projects.length]);

  return (
    <>
      <div
        className={className(styles.stage)}
        onTouchStart={handleTouchStart}
        onTouchEnd={handleTouchEnd}
      >
        <ProjectTitleNavigation
          hasNext={activeProjectIndex < projects.length - 1}
          hasPrevious={activeProjectIndex > 0}
          onNext={() => navigateProject(1)}
          onPrevious={() => navigateProject(-1)}
          title={activeProject.title}
        />
        <div className={className(styles.track)} style={trackStyle}>
          {projects.map((project, projectIndex) => (
            <ProjectCard
              isActive={projectIndex === activeProjectIndex}
              key={project.title}
              onPreviewOpen={openPreview}
              project={project}
            />
          ))}
        </div>
      </div>

      {preview ? (
        <Suspense fallback={null}>
          <PreviewDialog
            preview={preview}
            onClose={() => setPreview(null)}
            onNavigate={navigatePreview}
          />
        </Suspense>
      ) : null}
    </>
  );
}
