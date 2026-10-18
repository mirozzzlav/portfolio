import { Suspense, lazy, useState } from "react";
import { ProjectActions, ProjectCard } from "src/components/ProjectCard.jsx";
import { ProjectTitleNavigation } from "src/components/ProjectTitleNavigation.jsx";
import { useProjectNavigation } from "src/hooks/useProjectNavigation.js";
import { className } from "src/styles/classNames.js";
import { useI18n } from "src/useI18n.js";
import { Description } from "src/components/lightbox/Description.jsx";

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
            images={preview.images}
            initialImageIndex={preview.imageIndex}
            isOpen
            onClose={() => setPreview(null)}
            missingDescription={content.ui.imageDescriptionNotFound}
            description={(text, props) => <Description {...props}>{text}</Description>}
          />
        </Suspense>
      ) : null}
    </>
  );
}
