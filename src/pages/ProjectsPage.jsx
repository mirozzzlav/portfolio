import { Suspense, lazy, useMemo, useState } from "react";
import { ProjectCard } from "src/components/ProjectCard.jsx";
import { ProjectTitleNavigation } from "src/components/ProjectTitleNavigation.jsx";
import { useProjectNavigation } from "src/hooks/useProjectNavigation.js";
import { className } from "src/styles/classNames.js";
import { useI18n } from "src/useI18n.js";

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

export function ProjectsPage() {
  const { content } = useI18n();
  const [preview, setPreview] = useState(null);
  const projects = content.projects;
  const { activeProjectIndex, navigateProject, touchHandlers } = useProjectNavigation({
    projectCount: projects.length,
    disabled: Boolean(preview)
  });
  const activeProject = projects[activeProjectIndex];

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
      <div className={className(styles.stage)} {...touchHandlers}>
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
