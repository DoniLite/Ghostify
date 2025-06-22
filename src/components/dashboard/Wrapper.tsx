import type { PropsWithChildren } from 'react'
import Sidebar from './sidebar'

const Wrapper = ({ children }: PropsWithChildren) => {
  return (
    <div
      id="dashboardContainer"
      className="hide-dash-nav grid h-screen w-full gap-3 overflow-hidden"
    >
      <Sidebar />
      {children}
      <script
        type="module"
        src="/static/js/frontend/dashboard/index.js"
      ></script>
    </div>
  )
}

export default Wrapper
