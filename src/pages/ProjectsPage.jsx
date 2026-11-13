import { Suspense, lazy, useState } from "react";
import { ProjectActions, ProjectCard } from "src/components/ProjectCard.jsx";
import { ProjectPreviewFrame } from "src/components/ProjectPreviewFrame.jsx";
import { ProjectTitleNavigation } from "src/components/ProjectTitleNavigation.jsx";
import { useProjectNavigation } from "src/hooks/useProjectNavigation.js";
import { className } from "src/styles/classNames.js";
import { useI18n } from "src/useI18n.js";

const Lightbox = lazy(() =>
  import("src/components/lightbox/Lightbox.jsx").then((module) => ({
    default: module.Lightbox
  }))
);

const styles = {
  stage: {
    position: "relative",
    width: "100%",
    minHeight: 0,
    // Clip the sliding cards without creating a scroll container for the sticky title.
    overflow: "clip",
    touchAction: "pan-y"
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
  const lightboxLabels = {
    Close: content.ui.close,
    "Image preview": content.ui.screenshotPreview,
    "Previous image": content.ui.previousImage,
    "Next image": content.ui.nextImage,
    "Image description not found": content.ui.imageDescriptionNotFound
  };

  function openPreview(images, imageIndex) {
    setPreview({ images, imageIndex, title: activeProject.title });
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
          <Lightbox
            ImageWrapper={ProjectPreviewFrame}
            translate={(text) => lightboxLabels[text] ?? text}
            theme={{
              "--lightbox-spacing": "var(--space-2)",
              "--lightbox-font-size": "var(--font-size-sm)",
              "--lightbox-button-size": "var(--control-height-md)"
            }}
            title={preview.title}
            images={preview.images}
            initialImageIndex={preview.imageIndex}
            isOpen
            onClose={() => setPreview(null)}
          />
        </Suspense>
      ) : null}
    </>
  );
}
