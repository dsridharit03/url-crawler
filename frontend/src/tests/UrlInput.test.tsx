import { render, screen, fireEvent } from '@testing-library/react';
import UrlInput from '../components/UrlInput';

test('renders URL input form', () => {
  render(<UrlInput />);
  expect(screen.getByPlaceholderText('Enter URL')).toBeInTheDocument();
  expect(screen.getByText('Analyze')).toBeInTheDocument();
});

test('submits URL', async () => {
  render(<UrlInput />);
  const input = screen.getByPlaceholderText('Enter URL');
  const button = screen.getByText('Analyze');
  fireEvent.change(input, { target: { value: 'https://example.com' } });
  fireEvent.click(button);
  expect(input).toHaveValue('');
});