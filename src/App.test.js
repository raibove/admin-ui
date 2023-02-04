import { render } from '@testing-library/react';
import App from './App';
import AdminUi from './pages/admin-ui/AdminUi';

jest.mock('./pages/admin-ui/AdminUi', () => jest.fn(() => <div>Mocked AdminUi</div>));

describe('App component', () => {
  it('renders the AdminUi component', () => {
    render(<App />);
    expect(AdminUi).toHaveBeenCalled();
  });
});
