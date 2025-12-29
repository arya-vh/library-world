import { Link } from 'react-router-dom';

const AdminSidebar = () => {
  return (
    <div className='admin-sidebar bg-light p-3'>
      <h4 className='mb-4'>Admin Panel</h4>
      <ul className='list-unstyled'>
        {adminpanelData.map((item) => (
          <li key={item.id} className='mb-3'>
            <Link to={item.url} className='text-decoration-none text-dark'>
              <span className='me-2'>{item.panel_icon}</span>
              {item.title}
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default AdminSidebar;