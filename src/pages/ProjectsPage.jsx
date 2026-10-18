import { Suspense, lazy, useState } from "react";
import { ProjectActions, ProjectCard } from "src/components/ProjectCard.jsx";
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
    // Clip the sliding cards without creating a scroll container for the sticky title.
    overflow: "clip",
    touchAction: "pan-y",
    top: "calc(var(--space-0) * -1)",
    paddingBottom: "var(--space-0)"
  },

  track: {
    display: "flex",
    // Keep the previous card outside the stage's focus-outline gutter.
    columnGap: "var(--space-0)",
    width: "100%",
    alignItems: "flex-start",
    transition: "transform var(--transition-duration-page) ease",
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
        imageIndex: Math.min(
          Math.max(currentPreview.imageIndex + direction, 0),
          currentPreview.images.length - 1
        )
      };
    });
  }

  return (
    <>
      <div className={className(styles.stage)} {...touchHandlers}>
        <ProjectTitleNavigation
          actions={
            <ProjectActions project={activeProject} onPreviewOpen={openPreview} />
          }
          hasNext={activeProjectIndex < projects.length - 1}
          hasPrevious={activeProjectIndex > 0}
          onNext={() => navigateProject(1)}
          onPrevious={() => navigateProject(-1)}
          title={activeProject.title}
          subtitle={activeProject.type}
        />
        <div
          className={className(styles.track)}
          style={{ transform: `translateX(-${activeProjectIndex * 100}%)` }}
        >
          {projects.map((project, projectIndex) => (
            <ProjectCard
              isActive={projectIndex === activeProjectIndex}
              key={project.title}
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
