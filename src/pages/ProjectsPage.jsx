import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import portfolioData from "../../data.json";
import { IconButton } from "../components/IconButton.jsx";
import { PreviewDialog } from "../components/PreviewDialog.jsx";
import { ProjectCard } from "../components/ProjectCard.jsx";
import { className } from "../styles/classNames.js";

const styles = {
  stage: {
    position: "relative",
    width: "100%",
    minHeight: 0,
    overflow: "hidden",
    touchAction: "pan-y"
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
  },

  controls: {
    display: "flex",
    alignItems: "center",
    gap: "var(--space-2)",
    width: "100%",
    marginTop: 0,
    padding: "var(--space-2) var(--space-0) var(--space-0)"
  }
};

const swipeThreshold = 48;
const swipeDirectionRatio = 1.25;

function isKeyboardNavigationTarget(target) {
  return Boolean(
    target?.closest?.(
      'input, textarea, select, button, a, [role="button"], [role="dialog"]'
    )
  );
}

export function ProjectsPage() {
  const [activeProjectIndex, setActiveProjectIndex] = useState(0);
  const [preview, setPreview] = useState(null);
  const touchStart = useRef(null);
  const projects = portfolioData.projects;

  const trackStyle = useMemo(
    () => ({ transform: `translateX(-${activeProjectIndex * 100}%)` }),
    [activeProjectIndex]
  );

  function openPreview(images, imageIndex) {
    setPreview({ images, imageIndex });
  }

  const navigateProject = useCallback(
    (direction) => {
      setActiveProjectIndex(
        (currentIndex) => Math.min(Math.max(currentIndex + direction, 0), projects.length - 1)
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

    const touch = event.changedTouches[0];
    const deltaX = touch.clientX - touchStart.current.x;
    const deltaY = touch.clientY - touchStart.current.y;
    const absX = Math.abs(deltaX);
    const absY = Math.abs(deltaY);
    touchStart.current = null;

    if (absX < swipeThreshold || absX < absY * swipeDirectionRatio) {
      return;
    }

    event.preventDefault();
    navigateProject(deltaX < 0 ? 1 : -1);
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

        {projects.length > 1 ? (
          <div className={className(styles.controls)} aria-label="Výber projektov">
            {projects.map((project, projectIndex) => {
              const isActive = projectIndex === activeProjectIndex;

              return (
                <IconButton
                  isActive={isActive}
                  aria-current={isActive ? "true" : "false"}
                  aria-label={`Zobraziť projekt ${project.title}`}
                  key={project.title}
                  onClick={(event) => {
                    event.currentTarget.blur();
                    setActiveProjectIndex(projectIndex);
                  }}
                  size="sm"
                />
              );
            })}
          </div>
        ) : null}
      </div>

      <PreviewDialog
        preview={preview}
        onClose={() => setPreview(null)}
        onNavigate={navigatePreview}
      />
    </>
  );
}
