// A template re-mounts on every navigation, so each dashboard page fades in.
export default function DashboardTemplate({ children }) {
  return <div className="page-enter">{children}</div>;
}
