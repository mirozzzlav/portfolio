// Brand paths from Simple Icons (CC0): https://github.com/simple-icons/simple-icons
import brandPaths from "./technologyIcons.json";

const outlinePaths = {
  api: "M4 8h16m-4-4 4 4-4 4M20 16H4m4-4-4 4 4 4",
  page: "M14 3H6a1 1 0 0 0-1 1v16a1 1 0 0 0 1 1h12a1 1 0 0 0 1-1V8l-5-5Zm0 0v5h5M9 12h6M9 16h6",
  tag: "M5 5v7l7 7a2 2 0 0 0 3 0l4-4a2 2 0 0 0 0-3l-7-7H6a1 1 0 0 0-1 1Zm4 3h.01"
};

export function TechnologyIcon({ name }) {
  const brandPath = Object.hasOwn(brandPaths, name) ? brandPaths[name] : null;
  const outlinePath = Object.hasOwn(outlinePaths, name)
    ? outlinePaths[name]
    : outlinePaths.tag;

  return (
    <svg viewBox="0 0 24 24" aria-hidden="true" focusable="false">
      {brandPath ? (
        <path d={brandPath} fill="currentColor" />
      ) : (
        <path
          d={outlinePath}
          fill="none"
          stroke="currentColor"
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth="1.8"
        />
      )}
    </svg>
  );
}
