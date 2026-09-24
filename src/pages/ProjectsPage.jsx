import { useMemo, useState } from "react";
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
    overflow: "hidden"
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
    padding: "var(--space-4) var(--space-0) 0"
  }
};

export function ProjectsPage() {
  const [activeProjectIndex, setActiveProjectIndex] = useState(0);
  const [preview, setPreview] = useState(null);
  const projects = portfolioData.projects;

  const trackStyle = useMemo(
    () => ({ transform: `translateX(-${activeProjectIndex * 100}%)` }),
    [activeProjectIndex]
  );

  function openPreview(images, imageIndex) {
    setPreview({ images, imageIndex });
  }

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

  return (
    <>
      <div className={className(styles.stage)}>
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
