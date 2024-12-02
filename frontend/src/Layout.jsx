import { Outlet, Link } from "react-router-dom";

const Layout = () => {
  return (
    <>
      <nav>
        <ul style={{ listStyleType: 'none', paddingLeft: '0', display: 'flex' }}>
          <li style={{ marginRight: '20px' }}>
            <Link to="/">Login</Link>
          </li>
          <li style={{ marginRight: '20px' }}>
            <Link to="/volunteer">Volunteer</Link>
          </li>
        </ul>
      </nav>

      <Outlet />
    </>
  )
};

export default Layout;