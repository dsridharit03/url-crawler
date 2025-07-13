import { render, screen } from '@testing-library/react';
import ResultsTable from '../components/ResultsTable';

test('renders results table', () => {
  render(<ResultsTable />);
  expect(screen.getByText('Title')).toBeInTheDocument();
  expect(screen.getByText('HTML Version')).toBeInTheDocument();
});