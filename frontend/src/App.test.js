import { render, screen } from '@testing-library/react';
import App from './App';

jest.mock('axios', () => ({
  post: jest.fn(),
}));

test('renders the login page', () => {
  window.history.pushState({}, 'Login', '/login');
  render(<App />);
  expect(screen.getByText(/welcome to wisepay/i)).toBeInTheDocument();
});
